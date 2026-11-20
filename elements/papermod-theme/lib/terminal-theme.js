/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageColumnTheme } from "@haxtheweb/papermod-theme/lib/HomageColumnTheme.js";

/**
 * `terminal-theme`
 * Blog theme that is dark by design: a monospace face, an orange accent,
 * the site name in a solid block and the navigation under it.
 *
 * The layout pays homage to the Terminal Hugo theme by panr (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageColumnTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title Terminal
 * @haxcms-theme-category Blog, Website
 * @haxcms-theme-layout Single column
 * @haxcms-theme-inspired-by Hugo
 * @haxcms-theme-inspired-by-theme Terminal
 * @haxcms-theme-priority 0
 * @demo ../demo/terminal-theme/index.html
 * @element terminal-theme
 */
class TerminalTheme extends HomageColumnTheme {
  static get tag() {
    return "terminal-theme";
  }

  constructor() {
    super();
    this.headerLayout = "stack";
    this.listVariant = "rows";
    this.darkModeSwitch = false;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          /* dark by design: every light-dark() under this theme reads dark */
          color-scheme: dark;
          --homage-column-width: 864px;
          --homage-bg: var(--ddd-theme-default-coalyGray);
          --homage-text: var(--ddd-theme-default-white);
          --homage-accent: var(--ddd-theme-default-inventOrange);
          --homage-muted: var(--ddd-theme-default-slateLight);
          --homage-rule: var(--ddd-theme-default-inventOrange);
          --homage-font-body: var(--ddd-font-mono);
          --homage-font-heading: var(--ddd-font-mono);
          --homage-radius: var(--ddd-radius-0);
        }
        site-title {
          flex: 0 1 auto;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          color: var(--ddd-theme-default-coalyGray);
          background-color: var(--homage-accent);
          --site-title-heading-font-size: var(--ddd-font-size-xxs);
        }
        :host([header-layout="stack"]) .bar site-title {
          flex: 0 1 auto;
        }
        .bar .tools {
          margin-left: auto;
        }
        .topnav {
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
globalThis.customElements.define(TerminalTheme.tag, TerminalTheme);
export { TerminalTheme };
