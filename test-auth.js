async function test() {
  const wpUrl = 'https://sezapro.com';

  // Test XML-RPC
  console.log('=== Testing XML-RPC ===');
  try {
    const xmlBody = [
      "<?xml version='1.0'?>",
      "<methodCall>",
      "  <methodName>wp.getUsersBlogs</methodName>",
      "  <params>",
      "    <param><value><string>test</string></value></param>",
      "    <param><value><string>test</string></value></param>",
      "  </params>",
      "</methodCall>"
    ].join("\n");
    const res = await fetch(wpUrl + '/xmlrpc.php', {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: xmlBody
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text.slice(0, 500));
  } catch(e) {
    console.error('Error:', e.message);
  }

  // Test WC API
  console.log('\n=== Testing WC API with dummy keys ===');
  try {
    const res2 = await fetch(wpUrl + '/wp-json/wc/v3/customers?consumer_key=test&consumer_secret=test&per_page=1');
    console.log('Status:', res2.status);
    const text2 = await res2.text();
    console.log('Body:', text2.slice(0, 300));
  } catch(e) {
    console.error('Error:', e.message);
  }
}
test();
