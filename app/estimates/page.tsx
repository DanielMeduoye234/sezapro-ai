'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { getEstimatesForUser, deleteEstimate, SavedEstimate } from '@/lib/estimateStorage';
import { getAllOrders, deleteOrder, ProcurementOrder } from '@/lib/orderStorage';
import Footer from '@/components/Footer';

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<SavedEstimate[]>([]);
  const [orders, setOrders] = useState<ProcurementOrder[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatCur = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const email = data.user?.user_email || data.user?.email || null;
          setUserEmail(email);
          if (email) {
            setEstimates(getEstimatesForUser(email));
            setOrders(getAllOrders().filter(o => o.userEmail === email));
          }
        }
      } catch (e) {
        console.error('Failed to load user', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteEstimate(id);
      if (userEmail) setEstimates(getEstimatesForUser(userEmail));
      setDeletingId(null);
    }, 400);
  };

  const handleDeleteOrder = (id: string) => {
    deleteOrder(id);
    if (userEmail) setOrders(getAllOrders().filter(o => o.userEmail === userEmail));
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <section style={{ padding: 'clamp(120px, 20vw, 160px) 24px 100px', flex: 1 }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>
                  My <span className="text-gradient">Estimates</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>
                  {userEmail ? `Showing saved calculations for ${userEmail}` : 'Your project estimates and BOQs.'}
                </p>
              </div>
              <Link href="/">
                <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.8rem' }}>
                  + NEW ESTIMATE
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '120px', background: 'white', borderRadius: '24px', animation: 'pulse 1.5s infinite', opacity: 1 - i * 0.2 }} />
              ))}
            </div>
          )}

          {/* Not Logged In */}
          {!isLoading && !userEmail && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass"
              style={{ background: 'white', borderRadius: '32px', padding: 'clamp(2rem, 8vw, 4rem)', border: '1px solid rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(239,68,68,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>Sign In to View Estimates</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 500 }}>Your saved calculations are securely linked to your account.</p>
              <Link href="/auth">
                <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '0.9rem' }}>SIGN IN NOW</button>
              </Link>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && userEmail && estimates.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass"
              style={{ background: 'white', borderRadius: '32px', padding: 'clamp(2rem, 8vw, 4rem)', border: '1px solid rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(239,68,68,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>No Estimates Yet</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 500 }}>
                Run your first calculation and it will automatically appear here.
              </p>
              <Link href="/">
                <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '0.9rem' }}>START CALCULATING</button>
              </Link>
            </motion.div>
          )}

          {/* Estimates List */}
          {!isLoading && estimates.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <AnimatePresence>
                {estimates.map((est, i) => (
                  <motion.div
                    key={est.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: deletingId === est.id ? 0 : 1, x: deletingId === est.id ? 50 : 0, scale: deletingId === est.id ? 0.95 : 1 }}
                    transition={{ delay: i * 0.05 }}
                    exit={{ opacity: 0, x: 50, scale: 0.95 }}
                    className="glass estimate-card"
                    onClick={() => setExpandedId(expandedId === est.id ? null : est.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="est-left">
                      <div className="est-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                        </svg>
                      </div>
                      <div className="est-info">
                        <div className="est-title-wrap">
                          <h3>{est.title}</h3>
                          <span className="est-badge">{est.id}</span>
                        </div>
                        <div className="est-meta">
                          <span>{est.type} • {est.sqm} sqm • {est.finish}</span>
                          <span className="dot hidden-mobile"></span>
                          <span className="est-date">{est.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="est-right">
                      <div className="est-total-text">
                        <div className="label">Total Estimate</div>
                        <div className="value">{formatCur(est.total)}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          className="btn-outline est-btn"
                          title="View Details"
                          onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === est.id ? null : est.id); }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {expandedId === est.id
                              ? <polyline points="18 15 12 9 6 15"></polyline>
                              : <polyline points="6 9 12 15 18 9"></polyline>}
                          </svg>
                        </button>
                        <button
                          className="est-btn"
                          title="Delete"
                          onClick={(e) => { e.stopPropagation(); handleDelete(est.id); }}
                          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            <path d="M10 11v6M14 11v6"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Expandable BOQ preview */}
                    <AnimatePresence>
                      {expandedId === est.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ width: '100%', overflow: 'hidden' }}
                          onClick={e => e.stopPropagation()}
                        >
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1rem', overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                                <thead>
                                  <tr>
                                    {['Material', 'Qty', 'Unit Price', 'Total'].map(h => (
                                      <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: h === 'Total' ? 'right' : 'left' }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.values(est.breakdown).map((item: any) => (
                                    <tr key={item.name} style={{ borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</td>
                                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.quantity.toLocaleString()} {item.unit}</td>
                                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatCur(item.unitPrice)}</td>
                                      <td style={{ padding: '0.75rem 1rem', fontWeight: 900, color: 'var(--primary)', textAlign: 'right', fontSize: '0.9rem' }}>{formatCur(item.total)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                              <Link href="/" style={{ flex: 1, textDecoration: 'none' }}>
                                <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.8rem', minWidth: '140px' }}>
                                  RECALCULATE
                                </button>
                              </Link>
                              <Link href={`/procurement?estimateId=${est.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.8rem', minWidth: '140px' }}>
                                  ORDER MATERIALS
                                </button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Orders Section */}
          {!isLoading && userEmail && orders.length > 0 && (
            <div style={{ marginTop: '5rem', marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px' }}>Procurement <span className="text-gradient">Tracking</span></h2>
                <div style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)' }}>{orders.length} TOTAL</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence>
                  {orders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass"
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div style={{ width: '44px', height: '44px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><path d="M16 2L12 6L8 2"/><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{order.id}</h3>
                              <span style={{ fontSize: '0.6rem', fontWeight: 900, background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '100px' }}>{order.status.toUpperCase()}</span>
                              {order.estimateId && <span style={{ fontSize: '0.6rem', fontWeight: 900, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '100px' }}>LINKED TO {order.estimateId}</span>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{order.items.length} materials • {order.date}</div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{formatCur(order.total)}</div>
                          </div>
                          <button
                            title="Delete"
                            onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                            style={{ background: 'transparent', border: 'none', color: 'rgba(239,68,68,0.3)', cursor: 'pointer', padding: '4px' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg>
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedOrderId === order.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(0,0,0,0.05)' }}>
                              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem' }}>
                                {order.items.map(item => (
                                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.85rem' }}>
                                    <div style={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: `${item.name} × ${item.quantity}` }} />
                                    <div style={{ fontWeight: 900 }}>{formatCur(parseFloat(item.price || '0') * item.quantity)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .estimate-card {
          background: white;
          border-radius: 24px;
          padding: clamp(1.2rem, 5vw, 2rem);
          border: 1px solid rgba(0,0,0,0.03);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }
        .estimate-card:hover { transform: translateX(4px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .est-left { display: flex; gap: 1.5rem; align-items: center; flex: 1; min-width: 0; }
        .est-info { flex: 1; min-width: 0; }
        .est-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(239, 68, 68, 0.05); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .est-title-wrap { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
        .est-title-wrap h3 { font-size: 1.15rem; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
        .est-badge { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); background: #f1f5f9; padding: 4px 10px; border-radius: 100px; letter-spacing: 1px; white-space: nowrap; }
        .est-meta { font-size: 0.82rem; color: var(--text-muted); font-weight: 600; display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
        .dot { width: 4px; height: 4px; background: var(--border); border-radius: 50%; flex-shrink: 0; }
        .est-right { display: flex; align-items: center; gap: 1.5rem; flex-shrink: 0; }
        .est-total-text { text-align: right; }
        .est-total-text .label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 1px; }
        .est-total-text .value { font-size: 1.3rem; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
        .est-btn { width: 48px !important; height: 48px !important; min-width: 48px !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; border-radius: 50% !important; flex-shrink: 0 !important; }

        @media (max-width: 640px) {
          .estimate-card { flex-direction: column; align-items: stretch; }
          .est-left { gap: 1rem; }
          .est-title-wrap h3 { max-width: 200px; font-size: 1rem; }
          .est-right { justify-content: space-between; background: #f8fafc; padding: 1rem; border-radius: 16px; }
          .est-total-text { text-align: left; }
          .est-total-text .value { font-size: 1.1rem; }
          .hidden-mobile { display: none; }
        }
      `}} />

      <Footer />
    </main>
  );
}
