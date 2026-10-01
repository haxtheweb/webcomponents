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
    // guard so the light DOM adoption below runs exactly once on first
    // connect; custom element constructors must not set attributes, so all
    // self-mutation (attribute defaults, wrapper styles and light DOM wipe)
    // is deferred to connectedCallback
    this.__lightDomAdopted = false;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    if (!this.__lightDomAdopted) {
      this.__lightDomAdopted = true;
      this.__adoptLightDomImage();
    }
    this.updateconvertedurl();
  }

  /**
   * adopts a pre-upgrade light DOM image (an <img> child or one inside a
   * <template>) and applies the documented default attributes/styles
   */
  __adoptLightDomImage() {
    // progressive enhancement, tho less performant
    let img = this.querySelector("img");
    if (!img) {
      // performance minded prog enhancement
      if (
        this.querySelector("template") &&
        this.querySelector("template").content.children[0] &&
        this.querySelector("template").content.children[0].tagName === "IMG"
      ) {
        img = this.querySelector("template").content.children[0];
      }
    }
    // defaults, using img pulled in or default; img stays null when there is
    // no light DOM image to adopt, so every read below is guarded
    this.alt = (img && img.alt) || this.alt || "";
    this.src = (img && img.src) || this.src || "";
    this.loading = (img && img.loading) || this.loading || "lazy";
    this.decoding = (img && img.decoding) || this.decoding || "async";
    this.fetchpriority =
      (img && img.fetchpriority) || this.fetchpriority || "high";
    // read the width/height ATTRIBUTES (not the IDL properties, which
    // report natural/rendered sizes for images without them)
    this.width = parseInt(
      (img && img.getAttribute("width")) || this.width || 300,
    );
    this.height = parseInt(
      (img && img.getAttribute("height")) || this.height || 200,
    );
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
  /**
   * #3050: a file backing this image was modified in place. The displayed
   * <img> lives in the LIGHT DOM and its src is the computed `srcconverted`
   * URL (not `this.src`), so cache-bust it directly — the persisted `src`
   * attribute (and saved content) stays clean.
   */
  haxHooks() {
    return {
      mediaSourceUpdated: "haxmediaSourceUpdated",
    };
  }
  haxmediaSourceUpdated(path, store) {
    if (!path || !store || typeof store._mediaSrcMatches !== "function") {
      return;
    }
    if (!store._mediaSrcMatches(this.src, path)) return;
    const img = this.querySelector("img");
    if (!img) return;
    const cur = img.getAttribute("src") || img.src || "";
    const base = String(cur).split("?")[0];
    const ts = Date.now();
    img.src = base + (base.indexOf("?") === -1 ? "?" : "&") + "t=" + ts;
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

globalThis.customElements.define(SimpleImg.tag, SimpleImg);
