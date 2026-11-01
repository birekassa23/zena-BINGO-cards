import React, { useState, useCallback, useMemo, useEffect } from "react";
import { cardsData } from "./data/cardsData";
import Header from "./components/Header";
import BingoCard from "./components/BingoCard";
import Footer from "./components/Footer";
import ThemePage from "./components/ThemePage";

// Helper to determine if a color is light or dark for optimal contrast
function isColorDark(hex) {
  if (!hex || typeof hex !== "string" || hex.charAt(0) !== "#") return true;
  let c = hex.substring(1);
  if (c.length === 3) {
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 140;
}

function App() {
  const [currentPage, setCurrentPage] = useState("cards"); // 'cards' | 'theme'
  const [cardsList, setCardsList] = useState([cardsData[0]]);
  const [backgroundColor, setBackgroundColor] = useState(
    () => localStorage.getItem("zena_bg_color") || "#090a10",
  );
  const [resetTokens, setResetTokens] = useState({});
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [cardSize, setCardSize] = useState(300);
  const [toast, setToast] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [pendingClearCardId, setPendingClearCardId] = useState(null);

  const isDarkMode = useMemo(() => isColorDark(backgroundColor), [backgroundColor]);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const theme = useMemo(
    () => ({
      background: backgroundColor,
    }),
    [backgroundColor],
  );

  const getCardNumber = useCallback(
    (card) => (card ? card.card_number || card.icard_number : null),
    [],
  );

  const handleSelectColor = useCallback((color) => {
    setBackgroundColor(color);
    localStorage.setItem("zena_bg_color", color);
  }, []);

  const toggleQuickTheme = useCallback(() => {
    const nextColor = isDarkMode ? "#f1f5f9" : "#090a10";
    handleSelectColor(nextColor);
    showToast(isDarkMode ? "የቀን ገጽታ (Light)" : "የማታ ገጽታ (Dark)", "info");
  }, [isDarkMode, handleSelectColor, showToast]);

  const handleReplaceCard = useCallback(
    (index, searchNumber) => {
      const foundCard = cardsData.find(
        (card) => getCardNumber(card) === Number(searchNumber),
      );
      if (!foundCard) {
        showToast(`ካርቴላ ቁጥር ${searchNumber} አልተገኘም`, "warning");
        return;
      }
      setCardsList((prev) => {
        const updated = [...prev];
        updated[index] = foundCard;
        return updated;
      });
      showToast(`ወደ ካርቴላ ቁጥር ${searchNumber} ተቀይሯል`, "success");
    },
    [getCardNumber, showToast],
  );

  const handleAddCard = useCallback(() => {
    if (cardsList.length >= 2) {
      showToast("ከ 2 በላይ ካርቴላ መክፈት አይቻልም", "info");
      return;
    }
    const openNumbers = new Set(cardsList.map((c) => getCardNumber(c)));
    const sortedCards = [...cardsData].sort(
      (a, b) => getCardNumber(a) - getCardNumber(b),
    );
    const availableCard = sortedCards.find(
      (c) => !openNumbers.has(getCardNumber(c)),
    );
    if (!availableCard) {
      showToast("ሁሉም ካርቴላዎች ተከፍተዋል", "info");
      return;
    }
    setCardsList((prev) => [...prev, availableCard]);
    showToast(`ካርቴላ ቁጥር ${getCardNumber(availableCard)} ተጨምሯል`, "success");
  }, [cardsList, getCardNumber, showToast]);

  const removeCard = useCallback(
    (index) => {
      if (cardsList.length <= 1) {
        showToast("ቢያንስ አንድ ካርቴላ መኖር አለበት", "info");
        return;
      }
      const removedCardNumber = getCardNumber(cardsList[index]);
      setCardsList((prev) => prev.filter((_, idx) => idx !== index));
      showToast(`ካርቴላ ቁጥር ${removedCardNumber} ተዘግቷል`, "info");
    },
    [cardsList, getCardNumber, showToast],
  );

  const handleRequestClear = useCallback(
    (cardId) => {
      if (calledNumbers.length === 0) {
        showToast("ምንም ምልክት አልተደረገም", "info");
        return;
      }
      setPendingClearCardId(cardId);
      setConfirmClearOpen(true);
    },
    [calledNumbers.length, showToast],
  );

  const handleConfirmClear = useCallback(() => {
    setCalledNumbers([]);
    if (pendingClearCardId) {
      setResetTokens((prev) => ({
        ...prev,
        [pendingClearCardId]: (prev[pendingClearCardId] || 0) + 1,
      }));
    }
    setConfirmClearOpen(false);
    setPendingClearCardId(null);
    showToast("ምልክቶች በሙሉ ተሰርዘዋል", "success");
  }, [pendingClearCardId, showToast]);

  const handleCancelClear = useCallback(() => {
    setConfirmClearOpen(false);
    setPendingClearCardId(null);
  }, []);

  const toggleCalledNumber = useCallback((num) => {
    if (num === "FREE") return;
    setCalledNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num],
    );
  }, []);

  // Calculate card size
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
      className="h-screen w-screen max-w-[480px] mx-auto flex flex-col relative overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: theme.background,
        color: isDarkMode ? "#ffffff" : "#1e293b",
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

            {/* Header Controls: Palette Page & Quick Theme */}
            <div className="flex items-center gap-2">
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
                className="px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md"
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
                const resetToken = resetTokens[cardId] || 0;
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
                      key={`${cardId}-version-${resetToken}`}
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
                    />
                  </div>
                );
              })}

              {/* Footer aligned perfectly with card width constraints */}
              <div className="w-full">
                <Footer isDarkMode={isDarkMode} />
              </div>

              {/* Extra bottom padding for comfortable scrolling */}
              <div className="h-6 flex-shrink-0" />
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
