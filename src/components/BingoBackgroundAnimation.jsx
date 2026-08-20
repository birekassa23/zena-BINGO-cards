import React from "react";
import "./BingoBackgroundAnimation.css";

export default function BingoBackgroundAnimation({ isDarkMode }) {
  return (
    <div
      className={`bingo-animated-bg ${isDarkMode ? "dark" : "light"}`}
      aria-hidden="true"
    >
      {/* Floating Bingo Ball B-12 */}
      <div className="b-ball ball-b pos-1">
        <div className="b-ball-inner">
          <span className="b-letter">B</span>
          <span className="b-num">12</span>
        </div>
      </div>

      {/* Floating Bingo Ball I-27 */}
      <div className="b-ball ball-i pos-2">
        <div className="b-ball-inner">
          <span className="b-letter">I</span>
          <span className="b-num">27</span>
        </div>
      </div>

      {/* Floating Bingo Ball N-41 */}
      <div className="b-ball ball-n pos-3">
        <div className="b-ball-inner">
          <span className="b-letter">N</span>
          <span className="b-num">41</span>
        </div>
      </div>

      {/* Floating Bingo Ball G-58 */}
      <div className="b-ball ball-g pos-4">
        <div className="b-ball-inner">
          <span className="b-letter">G</span>
          <span className="b-num">58</span>
        </div>
      </div>

      {/* Floating Bingo Ball O-73 */}
      <div className="b-ball ball-o pos-5">
        <div className="b-ball-inner">
          <span className="b-letter">O</span>
          <span className="b-num">73</span>
        </div>
      </div>

      {/* Floating Lucky Star Ball */}
      <div className="b-ball ball-star pos-6">
        <div className="b-ball-inner star-inner">★</div>
      </div>

      {/* Floating Dice Element */}
      <div className="b-float-item pos-7">🎲</div>

      {/* Floating Bingo Ball B-7 */}
      <div className="b-ball ball-b pos-8">
        <div className="b-ball-inner">
          <span className="b-letter">B</span>
          <span className="b-num">7</span>
        </div>
      </div>

      {/* Floating Bingo Ball O-65 */}
      <div className="b-ball ball-o pos-9">
        <div className="b-ball-inner">
          <span className="b-letter">O</span>
          <span className="b-num">65</span>
        </div>
      </div>

      {/* Floating Bingo Ball G-49 */}
      <div className="b-ball ball-g pos-10">
        <div className="b-ball-inner">
          <span className="b-letter">G</span>
          <span className="b-num">49</span>
        </div>
      </div>
    </div>
  );
}
