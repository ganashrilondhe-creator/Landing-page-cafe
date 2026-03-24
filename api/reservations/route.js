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

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validation
    if (!data.name || !data.email || !data.date || !data.time) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const reservations = JSON.parse(readFileSync(DATA_FILE, 'utf8') || '[]');
    
    const newReservation = {
      _id: Date.now().toString(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    reservations.push(newReservation);
    writeFileSync(DATA_FILE, JSON.stringify(reservations, null, 2));
    
    // Send confirmation email
await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: data.email,
      subject: 'Cafe Reservation Received',
      html: `<p>Hi ${data.name}, your reservation for ${data.date} at ${data.time} is pending confirmation.</p>`
    });
    
    return Response.json({ 
      success: true, 
      message: 'Reservation received! We\\'ll confirm soon.',
      reservation: { id: newReservation._id }
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    return Response.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
