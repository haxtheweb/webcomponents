/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  DDDBlockStyles,
  canDDDBlockFullscreen,
  isDDDBlockFullscreen,
  toggleDDDBlockFullscreen,
  listenDDDBlockFullscreen,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";

// security (JS-XSS): a Unity build is code (its loader, framework and any
// .jslib plugins), from a path an author types. It runs in a sandboxed iframe
// with an opaque origin (allow-scripts only, no allow-same-origin), so it
// never runs with the site's origin: no cookies, storage, login, page DOM or
// dialogs. This element only fetches the build files and hands the frame
// their bytes over a MessageChannel; nothing from the build runs here.
const PLAYER_SANDBOX = "allow-scripts allow-pointer-lock";
const BUILD_FILES = {
  loader: ".loader.js",
  framework: ".framework.js",
  data: ".data",
  code: ".wasm",
};
/**
 * The player frame's own document. It knows only the parent origin, posts
 * that origin a MessageChannel port, and boots the build from the bytes that
 * arrive on the port (as blob: URLs in the frame's own opaque origin).
 * @param {String} parentOrigin origin of the page hosting the element
 * @returns {String} srcdoc for the player frame
 */
function playerDocument(parentOrigin) {
  // an origin is scheme://host:port; "<" is escaped anyway so the value can
  // never close the script it is written into
  const origin = JSON.stringify(parentOrigin).replace(/</g, "\\u003c");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html, body { margin: 0; height: 100%; overflow: hidden; }
canvas { display: block; width: 100%; height: 100%; }
</style></head><body><canvas id="unity-canvas" tabindex="0"></canvas><script>
(function () {
  var channel = new MessageChannel();
  var port = channel.port1;
  var started = false;
  function blobUrl(bytes, type) {
    return URL.createObjectURL(new Blob([bytes], { type: type }));
  }
  function report(type, message) {
    port.postMessage({ type: type, message: message ? String(message) : "" });
  }
  port.onmessage = function (e) {
    var d = e.data;
    if (started || !d || d.type !== "unity-webgl-boot") {
      return;
    }
    started = true;
    var canvas = document.getElementById("unity-canvas");
    canvas.style.background = d.background || "";
    var script = document.createElement("script");
    script.onload = function () {
      createUnityInstance(canvas, {
        dataUrl: blobUrl(d.data, "application/octet-stream"),
        frameworkUrl: blobUrl(d.framework, "application/javascript"),
        codeUrl: blobUrl(d.code, "application/wasm"),
        streamingAssetsUrl: d.streamingAssetsUrl,
        company_name: d.companyName,
        product_name: d.productName,
        product_version: d.productVersion
      }).then(function () {
        report("unity-webgl-started");
      }, function (err) {
        report("unity-webgl-error", err);
      });
    };
    script.onerror = function () {
      report("unity-webgl-error", "loader did not run");
    };
    script.src = blobUrl(d.loader, "text/javascript");
    document.body.appendChild(script);
  };
  parent.postMessage({ type: "unity-webgl-port" }, ${origin}, [channel.port2]);
})();
</script></body></html>`;
}

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
class UnityWebgl extends I18NMixin(HTMLElement) {
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
    // shared DDD block frame and header styles; adopted once so every
    // instance shares one parsed sheet. Without constructable stylesheet
    // support the css text is written into the template instead.
    this._adoptedBlockStyles = false;
    if (
      DDDBlockStyles.styleSheet &&
      Array.isArray(this.shadowRoot.adoptedStyleSheets)
    ) {
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets,
        DDDBlockStyles.styleSheet,
      ];
      this._adoptedBlockStyles = true;
    }
    this.t = this.t || {};
    this.t = {
      ...this.t,
      simulation: "Simulation",
      fullScreen: "Full screen",
      exitFullScreen: "Exit full screen",
      player: "Unity WebGL player",
    };
    this._fullscreen = false;
    this._fullscreenChanged = this._fullscreenChanged.bind(this);
    this._toggleFullscreen = this._toggleFullscreen.bind(this);
    this._onFrameMessage = this._onFrameMessage.bind(this);
    // translations only touch the header text, never the running player
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/unity-webgl.en.json", import.meta.url).href + "/../",
      updateCallback: "_updateStrings",
    });
  }
  /**
   * Escape a string before it is written into the shadow template
   */
  _escape(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  /**
   * A width / height / background attribute as a CSS value: only plain CSS
   * value characters, and a value the browser accepts for that property.
   * security (JS-XSS): these attributes are author data written into this
   * element's shadow markup, so quotes, angle brackets, braces and
   * semicolons never get through
   * @param {String} property CSS property the value is for
   * @param {String} value the attribute value
   * @returns {String} the value, or "" when it isn't a plain CSS value
   */
  _cssValue(property, value) {
    if (typeof value !== "string" || !/^[-\w\s.,#%()/+]*$/.test(value)) {
      return "";
    }
    if (
      globalThis.CSS &&
      typeof globalThis.CSS.supports === "function" &&
      !globalThis.CSS.supports(property, value)
    ) {
      return "";
    }
    return value;
  }
  get _label() {
    return `${this.t.simulation} · Unity`;
  }
  get _fullscreenLabel() {
    return this._fullscreen ? this.t.exitFullScreen : this.t.fullScreen;
  }
  /**
   * Full screen is offered only where the browser supports it
   */
  get _canFullscreen() {
    return canDDDBlockFullscreen();
  }
  get _frameBody() {
    return this.shadowRoot.querySelector(".ddd-block-body");
  }
  _fullscreenChanged() {
    const body = this._frameBody;
    this._fullscreen = isDDDBlockFullscreen(this.shadowRoot, body);
    this._updateStrings();
  }
  /**
   * Toggle the frame body (the player frame) in and out of full screen
   */
  _toggleFullscreen() {
    const body = this._frameBody;
    toggleDDDBlockFullscreen(body, this._fullscreen);
  }
  /**
   * Refresh the header text in place; re-rendering would reboot the player
   */
  _updateStrings() {
    if (!this.shadowRoot) {
      return;
    }
    const label = this.shadowRoot.querySelector(".ddd-block-label");
    if (label) {
      label.textContent = this._label;
    }
    const frame = this.shadowRoot.querySelector(".ddd-block-body iframe");
    if (frame) {
      frame.setAttribute("title", this.t.player);
    }
    const button = this.shadowRoot.querySelector(".ddd-block-action");
    if (button) {
      button.setAttribute("aria-label", this._fullscreenLabel);
      button.setAttribute("title", this._fullscreenLabel);
      button.setAttribute("aria-pressed", this._fullscreen ? "true" : "false");
      const icon = button.querySelector("simple-icon-lite");
      if (icon) {
        icon.setAttribute(
          "icon",
          this._fullscreen ? "icons:fullscreen-exit" : "icons:fullscreen",
        );
      }
    }
  }
  /**
   * This is a convention, not the standard to return HTML of the element
   */
  get html() {
    return `
    ${this._adoptedBlockStyles ? "" : `<style>${DDDBlockStyles.cssText}</style>`}
    <style>
      :host {
        display: block;
        width: ${this._cssValue("width", this.width)};
        max-width: 100%;
      }
      .ddd-block-body iframe {
        display: block;
        max-width: 100%;
        border: 0;
      }
      /* the player fills the screen; Unity follows the canvas size */
      .ddd-block-body:fullscreen {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--ddd-theme-default-coalyGray);
      }
      .ddd-block-body:fullscreen iframe {
        width: 100% !important;
        height: 100% !important;
      }
    </style>
    <div class="ddd-block" role="group" aria-labelledby="label">
      <div class="ddd-block-header" part="block-header">
        <span class="ddd-block-chip" aria-hidden="true"><simple-icon-lite icon="hardware:videogame-asset"></simple-icon-lite></span>
        <span class="ddd-block-text" id="label"><span class="ddd-block-label">${this._escape(this._label)}</span></span>
        ${
          this._canFullscreen
            ? `<span class="ddd-block-actions"><button class="ddd-block-action" type="button" aria-label="${this._escape(
                this._fullscreenLabel,
              )}" title="${this._escape(
                this._fullscreenLabel,
              )}" aria-pressed="${
                this._fullscreen ? "true" : "false"
              }"><simple-icon-lite icon="${
                this._fullscreen ? "icons:fullscreen-exit" : "icons:fullscreen"
              }" aria-hidden="true"></simple-icon-lite></button></span>`
            : ""
        }
      </div>
      <div class="ddd-block-body">
      </div>
    </div>`;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    // I18NMixin restores its i18n-manager registration here
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.styleElement(this);
    }
    // set initial values based on attributes in dom node; a missing one
    // stays missing (writing it back would store the string "null")
    ATTRS.forEach((a) => {
      if (this.hasAttribute(a)) {
        this[a] = this.getAttribute(a);
      }
    });
    // with no attributes at all, render the header once anyway
    if (!this.shadowRoot.querySelector(".ddd-block")) {
      clearTimeout(this._debounce);
      this._debounce = setTimeout(() => {
        this.render();
      }, 0);
    }
    listenDDDBlockFullscreen(this._fullscreenChanged, true);
    globalThis.addEventListener("message", this._onFrameMessage);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    listenDDDBlockFullscreen(this._fullscreenChanged, false);
    globalThis.removeEventListener("message", this._onFrameMessage);
    this._closePort();
    // I18NMixin releases its i18n-manager registration here
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  /**
   * Render / rerender the shadowRoot
   */
  render() {
    this.shadowRoot.innerHTML = null;
    // eslint-disable-next-line haxtheweb-html/unsanitized-html-sink -- this element's own template; author attributes pass _escape / _cssValue in the html getter
    this.template.innerHTML = this.html;

    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.constructor.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    const fullscreenButton = this.shadowRoot.querySelector(".ddd-block-action");
    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", this._toggleFullscreen);
    }
    this._startPlayer();
  }
  /**
   * An author-typed path as an absolute http(s) URL, resolved like a link
   * on this page; anything else (javascript:, data:, blob:) is refused
   * @param {String} path the attribute value
   * @returns {String|null} the URL, or null
   */
  _httpUrl(path) {
    if (!path) {
      return null;
    }
    let url;
    try {
      url = new URL(path, globalThis.document.baseURI);
    } catch {
      return null;
    }
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  }
  /**
   * URL of one build file: target + file suffix + compression extension
   * @param {String} suffix one of BUILD_FILES
   * @returns {String|null}
   */
  _buildFileUrl(suffix) {
    const base = this._httpUrl(this.target);
    if (!base) {
      return null;
    }
    // the loader is never compressed; the extension is letters only
    const compression =
      suffix !== BUILD_FILES.loader &&
      typeof this.compression === "string" &&
      /^[a-z0-9]+$/i.test(this.compression)
        ? "." + this.compression
        : "";
    return base + suffix + compression;
  }
  /**
   * Fetch the four build files as bytes. Nothing fetched here runs in this
   * page; it all goes to the sandboxed player frame.
   * @returns {Promise<Object|null>} ArrayBuffers by file, or null
   */
  _fetchBuild() {
    const names = Object.keys(BUILD_FILES);
    const urls = names.map((name) => this._buildFileUrl(BUILD_FILES[name]));
    if (urls.some((url) => !url)) {
      return Promise.resolve(null);
    }
    return Promise.all(
      urls.map((url) =>
        globalThis
          .fetch(url, { credentials: "same-origin" })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`${response.status} loading ${url}`);
            }
            return response.arrayBuffer();
          }),
      ),
    )
      .then((buffers) => {
        const files = {};
        names.forEach((name, i) => {
          files[name] = buffers[i];
        });
        return files;
      })
      .catch((err) => {
        this._playerStatus("error", err && err.message);
        return null;
      });
  }
  _playerStatus(status, message) {
    this._status = status;
    if (status === "error") {
      console.warn(`unity-webgl: ${message || "the build did not start"}`);
    }
  }
  /**
   * Add the sandboxed player frame and start fetching the build
   */
  _startPlayer() {
    this._closePort();
    this._frame = null;
    this._build = null;
    this._status = "idle";
    const body = this._frameBody;
    if (!body || !this._httpUrl(this.target)) {
      return;
    }
    const frame = globalThis.document.createElement("iframe");
    frame.setAttribute("sandbox", PLAYER_SANDBOX);
    frame.setAttribute("allow", "fullscreen; gamepad; autoplay");
    frame.setAttribute("title", this.t.player);
    frame.style.width = this._cssValue("width", this.width);
    frame.style.height = this._cssValue("height", this.height);
    frame.style.background = this._cssValue("background", this.background);
    frame.srcdoc = playerDocument(globalThis.location.origin);
    this._frame = frame;
    this._status = "loading";
    this._build = this._fetchBuild();
    body.appendChild(frame);
  }
  /**
   * The player frame hands over its MessageChannel port once it is ready.
   * Only that frame, with its opaque ("null") origin, is listened to; the
   * build bytes go over the port, never a window-wide postMessage.
   * @param {MessageEvent} e
   */
  _onFrameMessage(e) {
    if (
      !this._frame ||
      e.source !== this._frame.contentWindow ||
      e.origin !== "null" ||
      this._port ||
      !e.data ||
      e.data.type !== "unity-webgl-port" ||
      !e.ports ||
      !e.ports[0]
    ) {
      return;
    }
    const port = e.ports[0];
    this._port = port;
    port.onmessage = (m) => {
      const d = m.data || {};
      if (d.type === "unity-webgl-started") {
        this._playerStatus("started");
      } else if (d.type === "unity-webgl-error") {
        this._playerStatus("error", d.message);
      }
    };
    const build = this._build;
    build.then((files) => {
      if (!files || this._port !== port) {
        return;
      }
      port.postMessage(
        {
          type: "unity-webgl-boot",
          loader: files.loader,
          framework: files.framework,
          data: files.data,
          code: files.code,
          streamingAssetsUrl:
            this._httpUrl(this.streamingurl || "StreamingAssets") || "",
          companyName: this.companyname || "",
          productName: this.productname || "",
          productVersion: this.productversion || "",
          background: this._cssValue("background", this.background),
        },
        [files.loader, files.framework, files.data, files.code],
      );
    });
  }
  _closePort() {
    if (this._port) {
      this._port.onmessage = null;
      this._port.close();
      this._port = null;
    }
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
