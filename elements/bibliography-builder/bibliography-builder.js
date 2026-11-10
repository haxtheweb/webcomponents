/**
 * Copyright 2026 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, render } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import "./lib/bibliography-item.js";

/**
 * `bibliography-builder`
 *
 * @demo index.html
 * @element bibliography-builder
 */
export class BibliographyBuilder extends SchemaBehaviors(
  DDDSuper(I18NMixin(LitElement)),
) {
  static get tag() {
    return "bibliography-builder";
  }

  constructor() {
    super();
    this.title = "";
    this.forCourse = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "References",
      export: "Export",
      exportCitations: "Export Citations",
      copy: "Copy",
      exportCitationFormat: "Export citation format",
      selectCitationFormatBelow: "Select a citation format below",
      addCitationToBibliography: "Add citation to bibliography",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/bibliography-builder.ar.json", import.meta.url)
          .href + "/../",
    });
    this.exportMode = "";
    // empty until a format is picked; render shows the translated prompt
    this.citationArr = [];

    this.addEventListener("add-citation", this._addItemHandler.bind(this));
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      exportMode: { type: String, attribute: "export-mode" },
      citationArr: { type: Array, attribute: "citation-array" },
      forCourse: { type: String, attribute: "for-course" },
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
          margin-block: var(--ddd-spacing-4);
        }
        :host([hidden]) {
          display: none;
        }
        .ddd-block-title {
          margin: var(--ddd-spacing-0);
        }
        /* items sit in the frame as rows split by hairlines */
        ::slotted(bibliography-item:not(:last-child)) {
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
      `,
    ];
  }

  /**
   * the header title: the authored title, only when it says something
   * other than the "References" label (no more "References: References")
   */
  _headerTitle() {
    const title = typeof this.title === "string" ? this.title.trim() : "";
    const label = String(this.t.title || "").trim();
    if (!title || title.toLowerCase() === label.toLowerCase()) {
      return "";
    }
    return title;
  }

  // Lit render the HTML
  render() {
    return html`<div
      class="wrapper ddd-block"
      typeof="oer:LearningComponent"
      role="group"
      aria-labelledby="hdr"
    >
      <meta property="oer:forCourse" content="${this.forCourse}" />
      ${renderDDDBlockHeader({
        id: "hdr",
        icon: "icons:list",
        label: this.t.title,
        title: this._headerTitle(),
        titleTag: "h3",
        actions: html`<button
          id="export-button"
          type="button"
          class="ddd-block-action has-text"
          aria-haspopup="dialog"
          @click=${this._showExportModal}
        >
          <simple-icon-lite icon="icons:file-download"></simple-icon-lite
          ><span>${this.t.export}</span>
        </button>`,
      })}
      <div class="ddd-block-body">
        <slot></slot>
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
      if (propName === "citationArr" && oldValue !== undefined) {
        this.renderExport();
      }
    });
  }

  _showExportModal(e) {
    this._modalContent =
      this._modalContent || globalThis.document.createElement("div");
    this.renderExport();

    this.dispatchEvent(
      new CustomEvent("simple-modal-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          title: this.t.exportCitations,
          elements: { content: this._modalContent },
          invokedBy: e.target,
        },
      }),
    );
  }

  // simple-modal is independent from our main lit lifecycle, so we do a custom render
  // the modal content lives in the light DOM, so every selector is scoped
  // under .bibliography-export
  renderExport() {
    render(
      html`
        <style>
          .bibliography-export {
            display: flex;
            flex-direction: column;
            gap: var(--ddd-spacing-3);
            font-family: var(--ddd-font-primary);
            color: light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
          }
          .bibliography-export .export-drop {
            display: flex;
            flex-direction: column;
            gap: var(--ddd-spacing-1);
          }
          .bibliography-export label {
            font-family: var(--ddd-font-navigation);
            font-size: var(--ddd-font-size-4xs);
            font-weight: var(--ddd-font-weight-medium);
            color: light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            );
          }
          .bibliography-export select {
            box-sizing: border-box;
            height: var(--ddd-control-height-sm);
            padding: 0 var(--ddd-spacing-3);
            border: var(--ddd-border-xs);
            border-color: light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
            border-radius: var(--ddd-radius-sm);
            background-color: light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-potentialMidnight)
            );
            color: light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
            font-family: var(--ddd-font-primary);
            font-size: var(--ddd-font-size-4xs);
            color-scheme: light dark;
          }
          .bibliography-export select:focus-visible,
          .bibliography-export .copy-button:focus-visible {
            outline: var(--ddd-focus-ring);
            outline-offset: var(--ddd-focus-offset);
          }
          .bibliography-export .citation-list {
            max-height: 40vh;
            overflow-y: auto;
            border: var(--ddd-border-xs);
            border-color: light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
            border-radius: var(--ddd-radius-sm);
            padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
            background-color: light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-potentialMidnight)
            );
            color: light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
            font-family: var(--ddd-font-navigation);
            font-size: var(--ddd-font-size-4xs);
            line-height: var(--ddd-lh-150);
            overflow-wrap: anywhere;
          }
          .bibliography-export .citation-entry + .citation-entry {
            margin-top: var(--ddd-spacing-3);
          }
          .bibliography-export .control-bar {
            display: flex;
            justify-content: flex-end;
          }
          .bibliography-export .copy-button {
            display: inline-flex;
            align-items: center;
            gap: var(--ddd-spacing-1);
            box-sizing: border-box;
            height: var(--ddd-control-height-sm);
            margin: var(--ddd-spacing-0);
            padding: 0 var(--ddd-spacing-3);
            border: var(--ddd-border-xs);
            border-color: light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
            border-radius: var(--ddd-radius-rounded);
            background-color: var(--ddd-theme-default-potential0);
            color: light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            );
            font-family: var(--ddd-font-navigation);
            font-size: var(--ddd-font-size-4xs);
            cursor: pointer;
            --simple-icon-color: currentColor;
            --simple-icon-width: var(--ddd-icon-3xs);
            --simple-icon-height: var(--ddd-icon-3xs);
          }
          .bibliography-export .copy-button:hover {
            border-color: light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            );
          }
        </style>
        <div class="bibliography-export">
          <div class="export-drop">
            <label for="export-dropdown">${this.t.exportCitationFormat}</label>
            <select id="export-dropdown" @change=${this._exportHandler}>
              <option value="Export">${this.t.export}</option>
              <!-- i18n-ignore: citation format names -->
              <option value="APA">APA</option>
              <!-- i18n-ignore: citation format names -->
              <option value="BibTeX">BibTeX</option>
            </select>
          </div>
          <div
            class="citation-list"
            role="region"
            aria-label="${this.t.title}"
            tabindex="0"
          >
            ${(this.citationArr.length
              ? this.citationArr
              : [this.t.selectCitationFormatBelow]
            ).map(
              (citation) => html`<div class="citation-entry">${citation}</div>`,
            )}
          </div>
          <div class="control-bar">
            <button
              type="button"
              class="copy-button"
              part="icon"
              @click=${this._copyToClipboard}
            >
              <simple-icon-lite icon="icons:content-copy"></simple-icon-lite
              ><span>${this.t.copy}</span>
            </button>
          </div>
        </div>
      `,
      this._modalContent,
      { host: this },
    );
  }

  _exportHandler(e) {
    this.exportMode = e.target.value;
    const slot = this.shadowRoot.querySelector("slot").assignedElements();

    if (this.exportMode === "APA") {
      this.citationArr = slot.map((item) => item.exportAPA());
    } else if (this.exportMode === "BibTeX") {
      this.citationArr = slot.map((item) => item.exportBibtex());
    } else {
      this.citationArr = [];
    }
  }

  _copyToClipboard() {
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

  _addItemHandler(e) {
    const item = globalThis.document.createElement("bibliography-item");

    const attrs = {
      "data-hax-layout": true,
      "data-hax-ray": "bibliography-item",
    };

    for (const name in attrs) {
      item.setAttribute(name, attrs[name]);
    }

    if (e.detail.direction === "above") {
      // add above current citation
      e.detail.node.before(item);
    } else if (e.detail.direction === "below") {
      // add below current citation
      e.detail.node.after(item);
    } else {
      // add at the end of the citation list
      this.appendChild(item);
    }
  }

  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
      inlineContextMenu: "haxinlineContextMenu",
    };
  }

  /**
   * @see haxHooks: gizmoRegistration
   * Register haxProperties locales so the HAX editor UI can be translated
   */
  haxgizmoRegistration(_store) {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `bibliography-builder.haxProperties`,
          localesPath: new URL(`./locales`, import.meta.url).href,
        },
      }),
    );
  }

  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:add",
        callback: "_addItemHandler",
        label: this.t.addCitationToBibliography,
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

globalThis.customElements.define(BibliographyBuilder.tag, BibliographyBuilder);
