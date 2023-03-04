import Dexie, { type Table } from "dexie";
import { LyricsResponse } from "../types/lyricsResponse";

export interface Video {
  id: string;
  offset: number;
  trackID: string;
  lastWatched: number;
}

export interface Lyrics {
  trackID: string;
  lastUsed: number;
  lyrics: LyricsResponse;
}

class DB extends Dexie {
  videos!: Table<Video>;
  lyrics!: Table<Lyrics>;

  constructor() {
    super("Youtube Lyrics");
    this.version(1).stores({
      videos: "id",
      lyrics: "trackID",
    });
  }
}

export default new DB();
