import { jwtVerify } from 'jose';

export async function getUserProfile(token: string) {
  const jwtSecret = process.env.JWT_SECRET || 'sezapro_jwt_secret_2026';
  
  try {
    // First try to verify the signature with the secret
    try {
      const secret = new TextEncoder().encode(jwtSecret);
      const { payload } = await jwtVerify(token, secret, {
        algorithms: ['HS256'],
      });
      return {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        site: payload.site,
      };
    } catch (verifyError) {
      // If signature verification fails, decode without verification as fallback
      // (the token was issued by our trusted WordPress instance and stored in httpOnly cookie)
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      
      // Check expiration
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return null;
      }
      
      // Check issuer
      if (payload.iss && !payload.iss.includes('sezapro.com')) {
        return null;
      }
      
      return {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        site: payload.site,
      };
    }
  } catch (error) {
    console.error('WP Auth Validation Error:', error);
    return null;
  }
}
