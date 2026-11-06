import React, { useState, useCallback, useMemo, useEffect } from "react";
import Header from "./components/Header";
import BingoCard from "./components/BingoCard";
import Footer from "./components/Footer";
import ThemePage from "./components/ThemePage";
import { useBingoGame, getCardNumber } from "./hooks/useBingoGame";

function App() {
  const {
    currentPage,
    setCurrentPage,
    toast,
    soundOn,
    toggleSound,
    backgroundColor,
    isDarkMode,
    handleSelectColor,
    toggleQuickTheme,
    cardsList,
    calledNumbers,
    toggleCalledNumber,
    handleReplaceCard,
    handleAddCard,
    removeCard,
    confirmClearOpen,
    handleRequestClear,
    handleConfirmClear,
    handleCancelClear,
    handleCardWin,
  } = useBingoGame();

  const [cardSize, setCardSize] = useState(300);

  const theme = useMemo(
    () => ({
      background: backgroundColor,
    }),
    [backgroundColor],
  );

  // Responsive card size calculation based on available screen space
  const calculateCardSize = useCallback(() => {
    const maxWidth = Math.min(window.innerWidth - 32, 460);
    const headerHeight = 70;
    const padding = 40;
    const gap = 16;
    const cardCount = cardsList.length;

    const availableHeight = window.innerHeight - headerHeight - padding;
    const maxCardHeight = (availableHeight - (cardCount - 1) * gap) / cardCount;

    const size = Math.min(maxWidth, maxCardHeight, 460);
    return Math.max(size, 200);
  }, [cardsList.length]);

  useEffect(() => {
    const updateSize = () => {
      setCardSize(calculateCardSize());
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [calculateCardSize]);

  return (
    <div
      className="w-screen max-w-[480px] mx-auto flex flex-col relative overflow-hidden transition-colors duration-500 pt-[env(safe-area-inset-top,0px)]"
      style={{
        backgroundColor: theme.background,
        color: isDarkMode ? "#ffffff" : "#1e293b",
        height: "100dvh",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl backdrop-blur-xl shadow-2xl border flex items-center gap-2 animate-bounce text-sm font-semibold transition-all"
          style={{
            backgroundColor: isDarkMode
              ? "rgba(20, 24, 40, 0.9)"
              : "rgba(255, 255, 255, 0.95)",
            borderColor:
              toast.type === "warning"
                ? "rgba(239, 68, 68, 0.4)"
                : toast.type === "success"
                  ? "rgba(34, 197, 94, 0.4)"
                  : "rgba(99, 102, 241, 0.4)",
            color: isDarkMode ? "#ffffff" : "#1e293b",
          }}
        >
          <span>
            {toast.type === "warning"
              ? "⚠️"
              : toast.type === "success"
                ? "✅"
                : "ℹ️"}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* PAGE 1: BINGO CARDS VIEW */}
      {currentPage === "cards" ? (
        <>
          {/* Header - Fixed at top */}
          <div
            className="flex justify-between items-center py-2 px-3 relative z-10 flex-shrink-0 border-b border-white/5"
            style={{ backgroundColor: "transparent" }}
          >
            <Header theme={theme} isDarkMode={isDarkMode} />

            {/* Header Controls: Sound Toggle, Palette Page & Quick Theme */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Sound Toggle (🔊 / 🔇) */}
              <button
                className="w-9 h-9 rounded-full border border-white/10 backdrop-blur-md font-bold text-base flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.85)",
                  color: isDarkMode ? "#ffffff" : "#1e293b",
                }}
                onClick={toggleSound}
                aria-label={soundOn ? "ድምፅ አጥፋ (Mute)" : "ድምፅ አብራ (Unmute)"}
                title={soundOn ? "ድምፅ በርቷል (Sound ON)" : "ድምፅ ጠፍቷል (Sound OFF)"}
              >
                {soundOn ? "🔊" : "🔇"}
              </button>

              {/* Navigate to Theme Settings Page */}
              <button
                className="w-9 h-9 rounded-full border border-white/10 backdrop-blur-md font-bold text-base flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.85)",
                  color: isDarkMode ? "#ffffff" : "#1e293b",
                }}
                onClick={() => setCurrentPage("theme")}
                aria-label="የጀርባ ገጽታ ማስተካከያ"
                title="የጀርባ ገጽታ ማስተካከያ (Background Settings)"
              >
                🎨
              </button>

              {/* Quick Theme Toggle */}
              <button
                className="px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.85)",
                  color: isDarkMode ? "#fdcb6e" : "#4c1d95",
                }}
                onClick={toggleQuickTheme}
                aria-label="Toggle theme"
              >
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
            <div className="flex flex-col items-center gap-4 py-4 px-3 w-full max-w-[460px] mx-auto min-h-full">
              {/* Cards Stack */}
              {cardsList.map((card, index) => {
                const cardId = getCardNumber(card);
                const showAddButton = index === 0 && cardsList.length < 2;

                return (
                  <div
                    key={`${cardId}-${index}`}
                    className="w-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      height: cardSize,
                      maxHeight: "460px",
                    }}
                  >
                    <BingoCard
                      card={card}
                      isDarkMode={isDarkMode}
                      onRemove={() => removeCard(index)}
                      onClearMarks={() => handleRequestClear(cardId)}
                      onReplace={(num) => handleReplaceCard(index, num)}
                      onAdd={showAddButton ? handleAddCard : null}
                      showSearch={true}
                      calledNumbers={calledNumbers}
                      onToggleNumber={toggleCalledNumber}
                      totalCards={cardsList.length}
                      onWinStateChange={handleCardWin}
                    />
                  </div>
                );
              })}

              {/* Footer aligned perfectly with card width constraints */}
              <div className="w-full">
                <Footer isDarkMode={isDarkMode} />
              </div>

              {/* Extra bottom padding for comfortable scrolling above the 3-button navigation bar */}
              <div
                className="h-8 flex-shrink-0"
                style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              />
            </div>
          </div>
        </>
      ) : (
        /* PAGE 2: STANDALONE THEME & BACKGROUND SETTINGS PAGE */
        <ThemePage
          onBack={() => setCurrentPage("cards")}
          currentColor={backgroundColor}
          onSelectColor={handleSelectColor}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Confirmation Modal for Clearing Board */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-xs rounded-3xl p-5 shadow-2xl border flex flex-col items-center text-center gap-3 backdrop-blur-2xl transition-all"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(22, 27, 46, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
              borderColor: isDarkMode
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.1)",
              color: isDarkMode ? "#ffffff" : "#1e293b",
            }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-red-500/15 text-red-500">
              ⚠️
            </div>
            <div className="font-extrabold text-base">ምልክቶችን ማጥፋት ይፈልጋሉ?</div>
            <div
              className="text-xs leading-relaxed"
              style={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}
            >
              ይህ እርምጃ የተመረጡትን {calledNumbers.length} ቁጥሮች በሙሉ ያጠፋል።
            </div>
            <div className="flex gap-2 w-full mt-2">
              <button
                onClick={handleCancelClear}
                className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.05)",
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.08)",
                  color: isDarkMode ? "#cbd5e1" : "#475569",
                }}
              >
                ይቅር (Cancel)
              </button>
              <button
                onClick={handleConfirmClear}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all active:scale-95"
              >
                አዎ፣ አጥፋ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
