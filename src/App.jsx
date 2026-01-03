import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Builder from './pages/Builder';
import About from './pages/About';
import SpotlightBackground from './components/SpotlightBackground';
import './index.css';

export default function App() {
  return (
    <Router>
      <SpotlightBackground />
      <div className="flex flex-col min-h-screen relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/build" element={<Builder />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
