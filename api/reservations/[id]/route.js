import { readFileSync } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'server/reservations.json');

let reservations = [];

try {
  reservations = JSON.parse(readFileSync(DATA_FILE, 'utf8') || '[]');
} catch (e) {
  reservations = [];
}

export async function GET(request, { params }) {
  const id = params.id;
  const res = reservations.find(r => r._id === id);
  if (!res) {
    return Response.json({ error: 'Reservation not found' }, { status: 404 });
  }
  return Response.json(res);
}

