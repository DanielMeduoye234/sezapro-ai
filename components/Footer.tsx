'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid rgba(0,0,0,0.06)',
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      marginTop: 'auto',
    }}>
      <div className="container" style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2.5rem 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#0f172a' }}>
            SEZA<span style={{ color: 'var(--primary)' }}>PRO</span>
          </span>
        </Link>

        {/* Links */}
        <div style={{
          display: 'flex',
          gap: 'clamp(1rem, 4vw, 2.5rem)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {[
            { label: 'Estimates', href: '/estimates' },
            { label: 'Procurement', href: '/procurement' },
            { label: 'Inventory', href: '/inventory' },
            { label: 'Projects', href: '/projects' },
            { label: 'Contact', href: '/contact' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              transition: 'color 0.2s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {l.label.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: '40px', height: '2px', background: 'var(--border)', borderRadius: '99px' }} />

        {/* Bottom */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.73rem', fontWeight: 600 }}>
            © {year} SEZA ENGINEERING. ALL RIGHTS RESERVED.
          </p>
          <span style={{ color: 'var(--border)', fontSize: '0.7rem' }}>·</span>
          <Link href="/terms" style={{ color: 'var(--text-muted)', fontSize: '0.73rem', fontWeight: 600, textDecoration: 'none' }}>TERMS</Link>
          <Link href="/privacy" style={{ color: 'var(--text-muted)', fontSize: '0.73rem', fontWeight: 600, textDecoration: 'none' }}>PRIVACY</Link>
        </div>
      </div>
    </footer>
  );
}
