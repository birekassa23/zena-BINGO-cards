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

## 📱 Building Android APK & Google Play App Bundle (.aab)

### 1. Build Google Play Release Bundle (.aab) [Recommended for Play Store]
To generate the signed Android App Bundle (`.aab`) ready for uploading to Google Play Console:
```bash
npm run bundle:release
```
**Output location:**
`android/app/build/outputs/bundle/legacyRelease/app-legacy-release.aab`

---

### 2. Standalone APKs (for Direct Device Testing)
- **Debug APK:**
  ```bash
  npm run apk:debug
  ```
- **Universal Release APK:**
  ```bash
  npm run apk:universal
  ```

---

## 🚀 Google Play Store Publishing Checklist

1. **Upload AAB**: In [Google Play Console](https://play.google.com/console), go to **Production** (or **Internal Testing**) > **Create new release** and upload `app-legacy-release.aab`.
2. **App Details**:
   - **App Name**: `ዘና BINGO Cards`
   - **Target SDK**: Android 15 (API 35) *(Pre-configured)*
   - **Min SDK**: Android 5.0 (API 21) *(Pre-configured, supports 99.5%+ of all Android devices)*
3. **Store Listing Assets**:
   - **App Icon**: 512 x 512 px PNG
   - **Feature Graphic**: 1024 x 500 px PNG/JPG
   - **Screenshots**: At least 2 phone screenshots (16:9 or 9:16)
4. **Data Safety & Permissions**:
   - Only `INTERNET` permission is required.
   - Declare whether your app collects personal user data (No personal data collected if purely offline/local Bingo).
5. **Content Rating**: Complete the IARC questionnaire in Google Play Console.

---

**Developed by Birehanu Kassa**
