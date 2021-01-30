/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";

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
          attribute: "controls",
          reflect: true,
        },

        /**
         * Is the button disabled? Default is false.
         */
        disabled: {
          type: Boolean,
          attribute: "disabled",
          reflect: true,
        },

        /**
         * Optional iron icon name for the button.
         */
        icon: {
          type: String,
          attribute: "icon",
          reflect: true,
        },

        /**
         * Label for the icon.
         */
        label: {
          type: String,
        },

        /**
         * Optional space-separated list of shortcut keys
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
      this.shortcutKeys = "";
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
          this.shadowRoot && this.shadowRoot.querySelector("#button")
            ? this.shadowRoot.querySelector("#button")
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
      changedProperties.forEach((oldValue, propName) => {});
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
    /**
     * customizable event for when shortcut keys are pressed
     *
     * @param {string} key
     */
    _handleShortcutKeys(e, key) {}

    toggle() {
      if (this.toggles) this.toggled = !this.toggled;
    }
    /**
     * updates toolbar buttonregistry as needed
     *
     */
    updateButtonRegistry() {
      this.dispatchEvent(
        new CustomEvent("update-button-registry", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            button: this,
          },
        })
      );
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
              @keypress="${this._handleKeys}"
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
              @keypress="${this._handleKeys}"
              tabindex="0"
            >
              ${this.iconTemplate} ${this.labelTemplate}
            </button>
            ${this.tooltipTemplate}`;
    }
    render() {
      return html`${this.buttonTemplate}`;
    }
    static get offScreenStyles() {
      return [
        css`
          .offscreen {
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
          #icon[icon] {
            width: var(
              --simple-toolbar-button-min-width,
              var(--simple-toolbar-button-height, 24px)
            );
            height: var(--simple-toolbar-button-height, 24px);
            flex: 0 0 auto;
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
          :host {
            flex: 0 1 auto;
            min-width: var(
              --simple-toolbar-button-min-width,
              var(--simple-toolbar-button-height, 24px)
            );
            white-space: nowrap;
          }
          :host([hidden]) {
            display: none;
          }
          #button {
            min-width: var(
              --simple-toolbar-button-min-width,
              var(--simple-toolbar-button-height, 24px)
            );
            min-height: var(--simple-toolbar-button-height, 24px);
            margin: 0;
            padding: var(--simple-toolbar-button-padding, 0);
            color: var(--simple-toolbar-button-color);
            border-color: var(
              --simple-toolbar-button-border-color,
              var(--simple-toolbar-border-color, transparent)
            );
            background-color: var(--simple-toolbar-button-bg, transparent);
            opacity: var(--simple-toolbar-button-opacity, 1);
            border-width: var(
              --simple-toolbar-button-border-width,
              var(--simple-toolbar-border-width, 1px)
            );
            border-radius: var(--simple-toolbar-border-radius, 3px);
            border-style: solid;
            text-transform: unset;
            display: flex;
            flex: 0 1 auto;
            white-space: nowrap;
            align-items: stretch;
            transition: all 0.5s;
          }
          #button[aria-pressed="true"] {
            color: var(--simple-toolbar-button-toggled-color);
            border-color: var(--simple-toolbar-toggled-border-color);
            background-color: var(--simple-toolbar-button-toggled-bg);
            opacity: var(--simple-toolbar-button-toggled-opacity, 0.8);
          }
          #button:focus,
          #button:hover {
            color: var(--simple-toolbar-button-hover-color);
            background-color: var(--simple-toolbar-button-hover-bg);
            border-color: var(--simple-toolbar-hover-border-color);
            opacity: var(--simple-toolbar-button-hover-opacity, 0.8);
          }
          #button[disabled] {
            cursor: not-allowed;
            color: var(--simple-toolbar-button-disabled-color, unset);
            background-color: var(--simple-toolbar-button-disabled-bg, unset);
            opacity: var(--simple-toolbar-button-disabled-opacity, 0.5);
          }
        `,
      ];
    }
    static get styles() {
      return [
        ...(super.styles || []),
        ...this.buttonStyles,
        ...this.iconStyles,
        ...this.offScreenStyles,
        ...this.tooltipStyles,
      ];
    }
  };
};
/**
 * `simple-toolbar-button`
 * a button for rich text editor (custom buttons can extend this)
 *
### Styling

`<simple-toolbar-button>` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
--simple-toolbar-button-height | button height | 24px
--simple-toolbar-button-min-width | button min-width | --simple-toolbar-button-height
--simple-toolbar-button-padding | button padding | 0
--simple-toolbar-button-opacity | button opacity | 1
--simple-toolbar-button-color | button text color | unset
--simple-toolbar-button-bg | button background color | transparent
--simple-toolbar-button-border-color | button border color | --simple-toolbar-border-color
--simple-toolbar-button-border-width | button border width | --simple-toolbar-border-width
--simple-toolbar-button-border-radius | button border radius | 3px
--simple-toolbar-button-toggled-opacity | button opacity when toggled | 0.8
--simple-toolbar-button-toggled-color | button text color when toggled | unset
--simple-toolbar-button-toggled-bg | button background color when toggled | unset
--simple-toolbar-button-toggled-border-color | button border color when toggled | unset
--simple-toolbar-button-hover-opacity | button opacity when hovered | 0.8
--simple-toolbar-button-hover-color | button text color when hovered | unset
--simple-toolbar-button-hover-bg | button background color when hovered | unset
--simple-toolbar-button-hover-border-color | button border color when hovered | unset
--simple-toolbar-button-disabled-opacity | button opacity when disabled | 0.5
--simple-toolbar-button-disabled-color | button text color when disabled | unset
--simple-toolbar-button-disabled-bg | button background color when disabled | unset
--simple-toolbar-button-disabled-border-color | button border color when disabled | unset
 * 
 * @element simple-toolbar-button
 * @demo ./demo/buttons.html
 */
class SimpleToolbarButton extends SimpleToolbarButtonBehaviors(LitElement) {}
window.customElements.define(SimpleToolbarButton.tag, SimpleToolbarButton);
export { SimpleToolbarButton, SimpleToolbarButtonBehaviors };
