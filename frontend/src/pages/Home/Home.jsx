import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiClock,
  FiCheckCircle,
  FiActivity,
  FiInfo,
  FiShield,
  FiAlertTriangle,
  FiGlobe,
  FiEdit3,
  FiMessageSquare,
  FiBookOpen
} from 'react-icons/fi';
import { FaBrain } from "react-icons/fa";
import { LuBrain } from "react-icons/lu";
import { MdBalance } from 'react-icons/md';
import { BiLoaderAlt, BiSearchAlt } from 'react-icons/bi';
import { AiOutlineRobot } from 'react-icons/ai';
import infoImage from '../../assets/images/Glogo.png';
import toast from 'react-hot-toast';
import Acknowledgment from '../../components/Acknowledgment/Acknowledgment';
import { validateTaxInput, sanitizeInput, formatValidationMessage } from '../../utils/InputValidation';
import './Home.css';

const Home = () => {
  //* ==================== STATE MANAGEMENT ====================
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validationIconType, setValidationIconType] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState('auto');

  //* ==================== CONFIGURATION ====================
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  const processingSteps = [
    { icon: <FaBrain />, text: 'Understanding your question...' },
    { icon: <BiSearchAlt />, text: 'Searching tax regulations...' },
    { icon: <MdBalance />, text: 'Finding relevant sections...' },
    { icon: <FiActivity />, text: 'Simplifying complex terms...' },
    { icon: <FiCheckCircle />, text: 'Preparing your answer...' }
  ];

  //* ==================== UTILITY FUNCTIONS ====================
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getValidationIcon = (iconType) => {
    switch (iconType) {
      case 'language':
        return <FiGlobe />;
      case 'edit':
        return <FiEdit3 />;
      case 'message':
        return <FiMessageSquare />;
      default:
        return <FiAlertTriangle />;
    }
  };

  const adjustTextareaHeight = (textarea) => {
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    
    const minHeight = 24;
    const maxHeight = 120;
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    
    textarea.style.height = `${newHeight}px`;
    setTextareaHeight(`${newHeight}px`);
  };

  const parseStructuredResponse = (answer, metadata = {}) => {
    const components = {
      answer: '',
      taxAct: ''
    };

    if (metadata && metadata.structured_components) {
      const structuredComponents = metadata.structured_components;
      return {
        answer: structuredComponents.answer || '',
        taxAct: structuredComponents.tax_act || ''
      };
    }

    if (!answer) return components;

    const sections = answer.split(/\n\n(?=(?:Tax Act:|Example:))/);
    
    if (sections.length === 1) {
      components.answer = answer.trim();
      return components;
    }

    components.answer = sections[0].replace(/^Answer:\s*/, '').trim();

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i].trim();
      
      if (section.startsWith('Tax Act:')) {
        components.taxAct = section.replace('Tax Act:', '').trim();
      }
    }

    return components;
  };

  const validateInput = (text) => {
    setIsValidating(true);
    
    const textForValidation = sanitizeInput(text, false);
    
    const validation = validateTaxInput(textForValidation, {
      minLength: 5,
      maxLength: 500,
      checkLanguage: true,
      checkLength: textForValidation.trim().length > 0,
      checkContent: textForValidation.trim().length > 0
    });

    setIsValidating(false);
    
    if (!validation.isValid) {
      const formattedMessage = formatValidationMessage(validation);
      setValidationError(formattedMessage);
      setValidationIconType(validation.iconType || 'warning');
      
      if (validation.type === 'language' && !hasShownToast) {
        setHasShownToast(true);
        setTimeout(() => {
          setSearchQuery('');
          setValidationError('');
          setValidationIconType('');
          setTextareaHeight('auto');
          toast.error('Input cleared: Please use English only', {
            duration: 3000
          });
          
          setTimeout(() => {
            setHasShownToast(false);
          }, 1000);
        }, 2000);
      }
      
      return false;
    }
    
    setValidationError('');
    setValidationIconType('');
    setHasShownToast(false);
    return true;
  };

  //* ==================== API FUNCTIONS ====================
  const callTaxAPI = async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          language: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const formatAPIResponse = (apiData) => {
    const structuredComponents = parseStructuredResponse(
      apiData.answer || apiData.response || '', 
      apiData.metadata || {}
    );
    
    return {
      title: apiData.title || 'Tax Information',
      source: apiData.source || 'Sri Lankan Tax Regulations',
      answer: apiData.answer || apiData.response || 'No answer available',
      structuredAnswer: structuredComponents.answer,
      taxAct: structuredComponents.taxAct,
      keyPoints: apiData.keyPoints || apiData.key_points || [],
      confidence: apiData.confidence || 85,
      responseTime: apiData.responseTime || apiData.response_time || 2.5,
      metadata: apiData.metadata || {}
    };
  };

  //* ==================== EFFECTS ====================
  useEffect(() => {
    const hasAcknowledged = getCookie('lextax_acknowledged');
    if (!hasAcknowledged) {
      const timer = setTimeout(() => {
        setShowAcknowledgment(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (window.validationTimeout) {
        clearTimeout(window.validationTimeout);
      }
    };
  }, []);

  //* ==================== EVENT HANDLERS ====================
  const handleAcknowledgmentAccept = () => {
    setShowAcknowledgment(false);
    toast.success('Welcome to LexTax! Ready to help with your tax questions.', {
      duration: 3000,
    });
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue, true);
    
    setSearchQuery(sanitizedValue);
    adjustTextareaHeight(e.target);
    
    if (validationError && sanitizedValue.trim().length > 0) {
      setValidationError('');
      setValidationIconType('');
    }
    
    if (sanitizedValue.trim().length > 2) {
      if (window.validationTimeout) {
        clearTimeout(window.validationTimeout);
      }
      
      window.validationTimeout = setTimeout(() => {
        validateInput(sanitizedValue);
      }, 800);
    } else {
      setValidationError('');
      setValidationIconType('');
      setHasShownToast(false);
    }
  };

  const handleSearch = async (query = searchQuery) => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      toast.error('Please enter a question about Sri Lankan taxes');
      return;
    }

    if (!validateInput(trimmedQuery)) {
      return;
    }

    setIsLoading(true);
    setIsProcessing(true);
    setCurrentStep(0);
    setSearchResults(null);
    setValidationError('');

    const startTime = Date.now();

    try {
      const processingPromise = (async () => {
        for (let i = 0; i < processingSteps.length; i++) {
          setCurrentStep(i);
          await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
        }
      })();

      const apiCallPromise = callTaxAPI(trimmedQuery);
      const [, apiResponse] = await Promise.all([processingPromise, apiCallPromise]);

      const endTime = Date.now();
      const actualResponseTime = ((endTime - startTime) / 1000).toFixed(1);

      const formattedResults = formatAPIResponse({
        ...apiResponse,
        responseTime: actualResponseTime
      });

      setSearchResults(formattedResults);

    } catch (error) {
      let errorMessage = 'Failed to search. Please try again.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Search service not found. Please contact support.';
      }
      
      toast.error(errorMessage);
      setSearchResults(null);
      
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !showAcknowledgment && !validationError) {
      e.preventDefault();
      handleSearch();
    }
  };

  //* ==================== RENDER ====================
  return (
    <>
      <Acknowledgment 
        isVisible={showAcknowledgment}
        onAccept={handleAcknowledgmentAccept}
      />

      <main className="lextax-home">
        <div className="lextax-home-hero">
          <h1 className="lextax-home-title">
            <span className="lextax-title-text">Sri Lankan Tax Made Simple</span>
            <span className="lextax-title-shine"></span>
          </h1>
          <p className="lextax-home-subtitle">
            Get instant, easy-to-understand answers about Sri Lankan tax laws. 
            No legal jargon, just clear explanations you can trust.
          </p>
        </div>

        <div className="lextax-feature-highlights">
          {[
            { icon: <FiCheckCircle />, text: 'Instant Answers' },
            { icon: <FiShield />, text: 'Government Verified' },
            { icon: <LuBrain />, text: 'AI Powered' }
          ].map((feature, index) => (
            <div key={index} className="lextax-feature-card">
              <span className="lextax-feature-icon">{feature.icon}</span>
              <span className="lextax-feature-text">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="lextax-search-container">
          <div className="lextax-search-box">
            <textarea
              className="lextax-search-input"
              placeholder="Ask me anything about Sri Lankan taxes..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading || showAcknowledgment}
              rows={1}
              style={{ 
                height: textareaHeight,
                minHeight: '60px',
                maxHeight: '140px'
              }}
            />
            <button 
              className="lextax-search-button"
              onClick={() => handleSearch()}
              disabled={isLoading || !searchQuery.trim() || showAcknowledgment || validationError}
            >
              {isLoading ? (
                <BiLoaderAlt className="lextax-search-spinner" />
              ) : (
                <FiSearch />
              )}
              {isLoading ? 'Searching' : 'Search'}
            </button>
          </div>

          {validationError && (
            <div className="lextax-validation-error">
              <div className="lextax-error-content">
                <span className="lextax-error-icon">
                  {getValidationIcon(validationIconType)}
                </span>
                <span className="lextax-error-message">{validationError}</span>
              </div>
            </div>
          )}

          <div className="lextax-info-tip">
            <div className="lextax-tip-content">
              <img 
                src={infoImage} 
                alt="Info" 
                className="lextax-tip-image"
              />
              <div className="lextax-tip-text">
                <span className="lextax-tip-description">
                  Data updated with latest tax information verified under IRD Sri Lankan Government
                </span>
              </div>
              <div className="lextax-verified-badge">
                <FiCheckCircle />
                <span>Verified</span>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="lextax-processing">
              <div className="lextax-processing-title">
                <AiOutlineRobot />
                AI Assistant is working
                <div className="lextax-thinking-dots">
                  <span className="lextax-thinking-dot"></span>
                  <span className="lextax-thinking-dot"></span>
                  <span className="lextax-thinking-dot"></span>
                </div>
              </div>
              {processingSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`lextax-processing-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
                >
                  {step.icon}
                  {step.text}
                  {index === currentStep && (
                    <BiLoaderAlt className="lextax-step-spinner" />
                  )}
                  {index < currentStep && (
                    <FiCheckCircle className="lextax-step-done" />
                  )}
                </div>
              ))}
            </div>
          )}

          {searchResults && !isProcessing && (
            <div className="lextax-results">
              <div className="lextax-result-card">
                <div className="lextax-result-header">
                  <h3 className="lextax-result-title">{searchResults.title}</h3>
                  <div className="lextax-result-source-container">
                    <span className="lextax-result-source">
                      Source: {searchResults.source}
                    </span>
                    {searchResults.taxAct && 
                     searchResults.taxAct.trim() !== '' &&
                     searchResults.taxAct !== 'Refer to relevant Sri Lankan Tax Legislation' && (
                      <span className="lextax-result-tax-act">
                        <FiBookOpen />
                        {searchResults.taxAct}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="lextax-result-content">
                  <p className="lextax-result-answer">
                    {searchResults.structuredAnswer || searchResults.answer}
                  </p>
                  
                  {searchResults.keyPoints && searchResults.keyPoints.length > 0 && (
                    <div className="lextax-key-points">
                      <h4>Key Points:</h4>
                      <ul>
                        {searchResults.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="lextax-result-footer">
                  <span className="lextax-confidence">
                    Confidence: {searchResults.confidence}%
                  </span>
                  <span className="lextax-response-time">
                    <FiClock /> Response time: {searchResults.responseTime}s
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;