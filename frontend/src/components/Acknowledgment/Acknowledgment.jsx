import React from 'react';
import { 
  FiX, 
  FiInfo, 
  FiShield, 
  FiAlertTriangle,
  FiCheckCircle 
} from 'react-icons/fi';
import { LuBrain } from "react-icons/lu";
import { MdGavel } from 'react-icons/md';
import './Acknowledgment.css';

const Acknowledgment = ({ isVisible, onAccept }) => {
  if (!isVisible) return null;

  const handleAccept = () => {
    // Set cookie to remember user has acknowledged
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year
    document.cookie = `lextax_acknowledged=true; expires=${expiryDate.toUTCString()}; path=/`;
    onAccept();
  };

  const handleOverlayClick = (e) => {
    // Don't close when clicking inside the modal
    if (e.target === e.currentTarget) {
      // Optional: You can choose to close on overlay click or not
      // handleAccept();
    }
  };

  return (
    <div className="lextax-acknowledgment-overlay" onClick={handleOverlayClick}>
      <div className="lextax-acknowledgment-modal">
        <div className="lextax-acknowledgment-header">
          <div className="lextax-acknowledgment-icon">
            <LuBrain className="lextax-brain-icon" />
          </div>
          <h2 className="lextax-acknowledgment-title">
            Welcome to LexTax AI Assistant
          </h2>
          <p className="lextax-acknowledgment-subtitle">
            Your intelligent companion for Sri Lankan tax matters
          </p>
        </div>

        <div className="lextax-acknowledgment-content">
          <div className="lextax-intro-text">
            <p>
              Our AI assistant is <strong>specifically trained on Sri Lankan tax regulations</strong> to provide 
              accurate, relevant information in an <strong>easy-to-understand format</strong>. Complex tax jargon 
              is simplified into clear explanations anyone can follow. While our system is 
              <strong>continuously improving</strong> and we strive for accuracy, please be aware that 
              occasional mistakes may occur.
            </p>
          </div>

          <div className="lextax-disclaimer">
            <div className="lextax-disclaimer-icon">
              <FiInfo />
            </div>
            <div className="lextax-disclaimer-content">
              <h4>Important Notice</h4>
              <p>
                This AI assistant provides general guidance based on Sri Lankan tax regulations. 
                For complex matters or official decisions, we recommend consulting with a qualified 
                tax professional or the Inland Revenue Department directly.
              </p>
            </div>
          </div>
        </div>

        <div className="lextax-acknowledgment-footer">
          <button 
            className="lextax-accept-button"
            onClick={handleAccept}
          >
            <FiCheckCircle />
            I Understand & Continue
          </button>
          <p className="lextax-footer-note">
            By continuing, you acknowledge that you understand the capabilities and limitations of this AI assistant.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Acknowledgment;