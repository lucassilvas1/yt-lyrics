export interface TracksResponse {
  data: Data;
  extensions: Extensions;
}

export interface Data {
  searchV2: SearchV2;
}

export interface SearchV2 {
  query: string;
  tracksV2: TracksV2;
}

export interface TracksV2 {
  totalCount: number;
  items: Result[];
  pagingInfo: PagingInfo;
}

export interface Result {
  matchedFields: string[];
  item: TrackObject;
}

export interface TrackObject {
  data: Track;
}

export interface Track {
  __typename: string;
  uri: string;
  id: string;
  name: string;
  albumOfTrack: AlbumOfTrack;
  artists: Artists;
  contentRating: ContentRating;
  duration: Duration;
  playability: Playability;
}

export interface AlbumOfTrack {
  uri: string;
  name: string;
  coverArt: CoverArt;
  id: string;
}

export interface CoverArt {
  sources: Source[];
  extractedColors: ExtractedColors;
}

export interface Source {
  url: string;
  width: number;
  height: number;
}

export interface ExtractedColors {
  colorDark: ColorDark;
}

export interface ColorDark {
  hex: string;
  isFallback: boolean;
}

export interface Artists {
  items: Artist[];
}

export interface Artist {
  uri: string;
  profile: Profile;
}

export interface Profile {
  name: string;
}

export interface ContentRating {
  label: string;
}

export interface Duration {
  totalMilliseconds: number;
}

export interface Playability {
  playable: boolean;
}

export interface PagingInfo {
  nextOffset: number;
  limit: number;
}

export interface Extensions {
  requestIds: RequestIds;
  cacheControl: CacheControl;
}

export interface RequestIds {
  "/searchV2": SearchV22;
}

export interface SearchV22 {
  "search-api": string;
}

export interface CacheControl {
  version: number;
  hints: any[];
}
