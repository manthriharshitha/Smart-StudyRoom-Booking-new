const { connectToDatabase } = require('./src/config/db');
const Room = require('./src/models/Room');

async function seed() {
  await connectToDatabase();
  const rooms = [
    { roomName: 'Quiet Study 101', capacity: 1, location: 'North Wing' },
    { roomName: 'Quiet Study 102', capacity: 1, location: 'North Wing' },
    { roomName: 'Focus Booth A', capacity: 2, location: 'Ground Floor' },
    { roomName: 'Focus Booth B', capacity: 2, location: 'Ground Floor' },
    { roomName: 'Pair Study 201', capacity: 2, location: 'East Wing' },
    { roomName: 'Pair Study 202', capacity: 2, location: 'East Wing' },
    { roomName: 'Group Room 301', capacity: 4, location: 'South Wing' },
    { roomName: 'Group Room 302', capacity: 4, location: 'South Wing' },
    { roomName: 'Group Room 303', capacity: 5, location: 'South Wing' },
    { roomName: 'Collab 401', capacity: 6, location: 'West Wing' },
    { roomName: 'Collab 402', capacity: 6, location: 'West Wing' },
    { roomName: 'Team Room 501', capacity: 8, location: 'Annex' },
    { roomName: 'Team Room 502', capacity: 10, location: 'Annex' },
    { roomName: 'Lecture Practice A', capacity: 12, location: 'Annex' },
    { roomName: 'Lecture Practice B', capacity: 15, location: 'Annex' },
    { roomName: 'Large Hall 1', capacity: 30, location: 'Auditorium' },
    { roomName: 'Large Hall 2', capacity: 40, location: 'Auditorium' },
    { roomName: 'Media Lab', capacity: 6, location: 'Media Center' },
    { roomName: 'Research Suite', capacity: 3, location: 'Library 2F' },
    { roomName: 'Presentation Room', capacity: 20, location: 'Library 1F' }
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
