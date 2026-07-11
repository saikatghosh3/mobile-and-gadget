// Test the actual API validate endpoint
const testCode = 'SAVE5GTMY8';
const testSubtotal = 5000;

console.log(`Testing coupon validation for code: "${testCode}"`);
console.log(`Subtotal: ${testSubtotal}`);
console.log('');

try {
  const res = await fetch('http://localhost:3000/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      code: testCode, 
      subtotal: testSubtotal,
      userId: null 
    }),
  });
  
  console.log('Response status:', res.status);
  const data = await res.json();
  console.log('Response:', JSON.stringify(data, null, 2));
} catch (err) {
  console.error('Fetch error:', err.message);
  console.log('');
  console.log('Make sure the dev server is running (npm run dev)');
}
