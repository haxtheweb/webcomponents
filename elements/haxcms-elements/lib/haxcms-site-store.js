import { observable, decorate, computed, autorun, action, toJS } from "mobx";

class Store {
  constructor() {
    this.location = null;
    this.editMode = false;
    this.manifest = null;
    this.activeId = null;
  }
  /**
   * The manifest but with routing mixed in
   */
  get routerManifest() {
    const manifest = this.manifest;
    document.body.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        detail: manifest
      })
    );
    if (manifest && typeof manifest.items !== "undefined") {
      let userData = JSON.parse(
        window.localStorage.getItem("HAXCMSSystemData")
      );
      var accessData = {};
      if (
        typeof userData.manifests !== typeof undefined &&
        typeof userData.manifests[manifest.id] !== typeof undefined &&
        userData.manifests[manifest.id].accessData !== typeof undefined
      ) {
        accessData = userData.manifests[manifest.id].accessData;
      } else {
        if (typeof userData.manifests === typeof undefined) {
          userData.manifests = {};
        }
        userData.manifests[manifest.id] = {
          accessData: {}
        };
        window.localStorage.setItem(
          "HAXCMSSystemData",
          JSON.stringify(userData)
        );
      }
      const manifestItems = manifest.items.map(i => {
        // get local storage and look for data from this to mesh up
        let metadata = i.metadata;
        if (typeof accessData[i.id] !== typeof undefined) {
          metadata.accessData = accessData[i.id];
        }
        let location = i.location
          .replace("pages/", "")
          .replace("/index.html", "");
        return Object.assign({}, i, { location: location, metadata: metadata });
      });
      return Object.assign({}, manifest, {
        items: manifestItems,
        accessData: accessData
      });
    }
  }
  /**
   * Return the site title
   */
  get siteTitle() {
    const manifest = this.manifest;
    if (manifest.title) {
      return manifest.title;
    }
    return "";
  }
  /**
   * Figure out the home page, lazily the 1st thing in the manifest
   */
  get homeLink() {
    // if we are on the homepage then load the first item in the manifest and set it active
    const firstItem = this.manifest.items.find(
      i => typeof i.id !== "undefined"
    );
    if (firstItem) {
      return firstItem.location
        .replace("pages/", "")
        .replace("/index.html", "");
    } else {
      return "/";
    }
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
  get pageTitle() {
    if (this.activeItem) {
      return this.activeItem.title;
    }
    return "";
  }
  /**
   * shortcut to find an item in the manifest based on id
   */
  findItem(id) {
    if (this.manifest && id) {
      return this.manifest.items.find(item => {
        if (item.id !== id) {
          return false;
        }
        return true;
      });
    } else {
      return null;
    }
  }
}

decorate(Store, {
  location: observable.ref, // router location in url
  editMode: observable, // global editing state
  manifest: observable, // JOS / manifest
  routerManifest: computed, // router mixed in manifest w/ routes / paths
  siteTitle: computed,
  homeLink: computed,
  activeId: observable, // this affects all state changes associated to activeItem
  activeItem: computed, // active item object
  activeManifestIndex: computed, // active array index, used for pagination
  activeManifestIndexCounter: computed, // active array index counter, used for pagination
  pageTitle: computed, // active page title
  changeActiveItem: action.bound
});

/**
 * Central store
 */
export const store = new Store();

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
    let found = store.manifest.items.filter(item => {
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
        detail: foundItem
      })
    );
  }
});
