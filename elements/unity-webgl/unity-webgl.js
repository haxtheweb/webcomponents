/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
const ATTRS = [
  "target",
  "compression",
  "streamingurl",
  "companyname",
  "productname",
  "productversion",
  "width",
  "height",
  "background",
];
/**
 * `unity-webgl`
 * `Unity WebGL player`
 *
 * @demo demo/index.html
 * @element unity-webgl
 */
class UnityWebgl extends HTMLElement {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "unity-webgl";
  }
  /**
   * object life cycle
   */
  constructor() {
    super();
    // create a template element for processing shadowRoot
    this.template = globalThis.document.createElement("template");
    // create a shadowRoot
    this.attachShadow({ mode: "open" });
  }
  /**
   * This is a convention, not the standard to return HTML of the element
   */
  get html() {
    return `
    <style> 
      :host { 
        display: block;
        width: ${this.width};
        height: ${this.height};
        background: ${this.background};
      }
    </style>
    <canvas role="img" aria-label="Unity WebGL player" style="width: ${this.width}; height: ${this.height}; background: ${this.background}"></canvas>`;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.styleElement(this);
    }
    // set initial values based on attributes in dom node
    ATTRS.forEach((a) => {
      this[a] = this.getAttribute(a);
    });
  }
  /**
   * Render / rerender the shadowRoot
   */
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.constructor.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    var script = globalThis.document.createElement("script");
    script.onload = () => {
      // do stuff with the script
      createUnityInstance(this.shadowRoot.querySelector("canvas"), {
        dataUrl: this.target + ".data." + this.compression,
        frameworkUrl: this.target + ".framework.js." + this.compression,
        codeUrl: this.target + ".wasm." + this.compression,
        streamingAssetsUrl: this.streamingurl,
        company_name: this.companyname,
        product_name: this.productname,
        product_version: this.productversion,
      });
    };
    script.src = this.target + ".loader.js";
    this.shadowRoot.appendChild(script);
    script.onerror = function () {
      console.log("Error loading " + this.src);
    };
  }

  static get observedAttributes() {
    // const set above
    return ATTRS;
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (this.shadowRoot && newValue && oldValue != newValue) {
      clearTimeout(this._debounce);
      this._debounce = setTimeout(() => {
        this.render();
      }, 0);
    }
  }

  set target(val) {
    this.setAttribute("target", val);
  }
  set compression(val) {
    this.setAttribute("compression", val);
  }
  set streamingurl(val) {
    this.setAttribute("streamingurl", val);
  }
  set companyname(val) {
    this.setAttribute("companyname", val);
  }
  set productname(val) {
    this.setAttribute("productname", val);
  }
  set productversion(val) {
    this.setAttribute("productversion", val);
  }
  set width(val) {
    this.setAttribute("width", val);
  }
  set height(val) {
    this.setAttribute("height", val);
  }
  set background(val) {
    this.setAttribute("background", val);
  }

  get target() {
    return this.getAttribute("target");
  }
  get compression() {
    return this.getAttribute("compression");
  }
  get streamingurl() {
    return this.getAttribute("streamingurl");
  }
  get companyname() {
    return this.getAttribute("companyname");
  }
  get productname() {
    return this.getAttribute("productname");
  }
  get productversion() {
    return this.getAttribute("productversion");
  }
  get width() {
    return this.getAttribute("width");
  }
  get height() {
    return this.getAttribute("height");
  }
  get background() {
    return this.getAttribute("background");
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(UnityWebgl.tag, UnityWebgl);
export { UnityWebgl };
