const http = require('http');
const app = require('./app');
const { connectToDatabase } = require('./config/db');

const PORT = process.env.PORT || 4000;

async function start() {
  await connectToDatabase();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


