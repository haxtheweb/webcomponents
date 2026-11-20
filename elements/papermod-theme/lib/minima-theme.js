/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageColumnTheme } from "@haxtheweb/papermod-theme/lib/HomageColumnTheme.js";

/**
 * `minima-theme`
 * Blog theme with a heavy rule over the header, a light rule under it, and
 * the pages of a section listed by date.
 *
 * The layout pays homage to Minima, the default Jekyll theme, by Parker
 * Moore and the minima contributors (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageColumnTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title Minima
 * @haxcms-theme-category Blog, Website
 * @haxcms-theme-layout Single column
 * @haxcms-theme-inspired-by Jekyll
 * @haxcms-theme-inspired-by-theme Minima
 * @haxcms-theme-priority 0
 * @demo ../demo/minima-theme/index.html
 * @element minima-theme
 */
class MinimaTheme extends HomageColumnTheme {
  static get tag() {
    return "minima-theme";
  }

  constructor() {
    super();
    this.listVariant = "plain";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-column-width: 800px;
        }
        .header {
          border-top: var(--ddd-border-lg);
          border-top-color: var(--homage-text);
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--homage-rule);
        }
        site-title {
          --site-title-heading-font-weight: var(--ddd-font-weight-regular);
        }
      `,
    ];
  }
}
globalThis.customElements.define(MinimaTheme.tag, MinimaTheme);
export { MinimaTheme };
