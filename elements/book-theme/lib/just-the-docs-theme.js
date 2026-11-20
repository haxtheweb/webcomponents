/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { BookTheme } from "@haxtheweb/book-theme/book-theme.js";

/**
 * `just-the-docs-theme`
 * Documentation theme with a tinted menu column set off by a rule, a wide
 * page, and the on this page list kept in its button.
 *
 * The layout pays homage to the Just the Docs Jekyll theme by Patrick
 * Marsceill (MIT). None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on book-theme: same parts and behavior,
 * its own layout options and colors, all from DDD tokens.
 *
 * @title Just the Docs
 * @haxcms-theme-category Documentation, Course, Website
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-inspired-by Jekyll
 * @haxcms-theme-inspired-by-theme Just the Docs
 * @haxcms-theme-priority 0
 * @demo ../demo/just-the-docs-theme/index.html
 * @element just-the-docs-theme
 */
class JustTheDocsTheme extends BookTheme {
  static get tag() {
    return "just-the-docs-theme";
  }

  constructor() {
    super();
    this.tocFold = true;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --book-theme-container-width: 1280px;
          --book-theme-menu-surface: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --book-theme-link: light-dark(
            var(--ddd-theme-default-wonderPurple),
            var(--ddd-theme-default-athertonViolet)
          );
        }
        .menu {
          border-right: var(--ddd-border-xs);
          border-right-color: var(--book-theme-rule);
        }
        site-active-title h1 {
          font-weight: var(--ddd-font-weight-regular);
        }
      `,
    ];
  }
}
globalThis.customElements.define(JustTheDocsTheme.tag, JustTheDocsTheme);
export { JustTheDocsTheme };
