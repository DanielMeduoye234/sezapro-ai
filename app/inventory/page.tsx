'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function InventoryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const materials = [
    { id: 'MAT-001', name: 'Dangote Cement (50kg)', category: 'Concrete', price: 9500, stock: 450, trend: 'up', change: 2.5 },
    { id: 'MAT-002', name: 'Bua Cement (50kg)', category: 'Concrete', price: 9200, stock: 200, trend: 'up', change: 1.8 },
    { id: 'MAT-003', name: 'TMT Steel 16mm (Per Ton)', category: 'Metals', price: 1250000, stock: 12, trend: 'stable', change: 0 },
    { id: 'MAT-004', name: 'Sharp Sand (20 Tonnage)', category: 'Aggregates', price: 150000, stock: 55, trend: 'down', change: -3.2 },
    { id: 'MAT-005', name: 'Vitrified Tiles (60x60, sqm)', category: 'Finishing', price: 12000, stock: 850, trend: 'up', change: 5.4 },
    { id: 'MAT-006', name: 'Emulsion Paint (20L Buket)', category: 'Finishing', price: 35000, stock: 120, trend: 'stable', change: 0 },
  ];

  const categories = ['All', 'Concrete', 'Metals', 'Aggregates', 'Finishing'];
  
  const formatCur = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  const filteredMaterials = activeCategory === 'All' 
    ? materials 
    : materials.filter(m => m.category === activeCategory);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      
      <section style={{ padding: '160px 24px 100px', flex: 1 }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '3rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Live <span className="text-gradient">Inventory</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Real-time market pricing and stock levels.</p>
              </div>
              <div 
                className="hide-scrollbar"
                style={{ 
                   display: 'flex', 
                   gap: '0.5rem', 
                   background: 'white', 
                   padding: '0.5rem', 
                   borderRadius: '100px', 
                   border: '1px solid rgba(0,0,0,0.05)',
                   overflowX: 'auto',
                   maxWidth: '100%',
                   WebkitOverflowScrolling: 'touch'
                }}
              >
                {categories.map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => setActiveCategory(cat)}
                     style={{
                       padding: '8px 20px',
                       borderRadius: '100px',
                       border: 'none',
                       fontSize: '0.8rem',
                       fontWeight: 800,
                       cursor: 'pointer',
                       background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                       color: activeCategory === cat ? 'white' : 'var(--text)',
                       transition: 'all 0.2s ease',
                       whiteSpace: 'nowrap',
                       flexShrink: 0
                     }}
                   >
                     {cat}
                   </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="glass"
             style={{ 
               background: 'white', 
               borderRadius: 'clamp(20px, 5vw, 32px)', 
               padding: 'clamp(1rem, 5vw, 2rem)', 
               overflowX: 'auto', 
               border: '1px solid rgba(0,0,0,0.03)' 
             }}
          >
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)' }}>
                  <th style={{ padding: '1.5rem 1rem', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Material Name</th>
                  <th style={{ padding: '1.5rem 1rem', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</th>
                  <th style={{ padding: '1.5rem 1rem', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Price</th>
                  <th style={{ padding: '1.5rem 1rem', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Trend</th>
                  <th style={{ padding: '1.5rem 1rem', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Stock Level</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((item, i) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
                  >
                    <td style={{ padding: '1.5rem 1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '0.25rem' }}>{item.id}</div>
                    </td>
                    <td style={{ padding: '1.5rem 1rem' }}>
                      <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>{item.category}</span>
                    </td>
                    <td style={{ padding: '1.5rem 1rem', fontWeight: 900, color: 'var(--primary)', fontSize: '1.2rem' }}>
                      {formatCur(item.price)}
                    </td>
                    <td style={{ padding: '1.5rem 1rem' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        color: item.trend === 'up' ? '#ef4444' : item.trend === 'down' ? '#22c55e' : 'var(--text-muted)',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}>
                        {item.trend === 'up' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>}
                        {item.trend === 'down' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>}
                        {item.trend === 'stable' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>}
                        {item.change}%
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right', fontWeight: 800, fontSize: '1.1rem' }}>
                      {item.stock} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UNITS</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
