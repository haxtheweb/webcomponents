import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleToolbarButtonBehaviors } from "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

const HaxToolbarItemBehaviors = function (SuperClass) {
  return class extends SimpleToolbarButtonBehaviors(SuperClass) {
    static get tag() {
      return "hax-toolbar-item";
    }
    constructor() {
      super();
      this.dark = false;
      this.danger = false;
      this.menu = false;
    }
    static get properties() {
      return {
        /**
         * Inverted display mode
         */
        dark: {
          type: Boolean,
          reflect: true,
        },
        danger: {
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
        /**
         * Direction that the tooltip should flow
         */
        tooltipDirection: {
          type: String,
          attribute: "tooltip-direction",
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
        position="${this.tooltipDirection}"
        >${this.currentTooltip || this.currentLabel}</simple-tooltip
      >`;
    }
    static get styles() {
      return [
        ...super.styles,
        css`
          :host([disabled]) {
            pointer-events: none;
          }
          :host([danger]) {
            --simple-toolbar-button-hover-color: var(
              --hax-toolbar-button-danger-color,
              #882222
            );
            --simple-toolbar-button-hover-border-color: var(
              --hax-toolbar-button-danger-color,
              #882222
            );
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
### Styling

`<hax-toolbar-item>` provides following custom properties and mixins
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
