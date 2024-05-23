import { LitElement, html, css } from "lit";
import { SimpleToolbarButtonBehaviors } from "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { HaxButton } from "@haxtheweb/hax-body/lib/hax-ui-styles.js";

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
      return this.radio
        ? html` <button
              id="button"
              aria-checked="${this.isToggled ? "true" : "false"}"
              class="simple-toolbar-button"
              ?disabled="${this.disabled}"
              ?controls="${this.controls}"
              @click="${this._handleClick}"
              @keydown="${this._handleKeys}"
              @mousedown="${this._handleMousedown}"
              role="radio"
              part="button"
              tabindex="${this.isCurrentItem ? 1 : -1}"
            >
              ${this.buttonInnerTemplate}
            </button>
            ${this.tooltipTemplate}`
        : this.toggles
          ? html` <button
                id="button"
                aria-pressed="${this.isToggled ? "true" : "false"}"
                class="simple-toolbar-button"
                ?disabled="${this.disabled}"
                ?controls="${this.controls}"
                @click="${this._handleClick}"
                @keydown="${this._handleKeys}"
                @mousedown="${this._handleMousedown}"
                part="button"
                tabindex="${this.isCurrentItem ? 1 : -1}"
              >
                ${this.buttonInnerTemplate}
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
                tabindex="${this.isCurrentItem ? 1 : -1}"
              >
                ${this.buttonInnerTemplate}
              </button>
              ${this.tooltipTemplate}`;
    }

    static get simpleButtonThemeStyles() {
      return HaxButton;
    }
    static get simpleButtonCoreStyles() {
      return super.simpleButtonCoreStyles;
    }

    static get simpleButtonLayoutStyles() {
      return super.simpleButtonLayoutStyles;
    }

    static get styles() {
      return [
        super.styles,
        css`
          :host(:hover),
          :host(:focus-within) {
            z-index: var(--hax-ui-focus-z-index, 1001) !important;
          }
          :host {
            font-family: var(--ddd-font-navigation);
            --simple-toolbar-button-width: 26px;
            --simple-toolbar-button-height: 26px;
          }
        `,
      ];
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
customElements.define(HaxToolbarItem.tag, HaxToolbarItem);
export { HaxToolbarItem, HaxToolbarItemBehaviors };
