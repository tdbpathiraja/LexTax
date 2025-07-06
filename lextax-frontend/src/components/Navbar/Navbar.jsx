import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import logoImage from '../../assets/images/Lex Tax Logo.png';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo(prev => !prev);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="lextax-navbar">
      <div className="lextax-navbar-container">
        <div className="lextax-navbar-center">
          <div className="lextax-animation-container">
            {/* Logo */}
            <div className={`lextax-logo-wrapper ${showLogo ? 'lextax-show' : 'lextax-hide'}`}>
              <a href="/" className="lextax-logo">
                <img 
                  src={logoImage} 
                  alt="LexTax Logo" 
                  className="lextax-logo-image"
                />
              </a>
            </div>
            
            {/* Text */}
            <div className={`lextax-text-wrapper ${!showLogo ? 'lextax-show' : 'lextax-hide'}`}>
              <span className="lextax-text">Tax Assistant</span>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
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