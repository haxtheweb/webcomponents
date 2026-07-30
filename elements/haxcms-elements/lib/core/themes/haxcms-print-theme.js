/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * @haxcms-theme-category Website
 * @haxcms-theme-internal true
 */
import { html, css } from "lit";
import { CleanTwo } from "@haxtheweb/clean-two/clean-two.js";
import "../../ui-components/layout/site-footer.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
// a print theme that extends the conventions of CleanTwo bootstrap but can output a very clean print document
class HAXCMSPrintTheme extends CleanTwo {
  render() {
    return html`
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header>
        <simple-icon-button-lite
          @click="${this.print}"
          id="printbtn"
          icon="print"
          label="Print this page"
          title="Print this page"
        ></simple-icon-button-lite>
      </header>
      <main id="main-content" tabindex="-1">
        <article>
          <site-active-title></site-active-title>
          <section>
            <slot></slot>
          </section>
        </article>
      </main>
      <footer>
        <site-footer></site-footer>
      </footer>
    `;
  }
  async print(e) {
    this.shadowRoot.querySelector("#printbtn").style.display = "none";
    if (this.__afterPrintHandler) {
      globalThis.removeEventListener("afterprint", this.__afterPrintHandler);
    }
    this.__afterPrintHandler = () => {
      globalThis.close();
    };
    globalThis.addEventListener("afterprint", this.__afterPrintHandler, {
      once: true,
    });
    if (globalThis.SimpleToast && globalThis.SimpleToast.requestAvailability) {
      globalThis.SimpleToast.requestAvailability().hide();
    }
    const reduceMotion =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    globalThis.scrollBy({
      left: 0,
      top: globalThis.document.body.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
    setTimeout(() => {
      globalThis.scrollTo(0, 0);
      setTimeout(() => {
        globalThis.document.close();
        globalThis.focus();
        globalThis.print();
      }, 10);
    }, 500);
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    globalThis.document.body.style.setProperty("--haxcms-color", "white");
    globalThis.document.body.style.overflow = "auto";
    if (globalThis.SimpleToast && globalThis.SimpleToast.requestAvailability) {
      globalThis.SimpleToast.requestAvailability().hide();
    }
    // support replace tag which needs to run its replacements first
    const replaceTag = Array.from(
      globalThis.document.body.querySelectorAll(
        "haxcms-print-theme replace-tag",
      ),
    );
    for (let i = 0; i < replaceTag.length; i++) {
      replaceTag[i].runReplacement();
    }
    setTimeout(() => {
      const all = Array.from(
        globalThis.document.body.querySelectorAll("haxcms-print-theme *"),
      );
      for (let i = 0; i < all.length; i++) {
        all[i].elementVisible = true;
      }
    }, 250);
    setTimeout(() => {
      this.shadowRoot.querySelector("#printbtn").focus();
    }, 0);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    // remove overflow
    globalThis.document.body.style.removeProperty("overflow");
    if (this.__afterPrintHandler) {
      globalThis.removeEventListener("afterprint", this.__afterPrintHandler);
      this.__afterPrintHandler = null;
    }
    super.disconnectedCallback();
  }
  static get styles() {
    return css`
      :host {
        display: block;
        margin: 20px;
      }
      #printbtn {
        position: fixed;
        top: 0;
        right: 0;
        color: black;
        width: 50px;
        height: 50px;
      }
      #printbtn:focus-visible,
      #printbtn:focus-within {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }
      /* Skip link (WCAG 2.4.1) — copied from base; super.styles not inherited */
      .skip-link {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      .skip-link:focus {
        position: fixed;
        top: 0;
        left: 0;
        width: auto;
        height: auto;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        margin: var(--ddd-spacing-2);
        overflow: visible;
        clip: auto;
        white-space: normal;
        z-index: 10000;
        background: var(--ddd-theme-default-white, #fff);
        color: var(--ddd-theme-default-coalyGray, #000);
        border: 2px solid currentColor;
        text-decoration: none;
        font-family: var(--ddd-font-primary, sans-serif);
        font-weight: var(--ddd-font-weight-bold, 700);
      }
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;
  }
  static get tag() {
    return "haxcms-print-theme";
  }
}
globalThis.customElements.define(HAXCMSPrintTheme.tag, HAXCMSPrintTheme);
export { HAXCMSPrintTheme };
