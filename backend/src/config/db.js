const mongoose = require('mongoose');

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/study_room_booking';
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, { autoIndex: true });
}

module.exports = { connectToDatabase };


