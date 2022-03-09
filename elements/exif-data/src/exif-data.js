/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { ESGlobalBridgeStore } from "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * `exif-data`
 * `obtain exif data from slotted elements`
 * @demo demo/index.html
 * @element exif-data
 */
class ExifData extends HTMLElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "exif-data";
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
    this.nodeData = [];
    if (window.WCGlobalBasePath) {
      this.basePath = window.WCGlobalBasePath + "lib/exif-js.js";
    } else {
      this.basePath = new URL("./lib/exif-js.js", import.meta.url).href;
    }
    // see if we already have it imported
    if (ESGlobalBridgeStore.imports["exif-js"]) {
      setTimeout(() => {
        this.__ready = true;
        this.updateExif();
      }, 0);
    } else {
      ESGlobalBridgeStore.load("exif-js", `${this.basePath}`);
      window.addEventListener(
        "es-bridge-exif-js-loaded",
        this._onExifJsLoaded.bind(this)
      );
    }
    this.template = document.createElement("template");
    this.attachShadow({ mode: "open" });
    this.render();
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
  showDetails(item) {
    if (!item) {
      return false;
    }
    let target = this.alignTarget;
    if (!target) {
      target = item.node;
    }
    const dim = target.getBoundingClientRect();
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
    if (this.alignTargetTop) {
      this.dataElement.style.top = this.alignTargetTop;
    } else {
      this.dataElement.style.top = dim.top + "px";
    }
    this.dataElement.style.height = dim.height + "px";
    this.dataElement.style.width = dim.width + "px";
    if (!this.noLeft) {
      this.dataElement.style.left = dim.left + "px";
    }
    this.dataElement.classList.add("showdata");
  }
  clickImage(e) {
    if (e.target.tagName === "IMG") {
      this.nodeData.forEach((item) => {
        if (item.node === e.target) {
          this.showDetails(item);
        }
      });
    }
  }
  /**
   * Load exifData
   */
  getExifData(node, show) {
    if (window.EXIF) {
      window.EXIF.getData(node, () => {
        let data = window.EXIF.getAllTags(node);
        // REALLY verbose field
        delete data.MakerNote;
        delete data.thumbnail;
        this.nodeData.push({
          node: node,
          data: data,
        });
        // if we are told to show this and only 1 item exists, present details
        // this has to happen after getExifData otherwise there's a timing
        // issue because of the unknown length of execution time in getData above
        if (show && this.children.length === 1) {
          this.showDetails(this.nodeData[0]);
        }
      });
    }
  }
  updateExif(show = false) {
    this.nodeData = [];
    this.dataElement.innerHTML = "";
    for (var node of this.childNodes) {
      if (this.__ready && node.tagName && node.tagName === "IMG") {
        this.getExifData(node, show);
      }
    }
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
    if (this.getAttribute("no-events") == null) {
      this.addEventListener("click", this.clickImage.bind(this));
      this.dataElement.addEventListener("click", this.clickData.bind(this));
    }
    if (this.getAttribute("no-left") == null) {
      this.noLeft = false;
    } else {
      this.noLeft = true;
    }
    // any change, update things
    this.observer = new MutationObserver((mutations) => {
      this.updateExif();
    });
    this.observer.observe(this, {
      childList: true,
    });
  }

  disconnectedCallback() {
    if (this.getAttribute("no-events") == null) {
      this.removeEventListener("click", this.clickImage.bind(this));
      this.dataElement.removeEventListener("click", this.clickData.bind(this));
    }
    this.observer.disconnect();
  }
}
window.customElements.define(ExifData.tag, ExifData);
export { ExifData };
