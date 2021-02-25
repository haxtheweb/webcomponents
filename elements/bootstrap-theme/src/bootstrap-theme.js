/**
 * Copyright 2021 collinkleest
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";

/**
 * `bootstrap-theme`
 * `Hax bootstrap themeing`
 * @demo demo/index.html
 * @element bootstrap-theme
 */
class BootstrapTheme extends HAXCMSLitElementTheme(LitElement) {
  /**
   * Convention we use
   */
  static get tag() {
    return "bootstrap-theme";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
  }

  render() {
    return html`
      <nav id="bootstrap-menu" role="navigation" aria-labelledby="sitemenu">
        <replace-tag
          with="site-menu"
          id="sitemenu"
          import-method="view"
        ></replace-tag>
      </nav>
      <main>
        <article>
          <section>
            <slot></slot>
          </section>
        </article>
      </main>
    `;
  }

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {}

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define(BootstrapTheme.tag, BootstrapTheme);
export { BootstrapTheme };
