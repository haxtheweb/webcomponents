/**
 * Copyright 2026 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, render } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `citation-builder`
 * 
 * @demo index.html
 * @element citation-builder
 */
export class CitationItem extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "citation-item";
  }

  constructor() {
    super();
    this.title = "HAX The Web";
    this.authors = [
      { given: 'John', surname: 'Doe' },
    ];
    this.publicationDate = "";
    this.accessDate = "";
    this.citationType = "web";

    this.publisher = "HAX PSU";
    this.url = "";
    this.startPage = "";
    this.endPage = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      citationType: { type: String, reflect: true, attribute: "citation-type" },
      publisher: { type: String },
      authors: { type: Array },
      publicationDate: { type: String, attribute: "publication-date" },
      accessDate: { type: String, attribute: "access-date" },
      url: { type: String },
      parentVer: { type: Number, attribute: "parent-ver" },
      childVer: { type: Number, attribute: "child-ver" },
      startPage: { type: String, attribute: 'start-page' },
      endPage: { type: String, attribute: 'end-page' }
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
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        border: grey 1px solid;
        display: flex;
        justify-content: space-between;
      }
      .italic-section {
        display: inline;
        font-style: italic;
      }
      .citation {
        width: 80%;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper">
        <div class="citation">${this.exportAPA()}</div>
        <div class="copy-button">
            <simple-icon-button
              part="icon"
              class="icon"
              title="Copy"
              icon="content-copy"
              @click=${this._copyToClipboard}
            ></simple-icon-button>
        </div>
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
      if (propName === "citationType" && oldValue !== undefined) {
          globalThis.HaxStore.instance.refreshActiveNodeForm()
      };
    });
  }

  _formatAuthors(){
    if (!this.authors) return '';

    // author.given author.surname
    const formattedArr = this.authors.map((author) => {
      const surname = author.surname.trim()
      const given = author.given.trim().replace(/\b(\w)\w*/g, '$1.').toUpperCase();

      return `${surname}, ${given}`
    });

    if (this.authors.length === 1){
      return formattedArr[0];
    } else {
      const last = formattedArr.pop();
      return formattedArr.join(', ') + ', & ' + last;
    }
  }

  _formatSource(){
    return {
      getJournalSource: (format) => {
        if(format === "APA"){
          // Issue num only applies if there's a volume num
          const volumeDetails = this.parentVer ? 
            html`<i>${this.parentVer}</i>${this.childVer ? html`(${this.childVer})` : ''}` : '';

          // End page only applies if there's a start page
          const pageRange = this.startPage ?
            html`${this.startPage}${this.endPage ? ` - ${this.endPage}` : ''}` : '';

          if (!volumeDetails && !pageRange) return '';
          if (!pageRange) return html`${volumeDetails}`;
          if (!volumeDetails) return html`${pageRange}`;

          return html`${volumeDetails}, ${pageRange}`;
        }
      },
      getBookSource: (format) => {
        if(format === "APA"){
          // (#th ed., Vol. #, pp. #-#).
          const editionDetails = this.parentVer ? 
            html`${this.parentVer} ed.${this.childVer ? html`, Vol. ${this.childVer}` : ''}` : '';
          // End page only applies if there's a start page
          const pageRange = this.startPage ?
            html`${this.startPage}${this.endPage ? ` - ${this.endPage}` : ''}` : '';

          return html`(${editionDetails}, pp. ${pageRange})`;
        }
      }
    }
  };

  _formatDate(){
    const pubDateObj = new Date(this.publicationDate);
    const accessDateObj = new Date(this.accessDate);

    return {
      // The same between APA and BibTeX
      getPubYear: () => {
        if(isNaN(pubDateObj)) return "(n.d.)";

        return pubDateObj.getFullYear();
      },
      getFullPubDate: () => {
        if(isNaN(pubDateObj)) return "(n.d.)";

        const pubYear = pubDateObj.getFullYear();
        const pubMonth = pubDateObj.toLocaleString('default', { month: 'long' });;
        const pubDay = pubDateObj.getDate();

        if (!pubMonth) return `(${pubYear})`;
        if (!pubDay) return `(${pubYear}, ${pubMonth})`;

        return `(${pubYear}, ${pubMonth} ${pubDay})`;
      },
      getFullAccessDate: (format) => {
        if(isNaN(accessDateObj)) return "(n.d.)";

        if (format === "APA"){
          const accessYear = accessDateObj.getFullYear();
          const accessMonth = accessDateObj.toLocaleString('default', { month: 'long' });
          const accessDay = accessDateObj.getDate();

          if (!accessMonth) return `Retrieved ${accessYear}, from`;
          if (!accessDay) return `Retrieved ${accessMonth}, ${accessYear}, from`;

          return `Retrieved ${accessMonth} ${accessDay}, ${accessYear}, from`;
        }
        if(format === "BibTeX"){
          const accessYear = accessDateObj.getFullYear();
          const accessMonth = String(accessDateObj.getMonth() + 1).padStart(2, '0');
          const accessDay = String(accessDateObj.getDate()).padStart(2, '0');

          if (!accessMonth) return `${accessYear}`;
          if (!accessDay) return `${accessYear}-${accessMonth}`;

          return `${accessYear}-${accessMonth}-${accessDay}`;
        };
      }
    };
  }

  exportAPA(){
    switch(this.citationType) {
      case "journal":
        return html`${this._formatAuthors()} ${this._formatDate().getPubYear()}. ${this.title}. <i>${this.publisher}</i>, ${this._formatSource().getJournalSource("APA")}. ${this.url}`;
      case "book":
        return html`${this._formatAuthors()} ${this._formatDate().getPubYear()}. <i>${this.title}</i> ${this._formatSource().getBookSource("APA")}. ${this.publisher}. ${this.url}`
      case "web":
      default:
        return html`${this._formatAuthors()} ${this._formatDate().getFullPubDate()}. <i>${this.title}</i>. ${this.publisher}. ${this.url}`
    }
  }

  exportBibtex(){    
    // Indent is set to 4 spaces for each field
    switch(this.citationType) {
      case "journal": {
        const bibtexObj = [
          `@article{${this.title.replaceAll(" ", "")},`,
          `    title = {${this.title}},`,
          `    author = {${this._formatAuthors()}},`,
          `    year = {${this._formatDate().getPubYear()}},`
        ];

        if(this.volume) bibtexObj.push(`   volume = {${this.volume}},`)
        if(this.issue) bibtexObj.push(`   number = {${this.issue}},`)
        if(this.startPage && this.endPage){
          bibtexObj.push(`    pages = {${this.startPage}--${this.endPage}},`)
        } else if(this.startPage){
          bibtexObj.push(`    pages = {${this.startPage}},`)
        }
        if(this.url) bibtexObj.push(`    doi = {${this.url}}`)
        
        bibtexObj.push(`}`);
        
        return html`<div style="white-space: pre-wrap;">${bibtexObj.join('\n').trim()}</div>`;
      }
      case "web":
      default: {
        const bibtexObj = [
          `@misc{${this.title.replaceAll(" ", "")},`,
          `    title = {${this.title}},`,
          `    author = {${this._formatAuthors()}},`,
          `    year = {${this._formatDate().getPubYear()}},`
        ];

        if(this.url) bibtexObj.push(`    howpublished = {\\url{${this.url}}},`)
        if(this.accessDate) bibtexObj.push(`    note = {Accessed: ${this.accessDate}}`);

        bibtexObj.push(`}`);

        return html`<div style="white-space: pre-wrap;">${bibtexObj.join('\n').trim()}</div>`
      }
    }
  }

  _copyToClipboard(){  
    const target = this.shadowRoot.querySelector(".citation");
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

  haxHooks() {
    return {
      setupActiveElementForm: "haxsetupActiveElementForm",
      inlineContextMenu: "haxinlineContextMenu",
    };
  }

  // Temporary icons to imply insert above vs below
  // TODO: Design SVG representing "<up-arrow> +" and "<down-arrow> +"
  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "communication:call-made",
        callback: "_addCitationAbove",
        label: "Add citation above",
      },
      {
        icon: "communication:call-received",
        callback: "_addCitationBelow",
        label: "Add citation below",
      }
    ];
  }

  _addCitationAbove(){
    this.dispatchEvent(new CustomEvent('add-citation', {
      detail: { direction: 'above', node: this },
      bubbles: true,
      composed: true
    }));
  }

  _addCitationBelow(){
    this.dispatchEvent(new CustomEvent('add-citation', {
      detail: { direction: 'below', node: this },
      bubbles: true,
      composed: true
    }));
  }

  haxsetupActiveElementForm(props) {
    // properties to toggle by type

    let configObj = [];

    switch(this.citationType) {
      case "book":
        configObj = [
          {
            property: 'url',
            title: 'URL',
            description: 'Link to the item',
            inputMethod: 'textfield',
          },
          {
            property: 'publicationDate',
            title: 'Publication Date',
            description: 'mm/dd/yyyy',
            inputMethod: 'datepicker',
          },
          {
            property: 'parentVer',
            title: 'Edition',
            description: 'Volume number',
            inputMethod: 'textfield',
          },
          {
            property: 'childVer',
            title: 'Volume',
            description: 'Issue number',
            inputMethod: 'textfield',
          },
          {
            property: 'startPage',
            title: 'Start Page',
            description: 'First page of publication',
            inputMethod: 'number',
          },
          {
            property: 'endPage',
            title: 'End Page',
            description: 'Final page of publication',
            inputMethod: 'number',
          }
        ]
        break;
      case "journal":
        configObj = [
          {
            property: 'url',
            title: 'DOI / URL (Optional)',
            description: 'Link to the item',
            inputMethod: 'textfield',
          },
          {
            property: 'publicationDate',
            title: 'Publication Date',
            description: 'mm/dd/yyyy',
            inputMethod: 'datepicker',
          },
          {
            property: 'volume',
            title: 'Volume',
            description: 'Volume number',
            inputMethod: 'textfield',
          },
          {
            property: 'issue',
            title: 'Issue',
            description: 'Issue number',
            inputMethod: 'textfield',
          },
          {
            property: 'startPage',
            title: 'Start Page',
            description: 'First page of publication',
            inputMethod: 'number',
          },
          {
            property: 'endPage',
            title: 'End Page',
            description: 'Final page of publication',
            inputMethod: 'number',
          }
        ]
        break;
      case "web":
      default:
        configObj = [
          {
            property: 'url',
            title: 'URL',
            description: 'Link to the item',
            inputMethod: 'textfield',
          },
          {
            property: 'publicationDate',
            title: 'Publication Date',
            description: 'mm/dd/yyyy',
            inputMethod: 'datepicker',
          }
        ]
        break;
    }

    props.settings.configure = [...CitationItem.haxProperties.settings.configure, ...configObj];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return {
      "api": "1",
      "canScale": true,
      "canEditSource": true,
      "type": "element",
      "designSystem": {
        "accent": true,
        "primary": true,
        "card": true,
        "text": true,
        "designTreatment": false
      },
      "gizmo": {
        "title": "citation-item",
        "description": "",
        "icon": "icons:android",
        "color": "purple",
        "tags": [
          "Other"
        ],
        "handles": [],
        "meta": {
          "hidden": true,
          "author": "winstonwumbo"
        }
      },
      "settings": {
        "configure": [
          {
            property: 'citationType',
            title: 'Type',
            description: 'Citation type',
            inputMethod: 'select',
            options: {
              web: 'Web',
              journal: 'Journal',
              book: 'Book'
            },
          },
          // Should we implement the tabs/fieldset menu for better organizing? List is getting a little long
          // look at HAXFIELDS and elements/simple-fields/demo/index.html:187 for implementation reference
          {
            property: "title",
            title: "Title",
            description: "Title of the item",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true
          },
          {
            property: "authors",
            title: "Author(s)",
            description: "The events in the timeline",
            inputMethod: "array",
            itemLabel: "surname",
            properties: [
              {
                property: "given",
                title: "Given Name",
                description: "The Given Name of Author.",
                inputMethod: "textfield",
              },
              {
                property: "surname",
                title: "Surname",
                description: "The Surname of Author.",
                inputMethod: "textfield",
              },
            ],
          },
          {
            property: 'publisher',
            title: 'Publisher',
            description: 'Original website',
            inputMethod: 'textfield',
          }
        ]
      },
      "saveOptions": {
        "wipeSlot": false,
        "unsetAttributes": []
      },
      "demoSchema": [
        {
          "tag": "citation-item",
          "properties": {
            "title": "Sample property title"
          },
          "content": ""
        }
      ]
    }
  };

}

globalThis.customElements.define(CitationItem.tag, CitationItem);