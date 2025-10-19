const http = require('http');
const data = JSON.stringify({ email: 'test@example.com', password: 'password123' });
const opts = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
};
const req = http.request(opts, res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('HEADERS', res.headers);
    console.log('BODY', b);
  });
});
req.on('error', e => console.error('ERR', e));
req.write(data);
req.end();
