import React, { useState } from "react";
import "./ThemePage.css";

// Curated preset color palettes (minimalist swatches without text labels)
export const PRESET_COLORS = [
  { id: "midnight", name: "ጠፈር", color: "#090a10", isDark: true },
  { id: "royal-purple", name: "ሮያል ፐርፕል", color: "#130826", isDark: true },
  { id: "emerald", name: "ኤመራልድ", color: "#041c14", isDark: true },
  { id: "ocean", name: "ውቅያኖስ", color: "#081326", isDark: true },
  { id: "amber", name: "ወርቃማ", color: "#1a0f05", isDark: true },
  { id: "rose", name: "ሮዝ ወይን", color: "#200d18", isDark: true },
  { id: "indigo", name: "ኢንዲጎ", color: "#0f172a", isDark: true },
  { id: "carbon", name: "ካርቦን", color: "#18181b", isDark: true },
  { id: "crimson", name: "ክሪምሰን", color: "#1f070a", isDark: true },
  { id: "teal", name: "ቲል", color: "#041f1e", isDark: true },
  { id: "slate-light", name: "ነጭ ብርሃን", color: "#f1f5f9", isDark: false },
  { id: "cream-light", name: "ክሬም", color: "#fefce8", isDark: false },
];

export default function ThemePage({
  onBack,
  currentColor,
  onSelectColor,
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
