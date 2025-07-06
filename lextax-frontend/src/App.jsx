import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

//Public Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

//Web Pages
import Home from './pages/Home/Home';


import './App.css';

const App = () => {
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('lextax-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('lextax-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="lextax-app">
      <Router>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          {/* Add more routes as needed */}
        </Routes>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? 'var(--lextax-gray-800)' : 'var(--lextax-white)',
              color: theme === 'dark' ? 'var(--lextax-white)' : 'var(--lextax-gray-800)',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${theme === 'dark' ? 'var(--lextax-gray-700)' : 'var(--lextax-gray-200)'}`,
            },
            success: {
              style: {
                borderLeft: '4px solid var(--lextax-secondary-emerald)',
              },
            },
            error: {
              style: {
                borderLeft: '4px solid var(--lextax-accent-orange)',
              },
            },
            loading: {
              style: {
                borderLeft: '4px solid var(--lextax-primary-blue)',
              },
            },
          }}
        />
      </Router>
    </div>
  );
};

export default App;