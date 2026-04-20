async function testRegistration() {
  const wpUrl = 'https://sezapro.com';
  const authKey = 'sezapro2026';
  const url = `${wpUrl}/wp-json/simple-jwt-login/v1/users?AUTH_KEY=${authKey}`;

  console.log('Testing registration endpoint:', url);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'tester@example.com',
        password: 'Test12345!',
        user_login: 'tester123'
      })
    });

    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Body:', text.slice(0, 1000));

    try {
      const data = JSON.parse(text);
      console.log('JSON:', data);
    } catch (e) {
      console.log('Response was not JSON.');
    }
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

testRegistration();