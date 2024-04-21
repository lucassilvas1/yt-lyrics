<script lang="ts">
  import storage from "../common/storage";
  import Overlay from "./components/Overlay.svelte";
  import Pill from "./components/Pill.svelte";

  export let title: string;

  let loaded = false;
  let showOverlay: boolean;
  let symbol = Symbol();
  let abortController = new AbortController();

  reset();

  window.addEventListener("video-updated", ({ detail }: any) => {
    title = detail;
    reset();
  });

  document.addEventListener("yt-navigate-finish", () => {
    if (!isVideoPage()) loaded = false;
  });

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

  function isVideoPage() {
    return new URL(location.href).pathname === "/watch";
  }

  /**
   * Destroys and mounts the overlay in order to reset its state.
   */
  async function reset() {
    if (!isVideoPage()) {
      loaded = false;
      return;
    }

    abortController.abort();
    abortController = new AbortController();
    try {
      symbol = Symbol();
      loaded = true;
    } catch (error) {
      if (error.name !== "AbortError") console.error(error);
    }
  }
</script>

{#if loaded && title}
  <div class="yt-lyrics-outer-wrapper">
    {#if showOverlay}
      {#key symbol}
        <Overlay
          {title}
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
