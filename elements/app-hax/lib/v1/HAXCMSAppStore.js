/* eslint-disable max-classes-per-file */
import {
  observable,
  makeObservable,
  computed,
  configure,
  autorun,
  toJS,
} from 'mobx';

configure({ enforceActions: false, useProxies: 'ifavailable' }); // strict mode off

function localStorageSet(name, newItem) {
  try {
    return localStorage.setItem(name, JSON.stringify(newItem));
  } catch (e) {
    return false;
  }
}

function localStorageGet(name) {
  try {
    return JSON.parse(localStorage.getItem(name));
  } catch (e) {
    return false;
  }
}

class Store {
  constructor() {
    this.location = null;
    this.step = !localStorageGet('step') ? 1 : localStorageGet('step');
    this.routes = [];
    this.site = !localStorageGet('site')
      ? { structure: null, type: null, theme: null }
      : localStorageGet('site');

    makeObservable(this, {
      location: observable.ref, // router location in url
      step: observable, // step that we're on in our build
      routes: observable, // routes that are valid
      site: observable, // information about the site being created
      activeItem: computed, // active item is route
    });
  }

  // site{ structure, type, theme } (course, portfolio, buz, colors)
  get activeItem() {
    if (this.routes) {
      return this.routes.find(item => {
        if (item.step !== this.step) {
          return false;
        }
        return true;
      });
    }
    return null;
  }

  resetApp() {
    this.step = 1;
    this.site = { structure: null, type: null, theme: null };
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
    window.HAXCMS.instance = document.createElement('haxcms-app-store');
    document.body.appendChild(window.HAXCMS.instance);
  }
  return window.HAXCMS.instance;
};

// weird, but self appending
export const HAXcmsStore = window.HAXCMS.requestAvailability();

/**
 * HTMLElement
 */
export class HAXCMSAppStore extends HTMLElement {
  static get tag() {
    return 'haxcms-app-store';
  }

  constructor() {
    super();
    // full on store that does the heavy lifting
    this.store = store;
    // source for reading in the store if different than default site.json
    this.source = '';
    /**
     * When location changes update activeItem
     */
    autorun(() => {
      if (store.location && store.location.route) {
        // get the id from the router
        const siteCopy = toJS(store.site);
        siteCopy.step = toJS(store.location.route.step);
        if (siteCopy.structure === null && siteCopy.step !== 1) {
          store.step = 1;
        } else if (
          siteCopy.structure !== null &&
          siteCopy.type === null &&
          siteCopy.step !== 2
        ) {
          store.step = 2;
        } else if (
          siteCopy.structure !== null &&
          siteCopy.type !== null &&
          siteCopy.theme === null &&
          siteCopy.step !== 3
        ) {
          store.step = 3;
        } else if (
          siteCopy.structure !== null &&
          siteCopy.type !== null &&
          siteCopy.theme !== null
        ) {
          store.step = 4;
        }
      }
    });

    // AutoRun block to detect to detect if site.structure is null but step == 3, set step to 2.

    autorun(() => {
      if (store.routes.length > 0 && store.location == null) {
        store.location = toJS(store.routes[0]);
      }
    });
    autorun(() => {
      localStorageSet('step', toJS(store.step));
    });
    autorun(() => {
      localStorageSet('site', toJS(store.site));
    });
  }
}
customElements.define(HAXCMSAppStore.tag, HAXCMSAppStore);
