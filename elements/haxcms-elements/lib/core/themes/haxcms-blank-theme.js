/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { CleanTwo } from "@lrnwebcomponents/clean-two/clean-two.js";
import "../../ui-components/layout/site-footer.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";

// a blank theme that extends the conventions of CleanTwo bootstrap but can output a very clean
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
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    document.body.style.setProperty("--haxcms-color", "white");
  }
  static get styles() {
    return css`
      :host {
        display: block;
        margin: 20px;
      }
    `;
  }
  static get tag() {
    return "haxcms-blank-theme";
  }
}
customElements.define(HAXCMSBlankTheme.tag, HAXCMSBlankTheme);
export { HAXCMSBlankTheme };
