import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import SkillsGrid from './components/SkillsGrid.jsx'
import InstallGuide from './components/InstallGuide.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <SkillsGrid />
        <InstallGuide />
      </main>
      <Footer />
    </div>
  )
}
