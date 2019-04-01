import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/notification-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `haxcms-manifest-editor-dialog`
 * `Dialog for presenting an editable manifest of core settings`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
class HAXCMSManifestEditorDialog extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-manifest-editor-dialog";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #publish {
          min-width: 100px;
          background-color: var(--haxcms-color, #ff4081);
        }
        .buttons {
          margin: 8px 0 8px 0;
        }
        paper-button {
          color: var(--simple-colors-default-theme-grey-11);
          margin: 0 5px;
        }
        iron-icon {
          margin-right: 8px;
        }
        simple-icon-picker {
          display: inline-flex;
        }
        label {
          font-size: 14px;
          padding-right: 5px;
          color: var(
            --paper-input-container-label_-_color,
            var(
              --paper-input-container-color,
              var(--secondary-text-color, #000)
            )
          );
        }
      </style>
      <paper-input
        id="sitetitle"
        label="Title"
        required=""
        autofocus=""
        value="[[manifest.title]]"
      ></paper-input>
      <paper-input
        id="domain"
        label="Domain"
        value="[[manifest.metadata.domain]]"
      ></paper-input>
      <paper-input
        id="sitedescription"
        label="Description"
        value="[[manifest.description]]"
      ></paper-input>
      <paper-input
        id="siteimage"
        label="Image"
        value="[[manifest.metadata.image]]"
      ></paper-input>
      <label for="sitecolor">Select a color:</label>
      <simple-colors-picker
        id="sitecolor"
        hex-code="[[manifest.metadata.hexCode]]"
      ></simple-colors-picker>
      <simple-picker id="sitetheme" label="Theme"> </simple-picker>
      <label for="siteicon">Select an icon:</label>
      <simple-icon-picker
        id="siteicon"
        hide-option-labels
        value="[[manifest.metadata.icon]]"
      ></simple-icon-picker>
      <div class="buttons">
        <paper-button id="save" dialog-confirm raised on-tap="_saveTap">
          <iron-icon icon="icons:save"></iron-icon>Save
        </paper-button>
        <paper-button id="cancel" dialog-dismiss raised>
          <iron-icon icon="icons:cancel"></iron-icon>Cancel
        </paper-button>
        <paper-button id="publish" dialog-confirm on-tap="_publishTap" raised>
          <iron-icon icon="icons:cloud-upload"></iron-icon>Publish
        </paper-button>
      </div>
    `;
  }
  static get properties() {
    return {
      /**
       * opened state of the dialog inside here
       */
      opened: {
        type: Boolean,
        notify: true
      },
      /**
       * JSON Outline Schema manifest data
       */
      manifest: {
        type: Object,
        notify: true
      }
    };
  }
  /**
   * Ready life cycle
   */
  ready() {
    super.ready();
    this.__disposer = [];
    autorun(reaction => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
  }
  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.$.sitecolor.addEventListener("change", this._colorChanged.bind(this));
    this.$.sitetheme.addEventListener("change", this._themeChanged.bind(this));
    setTimeout(() => {
      var evt = document.createEvent("UIEvents");
      evt.initUIEvent("resize", true, false, window, 0);
      window.dispatchEvent(evt);
    }, 100);
    let themeOptions = [];
    for (var theme in window.appSettings.themes) {
      let item = [
        {
          alt: window.appSettings.themes[theme].name,
          value: theme
        }
      ];
      themeOptions.push(item);
    }
    this.$.sitetheme.options = themeOptions;
    this.$.sitetheme.value = this.manifest.metadata.theme.element;
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    this.$.sitetheme.removeEventListener(
      "change",
      this._themeChanged.bind(this)
    );
    this.$.sitecolor.removeEventListener(
      "change",
      this._colorChanged.bind(this)
    );
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  /**
   * Use events for real value in theme.
   */
  _themeChanged(e) {
    if (e.detail.value) {
      this.set("manifest.metadata.theme", e.detail.value);
      this.notifyPath("manifest.metadata.theme");
    }
  }
  /**
   * Use events for real value in color area.
   */
  _colorChanged(e) {
    this.set("manifest.metadata.cssVariable", e.detail.value);
    this.notifyPath("manifest.metadata.cssVariable");
    this.set(
      "manifest.metadata.hexCode",
      SimpleColors.colors[
        e.detail.value
          .replace("--simple-colors-default-theme-", "")
          .replace("-7", "")
      ][6]
    );
    this.notifyPath("manifest.metadata.hexCode");
  }
  /**
   * Publish tap
   */
  _publishTap(e) {
    this.dispatchEvent(
      new CustomEvent("haxcms-publish-site", {
        bubbles: true,
        cancelable: false,
        detail: this.manifest
      })
    );
  }
  /**
   * Save hit, send the message to push up the outline changes.
   */
  _saveTap(e) {
    this.set("manifest.title", this.$.sitetitle.value);
    this.notifyPath("manifest.title");
    this.set("manifest.description", this.$.sitedescription.value);
    this.notifyPath("manifest.description");
    this.set("manifest.metadata.image", this.$.siteimage.value);
    this.notifyPath("manifest.metadata.image");
    this.set("manifest.metadata.domain", this.$.domain.value);
    this.notifyPath("manifest.metadata.domain");
    this.set("manifest.metadata.icon", this.$.siteicon.icon);
    this.notifyPath("manifest.metadata.icon");
    this.dispatchEvent(
      new CustomEvent("haxcms-save-site-data", {
        bubbles: true,
        cancelable: false,
        detail: this.manifest
      })
    );
  }
}
window.customElements.define(
  HAXCMSManifestEditorDialog.tag,
  HAXCMSManifestEditorDialog
);
export { HAXCMSManifestEditorDialog };
