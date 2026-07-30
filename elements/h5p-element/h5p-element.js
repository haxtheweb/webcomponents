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
        ></div>`}`;
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
       * Source of the .h5p file (URL path to an extracted .h5p content folder)
       */
      source: {
        name: "source",
        type: String,
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
    if (
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
  h5pReadyCallback(e) {
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
      '[data-content-id="wrapper-' + this.contentId + '"',
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
    this.H5PDepsLoader();
  }

  /**
   * life cycle, element removed from DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
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
