import Content from "./Content.svelte";

let title;

window.addEventListener("message", (event) => {
  if (event.data?.type === "yt-player-updated") {
    title = event.data.payload;
    window.dispatchEvent(new CustomEvent("video-updated", { detail: title }));
  }
});

function injectScript(src) {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL(src);
  s.onload = () => s.remove();
  (document.head || document.documentElement).append(s);
}

injectScript("get-video-info.js");

document.addEventListener("DOMContentLoaded", () => {
  new Content({ target: document.body, props: { title } });
});
