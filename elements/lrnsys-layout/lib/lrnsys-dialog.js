import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
`lrnsys-dialog`

* @demo demo/index.html
*/
class LrnsysDialog extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-block;
          --lrnsys-dialog-color: var(--simple-colors-foreground1, #000);
          --lrnsys-dialog-background-color: var(--simple-colors-background1);
          --lrnsys-dialog-toolbar-background-color: var(
            --simple-colors-background3
          );
          --lrnsys-dialog-secondary-background-color: rgba(255, 255, 255, 0.7);
        }
        :host([raised]) #dialogtrigger {
          border: 2px solid black;
        }
        :host([dark]) {
          --lrnsys-dialog-toolbar-background-color: var(
            --simple-colors-background1
          );
          --lrnsys-dialog-background-color: var(--simple-colors-background3);
          --lrnsys-dialog-secondary-background-color: rgba(0, 0, 0, 0.7);
        }
        #dialogtrigger {
          display: inline-block;
          min-width: unset;
          height: var(--lrnsys-button-height);
          margin: var(--lrnsys-dialog-button-margin);
          padding: var(--lrnsys-dialog-button-padding);
          border: none;
          background: transparent;
        }
        #dialogtrigger:hover {
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
    this.disabled = false;
    this.focusState = false;
    this.avatar = "";
    this.icon = "";
    this.text = "";
    this.headingClass = "white-text black";
    setTimeout(() => {
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      import("./lrnsys-button-inner.js");
    }, 0);
    this.__modal = window.SimpleModal.requestAvailability();
  }
  render() {
    return html`
      <button
        class="${this.class}"
        id="dialogtrigger"
        @click="${this.openDialog}"
        @focus-changed="${this.focusToggle}"
        @mousedown="${this.tapEventOn}"
        @mouseover="${this.tapEventOn}"
        @mouseout="${this.tapEventOff}"
        ?raised="${this.raised}"
        ?disabled="${this.disabled}"
        title="${this.alt}"
        aria-label="${this.alt}"
      >
        <lrnsys-button-inner
          avatar="${this.avatar}"
          icon="${this.icon}"
          text="${this.text}"
        >
          <slot name="button"></slot>
        </lrnsys-button-inner>
      </button>
      <simple-tooltip
        for="dialogtrigger"
        animation-delay="0"
        ?hidden="${!this.alt}"
        >${this.alt}</simple-tooltip
      >
    `;
  }

  static get tag() {
    return "lrnsys-dialog";
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      /**
       * Icon to present for clicking.
       */
      icon: {
        type: String,
      },
      /**
       * If the button should be visually lifted off the UI.
       */
      raised: {
        type: Boolean,
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
       * Alt / hover text for this link
       */
      alt: {
        type: String,
        reflect: true,
      },
      /**
       * Header for the dialog
       */
      header: {
        type: String,
      },
      /**
       * Disabled state.
       */
      disabled: {
        type: Boolean,
      },
      /**
       * Classes to add / subtract based on the item being hovered
       */
      hoverClass: {
        type: String,
        attribute: "hover-class",
      },
      /**
       * Default heading classes.
       */
      headingClass: {
        type: String,
        attribute: "heading-class",
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
   * Handle a focus/tap event and add the hoverclasses
   * to the classList array for button.
   */
  tapEventOn(e) {
    if (typeof this.hoverClass !== typeof undefined) {
      var classes = this.hoverClass.split(" ");
      classes.forEach((item, index) => {
        if (item != "") {
          this.shadowRoot.querySelector("#dialogtrigger").classList.add(item);
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
            .querySelector("#dialogtrigger")
            .classList.remove(item);
        }
      });
    }
  }
  toggleDialog() {
    this.openDialog();
  }
  /**
   * Toggle the drawer to open / close.
   */
  openDialog() {
    // assemble everything in the slot
    let nodes = this.children;
    let h = document.createElement("span");
    let c = document.createElement("span");
    let node = {};
    for (var i in nodes) {
      if (typeof nodes[i].tagName !== typeof undefined) {
        switch (nodes[i].getAttribute("slot")) {
          case "toolbar-primary":
          case "toolbar-secondary":
          case "toolbar":
          case "header":
            node = nodes[i].cloneNode(true);
            node.removeAttribute("slot");
            h.appendChild(node);
            break;
          case "button":
            // do nothing
            break;
          default:
            node = nodes[i].cloneNode(true);
            node.removeAttribute("slot");
            c.appendChild(node);
            break;
        }
      }
    }
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        title: this.header,
        elements: {
          header: h,
          content: c,
        },
        styles: {
          "--simple-modal-width": "75vw",
          "--simple-modal-max-width": "75vw",
          "--simple-modal-min-height": "50vh",
        },
        invokedBy: this.shadowRoot.querySelector("#dialogtrigger"),
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
            this.shadowRoot.querySelector("#dialogtrigger").classList.add(item);
          } else {
            this.shadowRoot
              .querySelector("#dialogtrigger")
              .classList.remove(item);
          }
        }
      });
    }
    this.focusState = !this.focusState;
  }
}
window.customElements.define(LrnsysDialog.tag, LrnsysDialog);
export { LrnsysDialog };
