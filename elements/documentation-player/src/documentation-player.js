/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { LitElement, html, css, render, nothing } from "lit";
import "@lrnwebcomponents/simple-img/simple-img.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/play-list/play-list.js";
import "@lrnwebcomponents/code-sample/code-sample.js";
import "@lrnwebcomponents/code-editor/lib/code-pen-button.js";
import { nodeToHaxElement } from "@lrnwebcomponents/utils/utils.js";

/**
 * `documentation-player`
 * `playlist like element but for documenting web components in the context of hax`
 * @demo demo/index.html
 * @element documentation-player
 */
class DocumentationPlayer extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.label = '';
    this.haxSchema = [];
    this.imageUrl = "";
    this.url = "";
    setTimeout(async () => {
      for (let i = 0; i < this.children.length; i++) {
        this.haxSchema.push(await nodeToHaxElement(this.children[i]));     
      }        
    }, 0);
  }

  static get properties() {
    return {
      label: { type: String },
      haxSchema: { type: Array, attribute: false },
      imageUrl: { type: String, attribute: "image-url" },
      url: { type: String, attribute: "url" },
    }
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  _getDataString(data) {
    return JSON.stringify(data).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }

  codePenData(label) {
    return this._getDataString({
      title: label,
      html: this.innerHTML.trim(),
      head: `<script>window.WCGlobalCDNPath="https://cdn.webcomponents.psu.edu/cdn/";</script><script src="https://cdn.webcomponents.psu.edu/cdn/build.js"></script>`,
    });
  }

  // because of how processed <template> tags work in lit (illegal) we have to specialized way of rendering
  // so that the play-list element is empty for a second and then we template stamp it into placee
  renderPlayListTemplate() {
    let template = document.createElement("template");
    render(
      html`
        <div>
            <a href="${this.url}" rel="noopener" target="_blank">${this.label}</a>
            <simple-img loading="lazy" fetchpriority="low" decoding="async" src="https://screenshoturl.elmsln.vercel.app/api/screenshotUrl?quality=10&amp;render=img&amp;urlToCapture=${this.imageUrl}" alt="" width="300" height="200" quality="80"></simple-img>
        </div>
        <div id="codesample"></div>
        <code-pen-button data-string="${this.codePenData(this.label)}"></code-pen-button>
        ${this.renderHAXInjectButton()}`,
      template
    );
    this.shadowRoot
      .querySelector("#contentplayertemplate")
      .appendChild(template);
    setTimeout(() => {
      let template = document.createElement("template");
      template.innerHTML = this.innerHTML.trim();
      let codesample = document.createElement("code-sample");
      codesample.innerHTML = template.outerHTML;
      this.shadowRoot
      .querySelector("#codesample").appendChild(codesample);
    }, 10);
  }

  /**
   * LitElement render callback
   */
  render() {
    return html`<play-list id="contentplayertemplate"></play-list>`;
  }

  renderHAXInjectButton() {
    // @todo in order for this to work we'll need to encapsulate the hax schema in another element
    // we may need a singleton in order to do this correctly just because of how all this evaluative
    // template rendering works. play-list in sl-carousel in a ridiculous example of this nesting
    // and we lose our events along the way.
      return html`
        <simple-icon-button-lite
          icon="settings"
          @click="${this._injectHAX}"
        >Insert into your side</simple-icon-button-lite>
      `;
  }
  _injectHAX(e) {
    window.dispatchEvent(new CustomEvent("hax-insert", {
        detail: {
          value: this.haxSchema,
        },
      })
    );
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "documentation-player";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.renderPlayListTemplate();
  }
}
customElements.define(DocumentationPlayer.tag, DocumentationPlayer);
export { DocumentationPlayer };
