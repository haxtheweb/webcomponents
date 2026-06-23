import { css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

const HAXCMSThemeParts = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.__disposer = this.__disposer ? this.__disposer : [];
      this.__disposer.push(
        autorun((reaction) => {
          const _mobx_val_0 = toJS(store.editMode);
          Promise.resolve().then(() => {
            const editMode = _mobx_val_0;
            if (this.editMode !== editMode) {
              this.editMode = editMode;
            }
          });
        }),
      );
      this.__disposer.push(
        autorun((reaction) => {
          const _mobx_val_0 = toJS(store.darkMode);
          Promise.resolve().then(() => {
            const darkMode = _mobx_val_0;
            if (this.darkMode !== darkMode) {
              this.darkMode = darkMode;
            }
            if (this.dark !== darkMode) {
              this.dark = darkMode; // alignment w/ simple colors for reactive content!
            }
          });
        }),
      );
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
