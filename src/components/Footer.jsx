import React, { useState } from "react";
import "./Footer.css";
import developerImg from "../developer.png";

export default function Footer({ isDarkMode }) {
  const [imageError, setImageError] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${isDarkMode ? "dark" : "light"}`}>
      <div className="footer-content">
        {/* Developer Avatar */}
        <div className="footer-avatar-wrapper">
          {!imageError ? (
            <img
              src={developerImg}
              alt="Birehanu Kassa - Developer"
              className="footer-avatar"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="footer-avatar-fallback">BK</div>
          )}
          <div className="footer-avatar-glow"></div>
          <div className="footer-avatar-ring"></div>
        </div>

        {/* Developer Info */}
        <div className="footer-info">
          <div className="footer-name-wrapper">
            <span className="footer-name">Birehanu Kassa</span>
            <span className="footer-badge">
              <span className="badge-dot"></span>
              👨‍💻 Developer
            </span>
          </div>

          {/* Contact Links - Phone & Email only */}
          <div className="footer-contacts">
            <a
              href="tel:+251917828062"
              className="footer-contact"
              aria-label="Call Birehanu Kassa"
            >
              <span className="footer-icon">📞</span>
              <span>+251 917 828 062</span>
            </a>
            <a
              href="mailto:birekassa17828062@gmail.com"
              className="footer-contact"
              aria-label="Email Birehanu Kassa"
            >
              <span className="footer-icon">✉️</span>
              <span>birekassa17828062@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <span className="footer-copy">© {currentYear} ዘና BINGO Cards</span>
        <span className="footer-version">
          <span className="version-dot"></span>
          v1.0.0
        </span>
      </div>
    </footer>
  );
}
