'use client';
import React from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '2.5rem' }}>
    <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.3px' }}>{title}</h2>
    <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontWeight: 500 }}>{children}</div>
  </motion.div>
);

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <section style={{ padding: 'clamp(120px, 18vw, 160px) 24px 80px', flex: 1 }}>
        <div className="container" style={{ maxWidth: '780px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>Legal</span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', letterSpacing: '-1.5px', margin: '0.5rem 0 1rem' }}>Privacy <span className="text-gradient">Policy</span></h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Last updated: April 2026</p>
          </motion.div>

          <div className="glass" style={{ background: 'white', borderRadius: '28px', padding: 'clamp(1.5rem, 6vw, 3.5rem)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Section title="1. Introduction">
              <p>Seza Engineering Ltd ("Sezapro", "we", "our") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use the Sezapro platform.</p>
            </Section>
            <Section title="2. Information We Collect">
              <p>We collect the following types of information:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li><strong>Account Data:</strong> Name, email address, and login credentials.</li>
                <li><strong>Order Data:</strong> Phone number, delivery address, and order details when submitting procurement requests.</li>
                <li><strong>Usage Data:</strong> Calculation inputs, project parameters, and platform interaction data to improve our services.</li>
                <li><strong>Technical Data:</strong> Browser type, device information, and IP address for security and performance monitoring.</li>
              </ul>
            </Section>
            <Section title="3. How We Use Your Information">
              <p>We use your personal data to:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>Provide and improve our cost estimation and procurement services</li>
                <li>Process and communicate about your orders via WhatsApp</li>
                <li>Maintain your saved estimates and project history</li>
                <li>Send service updates and relevant communications</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </Section>
            <Section title="4. Data Storage & Security">
              <p>Your estimates and preferences are stored locally in your browser (localStorage) and on our secure servers. We implement industry-standard security measures including HTTPS encryption and JWT-based authentication. We do not store credit card or payment information.</p>
            </Section>
            <Section title="5. WhatsApp Data">
              <p>When you process a procurement order, your contact details and order information are transmitted via WhatsApp. This information is subject to WhatsApp's own privacy policy and terms. We only use this data to process and communicate your order.</p>
            </Section>
            <Section title="6. Third-Party Services">
              <p>We use the following third-party services: Google Gemini AI (for construction analysis), WordPress/WooCommerce (for product data). These services have their own privacy policies and data practices.</p>
            </Section>
            <Section title="7. Your Rights">
              <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <strong>hello@sezapro.com</strong>. We will respond within 30 days.</p>
            </Section>
            <Section title="8. Cookies">
              <p>We use essential cookies (HTTP-only JWT tokens) to maintain your authentication session. We do not use tracking or advertising cookies.</p>
            </Section>
            <Section title="9. Data Retention">
              <p>We retain your account data for as long as your account is active. Estimates stored locally are managed by you and can be deleted at any time. We may retain order communications for up to 2 years for business record purposes.</p>
            </Section>
            <Section title="10. Contact">
              <p>For privacy concerns: <strong>hello@sezapro.com</strong> | Seza Engineering Ltd, Victoria Island, Lagos, Nigeria.</p>
            </Section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
