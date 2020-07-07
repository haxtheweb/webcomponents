import { PageContentsMenu } from "@lrnwebcomponents/page-contents-menu/page-contents-menu.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { css } from "lit-element/lit-element.js";

class SiteMenuContent extends HAXCMSThemeParts(PageContentsMenu) {
  static get tag() {
    return "site-menu-content";
  }
  constructor() {
    super();
    this.hideIfEmpty = true;
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun(reaction => {
      this.contentContainer = toJS(store.themeElement);
      setTimeout(() => {
        this.updateMenu();
      }, 10);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      let content = toJS(store.activeItemContent);
      setTimeout(() => {
        this.updateMenu();
      }, 10);
      this.__disposer.push(reaction);
    });
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --page-contents-menu-link-hover: var(
            --haxcms-color,
            var(--simple-colors-default-theme-purple-7)
          );
        }
        :host([part="edit-mode-active"]) {
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
        :host([hide-if-empty][is-empty]) {
          display: none !important;
        }
      `
    ];
  }
}

customElements.define(SiteMenuContent.tag, SiteMenuContent);
export { SiteMenuContent };
