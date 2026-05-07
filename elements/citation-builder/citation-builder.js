/**
 * Copyright 2026 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, render } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/citation-builder/lib/citation-item.js"

/**
 * `citation-builder`
 * 
 * @demo index.html
 * @element citation-builder
 */
export class CitationBuilder extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "citation-builder";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "References",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/citation-builder.ar.json", import.meta.url).href +
        "/../",
    });
    this.exportMode = "";
    this.citationArr = [ "Select a citation format below" ];

    this.addEventListener("add-citation", this._addCitationHandler.bind(this));
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      exportMode: { type: String, attribute: "export-mode" },
      citationArr: { type: Array, attribute: "citation-array" }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        padding: var(--ddd-spacing-4);
        margin: var(--ddd-spacing-2);
        border: var(--ddd-border-md);
      }
      h3 {
        margin-top: 16px;
      }
      h3 span {
        font-size: var(--citation-builder-label-font-size, var(--ddd-font-size-s));
      }
      .title-card {
        display: flex;
        justify-content: space-between;
      }

      #export-button {
        align-self: center;
        background-color: white;
      }

      .citation-list {
        border: black solid 1px;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper">
      <div class="title-card">
        <h3><span>${this.t.title}:</span> ${this.title}</h3>
        <button id="export-button" @click=${this._showExportModal}>Export</button>
      </div>      

      <slot>
        <citation-item title="Make your own citation with the HAX Editor" publication-date="${new Date()}"></citation-item>
      </slot>
    </div>`;
  }

  /**
  * LitElement lifecycle
  */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }

    changedProperties.forEach((oldValue, propName) => {
      if (propName === "citationArr" && oldValue !== undefined) {
        this.renderExport();
      }
    });
  }

  _showExportModal(e){
    this._modalContent = this._modalContent || globalThis.document.createElement('div');
    this.renderExport();

    this.dispatchEvent(
      new CustomEvent('simple-modal-show', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          title: `Export Citations`,
          elements: { content: this._modalContent },
          invokedBy: e.target
        },
      }),
    )
  }

  // simple-modal is independent from our main lit lifecycle, so we do a custom render
  renderExport(){
    render(
      html`
      <style>
        .citation-list {
          max-height: 40vh;
          overflow-y: auto;
          border: black solid 1px;
          padding: 8px;
          margin: 8px;
        }
        .control-bar {
          --simple-icon-button-border: 1px black solid;
          --simple-icon-button-border-radius: 4px;
          --simple-icon-button-focus-border: 2px black solid;
          --simple-icon-button-padding: 6px;
          --simple-icon-height: 32px;
          --simple-icon-width: 32px;
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
        }
        simple-icon-button-lite {
          align-self: center;
          width: fit-content;
        }
        simple-icon-button-lite::part(button) {
          font-size: 20px;
        }
      </style>
      <div class="citation-list">
        ${this.citationArr.map(citation => html`<div class="citation-entry">${citation}</div>`)}
      </div>
      <div class="control-bar">
        <div class="copy-button">
          <simple-icon-button-lite
            part="icon"
            class="icon"
            title="Copy"
            icon="content-copy"
            @click=${this._copyToClipboard}
          >Copy</simple-icon-button-lite>
        </div>
        <div class="export-drop">
          <select id="export-dropdown" @change=${this._exportHandler}>
            <option value="Export">Export</option>
            <option value="APA">APA</option>
            <option value="BibTeX">BibTeX</option>
          </select>
        </div>
      </div>
      `, 
      this._modalContent,
      { host: this }
    );
  }

  _exportHandler(e){
    this.exportMode = e.target.value;
    const slot = this.shadowRoot.querySelector('slot').assignedElements();

    if(this.exportMode === "APA") {
      this.citationArr = slot.map((item) => item.exportAPA())
    } else if (this.exportMode === "BibTeX") {
      this.citationArr = slot.map((item) => item.exportBibtex())
    } else {
      this.citationArr = [ "Select a citation format below" ];
    }
  }

  _copyToClipboard(){  
    const target = this._modalContent.querySelector(".citation-list");
    const htmlContent = target.innerHTML; 
    const plainContent = target.textContent;

    // const wrappedHtml = `
    //   <html>
    //     <head>
    //       <meta charset="utf-8">
    //     </head>
    //     <body>
    //     <!--StartFragment-->
    //       ${htmlContent}
    //       <!--EndFragment-->
    //     </body>
    //   </html>
    // `;

    const blobHtml = new Blob([htmlContent], { type: "text/html" });
    const blobText = new Blob([plainContent], { type: "text/plain" });

    const data = [new ClipboardItem({
      "text/html": blobHtml,
      "text/plain": blobText // Fallback
    })];

    navigator.clipboard.write(data)
  }

  _addCitationHandler(e){
    const item = globalThis.document.createElement("citation-item");

    const attrs = { 
      "data-hax-layout": true, 
      "data-hax-ray": "citation-item"
    };

    for (const name in attrs) {
      item.setAttribute(name, attrs[name]);
    }

    if(e.detail.direction === "above"){
      // add above current citation
      e.detail.node.before(item)
    } else if (e.detail.direction === "below") {
      // add below current citation
      e.detail.node.after(item)
    } else {
      // add at the end of the citation list
      this.appendChild(item);
    }
  }

  haxHooks() {
    return {
      inlineContextMenu: "haxinlineContextMenu",
    };
  }

  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:add",
        callback: "_addCitationHandler",
        label: "Add citation",
      },
    ];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CitationBuilder.tag, CitationBuilder);