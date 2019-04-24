import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@lrnwebcomponents/dl-behavior/dl-behavior.js";
import "./hax-shared-styles.js";
/**
`hax-export-dialog`
Export dialog with all export options and settings provided.

* @demo demo/index.html
@microcopy - the mental model for this element
 -

*/
Polymer({
  _template: html`
    <style include="hax-shared-styles">
      :host {
        display: block;
      }
      #dialog {
        z-index: 1000;
      }
      .title {
        position: relative;
        padding: 16px;
        outline: 0;
        font-weight: 600;
        text-align: left;
        margin: 0;
        background-color: var(--hax-color-menu-heading-bg);
        font-size: 18px;
        line-height: 18px;
        font-family: "Noto Serif", serif;
        color: var(--hax-color-text);
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
        color: var(--hax-color-text);
        text-transform: none;
        margin: 0;
        background-color: var(--hax-color-bg-accent);
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
        color: var(--hax-color-text);
        background-color: transparent;
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
        color: var(--hax-color-text);
      }
      #import {
        margin-right: 50px;
        color: var(--hax-color-accent1-text);
        background-color: var(--hax-color-accent1);
      }
      #loading {
        position: absolute;
        margin: 0 auto;
        width: 100%;
      }
    </style>
    <paper-dialog id="dialog" with-backdrop always-on-top>
      <h3 class="title">[[title]]</h3>
      <div style="height: 100%; overflow: auto;" class="pref-container">
        <div id="wrapper">
          <textarea id="hiddentextarea" hidden></textarea>
          <hexagon-loader
            size="small"
            id="loading"
            color="#0085ba"
            aria-roledescription="Loading"
          ></hexagon-loader>
          <code-editor id="textarea" title="" theme="hc-black"></code-editor>
        </div>
        <div id="buttons" class="buttons">
          <paper-button id="import" raised>Update body area</paper-button>
          <paper-button id="copy">Copy to clipboard</paper-button>
          <paper-button id="downloadfull">Download full file</paper-button>
          <paper-button id="download">Download body area</paper-button>
          <paper-button
            id="elementexport"
            hidden\$="[[!globalPreferences.haxDeveloperMode]]"
            >Copy as HAX schema to clipboard</paper-button
          >
        </div>
      </div>
      <paper-button id="closedialog" on-tap="close">
        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
      </paper-button>
    </paper-dialog>
  `,

  is: "hax-export-dialog",

  behaviors: [mtz.FileDownloadBehaviors],

  properties: {
    /**
     * Title when open.
     */
    title: {
      type: String,
      value: "Source view"
    },
    /**
     * Access to the global properties object.
     */
    globalPreferences: {
      type: Object,
      value: {}
    }
  },
  /**
   * Attached to the DOM, now fire that we exist.
   */
  attached: function() {
    // fire an event that this is the manager
    this.dispatchEvent(
      new CustomEvent("hax-register-export", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    afterNextRender(this, function() {
      // add event listeners
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      this.shadowRoot
        .querySelector("#download")
        .addEventListener("tap", this.download.bind(this));
      this.shadowRoot
        .querySelector("#downloadfull")
        .addEventListener("tap", this.downloadfull.bind(this));
      this.shadowRoot
        .querySelector("#import")
        .addEventListener("tap", this.importContent.bind(this));
      this.shadowRoot
        .querySelector("#copy")
        .addEventListener("tap", this.selectBody.bind(this));
      this.shadowRoot
        .querySelector("#closedialog")
        .addEventListener("tap", this.close.bind(this));
      this.shadowRoot
        .querySelector("#elementexport")
        .addEventListener("tap", this.htmlToHaxElements.bind(this));
    });
  },
  /**
   * Detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    this.shadowRoot
      .querySelector("#download")
      .removeEventListener("tap", this.download.bind(this));
    this.shadowRoot
      .querySelector("#downloadfull")
      .removeEventListener("tap", this.downloadfull.bind(this));
    this.shadowRoot
      .querySelector("#import")
      .removeEventListener("tap", this.importContent.bind(this));
    this.shadowRoot
      .querySelector("#copy")
      .removeEventListener("tap", this.selectBody.bind(this));
    this.shadowRoot
      .querySelector("#closedialog")
      .removeEventListener("tap", this.close.bind(this));
    this.shadowRoot
      .querySelector("#elementexport")
      .removeEventListener("tap", this.htmlToHaxElements.bind(this));
  },

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (typeof e.detail.value === "object") {
        this.set(e.detail.property, null);
      }
      this.set(e.detail.property, e.detail.value);
    }
  },

  /**
   * Download file.
   */
  download: function(e) {
    const data = this.contentToFile(false);
    this.downloadFromData(data, "html", "my-new-code");
    window.HaxStore.toast("HTML content downloaded");
  },

  /**
   * Download file.
   */
  downloadfull: function(e) {
    const data = this.contentToFile(true);
    this.downloadFromData(data, "html", "my-new-webpage");
    window.HaxStore.toast("Working offline copy downloaded");
  },

  /**
   * Download file.
   */
  importContent: function(e) {
    // import contents of this text area into the activeHaxBody
    const htmlBody = this.shadowRoot.querySelector("#textarea").value;
    window.HaxStore.toast("Content updated");
    return window.HaxStore.instance.activeHaxBody.importContent(htmlBody);
  },

  /**
   * selectBody
   */
  selectBody: function(e) {
    let hiddenarea = this.shadowRoot.querySelector("#hiddentextarea");
    hiddenarea.value = this.shadowRoot.querySelector("#textarea").value;
    hiddenarea.removeAttribute("hidden");
    hiddenarea.focus();
    hiddenarea.select();
    document.execCommand("copy");
    hiddenarea.setAttribute("hidden", "hidden");
    window.HaxStore.toast("Copied HTML content");
  },

  /**
   * HTML to HAX Elements
   */
  htmlToHaxElements: function(e) {
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
  },

  /**
   * Output entire thing as a file.
   */
  contentToFile: function(full) {
    var content = "";
    // if you want full HTML headers or not
    if (full) {
      let elementList = window.HaxStore.instance.elementList;
      // @todo obviously not sustainable
      let url = "https://lrnwebcomponents.github.io/hax-body/components";
      content = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">
          <title>hax-body demo</title>
          <script src="${url}/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
          <style>
          body {
            padding: 32px;
          }
          </style>
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
  },

  /**
   * Toggle ourselves.
   */
  toggleDialog: function() {
    if (this.shadowRoot.querySelector("#dialog").opened) {
      this.close();
    } else {
      this.shadowRoot.querySelector(
        "#textarea"
      ).editorValue = this.contentToFile(false);
      window.HaxStore.instance.closeAllDrawers(this);
    }
  },
  created: function() {
    import("@polymer/paper-dialog/paper-dialog.js");
  },
  /**
   * open the dialog
   */
  open: function() {
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
  },

  /**
   * close the dialog
   */
  close: function() {
    this.shadowRoot.querySelector("#dialog").close();
  }
});
