/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
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
  // render function
  get html() {
    return `
<style></style>
<slot></slot>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "User action",
        description:
          "track user actions and allow them to talk to xAPI stores easily",
        icon: "icons:touch-app",
        color: "green",
        groups: ["Action"],
        handles: [
          {
            type: "inline",
            text: ""
          }
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            attribute: "track",
            title: "Track when the user: ",
            description: "What event to react to",
            inputMethod: "select",
            options: {
              visibility: "Can see this",
              keypress: "Presses a key here",
              click: "Clicks this"
            },
            required: true,
            icon: "icons:android"
          },
          {
            attribute: "every",
            title: "Track every event",
            description:
              "Default behavior is just to track the first occurance",
            inputMethod: "boolean",
            required: false,
            icon: "icons:android"
          },
          {
            slot: "",
            title: "Content",
            description: "Content that can emit events",
            inputMethod: "code-editor",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    let props = {
      track: {
        name: "track",
        type: String,
        value: "visibility"
      },
      eventname: {
        name: "eventname",
        type: String,
        value: "user-engagement"
      },
      every: {
        name: "every",
        type: Boolean,
        value: false
      },
      visiblelimit: {
        name: "visiblelimit",
        type: Number,
        value: 0.5
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

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
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(UserAction.haxProperties, UserAction.tag, this);
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
