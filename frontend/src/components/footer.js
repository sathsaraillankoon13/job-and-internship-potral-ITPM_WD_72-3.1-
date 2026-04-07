import React from 'react';
import { Zap } from 'lucide-react';
import '../styles/Footer.css';

import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Brand & Logo */}
        <div className="footer-brand group">
          <div className="footer-brand-icon">
            <img src={logo} alt="CareerBridge Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="footer-brand-text">
            Career<span className="footer-brand-accent">Bridge</span>
          </span>
        </div>

        {/* Links */}
        <div className="footer-links">
          <a href="#" className="footer-link">Job Listing</a>
          <a href="#" className="footer-link">Skill Selection</a>
          <a href="#" className="footer-link">Mock Interviews</a>
          <a href="#" className="footer-link">Career Match</a>
        </div>

        {/* Copyright */}
        <p className="footer-copyright">
          © 2024 Career Bridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;