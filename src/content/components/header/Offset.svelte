<script lang="ts">
  import { debounce, getVideoID } from "../../utils/misc";
  import sendMessage from "../../utils/sendMessage";
  import { foundLyrics, offsetStore } from "../../stores/misc";
  import { onDestroy } from "svelte";

  let offset = 0;
  const unsub = offsetStore.subscribe((value) => {
    offset = value;
  });

  const videoID = getVideoID();
  const setOffset = debounce(() => {
    sendMessage({ type: "setOffset", videoID, offset });
  }, 5000);

  function onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = input.valueAsNumber;
    offset = isNaN(value) ? 0 : value;
    $offsetStore = offset;
    setOffset();
  }

  onDestroy(unsub);
</script>

<div>
  <label title="Delay or advance the lyrics (seconds)">
    <div>OFFSET:</div>
    <input
      type="number"
      placeholder="-0.25"
      step="0.2"
      value={offset}
      disabled={!$foundLyrics}
      on:input={debounce(onInput, 300)}
    />
  </label>
</div>

<style>
  div,
  label {
    display: flex;
    align-items: center;
  }

  label {
    gap: 5px;
  }

  label > div {
    padding-bottom: 2px;
  }

  input {
    width: 35px;
    color: var(--main-text-color);
    background-color: rgba(0, 0, 0, 0.3);
    font-size: 12px;
    padding: 3px 5px;
    border-radius: var(--main-border-radius);
    border: 1px rgba(255, 255, 255, 0.1) solid;
  }
</style>
