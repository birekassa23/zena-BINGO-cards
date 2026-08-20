import React, { useState } from "react";
import BingoCell from "./BingoCell";

export default function BingoCard({
  card,
  isDarkMode,
  onRemove,
  onClearMarks,
  onReplace,
  onAdd,
  showSearch = true,
  onToggleNumber,
  calledNumbers = [],
  totalCards = 1,
}) {
  const headers = ["B", "I", "N", "G", "O"];
  const [searchValue, setSearchValue] = useState("");

  if (!card || !card.numbers) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-xl">
        <div className="text-gray-400 font-semibold">No card data found</div>
      </div>
    );
  }

  const displayCardNumber = card.card_number || card.icard_number;
  const columns = card.numbers;

  const rows = columns[0].map((_, rowIndex) =>
    columns.map((col) => col[rowIndex]),
  );

  const currentCardNumber = displayCardNumber;
  const enteredNum = parseInt(searchValue, 10);
  const isEmpty = searchValue.trim() === "";
  const isSameCard =
    !isEmpty && !isNaN(enteredNum) && enteredNum === currentCardNumber;

  const isActionActive = !isEmpty && !isSameCard && !isNaN(enteredNum);

  const handleActionPress = () => {
    const num = parseInt(searchValue, 10);
    if (isEmpty || num === currentCardNumber) {
      if (onClearMarks) onClearMarks();
      setSearchValue("");
    } else if (!isNaN(num) && onReplace) {
      onReplace(num);
      setSearchValue("");
    }
  };

  const handleAddPress = () => {
    if (onAdd) {
      onAdd();
      setSearchValue("");
    }
  };

  const isDark = isDarkMode;
  const showAddButton = onAdd && totalCards < 2;

  return (
    <div
      className={`w-full h-full flex flex-col rounded-2xl backdrop-blur-xl p-[clamp(8px,1.8vw,20px)] overflow-hidden shadow-2xl ${
        isDark
          ? "bg-[rgba(20,22,34,0.75)] border border-white/10"
          : "bg-white/85 border border-black/10"
      }`}
    >
      {/* Card Header */}
      <div className="flex justify-between items-center mb-[clamp(3px,0.6vw,8px)] flex-shrink-0 px-1">
        <span
          className={`font-extrabold text-[clamp(10px,1.4vw,16px)] tracking-[clamp(1px,0.2vw,2px)] uppercase whitespace-nowrap ${
            isDark ? "text-white/70" : "text-slate-800/90"
          }`}
        >
          {displayCardNumber} · ዘና BINGO
        </span>
      </div>

      {/* Controls Row - 50/50 Layout */}
      <div className="flex items-center gap-[clamp(4px,0.6vw,8px)] mb-[clamp(3px,0.6vw,8px)] flex-shrink-0 w-full">
        {showSearch && (
          <input
            type="number"
            className={`flex-[0_0_50%] min-w-0 h-[clamp(28px,4vw,44px)] rounded-[clamp(8px,1vw,12px)] px-[clamp(8px,1vw,14px)] text-[clamp(12px,1.3vw,16px)] font-semibold outline-none transition-all ${
              isDark
                ? "bg-white/5 text-white border border-white/10 placeholder:text-white/30"
                : "bg-black/5 text-slate-800 border border-black/10 placeholder:text-slate-400"
            }`}
            placeholder="ካርቴላ"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleActionPress();
              }
            }}
          />
        )}

        <div className="flex-[0_0_50%] flex gap-[clamp(4px,0.6vw,8px)] min-w-0">
          {/* Swap/Clear Button */}
          <button
            className={`flex-1 h-[clamp(28px,4vw,44px)] rounded-[clamp(8px,1vw,12px)] text-[clamp(16px,2vw,24px)] font-extrabold transition-all active:scale-90 flex items-center justify-center ${
              isActionActive
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/40 hover:scale-105"
                : isDark
                  ? "bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:scale-105"
                  : "bg-black/5 text-slate-800 border border-black/5 hover:bg-black/10 hover:scale-105"
            }`}
            onClick={handleActionPress}
            title={isActionActive ? "Replace Card" : "Clear Marks"}
          >
            ↻
          </button>

          {/* Add Button (+) or Remove Button (✕) */}
          {showAddButton ? (
            <button
              className={`flex-1 h-[clamp(28px,4vw,44px)] rounded-[clamp(8px,1vw,12px)] text-[clamp(20px,2.5vw,28px)] font-extrabold transition-all active:scale-90 flex items-center justify-center ${
                isDark
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30 hover:text-emerald-300 hover:scale-105"
                  : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 hover:bg-emerald-500/20 hover:text-emerald-700 hover:scale-105"
              }`}
              onClick={handleAddPress}
              title="Add Card"
              aria-label="Add card"
            >
              +
            </button>
          ) : (
            onRemove && (
              <button
                className={`flex-1 h-[clamp(28px,4vw,44px)] rounded-[clamp(8px,1vw,12px)] text-[clamp(20px,2.5vw,28px)] font-extrabold transition-all active:scale-90 flex items-center justify-center ${
                  isDark
                    ? "bg-red-500/15 text-red-400 border border-red-500/15 hover:bg-red-500/30 hover:text-white hover:scale-105"
                    : "bg-red-500/10 text-red-500 border border-red-500/15 hover:bg-red-500/20 hover:text-white hover:scale-105"
                }`}
                onClick={onRemove}
                aria-label="Remove card"
                title="Remove Card"
              >
                ✕
              </button>
            )
          )}
        </div>
      </div>

      {/* BINGO Grid */}
      <div className="flex-1 flex flex-col min-h-0 w-full">
        {/* Headers */}
        <div className="flex justify-center mb-[clamp(3px,0.5vw,8px)] flex-shrink-0">
          {headers.map((letter, idx) => (
            <div
              key={idx}
              className="flex-1 h-[clamp(24px,2.8vw,36px)] flex items-center justify-center"
            >
              <span
                className={`font-black text-[clamp(16px,2.2vw,24px)] tracking-[clamp(2px,0.3vw,4px)] ${
                  isDark
                    ? "text-amber-400 drop-shadow-[0_0_20px_rgba(253,203,110,0.2)]"
                    : "text-purple-900"
                }`}
              >
                {letter}
              </span>
            </div>
          ))}
        </div>

        {/* Grid Rows */}
        <div className="flex-1 flex flex-col gap-[clamp(4px,0.6vw,8px)] min-h-0 w-full">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center flex-1 min-h-0 gap-[clamp(4px,0.6vw,8px)] w-full"
            >
              {row.map((val, colIndex) => {
                const numVal = Number(val);
                const isMarked = calledNumbers.includes(numVal);

                return (
                  <BingoCell
                    key={`${rowIndex}-${colIndex}`}
                    value={val}
                    isDarkMode={isDarkMode}
                    row={rowIndex}
                    col={colIndex}
                    isMarked={isMarked}
                    onPress={() => onToggleNumber(numVal)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
