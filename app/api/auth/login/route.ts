import { NextResponse } from 'next/server';

type SimpleJwtResponse = {
  success: boolean;
  data?: {
    jwt?: string;
    message?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const wpUrl = process.env.WP_URL || process.env.NEXT_PUBLIC_WP_URL || 'https://sezapro.com';
    const authKey = process.env.WP_AUTH_KEY || '';

    const endpoint = `${wpUrl.replace(/\/$/, '')}/wp-json/simple-jwt-login/v1/auth${authKey ? `?AUTH_KEY=${encodeURIComponent(authKey)}` : ''}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Keep headers minimal for server-to-server calls to reduce WAF fingerprinting
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    
    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    if (contentType.includes('text/html')) {
      const bodyText = await response.text();
      console.error('WordPress returned HTML (likely WAF / bot protection).', { status: response.status, snippet: bodyText.slice(0, 200) });
      const debug = process.env.AUTH_DEBUG === 'true';
      return NextResponse.json(
        {
          message: 'Authentication service is blocking API requests (WAF or captcha).',
          status: response.status,
          ...(debug ? { body: bodyText.slice(0, 500) } : {}),
        },
        { status: 502 }
      );
    }

    let data: SimpleJwtResponse;
    try {
      data = await response.json() as SimpleJwtResponse;
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      const text = await response.text().catch(() => 'unavailable');
      return NextResponse.json(
        { message: 'Invalid response from authentication service', detail: text.slice ? text.slice(0, 500) : text },
        { status: 502 }
      );
    }

    if (typeof data?.success !== 'boolean') {
      console.error('Unexpected response shape from auth service', { data });
      return NextResponse.json({ message: 'Unexpected response from authentication service' }, { status: 502 });
    }

    if (!response.ok || !data.success) {
      console.error('Authentication failed', { status: response.status, data });
      return NextResponse.json(
        { message: data?.data?.message || 'Authentication failed', status: response.status, data },
        { status: response.status === 200 ? 401 : response.status }
      );
    }

    const res = NextResponse.json({ success: true, user: username });
    const token = data.data?.jwt;

    if (!token) {
      console.error('Plugin returned success but no JWT present', { data });
      return NextResponse.json({ message: 'Authentication succeeded but no token returned' }, { status: 502 });
    }

    res.cookies.set({
      name: 'wp_jwt',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
