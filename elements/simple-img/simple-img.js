import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableCoreServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";

export class SimpleImg extends HTMLElement {
  static get tag() {
    return "simple-img";
  }

  constructor() {
    super();
    // core services so we can access image manipulation
    enableCoreServices();
    // simple-image
    // simple image conversion work
    this.rendering = false;
    // progressive enhancement, tho less performant
    var img = this.querySelector("img");
    if (!img) {
      // performance minded prog enhancement
      if (
        this.querySelector("template") &&
        this.querySelector("template").content.children[0] &&
        this.querySelector("template").content.children[0].tagName === "IMG"
      ) {
        img = this.querySelector("template").content.children[0];
      } else {
        img = {};
      }
    }
    // defaults, using img pulled in or default
    this.alt = img.alt || this.alt || "";
    this.src = img.src || this.src || "";
    this.loading = img.loading || this.loading || "lazy";
    this.decoding = img.decoding || this.decoding || "async";
    this.fetchpriority = img.fetchpriority || this.fetchpriority || "high";
    this.width = parseInt(img.width || this.width || 300);
    this.height = parseInt(img.height || this.height || 200);
    // defaults on the wrapper element
    this.style.display = "inline-block";
    this.style.width = this.width + "px";
    this.style.height = this.height + "px";
    // wipe anything that may be here from before as we'll replace with our own
    this.innerHTML = null;
    this.quality = this.quality || 80;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  // notice these changing
  static get observedAttributes() {
    return [
      "srcconverted",
      "src",
      "loading",
      "fetchpriority",
      "decoding",
      "alt",
      "quality",
      "height",
      "width",
      "rotate",
      "fit",
      "watermark",
      "wmspot",
      "format",
    ];
  }

  // user params to generate and set the converted src
  updateconvertedurl() {
    // src is only actually required property
    if (this.src) {
      const params = {
        height: this.height,
        width: this.width,
        quality: this.quality,
        src: this.src,
        rotate: this.rotate,
        fit: this.fit,
        watermark: this.watermark,
        wmspot: this.wmspot,
        format: this.format,
      };
      this.srcconverted = MicroFrontendRegistry.url(
        "@core/imgManipulate",
        params,
      );
    }
  }

  // rerender when we get hits on these important aspects
  attributeChangedCallback(attr, oldValue, newValue) {
    if (
      [
        "width",
        "height",
        "quality",
        "src",
        "rotate",
        "fit",
        "format",
        "watermark",
        "wmspot",
      ].includes(attr)
    ) {
      this.updateconvertedurl();
    }
    // render when srcconverted is set
    if (attr === "srcconverted" && this.src != "" && !this.rendering) {
      this.rendering = true;
      // loads the image in the background in-case of quality change
      // also then supports failure events
      let i = new Image();
      i.onload = () => {
        this.render(this.srcconverted);
      };
      // try loading just the normal one if this bombed
      i.onerror = () => {
        this.render(this.src);
      };
      i.src = this.srcconverted;
    }
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.updateconvertedurl();
  }
  // render a given src as it will be calculated
  render(src) {
    this.innerHTML = null;
    this.innerHTML = `
    <img 
      src="${src}" 
      height="${this.height}" 
      width="${this.width}" 
      alt="${this.alt}" 
      fetchpriority="${this.fetchpriority}"
      decoding="${this.decoding}"
      loading="${this.loading}"
    />`;
    this.rendering = false;
  }

  // getter and setter palooza
  get rotate() {
    return this.getAttribute("rotate");
  }

  set rotate(val) {
    this.setAttribute("rotate", val);
  }

  get fit() {
    return this.getAttribute("fit");
  }

  set fit(val) {
    this.setAttribute("fit", val);
  }

  get watermark() {
    return this.getAttribute("watermark");
  }

  set watermark(val) {
    this.setAttribute("watermark", val);
  }

  get wmspot() {
    return this.getAttribute("wmspot");
  }

  set wmspot(val) {
    this.setAttribute("wmspot", val);
  }

  get format() {
    return this.getAttribute("format");
  }

  set format(val) {
    this.setAttribute("format", val);
  }

  get height() {
    return this.getAttribute("height");
  }

  set height(val) {
    this.setAttribute("height", val);
  }

  get width() {
    return this.getAttribute("width");
  }

  set width(val) {
    this.setAttribute("width", val);
  }

  get src() {
    return this.getAttribute("src");
  }

  set src(val) {
    this.setAttribute("src", val);
  }

  set srcconverted(val) {
    this.setAttribute("srcconverted", val);
  }

  get srcconverted() {
    return this.getAttribute("srcconverted");
  }

  set loading(val) {
    this.setAttribute("loading", val);
  }

  get loading() {
    return this.getAttribute("loading");
  }

  set fetchpriority(val) {
    this.setAttribute("fetchpriority", val);
  }

  get fetchpriority() {
    return this.getAttribute("fetchpriority");
  }

  get quality() {
    return this.getAttribute("quality");
  }

  set quality(val) {
    this.setAttribute("quality", val);
  }

  get alt() {
    return this.getAttribute("alt");
  }

  set alt(val) {
    this.setAttribute("alt", val);
  }

  get baseurl() {
    return this.getAttribute("baseurl");
  }

  set baseurl(val) {
    this.setAttribute("baseurl", val);
  }

  get decoding() {
    return this.getAttribute("decoding");
  }

  set decoding(val) {
    this.setAttribute("decoding", val);
  }
}

customElements.define(SimpleImg.tag, SimpleImg);
