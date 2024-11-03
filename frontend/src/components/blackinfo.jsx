import React from 'react';
import '../styles/BlackInfo.css';

const BlackInfo = ({ username }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Grid Container */}
        <div className="footer-grid">
          
          {/* Social Media Section */}
          <div className="footer-section">
            <h3 className="footer-title">SOCIAL MEDIA</h3>
            <div className="footer-content">
              <a href="#" className="footer-link">
                <span>• Instagram</span>
              </a>
              <a href="#" className="footer-link">
                <span>• Facebook</span>
              </a>
              <a href="#" className="footer-link">
                <span>• Onlyfans</span>
              </a>
              <a href="#" className="footer-link">
                <span>• Website</span>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3 className="footer-title">CONTACT</h3>
            <div className="footer-content">
              <p className="footer-text">Email: bossArt@horas.com</p>
              <p className="footer-text">Tel: +66 92 606 1016</p>
            </div>
          </div>

          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title">ABOUT</h3>
            <div className="footer-content">
              <p className="footer-text">About Us</p>
              <p className="footer-text">Privacy Policy</p>
              <p className="footer-text">Terms of Service</p>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section">
            <h3 className="footer-title">NEWSLETTER</h3>
            <div className="footer-content">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="footer-input"
              />
              <button className="footer-button">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-divider">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} {username || 'Horas Company'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BlackInfo;