import { html, css, LitElement } from "lit-element/lit-element.js";
import "../simple-popover.js";

class SimplePopoverManager extends LitElement {
  constructor() {
    super();
    this.popover = null;
    this.opened = false;
    this.context = null;
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
          max-width: 200px;
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
    };
  }
  /**
   * set target and optionally change content and open state
   */
  setPopover(context, el, opened = null, position = null) {
    // this has the potential to cause 1 popover to change content and parent
    // in the same action. This would cause a open state change in 1 element
    // which would trigger a global state change to match.
    // The ignore flag implies we are actively switching an operation and thus
    // need to ignore the follow up change record, much like a debounce
    if (this.__ignore) {
      this.__ignore = false;
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
        this.popover.target = el;
      }
      // only open / close if told to change
      if (opened != null) {
        this.opened = opened;
      }
    }
    // only reposition if told
    if (position != null) {
      this.position = position;
    }
    setTimeout(() => {
      this.popover.updatePosition();
    }, 10);
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
