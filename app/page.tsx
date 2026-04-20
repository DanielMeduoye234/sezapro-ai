'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { calculateMaterials } from '@/utils/calculatorEngine';
import { saveEstimate } from '@/lib/estimateStorage';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const [view, setView] = useState<'hero' | 'form' | 'results'>('hero');
  const [calculationData, setCalculationData] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [savedEstimateId, setSavedEstimateId] = useState<string | null>(null);

  const handleStart = async () => {
    setIsCheckingAuth(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        setView('form');
      } else {
        router.push('/auth');
      }
    } catch (error) {
      router.push('/auth');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleCalculate = async (formData: any) => {
    setView('results');
    setAiInsights(null); // Clear previous insights to show loading state

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Calculation failed');
      
      const results = await response.json();
      setCalculationData(results);
      setAiInsights(results); // The new API returns everything in one object

      // Auto-save estimate for the logged-in user
      try {
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const user = await meRes.json();
          const userEmail = user.data?.user_email || user.email || 'guest';
          const buildingTypeMap: Record<string, string> = {
            bungalow: 'Bungalow', duplex: 'Duplex', commercial: 'Commercial',
            industrial: 'Industrial', flat: 'Block of Flats', apartment: 'Apartment Block',
            warehouse: 'Warehouse', school: 'School / Church', hospital: 'Hospital / Clinic',
          };
          const saved = saveEstimate({
            userEmail,
            title: `${formData.bedrooms || ''}-Bed ${buildingTypeMap[formData.buildingType] || formData.buildingType} — ${formData.city || formData.country}`,
            type: buildingTypeMap[formData.buildingType] || formData.buildingType,
            sqm: formData.sqm,
            finish: formData.finish,
            location: formData.city ? `${formData.city}, ${formData.country}` : formData.country,
            total: results.grandTotal,
            breakdown: results.breakdown,
            aiInsights: results, // Save the full research result
          });
          setSavedEstimateId(saved.id);
        }
      } catch (e) {
        console.error('Could not auto-save estimate', e);
      }
    } catch (error) {
      console.error("Failed to generate global BOQ", error);
    }
  };

  const handleRecalculate = () => {
    setAiInsights(null);
    setSavedEstimateId(null);
    setView('form');
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <Nav />
      
      {view === 'hero' && <Hero onStart={handleStart} />}
      
      {view === 'form' && (
        <section style={{ padding: '120px 0' }}>
          <CalculatorForm onCalculate={handleCalculate} />
        </section>
      )}
      
      {view === 'results' && (
        <section style={{ padding: '120px 0' }}>
          <ResultsDisplay 
            data={calculationData} 
            aiInsights={aiInsights}
            onRecalculate={handleRecalculate}
          />
        </section>
      )}

      <Footer />
    </main>
  );
}
