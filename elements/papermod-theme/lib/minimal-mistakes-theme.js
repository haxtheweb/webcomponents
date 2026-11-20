/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageSidebarTheme } from "@haxtheweb/papermod-theme/lib/HomageSidebarTheme.js";

/**
 * `minimal-mistakes-theme`
 * Flexible site theme with a top bar for the site name and top level
 * pages, a slim sidebar for the description and menu, and the headings of
 * the page on the right.
 *
 * The layout pays homage to the Minimal Mistakes Jekyll theme by Michael
 * Rose and contributors (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageSidebarTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title Minimal Mistakes
 * @haxcms-theme-category Blog, Website, Documentation
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-inspired-by Jekyll
 * @haxcms-theme-inspired-by-theme Minimal Mistakes
 * @haxcms-theme-priority 0
 * @demo ../demo/minimal-mistakes-theme/index.html
 * @element minimal-mistakes-theme
 */
class MinimalMistakesTheme extends HomageSidebarTheme {
  static get tag() {
    return "minimal-mistakes-theme";
  }

  constructor() {
    super();
    this.masthead = true;
    this.withToc = true;
    this.listVariant = "plain";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-sidebar-width: 240px;
          --homage-column-width: 800px;
          --homage-accent: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-slateLight)
          );
        }
        .toc {
          margin-top: var(--ddd-spacing-8);
          padding-top: var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: var(--homage-rule);
          border-radius: var(--ddd-radius-xs);
        }
      `,
    ];
  }
}
globalThis.customElements.define(
  MinimalMistakesTheme.tag,
  MinimalMistakesTheme,
);
export { MinimalMistakesTheme };
