/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageColumnTheme } from "@haxtheweb/papermod-theme/lib/HomageColumnTheme.js";

/**
 * `astro-cactus-theme`
 * Blog theme set in a monospace face, with the navigation under the site
 * name and section pages listed one to a line beside their dates.
 *
 * The layout pays homage to the Astro Cactus theme by Chris Williams (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageColumnTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title Astro Cactus
 * @haxcms-theme-category Blog, Website
 * @haxcms-theme-priority 0
 * @demo ../demo/astro-cactus-theme/index.html
 * @element astro-cactus-theme
 */
class AstroCactusTheme extends HomageColumnTheme {
  static get tag() {
    return "astro-cactus-theme";
  }

  constructor() {
    super();
    this.headerLayout = "stack";
    this.listVariant = "compact";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-column-width: 720px;
          --homage-accent: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-theme-default-creekTeal)
          );
          --homage-font-heading: var(--ddd-font-mono);
        }
        site-title {
          --site-title-heading-font-size: var(--ddd-font-size-xs);
        }
        site-active-title h1 {
          font-size: var(--ddd-font-size-s);
        }
      `,
    ];
  }
}
globalThis.customElements.define(AstroCactusTheme.tag, AstroCactusTheme);
export { AstroCactusTheme };
