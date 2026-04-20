'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getEstimatesForUser, SavedEstimate } from '@/lib/estimateStorage';
import { getOrdersForUser, ProcurementOrder } from '@/lib/orderStorage';

export default function DashboardClient({ user }: { user: any }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [estimates, setEstimates] = useState<SavedEstimate[]>([]);
  const [orders, setOrders] = useState<ProcurementOrder[]>([]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh(); 
    } catch (e) {
      console.error(e);
      setIsLoggingOut(false);
    }
  };

  React.useEffect(() => {
    const email = user?.email || user?.user_email;
    if (email) {
      setEstimates(getEstimatesForUser(email).slice(0, 3));
      setOrders(getOrdersForUser(email).slice(0, 3));
    }
  }, [user]);

  const displayName = user?.name || user?.user_nicename || "Professional";
  const userRole = user?.roles?.[0] ? user.roles[0].toUpperCase() : "ACCOUNT HOLDER";
  
  const formatCur = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  return (
    <section style={{ padding: '160px 24px 100px', flex: 1 }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '4rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}
        >
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>
              {userRole}
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', letterSpacing: '-1.5px', marginBottom: '0.5rem', lineHeight: 1.1 }}>
              Welcome back, <br /><span className="text-gradient">{displayName}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>
              {user?.email || "Manage your projects, estimations, and procurement."}
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{ 
              background: 'transparent', 
              color: '#0f172a', 
              border: '2px solid rgba(15,23,42,0.1)', 
              borderRadius: '100px', 
              padding: '12px 28px', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              cursor: isLoggingOut ? 'not-allowed' : 'pointer', 
              letterSpacing: '1px',
              transition: 'all 0.2s',
              opacity: isLoggingOut ? 0.5 : 1
            }}
          >
            {isLoggingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
          </button>
        </motion.div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Recent Estimates Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass"
            style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.03)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Recent Estimates</h2>
              <Link href="/" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none' }}>NEW +</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {estimates.length > 0 ? estimates.map(est => (
                <Link href="/estimates" key={est.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s', cursor: 'pointer' }} className="hover-shadow">
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{est.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{est.type} • {est.sqm} sqm</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>{formatCur(est.total)}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{est.date.toUpperCase()}</div>
                    </div>
                  </div>
                </Link>
              )) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No recent estimates found.</p>
              )}
            </div>
            
            <Link href="/estimates" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', marginTop: '1.5rem', padding: '16px', background: 'transparent', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '20px', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                VIEW ALL ESTIMATES
              </button>
            </Link>
          </motion.div>

          {/* Saved Projects Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass"
            style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.03)', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248, 250, 252, 1))' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Recent Orders</h2>
              <Link href="/estimates" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none' }}>TRACK ALL</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} style={{ background: '#0f172a', color: 'white', padding: '1.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '1px' }}>{order.status.toUpperCase()}</div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)' }}>{formatCur(order.total)}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{order.id}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>{order.items.length} materials ordered on {order.date}</p>
                  </div>
                  <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(15px)' }}></div>
                </div>
              )) : (
                <div style={{ background: '#0f172a', color: 'white', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
                  <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Ready to procure materials for your project?</p>
                  <Link href="/procurement">
                    <button style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '100px', padding: '12px 24px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                      BROWSE CATALOG
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
          
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-shadow:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }
      `}} />
    </section>
  );
}
