'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login Flow
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username, password: formData.password })
        });
        const data = await res.json();
        
        if (data.success) {
           window.location.href = '/'; // Redirect to calculator
        } else {
           setError(data.message || 'Invalid username or password');
        }
      } else {
        // Registration Flow
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, username: formData.username, password: formData.password })
        });
        const data = await res.json();
        
        if (data.success) {
           setError('');
           alert("Account created successfully! Please sign in.");
           setIsLogin(true); // Switch to login view
           setFormData({ ...formData, password: '' });
        } else {
           setError(data.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('A network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Simple Header */}
      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
           <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-outfit)', letterSpacing: '-1px' }}>
             SEZA<span style={{ color: 'var(--primary)' }}>PRO</span>
           </div>
        </Link>
      </header>

      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ width: '100%', maxWidth: '480px', background: 'white', padding: '3rem 2rem', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
        >
           <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.5rem', textAlign: 'center' }}>
             {isLogin ? 'Welcome Back' : 'Create Account'}
           </h1>
           <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem', fontWeight: 500 }}>
             {isLogin ? 'Sign in to access the material calculator' : 'Register to start your next construction project'}
           </p>

           <AnimatePresence mode="wait">
             {error && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', marginBottom: '1.5rem' }}
               >
                 {error}
               </motion.div>
             )}
           </AnimatePresence>

           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             {!isLogin && (
               <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>EMAIL ADDRESS</label>
                 <input 
                   type="email" 
                   required
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: '#f8fafc', fontSize: '1rem' }} 
                 />
               </div>
             )}
             
             <div>
               <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>{isLogin ? 'USERNAME OR EMAIL' : 'USERNAME'}</label>
               <input 
                 type="text" 
                 required
                 value={formData.username}
                 onChange={e => setFormData({...formData, username: e.target.value})}
                 style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: '#f8fafc', fontSize: '1rem' }} 
               />
             </div>
             
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>PASSWORD</label>
                  {isLogin && <a href="#" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>FORGOT?</a>}
               </div>
               <input 
                 type="password" 
                 required
                 value={formData.password}
                 onChange={e => setFormData({...formData, password: e.target.value})}
                 style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: '#f8fafc', fontSize: '1rem' }} 
               />
             </div>

             <button 
               type="submit" 
               className="btn-primary" 
               disabled={loading}
               style={{ width: '100%', justifyContent: 'center', padding: '18px', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
             >
               {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
             </button>
           </form>

           <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
             <span style={{ color: 'var(--text-muted)' }}>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>{' '}
             <button 
               onClick={() => { setIsLogin(!isLogin); setError(''); }} 
               style={{ background: 'none', border: 'none', color: '#0f172a', fontWeight: 800, cursor: 'pointer', padding: 0 }}
             >
               {isLogin ? 'SIGN UP' : 'SIGN IN'}
             </button>
           </div>
        </motion.div>
      </section>
    </main>
  );
}
