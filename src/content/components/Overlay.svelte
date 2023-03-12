<script lang="ts" context="module">
  let oldTitle: string;
  let lyricsObj: ContentMessage["fetchLyrics"]["response"];
</script>

<script lang="ts">
  import storage from "../../common/storage";
  import {
    foundLyrics,
    offsetStore,
    overlayElement,
    searchTerm,
    showLyrics,
    showSearch,
    timestamp,
  } from "../stores/misc";
  import {
    debounce,
    getVideoID,
    intToRGBA,
    isPlaying,
    sanitizeTitle,
    setOverlayRect,
  } from "../utils/misc";
  import sendMessage from "../utils/sendMessage";
  import Header from "./header/Header.svelte";
  import Lyrics from "./lyrics/Lyrics.svelte";
  import NotFound from "./Error.svelte";
  import Spinner from "./Spinner.svelte";
  import { onDestroy } from "svelte";
  import { IntervalID } from "../../types/misc";
  import { ContentMessage } from "../../types/messages";
  import Search from "./search/Search.svelte";
  import { Track } from "../../types/tracksResponse";
  import { Unsubscriber } from "svelte/store";
  import { OPACITY } from "../const";

  export let title: string;

  const sanitizedTitle = sanitizeTitle(title);
  $searchTerm = sanitizedTitle;
  let container: HTMLElement;
  let video: HTMLVideoElement | null;
  let showOverlay = false;
  let showSpinner = true;
  let intervalID: IntervalID;
  let unsub: Unsubscriber;

  function scrub({ detail: timestamp }: { detail: number }) {
    if (video) video.currentTime = timestamp / 1000;
  }

  function onPlay({ target: video }: { target: EventTarget | null }) {
    clearInterval(intervalID);
    intervalID = setInterval(() => {
      $timestamp = (video as HTMLVideoElement).currentTime * 1000;
    }, 150);
  }

  function onPause() {
    clearInterval(intervalID);
  }

  function setBackgroundColor(background = "var(--default-bg-color)") {
    container.style.setProperty("--main-bg-color", background);
  }

  function setLyricsColors() {
    if ("error" in lyricsObj) setBackgroundColor("var(--not-found-bg-color)");
    else
      setBackgroundColor(
        intToRGBA(lyricsObj.lyrics.colors.background, OPACITY)
      );
  }

  async function loadLyrics(track?: Track) {
    showSpinner = true;

    if (track)
      lyricsObj = await sendMessage({
        type: "fetchLyrics",
        track,
        videoID: getVideoID(),
      });
    else
      lyricsObj = await sendMessage({
        type: "fetchLyrics",
        query: sanitizedTitle,
        videoID: getVideoID(),
      });

    if ("error" in lyricsObj) {
      $offsetStore = 0;
      $foundLyrics = false;
    } else {
      $offsetStore = lyricsObj.offset;
      $foundLyrics = true;
    }
    setLyricsColors();

    $showLyrics = true;
    showSpinner = false;
  }

  async function afterLoading() {
    if (!$foundLyrics && sanitizedTitle === oldTitle) {
      showSpinner = false;
      setBackgroundColor("var(--not-found-bg-color)");
      return;
    }
    oldTitle = sanitizedTitle;

    await loadLyrics();

    video = document.querySelector("video");
    if (video) {
      if (isPlaying(video)) onPlay({ target: video });
      video.addEventListener("playing", onPlay);
      video.addEventListener("pause", onPause);
      video.addEventListener("ended", onPause);
    } else console.error("SOMETHING WENT WRONG, VIDEO IS NULL");

    showSpinner = false;

    unsub = showSearch.subscribe((state) => {
      if (state) setBackgroundColor();
      else if (lyricsObj) setLyricsColors();
    });
  }

  function getOverlay(overlay: HTMLElement) {
    container = overlay;
    $overlayElement = overlay;

    function onMouseDown() {
      window.addEventListener("mouseup", onMouseUp);
    }

    function onMouseUp() {
      window.removeEventListener("mouseup", onMouseUp);
    }

    storage.overlay.get().then(({ rect }) => {
      setOverlayRect(overlay, rect);
      showOverlay = true;
      overlay.addEventListener("mousedown", onMouseDown);

      afterLoading();
    });

    return {
      destroy() {
        overlay.removeEventListener("mousedown", onMouseDown);
      },
    };
  }

  async function onWindowResize() {
    const { rect } = await storage.overlay.get();
    setOverlayRect(container, rect);
  }

  function switchToLyrics(e: { detail: Track }) {
    $showSearch = false;
    loadLyrics(e.detail);
  }

  onDestroy(() => {
    unsub();
    video?.removeEventListener("playing", onPlay);
    video?.removeEventListener("pause", onPause);
    video?.removeEventListener("ended", onPause);
  });
</script>

<svelte:window on:resize={debounce(onWindowResize, 300)} />

<div id="yt-lyrics-overlay-wrapper" class:show={showOverlay} use:getOverlay>
  <Header on:close />
  <div class="content-wrapper">
    {#if showSpinner}
      <Spinner />
    {:else if $showSearch}
      <Search on:click={switchToLyrics} />
    {:else if $showLyrics}
      {#if "error" in lyricsObj}
        <NotFound error={lyricsObj.error} />
      {:else}
        <Lyrics lyricsObj={lyricsObj.lyrics} on:scrub={scrub} />
      {/if}
    {/if}
  </div>
</div>

<style>
  #yt-lyrics-overlay-wrapper {
    visibility: hidden;
    position: fixed;
    color: var(--main-text-color);
    background-color: var(--main-bg-color);
    border-radius: var(--main-border-radius);
    border: 2px var(--main-border-color) solid;
    box-shadow: var(--main-box-shadow);
    min-width: 300px;
    min-height: 450px;
    max-width: 50vw;
    max-height: 100vh;
    width: 350px;
    height: 65vh;
    resize: both;
    overflow: auto;
    box-sizing: border-box;
  }

  #yt-lyrics-overlay-wrapper.show {
    visibility: visible;
  }

  .content-wrapper {
    width: 100%;
    height: calc(100% - 32px);
    background-color: var(--main-bg-color);
  }
</style>
