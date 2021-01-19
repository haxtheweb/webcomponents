import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-drawer/simple-drawer.js";
import "./lrnsys-button-inner.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 * `lrnsys-drawer`
 * @element lrnsys-drawer
 *
 * @demo demo/index.html
 */
class LrnsysDrawer extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          --lrnsys-drawer-color: var(--simple-colors-foreground1);
          --lrnsys-drawer-background-color: var(--simple-colors-background1);
        }
        :host([raised]) button {
          border: 2px solid black;
        }
        button {
          display: inline-block;
          min-width: unset;
          margin: var(--lrnsys-drawer-button-margin);
          padding: var(--lrnsys-drawer-button-padding);
          border: none;
          background: transparent;
        }
        button:hover {
          cursor: pointer;
        }
      `,
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.opened = false;
    this.align = "left";
    this.disabled = false;
    this.focusState = false;
    this.avatar = "";
    this.icon = "";
    this.text = "";
    setTimeout(() => {
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    }, 0);
    this.__modal = window.SimpleDrawer.requestAvailability();
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <button
        class="${this.class}"
        id="flyouttrigger"
        @click="${this.toggleDrawer}"
        ?raised="${this.raised}"
        ?disabled="${this.disabled}"
        title="${this.alt}"
      >
        <lrnsys-button-inner
          avatar="${this.avatar}"
          icon="${this.icon}"
          text="${this.text}"
        >
          <slot name="button"></slot>
        </lrnsys-button-inner>
      </button>
      <simple-tooltip for="flyouttrigger" animation-delay="0"
        >${this.alt}</simple-tooltip
      >
    `;
  }

  static get tag() {
    return "lrnsys-drawer";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * State for if it is currently open.
       */
      opened: {
        type: Boolean,
        reflect: true,
      },
      /**
       * If the button should be visually lifted off the UI.
       */
      raised: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Icon to present for clicking.
       */
      icon: {
        type: String,
      },
      /**
       * Icon to present for clicking.
       */
      avatar: {
        type: String,
      },
      /**
       * Text to present for clicking.
       */
      text: {
        type: String,
      },
      /**
       * Side of the screen to align the flyout (right or left)
       */
      align: {
        type: String,
      },
      /**
       * Alt / hover text for this link
       */
      alt: {
        type: String,
        reflect: true,
      },
      /**
       * Header for the drawer
       */
      header: {
        type: String,
      },
      /**
       * Disabled state.
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Classes to add / subtract based on the item being hovered
       */
      hoverClass: {
        type: String,
        attribute: "hover-class",
      },
      /**
       * Tracks if focus state is applied
       */
      focusState: {
        type: Boolean,
        attribute: "focus-state",
      },
    };
  }
  /**
   * LitElement ready
   */
  firstUpdated() {
    setTimeout(() => {
      this.shadowRoot
        .querySelector("#flyouttrigger")
        .addEventListener("mousedown", this.tapEventOn.bind(this));
      this.shadowRoot
        .querySelector("#flyouttrigger")
        .addEventListener("mouseover", this.tapEventOn.bind(this));
      this.shadowRoot
        .querySelector("#flyouttrigger")
        .addEventListener("mouseout", this.tapEventOff.bind(this));
      this.shadowRoot
        .querySelector("#flyouttrigger")
        .addEventListener("focused-changed", this.focusToggle.bind(this));
    }, 0);
  }

  /**
   * Handle a mouse on event and add the hoverclasses
   * to the classList array for button.
   */
  tapEventOn(e) {
    if (typeof this.hoverClass !== typeof undefined) {
      var classes = this.hoverClass.split(" ");
      classes.forEach((item, index) => {
        if (item != "") {
          this.shadowRoot.querySelector("#flyouttrigger").classList.add(item);
        }
      });
    }
  }

  /**
   * Handle a mouse out event and remove the hoverclasses
   * from the classList array for button.
   */
  tapEventOff(e) {
    if (typeof this.hoverClass !== typeof undefined) {
      var classes = this.hoverClass.split(" ");
      classes.forEach((item, index) => {
        if (item != "") {
          this.shadowRoot
            .querySelector("#flyouttrigger")
            .classList.remove(item);
        }
      });
    }
  }

  /**
   * Toggle the drawer to open / close.
   */
  toggleDrawer() {
    // assemble everything in the slot
    let nodes = this.children;
    let h = document.createElement("span");
    let c = document.createElement("span");
    for (var i in nodes) {
      if (typeof nodes[i].tagName !== typeof undefined) {
        switch (nodes[i].getAttribute("slot")) {
          case "header":
            let tmp = nodes[i].cloneNode(true);
            tmp.removeAttribute("slot");
            h.appendChild(tmp);
            break;
          case "button":
            // do nothing
            break;
          default:
            let tmp2 = nodes[i].cloneNode(true);
            tmp2.removeAttribute("slot");
            c.appendChild(tmp2);
            break;
        }
      }
    }
    const evt = new CustomEvent("simple-drawer-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        title: this.header,
        elements: { content: c, header: h },
        invokedBy: this.shadowRoot.querySelector("#flyouttrigger"),
        align: this.align,
        size: "30%",
        clone: true,
      },
    });
    this.dispatchEvent(evt);
  }

  /**
   * Handle toggle for mouse class and manage classList array for button.
   */
  focusToggle(e) {
    this.dispatchEvent(
      new CustomEvent("focus-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { focus: this.focusState },
      })
    );
    // see if it has hover classes
    if (typeof this.hoverClass !== typeof undefined) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          if (this.focusState) {
            this.shadowRoot.querySelector("#flyouttrigger").classList.add(item);
          } else {
            this.shadowRoot
              .querySelector("#flyouttrigger")
              .classList.remove(item);
          }
        }
      });
    }
    this.focusState = !this.focusState;
  }

  /**
   * Find out if the text does not have an avatar or an icon to the left,
   * and add a class to remove the left margin.
   */
  _getTextLabelClass() {
    if (!this.avatar && !this.icon) {
      return "text-label-only";
    }
    return "text-label";
  }
}
window.customElements.define(LrnsysDrawer.tag, LrnsysDrawer);
export { LrnsysDrawer };
