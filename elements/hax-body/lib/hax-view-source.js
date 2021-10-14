import { LitElement, html, css } from "lit";
import { MtzFileDownloadBehaviors } from "@lrnwebcomponents/dl-behavior/dl-behavior.js";
import { stripMSWord, formatHTML } from "@lrnwebcomponents/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import "./hax-toolbar.js";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { autorun, toJS } from "mobx";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/file-system-broker/lib/docx-file-system-broker.js";

/**
 * `hax-eview-source`
 * @element hax-eview-source
 * `Export dialog with all export options and settings provided.`
 */
class HaxViewSource extends I18NMixin(MtzFileDownloadBehaviors(LitElement)) {
  static get styles() {
    return [
      ...HaxComponentStyles,
      css`
        :host,
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
        }
        hax-toolbar {
          flex: 0 0 auto;
          background-color: var(--hax-ui-background-color);
        }
        hax-toolbar::part(buttons) {
          display: flex;
          justify-content: center;
          align-items: stretch;
          margin: 0 auto;
        }
        hax-tray-button {
          flex: 1 1 auto;
        }
        /** This is mobile layout for controls */
        @media screen and (max-width: 800px) {
          hax-tray-button {
            flex: 0 1 auto;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="wrapper">
        <div id="spacer"></div>
        <textarea id="hiddentextarea" hidden></textarea>
        <code-editor
          id="textarea"
          theme="${this.haxUiTheme == "hax"
            ? "vs"
            : this.haxUiTheme == "haxdark"
            ? "vs-dark"
            : "auto"}"
          language="html"
          font-size="13"
          word-wrap
        ></code-editor>
      </div>
      <hax-toolbar always-expanded>
        <hax-tray-button
          label="${this.t.updatePage}"
          tooltip="${this.t.updatePageTooltip}"
          icon="editor:insert-drive-file"
          @click="${this.importContent.bind(this)}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.scrubContent.bind(this)}"
          icon="editor:format-clear"
          label="${this.t.cleanFormatting}"
          tooltip="${this.t.cleanFormattingTooltip}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.selectBody.bind(this)}"
          icon="icons:content-copy"
          label="${this.t.copyHTML}"
          tooltip="${this.t.copyHTMLTooltip}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          label="${this.t.downloadHTML}"
          tooltip="${this.t.downloadHTMLTooltip}"
          icon="icons:file-download"
          @click="${this.download.bind(this)}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          label="${this.t.downloadDOCX}"
          tooltip="${this.t.downloadDOCXTooltip}"
          icon="editor:insert-drive-file"
          @click="${this.downloadDOCX.bind(this)}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.htmlToHaxElements.bind(this)}"
          label="${this.t.schema}"
          tooltip="${this.t.schemaTooltip}"
          icon="hax:code-json"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
      </hax-toolbar>
    `;
  }
  static get tag() {
    return "hax-view-source";
  }

  /**
   * Download file.
   */
  download(e) {
    const data = this.contentToFile(false);
    this.downloadFromData(data, "html", "my-new-code");
    HAXStore.toast("HTML content downloaded");
    //this.close();
  }

  /**
   * Download DOCX.
   */
  async downloadDOCX(e) {
    let body = await HAXStore.activeHaxBody.haxToContent();
    window.DOCXFileSystemBroker.requestAvailability().HTMLToDOCX(
      body,
      document.title
    );
    HAXStore.toast("docx file downloaded");
  }

  /**
   * Download file.
   */
  downloadfull(e) {
    const data = this.contentToFile(true);
    this.downloadFromData(data, "html", "my-new-webpage");
    HAXStore.toast("Working offline copy downloaded");
    //this.close();
  }

  /**
   * Import content into body area.
   */
  importContent(e) {
    // import contents of this text area into the activeHaxBody
    const htmlBody = this.shadowRoot.querySelector("#textarea").value;
    HAXStore.activeHaxBody.importContent(htmlBody);
    HAXStore.haxTray.trayDetail = "";
  }

  /**
   * Scrub and then import content as if pasted from Word / GDocs
   */
  scrubContent(e) {
    // import contents of this text area into the activeHaxBody
    const htmlBody = this.shadowRoot.querySelector("#textarea").value;
    HAXStore.toast("Scrubbed, Content updated");
    HAXStore.activeHaxBody.importContent(stripMSWord(htmlBody));
    //this.close();
  }
  /**
   * update content of the editor area
   */
  openSource() {
    // import at this time so we can delay as long as possible
    // from needing to pull in monaco
    import("@lrnwebcomponents/code-editor/code-editor.js");
    this.updateEditor();
  }
  /**
   * selectBody
   */
  selectBody(e) {
    let hiddenarea = this.shadowRoot.querySelector("#hiddentextarea");
    hiddenarea.value = this.shadowRoot.querySelector("#textarea").value;
    hiddenarea.removeAttribute("hidden");
    hiddenarea.focus();
    hiddenarea.select();
    document.execCommand("copy");
    hiddenarea.setAttribute("hidden", "hidden");
    HAXStore.toast(this.t.copiedToClipboard);
    //this.close();
  }

  /**
   * HTML to HAX Elements
   */
  async htmlToHaxElements(e) {
    let elements = await HAXStore.htmlToHaxElements(
      this.shadowRoot.querySelector("#textarea").value
    );
    var str = JSON.stringify(elements, null, 2);
    let val = this.shadowRoot.querySelector("#textarea").value;
    let hiddenarea = this.shadowRoot.querySelector("#hiddentextarea");
    hiddenarea.removeAttribute("hidden");
    hiddenarea.value = str;
    hiddenarea.focus();
    hiddenarea.select();
    document.execCommand("copy");
    hiddenarea.value = val;
    hiddenarea.setAttribute("hidden", "hidden");
    HAXStore.toast(this.t.copiedToClipboard);
  }

  async firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
      // fire an event that this is a core piece of the system
      this.dispatchEvent(
        new CustomEvent("hax-register-core-piece", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            piece: "haxViewSource",
            object: this,
          },
        })
      );
    }
    await this.updateEditor();
  }
  async updateEditor() {
    if (
      HAXStore.activeHaxBody &&
      this.shadowRoot &&
      this.shadowRoot.querySelector("#textarea")
    ) {
      this.shadowRoot.querySelector("#textarea").editorValue = formatHTML(
        await HAXStore.activeHaxBody.haxToContent()
      );
    }
  }

  /**
   * Output entire thing as a file.
   */
  async contentToFile(full) {
    let body = await HAXStore.activeHaxBody.haxToContent();
    var content = body;
    // if you want full HTML headers or not
    if (full) {
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
            <script>window.WCGlobalCDNPath="https://cdn.webcomponents.psu.edu/cdn/"; </script> <script src="https://cdn.webcomponents.psu.edu/cdn/build.js"></script> 
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
      theme: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.t = {
      updatePage: "Update",
      updatePageTooltip: "Update Page HTML",
      copyHTML: "Copy",
      copyHTMLTooltip: "Copy HTML",
      downloadHTML: "Download",
      downloadHTMLTooltip: "Download HTML",
      downloadDOCX: "Download (docx)",
      downloadDOCXTooltip: "Download .docx format",
      cleanFormatting: "Clean",
      cleanFormattingTooltip: "Clean HTML Formatting",
      cleanFormatting: "Clean",
      schema: "Schema",
      schemaTooltip: "HAX Schema",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    this.fileTypes = {
      CSV: "text/csv",
      JSON: "text/json",
      PDF: "application/pdf",
      TXT: "text/plain",
      HTML: "text/html",
    };
    autorun(() => {
      this.globalPreferences = toJS(HAXStore.globalPreferences);
      this.haxUiTheme = (this.globalPreferences || {}).haxUiTheme || "hax";
    });
  }
}
window.customElements.define(HaxViewSource.tag, HaxViewSource);
export { HaxViewSource };
