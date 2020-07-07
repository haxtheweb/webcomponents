import { PageContentsMenu } from "@lrnwebcomponents/page-contents-menu/page-contents-menu.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { css } from "lit-element/lit-element.js";

class SiteMenuContent extends PageContentsMenu {
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
        :host([hide-if-empty][is-empty]) {
          display: none !important;
        }
      `
    ];
  }
}

customElements.define(SiteMenuContent.tag, SiteMenuContent);
export { SiteMenuContent };
