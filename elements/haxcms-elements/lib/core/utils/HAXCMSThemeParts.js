import { css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

const HAXCMSThemeParts = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.__disposer = this.__disposer ? this.__disposer : [];
      autorun((reaction) => {
        this.editMode = toJS(store.editMode);
        this.__disposer.push(reaction);
      });
      autorun((reaction) => {
        this.darkMode = toJS(store.darkMode);
        this.dark = this.darkMode; // alignment w/ simple colors for reactive content!
        this.__disposer.push(reaction);
      });
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        css`
          [part="edit-mode-active"],
          [part*="edit-mode-active"] {
            pointer-events: var(
              --haxcms-theme-parts-edit-mode-active-pointer-events,
              none
            );
            opacity: var(--haxcms-theme-parts-edit-mode-active-opacity, 0.5);
            filter: var(
              --haxcms-theme-parts-edit-mode-active-filter,
              blur(1px)
            );
          }
        `,
      ];
    }
    static get properties() {
      let props = super.properties || {};
      return {
        ...props,
        editMode: {
          type: Boolean,
          attribute: "edit-mode",
          reflect: true,
        },
        darkMode: {
          type: Boolean,
          attribute: "dark-mode",
          reflect: true,
        },
      };
    }
  };
};

export { HAXCMSThemeParts };
