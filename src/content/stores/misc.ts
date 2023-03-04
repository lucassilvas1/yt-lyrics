import { readable, writable } from "svelte/store";

export const appName = readable("Youtube Lyrics");

export const overlayElement = writable<HTMLElement>();
export const timestamp = writable(0);
export const offsetStore = writable(0);
export const searchTerm = writable("");

export const foundLyrics = writable(false);
export const showSearch = writable(false);
export const showLyrics = writable(false);
