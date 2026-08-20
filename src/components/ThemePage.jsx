import React, { useState } from "react";
import "./ThemePage.css";

// Curated preset color palettes (minimalist swatches without text labels)
export const PRESET_COLORS = [
  { id: "midnight", name: "ጠፈር", color: "#090a10", isDark: true, orb1: "rgba(108, 92, 231, 0.3)", orb2: "rgba(253, 203, 110, 0.2)" },
  { id: "royal-purple", name: "ሮያል ፐርፕል", color: "#130826", isDark: true, orb1: "rgba(162, 155, 254, 0.3)", orb2: "rgba(232, 67, 147, 0.22)" },
  { id: "emerald", name: "ኤመራልድ", color: "#041c14", isDark: true, orb1: "rgba(0, 184, 148, 0.32)", orb2: "rgba(85, 239, 196, 0.2)" },
  { id: "ocean", name: "ውቅያኖስ", color: "#081326", isDark: true, orb1: "rgba(9, 132, 227, 0.3)", orb2: "rgba(0, 206, 201, 0.22)" },
  { id: "amber", name: "ወርቃማ", color: "#1a0f05", isDark: true, orb1: "rgba(255, 159, 67, 0.3)", orb2: "rgba(254, 202, 87, 0.22)" },
  { id: "rose", name: "ሮዝ ወይን", color: "#200d18", isDark: true, orb1: "rgba(253, 121, 168, 0.28)", orb2: "rgba(225, 112, 85, 0.2)" },
  { id: "indigo", name: "ኢንዲጎ", color: "#0f172a", isDark: true, orb1: "rgba(99, 102, 241, 0.28)", orb2: "rgba(56, 189, 248, 0.2)" },
  { id: "carbon", name: "ካርቦን", color: "#18181b", isDark: true, orb1: "rgba(255, 255, 255, 0.15)", orb2: "rgba(161, 161, 170, 0.15)" },
  { id: "crimson", name: "ክሪምሰን", color: "#1f070a", isDark: true, orb1: "rgba(239, 68, 68, 0.28)", orb2: "rgba(244, 63, 94, 0.2)" },
  { id: "teal", name: "ቲል", color: "#041f1e", isDark: true, orb1: "rgba(20, 184, 166, 0.3)", orb2: "rgba(45, 212, 191, 0.2)" },
  { id: "slate-light", name: "ነጭ ብርሃን", color: "#f1f5f9", isDark: false, orb1: "rgba(99, 102, 241, 0.18)", orb2: "rgba(14, 165, 233, 0.15)" },
  { id: "cream-light", name: "ክሬም", color: "#fefce8", isDark: false, orb1: "rgba(234, 179, 8, 0.18)", orb2: "rgba(249, 115, 22, 0.15)" },
];

export default function ThemePage({
  onBack,
  currentColor,
  onSelectColor,
  isAnimationEnabled,
  onToggleAnimation,
  isDarkMode,
}) {
  const [customColor, setCustomColor] = useState(currentColor || "#090a10");

  const handleCustomColorChange = (e) => {
    const val = e.target.value;
    setCustomColor(val);
    onSelectColor(val);
  };

  const isCustomSelected = !PRESET_COLORS.some(
    (p) => p.color.toLowerCase() === currentColor.toLowerCase(),
  );

  return (
    <div className={`theme-page ${isDarkMode ? "dark" : "light"}`}>
      {/* Top Header with Back Navigation */}
      <div className="theme-page-header">
        <button
          className="theme-back-button"
          onClick={onBack}
          aria-label="ተመለስ"
        >
          <span className="theme-back-arrow">←</span>
          <span className="theme-back-text">ተመለስ</span>
        </button>

        <div className="theme-page-title-badge">
          <span className="theme-header-icon">🎨</span>
          <span className="theme-header-title">የጀርባ ገጽታ</span>
        </div>

        {/* Empty placeholder for balanced centering */}
        <div className="w-16" />
      </div>

      {/* Scrollable Settings Content */}
      <div className="theme-page-content">
        {/* Animation Toggle Card */}
        <div className="theme-card">
          <div className="theme-card-left">
            <div className="theme-card-icon-wrap">✨</div>
            <div className="theme-card-info">
              <span className="theme-card-title">የጀርባ አኒሜሽን</span>
              <span className="theme-card-sub">ተንሳፋፊ የብርሃን እንቅስቃሴ</span>
            </div>
          </div>
          <button
            className={`theme-switch ${isAnimationEnabled ? "active" : ""}`}
            onClick={onToggleAnimation}
            role="switch"
            aria-checked={isAnimationEnabled}
          >
            <span className="theme-switch-thumb" />
            <span className="theme-switch-state">
              {isAnimationEnabled ? "በርቷል" : "ጠፍቷል"}
            </span>
          </button>
        </div>

        {/* Color Swatches Grid (Unified with Rainbow Custom Box) */}
        <div className="theme-card flex-col items-stretch gap-3">
          <div className="theme-card-left">
            <div className="theme-card-icon-wrap">🌈</div>
            <div className="theme-card-info">
              <span className="theme-card-title">የጀርባ ቀለሞች</span>
              <span className="theme-card-sub">ቀለሙን በቀጥታ ይንኩ</span>
            </div>
          </div>

          <div className="theme-swatches-grid">
            {/* Rainbow Custom Color Box */}
            <label
              className={`theme-swatch-square rainbow-custom-box ${isCustomSelected ? "selected" : ""}`}
              aria-label="የራስዎ ቀለም"
              title="የራስዎ ቀለም"
            >
              <input
                type="color"
                className="theme-color-input-hidden"
                value={customColor}
                onChange={handleCustomColorChange}
              />
              <span className="rainbow-icon">🎨</span>
              {isCustomSelected && (
                <span className="theme-swatch-check text-white">✓</span>
              )}
              {/* Floating Tooltip with Color Name on Hover */}
              <span className="theme-swatch-tooltip">የራስዎ ቀለም</span>
            </label>

            {/* Presets */}
            {PRESET_COLORS.map((item) => {
              const isSelected =
                currentColor.toLowerCase() === item.color.toLowerCase();
              return (
                <button
                  key={item.id}
                  className={`theme-swatch-square ${isSelected ? "selected" : ""}`}
                  style={{ backgroundColor: item.color }}
                  onClick={() => {
                    setCustomColor(item.color);
                    onSelectColor(item.color);
                  }}
                  aria-label={item.name}
                  title={item.name}
                >
                  {isSelected && (
                    <span
                      className="theme-swatch-check"
                      style={{
                        color: item.isDark ? "#fdcb6e" : "#4f46e5",
                      }}
                    >
                      ✓
                    </span>
                  )}
                  {/* Floating Tooltip with Color Name on Hover */}
                  <span className="theme-swatch-tooltip">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply / Back Button */}
        <button className="theme-done-action-btn" onClick={onBack}>
          አስቀምጥ
        </button>

        {/* Bottom spacing */}
        <div className="h-6 flex-shrink-0" />
      </div>
    </div>
  );
}
