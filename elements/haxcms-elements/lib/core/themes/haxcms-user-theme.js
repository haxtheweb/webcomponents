/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { stylesFromTemplate } from "@polymer/polymer/lib/utils/style-gather.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSThemeWiring.js";
// @todo load the elements this theme needs dynamically
// we reference this but pull nothing in to get the dependency tree loaded in full
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/templates/basic-template.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `haxcms-custom-theme`
 * `This is a custom theme. Don't edit this file, edit yoursite/theme/theme.css and yoursite/theme/theme.html`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HAXCMSUserTheme extends HAXCMSTheme(PolymerElement) {
  /**
   * Get css
   */
  async getCSS() {
    return await fetch("theme/theme.css")
      .then(response => {
        return response.text();
      })
      .then(response => {
        const evt = new CustomEvent("haxcms-custom-theme-template-ready", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            css: response
          }
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
      .then(response => {
        return response.text();
      })
      .then(response => {
        const evt = new CustomEvent("haxcms-custom-theme-template-ready", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            html: response
          }
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
    window.addEventListener(
      "haxcms-custom-theme-template-ready",
      this.templateReady.bind(this)
    );
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.contentContainer = this.shadowRoot.querySelector(
        "#contentcontainer"
      );
    });
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
      let t = document.createElement("template");
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
window.customElements.define("haxcms-user-theme", HAXCMSUserTheme);
export { HAXCMSUserTheme };
