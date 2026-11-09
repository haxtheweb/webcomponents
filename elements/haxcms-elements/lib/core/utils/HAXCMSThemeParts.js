import { css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

const HAXCMSThemeParts = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.__disposer = this.__disposer ? this.__disposer : [];
      this.__disposer.push(
        autorun((_reaction) => {
          const _mobx_val_0 = toJS(store.editMode);
          Promise.resolve().then(() => {
            this._syncThemePartsEditMode(_mobx_val_0);
          });
        }),
      );
      this.__disposer.push(
        autorun((_reaction) => {
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
    /**
     * Reflect store.editMode. Entering edit mode waits for the site editor
     * to have the editable copy ready, the same gate HAXCMSTheme uses
     * (_syncEditMode), so a theme does not hide its viewer content and dim
     * its parts before the editor can take their place; that left the page
     * empty for several frames (haxtheweb/issues#3263). Leaving is immediate.
     */
    _syncThemePartsEditMode(editMode) {
      // themes route through their own gate
      if (typeof this._syncEditMode === "function") {
        this._syncEditMode(editMode);
        return;
      }
      const editor =
        store.cmsSiteEditor && store.cmsSiteEditor.instance
          ? store.cmsSiteEditor.instance
          : null;
      if (
        editMode &&
        !this.editMode &&
        editor &&
        editor.isConnected &&
        typeof editor.whenEditModeReady === "function"
      ) {
        editor.whenEditModeReady().then(() => {
          if (store.editMode && !this.editMode) {
            this.editMode = true;
          }
        });
        return;
      }
      if (this.editMode !== editMode) {
        this.editMode = editMode;
      }
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
