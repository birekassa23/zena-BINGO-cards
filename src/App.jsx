import React, { useState, useCallback, useMemo, useEffect } from "react";
import { cardsData } from "./data/cardsData";
import Header from "./components/Header";
import BingoCard from "./components/BingoCard";
import Footer from "./components/Footer";

function App() {
  const [cardsList, setCardsList] = useState([cardsData[0]]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [resetTokens, setResetTokens] = useState({});
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [cardSize, setCardSize] = useState(300);
  const [toast, setToast] = useState(null);

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
      background: isDarkMode ? "#090a10" : "#f1f5f9",
    }),
    [isDarkMode],
  );

  const getCardNumber = useCallback(
    (card) => (card ? card.card_number || card.icard_number : null),
    [],
  );

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

  const clearCardMarks = useCallback((cardId) => {
    setCalledNumbers([]);
    setResetTokens((prev) => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 1,
    }));
    showToast("ምልክቶች ተሰርዘዋል", "info");
  }, [showToast]);

  const toggleCalledNumber = useCallback((num) => {
    if (num === "FREE") return;
    setCalledNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num],
    );
  }, []);

  const toggleTheme = useCallback(() => setIsDarkMode((prev) => !prev), []);

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
      className="h-screen w-screen max-w-[480px] mx-auto flex flex-col relative overflow-hidden"
      style={{ backgroundColor: theme.background }}
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

      {/* Header - Fixed at top */}
      <div
        className="flex justify-between items-center py-2 px-3 relative z-10 flex-shrink-0 border-b border-white/5"
        style={{ backgroundColor: theme.background }}
      >
        <Header theme={theme} isDarkMode={isDarkMode} />
        <button
          className="px-4 py-2 rounded-full border border-white/10 backdrop-blur-md font-bold text-sm transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.85)",
            color: isDarkMode ? "#fdcb6e" : "#4c1d95",
          }}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
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
                  onClearMarks={() => clearCardMarks(cardId)}
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
    </div>
  );
}

export default App;
