import React, { useState, useMemo } from "react";
import "./ThemePage.css";

// 12 Curated, highly distinct presets (8 rich darks, 4 clean lights) -> perfect 4x3 grid
export const PRESET_COLORS = [
  // 8 Rich & Distinct Dark Themes
  { id: "midnight", name: "ጠፈር (Midnight)", color: "#090a10", isDark: true },
  { id: "royal-purple", name: "ሮያል ፐርፕል (Purple)", color: "#241242", isDark: true },
  { id: "emerald", name: "ኤመራልድ (Emerald)", color: "#0b3b24", isDark: true },
  { id: "ocean", name: "ውቅያኖስ (Ocean)", color: "#0f2d59", isDark: true },
  { id: "crimson", name: "ክሪምሰን (Crimson)", color: "#45101d", isDark: true },
  { id: "amber", name: "ወርቃማ (Amber)", color: "#3d260c", isDark: true },
  { id: "indigo", name: "ኢንዲጎ (Indigo)", color: "#1a234a", isDark: true },
  { id: "teal", name: "ቲል (Teal)", color: "#0b3d3b", isDark: true },
  // 4 Elegant Light Themes
  { id: "slate-light", name: "ነጭ ብርሃን (Slate)", color: "#f1f5f9", isDark: false },
  { id: "cream-light", name: "ክሬም (Cream)", color: "#fefce8", isDark: false },
  { id: "rose-light", name: "ሮዝ ብርሃን (Rose)", color: "#fdf2f8", isDark: false },
  { id: "sky-light", name: "ሰማያዊ ብርሃን (Sky)", color: "#f0f9ff", isDark: false },
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

  const isCustomSelected = useMemo(
    () => !PRESET_COLORS.some(
      (p) => p.color.toLowerCase() === currentColor.toLowerCase(),
    ),
    [currentColor],
  );

  const activeColorName = useMemo(() => {
    const match = PRESET_COLORS.find(
      (p) => p.color.toLowerCase() === currentColor.toLowerCase(),
    );
    return match ? match.name : `የራስዎ (${currentColor.toUpperCase()})`;
  }, [currentColor]);

  const darkPresets = useMemo(() => PRESET_COLORS.filter((p) => p.isDark), []);
  const lightPresets = useMemo(() => PRESET_COLORS.filter((p) => !p.isDark), []);

  const renderSwatch = (item) => {
    const isSelected = currentColor.toLowerCase() === item.color.toLowerCase();
    return (
      <button
        key={item.id}
        type="button"
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
        <span className="theme-swatch-tooltip">{item.name}</span>
      </button>
    );
  };

  return (
    <div className={`theme-page ${isDarkMode ? "dark" : "light"}`}>
      {/* Symmetrical Header */}
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

        <button
          className="theme-reset-button"
          onClick={() => {
            onSelectColor("#090a10");
            setCustomColor("#090a10");
          }}
          title="ወደ ነባሪ መልስ"
        >
          ↻ ነባሪ
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="theme-page-content">
        {/* Live Card Preview */}
        <div className="theme-preview-card">
          <div className="theme-preview-header">
            <span className="theme-preview-label">የቀለም ቅድመ-ዕይታ</span>
            <span className="theme-preview-badge">{activeColorName}</span>
          </div>

          <div
            className="theme-preview-board"
            style={{ backgroundColor: currentColor }}
          >
            <div className={`theme-mini-card ${isDarkMode ? "dark" : "light"}`}>
              <div className="theme-mini-card-header">
                <span>#1 · ዘና BINGO</span>
                <span className="theme-mini-win-badge">🏆 BINGO!</span>
              </div>
              <div className="theme-mini-grid">
                <span className="mini-col-header">B</span>
                <span className="mini-col-header">I</span>
                <span className="mini-col-header">N</span>
                <span className="mini-col-header">G</span>
                <span className="mini-col-header">O</span>

                <span className="mini-cell marked">12</span>
                <span className="mini-cell">27</span>
                <span className="mini-cell marked">35</span>
                <span className="mini-cell">51</span>
                <span className="mini-cell marked">64</span>

                <span className="mini-cell">8</span>
                <span className="mini-cell marked">19</span>
                <span className="mini-cell free">★</span>
                <span className="mini-cell marked">48</span>
                <span className="mini-cell">72</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preset Colors Card (Symmetrical 4x3 Grid) */}
        <div className="theme-card flex-col items-stretch gap-3">
          <div className="theme-card-left">
            <div className="theme-card-icon-wrap">🌈</div>
            <div className="theme-card-info">
              <span className="theme-card-title">የተመረጡ ቀለሞች</span>
              <span className="theme-card-sub">የማታ እና የቀን ገጽታዎች</span>
            </div>
          </div>

          {/* Dark Tones (8) */}
          <div className="theme-palette-section">
            <div className="theme-palette-label">🌙 የማታ ገጽታዎች (Dark)</div>
            <div className="theme-swatches-grid">
              {darkPresets.map((item) => renderSwatch(item))}
            </div>
          </div>

          {/* Light Tones (4) */}
          <div className="theme-palette-section mt-1">
            <div className="theme-palette-label">☀️ የቀን ገጽታዎች (Light)</div>
            <div className="theme-swatches-grid">
              {lightPresets.map((item) => renderSwatch(item))}
            </div>
          </div>
        </div>

        {/* Dedicated Custom Color Picker Card */}
        <div className={`theme-card theme-custom-card ${isCustomSelected ? "custom-active" : ""}`}>
          <div className="theme-card-left">
            <div className="theme-card-icon-wrap theme-rainbow-icon-wrap">🎨</div>
            <div className="theme-card-info">
              <span className="theme-card-title">የራስዎ ቀለም (Custom Color)</span>
              <span className="theme-card-sub">የፈለጉትን ቀለም በነጻነት ይምረጡ</span>
            </div>
          </div>

          <label className="theme-custom-picker-label" title="ቀለም ይምረጡ">
            <input
              type="color"
              className="theme-color-input-hidden"
              value={customColor}
              onChange={handleCustomColorChange}
            />
            <div
              className={`theme-custom-swatch-box ${isCustomSelected ? "selected" : ""}`}
              style={{ backgroundColor: customColor }}
            >
              <span className="theme-custom-hex-text">
                {customColor.toUpperCase()}
              </span>
              <span className="theme-custom-edit-pen">✏️</span>
            </div>
          </label>
        </div>

        {/* Apply & Return Button */}
        <button className="theme-done-action-btn" onClick={onBack}>
          ተግብር (Done)
        </button>

        <div className="h-4 flex-shrink-0" />
      </div>
    </div>
  );
}
