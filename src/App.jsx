import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Menu from './components/Menu'
import Contact from './components/Contact'
import Map from './components/Map'
import Footer from './components/Footer'
import Admin from './pages/Admin'

function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Menu />
        <Contact />
        <Map />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
