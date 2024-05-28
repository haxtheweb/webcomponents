/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { FileSystemBrokerSingleton } from "@haxtheweb/file-system-broker/file-system-broker.js";
import {
  store,
  HAXcmsStore,
} from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { generateResourceID } from "@haxtheweb/utils/utils.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";

/**
 * `haxcms-backend-userfs`
 * `User file system as backend storage for a hax site. allows offline site building with file system as storage`
 *
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 */
class HAXCMSBackendUserfs extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-backend-userfs";
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
    // file object references so we can load and work with read/write ops
    this.fileObjects = {};
    this.fileRoot = "";
    this.windowControllers = new AbortController();
    this.__disposer = [];
    this.jwt = "hax-cloud-fake";
    // see up a tag to place RIGHT next to the site-builder itself
    autorun((reaction) => {
      this.jwt = toJS(store.jwt);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeItem = toJS(store.activeItem);
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
  // hook into the site builder and load the file system
  // content. if this is called it's because site builder
  // couldn't find content and this method was implemented
  async updateActiveItemContent() {
    let pathTest =
      this.fileRoot + "/" + this.activeItem.location.replace("/index.html", "");
    let fileHandler = await this.fileObjects.filter(
      (f) =>
        f.kind === "file" && f.name === "index.html" && f.folder === pathTest,
    );
    // if we found a match then load include the HTML
    if (fileHandler.length > 0) {
      let pageHTMLContent = await fileHandler[0].handle.getFile();
      HAXcmsStore.storePieces.siteBuilder.activeItemContent = "";
      HAXcmsStore.storePieces.siteBuilder.activeItemContent =
        await pageHTMLContent.text();
    }
  }

  // write content to the active item location
  async writeActiveItemContent(htmlContent) {
    // need to pull <page-break> off and parse
    htmlContent = htmlContent.replace(/<page-break(.*?)><\/page-break>/gm, "");
    // @todo need to parse HAXStore.activeHaxBody.children[0] and ensure it's saved into the manifest
    let pageBreak = await HAXStore.nodeToContent(
      HAXStore.activeHaxBody.children[0],
    );
    // find the file handler that matches the current item based on location match
    let pathTest =
      this.fileRoot + "/" + this.activeItem.location.replace("/index.html", "");
    let fileHandler = await this.fileObjects.filter(
      (f) =>
        f.kind === "file" && f.name === "index.html" && f.folder === pathTest,
    );
    // if we found a match then load include the HTML
    if (fileHandler.length > 0) {
      try {
        const writable = await fileHandler[0].handle.createWritable();
        await writable.write(htmlContent);
        // Close the file and write the contents to disk.
        await writable.close();
        return true;
      } catch (e) {
        console.log(e);
      }
    }
    return false;
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
        // @todo write file to location.write(fileLocation, event.target.result);
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
    if (
      await this.writeActiveItemContent(
        await HAXStore.activeHaxBody.haxToContent(),
      )
    ) {
      store.toast("Page updated!");
      store.cmsSiteEditor.instance.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      store.cmsSiteEditor.instance.dispatchEvent(
        new CustomEvent("haxcms-trigger-update-node", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
    }
  }
  /**
   * Outline save event.
   */
  async saveOutline(e) {
    // snag global to be sure we have it set first
    this.manifest = store.cmsSiteEditor.instance.manifest;
    // set items specifically since it's just an outline update
    this.manifest.items = e.detail;
    // .write("site.json", JSON.stringify(this.manifest, null, 2));
    // simulate save events since they wont fire
    store.toast("Outline saved!");
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
    console.log(e.detail);
    // loop through and match the data our backend generates
    this.manifest.items.forEach((element, index) => {
      if (element.id === page.id) {
        this.splice("manifest.items", index, 1);
      }
    });
    //.write("site.json", JSON.stringify(this.manifest, null, 2));
    // simulate save events since they wont fire
    store.toast(`${page.title} deleted`);
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
        // @todo make a directory for the UUID produced
        //.mkdir(directory);
        // make the page
        //  .write(page.slug, "<p>My great new content!</p>");
        this.manifest.items[index] = element;
      }
    });
    // write to site json
    //.write("site.json", JSON.stringify(this.manifest, null, 2));
    // simulate save events since they wont fire
    store.toast(`${page.title} created!`);
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
    // write to site json
    //.write("site.json", JSON.stringify(this.manifest, null, 2));
    // simulate save events since they wont fire
    store.toast("Site details saved!");
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
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  /**
   * Attached life cycle
   */
  async connectedCallback() {
    super.connectedCallback();
    // @todo need to ensure we have a local file folder selected via hax-cloud
    // @todo read in the appstore.json file from the repo itself
    let appstore = await fetch(
      new URL("../../../../hax-cloud/lib/appstore.json", import.meta.url).href,
    ).then((response) => {
      return response.json();
    });
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
}
customElements.define(HAXCMSBackendUserfs.tag, HAXCMSBackendUserfs);
export { HAXCMSBackendUserfs };
