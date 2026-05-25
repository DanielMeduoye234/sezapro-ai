'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';

const BUSINESS_WHATSAPP = '2348029872397';

const FUNDING_TYPES = [
  { id: 'equity', label: 'Equity Partnership', desc: 'Financier co-owns the project in exchange for capital' },
  { id: 'loan', label: 'Project Loan', desc: 'Repayable financing with agreed interest terms' },
  { id: 'bnpl', label: 'Material BNPL', desc: 'Spread material costs across 3–12 months' },
  { id: 'joint', label: 'Joint Venture', desc: 'Shared development with profit-sharing on completion' },
];

const FINANCIER_BENEFITS = [
  { icon: '🏗️', title: 'Vetted Projects', desc: 'Every developer on the platform is verified with site documentation.' },
  { icon: '📊', title: 'Transparent BOQs', desc: 'AI-generated Bill of Quantities shows exactly where money goes.' },
  { icon: '⚡', title: 'Fast Matching', desc: 'Get connected with developers in your preferred sector and location.' },
  { icon: '🔒', title: 'Secure Agreements', desc: 'Sezapro facilitates structured agreements between both parties.' },
];

function DeveloperForm() {
  const [form, setForm] = useState({
    name: '', phone: '', location: '', projectType: '', projectValue: '',
    fundingType: 'loan', description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fundingLabel = FUNDING_TYPES.find(f => f.id === form.fundingType)?.label || form.fundingType;
    const msg = encodeURIComponent(
      `*SEZAPRO FUNDING REQUEST*\n\n` +
      `*Developer:* ${form.name}\n` +
      `*WhatsApp:* ${form.phone}\n` +
      `*Location:* ${form.location}\n` +
      `*Project Type:* ${form.projectType}\n` +
      `*Funding Required:* ₦${form.projectValue}\n` +
      `*Funding Model:* ${fundingLabel}\n` +
      `*Project Description:*\n${form.description}\n\n` +
      `_Please connect me with suitable financiers on the Sezapro platform._`
    );
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', background: '#f8fafc',
    border: '1px solid rgba(0,0,0,0.07)', borderRadius: '14px',
    fontSize: '0.95rem', fontWeight: 600, color: '#0f172a',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.68rem', fontWeight: 900, color: 'var(--text-muted)',
    letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '0.5rem',
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.75rem' }}>Request Submitted!</h3>
        <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '1.5rem' }}>
          Sezapro will review your project and match you with suitable financiers within 48 hours.
        </p>
        <button onClick={() => setSubmitted(false)} style={{ background: 'transparent', border: '2px solid rgba(0,0,0,0.1)', borderRadius: '100px', padding: '10px 24px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '1px' }}>
          SUBMIT ANOTHER
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Full Name</label>
          <input required style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Okafor" />
        </div>
        <div>
          <label style={labelStyle}>WhatsApp Number</label>
          <input required style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234..." />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Project Location</label>
          <input required style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Lagos, Nigeria" />
        </div>
        <div>
          <label style={labelStyle}>Project Type</label>
          <input required style={inputStyle} value={form.projectType} onChange={e => setForm({ ...form, projectType: e.target.value })} placeholder="e.g. Duplex, Estate, Commercial" />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Funding Required (₦)</label>
        <input required style={inputStyle} value={form.projectValue} onChange={e => setForm({ ...form, projectValue: e.target.value })} placeholder="e.g. 15,000,000" />
      </div>
      <div>
        <label style={labelStyle}>Preferred Funding Model</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {FUNDING_TYPES.map(ft => (
            <div
              key={ft.id}
              onClick={() => setForm({ ...form, fundingType: ft.id })}
              style={{
                padding: '1rem', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s',
                border: `2px solid ${form.fundingType === ft.id ? 'var(--primary)' : '#f1f5f9'}`,
                background: form.fundingType === ft.id ? '#fff1f2' : '#f8fafc',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: '0.2rem' }}>{ft.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{ft.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label style={labelStyle}>Project Description</label>
        <textarea
          required rows={3} style={{ ...inputStyle, resize: 'vertical' }}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Briefly describe your project, timeline, and what you need funding for..."
        />
      </div>
      <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '0.95rem', marginTop: '0.5rem' }}>
        SUBMIT FUNDING REQUEST
      </button>
    </form>
  );
}

function FinancierForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', budget: '', sectors: '', preferredModel: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `*SEZAPRO FINANCIER REGISTRATION*\n\n` +
      `*Name:* ${form.name}\n` +
      `*WhatsApp:* ${form.phone}\n` +
      `*Email:* ${form.email}\n` +
      `*Budget Range:* ₦${form.budget}\n` +
      `*Preferred Sectors:* ${form.sectors}\n` +
      `*Preferred Funding Model:* ${form.preferredModel}\n\n` +
      `_I would like to be listed as a financier on the Sezapro platform._`
    );
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px',
    fontSize: '0.95rem', fontWeight: 600, color: 'white',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.68rem', fontWeight: 900, color: 'rgba(255,255,255,0.5)',
    letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '0.5rem',
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem', color: 'white' }}>You're Registered!</h3>
        <p style={{ opacity: 0.7, fontWeight: 500 }}>Our team will reach out to verify your details and match you with developers.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Full Name / Company</label>
          <input required style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bello Capital Ltd" />
        </div>
        <div>
          <label style={labelStyle}>WhatsApp Number</label>
          <input required style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234..." />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input required type="email" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="finance@company.com" />
        </div>
        <div>
          <label style={labelStyle}>Investment Budget Range</label>
          <input required style={inputStyle} value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="e.g. 5M – 50M" />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Preferred Sectors</label>
        <input style={inputStyle} value={form.sectors} onChange={e => setForm({ ...form, sectors: e.target.value })} placeholder="e.g. Residential, Commercial, Estate" />
      </div>
      <div>
        <label style={labelStyle}>Preferred Funding Model</label>
        <input style={inputStyle} value={form.preferredModel} onChange={e => setForm({ ...form, preferredModel: e.target.value })} placeholder="e.g. Equity, Loan, Joint Venture" />
      </div>
      <button type="submit" style={{ width: '100%', padding: '18px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 900, cursor: 'pointer', marginTop: '0.5rem', letterSpacing: '1px' }}>
        REGISTER AS FINANCIER
      </button>
    </form>
  );
}

export default function FundingPage() {
  const [activeTab, setActiveTab] = useState<'developer' | 'financier'>('developer');

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: 'clamp(120px, 18vw, 160px) 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60%', background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: -1 }} />
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', padding: '8px 18px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '1.5rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)' }} />
              SEZAPRO CONNECT
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '-2px', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.05 }}>
              Developers Meet<br /><span className="text-gradient">Financiers.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Sezapro Connect bridges construction developers with capital. Submit your project or register as a financier — we handle the matching.
            </p>

            {/* Tab Toggle */}
            <div style={{ display: 'inline-flex', background: 'white', borderRadius: '100px', padding: '6px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <button
                onClick={() => setActiveTab('developer')}
                style={{ padding: '12px 32px', borderRadius: '100px', border: 'none', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s', letterSpacing: '0.5px', background: activeTab === 'developer' ? 'var(--primary)' : 'transparent', color: activeTab === 'developer' ? 'white' : 'var(--text-muted)', boxShadow: activeTab === 'developer' ? '0 8px 20px rgba(79,70,229,0.25)' : 'none' }}
              >
                I Need Funding
              </button>
              <button
                onClick={() => setActiveTab('financier')}
                style={{ padding: '12px 32px', borderRadius: '100px', border: 'none', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s', letterSpacing: '0.5px', background: activeTab === 'financier' ? '#0f172a' : 'transparent', color: activeTab === 'financier' ? 'white' : 'var(--text-muted)', boxShadow: activeTab === 'financier' ? '0 8px 20px rgba(0,0,0,0.2)' : 'none' }}
              >
                I Want to Invest
              </button>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '5rem' }}>
            {[
              { step: '01', title: 'Submit Your Request', desc: 'Developers submit their project details and funding needs.' },
              { step: '02', title: 'Sezapro Reviews', desc: 'Our team verifies the project BOQ, site, and developer profile.' },
              { step: '03', title: 'Matched & Connected', desc: 'We introduce verified financiers within your target sector.' },
              { step: '04', title: 'Deal Structured', desc: 'Both parties agree terms. Sezapro facilitates the agreement.' },
            ].map(s => (
              <div key={s.step} style={{ background: 'white', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'rgba(79,70,229,0.15)', marginBottom: '1rem', fontFamily: 'var(--font-outfit)' }}>{s.step}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', fontWeight: 500, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Main Content — Two Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

            {/* Form Column */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{
                background: activeTab === 'financier' ? '#0f172a' : 'white',
                borderRadius: '36px', padding: 'clamp(2rem, 5vw, 3rem)',
                border: activeTab === 'financier' ? 'none' : '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
                transition: 'background 0.4s',
              }}>
              {activeTab === 'developer' ? (
                <>
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Request Funding</h2>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>Tell us about your project. Sezapro will match you with eligible financiers.</p>
                  </div>
                  <DeveloperForm />
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.5rem', color: 'white' }}>Become a Financier</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.9rem' }}>Register your investment profile and get matched with vetted construction projects.</p>
                  </div>
                  <FinancierForm />
                </>
              )}
            </motion.div>

            {/* Info Column */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Benefits for Financiers */}
              {activeTab === 'financier' && (
                <>
                  <div style={{ background: 'white', borderRadius: '28px', padding: '2rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem' }}>Why Invest via Sezapro?</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {FINANCIER_BENEFITS.map(b => (
                        <div key={b.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{b.icon}</div>
                          <div>
                            <div style={{ fontWeight: 800, marginBottom: '0.2rem', fontSize: '0.95rem' }}>{b.title}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{b.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(79,70,229,0.06)', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(79,70,229,0.12)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px', marginBottom: '0.5rem' }}>MINIMUM INVESTMENT</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>₦5,000,000</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.25rem' }}>No upper limit. All sectors considered.</div>
                  </div>
                </>
              )}

              {/* Stats for Developers */}
              {activeTab === 'developer' && (
                <>
                  <div style={{ background: '#0f172a', borderRadius: '28px', padding: '2rem', color: 'white' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', opacity: 0.9 }}>Funding Eligibility Checklist</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                      {[
                        'AI-generated BOQ from Sezapro platform',
                        'Valid land title or building permit',
                        'Government-issued identification',
                        'Bank statement (6 months minimum)',
                        'Site photos and architectural drawings',
                      ].map(item => (
                        <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.88rem', fontWeight: 600 }}>
                          <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                          </div>
                          <span style={{ opacity: 0.8 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'white', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '1rem', textTransform: 'uppercase' }}>Don't have a BOQ yet?</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500, marginBottom: '1.25rem', lineHeight: 1.6 }}>
                      Generate an AI-powered Bill of Quantities for your project in under 60 seconds — for free.
                    </p>
                    <Link href="/">
                      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.82rem' }}>
                        GENERATE BOQ NOW
                      </button>
                    </Link>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                      { label: 'Avg. Approval Time', value: '48 hrs' },
                      { label: 'Financiers On Platform', value: '40+' },
                      { label: 'Max. Funding', value: '₦500M' },
                      { label: 'Funding Models', value: '4 Types' },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: 'white', borderRadius: '18px', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.04)', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
