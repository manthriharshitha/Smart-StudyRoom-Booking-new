const { connectToDatabase } = require('./src/config/db');
const Room = require('./src/models/Room');

async function seed() {
  await connectToDatabase();
  const rooms = [
    { roomName: 'Room B', capacity: 2, location: 'Building 1' },
    { roomName: 'Room C', capacity: 9, location: 'Building 2' }
  ];

  for (const r of rooms) {
    const exists = await Room.findOne({ roomName: r.roomName });
    if (exists) {
      console.log(`${r.roomName} already exists`);
    } else {
      const created = await Room.create(r);
      console.log(`Created ${created.roomName} (${created.capacity})`);
    }
  }
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
