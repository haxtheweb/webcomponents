/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * `exif-data`
 * `obtain exif data from slotted elements`
 * @demo demo/index.html
 * @customElement exif-data
 */
class ExifData extends HTMLElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "exif-data";
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  get html() {
    return `
    <style>
      ul.showdata {
        z-index: 1;
        visibility: visible;
        opacity: .9;
      }
      ul {
        position: absolute;
        transition: 0.3s linear all;
        background-color: #000000;
        opacity: 0;
        visibility: hidden;
        overflow: scroll;
        padding: 0;
        margin: 0;
      }
      ul li {
        padding: 8px;
        font-size: 14px;
        color: white;
      }
    </style>
    <slot></slot>
    <ul id="data"></ul>`;
  }
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  /**
   * life cycle
   */
  constructor() {
    super();
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("exif-js", `${basePath}lib/exif-js.js`);
    window.addEventListener(
      "es-bridge-exif-js-loaded",
      this._onExifJsLoaded.bind(this)
    );
    this.template = document.createElement("template");
    this.attachShadow({ mode: "open" });
    this.render();
    this.addEventListener("click", this.clickImage.bind(this));
  }
  /**
   * Library loaded
   */
  _onExifJsLoaded() {
    window.removeEventListener(
      "es-bridge-exif-js-loaded",
      this._onExifJsLoaded.bind(this)
    );
    this.__ready = true;
    this.updateExif();
  }
  clickImage(e) {
    if (e.target.tagName === "IMG") {
      this.nodeData.forEach(item => {
        if (item.node === e.target) {
          const dim = item.node.getBoundingClientRect();
          var content = "";
          for (var key in item.data) {
            if (
              item.data[key] != "" &&
              item.data[key] != false &&
              item.data[key] != " " &&
              item.data[key] != 0 &&
              item.data[key] != null
            ) {
              content += `<li><strong>${key}</strong>: ${item.data[key]}</li>`;
            }
          }
          this.dataElement.innerHTML = content;
          this.dataElement.style.top = dim.top + "px";
          this.dataElement.style.height = dim.height + "px";
          this.dataElement.style.width = dim.width + "px";
          this.dataElement.style.left = dim.left + "px";
          this.dataElement.classList.add("showdata");
        }
      });
    }
  }
  /**
   * Load exifData
   */
  getExifData(node) {
    window.EXIF.getData(node, () => {
      let data = window.EXIF.getAllTags(node);
      // REALLY verbose field
      delete data.MakerNote;
      delete data.thumbnail;
      this.nodeData.push({
        node: node,
        data: data
      });
    });
  }
  updateExif() {
    this.nodeData = [];
    this.dataElement.innerHTML = "";
    this.childNodes.forEach(node => {
      if (this.__ready && node.tagName && node.tagName === "IMG") {
        this.getExifData(node);
      }
    });
  }
  clickData(e) {
    this.dataElement.classList.remove("showdata");
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
    this.dataElement = this.shadowRoot.querySelector("#data");
    this.dataElement.addEventListener("click", this.clickData.bind(this));

    // any change, update things
    this.observer = new MutationObserver(mutations => {
      this.updateExif();
    });
    this.observer.observe(this, {
      childList: true
    });
  }

  disconnectedCallback() {
    this.dataElement.removeEventListener("click", this.clickData.bind(this));
    this.observer.disconnect();
  }
}
window.customElements.define(ExifData.tag, ExifData);
export { ExifData };
