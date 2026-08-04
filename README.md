# ዘና BINGO Cards (Digital Bingo Card Player) 🎲📱

A modern, responsive, mobile-first web and Capacitor hybrid application for playing Bingo digitally on smartphones.

## 🌟 Features

- **Digital Bingo Cards**: Display and play Bingo cards digitally on mobile screens.
- **Card Replacement & Search**: Instantly look up and swap any Bingo card by Card # ID.
- **Dual Card Support**: View up to 2 cards simultaneously side-by-side with auto-resizing.
- **Interactive Marking**: Tap grid cells to mark/unmark called numbers with animated visual feedback.
- **Dark & Light Themes**: Smooth glassmorphic themes optimized for both daytime and low-light environments.
- **Native Android Ready**: Integrated with Capacitor for building native Android APKs across Android SDKs.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS
- **Mobile Engine**: Capacitor 8 (`@capacitor/android`, `@capacitor/cli`)
- **Styling**: Modern CSS Glassmorphism, CSS Variables, Responsive Viewport Constraints

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Running Locally (Dev Server)
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## 📱 Building Android APK

1. Sync web dist assets with Android native project:
   ```bash
   npm run sync
   ```
2. Build Android Debug APK:
   ```bash
   npm run apk:debug
   ```
3. Build Android Release APK:
   ```bash
   npm run apk:release
   ```

---

**Developed by Birehanu Kassa**
