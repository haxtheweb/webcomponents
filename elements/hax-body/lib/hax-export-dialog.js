import { LitElement, html, css } from "lit-element/lit-element.js";
import { MtzFileDownloadBehaviors } from "@lrnwebcomponents/dl-behavior/dl-behavior.js";
/**
 * `hax-export-dialog`
 * `Export dialog with all export options and settings provided.`
 */
class HaxExportDialog extends MtzFileDownloadBehaviors(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        #dialog {
          z-index: 1000;
        }
        iron-icon:not(:defined),
        paper-button:not(:defined),
        paper-dialog:not(:defined) {
          display: none;
        }
        .title {
          position: relative;
          padding: 16px;
          outline: 0;
          font-weight: 600;
          text-align: left;
          margin: 0;
          font-size: 18px;
          line-height: 18px;
          font-family: "Noto Serif", serif;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
        }
        .pref-container {
          text-align: left;
          padding: 16px;
        }
        .buttons paper-button:focus,
        .buttons paper-button:hover {
          outline: 1px solid var(--hax-color-border-outline);
        }
        .buttons paper-button {
          text-transform: none;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
          display: inline-flex;
          border-radius: 0px;
          border-style: solid;
          border-width: 1px;
          min-width: unset;
          font-size: 12px;
          font-weight: bold;
        }
        #closedialog {
          float: right;
          top: 5px;
          right: 0;
          position: absolute;
          padding: 4px;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
          width: 40px;
          height: 40px;
          min-width: unset;
        }
        #textarea {
          margin-bottom: 16px;
          padding: 10px;
          font-size: 10px;
          resize: none;
          width: 90%;
          height: 40vh;
          width: -webkit-fill-available;
          background-color: transparent;
          color: #eeeeee;
          font-family: monospace;
        }
        paper-dialog {
          min-width: 70vw;
          min-height: 60vh;
          background-color: #ffffff;
          color: black;
        }
        #import {
          background-color: var(
            --hax-export-dialog-import-button-bg,
            --hax-color-menu-heading-bg
          );
          color: var(--hax-color-menu-heading-color, black);
        }
        #loading {
          position: absolute;
          margin: 0 auto;
          width: 100%;
        }
      `
    ];
  }

  render() {
    return html`
      <paper-dialog id="dialog">
        <h3 class="title">
          <iron-icon icon="icons:code"></iron-icon> ${this.title}
        </h3>
        <div style="height: 100%; overflow: auto;" class="pref-container">
          <div id="wrapper">
            <textarea id="hiddentextarea" hidden></textarea>
            <hexagon-loader
              size="small"
              id="loading"
              item-count="4"
              color="#0085ba"
              aria-roledescription="Loading"
            ></hexagon-loader>
            <code-editor id="textarea" title="" theme="vs"></code-editor>
          </div>
          <div id="buttons" class="buttons">
            <paper-button id="import" raised>Update body area</paper-button>
            <paper-button id="copy">Copy to clipboard</paper-button>
            <paper-button id="downloadfull">Download full file</paper-button>
            <paper-button id="download">Download body area</paper-button>
            <paper-button
              id="elementexport"
              ?hidden="${!this.globalPreferences.haxDeveloperMode}"
              >Copy as HAX schema to clipboard</paper-button
            >
          </div>
        </div>
        <paper-button id="closedialog" on-click="close">
          <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
        </paper-button>
      </paper-dialog>
    `;
  }

  static get tag() {
    return "hax-export-dialog";
  }

  static get properties() {
    return {
      /**
       * Title when open.
       */
      title: {
        type: String
      },
      /**
       * Access to the global properties object.
       */
      globalPreferences: {
        type: Object
      }
    };
  }
  /**
   * Attached to the DOM, now fire that we exist.
   */
  firstUpdated() {
    // fire an event that this is a core piece of the system
    this.dispatchEvent(
      new CustomEvent("hax-register-core-piece", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          piece: "haxExport",
          object: this
        }
      })
    );
    // add event listeners
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    this.shadowRoot
      .querySelector("#download")
      .addEventListener("click", this.download.bind(this));
    this.shadowRoot
      .querySelector("#downloadfull")
      .addEventListener("click", this.downloadfull.bind(this));
    this.shadowRoot
      .querySelector("#import")
      .addEventListener("click", this.importContent.bind(this));
    this.shadowRoot
      .querySelector("#copy")
      .addEventListener("click", this.selectBody.bind(this));
    this.shadowRoot
      .querySelector("#closedialog")
      .addEventListener("click", this.close.bind(this));
    this.shadowRoot
      .querySelector("#elementexport")
      .addEventListener("click", this.htmlToHaxElements.bind(this));
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (typeof e.detail.value === "object") {
        this[e.detail.property] = { ...e.detail.value };
      } else {
        this[e.detail.property] = e.detail.value;
      }
    }
  }

  /**
   * Download file.
   */
  download(e) {
    const data = this.contentToFile(false);
    this.downloadFromData(data, "html", "my-new-code");
    window.HaxStore.toast("HTML content downloaded");
  }

  /**
   * Download file.
   */
  downloadfull(e) {
    const data = this.contentToFile(true);
    this.downloadFromData(data, "html", "my-new-webpage");
    window.HaxStore.toast("Working offline copy downloaded");
  }

  /**
   * Download file.
   */
  importContent(e) {
    // import contents of this text area into the activeHaxBody
    const htmlBody = this.shadowRoot.querySelector("#textarea").value;
    window.HaxStore.toast("Content updated");
    return window.HaxStore.instance.activeHaxBody.importContent(htmlBody);
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
    window.HaxStore.toast("Copied HTML content");
  }

  /**
   * HTML to HAX Elements
   */
  htmlToHaxElements(e) {
    let elements = window.HaxStore.htmlToHaxElements(
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
    window.HaxStore.toast("Copied hax elements to clipboard");
  }

  /**
   * Output entire thing as a file.
   */
  contentToFile(full) {
    var content = "";
    // if you want full HTML headers or not
    if (full) {
      let elementList = window.HaxStore.instance.elementList;
      // @todo obviously not sustainable
      let url = "https://lrnwebcomponents.github.io/hax-body/components";
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
            <script src="${url}/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
            <style>
              body {
                padding: 32px;
              }
            </style>
          </head>
        </html>
      `;
      var ignoreList = ["iframe", "a", "img", "hr", "p"];
      for (var index in elementList) {
        if (ignoreList.indexOf(index) === -1) {
          content +=
            '<script type="module" src="' +
            url +
            "/" +
            index +
            "/" +
            index +
            '.js" />' +
            "\n";
        }
      }
      content += "</head><body>";
      content += window.HaxStore.instance.activeHaxBody.haxToContent();
      content += "</body></html>";
    } else {
      content = window.HaxStore.instance.activeHaxBody.haxToContent();
    }
    return content;
  }

  /**
   * Toggle ourselves.
   */
  toggleDialog() {
    if (this.shadowRoot.querySelector("#dialog").opened) {
      this.close();
    } else {
      this.shadowRoot.querySelector(
        "#textarea"
      ).editorValue = this.contentToFile(false);
      window.HaxStore.instance.closeAllDrawers(this);
    }
  }
  constructor() {
    super();
    this.title = "View page source";
    this.fileTypes = {
      CSV: "text/csv",
      JSON: "text/json",
      PDF: "application/pdf",
      TXT: "text/plain",
      HTML: "text/html"
    };
    this.globalPreferences = {};
    import("@polymer/paper-dialog/paper-dialog.js");
  }
  /**
   * open the dialog
   */
  open() {
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-button/paper-button.js");
    import("@lrnwebcomponents/code-editor/code-editor.js");
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");

    this.shadowRoot.querySelector("#dialog").open();
    this.shadowRoot.querySelector("#buttons").style.display = "none";
    this.shadowRoot
      .querySelector("#loading")
      .setAttribute("loading", "loading");
    this.shadowRoot
      .querySelector("#wrapper")
      .appendChild(this.shadowRoot.querySelector("#textarea"));
    // silly but we need the code editor to figure itself out real quick as to sizing
    setTimeout(() => {
      this.shadowRoot.querySelector("#loading").removeAttribute("loading");
      this.shadowRoot.querySelector("#buttons").style.display = "unset";
    }, 800);
  }

  /**
   * close the dialog
   */
  close() {
    this.shadowRoot.querySelector("#dialog").close();
  }
}
window.customElements.define(HaxExportDialog.tag, HaxExportDialog);
export { HaxExportDialog };
