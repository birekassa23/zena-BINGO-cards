import React from "react";
import "./BingoCell.css";
import { IconStar } from "./Icons";

export default function BingoCell({
  value,
  isDarkMode,
  row,
  col,
  isMarked,
  onPress,
  isDualCard = false,
  isWinning = false,
}) {
  const isFree =
    value === "FREE" ||
    value === "Free" ||
    value === 0 ||
    (row === 2 && col === 2);

  const isMarkedState = isFree || isMarked;

  const handleClick = () => {
    if (isFree) return;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {
        // Non-blocking fallback
      }
    }
    if (onPress) onPress();
  };

  const themeClass = isDarkMode ? "dark" : "light";
  const markedClass = isMarkedState ? "marked" : "";
  const freeClass = isFree ? "free" : "";
  const winningClass = isWinning ? "winning-cell" : "";
  const dualClass = isDualCard ? "dual-cell" : "";

  const cellClassName =
    `bingo-cell ${themeClass} ${markedClass} ${freeClass} ${winningClass} ${dualClass}`.trim();

  return (
    <div
      className={cellClassName}
      onClick={handleClick}
      role="button"
      aria-label={isFree ? "Free Space" : `Number ${value}`}
      aria-pressed={isMarkedState}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {isFree ? (
        <span className="cell-icon flex items-center justify-center w-full h-full">
          <IconStar className="w-[60%] h-[60%]" />
        </span>
      ) : (
        <span className="cell-value">{value}</span>
      )}
    </div>
  );
}
