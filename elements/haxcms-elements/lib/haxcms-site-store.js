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
    if (manifest && typeof manifest.items !== "undefined") {
      const manifestItems = manifest.items.map(i => {
        let location = i.location
          .replace("pages/", "")
          .replace("/index.html", "");
        return Object.assign({}, i, { location: location });
      });
      return Object.assign({}, manifest, { items: manifestItems });
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
