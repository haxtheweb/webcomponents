import { LitElement, html, css } from "lit-element/lit-element.js";
import { MtzFileDownloadBehaviors } from "@lrnwebcomponents/dl-behavior/dl-behavior.js";
import { stripMSWord, formatHTML } from "@lrnwebcomponents/utils/utils.js";
import { HAXStore } from "./hax-store.js";
/**
 * `hax-export-dialog`
 * @element hax-export-dialog
 * `Export dialog with all export options and settings provided.`
 */
class HaxViewSource extends MtzFileDownloadBehaviors(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          text-align: left;
        }
        #textarea {
          margin: 0;
          padding: 0;
          font-size: 10px;
          resize: none;
          width: 100%;
          height: 50vh;
          width: -webkit-fill-available;
          background-color: transparent;
          color: #eeeeee;
          font-family: monospace;
        }
        .buttons {
          margin-top: 20px;
          display: flex;
          justify-content: space-evenly;
          width: 100%;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="wrapper">
        <textarea id="hiddentextarea" hidden></textarea>
        <code-editor
          id="textarea"
          title=""
          theme="vs"
          language="html"
          font-size="12"
          word-wrap
        ></code-editor>
      </div>
      <div class="buttons">
        <hax-tray-button
          label="Update source"
          icon="icons:code"
          @click="${this.importContent.bind(this)}"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.scrubContent.bind(this)}"
          icon="editor:format-clear"
          label="Word / GDoc clean up"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.selectBody.bind(this)}"
          icon="icons:content-copy"
          label="Copy source"
        >
        </hax-tray-button>
        <hax-tray-button
          label="Download"
          icon="icons:file-download"
          @click="${this.download.bind(this)}"
        >
        </hax-tray-button>
        <hax-tray-button
          @click="${this.htmlToHaxElements.bind(this)}"
          label="HAXSchema"
          icon="hax:code-json"
        >
        </hax-tray-button>
      </div>
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
    this.close();
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
    HAXStore.toast("Content updated");
    HAXStore.activeHaxBody.importContent(htmlBody);
    this.close();
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
    HAXStore.toast("Copied HTML content");
    this.close();
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
    HAXStore.toast("Copied hax elements to clipboard");
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

  constructor() {
    super();
    this.fileTypes = {
      CSV: "text/csv",
      JSON: "text/json",
      PDF: "application/pdf",
      TXT: "text/plain",
      HTML: "text/html",
    };
  }
}
window.customElements.define(HaxViewSource.tag, HaxViewSource);
export { HaxViewSource };
