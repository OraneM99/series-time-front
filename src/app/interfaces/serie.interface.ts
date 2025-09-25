export interface SerieInterface {
  id: number;
  name: string;
  originalName?: string;
  overview?: string;
  status?: string;
  vote?: number;
  popularity?: number;
  poster?: string;
  backdrop?: string;
  country?: string;
  firstAirDate?: string;
  lastAirDate?: string;
  genres?: string[];
  contributors?: { id: number; name: string; role: string }[];
  streamingLinks?: { provider: string; url: string; enabled?: boolean }[];
}
