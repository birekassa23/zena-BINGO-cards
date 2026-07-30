import React from "react";

export default function BingoCell({
  value,
  theme,
  isDarkMode,
  row,
  col,
  isMarked,
  onPress,
}) {
  const isFree =
    value === "FREE" ||
    value === "Free" ||
    value === 0 ||
    (row === 2 && col === 2);

  const isMarkedState = isFree || isMarked;

  const handleClick = () => {
    if (isFree) return;
    if (onPress) onPress();
  };

  // Determine the theme class
  const themeClass = isDarkMode ? "dark" : "light";

  // Determine if marked
  const markedClass = isMarkedState ? "marked" : "";

  // Determine if free
  const freeClass = isFree ? "free" : "";

  // Build className string
  const cellClassName =
    `bingo-cell ${themeClass} ${markedClass} ${freeClass}`.trim();

  return (
    <div className={cellClassName} onClick={handleClick}>
      {isFree ? (
        <span className="cell-icon">★</span>
      ) : (
        <span className="cell-value">{value}</span>
      )}
    </div>
  );
}
