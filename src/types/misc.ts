export type TimeoutID = ReturnType<typeof setTimeout>;
export type IntervalID = ReturnType<typeof setInterval>;

export interface OverlayRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}
