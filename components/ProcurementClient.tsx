'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  images: { src: string }[];
  categories: { name: string }[];
  status: string;
}

export default function ProcurementClient({ products, estimateId }: { products: Product[], estimateId?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const itemsPerPage = 9;
  
  const formatCur = (val: string) => {
    if (!val) return 'Contact for price';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(parseFloat(val));
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    if (products) {
      products.forEach(p => {
        p.categories?.forEach(c => cats.add(c.name.replace(/&amp;/g, '&')));
      });
    }
    return Array.from(cats);
  }, [products]);

  // Handle Search & Filter Resets
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.categories?.some(c => c.name === activeCategory);
    return matchesSearch && matchesCategory;
  }) || [];

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll near top of grid smoothly
  };

  return (
    <section style={{ 
      padding: '160px 24px 100px', 
      flex: 1,
      background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.05), transparent 70%)',
      position: 'relative'
    }}>
      {/* Abstract Background Shapes */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 60%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.05) 0%, transparent 60%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '100px', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></span>
            LIVE CATALOG
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-1.5px', marginBottom: '1rem', lineHeight: 1.1 }}>
            Direct <span className="text-gradient">Procurement</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto 3rem' }}>
            Access our real-time supplier network. Premium materials sourced at wholesale volume rates for maximum cost efficiency.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: '1rem', 
                width: '100%', 
                maxWidth: '800px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
              {/* Super premium search bar */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  display: 'flex', alignItems: 'center', 
                  background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)',
                  padding: '16px 28px', borderRadius: '100px', flex: '1 1 400px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)', transform: 'skewX(-20deg)', animation: 'shimmer 3s infinite' }}></div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '16px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Search materials, grades, or types..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1.05rem', color: 'var(--text)', fontWeight: 600 }}
                />
              </motion.div>

              {/* Premium Category Dropdown */}
              {categories.length > 1 && (
                <div style={{ position: 'relative', flex: '0 1 auto' }}>
                  <motion.button
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      background: 'white', backdropFilter: 'blur(20px)',
                      padding: '16px 28px', borderRadius: '100px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(255,255,255,0.9)',
                      cursor: 'pointer',
                      fontSize: '1rem', fontWeight: 700, color: '#0f172a',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    {activeCategory}
                    <motion.svg 
                       animate={{ rotate: isDropdownOpen ? 180 : 0 }} 
                       width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', color: 'var(--text-muted)' }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </motion.svg>
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                          background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(30px)',
                          borderRadius: '24px',
                          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
                          padding: '12px', minWidth: '240px', zIndex: 100,
                          display: 'flex', flexDirection: 'column', gap: '4px'
                        }}
                      >
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => { handleCategoryClick(cat); setIsDropdownOpen(false); }}
                            style={{
                              padding: '12px 18px', borderRadius: '14px', border: 'none',
                              background: activeCategory === cat ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                              color: activeCategory === cat ? 'var(--primary)' : 'var(--text-muted)',
                              fontWeight: activeCategory === cat ? 800 : 600,
                              fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left',
                              transition: 'all 0.2s ease',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}
                            onMouseEnter={(e) => {
                              if (activeCategory !== cat) e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                            }}
                            onMouseLeave={(e) => {
                              if (activeCategory !== cat) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            {cat}
                            {activeCategory === cat && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {products?.length === 0 ? (
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '32px', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)' }}>
              <div style={{ background: '#fef2f2', color: '#ef4444', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Supplier Connection Failed</h3>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1.1rem' }}>Could not fetch live products from the WooCommerce catalog. Please check your API credentials.</p>
           </motion.div>
        ) : filteredProducts.length === 0 ? (
           <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 600 }}>No materials found matching your exact criteria.</p>
           </div>
        ) : (
          <>
            <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
              <AnimatePresence mode="popLayout">
                {currentProducts.map((product, i) => (
                  <Link href={`/procurement/${product.id}${estimateId ? `?estimateId=${estimateId}` : ''}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      whileHover="hover"
                      className="product-card"
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '32px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                        position: 'relative'
                      }}
                    >
                      {/* Glow effect on hover */}
                      <motion.div 
                        variants={{ hover: { opacity: 1 } }}
                        initial={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(255, 255, 255, 0) 100%)', zIndex: 0, pointerEvents: 'none' }}
                      />

                      {/* Product Image Area */}
                      <div style={{ height: '260px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#ffffff', zIndex: 1, borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                        {product.images && product.images[0] ? (
                          <motion.img 
                            variants={{ hover: { scale: 1.08, rotate: 2 } }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            src={product.images[0].src} 
                            alt={product.name} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.05))' }} 
                          />
                        ) : (
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px' }}>NO IMAGE API</div>
                        )}
                        
                        {/* Status/Category Badges */}
                        <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {product.categories && product.categories[0] && (
                            <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                              {product.categories[0].name.replace(/&amp;/g, '&')}
                            </div>
                          )}
                          {product.status === 'instock' && (
                            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span> IN STOCK
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details Area */}
                      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '1rem', color: '#0f172a' }}>{product.name.replace(/&amp;/g, '&')}</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem', flex: 1 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Wholesale Rate</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
                              {formatCur(product.price)}
                            </div>
                            {product.regular_price && product.regular_price !== product.price && (
                              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 600 }}>
                                {formatCur(product.regular_price)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <motion.button 
                          variants={{ hover: { backgroundColor: '#3730a3', scale: 1.02, boxShadow: '0 15px 30px rgba(79, 70, 229, 0.35)' } }}
                          style={{ 
                            background: 'var(--primary)', 
                            color: 'white', 
                            border: 'none', 
                            width: '100%', 
                            padding: '16px', 
                            borderRadius: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            letterSpacing: '1px',
                            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
                            marginTop: 'auto'
                          }}
                          onClick={(e) => {
                            // Prevent navigating to the product detail page when clicking Add to Cart directly (Optional but good UX)
                            // e.preventDefault();
                          }}
                        >
                          ADD TO CART
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '5rem' }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ 
                    padding: '12px 20px', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.8)', fontWeight: 800, fontSize: '0.85rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, transition: 'all 0.2s', backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'white')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'rgba(255,255,255,0.8)')}
                >
                  PREV
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  if(pNum === 1 || pNum === totalPages || (pNum >= currentPage - 1 && pNum <= currentPage + 1)) {
                    return (
                      <button 
                         key={pNum}
                         onClick={() => handlePageChange(pNum)}
                         style={{ 
                           width: '46px', height: '46px', borderRadius: '50%', border: currentPage === pNum ? 'none' : '1px solid rgba(0,0,0,0.08)', background: currentPage === pNum ? 'var(--primary)' : 'rgba(255,255,255,0.8)', color: currentPage === pNum ? 'white' : 'var(--text-muted)', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: currentPage === pNum ? '0 10px 20px rgba(79, 70, 229, 0.2)' : 'none'
                         }}
                         onMouseEnter={(e) => {
                           if (currentPage !== pNum) e.currentTarget.style.background = 'white';
                         }}
                         onMouseLeave={(e) => {
                           if (currentPage !== pNum) e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                         }}
                      >
                         {pNum}
                      </button>
                    );
                  } else if (pNum === currentPage - 2 || pNum === currentPage + 2) {
                    return <span key={pNum} style={{ color: 'var(--text-muted)', fontWeight: 800, padding: '0 8px' }}>...</span>;
                  }
                  return null;
                })}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ 
                    padding: '12px 20px', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.8)', fontWeight: 800, fontSize: '0.85rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, transition: 'all 0.2s', backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'white')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'rgba(255,255,255,0.8)')}
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Add a global shimmer animation style block if it doesnt exist in main css, just inline for this component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { left: 200%; }
        }
      `}} />
    </section>
  );
}
