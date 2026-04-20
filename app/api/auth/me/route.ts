import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserProfile } from '@/lib/wpAuth';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('wp_jwt');

  if (!token || !token.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await getUserProfile(token.value);

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}
