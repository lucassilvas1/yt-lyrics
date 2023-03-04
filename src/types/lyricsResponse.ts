export interface LyricsResponse {
  lyrics: Lyrics;
  colors: Colors;
  hasVocalRemoval: boolean;
}

export interface Lyrics {
  syncType: "LINE_SYNCED" | "UNSYNCED";
  lines: Line[];
  provider: string;
  providerLyricsId: string;
  providerDisplayName: string;
  syncLyricsUri: string;
  isDenseTypeface: boolean;
  alternatives: any[];
  language: string;
  isRtlLanguage: boolean;
  fullscreenAction: string;
}

export interface Line {
  startTimeMs: string;
  words: string;
  syllables: any[];
  endTimeMs: string;
}

export interface Colors {
  background: number;
  text: number;
  highlightText: number;
}
