/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageColumnTheme } from "@haxtheweb/papermod-theme/lib/HomageColumnTheme.js";

/**
 * `coder-theme`
 * Personal site theme with a spare header, light weight headings and
 * section pages listed one to a line beside their dates.
 *
 * The layout pays homage to the Coder Hugo theme by Luiz F. A. de Prá (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageColumnTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title Coder
 * @haxcms-theme-category Blog, Website
 * @haxcms-theme-priority 0
 * @demo ../demo/index.html
 * @element coder-theme
 */
class CoderTheme extends HomageColumnTheme {
  static get tag() {
    return "coder-theme";
  }

  constructor() {
    super();
    this.listVariant = "compact";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-column-width: 720px;
        }
        .bar {
          min-height: 80px;
        }
        site-active-title h1 {
          font-weight: var(--ddd-font-weight-medium);
        }
      `,
    ];
  }
}
globalThis.customElements.define(CoderTheme.tag, CoderTheme);
export { CoderTheme };
