'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { addToCart } from '@/lib/cartStore';

export default function ProductClient({ product }: { product: any }) {
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.src || null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  // State for selected variants if product is variable
  const initialVariants: Record<string, string> = {};
  if (product.attributes && product.attributes.length > 0) {
    product.attributes.forEach((attr: any) => {
      if (attr.variation && attr.options?.length > 0) {
        initialVariants[attr.name] = attr.options[0];
      }
    });
  }
  const [selectedVariants, setSelectedVariants] = useState(initialVariants);

  const formatCur = (val: string) => {
    if (!val) return 'Contact for price';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(parseFloat(val));
  };

  const handleAddToCart = () => {
    if (added) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price || product.regular_price || '0',
      image: product.images?.[0]?.src || '',
    }, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <section style={{ padding: '160px 24px 100px', flex: 1 }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Back Link */}
        <Link href="/procurement" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '2rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
          BACK TO CATALOG
        </Link>
        
        {/* Notification Toast */}
        <AnimatePresence>
          {added && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -50, x: '-50%' }}
              style={{
                position: 'fixed',
                top: '6rem',
                left: '50%',
                background: '#22c55e',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '100px',
                fontWeight: 800,
                fontSize: '0.9rem',
                zIndex: 9999,
                boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              ADDED TO CART
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'start' }}>
          
          {/* Gallery Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               style={{ background: '#ffffff', borderRadius: 'clamp(20px, 5vw, 32px)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', height: 'clamp(300px, 50vh, 500px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            >
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px' }}>NO IMAGE API</div>
              )}
            </motion.div>
            
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                {product.images.map((img: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(img.src)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '16px',
                      border: selectedImage === img.src ? '2px solid var(--primary)' : '2px solid transparent',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      padding: 0,
                      flexShrink: 0
                    }}
                  >
                    <img src={img.src} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                {product.categories?.map((c: any) => (
                  <span key={c.id} style={{ background: '#f1f5f9', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {c.name}
                  </span>
                ))}
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '1rem', color: '#0f172a' }}>
                {product.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
                {product.regular_price && product.regular_price !== product.price && (
                  <span style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 700 }}>
                    {formatCur(product.regular_price)}
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-1px', lineHeight: 1 }}>
                    {formatCur(product.price || product.regular_price)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>/ UNIT</span>
                </div>
              </div>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div 
                className="prose" 
                style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', width: '100%' }}></div>

            {/* Variants / Attributes */}
            {product.attributes?.map((attr: any) => {
              if (!attr.variation) return null; // Only show variations here
              return (
                <div key={attr.id || attr.name}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Select {attr.name}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {attr.options?.map((opt: string) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariants({...selectedVariants, [attr.name]: opt})}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '12px',
                          background: selectedVariants[attr.name] === opt ? '#0f172a' : '#f8fafc',
                          color: selectedVariants[attr.name] === opt ? 'white' : 'var(--text)',
                          border: selectedVariants[attr.name] === opt ? '1px solid #0f172a' : '1px solid rgba(0,0,0,0.1)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', width: '100%' }}>
              
              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', padding: '6px' }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '40px', height: '40px', background: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <span style={{ width: '60px', textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '40px', height: '40px', background: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>

              {/* Add to Cart */}
              <button 
                onClick={handleAddToCart}
                style={{ 
                  flex: 1, 
                  background: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  fontSize: '1.1rem', 
                  fontWeight: 900, 
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px rgba(239, 68, 68, 0.25)',
                  minWidth: '200px',
                  padding: '20px'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                ADD TO CART
              </button>
            </div>

          </motion.div>
        </div>

        {/* Long Description */}
        {product.description && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{ marginTop: 'clamp(3rem, 10vw, 5rem)', background: 'white', borderRadius: 'clamp(20px, 5vw, 32px)', padding: 'clamp(1.5rem, 5vw, 4rem)', border: '1px solid rgba(0,0,0,0.03)' }}
          >
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 'clamp(1rem, 3vw, 2rem)', color: '#0f172a' }}>Technical Specifications</h2>
            <div 
              className="prose-description"
              style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 500 }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
