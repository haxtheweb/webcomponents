/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * H5P content is rendered with the MIT-licensed h5p-standalone player
 * (https://www.npmjs.com/package/h5p-standalone), loaded at runtime as a
 * global (H5PStandalone) via ESGlobalBridge. The formerly vendored GPL-3.0
 * H5P core has been removed, so this Apache-2.0 package conveys no H5P core
 * code. lib/h5p-resizer.js and lib/h5p-wrapped-element.js are first-party
 * Apache-2.0 helpers kept alongside this element.
 *
 * `source` may be (a) a raw .h5p file (or a blob: URL of one), which is
 * unzipped in the browser and played with no server, or (b) the URL of an
 * already extracted .h5p folder.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/es-global-bridge/es-global-bridge.js";
import "./lib/h5p-resizer.js";
/**
 * `h5p-element`
 * @element h5p-element
 * `h5p wrapper for loading and presenting .h5p files`
 *
 * @microcopy - language worth noting:
 *  - h5p is it's own eco system, we're just trying to wrap it a bit
 *
 * @lit-element
 * @demo demo/index.html
 */
class H5PElement extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` ${!this.source
      ? html`<h5p-wrapped-element><slot></slot></h5p-wrapped-element>`
      : html`<div
            class="h5p-container"
            data-content-id="wrapper-${this.contentId}"
          ></div>
          ${this.status === "loading" || this.status === "error"
            ? html`<p
                role="status"
                aria-live="polite"
                style="margin:0;padding:var(--ddd-spacing-3, 12px);font-family:var(--ddd-font-navigation, sans-serif);font-size:var(--ddd-font-size-xs, 14px);"
              >
                ${this.status === "loading"
                  ? "Unpacking H5P content…"
                  : this.errorMessage}
              </p>`
            : ""}`}`;
  }

  /**
   * True when source is a .h5p file (or a blob: URL made from one) rather
   * than an already extracted folder.
   */
  get isPackage() {
    return (
      !!this.source &&
      (/\.h5p([?#]|$)/i.test(this.source) || /^blob:/i.test(this.source))
    );
  }

  /**
   * Play a File the user picked or dropped, without uploading it anywhere.
   */
  loadFile(file) {
    if (this._objectUrl) {
      URL.revokeObjectURL(this._objectUrl);
    }
    this._objectUrl = URL.createObjectURL(file);
    this.source = this._objectUrl;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // source changed after first render, e.g. edited in the HAX settings form
    if (
      changedProperties.has("source") &&
      changedProperties.get("source") !== undefined &&
      this.isPackage
    ) {
      this.loadPackage();
    }
  }

  /**
   * Fetch a .h5p, unzip it in memory and play it. No server, no service
   * worker; see lib/h5p-package.js and lib/h5p-package-player.js.
   */
  async loadPackage() {
    const container = this.querySelector(
      '[data-content-id="wrapper-' + this.contentId + '"]',
    );
    if (!container) {
      return false;
    }
    this._disposePlayer();
    const token = (this._loadToken = (this._loadToken || 0) + 1);
    this.status = "loading";
    const started = performance.now();
    try {
      const res = await fetch(this.source);
      if (!res.ok) {
        throw new Error(
          `Could not download the H5P file (HTTP ${res.status}).`,
        );
      }
      const bytes = new Uint8Array(await res.arrayBuffer());
      const [{ unpackH5P }, { renderH5PPackage }] = await Promise.all([
        import("./lib/h5p-package.js"),
        import("./lib/h5p-package-player.js"),
      ]);
      const pkg = unpackH5P(bytes);
      if (token !== this._loadToken) {
        pkg.dispose();
        return false;
      }
      const player = await renderH5PPackage(container, pkg, {
        // one id per load so a stale player never shares state with a new one
        id: this.contentId + "-" + token,
        coreBase: this.h5pStandaloneBase,
      });
      if (token !== this._loadToken) {
        // source changed while this one was starting; drop the stale player
        player.dispose();
        return false;
      }
      this._player = player;
      this.status = "ready";
      this.dispatchEvent(
        new CustomEvent("h5p-package-loaded", {
          bubbles: true,
          composed: true,
          detail: {
            title: pkg.h5p.title,
            mainLibrary: pkg.mainLibraryString,
            files: pkg.files.size,
            bytes: pkg.totalBytes,
            compressedBytes: bytes.length,
            libraries: pkg.libraries.map((l) => l.folder),
            ms: Math.round(performance.now() - started),
          },
        }),
      );
      return true;
    } catch (e) {
      if (token === this._loadToken) {
        this.status = "error";
        this.errorMessage = e && e.message ? e.message : String(e);
        this.dispatchEvent(
          new CustomEvent("h5p-package-error", {
            bubbles: true,
            composed: true,
            detail: { message: this.errorMessage },
          }),
        );
      }
      return false;
    }
  }

  _disposePlayer() {
    if (this._player) {
      this._player.dispose();
      this._player = null;
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Source of the H5P content: a .h5p file (unzipped in the browser) or
       * the URL path to an extracted .h5p content folder
       */
      source: {
        name: "source",
        type: String,
      },
      /**
       * loading | ready | error, for package (.h5p) sources
       */
      status: {
        type: String,
        attribute: false,
      },
      errorMessage: {
        type: String,
        attribute: false,
      },
      /**
       * Optional override for the base URL where the h5p-standalone dist is
       * served (must contain main.bundle.js, frame.bundle.js, styles/h5p.css).
       * Set this to point at an on-prem copy when the default resolution does
       * not match your deployment.
       */
      h5pLibPath: {
        name: "h5pLibPath",
        type: String,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "h5p-element";
  }

  // life cycle
  constructor() {
    super();
    // make a random ID for the targeting
    this.contentId = this.generateUUID();
    this.h5pLibPath = "";
  }
  /**
   * This breaks shadowRoot in LitElement
   */
  createRenderRoot() {
    if (this.source) {
      // rendering into light DOM: drop anything a clone of an already rendered
      // copy brought along, or it sits next to the new render
      this.replaceChildren();
      return this;
    }
    return super.createRenderRoot();
  }
  /**
   * Base URL where the MIT-licensed h5p-standalone dist is served.
   * Defaults to the co-installed package relative to this element; honor an
   * explicit h5pLibPath for on-prem/custom serving.
   */
  get h5pStandaloneBase() {
    if (this.h5pLibPath) {
      return this.h5pLibPath.replace(/\/$/, "") + "/";
    }
    const here = import.meta.url;
    // published @haxtheweb layout: node_modules/@haxtheweb/h5p-element/../../h5p-standalone/dist/
    if (here.includes("/node_modules/@haxtheweb/")) {
      return new URL("../../h5p-standalone/dist/", here).href;
    }
    // local dev layout: webcomponents/elements/h5p-element/../../node_modules/h5p-standalone/dist/
    return new URL("../../node_modules/h5p-standalone/dist/", here).href;
  }
  /**
   * load dependencies that need to be global in scope
   */
  async H5PDepsLoader() {
    this.windowControllers = new AbortController();
    // MIT h5p-standalone player (replaces the formerly vendored GPL H5P core)
    globalThis.addEventListener(
      "es-bridge-h5p-standalone-loaded",
      this.h5pReadyCallback.bind(this),
      { signal: this.windowControllers.signal },
    );
    await globalThis.ESGlobalBridge.requestAvailability().load(
      "h5p-standalone",
      this.h5pStandaloneBase + "main.bundle.js",
    );
  }
  generateUUID() {
    return "item-sss-ss-ss".replace(/s/g, this._uuidPart);
  }
  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.isPackage) {
      // unpack only once the block is actually on screen: a hidden copy (for
      // example one the editor keeps off to the side) never downloads anything
      this._visibilityObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this._visibilityObserver.disconnect();
            this.loadPackage();
          }
        },
        { rootMargin: "200px" },
      );
      this._visibilityObserver.observe(this);
    } else if (
      this.source &&
      globalThis.ESGlobalBridge.requestAvailability().imports[
        "h5p-standalone"
      ] === true &&
      this.contentId
    ) {
      this.setupH5P(this.contentId);
    }
    // no source, try to make use of the wrapped element methodology
    if (!this.source) {
      import("./lib/h5p-wrapped-element.js");
    }
  }
  h5pReadyCallback(_e) {
    if (this.contentId) {
      this.setupH5P(this.contentId);
    }
  }
  /**
   * Hand the .h5p content folder off to the h5p-standalone player.
   */
  async setupH5P(id = 1, displayOptions = {}) {
    displayOptions = Object.assign(displayOptions, {
      frame: (displayOptions.frame = false),
      copyright: (displayOptions.copyright = false),
      embed: (displayOptions.embed = false),
      download: (displayOptions.download = false),
      icon: (displayOptions.icon = false),
      export: (displayOptions.export = false),
    });
    const container = this.querySelector(
      '[data-content-id="wrapper-' + this.contentId + '"]',
    );
    if (!container) {
      return false;
    }
    const H5PStandalone = globalThis.H5PStandalone;
    if (!H5PStandalone || !H5PStandalone.H5P) {
      // player script not available yet
      return false;
    }
    const libBase = this.h5pStandaloneBase;
    await new H5PStandalone.H5P(container, {
      h5pJsonPath: this.source,
      frameJs: libBase + "frame.bundle.js",
      frameCss: libBase + "styles/h5p.css",
      frame: displayOptions.frame,
      copyright: displayOptions.copyright,
      export: displayOptions.export,
      download: displayOptions.download,
      embed: displayOptions.embed,
      icon: displayOptions.icon,
      id: "h5p-iframe-" + id,
    });
    return true;
  }
  connectedCallback() {
    super.connectedCallback();
    // extracted folders go through h5p-standalone; packages need no loader
    if (!this.isPackage) {
      this.H5PDepsLoader();
    }
  }

  /**
   * life cycle, element removed from DOM
   */
  disconnectedCallback() {
    if (this.windowControllers) {
      this.windowControllers.abort();
    }
    if (this._visibilityObserver) {
      this._visibilityObserver.disconnect();
    }
    this._disposePlayer();
    if (this._objectUrl) {
      URL.revokeObjectURL(this._objectUrl);
      this._objectUrl = null;
    }
    super.disconnectedCallback();
  }
}
globalThis.customElements.define("h5p-element", H5PElement);
globalThis.H5P = globalThis.H5P || {};

globalThis.H5PIntegration = globalThis.H5PIntegration || {};

H5PIntegration.l10n = {
  H5P: {
    advancedHelp:
      "Include this script on your website if you want dynamic sizing of the embedded content:",
    author: "Author",
    by: "by",
    close: "Close",
    contentChanged: "This content has changed since you last used it.",
    copyrightInformation: "Rights of use",
    copyrights: "Rights of use",
    copyrightsDescription: "View copyright information for this content.",
    disableFullscreen: "Disable fullscreen",
    download: "Download",
    downloadDescription: "Download this content as a H5P file.",
    embed: "Embed",
    embedDescription: "View the embed code for this content.",
    fullscreen: "Fullscreen",
    h5pDescription: "Visit H5P.org to check out more cool content.",
    hideAdvanced: "Hide advanced",
    license: "License",
    noCopyrights: "No copyright information available for this content.",
    showAdvanced: "Show advanced",
    showLess: "Show less",
    showMore: "Show more",
    size: "Size",
    source: "Source",
    startingOver: "You'll be starting over.",
    subLevel: "Sublevel",
    thumbnail: "Thumbnail",
    title: "Title",
    year: "Year",
  },
};

export { H5PElement };
