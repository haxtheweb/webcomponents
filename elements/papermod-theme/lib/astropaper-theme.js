/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageColumnTheme } from "@haxtheweb/papermod-theme/lib/HomageColumnTheme.js";

/**
 * `astropaper-theme`
 * Blog theme set in a monospace face on a warm page, with a ruled header
 * and section pages listed with accent colored titles.
 *
 * The layout pays homage to the AstroPaper Astro theme by Sat Naing (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageColumnTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title AstroPaper
 * @haxcms-theme-category Blog, Website
 * @haxcms-theme-layout Single column
 * @haxcms-theme-inspired-by Astro AstroPaper
 * @haxcms-theme-priority 0
 * @demo ../demo/astropaper-theme/index.html
 * @element astropaper-theme
 */
class AstropaperTheme extends HomageColumnTheme {
  static get tag() {
    return "astropaper-theme";
  }

  constructor() {
    super();
    this.listVariant = "rows";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-column-width: 768px;
          --homage-bg: light-dark(
            var(--ddd-theme-default-shrineMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --homage-accent: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-inventOrange)
          );
          --homage-font-heading: var(--ddd-font-mono);
        }
        .bar {
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--homage-rule);
        }
        site-active-title h1 {
          font-size: var(--ddd-font-size-m);
          color: var(--homage-accent);
        }
      `,
    ];
  }
}
globalThis.customElements.define(AstropaperTheme.tag, AstropaperTheme);
export { AstropaperTheme };
