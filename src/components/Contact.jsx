import { useState } from 'react'
import { createReservation } from '../api/reservations'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: '',
  })
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitted) return

    // Client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.date || !form.time) {
      setStatus('error')
      setErrorMessage('Please fill in all required fields (Name, Email, Date, and Time).')
      return
    }

    setLoading(true)
    setStatus(null)
    setErrorMessage('')
    try {
      await createReservation(form)
      setStatus('success')
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', date: '', time: '', guests: '2', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="contact-info">
          <p className="contact-tagline">Get in touch</p>
          <h2 className="contact-title">Reserve a Table</h2>
          <p className="contact-text">
            Planning a visit? Fill out the form and we’ll confirm your reservation. Walk-ins welcome.
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-label">Address</span>
              <span>Kharghar, Navi Mumbai</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Hours</span>
              <span>Mon–Fri 7am – 8pm<br />Sat–Sun 8am – 9pm</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone</span>
              <a href="tel:+15551234567">9137929409</a>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {status === 'success' && (
            <div className="form-success">
              Thank you! We’ll be in touch soon to confirm your reservation.
            </div>
          )}
          {status === 'error' && (
            <div className="form-error">{errorMessage}</div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91-0000-0000"
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="guests">Guests</label>
              <select
                id="guests"
                name="guests"
                value={form.guests}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input
                id="time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="message">Special requests</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Allergies, celebrations, seating preference..."
              rows={3}
            />
          </div>
          <button type="submit" className="btn-submit" disabled={loading || status === 'success'}>
            {loading ? 'Sending...' : status === 'success' ? 'Submitted!' : 'Request Reservation'}
          </button>
        </form>
      </div>
    </section>
  )
}
