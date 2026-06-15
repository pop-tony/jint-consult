import ContactPage from './components/ContactPage'
import Footer from './components/Footer'
import GlassNav from './components/GlassNav'
import Hero3D from './components/Hero3D'
import LiquidCursor from './components/LiquidCursor'
import ProcessSection from './components/ProcessSection'
import ServicesGrid from './components/ServicesGrid'
import StatsLiquid from './components/StatsLiquid'
import TeamSection from './components/TeamSection'
import Testimonials from './components/Testimonials'
import { ThemeProvider } from './context/ThemeProvider'


function App() {
  return (
    <ThemeProvider>
      <LiquidCursor />
      <div className="bg-white dark:bg-black">
        <GlassNav />
        <Hero3D />
        <ServicesGrid />
        <StatsLiquid />
        <ProcessSection />
        <TeamSection />
        <Testimonials />
        <ContactPage />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
