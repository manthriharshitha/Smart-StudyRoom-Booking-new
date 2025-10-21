const http = require('http');
const app = require('./app');
const { connectToDatabase } = require('./config/db');

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectToDatabase();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`✅ API server running on port ${PORT}`);
      console.log(`🌐 Accessible at: ${process.env.RAILWAY_STATIC_URL || "https://your-app-name.up.railway.app"}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();