/* eslint-disable max-classes-per-file */
import { localStorageGet } from "@lrnwebcomponents/utils/utils.js";
import { observable, makeObservable, computed, configure } from "mobx";

configure({ enforceActions: false, useProxies: "ifavailable" }); // strict mode off

class Store {
  constructor() {
    this.location = null;
    this.jwt = null; // useful to know when we're logged in
    this.createSiteSteps = false;
    this.appSettings = window.appSettings || {};
    this.sitesBase = "https://iam.hax.psu.edu";
    // placeholder for when the actual API Backend gets plugged in here
    this.AppHaxAPI = {};
    this.newSitePromiseList = [
      () => import("@lrnwebcomponents/i18n-manager/lib/I18NMixin.js"),
      () => import("@lrnwebcomponents/wc-autoload/wc-autoload.js"),
      () => import("@lrnwebcomponents/replace-tag/replace-tag.js"),
      () => import("@lrnwebcomponents/utils/utils.js"),
      () => import("@lrnwebcomponents/grid-plate/grid-plate.js"),
      () => import("mobx/dist/mobx.esm.js"),
      () => import("@lrnwebcomponents/simple-fields/simple-fields.js"),
      () => import("@lrnwebcomponents/h-a-x/h-a-x.js"),
    ];
    this.appEl = null;
    this.appReady = false;
    this.soundStatus = localStorageGet("app-hax-soundStatus", true);
    // If user is new, make sure they are on step 1
    this.appMode = "search";
    this.routes = [];
    this.manifest = {};
    this.searchTerm = "";
    this.user = {
      name: "",
    };
    this.site = !localStorageGet("app-hax-site")
      ? { structure: null, type: null, theme: null, name: null }
      : localStorageGet("app-hax-site");
    this.step = this.stepTest(null);
    this.darkMode = !localStorageGet("app-hax-darkMode")
      ? false
      : localStorageGet("app-hax-darkMode");

    makeObservable(this, {
      // internal state for routing
      location: observable.ref, // router location in url
      routes: observable, // routes that are valid
      sitesBase: observable, // path of sites relative to here
      // internal state requirements
      appSettings: observable, // endpoint connections to the backend app
      appReady: observable, // all ready to paint
      appMode: observable, // mode the app is in. search, create, etc
      createSiteSteps: observable, // if we're making a site or in another part of app
      step: observable, // step that we're on in our build
      site: observable, // information about the site being created
      newSitePromiseList: observable,
      // user related data
      jwt: observable,
      manifest: observable,
      user: observable, // user object like name after login
      // user preferences
      searchTerm: observable, // current search term for filtering own list of sites
      darkMode: observable, // dark mode pref
      soundStatus: observable, // toggle sounds on and off
      activeItem: computed, // active item is route
      isNewUser: computed, // if they are new so we can auto kick to createSiteSteps if needed
      isLoggedIn: computed, // basic bool for logged in
    });
  }

  // validate if they are on the right step via state
  // otherwise we need to force them to the correct step
  stepTest(current) {
    if (this.site.structure === null && current !== 1) {
      return 1;
    } else if (
      this.site.structure !== null &&
      this.site.type === null &&
      current !== 2
    ) {
      return 2;
    } else if (
      this.site.structure !== null &&
      this.site.type !== null &&
      this.site.theme === null &&
      current !== 3
    ) {
      return 3;
    } else if (
      this.site.structure !== null &&
      this.site.type !== null &&
      this.site.theme !== null &&
      this.site.name === null
    ) {
      return 4;
    } else if (
      this.site.structure !== null &&
      this.site.type !== null &&
      this.site.theme !== null &&
      this.site.name !== null
    ) {
      return 5;
    }
    return current;
  }

  get isLoggedIn() {
    return this.jwt !== "null" && this.jwt;
  }

  get isNewUser() {
    if (this.manifest && this.manifest.items) {
      return this.manifest.items.length === 0;
    }
  }

  // site{ structure, type, theme } (course, portfolio, buz, colors)
  get activeItem() {
    if (this.routes.length > 0 && this.location && this.location.route) {
      if (this.createSiteSteps) {
        const routeItem = this.routes.find((item) => {
          if (item.step === undefined || item.step !== this.step) {
            return false;
          }
          return true;
        });
        return routeItem;
      } else {
        return this.location.route;
      }
    }
  }

  // centralize toast messages
  toast(msg, duration = 3000, extras = {}) {
    window.dispatchEvent(
      new CustomEvent("app-hax-toast-show", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          text: msg,
          duration: duration,
          ...extras,
        },
      })
    );
  }
}
/**
 * Central store
 */
export const store = new Store();
