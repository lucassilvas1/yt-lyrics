<script lang="ts">
  import { overlayElement } from "../../stores/misc";
  import { saveOverlayRect, setOverlayRect } from "../../utils/misc";
  import AutoScroll from "./AutoScroll.svelte";
  import CloseButton from "./CloseButton.svelte";
  import OffsetInput from "./Offset.svelte";
  import Search from "./Search.svelte";

  function getHeader(header: HTMLElement) {
    let initialX = 0;
    let initialY = 0;
    let currentX = 0;
    let currentY = 0;
    let overlay: HTMLElement;

    const unsub = overlayElement.subscribe((el) => {
      overlay = el;
    });

    function onMouseDown(e: MouseEvent) {
      if (e.target !== header) return;
      e.preventDefault();
      e.stopPropagation();

      initialX = e.clientX;
      initialY = e.clientY;

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
      e.preventDefault();

      currentX = initialX - e.clientX;
      currentY = initialY - e.clientY;
      initialX = e.clientX;
      initialY = e.clientY;

      overlay.style.left = overlay.offsetLeft - currentX + "px";
      overlay.style.top = overlay.offsetTop - currentY + "px";
    }

    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      setOverlayRect(overlay);
      saveOverlayRect(overlay);
    }

    header.addEventListener("mousedown", onMouseDown);

    return {
      destroy() {
        header.removeEventListener("mousedown", onMouseDown);
        unsub();
      },
    };
  }
</script>

<header use:getHeader>
  <div>
    <OffsetInput />
    <AutoScroll />
  </div>
  <div class="right-aligned">
    <Search />
    <CloseButton on:close />
  </div>
</header>

<style>
  header {
    cursor: grab;
    display: flex;
    justify-content: space-between;
    padding: 4px;
    width: 100%;
    height: 32px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.5);
  }

  header:active {
    cursor: grabbing;
  }

  header > div {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .right-aligned {
    gap: 5px;
  }
</style>
