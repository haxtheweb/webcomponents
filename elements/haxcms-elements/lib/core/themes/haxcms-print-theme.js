/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { CleanTwo } from "@haxtheweb/clean-two/clean-two.js";
import "../../ui-components/layout/site-footer.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
// a print theme that extends the conventions of CleanTwo bootstrap but can output a very clean print document
class HAXCMSPrintTheme extends CleanTwo {
  render() {
    return html`
      <header>
        <simple-icon-button-lite
          @click="${this.print}"
          id="printbtn"
          icon="print"
        ></simple-icon-button-lite>
      </header>
      <main>
        <article>
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
    globalThis.addEventListener("afterprint", (e) => {
      globalThis.close();
    });
    if (globalThis.SimpleToast && globalThis.SimpleToast.requestAvailability) {
      globalThis.SimpleToast.requestAvailability().hide();
    }
    globalThis.scrollBy({
      left: 0,
      top: globalThis.document.body.scrollHeight,
      behavior: "smooth",
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
    `;
  }
  static get tag() {
    return "haxcms-print-theme";
  }
}
customElements.define(HAXCMSPrintTheme.tag, HAXCMSPrintTheme);
export { HAXCMSPrintTheme };
