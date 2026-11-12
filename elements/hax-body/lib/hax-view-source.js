import { LitElement, html, css, adoptStyles } from "lit";
import { stripMSWord, formatHTML } from "@haxtheweb/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import "./hax-toolbar.js";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { autorun, toJS } from "mobx";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu-item.js";
import "./hax-tray-button.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { trimLineEdges } from "@haxtheweb/utils/lib/safe-html.js";
import {
  htmlToMarkdown,
  markdownToHTML,
  restoreManagedAttributes,
} from "@haxtheweb/utils/lib/markdown.js";
import { sanitizeHTMLString } from "@haxtheweb/utils/lib/sanitize.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminScheme,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";

// remembered per browser so Source opens in the format last used
const FORMAT_KEY = "hax-view-source-format";
// same width the tool row turns icon-only at
const NARROW = "(max-width: 800px)";
// marked options: headings keep the ids HAX gives them, emails stay readable
const MARKED_OPTIONS = { headerIds: false, mangle: false };
// The live preview pane renders in the page document so content styles reach
// it; these rules are scoped to its class and use the HAX UI tokens, which
// are defined on body
const PREVIEW_STYLES = `
.hax-md-preview {
  position: fixed;
  z-index: 1000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color-scheme: var(--hax-ui-color-scheme, light);
  background-color: var(--hax-ui-surface, var(--hax-ui-background-color));
  color: var(--hax-ui-text, var(--hax-ui-color));
  border-inline-start: 1px solid var(--hax-ui-line-strong);
}
.hax-md-preview[narrow] {
  border-inline-start: 0;
}
.hax-md-preview[hidden] {
  display: none;
}
.hax-md-preview-hd {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: var(--hax-ui-gap-md, 8px);
  box-sizing: border-box;
  height: var(--hax-ui-titlebar-height, 48px);
  padding: 0 var(--hax-ui-gap-lg, 12px);
  border-bottom: 1px solid var(--hax-ui-line);
  font-family: var(--hax-ui-font-family);
  font-size: var(--hax-ui-admin-font-size, 14px);
  --simple-icon-height: 16px;
  --simple-icon-width: 16px;
}
.hax-md-preview[narrow] .hax-md-preview-hd {
  height: var(--ddd-spacing-9, 36px);
  gap: var(--hax-ui-gap, 4px);
}
.hax-md-preview-note {
  margin-inline-start: auto;
  color: var(--hax-ui-text-muted);
  font-size: var(--hax-ui-admin-font-size-xs, 12px);
}
.hax-md-preview[narrow] .hax-md-preview-note {
  margin-inline-start: 0;
}
.hax-md-preview-bd {
  flex: 1 1 auto;
  overflow: auto;
  padding: var(--hax-ui-gap-lg, 12px) var(--hax-ui-gap-lg, 12px)
    var(--ddd-spacing-12, 48px);
}
.hax-md-preview-col {
  display: flex;
  flex-direction: column;
  gap: var(--hax-ui-gap-md, 8px);
}
.hax-md-block {
  position: relative;
  padding: var(--hax-ui-gap, 4px) var(--hax-ui-gap-md, 8px);
  border: 1px dashed var(--hax-ui-line-strong);
  border-radius: var(--hax-ui-radius, 4px);
}
.hax-md-block[from-html] {
  border: 2px solid var(--hax-ui-accent-strong);
}
.hax-md-block > :nth-child(2) {
  margin-top: 0;
}
.hax-md-block > :last-child {
  margin-bottom: 0;
}
.hax-md-label {
  position: absolute;
  z-index: 1;
  top: calc(-1 * var(--hax-ui-gap-md, 8px));
  right: var(--hax-ui-gap, 4px);
  padding: 0 var(--hax-ui-gap, 4px);
  border: 1px solid var(--hax-ui-line-strong);
  border-radius: var(--hax-ui-radius, 4px);
  background-color: var(--hax-ui-surface, var(--hax-ui-background-color));
  color: var(--hax-ui-text-muted);
  font-family: var(--hax-ui-font-family);
  font-size: var(--hax-ui-admin-font-size-xs, 12px);
  line-height: 1.3;
}
.hax-md-block[from-html] .hax-md-label {
  border-color: var(--hax-ui-accent-strong);
  background-color: var(--hax-ui-accent-strong);
  color: var(--hax-ui-on-accent);
}
`;

/**
 * `hax-eview-source`
 * @element hax-eview-source
 * `Export dialog with all export options and settings provided.`
 */
class HaxViewSource extends I18NMixin(LitElement) {
  static get styles() {
    return [
      ...HaxComponentStyles,
      css`
        :host {
          display: block;
          height: calc(100vh - 120px);
        }
        #wrapper {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          position: relative;
          flex: 1 1 100%;
        }
        #spacer {
          flex: 1 1 100%;
          z-index: -1;
        }
        #textarea {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: 0;
          padding: 0;
          height: calc(100vh - 200px);
        }
        /* HAX UI tool row: labeled 32px buttons in their usual order,
           Update HTML as the one primary, Copy HTML (changes nothing) last
           and quiet */
        hax-toolbar {
          flex: 0 0 auto;
          background-color: var(
            --hax-ui-surface,
            var(--hax-ui-background-color)
          );
          border-bottom: 1px solid
            var(--hax-ui-line, var(--hax-ui-border-color));
        }
        hax-toolbar::part(buttons) {
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
          gap: var(--hax-ui-gap, 4px);
          margin: 0;
          padding: calc(var(--hax-ui-gap, 4px) / 2) var(--hax-ui-gap-lg, 12px);
        }
        hax-tray-button {
          flex: 0 0 auto;
          --simple-toolbar-button-height: var(--hax-ui-icon, 16px);
          --simple-toolbar-button-width: var(--hax-ui-icon, 16px);
        }
        hax-tray-button.copycontent {
          margin-inline-start: auto;
        }
        hax-tray-button::part(button) {
          box-sizing: border-box;
          height: var(--hax-ui-row-height, 32px);
          gap: var(--hax-ui-gap-md, 8px);
          padding: 0 var(--hax-ui-gap-lg, 12px);
          border: 1px solid
            var(--hax-ui-line-strong, var(--hax-ui-border-color));
          border-radius: var(--hax-ui-radius, 4px);
          background-color: var(
            --hax-ui-surface,
            var(--hax-ui-background-color)
          );
          color: var(--hax-ui-text, var(--hax-ui-color));
          font-size: var(--hax-ui-admin-font-size, 14px);
          text-transform: none;
        }
        hax-tray-button::part(label) {
          margin: 0;
        }
        /* HAX UI capitalizes labeled buttons; these read as written
           ("Update from Markdown") */
        hax-tray-button[show-text-label]::part(label) {
          text-transform: none;
        }
        hax-tray-button:hover::part(button),
        hax-tray-button:focus-within::part(button) {
          background-color: var(
            --hax-ui-hover,
            var(--hax-ui-background-color-secondary)
          );
        }
        hax-tray-button.updatecontent::part(button) {
          border-color: var(--hax-ui-primary);
          background-color: var(--hax-ui-primary);
          color: var(--hax-ui-on-primary);
          font-weight: 700;
        }
        hax-tray-button.updatecontent:hover::part(button),
        hax-tray-button.updatecontent:focus-within::part(button) {
          border-color: var(--hax-ui-primary-hover);
          background-color: var(--hax-ui-primary-hover);
        }
        hax-tray-button.copycontent::part(button) {
          border-color: transparent;
          background-color: transparent;
        }
        simple-toolbar-menu {
          --simple-toolbar-button-border-color: var(--hax-ui-border-color);
        }
        /* Markdown help sits just before Copy, which keeps the far end */
        hax-tray-button.mdhelp[toggled]::part(button) {
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-selected);
        }
        /* phone: Write / Preview, labeled even when the row is icon-only */
        .md-view {
          display: inline-flex;
          flex: 0 0 auto;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
          overflow: hidden;
        }
        .md-view button {
          box-sizing: border-box;
          height: calc(var(--hax-ui-row-height, 32px) - 2px);
          padding: 0 var(--hax-ui-gap-md, 8px);
          border: 0;
          background-color: transparent;
          color: var(--hax-ui-text, var(--hax-ui-color));
          font-family: var(--hax-ui-font-family);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          cursor: pointer;
        }
        .md-view button + button {
          border-inline-start: 1px solid var(--hax-ui-line-strong);
        }
        .md-view button[aria-pressed="true"] {
          background-color: var(--hax-ui-primary);
          color: var(--hax-ui-on-primary);
          font-weight: 700;
        }
        .md-view button:focus-visible,
        #mdhelp button:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        /* Markdown help: popover under its button, a sheet over the
           editor on a phone */
        #mdhelp {
          position: absolute;
          z-index: 2;
          top: var(--hax-ui-gap, 4px);
          left: 180px;
          width: min(400px, calc(100% - 2 * var(--hax-ui-gap-lg, 12px)));
          max-height: calc(100vh - 220px);
          overflow: auto;
          box-sizing: border-box;
          padding: var(--hax-ui-gap-md, 8px) var(--hax-ui-gap-lg, 12px)
            var(--hax-ui-gap-lg, 12px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg, 8px);
          background-color: var(
            --hax-ui-surface,
            var(--hax-ui-background-color)
          );
          color: var(--hax-ui-text, var(--hax-ui-color));
          box-shadow: var(--hax-ui-shadow-popover);
          font-family: var(--hax-ui-font-family);
        }
        #mdhelp .help-hd {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: var(--hax-ui-gap-md, 8px);
          border-bottom: 1px solid var(--hax-ui-line);
          font-size: var(--hax-ui-font-size, 16px);
          font-weight: 700;
        }
        #mdhelp .help-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--hax-ui-row-height, 32px);
          height: var(--hax-ui-row-height, 32px);
          padding: 0;
          border: 0;
          border-radius: var(--hax-ui-radius, 4px);
          background-color: transparent;
          color: inherit;
          cursor: pointer;
        }
        #mdhelp .help-close:hover {
          background-color: var(--hax-ui-hover);
        }
        #mdhelp table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }
        #mdhelp th {
          padding: var(--hax-ui-gap-md, 8px) var(--hax-ui-gap, 4px)
            var(--hax-ui-gap, 4px);
          color: var(--hax-ui-text-muted);
          font-weight: 700;
          text-align: start;
          text-transform: uppercase;
        }
        #mdhelp td {
          padding: var(--hax-ui-gap, 4px);
          border-top: 1px solid var(--hax-ui-line);
          vertical-align: top;
        }
        #mdhelp td:first-child {
          width: 52%;
        }
        #mdhelp code {
          font-family: var(--ddd-font-mono, monospace);
          color: var(--hax-ui-accent-strong);
          word-break: break-word;
        }
        #mdhelp .help-ft {
          margin: var(--hax-ui-gap-md, 8px) 0 0;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }
        /** This is mobile layout for controls */
        @media screen and (max-width: 800px) {
          #mdhelp {
            top: 0;
            left: 0;
            width: 100%;
            max-height: calc(100vh - 160px);
            border: 0;
            border-radius: 0;
            box-shadow: none;
          }
          #mdhelp thead {
            display: none;
          }
          #mdhelp tr {
            display: block;
            padding: var(--hax-ui-gap, 4px) 0;
            border-top: 1px solid var(--hax-ui-line);
          }
          #mdhelp td,
          #mdhelp td:first-child {
            display: block;
            width: auto;
            padding: 0 var(--hax-ui-gap, 4px);
            border-top: 0;
          }
          /* icon-only on a phone; the label stays the accessible name */
          hax-tray-button::part(label) {
            display: none;
          }
          hax-tray-button::part(button) {
            width: var(--hax-ui-row-height, 32px);
            padding: 0;
            justify-content: center;
          }
        }
      `,
    ];
  }
  render() {
    return html`${
      this.hidden
        ? ``
        : html` <hax-toolbar always-expanded>
              ${this.isMarkdown ? this.markdownTools : this.htmlTools}
            </hax-toolbar>
            <div id="wrapper">
              <div id="spacer"></div>
              <textarea id="hiddentextarea" hidden></textarea>
              ${this.isMarkdown && this.helpOpen ? this.helpTemplate : ""}
              <code-editor
                id="textarea"
                theme="${
                  this.haxUiTheme == "hax"
                    ? "vs"
                    : this.haxUiTheme == "haxdark"
                      ? "vs-dark"
                      : "auto"
                }"
                language="${this.isMarkdown ? "markdown" : "html"}"
                font-size="13"
                word-wrap
                @value-changed="${this._sourceChanged}"
              ></code-editor>
            </div>`
    } `;
  }
  get htmlTools() {
    return html`<hax-tray-button
        label="${this.t.updateHTML}"
        icon="hax:admin-check"
        @click="${this.updateBodyFromHTML}"
        icon-position="left"
        show-text-label
        class="updatecontent"
      >
      </hax-tray-button>
      <hax-tray-button
        @click="${this.scrubContent}"
        icon="hax:admin-clear-format"
        label="${this.t.cleanFormatting}"
        icon-position="left"
        show-text-label
      >
      </hax-tray-button>
      ${
        MicroFrontendRegistry.has("@core/prettyHtml")
          ? html`
              <hax-tray-button
                label="${this.t.prettifyHtml}"
                icon="hax:admin-prettify"
                @click="${this.prettifyContent}"
                icon-position="left"
                show-text-label
              >
              </hax-tray-button>
            `
          : html``
      }
      <hax-tray-button
        @click="${this.selectBody}"
        icon="hax:admin-copy"
        label="${this.t.copyHTML}"
        icon-position="left"
        show-text-label
        class="copycontent"
      >
      </hax-tray-button>`;
  }
  get markdownTools() {
    return html`<hax-tray-button
        label="${this.t.updateMarkdown}"
        icon="hax:admin-check"
        @click="${this.updateBodyFromMarkdown}"
        icon-position="left"
        show-text-label
        class="updatecontent"
      >
      </hax-tray-button>
      ${
        this.narrow
          ? html`<div
              class="md-view"
              role="group"
              aria-label="${this.t.markdownView}"
            >
              <button
                type="button"
                aria-pressed="${this.markdownView !== "preview"}"
                @click="${() => this._setMarkdownView("write")}"
              >
                ${this.t.write}
              </button>
              <button
                type="button"
                aria-pressed="${this.markdownView === "preview"}"
                @click="${() => this._setMarkdownView("preview")}"
              >
                ${this.t.preview}
              </button>
            </div>`
          : ""
      }
      <hax-tray-button
        id="mdhelpbutton"
        class="mdhelp"
        label="${this.t.markdownHelp}"
        icon="icons:help-outline"
        @click="${this.toggleHelp}"
        icon-position="left"
        show-text-label
        toggles
        ?toggled="${this.helpOpen}"
      >
      </hax-tray-button>
      <hax-tray-button
        @click="${this.selectBody}"
        icon="hax:admin-copy"
        label="${this.t.copyMarkdown}"
        icon-position="left"
        show-text-label
        class="copycontent"
      >
      </hax-tray-button>`;
  }
  get helpTemplate() {
    const rows = [
      ["## Heading", this.t.mdHeading],
      ["**bold** and *italic*", this.t.mdBoldItalic],
      ["[link text](https://…)", this.t.mdLink],
      ["- item", this.t.mdBulleted],
      ["1. item", this.t.mdNumbered],
      ["> quote", this.t.mdQuote],
      ["`code`", this.t.mdInlineCode],
      ["---", this.t.mdDivider],
      ["| a | b |", this.t.mdTable],
      ['<stop-note title="…">…</stop-note>', this.t.mdAnyBlock],
    ];
    return html`<div
      id="mdhelp"
      role="dialog"
      aria-labelledby="mdhelptitle"
      @keydown="${this._helpKeydown}"
    >
      <div class="help-hd">
        <span id="mdhelptitle">${this.t.markdownHelp}</span>
        <button
          type="button"
          class="help-close"
          aria-label="${this.t.close}"
          @click="${this.closeHelp}"
        >
          <simple-icon-lite icon="hax:admin-close"></simple-icon-lite>
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th scope="col">${this.t.mdType}</th>
            <th scope="col">${this.t.mdMakes}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(
            (r) =>
              html`<tr>
                <td><code>${r[0]}</code></td>
                <td>${r[1]}</td>
              </tr>`,
          )}
        </tbody>
      </table>
      <p class="help-ft">${this.t.mdHelpFooter}</p>
    </div>`;
  }
  static get tag() {
    return "hax-view-source";
  }
  // ability to refresh source view; possible something else in the system updated it
  // after we loaded
  refreshHTMLEditor(_e) {
    this.updateEditor();
  }
  /**
   * Import content into body area.
   */
  async updateBodyFromHTML(_e, html) {
    // import contents of this text area into the activeHaxBody
    const htmlBody = await this._withPageBreak(
      typeof html === "string"
        ? html
        : this.shadowRoot.querySelector("#textarea").value || "",
    );
    HAXStore.activeHaxBody.importContent(htmlBody);
    HAXStore.haxTray.trayDetail = "";
  }
  /**
   * The page-break that opens a HAXcms page carries its settings; content
   * imported without it would drop them, so put the current one back on top.
   */
  async _withPageBreak(htmlBody) {
    let children =
      HAXStore.activeHaxBody.shadowRoot.querySelector("#body").localName ===
      "slot"
        ? HAXStore.activeHaxBody.shadowRoot
            .querySelector("#body")
            .assignedNodes({
              flatten: true,
            })
        : [];
    // we have children and we don't have a page break, so we need to
    // inject the current one at the top of what's being imported
    // or else they'll brick the resulting transaction
    if (
      children.length > 0 &&
      children[0].tagName === "PAGE-BREAK" &&
      !htmlBody.includes("<page-break")
    ) {
      let pb = await HAXStore.nodeToContent(children[0]);
      return pb + "\n" + htmlBody;
    }
    return htmlBody;
  }
  /**
   * Turn the Markdown back into HTML, with the attributes HAX manages put
   * back, and import it the same way Update HTML does.
   */
  async updateBodyFromMarkdown(_e) {
    const md = this.shadowRoot.querySelector("#textarea").value || "";
    this.updateBodyFromHTML(null, await this._markdownToPageHTML(md));
  }
  async _markdownToPageHTML(md) {
    return restoreManagedAttributes(
      await markdownToHTML(md, MARKED_OPTIONS),
      this._managed,
    );
  }
  get isMarkdown() {
    return this.sourceFormat === "markdown";
  }
  /**
   * Switch between HTML and Markdown. What is in the editor converts across,
   * so nothing typed is lost; the page itself changes only on Update.
   */
  async setFormat(format) {
    const next = format === "markdown" ? "markdown" : "html";
    if (next === this.sourceFormat) {
      return;
    }
    const editor =
      this.shadowRoot && this.shadowRoot.querySelector("#textarea");
    const current = editor ? editor.value || "" : "";
    let converted = "";
    if (next === "markdown") {
      const result = htmlToMarkdown(current);
      this._managed = result.managed;
      converted = result.markdown;
    } else {
      converted = formatHTML(
        await this._withPageBreak(await this._markdownToPageHTML(current)),
      );
    }
    this.helpOpen = false;
    this.sourceFormat = next;
    try {
      globalThis.localStorage.setItem(FORMAT_KEY, next);
    } catch {
      // storage blocked: the choice just is not remembered
    }
    if (editor) {
      editor.editorValue = "";
      setTimeout(() => {
        editor.editorValue = converted;
      }, 0);
    }
  }
  toggleHelp(_e) {
    this.helpOpen = !this.helpOpen;
    if (this.helpOpen) {
      this.updateComplete.then(() => {
        const close = this.shadowRoot.querySelector("#mdhelp .help-close");
        if (close) {
          close.focus();
        }
      });
    }
  }
  closeHelp(_e) {
    this.helpOpen = false;
    this.updateComplete.then(() => {
      const button = this.shadowRoot.querySelector("#mdhelpbutton");
      if (button) {
        button.focus();
      }
    });
  }
  _helpKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      this.closeHelp();
    }
  }
  _setMarkdownView(view) {
    this.markdownView = view === "preview" ? "preview" : "write";
  }
  // debounce typing so the preview renders once the author pauses
  _sourceChanged(_e) {
    if (!this.isMarkdown) {
      return;
    }
    clearTimeout(this.__previewTimer);
    this.__previewTimer = setTimeout(() => {
      this._renderPreview();
    }, 300);
  }
  /**
   * Live preview: what Update from Markdown would put on the page, labeled
   * by block. It lives in the page document (not this shadow root) so the
   * page's content styles apply, beside the tray on wide screens and over
   * the editor on a phone. It never touches the page or undo history.
   */
  get _previewVisible() {
    return (
      this.isMarkdown &&
      this.trayActive &&
      !this.hidden &&
      (!this.narrow || this.markdownView === "preview")
    );
  }
  _ensurePreview() {
    if (this.__preview) {
      return this.__preview;
    }
    const doc = globalThis.document;
    if (!doc.getElementById("hax-md-preview-styles")) {
      const style = doc.createElement("style");
      style.id = "hax-md-preview-styles";
      style.textContent = PREVIEW_STYLES;
      doc.head.appendChild(style);
    }
    const pane = doc.createElement("section");
    pane.className = "hax-md-preview";
    // the HAX UI admin tokens live on :host, so the pane hosts them; its
    // content stays in the page document (slotted) and inherits them
    adoptStyles(pane.attachShadow({ mode: "open" }), [
      ...HaxUiAdminTokens,
      ...HaxUiAdminScheme,
    ]);
    pane.shadowRoot.appendChild(doc.createElement("slot"));
    pane.setAttribute("aria-label", this.t.livePreview);
    pane.hidden = true;
    const header = doc.createElement("div");
    header.className = "hax-md-preview-hd";
    const icon = doc.createElement("simple-icon-lite");
    icon.setAttribute("icon", "hax:admin-preview");
    const title = doc.createElement("strong");
    title.className = "hax-md-preview-title";
    const note = doc.createElement("span");
    note.className = "hax-md-preview-note";
    header.appendChild(icon);
    header.appendChild(title);
    header.appendChild(note);
    const body = doc.createElement("div");
    body.className = "hax-md-preview-bd";
    pane.appendChild(header);
    pane.appendChild(body);
    doc.body.appendChild(pane);
    this.__preview = pane;
    return pane;
  }
  _placePreview() {
    const pane = this.__preview;
    if (!pane) {
      return;
    }
    pane.toggleAttribute("narrow", !!this.narrow);
    if (this.narrow) {
      const wrapper = this.shadowRoot.querySelector("#wrapper");
      const editor = this.shadowRoot.querySelector("#textarea");
      const r = (editor || wrapper).getBoundingClientRect();
      pane.style.left = r.left + "px";
      pane.style.top = r.top + "px";
      pane.style.width = r.width + "px";
      pane.style.height = r.height + "px";
      pane.style.right = "";
      pane.style.bottom = "";
      return;
    }
    const tray = HAXStore.haxTray;
    const detail =
      tray && tray.shadowRoot
        ? tray.shadowRoot.querySelector("#tray-detail")
        : null;
    const r = (detail || this).getBoundingClientRect();
    const right = tray && tray.elementAlign === "right";
    pane.style.top = r.top + "px";
    pane.style.bottom = "0px";
    pane.style.height = "";
    pane.style.width = "";
    pane.style.left = right ? "0px" : r.right + "px";
    pane.style.right = right
      ? Math.max(0, globalThis.innerWidth - r.left) + "px"
      : "0px";
  }
  async _renderPreview() {
    if (!this._previewVisible) {
      if (this.__preview) {
        this.__preview.hidden = true;
      }
      return;
    }
    const pane = this._ensurePreview();
    pane.querySelector(".hax-md-preview-title").textContent = this.narrow
      ? ""
      : this.t.livePreview;
    pane.querySelector(".hax-md-preview-note").textContent =
      this.t.notSavedUntilUpdate;
    const editor = this.shadowRoot.querySelector("#textarea");
    const md = editor ? editor.value || "" : "";
    const template = globalThis.document.createElement("template");
    // Security: the preview only renders markup that has been through the
    // same sanitizer HAX imports content with
    template.innerHTML = sanitizeHTMLString(await this._markdownToPageHTML(md));
    const blocks = globalThis.document.createDocumentFragment();
    Array.from(template.content.children).forEach((node) => {
      const tag = node.tagName.toLowerCase();
      const schema = HAXStore.haxSchemaFromTag(tag) || {};
      const name =
        schema.gizmo && schema.gizmo.title ? schema.gizmo.title : tag;
      const wrap = globalThis.document.createElement("div");
      wrap.className = "hax-md-block";
      const label = globalThis.document.createElement("span");
      label.className = "hax-md-label";
      label.setAttribute("aria-hidden", "true");
      if (tag.indexOf("-") !== -1) {
        wrap.setAttribute("from-html", "");
        label.textContent = name + " · " + this.t.fromHTML;
      } else {
        label.textContent = name;
      }
      wrap.appendChild(label);
      wrap.appendChild(node);
      blocks.appendChild(wrap);
    });
    const body = pane.querySelector(".hax-md-preview-bd");
    const col = globalThis.document.createElement("div");
    col.className = "hax-md-preview-col";
    col.appendChild(blocks);
    body.replaceChildren(col);
    this._placePreview();
    pane.hidden = false;
    // measure once the pane has laid out at its new size
    globalThis.requestAnimationFrame(() => {
      this._fitPreview();
    });
  }
  /**
   * Lay the preview out at the page's own content width, so lines break
   * where they will on the page, and scale it down to fit the pane.
   */
  _fitPreview() {
    const pane = this.__preview;
    const col = pane ? pane.querySelector(".hax-md-preview-col") : null;
    if (!col) {
      return;
    }
    const page =
      HAXStore.activeHaxBody && HAXStore.activeHaxBody.getBoundingClientRect
        ? HAXStore.activeHaxBody.getBoundingClientRect().width
        : 0;
    const body = pane.querySelector(".hax-md-preview-bd");
    const styles = globalThis.getComputedStyle(body);
    const room =
      body.clientWidth -
      parseFloat(styles.paddingLeft) -
      parseFloat(styles.paddingRight);
    if (page > room && room > 0) {
      col.style.width = page + "px";
      col.style.zoom = String(room / page);
    } else {
      col.style.width = "";
      col.style.zoom = "";
    }
  }
  _syncPreview() {
    if (this._previewVisible) {
      this._renderPreview();
    } else if (this.__preview) {
      this.__preview.hidden = true;
    }
  }

  /**
   * Scrub and then import content as if pasted from Word / GDocs
   */
  scrubContent(_e) {
    // import contents of this text area into the activeHaxBody
    const htmlBody = this.shadowRoot.querySelector("#textarea").value || "";
    HAXStore.toast(this.t.scrubbedContentUpdated);
    HAXStore.activeHaxBody.importContent(stripMSWord(htmlBody));
    this.close();
  }

  async prettifyContent(_e) {
    let haxBodyHtml = await HAXStore.activeHaxBody.haxToContent();
    const response = await MicroFrontendRegistry.call("@core/prettyHtml", {
      html: haxBodyHtml,
    });
    if (response.status == 200) {
      this.shadowRoot.querySelector("#textarea").editorValue = "";
      setTimeout(() => {
        const htmlCode = trimLineEdges(response.data);
        this.shadowRoot.querySelector("#textarea").editorValue = htmlCode;
      }, 0);
    }
    const htmlBody = this.shadowRoot.querySelector("#textarea").value || "";
    HAXStore.toast(this.t.formattingUpdated);
    HAXStore.activeHaxBody.importContent(htmlBody);
  }
  /**
   * update content of the editor area
   */
  openSource() {
    // import at this time so we can delay as long as possible
    // from needing to pull in monaco
    if (!globalThis.customElements.get("code-editor")) {
      import("@haxtheweb/code-editor/code-editor.js").then(() => {
        this.updateEditor();
        // delay is because we conditionally render the entire tree
        // to reduce memory usage because of how large the Monaco window is
        setTimeout(() => {
          this.updateEditor();
        }, 1000);
      });
    } else {
      // delay is because we conditionally render the entire tree
      // to reduce memory usage because of how large the Monaco window is
      setTimeout(() => {
        this.updateEditor();
      }, 1000);
    }
  }
  /**
   * selectBody
   */
  selectBody(e) {
    // the copy goes through a hidden textarea that has to take focus; hand
    // focus back to the Copy HTML button afterwards so keyboard users stay
    // where they were instead of dropping to <body>
    const trigger =
      e && e.currentTarget && typeof e.currentTarget.focus === "function"
        ? e.currentTarget
        : null;
    let hiddenarea = this.shadowRoot.querySelector("#hiddentextarea");
    hiddenarea.value = this.shadowRoot.querySelector("#textarea").value || "";
    hiddenarea.removeAttribute("hidden");
    hiddenarea.focus();
    hiddenarea.select();
    globalThis.document.execCommand("copy");
    hiddenarea.setAttribute("hidden", "hidden");
    if (trigger) {
      trigger.focus();
    }
    // the toast is a polite live region, so the copy is announced too
    HAXStore.toast(this.t.copiedToClipboard);
    //this.close();
  }

  close() {
    HAXStore.haxTray.trayDetail = "";
  }

  updateEditor() {
    if (
      HAXStore.activeHaxBody &&
      this.shadowRoot &&
      this.shadowRoot.querySelector("#textarea")
    ) {
      this.shadowRoot.querySelector("#textarea").editorValue = "";
      setTimeout(async () => {
        const content = await HAXStore.activeHaxBody.haxToContent();
        let code = "";
        if (this.isMarkdown) {
          const result = htmlToMarkdown(content);
          this._managed = result.managed;
          code = result.markdown;
        } else {
          code = formatHTML(content);
        }
        this.shadowRoot.querySelector("#textarea").editorValue = code;
        this._syncPreview();
      }, 0);
    }
  }

  /**
   * Output entire thing as a file.
   */
  async contentToFile(full) {
    let body = await HAXStore.activeHaxBody.haxToContent();
    let content = body;
    // if you want full HTML headers or not
    if (full) {
      // derive the CDN base from the generating page when it defines one,
      // falling back to the PSU CDN, and normalize a trailing slash
      let cdnBase =
        globalThis.WCGlobalCDNPath || "https://cdn.webcomponents.psu.edu/cdn/";
      if (!cdnBase.endsWith("/")) {
        cdnBase += "/";
      }
      content = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes"
            />
            <title>hax-body demo</title>
            <script>globalThis.WCGlobalCDNPath="${cdnBase}"; </script> <script src="${cdnBase}build.js"></script> 
            <style>
              body {
                padding: 32px;
              }
            </style>
          </head>
          <body>
          ${body}
          </body>
        </html>
      `;
    }
    return content;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Global preferences for HAX overall
       */
      globalPreferences: {
        type: Object,
      },
      hidden: {
        type: Boolean,
        reflect: true,
      },
      theme: {
        type: String,
      },
      /**
       * Format the source is shown and edited in: html or markdown
       */
      sourceFormat: {
        type: String,
        reflect: true,
        attribute: "source-format",
      },
      /**
       * Phone only: write the Markdown or preview it
       */
      markdownView: {
        type: String,
        attribute: "markdown-view",
      },
      helpOpen: {
        type: Boolean,
        attribute: "help-open",
      },
      /**
       * Set by the tray: Source is the open, visible panel in edit mode
       */
      trayActive: {
        type: Boolean,
        attribute: "tray-active",
      },
      narrow: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("sourceFormat") &&
      changedProperties.get("sourceFormat") !== undefined
    ) {
      this.dispatchEvent(
        new CustomEvent("source-format-changed", {
          bubbles: true,
          composed: true,
          detail: { value: this.sourceFormat },
        }),
      );
    }
    if (
      changedProperties.has("trayActive") ||
      changedProperties.has("hidden") ||
      changedProperties.has("sourceFormat") ||
      changedProperties.has("markdownView") ||
      changedProperties.has("narrow")
    ) {
      this._syncPreview();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.__narrowQuery = globalThis.matchMedia(NARROW);
    this.__narrowChange = () => {
      this.narrow = this.__narrowQuery.matches;
    };
    this.__narrowQuery.addEventListener("change", this.__narrowChange);
    this.__narrowChange();
    this.__onResize = () => {
      if (this.__preview && !this.__preview.hidden) {
        this._placePreview();
        this._fitPreview();
      }
    };
    globalThis.addEventListener("resize", this.__onResize);
  }
  disconnectedCallback() {
    if (this.__narrowQuery) {
      this.__narrowQuery.removeEventListener("change", this.__narrowChange);
    }
    globalThis.removeEventListener("resize", this.__onResize);
    clearTimeout(this.__previewTimer);
    if (this.__preview) {
      this.__preview.remove();
      this.__preview = null;
    }
    super.disconnectedCallback();
  }

  constructor() {
    super();
    this.sourceFormat = "html";
    try {
      if (globalThis.localStorage.getItem(FORMAT_KEY) === "markdown") {
        this.sourceFormat = "markdown";
      }
    } catch {
      // storage blocked: start in HTML
    }
    this.markdownView = "write";
    this.helpOpen = false;
    this.trayActive = false;
    this.narrow = false;
    this._managed = [];
    this.t = {
      updateHTML: "Update HTML",
      copyHTML: "Copy HTML",
      updateMarkdown: "Update from Markdown",
      copyMarkdown: "Copy Markdown",
      markdownHelp: "Markdown help",
      markdownView: "Markdown view",
      write: "Write",
      preview: "Preview",
      livePreview: "Live preview",
      notSavedUntilUpdate: "Not saved until Update from Markdown",
      fromHTML: "from HTML",
      close: "Close",
      mdType: "Type",
      mdMakes: "Makes",
      mdHeading: "Heading (# to ####)",
      mdBoldItalic: "Bold and italic text",
      mdLink: "Link",
      mdBulleted: "Bulleted list",
      mdNumbered: "Numbered list",
      mdQuote: "Quote",
      mdInlineCode: "Inline code",
      mdDivider: "Divider",
      mdTable: "Table (GFM)",
      mdAnyBlock: "Any HAX block, written as HTML",
      mdHelpFooter:
        "Blank line between blocks. Anything you write as HTML stays a HAX block, and Update from Markdown turns the rest into blocks.",
      copiedToClipboard: "Copied to clipboard",
      prettifyHtml: "Prettify HTML",
      cleanFormatting: "Clean Formatting",
      haxSchema: "HAX schema JSON",
      revisionHistory: "Revision history",
      scrubbedContentUpdated: "Scrubbed. Content updated.",
      formattingUpdated: "Formatting updated. Content updated.",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.globalPreferences);
      Promise.resolve().then(() => {
        this.globalPreferences = _mobx_val_0;
        this.haxUiTheme = (this.globalPreferences || {}).haxUiTheme || "hax";
      });
    });
  }
}
globalThis.customElements.define(HaxViewSource.tag, HaxViewSource);
export { HaxViewSource };
