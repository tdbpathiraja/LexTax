import React from 'react';
import { FiShield } from 'react-icons/fi';
import { FaBalanceScale } from "react-icons/fa";
import { BiLoaderAlt } from 'react-icons/bi';
import brandLogo from '../../assets/images/Lex Tax Logo.png';
import './Preloader.css';

const Preloader = ({ theme }) => {
  return (
    <div className={`lextax-preloader ${theme}`}>
      <div className="lextax-preloader-container">
        
        {/* Logo Section */}
        <div className="lextax-preloader-logo">
          <div className="lextax-logo-wrapper">
            <img 
              src={brandLogo} 
              alt="LexTax Logo" 
              className="lextax-brand-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback logo if image fails to load */}
            <div className="lextax-fallback-logo" style={{ display: 'none' }}>
              <FaBalanceScale className="lextax-scale-icon" />
              <span className="lextax-logo-text">LexTax</span>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="lextax-loading-section">
          <div className="lextax-spinner-container">
            <BiLoaderAlt className="lextax-main-spinner" />
            <div className="lextax-spinner-ring"></div>
          </div>
          
          <div className="lextax-loading-text">
            <h3>Loading Sri Lankan Tax Assistant</h3>
            <p>Preparing your intelligent tax companion...</p>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="lextax-feature-icons">
          <div className="lextax-feature-item">
            <FiShield className="lextax-feature-icon" />
            <span>Verified</span>
          </div>
          <div className="lextax-feature-item">
            <FaBalanceScale className="lextax-feature-icon" />
            <span>Accurate</span>
          </div>
          <div className="lextax-feature-item">
            <BiLoaderAlt className="lextax-feature-icon rotating" />
            <span>AI-Powered</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="lextax-progress-container">
          <div className="lextax-progress-bar">
            <div className="lextax-progress-fill"></div>
          </div>
          <span className="lextax-progress-text">Loading...</span>
        </div>

      </div>
      
      {/* Background Animation */}
      <div className="lextax-bg-animation">
        <div className="lextax-floating-shape lextax-shape-1"></div>
        <div className="lextax-floating-shape lextax-shape-2"></div>
        <div className="lextax-floating-shape lextax-shape-3"></div>
      </div>
    </div>
  );
};

export default Preloader;