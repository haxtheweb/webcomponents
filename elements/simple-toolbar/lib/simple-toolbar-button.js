/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";

export const SimpleToolbarGlobalProperties = {
  /**
   * override default centered alignment of button: "left", "right", "justify", default center
   */
  align: {
    attribute: "align",
    reflect: true,
    type: String,
  },
  /**
   * override vertical alignment of button: "top", "bottom", "justify", default middle
   */
  alignVertical: {
    attribute: "align-vertical",
    reflect: true,
    type: String,
  },
  /**
   * is toolbar collapsed?
   */
  disabled: {
    name: "disabled",
    type: Boolean,
    attribute: "disabled",
    reflect: true,
  },
  /**
   * is toolbar collapsed?
   */
  hidden: {
    name: "hidden",
    type: Boolean,
    attribute: "hidden",
    reflect: true,
  },
  /**
   * Optionally place icon at top, bottom, or right of label
   */
  iconPosition: {
    type: String,
    attribute: "icon-position",
    reflect: true,
  },
  /**
   * show text label for more button.
   */
  showTextLabel: {
    name: "showTextLabel",
    type: Boolean,
    attribute: "more-show-text-label",
  },
  /**
   * Direction that the tooltip should flow
   */
  tooltipDirection: {
    type: String,
    attribute: "tooltip-direction",
    reflect: true,
  },
};
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
        ...SimpleToolbarGlobalProperties,
        /**
         * The `id` of the `simple-toolbar` that the toolbar controls.
         */
        controls: {
          type: String,
          attribute: "controls",
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
          reflect: true,
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

        /**
         * Label for the icon, if button is toggled.
         */
        toggledTooltip: {
          attribute: "toggled-tooltip",
          type: String,
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
          this.shadowRoot &&
          this.shadowRoot.querySelector("button[part=button]")
            ? this.shadowRoot.querySelector("button[part=button]")
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
     * current label based on toggled state
     *
     * @readonly
     * @memberof SimpleToolbarButton
     */
    get currentTooltip() {
      return this._defaultOrToggled(
        this.tooltip,
        this.toggledTootip,
        this.isToggled
      );
    }
    /**
     * determines if button is toggled
     *
     * @readonly
     * @memberof SimpleToolbarButton
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
      return this._uniqueText(toggledOn) && this.isToggled
        ? toggledOn
        : toggledOff;
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

    click(e) {
      this._handleClick(e);
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
          detail: this,
        })
      );
    }

    /**
     * is label specified
     *
     * @readonly
     */
    get hasLabel() {
      return this._uniqueText(this.currentLabel);
    }
    /**
     * is icon specified
     *
     * @readonly
     */
    get hasIcon() {
      return this._uniqueText(this.currentIcon);
    }
    /**
     * is tooltip specified
     *
     * @readonly
     */
    get hasTooltip() {
      return this._uniqueText(this.currentTooltip);
    }
    /**
     * is visible label is needed or specified
     *
     * @readonly
     */
    get labelVisible() {
      return (!this.hasIcon || this.showTextLabel) && this.hasLabel;
    }
    /**
     * is tooltip needed or specified
     *
     * @readonly
     */
    get tooltipVisible() {
      return (
        this.hasTooltip &&
        (!this.labelVisible ||
          this._uniqueText(this.currentLabel, this.tooltip))
      );
    }
    /**
     * checks to see if a string is unique and not empty
     *
     * @param {string} [string1='']
     * @param {string} [string2='']
     * @returns
     */
    _uniqueText(string1 = "", string2 = "") {
      return string1.trim() !== string2.trim();
    }
    /**
     * template for button icon
     *
     * @readonly
     */
    get iconTemplate() {
      return !this.hasIcon
        ? ""
        : html`<simple-icon-lite
            id="icon"
            aria-hidden="true"
            icon="${this.currentIcon}"
            part="icon"
          ></simple-icon-lite>`;
    }
    /**
     * template for button label
     *
     * @readonly
     */
    get labelTemplate() {
      return !this.hasLabel
        ? ""
        : html`<span
            id="label"
            class="${this.labelVisible ? "" : "offscreen"}"
            part="label"
            >${this.currentLabel}</span
          >`;
    }
    /**
     * template for button tooltip
     *
     * @readonly
     */
    get tooltipTemplate() {
      return !this.tooltipVisible
        ? ""
        : html`<simple-tooltip
            id="tooltip"
            for="button"
            position="${this.tooltipDirection || "bottom"}"
            part="tooltip"
            fit-to-visible-bounds
            >${this.currentLabel}</simple-tooltip
          >`;
    }
    /**
     * template for button, based on whether or not the button toggles
     *
     * @readonly
     */
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
              part="button"
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
              part="button"
            >
              ${this.iconTemplate} ${this.labelTemplate}
            </button>
            ${this.tooltipTemplate}`;
    }
    render() {
      return html`${this.buttonTemplate}`;
    }
    /**
     * styles for offscreen elements
     *
     * @readonly
     * @static
     */
    static get labelStyles() {
      return [
        css`
          #label {
            padding: 0 var(--simple-toolbar-button-label-padding, 2px);
            white-space: var(--simple-toolbar-button-label-white-space, normal);
          }
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
    /**
     * styles for button icon
     *
     * @readonly
     * @static
     */
    static get iconStyles() {
      return [
        css`
          #icon:not([icon]) {
            display: none;
          }
          #icon[icon] {
            width: var(
              --simple-toolbar-button-width,
              var(--simple-toolbar-button-height, 24px)
            );
            height: var(--simple-toolbar-button-height, 24px);
            flex: 0 0 auto;
          }
        `,
      ];
    }
    /**
     * styles for button tooltip
     *
     * @readonly
     * @static
     */
    static get tooltipStyles() {
      return [
        css`
          simple-tooltip {
            z-index: -1;
          }
          :host(:hover) simple-tooltip,
          :host(:focus-within) simple-tooltip {
            z-index: 2;
          }
        `,
      ];
    }

    /**
     * these styles are essential to how the button works
     *
     * @readonly
     * @static
     */
    static get simpleButtonCoreStyles() {
      return [
        css`
          :host {
            display: inline-flex;
            white-space: nowrap;
            transition: all 0.5s;
            z-index: 1;
          }
          :host(:hover),
          :host(:focus-wthin) {
            z-index: var(--simple-toolbar-focus-z-index, 100) !important;
          }
          :host([hidden]) {
            z-index: -1;
            visibility: hidden;
            opacity: 0;
            height: 0;
            overflow: hidden;
          }
          :host([disabled]) {
            pointer-events: none;
          }
          button[part="button"] {
            display: flex;
            margin: 0;
            white-space: nowrap;
            width: 100%;
            height: 100%;
          }
        `,
      ];
    }

    /**
     * these styles can be extended and overridden if button layout needs to change
     *
     * @readonly
     * @static
     */
    static get simpleButtonLayoutStyles() {
      return [
        css`
          :host {
            font-family: sans-serif;
            font-size: 13px;
            flex: 0 1 auto;
            min-width: var(
              --simple-toolbar-button-min-width,
              var(
                --simple-toolbar-button-width,
                var(--simple-toolbar-button-height, 24px)
              )
            );
          }
          button[part="button"] {
            font-family: inherit;
            font-size: inherit;
            min-width: var(
              --simple-toolbar-button-min-width,
              var(
                --simple-toolbar-button-width,
                var(--simple-toolbar-button-height, 24px)
              )
            );
            min-height: var(--simple-toolbar-button-height, 24px);
            padding: var(--simple-toolbar-button-padding, 1px);
            flex: var(--simple-toolbar-button-flex, 0 0 auto);
            align-items: var(--simple-toolbar-button-align, center);
            transition: all 0.5s;
            justify-content: var(--simple-toolbar-button-justify, space-around);
          }
          button[part="button"],
          :host([icon-position="right"]:not([align-vertical]))
            button[part="button"] {
            justify-content: space-evenly;
          }

          :host([icon-position="top"]) button[part="button"] {
            flex-direction: column;
          }
          :host([icon-position="bottom"]) button[part="button"] {
            flex-direction: column-reverse;
          }
          :host([icon-position="right"]) button[part="button"] {
            flex-direction: row-reverse;
          }
          :host([align-vertical="top"]:not([icon-position]))
            button[part="button"],
          :host([align-vertical="top"][icon-position="right"])
            button[part="button"],
          :host([align-horizontal="left"][icon-position="top"])
            button[part="button"],
          :host([align-horizontal="left"][icon-position="bottom"])
            button[part="button"] {
            align-items: flex-start;
          }
          :host([align-vertical="bottom"]:not([icon-position]))
            button[part="button"],
          :host([align-vertical="bottom"][icon-position="right"])
            button[part="button"],
          :host([align-horizontal="right"][icon-position="top"])
            button[part="button"],
          :host([align-horizontal="right"][icon-position="bottom"]) {
            align-items: flex-end;
          }
          :host([align-horizontal="left"]:not([icon-position]))
            button[part="button"],
          :host([align-horizontal="left"][icon-position="right"])
            button[part="button"],
          :host([align-vertical="top"][icon-position="top"])
            button[part="button"],
          :host([align-vertical="top"][icon-position="bottom"]) {
            justify-content: flex-start;
          }
          :host([align-horizontal="right"]:not([icon-position]))
            button[part="button"],
          :host([align-horizontal="right"][icon-position="right"])
            button[part="button"],
          :host([align-vertical="bottom"][icon-position="top"])
            button[part="button"],
          :host([align-vertical="bottom"][icon-position="bottom"]) {
            justify-content: flex-end;
          }
          :host([align-vertical="middle"]:not([icon-position]))
            button[part="button"],
          :host([align-vertical="middle"][icon-position="right"])
            button[part="button"],
          :host([align-horizontal="center"][icon-position="top"])
            button[part="button"],
          :host([align-horizontal="center"][icon-position="bottom"]) {
            align-items: center;
          }
          :host([align-horizontal="center"]:not([icon-position]))
            button[part="button"],
          :host([align-horizontal="center"][icon-position="right"])
            button[part="button"],
          :host([align-vertical="middle"][icon-position="top"])
            button[part="button"],
          :host([align-vertical="middle"][icon-position="bottom"]) {
            justify-content: center;
          }
        `,
      ];
    }
    /**
     * these styles can be extended and overridden if button colors need to change
     *
     * @readonly
     * @static
     */
    static get simpleButtonThemeStyles() {
      return [
        css`
          button[part="button"] {
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
          }
          button[part="button"][aria-pressed="true"] {
            color: var(--simple-toolbar-button-toggled-color);
            border-color: var(--simple-toolbar-button-toggled-border-color);
            background-color: var(--simple-toolbar-button-toggled-bg);
            opacity: var(--simple-toolbar-button-toggled-opacity, 0.8);
          }
          button[part="button"]:focus,
          button[part="button"]:hover {
            color: var(--simple-toolbar-button-hover-color);
            background-color: var(--simple-toolbar-button-hover-bg);
            border-color: var(--simple-toolbar-button-hover-border-color);
            opacity: var(--simple-toolbar-button-hover-opacity, 0.8);
          }
          button[part="button"][disabled] {
            cursor: not-allowed;
            color: var(--simple-toolbar-button-disabled-color, unset);
            background-color: var(--simple-toolbar-button-disabled-bg, unset);
            border-color: var(
              --simple-toolbar-button-disabled-border-color,
              unset
            );
            opacity: var(--simple-toolbar-button-disabled-opacity, 0.5);
          }
        `,
      ];
    }
    /**
     * aggregates separate styles
     *
     * @readonly
     * @static
     */
    static get styles() {
      return [
        ...this.iconStyles,
        ...this.labelStyles,
        ...this.tooltipStyles,
        ...this.simpleButtonCoreStyles,
        ...this.simpleButtonLayoutStyles,
        ...this.simpleButtonThemeStyles,
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
--simple-toolbar-button-flex | flex for button in a toolbar | 0 0 auto
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
 * @customElement
 * @extends SimpleToolbarButtonBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/buttons.html
 */
class SimpleToolbarButton extends SimpleToolbarButtonBehaviors(LitElement) {}
window.customElements.define(SimpleToolbarButton.tag, SimpleToolbarButton);
export { SimpleToolbarButton, SimpleToolbarButtonBehaviors };
