/* eslint-disable max-classes-per-file */
import { localStorageGet, localStorageSet } from "@haxtheweb/utils/utils.js";
import { observable, makeObservable, computed, configure } from "mobx";
import { DeviceDetails } from "@haxtheweb/replace-tag/lib/PerformanceDetect.js";
configure({ enforceActions: false }); // strict mode off

class Store {
  constructor() {
    this.badDevice = null;
    this.evaluateBadDevice();
    this.location = null;
    this.token =
      globalThis.appSettings && globalThis.appSettings.token
        ? globalThis.appSettings.token
        : null;
    this.version = "0.0.0";
    this.items = null;
    this.itemFiles = null;
    this.refreshSiteList = true;
    this.createSiteSteps = false;
    fetch(new URL("../../../haxcms-elements/package.json", import.meta.url))
      .then((response) => response.json())
      .then((obj) => (this.version = obj.version));
    this.appSettings = globalThis.appSettings || {};
    // defer to local if we have it for JWT
    if (this.appSettings.jwt) {
      localStorageSet("jwt", this.appSettings.jwt);
    }
    this.jwt = localStorageGet("jwt", null);
    // placeholder for when the actual API Backend gets plugged in here
    this.AppHaxAPI = {};
    this.newSitePromiseList = [
      () => import("@haxtheweb/i18n-manager/lib/I18NMixin.js"),
      () => import("@haxtheweb/wc-autoload/wc-autoload.js"),
      () => import("@haxtheweb/replace-tag/replace-tag.js"),
      () => import("@haxtheweb/utils/utils.js"),
      () => import("@haxtheweb/grid-plate/grid-plate.js"),
      () => import("@haxtheweb/simple-fields/simple-fields.js"),
      () => import("mobx/dist/mobx.esm.js"),
      () => import("@haxtheweb/h-a-x/h-a-x.js"),
      () => import("@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js"),
      () => import("@haxtheweb/haxcms-elements/lib/core/haxcms-site-router.js"),
      () =>
        import("@haxtheweb/haxcms-elements/lib/core/haxcms-site-builder.js"),
      () =>
        import("@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js"),
      () => import("@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor.js"),
      () =>
        import("@haxtheweb/haxcms-elements/lib/core/haxcms-editor-builder.js"),
      () =>
        import("@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor-ui.js"),
    ];
    this.appEl = null;
    this.appReady = false;
    this.soundStatus = localStorageGet("app-hax-soundStatus", true);
    // If user is new, make sure they are on step 1
    this.appMode = "search";
    this.activeSiteOp = null;
    this.activeSiteId = null;
    this.baseRoutes = [
      {
        path: "createSite-step-1",
        component: "fake",
        step: 1,
        name: "step-1",
        label: "New Journey",
        statement: "What sort of journey is it?",
        title: "Step 1: Create",
      },
      {
        path: "createSite-step-2",
        component: "fake",
        step: 2,
        name: "step-2",
        label: "Structure",
        statement: "How is the :structure organized?",
        title: "Step 2: Structure",
      },
      {
        path: "createSite-step-3",
        component: "fake",
        step: 3,
        name: "step-3",
        label: "Theme select",
        statement: "What your :structure feels like?",
        title: "Step 3: Theme",
      },
      {
        path: "createSite-step-4",
        component: "fake",
        step: 4,
        name: "step-4",
        label: "Name",
        statement: "What do you want to call your site?",
        title: "Step 4: Name",
      },
      {
        path: "createSite-step-5",
        component: "fake",
        step: 5,
        name: "step-5",
        label: "Building..",
        statement: "Getting your :structure ready to launch",
        title: "Step 5: Building site",
      },
      {
        path: "home",
        component: "fake",
        name: "home",
        label: "Welcome back",
        statement: "Let's go on a HAX Journey",
        title: "Home",
      },
      {
        path: "index.html",
        component: "fake",
        name: "home",
        label: "Welcome back",
        statement: "Let's go on a HAX Journey",
        title: "Home",
      },
      {
        path: "index.php",
        component: "fake",
        name: "home",
        label: "Welcome back",
        statement: "Let's go on a HAX Journey",
        title: "Home",
      },
      {
        path: "search",
        component: "fake",
        name: "search",
        label: "Search",
        statement: "Discover active adventures",
        title: "Search sites",
      },
      {
        path: "/",
        component: "fake",
        name: "welcome",
        label: "Welcome",
        statement: "Let's build something awesome!",
        title: "Home",
      },
      {
        path: "/(.*)",
        component: "fake",
        name: "404",
        label: "404 :[",
        statement: "it's not you.. it's me",
        title: "FoUr Oh FoUr",
      },
    ];
    this.routes = this.baseRoutes;
    this.siteReady = false;
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
      // internal state requirements
      appSettings: observable, // endpoint connections to the backend app
      appReady: observable, // all ready to paint
      appMode: observable, // mode the app is in. search, create, etc
      createSiteSteps: observable, // if we're making a site or in another part of app
      step: observable, // step that we're on in our build
      site: observable, // information about the site being created
      newSitePromiseList: observable,
      items: observable, // site items / structure from a docx micro if option selected
      itemFiles: observable, // files related to the items to be imported from another site format
      version: observable, // version of haxcms FRONTEND as per package.json
      // user related data
      jwt: observable, // JSON web token
      token: observable, // XSS prevention token
      manifest: observable, // sites the user has access to
      user: observable, // user object like name after login
      // user preferences
      searchTerm: observable, // current search term for filtering own list of sites
      darkMode: observable, // dark mode pref
      soundStatus: observable, // toggle sounds on and off
      activeItem: computed, // active item is route
      isNewUser: computed, // if they are new so we can auto kick to createSiteSteps if needed
      isLoggedIn: computed, // basic bool for logged in
      badDevice: observable, // if we have a terrible device or not based on detected speeds
      activeSiteOp: observable, // active operation for sites if working with them
      activeSiteId: observable, // active Item if working w/ sites
      activeSite: computed, // activeSite from ID
      siteReady: observable, // implied that we had a site and then it got built and we can leave app
      refreshSiteList: observable, // used to force state to refresh sitelisting
    });
  }
  setPageTitle(title) {
    if (globalThis.document.querySelector("title")) {
      globalThis.document.querySelector("title").innerText = `HAX: ${title}`;
    }
  }
  // refresh
  refreshSiteListing() {
    this.refreshSiteList = false;
    // @todo this causes a reactive feedbackloop in
    this.refreshSiteList = true;
  }
  // filter to just get data about THIS site
  get activeSite() {
    if (this.activeSiteId && this.manifest && this.manifest.items) {
      const sites = this.manifest.items.filter(
        (item) => item.id === this.activeSiteId,
      );
      if (sites.length === 1) {
        return sites.pop();
      }
      return null;
    }
  }
  // see if this device is poor
  async evaluateBadDevice() {
    this.badDevice = await DeviceDetails.badDevice();
    if (this.badDevice === true) {
      this.soundStatus = false;
    }
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
      this.site.name === null &&
      current !== 4
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
    if (this.appReady && this.AppHaxAPI) {
      return this.jwt !== "null" && this.jwt;
    }
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
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-toast-show", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          text: msg,
          duration: duration,
          ...extras,
        },
      }),
    );
  }
}
/**
 * Central store
 */
export const store = new Store();
