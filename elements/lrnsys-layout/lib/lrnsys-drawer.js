import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-drawer/simple-drawer.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "./lrnsys-button-inner.js";
/**
 * `lrnsys-drawer`
 *
 * @demo demo/index.html
 */
class LrnsysDrawer extends PolymerElement {
  static get template() {
    return html`
      <style include="simple-colors">
        :host {
          display: block;
          --lrnsys-drawer-color: var(--simple-colors-foreground1);
          --lrnsys-drawer-background-color: var(--simple-colors-background1);
        }
        paper-button {
          display: inline-block;
        }
      </style>
      <paper-button
        class\$="[[class]]"
        id="flyouttrigger"
        on-tap="toggleDrawer"
        raised="[[raised]]"
        disabled\$="[[disabled]]"
        title="[[alt]]"
      >
        <lrnsys-button-inner
          avatar="[[avatar]]"
          icon="[[icon]]"
          text="[[text]]"
        >
          <slot name="button"></slot>
        </lrnsys-button-inner>
      </paper-button>
      <paper-tooltip for="flyouttrigger" animation-delay="0"
        >[[alt]]</paper-tooltip
      >
    `;
  }

  static get tag() {
    return "lrnsys-drawer";
  }
  static get properties() {
    return {
      /**
       * State for if it is currently open.
       */
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * If the button should be visually lifted off the UI.
       */
      raised: {
        type: Boolean,
        reflectToAttribute: true
      },
      /**
       * Icon to present for clicking.
       */
      icon: {
        type: String
      },
      /**
       * Icon to present for clicking.
       */
      avatar: {
        type: String
      },
      /**
       * Text to present for clicking.
       */
      text: {
        type: String
      },
      /**
       * Side of the screen to align the flyout (right or left)
       */
      align: {
        type: String,
        value: "left"
      },
      /**
       * Alt / hover text for this link
       */
      alt: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * Header for the drawer
       */
      header: {
        type: String
      },
      /**
       * Disabled state.
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Classes to add / subtract based on the item being hovered
       */
      hoverClass: {
        type: String
      },
      /**
       * Heading classes to apply downstream.
       */
      headingClass: {
        type: String,
        value: "white-text black"
      },
      /**
       * Tracks if focus state is applied
       */
      focusState: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * Ready lifecycle
   */
  ready() {
    super.ready();
    this.__modal = window.SimpleDrawer.requestAvailability();
  }

  /**
   * Attached lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("mousedown", this.tapEventOn.bind(this));
      this.addEventListener("mouseover", this.tapEventOn.bind(this));
      this.addEventListener("mouseout", this.tapEventOff.bind(this));
      this.$.flyouttrigger.addEventListener(
        "focused-changed",
        this.focusToggle.bind(this)
      );
    });
  }
  /**
   * detached lifecycle
   */
  disconnectedCallback() {
    this.removeEventListener("mousedown", this.tapEventOn.bind(this));
    this.removeEventListener("mouseover", this.tapEventOn.bind(this));
    this.removeEventListener("mouseout", this.tapEventOff.bind(this));
    this.$.flyouttrigger.removeEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
    super.disconnectedCallback();
  }

  /**
   * Handle a mouse on event and add the hoverclasses
   * to the classList array for paper-button.
   */
  tapEventOn(e) {
    if (typeof this.hoverClass !== typeof undefined) {
      var classes = this.hoverClass.split(" ");
      classes.forEach((item, index) => {
        if (item != "") {
          this.$.flyouttrigger.classList.add(item);
        }
      });
    }
  }

  /**
   * Handle a mouse out event and remove the hoverclasses
   * from the classList array for paper-button.
   */
  tapEventOff(e) {
    if (typeof this.hoverClass !== typeof undefined) {
      var classes = this.hoverClass.split(" ");
      classes.forEach((item, index) => {
        if (item != "") {
          this.$.flyouttrigger.classList.remove(item);
        }
      });
    }
  }

  /**
   * Toggle the drawer to open / close.
   */
  toggleDrawer() {
    // assemble everything in the slot
    let nodes = dom(this).getEffectiveChildNodes();
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
        invokedBy: this.$.flyouttrigger,
        align: this.align,
        size: "30%",
        clone: true
      }
    });
    this.dispatchEvent(evt);
  }

  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  focusToggle(e) {
    this.dispatchEvent(
      new CustomEvent("focus-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { focus: this.focusState }
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
            this.$.flyouttrigger.classList.add(item);
          } else {
            this.$.flyouttrigger.classList.remove(item);
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
