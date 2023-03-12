<script lang="ts">
  import { onDestroy } from "svelte";
  import { timestamp } from "../../stores/misc";
  import { createEventDispatcher } from "svelte";

  export let words: string;
  export let startTimeMs: string;
  export let endTimeMs: string;
  export let offset: number;
  export let synced: boolean;

  const dispatch = createEventDispatcher<{
    activate: HTMLElement;
    scrub: number;
  }>();
  let line: HTMLElement;
  const OFFSET = -0.8;
  const start = +startTimeMs + OFFSET;
  const end = +endTimeMs + OFFSET;
  let colorClass: "active" | "passed" | null;

  const unsub = timestamp.subscribe((timestamp) => {
    if (timestamp >= start + offset * 1000) {
      if (timestamp < end + offset * 1000) {
        colorClass = "active";
        dispatch("activate", line);
      } else colorClass = "passed";
    } else colorClass = null;
  });

  function onClick(e: MouseEvent) {
    e.preventDefault();
    dispatch("scrub", start + offset * 1000);
  }

  onDestroy(unsub);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class={colorClass}
  class:synced
  bind:this={line}
  on:click={synced ? onClick : null}
>
  {words}
</div>

<style>
  div {
    cursor: default;
    transition: color 0.2s ease-out;
    --shadow: #000 0 0 2px;
  }

  .synced {
    cursor: pointer;
  }

  .passed {
    color: var(--lyrics-color-passed);
    text-shadow: var(--shadow);
  }

  .active,
  div:hover {
    text-shadow: var(--shadow);
    color: var(--lyrics-color-active);
  }
</style>
