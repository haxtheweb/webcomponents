/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `simple-fields-url-combo-item`
 * `displays a selectable list of resources as a grid or combobox`
 * @demo demo/index.html
 * @element simple-fields-url-combo-item
 */
class SimpleFieldsUrlComboItem extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          align-items: center;
          padding: var(--simple-fields-button-padding, 2px);
          font-size: var(--simple-fields-detail-font-size, 12px);
        }

        :host([hidden]) {
          display: none;
        }
        *[part="preview"] {
          width: var(--simple-fields-url-combo-preview-size, 26px);
          height: var(--simple-fields-url-combo-preview-size, 26px);
          --simple-icon-height: var(
            --simple-fields-url-combo-preview-size,
            26px
          );
          --simple-icon-width: var(
            --simple-fields-url-combo-preview-size,
            26px
          );
          margin-right: var(--simple-fields-button-padding, 2px);
        }
        span[part="preview"] {
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: var(--simple-fields-border-radius, 2px);
        }
        span[part="label"] {
          max-width: 100%;
          flex: 1 1 auto;
        }
        span[part="label"] span {
          display: block;
          line-height: 100%;
          margin: 0;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        span[part="label-secondary"] {
          font-size: var(--simple-fields-meta-font-size, 10px);
          opacity: var(--simple-fields-meta-opacity, unset);
          color: var(--simple-fields-meta-color);
        }
      `,
    ];
  }

  // Template return function
  render() {
    return html`${this.previewTemplate}${this.labelTemplate}`;
  }
  /**
   * default list of icons by file extension
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   */
  get iconTypes() {
    return {
      anchor: "hax:anchor",
      page: "lrn:content",
      pdf: "hax:file-pdf",
      doc: "hax:file-doc",
      docx: "hax:file-docx",
      ppt: "hax:file-ppt",
      pptx: "hax:file-ppt",
      csv: "hax:file-csv",
      xls: "hax:file-xls",
      xlsx: "hax:file-xls",
      url: "icons:language",
      file: "hax:file-blank",
      mp4: "av:movie",
      mov: "av:movie",
      webm: "av:movie",
      mp3: "av:volume-up",
      wav: "av:volume-up",
      html: "icons:language",
      tel: "communication:phone",
      email: "icons:mail",
    };
  }
  /**
   * default site location
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {object}
   */
  get currentLocation() {
    return globalThis.location;
  }
  /**
   * URL object from value string
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {object}
   */
  get resourceURL() {
    let url = new URL(this.value || "./", this.currentLocation);
    return url;
  }

  /**
   * whether or not value is local to current site
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {boolean}
   */
  get isLocal() {
    return (
      !!this.resourceURL.hostname &&
      this.resourceURL.hostname == this.currentLocation.hostname
    );
  }
  /**
   * whether or not value on same as current location
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {boolean}
   */
  get isSamePage() {
    return (
      this.isLocal &&
      `${this.resourceURL.pathname}${this.resourceURL.search}` ===
        `${this.currentLocation.pathname}${this.currentLocation.search}`
    );
  }

  /**
   * whether or not value is an anchor on current page
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {boolean}
   */
  get isAnchor() {
    return this.isSamePage && !!this.resourceURL.hash;
  }

  /**
   * value's file extension
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {string}
   */
  get fileExtension() {
    let pathname =
        !!this.resourceURL && !!this.resourceURL.pathname
          ? this.resourceURL.pathname
          : "",
      parts = pathname.match(/\.\w+$/),
      extension =
        parts && parts[0]
          ? parts[0].replace(/^\./, "")
          : !!this.type
            ? this.type
            : "";
    return (extension || "").toLowerCase();
  }

  /**
   * file extensions of images that can be previewed on the web
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {string}
   */
  get imageTypes() {
    return ["gif", "svg", "png", "jpg", "jpeg"];
  }

  /**
   * file extensions of web pages
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {string}
   */
  get pageTypes() {
    return ["html", "htm", "php", ""];
  }

  /**
   * whether value is a web page
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {boolean}
   */
  get isPage() {
    return this.pageTypes.includes(this.fileExtension);
  }

  /**
   * whether value is an email address
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {boolean}
   */
  get isEmail() {
    return !!this.resourceURL && this.resourceURL.protocol === "mailto:";
  }

  /**
   * whether value is a phone number
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {boolean}
   */
  get isPhone() {
    return !!this.resourceURL && this.resourceURL.protocol === "tel:";
  }

  /**
   * whether value is an image
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {boolean}
   */
  get isImage() {
    return this.imageTypes.includes(this.fileExtension);
  }

  /**
   * gets url for preview thumbnail
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {string}
   */
  get previewSrc() {
    return !!this.preview && this.preview.trim() !== ""
      ? this.preview
      : // not sure we want images auto loading
        //: this.isImage && !!this.value && this.value !== ""
        //? this.value
        undefined;
  }

  /**
   * icon name for item based
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {string}
   */
  get iconName() {
    return !!this.icon && this.icon.trim() !== ""
      ? this.icon
      : this.isAnchor
        ? this.iconTypes["anchor"]
        : this.isLocal && this.isPage
          ? this.iconTypes["page"]
          : this.isPage
            ? this.iconTypes["html"]
            : this.isEmail
              ? this.iconTypes["email"]
              : this.isPhone
                ? this.iconTypes["tel"]
                : !!this.fileExtension && this.fileExtension !== ""
                  ? this.iconTypes[this.fileExtension]
                  : this.iconTypes["file"];
  }

  /**
   * icon template of item
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {object}
   */
  get iconTemplate() {
    return html`<simple-icon-lite
      part="preview"
      icon="${this.iconName}"
    ></simple-icon-lite>`;
  }
  /**
   * preview image template of item
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {object}
   */
  get imageTemplate() {
    return html`<span
      part="preview"
      style="background-image: url(${this.previewSrc})"
    ></span>`;
  }

  /**
   * preview template, based on preview or icon by default;
   * if none is provided, template based on previewSrc or iconName
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {object}
   */
  get previewTemplate() {
    return !!this.preview && this.preview !== ""
      ? this.imageTemplate
      : !!this.icon && this.icon !== ""
        ? this.iconTemplate
        : !!this.previewSrc && this.previewSrc !== ""
          ? this.imageTemplate
          : !!this.iconName && this.iconName !== ""
            ? this.iconTemplate
            : "";
  }
  /**
   * label template for item
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {object}
   */
  get labelTemplate() {
    return html`<span part="label">
      ${this.primaryLabelTemplate}
      ${!!this.name && this.name.trim() !== ""
        ? this.secondaryLabelTemplate
        : ""}
    </span>`;
  }
  /**
   * primary label template with item name or value
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {object}
   */
  get primaryLabelTemplate() {
    return !!this.name && this.name.trim() !== ""
      ? html`<span part="label-primary">${this.name}</span>`
      : !!this.value && this.value.trim() !== ""
        ? html`<span part="label-primary">${this.value}</span>`
        : "";
  }

  /**
   * secondary label template with item value
   *
   * @readonly
   * @memberof SimpleFieldsUrlComboItem
   * @returns {object}
   */
  get secondaryLabelTemplate() {
    return !!this.value && this.value.trim() !== ""
      ? html`<span part="label-secondary">${this.value}</span>`
      : "";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * human readable name, label, text, or title of resource
       */
      name: {
        name: "name",
        type: String,
        reflectToAttribute: true,
      },

      /**
       * optional: preferred icon for resource
       */
      icon: {
        name: "icon",
        type: String,
        reflectToAttribute: true,
      },

      /**
       * optional: preferred url for thumbnail image preview of resource
       */
      preview: {
        name: "preview",
        type: String,
        reflectToAttribute: true,
      },

      /**
       * optional: preferred resource file type
       */
      type: {
        name: "type",
        type: String,
        reflectToAttribute: true,
      },

      /**
       * url, src, id, filename or other unique value for resource
       */
      value: {
        name: "value",
        type: String,
        reflectToAttribute: true,
      },
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "simple-fields-url-combo-item";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {}
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define(SimpleFieldsUrlComboItem.tag, SimpleFieldsUrlComboItem);
export { SimpleFieldsUrlComboItem };
