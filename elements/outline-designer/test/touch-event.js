/**
 * Build a touch event the way a phone sends it, in any engine.
 * Desktop Firefox has no Touch/TouchEvent and desktop WebKit refuses
 * `new Touch()`, so when the real constructors are missing or throw, this
 * dispatches a plain cancelable event carrying the same touches and
 * changedTouches lists. outline-designer only reads those lists, type and
 * cancelable, so both forms drive it identically.
 *
 * @param {EventTarget} target where the finger is
 * @param {string} type touchstart | touchmove | touchend | touchcancel
 * @param {{x: number, y: number}} point client coordinates
 * @param {number} id touch identifier
 * @returns {Event} the touch event, not yet dispatched
 */
export function makeTouchEvent(target, type, point, id) {
  const init = {
    identifier: id,
    target,
    clientX: point.x,
    clientY: point.y,
    pageX: point.x,
    pageY: point.y,
    screenX: point.x,
    screenY: point.y,
  };
  const ended = type === "touchend" || type === "touchcancel";
  let event = null;
  try {
    const t = new Touch(init);
    event = new TouchEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      touches: ended ? [] : [t],
      targetTouches: ended ? [] : [t],
      changedTouches: [t],
    });
  } catch {
    const t = Object.freeze({ ...init });
    event = new Event(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    Object.defineProperty(event, "touches", { value: ended ? [] : [t] });
    Object.defineProperty(event, "targetTouches", { value: ended ? [] : [t] });
    Object.defineProperty(event, "changedTouches", { value: [t] });
  }
  return event;
}

/**
 * Build a touch event with makeTouchEvent and dispatch it on the target.
 *
 * @param {EventTarget} target where the finger is
 * @param {string} type touchstart | touchmove | touchend | touchcancel
 * @param {{x: number, y: number}} point client coordinates
 * @param {number} id touch identifier
 * @returns {boolean} dispatchEvent's result
 */
export function dispatchTouch(target, type, point, id) {
  return target.dispatchEvent(makeTouchEvent(target, type, point, id));
}
