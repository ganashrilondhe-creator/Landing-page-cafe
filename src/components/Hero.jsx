import { useState, useEffect } from 'react'
import './Hero.css'

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const parallaxOffset = scrollY * 0.4

  return (
    <section className="hero" id="home">
      <div className="hero-bg" style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}>
        <div className="hero-gradient" />
        <div className="hero-pattern" />
        <div className="hero-grain" />
      </div>

      <div className="steam-container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="steam steam-1" style={{ '--delay': `${i * 0.8}s`, '--x': `${15 + i * 18}%` }} />
        ))}
      </div>

      <div className="hero-content" style={{ transform: `translateY(${parallaxOffset * 0.15}px)` }}>
        <p className="hero-tagline animate-fade-up">Premium Indian Cafe · Est. 1998</p>
        <h1 className="hero-title animate-fade-up" style={{ '--delay': '0.1s' }}>
          Brew & Co 
        </h1>
        <p className="hero-subtitle animate-fade-up" style={{ '--delay': '0.2s' }}>
          Where Tradition Meets Innovation
        </p>
        <div className="hero-cta animate-fade-up" style={{ '--delay': '0.3s' }}>
          <a href="#menu" className="btn btn-primary">Explore Menu</a>
          <a href="#contact" className="btn btn-secondary">Reserve a Table</a>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-indicator" />
        <span>Scroll to discover</span>
      </div>
    </section>
  )
}
