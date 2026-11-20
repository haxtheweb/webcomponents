/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageColumnTheme } from "@haxtheweb/papermod-theme/lib/HomageColumnTheme.js";

/**
 * `al-folio-theme`
 * Academic site theme with a fixed top bar, a wide column, light weight
 * headings and a violet accent.
 *
 * The layout pays homage to the al-folio Jekyll theme by Maruan
 * Al-Shedivat (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageColumnTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title al-folio
 * @haxcms-theme-category Website, Research, Portfolio
 * @haxcms-theme-layout Single column
 * @haxcms-theme-inspired-by Jekyll
 * @haxcms-theme-inspired-by-theme al-folio
 * @haxcms-theme-priority 0
 * @demo ../demo/al-folio-theme/index.html
 * @element al-folio-theme
 */
class AlFolioTheme extends HomageColumnTheme {
  static get tag() {
    return "al-folio-theme";
  }

  constructor() {
    super();
    this.stickyHeader = true;
    this.listVariant = "rows";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-column-width: 930px;
          --homage-accent: light-dark(
            var(--ddd-theme-default-wonderPurple),
            var(--ddd-theme-default-skyBlue)
          );
        }
        .header {
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--homage-rule);
        }
        site-title {
          --site-title-heading-font-weight: var(--ddd-font-weight-light);
        }
        site-active-title h1 {
          font-weight: var(--ddd-font-weight-light);
        }
      `,
    ];
  }
}
globalThis.customElements.define(AlFolioTheme.tag, AlFolioTheme);
export { AlFolioTheme };
