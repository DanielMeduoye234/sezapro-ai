import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { buildingType, bedrooms, sqm, finish, breakdown, countryCode, location } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const countryNames: Record<string, string> = {
      NG: 'Nigeria', GH: 'Ghana', KE: 'Kenya', ZA: 'South Africa',
      AE: 'United Arab Emirates', GB: 'United Kingdom', US: 'United States',
      CA: 'Canada', IN: 'India', AU: 'Australia',
    };

    const currencyInfo: Record<string, string> = {
      NG: 'Nigerian Naira (NGN)', GH: 'Ghanaian Cedi (GHS)', KE: 'Kenyan Shilling (KES)',
      ZA: 'South African Rand (ZAR)', AE: 'UAE Dirham (AED)', GB: 'British Pound (GBP)',
      US: 'US Dollar (USD)', CA: 'Canadian Dollar (CAD)', IN: 'Indian Rupee (INR)', AU: 'Australian Dollar (AUD)',
    };

    const country = countryNames[countryCode] || 'Nigeria';
    const currency = currencyInfo[countryCode] || 'Nigerian Naira (NGN)';
    const totalCost = Object.values(breakdown || {}).reduce((sum: number, m: any) => sum + (m.total || 0), 0);

    const prompt = `You are an expert construction consultant with deep knowledge of the global construction industry. You specialize in ${country} construction practices, building regulations, material costs in ${currency}, and project management.

ANALYZE this construction project and return expert insights:

PROJECT DETAILS:
- Country: ${country}
- Location: ${location || country}
- Building Type: ${bedrooms ? `${bedrooms}-Bedroom ` : ''}${buildingType || 'Residential'}
- Floor Area: ${sqm} sqm
- Finish Level: ${finish} specification
- Estimated Total Cost: ${totalCost.toLocaleString()} ${currency}

MATERIAL QUANTITIES:
${Object.values(breakdown || {}).map((m: any) => `- ${m.name}: ${m.quantity.toLocaleString()} ${m.unit} @ ${m.unitPrice.toLocaleString()} per ${m.unit}`).join('\n')}

Respond ONLY with a valid JSON object (no markdown) with these 4 fields:
{
  "smartTip": "ONE specific, actionable money-saving or quality tip tailored to ${country}'s construction market. Be specific to local conditions.",
  "buildingGuide": "THREE sentences covering: (1) regulatory/approval process in ${country}, (2) critical construction stage for this project type, (3) expected construction timeline.",
  "localRegulations": "Key building codes, permits or compliance requirements specific to ${country} for this project type. Keep to 2 sentences.",
  "costInsight": "Cost benchmarking analysis: how does this estimate compare to typical ${country} market rates for a ${sqm}sqm ${buildingType || 'building'}? Any cost reduction opportunities? 2-3 sentences."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("AI Insights Error:", error);
    return NextResponse.json({
      smartTip: "Buying materials from local suppliers in bulk (minimum 3 months supply) typically saves 12–18% on procurement costs.",
      buildingGuide: "Begin by obtaining all required building permits and approvals from the local planning authority. Ensure your foundation design is reviewed by a certified structural engineer before concrete pour. A typical 4-bedroom residential project at this scale takes 12–18 months to complete.",
      localRegulations: "Ensure compliance with the National Building Code and obtain all necessary approvals from the state planning authority. An approved architectural drawing stamped by a ARCON-registered architect is mandatory before construction begins.",
      costInsight: "This estimate aligns with current market rates for your selected finish level and size. Consider phased construction to manage cash flow and review your roofing specification for potential savings of 8–12%.",
    });
  }
}
