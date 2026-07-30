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

  const theme = useMemo(
    () => ({
      background: isDarkMode ? "#090a10" : "#f1f5f9",
      glowTop: isDarkMode
        ? "rgba(108, 92, 231, 0.28)"
        : "rgba(108, 92, 231, 0.15)",
      glowBottom: isDarkMode
        ? "rgba(253, 203, 110, 0.22)"
        : "rgba(253, 203, 110, 0.15)",
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
        alert(`Card #${searchNumber} does not exist.`);
        return;
      }
      setCardsList((prev) => {
        const updated = [...prev];
        updated[index] = foundCard;
        return updated;
      });
    },
    [getCardNumber],
  );

  const handleAddCard = useCallback(() => {
    if (cardsList.length >= 2) {
      alert("You can only have two cards on screen.");
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
      alert("All cards are already open.");
      return;
    }
    setCardsList((prev) => [...prev, availableCard]);
  }, [cardsList, getCardNumber]);

  const removeCard = useCallback(
    (index) => {
      if (cardsList.length <= 1) {
        alert("You must keep at least one card.");
        return;
      }
      setCardsList((prev) => prev.filter((_, idx) => idx !== index));
    },
    [cardsList.length],
  );

  const clearCardMarks = useCallback((cardId) => {
    setCalledNumbers([]);
    setResetTokens((prev) => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 1,
    }));
  }, []);

  const toggleCalledNumber = useCallback((num) => {
    if (num === "FREE") return;
    setCalledNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num],
    );
  }, []);

  const handleWinDetected = useCallback((winData) => {
    alert(`🎉 BINGO! You won on ${winData.matches[0].type}!`);
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

  // BINGO ball data
  const bingoBalls = [
    { id: 1, letter: "B", color: "bg-red-500" },
    { id: 2, letter: "I", color: "bg-yellow-400" },
    { id: 3, letter: "N", color: "bg-blue-400" },
    { id: 4, letter: "G", color: "bg-green-400" },
    { id: 5, letter: "O", color: "bg-purple-400" },
    { id: 6, letter: "B", color: "bg-red-500" },
    { id: 7, letter: "I", color: "bg-yellow-400" },
    { id: 8, letter: "N", color: "bg-blue-400" },
    { id: 9, letter: "G", color: "bg-green-400" },
    { id: 10, letter: "O", color: "bg-purple-400" },
    { id: 11, letter: "★", color: "bg-yellow-500" },
  ];

  return (
    <div
      className="h-screen w-screen max-w-[480px] mx-auto flex flex-col relative overflow-hidden"
      style={{ backgroundColor: theme.background }}
    >
      {/* Glow Effects */}
      <div
        className="fixed rounded-full pointer-events-none blur-[70px] transition-colors duration-500"
        style={{
          backgroundColor: theme.glowTop,
          top: "-180px",
          left: "-150px",
          width: "450px",
          height: "450px",
          animation: "floatGlow 12s ease-in-out infinite",
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none blur-[70px] transition-colors duration-500"
        style={{
          backgroundColor: theme.glowBottom,
          bottom: "-180px",
          right: "-150px",
          width: "500px",
          height: "500px",
          animation: "floatGlow 14s ease-in-out infinite reverse",
        }}
      />

      {/* BINGO Balls Animation Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {bingoBalls.map((ball, index) => {
          const positions = [
            "top-[5%] left-[5%] w-[60px] h-[60px]",
            "top-[15%] right-[8%] w-[45px] h-[45px]",
            "bottom-[20%] left-[2%] w-[70px] h-[70px]",
            "bottom-[5%] right-[5%] w-[50px] h-[50px]",
            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px]",
            "top-[30%] left-[15%] w-[55px] h-[55px]",
            "bottom-[40%] right-[10%] w-[35px] h-[35px]",
            "top-[10%] left-[35%] w-[65px] h-[65px]",
            "bottom-[10%] left-[30%] w-[48px] h-[48px]",
            "top-[45%] right-[20%] w-[42px] h-[42px]",
            "top-[5%] left-[45%] w-[35px] h-[35px]",
          ];
          const delays = [
            "0s",
            "2s",
            "4s",
            "1s",
            "3s",
            "5s",
            "6s",
            "7s",
            "8s",
            "9s",
            "1.5s",
          ];
          return (
            <div
              key={ball.id}
              className={`absolute rounded-full flex items-center justify-center font-black text-white shadow-lg opacity-[0.15] animate-float ${ball.color} ${positions[index]}`}
              style={{
                animationDuration: `${15 + index * 3}s`,
                animationDelay: delays[index],
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                boxShadow:
                  "inset -3px -3px 8px rgba(0,0,0,0.3), inset 3px 3px 8px rgba(255,255,255,0.3), 0 4px 15px rgba(0,0,0,0.2)",
                fontSize: index === 10 ? "20px" : "14px",
              }}
            >
              <span className="font-extrabold tracking-wide">
                {ball.letter}
              </span>
            </div>
          );
        })}
      </div>

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

      {/* Scrollable Content - Everything scrolls including footer */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        <div className="flex flex-col items-center gap-4 py-4 px-3 min-h-full">
          {/* Cards */}
          {cardsList.map((card, index) => {
            const cardId = getCardNumber(card);
            const resetToken = resetTokens[cardId] || 0;
            const showAddButton = index === 0 && cardsList.length < 2;

            return (
              <div
                key={`${cardId}-${index}`}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: cardSize,
                  height: cardSize,
                  maxWidth: "460px",
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
                  winningPattern="All common patterns"
                  onWinDetected={handleWinDetected}
                  totalCards={cardsList.length}
                />
              </div>
            );
          })}

          {/* Footer - Now scrolls with the page */}
          <div className="w-full max-w-[460px]">
            <Footer isDarkMode={isDarkMode} />
          </div>

          {/* Extra bottom padding for comfortable scrolling */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}

export default App;
