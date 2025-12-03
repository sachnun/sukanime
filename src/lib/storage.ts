import { BookmarkItem, WatchHistoryItem } from '@/types/anime';

const BOOKMARKS_KEY = 'sukanime_bookmarks';
const HISTORY_KEY = 'sukanime_history';
const MAX_HISTORY_ITEMS = 50;

// Bookmarks
export function getBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(BOOKMARKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addBookmark(item: Omit<BookmarkItem, 'addedAt'>): void {
  const bookmarks = getBookmarks();
  const exists = bookmarks.find((b) => b.slug === item.slug);
  if (exists) return;

  bookmarks.unshift({
    ...item,
    addedAt: Date.now(),
  });
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function removeBookmark(slug: string): void {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter((b) => b.slug !== slug);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
}

export function isBookmarked(slug: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.slug === slug);
}

// Watch History
export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToHistory(item: Omit<WatchHistoryItem, 'watchedAt'>): void {
  let history = getWatchHistory();
  
  // Remove existing entry for same episode
  history = history.filter((h) => h.episodeSlug !== item.episodeSlug);
  
  // Add new entry at the beginning
  history.unshift({
    ...item,
    watchedAt: Date.now(),
  });
  
  // Limit history size
  if (history.length > MAX_HISTORY_ITEMS) {
    history = history.slice(0, MAX_HISTORY_ITEMS);
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
}

export function getLastWatchedEpisode(animeSlug: string): WatchHistoryItem | undefined {
  const history = getWatchHistory();
  return history.find((h) => h.animeSlug === animeSlug);
}
