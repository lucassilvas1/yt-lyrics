<script lang="ts">
  import { Track } from "../../../types/tracksResponse";
  import { createEventDispatcher } from "svelte";

  export let track: Track;

  const dispatch = createEventDispatcher<{ click: Track }>();

  const thumbnail = getThumbnail();
  const artists = getArtists();

  function getThumbnail() {
    let index = 0;
    let width = Infinity;
    track.albumOfTrack.coverArt.sources.forEach((src, i) => {
      if (src.width > width) return;
      width = src.width;
      index = i;
    });

    return track.albumOfTrack.coverArt.sources[index].url;
  }

  function getArtists() {
    return track.artists.items.map((artist) => artist.profile.name).join(", ");
  }

  function onClick() {
    dispatch("click", track);
  }
</script>

<button type="button" class="result" on:click={onClick}>
  <img src={thumbnail} alt="Album cover art" />
  <div class="info">
    <div class="track-name" title={track.name}>{track.name}</div>
    <div class="track-artists" title={artists}>
      {artists}
    </div>
  </div>
</button>

<style>
  .result {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 56px;
    border-radius: var(--main-border-radius);
    width: 100%;
    padding: 0 10px;
  }

  .result:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .result:hover .track-artists {
    color: #fff;
  }

  img {
    width: 40px;
  }

  .info {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    overflow: hidden;
  }

  .info > div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track-artists {
    color: #b3b3b3;
    font-size: 12px;
  }
</style>
