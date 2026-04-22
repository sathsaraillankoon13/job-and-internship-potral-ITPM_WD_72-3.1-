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
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-black text-white shadow-md">
            CB
          </div>
          <span className="footer-brand-text">
            Career<span className="footer-brand-accent">Bridge</span>
          </span>
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