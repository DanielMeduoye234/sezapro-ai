'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getCart, clearCart, getCartTotal, CartItem } from '@/lib/cartStore';
import { saveOrder } from '@/lib/orderStorage';

function generateOrderId() {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SZP-${datePart}-${rand}`;
}

const BUSINESS_WHATSAPP = '2348029872397';

const PAYMENT_METHODS = [
  { id: 'pay_instantly', label: 'Pay Instantly', desc: 'Secure online payment or transfer' },
  { id: 'payment_on_delivery', label: 'Payment on Delivery', desc: 'Pay when your materials arrive' },
  { id: 'bnpl', label: 'Buy Now, Pay Later (BNPL)', desc: 'Flexible monthly installments' },
];

const BNPL_PLANS = [
  { id: '3m',   label: '3-Month Plan', months: 3, markup: 0, desc: 'Subject to vetting (0% markup)' },
  { id: '6m',   label: '6-Month Plan', months: 6, markup: 0.05, desc: 'Subject to vetting (+5% markup)' },
  { id: '12m',  label: '12-Month Plan', months: 12, markup: 0.10, desc: 'Subject to vetting (+10% markup)' },
];

function buildOrderMessage(orderId: string, form: any, cart: CartItem[], total: number): string {
  const method = PAYMENT_METHODS.find(m => m.id === form.paymentMethod)?.label;
  
  let paymentDetails = `*Requested Plan:* ${method}\n`;
  let totalWithMarkup = total;
  
  if (form.paymentMethod === 'bnpl') {
    const plan = BNPL_PLANS.find(p => p.id === form.bnplPlan) || BNPL_PLANS[0];
    totalWithMarkup = Math.round(total * (1 + plan.markup));
    const installment = Math.round(totalWithMarkup / plan.months);
    paymentDetails = `*Requested Plan:* BNPL - ${plan.label} (${plan.months} Months)\n*Est. Installment: ₦${installment.toLocaleString()}/mo*\n`;
  }

  const items = cart.map(i => `• ${i.name.replace(/<[^>]+>/g, '')} × ${i.quantity} @ ₦${parseFloat(i.price || '0').toLocaleString()}`).join('\n');
  return encodeURIComponent(
    `*SEZAPRO PROCUREMENT REQUEST — ${orderId}*\n\n` +
    `*Customer:* ${form.name}\n` +
    `*Email:* ${form.email}\n` +
    `*WhatsApp:* +${form.phone}\n` +
    `*Address:* ${form.address}\n` +
    paymentDetails +
    (form.message ? `*Note:* ${form.message}\n` : '') +
    `\n*ITEMS TO PROCURE:*\n${items}\n\n` +
    `*ESTIMATED TOTAL: ₦${totalWithMarkup.toLocaleString()}*\n\n` +
    (form.paymentMethod === 'bnpl' ? `_This is a request for financing. Sezapro will contact the customer for site vetting and final approval._` : `_Please process instructions for ${method}._`)
  );
}

function buildCustomerMessage(orderId: string, form: any, cart: CartItem[], total: number): string {
  const method = PAYMENT_METHODS.find(m => m.id === form.paymentMethod)?.label;
  const items = cart.map(i => `• ${i.name.replace(/<[^>]+>/g, '')} × ${i.quantity}`).join('\n');
  
  let totalWithMarkup = total;
  let nextSteps = '';

  if (form.paymentMethod === 'bnpl') {
    const plan = BNPL_PLANS.find(p => p.id === form.bnplPlan) || BNPL_PLANS[0];
    totalWithMarkup = Math.round(total * (1 + plan.markup));
    nextSteps = `1. Our team will review your BNPL application.\n2. We will contact you to schedule a site verification.\n3. Once vetted, your materials will be dispatched according to the plan.`;
  } else if (form.paymentMethod === 'pay_instantly') {
    nextSteps = `1. Complete your payment via the provided instructions.\n2. Once confirmed, we will dispatch your order immediately.`;
  } else {
    nextSteps = `1. Your order is confirmed.\n2. Prepare payment upon arrival.\n3. We will notify you when dispatch happens.`;
  }

  return encodeURIComponent(
    `Hi ${form.name}! 👋\n\n` +
    `We've received your request with *${method}* for Order ID: ${orderId}.\n\n` +
    `*Next Steps:*\n${nextSteps}\n\n` +
    `*Items:*\n${items}\n` +
    `*Est. Total:* ₦${totalWithMarkup.toLocaleString()}\n\n` +
    `Thank you for choosing Sezapro! 🏗️`
  );
}

function CheckoutContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderId] = useState(generateOrderId);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', message: '', paymentMethod: 'pay_instantly', bnplPlan: '3m' });
  const [sending, setSending] = useState(false);
  
  const searchParams = useSearchParams();
  const estimateId = searchParams.get('estimateId');

  useEffect(() => { setCart(getCart()); }, []);

  const total = getCartTotal();
  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSending(true);

    // Save order locally
    saveOrder({
      id: orderId,
      userEmail: form.email,
      userName: form.name,
      items: cart,
      total: total,
      paymentMethod: form.paymentMethod,
      estimateId: estimateId || undefined,
    });

    await new Promise(r => setTimeout(r, 800));

    const businessMsg = buildOrderMessage(orderId, form, cart, total);
    const customerMsg = buildCustomerMessage(orderId, form, cart, total);

    // Open WhatsApp for business
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${businessMsg}`, '_blank');

    // Small delay then open for customer
    setTimeout(() => {
      const cleanPhone = form.phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${customerMsg}`, '_blank');
    }, 600);

    clearCart();
    setSending(false);
    setStep('success');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.07)',
    borderRadius: '14px', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)',
    marginBottom: '0.5rem', letterSpacing: '1.2px', textTransform: 'uppercase',
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.06)', color: 'var(--primary)', padding: '7px 16px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '1.25rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
          SECURE CHECKOUT
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-1.5px', marginBottom: '0.4rem' }}>
          Process <span className="text-gradient">Procurement</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
          Fill in your details and select your preferred payment plan.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 'success' ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="glass"
            style={{ background: 'white', borderRadius: '32px', padding: 'clamp(3rem, 10vw, 5rem)', textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{ width: '90px', height: '90px', background: 'rgba(34,197,94,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </motion.div>
            <div style={{ display: 'inline-block', background: '#f1f5f9', padding: '6px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '1.5rem' }}>
              ORDER ID: {orderId}
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem' }}>
              Order Submitted! 🎉
            </h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7, marginBottom: '1rem', maxWidth: '480px', margin: '0 auto 1rem' }}>
              WhatsApp has been opened with your order details. Sezapro will reach out to confirm.
            </p>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '2.5rem' }}>
              You also received a copy on your WhatsApp.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/procurement">
                <button className="btn-outline" style={{ padding: '14px 28px', fontSize: '0.8rem' }}>CONTINUE SHOPPING</button>
              </Link>
              <Link href="/estimates">
                <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.8rem' }}>VIEW MY ESTIMATES</button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* Main Form Area */}
            <div className="glass" style={{ background: 'white', borderRadius: '28px', padding: 'clamp(1.5rem, 5vw, 2.5rem)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Your Details</h2>
                <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px', color: 'var(--text-muted)' }}>
                  {orderId}
                </span>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input required name="name" value={form.name} onChange={handleChange} placeholder="John Okafor" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>WhatsApp No.</label>
                    <input required type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="234XXXXXXXXXX" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Delivery Address</label>
                  <input required name="address" value={form.address} onChange={handleChange} placeholder="No. 1, Construction Ave, Lagos" style={inputStyle} />
                </div>
                {/* Primary Payment Method Selector */}
                <div>
                  <label style={labelStyle}>Select Payment Method</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {PAYMENT_METHODS.map(method => (
                      <div key={method.id} onClick={() => setForm({ ...form, paymentMethod: method.id })}
                        style={{ padding: '1.2rem', borderRadius: '14px', border: `2px solid ${form.paymentMethod === method.id ? 'var(--primary)' : '#f1f5f9'}`, background: form.paymentMethod === method.id ? '#fff1f2' : '#f8fafc', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '0.2rem' }}>{method.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{method.desc}</div>
                        </div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${form.paymentMethod === method.id ? 'var(--primary)' : '#cbd5e1'}`, background: form.paymentMethod === method.id ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {form.paymentMethod === method.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* BNPL Plan Selector (Conditional) */}
                <AnimatePresence>
                  {form.paymentMethod === 'bnpl' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <label style={{ ...labelStyle, marginBottom: '1rem' }}>Select BNPL Duration</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                          {BNPL_PLANS.map(plan => (
                            <div key={plan.id} onClick={() => setForm({ ...form, bnplPlan: plan.id })}
                              style={{ padding: '1rem', borderRadius: '10px', border: `2px solid ${form.bnplPlan === plan.id ? '#0f172a' : 'transparent'}`, background: form.bnplPlan === plan.id ? 'white' : '#f1f5f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{plan.label}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{plan.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={labelStyle}>Message to Sezapro (Optional)</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Any notes…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={sending || cart.length === 0}
                  style={{ width: '100%', padding: '18px', background: (sending || cart.length === 0) ? 'rgba(239,68,68,0.4)' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '0.9rem', fontWeight: 900, cursor: (sending || cart.length === 0) ? 'not-allowed' : 'pointer', marginTop: '1rem' }}>
                  {sending ? '⏳ SENDING…' : '📦 PROCESS PROCUREMENT'}
                </button>
              </form>
            </div>
            {/* Sidebar: Order Review */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass" style={{ background: 'white', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1.25rem' }}>Order Review</h3>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: item.name }} />
                    <div style={{ fontWeight: 900 }}>{item.price ? fmt(parseFloat(item.price) * item.quantity) : '—'}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Total</span>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary)' }}>{fmt(total)}</span>
                </div>
              </div>
              <div className="glass" style={{ background: '#0f172a', borderRadius: '24px', padding: '1.75rem', color: 'white' }}>
                <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '1rem' }}>What happens next?</div>
                <p style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: 1.6 }}>
                  {form.paymentMethod === 'bnpl' 
                    ? 'WhatsApp will open with your order. Sezapro will then verify your identity and credit status for BNPL plans.'
                    : 'WhatsApp will open with your order. Sezapro will confirm and process your delivery based on your selected payment method.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <section style={{ padding: 'clamp(120px, 18vw, 160px) 24px 80px', flex: 1 }}>
        <Suspense fallback={<div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', padding: '4rem' }}>Loading checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}

