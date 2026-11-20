/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { BookTheme } from "@haxtheweb/book-theme/book-theme.js";

/**
 * `guidebook-theme`
 * Documentation theme with a slim top bar, a violet accent, and an on this
 * page column set off by a rule.
 *
 * The layout pays homage to Starlight, the documentation theme for Astro
 * (MIT, Copyright Astro contributors). None of its code, styles or assets
 * are used, and it is named apart from it on purpose; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on book-theme: same parts and behavior,
 * its own layout options and colors, all from DDD tokens.
 *
 * @title Guidebook
 * @haxcms-theme-category Documentation, Course, Website
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-inspired-by Astro
 * @haxcms-theme-inspired-by-theme Starlight
 * @haxcms-theme-priority 0
 * @demo ../demo/guidebook-theme/index.html
 * @element guidebook-theme
 */
class GuidebookTheme extends BookTheme {
  static get tag() {
    return "guidebook-theme";
  }

  constructor() {
    super();
    this.bookLayout = "topbar";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --book-theme-header-height: 56px;
          --book-theme-container-width: 1440px;
          --book-theme-menu-width: 300px;
          --book-theme-link: light-dark(
            var(--ddd-theme-default-wonderPurple),
            var(--ddd-theme-default-athertonViolet)
          );
          --book-theme-menu-surface: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .toc {
          border-left: var(--ddd-border-xs);
          border-left-color: var(--book-theme-rule);
        }
        site-active-title h1 {
          font-size: var(--ddd-font-size-xl);
        }
      `,
    ];
  }
}
globalThis.customElements.define(GuidebookTheme.tag, GuidebookTheme);
export { GuidebookTheme };
