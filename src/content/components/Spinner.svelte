<!-- Made by stidges on Codepen -->
<div class="spinner">
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
</div>

<style>
  .spinner {
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .spinner > .dot {
    position: absolute;
    left: 50%;
    top: -40px;
    margin-left: -7.5px;
    width: 15px;
    height: 15px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 100%;
    transform-origin: center 40px;
    -webkit-animation: flash 2s infinite;
    animation: flash 2s infinite;
  }

  .spinner > .dot:nth-child(2) {
    transform: rotate(45deg);
    -webkit-animation-delay: 0.125s;
    animation-delay: 0.125s;
  }

  .spinner > .dot:nth-child(3) {
    transform: rotate(90deg);
    -webkit-animation-delay: 0.25s;
    animation-delay: 0.25s;
  }

  .spinner > .dot:nth-child(4) {
    transform: rotate(135deg);
    -webkit-animation-delay: 0.375s;
    animation-delay: 0.375s;
  }

  .spinner > .dot:nth-child(5) {
    transform: rotate(180deg);
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }

  .spinner > .dot:nth-child(6) {
    transform: rotate(225deg);
    -webkit-animation-delay: 0.625s;
    animation-delay: 0.625s;
  }

  .spinner > .dot:nth-child(7) {
    transform: rotate(270deg);
    -webkit-animation-delay: 0.75s;
    animation-delay: 0.75s;
  }

  .spinner > .dot:nth-child(8) {
    transform: rotate(315deg);
    -webkit-animation-delay: 0.875s;
    animation-delay: 0.875s;
  }

  @-webkit-keyframes flash {
    0% {
      background-color: rgba(255, 255, 255, 0.75);
    }
    50% {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  @keyframes flash {
    0% {
      background-color: rgba(255, 255, 255, 0.75);
    }
    50% {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
</style>
