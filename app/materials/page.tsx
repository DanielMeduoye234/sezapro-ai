'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getAllOrders } from '@/lib/orderStorage';
import {
  getMaterialTracking,
  updateMaterialStatus,
  syncMaterialsFromOrders,
  TrackedMaterial,
  MaterialStatus,
} from '@/lib/materialTracking';

const STATUS_ORDER: MaterialStatus[] = ['Ordered', 'Delivered', 'Installed'];

const STATUS_COLORS: Record<MaterialStatus, { bg: string; color: string; border: string }> = {
  Ordered:   { bg: 'rgba(234,179,8,0.08)',  color: '#b45309', border: 'rgba(234,179,8,0.25)' },
  Delivered: { bg: 'rgba(59,130,246,0.08)', color: '#1d4ed8', border: 'rgba(59,130,246,0.25)' },
  Installed: { bg: 'rgba(34,197,94,0.08)',  color: '#15803d', border: 'rgba(34,197,94,0.25)' },
};

function nextStatus(current: MaterialStatus): MaterialStatus {
  const idx = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 1)];
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<TrackedMaterial[]>([]);
  const [filter, setFilter] = useState<MaterialStatus | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const fmt = (n: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const email = data.user?.user_email || data.user?.email || null;
          setUserEmail(email);
        }
      } catch { /* unauthenticated — still show all local materials */ }

      const orders = getAllOrders();
      const synced = syncMaterialsFromOrders(orders);
      setMaterials(synced);
      setIsLoading(false);
    };
    load();
  }, []);

  const advance = (id: string, current: MaterialStatus) => {
    if (current === 'Installed') return;
    const next = nextStatus(current);
    updateMaterialStatus(id, next);
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, status: next } : m));
  };

  const displayed = filter === 'All' ? materials : materials.filter(m => m.status === filter);

  const totals = {
    all: materials.length,
    ordered: materials.filter(m => m.status === 'Ordered').length,
    delivered: materials.filter(m => m.status === 'Delivered').length,
    installed: materials.filter(m => m.status === 'Installed').length,
  };

  const totalValue = materials.reduce((s, m) => s + parseFloat(m.price || '0') * m.quantity, 0);

  const downloadCSV = () => {
    const rows = [
      ['Order ID', 'Material', 'Quantity', 'Unit Price (NGN)', 'Total (NGN)', 'Order Date', 'Status'],
      ...materials.map(m => [
        m.orderId,
        m.name.replace(/<[^>]+>/g, '').replace(/,/g, ' '),
        m.quantity,
        parseFloat(m.price || '0').toFixed(2),
        (parseFloat(m.price || '0') * m.quantity).toFixed(2),
        m.orderDate,
        m.status,
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sezapro-materials.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <section style={{ padding: 'clamp(120px, 18vw, 160px) 24px 100px', flex: 1 }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '1rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)' }} />
                  MATERIAL TRACKER
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>
                  My <span className="text-gradient">Materials</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
                  Track every material from order through delivery to installation.
                </p>
              </div>
              {materials.length > 0 && (
                <button
                  onClick={downloadCSV}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '14px', padding: '12px 22px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '1px', flexShrink: 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  DOWNLOAD CSV
                </button>
              )}
            </div>
          </motion.div>

          {/* Summary Cards */}
          {!isLoading && materials.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Total Items', value: totals.all, color: '#0f172a' },
                { label: 'Ordered', value: totals.ordered, color: '#b45309' },
                { label: 'Delivered', value: totals.delivered, color: '#1d4ed8' },
                { label: 'Installed', value: totals.installed, color: '#15803d' },
                { label: 'Total Value', value: fmt(totalValue), color: 'var(--primary)', wide: true },
              ].map(card => (
                <div key={card.label} style={{ background: 'white', borderRadius: '20px', padding: '1.25rem 1.5rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>{card.label}</div>
                  <div style={{ fontSize: card.wide ? '1.1rem' : '1.75rem', fontWeight: 900, color: card.color }}>{card.value}</div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Filter Tabs */}
          {!isLoading && materials.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {(['All', 'Ordered', 'Delivered', 'Installed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 18px', borderRadius: '100px', border: 'none', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                    background: filter === f ? 'var(--primary)' : 'white',
                    color: filter === f ? 'white' : 'var(--text-muted)',
                    boxShadow: filter === f ? '0 8px 20px rgba(79,70,229,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f} {f !== 'All' && `(${totals[f.toLowerCase() as keyof typeof totals]})`}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '90px', background: 'white', borderRadius: '20px', animation: 'pulse 1.5s infinite', opacity: 1 - i * 0.2 }} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && materials.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'white', borderRadius: '32px', padding: 'clamp(3rem, 8vw, 5rem)', textAlign: 'center', border: '1px solid rgba(0,0,0,0.03)' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(79,70,229,0.06)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>No Materials Yet</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 500, maxWidth: '400px', margin: '0 auto 2rem' }}>
                Materials you order from the procurement catalog will appear here for tracking.
              </p>
              <a href="/procurement">
                <button className="btn-primary" style={{ padding: '16px 36px', fontSize: '0.9rem' }}>BROWSE CATALOG</button>
              </a>
            </motion.div>
          )}

          {/* Materials List */}
          {!isLoading && displayed.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence>
                {displayed.map((mat, i) => {
                  const unitPrice = parseFloat(mat.price || '0');
                  const total = unitPrice * mat.quantity;
                  const sc = STATUS_COLORS[mat.status];
                  const canAdvance = mat.status !== 'Installed';

                  return (
                    <motion.div
                      key={mat.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ background: 'white', borderRadius: '20px', padding: '1.25rem 1.5rem', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
                    >
                      {/* Image / Icon */}
                      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#f8fafc', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {mat.image ? (
                          <img src={mat.image} alt={mat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                          </svg>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          dangerouslySetInnerHTML={{ __html: mat.name }} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span>Order: {mat.orderId}</span>
                          <span>Qty: {mat.quantity}</span>
                          <span>{mat.orderDate}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{fmt(total)}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{fmt(unitPrice)} × {mat.quantity}</div>
                      </div>

                      {/* Status badge + advance */}
                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '5px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                          {mat.status.toUpperCase()}
                        </div>
                        {canAdvance && (
                          <button
                            onClick={() => advance(mat.id, mat.status)}
                            title={`Mark as ${nextStatus(mat.status)}`}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            {nextStatus(mat.status)}
                          </button>
                        )}
                        {!canAdvance && (
                          <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 800 }}>COMPLETE</div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* No results for current filter */}
          {!isLoading && materials.length > 0 && displayed.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              No materials with status "{filter}" found.
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
