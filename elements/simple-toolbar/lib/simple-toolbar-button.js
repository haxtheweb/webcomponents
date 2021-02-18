/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";

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
         * Optionally place icon at top, bottom, or right of label
         */
        iconPosition: {
          type: String,
          attribute: "icon-position",
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
        /**
         * Direction that the tooltip should flow
         */
        tooltipDirection: {
          type: String,
          attribute: "tooltip-direction",
          reflect: true,
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
     * label is offscreen (screenreader-only)
     *
     * @readonly
     * @memberof SimpleToolbarButton
     */
    get labelStyle() {
      return !!this.currentIcon &&
        this.currentIcon !== "" &&
        this.showTextLabel === false
        ? "offscreen"
        : null;
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
      return (!!toggledOn || toggledOn == "") && this.isToggled
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
     * template for button icon
     *
     * @readonly
     */
    get iconTemplate() {
      return html`<simple-icon-lite
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
      return html`<span id="label" class="${this.labelStyle || ""}" part="label"
        >${this.currentLabel}</span
      >`;
    }
    /**
     * template for button tooltip
     *
     * @readonly
     */
    get tooltipTemplate() {
      return html`<simple-tooltip
        id="tooltip"
        for="button"
        position="${this.tooltipDirection || "bottom"}"
        part="tooltip"
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
            z-index: 2;
          }
        `,
      ];
    }

    /**
     * these styles are essential to how the button works
     *
     * @readonly
     */
    get functionalStyles() {
      return [
        css`
          :host {
            white-space: nowrap;
            transition: all 0.5s;
          }
          :host(:hover),
          :host(:focus-wthin) {
            z-index: var(--simple-toolbar-focus-z-index, 100);
          }
          :host([hidden]) {
            z-index: -1;
            visibility: hidden;
            opacity: 0;
            height: 0;
          }
          #button {
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
     */
    get layoutStyles() {
      return [
        css`
          :host {
            flex: 0 1 auto;
            min-width: var(
              --simple-toolbar-button-min-width,
              var(
                --simple-toolbar-button-width,
                var(--simple-toolbar-button-height, 24px)
              )
            );
          }
          #button {
            font-size: inherit;
            min-width: var(
              --simple-toolbar-button-min-width,
              var(
                --simple-toolbar-button-width,
                var(--simple-toolbar-button-height, 24px)
              )
            );
            min-height: var(--simple-toolbar-button-height, 24px);
            padding: var(--simple-toolbar-button-padding, 0);
            flex: var(--simple-toolbar-button-flex, 0 0 auto);
            align-items: var(--simple-toolbar-button-align, center);
            transition: all 0.5s;
            justify-content: var(--simple-toolbar-button-justify, space-around);
          }

          :host([icon-position="top"]) #button {
            flex-direction: column;
          }
          :host([icon-position="bottom"]) #button {
            flex-direction: column-reverse;
          }
          :host([icon-position="right"]) #button {
            flex-direction: row-reverse;
          }
          :host([align="left"]:not([icon-position])),
          :host([align="left"][icon-position="right"]),
          :host([align-vertical="top"][icon-position="top"]) #button,
          :host([align-vertical="top"][icon-position="bottom"]) #button {
            align-items: flex-start;
          }
          :host([align="right"]:not([icon-position])),
          :host([align="right"][icon-position="right"]),
          :host([align-vertical="bottom"][icon-position="top"]) #button,
          :host([align-vertical="bottom"][icon-position="bottom"]) #button {
            align-items: flex-end;
          }
          :host([align="justify"]:not([icon-position])),
          :host([align="justify"][icon-position="right"]),
          :host([align-vertical="justify"][icon-position="top"]) #button,
          :host([align-vertical="justify"][icon-position="bottom"]) #button {
            align-items: stretch;
          }
          #button,
          :host([icon-position="right"]:not([align-vertical])) #button,
          :host([icon-position="top"]) #button,
          :host([icon-position="bottom"]) #button {
            justify-content: space-evenly;
          }
          :host([align-vertical="top"]:not([icon-position])) #button,
          :host([align-vertical="top"][icon-position="right"]) #button,
          :host([align="left"][icon-position="top"]) #button,
          :host([align="left"][icon-position="bottom"]) #button {
            justify-content: flex-start;
          }
          :host([align-vertical="bottom"]:not([icon-position])) #button,
          :host([align-vertical="bottom"][icon-position="right"]) #button,
          :host([align="right"][icon-position="top"]) #button,
          :host([align="right"][icon-position="bottom"]) #button {
            justify-content: flex-end;
          }
          :host([align-vertical="justify"]:not([icon-position])) #button,
          :host([align-vertical="justify"][icon-position="right"]) #button,
          :host([align="justify"][icon-position="top"]) #button,
          :host([align="justify"][icon-position="bottom"]) #button {
            justify-content: space-between;
          }
        `,
      ];
    }
    /**
     * these styles can be extended and overridden if button colors need to change
     *
     * @readonly
     */
    get thmeingStyles() {
      return [
        css`
          #button {
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
          #button[aria-pressed="true"] {
            color: var(--simple-toolbar-button-toggled-color);
            border-color: var(--simple-toolbar-button-toggled-border-color);
            background-color: var(--simple-toolbar-button-toggled-bg);
            opacity: var(--simple-toolbar-button-toggled-opacity, 0.8);
          }
          #button:focus,
          #button:hover {
            color: var(--simple-toolbar-button-hover-color);
            background-color: var(--simple-toolbar-button-hover-bg);
            border-color: var(--simple-toolbar-button-hover-border-color);
            opacity: var(--simple-toolbar-button-hover-opacity, 0.8);
          }
          #button[disabled] {
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
    static get styles() {
      return [
        ...this.functionalStyles,
        ...this.iconStyles,
        ...this.labelStyles,
        ...this.tooltipStyles,
        ...this.layoutStyles,
        ...this.thmeingStyles,
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
