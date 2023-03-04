<script lang="ts" context="module">
  let loaded = false;
  let oldTerm: string;
  let tracks: Track[] = [];
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { Track } from "../../../types/tracksResponse";
  import { searchTerm } from "../../stores/misc";
  import sendMessage from "../../utils/sendMessage";
  import Spinner from "../Spinner.svelte";
  import Results from "./Results.svelte";
  import SearchBar from "./SearchBar.svelte";

  let showSpinner = false;

  const unsub = searchTerm.subscribe(async (term) => {
    if (term.length < 3 || oldTerm === term) return;
    oldTerm = term;

    showSpinner = true;
    loaded = true;
    tracks = await sendMessage({ type: "getTracks", query: term });
    showSpinner = false;
  });

  onDestroy(unsub);
</script>

<div class="yt-lyrics-content-wrapper">
  <SearchBar />
  {#if loaded}
    <div class="yt-lyrics-results-wrapper">
      {#if showSpinner}
        <Spinner />
      {:else if tracks.length}
        <Results {tracks} on:click />
      {:else}
        <div class="no-results">
          No results for "{$searchTerm}"
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .yt-lyrics-content-wrapper {
    width: 100%;
    height: 100%;
  }

  .yt-lyrics-results-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .no-results {
    font-size: 1.1rem;
    font-weight: 700;
  }
</style>
