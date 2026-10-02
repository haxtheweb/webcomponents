/**
 * Broker user actions in a normalized way which is abstracted from xAPI
 * but yet mirrors much of that structure and data needs.
 */
export class UserActionBroker {
  /**
   * See if this is a valid event
   */
  valid(event) {
    return [
      "click",
      "hover",
      "mousedown",
      "mouseup",
      "visibility",
      "keypress",
      "keydown",
      "keyup",
      "focusin",
      "focusout",
    ].includes(event);
  }
  /**
   * Fire the action for the user engagement broker.
   */
  fire(eventName, eventType, details, context, demo = false) {
    // issues#3102 #53: copy the details into a fresh, normalized object
    // instead of mutating the incoming event/object (eventType used to be
    // written directly onto the caller's DOM event).
    const normalized = Object.assign({}, details, { eventType: eventType });
    context.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: normalized,
      }),
    );
    if (demo) {
      context.innerHTML = `<pre>${JSON.stringify(normalized, null, 2)}</pre>`;
    }
  }
}
export const UABroker = new UserActionBroker();
