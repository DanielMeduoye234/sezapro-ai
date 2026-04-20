'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '@/components/Nav';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate send (replace with real email API if needed)
    await new Promise(r => setTimeout(r, 1800));
    setStatus('sent');
  };

  const contactInfo = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      ),
      label: 'PHONE',
      value: '+234 803 000 0000',
      sub: 'Mon–Fri, 9AM–6PM WAT',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      ),
      label: 'EMAIL',
      value: 'hello@sezapro.com',
      sub: 'Typical reply within 24hrs',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      label: 'ADDRESS',
      value: 'Victoria Island, Lagos',
      sub: 'Nigeria',
    },
  ];

  const subjects = [
    'General Inquiry',
    'Procurement Support',
    'Material Pricing',
    'Technical Issue',
    'Partnership',
    'Other',
  ];

  return (
    <main style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: 'clamp(120px, 20vw, 180px) 24px 80px' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 8vw, 5rem)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.06)', color: 'var(--primary)', padding: '8px 20px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '1.5rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
              WE'RE HERE TO HELP
            </div>
            <h1 style={{ fontSize: 'clamp(2.8rem, 8vw, 5rem)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '1.5rem' }}>
              Get In <span className="text-gradient">Touch</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 500, maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
              Whether you have a project inquiry, need material pricing support or just want to say hello — we respond fast.
            </p>
          </motion.div>

          {/* Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2rem, 5vw, 3rem)', alignItems: 'start' }}>

            {/* Left — Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Brand card */}
              <div style={{ background: '#0f172a', borderRadius: 'clamp(20px, 5vw, 32px)', padding: 'clamp(1.5rem, 5vw, 2.5rem)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.5rem' }}>
                  SEZA<span style={{ color: 'var(--primary)' }}>PRO</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6, marginBottom: '2rem' }}>
                  Nigeria's most intelligent construction cost estimation platform. Powered by live market data and AI.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {['Instagram', 'X (Twitter)', 'LinkedIn'].map(s => (
                    <a key={s} href="#" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', letterSpacing: '1px', background: 'rgba(255,255,255,0.05)', padding: '8px 14px', borderRadius: '100px', transition: 'all 0.2s ease' }}>
                      {s.toUpperCase()}
                    </a>
                  ))}
                </div>
                <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '200px', height: '200px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15 }} />
              </div>

              {/* Contact Info Cards */}
              {contactInfo.map((info, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                  className="glass"
                  style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1.5px', marginBottom: '0.3rem' }}>{info.label}</div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.15rem' }}>{info.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{info.sub}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right — Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="glass"
              style={{ background: 'white', borderRadius: 'clamp(20px, 5vw, 32px)', padding: 'clamp(1.5rem, 5vw, 3rem)', border: '1px solid rgba(0,0,0,0.03)' }}>

              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(34,197,94,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2rem', lineHeight: 1.6 }}>
                      Thanks for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="btn-outline" style={{ padding: '14px 32px', fontSize: '0.8rem' }}>
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Send a Message</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {[
                        { name: 'name', label: 'Full Name', placeholder: 'John Okafor', type: 'text' },
                        { name: 'email', label: 'Email Address', placeholder: 'john@company.com', type: 'email' },
                      ].map(field => (
                        <div key={field.name}>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{field.label}</label>
                          <input
                            required
                            type={field.type}
                            name={field.name}
                            value={(formData as any)[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            style={{ width: '100%', padding: '14px 16px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s ease' }}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Phone (Optional)</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+234 800 000 0000"
                          style={{ width: '100%', padding: '14px 16px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Subject</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          style={{ width: '100%', padding: '14px 16px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', appearance: 'none' }}
                        >
                          <option value="">Select a topic…</option>
                          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Message</label>
                      <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project or inquiry…"
                        rows={5}
                        style={{ width: '100%', padding: '14px 16px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6 }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      style={{
                        width: '100%',
                        padding: '18px',
                        background: status === 'sending' ? 'rgba(239,68,68,0.5)' : 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '0.9rem',
                        fontWeight: 900,
                        letterSpacing: '1.5px',
                        cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        boxShadow: '0 16px 40px rgba(239,68,68,0.25)',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {status === 'sending' ? (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                            <line x1="12" y1="2" x2="12" y2="6"></line>
                            <line x1="12" y1="18" x2="12" y2="22"></line>
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                            <line x1="2" y1="12" x2="6" y2="12"></line>
                            <line x1="18" y1="12" x2="22" y2="12"></line>
                          </svg>
                          SENDING…
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                          SEND MESSAGE
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus { border-color: var(--primary) !important; background: white !important; }
      ` }} />

      <Footer />
    </main>
  );
}
