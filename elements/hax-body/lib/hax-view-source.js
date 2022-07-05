import { LitElement, html, css } from "lit";
import { MtzFileDownloadBehaviors } from "@lrnwebcomponents/dl-behavior/dl-behavior.js";
import { stripMSWord, formatHTML, b64toBlob } from "@lrnwebcomponents/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import "./hax-toolbar.js";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { autorun, toJS } from "mobx";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/file-system-broker/lib/docx-file-system-broker.js";

import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";

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
          @click="${this.importContent}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.scrubContent}"
          icon="editor:format-clear"
          label="${this.t.cleanFormatting}"
          tooltip="${this.t.cleanFormattingTooltip}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.selectBody}"
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
          @click="${this.download}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        ${MicroFrontendRegistry.has('@core/htmlToDocx') ? html`
          <hax-tray-button
            label="${this.t.downloadDOCX}"
            tooltip="${this.t.downloadDOCXTooltip}"
            icon="editor:insert-drive-file"
            @click="${this.downloadDOCXviaMicro}"
            show-text-label
            icon-position="top"
          >
          </hax-tray-button>
        ` : html`
          <hax-tray-button
            label="${this.t.downloadDOCX}"
            tooltip="${this.t.downloadDOCXTooltip}"
            icon="editor:insert-drive-file"
            @click="${this.downloadDOCX}"
            show-text-label
            icon-position="top"
          >
          </hax-tray-button>
        `}
        ${MicroFrontendRegistry.has('@core/docxToHtml') ? html`        
        <hax-tray-button
          @click="${this.importDOCXviaMicro}"
          label="${this.t.importDOCX}"
          tooltip="${this.t.importDOCXTooltip}"
          icon="icons:file-upload"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>` : html`
        <hax-tray-button
          @click="${this.importDOCX}"
          label="${this.t.importDOCX}"
          tooltip="${this.t.importDOCXTooltip}"
          icon="icons:file-upload"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        `}
        <hax-tray-button
          @click="${this.htmlToHaxElements}"
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
  // ability to refresh source view; possible something else in the system updated it
  // after we loaded
  refreshHTMLEditor(e) {
    this.updateEditor();
  }

  importDOCX(e) {
    // import and then go for it
    import(
      "@lrnwebcomponents/file-system-broker/lib/docx-file-system-broker.js"
    ).then(async (e) => {
      const broker = window.FileSystemBroker.requestAvailability();
      const file = await broker.loadFile("docx");
      // returns a Promise via event call when it's ready
      window.DOCXFileSystemBroker.requestAvailability().fileToHTML(
        file,
        "hax-view-source"
      );
    });
  }
  // import using microservice to obtain file contents
  importDOCXviaMicro(e) {
    import(
      "@lrnwebcomponents/file-system-broker/lib/docx-file-system-broker.js"
    ).then(async (e) => {
      const broker = window.FileSystemBroker.requestAvailability();
      const file = await broker.loadFile("docx");
      const formData = new FormData();
      formData.append('upload', file);
      const response = await MicroFrontendRegistry.call('@core/docxToHtml', formData);
      if (response.status == 200) {
        // fake file event from built in method for same ux
        this.insertDOCXFileContents({
          detail: {
            name: "hax-view-source",
            value: response.data.contents
          }
        });
      }
    });
  }
  // this will get called at a later time bc of the Promise involved
  insertDOCXFileContents(e) {
    // sanity check
    if (e.detail.name === "hax-view-source") {
      let div = document.createElement("div");
      div.innerHTML = e.detail.value;
      let slot = false;
      if (HAXStore.activeNode.hasAttribute("slot")) {
        slot = HAXStore.activeNode.getAttribute("slot");
      }
      for (var i = div.children.length - 1; i > 0; i--) {
        if (slot) {
          div.children[i].setAttribute("slot", slot);
        }
        HAXStore.activeNode.parentNode.insertBefore(
          div.children[i],
          HAXStore.activeNode.nextSibling
        );
      }
      HAXStore.toast(this.t.fileImported);
      this.close();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "docx-file-system-data",
      this.insertDOCXFileContents.bind(this)
    );
  }
  disconnectedCallback() {
    window.removeEventListener(
      "docx-file-system-data",
      this.insertDOCXFileContents.bind(this)
    );
    super.disconnectedCallback();
  }

  /**
   * Download file.
   */
  download(e) {
    const data = this.contentToFile(false);
    this.downloadFromData(data, "html", "my-new-code");
    HAXStore.toast("HTML content downloaded");
    this.close();
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
    this.close();
  }

  /**
   * Download DOCX, via microservice
   */
  async downloadDOCXviaMicro(e) {
    let haxBodyHtml = await HAXStore.activeHaxBody.haxToContent();
    const response = await MicroFrontendRegistry.call('@core/htmlToDocx', { html: haxBodyHtml });
    if (response.status == 200) {
      const link = document.createElement("a");
      // click link to download file
      // @todo this downloads but claims to be corrupt.
      link.href = window.URL.createObjectURL(b64toBlob(`${response.data}`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
      link.download = 'PageContents.docx';
      link.target = "_blank";
      this.appendChild(link);
      link.click();
      this.removeChild(link);
      HAXStore.toast("docx file downloaded");
      this.close();
    }
  }
  /**
   * Download file.
   */
  downloadfull(e) {
    const data = this.contentToFile(true);
    this.downloadFromData(data, "html", "my-new-webpage");
    HAXStore.toast("Working offline copy downloaded");
    this.close();
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
    this.close();
  }
  /**
   * update content of the editor area
   */
  openSource() {
    // import at this time so we can delay as long as possible
    // from needing to pull in monaco
    if (!window.customElements.get("code-editor")) {
      import("@lrnwebcomponents/code-editor/code-editor.js").then(() => {
        this.updateEditor();
        setTimeout(() => {
          this.updateEditor();
        }, 1000);
      });
    } else {
      this.updateEditor();
    }
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
    this.close();
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
        const htmlCode = formatHTML(
          await HAXStore.activeHaxBody.haxToContent()
        );
        this.shadowRoot.querySelector("#textarea").editorValue = htmlCode;
      }, 0);
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
      copyHTMLTooltip: "Copy HTML to clipboard",
      downloadHTML: "Download",
      downloadHTMLTooltip: "Download HTML format",
      downloadDOCX: "Download DOCX",
      downloadDOCXTooltip: "Download .docx format",
      cleanFormatting: "Clean",
      cleanFormattingTooltip: "Clean HTML Formatting",
      cleanFormatting: "Clean",
      schema: "Schema",
      schemaTooltip: "HAX Schema",
      importDOCX: "Import DOCX",
      importDOCXTooltip: "Import .docx content into body",
      fileImported: "File imported",
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
