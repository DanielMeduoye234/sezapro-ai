import { NextResponse } from 'next/server';

type SimpleJwtRegisterResponse = {
  success: boolean;
  data?: {
    message?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    const wpUrl = process.env.NEXT_PUBLIC_WP_URL || 'https://sezapro.com';
    const authKey = process.env.WP_AUTH_KEY || 'sezapro2026';
    
    const response = await fetch(`${wpUrl}/wp-json/simple-jwt-login/v1/users?AUTH_KEY=${authKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
      },
      body: JSON.stringify({
        email,
        password,
        user_login: username
      }),
    });

    let data: SimpleJwtRegisterResponse;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      console.error('WordPress returned HTML (bot protection triggered). Attempting alternative approach...');
      return NextResponse.json(
        { message: 'Registration service is currently blocking API requests. Please try again in a moment.' },
        { status: 503 }
      );
    }

    try {
      data = await response.json() as SimpleJwtRegisterResponse;
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      const text = await response.text().catch(() => 'unavailable');
      return NextResponse.json(
        { message: 'Invalid response from registration service', detail: text.slice ? text.slice(0, 500) : text },
        { status: 502 }
      );
    }

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { message: data?.data?.message || 'Registration failed' },
        { status: response.status === 200 ? 400 : response.status }
      );
    }

    return NextResponse.json({ success: true, message: 'Account created successfully! Please sign in.' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
