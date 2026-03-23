import { useState, useEffect } from 'react'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '#home', label: 'Home' },
    { href: '#menu', label: 'Menu' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <a href="#home" className="header-logo">
        <img src="/logo.png" alt="Brew & Co" className="header-logo-img" />
        Brew & Co
      </a>

      <nav className={`header-nav ${mobileOpen ? 'nav-open' : ''}`}>
        {links.map(({ href, label }) => (
          <a key={href} href={href} onClick={() => setMobileOpen(false)}>
            {label}
          </a>
        ))}
      </nav>

      <button
        className="header-toggle"
        aria-label="Toggle menu"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className={mobileOpen ? 'open' : ''} />
        <span className={mobileOpen ? 'open' : ''} />
        <span className={mobileOpen ? 'open' : ''} />
      </button>
    </header>
  )
}
