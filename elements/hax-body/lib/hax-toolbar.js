import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu-item.js";
import { SimpleToolbarBehaviors } from "@lrnwebcomponents/simple-toolbar/simple-toolbar.js";

const HaxToolbarBehaviors = function (SuperClass) {
  return class extends SimpleToolbarBehaviors(SuperClass) {
    /**
     * LitElement constructable styles enhancement
     */
    static get styles() {
      return [
        ...super.styles,
        css`
          :host {
            background-color: var(--hax-tray-background-color);
            border: 1px solid var(--hax-tray-border-color, #ddd);
            flex: 0 0 auto;
            display: none;
          }
          :host(.hax-context-visible) {
            display: flex;
          }
          :host([hidden]),
          :host *[hidden] {
            display: none !important;
          }
          .selected-buttons {
            transition: 0.1s all ease-in-out;
            width: 0;
          }
          :host([has-selected-text]) .selected-buttons {
            width: 100%;
          }
          hax-context-item-textop,
          hax-context-item {
            transition: all 0.2s linear;
            visibility: visible;
            opacity: 1;
          }
          hax-context-item-textop[hidden],
          hax-context-item[hidden] {
            visibility: hidden;
            opacity: 0;
          }
          #buttons {
            display: flex;
            flex: 1 1 auto;
          }
          #buttons .group {
            display: flex;
            flex-wrap: nowrap;
            flex: 1 1 auto;
          }
          ::slotted(*) {
            pointer-events: all;
          }
        `,
      ];
    }
    constructor() {
      super();
      this.selected = false;
      this.inline = false;
    }
    static get tag() {
      return "hax-toolbar";
    }

    static get properties() {
      return {
        ...super.properties,
        /**
         * See what's selected
         */
        selected: {
          type: Boolean,
          reflect: true,
        },
        /**
         * This is an inline context menu
         */
        inline: {
          type: Boolean,
          reflect: true,
        },
      };
    }
  };
};
/**
 *
 * @customElement
 * @extends HaxToolbarItemBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class HaxToolbar extends HaxToolbarBehaviors(LitElement) {}
window.customElements.define(HaxToolbar.tag, HaxToolbar);
export { HaxToolbar, HaxToolbarBehaviors };
