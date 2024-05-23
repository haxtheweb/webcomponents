/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { generateResourceID } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/beaker-broker/beaker-broker.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";

/**
 * `haxcms-backend-beaker`
 * `a simple element to check for and fetch JWTs`
 *
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
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
    // see up a tag to place RIGHT next to the site-builder itself
    autorun((reaction) => {
      this.jwt = toJS(store.jwt);
      this.__disposer.push(reaction);
    });
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
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
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
    this.manifest = e.detail;
    // limits options but makes it possible to switch core themes
    if (typeof this.manifest.metadata.theme === "string") {
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
    await this.shadowRoot
      .querySelector("#beaker")
      .write("site.json", JSON.stringify(this.manifest, null, 2));
    // simulate save events since they wont fire
    store.cmsSiteEditor.instance.shadowRoot
      .querySelector("#toast")
      .show("Site details saved!");
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
   * Detatched life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
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
customElements.define(HAXCMSBackendBeaker.tag, HAXCMSBackendBeaker);
export { HAXCMSBackendBeaker };
