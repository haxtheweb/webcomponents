import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/dl-behavior/dl-behavior.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/code-editor/code-editor.js";
import "@lrnwebcomponents/hexagon-loader/hexagon-loader.js";
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
    <style include="simple-colors hax-shared-styles">
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
        width: 90%;
        font-size: 10px;
        resize: none;
        width: 80%;
        width: -webkit-fill-available;
        background-color: transparent;
        color: #eeeeee;
        font-family: monospace;
      }
      paper-dialog {
        min-width: 60vw;
        min-height: 50vh;
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
    this.fire("hax-register-export", this);
    // add event listeners
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    this.$.download.addEventListener("tap", this.download.bind(this));
    this.$.downloadfull.addEventListener("tap", this.downloadfull.bind(this));
    this.$.import.addEventListener("tap", this.importContent.bind(this));
    this.$.copy.addEventListener("tap", this.selectBody.bind(this));
    this.$.closedialog.addEventListener("tap", this.close.bind(this));
    this.$.elementexport.addEventListener(
      "tap",
      this.htmlToHaxElements.bind(this)
    );
  },
  /**
   * Detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    this.$.download.removeEventListener("tap", this.download.bind(this));
    this.$.downloadfull.removeEventListener(
      "tap",
      this.downloadfull.bind(this)
    );
    this.$.import.removeEventListener("tap", this.importContent.bind(this));
    this.$.copy.removeEventListener("tap", this.selectBody.bind(this));
    this.$.closedialog.removeEventListener("tap", this.close.bind(this));
    this.$.elementexport.removeEventListener(
      "tap",
      this.htmlToHaxElements.bind(this)
    );
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
    const htmlBody = this.$.textarea.value;
    window.HaxStore.toast("Content updated");
    return window.HaxStore.instance.activeHaxBody.importContent(htmlBody);
  },

  /**
   * selectBody
   */
  selectBody: function(e) {
    this.$.hiddentextarea.value = this.$.textarea.value;
    this.$.hiddentextarea.removeAttribute("hidden");
    this.$.hiddentextarea.focus();
    this.$.hiddentextarea.select();
    document.execCommand("copy");
    this.$.hiddentextarea.setAttribute("hidden", "hidden");
    window.HaxStore.toast("Copied HTML content");
  },

  /**
   * HTML to HAX Elements
   */
  htmlToHaxElements: function(e) {
    let elements = window.HaxStore.htmlToHaxElements(this.$.textarea.value);
    var str = JSON.stringify(elements, null, 2);
    let val = this.$.textarea.value;
    this.$.hiddentextarea.removeAttribute("hidden");
    this.$.hiddentextarea.value = str;
    this.$.hiddentextarea.focus();
    this.$.hiddentextarea.select();
    document.execCommand("copy");
    this.$.hiddentextarea.value = val;
    this.$.hiddentextarea.setAttribute("hidden", "hidden");
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
    if (this.$.dialog.opened) {
      this.close();
    } else {
      this.$.textarea.editorValue = this.contentToFile(false);
      window.HaxStore.instance.closeAllDrawers(this);
    }
  },

  /**
   * open the dialog
   */
  open: function() {
    this.$.dialog.open();
    this.$.buttons.style.display = "none";
    this.$.loading.setAttribute("loading", "loading");
    this.$.wrapper.appendChild(this.$.textarea);
    // silly but we need the code editor to figure itself out real quick as to sizing
    setTimeout(() => {
      this.$.loading.removeAttribute("loading");
      this.$.buttons.style.display = "unset";
    }, 800);
  },

  /**
   * close the dialog
   */
  close: function() {
    this.$.dialog.close();
  }
});
