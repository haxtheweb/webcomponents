/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageColumnTheme } from "@haxtheweb/papermod-theme/lib/HomageColumnTheme.js";

/**
 * `astrowind-theme`
 * Site theme for landing pages: a fixed top bar, a wide column, heavy
 * headings, section pages as a grid of cards and a tinted footer.
 *
 * The layout pays homage to the AstroWind Astro theme by onWidget (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageColumnTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title AstroWind
 * @haxcms-theme-category Website, Landing page, Organization
 * @haxcms-theme-layout Top nav
 * @haxcms-theme-inspired-by Astro
 * @haxcms-theme-inspired-by-theme AstroWind
 * @haxcms-theme-priority 0
 * @demo ../demo/astrowind-theme/index.html
 * @element astrowind-theme
 */
class AstrowindTheme extends HomageColumnTheme {
  static get tag() {
    return "astrowind-theme";
  }

  constructor() {
    super();
    this.stickyHeader = true;
    this.listVariant = "grid";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-column-width: 1152px;
          --homage-accent: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-pughBlue)
          );
          --homage-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --homage-radius: var(--ddd-radius-lg);
        }
        .header {
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--homage-rule);
        }
        #contentcontainer {
          --ddd-theme-measure: var(--ddd-content-width-lg);
        }
        site-active-title h1 {
          font-size: var(--ddd-font-size-xl);
          font-weight: var(--ddd-font-weight-black);
        }
      `,
    ];
  }
}
globalThis.customElements.define(AstrowindTheme.tag, AstrowindTheme);
export { AstrowindTheme };
