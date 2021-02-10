import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js";
import "@lrnwebcomponents/a11y-menu-button/lib/a11y-menu-button-item.js";
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
            background-color: var(--hax-toolbar-button-bg, #fff);
            border: 1px solid var(--hax-toolbar-border-color, #ddd);
            flex: 0 0 auto;
            display: none;

            --simple-toolbar-button-border-radius: var(
              --hax-toolbar-button-border-radius,
              3px
            );
            --a11y-menu-button-border-radius: var(
              --hax-toolbar-button-border-radius,
              3px
            );
            --a11y-menu-button-border-radius: var(
              --hax-toolbar-menu-button-border-radius,
              0
            );

            --simple-toolbar-button-padding: var(
              --hax-toolbar-button-padding,
              0
            );
            --a11y-menu-button-vertical-padding: var(
              --hax-toolbar-button-padding,
              0
            );
            --a11y-menu-button-vertical-padding: var(
              --hax-toolbar-button-padding,
              0
            );

            --simple-toolbar-button-bg: var(--hax-toolbar-button-bg, #fff);
            --a11y-menu-button-bg-color: var(--hax-toolbar-button-bg, #fff);
            --a11y-menu-button-item-bg-color: var(
              --hax-toolbar-button-bg,
              #fff
            );

            --simple-toolbar-button-hover-bg: var(
              --hax-toolbar-button-hover-bg,
              #fff
            );
            --a11y-menu-button-focus-bg-color: var(
              --hax-toolbar-button-hover-bg,
              #fff
            );
            --a11y-menu-button-item-focus-bg-color: var(
              --hax-toolbar-menu-button-hover-bg,
              #c4ecff
            );

            --simple-toolbar-button-color: var(
              --hax-toolbar-button-color,
              #444
            );
            --a11y-menu-button-color: var(--hax-toolbar-button-color, #444);
            --a11y-menu-button-item-color: var(
              --hax-toolbar-button-color,
              #444
            );

            --simple-toolbar-button-hover-color: var(
              --hax-toolbar-button-hover-color,
              #000
            );
            --a11y-menu-button-focus-color: var(
              --hax-toolbar-button-hover-color,
              #000
            );
            --a11y-menu-button-item-focus-color: var(
              --hax-toolbar-button-hover-color,
              #000
            );

            --simple-toolbar-button-border-color: var(
              --hax-toolbar-button-border-color,
              #fff
            );
            --a11y-menu-button-border: 1px solid
              var(--hax-toolbar-button-border-color, #fff);
            --a11y-menu-button-border: 1px solid
              var(--hax-toolbar-button-border-color, #fff);

            --simple-toolbar-button-hover-border-color: var(
              --hax-toolbar-button-hover-border-color,
              #000
            );
            --a11y-menu-button-focus-border: 1px solid
              var(--hax-toolbar-button-hover-border-color, #000);
            --a11y-menu-button-item-focus-border: 1px solid
              var(--hax-toolbar-button-hover-border-color, #000);
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
