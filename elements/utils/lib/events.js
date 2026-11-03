export function normalizeEventPath(e) {
  if (e.composedPath) {
    return e.composedPath();
  } else if (e.path) {
    return e.path;
  } else if (e.originalTarget) {
    return [e.originalTarget];
  } else {
    return [e.target];
  }
}

/**
 * Call `onSettle` exactly once: when any of `eventNames` fires on `target`,
 * when `timeoutMs` passes, or when the returned `settle(value)` is called,
 * whichever comes first. The listeners and the timer are removed on settle.
 * Event and timeout settles pass no value; `settle(value)` passes its own.
 * @param {String|Array<String>} eventNames event(s) that end the wait
 * @param {Number} timeoutMs fallback delay before settling anyway
 * @param {Function} onSettle receives the value given to settle(), if any
 * @param {EventTarget} target where to listen (defaults to globalThis)
 * @returns {Function} settle(value) to end the wait early
 */
export function settleOnce(
  eventNames,
  timeoutMs,
  onSettle,
  target = globalThis,
) {
  const names = [].concat(eventNames);
  let done = false;
  let timer = null;
  const onEvent = () => settle();
  const settle = (value) => {
    if (done) {
      return;
    }
    done = true;
    clearTimeout(timer);
    names.forEach((name) => target.removeEventListener(name, onEvent));
    onSettle(value);
  };
  names.forEach((name) => target.addEventListener(name, onEvent));
  timer = setTimeout(() => settle(), timeoutMs);
  return settle;
}
