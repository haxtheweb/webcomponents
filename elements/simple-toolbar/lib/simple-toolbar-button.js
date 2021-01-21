/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";

const SimpleToolbarButtonBehaviors = function (SuperClass) {
  return class extends SuperClass {
    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "simple-toolbar-button";
    }

    static get properties() {
      return {
        /**
         * The `id` of the `simple-toolbar` that the toolbar controls.
         */
        controls: {
          type: String,
        },

        /**
         * Is the button disabled? Default is false.
         */
        disabled: {
          type: Boolean,
        },

        /**
         * Optional iron icon name for the button.
         */
        icon: {
          type: String,
        },

        /**
         * Label for the icon.
         */
        label: {
          type: String,
        },

        /**
         * Optional space-sperated list of keyboard shortcuts for the editor
         */
        shortcutKeys: {
          attribute: "shortcut-keys",
          type: String,
        },

        /**
         * Show text label even if an icon is named?
         */
        showTextLabel: {
          attribute: "show-text-label",
          type: Boolean,
        },

        /**
         * The active selected range, inherited from the toolbar
         */
        target: {
          type: Object,
        },

        /**
         * Optional iron icon name for the button if it is toggled.
         */
        toggledIcon: {
          attribute: "toggled-icon",
          type: String,
        },

        /**
         * Label for the icon, if button is toggled.
         */
        toggledLabel: {
          attribute: "toggled-label",
          type: String,
        },
        /**
         * Can this button toggle?
         */
        toggles: {
          type: Boolean,
        },
        /**
         * Can this button toggle?
         */
        toggled: {
          attribute: "toggled",
          type: Boolean,
        },
      };
    }

    constructor() {
      super();
      this.disabled = false;
      this.showTextLabel = false;
      this.toggles = false;
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    }
    /**
     * gets button element
     *
     * @readonly
     * @memberof SimpleToolbarButton
     */
    get button() {
      if (!this.__button)
        this.__button =
          this.shadowRoot && this.shadowRoot.querySelector("#toolbar")
            ? this.shadowRoot.querySelector("#toolbar")
            : undefined;
      return this.__button;
    }
    /**
     * current label based on toggled state
     *
     * @readonly
     * @memberof SimpleToolbarButton
     */
    get currentLabel() {
      return this._defaultOrToggled(
        this.label,
        this.toggledLabel,
        this.isToggled
      );
    }

    /**
     * current icon based on toggled state
     *
     * @readonly
     * @memberof SimpleToolbarButton
     */
    get currentIcon() {
      return this._defaultOrToggled(
        this.icon,
        this.toggledIcon,
        this.isToggled
      );
    }

    /**
     * label is offscreen (screenreader-only)
     *
     * @readonly
     * @memberof SimpleToolbarButton
     */
    get labelStyle() {
      return !!this.icon && this.icon !== "" && this.showTextLabel === false
        ? "offscreen"
        : null;
    }
    /**
     * determines if button is toggled
     *
     * @readonly
     */
    get isToggled() {
      return this.toggles & this.toggled;
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName == "shortcutKeys")
          this.dispatchEvent(
            new CustomEvent("change-shortcut-keys", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                button: this,
                shortcutKeys: oldValue,
              },
            })
          );
      });
    }
    /**
     * Called every time the element is inserted into the DOM. Useful for
     * running setup code, such as fetching resources or rendering.
     * Generally, you should try to delay work until this time.
     */
    connectedCallback() {
      super.connectedCallback();
      this.dispatchEvent(
        new CustomEvent("register-button", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }
    /**
     * life cycle, element is detatched
     */
    disconnectedCallback() {
      this.dispatchEvent(
        new CustomEvent("deregister-button", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
      super.disconnectedCallback();
    }

    /**
     * updates a button value based on whether or not button is toggled
     *
     * @param {string} the value when toggled off
     * @param {string} the value when toggled on
     * @param {boolean} whether the button is toggled
     * @returns {string} the correct value based on
     * whether or not the button is toggled
     */
    _defaultOrToggled(toggledOff, toggledOn) {
      return !!toggledOn && this.isToggled ? toggledOn : toggledOff;
    }
    /**
     * handles button click
     *
     * @param {event} e event
     */
    _handleClick(e) {
      this.toggle();
    }

    toggle() {
      if (this.toggles) this.toggled = !this.toggled;
    }

    get iconTemplate() {
      return html`<simple-icon-lite
        id="icon"
        aria-hidden="true"
        icon="${this.currentIcon}"
      ></simple-icon-lite>`;
    }
    get labelTemplate() {
      return html`<span id="label" class="${this.labelStyle}"
        >${this.currentLabel}</span
      >`;
    }
    get tooltipTemplate() {
      return html`<simple-tooltip id="tooltip" for="button"
        >${this.currentLabel}</simple-tooltip
      >`;
    }
    get buttonTemplate() {
      return this.toggles
        ? html` <button
              id="button"
              aria-pressed="${this.isToggled ? "true" : "false"}"
              class="simple-toolbar-button"
              ?disabled="${this.disabled}"
              ?controls="${this.controls}"
              @click="${this._handleClick}"
              tabindex="0"
            >
              ${this.iconTemplate} ${this.labelTemplate}
            </button>
            ${this.tooltipTemplate}`
        : html` <button
              id="button"
              class="simple-toolbar-button"
              ?disabled="${this.disabled}"
              ?controls="${this.controls}"
              @click="${this._handleClick}"
              tabindex="0"
            >
              ${this.iconTemplate} ${this.labelTemplate}
            </button>
            ${this.tooltipTemplate}`;
    }
    render() {
      return html`${this.buttonTemplate}`;
    }
    static get labelStyles() {
      return [
        css`
          #label {
            position: absolute;
            left: -999999px;
            top: 0;
            height: 0;
            width: 0;
            overflow: hidden;
          }
        `,
      ];
    }
    static get iconStyles() {
      return [
        css`
          #icon:not([icon]) {
            display: none;
          }
        `,
      ];
    }
    static get tooltipStyles() {
      return [
        css`
          simple-tooltip {
            z-index: 2;
          }
        `,
      ];
    }
    static get buttonStyles() {
      return [
        css`
          :host([hidden]) {
            display: none;
          }
          #button {
            min-width: var(--simple-toolbar-button-min-width, 24px);
            height: var(--simple-toolbar-button-height, 24px);
            margin: var(--simple-toolbar-button-margin, 3px);
            padding: var(--simple-toolbar-button-padding, 0);
            color: var(--simple-toolbar-button-color);
            border-color: var(--simple-toolbar-border-color, transparent);
            background-color: var(--simple-toolbar-button-bg, transparent);
            border-width: 0px;
            border-style: solid;
            text-transform: unset;
            transition: all 0.5s;
          }
          #button[aria-pressed="true"] {
            color: var(--simple-toolbar-button-toggled-color);
            border-color: var(--simple-toolbar-toggled-border-color, #ddd);
            background-color: var(
              --simple-toolbar-button-toggled-bg,
              rgba(0, 0, 0, 0.1)
            );
          }
          #button:focus,
          #button:hover {
            color: var(--simple-toolbar-button-hover-color);
            background-color: var(--simple-toolbar-button-hover-bg);
          }
          #button[disabled] {
            cursor: not-allowed;
            color: var(--simple-toolbar-button-disabled-color, unset);
            background-color: var(--simple-toolbar-button-disabled-bg, unset);
          }
        `,
      ];
    }
    static get styles() {
      console.log(this.buttonStyles);
      return [
        ...(super.styles || []),
        ...this.buttonStyles,
        ...this.iconStyles,
        ...this.labelStyles,
        ...this.tooltipStyles,
      ];
    }
  };
};
/**
 * `simple-toolbar-button`
 * a button for rich text editor (custom buttons can extend this)
 *
 * @element simple-toolbar-button
 * @demo ./demo/buttons.html
 */
class SimpleToolbarButton extends SimpleToolbarButtonBehaviors(LitElement) {}
window.customElements.define(SimpleToolbarButton.tag, SimpleToolbarButton);
export { SimpleToolbarButton, SimpleToolbarButtonBehaviors };
