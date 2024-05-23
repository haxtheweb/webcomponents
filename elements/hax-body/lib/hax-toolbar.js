import { LitElement, html, css } from "lit";
import "@haxtheweb/hax-body/lib/hax-toolbar-item.js";
import "@haxtheweb/hax-body/lib/hax-context-item.js";
import "@haxtheweb/hax-body/lib/hax-toolbar-menu.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu-item.js";
import { SimpleToolbarBehaviors } from "@haxtheweb/simple-toolbar/simple-toolbar.js";

const HaxToolbarBehaviors = function (SuperClass) {
  return class extends SimpleToolbarBehaviors(SuperClass) {
    /**
     * LitElement constructable styles enhancement
     */
    static get styles() {
      return [
        super.styles,
        css`
          :host {
            --hax-ui-border-radius: 0px;
          }
          .selected-buttons {
            transition: 0.1s all ease-in-out;
            width: 0;
          }
          :host([has-selected-text]) .selected-buttons {
            width: 100%;
          }
          ::slotted(*) {
            pointer-events: all;
          }
          ::slotted(.group) {
            border: none;
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
customElements.define(HaxToolbar.tag, HaxToolbar);
export { HaxToolbar, HaxToolbarBehaviors };
