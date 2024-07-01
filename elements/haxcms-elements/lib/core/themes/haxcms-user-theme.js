/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
import { HAXCMSPolymerElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSPolymerElementTheme.js";
import { stylesFromTemplate } from "@polymer/polymer/lib/utils/style-gather.js";
// @todo load the elements this theme needs dynamically
// we reference this but pull nothing in to get the dependency tree loaded in full
import "@haxtheweb/haxcms-elements/lib/ui-components/templates/basic-template.js";
/**
 * `haxcms-custom-theme`
 * `This is a custom theme. Don't edit this file, edit yoursite/theme/theme.css and yoursite/theme/theme.html`
 *

 * @polymer
 * @demo demo/index.html
 */
class HAXCMSUserTheme extends HAXCMSPolymerElementTheme {
  /**
   * Get css
   */
  async getCSS() {
    return await fetch("theme/theme.css")
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        const evt = new CustomEvent("haxcms-custom-theme-template-ready", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            css: response,
          },
        });
        this.dispatchEvent(evt);

        return response;
      });
  }
  /**
   * Get css
   */
  async getHTML() {
    return await fetch("theme/theme.html")
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        const evt = new CustomEvent("haxcms-custom-theme-template-ready", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            html: response,
          },
        });
        this.dispatchEvent(evt);
        return response;
      });
  }
  constructor() {
    super();
    this.__counter = 0;
    this.getCSS();
    this.getHTML();
    globalThis.addEventListener(
      "haxcms-custom-theme-template-ready",
      this.templateReady.bind(this),
    );
  }
  connectedCallback() {
    super.connectedCallback();
    this.contentContainer = this.shadowRoot.querySelector("#contentcontainer");
  }
  // render function
  static get template() {
    return html`
      <div id="contentcontainer">
        <div id="slot">
          <slot></slot>
        </div>
      </div>
    `;
  }
  templateReady(e) {
    this.__counter++;
    if (e.detail.css) {
      this._css = e.detail.css;
    }
    if (e.detail.html) {
      this._html = e.detail.html;
    }
    if (this.__counter === 2) {
      let t = globalThis.document.createElement("template");
      t.innerHTML = `
      <style>
        /**
         * Hide the slotted content during edit mode. This must be here to work.
         */
        :host([edit-mode]) #slot {
          display: none;
        }
        ${this._css}
      </style>
      ${this._html}`;
      const styles = stylesFromTemplate(t);
      while (this.shadowRoot.firstChild) {
        this.shadowRoot.removeChild(this.shadowRoot.firstChild);
      }
      // add in all styles found
      for (var i in styles) {
        t.innerHTML = styles[i].outerHTML + t.innerHTML;
      }
      this.__instance = this._stampTemplate(t);
      // now the template
      this.shadowRoot.appendChild(this.__instance);
    }
  }
}
customElements.define("haxcms-user-theme", HAXCMSUserTheme);
export { HAXCMSUserTheme };
