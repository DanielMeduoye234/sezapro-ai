'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getCartCount } from '@/lib/cartStore';

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        setIsAuthenticated(res.ok);
      } catch (e) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
    
    // Initial cart count
    setCartCount(getCartCount());
    
    // Listener for cart updates
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        className="glass" 
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '50%',
          width: '90%',
          maxWidth: '1200px',
          padding: '0.8rem 2rem',
          borderRadius: '100px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-outfit)', letterSpacing: '-1px' }}>
              SEZA<span style={{ color: 'var(--primary)' }}>PRO</span>
            </div>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="desktop-nav-items" style={{ gap: '1.25rem', alignItems: 'center' }}>
            <Link href="/projects" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text)', opacity: 0.8, textDecoration: 'none', letterSpacing: '1px' }}>PROJECTS</Link>
            <Link href="/inventory" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text)', opacity: 0.8, textDecoration: 'none', letterSpacing: '1px' }}>INVENTORY</Link>
            <Link href="/estimates" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text)', opacity: 0.8, textDecoration: 'none', letterSpacing: '1px' }}>ESTIMATES</Link>
            <Link href="/procurement" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none', letterSpacing: '1px' }}>PROCUREMENT</Link>
            <Link href="/bnpl" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text)', opacity: 0.8, textDecoration: 'none', letterSpacing: '1px' }}>BNPL</Link>
            <Link href="/contact" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text)', opacity: 0.8, textDecoration: 'none', letterSpacing: '1px' }}>CONTACT</Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Cart Button with Notification Badge */}
          <Link href="/cart" style={{ textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: cartCount > 0 ? 'rgba(239,68,68,0.1)' : 'transparent', border: cartCount > 0 ? '2px solid rgba(239,68,68,0.2)' : '1px solid transparent', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cartCount > 0 ? 'var(--primary)' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--primary)', color: 'white', fontSize: '0.6rem', fontWeight: 900, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)', border: '2px solid white' }}>
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Desktop Action Buttons */}
          <div className="desktop-nav-items" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            {/* Auth Dropdown / Button */}
            {isAuthenticated === null ? (
               <div style={{ width: '80px', height: '32px', background: 'rgba(0,0,0,0.05)', borderRadius: '100px', animation: 'pulse 1.5s infinite' }}></div>
            ) : isAuthenticated ? (
              <Link href="/dashboard">
                <button style={{ background: '#0f172a', color: 'white', border: 'none', borderRadius: '100px', padding: '8px 16px', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  DASHBOARD
                </button>
              </Link>
            ) : (
              <Link href="/auth">
                <button style={{ background: 'transparent', color: '#0f172a', border: '2px solid rgba(15,23,42,0.1)', borderRadius: '100px', padding: '6px 16px', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '1px' }}>
                  SIGN IN
                </button>
              </Link>
            )}

            <Link href="/">
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.65rem' }}>NEW CALCULATION</button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn" style={{ cursor: 'pointer', padding: '0.5rem' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '5.5rem',
              left: '5%',
              width: '90%',
              background: 'white',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              textAlign: 'center'
            }}
          >
            {[
               { name: 'PROJECTS', path: '/projects' },
               { name: 'INVENTORY', path: '/inventory' },
               { name: 'ESTIMATES', path: '/estimates' },
            ].map(link => (
              <Link 
                key={link.name} 
                href={link.path} 
                onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', textDecoration: 'none' }}
              >
                {link.name}
              </Link>
            ))}
            
            <Link 
              href="/procurement" 
              onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}
            >
              PROCUREMENT
            </Link>
            <Link 
              href="/contact" 
              onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', textDecoration: 'none' }}
            >
              CONTACT
            </Link>
            
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0.5rem 0' }}></div>
            
            {isAuthenticated ? (
              <Link 
                href="/dashboard" 
                onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                DASHBOARD
              </Link>
            ) : (
              <Link 
                href="/auth" 
                onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', textDecoration: 'none' }}
              >
                SIGN IN / REGISTER
              </Link>
            )}

            <Link href="/" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: '1rem' }}>NEW CALCULATION</button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
