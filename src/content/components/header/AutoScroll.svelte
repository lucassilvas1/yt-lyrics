<script lang="ts">
  import storage from "../../../common/storage";

  let autoScroll: boolean;
  storage.autoScroll.get().then((state) => {
    autoScroll = state;
  });

  function saveState() {
    storage.autoScroll.set(autoScroll);
  }
</script>

<div class="yt-lyrcs-autosroll-control">
  <label title="Toggle auto-scrolling.">
    <div>AUTOSCROLL:</div>
    <input type="checkbox" bind:checked={autoScroll} on:change={saveState} />
  </label>
</div>

<style>
  .yt-lyrcs-autosroll-control {
    padding-bottom: 2px;
  }

  div,
  label {
    display: flex;
    align-items: center;
    gap: 5px;
  }
</style>
