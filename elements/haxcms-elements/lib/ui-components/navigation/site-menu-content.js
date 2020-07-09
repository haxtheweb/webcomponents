import { PageContentsMenu } from "@lrnwebcomponents/page-contents-menu/page-contents-menu.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { css, html } from "lit-element/lit-element.js";

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
  /**
   * wrap the base render function in a part that demonstrates edit mode
   */
  render() {
    return html`
      <div .part="${this.editMode ? `edit-mode-active` : ``}">
        ${super.render()}
      </div>
    `;
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
        @media screen and (max-width: 600px) {
          .indent-1, .indent-2, .indent-3, .indent-4, .indent-5, .indent-6 {
            padding-left: 0;
          }
        }
        :host([hide-if-empty][is-empty]) {
          display: none !important;
        }
        simple-popover,
        ol,
        .item {
          max-width: 175px;
        }
      `
    ];
  }
}

customElements.define(SiteMenuContent.tag, SiteMenuContent);
export { SiteMenuContent };
