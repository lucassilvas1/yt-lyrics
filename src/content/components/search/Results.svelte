<script lang="ts">
  import { Track } from "../../../types/tracksResponse";
  import Result from "./Result.svelte";

  export let tracks: Track[];
</script>

<div class="yt-lyrics-search-results">
  {#each tracks as track (track.id)}
    <Result {track} on:click />
  {/each}
</div>

<style>
  .yt-lyrics-search-results {
    color: #fff;
    width: 100%;
    height: 100%;
    padding: 5px;
    font-size: 14px;
    box-sizing: border-box;
  }
</style>
