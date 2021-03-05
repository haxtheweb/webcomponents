import { LitElement, html, css } from "lit-element/lit-element.js";
import { MtzFileDownloadBehaviors } from "@lrnwebcomponents/dl-behavior/dl-behavior.js";
import { stripMSWord, formatHTML } from "@lrnwebcomponents/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import "./hax-toolbar.js";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { autorun, toJS } from "mobx";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";

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
          margin: 0;
          padding: 0;
          flex: 0 1 100vh;
          display: flex;
          flex-direction: column;
        }
        :host > *,
        #textarea {
          margin: 0;
          padding: 0;
        }
        #hiddentextarea,
        #spacer {
          flex: 0 1 0px;
        }
        #wrapper {
          flex: 1 0 calc(70vh - 94px);
          position: relative;
        }
        #textarea {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
        hax-toolbar {
          flex: 0 0 auto;
          width: 100%;
          display: flex;
          background-color: var(--hax-ui-background-color);
        }
        hax-toolbar::part(buttons) {
          justify-content: space-between;
          flex: 0 1 auto;
          margin: 0 auto;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="spacer"></div>
      <div id="wrapper">
        <textarea id="hiddentextarea" hidden></textarea>
        <code-editor
          id="textarea"
          title=""
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
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.selectBody.bind(this)}"
          icon="icons:content-copy"
          label="${this.t.copyHTML}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          label="${this.t.downloadHTML}"
          icon="icons:file-download"
          @click="${this.download.bind(this)}"
          show-text-label
          icon-position="top"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.htmlToHaxElements.bind(this)}"
          label="HAXSchema"
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
    HAXStore.toast("Content updated");
    HAXStore.activeHaxBody.importContent(htmlBody);
    //this.close();
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

  close() {
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      })
    );
  }
  /**
   * update content of the editor area
   */
  openSource() {
    // import at this time so we can delay as long as possible
    // from needing to pull in monaco
    import("@lrnwebcomponents/code-editor/code-editor.js");
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
  htmlToHaxElements(e) {
    let elements = HAXStore.htmlToHaxElements(
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

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (HAXStore.activeHaxBody) {
      this.shadowRoot.querySelector("#textarea").editorValue = formatHTML(
        HAXStore.activeHaxBody.haxToContent()
      );
    }
  }

  /**
   * Output entire thing as a file.
   */
  contentToFile(full) {
    let body = HAXStore.activeHaxBody.haxToContent();
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
      updatePage: "Update Page",
      copyHTML: "Copy HTML",
      downloadHTML: "Download HTML",
      cleanFormatting: "Clean Formatting",
      copiedToClipboard: "Copied to clipboard",
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
