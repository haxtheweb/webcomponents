/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { CleanTwo } from "@lrnwebcomponents/clean-two/clean-two.js";
import "../../ui-components/layout/site-footer.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";

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
  print(e) {
    this.shadowRoot.querySelector("#printbtn").style.display = "none";
    window.addEventListener("afterprint", (e) => {
      window.close();
    });
    window.SimpleToast.requestAvailability().hide();
    setTimeout(() => {
      window.document.close();
      window.focus();
      window.print();
    }, 100);
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    document.body.style.setProperty("--haxcms-color", "white");
    document.body.style.overflow = 'auto';
    window.SimpleToast.requestAvailability().hide();
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
