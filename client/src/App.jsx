import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import GlassNav from './components/GlassNav'
import LiquidCursor from './components/LiquidCursor'
import { ThemeProvider } from './context/ThemeProvider'
import HomePage from './pages/HomePage'
import BookConsultationPage from './pages/BookConsultationPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import ProcessPage from './pages/ProcessPage'
import TeamPage from './pages/TeamPage'
import TestimonialsPage from './pages/TestimonialsPage'
import ContactPage from './pages/ContactPage'


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LiquidCursor />
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
          <GlassNav />
          <main className="pt-28">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:serviceSlug" element={<ServiceDetailPage />} />
              <Route path="/book-consultation" element={<BookConsultationPage />} />
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
