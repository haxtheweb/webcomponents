import { html, css, LitElement } from "lit-element/lit-element.js";
import "../simple-popover.js";

class SimplePopoverManager extends LitElement {
  constructor() {
    super();
    this.popover = null;
    this.opened = false;
    this.context = null;
    this.orientation = "tb";
    this.position = "bottom";
    this.__ignore = false;
  }
  static get styles() {
    return [
      css`
        simple-popover {
          font-size: 14px;
          line-height: 20px;
          color: black;
          --simple-popover-color: #222222;
          --simple-popover-border-color: #222222;
          --simple-popover-background-color: #eeeeee;
          --simple-popover-padding: 4px;
          max-width: var(--simple-popover-manager-max-width, 200px);
        }
      `,
    ];
  }
  render() {
    return html`
      <simple-popover
        auto
        part="simple-popover"
        ?hidden="${!this.opened}"
        position="${this.position}"
      >
        <slot></slot>
      </simple-popover>
    `;
  }
  static get properties() {
    return {
      position: {
        type: String,
      },
      opened: {
        type: Boolean,
      },
      orientation: {
        type: String,
      },
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // ensure that changes get reflected in the direction it should point
      // or state of open. This avoids minor timing issues when element
      // being pointed to requests changes to direction / state
      if (["opened", "position", "orientation"].includes(propName)) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.popover.updatePosition();
        }, 0);
      }
    });
  }
  /**
   * set target and optionally change content and open state
   */
  setPopover(context, el, opened = null, orientation = "tb") {
    // this has the potential to cause 1 popover to change content and parent
    // in the same action. This would cause a open state change in 1 element
    // which would trigger a global state change to match.
    // The ignore flag implies we are actively switching an operation and thus
    // need to ignore the follow up change record, much like a debounce
    if (this.__ignore) {
      this.__ignore = false;
      setTimeout(() => {
        this.popover.updatePosition();
      }, 100);
    } else {
      if (el !== this.popover.target) {
        // helps manage state if multiple things leveraging this
        // yet having their own internal opened status
        if (
          this.context &&
          this.context.managerReset &&
          context !== this.context
        ) {
          this.context.managerReset();
          this.__ignore = true;
        }
        this.context = context;
        this.popover.target = null;
        this.popover.target = el;
      }
      let position;
      let menu = el.getBoundingClientRect();
      // top - bottom or left - right pointer orientation
      // Highly polarized detection of 50% in any direction
      // forces the pointer in the opposite direction
      if (orientation == "tb") {
        if (menu.y > window.innerHeight / 2) {
          position = "top";
        } else {
          position = "bottom";
        }
      } else {
        if (menu.x > window.innerWidth / 2) {
          position = "left";
        } else {
          position = "right";
        }
      }
      // see if we need to reposition
      this.orientation = orientation;
      this.position = position;
      // only open / close if told to change
      if (opened != null) {
        this.opened = opened;
      }
    }
  }
  firstUpdated() {
    this.popover = this.shadowRoot.querySelector("simple-popover");
  }
}
customElements.define("simple-popover-manager", SimplePopoverManager);
export { SimplePopoverManager };

// register globally so we can make sure there is only one
window.SimplePopoverManager = window.SimplePopoverManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.SimplePopoverManager.requestAvailability = () => {
  if (!window.SimplePopoverManager.instance) {
    window.SimplePopoverManager.instance = document.createElement(
      "simple-popover-manager"
    );
    document.body.appendChild(window.SimplePopoverManager.instance);
  }
  return window.SimplePopoverManager.instance;
};
// self append
window.SimplePopoverManager.requestAvailability();
