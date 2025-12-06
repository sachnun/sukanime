import {
  ApiResponse,
  HomeData,
  AnimeListResponse,
  AnimeDetail,
  EpisodeDetail,
  GenreListResponse,
  GenreAnimeResponse,
  ScheduleResponse,
  SearchResponse,
  ResolveStreamingResponse,
} from '@/types/anime';

export const BASE_URL = 'https://otakudesu-api.dakunesu.workers.dev';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.message || 'API request failed');
  }

  return json.data;
}

// Home page data
export async function getHome(): Promise<HomeData> {
  return fetchApi<HomeData>('/api/home');
}

// Ongoing anime with pagination
export async function getOngoing(page: number = 1): Promise<AnimeListResponse> {
  return fetchApi<AnimeListResponse>(`/api/ongoing?page=${page}`);
}

// Complete anime with pagination
export async function getComplete(page: number = 1): Promise<AnimeListResponse> {
  return fetchApi<AnimeListResponse>(`/api/complete?page=${page}`);
}

// Anime detail
export async function getAnimeDetail(slug: string): Promise<AnimeDetail> {
  return fetchApi<AnimeDetail>(`/api/anime/${slug}`);
}

// Episode detail
export async function getEpisodeDetail(slug: string): Promise<EpisodeDetail> {
  return fetchApi<EpisodeDetail>(`/api/episode/${slug}`);
}

// All genres
export async function getGenres(): Promise<GenreListResponse> {
  return fetchApi<GenreListResponse>('/api/genres');
}

// Anime by genre
export async function getAnimeByGenre(genre: string, page: number = 1): Promise<GenreAnimeResponse> {
  return fetchApi<GenreAnimeResponse>(`/api/genres/${genre}?page=${page}`);
}

// Schedule
export async function getSchedule(): Promise<ScheduleResponse> {
  return fetchApi<ScheduleResponse>('/api/schedule');
}

// Search
export async function searchAnime(query: string): Promise<SearchResponse> {
  return fetchApi<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}`);
}

// Resolve streaming URL
export async function resolveStreaming(dataContent: string): Promise<ResolveStreamingResponse> {
  const res = await fetch(`${BASE_URL}/api/resolve-streaming`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataContent }),
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  const json: ApiResponse<ResolveStreamingResponse> = await res.json();

  if (!json.success) {
    throw new Error(json.message || 'Failed to resolve streaming URL');
  }

  return json.data;
}
