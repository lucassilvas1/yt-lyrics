<script lang="ts">
  import { onDestroy } from "svelte";
  import { Unsubscriber } from "svelte/store";
  import storage from "../../../common/storage";
  import { LyricsResponse } from "../../../types/lyricsResponse";
  import { TimeoutID } from "../../../types/misc";
  import { offsetStore } from "../../stores/misc";
  import { intToRGBA } from "../../utils/misc";
  import Line from "./Line.svelte";

  export let lyricsObj: LyricsResponse;

  const synced = lyricsObj.lyrics.syncType === "LINE_SYNCED";
  const inactiveColor = intToRGBA(lyricsObj.colors.text);

  let container: HTMLElement;

  let isScrolling: boolean;
  let timeoutID: TimeoutID;

  let offset: number;
  let autoScroll: boolean;
  const unsubs: Unsubscriber[] = [];
  unsubs.push(
    offsetStore.subscribe((value) => {
      offset = value;
    })
  );
  unsubs.push(
    storage.autoScroll.subscribe((state) => {
      autoScroll = state;
    })
  );

  function scrollToLine({ detail: line }: { detail: HTMLElement }) {
    if (isScrolling || !autoScroll) return;
    const lineCenter = Math.round(line.offsetTop + line.clientHeight / 2);
    container.scrollTop =
      lineCenter - container.offsetTop - Math.round(container.clientHeight / 2);
  }

  function onScroll() {
    clearTimeout(timeoutID);
    isScrolling = true;
    timeoutID = setTimeout(() => {
      isScrolling = false;
    }, 150);
  }

  onDestroy(() => {
    unsubs.forEach((unsub) => {
      unsub();
    });
  });
</script>

<div
  class="yt-lyrics-content-wrapper yt-lyrics-area-wrapper"
  style={`--lyrics-color-inactive: ${inactiveColor}`}
  bind:this={container}
  on:scroll={onScroll}
>
  {#each lyricsObj.lyrics.lines as { startTimeMs, words }, i (i)}
    <Line
      {startTimeMs}
      {offset}
      {words}
      {synced}
      endTimeMs={lyricsObj.lyrics.lines[i + 1]?.startTimeMs ?? "0"}
      on:activate={scrollToLine}
      on:scrub
    />
  {/each}
</div>

<style>
  /* 
    Need to use container queries to change padding/font-size according to overlay size once 
      Svelte implements support for it.
  */
</style>
