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
  constructor(delayRender = false) {
    super();
    // create a template element for processing shadowRoot
    this.template = document.createElement("template");
    // create a shadowRoot
    this.attachShadow({ mode: "open" });
    // optional delay in rendering, otherwise it always happens
    if (!delayRender) {
      this.render();
    }
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
    <canvas style="width: ${this.width}; height: ${this.height}; background: ${this.background}"></canvas>`;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
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

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    var script = document.createElement("script");
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

  static get haxProperties() {
    return {
      canScale: false,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Unity Player",
        description: "Unity WebGL Player",
        icon: "av:play-circle-filled",
        color: "purple",
        groups: ["3D"],
        handles: [],
        meta: {
          author: "Brainmedia",
        },
      },
      settings: {
        configure: [
          {
            property: "target",
            title: "Target",
            description: "Target game path",
            inputMethod: "textfield",
          },
          {
            property: "compression",
            title: "Compression method",
            description: "Game's files extention",
            inputMethod: "textfield",
          },
          {
            property: "streamingurl",
            title: "Streaming url",
            description: "Streaming assets url",
            inputMethod: "textfield",
          },
          {
            property: "companyname",
            title: "Company Name",
            description: "Company Name",
            inputMethod: "textfield",
          },
          {
            property: "productname",
            title: "Product Name",
            description: "Game title",
            inputMethod: "textfield",
          },
          {
            property: "productversion",
            title: "Product Version",
            description: "Release Version",
            inputMethod: "textfield",
          },
          {
            property: "width",
            title: "Canvas Width",
            description: "Canvas CSS Width (with px/em/etc.)",
            inputMethod: "textfield",
          },
          {
            property: "height",
            title: "Canvas Height",
            description: "Canvas CSS Height (with px/em/etc.)",
            inputMethod: "textfield",
          },
          {
            property: "background",
            title: "Canvas Background",
            description: "Canvas CSS Background",
            inputMethod: "textfield",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: [],
      },
      demoSchema: [
        {
          tag: "unity-webgl",
          content: "",
          properties: {
            target: "/elements/unity-webgl/demo/example/build web",
            compression: "unityweb",
            streamingurl: "StreamingAssets",
            companyname: "DefaultCompany",
            productname: "test webgl",
            productversion: "0.1",
            width: "460px",
            height: "400px",
            background: "#231F20",
          },
        },
      ],
    };
  }
}
customElements.define(UnityWebgl.tag, UnityWebgl);
export { UnityWebgl };
