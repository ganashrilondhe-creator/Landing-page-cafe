import mongoose from 'mongoose'

export let dbConnected = false

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('MONGODB_URI not set. Using local JSON storage.')
    return
  }
  try {
    await mongoose.connect(uri)
    dbConnected = true
    console.log('MongoDB Atlas connected')
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message)
    console.warn('Using local JSON storage instead. Data saved to server/reservations.json')
    
  }
}
