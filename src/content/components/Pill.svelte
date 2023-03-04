<script lang="ts">
  import Icon from "./Icon.svelte";
</script>

<span>
  <button type="button" title="Song Lyrics" class="default-hover" on:click>
    <Icon name="pill" width="20px" />
  </button>
</span>

<style>
  span {
    position: fixed;
    top: 90px;
    right: 0;
    width: 56px;
    height: 36px;
    background-color: transparent;
  }

  span:hover > button {
    transform: translateX(-36px);
  }

  button {
    position: fixed;
    right: -26px;
    padding: 8px;
    border-radius: 100px;
    background-color: var(--pill-bg-color);
    box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 6px 2px;
    transition: transform 0.2s ease-out;
  }

  button > :global(svg) {
    fill: var(--secondary-text-color);
  }
</style>
