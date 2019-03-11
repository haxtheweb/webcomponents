import { observable, decorate, computed, autorun, action, toJS } from "mobx";

class Store {
  constructor() {
    this.manifest = null;
    this.editMode = false;
    this.activeItem = null;
    this.location = null;
  }

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
   * Change the active item
   */
  set activeItem(id) {
    if (!this.editMode) {
      let item = this.manifest.items.filter(item => {
        if (item.id !== id) {
          return false;
        }
        return true;
      });
      if (item) {
        this.activeItem = item;
      }
    }
  }

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
  manifest: observable,
  editMode: observable,
  activeItem: observable,
  location: observable.ref,
  routerManifest: computed,
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
  if (store.location) {
    if (store.location.route) {
      if (store.location.route.component) {
        // get the id from the router
        const id = store.location.route.name;
        // make sure that we aren't in edit mode
        if (!store.editMode) {
          let found = store.manifest.items.filter(item => {
            if (item.id !== id) {
              return false;
            }
            return true;
          });
          if (found) {
            store.activeItem = id;
          }
        }
      }
    }
  }
});

/**
 * When Active Item Changes notify json-outline-schema to have the backend
 * change the page.
 */
autorun(() => {
  const activeItem = store.activeItem;
  if (activeItem) {
    const foundItem = toJS(store.findItem(activeItem));
    if (foundItem) {
      document.body.dispatchEvent(
        new CustomEvent("json-outline-schema-active-item-changed", {
          bubbles: true,
          detail: foundItem
        })
      );
    }
  }
});
