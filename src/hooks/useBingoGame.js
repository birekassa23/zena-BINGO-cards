import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { cardsData } from "../data/cardsData";
import {
  isSoundEnabled,
  setSoundEnabled,
  playTapSound,
  playClearSound,
  playWinFanfare,
} from "../utils/audio";

const STORAGE_KEYS = {
  ACTIVE_CARDS: "zena_active_card_ids",
  CALLED_NUMBERS: "zena_called_numbers",
  BG_COLOR: "zena_bg_color",
  SOUND_ENABLED: "zena_sound_enabled",
};

// Helper: safe color darkness check
export function isColorDark(hex) {
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

export function getCardNumber(card) {
  return card ? card.card_number || card.icard_number : null;
}

export function useBingoGame() {
  const [currentPage, setCurrentPage] = useState("cards"); // 'cards' | 'theme'
  const [toast, setToast] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [pendingClearCardId, setPendingClearCardId] = useState(null);

  // 1. Persistent Sound State
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      if (next) {
        playTapSound(true);
      }
      return next;
    });
  }, []);

  // 2. Persistent Background Color
  const [backgroundColor, setBackgroundColor] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.BG_COLOR) || "#090a10";
    } catch {
      return "#090a10";
    }
  });

  const isDarkMode = useMemo(() => isColorDark(backgroundColor), [backgroundColor]);

  const handleSelectColor = useCallback((color) => {
    setBackgroundColor(color);
    try {
      localStorage.setItem(STORAGE_KEYS.BG_COLOR, color);
    } catch {
      // Ignore quota errors
    }
  }, []);

  // 3. Persistent Active Cards
  const [cardsList, setCardsList] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_CARDS);
      if (raw) {
        const ids = JSON.parse(raw);
        if (Array.isArray(ids) && ids.length > 0) {
          const matched = ids
            .map((id) => cardsData.find((c) => getCardNumber(c) === id))
            .filter(Boolean);
          if (matched.length > 0) {
            return matched.slice(0, 2);
          }
        }
      }
    } catch {
      // Fallback
    }
    return [cardsData[0]];
  });

  // Save active cards on change
  useEffect(() => {
    try {
      const ids = cardsList.map((c) => getCardNumber(c)).filter(Boolean);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CARDS, JSON.stringify(ids));
    } catch {
      // Non-blocking
    }
  }, [cardsList]);

  // 4. Persistent Called / Marked Numbers
  const [calledNumbers, setCalledNumbers] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CALLED_NUMBERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((n) => typeof n === "number");
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Save called numbers on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CALLED_NUMBERS,
        JSON.stringify(calledNumbers),
      );
    } catch {
      // Non-blocking
    }
  }, [calledNumbers]);

  // Toast Helper
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

  // Quick theme toggle
  const toggleQuickTheme = useCallback(() => {
    const nextColor = isDarkMode ? "#f1f5f9" : "#090a10";
    handleSelectColor(nextColor);
    playTapSound(true);
    showToast(isDarkMode ? "የቀን ገጽታ (Light)" : "የማታ ገጽታ (Dark)", "info");
  }, [isDarkMode, handleSelectColor, showToast]);

  // Toggle called number with audio and haptic feedback
  const toggleCalledNumber = useCallback((num) => {
    if (num === "FREE" || num === "Free" || num === 0) return;
    const numVal = Number(num);
    if (isNaN(numVal)) return;

    setCalledNumbers((prev) => {
      const isAlreadyMarked = prev.includes(numVal);
      playTapSound(!isAlreadyMarked);
      return isAlreadyMarked
        ? prev.filter((n) => n !== numVal)
        : [...prev, numVal];
    });
  }, []);

  // Replace card at index
  const handleReplaceCard = useCallback(
    (index, searchNumber) => {
      const parsedNum = Number(searchNumber);
      if (isNaN(parsedNum) || parsedNum < 1 || parsedNum > 500) {
        showToast("የካርድ ቁጥር ከ 1 እስከ 500 መሆን አለበት", "warning");
        return;
      }

      const foundCard = cardsData.find(
        (card) => getCardNumber(card) === parsedNum,
      );
      if (!foundCard) {
        showToast(`የካርድ ቁጥር ${searchNumber} አልተገኘም`, "warning");
        return;
      }

      setCardsList((prev) => {
        const updated = [...prev];
        updated[index] = foundCard;
        return updated;
      });
      playTapSound(true);
      showToast(`ወደ ካርድ ቁጥር ${parsedNum} ተቀይሯል`, "success");
    },
    [showToast],
  );

  // Add a 2nd card
  const handleAddCard = useCallback(() => {
    if (cardsList.length >= 2) {
      showToast("ከ 2 በላይ ካርድ መክፈት አይቻልም", "info");
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
      showToast("ሁሉም ካርዶች ተከፍተዋል", "info");
      return;
    }
    setCardsList((prev) => [...prev, availableCard]);
    playTapSound(true);
    showToast(`የካርድ ቁጥር ${getCardNumber(availableCard)} ተጨምሯል`, "success");
  }, [cardsList, showToast]);

  // Remove a card
  const removeCard = useCallback(
    (index) => {
      if (cardsList.length <= 1) {
        showToast("ቢያንስ አንድ ካርድ መኖር አለበት", "info");
        return;
      }
      const removedCardNumber = getCardNumber(cardsList[index]);
      setCardsList((prev) => prev.filter((_, idx) => idx !== index));
      playTapSound(false);
      showToast(`የካርድ ቁጥር ${removedCardNumber} ተዘግቷል`, "info");
    },
    [cardsList, showToast],
  );

  // Clear marks flow
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
    playClearSound();
    setConfirmClearOpen(false);
    setPendingClearCardId(null);
    showToast("ምልክቶች በሙሉ ተሰርዘዋል", "success");
  }, [showToast]);

  const handleCancelClear = useCallback(() => {
    setConfirmClearOpen(false);
    setPendingClearCardId(null);
  }, []);

  // Track win notification to only celebrate once when won
  const prevWinsRef = useRef(new Set());
  const handleCardWin = useCallback((cardId, hasWon) => {
    if (hasWon && !prevWinsRef.current.has(cardId)) {
      prevWinsRef.current.add(cardId);
      playWinFanfare();
    } else if (!hasWon && prevWinsRef.current.has(cardId)) {
      prevWinsRef.current.delete(cardId);
    }
  }, []);

  // -------------------------------------------------------------
  // Android 3-Button Navigation (Back, Home, Switch Apps/Recents)
  // -------------------------------------------------------------
  const lastBackPressTimeRef = useRef(0);

  useEffect(() => {
    let backSub = null;
    let stateSub = null;
    let isSubscribed = true;

    async function initAndroidNavigation() {
      try {
        // 1. Android System "Back" Button Listener (◀)
        backSub = await CapacitorApp.addListener("backButton", () => {
          if (!isSubscribed) return;

          // If the confirmation modal is open, dismiss it
          if (confirmClearOpen) {
            handleCancelClear();
            return;
          }

          // If inside the Theme / Background Settings page, navigate back to Cards
          if (currentPage === "theme") {
            setCurrentPage("cards");
            return;
          }

          // On main Cards page: Prevent accidental exit; double-tap within 2s to exit
          const now = Date.now();
          if (now - lastBackPressTimeRef.current < 2000) {
            CapacitorApp.exitApp();
          } else {
            lastBackPressTimeRef.current = now;
            showToast("ለመውጣት አንዴ ድጋሚ ይጫኑ (Press back again to exit)", "info");
          }
        });

        // 2. Android "Home" (●) and "Switch Apps" (■) Listeners via appStateChange
        stateSub = await CapacitorApp.addListener("appStateChange", ({ isActive }) => {
          if (!isSubscribed) return;

          if (!isActive) {
            // User pressed Home or Switch Apps button (app moved to background)
            // Immediately synchronize and flush all game state to storage
            try {
              const ids = cardsList.map((c) => getCardNumber(c)).filter(Boolean);
              localStorage.setItem(STORAGE_KEYS.ACTIVE_CARDS, JSON.stringify(ids));
              localStorage.setItem(
                STORAGE_KEYS.CALLED_NUMBERS,
                JSON.stringify(calledNumbers),
              );
            } catch {
              // Ignore storage errors
            }
          }
        });
      } catch {
        // Fallback for non-Capacitor / pure browser environments
      }
    }

    initAndroidNavigation();

    // Browser navigation fallback for back button / popstate
    const handleBrowserPopState = () => {
      if (confirmClearOpen) {
        handleCancelClear();
      } else if (currentPage === "theme") {
        setCurrentPage("cards");
      }
    };
    window.addEventListener("popstate", handleBrowserPopState);

    return () => {
      isSubscribed = false;
      if (backSub && typeof backSub.remove === "function") {
        backSub.remove();
      }
      if (stateSub && typeof stateSub.remove === "function") {
        stateSub.remove();
      }
      window.removeEventListener("popstate", handleBrowserPopState);
    };
  }, [
    confirmClearOpen,
    currentPage,
    cardsList,
    calledNumbers,
    handleCancelClear,
    showToast,
  ]);

  return {
    currentPage,
    setCurrentPage,
    toast,
    showToast,
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
  };
}
