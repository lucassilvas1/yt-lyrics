<script lang="ts">
  import { searchTerm } from "../../stores/misc";
  import { debounce } from "../../utils/misc";

  const title = $searchTerm;

  function onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = input.value.trim();
    $searchTerm = value;
  }
</script>

<div>
  <input
    type="text"
    placeholder="What are you listening to?"
    on:input={debounce(onInput, 300)}
    value={title}
  />
</div>

<style>
  div {
    height: 36px;
    box-sizing: border-box;
    padding: 4px 6px;
    background-color: #333333;
    color: #fff;
  }

  input {
    height: 100%;
    width: 100%;
  }
</style>
