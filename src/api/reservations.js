/**
 * Reservation API client
 * Base URL: uses Vite proxy in dev (/api → http://localhost:3001/api)
 * In production: set VITE_API_URL or use same origin
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function createReservation(data) {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Failed to submit reservation')
  }

  return json
}

export async function getReservations(adminKey) {
  const res = await fetch(`${API_BASE}/admin/reservations`, {
    headers: {
      'X-Admin-Key': adminKey,
    },
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch reservations')
  }

  return json
}
export async function updateReservationStatus(id, status, adminKey) {
  const res = await fetch(`/api/admin/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': adminKey,
    },
    body: JSON.stringify({ status }),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Failed to update status')
  }

  return json
}

export async function getReservationStatus(id) {
  const res = await fetch(`/api/reservations/${id}`)

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch reservation')
  }

  return json
}

export async function deleteReservation(id, adminKey) {
  const res = await fetch(`/api/admin/reservations/${id}`, {
    method: 'DELETE',
    headers: {
      'X-Admin-Key': adminKey,
    },
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Failed to delete reservation')
  }

  return json
}
