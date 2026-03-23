import 'dotenv/config'
console.log('MONGO URI:', process.env.MONGODB_URI)
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { createReservation, getAllReservations, updateReservation, getReservation, deleteReservation } from './storage.js'
import { connectDB } from './db.js'
import Reservation from './models/Reservation.js'



// Email configuration - Replace with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'londheganashri@gmail.com', 
    pass: process.env.GMAIL_PASS || 'okzewjaacmgukwhv' 
  }
})

// Test email connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error)
  } else {
    console.log('Email server is ready to send messages')
  }
})

await connectDB()

const app = express()
app.use(cors())
app.use(express.json())

// ---- Routes ----

// Create reservation (customer)
app.post('/api/reservations', async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, message } = req.body

    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: 'Name, email, date, and time are required' })
    }

    const reservation = await createReservation({
      name,
      email,
      phone: phone || '',
      date: date || '',
      time: time || '',
      guests: guests || '2',
      message: message || '',
    })

    res.status(201).json({
      success: true,
      message: "Reservation received. We'll confirm shortly!",
      reservation: { id: reservation._id },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create reservation' })
  }
})

// Admin: get all reservations
app.get('/api/admin/reservations', async (req, res) => {
  const key = req.headers['x-admin-key'] || req.query.key

  if (key !== 'supersecret123') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const reservations = await getAllReservations()
    res.json(reservations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch reservations' })
  }
})

// Get reservation by ID (for customers to check status)
app.get('/api/reservations/:id', async (req, res) => {
  try {
    const reservation = await getReservation(req.params.id)
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' })
    }
    res.json(reservation)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch reservation' })
  }
})

// Admin: update reservation status
app.put('/api/admin/reservations/:id', async (req, res) => {
  const key = req.headers['x-admin-key'] || req.query.key
  if (key !== 'supersecret123') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { status } = req.body

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  try {
    // Get current reservation to check if it was pending
    const current = await getReservation(req.params.id)
    if (!current) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    const wasPending = current.status === 'pending' || !current.status

    const updated = await updateReservation(req.params.id, { status })

    // Only send email if the reservation was previously pending
    if (wasPending) {
      if (status === 'accepted') {
        try {
          await transporter.sendMail({
            from: process.env.GMAIL_USER || 'londheganashri@gmail.com',
            to: updated.email,
            subject: 'Reservation Confirmed - Cafe Reservation',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #8B4513;">Reservation Confirmed!</h2>
                <p>Dear ${updated.name},</p>
                <p>Your reservation has been confirmed. Here are the details:</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Date:</strong> ${updated.date}</p>
                  <p><strong>Time:</strong> ${updated.time}</p>
                  <p><strong>Guests:</strong> ${updated.guests}</p>
                  ${updated.phone ? `<p><strong>Phone:</strong> ${updated.phone}</p>` : ''}
                  ${updated.message ? `<p><strong>Special Requests:</strong> ${updated.message}</p>` : ''}
                </div>
                <p>We look forward to serving you!</p>
                <p>Best regards,<br>Cafe Team</p>
              </div>
            `
          })
          console.log(`Confirmation email sent to ${updated.email}`)
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
        }
      } else if (status === 'rejected') {
        try {
          await transporter.sendMail({
            from: process.env.GMAIL_USER || 'londheganashri@gmail.com',
            to: updated.email,
            subject: 'Reservation Update - Cafe Reservation',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #8B4513;">Reservation Update</h2>
                <p>Dear ${updated.name},</p>
                <p>We regret to inform you that we are unable to confirm your reservation at this time due to high demand or scheduling conflicts.</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Requested Date:</strong> ${updated.date}</p>
                  <p><strong>Requested Time:</strong> ${updated.time}</p>
                  <p><strong>Guests:</strong> ${updated.guests}</p>
                  ${updated.phone ? `<p><strong>Phone:</strong> ${updated.phone}</p>` : ''}
                  ${updated.message ? `<p><strong>Special Requests:</strong> ${updated.message}</p>` : ''}
                </div>
                <p>Please try booking again for a different date/time or contact us directly to discuss alternatives.</p>
                <p>We apologize for any inconvenience and hope to serve you soon!</p>
                <p>Best regards,<br>Cafe Team</p>
              </div>
            `
          })
          console.log(`Rejection email sent to ${updated.email}`)
        } catch (emailError) {
          console.error('Failed to send rejection email:', emailError)
        }
      }
    }

    res.json({ success: true, reservation: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update reservation' })
  }
})

// Admin: delete reservation
app.delete('/api/admin/reservations/:id', async (req, res) => {
  const key = req.headers['x-admin-key'] || req.query.key
  if (key !== 'supersecret123') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const deleted = await deleteReservation(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Reservation not found' })
    }
    res.json({ success: true, message: 'Reservation deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete reservation' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Cafe API running at http://localhost:${PORT}`)
})
