import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getReservations, updateReservationStatus, deleteReservation } from '../api/reservations'
import './Admin.css'


const ADMIN_KEY_STORAGE = 'cafe_admin_key'

export default function Admin() {
  const [key, setKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || '')
  const [inputKey, setInputKey] = useState('')
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [newReservationAlert, setNewReservationAlert] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [deletingReservation, setDeletingReservation] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const prevReservationsLength = useRef(0)
  const alertShown = useRef(false)
  const today = new Date().toISOString().split('T')[0]
const todaysReservations = reservations.filter(r => r.date === today)

  

  const fetchReservations = async (showLoading = true) => {
    if (!key) return
    if (showLoading) setLoading(true)
    setError('')
    try {
      const data = await getReservations(key)
      setReservations(data)
      if (data.length > prevReservationsLength.current) {
        setNewReservationAlert(true)
        setTimeout(() => setNewReservationAlert(false), 5000)
      }
      prevReservationsLength.current = data.length
    } catch (err) {
      setError(err.message)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    if (key) fetchReservations()
  }, [key, refreshTrigger])

  useEffect(() => {
    if (!key) return
    const interval = setInterval(() => fetchReservations(false), 15000)
    return () => clearInterval(interval)
  }, [key])

  const handleLogin = async (e) => {
    e.preventDefault()
    const k = inputKey.trim()
    if (!k) return
    setLoading(true)
    setError('')
    try {
      await getReservations(k)
      localStorage.setItem(ADMIN_KEY_STORAGE, k)
      setKey(k)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE)
    setKey('')
    setInputKey('')
    setReservations([])
  }

  const handleAccept = async (id) => {
    setUpdatingStatus(id)
    try {
      await updateReservationStatus(id, 'accepted', key)
      setRefreshTrigger((t) => t + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleReject = async (id) => {
    setUpdatingStatus(id)
    try {
      await updateReservationStatus(id, 'rejected', key)
      setRefreshTrigger((t) => t + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return
    setDeletingReservation(id)
    try {
      await deleteReservation(id, key)
      setRefreshTrigger((t) => t + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingReservation(null)
    }
  }

  // Filter and search logic
  useEffect(() => {
    let filtered = reservations

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(r => (r.status || 'pending') === filter)
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        (r.phone && r.phone.toLowerCase().includes(term))
      )
    }

    setFilteredReservations(filtered)
  }, [reservations, filter, searchTerm])

  if (!key) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Admin Login</h1>
          <p>Enter your admin key to view reservations.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Admin key"
              autoFocus
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Enter'}
            </button>
          </form>
          {error && <div className="admin-error">{error}</div>}
        </div>
        <Link to="/" className="admin-back">← Back to site</Link>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Reservations</h1>
        <div className="admin-actions">
          <button onClick={() => setRefreshTrigger((t) => t + 1)} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button onClick={handleLogout}>Logout</button>
          <Link to="/" className="admin-back-link">View site</Link>
        </div>
      </header>

      {newReservationAlert && (
        <div className="admin-notification">New reservation received!</div>
      )}
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-filters">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Search by Name/Phone/Email:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reservations..."
          />
        </div>
      </div>

      <div className="admin-list">
        {filteredReservations.length === 0 && !loading && (
          <p className="admin-empty">
            {reservations.length === 0 ? 'No reservations yet.' : 'No reservations match your filters.'}
          </p>
        )}
        {filteredReservations.map((r) => (
          <article key={r._id} className="admin-card">
            <div className="admin-card-header">
              <strong>{r.name}</strong>
              <span className="admin-date">
                {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
              </span>
            </div>
            <div className="admin-card-body">
              <p><span>Email:</span> {r.email}</p>
              {r.phone && <p><span>Phone:</span> {r.phone}</p>}
              {r.date && <p><span>Date:</span> {r.date}</p>}
              {r.time && <p><span>Time:</span> {r.time}</p>}
              <p><span>Guests:</span> {r.guests}</p>
              {r.message && <p><span>Notes:</span> {r.message}</p>}
              <p><span>Status:</span> <span className={`status ${r.status || 'pending'}`}>{r.status || 'pending'}</span></p>
            </div>
            <div className="admin-card-footer">
              <p><span>Actions:</span></p>
              <div>
                {(r.status === 'pending' || !r.status) && (
                  <>
                    <button className="admin-btn accept" onClick={() => handleAccept(r._id)} disabled={updatingStatus === r._id}>
                      {updatingStatus === r._id ? 'Updating...' : 'Accept'}
                    </button>
                    <button className="admin-btn reject" onClick={() => handleReject(r._id)} disabled={updatingStatus === r._id}>
                      {updatingStatus === r._id ? 'Updating...' : 'Reject'}
                    </button>
                  </>
                )}
                <button className="admin-btn delete" onClick={() => handleDelete(r._id)} disabled={deletingReservation === r._id}>
                  {deletingReservation === r._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Link to="/" className="admin-back admin-back-bottom">← Back to site</Link>
    </div>
  )
}
