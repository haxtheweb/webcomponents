/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { UserActionBroker } from "./lib/UserActionBroker.js";
/**
 * `user-action`
 * `track user actions and allow them to talk to xAPI stores easily`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */
class UserAction extends HTMLElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "user-action";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    this.UserActionBroker = new UserActionBroker();
    // set tag for later use
    this.tag = UserAction.tag;
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/user-action-properties.json
    let obj = UserAction.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          let val = this.getAttribute(p);
          if (obj[p].type === "Boolean") {
            val = true;
          }
          this[p] = val;
        } else {
          this[p] = obj[p].value;
        }
      }
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    this.__ready = true;
  }

  static get observedAttributes() {
    return ["track", "eventname"];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    // allow for customized event name
    if (attr === "eventname" && newValue) {
      this.UserActionBroker.eventname = newValue;
    }
    if (attr === "track" && newValue) {
      switch (newValue) {
        // visibility isn't a real event and needs a complex solution
        case "visibility":
          // set an interaction observer
          this.observer = new IntersectionObserver(
            this.handleIntersectionCallback.bind(this),
            {
              root: document.rootElement,
              rootMargin: "0px",
              threshold: [0.0, 0.25, 0.5, 0.75, 1.0]
            }
          );
          this.observer.observe(this);
          break;
        default:
          this.addEventListener(newValue, this.userActionEvent.bind(this));
          break;
      }
    }
  }
  /**
   * Handle this being visible
   */
  handleIntersectionCallback(entries) {
    for (let entry of entries) {
      if (Number(entry.intersectionRatio).toFixed(2) >= this.visiblelimit) {
        if (this.__ready) {
          this.userActionEvent({ detail: "visible" });
        }
      }
    }
  }
  /**
   * Redirect event we were monitoring into a trackable event
   */
  userActionEvent(e) {
    if (
      (!this.fired || this.every) &&
      this.UserActionBroker.valid(this.track)
    ) {
      this.UserActionBroker.fireAction(this.track, e, this);
      this.fired = true;
    } else if (!this.UserActionBroker.valid(this.track)) {
      console.warn(this.track + " was not valid");
    }
  }
}
window.customElements.define(UserAction.tag, UserAction);
export { UserAction };
