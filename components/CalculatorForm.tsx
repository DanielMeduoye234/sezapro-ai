'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECT_TYPES } from '@/utils/calculatorEngine';

// All world countries
const ALL_COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
  "Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman",
  "Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen",
  "Zambia","Zimbabwe"
];

interface CalculatorFormProps {
  onCalculate: (data: any) => void;
}

const STEPS = ['COUNTRY', 'PROJECT', 'DIMENSIONS', 'FINISH', 'REVIEW'];

export default function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    buildingType: 'bungalow',
    bedrooms: 3,
    sqm: 150,
    finish: 'standard',
  });
  const [countrySearch, setCountrySearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = countrySearch.length > 0
    ? ALL_COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectCountry = (c: string) => {
    setFormData({ ...formData, country: c });
    setCountrySearch(c);
    setShowDropdown(false);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const canProceed = () => {
    if (step === 1) return formData.country.length > 0;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const projectType = PROJECT_TYPES.find(p => p.id === formData.buildingType);

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#f8fafc', border: '2px solid rgba(0,0,0,0.05)',
    padding: '1.1rem 1.4rem', borderRadius: '16px', color: 'var(--text)',
    fontSize: '1rem', fontWeight: 600, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.25s',
  };

  return (
    <div className="container" style={{ maxWidth: '860px', padding: '40px 24px' }}>
      <motion.div layout className="glass form-card">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 3rem)' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '3px', marginBottom: '0.75rem' }}>
            GLOBAL CONSTRUCTION AI — REAL-TIME RESEARCH
          </motion.div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '0.75rem', letterSpacing: '-1.5px' }}>
            Material Calculator
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
            AI researches live construction costs for any country in the world
          </p>
        </div>

        {/* Step Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'clamp(2rem, 5vw, 3.5rem)', position: 'relative', padding: '0 10px' }}>
          <div style={{ position: 'absolute', top: '20px', left: '30px', right: '30px', height: '2px', background: 'rgba(0,0,0,0.04)' }} />
          <div style={{ position: 'absolute', top: '20px', left: '30px', height: '2px', background: 'var(--primary)', transition: 'width 0.4s ease', width: `calc(${(step - 1) * 25}% - ${(step - 1) * 4}px)` }} />
          {STEPS.map((label, idx) => {
            const s = idx + 1;
            const done = step > s;
            const active = step === s;
            return (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
                <motion.div animate={{ background: step >= s ? 'var(--primary)' : 'white', borderColor: step >= s ? 'var(--primary)' : 'rgba(0,0,0,0.08)', color: step >= s ? 'white' : 'var(--text-muted)', scale: active ? 1.15 : 1 }}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, boxShadow: step >= s ? '0 6px 14px rgba(239,68,68,0.2)' : 'none' }}>
                  {done ? '✓' : s}
                </motion.div>
                <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.8px', color: step >= s ? 'var(--primary)' : '#cbd5e1' }}>{label}</span>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">

            {/* ── STEP 1  COUNTRY ── */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}>
                <h3 style={{ marginBottom: '1.75rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 900 }}>01</span>
                  SELECT COUNTRY
                </h3>

                {/* Country search */}
                <div style={{ marginBottom: '1.5rem', position: 'relative' }} ref={dropdownRef}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '0.6rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Country / Territory
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🌍</span>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Type any country name…"
                      value={countrySearch}
                      onChange={e => { setCountrySearch(e.target.value); setShowDropdown(true); if (!ALL_COUNTRIES.includes(e.target.value)) setFormData({ ...formData, country: '' }); }}
                      onFocus={() => setShowDropdown(true)}
                      style={{ ...inputStyle, paddingLeft: '3rem', borderColor: formData.country ? 'var(--primary)' : 'rgba(0,0,0,0.05)' }}
                    />
                    {formData.country && (
                      <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#22c55e', fontSize: '1rem' }}>✓</span>
                    )}
                  </div>

                  <AnimatePresence>
                    {showDropdown && filteredCountries.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)', zIndex: 50, overflow: 'hidden' }}>
                        {filteredCountries.map((c, i) => (
                          <div key={c} onMouseDown={() => selectCountry(c)}
                            style={{ padding: '12px 16px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', background: 'white', borderBottom: i < filteredCountries.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                            {c}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* City */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '0.6rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    City / Region <span style={{ color: '#94a3b8', fontWeight: 600 }}>(optional — improves accuracy)</span>
                  </label>
                  <input type="text" placeholder={`e.g. Lagos, Nairobi, London…`} value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)')} />
                </div>

                {formData.country && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '1.25rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔍</span>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                      Gemini AI will research live construction costs for <strong>{formData.country}</strong> and calculate your BOQ in the local currency.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── STEP 2  PROJECT TYPE ── */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}>
                <h3 style={{ marginBottom: '1.75rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 900 }}>02</span>
                  PROJECT TYPE
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem' }}>
                  {PROJECT_TYPES.map(pt => (
                    <motion.div key={pt.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setFormData({ ...formData, buildingType: pt.id })}
                      style={{ padding: '1.4rem 1.1rem', borderRadius: '20px', border: `2px solid ${formData.buildingType === pt.id ? 'var(--primary)' : '#f1f5f9'}`, background: formData.buildingType === pt.id ? '#fff1f2' : '#f8fafc', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{pt.icon}</div>
                      <div style={{ fontWeight: 900, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{pt.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.3 }}>{pt.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STEP 3  DIMENSIONS ── */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}>
                <h3 style={{ marginBottom: '1.75rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 900 }}>03</span>
                  DIMENSIONS
                </h3>

                <div style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>TOTAL FLOOR AREA (SQM)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <input type="range" min="30" max="5000" step="10" value={formData.sqm}
                      onChange={e => setFormData({ ...formData, sqm: parseInt(e.target.value) })}
                      style={{ flex: 1, accentColor: 'var(--primary)', height: '6px' }} />
                    <div style={{ minWidth: '110px', textAlign: 'right' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-1px' }}>{formData.sqm}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}> sqm</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.5rem' }}>
                    <span>30 sqm</span><span>5,000 sqm</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>BEDROOMS</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.6rem' }}>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <motion.button key={num} type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, bedrooms: num })}
                        style={{ padding: '1.1rem 0', borderRadius: '14px', background: formData.bedrooms === num ? 'var(--primary)' : '#f8fafc', border: `2px solid ${formData.bedrooms === num ? 'var(--primary)' : '#f1f5f9'}`, color: formData.bedrooms === num ? 'white' : 'var(--text)', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: formData.bedrooms === num ? '0 6px 14px rgba(239,68,68,0.2)' : 'none', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                        {num}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4  FINISH ── */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}>
                <h3 style={{ marginBottom: '1.75rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 900 }}>04</span>
                  FINISH LEVEL
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '1.1rem' }}>
                  {[
                    { id: 'basic',    icon: '🪨', label: 'BASIC',    desc: 'Essential materials only. Budget-focused.', badge: '−25%' },
                    { id: 'standard', icon: '⭐', label: 'STANDARD', desc: 'Quality mid-range. Most popular specification.', badge: 'Base' },
                    { id: 'luxury',   icon: '💎', label: 'LUXURY',   desc: 'Premium high-end materials and finishes.', badge: '+60%' },
                  ].map(f => (
                    <motion.div key={f.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, finish: f.id })}
                      style={{ padding: '1.75rem 1.25rem', borderRadius: '22px', border: `3px solid ${formData.finish === f.id ? 'var(--primary)' : '#f1f5f9'}`, background: formData.finish === f.id ? '#fff1f2' : '#f8fafc', cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{f.icon}</div>
                      <div style={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '1.5px', marginBottom: '0.4rem' }}>{f.label}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4, marginBottom: '0.75rem' }}>{f.desc}</div>
                      <div style={{ background: formData.finish === f.id ? 'var(--primary)' : '#e2e8f0', color: formData.finish === f.id ? 'white' : 'var(--text-muted)', padding: '3px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 900, display: 'inline-block' }}>{f.badge}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STEP 5  REVIEW ── */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                  style={{ width: '80px', height: '80px', background: 'rgba(239,68,68,0.06)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <span style={{ fontSize: '2.4rem' }}>{projectType?.icon || '🏗️'}</span>
                </motion.div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.75rem', letterSpacing: '-1px' }}>Ready to Research</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 500, fontSize: '0.95rem' }}>
                  Gemini AI will look up live construction costs for <strong>{formData.country}</strong> and compute your BOQ in local currency.
                </p>
                <div style={{ background: '#f8fafc', borderRadius: '18px', padding: '1.5rem', textAlign: 'left', border: '1px solid #f1f5f9' }}>
                  {[
                    { label: 'Country', value: formData.country },
                    { label: 'City',    value: formData.city || '—' },
                    { label: 'Project', value: `${formData.bedrooms}-Bed ${projectType?.label || formData.buildingType}` },
                    { label: 'Area',    value: `${formData.sqm} sqm` },
                    { label: 'Finish',  value: formData.finish.toUpperCase() },
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: i < arr.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>{row.label}</span>
                      <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1.25rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: '14px', padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>⚡</span>
                  <p style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600, margin: 0 }}>
                    AI will research real-time market prices — this may take 10–20 seconds.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'clamp(2rem, 5vw, 3.5rem)', gap: '1rem' }}>
            {step > 1 ? (
              <motion.button whileHover={{ x: -4 }} type="button" onClick={prevStep} className="btn-outline" style={{ background: 'transparent', boxShadow: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                BACK
              </motion.button>
            ) : <div />}
            {step < 5 ? (
              <button type="button" onClick={nextStep} disabled={!canProceed()} className="btn-primary"
                style={{ padding: '16px 40px', opacity: canProceed() ? 1 : 0.45, cursor: canProceed() ? 'pointer' : 'not-allowed' }}>
                NEXT
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            ) : (
              <button type="submit" className="btn-primary" style={{ padding: '16px 40px', flex: 1, maxWidth: '300px', justifyContent: 'center' }}>
                RESEARCH & GENERATE
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
