# Sukanime

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsachnun%2Fsukanime)

A modern Netflix-style anime streaming app built with Next.js 16 and Tailwind CSS. Available as web app and Android APK.

## Features

- Modern Netflix-style UI with hero banner and carousel
- Video streaming with multiple resolution options
- Anime search functionality
- Genre-based filtering
- Anime release schedule
- Bookmark favorite anime
- Watch history tracking
- Responsive design for mobile and desktop
- PWA support (installable from browser)
- Native Android app

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Carousel:** Swiper.js
- **Language:** TypeScript
- **Mobile:** Capacitor (Android)
- **PWA:** @ducanh2912/next-pwa

## Data Source

Anime data is provided by [Otakudesu API](https://github.com/sachnun/otakudesu-api) - a REST API for scraping anime data from Otakudesu, built with NestJS.

API Endpoint: `https://otakudesu-api.zeabur.app`

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository

```bash
git clone https://github.com/sachnun/sukanime.git
cd sukanime
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Android APK

### Download APK

You can download the latest APK from [GitHub Actions](https://github.com/sachnun/sukanime/actions/workflows/build-apk.yml):

1. Go to the **Actions** tab
2. Click on the latest successful **Build Android APK** workflow
3. Download the **sukanime-debug-apk** artifact

### Build APK Locally

Requirements:
- Java JDK 21
- Android SDK

```bash
# Install dependencies
npm install

# Sync Capacitor
npm run cap:sync

# Build APK (requires Android SDK)
cd android && ./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run cap:sync` | Sync Capacitor with native projects |
| `npm run generate-icons` | Generate app icons |

## Folder Structure

```
src/
├── app/                    # App Router pages
│   ├── anime/[slug]/       # Anime detail page
│   ├── watch/[slug]/       # Streaming page
│   ├── genre/              # Genre pages
│   ├── ongoing/            # Ongoing anime
│   ├── complete/           # Completed anime
│   ├── schedule/           # Anime schedule
│   ├── search/             # Search page
│   ├── bookmark/           # Bookmarks
│   └── history/            # Watch history
├── components/
│   ├── layout/             # Layout components (Navbar)
│   └── ui/                 # UI components
├── lib/                    # Utilities and API
└── types/                  # TypeScript types

android/                    # Android native project (Capacitor)
public/
├── icons/                  # PWA icons
└── manifest.json           # PWA manifest
```

## License

This project is licensed under the [MIT License](LICENSE).
