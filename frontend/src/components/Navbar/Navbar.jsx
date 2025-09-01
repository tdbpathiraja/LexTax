import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import logoImage from '../../assets/images/Lex Tax Logo.png';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  /* ==================== STATE MANAGEMENT ==================== */
  const [showLogo, setShowLogo] = useState(true);

  /* ==================== EFFECTS ==================== */
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ==================== RENDER ==================== */
  return (
    <nav className="lextax-navbar">
      <div className="lextax-navbar-container">
        {/* ========== CENTER LOGO ANIMATION ========== */}
        <div className="lextax-navbar-center">
          <div className="lextax-animation-container">
            <div className={`lextax-logo-wrapper ${showLogo ? 'lextax-show' : 'lextax-hide'}`}>
              <a href="/" className="lextax-logo">
                <img 
                  src={logoImage} 
                  alt="LexTax Logo" 
                  className="lextax-logo-image"
                />
              </a>
            </div>
            
            <div className={`lextax-text-wrapper ${!showLogo ? 'lextax-show' : 'lextax-hide'}`}>
              <span className="lextax-text">Tax Assistant</span>
            </div>
          </div>
        </div>

        {/* ========== THEME TOGGLE ========== */}
        <div className="lextax-theme-toggle">
          <button 
            className="lextax-theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <div className="lextax-toggle-icon-wrapper">
              <FiSun className={`lextax-toggle-icon lextax-sun-icon ${theme === 'light' ? 'active' : ''}`} />
              <FiMoon className={`lextax-toggle-icon lextax-moon-icon ${theme === 'dark' ? 'active' : ''}`} />
            </div>
            <div className={`lextax-toggle-slider ${theme === 'dark' ? 'dark' : ''}`}>
              <div className="lextax-toggle-circle"></div>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;