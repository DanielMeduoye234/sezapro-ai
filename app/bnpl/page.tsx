'use client';

import React from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Step = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
  <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
    style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
    <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 8px 24px rgba(239,68,68,0.2)', flexShrink: 0 }}>
      {num}
    </div>
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.4rem', letterSpacing: '-0.4px' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 500, fontSize: '0.95rem' }}>{desc}</p>
    </div>
  </motion.div>
);

const BNPLForm = () => {
  const [form, setForm] = React.useState({ name: '', phone: '', location: '', value: '', incomeType: 'Salary Earner' });
  
  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `*SEZAPRO BNPL APPLICATION*\n\n` +
      `*Name:* ${form.name}\n` +
      `*WhatsApp:* ${form.phone}\n` +
      `*Site Location:* ${form.location}\n` +
      `*Est. Material Value:* ${form.value}\n` +
      `*Income Source:* ${form.incomeType}\n\n` +
      `_I am interested in applying for a Sezapro Flexible Payment plan for my construction project. Please let me know the next steps for vetting._`
    );
    window.open(`https://wa.me/2348029872397?text=${msg}`, '_blank');
  };

  const inputStyle = {
    width: '100%', padding: '16px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.07)',
    borderRadius: '16px', fontSize: '1rem', fontWeight: 600, color: '#0f172a',
    outline: 'none', marginBottom: '1.25rem', boxSizing: 'border-box' as const
  };

  return (
    <div id="application-form" className="glass" style={{ background: 'white', padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: '40px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 40px 100px rgba(0,0,0,0.03)' }}>
      <h3 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.5rem' }}>Start Application</h3>
      <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2.5rem' }}>No fee required to apply. Vetting starts after submission.</p>
      
      <form onSubmit={handleSubmission}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
            <input required style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Okafor" />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>WhatsApp No.</label>
            <input required style={inputStyle} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+234..." />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Project Location</label>
            <input required style={inputStyle} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Lagos, Nigeria" />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Estimated Project Value</label>
            <input required style={inputStyle} value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="e.g. 5,000,000" />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '20px', justifyContent: 'center', fontSize: '1rem', marginTop: '1rem' }}>
          SUBMIT APPLICATION VIA WHATSAPP
        </button>
      </form>
    </div>
  );
};

export default function BNPLPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      {/* Hero Section */}
      <section style={{ padding: 'clamp(120px, 18vw, 160px) 24px 80px', flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60%', background: 'radial-gradient(circle at center, rgba(239,68,68,0.05) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: -1 }} />
        
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.06)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '1.5rem' }}>
              SEZAPRO FLEXIBLE PAYMENTS
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', letterSpacing: '-2px', marginBottom: '1.25rem', fontWeight: 900 }}>
              Build Now, <span className="text-gradient">Pay Later.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.6, maxWidth: '650px', margin: '0 auto' }}>
              Spreading construction costs shouldn't be complicated. Learn how our vetting-to-approval system works.
            </p>
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
               <button onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary" style={{ padding: '16px 36px' }}>START YOUR APPLICATION</button>
               <Link href="/procurement">
                 <button className="btn-outline" style={{ padding: '16px 36px' }}>BROWSE MATERIALS</button>
               </Link>
            </div>
          </motion.div>

          {/* Road to Approval & Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start', marginBottom: '6rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '2.5rem' }}>The Road to Approval</h2>
              <Step num="01" title="Request & Quote" desc="Generate your Bill of Quantities (BOQ) and select a 'Financing Request' during checkout. No online payment — everything starts with an intent." />
              <Step num="02" title="Vetting & Verification" desc="Sezapro reviews your identity, income, and conducts a physical verification of the construction site to assess eligibility." />
              <Step num="03" title="Flexible Delivery" desc="Once approved, materials are delivered on a scheduled basis, and payments are spread across 3, 6, or 12 months." />
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="glass" style={{ background: '#0f172a', padding: '2.5rem', borderRadius: '40px', color: 'white', boxShadow: '0 32px 80px rgba(0,0,0,0.15)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>Vetting Criteria</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>Not all applications are approved. To increase your chances, ensure you have:</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  'Verified Government Identification',
                  'Proof of construction site ownership',
                  'Verified architectural/structural drawings',
                  'Income history (Bank Statement)',
                  'Active presence in the Sezapro platform'
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.92rem', fontWeight: 600 }}>
                    <div style={{ width: '18px', height: '18px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, fontStyle: 'italic', lineHeight: 1.5 }}>* Sezapro acts as a financing facilitator. Defaulting on payments may lead to service suspension and site legal action.</p>
              </div>
            </motion.div>
          </div>

          {/* The New Application Form Section */}
          <BNPLForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
