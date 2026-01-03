import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Builder from './pages/Builder';
import About from './pages/About';
import Analyser from './pages/Analyser';
import SpotlightBackground from './components/SpotlightBackground';
import './index.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-paper font-sans text-ink relative overflow-hidden">
        {/* Global Doodles */}
        <SpotlightBackground />

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/build" element={<Builder />} />
          <Route path="/about" element={<About />} />
          <Route path="/analyse" element={<Analyser />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
