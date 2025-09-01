import React, { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiLinkedin, 
  FiTwitter, 
  FiFacebook,
  FiGithub,
  FiShield,
  FiCode
} from 'react-icons/fi';
import footerLogoLight from '../../assets/images/FooterLogo.png';
import footerLogoDark from '../../assets/images/Lex Tax Logo.png';
import './Footer.css';

const Footer = () => {
  /* ==================== STATE MANAGEMENT ==================== */
  const currentYear = new Date().getFullYear();
  const [isDarkMode, setIsDarkMode] = useState(false);

  /* ==================== CONFIGURATION ==================== */
  const footerSections = [
    {
      title: 'Tax Resources',
      links: [
        { label: 'VAT Calculator', href: '/vat-calculator' },
        { label: 'Income Tax Guide', href: '/income-tax' },
        { label: 'NBT Information', href: '/nbt' },
        { label: 'Stamp Duty Rates', href: '/stamp-duty' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'User Guide', href: '/guide' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Data Security', href: '/security' },
        { label: 'Disclaimer', href: '/disclaimer' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FiLinkedin />, href: '#linkedin', label: 'LinkedIn', color: '#0077b5' },
    { icon: <FiTwitter />, href: '#twitter', label: 'Twitter', color: '#1da1f2' },
    { icon: <FiFacebook />, href: '#facebook', label: 'Facebook', color: '#1877f2' },
    { icon: <FiGithub />, href: '#github', label: 'GitHub', color: '#333' }
  ];

  const contactInfo = [
    { icon: <FiMapPin />, text: 'Chittampalam A. Gardiner Mawatha, Colombo 02', href: 'https://www.google.com/maps/place/Inland+Revenue+Department/@6.929563,79.84815,17z/data=!3m1!4b1!4m2!3m1!1s0x3ae2593cc9404b43:0xaab3118a7d48314f?hl=en' },
    { icon: <FiMail />, text: 'cgir@ird.gov.lk', href: 'mailto:cgir@ird.gov.lk' },
    { icon: <FiPhone />, text: '+94 11 213 5135', href: 'tel:+94112135135' }
  ];

  /* ==================== EFFECTS ==================== */
  useEffect(() => {
    const checkDarkMode = () => {
      const htmlDark = document.documentElement.classList.contains('dark');
      const bodyDark = document.body.classList.contains('dark-theme') || 
                      document.body.classList.contains('dark');
      const dataDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const rootDark = document.documentElement.style.getPropertyValue('--theme') === 'dark';
      
      const isDark = htmlDark || bodyDark || dataDark || rootDark;
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    
    const documentObserver = new MutationObserver(() => {
      setTimeout(checkDarkMode, 50);
    });
    
    const bodyObserver = new MutationObserver(() => {
      setTimeout(checkDarkMode, 50);
    });

    documentObserver.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme', 'style'] 
    });
    
    bodyObserver.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme', 'style'] 
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      setTimeout(checkDarkMode, 50);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    const interval = setInterval(checkDarkMode, 2000);

    return () => {
      documentObserver.disconnect();
      bodyObserver.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
      clearInterval(interval);
    };
  }, []);

  /* ==================== RENDER ==================== */
  return (
    <footer className="lextax-footer">
      <div className="lextax-footer-container">
        
        {/* ========== MAIN FOOTER CONTENT ========== */}
        <div className="lextax-footer-main">
          <div className="lextax-footer-brand">
            <div className="lextax-footer-logo">
              <img 
                src={isDarkMode ? footerLogoDark : footerLogoLight} 
                alt="LexTax Logo" 
                className="lextax-footer-logo-image"
                onError={(e) => {
                  if (e.target.src === footerLogoDark) {
                    e.target.src = footerLogoLight;
                  }
                }}
              />
            </div>
            <p className="lextax-footer-description">
              Making Sri Lankan tax laws accessible and understandable for everyone. 
              Get accurate, simplified answers to your tax questions powered by AI.
            </p>
            
            <div className="lextax-footer-contact">
              {contactInfo.map((contact, index) => (
                <a 
                  key={index}
                  href={contact.href}
                  className="lextax-contact-item"
                >
                  <div className="lextax-contact-icon">
                    {contact.icon}
                  </div>
                  <span className="lextax-contact-text">{contact.text}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="lextax-footer-links">
            {footerSections.map((section, index) => (
              <div key={index} className="lextax-footer-section">
                <h4 className="lextax-footer-section-title">{section.title}</h4>
                <ul className="lextax-footer-section-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link.href} className="lextax-footer-link">
                        <span className="lextax-link-text">{link.label}</span>
                        <span className="lextax-link-arrow">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ========== DISCLAIMER SECTION ========== */}
        <div className="lextax-footer-disclaimer-section">
          <div className="lextax-disclaimer-content">
            <div className="lextax-disclaimer-icon">
              <FiShield />
            </div>
            <div className="lextax-disclaimer-text">
              <h5 className="lextax-disclaimer-title">Important Legal Notice</h5>
              <p className="lextax-disclaimer-description">
                This AI-powered tool provides general information about Sri Lankan tax laws for educational purposes only. 
                The information should not be considered as professional tax advice or legal counsel. Tax regulations are 
                subject to change, and individual circumstances may vary. Always consult with qualified tax professionals 
                or visit the official Inland Revenue Department for specific advice and current regulations.
              </p>
            </div>
          </div>
        </div>

        {/* ========== FOOTER BOTTOM ========== */}
        <div className="lextax-footer-bottom">
          <div className="lextax-footer-bottom-left">
            <div className="lextax-footer-copyright">
              <span className="lextax-copyright-text">© {currentYear} LexTax. All rights reserved.</span>
              <span className="lextax-footer-developer">
                <FiCode className="lextax-developer-icon" />
                Developed by P.M.T.D.B.Pathiraja | University Final Project
              </span>
            </div>
          </div>

          <div className="lextax-footer-bottom-right">
            <div className="lextax-social-links">
              <span className="lextax-social-title">Connect with us</span>
              <div className="lextax-social-icons">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    className="lextax-social-link"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ '--social-color': social.color }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;