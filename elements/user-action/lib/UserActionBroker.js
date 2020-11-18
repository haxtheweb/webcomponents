/**
 * Broker user actions in a normalized way which is abstracted from xAPI
 * but yet mirrors much of that structure and data needs.
 */
export class UserActionBroker {
  constructor() {
    // set the built in events w/ support for others
    this.eventList = {
      click: "click",
      mousedown: "mousedown",
      mouseup: "mouseup",
      visibility: "visibility",
      keypress: "keypress",
      keydown: "keydown",
      keyup: "keyup",
    };
    this.eventname = "user-engagement";
  }
  /**
   * See if this is a valid event
   */
  valid(event) {
    if (this.eventList[event]) {
      return true;
    }
    return false;
  }
  /**
   * Fire the action for the user engagement broker.
   */
  fireAction(eventType, details, context) {
    details.eventType = eventType;
    context.dispatchEvent(
      new CustomEvent(this.eventname, {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: details,
      })
    );
  }
}
