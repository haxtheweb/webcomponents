import {
  observable,
  makeObservable,
  computed,
  autorun,
  toJS,
  configure,
} from "mobx";
import { varExists, varGet } from "@lrnwebcomponents/utils/utils.js";
import { JsonOutlineSchema } from "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
configure({ enforceActions: false, useProxies: "ifavailable" }); // strict mode off
class Store {
  constructor() {
    this.location = null;
    this.jwt = null;
    this.setupSlots = {};
    this.editMode = false;
    this.manifest = null;
    this.activeItemContent = "";
    this.themeElement = null;
    this.t = {
      close: "Close",
    };
    this.activeId = null;
    this.userData = {};
    this.cmsSiteEditor = {
      instance: null,
    };
    this.cmsSiteEditorBackend = {
      instance: null,
    };
    this.dashboardOpened = false;
    makeObservable(this, {
      location: observable.ref, // router location in url
      editMode: observable, // global editing state
      jwt: observable, // json web token
      dashboardOpened: observable, // if haxcms backend settings are open
      userData: observable, // user data object for logged in users
      manifest: observable, // JOS / manifest
      activeItemContent: observable, // active site content, cleaned up
      themeElement: observable, // theme element
      routerManifest: computed, // router mixed in manifest w/ routes / paths
      siteTitle: computed,
      isLoggedIn: computed, // simple boolean for state so we can style based on logged in
      themeData: computed, // get the active theme from manifest + activeId
      homeLink: computed,
      activeId: observable, // this affects all state changes associated to activeItem
      activeItem: computed, // active item object
      activeItemFields: computed, // active item field values
      activeManifestIndex: computed, // active array index, used for pagination
      activeManifestIndexCounter: computed, // active array index counter, used for pagination
      activeTitle: computed, // active page title
      parentTitle: computed, // active page parent title
      ancestorTitle: computed, // active page ancestor title
    });
  }
  /**
   * Get a unique slug name / path based on existing slug, page data and if we are to automatically generate
   * @param {*} slug
   * @param {*} page
   * @param {*} pathAuto
   * @returns
   */
  getUniqueSlugName(slug, page = null, pathAuto = false) {
    let rSlug = slug;
    // check for pathauto setting and this having a parent
    if (page != null && page.parent != null && page.parent != "" && pathAuto) {
      let item = page;
      let pieces = [slug];
      while ((item = this.findItem(item.parent))) {
        let tmp = item.slug.split("/");
        pieces.unshift(tmp.pop());
      }
      slug = pieces.join("/");
      rSlug = slug;
    }
    let loop = 0;
    let ready = false;
    // while not ready, keep checking
    while (!ready) {
      ready = true;
      // loop through items
      for (var key in this.manifest.items) {
        let item = this.manifest.items[key];
        // if our slug matches an existing
        if (rSlug == item.slug) {
          // if we have a page, and it matches that, bail out cause we have it already
          if (page != null && item.id == page.id) {
            return rSlug;
          } else {
            // increment the number
            loop++;
            // append to the new slug
            rSlug = slug + "-" + loop;
            // force a new test
            ready = false;
          }
        }
      }
    }
    return rSlug
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^0-9\-\/a-z]/gi, "");
  }
  /**
   * Global toast bridge so we don't have to keep writing custom event
   */
  toast(
    message,
    duration = 2000,
    classStyle = "capsule",
    closeText = this.t.close,
    eventCallback = null,
    slot = null
  ) {
    // gets it all the way to the top immediately
    window.dispatchEvent(
      new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: message,
          duration: duration,
          classStyle: classStyle,
          closeText: closeText,
          eventCallback: eventCallback,
          slot: slot,
        },
      })
    );
  }
  /**
   * Load a manifest / site.json / JSON outline schema
   * and prep it for usage in HAXcms
   */
  async loadManifest(manifest, target = null) {
    // support a custom target or ensure event fires off window
    if (target == null && window) {
      target = window;
    }
    // @todo replace this with a schema version mapper
    // once we have versions
    if (varExists(manifest, "metadata.siteName")) {
      let git = varGet(manifest, "publishing.git", {});
      manifest.metadata.site = {
        name: manifest.metadata.siteName,
        git: git,
        created: manifest.metadata.created,
        updated: manifest.metadata.updated,
      };
      manifest.metadata.theme.variables = {
        image: manifest.metadata.image,
        icon: manifest.metadata.icon,
        hexCode: manifest.metadata.hexCode,
        cssVariable: manifest.metadata.cssVariable,
      };
      manifest.metadata.node = {
        dynamicElementLoader: manifest.metadata.dynamicElementLoader,
        fields: manifest.metadata.fields,
      };
      delete manifest.metadata.publishing;
      delete manifest.metadata.created;
      delete manifest.metadata.updated;
      delete manifest.metadata.siteName;
      delete manifest.metadata.image;
      delete manifest.metadata.icon;
      delete manifest.metadata.hexCode;
      delete manifest.metadata.cssVariable;
      delete manifest.metadata.dynamicElementLoader;
      delete manifest.metadata.fields;
    }
    // repair slug not being in earlier builds of json schema
    await manifest.items.forEach((item, index, array) => {
      // if we did not have a slug, generate one off location
      if (!item.slug) {
        array[index].slug = item.location
          .replace("pages/", "")
          .replace("/index.html", "");
      }
      // we default published to true if not set
      // this avoids constantly checking downstream
      if (!item.metadata.hasOwnProperty("published")) {
        array[index].metadata.published = true;
      }
      // fix order typing
      array[index].order = Number(array[index].order);
      // we default locked to false if not set
      if (!item.metadata.hasOwnProperty("locked")) {
        array[index].metadata.locked = false;
      }
      // we default locked to false if not set
      if (!item.metadata.hasOwnProperty("status")) {
        array[index].metadata.status = "";
      }
    });
    var site = new JsonOutlineSchema();
    // we already have our items, pass them in
    var nodes = site.itemsToNodes(manifest.items);
    // smash outline into flat to get the correct order
    var correctOrder = site.nodesToItems(nodes);
    var newItems = [];
    // build a new array in the correct order by pushing the old items around
    for (var key in correctOrder) {
      newItems.push(
        manifest.items.find((element) => {
          return element.id === correctOrder[key].id;
        })
      );
    }
    manifest.items = newItems;
    this.manifest = manifest;
    target.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: manifest,
      })
    );
    window.dispatchEvent(
      new CustomEvent("haxcms-item-rebuild", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      })
    );
  }
  /**
   * Ensure there's a copy of the site-editor globally available
   */
  cmsSiteEditorAvailability() {
    if (!this.cmsSiteEditor.instance) {
      this.cmsSiteEditor.instance = document.createElement(
        "haxcms-site-editor"
      );
    }
    return this.cmsSiteEditor.instance;
  }

  get processedItems() {}
  /**
   * Compute items leveraging the site query engine
   */
  _computeItems(start, end, parent, dynamicMethodology, _routerManifest) {
    if (_routerManifest) {
      let items = [];
      let data = [];
      let tmpItem;
      _routerManifest.items.forEach((element) => {
        // find top level parents
        if (!element.parent) {
          items.push(element);
        }
      });
      switch (dynamicMethodology) {
        case "parent":
          tmpItem = _routerManifest.items.find((d) => parent === d.id);
          // shift up 1 if we found something
          if (tmpItem) {
            parent = tmpItem.parent;
          }
          break;
        case "ancestor":
          tmpItem = _routerManifest.items.find((d) => parent === d.id);
          // walk back up to the root
          while (tmpItem && tmpItem.parent != null) {
            // take the parent object of this current item
            tmpItem = _routerManifest.items.find((i) => i.id == tmpItem.parent);
          }
          if (tmpItem) {
            parent = tmpItem.id;
          }
          break;
      }
      items.forEach((item, i) => {
        this._spiderChildren(item, data, start, end, parent, false);
      });
      return data;
    }
  }
  /**
   * Recursively search through a data to find children
   * of a specified item.
   */
  _setChildren(item, data) {
    // find all children
    const children = data.filter((d) => item.id === d.parent);
    item.children = children;
    if (item.children.length > 0) {
      item.children.forEach((child) => {
        // recursively call itself
        this._setChildren(child, data);
      });
    }
  }
  /**
   * The manifest but with routing mixed in
   */
  get routerManifest() {
    const manifest = this.manifest;
    document.body.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: manifest,
      })
    );
    if (manifest && typeof manifest.items !== "undefined") {
      let manifestItems = manifest.items.map((i) => {
        let parentLocation = null;
        let parentSlug = null;
        let parent = manifest.items.find((d) => i.parent === d.id);
        if (parent) {
          parentLocation = parent.location;
          parentSlug = parent.slug;
        }
        let metadata = i.metadata;
        let location = i.location;
        let slug = i.slug;
        return Object.assign({}, i, {
          parentLocation: parentLocation,
          parentSlug: parentSlug,
          location: location,
          slug: slug,
          metadata: metadata,
        });
      });

      // build the children into a hierarchy too
      manifestItems.forEach((item, i) => {
        this._setChildren(item, manifestItems);
      });

      /**
       * Publish Pages Option
       *
       * This option enables the notion of published and unpublished pages.
       * To enable this option set manifest.metadata.site.settings.publishPagesOn = true
       *
       * By default all pages will be published unless "metadata.published" is set to "true" on the
       * item.
       */
      if (
        varGet(manifest, "metadata.site.settings.publishPagesOn", true) === true
      ) {
        const filterHiddenParentsRecursive = (item) => {
          // if the item is unpublished then remove it.
          if (item.metadata.published === false) {
            return false;
          }
          // if the item has parents, recursively see if any parent is not published
          const parent = manifestItems.find((i) => i.id === item.parent);
          if (parent) {
            return filterHiddenParentsRecursive(parent);
          }
          // if it got this far then it should be good.
          return true;
        };
        // If the user is not logged in then we need to hide unpublished nodes items
        if (!this.isLoggedIn) {
          manifestItems = manifestItems.filter((i) =>
            filterHiddenParentsRecursive(i)
          );
        }
      }

      return Object.assign({}, manifest, {
        items: manifestItems,
      });
    }
  }
  /**
   * Return the site title
   */
  get siteTitle() {
    if (this.manifest && this.manifest.title) {
      return this.manifest.title;
    }
    return "";
  }
  /**
   * Figure out the home page, lazily the 1st thing in the manifest
   */
  get homeLink() {
    // if we are on the homepage then load the first item in the manifest and set it active
    if (this.manifest) {
      const firstItem = this.manifest.items.find(
        (i) => typeof i.id !== "undefined"
      );
      if (firstItem) {
        return firstItem.slug;
      }
    }
    return "/";
  }
  /**
   * Get the active Item based on activeId
   */
  get activeItem() {
    let item = this.findItem(this.activeId);
    // ensure we found something, return null for consistency in data
    if (item) {
      return item;
    }
    return null;
  }
  /**
   * Get the fields from the node
   */
  get activeItemFields() {
    // need to have metadata to be valid so..
    if (this.activeItem && this.activeItem.metadata) {
      // core "fields" we'd expect
      let fields = {
        title: this.activeItem.title,
        description: this.activeItem.description,
        location: this.activeItem.location,
        slug: this.activeItem.slug,
        created: this.activeItem.metadata.created,
        updated: this.activeItem.metadata.created,
      };
      // mix in any custom field definitions
      if (this.activeItem.metadata.fields) {
        return Object.assign({}, fields, this.activeItem.metadata.fields);
      }
    }
  }
  /**
   * get theme data from manifest + activeId combo
   */
  get themeData() {
    if (this.manifest) {
      var themeData = {};
      // this is required so better be...
      if (varExists(this.manifest, "metadata.theme")) {
        themeData = this.manifest.metadata.theme;
      } else {
        // fallback juuuuust to be safe...
        themeData = {
          "haxcms-basic-theme": {
            element: "haxcms-basic-theme",
            path:
              "@lrnwebcomponents/haxcms-elements/lib/core/themes/haxcms-basic-theme.js",
            name: "Basic theme",
            variables: {
              image: "assets/banner.jpg",
              icon: "icons:record-voice-over",
              hexCode: "#da004e",
              cssVariable: "pink",
            },
          },
        };
      }
      // ooo you sneaky devil you...
      if (this.activeItem && varExists(this.activeItem, "metadata.theme")) {
        return this.activeItem.metadata.theme;
      }
      return themeData;
    }
  }
  /**
   * Get the active manifest index array position
   * -1 if not found
   */
  get activeManifestIndex() {
    if (this.manifest && this.manifest.items && this.activeId) {
      for (var index in this.manifest.items) {
        if (this.manifest.items[index].id === this.activeId) {
          return parseInt(index);
        }
      }
    }
    return -1;
  }
  get activeRouterManifestIndex() {
    if (this.routerManifest && this.routerManifest.items && this.activeId) {
      for (var index in this.routerManifest.items) {
        if (this.routerManifest.items[index].id === this.activeId) {
          return parseInt(index);
        }
      }
    }
    return -1;
  }
  /**
   * Better for visualizing the counter
   */
  get activeManifestIndexCounter() {
    if (this.activeManifestIndex !== null) {
      return 1 + this.activeManifestIndex;
    }
    return 0;
  }
  /**
   * shortcut for active page title
   */
  get activeTitle() {
    if (this.activeItem) {
      return this.activeItem.title;
    }
    return "";
  }
  /**
   * shortcut for active page parent title
   */
  get parentTitle() {
    if (this.manifest && this.activeItem) {
      let tmpItem = this.manifest.items.find(
        (d) => this.activeItem.parent === d.id
      );
      // shift up 1 if we found something
      if (tmpItem) {
        return tmpItem.title;
      }
    }
    return "";
  }

  get isLoggedIn() {
    // account for keypair storage issue since its a string bin
    if (this.jwt && this.jwt != "null") {
      return true;
    }
    return false;
  }
  /**
   * shortcut for active page ancestor title
   */
  get ancestorTitle() {
    if (this.manifest && this.activeItem) {
      let tmpItem = this.manifest.items.find(
        (d) => this.activeItem.parent === d.id
      );
      // walk back up to the root
      while (tmpItem && tmpItem.parent != null) {
        // take the parent object of this current item
        tmpItem = this.manifest.items.find((i) => i.id == tmpItem.parent);
      }
      if (tmpItem) {
        return tmpItem.title;
      }
    }
    return "";
  }
  /**
   * shortcut to find an item in the manifest based on id
   */
  findItem(id) {
    if (this.manifest && id) {
      return this.manifest.items.find((item) => {
        if (item.id !== id) {
          return false;
        }
        return true;
      });
    }
    return null;
  }
  /**
   * shortcut to find an item in the manifest based on id
   */
  async findItemAsObject(
    id,
    attrLookup = "id",
    scope = "item",
    useToJS = true
  ) {
    if (this.manifest && id) {
      var tmpItem = await this.manifest.items.find((item) => {
        if (item[attrLookup] !== id) {
          return false;
        }
        return true;
      });
      if (useToJS) {
        tmpItem = toJS(tmpItem);
      }
      if (scope == "item") {
        return tmpItem;
      } else if (scope == "parent" && tmpItem.parent) {
        return toJS(
          await this.manifest.items.find((d) => tmpItem.parent === d.id)
        );
      }
    }
    return null;
  }
  /**
   * Return a clone of the manifest items list
   */
  getManifestItems(cloneIt = true) {
    if (cloneIt) {
      return toJS(this.manifest.items);
    }
    return this.manifest.items;
  }
  /**
   * Add an item
   */
  async addItem(item) {
    var schema = new JsonOutlineSchema();
    let newItem = schema.newItem();
    if (item.id) {
      newItem.id = item.id;
    }
    if (item.indent) {
      newItem.indent = item.indent;
    }
    newItem.location = item.location;
    newItem.slug = item.slug;
    newItem.order = item.order;
    newItem.parent = item.parent;
    newItem.title = item.title;
    // metadata can be anything so whatever
    newItem.metadata = item.metadata;
    // all items rebuilt
    schema.items = toJS(this.manifest.items);
    let safeItem = { ...schema.validateItem(newItem) };
    schema.items.push(safeItem);
    // we already have our items, pass them in
    var nodes = schema.itemsToNodes(schema.items);
    // smash outline into flat to get the correct order
    var correctOrder = schema.nodesToItems(nodes);
    var newItems = [];
    // build a new array in the correct order by pushing the old items around
    for (var key in correctOrder) {
      newItems.push(
        schema.items.find((element) => {
          return element.id === correctOrder[key].id;
        })
      );
    }
    this.manifest.items.replace(newItems);
    window.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this.manifest,
      })
    );
    window.dispatchEvent(
      new CustomEvent("haxcms-item-rebuild", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      })
    );
    return this.findItem(newItem.id);
  }
  /**
   * Remove an item
   */
  removeItem(id) {
    const item = this.findItem(id);
    // "new" items have not yet been added
    if (item) {
      if (item.metadata.status === "new") {
        const index = this.manifest.items.indexOf(item);
        if (index > -1) {
          this.manifest.items.splice(index, 1);
        }
      } else {
        // implies it's going to get deleted on next run
        item.metadata.status = "delete";
      }
    }
  }
  /**
   * Spider children based on criteria and return what we found
   */
  spiderChildren(item, data, start, end, parent, parentFound, noDynamicLevel) {
    // see if we have the parent... or keep going
    if (item.id === parent || parentFound) {
      // set parent to current so it's gaurenteed to match on next one
      if (!parentFound) {
        parentFound = true;
        // support sliding scales, meaning that start / end is relative to active
        if (!noDynamicLevel && item.indent >= start) {
          start += item.indent;
          end += item.indent;
        }
      }
      // only add on what we're between
      if (item.indent >= start && item.indent <= end) {
        data.push(item);
      }
      // we've found it. Now everyone below here should match
      if (item.children.length > 0) {
        item.children.forEach((child) => {
          // recursively call itself
          this.spiderChildren(
            child,
            data,
            start,
            end,
            parent,
            parentFound,
            noDynamicLevel
          );
        });
      }
    } else {
      if (item.children.length > 0) {
        item.children.forEach((child) => {
          // recursively call itself
          this.spiderChildren(
            child,
            data,
            start,
            end,
            parent,
            parentFound,
            noDynamicLevel
          );
        });
      }
    }
  }
  /**
   * Compute items leveraging the site query engine
   */
  computeItems(
    start,
    end,
    parent,
    dynamicMethodology,
    _routerManifest,
    noDynamicLevel
  ) {
    if (_routerManifest) {
      let items = [];
      let data = [];
      let tmpItem;
      _routerManifest.items.forEach((element) => {
        // find top level parents
        if (!element.parent) {
          items.push(element);
        }
      });
      switch (dynamicMethodology) {
        case "parent":
          tmpItem = _routerManifest.items.find((d) => parent === d.id);
          // shift up 1 if we found something
          if (tmpItem) {
            parent = tmpItem.parent;
          }
          break;
        case "ancestor":
          tmpItem = _routerManifest.items.find((d) => parent === d.id);
          // walk back up to the root
          while (tmpItem && tmpItem.parent != null) {
            // take the parent object of this current item
            tmpItem = _routerManifest.items.find((i) => i.id == tmpItem.parent);
          }
          if (tmpItem) {
            parent = tmpItem.id;
          }
          break;
      }
      _routerManifest.items.forEach((item, i) => {
        store.spiderChildren(
          item,
          data,
          start,
          end,
          parent,
          false,
          noDynamicLevel
        );
      });
      return data;
    }
  }
}
/**
 * Central store
 */
export const store = new Store();
// register globally so we can make sure there is only one
window.HAXCMS = window.HAXCMS || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.HAXCMS.requestAvailability = () => {
  if (!window.HAXCMS.instance) {
    window.HAXCMS.instance = document.createElement("haxcms-site-store");
    document.body.appendChild(window.HAXCMS.instance);
  }
  return window.HAXCMS.instance;
};
// weird, but self appending
export const HAXcmsStore = window.HAXCMS.requestAvailability();
/**
 * HTMLElement
 */
class HAXCMSSiteStore extends HTMLElement {
  constructor() {
    super();
    // keep track of the HTML element pieces dedicated to different
    // critical pieces of functionality like theme and editor builders.
    this.storePieces = {};
    // full on store that does the heavy lifting
    this.store = store;
    // source for reading in the store if different than default site.json
    this.source = "";
    /**
     * When location changes update activeItem
     */
    autorun(() => {
      if (
        store.location &&
        store.location.route &&
        store.location.route.component
      ) {
        // get the id from the router
        const id = store.location.route.name;
        // make sure that we aren't in edit mode
        let found = store.manifest.items.filter((item) => {
          if (item.id !== id) {
            return false;
          }
          return true;
        });
        if (found) {
          store.activeId = id;
        }
      }
    });

    /**
     * When Active Item Changes notify json-outline-schema to have the backend
     * change the page.
     */
    autorun(() => {
      const foundItem = toJS(store.findItem(store.activeId));
      if (foundItem) {
        document.body.dispatchEvent(
          new CustomEvent("json-outline-schema-active-item-changed", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: foundItem,
          })
        );
        //change site title when page changes
        document.title = store.activeTitle;
      }
    });
    /**
     * When editMode changes notify HAXeditor.
     */
    autorun(() => {
      const editMode = toJS(store.editMode);
      // trap for early setup
      if (
        window.HaxStore &&
        window.HaxStore.requestAvailability() &&
        window.HaxStore.requestAvailability().write
      ) {
        window.dispatchEvent(
          new CustomEvent("haxcms-edit-mode-changed", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: editMode,
          })
        );
        window.HaxStore.requestAvailability().editMode = editMode;
        // @todo hack to keep voice controls active if enabled
        if (
          window.HaxStore.requestAvailability().globalPreferences
            .haxVoiceCommands &&
          window.HaxStore.requestAvailability().__hal
        ) {
          setTimeout(() => {
            window.HaxStore.requestAvailability().__hal.auto = true;
          }, 10);
        }
      }
    });
  }
  /**
   * Try to get context of what backend is powering this
   */
  getApplicationContext() {
    let context = "";
    // @todo review if we even need this because newer contexts don't care
    // figure out the context we need to apply for where the editing creds
    // and API might come from
    // beaker is a unique scenario
    if (typeof DatArchive !== typeof undefined) {
      context = "beaker"; // implies usage of BeakerBrowser, an experimental browser for decentralization
    } else {
      switch (window.HAXCMSContext) {
        case "published": // implies this is to behave as if it is completely static
        case "nodejs": // implies nodejs based backend, tho no diff from
        case "php": // implies php backend
        case "11ty": // implies 11ty static site generator
        case "demo": // demo / local development
        case "desktop": // implies electron
        case "local": // implies ability to use local file system
          context = window.HAXCMSContext;
          break;
        default:
          // we don't have one so assume it's php for now
          // @notice change this in the future
          context = "php";
          break;
      }
    }
    return context;
  }
  static get tag() {
    return "haxcms-site-store";
  }
  static get observedAttributes() {
    return ["source"];
  }
  set source(value) {
    this[name] = value;
    if (value) {
      this.setAttribute("source", value);
    }
  }
  get source() {
    return this.getAttribute("source");
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name == "source" && newVal != "") {
      fetch(this[name])
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.store.loadManifest(data);
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }
}
window.customElements.define(HAXCMSSiteStore.tag, HAXCMSSiteStore);
export { HAXCMSSiteStore };
