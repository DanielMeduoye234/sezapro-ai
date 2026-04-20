'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LocationTracker from './LocationTracker';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '160px 24px 100px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap-reverse',
        gap: '4rem',
        alignItems: 'center',
      }}>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           style={{ flex: '1 1 300px', minWidth: 0 }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '6px 14px',
              fontSize: '0.65rem',
              fontWeight: 900,
              display: 'inline-block',
              marginBottom: '1.5rem',
              letterSpacing: '2px',
              borderRadius: '4px'
            }}>BUILT FOR PROFESSIONALS</motion.div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '1.5rem', letterSpacing: '-2px' }}>
            Precision <br />
            <span className="text-gradient">Estimations.</span><br />
            <span style={{ color: 'var(--primary)' }}>Smarter Build.</span>
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '550px', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 500 }}>
            Estimate your building materials in seconds with AI. Minimize waste and maximize profit with industrial-grade accuracy.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onStart} style={{ padding: '18px 36px', fontSize: '0.8rem' }}>
              START CALCULATION
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <button className="btn-outline" onClick={() => setIsHowItWorksOpen(true)} style={{ padding: '18px 36px', fontSize: '0.8rem' }}>HOW IT WORKS</button>
            
            <div style={{ width: '100%', marginTop: '1rem' }}>
              <Link href="/bnpl" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: 'rgba(239,68,68,0.1)', color: 'var(--primary)', borderRadius: '50%', fontSize: '0.6rem' }}>💳</span>
                Need financing? Spreading costs over 12 months. <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Learn more →</span>
              </Link>
            </div>
          </div>

          <div style={{ marginTop: '4rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
             <div style={{ flex: '1 1 auto' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>98%</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Accuracy</div>
             </div>
             <div style={{ flex: '1 1 auto' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>2k+</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Projects</div>
             </div>
             <div style={{ flex: '1 1 auto' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>$50M+</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Optimized</div>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'relative', flex: '1 1 300px', minWidth: 0, width: '100%' }}
        >
          <div style={{ position: 'relative', marginBottom: '1.5rem', zIndex: 1, width: '100%' }}>
            <LocationTracker />
          </div>

          <div className="glass" style={{
            padding: 'clamp(1.5rem, 5vw, 2.5rem)',
            borderRadius: 'clamp(20px, 5vw, 32px)',
            position: 'relative',
            zIndex: 1,
            background: 'white',
          }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PROJECT CANVAS</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>ID: SEZA-2024</span>
             </div>
             
             <div style={{ height: '6px', background: 'rgba(0,0,0,0.03)', borderRadius: '3px', marginBottom: '1rem', width: '90%' }}></div>
             <div style={{ height: '6px', background: 'rgba(0,0,0,0.03)', borderRadius: '3px', marginBottom: '2.5rem', width: '70%' }}></div>
             
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1 1 120px', padding: '1.5rem', borderRadius: '16px', background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 700 }}>CONCRETE VOLUME</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>142.5 m³</div>
                </div>
                <div style={{ flex: '1 1 120px', padding: '1.5rem', borderRadius: '16px', background: 'var(--primary)', boxShadow: '0 10px 20px rgba(255,0,0,0.15)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.75rem', fontWeight: 700 }}>STEEL GRADE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>TMT 500</div>
                </div>
             </div>
          </div>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.03) 0%, transparent 70%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}></div>
        </motion.div>
      </div>

      {/* How it works modal */}
      <AnimatePresence>
        {isHowItWorksOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={() => setIsHowItWorksOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass"
              style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '32px',
                maxWidth: '600px',
                width: '100%',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setIsHowItWorksOpen(false)}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: 'var(--text-muted)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              </div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>How It Works</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#fff1f2', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Define Project Parameters</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Input your building type, dimensions, and desired finish level into our intuitive engineering protocol.</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#fff1f2', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>AI Calculation Engine</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Our engine instantly processes standard specification rates against your location's real-time material costs.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#fff1f2', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Review & Action</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Receive a comprehensive Bill of Quantities (BOQ) with actionable AI insights, ready for procurement or financing.</p>
                  </div>
                </div>
              </div>

              <button className="btn-primary" onClick={() => { setIsHowItWorksOpen(false); onStart(); }} style={{ width: '100%', justifyContent: 'center', marginTop: '3rem', padding: '18px' }}>
                START ESTIMATING NOW
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
