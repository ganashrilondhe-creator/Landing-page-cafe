import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dbConnected } from './db.js'
import Reservation from './models/Reservation.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'reservations.json')

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2))
  }
}

function readFromFile() {
  ensureDataFile()
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
}

function writeToFile(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function createReservation(data) {
  if (dbConnected) {
    const doc = await Reservation.create(data)
    return { id: doc._id.toString(), ...doc.toObject() }
  }
  const reservation = {
    _id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const list = readFromFile()
  list.push(reservation)
  writeToFile(list)
  return reservation
}

export async function getAllReservations() {
  if (dbConnected) {
    return Reservation.find().sort({ createdAt: -1 }).lean()
  }
  const list = readFromFile()
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function updateReservation(id, updates) {
  if (dbConnected) {
    return Reservation.findByIdAndUpdate(id, updates, { new: true }).lean()
  }
  const list = readFromFile()
  const index = list.findIndex(r => r._id === id)
  if (index === -1) throw new Error('Reservation not found')
  list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() }
  writeToFile(list)
  return list[index]
}

export async function getReservation(id) {
  if (dbConnected) {
    return Reservation.findById(id).lean()
  }
  const list = readFromFile()
  return list.find(r => r._id === id)
}

export async function deleteReservation(id) {
  if (dbConnected) {
    return Reservation.findByIdAndDelete(id).lean()
  }
  const list = readFromFile()
  const index = list.findIndex(r => r._id === id)
  if (index === -1) throw new Error('Reservation not found')
  const deleted = list.splice(index, 1)[0]
  writeToFile(list)
  return deleted
}
