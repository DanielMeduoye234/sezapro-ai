async function testConnection() {
  const WP_URL = 'https://sezapro.com';
  const CK = 'ck_78425067c1d9290536d142e4ae6279dc59bb8d3b';
  const CS = 'cs_1686cefedd4ba50aef380bf7ae9395319c95194c';

  const url = `${WP_URL}/wp-json/wc/v3/products?per_page=5&consumer_key=${CK}&consumer_secret=${CS}`;

  console.log('Testing connection to:', url);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Status:', res.status);
    console.log('Status Text:', res.statusText);
    
    const text = await res.text();
    if (!res.ok) {
      console.log('Error Body:', text);
      return;
    }

    const data = JSON.parse(text);
    process.stdout.write(`Successfully fetched ${data.length} products\n`);
    if (data.length > 0) {
      process.stdout.write(`First product: ${data[0].name}\n`);
    }
  } catch (err) {
    console.error('Fetch error:', err.message || err);
    if (err.code) console.error('Error Code:', err.code);
  }
}

testConnection();
