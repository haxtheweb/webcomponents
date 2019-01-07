import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/dl-behavior/dl-behavior.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
`hax-export-dialog`
Export dialog with all export options and settings provided.

* @demo demo/index.html
@microcopy - the mental model for this element
 -

*/
Polymer({
  _template: html`
    <style include="simple-colors">
      :host {
        display: block;
      }
      #dialog {
        z-index: 1000;
        margin-top: 40px;
      }
      .title {
        margin-top: 32px;
        text-align: center;
        padding: 16px;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 32px;
        font-weight: bold;
        font-family: sans-serif;
        text-transform: uppercase;
        color: var(--simple-colors-default-theme-light-green-1);
      }
      .pref-container {
        text-align: left;
        padding: 16px;
      }
      app-drawer {
        --app-drawer-content-container: {
          background-color: rgba(0, 0, 0, 0.7);
        }
        --app-drawer-width: 320px;
      }
      .buttons paper-button:focus,
      .buttons paper-button:hover {
        background-color: var(--simple-colors-default-theme-light-green-1);
        border-color: var(--simple-colors-default-theme-light-green-1);
        outline: 2px solid var(--simple-colors-default-theme-light-green-1);
      }
      .buttons paper-button {
        color: #222222;
        text-transform: none;
        margin: 0;
        background-color: #f8f8f8;
        display: flex;
        border-radius: 0px;
        border-style: solid;
        border-width: 1px;
        min-width: unset;
        font-size: 12px;
        font-weight: bold;
      }
      #closedialog {
        float: right;
        top: 135px;
        right: 0;
        position: absolute;
        padding: 4px;
        margin: 0;
        color: var(--simple-colors-default-theme-light-green-1, green);
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
    </style>
    <app-drawer id="dialog" align="right" transition-duration="300">
      <h3 class="title">[[title]]</h3>
      <div style="height: 100%; overflow: auto;" class="pref-container">
        <textarea id="textarea" rows="20"></textarea>
        <div class="buttons">
          <paper-button id="downloadfull" raised=""
            >Download as full file</paper-button
          >
          <paper-button id="download" raised=""
            >Download HTML contents only</paper-button
          >
          <paper-button id="copy" raised="">Copy to clipboard</paper-button>
          <paper-button
            id="import"
            raised=""
            hidden\$="[[!globalPreferences.haxDeveloperMode]]"
            >Import textarea into HAX</paper-button
          >
          <paper-button
            id="elementexport"
            raised=""
            hidden\$="[[!globalPreferences.haxDeveloperMode]]"
            >Copy as HAX schema to clipboard</paper-button
          >
        </div>
      </div>
      <paper-button id="closedialog" on-tap="close">
        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
      </paper-button>
    </app-drawer>
  `,

  is: "hax-export-dialog",

  behaviors: [mtz.FileDownloadBehaviors],

  properties: {
    /**
     * Title when open.
     */
    title: {
      type: String,
      value: "Export"
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
  },

  /**
   * Download file.
   */
  downloadfull: function(e) {
    const data = this.contentToFile(true);
    this.downloadFromData(data, "html", "my-new-webpage");
  },

  /**
   * Download file.
   */
  importContent: function(e) {
    // import contents of this text area into the activeHaxBody
    const htmlBody = this.$.textarea.value;
    return window.HaxStore.instance.activeHaxBody.importContent(htmlBody);
  },

  /**
   * selectBody
   */
  selectBody: function(e) {
    this.$.textarea.focus();
    this.$.textarea.select();
    document.execCommand("copy");
  },

  /**
   * HTML to HAX Elements
   */
  htmlToHaxElements: function(e) {
    let elements = window.HaxStore.htmlToHaxElements(this.$.textarea.value);
    var str = JSON.stringify(elements, null, 2);
    let val = this.$.textarea.value;
    this.$.textarea.value = str;
    this.$.textarea.focus();
    this.$.textarea.select();
    document.execCommand("copy");
    this.$.textarea.value = val;
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
      this.$.textarea.value = this.contentToFile(false);
      window.HaxStore.instance.closeAllDrawers(this);
    }
  },

  /**
   * open the dialog
   */
  open: function() {
    this.$.dialog.open();
  },

  /**
   * close the dialog
   */
  close: function() {
    this.$.dialog.close();
  }
});
