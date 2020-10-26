import { css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
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
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        ...styles,
        css`
          [part="edit-mode-active"] {
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
      let props = {};
      if (super.properties) {
        props = super.props;
      }
      return {
        ...props,
        editMode: {
          type: Boolean,
          attribute: "edit-mode",
          reflect: true,
        },
      };
    }
  };
};

export { HAXCMSThemeParts };
