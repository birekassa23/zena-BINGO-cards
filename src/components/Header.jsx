import React from "react";
import "./Header.css";

export default function Header({ theme, isDarkMode }) {
  return (
    <header className={`header ${isDarkMode ? "dark" : "light"}`}>
      <div className="header-content">
        <span className="brand-accent">ዘና</span>
        <span className="brand-text">BINGO</span>
      </div>
    </header>
  );
}
