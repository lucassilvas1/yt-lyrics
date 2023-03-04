export const b = (function () {
  //@ts-ignore
  if (typeof browser === "undefined") {
    var browser = chrome;
  }
  return browser;
})();

export function random(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
