import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import GlassNav from './components/GlassNav'
import LiquidCursor from './components/LiquidCursor'
import { ThemeProvider } from './context/ThemeProvider'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import HomePage from './pages/HomePage'
import BookConsultationPage from './pages/BookConsultationPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import ProcessPage from './pages/ProcessPage'
import TeamPage from './pages/TeamPage'
import TestimonialsPage from './pages/TestimonialsPage'
import ContactPage from './pages/ContactPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'


function App() {
  return (
    <ThemeProvider>
      <SiteSettingsProvider>
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
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </SiteSettingsProvider>
    </ThemeProvider>
  )
}

export default App
