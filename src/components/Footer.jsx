import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <a href="#home" className="footer-logo">Brew & Co</a>
        <p className="footer-tagline">Artisan café · Fresh daily</p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#contact">Contact</a>
          <Link to="/admin" className="footer-admin">Admin</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Brew & Co. All rights reserved.</p>
      </div>
    </footer>
  )
}
