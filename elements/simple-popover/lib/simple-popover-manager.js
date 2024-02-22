import { html, css, LitElement } from "lit";
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
          font-family: var(--simple-tour-font-family, unset);
          font-size: var(--simple-tour-font-size, 14px);
          max-width: var(--simple-popover-manager-max-width, 200px);
          min-width: var(--simple-popover-manager-min-width, 200px);
          display: flex;
          --simple-popover-padding: 0;
          --simple-icon-button-border: 1px solid
            var(--simple-tour-border-color, #ddd);
          --simple-icon-button-border-radius: 3px;
        }
        simple-popover[hidden] {
          display: none !important;
        }
        .heading {
          font-size: var(--simple-tour-titlebar-font-size, 14px);
          flex: 0 0 auto;
          background-color: var(
            --simple-tour-titlebar-background-color,
            #f0f4f8
          );
          border-bottom: 1px solid var(--simple-tour-border-color, #ddd);
          line-height: 130%;
          padding: var(--simple-tour-padding-sm, 2px)
            var(--simple-tour-padding-sm, 2px)
            var(--simple-tour-padding-sm, 2px)
            var(--simple-tour-padding-lg, 10px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
        }
        .body {
          flex: 1 1 auto;
          padding: var(--simple-tour-padding-sm, 2px)
            var(--simple-tour-padding-lg, 10px);
          background-color: var(--simple-tour-background-color, #fff);
        }
        .nav {
          flex: 0 0 auto;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          bottom: 0;
          background-color: var(--simple-tour-background-color, #fff);
        }
        ::slotted(.title) {
          font-size: var(--simple-tour-titlebar-font-size, 14px);
          margin: 0 calc(2 * var(--simple-tour-padding-sm, 2px)) 0 0;
          line-height: 100%;
        }
        ::slotted(.subheading) {
          font-size: var(--simple-tour-subheading-font-size, 16px);
        }
        ::slotted([slot="body"]) {
          margin: var(--simple-tour-padding-sm, 2px) 0;
        }
        ::slotted(simple-icon-button-lite) {
          flex: 1 1 auto;
          background-color: var(--simple-tour-background-color, #fff);
        }
        ::slotted(simple-icon-button-lite[slot="heading"]) {
          flex: 0 0 auto;
        }
        ::slotted(simple-icon-button-lite:focus-within),
        ::slotted(simple-icon-button-lite:hover) {
          --simple-icon-button-border: 1px solid #000;
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
        fit-to-visible-bounds
      >
        <div class="heading" part="simple-popover-heading">
          <slot name="heading"></slot>
        </div>
        <div class="body" part="simple-popover-body">
          <slot name="body"></slot>
        </div>
        <div class="nav" part="simple-popover-nav">
          <slot name="nav"></slot>
        </div>
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
      popover: {
        type: Object,
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
          if (this.shadowRoot && this.popover && this.popover.updatePosition) {
            this.popover.updatePosition();
          }
        }, 0);
      }
    });
  }
  /**
   * set target and optionally change content and open state
   */
  setPopover(context, el, opened = null, orientation = "tb", mode) {
    // this has the potential to cause 1 popover to change content and parent
    // in the same action. This would cause a open state change in 1 element
    // which would trigger a global state change to match.
    // The ignore flag implies we are actively switching an operation and thus
    // need to ignore the follow up change record, much like a debounce
    if (this.__ignore) {
      this.__ignore = false;
      setTimeout(() => {
        if (this.shadowRoot && this.popover && this.popover.updatePosition) {
          this.popover.updatePosition();
        }
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
        this.setAttribute("mode", mode || "");
        this.popover.target = null;
        this.popover.target = el;
      }
      let position;
      let menu = el.getBoundingClientRect();
      // top - bottom or left - right pointer orientation
      // Highly polarized detection of 50% in any direction
      // forces the pointer in the opposite direction
      if (orientation == "tb") {
        if (menu.y > globalThis.innerHeight / 2) {
          position = "top";
        } else {
          position = "bottom";
        }
      } else {
        if (menu.x > globalThis.innerWidth / 2) {
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
globalThis.SimplePopoverManager = globalThis.SimplePopoverManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.SimplePopoverManager.requestAvailability = () => {
  if (!globalThis.SimplePopoverManager.instance) {
    globalThis.SimplePopoverManager.instance =
      globalThis.document.createElement("simple-popover-manager");
    globalThis.document.body.appendChild(
      globalThis.SimplePopoverManager.instance,
    );
  }
  return globalThis.SimplePopoverManager.instance;
};
// self append
globalThis.SimplePopoverManager.requestAvailability();
