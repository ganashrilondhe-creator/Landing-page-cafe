import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  guests: { type: String, default: '2' },
  message: { type: String, default: '' },
  status: {
    type: String,
    default: 'pending'},
}, { timestamps: true })

export default mongoose.model('Reservation', reservationSchema)
