const http = require('http');
function post(path, body, cb) {
  const data = JSON.stringify(body);
  const opts = { hostname: 'localhost', port: 4000, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } };
  const req = http.request(opts, res => { let b=''; res.on('data', c=>b+=c); res.on('end', ()=> cb(null, res.statusCode, b)); });
  req.on('error', e=>cb(e)); req.write(data); req.end();
}

post('/api/auth/signup', { name: 'Test User', email: 'test@example.com', password: 'password123', role: 'student' }, (err, status, body) => {
  if (err) return console.error('SIGNUP ERR', err);
  console.log('SIGNUP', status, body);
  post('/api/auth/login', { email: 'test@example.com', password: 'password123' }, (err2, status2, body2) => {
    if (err2) return console.error('LOGIN ERR', err2);
    console.log('LOGIN', status2, body2);
  });
});
