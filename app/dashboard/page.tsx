import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import DashboardClient from '@/components/DashboardClient';
import Footer from '@/components/Footer';

import { getUserProfile } from '@/lib/wpAuth';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('wp_jwt');

  if (!token || !token.value) {
    redirect('/auth');
  }

  const user = await getUserProfile(token.value);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <DashboardClient user={user} />
      
      <Footer />
    </main>
  );
}
