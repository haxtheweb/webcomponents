import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleToolbarButtonBehaviors } from "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import { HaxTrayButton } from "@lrnwebcomponents/hax-body/lib/hax-ui-styles.js";

const HaxToolbarItemBehaviors = function (SuperClass) {
  return class extends SimpleToolbarButtonBehaviors(SuperClass) {
    static get tag() {
      return "hax-toolbar-item";
    }
    constructor() {
      super();
      this.danger = false;
      this.feature = false;
      this.menu = false;
    }
    static get properties() {
      return {
        ...super.properties,
        /**
         * red warning
         */
        danger: {
          type: Boolean,
          reflect: true,
        },
        /**
         * Name of the event to bubble up as being tapped.
         * This can be used to tell other elements what was
         * clicked so it can take action appropriately.
         */
        eventName: {
          type: String,
          reflect: true,
          attribute: "event-name",
        },
        /**
         * Inverted display mode
         */
        feature: {
          type: Boolean,
          reflect: true,
        },
        /**
         * Hover tip text
         */
        toggledTooltip: {
          type: String,
        },
        /**
         * Hover tip text
         */
        tooltip: {
          type: String,
        },
      };
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
              @keydown="${this._handleKeys}"
              @mousedown="${this._handleMousedown}"
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
              @keydown="${this._handleKeys}"
              @mousedown="${this._handleMousedown}"
              tabindex="0"
              part="button"
            >
              ${!this.icon || this.icon == "" ? "" : this.iconTemplate}
              ${this.labelTemplate}
            </button>
            ${this.showTextLabel ? "" : this.tooltipTemplate}`;
    }
    /**
     * current label based on toggled state
     *
     * @readonly
     */
    get currentTooltip() {
      return this._defaultOrToggled(
        this.tooltip,
        this.toggledTooltip,
        this.isToggled
      );
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
        ?hidden="${!this.currentTooltip && !this.currentLabel}"
        position="${this.tooltipDirection || "bottom"}"
        fit-to-visible-bounds
        >${this.currentTooltip || this.currentLabel}</simple-tooltip
      >`;
    }

    static get simpleButtonThemeStyles() {
      return HaxTrayButton;
    }
    static get simpleButtonCoreStyles() {
      return super.simpleButtonCoreStyles;
    }

    static get simpleButtonLayoutStyles() {
      return super.simpleButtonLayoutStyles;
    }

    static get styles() {
      return super.styles;
    }

    _handleClick(e) {}
    _handleKeys(e) {}
    _handleMousedown(e) {}
  };
};
/**
 * `hax-toolbar-item`
 * a button for hax toolbar
 *
 * @customElement
 * @extends HaxToolbarItemBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class HaxToolbarItem extends HaxToolbarItemBehaviors(LitElement) {}
window.customElements.define(HaxToolbarItem.tag, HaxToolbarItem);
export { HaxToolbarItem, HaxToolbarItemBehaviors };
