import { writeFileSync, readFileSync } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const DATA_FILE = path.join(process.cwd(), 'server/reservations.json');
const ADMIN_KEY = 'supersecret123';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'londheganashri@gmail.com',
    pass: process.env.GMAIL_PASS || 'okzewjaacmgukwhv'
  }
});

let reservations = []; // In-memory for serverless

// Load initial data
try {
  reservations = JSON.parse(readFileSync(DATA_FILE, 'utf8') || '[]');
} catch (e) {
  reservations = [];
}

export async function GET(request) {
  const key = request.headers.get('X-Admin-Key') || new URL(request.url).searchParams.get('key');
  
  if (key !== ADMIN_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return Response.json(reservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

export async function PUT(request, { params }) {
  const key = request.headers.get('X-Admin-Key') || new URL(request.url).searchParams.get('key');
  
  if (key !== ADMIN_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const id = params.id;
  const { status } = await request.json();
  
  const index = reservations.findIndex(r => r._id === id);
  if (index === -1) {
    return Response.json({ error: 'Reservation not found' }, { status: 404 });
  }
  
  reservations[index].status = status;
  reservations[index].updatedAt = new Date().toISOString();
  
  // Save back (for dev)
  writeFileSync(DATA_FILE, JSON.stringify(reservations, null, 2));
  
  // Email notification
  const res = reservations[index];
  if (status === 'accepted') {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: res.email,
      subject: 'Reservation Confirmed',
      html: `<h2>Confirmed!</h2><p>Date: ${res.date} Time: ${res.time}</p>`
    });
  } else if (status === 'rejected') {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: res.email,
      subject: 'Reservation Update',
      html: `<h2>Unfortunately rejected</h2>`
    });
  }
  
  return Response.json({ success: true, reservation: reservations[index] });
}

export async function DELETE(request, { params }) {
  const key = request.headers.get('X-Admin-Key') || new URL(request.url).searchParams.get('key');
  
  if (key !== ADMIN_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const id = params.id;
  const index = reservations.findIndex(r => r._id === id);
  if (index === -1) {
    return Response.json({ error: 'Reservation not found' }, { status: 404 });
  }
  
  const deleted = reservations.splice(index, 1)[0];
  writeFileSync(DATA_FILE, JSON.stringify(reservations, null, 2));
  
  return Response.json({ success: true, message: 'Deleted' });
}

export async function GET(request, { params }) {
  const id = params.id;
  const res = reservations.find(r => r._id === id);
  if (!res) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  return Response.json(res);
}

