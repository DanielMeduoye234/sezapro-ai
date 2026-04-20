import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  let body: any = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { country, city, buildingType, bedrooms, sqm, finish } = body;
  const finishMultipliers: Record<string, number> = { basic: 0.75, standard: 1.0, luxury: 1.6 };
  const mult = finishMultipliers[finish] || 1.0;
  const sqmNum = Number(sqm) || 100;

  try {
    // Use Gemini 2.0 Flash with Google Search grounding for real-time data
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      tools: [{ googleSearch: {} } as any],
    });

    const prompt = `You are a world-class construction cost estimator. Use your knowledge and any available information to research CURRENT (2025-2026) construction material prices in ${country}${city ? `, specifically ${city}` : ""}.

CRITICAL RULES:
1. **LOCAL CURRENCY ONLY**: You MUST identify and use the official local currency of ${country}. NEVER default to NGN (Naira) unless the country is Nigeria. 
2. **REAL-TIME RESEARCH**: Research or estimate realistic 2025-2026 material unit prices in that LOCAL currency for ${country}.
3. **ACCURACY**: If ${country} uses a high-inflation currency, ensure the prices reflect current 2025-2026 market realities.
4. **FORMAT**: Your response MUST be a single valid JSON object.

PROJECT:
- Country: ${country}
- City/Region: ${city || "major urban area"}
- Building Type: ${buildingType || "residential"}
- Bedrooms: ${bedrooms || "N/A"}
- Floor Area: ${sqmNum} sqm
- Finish Level: ${finish} (cost multiplier: ${mult}x)

YOUR TASK:
1. Identify the official local currency of ${country} (symbol + ISO code).
2. Research or estimate realistic material unit prices in that LOCAL currency.
3. Calculate quantities for a ${sqmNum}sqm ${buildingType || "building"} at ${finish} finish.
4. Adapt material types to local construction norms (e.g. clay bricks vs hollow blocks).

CALCULATION GUIDE:
- Cement/Binder: ~${Math.ceil(sqmNum * 3.2 * mult)} units
- Masonry: ~${Math.ceil(sqmNum * 50 * mult)} units  
- Steel/Reinforcement: ~${(sqmNum * 0.025 * mult).toFixed(2)} tons
- Roofing: ~${Math.ceil(sqmNum * 0.95 * mult)} sqm

Respond with ONLY a valid JSON object (absolutely no markdown, no extra text):
{
  "currency": "<ISO 4217 code>",
  "currencySymbol": "<currency symbol>",
  "locale": "<BCP47 locale string>",
  "countryNote": "<1 sentence about construction context in ${country}>",
  "breakdown": {
    "cement":     { "name": "<local name>", "quantity": <number>, "unit": "<unit>", "unitPrice": <number>, "total": <number> },
    "masonry":    { "name": "<local name>", "quantity": <number>, "unit": "<unit>", "unitPrice": <number>, "total": <number> },
    "steel":      { "name": "<local name>", "quantity": <number>, "unit": "Tons",   "unitPrice": <number>, "total": <number> },
    "sand":       { "name": "<local name>", "quantity": <number>, "unit": "<unit>", "unitPrice": <number>, "total": <number> },
    "aggregate":  { "name": "<local name>", "quantity": <number>, "unit": "<unit>", "unitPrice": <number>, "total": <number> },
    "roofing":    { "name": "<local name>", "quantity": <number>, "unit": "sqm",    "unitPrice": <number>, "total": <number> },
    "flooring":   { "name": "<local name>", "quantity": <number>, "unit": "sqm",    "unitPrice": <number>, "total": <number> },
    "paint":      { "name": "Paint & Coating", "quantity": <number>, "unit": "<unit>", "unitPrice": <number>, "total": <number> },
    "doors":      { "name": "Doors & Windows",   "quantity": <number>, "unit": "Units", "unitPrice": <number>, "total": <number> },
    "electrical": { "name": "Electrical Works",  "quantity": 1, "unit": "Lump Sum", "unitPrice": <number>, "total": <number> },
    "plumbing":   { "name": "Plumbing Works",    "quantity": 1, "unit": "Lump Sum", "unitPrice": <number>, "total": <number> }
  },
  "grandTotal": <number>,
  "costPerSqm": <number>,
  "smartTip": "<one specific tip for ${country}>",
  "buildingGuide": "<3 sentences guide>",
  "localRegulations": "<2 sentences guide>",
  "costInsight": "<2-3 sentences cost benchmarking>"
}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Robustly extract JSON from the response
    let jsonStr = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const start = jsonStr.indexOf("{");
    const end = jsonStr.lastIndexOf("}");
    if (start !== -1 && end !== -1) jsonStr = jsonStr.substring(start, end + 1);

    const parsed = JSON.parse(jsonStr);

    // Recompute totals to ensure accuracy
    const totals = Object.values(parsed.breakdown as Record<string, any>);
    parsed.grandTotal = Math.round(totals.reduce((s, i) => s + (Number(i.total) || 0), 0));
    parsed.costPerSqm = Math.round(parsed.grandTotal / sqmNum);

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("AI Calculate Error:", error);
    return NextResponse.json(buildFallback(sqmNum, mult, Number(bedrooms) || 3, body?.country || ""));
  }
}

function buildFallback(sqmNum: number, mult: number, bedrooms: number, country: string) {
  // Mapping for common countries to ensure better default fallbacks
  const c = country.toLowerCase();
  let currency = "USD", symbol = "$", locale = "en-US", rate = 1;

  if (c.includes("nigeria")) { currency = "NGN"; symbol = "₦"; locale = "en-NG"; rate = 1600; }
  else if (c.includes("ghana")) { currency = "GHS"; symbol = "GH₵"; locale = "en-GH"; rate = 16; }
  else if (c.includes("kenya")) { currency = "KES"; symbol = "KSh"; locale = "en-KE"; rate = 130; }
  else if (c.includes("south africa")) { currency = "ZAR"; symbol = "R"; locale = "en-ZA"; rate = 19; }
  else if (c.includes("united kingdom") || c.includes("uk")) { currency = "GBP"; symbol = "£"; locale = "en-GB"; rate = 0.8; }
  else if (c.includes("canada")) { currency = "CAD"; symbol = "CA$"; locale = "en-CA"; rate = 1.35; }
  else if (c.includes("australia")) { currency = "AUD"; symbol = "A$"; locale = "en-AU"; rate = 1.5; }
  else if (c.includes("india")) { currency = "INR"; symbol = "₹"; locale = "en-IN"; rate = 83; }
  else if (c.includes("united arab emirates") || c.includes("uae")) { currency = "AED"; symbol = "د.إ"; locale = "en-AE"; rate = 3.67; }

  const baselineUSD = {
    cement: 15, masonry: 4, steel: 900, sand: 55, aggregate: 70, roofing: 45,
    flooring: 55, paint: 50, doors: 600, electrical: 25 * sqmNum, plumbing: 20 * sqmNum
  };

  const bd: Record<string, any> = {
    cement:     { name: "Cement / Concrete",    quantity: Math.ceil(sqmNum * 3.2 * mult),  unit: "Bags",     unitPrice: baselineUSD.cement * rate,     total: Math.ceil(sqmNum * 3.2 * mult) * baselineUSD.cement * rate },
    masonry:    { name: "Masonry Units",         quantity: Math.ceil(sqmNum * 50 * mult),   unit: "Units",    unitPrice: baselineUSD.masonry * rate,    total: Math.ceil(sqmNum * 50 * mult) * baselineUSD.masonry * rate },
    steel:      { name: "Reinforcement Steel",   quantity: +(sqmNum * 0.025 * mult).toFixed(2), unit: "Tons", unitPrice: baselineUSD.steel * rate,      total: Math.round(sqmNum * 0.025 * mult * baselineUSD.steel * rate) },
    sand:       { name: "Sand",                  quantity: Math.ceil(sqmNum * 0.05 * mult), unit: "m³",       unitPrice: baselineUSD.sand * rate,       total: Math.ceil(sqmNum * 0.05 * mult) * baselineUSD.sand * rate },
    aggregate:  { name: "Coarse Aggregate",      quantity: Math.ceil(sqmNum * 0.04 * mult), unit: "m³",       unitPrice: baselineUSD.aggregate * rate,  total: Math.ceil(sqmNum * 0.04 * mult) * baselineUSD.aggregate * rate },
    roofing:    { name: "Roofing Material",      quantity: Math.ceil(sqmNum * 0.95 * mult), unit: "sqm",      unitPrice: baselineUSD.roofing * rate,    total: Math.ceil(sqmNum * 0.95 * mult) * baselineUSD.roofing * rate },
    flooring:   { name: "Floor Finish",          quantity: Math.ceil(sqmNum * 1.15 * mult), unit: "sqm",      unitPrice: baselineUSD.flooring * rate,   total: Math.ceil(sqmNum * 1.15 * mult) * baselineUSD.flooring * rate },
    paint:      { name: "Paint & Coating",       quantity: Math.ceil(sqmNum * 0.3 * mult),  unit: "Tins",     unitPrice: baselineUSD.paint * rate,      total: Math.ceil(sqmNum * 0.3 * mult) * baselineUSD.paint * rate },
    doors:      { name: "Doors & Windows",       quantity: Math.max(4, bedrooms * 2),       unit: "Units",    unitPrice: baselineUSD.doors * rate,      total: Math.max(4, bedrooms * 2) * baselineUSD.doors * rate },
    electrical: { name: "Electrical Works",      quantity: 1,                               unit: "Lump Sum", unitPrice: baselineUSD.electrical * mult * rate, total: Math.round(baselineUSD.electrical * mult * rate) },
    plumbing:   { name: "Plumbing Works",        quantity: 1,                               unit: "Lump Sum", unitPrice: baselineUSD.plumbing * mult * rate,   total: Math.round(baselineUSD.plumbing * mult * rate) },
  };

  const grandTotal = Object.values(bd).reduce((s, i) => s + i.total, 0);

  return {
    currency, currencySymbol: symbol, locale,
    countryNote: `Estimate generated using localized market baselines for ${country || "selected region"}.`,
    breakdown: bd,
    grandTotal: Math.round(grandTotal),
    costPerSqm: Math.round(grandTotal / sqmNum),
    smartTip: "Compare at least three local material suppliers to identify market-leading prices and bulk discount opportunities.",
    buildingGuide: "Secure formal planning and architectural approvals from your local authority before breaking ground. Engage a licensed engineer to oversee structural components such as the foundation and reinforcement steel. A typical project of this scale has a 12–18 month delivery timeline.",
    localRegulations: "Zoning laws and seismic requirements (where applicable) vary by region. Consult your local municipal office for specific building permit requirements.",
    costInsight: `This estimate for ${country || "your region"} accounts for primary material costs. Labor and logistical overheads can add 20–40% to the total project budget.`
  };
}
