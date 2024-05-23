/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { DDDPulseEffectSuper } from "@haxtheweb/d-d-d/d-d-d.js";
export const SimpleToolbarGlobalProperties = {
  /**
   * override default centered alignment of button: "left" or "right" default center
   */
  alignHorizontal: {
    attribute: "align-horizontal",
    reflect: true,
    type: String,
  },
  /**
   * override vertical alignment of button: "top" or "bottom" default middle
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
   * Optional iron icon name for the button.
   */
  icon: {
    type: String,
    attribute: "icon",
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
   * Label for the icon.
   */
  label: {
    type: String,
  },
  /**
   * show text label for more button.
   */
  showTextLabel: {
    name: "showTextLabel",
    type: Boolean,
    attribute: "show-text-label",
  },

  /**
   * Always show tooltip.
   */
  showTooltip: {
    attribute: "show-tooltip",
    type: Boolean,
    reflect: true,
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
   * Label for the icon, if button is toggled.
   */
  toggledTooltip: {
    attribute: "toggled-tooltip",
    type: String,
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
        ...super.properties,
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
         * Optional to set aria-describedby.
         */
        describedby: {
          type: String,
          attribute: "describedby",
        },

        isCurrentItem: {
          type: Boolean,
          attribute: "is-current-item",
          reflect: true,
        },

        /**
         * for radio-button behavior
         */
        radio: {
          attribute: "radio",
          type: Boolean,
          reflect: true,
        },

        /**
         * Optional space-separated list of shortcut keys
         */
        shortcutKeys: {
          attribute: "shortcut-keys",
          type: String,
        },

        /**
         * The active selected range, inherited from the toolbar
         */
        target: {
          type: Object,
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
      this.iconPosition = "left";
      this.alignVertical = "center";
      this.alignHorizontal = "center";
      this.disabled = false;
      this.showTextLabel = false;
      this.toggled = false;
      this.toggles = false;
      this.radio = false;
      this.shortcutKeys = "";
      this.isCurrentItem = true;
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
        this.isToggled,
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
        this.isToggled,
      );
    }
    /**
     * current label based on toggled state
     *
     * @readonly
     * @memberof SimpleToolbarButton
     */
    get currentTooltip() {
      return (
        this._defaultOrToggled(
          this.tooltip,
          this.toggledTootip,
          this.isToggled,
        ) || this.currentLabel
      );
    }
    /**
     * determines if button is toggled
     *
     * @readonly
     * @memberof SimpleToolbarButton
     */
    get isToggled() {
      return (!!this.toggles || !!this.radio) & !!this.toggled;
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
        }),
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
        }),
      );
      super.disconnectedCallback();
    }
    /**
     * sets focus to button
     *
     * @returns
     */
    focus() {
      if (this.focusableElement && !this.disabled) {
        this.isCurrentItem = true;
        this.focusableElement.focus();
      }
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
      if (!this.disabled) {
        this.toggle();
      }
    }
    /**
     * handles blur
     *
     * @param {event} e event
     */
    _handleBlur(e) {}
    /**
     * handles focus
     *
     * @param {event} e event
     */
    _handleFocus(e) {}
    /**
     * handles keydown
     *
     * @param {event} e event
     */
    _handleKeydown(e) {}
    /**
     * handles keypress
     *
     * @param {event} e event
     */
    _handleKeys(e) {}
    /**
     * customizable event for when shortcut keys are pressed
     *
     * @param {string} key
     */
    _handleShortcutKeys(e, key) {}

    toggle() {
      if (this.toggles || this.radio) this.toggled = !this.toggled;
      this.dispatchEvent(
        new CustomEvent("button-toggled", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );
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
        }),
      );
    }

    get focusableElement() {
      return this.shadowRoot && this.shadowRoot.querySelector("#button")
        ? this.shadowRoot.querySelector("#button")
        : undefined;
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
        (this.hasTooltip || this.hasLabel) &&
        (this.showTooltip ||
          !this.labelVisible ||
          this._uniqueText(this.currentLabel, this.currentTooltip))
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
      return String(string1 || "").trim() !== String(string2 || "").trim();
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
            >${this.currentTooltip || this.currentLabel}</simple-tooltip
          >`;
    }
    /**
     * template for inner part of button (label and icon) in order specified
     *
     * @readonly
     */
    get buttonInnerTemplate() {
      return this.iconPosition === "right" || this.iconPosition === "bottom"
        ? html`${this.labelTemplate} ${this.iconTemplate}`
        : html`${this.iconTemplate} ${this.labelTemplate}`;
    }
    /**
     * template for button, based on whether or not the button toggles
     *
     * @readonly
     */
    get buttonTemplate() {
      return this.radio
        ? html` <button
              id="button"
              aria-checked="${this.isToggled ? "true" : "false"}"
              aria-describedby="${!!this.describedby && this.describedby !== ""
                ? this.describedby
                : undefined}"
              class="simple-toolbar-button"
              ?disabled="${this.disabled}"
              ?controls="${this.controls}"
              @click="${this._handleClick}"
              @keypress="${this._handleKeys}"
              @keydown="${this._handleKeydown}"
              @blur="${this._handleBlur}"
              @focus="${this._handleFocus}"
              part="button"
              role="radio"
              tabindex="${this.isCurrentItem ? 0 : -1}"
            >
              ${this.buttonInnerTemplate}
            </button>
            ${this.tooltipTemplate}`
        : this.toggles
          ? html` <button
                id="button"
                aria-pressed="${this.isToggled ? "true" : "false"}"
                aria-describedby="${!!this.describedby &&
                this.describedby !== ""
                  ? this.describedby
                  : undefined}"
                class="simple-toolbar-button"
                ?disabled="${this.disabled}"
                ?controls="${this.controls}"
                @click="${this._handleClick}"
                @keypress="${this._handleKeys}"
                @blur="${this._handleBlur}"
                @focus="${this._handleFocus}"
                part="button"
                tabindex="${this.isCurrentItem ? 0 : -1}"
              >
                ${this.buttonInnerTemplate}
              </button>
              ${this.tooltipTemplate}`
          : html` <button
                id="button"
                aria-describedby="${!!this.describedby &&
                this.describedby !== ""
                  ? this.describedby
                  : undefined}"
                class="simple-toolbar-button"
                ?disabled="${this.disabled}"
                ?controls="${this.controls}"
                @click="${this._handleClick}"
                @keypress="${this._handleKeys}"
                @blur="${this._handleBlur}"
                @focus="${this._handleFocus}"
                part="button"
                tabindex="${this.isCurrentItem ? 0 : -1}"
              >
                ${this.buttonInnerTemplate}
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
          :host(:hover),
          :host(:focus-within) {
            z-index: var(--simple-toolbar-button-z-index, 2);
          }
          :host(:hover) simple-tooltip,
          :host(:focus-within) simple-tooltip {
            z-index: var(--simple-toolbar-button-z-index, 2);
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
          *[part="button"] {
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
            font-family: var(--ddd-font-navigation, sans-serif);
            font-size: 13px;
            flex: 0 1 auto;
            min-width: var(
              --simple-toolbar-button-min-width,
              var(
                --simple-toolbar-button-width,
                var(--simple-toolbar-button-height, 24px)
              )
            );
            z-index: 1;
          }
          :host(:hover) {
            z-index: 2;
          }
          :host(:focus-within),
          :host(:focus) {
            z-index: 3;
          }
          *[part="button"] {
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
            justify-content: var(--simple-toolbar-button-justify, center);
          }
          :host([icon-position="top"]) *[part="button"],
          :host([icon-position="bottom"]) *[part="button"] {
            flex-direction: column;
          }
          :host([align-vertical="top"][icon-position="left"]) *[part="button"],
          :host([align-vertical="top"][icon-position="right"]) *[part="button"],
          :host([align-horizontal="left"][icon-position="top"])
            *[part="button"],
          :host([align-horizontal="left"][icon-position="bottom"])
            *[part="button"] {
            align-items: flex-start;
          }
          :host([align-vertical="bottom"][icon-position="left"])
            *[part="button"],
          :host([align-vertical="bottom"][icon-position="right"])
            *[part="button"],
          :host([align-horizontal="right"][icon-position="top"])
            *[part="button"],
          :host([align-horizontal="right"][icon-position="bottom"])
            *[part="button"] {
            align-items: flex-end;
          }
          :host([align-horizontal="left"][icon-position="left"])
            *[part="button"],
          :host([align-horizontal="left"][icon-position="right"])
            *[part="button"],
          :host([align-vertical="top"][icon-position="top"]) *[part="button"],
          :host([align-vertical="top"][icon-position="bottom"])
            *[part="button"] {
            justify-content: flex-start;
          }
          :host([align-horizontal="right"][icon-position="left"])
            *[part="button"],
          :host([align-horizontal="right"][icon-position="right"])
            *[part="button"],
          :host([align-vertical="bottom"][icon-position="top"])
            *[part="button"],
          :host([align-vertical="bottom"][icon-position="bottom"])
            *[part="button"] {
            justify-content: flex-end;
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
          *[part="button"] {
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
          :host([radio]) *[part="button"] {
            border-radius: var(--simple-toolbar-radio-border-radius, 0px);
          }
          :host([radio]:last-of-type) *[part="button"] {
            border-top-right-radius: var(--simple-toolbar-border-radius, 3px);
            border-bottom-right-radius: var(
              --simple-toolbar-border-radius,
              3px
            );
          }
          :host([radio]:first-of-type) *[part="button"] {
            border-top-left-radius: var(--simple-toolbar-border-radius, 3px);
            border-bottom-left-radius: var(--simple-toolbar-border-radius, 3px);
          }
          *[part="button"][aria-checked="true"],
          *[part="button"][aria-pressed="true"] {
            color: var(--simple-toolbar-button-toggled-color);
            border-color: var(--simple-toolbar-button-toggled-border-color);
            background-color: var(--simple-toolbar-button-toggled-bg);
            opacity: var(--simple-toolbar-button-toggled-opacity, 0.8);
          }
          *[part="button"]:focus,
          *[part="button"]:hover {
            color: var(--simple-toolbar-button-hover-color);
            background-color: var(--simple-toolbar-button-hover-bg);
            border-color: var(--simple-toolbar-button-hover-border-color);
            opacity: var(--simple-toolbar-button-hover-opacity, 0.8);
          }
          *[part="button"][disabled] {
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
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        this.iconStyles,
        this.labelStyles,
        this.tooltipStyles,
        this.simpleButtonCoreStyles,
        this.simpleButtonLayoutStyles,
        this.simpleButtonThemeStyles,
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
class SimpleToolbarButton extends SimpleToolbarButtonBehaviors(
  DDDPulseEffectSuper(LitElement),
) {}
customElements.define(SimpleToolbarButton.tag, SimpleToolbarButton);
export { SimpleToolbarButton, SimpleToolbarButtonBehaviors };
