/**
 * Broker user actions in a normalized way which is abstracted from xAPI
 * but yet mirrors much of that structure and data needs.
 */
export class UserActionBroker {
  /**
   * @todo ensure a singleton design pattern
   */
  constructor() {
    // set the built in events w/ support for others
    this.eventList = {
      click: "click",
      visibility: "visibility",
      keypress: "keypress"
    };
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
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: details
      })
    );
  }
}
