import React, { useState } from 'react';
import { 
  FiSearch, 
  FiClock,
  FiCheckCircle,
  FiActivity,
  FiInfo,
  FiShield
} from 'react-icons/fi';
import { FaBrain } from "react-icons/fa";
import { LuBrain } from "react-icons/lu";
import { MdBalance } from 'react-icons/md';
import { BiLoaderAlt, BiSearchAlt } from 'react-icons/bi';
import { AiOutlineRobot } from 'react-icons/ai';
import infoImage from '../../assets/images/Glogo.png';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const processingSteps = [
    { icon: <FaBrain />, text: 'Understanding your question...' },
    { icon: <BiSearchAlt />, text: 'Searching tax regulations...' },
    { icon: <MdBalance />, text: 'Finding relevant sections...' },
    { icon: <FiActivity />, text: 'Simplifying complex terms...' },
    { icon: <FiCheckCircle />, text: 'Preparing your answer...' }
  ];

  // API call function
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
          language: 'en' // You can make this dynamic later
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Format API response to match UI expectations
  const formatAPIResponse = (apiData) => {
    return {
      title: apiData.title || 'Tax Information',
      source: apiData.source || 'Sri Lankan Tax Regulations',
      answer: apiData.answer || apiData.response || 'No answer available',
      keyPoints: apiData.keyPoints || apiData.key_points || [],
      example: apiData.example || null,
      confidence: apiData.confidence || 85,
      responseTime: apiData.responseTime || apiData.response_time || 2.5
    };
  };

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) {
      toast.error('Please enter a question about Sri Lankan taxes');
      return;
    }

    setIsLoading(true);
    setIsProcessing(true);
    setCurrentStep(0);
    setSearchResults(null);

    const startTime = Date.now();
    toast.loading('AI Assistant is working on your question...', { id: 'search-toast' });

    try {
      // Simulate processing steps while making API call
      const processingPromise = (async () => {
        for (let i = 0; i < processingSteps.length; i++) {
          setCurrentStep(i);
          await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
        }
      })();

      // Make API call
      const apiCallPromise = callTaxAPI(query);

      // Wait for both processing animation and API call
      const [, apiResponse] = await Promise.all([processingPromise, apiCallPromise]);

      // Calculate actual response time
      const endTime = Date.now();
      const actualResponseTime = ((endTime - startTime) / 1000).toFixed(1);

      // Format the response
      const formattedResults = formatAPIResponse({
        ...apiResponse,
        responseTime: actualResponseTime
      });

      setSearchResults(formattedResults);
      toast.success('Found relevant tax information!', { id: 'search-toast' });

    } catch (error) {
      console.error('Search error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to search. Please try again.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Search service not found. Please contact support.';
      }
      
      toast.error(errorMessage, { id: 'search-toast' });
      
      // Optional: Set fallback results or error state
      setSearchResults(null);
      
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Optional: Add a retry function
  const handleRetry = () => {
    handleSearch(searchQuery);
  };

  return (
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

      {/* Feature Highlights */}
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
          <input
            type="text"
            className="lextax-search-input"
            placeholder="Ask me anything about Sri Lankan taxes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className="lextax-search-button"
            onClick={() => handleSearch()}
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? (
              <BiLoaderAlt className="lextax-search-spinner" />
            ) : (
              <FiSearch />
            )}
            {isLoading ? 'Searching' : 'Search'}
          </button>
        </div>

        {/* Information Tip */}
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
                <span className="lextax-result-source">
                  Source: {searchResults.source}
                </span>
              </div>
              <div className="lextax-result-content">
                <p className="lextax-result-answer">{searchResults.answer}</p>
                
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
                
                {searchResults.example && (
                  <div className="lextax-example">
                    <h4>Example:</h4>
                    <p>{searchResults.example}</p>
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
  );
};

export default Home;