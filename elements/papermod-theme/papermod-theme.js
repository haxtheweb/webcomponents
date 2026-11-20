/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageColumnTheme } from "@haxtheweb/papermod-theme/lib/HomageColumnTheme.js";

/**
 * `papermod-theme`
 * Blog theme with a plain header, a narrow column on a tinted page, and
 * the pages of a section listed as rounded cards.
 *
 * The layout pays homage to the PaperMod Hugo theme by Aditya Telange and
 * nanxiaobei (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageColumnTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title PaperMod
 * @haxcms-theme-category Blog, Website
 * @haxcms-theme-layout Single column
 * @haxcms-theme-inspired-by Hugo PaperMod
 * @haxcms-theme-priority 0
 * @demo demo/index.html
 * @element papermod-theme
 */
class PapermodTheme extends HomageColumnTheme {
  static get tag() {
    return "papermod-theme";
  }

  constructor() {
    super();
    this.listVariant = "cards";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-column-width: 720px;
          --homage-bg: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-black)
          );
          --homage-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --homage-accent: var(--homage-text);
          --homage-radius: var(--ddd-radius-md);
        }
        site-active-title h1 {
          font-size: var(--ddd-font-size-l);
        }
      `,
    ];
  }
}
globalThis.customElements.define(PapermodTheme.tag, PapermodTheme);
export { PapermodTheme };
