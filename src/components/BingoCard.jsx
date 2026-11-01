import React, { useState, useMemo, useEffect } from "react";
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

  // Automatic Bingo Win Detection (Rows, Columns, Diagonals)
  const winResult = useMemo(() => {
    if (!columns || columns.length < 5) return { hasWon: false, winningKeys: new Set() };
    const isMarked = (r, c) => {
      const val = columns[c][r];
      return (
        val === "FREE" ||
        val === "Free" ||
        val === 0 ||
        (r === 2 && c === 2) ||
        calledNumbers.includes(Number(val))
      );
    };

    const winningKeys = new Set();
    let hasWon = false;

    // Check all 5 rows
    for (let r = 0; r < 5; r++) {
      let rowWon = true;
      for (let c = 0; c < 5; c++) {
        if (!isMarked(r, c)) { rowWon = false; break; }
      }
      if (rowWon) {
        hasWon = true;
        for (let c = 0; c < 5; c++) winningKeys.add(`${r}-${c}`);
      }
    }

    // Check all 5 columns
    for (let c = 0; c < 5; c++) {
      let colWon = true;
      for (let r = 0; r < 5; r++) {
        if (!isMarked(r, c)) { colWon = false; break; }
      }
      if (colWon) {
        hasWon = true;
        for (let r = 0; r < 5; r++) winningKeys.add(`${r}-${c}`);
      }
    }

    // Check main diagonal (top-left to bottom-right)
    let diag1Won = true;
    for (let i = 0; i < 5; i++) {
      if (!isMarked(i, i)) { diag1Won = false; break; }
    }
    if (diag1Won) {
      hasWon = true;
      for (let i = 0; i < 5; i++) winningKeys.add(`${i}-${i}`);
    }

    // Check anti-diagonal (top-right to bottom-left)
    let diag2Won = true;
    for (let i = 0; i < 5; i++) {
      if (!isMarked(i, 4 - i)) { diag2Won = false; break; }
    }
    if (diag2Won) {
      hasWon = true;
      for (let i = 0; i < 5; i++) winningKeys.add(`${i}-${4 - i}`);
    }

    return { hasWon, winningKeys };
  }, [columns, calledNumbers]);

  // Haptic celebration on victory
  useEffect(() => {
    if (winResult.hasWon && typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 100, 50, 250]);
      } catch {
        // Fallback
      }
    }
  }, [winResult.hasWon]);

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
  const isDual = totalCards > 1;

  return (
    <div
      className={`w-full h-full flex flex-col rounded-2xl backdrop-blur-xl ${
        isDual ? "dual-card p-[clamp(6px,1.2vw,12px)]" : "single-card p-[clamp(8px,1.8vw,16px)]"
      } overflow-hidden shadow-2xl transition-all duration-300 ${
        winResult.hasWon
          ? isDark
            ? "bg-[rgba(20,28,40,0.85)] border-2 border-emerald-400/60 shadow-emerald-500/20"
            : "bg-white/95 border-2 border-emerald-500/60 shadow-emerald-500/20"
          : isDark
            ? "bg-[rgba(20,22,34,0.75)] border border-white/10"
            : "bg-white/85 border border-black/10"
      }`}
    >
      {/* Card Header with Win Banner */}
      <div className="flex justify-between items-center mb-[clamp(2px,0.5vw,6px)] flex-shrink-0 px-1">
        <span
          className={`font-extrabold text-[clamp(11px,1.5vw,16px)] tracking-wide whitespace-nowrap ${
            isDark ? "text-white/90" : "text-slate-800"
          }`}
        >
          የካርድ ቁጥር {displayCardNumber}
        </span>

        {winResult.hasWon && (
          <span className="px-2 py-0.5 rounded-full text-[clamp(10px,1.2vw,12px)] font-black bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-md animate-pulse flex items-center gap-1">
            <span>🏆</span>
            <span>ቢንጎ! (BINGO)</span>
          </span>
        )}
      </div>

      {/* Controls Row - 50/50 Layout */}
      <div className="flex items-center gap-[clamp(4px,0.6vw,8px)] mb-[clamp(2px,0.5vw,6px)] flex-shrink-0 w-full">
        {showSearch && (
          <input
            type="number"
            className={`flex-[0_0_50%] min-w-0 ${
              isDual ? "h-[clamp(26px,3.2vw,36px)]" : "h-[clamp(28px,4vw,42px)]"
            } rounded-[clamp(8px,1vw,12px)] px-[clamp(8px,1vw,14px)] text-[clamp(12px,1.3vw,16px)] font-semibold outline-none transition-all ${
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
            className={`flex-1 ${
              isDual ? "h-[clamp(26px,3.2vw,36px)]" : "h-[clamp(28px,4vw,42px)]"
            } rounded-[clamp(8px,1vw,12px)] text-[clamp(16px,2vw,22px)] font-extrabold transition-all active:scale-90 flex items-center justify-center ${
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
              className={`flex-1 ${
                isDual ? "h-[clamp(26px,3.2vw,36px)]" : "h-[clamp(28px,4vw,42px)]"
              } rounded-[clamp(8px,1vw,12px)] text-[clamp(18px,2.2vw,26px)] font-extrabold transition-all active:scale-90 flex items-center justify-center ${
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
                className={`flex-1 ${
                  isDual ? "h-[clamp(26px,3.2vw,36px)]" : "h-[clamp(28px,4vw,42px)]"
                } rounded-[clamp(8px,1vw,12px)] text-[clamp(18px,2.2vw,26px)] font-extrabold transition-all active:scale-90 flex items-center justify-center ${
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
        <div className="flex justify-center mb-[clamp(2px,0.4vw,6px)] flex-shrink-0">
          {headers.map((letter, idx) => (
            <div
              key={idx}
              className={`flex-1 ${
                isDual ? "h-[clamp(20px,2.4vw,28px)]" : "h-[clamp(22px,2.8vw,34px)]"
              } flex items-center justify-center`}
            >
              <span
                className={`font-black ${
                  isDual ? "text-[clamp(14px,1.8vw,20px)]" : "text-[clamp(16px,2.2vw,24px)]"
                } tracking-[clamp(1px,0.25vw,3px)] ${
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
        <div className="flex-1 flex flex-col gap-[clamp(3px,0.5vw,6px)] min-h-0 w-full">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center flex-1 min-h-0 gap-[clamp(3px,0.5vw,6px)] w-full"
            >
              {row.map((val, colIndex) => {
                const numVal = Number(val);
                const isMarked = calledNumbers.includes(numVal);
                const isWinning = winResult.winningKeys.has(`${rowIndex}-${colIndex}`);

                return (
                  <BingoCell
                    key={`${rowIndex}-${colIndex}`}
                    value={val}
                    isDarkMode={isDarkMode}
                    row={rowIndex}
                    col={colIndex}
                    isMarked={isMarked}
                    isWinning={isWinning}
                    isDualCard={isDual}
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
