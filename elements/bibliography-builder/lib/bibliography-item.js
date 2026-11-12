/**
 * Copyright 2026 The Pennsylvania State University
 * Copyright 2026 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { DDDBlockStyles } from "@haxtheweb/d-d-d/lib/DDDBlock.js";

/**
 * `bibliography-item`
 *
 * @demo index.html
 * @element bibliography-item
 */
export class BibliographyItem extends SchemaBehaviors(
  DDDSuper(I18NMixin(LitElement)),
) {
  static get tag() {
    return "bibliography-item";
  }

  constructor() {
    super();
    this.title = "HAX The Web";
    this.authors = [{ given: "John", surname: "Doe" }];
    this.publicationDate = "";
    this.accessDate = "";
    this.citationType = "web";

    this.publisher = "HAX PSU";
    this.url = "";
    this.startPage = "";
    this.endPage = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      copy: "Copy",
      addCitationAbove: "Add citation above",
      addCitationBelow: "Add citation below",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
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
      volume: { type: String, attribute: "volume" },
      issue: { type: String, attribute: "issue" },
      startPage: { type: String, attribute: "start-page" },
      endPage: { type: String, attribute: "end-page" },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-primary);
        }
        :host([hidden]) {
          display: none;
        }
        :host([data-hax-active]) .wrapper {
          outline: var(
            --hax-body-active-outline,
            1px solid var(--hax-ui-color-focus, #000)
          );
        }
        .wrapper {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
        }
        .italic-section {
          display: inline;
          font-style: italic;
        }
        /* APA hanging indent */
        .citation {
          flex: 1 1 auto;
          min-width: 0;
          padding-inline-start: var(--ddd-spacing-6);
          text-indent: calc(-1 * var(--ddd-spacing-6));
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          overflow-wrap: anywhere;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html` <div class="wrapper" typeof="oer:ReferencedMaterial">
      <meta property="oer:uri" content="${this.url}" />
      <div class="citation">${this.exportAPA()}</div>
      <button
        type="button"
        class="copy-button ddd-block-action"
        part="icon"
        aria-label="${this.t.copy}"
        title="${this.t.copy}"
        @click=${this._copyToClipboard}
      >
        <simple-icon-lite icon="icons:content-copy"></simple-icon-lite>
      </button>
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
        globalThis.HaxStore.instance.refreshActiveNodeForm();
      }
    });
  }

  _formatAuthors() {
    if (!Array.isArray(this.authors) || this.authors.length === 0) return "";

    // author.given author.surname
    const formattedArr = this.authors
      .map((author) => {
        const authorObj = author && typeof author === "object" ? author : {};
        const surname =
          typeof authorObj.surname === "string" ? authorObj.surname.trim() : "";
        const given =
          typeof authorObj.given === "string" ? authorObj.given.trim() : "";
        const givenInitials = given
          .split(/\s+/)
          .filter((part) => part)
          .map((part) => `${part.charAt(0).toUpperCase()}.`)
          .join(" ");

        if (surname && givenInitials) return `${surname}, ${givenInitials}`;
        if (surname) return surname;
        if (givenInitials) return givenInitials;
        return "";
      })
      .filter((author) => author);

    if (formattedArr.length === 0) return "";
    if (formattedArr.length === 1) return formattedArr[0];

    const last = formattedArr.pop();
    return formattedArr.join(", ") + ", & " + last;
  }

  _formatSource() {
    return {
      getJournalSource: (format) => {
        if (format === "APA") {
          // the journal form edits volume / issue; older items saved the
          // same numbers as parent-ver / child-ver, so fall back to those
          const volume = this._firstValue(this.volume, this.parentVer);
          const issue = this._firstValue(this.issue, this.childVer);
          // Issue num only applies if there's a volume num
          const volumeDetails = volume
            ? html`<i>${volume}</i>${issue ? html`(${issue})` : ""}`
            : "";

          // End page only applies if there's a start page
          const pageRange = this.startPage
            ? html`${this.startPage}${this.endPage ? ` - ${this.endPage}` : ""}`
            : "";

          if (!volumeDetails && !pageRange) return "";
          if (!pageRange) return html`${volumeDetails}`;
          if (!volumeDetails) return html`${pageRange}`;

          return html`${volumeDetails}, ${pageRange}`;
        }
      },
      getBookSource: (format) => {
        if (format === "APA") {
          // (#th ed., Vol. #, pp. #-#), leaving out the parts that are
          // empty so a book without them never prints "(, pp. )"
          const edition = this._firstValue(this.parentVer);
          const volume = this._firstValue(this.childVer);
          const parts = [];
          if (edition) parts.push(`${edition} ed.`);
          if (volume) parts.push(`Vol. ${volume}`);
          // End page only applies if there's a start page
          if (this._firstValue(this.startPage)) {
            parts.push(
              `pp. ${this.startPage}${this.endPage ? ` - ${this.endPage}` : ""}`,
            );
          }
          if (parts.length === 0) return "";
          return html`(${parts.join(", ")})`;
        }
      },
    };
  }

  /**
   * first value that is set (not undefined, null, NaN or blank)
   * @returns {String} the value as a string, or "" when none is set
   */
  _firstValue(...values) {
    for (const value of values) {
      if (value === undefined || value === null) continue;
      if (typeof value === "number" && isNaN(value)) continue;
      const str = String(value).trim();
      if (str !== "") return str;
    }
    return "";
  }

  /**
   * Parse a date value for formatting. ISO date-only strings (e.g.
   * 2020-03-07) are parsed as UTC midnight by the platform, which shifts
   * back a day in timezones behind UTC when read back with local methods,
   * so build them as local calendar dates instead.
   */
  _parseDate(value) {
    if (typeof value === "string") {
      const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
      if (dateOnly) {
        return new Date(
          Number(dateOnly[1]),
          Number(dateOnly[2]) - 1,
          Number(dateOnly[3]),
        );
      }
    }
    return new Date(value);
  }

  _formatDate() {
    const pubDateObj = this._parseDate(this.publicationDate);
    const accessDateObj = this._parseDate(this.accessDate);

    return {
      // The same between APA and BibTeX
      getPubYear: () => {
        if (isNaN(pubDateObj)) return "(n.d.)";

        return pubDateObj.getFullYear();
      },
      getFullPubDate: () => {
        if (isNaN(pubDateObj)) return "(n.d.)";

        const pubYear = pubDateObj.getFullYear();
        const pubMonth = pubDateObj.toLocaleString("default", {
          month: "long",
        });
        const pubDay = pubDateObj.getDate();

        if (!pubMonth) return `(${pubYear})`;
        if (!pubDay) return `(${pubYear}, ${pubMonth})`;

        return `(${pubYear}, ${pubMonth} ${pubDay})`;
      },
      getFullAccessDate: (format) => {
        if (isNaN(accessDateObj)) return "(n.d.)";

        if (format === "APA") {
          const accessYear = accessDateObj.getFullYear();
          const accessMonth = accessDateObj.toLocaleString("default", {
            month: "long",
          });
          const accessDay = accessDateObj.getDate();

          if (!accessMonth) return `Retrieved ${accessYear}, from`;
          if (!accessDay)
            return `Retrieved ${accessMonth}, ${accessYear}, from`;

          return `Retrieved ${accessMonth} ${accessDay}, ${accessYear}, from`;
        }
        if (format === "BibTeX") {
          const accessYear = accessDateObj.getFullYear();
          const accessMonth = String(accessDateObj.getMonth() + 1).padStart(
            2,
            "0",
          );
          const accessDay = String(accessDateObj.getDate()).padStart(2, "0");

          if (!accessMonth) return `${accessYear}`;
          if (!accessDay) return `${accessYear}-${accessMonth}`;

          return `${accessYear}-${accessMonth}-${accessDay}`;
        }
      },
    };
  }

  exportAPA() {
    // the template whitespace below is part of the citation text, which is copied verbatim,
    // so each return keeps prettier-ignore
    switch (this.citationType) {
      case "journal": {
        const journalSource = this._formatSource().getJournalSource("APA");
        // prettier-ignore
        return html`${this._formatAuthors()} ${this._formatDate().getPubYear()}. <span property="oer:name">${this.title}</span>. <i>${this.publisher}</i>${journalSource ? html`, ${journalSource}` : ""}. ${this.url}`;
      }
      case "book": {
        const bookSource = this._formatSource().getBookSource("APA");
        // prettier-ignore
        return html`${this._formatAuthors()} ${this._formatDate().getPubYear()}. <i property="oer:name">${this.title}</i>${bookSource ? html` ${bookSource}` : ""}. ${this.publisher}. ${this.url}`;
      }
      case "web":
      default:
        // prettier-ignore
        return html`${this._formatAuthors()} ${this._formatDate().getFullPubDate()}. <i property="oer:name">${this.title}</i>. ${this.publisher}. ${this.url}`;
    }
  }

  exportBibtex() {
    // Indent is set to 4 spaces for each field
    switch (this.citationType) {
      case "journal": {
        const bibtexObj = [
          `@article{${this.title.replaceAll(" ", "")},`,
          `    title = {${this.title}},`,
          `    author = {${this._formatAuthors()}},`,
          `    year = {${this._formatDate().getPubYear()}},`,
        ];

        // same volume / issue fallback as the APA journal format
        const volume = this._firstValue(this.volume, this.parentVer);
        const issue = this._firstValue(this.issue, this.childVer);
        if (volume) bibtexObj.push(`    volume = {${volume}},`);
        if (issue) bibtexObj.push(`    number = {${issue}},`);
        if (this.startPage && this.endPage) {
          bibtexObj.push(`    pages = {${this.startPage}--${this.endPage}},`);
        } else if (this.startPage) {
          bibtexObj.push(`    pages = {${this.startPage}},`);
        }
        if (this.url) bibtexObj.push(`    doi = {${this.url}}`);

        bibtexObj.push(`}`);

        return html`<div style="white-space: pre-wrap;">
          ${bibtexObj.join("\n").trim()}
        </div>`;
      }
      case "web":
      default: {
        const bibtexObj = [
          `@misc{${this.title.replaceAll(" ", "")},`,
          `    title = {${this.title}},`,
          `    author = {${this._formatAuthors()}},`,
          `    year = {${this._formatDate().getPubYear()}},`,
        ];

        if (this.url)
          bibtexObj.push(`    howpublished = {\\url{${this.url}}},`);
        if (this.accessDate)
          bibtexObj.push(`    note = {Accessed: ${this.accessDate}}`);

        bibtexObj.push(`}`);

        return html`<div style="white-space: pre-wrap;">
          ${bibtexObj.join("\n").trim()}
        </div>`;
      }
    }
  }

  _copyToClipboard() {
    const target = this.shadowRoot.querySelector(".citation");
    const htmlContent = target.innerHTML;
    // collapse template whitespace so the copied text is one clean line
    const plainContent = target.textContent.replace(/\s+/g, " ").trim();

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

    // rich (html + text) copy needs ClipboardItem, which is missing or restricted in
    // some browsers and contexts; fall back to plain text and never throw
    /* eslint-disable baseline-js/use-baseline -- ClipboardItem is feature checked; plain-text fallback below */
    const clip = globalThis.navigator && globalThis.navigator.clipboard;
    if (clip && globalThis.ClipboardItem && clip.write) {
      const data = [
        new ClipboardItem({
          "text/html": blobHtml,
          "text/plain": blobText, // Fallback
        }),
      ];
      clip
        .write(data)
        .catch(
          () => clip.writeText && clip.writeText(plainContent).catch(() => {}),
        );
    } else if (clip && clip.writeText) {
      clip.writeText(plainContent).catch(() => {});
    }
    /* eslint-enable baseline-js/use-baseline */
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
        callback: "_addItemAbove",
        label: this.t.addCitationAbove,
      },
      {
        icon: "communication:call-received",
        callback: "_addItemBelow",
        label: this.t.addCitationBelow,
      },
    ];
  }

  _addItemAbove() {
    this.dispatchEvent(
      new CustomEvent("add-citation", {
        detail: { direction: "above", node: this },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _addItemBelow() {
    this.dispatchEvent(
      new CustomEvent("add-citation", {
        detail: { direction: "below", node: this },
        bubbles: true,
        composed: true,
      }),
    );
  }

  haxsetupActiveElementForm(props) {
    // properties to toggle by type

    let configObj = [];

    switch (this.citationType) {
      case "book":
        configObj = [
          {
            property: "url",
            title: "URL",
            description: "Link to the item",
            inputMethod: "textfield",
          },
          {
            property: "publicationDate",
            title: "Publication Date",
            description: "mm/dd/yyyy",
            inputMethod: "datepicker",
          },
          {
            property: "parentVer",
            title: "Edition",
            description: "Volume number",
            inputMethod: "textfield",
          },
          {
            property: "childVer",
            title: "Volume",
            description: "Issue number",
            inputMethod: "textfield",
          },
          {
            property: "startPage",
            title: "Start Page",
            description: "First page of publication",
            inputMethod: "number",
          },
          {
            property: "endPage",
            title: "End Page",
            description: "Final page of publication",
            inputMethod: "number",
          },
        ];
        break;
      case "journal":
        configObj = [
          {
            property: "url",
            title: "DOI / URL (Optional)",
            description: "Link to the item",
            inputMethod: "textfield",
          },
          {
            property: "publicationDate",
            title: "Publication Date",
            description: "mm/dd/yyyy",
            inputMethod: "datepicker",
          },
          {
            property: "volume",
            title: "Volume",
            description: "Volume number",
            inputMethod: "textfield",
          },
          {
            property: "issue",
            title: "Issue",
            description: "Issue number",
            inputMethod: "textfield",
          },
          {
            property: "startPage",
            title: "Start Page",
            description: "First page of publication",
            inputMethod: "number",
          },
          {
            property: "endPage",
            title: "End Page",
            description: "Final page of publication",
            inputMethod: "number",
          },
        ];
        break;
      case "web":
      default:
        configObj = [
          {
            property: "url",
            title: "URL",
            description: "Link to the item",
            inputMethod: "textfield",
          },
          {
            property: "publicationDate",
            title: "Publication Date",
            description: "mm/dd/yyyy",
            inputMethod: "datepicker",
          },
        ];
        break;
    }

    props.settings.configure = [
      ...BibliographyItem.haxProperties.settings.configure,
      ...configObj,
    ];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return {
      api: "1",
      canScale: true,
      canEditSource: true,
      type: "element",
      designSystem: false,
      gizmo: {
        title: "Bibliography item",
        description:
          "Item representing a single citation in a bibliography, supporting multiple formats and export options.",
        icon: "icons:android",
        color: "purple",
        tags: ["Content", "portfolio", "citation", "reference", "bibliography"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "citationType",
            title: "Type",
            description: "Citation type",
            inputMethod: "select",
            options: {
              web: "Web",
              journal: "Journal",
              book: "Book",
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
            required: true,
          },
          {
            property: "authors",
            title: "Author(s)",
            description: "People who wrote the item",
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
            property: "publisher",
            title: "Publisher",
            description: "Original website",
            inputMethod: "textfield",
          },
        ],
      },
      saveOptions: {
        wipeSlot: false,
        unsetAttributes: [],
      },
      demoSchema: [
        {
          tag: "bibliography-item",
          properties: {
            title: "Sample property title",
          },
          content: "",
        },
      ],
    };
  }
}

globalThis.customElements.define(BibliographyItem.tag, BibliographyItem);
