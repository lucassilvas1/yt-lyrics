import { b } from "../common/misc";
import { LyricsResponse } from "./lyricsResponse";
import { Track } from "./tracksResponse";

export type MessageSender = Parameters<
  Parameters<typeof b.runtime.onMessage.addListener>[0]
>[1];

export interface ContentMessage {
  getTracks: {
    message: {
      type: "getTracks";
      query: string;
    };
    response: Track[];
  };
  fetchLyrics: {
    message: {
      type: "fetchLyrics";
      videoID: string;
    } & ({ query: string } | { track: Track });
    response:
      | { lyrics: LyricsResponse; offset: number }
      | {
          error:
            | "TrackNotFound"
            | "LyricsNotFound"
            | "LoggedOut"
            | "UnknownError";
        };
  };
  setOffset: {
    message: {
      type: "setOffset";
      videoID: string;
      offset: number;
    };
    response: void;
  };
}

export type ContentMessageType = keyof ContentMessage;

export type ContentMessages = ContentMessage[keyof ContentMessage]["message"];

export type BackgroundMessage = {};
