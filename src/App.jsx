import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Projects } from './pages/Projects';
import { RequestQuote } from './pages/RequestQuote';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { NotFound } from './pages/NotFound';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className={`relative flex flex-col min-h-screen font-sans transition-colors duration-300 ${isDark
        ? 'bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white'
        : 'bg-white text-slate-900 selection:bg-blue-600 selection:text-white'
      }`}>
      <Navbar />
      <main id="main-content" className="relative z-10 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/quote" element={<RequestQuote />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
