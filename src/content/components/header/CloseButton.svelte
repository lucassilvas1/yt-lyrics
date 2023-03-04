<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Icon from "../Icon.svelte";

  const dispatch = createEventDispatcher<{
    close: never;
  }>();
</script>

<button
  type="button"
  title="Close Overlay"
  class="default-hover"
  on:click={() => {
    dispatch("close");
  }}
>
  <Icon name="close" width="12px" />
</button>

<style>
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
  }

  button > :global(svg) {
    fill: var(--secondary-text-color);
  }
</style>
