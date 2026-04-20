import React from 'react';
import Nav from '@/components/Nav';
import ProductClient from '../../../components/ProductClient';
import Footer from '@/components/Footer';

async function getProduct(id: string) {
  const url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/v3/products/${id}`;
  
  if (!process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
    console.warn("Missing WooCommerce API credentials in environment.");
    return null;
  }

  const authString = `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`;
  const encodedAuth = Buffer.from(authString).toString('base64');

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      console.error('WordPress API err:', res.status);
      return null;
    }
    
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    return null;
  }
}

export default async function SingleProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Nav />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Product Not Found</h1>
          <p style={{ color: 'var(--text-muted)' }}>We couldn't locate this material in our catalog.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      {/* Client Component for Interactions */}
      <ProductClient product={product} />
      
      <Footer />
    </main>
  );
}
