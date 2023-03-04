import { OverlayRect } from "../types/misc";
import { b } from "./misc";

interface IStorage {
  tokenObj: { accessToken: string; accessTokenExpirationTimestampMs: number };
  autoScroll: boolean;
  lastCleaned: number;
  overlay: {
    show: boolean;
    rect: OverlayRect;
  };
}

const defaultStorage: IStorage = {
  tokenObj: { accessToken: "", accessTokenExpirationTimestampMs: 0 },
  autoScroll: true,
  lastCleaned: Date.now(),
  overlay: {
    show: false,
    rect: {
      top: 90,
      left: 999999,
      bottom: 0,
      right: 999999,
      width: 400,
      height: 700,
    },
  },
} as const;

type Subscriber<T extends IStorage[keyof IStorage]> = (value: T) => void;

class SyncedStore<K extends keyof IStorage, T extends IStorage[K]> {
  #key: K;
  #subscribers = new Map<Symbol, Subscriber<T>>();

  #callSubscribers(value: T) {
    this.#subscribers.forEach((subscriber) => {
      subscriber.call(undefined, value);
    });
  }

  constructor(key: K) {
    this.#key = key;
  }

  subscribe(subscriber: Subscriber<T>) {
    const sym = Symbol();
    this.#subscribers.set(sym, subscriber);
    this.get().then(subscriber);
    return () => {
      this.#subscribers.delete(sym);
    };
  }

  async get(): Promise<T> {
    return (await b.storage.local.get(this.#key))[this.#key];
  }

  async set(value: T) {
    await b.storage.local.set({ [this.#key]: value });
    this.#callSubscribers(value);
  }

  async update(predicate: (value: T) => T) {
    const updated = predicate(await this.get());
    await b.storage.local.set({ [this.#key]: updated });
    this.#callSubscribers(updated);
  }
}

b.storage.local.get(null).then((value) => {
  if (Object.keys(value).length) return;
  b.storage.local.set(defaultStorage);
});

export default {
  tokenObj: new SyncedStore("tokenObj"),
  autoScroll: new SyncedStore("autoScroll"),
  lastCleaned: new SyncedStore("lastCleaned"),
  overlay: new SyncedStore("overlay"),
};
