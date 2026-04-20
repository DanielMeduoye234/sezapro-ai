'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ResultProps {
  data: any;
  aiInsights: { 
    smartTip: string; 
    buildingGuide: string; 
    localRegulations?: string; 
    costInsight?: string;
    currency?: string;
    currencySymbol?: string;
    locale?: string;
    countryNote?: string;
  } | null;
  onRecalculate: () => void;
}

export default function ResultsDisplay({ data, aiInsights, onRecalculate }: ResultProps) {
  const fmt = (val: number) => {
    const symbol = aiInsights?.currencySymbol || data?.currencySymbol || '$';
    const curr = aiInsights?.currency || data?.currency || 'USD';
    const loc = aiInsights?.locale || data?.locale || 'en-US';
    
    try {
      return new Intl.NumberFormat(loc, { 
        style: 'currency', 
        currency: curr, 
        maximumFractionDigits: 0 
      }).format(val);
    } catch {
      return `${symbol}${val.toLocaleString()}`;
    }
  };

  if (!data) return null;

  const aiCards = aiInsights ? [
    { icon: '💡', label: 'SMART TIP', text: aiInsights.smartTip, bg: 'white' },
    { icon: '🗺️', label: 'BUILDING GUIDE', text: aiInsights.buildingGuide, bg: '#f8fafc' },
    ...(aiInsights.localRegulations ? [{ icon: '📋', label: 'LOCAL REGULATIONS', text: aiInsights.localRegulations, bg: 'white' }] : []),
    ...(aiInsights.costInsight ? [{ icon: '📊', label: 'COST ANALYSIS', text: aiInsights.costInsight, bg: '#f8fafc' }] : []),
  ] : [];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="container" style={{ padding: '40px 24px 100px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(34,197,94,0.08)', color: '#166534', padding: '8px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '0.5px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
          CALCULATION VERIFIED
        </motion.div>
        <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', marginBottom: '0.75rem', letterSpacing: '-2px' }}>Structural Report</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>
          {data.sqm} sqm • {data.finish} Finish • {data.buildingType || 'Residential'} • {data.location || data.countryCode}
        </p>
        <button onClick={() => window.print()} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          DOWNLOAD PDF
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        {/* Total Cost Card */}
        <motion.div whileHover={{ y: -4 }} className="glass"
          style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: 'clamp(24px, 5vw, 40px)', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6, marginBottom: '1rem', letterSpacing: '2px' }}>ESTIMATED TOTAL COST</div>
          <div style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)', fontWeight: 900, letterSpacing: '-3px', marginBottom: '0.5rem' }}>
            {fmt(data.grandTotal)}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.5, fontWeight: 600, marginBottom: '2.5rem' }}>
            All figures in {aiInsights?.currency || data?.currency || 'Local Currency'} · {data.finish} specification
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/procurement" style={{ textDecoration: 'none', flex: '1 1 180px' }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'white', color: '#0f172a', border: 'none', padding: '16px' }}>
                ORDER MATERIALS
              </button>
            </Link>
            <button className="btn-outline" onClick={onRecalculate} style={{ flex: '1 1 180px', justifyContent: 'center', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '16px' }}>
              RECALCULATE
            </button>
          </div>
          <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.15 }} />
        </motion.div>

        {/* Flexible Payment Plans (BNPL) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'white', borderRadius: '32px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem' }}>💳</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>Flexible Payment Plans</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, margin: '0 0 1rem' }}>
              Spread the cost of your materials over time with Sezapro BNPL.
            </p>
            <Link href="/bnpl" style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              HOW IT WORKS →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Request 3M', months: 3, markup: 0 },
              { label: 'Request 6M', months: 6, markup: 0.05 },
              { label: 'Request 12M', months: 12, markup: 0.10 },
            ].map(plan => {
              const monthly = Math.round((data.grandTotal * (1 + plan.markup)) / plan.months);
              return (
                <div key={plan.label} style={{ flex: 1, minWidth: '130px', background: '#f8fafc', padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px', marginBottom: '0.4rem' }}>{plan.label.toUpperCase()}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{fmt(monthly)}<span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>/mo</span></div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* BOQ Table */}
        <div className="glass" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', borderRadius: 'clamp(24px, 5vw, 40px)', background: 'white', border: '1px solid rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: 'clamp(1.3rem, 4vw, 1.75rem)', letterSpacing: '-1px' }}>Bill of Quantities</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '480px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.04)' }}>
                  {['Material', 'Quantity', 'Unit Price', 'Total'].map((h, i) => (
                    <th key={h} style={{ padding: '1rem 0.5rem', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: i === 3 ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.values(data.breakdown).map((item: any, i: number) => (
                  <motion.tr key={item.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td style={{ padding: '1.4rem 0.5rem', fontWeight: 700, fontSize: '1rem' }}>{item.name}</td>
                    <td style={{ padding: '1.4rem 0.5rem', fontWeight: 600, color: 'var(--text)' }}>
                      {item.quantity.toLocaleString()} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>{item.unit}</span>
                    </td>
                    <td style={{ padding: '1.4rem 0.5rem', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>{fmt(item.unitPrice)}</td>
                    <td style={{ padding: '1.4rem 0.5rem', fontWeight: 900, color: 'var(--primary)', textAlign: 'right', fontSize: '1rem' }}>{fmt(item.total)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Intelligence Panel */}
        <AnimatePresence mode="wait">
          {aiInsights ? (
            <motion.div key="insights" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass"
              style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', borderRadius: 'clamp(24px, 5vw, 40px)', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--primary)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(255,0,0,0.15)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.5px' }}>AI Intelligence</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Analysis for {data.location || data.countryCode}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {aiCards.map((card, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ padding: '1.5rem', borderRadius: '18px', background: card.bg, border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{card.icon}</span>
                      <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px' }}>{card.label}</div>
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text)', fontWeight: 500, margin: 0 }}>{card.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="glass" style={{ padding: '3rem', borderRadius: '32px', textAlign: 'center', background: '#f8fafc' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '1rem' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%', animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite` }} />
                ))}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Analyzing global construction data…</div>
              <style dangerouslySetInnerHTML={{ __html: `@keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:1} 40%{transform:translateY(-10px);opacity:0.5} }` }} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
