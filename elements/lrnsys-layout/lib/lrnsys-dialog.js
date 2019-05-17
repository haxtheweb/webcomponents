import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/neon-animation/neon-animations.js";
import "@polymer/iron-icons/iron-icons.js";
import "./lrnsys-button-inner.js";
/**
`lrnsys-dialog`

* @demo demo/index.html
*/
class LrnsysDialog extends PolymerElement {
  static get template() {
    return html`
      <custom-style>
        <style is="custom-style" include="simple-colors">
          :host {
            display: inline-block;
            --lrnsys-dialog-color: var(--simple-colors-foreground1, #000);
            --lrnsys-dialog-background-color: var(--simple-colors-background1);
            --lrnsys-dialog-toolbar-background-color: var(
              --simple-colors-background3
            );
            --lrnsys-dialog-secondary-background-color: rgba(
              255,
              255,
              255,
              0.7
            );
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
            margin: var(--lrnsys-dialog-button-margin);
            padding: var(--lrnsys-dialog-button-padding);
            @apply --lrnsys-dialog-button;
          }
        </style>
      </custom-style>
      <paper-button
        class$="[[class]]"
        id="dialogtrigger"
        on-click="openDialog"
        raised="[[raised]]"
        disabled$="[[disabled]]"
        title="[[alt]]"
        aria-label$="[[alt]]"
      >
        <lrnsys-button-inner
          avatar$="[[avatar]]"
          icon$="[[icon]]"
          text$="[[text]]"
        >
          <slot name="button" slot="button"></slot>
        </lrnsys-button-inner>
      </paper-button>
      <paper-tooltip for="dialogtrigger" animation-delay="0" hidden$="[[!alt]]"
        >[[alt]]</paper-tooltip
      >
    `;
  }

  static get tag() {
    return "lrnsys-dialog";
  }

  static get properties() {
    return {
      /**
       * Icon to present for clicking.
       */
      icon: {
        type: String
      },
      /**
       * If the button should be visually lifted off the UI.
       */
      raised: {
        type: Boolean
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
       * Alt / hover text for this link
       */
      alt: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * Header for the dialog
       */
      header: {
        type: String
      },
      /**
       * Disabled state.
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * Classes to add / subtract based on the item being hovered
       */
      hoverClass: {
        type: String
      },
      /**
       * Default heading classes.
       */
      headingClass: {
        type: String,
        value: "white-text black"
      },
      /**
       * Support for dynamic loading of iron-image elements that are in the content slot.
       */
      dynamicImages: {
        type: Boolean,
        value: false
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
   * Handle a focus/tap event and add the hoverclasses
   * to the classList array for paper-button.
   */
  tapEventOn(e) {
    if (typeof this.hoverClass !== typeof undefined) {
      var classes = this.hoverClass.split(" ");
      classes.forEach((item, index) => {
        if (item != "") {
          this.$.dialogtrigger.classList.add(item);
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
          this.$.dialogtrigger.classList.remove(item);
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
    let nodes = dom(this).getEffectiveChildNodes();
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
            if (this.dynamicImages && node.tagName === "IRON-IMAGE") {
              node.preventLoad = false;
              node.removeAttribute("prevent-load");
            }
            c.appendChild(node);
            break;
        }
      }
    }
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        title: this.header,
        elements: {
          header: h,
          content: c
        },
        invokedBy: this.$.dialogtrigger,
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
            this.$.dialogtrigger.classList.add(item);
          } else {
            this.$.dialogtrigger.classList.remove(item);
          }
        }
      });
    }
    this.focusState = !this.focusState;
  }
  /**
   * Ready lifecycle
   */
  ready() {
    super.ready();
    this.__modal = window.SimpleModal.requestAvailability();
  }

  /**
   * Attached lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.$.dialogtrigger.addEventListener(
        "focused-changed",
        this.focusToggle.bind(this)
      );
      this.$.dialogtrigger.addEventListener(
        "mousedown",
        this.tapEventOn.bind(this)
      );
      this.$.dialogtrigger.addEventListener(
        "mouseover",
        this.tapEventOn.bind(this)
      );
      this.$.dialogtrigger.addEventListener(
        "mouseout",
        this.tapEventOff.bind(this)
      );
    });
  }
  /**
   * detached lifecycle
   */
  disconnectedCallback() {
    this.$.dialogtrigger.removeEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
    this.$.dialogtrigger.removeEventListener(
      "mousedown",
      this.tapEventOn.bind(this)
    );
    this.$.dialogtrigger.removeEventListener(
      "mouseover",
      this.tapEventOn.bind(this)
    );
    this.$.dialogtrigger.removeEventListener(
      "mouseout",
      this.tapEventOff.bind(this)
    );
    super.disconnectedCallback();
  }
}
window.customElements.define(LrnsysDialog.tag, LrnsysDialog);
export { LrnsysDialog };
