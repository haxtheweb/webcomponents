/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { CleanTwo } from "@haxtheweb/clean-two/clean-two.js";

// a blank theme that extends the conventions of CleanTwo bootstrap but can output a very clean
class HAXCMSBlankTheme extends CleanTwo {
  render() {
    return html`
      <main>
        <article id="contentcontainer">
          <section id="slot">
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
    globalThis.document.body.style.setProperty("--haxcms-color", "white");
    // in-case coming from a theme that undoes this
    globalThis.document.body.style.overflow = "auto";
  }
  static get styles() {
    return css`
      :host([edit-mode]) {
        opacity: 1;
      }
      :host([hidden]) {
        display: none;
      }
      [hidden] {
        display: none !important;
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          transition: none !important;
        }
      }
      /**
        * Hide the slotted content during edit mode. This must be here to work.
        */
      :host([edit-mode]) #slot {
        display: none;
      }
      #slot {
        min-height: 50vh;
      }
      :host {
        display: block;
        margin: 0px;
      }
    `;
  }
  static get tag() {
    return "haxcms-blank-theme";
  }
}
customElements.define(HAXCMSBlankTheme.tag, HAXCMSBlankTheme);
export { HAXCMSBlankTheme };
