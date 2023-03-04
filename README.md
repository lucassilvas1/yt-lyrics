# YouTube Lyrics

YouTube Lyrics is a Manifest V3 Chrome extension built with Svelte and Typescript.
It allows you to get lyrics for music videos on YouTube using Spotify APIs.

You can install it directly from Chrome Web Store [here](https://chrome.google.com/webstore/detail/youtube-lyrics/kpmiacnpajcnngpppplijmakhjjgeimi/).

## Features

- Show/hide overlay with a single click;
- Draggable and resizable overlay;
- Advance or delay the lyrics if they are out of sync by setting their offset;
- Enable or disable auto-scrolling of the lyrics with a single click;
- Click on a line to jump to it on the video;
- Search for the correct track in a matter of seconds if the extension chose the wrong one;
- Lyrics and offset for a video are saved using Chrome storage and IndexedDB and persist refreshes.

## Build from source

1. Clone this repository;
2. Install all dependencies with `npm ci`;
3. Build the extension with `npm run build` for development or `npm run dist` for production (no source-maps);
4. When loading the unpacked extension into the browser, make sure to select the `dist` directory and not the root.
