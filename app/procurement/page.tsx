import React from 'react';
import Nav from '@/components/Nav';
import ProcurementClient from '../../components/ProcurementClient';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

async function getProducts() {
  if (!process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
    console.warn("Missing WooCommerce API credentials in environment.");
    return [];
  }

  const url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wc/v3/products?per_page=100&consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => 'No body');
      console.error('WordPress API error:', res.status, res.statusText, 'Body:', errorBody);
      return [];
    }
    
    const data = await res.json();
    console.log(`Successfully fetched ${data.length} products`);
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
}

export default async function ProcurementPage({ searchParams }: { searchParams: Promise<{ estimateId?: string }> }) {
  const products = await getProducts();
  const { estimateId } = await searchParams;

  return (
    <main style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      {/* Client component to handle Framer Motion animations for the grid */}
      <ProcurementClient products={products} estimateId={estimateId} />
      
      <Footer />
    </main>
  );
}
