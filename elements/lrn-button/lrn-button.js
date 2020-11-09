/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { materialCssStyles } from "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 * `lrn-button`
 * `Simple button wrapper with a few options`
 * @demo demo/index.html
 * @element lrn-button
 */
class LrnButton extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --lrnsys-button-height: 48px;
        }

        :host(.center) {
          text-align: center;
        }

        a {
          text-decoration: none;
          display: block;
          color: #000000;
        }

        button {
          transition: 0.3s;
          margin: 0;
          max-width: 50%;
          height: inherit;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
          align-items: center;
          border-radius: unset;
        }

        button simple-icon {
          --simple-icon-height: var(--lrnsys-button-height);
          margin: 0 12px;
        }

        button div.inner {
          height: var(--lrnsys-button-height);
          line-height: var(--lrnsys-button-height);
          padding: 0 12px;
        }

        button span.label {
          height: var(--lrnsys-button-height);
          line-height: var(--lrnsys-button-height);
        }

        .no-margin {
          margin: 0 !important;
        }

        .no-right-padding {
          padding-right: 0 !important;
        }

        .no-left-padding {
          padding-left: 0 !important;
        }

        .center {
          text-align: center;
          margin: 0 auto;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <a
        tabindex="-1"
        id="lrnsys-button-link"
        href="${this.showHref}"
        data-prefetch-hover="${this.prefetch}"
        target="${this.target}"
      >
        <button
          id="button"
          raised="${this.raised}"
          class="${this.class} ${this.color} ${this.textColor}"
          ?disabled="${this.disabled}"
        >
          <div class="inner ${this.innerClass}">
            ${this.icon
              ? html`
                  <simple-icon
                    icon="${this.icon}"
                    id="icon"
                    class="${this.iconClass}"
                  ></simple-icon>
                `
              : ``}
            ${this.label
              ? html` <span class="label"> ${this.label} </span>`
              : ``}
            <slot></slot>
          </div>
        </button>
      </a>
      <simple-tooltip for="lrnsys-button-link" animation-delay="0"
        >${this.alt}</simple-tooltip
      >`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Standard href pass down
       */
      href: {
        type: String,
      },
      /**
       * What to display for the resource
       */
      showHref: {
        type: String,
        attribute: "show-href",
      },
      /**
       * If the button should be visually lifted off the UI.
       */
      raised: {
        type: Boolean,
      },
      /**
       * Label to place in the text area
       */
      label: {
        type: String,
      },
      target: {
        type: String,
      },
      /**
       * simple-icon to use (with iconset if needed)
       */
      icon: {
        type: String,
      },
      /**
       * Classes to add / subtract based on the item being hovered.
       */
      hoverClass: {
        type: String,
        attribute: "hover-class",
      },
      /**
       * Icon class in the event you want it to look different from the text.
       */
      iconClass: {
        type: String,
        attribute: "icon-class",
      },
      /**
       * Inner container classes.
       */
      innerClass: {
        type: String,
        attribute: "inner-class",
      },
      /**
       * materializeCSS color class
       */
      color: {
        type: String,
      },
      /**
       * materializeCSS color class for text
       */
      textColor: {
        type: String,
        attribute: "text-color",
      },
      /**
       * Allow for prefetch data on hover
       */
      prefetch: {
        type: String,
      },
      /**
       * Alt via tooltip.
       */
      alt: {
        type: String,
      },
      /**
       * Disabled state.
       */
      disabled: {
        type: Boolean,
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
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrn-button";
  }
  constructor() {
    super();
    this.href = "#";
    this.label = "";
    this.target = "";
    this.disabled = false;
    this.focusState = false;
    setTimeout(() => {
      this.addEventListener("mousedown", this.tapEventOn);
      this.addEventListener("mouseover", this.tapEventOn);
      this.addEventListener("mouseout", this.tapEventOff);
      this.addEventListener("focusin", this.tapEventOn);
      this.addEventListener("focusout", this.tapEventOff);
    }, 0);
  }
  firstUpdated() {
    this.shadowRoot
      .querySelector("#button")
      .addEventListener("focused-changed", this.focusToggle);
    if (!this.disabled) {
      this.showHref = this.href;
    }
  }

  /**
   * Class processing on un-tap / hover
   */
  tapEventOn(e) {
    if (typeof this.hoverClass !== typeof undefined && !this.disabled) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          this.shadowRoot.querySelector("#button").classList.add(item);
          if (item.indexOf("-") != -1) {
            this.shadowRoot.querySelector("#icon").classList.add(item);
          }
        }
      });
    }
  }

  /**
   * Undo class processing on un-tap / hover
   */
  tapEventOff(e) {
    if (typeof this.hoverClass !== typeof undefined && !this.disabled) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          this.shadowRoot.querySelector("#button").classList.remove(item);
          if (item.indexOf("-") != -1) {
            this.shadowRoot.querySelector("#icon").classList.remove(item);
          }
        }
      });
    }
  }

  /**
   * Handle toggle for mouse class and manage classList array for button.
   */
  focusToggle(e) {
    this.dispatchEvent(
      new CustomEvent("focus-changed", {
        bubbles: true,
        composed: true,
        detail: { focus: this.focusState },
      })
    );
    // see if it has hover classes
    if (typeof this.hoverClass !== typeof undefined && !this.disabled) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          if (this.focusState) {
            this.shadowRoot.querySelector("#button").classList.add(item);
            if (item.indexOf("-") != -1) {
              this.shadowRoot.querySelector("#icon").classList.add(item);
            }
          } else {
            this.shadowRoot.querySelector("#button").classList.remove(item);
            if (item.indexOf("-") != -1) {
              this.shadowRoot.querySelector("#icon").classList.remove(item);
            }
          }
        }
      });
    }
    this.focusState = !this.focusState;
  }
}
window.customElements.define(LrnButton.tag, LrnButton);
export { LrnButton };
