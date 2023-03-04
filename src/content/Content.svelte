<script lang="ts">
  import { sleep } from "../common/misc";
  import storage from "../common/storage";
  import Overlay from "./components/Overlay.svelte";
  import Pill from "./components/Pill.svelte";

  let loaded = false;
  let showOverlay: boolean;
  let symbol = Symbol();
  let oldTitle: string;
  let abortController = new AbortController();

  storage.overlay.get().then((overlay) => {
    showOverlay = overlay.show ?? false;
  });

  function setOverlayState(state: boolean) {
    showOverlay = state;
    storage.overlay.update((overlay) => {
      overlay.show = state;
      return overlay;
    });
  }

  /**
   * Compares oldTitle with the title on the page to figure out if a new video was loaded.
   */
  async function getNewTitle(signal: AbortSignal): Promise<string> {
    const title = document.querySelector(
      "h1.title.style-scope.ytd-video-primary-info-renderer"
    ) as HTMLElement | null;
    if (signal.aborted)
      throw new DOMException("Promise was aborted", "AbortError");
    if (title) {
      const text = title.innerText;
      if (text && oldTitle !== text) return text;
      else
        return await new Promise((res) => {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
              if (!m.addedNodes.length) return;
              if (m.type === "childList") {
                res(title.innerText);
                observer.disconnect();
              }
            });
          });
          observer.observe(title, {
            childList: true,
            subtree: true,
          });
        });
    }
    await sleep(500);
    return await getNewTitle(signal);
  }

  /**
   * Destroys and mounts the overlay in order to reset its state.
   */
  async function reset() {
    abortController.abort();
    abortController = new AbortController();
    try {
      oldTitle = await getNewTitle(abortController.signal);
      console.log(oldTitle);
      symbol = Symbol();
      loaded = true;
    } catch (error) {
      if (error.name !== "AbortError") console.error(error);
    }
  }

  document.addEventListener("yt-player-updated", reset, true);
  document.addEventListener(
    "yt-navigate-finish",
    () => {
      if (new URL(location.href).pathname === "/watch") return;
      loaded = false;
    },
    true
  );
</script>

{#if loaded}
  <div class="yt-lyrics-outer-wrapper">
    {#if showOverlay}
      {#key symbol}
        <Overlay
          title={oldTitle}
          on:close={() => {
            setOverlayState(false);
          }}
        />
      {/key}
    {:else}
      <Pill
        on:click={() => {
          setOverlayState(true);
        }}
      />
    {/if}
  </div>
{/if}
