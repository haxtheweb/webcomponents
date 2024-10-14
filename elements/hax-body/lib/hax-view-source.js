import { LitElement, html, css } from "lit";
import { MtzFileDownloadBehaviors } from "@haxtheweb/dl-behavior/dl-behavior.js";
import { stripMSWord, formatHTML, b64toBlob } from "@haxtheweb/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import "./hax-toolbar.js";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { autorun, toJS } from "mobx";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu-item.js";
import "./hax-tray-button.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";

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
        .updatecontent {
          background-color: var(--simple-colors-default-theme-green-1);
          color: var(--simple-colors-default-theme-green-8);
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
        simple-toolbar-menu {
          --simple-toolbar-button-border-color: var(--hax-ui-border-color);
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
    return html`${this.hidden
      ? ``
      : html` <hax-toolbar>
            <hax-tray-button
              label="${this.t.updateHTML}"
              icon="icons:check"
              @click="${this.updateBodyFromHTML}"
              show-text-label
              icon-position="top"
              class="updatecontent"
            >
            </hax-tray-button>
            <hax-tray-button
              @click="${this.scrubContent}"
              icon="editor:format-clear"
              label="${this.t.cleanFormatting}"
              show-text-label
              icon-position="top"
            >
            </hax-tray-button>
            ${MicroFrontendRegistry.has("@core/prettyHtml")
              ? html`
                  <hax-tray-button
                    label="${this.t.PrettifyHtml}"
                    icon="hax:format-textblock"
                    @click="${this.prettifyContent}"
                    show-text-label
                    icon-position="top"
                  >
                  </hax-tray-button>
                `
              : html``}
            <hax-tray-button
              @click="${this.selectBody}"
              icon="hax:html-code"
              label="${this.t.copyHTML}"
              show-text-label
              icon-position="top"
            >
            </hax-tray-button>
            ${HAXStore.revisionHistoryLink
              ? html` <hax-tray-button
                  @click="${this.revisionHistoryClick}"
                  icon="hax:git"
                  label="${this.t.revisionHistory}"
                  show-text-label
                  icon-position="top"
                >
                </hax-tray-button>`
              : ``}

            <simple-toolbar-menu
              icon="icons:file-download"
              icon-position="top"
              label="${this.t.downloadContent}"
              @dblclick="${this.download}"
              show-text-label
            >
              <simple-toolbar-menu-item>
                <hax-tray-button
                  icon="hax:file-html"
                  icon-position="top"
                  label="${this.t.downloadHTML}"
                  @click="${this.download}"
                  show-text-label
                >
                </hax-tray-button>
              </simple-toolbar-menu-item>
              <simple-toolbar-menu-item>
                ${MicroFrontendRegistry.has("@core/htmlToDocx")
                  ? html`
                      <hax-tray-button
                        label="${this.t.downloadDOCX}"
                        icon="hax:file-docx"
                        @click="${this.downloadDOCXviaMicro}"
                        show-text-label
                        icon-position="top"
                      >
                      </hax-tray-button>
                    `
                  : html`
                      <hax-tray-button
                        label="${this.t.downloadDOCX}"
                        icon="hax:file-docx"
                        @click="${this.downloadDOCX}"
                        show-text-label
                        icon-position="top"
                      >
                      </hax-tray-button>
                    `}
              </simple-toolbar-menu-item>
              ${MicroFrontendRegistry.has("@core/htmlToMd")
                ? html`
                    <simple-toolbar-menu-item>
                      <hax-tray-button
                        label="${this.t.downloadMD}"
                        icon="hax:format-textblock"
                        @click="${this.downloadMDviaMicro}"
                        show-text-label
                        icon-position="top"
                      >
                      </hax-tray-button>
                    </simple-toolbar-menu-item>
                  `
                : html``}
              ${MicroFrontendRegistry.has("@core/htmlToPdf")
                ? html`
                    <simple-toolbar-menu-item>
                      <hax-tray-button
                        label="${this.t.downloadPDF}"
                        icon="lrn:pdf"
                        @click="${this.downloadPDFviaMicro}"
                        show-text-label
                        icon-position="top"
                      >
                      </hax-tray-button>
                    </simple-toolbar-menu-item>
                  `
                : html``}
              <simple-toolbar-menu-item>
                <hax-tray-button
                  @click="${this.htmlToHaxElements}"
                  label="${this.t.haxSchema}"
                  icon="hax:code-json"
                  show-text-label
                  icon-position="top"
                ></hax-tray-button>
              </simple-toolbar-menu-item>
            </simple-toolbar-menu>
          </hax-toolbar>
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
          </div>`} `;
  }
  static get tag() {
    return "hax-view-source";
  }
  // ability to refresh source view; possible something else in the system updated it
  // after we loaded
  refreshHTMLEditor(e) {
    this.updateEditor();
  }
  /**
   * Download file.
   */
  async download(e) {
    const data = await this.contentToFile(false);
    this.downloadFromData(data, "html", "my-new-code");
    HAXStore.toast(this.t.fileDownloaded);
    this.close();
  }

  /**
   * Download DOCX.
   */
  async downloadDOCX(e) {
    import("@haxtheweb/file-system-broker/lib/docx-file-system-broker.js").then(
      async (e) => {
        let body = await HAXStore.activeHaxBody.haxToContent();
        globalThis.DOCXFileSystemBroker.requestAvailability().HTMLToDOCX(
          body,
          globalThis.document.title,
        );
        HAXStore.toast(this.t.fileDownloaded);
        this.close();
      },
    );
  }

  /**
   * Download DOCX, via microservice
   */
  async downloadDOCXviaMicro(e) {
    let haxBodyHtml = await HAXStore.activeHaxBody.haxToContent();
    const response = await MicroFrontendRegistry.call("@core/htmlToDocx", {
      html: haxBodyHtml,
    });
    if (response.status == 200) {
      const link = globalThis.document.createElement("a");
      // click link to download file
      // @todo this downloads but claims to be corrupt.
      link.href = globalThis.URL.createObjectURL(
        b64toBlob(
          `${response.data}`,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ),
      );
      link.download = "PageContents.docx";
      link.target = "_blank";
      this.appendChild(link);
      link.click();
      this.removeChild(link);
      HAXStore.toast(this.t.fileDownloaded);
      this.close();
    }
  }
  /**
   * Download MD, via microservice
   */
  async downloadMDviaMicro(e) {
    let haxBodyHtml = await HAXStore.activeHaxBody.haxToContent();
    const response = await MicroFrontendRegistry.call("@core/htmlToMd", {
      html: haxBodyHtml,
    });
    if (response.status == 200 && response.data) {
      const link = globalThis.document.createElement("a");
      // click link to download file
      link.href = globalThis.URL.createObjectURL(
        b64toBlob(btoa(response.data), "text/markdown"),
      );
      link.download = "PageContents.md";
      link.target = "_blank";
      this.appendChild(link);
      link.click();
      this.removeChild(link);
      HAXStore.toast(this.t.fileDownloaded);
      this.close();
    }
  }
  /**
   * Download PDF, via microservice
   */
  async downloadPDFviaMicro(e) {
    let htmlContent = await HAXStore.activeHaxBody.haxToContent();
    // base helps w/ calculating URLs in content
    var base = "";
    if (globalThis.document.querySelector("base")) {
      base = globalThis.document.querySelector("base").href;
    }
    const response = await MicroFrontendRegistry.call("@core/htmlToPdf", {
      base: base,
      html: htmlContent,
    });
    if (response.status == 200 && response.data) {
      const link = globalThis.document.createElement("a");
      // click link to download file
      // @todo this downloads but claims to be corrupt.
      link.href = globalThis.URL.createObjectURL(
        b64toBlob(response.data, "application/pdf"),
      );
      link.download = "PageContents.pdf";
      link.target = "_blank";
      this.appendChild(link);
      link.click();
      this.removeChild(link);
      HAXStore.toast(this.t.fileDownloaded);
      this.close();
    }
  }
  /**
   * Download file.
   */
  async downloadfull(e) {
    const data = await this.contentToFile(true);
    this.downloadFromData(data, "html", "my-new-webpage");
    HAXStore.toast(this.t.fileDownloaded);
    this.close();
  }

  /**
   * Import content into body area.
   */
  async updateBodyFromHTML(e) {
    // import contents of this text area into the activeHaxBody
    let htmlBody = this.shadowRoot.querySelector("#textarea").value;
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
      htmlBody = pb + "\n" + htmlBody;
    }
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

  async prettifyContent(e) {
    let haxBodyHtml = await HAXStore.activeHaxBody.haxToContent();
    const response = await MicroFrontendRegistry.call("@core/prettyHtml", {
      html: haxBodyHtml,
    });
    if (response.status == 200) {
      this.shadowRoot.querySelector("#textarea").editorValue = "";
      setTimeout(() => {
        const htmlCode = response.data.replace(/^\s+|\s+$/gm, "");
        this.shadowRoot.querySelector("#textarea").editorValue = htmlCode;
      }, 0);
    }
    const htmlBody = this.shadowRoot.querySelector("#textarea").value;
    HAXStore.toast("Formatting updated, Content updated");
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
        // delay is because we conditionally render the entire treee
        // to reduce memory usage bc of how large the monoco window is
        setTimeout(() => {
          this.updateEditor();
        }, 1000);
      });
    } else {
      // delay is because we conditionally render the entire treee
      // to reduce memory usage bc of how large the monoco window is
      setTimeout(() => {
        this.updateEditor();
      }, 1000);
    }
  }

  revisionHistoryClick() {
    if (HAXStore.revisionHistoryLink) {
      globalThis.open(HAXStore.revisionHistoryLink, "_blank");
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
    globalThis.document.execCommand("copy");
    hiddenarea.setAttribute("hidden", "hidden");
    HAXStore.toast(this.t.copiedToClipboard);
    //this.close();
  }

  /**
   * HTML to HAX Elements
   */
  async htmlToHaxElements(e) {
    let body = await HAXStore.activeHaxBody.haxToContent();
    let elements = await HAXStore.htmlToHaxElements(body);
    elements.shift();
    var str = JSON.stringify(elements, null, 2);
    let val = this.shadowRoot.querySelector("#textarea").value;
    let hiddenarea = this.shadowRoot.querySelector("#hiddentextarea");
    hiddenarea.removeAttribute("hidden");
    hiddenarea.value = str;
    hiddenarea.focus();
    hiddenarea.select();
    globalThis.document.execCommand("copy");
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
          await HAXStore.activeHaxBody.haxToContent(),
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
            <script>globalThis.WCGlobalCDNPath="https://cdn.webcomponents.psu.edu/cdn/"; </script> <script src="https://cdn.webcomponents.psu.edu/cdn/build.js"></script> 
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
    };
  }

  constructor() {
    super();
    this.t = {
      updateHTML: "Update HTML",
      copyHTML: "Copy HTML",
      downloadContent: "Download content",
      downloadHTML: "Download HTML",
      fileDownloaded: "File downloaded",
      downloadDOCX: "Download DOCX",
      downloadMD: "Download Markdown",
      downloadPDF: "Download PDF",
      PrettifyHtml: "Prettify HTML",
      cleanFormatting: "Clean Formatting",
      haxSchema: "HAXSchema",
      revisionHistory: "Revision history",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    autorun(() => {
      this.globalPreferences = toJS(HAXStore.globalPreferences);
      this.haxUiTheme = (this.globalPreferences || {}).haxUiTheme || "hax";
    });
  }
}
customElements.define(HaxViewSource.tag, HaxViewSource);
export { HaxViewSource };
