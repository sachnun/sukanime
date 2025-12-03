# Sukanime

A modern Netflix-style anime streaming website built with Next.js 16 and Tailwind CSS.

## Features

- Modern Netflix-style UI with hero banner and carousel
- Video streaming with multiple resolution options
- Anime search functionality
- Genre-based filtering
- Anime release schedule
- Bookmark favorite anime
- Watch history tracking
- Responsive design for mobile and desktop

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Carousel:** Swiper.js
- **Language:** TypeScript

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

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

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
```

## License

This project is licensed under the [MIT License](LICENSE).
