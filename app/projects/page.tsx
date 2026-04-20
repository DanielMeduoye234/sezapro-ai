'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function ProjectsPage() {
  const projects = [
    { id: 'PRJ-1042', name: 'Lekki Phase 1 Luxury Villa', type: 'Duplex', status: 'Ongoing', cost: 145000000, progress: 65, date: 'Mar 15, 2024' },
    { id: 'PRJ-1088', name: 'Victoria Island Commercial Hub', type: 'Commercial', status: 'Planning', cost: 850000000, progress: 10, date: 'Mar 20, 2024' },
    { id: 'PRJ-0931', name: 'Ikeja Residential Block', type: '4 Flats', status: 'Completed', cost: 120000000, progress: 100, date: 'Jan 10, 2024' },
    { id: 'PRJ-1102', name: 'Abuja Maitama Mansion', type: 'Duplex', status: 'Ongoing', cost: 320000000, progress: 40, date: 'Feb 28, 2024' },
  ];

  const formatCur = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

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
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Active <span className="text-gradient">Projects</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Manage and track your ongoing construction sites.</p>
              </div>
              <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.8rem' }}>+ NEW PROJECT</button>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                className="glass"
                style={{
                  background: 'white',
                  borderRadius: 'clamp(20px, 5vw, 24px)',
                  padding: 'clamp(1.2rem, 5vw, 2rem)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px' }}>{project.id}</div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3 }}>{project.name}</h3>
                   </div>
                   <div style={{ 
                     padding: '6px 12px', 
                     borderRadius: '100px', 
                     fontSize: '0.65rem', 
                     fontWeight: 800,
                     background: project.status === 'Completed' ? '#dcfce7' : project.status === 'Ongoing' ? '#eff6ff' : '#fef3c7',
                     color: project.status === 'Completed' ? '#166534' : project.status === 'Ongoing' ? '#1e40af' : '#92400e',
                     textTransform: 'uppercase'
                   }}>
                     {project.status}
                   </div>
                </div>

                <div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>Estimated Cost</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px' }}>{formatCur(project.cost)}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${project.progress}%` }}
                       transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                       style={{ height: '100%', background: 'var(--primary)', borderRadius: '3px' }}
                     />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
