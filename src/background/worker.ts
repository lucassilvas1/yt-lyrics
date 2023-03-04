import { b } from "../common/misc";
import storage from "../common/storage";
import { LyricsResponse } from "../types/lyricsResponse";
import {
  ContentMessage,
  ContentMessageType,
  MessageSender,
} from "../types/messages";
import { Track, TracksResponse } from "../types/tracksResponse";
import db from "./db";
import { getHeaders, getToken, request } from "./utils";

type MessageHandlers = {
  [K in keyof ContentMessage]: (
    message: ContentMessage[K]["message"],
    sender: MessageSender
  ) => Promise<ContentMessage[K]["response"]>;
};

const messageHandlers: MessageHandlers = {
  async getTracks(message) {
    return await getTracks(message.query);
  },
  async fetchLyrics(message) {
    if ("track" in message) {
      const savedLyrics = await getSavedLyrics(message.track.id);
      if (savedLyrics) {
        await updateVideoTrack(message.videoID, message.track.id);
        return { lyrics: savedLyrics, offset: 0 };
      }

      const lyrics = await fetchLyrics(message.track);
      if ("error" in lyrics) return lyrics;

      await saveLyrics(message.videoID, message.track.id, lyrics);
      return { lyrics, offset: 0 };
    } else {
      const savedLyrics = await getVideoLyrics(message.videoID);
      if (savedLyrics) return savedLyrics;

      const token = await getToken();
      const track = await getTracks(message.query, token);
      if (!track.length) return getError("TrackNotFound");
      const lyrics = await fetchLyrics(track[0], token);
      if ("error" in lyrics) return lyrics;

      await saveLyrics(message.videoID, track[0].id, lyrics);
      return { lyrics, offset: 0 };
    }
  },

  async setOffset(message) {
    await db.transaction("rw", db.videos, async () => {
      const video = await db.videos.get(message.videoID);

      if (!video) return;
      video.offset = message.offset;
      await db.videos.put(video);
    });
  },
};

function updateVideoTrack(videoID: string, trackID: string) {
  return db.videos.put({
    id: videoID,
    offset: 0,
    trackID,
    lastWatched: Date.now(),
  });
}

function saveLyrics(videoID: string, trackID: string, lyrics: LyricsResponse) {
  return db.transaction("rw", db.videos, db.lyrics, async () => {
    await updateVideoTrack(videoID, trackID);
    await db.lyrics.put({ trackID, lastUsed: Date.now(), lyrics });
  });
}

async function getVideoLyrics(videoID: string) {
  const video = await db.videos.get(videoID);
  if (!video) return null;
  const lyrics = await getSavedLyrics(video.trackID);
  if (!lyrics) return null;
  return { lyrics: lyrics, offset: video.offset } ?? null;
}

async function getSavedLyrics(trackID: string) {
  return (await db.lyrics.get(trackID))?.lyrics ?? null;
}

async function fetchLyrics(track: Track, token?: string) {
  if (!token) token = await getToken();
  const res = await request(
    `https://spclient.wg.spotify.com/color-lyrics/v2/track/${
      track.id
    }/image/${encodeURIComponent(
      track.albumOfTrack.coverArt.sources[0].url
    )}?format=json&vocalRemoval=false&market=from_token`,
    { headers: getHeaders(token) }
  );

  switch (res.status) {
    case 404:
      return getError("LyricsNotFound");
    case 400:
      await storage.tokenObj.set({
        accessToken: "",
        accessTokenExpirationTimestampMs: 0,
      });
      return getError("LoggedOut");
    case 200:
      return (await res.json()) as LyricsResponse;
    default:
      return getError("UnknownError");
  }
}

async function getTracks(query: string, token?: string): Promise<Track[]> {
  if (!token) token = await getToken();
  const res: TracksResponse = await request(
    `https://api-partner.spotify.com/pathfinder/v1/query?operationName=searchTracks&variables=%7B%22searchTerm%22%3A%22${encodeURIComponent(
      query
    )}%22%2C%22offset%22%3A0%2C%22limit%22%3A30%2C%22numberOfTopResults%22%3A20%2C%22includeAudiobooks%22%3Afalse%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%221d021289df50166c61630e02f002ec91182b518e56bcd681ac6b0640390c0245%22%7D%7D`,
    {
      headers: getHeaders(token),
    }
  ).then((res) => res.json());
  return res.data.searchV2.tracksV2.items.map(({ item }) => item.data);
}

function getError<T extends string>(reason: T) {
  return { error: reason };
}

async function housekeep() {
  const day = 24 * 60 * 60 * 1000;
  if (Date.now() - (await storage.lastCleaned.get()) < day) return;
  db.transaction("rw", db.videos, db.lyrics, async () => {
    let count = await db.lyrics.count();
    if (count < 500) return;
    const threshold = Date.now() - 30 * day;
    await db.lyrics.where("lastUsed").below(threshold).delete();

    await storage.lastCleaned.set(Date.now());

    count = await db.videos.count();
    if (count < 2000) return;
    await db.videos.where("lastWatched").below(threshold).delete();
  });
}

b.runtime.onMessage.addListener(function (message, sender, reply) {
  const type = message.type as ContentMessageType;
  Promise.resolve(messageHandlers[type]?.(message, sender)).then(reply);
  return true;
});

housekeep();
