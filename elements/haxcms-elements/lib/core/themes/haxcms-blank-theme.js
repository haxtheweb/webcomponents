/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { CleanTwo } from "@lrnwebcomponents/clean-two/clean-two.js";

class HAXCMSBlankTheme extends CleanTwo {
  render() {
    return html`
      <main>
        <article>
          <section>
            <slot></slot>
          </section>
        </article>
      </main>
    `;
  }
  static get styles() {
    return css``;
  }
  static get tag() {
    return "haxcms-blank-theme";
  }
}
window.customElements.define(HAXCMSBlankTheme.tag, HAXCMSBlankTheme);
export { HAXCMSBlankTheme };
