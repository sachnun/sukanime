// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
  responseTime: string;
}

// Anime Card (used in lists)
export interface AnimeCard {
  title: string;
  slug: string;
  poster: string;
  episode?: string;
  rating?: string;
  releaseDay?: string;
  releaseDate?: string;
  totalEpisode?: string;
  latestEpisodeSlug?: string;
}

// Home page data
export interface HomeData {
  ongoing: AnimeCard[];
  complete: AnimeCard[];
}

// Pagination
export interface Pagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems?: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
}

// Ongoing/Complete Response
export interface AnimeListResponse {
  anime: AnimeCard[];
  pagination: Pagination;
}

// Episode list item
export interface EpisodeListItem {
  episode: string;
  slug: string;
  date: string;
}

// Download link
export interface DownloadLink {
  provider: string;
  url: string;
}

// Batch link
export interface BatchLink {
  resolution: string;
  links: DownloadLink[];
}

// Anime Detail
export interface AnimeDetail {
  title: string;
  japanese: string;
  score: string;
  producer: string;
  type: string;
  status: string;
  totalEpisode: string;
  duration: string;
  releaseDate: string;
  studio: string;
  genres: string[];
  synopsis: string;
  poster: string;
  batch?: BatchLink[];
  episodes: EpisodeListItem[];
}

// Streaming server item
export interface StreamingServerItem {
  provider: string;
  dataContent: string;
  isDefault?: boolean;
}

// Streaming server by quality
export interface StreamingServer {
  quality: string;
  servers: StreamingServerItem[];
}

// Download section
export interface DownloadSection {
  resolution: string;
  links: DownloadLink[];
}

// Episode Detail
export interface EpisodeDetail {
  title: string;
  anime: {
    title: string;
    slug: string;
  };
  prevEpisode?: string;
  nextEpisode?: string;
  streamingUrl?: string;
  streamingServers: StreamingServer[];
  downloadLinks: DownloadSection[];
}

// Genre
export interface Genre {
  name: string;
  slug: string;
}

// Genre list response
export interface GenreListResponse {
  genres: Genre[];
}

// Genre anime response
export interface GenreAnimeResponse {
  genre: string;
  anime: AnimeCard[];
  pagination: Pagination;
}

// Schedule anime
export interface ScheduleAnime {
  title: string;
  slug: string;
}

// Schedule day
export interface ScheduleDay {
  day: string;
  anime: ScheduleAnime[];
}

// Schedule response
export interface ScheduleResponse {
  schedule: ScheduleDay[];
}

// Search response
export interface SearchResponse {
  anime: AnimeCard[];
}

// Resolve streaming response
export interface ResolveStreamingResponse {
  url: string;
  html?: string;
}

// Bookmark item (for localStorage)
export interface BookmarkItem {
  slug: string;
  title: string;
  poster: string;
  addedAt: number;
}

// Watch history item (for localStorage)
export interface WatchHistoryItem {
  animeSlug: string;
  animeTitle: string;
  animePoster: string;
  episodeSlug: string;
  episodeNumber: string;
  watchedAt: number;
}
