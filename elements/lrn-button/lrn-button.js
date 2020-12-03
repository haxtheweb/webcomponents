/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `lrn-button`
 * `Simple button wrapper with a few options`
 * @demo demo/index.html
 * @element lrn-button
 */
class LrnButton extends SimpleColors {
  //styles function
  static get styles() {
    return [
      ...super.styles,
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
          border-radius: var(--lrn-button-border-radius, unset);
          background-color: var(
            --lrn-button-background-color,
            var(--simple-colors-default-theme-accent-2, white)
          );
          border: var(--lrn-button-border-width, 0px) solid
            var(
              --lrn-button-border-color,
              var(--simple-colors-default-theme-accent-2, #ddd)
            );
          color: var(
            --lrn-button-color,
            var(--simple-colors-default-theme-grey-12, black)
          );
        }

        :host([accent-color="grey"]) button,
        :host([text-color]) button,
        :host([dark][accent-color="grey"]) button,
        :host([dark][text-color]) button {
          background-color: var(
            --lrn-button-background-color,
            var(--simple-colors-default-theme-grey-1, white)
          );
          border-color: var(
            --lrn-button-border-color,
            var(--simple-colors-default-theme-grey-3, #ddd)
          );
          color: var(
            --lrn-button-color,
            var(--simple-colors-default-theme-grey-12, black)
          );
        }

        :host([text-color]) button,
        :host([text-color][dark]) button {
          color: var(
            --lrn-button-color,
            var(--simple-colors-default-theme-accent-9, black)
          );
        }

        button:focus,
        button:hover {
          background-color: var(
            --lrn-button-focus-background-color,
            var(
              --lrn-button-background-color,
              var(--simple-colors-default-theme-accent-3, white)
            )
          );
          border-color: var(
            --lrn-button-focus-border-color,
            var(
              --lrn-button-border-color,
              var(--simple-colors-default-theme-accent-3, #ddd)
            )
          );
        }

        :host([accent-color="grey"]) button:focus,
        :host([text-color]) button:focus,
        :host([dark][accent-color="grey"]) button:focus,
        :host([dark][text-color]) button:focus,
        :host([accent-color="grey"]) button:hover,
        :host([text-color]) button:hover,
        :host([dark][accent-color="grey"]) button:hover,
        :host([dark][text-color]) button:hover {
          background-color: var(
            --lrn-button-focus-background-color,
            var(
              --lrn-button-background-color,
              var(--simple-colors-default-theme-grey-2, white)
            )
          );
          border-color: var(
            --lrn-button-focus-border-color,
            var(
              --lrn-button-border-color,
              var(--simple-colors-default-theme-grey-3, #ddd)
            )
          );
        }

        button simple-icon-lite {
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
          class="${this.class}"
          ?disabled="${this.disabled}"
        >
          <div class="inner ${this.innerClass}">
            ${this.icon
              ? html`
                  <simple-icon-lite
                    icon="${this.icon}"
                    id="icon"
                  ></simple-icon-lite>
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
      dark: {
        type: Boolean,
        reflect: true,
      },
      /**
       * materializeCSS color class
       */
      accentColor: {
        type: String,
        attribute: "accent-color",
        reflect: true,
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
        type: Boolean,
        attribute: "text-color",
        reflect: true,
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
    this.dark = false;
    this.color = "grey";
    setTimeout(() => {
      this.addEventListener("mousedown", this.tapEventOn);
      this.addEventListener("mouseover", this.tapEventOn);
      this.addEventListener("mouseout", this.tapEventOff);
      this.addEventListener("focusin", this.tapEventOn);
      this.addEventListener("focusout", this.tapEventOff);
    }, 0);
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "color") this.accentColor = this.color;
      console.log(propName, this.color, this.accentColor);
    });
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
