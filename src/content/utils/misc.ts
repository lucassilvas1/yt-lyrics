import storage from "../../common/storage";
import { OverlayRect, TimeoutID } from "../../types/misc";

export function debounce<A extends any[], R>(
  this: any,
  func: (...args: A) => R,
  timeout = 200
): (...args: A) => Promise<R> {
  let timeoutID: TimeoutID;
  return (...args: A) =>
    new Promise((res) => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        res(func.call(this, ...args));
      }, timeout);
    });
}

function fixOverlayPosition(rect: OverlayRect) {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  if (rect.width > vw) rect.width = vw;
  if (rect.height > vh) rect.height = vh;

  if (rect.right > vw) rect.left = vw - rect.width;
  else if (rect.left < 0) rect.left = 0;
  if (rect.top < 0) rect.top = 0;
  else if (rect.bottom > vh) rect.top = vh - rect.height;

  return rect;
}

export function setOverlayRect(
  overlay: HTMLElement,
  rect: OverlayRect | DOMRect = overlay.getBoundingClientRect()
) {
  rect = fixOverlayPosition("toJSON" in rect ? rect.toJSON() : rect);
  Object.assign(overlay.style, {
    top: rect.top + "px",
    left: rect.left + "px",
    right: rect.right + "px",
    width: rect.width + "px",
    height: rect.height + "px",
  });
}

export function saveOverlayRect(overlay: HTMLElement) {
  const rect = overlay.getBoundingClientRect();
  return storage.overlay.update((overlay) => {
    overlay.rect = {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
    };
    return overlay;
  });
}

export function intToRGBA(num: number, opacity?: number) {
  num >>>= 0;
  var b = num & 0xff,
    g = (num & 0xff00) >>> 8,
    r = (num & 0xff0000) >>> 16,
    a = isNaN(opacity!) ? ((num & 0xff000000) >>> 24) / 255 : opacity;
  return "rgba(" + [r, g, b, a].join(",") + ")";
}

/**
 * Removes everything between parenthesis and square brackets for better results, also removes `"` since that
 * breaks Spotify search for some reason
 */
export function sanitizeTitle(title: string) {
  return title
    .replace(/(?=[\[(]).*(?:[)\]])/g, "")
    .replaceAll('"', "")
    .trim();
}

export function getVideoID() {
  return new URL(location.href).searchParams.get("v") as string;
}

export function isPlaying(video: HTMLVideoElement) {
  return !!(
    video.currentTime &&
    !video.paused &&
    !video.ended &&
    video.readyState > 2
  );
}
