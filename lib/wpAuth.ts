export async function getUserProfile(token: string) {
  const wpUrl = process.env.WP_URL || process.env.NEXT_PUBLIC_WP_URL || 'https://sezapro.com';
  const authKey = process.env.WP_AUTH_KEY || 'sezapro2026';
  
  try {
    const endpoint = `${wpUrl.replace(/\/$/, '')}/wp-json/simple-jwt-login/v1/auth/validate?AUTH_KEY=${encodeURIComponent(authKey)}`;
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 0 }
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    
    // WordPress simple-jwt-login returns user data in data.data.user
    return data.data.user || null;
  } catch (error) {
    console.error('WP Auth Validation Error:', error);
    return null;
  }
}
