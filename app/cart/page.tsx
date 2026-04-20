'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getCart, removeFromCart, updateQty, getCartTotal, CartItem } from '@/lib/cartStore';

function CartContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const estimateId = searchParams.get('estimateId');

  const refresh = () => setCart(getCart());

  useEffect(() => {
    refresh();
    window.addEventListener('cart-updated', refresh);
    return () => window.removeEventListener('cart-updated', refresh);
  }, []);

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => { removeFromCart(id); setRemovingId(null); }, 350);
  };

  const total = getCartTotal();
  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', letterSpacing: '-1.5px', marginBottom: '0.4rem' }}>
              Your <span className="text-gradient">Cart</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              {cart.length === 0 ? 'No items added yet.' : `${cart.reduce((s, c) => s + c.quantity, 0)} item(s) ready for procurement`}
            </p>
          </div>
          <Link href="/procurement">
            <button className="btn-outline" style={{ padding: '12px 24px', fontSize: '0.78rem' }}>← CONTINUE SHOPPING</button>
          </Link>
        </div>
      </motion.div>

      {/* Empty State */}
      {cart.length === 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass"
          style={{ background: 'white', borderRadius: '32px', padding: 'clamp(3rem, 10vw, 5rem)', textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(239,68,68,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2rem' }}>Browse our procurement catalog to add materials.</p>
          <Link href="/procurement">
            <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '0.9rem' }}>BROWSE MATERIALS</button>
          </Link>
        </motion.div>
      )}

      {/* Cart Items + Summary */}
      {cart.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: removingId === item.id ? 0 : 1, x: removingId === item.id ? 40 : 0, scale: removingId === item.id ? 0.95 : 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }} transition={{ delay: i * 0.04 }}
                  className="glass"
                  style={{ background: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {/* Image */}
                  <div style={{ width: '72px', height: '72px', flexShrink: 0, background: '#f8fafc', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '6px' }} />
                      : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m21 15-5-5L5 21"/></svg>
                    }
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      dangerouslySetInnerHTML={{ __html: item.name }} />
                    <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1rem' }}>
                      {item.price ? `₦${parseFloat(item.price).toLocaleString()}` : 'Price on request'}
                    </div>
                  </div>
                  {/* Qty + Remove */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-muted)' }}>−</button>
                      <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 900, fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary)' }}>+</button>
                    </div>
                    <button onClick={() => handleRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px', padding: '2px 0' }}>
                      REMOVE
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ position: 'sticky', top: '100px' }}>
            <div className="glass" style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '1.75rem' }}>Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '1rem' }}
                    dangerouslySetInnerHTML={{ __html: `${item.name} × ${item.quantity}` }} />
                  <span style={{ fontWeight: 800, whiteSpace: 'nowrap' }}>
                    {item.price ? fmt(parseFloat(item.price) * item.quantity) : '—'}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: '2px solid #f1f5f9', margin: '1.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Subtotal</span>
                <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{fmt(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Shipping</span>
                <span style={{ fontWeight: 700, color: '#22c55e', fontSize: '0.85rem' }}>Quoted on order</span>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.5px' }}>TOTAL ESTIMATE</span>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '1.3rem', letterSpacing: '-0.5px' }}>{fmt(total)}</span>
              </div>
              <Link href={`/checkout${estimateId ? `?estimateId=${estimateId}` : ''}`} style={{ textDecoration: 'none', display: 'block' }}>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '0.9rem' }}>
                  PROCEED TO CHECKOUT →
                </button>
              </Link>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1rem', fontWeight: 600, lineHeight: 1.5 }}>
                Orders are processed via WhatsApp. No online payment required.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <section style={{ padding: 'clamp(120px, 18vw, 160px) 24px 80px', flex: 1 }}>
        <Suspense fallback={<div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '4rem' }}>Loading cart...</div>}>
          <CartContent />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}
