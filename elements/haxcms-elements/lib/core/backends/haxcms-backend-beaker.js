/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { generateResourceID } from "@haxtheweb/utils/lib/ids.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import "@haxtheweb/beaker-broker/beaker-broker.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";

/**
 * `haxcms-backend-beaker`
 * `a simple element to check for and fetch JWTs`
 *
 * @microcopy - the mental model for this element
 * - jwt - a JSON Web Token used as an encrypted security token for communication
 */
class HAXCMSBackendBeaker extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-backend-beaker";
  }
  // render function
  render() {
    return html` <beaker-broker id="beaker"></beaker-broker> `;
  }
  static get properties() {
    return {
      /**
       * JSON Web token, it'll come from a global call if it's available
       */
      jwt: {
        type: String,
      },
      /**
       * Store manifest that makes up the site.
       */
      manifest: {
        type: Object,
      },
      /**
       * Track activeItem
       */
      activeItem: {
        type: Object,
      },
    };
  }
  /**
   * Attached life cycle
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.__disposer = [];
    // set up a tag to place RIGHT next to the site-builder itself
    this.__disposer.push(
      autorun((reaction) => {
        this.jwt = toJS(store.jwt);
      }),
    );
    globalThis.addEventListener("jwt-token", this._jwtTokenFired.bind(this), {
      signal: this.windowControllers.signal,
    });

    // HAX CMS events to intercept
    globalThis.addEventListener(
      "haxcms-save-site-data",
      this.saveManifest.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-save-seo-data",
      this.saveSEOSettings.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-save-outline",
      this.saveOutline.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener("haxcms-save-node", this.saveNode.bind(this), {
      signal: this.windowControllers.signal,
    });
    globalThis.addEventListener(
      "haxcms-delete-node",
      this.deleteNode.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-create-node",
      this.createNode.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    // listen for app being selected
    globalThis.addEventListener(
      "hax-app-picker-selection",
      this._appPicked.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  _appPicked(e) {
    if (e.detail.connection.protocol === "dat") {
      e.preventDefault();
      e.stopPropagation();
      let reader = new FileReader();
      reader.onload = (event) => {
        let fileLocation =
          "files/" +
          HAXStore.haxTray.shadowRoot.querySelector("#fileupload").files[0]
            .name;
        this.shadowRoot
          .querySelector("#beaker")
          .write(fileLocation, event.target.result);
        HAXStore.haxTray.shadowRoot.querySelector("#url").value = fileLocation;
        HAXStore.haxTray.shadowRoot
          .querySelector("hax-tray-upload")
          .newAssetConfigure();
      };
      reader.readAsArrayBuffer(
        HAXStore.haxTray.shadowRoot.querySelector("#fileupload").files[0],
      );
    }
  }
  /**
   * Save page data
   */
  async saveNode(e) {
    this.activeItem = e.detail;
    // make sure this location exists
    await this.shadowRoot
      .querySelector("#beaker")
      .write(
        this.activeItem.location,
        await HAXStore.activeHaxBody.haxToContent(),
      );
    store.cmsSiteEditor.instance.shadowRoot
      .querySelector("#toast")
      .show("Page updated!");
    const evt = new CustomEvent("haxcms-trigger-update-node", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: true,
    });
    store.cmsSiteEditor.instance.dispatchEvent(evt);
  }
  /**
   * Outline save event.
   */
  async saveOutline(e) {
    // snag global to be sure we have it set first
    this.manifest = store.cmsSiteEditor.instance.manifest;
    // set items specifically since it's just an outline update
    this.manifest.items = e.detail;
    // loop through and match the data our backend generates
    this.manifest.items.forEach((element, index) => {
      // test for things that are not set and build the whole thing out
      if (typeof element.location === typeof undefined) {
        let id = generateResourceID("item-");
        element.id = id;
        element.location = "pages/" + id + "/index.html";
        element.order = index;
        element.description = "";
        element.metadata = {
          created: Math.floor(Date.now() / 1000),
          updated: Math.floor(Date.now() / 1000),
        };
        // make a directory
        this.shadowRoot.querySelector("#beaker").archive.mkdir("pages/" + id);
        // make the page
        this.shadowRoot
          .querySelector("#beaker")
          .write("pages/" + id + "/index.html", "<p>Ex uno Plures</p>");
        this.manifest.items[index] = element;
      }
    });
    this.shadowRoot
      .querySelector("#beaker")
      .write("site.json", JSON.stringify(this.manifest, null, 2));
    // simulate save events since they wont fire
    store.cmsSiteEditor.instance.shadowRoot
      .querySelector("#toast")
      .show("Outline saved!");
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this.manifest,
      }),
    );
  }
  async saveSEOSettings(e) {
    const detail = e && e.detail ? e.detail : {};
    this.manifest = store.cmsSiteEditor.instance.manifest;
    if (!this.manifest || typeof this.manifest !== "object") {
      return;
    }
    if (this._isScopedSEOPayload(detail)) {
      this._applyScopedSEOPayload(detail);
    } else if (detail && typeof detail === "object") {
      this.manifest = detail;
    }
    await this.shadowRoot
      .querySelector("#beaker")
      .write("site.json", JSON.stringify(this.manifest, null, 2));
    store.cmsSiteEditor.instance.shadowRoot
      .querySelector("#toast")
      .show("SEO settings saved!");
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this.manifest,
      }),
    );
  }
  _boolValue(value, defaultValue) {
    if (value === true || value === "true" || value === 1 || value === "1") {
      return true;
    }
    if (value === false || value === "false" || value === 0 || value === "0") {
      return false;
    }
    return defaultValue;
  }
  _ensureManifestContainers() {
    if (!this.manifest.metadata) {
      this.manifest.metadata = {};
    }
    if (!this.manifest.metadata.site) {
      this.manifest.metadata.site = {};
    }
    if (!this.manifest.metadata.site.settings) {
      this.manifest.metadata.site.settings = {};
    }
    if (!this.manifest.metadata.author) {
      this.manifest.metadata.author = {};
    }
  }
  _isScopedDetailsPayload(detail) {
    if (!detail || typeof detail !== "object") {
      return false;
    }
    return (
      Object.prototype.hasOwnProperty.call(detail, "title") ||
      Object.prototype.hasOwnProperty.call(detail, "homePageId") ||
      Object.prototype.hasOwnProperty.call(detail, "sw") ||
      Object.prototype.hasOwnProperty.call(detail, "forceUpgrade") ||
      (detail.manifest &&
        detail.manifest.site &&
        typeof detail.manifest.site === "object") ||
      (detail.manifest &&
        detail.manifest.seo &&
        typeof detail.manifest.seo === "object")
    );
  }
  _isScopedSEOPayload(detail) {
    if (!detail || typeof detail !== "object") {
      return false;
    }
    return (
      Object.prototype.hasOwnProperty.call(detail, "license") ||
      Object.prototype.hasOwnProperty.call(detail, "description") ||
      Object.prototype.hasOwnProperty.call(detail, "logo") ||
      Object.prototype.hasOwnProperty.call(detail, "domain") ||
      Object.prototype.hasOwnProperty.call(detail, "lang") ||
      Object.prototype.hasOwnProperty.call(detail, "gaID") ||
      Object.prototype.hasOwnProperty.call(detail, "private") ||
      Object.prototype.hasOwnProperty.call(detail, "canonical") ||
      Object.prototype.hasOwnProperty.call(detail, "authorImage") ||
      Object.prototype.hasOwnProperty.call(detail, "authorName") ||
      Object.prototype.hasOwnProperty.call(detail, "authorEmail") ||
      Object.prototype.hasOwnProperty.call(detail, "authorSocialLink") ||
      Object.prototype.hasOwnProperty.call(detail, "pathauto") ||
      Object.prototype.hasOwnProperty.call(detail, "publishPagesOn") ||
      (detail.seo && typeof detail.seo === "object") ||
      (detail.author && typeof detail.author === "object") ||
      (detail.manifest &&
        detail.manifest.author &&
        typeof detail.manifest.author === "object") ||
      (detail.manifest &&
        detail.manifest.seo &&
        typeof detail.manifest.seo === "object")
    );
  }
  _applyScopedDetailsPayload(detail) {
    this._ensureManifestContainers();
    const manifestSite =
      detail &&
      detail.manifest &&
      detail.manifest.site &&
      typeof detail.manifest.site === "object"
        ? detail.manifest.site
        : {};
    const manifestSeo =
      detail &&
      detail.manifest &&
      detail.manifest.seo &&
      typeof detail.manifest.seo === "object"
        ? detail.manifest.seo
        : {};
    if (Object.prototype.hasOwnProperty.call(detail, "title")) {
      this.manifest.title = String(detail.title || "");
    } else if (
      Object.prototype.hasOwnProperty.call(manifestSite, "manifest-title")
    ) {
      this.manifest.title = String(manifestSite["manifest-title"] || "");
    }
    let homePageIdValue = null;
    if (Object.prototype.hasOwnProperty.call(detail, "homePageId")) {
      homePageIdValue = String(detail.homePageId || "").trim();
    } else if (
      Object.prototype.hasOwnProperty.call(
        manifestSite,
        "manifest-metadata-site-homePageId",
      )
    ) {
      homePageIdValue = String(
        manifestSite["manifest-metadata-site-homePageId"] || "",
      ).trim();
    }
    if (homePageIdValue !== null) {
      let validPage = false;
      if (
        homePageIdValue &&
        this.manifest.items &&
        Array.isArray(this.manifest.items)
      ) {
        this.manifest.items.forEach((item) => {
          if (item && item.id === homePageIdValue) {
            validPage = true;
          }
        });
      }
      if (validPage) {
        this.manifest.metadata.site.homePageId = homePageIdValue;
      } else {
        if (
          this.manifest.metadata.site &&
          this.manifest.metadata.site.homePageId
        ) {
          delete this.manifest.metadata.site.homePageId;
        }
        if (
          this.manifest.metadata.site.settings &&
          this.manifest.metadata.site.settings.homePageId
        ) {
          delete this.manifest.metadata.site.settings.homePageId;
        }
      }
    }
    if (Object.prototype.hasOwnProperty.call(detail, "sw")) {
      this.manifest.metadata.site.settings.sw = this._boolValue(
        detail.sw,
        this.manifest.metadata.site.settings.sw,
      );
    } else if (
      Object.prototype.hasOwnProperty.call(
        manifestSeo,
        "manifest-metadata-site-settings-sw",
      )
    ) {
      this.manifest.metadata.site.settings.sw = this._boolValue(
        manifestSeo["manifest-metadata-site-settings-sw"],
        this.manifest.metadata.site.settings.sw,
      );
    }
    if (Object.prototype.hasOwnProperty.call(detail, "forceUpgrade")) {
      this.manifest.metadata.site.settings.forceUpgrade = this._boolValue(
        detail.forceUpgrade,
        this.manifest.metadata.site.settings.forceUpgrade,
      );
    } else if (
      Object.prototype.hasOwnProperty.call(
        manifestSeo,
        "manifest-metadata-site-settings-forceUpgrade",
      )
    ) {
      this.manifest.metadata.site.settings.forceUpgrade = this._boolValue(
        manifestSeo["manifest-metadata-site-settings-forceUpgrade"],
        this.manifest.metadata.site.settings.forceUpgrade,
      );
    }
    this.manifest.metadata.site.updated = Math.floor(Date.now() / 1000);
  }
  _applyScopedSEOPayload(detail) {
    this._ensureManifestContainers();
    const author =
      detail && detail.author && typeof detail.author === "object"
        ? detail.author
        : {};
    const seo =
      detail && detail.seo && typeof detail.seo === "object" ? detail.seo : {};
    const manifestAuthor =
      detail &&
      detail.manifest &&
      detail.manifest.author &&
      typeof detail.manifest.author === "object"
        ? detail.manifest.author
        : {};
    const manifestSeo =
      detail &&
      detail.manifest &&
      detail.manifest.seo &&
      typeof detail.manifest.seo === "object"
        ? detail.manifest.seo
        : {};
    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
    if (hasOwn(detail, "license")) {
      this.manifest.license = String(detail.license || "");
    } else if (hasOwn(author, "license")) {
      this.manifest.license = String(author.license || "");
    } else if (hasOwn(manifestAuthor, "manifest.license")) {
      this.manifest.license = String(manifestAuthor["manifest.license"] || "");
    }
    if (hasOwn(detail, "authorImage")) {
      this.manifest.metadata.author.image = String(detail.authorImage || "");
    } else if (hasOwn(author, "image")) {
      this.manifest.metadata.author.image = String(author.image || "");
    } else if (hasOwn(manifestAuthor, "manifest.metadata.author.image")) {
      this.manifest.metadata.author.image = String(
        manifestAuthor["manifest.metadata.author.image"] || "",
      );
    }
    if (hasOwn(detail, "authorName")) {
      this.manifest.metadata.author.name = String(detail.authorName || "");
    } else if (hasOwn(author, "name")) {
      this.manifest.metadata.author.name = String(author.name || "");
    } else if (hasOwn(manifestAuthor, "manifest.metadata.author.name")) {
      this.manifest.metadata.author.name = String(
        manifestAuthor["manifest.metadata.author.name"] || "",
      );
    }
    if (hasOwn(detail, "authorEmail")) {
      this.manifest.metadata.author.email = String(detail.authorEmail || "");
    } else if (hasOwn(author, "email")) {
      this.manifest.metadata.author.email = String(author.email || "");
    } else if (hasOwn(manifestAuthor, "manifest.metadata.author.email")) {
      this.manifest.metadata.author.email = String(
        manifestAuthor["manifest.metadata.author.email"] || "",
      );
    }
    if (hasOwn(detail, "authorSocialLink")) {
      this.manifest.metadata.author.socialLink = String(
        detail.authorSocialLink || "",
      );
    } else if (hasOwn(author, "socialLink")) {
      this.manifest.metadata.author.socialLink = String(author.socialLink || "");
    } else if (
      hasOwn(manifestAuthor, "manifest.metadata.author.socialLink")
    ) {
      this.manifest.metadata.author.socialLink = String(
        manifestAuthor["manifest.metadata.author.socialLink"] || "",
      );
    }
    if (hasOwn(detail, "description")) {
      this.manifest.description = String(detail.description || "");
    } else if (hasOwn(seo, "description")) {
      this.manifest.description = String(seo.description || "");
    } else if (hasOwn(manifestSeo, "manifest.description")) {
      this.manifest.description = String(manifestSeo["manifest.description"] || "");
    }
    if (hasOwn(detail, "logo")) {
      this.manifest.metadata.site.logo = String(detail.logo || "");
    } else if (hasOwn(seo, "logo")) {
      this.manifest.metadata.site.logo = String(seo.logo || "");
    } else if (hasOwn(manifestSeo, "manifest.metadata.site.logo")) {
      this.manifest.metadata.site.logo = String(
        manifestSeo["manifest.metadata.site.logo"] || "",
      );
    }
    if (hasOwn(detail, "domain")) {
      this.manifest.metadata.site.domain = String(detail.domain || "");
    } else if (hasOwn(seo, "domain")) {
      this.manifest.metadata.site.domain = String(seo.domain || "");
    } else if (hasOwn(manifestSeo, "manifest.metadata.site.domain")) {
      this.manifest.metadata.site.domain = String(
        manifestSeo["manifest.metadata.site.domain"] || "",
      );
    }
    if (hasOwn(detail, "lang")) {
      this.manifest.metadata.site.settings.lang = String(detail.lang || "");
    } else if (hasOwn(seo, "lang")) {
      this.manifest.metadata.site.settings.lang = String(seo.lang || "");
    } else if (hasOwn(manifestSeo, "manifest.metadata.site.settings.lang")) {
      this.manifest.metadata.site.settings.lang = String(
        manifestSeo["manifest.metadata.site.settings.lang"] || "",
      );
    }
    if (hasOwn(detail, "gaID")) {
      this.manifest.metadata.site.settings.gaID = String(detail.gaID || "");
    } else if (hasOwn(seo, "gaID")) {
      this.manifest.metadata.site.settings.gaID = String(seo.gaID || "");
    } else if (hasOwn(manifestSeo, "manifest.metadata.site.settings.gaID")) {
      this.manifest.metadata.site.settings.gaID = String(
        manifestSeo["manifest.metadata.site.settings.gaID"] || "",
      );
    }
    if (hasOwn(detail, "private")) {
      this.manifest.metadata.site.settings.private = this._boolValue(
        detail.private,
        this.manifest.metadata.site.settings.private,
      );
    } else if (hasOwn(seo, "private")) {
      this.manifest.metadata.site.settings.private = this._boolValue(
        seo.private,
        this.manifest.metadata.site.settings.private,
      );
    } else if (
      hasOwn(manifestSeo, "manifest.metadata.site.settings.private")
    ) {
      this.manifest.metadata.site.settings.private = this._boolValue(
        manifestSeo["manifest.metadata.site.settings.private"],
        this.manifest.metadata.site.settings.private,
      );
    }
    if (hasOwn(detail, "canonical")) {
      this.manifest.metadata.site.settings.canonical = this._boolValue(
        detail.canonical,
        this.manifest.metadata.site.settings.canonical,
      );
    } else if (hasOwn(seo, "canonical")) {
      this.manifest.metadata.site.settings.canonical = this._boolValue(
        seo.canonical,
        this.manifest.metadata.site.settings.canonical,
      );
    } else if (
      hasOwn(manifestSeo, "manifest.metadata.site.settings.canonical")
    ) {
      this.manifest.metadata.site.settings.canonical = this._boolValue(
        manifestSeo["manifest.metadata.site.settings.canonical"],
        this.manifest.metadata.site.settings.canonical,
      );
    }
    if (hasOwn(detail, "pathauto")) {
      this.manifest.metadata.site.settings.pathauto = this._boolValue(
        detail.pathauto,
        this.manifest.metadata.site.settings.pathauto,
      );
    } else if (hasOwn(seo, "pathauto")) {
      this.manifest.metadata.site.settings.pathauto = this._boolValue(
        seo.pathauto,
        this.manifest.metadata.site.settings.pathauto,
      );
    } else if (
      hasOwn(manifestSeo, "manifest.metadata.site.settings.pathauto")
    ) {
      this.manifest.metadata.site.settings.pathauto = this._boolValue(
        manifestSeo["manifest.metadata.site.settings.pathauto"],
        this.manifest.metadata.site.settings.pathauto,
      );
    }
    if (hasOwn(detail, "publishPagesOn")) {
      this.manifest.metadata.site.settings.publishPagesOn = this._boolValue(
        detail.publishPagesOn,
        this.manifest.metadata.site.settings.publishPagesOn,
      );
    } else if (hasOwn(seo, "publishPagesOn")) {
      this.manifest.metadata.site.settings.publishPagesOn = this._boolValue(
        seo.publishPagesOn,
        this.manifest.metadata.site.settings.publishPagesOn,
      );
    } else if (
      hasOwn(manifestSeo, "manifest.metadata.site.settings.publishPagesOn")
    ) {
      this.manifest.metadata.site.settings.publishPagesOn = this._boolValue(
        manifestSeo["manifest.metadata.site.settings.publishPagesOn"],
        this.manifest.metadata.site.settings.publishPagesOn,
      );
    }
    this.manifest.metadata.site.updated = Math.floor(Date.now() / 1000);
  }
  /**
   * Outline save event.
   */
  async deleteNode(e) {
    let page = e.detail.item;
    // snag global to be sure we have it set first
    this.manifest = store.cmsSiteEditor.instance.manifest;
    // set items specifically since it's just an outline update
    this.manifest.items = e.detail;
    // loop through and match the data our backend generates
    this.manifest.items.forEach((element, index) => {
      if (element.id === page.id) {
        this.splice("manifest.items", index, 1);
      }
    });
    this.shadowRoot
      .querySelector("#beaker")
      .write("site.json", JSON.stringify(this.manifest, null, 2));
    // simulate save events since they wont fire
    store.cmsSiteEditor.instance.shadowRoot
      .querySelector("#toast")
      .show(`${page.title} deleted`);
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this.manifest,
      }),
    );
  }
  /**
   * createNode
   */
  async createNode(e) {
    let page = e.detail.values;
    // snag global to be sure we have it set first
    this.manifest = store.cmsSiteEditor.instance.manifest;
    // set items specifically since it's just an outline update
    this.manifest.items = e.detail;
    // loop through and match the data our backend generates
    this.manifest.items.forEach((element, index) => {
      // test for things that are not set and build the whole thing out
      if (typeof element.location === typeof undefined) {
        if (!page.id) {
          page.id = generateResourceID("item-");
        }
        if (!page.location) {
          page.location = "pages/" + page.id + "/index.html";
        }
        let directory = page.location.replace("/index.html", "");
        element.id = page.id;
        element.location = page.location;
        element.slug = page.title;
        element.order = page.order;
        element.indent = page.indent;
        element.parent = page.parent;
        element.description = page.description;
        element.metadata.created = Math.floor(Date.now() / 1000);
        element.metadata.updated = Math.floor(Date.now() / 1000);
        // make a directory
        this.shadowRoot.querySelector("#beaker").archive.mkdir(directory);
        // make the page
        this.shadowRoot
          .querySelector("#beaker")
          .write(page.slug, "<p>My great new content!</p>");
        this.manifest.items[index] = element;
      }
    });
    this.shadowRoot
      .querySelector("#beaker")
      .write("site.json", JSON.stringify(this.manifest, null, 2));
    // simulate save events since they wont fire
    store.cmsSiteEditor.instance.shadowRoot
      .querySelector("#toast")
      .show(`${page.title} created!`);
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this.manifest,
      }),
    );
  }
  /**
   * Manifest save event.
   */
  async saveManifest(e) {
    const detail = e && e.detail ? e.detail : {};
    this.manifest = store.cmsSiteEditor.instance.manifest;
    if (!this.manifest || typeof this.manifest !== "object") {
      return;
    }
    if (this._isScopedDetailsPayload(detail)) {
      this._applyScopedDetailsPayload(detail);
    } else {
      this.manifest = detail;
      // limits options but makes it possible to switch core themes
      if (
        this.manifest.metadata &&
        typeof this.manifest.metadata.theme === "string"
      ) {
        const themeData = {
          "haxcms-dev-theme": {
            element: "haxcms-dev-theme",
            path: "@haxtheweb/haxcms-elements/lib/haxcms-dev-theme.js",
            name: "Developer theme",
          },
          "outline-player": {
            element: "outline-player",
            path: "@haxtheweb/outline-player/outline-player.js",
            name: "Outline player",
          },
          "simple-blog": {
            element: "simple-blog",
            path: "@haxtheweb/simple-blog/simple-blog.js",
            name: "Simple blog",
          },
        };
        // if it's not a core theme we can't really do it
        if (themeData[this.manifest.metadata.theme]) {
          this.manifest.metadata.theme = themeData[this.manifest.metadata.theme];
        }
      }
    }
    await this.shadowRoot
      .querySelector("#beaker")
      .write("site.json", JSON.stringify(this.manifest, null, 2));
    // simulate save events since they wont fire
    store.cmsSiteEditor.instance.shadowRoot
      .querySelector("#toast")
      .show("Details saved!");
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    store.cmsSiteEditor.instance.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this.manifest,
      }),
    );
  }
  /**
   * JWT token fired, let's capture it
   */
  _jwtTokenFired(e) {
    this.jwt = e.detail;
    store.jwt = this.jwt;
    if (store.cmsSiteEditor && store.cmsSiteEditor.instance) {
      store.cmsSiteEditor.instance.jwt = this.jwt;
    }
  }
  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  /**
   * Attached life cycle
   */
  async connectedCallback() {
    super.connectedCallback();
    let beaker = this.shadowRoot.querySelector("#beaker");
    this.jwt = beaker.archive.url;
    var info = await beaker.archive.getInfo();
    // test that we have a url (we'll call it jwt for now) and that we own the site
    if (this.jwt != null && typeof this.jwt == "string" && info.isOwner) {
      var appstore = JSON.parse(await beaker.read("appstore.json"));

      // Check if we're in view-only mode - if so, don't import editor
      const viewOnlyMode = UserScaffoldInstance.readMemory("ViewOnlyMode");
      if (!viewOnlyMode) {
        // attempt to dynamically import the hax cms site editor
        // which will appear to be injecting into the page
        // but because of this approach it should be non-blocking
        try {
          // prettier-ignore
          import(
          "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor.js"
        ).then(
          (e) => {
            store.cmsSiteEditorAvailability();
            store.cmsSiteEditor.instance.jwt = this.jwt;
            store.cmsSiteEditor.instance.appStore = appstore;
          },
          (e) => {
            //import failed
          }
        );
        } catch (err) {
          // error in the event this is a double registration
        }
      }
    } else {
      // other things will have to sort out the fact that while we
      // DO have a dynamic backend, we didn't get a hit on the JWT
      // meaning that we are in a dynamic environment but logged out
      // at the moment (or viewing a site we don't have authorization to)
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-not-logged-in", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this,
        }),
      );
    }
  }
}
globalThis.customElements.define(HAXCMSBackendBeaker.tag, HAXCMSBackendBeaker);
export { HAXCMSBackendBeaker };
