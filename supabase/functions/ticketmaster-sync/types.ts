
export interface CountryConfig {
  code: string;
  name: string;
}

export interface VenueData {
  id: string;
  name: string;
  city?: string;
  address?: string;
  postal_code?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  url?: string;
  image_url?: string;
  raw_data: any;
}

export interface ArtistLinks {
  homepage?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  spotify?: string;
  itunes?: string;
  musicbrainz?: string | null;
  lastfm?: string | null;
  wiki?: string | null;
}

export interface ProcessedEvent {
  id: string;
  title: string;
  artist?: string;
  venue?: string;
  venue_id?: string;
  date?: string;
  time?: string;
  raw_date?: string;
  on_sale_date?: string;
  image_url?: string;
  ticket_url?: string;
  genre?: string;
  subgenre?: string;
  price?: number;
  raw_data: any;
  type: 'festival' | 'concert';
  description?: string;
  artist_links: ArtistLinks;
  country: string;
  is_festival: boolean;
}
