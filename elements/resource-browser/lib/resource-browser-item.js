/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `resource-browser-item`
 * `displays a selectable list of resources as a grid or combobox`
 * @demo demo/index.html
 * @element resource-browser-item
 */
class ResourceBrowserItem extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          align-items: center;
          padding: 5px;
        }

        :host([hidden]) {
          display: none;
        }
        *[part="preview"] {
          width: var(--resource-preview-size, 30px);
          height: var(--resource-preview-size, 30px);
          --simple-icon-height: var(--resource-preview-size, 30px);
          --simple-icon-width: var(--resource-preview-size, 30px);
          margin-right: 5px;
        }
        span[part="preview"] {
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: 3px;
        }
        span[part="label"] span {
          display: block;
        }
        span[part="label-secondary"] {
          font-style: italic;
          font-size: 80%;
          opacity: 0.7;
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
   * @memberof ResourceBrowserItem
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
      email: "icons:mail",
    };
  }
  /**
   * default site location
   *
   * @readonly
   * @memberof ResourceBrowserItem
   * @returns {object}
   */
  get currentLocation() {
    return window.location;
  }
  /**
   * URL object from value string
   *
   * @readonly
   * @memberof ResourceBrowserItem
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
   * @memberof ResourceBrowserItem
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
   * @memberof ResourceBrowserItem
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
   * @memberof ResourceBrowserItem
   * @returns {boolean}
   */
  get isAnchor() {
    return this.isSamePage && !!this.resourceURL.hash;
  }

  /**
   * value's file extension
   *
   * @readonly
   * @memberof ResourceBrowserItem
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
    console.log(this.resourceURL, extension);
    return (extension || "").toLowerCase();
  }

  /**
   * file extensions of images that can be previewed on the web
   *
   * @readonly
   * @memberof ResourceBrowserItem
   * @returns {string}
   */
  get imageTypes() {
    return ["gif", "svg", "png", "jpg", "jpeg"];
  }

  /**
   * file extensions of web pages
   *
   * @readonly
   * @memberof ResourceBrowserItem
   * @returns {string}
   */
  get pageTypes() {
    return ["html", "htm", "php", ""];
  }

  /**
   * whether value is a web page
   *
   * @readonly
   * @memberof ResourceBrowserItem
   * @returns {boolean}
   */
  get isPage() {
    return this.pageTypes.includes(this.fileExtension);
  }

  /**
   * whether value is an email address
   *
   * @readonly
   * @memberof ResourceBrowserItem
   * @returns {boolean}
   */
  get isEmail() {
    return !!this.resourceURL && this.resourceURL.protocol === "mailto:";
  }

  /**
   * whether value is an image
   *
   * @readonly
   * @memberof ResourceBrowserItem
   * @returns {boolean}
   */
  get isImage() {
    return this.imageTypes.includes(this.fileExtension);
  }

  /**
   * gets url for preview thumbnail
   *
   * @readonly
   * @memberof ResourceBrowserItem
   * @returns {string}
   */
  get previewSrc() {
    return !!this.preview && this.preview.trim() !== ""
      ? this.preview
      : this.isImage && !!this.value && this.value !== ""
      ? this.value
      : undefined;
  }

  /**
   * icon name for item based
   *
   * @readonly
   * @memberof ResourceBrowserItem
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
      : !!this.fileExtension && this.fileExtension !== ""
      ? this.iconTypes[this.fileExtension]
      : this.iconTypes["file"];
  }

  /**
   * icon template of item
   *
   * @readonly
   * @memberof ResourceBrowserItem
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
   * @memberof ResourceBrowserItem
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
   * @memberof ResourceBrowserItem
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
   * @memberof ResourceBrowserItem
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
   * @memberof ResourceBrowserItem
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
   * @memberof ResourceBrowserItem
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
    return "resource-browser-item";
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
customElements.define(ResourceBrowserItem.tag, ResourceBrowserItem);
export { ResourceBrowserItem };
