import Navbar from './components/Navbar.tsx'
import Hero from './components/Hero.tsx'
import HowItWorks from './components/HowItWorks.tsx'
import SkillsGrid from './components/SkillsGrid.tsx'
import InstallGuide from './components/InstallGuide.tsx'
import Footer from './components/Footer.tsx'

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
