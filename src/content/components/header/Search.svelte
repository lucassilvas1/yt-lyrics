<script lang="ts">
  import { onDestroy } from "svelte";
  import { showSearch } from "../../stores/misc";

  import Icon from "../Icon.svelte";

  let show: boolean;
  const unsub = showSearch.subscribe((state) => {
    show = state;
  });

  onDestroy(unsub);
</script>

<button
  type="button"
  class="icon-container"
  class:toggled={show}
  title={(show ? "Hide" : "Show") + " search"}
  on:click={() => {
    $showSearch = !show;
  }}
>
  <Icon name="search" width="20px" />
</button>

<style>
  .icon-container {
    cursor: pointer;
  }

  .icon-container.toggled,
  .icon-container:hover {
    color: #fff;
  }
</style>
