'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCATIONS = [
  { name: 'Lagos, NG', price: '₦31.9M', trend: '+2.4%', activity: 'High' },
  { name: 'Abuja, NG', price: '₦45.2M', trend: '+1.8%', activity: 'High' },
  { name: 'Ogun State, NG', price: '₦18.5M', trend: '+3.1%', activity: 'Moderate' },
  { name: 'Port Harcourt, NG', price: '₦38.7M', trend: '+1.2%', activity: 'Very High' },
  { name: 'Kano, NG', price: '₦22.4M', trend: '-0.5%', activity: 'Moderate' },
  { name: 'Enugu, NG', price: '₦20.1M', trend: '+0.9%', activity: 'Moderate' },
  { name: 'Oyo, NG', price: '₦25.3M', trend: '+2.1%', activity: 'High' },
  { name: 'Kaduna, NG', price: '₦19.8M', trend: '-1.1%', activity: 'Low' },
  { name: 'London, UK', price: '£142K', trend: '-0.5%', activity: 'Moderate' },
  { name: 'Dubai, UAE', price: 'AED 210K', trend: '+1.2%', activity: 'Very High' },
  { name: 'New York, US', price: '$185K', trend: '+0.8%', activity: 'High' },
];

export default function LocationTracker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOCATIONS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass" style={{
      padding: 'clamp(1rem, 4vw, 1.5rem)',
      borderRadius: '20px',
      overflow: 'hidden',
      position: 'relative',
      width: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>LIVE TRACKER</span>
        </div>
        <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 700 }}>GLOBAL HUB</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{LOCATIONS[index].name}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVG. PROJECT COST</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{LOCATIONS[index].price}</div>
             </div>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: LOCATIONS[index].trend.startsWith('+') ? '#22c55e' : '#ef4444' }}>
                  {LOCATIONS[index].trend}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Activity: {LOCATIONS[index].activity}</div>
             </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: '1.5rem', height: '40px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [10, Math.random() * 30 + 10, 10] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            style={{ 
              flex: 1, 
              background: i % 5 === 0 ? 'var(--primary)' : 'rgba(0,0,0,0.05)', 
              borderRadius: '2px' 
            }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
}
