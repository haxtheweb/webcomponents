import { css, html, unsafeCSS } from "lit";
import { toJS, autorun } from "mobx";
import { localStorageSet, localStorageGet } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { store } from "./lib/v2/AppHaxStore.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { AppHaxAPI } from "./lib/v2/AppHaxBackendAPI.js";
import { SimpleTourManager } from "@haxtheweb/simple-popover/lib/simple-tour.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-colors-shared-styles/simple-colors-shared-styles.js";
import "./lib/v2/AppHaxRouter.js";
import "./lib/v2/app-hax-label.js";
import "@haxtheweb/haxcms-elements/lib/core/ui/app-hax-top-bar.js";
import { SimpleTourFinder } from "@haxtheweb/simple-popover/lib/SimpleTourFinder.js";
import "./lib/v2/app-hax-use-case.js";
import "./lib/v2/app-hax-use-case-filter.js";
import "./lib/v2/app-hax-search-results.js";
import "./lib/v2/app-hax-scroll-button.js";

const logoutBtn = new URL("./lib/assets/images/Logout.svg", import.meta.url)
  .href;
// toggle store darkmode
function darkToggle(e) {
  if (e.matches) {
    // dark mode
    store.darkMode = true;
  } else {
    // light mode
    store.darkMode = false;
  }
}

function soundToggle() {
  store.soundStatus = !toJS(store.soundStatus);
  localStorageSet("app-hax-soundStatus", toJS(store.soundStatus));
  store.appEl.playSound("click");
}

export class AppHax extends I18NMixin(SimpleTourFinder(SimpleColors)) {
  static get tag() {
    return "app-hax";
  }

  _openExternalLink(link) {
    globalThis.open(link, "_blank");
  }

  async _haxStoreContribute(type, tags, daemonTerm = null) {
    let body = "";
    if (type == "merlin") {
      var title = `[${type}] New command request from HAX daemon`;
      body = `Location: ${globalThis.location.href}
Merlin command: ${daemonTerm}
What did you want merlin to do?
`;
    } else {
      var title = `[${type}] User report from HAX daemon`;
      body = `Location: ${globalThis.location.href}
Browser: ${navigator.userAgent}
OS: ${navigator.userAgentData.platform} - ${navigator.deviceMemory}GB RAM - ${navigator.hardwareConcurrency} cores
Screen: ${globalThis.screen.width}x${globalThis.screen.height}
Window size: ${globalThis.innerWidth}x${globalThis.innerHeight}
`;
      if (navigator.getBattery) {
        const stats = await globalThis.navigator.getBattery();
        body += `Battery: ${stats.level * 100}%
`;
      }
      // some things report the "type" of internet connection speed
      // for terrible connections lets save frustration
      if (
        navigator.connection &&
        globalThis.navigator.connection.effectiveType
      ) {
        body += `Connection: ${navigator.connection.effectiveType}
`;
      }
      body += `${type == "feature" ? `Your idea:` : `Bug you experienced:`}
`;
    }
    globalThis.open(
      `https://github.com/haxtheweb/issues/issues/new?assignees=&labels=${tags}&template=issue-report.md&title=${title}&body=${encodeURIComponent(
        body,
      )}`,
      "_blank",
    );
  }
  // eslint-disable-next-line class-methods-use-this
  playSound(sound = "coin2") {
    return new Promise((resolve) => {
      if (store.soundStatus && store.appReady) {
        let playSound = [
          "click",
          "click2",
          "coin",
          "coin2",
          "hit",
          "success",
        ].includes(sound)
          ? sound
          : "hit";
        this.audio = new Audio(
          new URL(`./lib/assets/sounds/${playSound}.mp3`, import.meta.url).href,
        );
        this.audio.volume = 0.2;
        this.audio.onended = (event) => {
          resolve();
        };
        this.audio.play();
        // resolve after 1s if sound failed to load
        setTimeout(() => {
          resolve();
        }, 1000);
      } else {
        resolve();
      }
    });
  }

  /**
   * A token refresh just failed so force to login prompt / state
   */
  _tokenRefreshFailed(e) {
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      }),
    );
    setTimeout(() => {
      this.reset(true);
    }, 100);
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", darkToggle, {
        signal: this.windowControllers.signal,
      });
    globalThis.addEventListener("jwt-logged-in", this._jwtLoggedIn.bind(this), {
      signal: this.windowControllers.signal,
    });

    globalThis.addEventListener(
      "jwt-login-refresh-error",
      this._tokenRefreshFailed.bind(this),
      { signal: this.windowControllers.signal },
    );
  }

  goToLocation(location) {
    globalThis.location = location;
  }

  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  constructor() {
    super();
    this.unlockComingSoon = false;
    this.unlockTerrible = false;
    this.__loginModalOpen = false;
    this.t = this.t || {};

    this.t = {
      ...this.t,
      selectPage: "Select page",
      backToSiteList: "Back to site list",
      listMySites: "List my sites",
      cancel: "Cancel",
      editDetails: "Page details",
      add: "Add",
      editSettings: "Edit settings",
      source: "Source",
      viewSource: "View source",
      findMedia: "Find media",
      undo: "Undo",
      redo: "Redo",
      media: "Media",
      outline: "Outline",
      blocks: "Blocks",
      addBlock: "Add block",
      addPage: "Add page",
      addChildPage: "Add child page",
      clonePage: "Clone page",
      delete: "Delete page",
      siteSettings: "Site settings",
      close: "Close",
      settings: "Settings",
      edit: "Edit",
      configureBlock: "Configure block",
      configure: "Configure",
      save: "Save",
      home: "Home",
      startNewJourney: "Start new journey",
      newJourney: "New Journey",
      accountInfo: "Account Info",
      outlineDesigner: "Site Outline",
      pageOutline: "Structure",
      more: "More",
      siteActions: "Site actions",
      insights: "Insights dashboard",
      merlin: "Merlin",
      summonMerlin: "Summon Merlin",
      logOut: "Log out",
      menu: "Menu",
      showMore: "More",
      userAccess: "User Access",
    };
    if (
      typeof globalThis.speechSynthesis !== "undefined" &&
      (globalThis.SpeechRecognition ||
        globalThis.webkitSpeechRecognition ||
        globalThis.mozSpeechRecognition ||
        globalThis.msSpeechRecognition ||
        globalThis.oSpeechRecognition)
    ) {
      SuperDaemonInstance.voiceSearch = true;
    }
    SuperDaemonInstance.icon = "hax:wizard-hat";
    SuperDaemonInstance.appendContext("*");
    // ensure we are running HAX / ready and in edit mode before allowing commands to go through
    SuperDaemonInstance.allowedCallback = () => {
      if (toJS(store.appReady) && toJS(store.isLoggedIn)) {
        return true;
      }
      return false;
    };

    // contribution helpers
    SuperDaemonInstance.defineOption({
      title: "Tour of top menu buttons",
      icon: "help",
      tags: ["Help", "ui", "tour"],
      priority: -1000,
      value: {
        target: this,
        method: "helpClick",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/app/tour",
      context: ["*"],
    });

    // contribution helpers
    SuperDaemonInstance.defineOption({
      title: "Unlock hidden features",
      icon: "hax:hax2022",
      tags: ["Developer", "features", "hidden"],
      value: {
        target: this,
        method: "fireUnlocked",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: ">developer/hax/unlockAll",
      context: [">"],
    });
    SuperDaemonInstance.defineOption({
      title: "Go to site",
      icon: "hax:hax2022",
      tags: ["Sites", "Administration", "change"],
      eventName: "super-daemon-run-program",
      path: "HAX/action/goToSite",
      value: {
        name: "Go to site",
        program: async (input, values) => {
          let results = [];
          const items = toJS(store.manifest.items);
          items.forEach(async (site) => {
            if (
              input == "" ||
              (site.metadata.site &&
                site.metadata.site.name &&
                site.metadata.site.name.includes(input))
            ) {
              results.push({
                title: site.title,
                icon:
                  site.metadata.theme &&
                  site.metadata.theme.variables &&
                  site.metadata.theme.variables.icon
                    ? site.metadata.theme.variables.icon
                    : "hax:hax2022",
                tags: ["site", site.description],
                value: {
                  target: this,
                  method: "goToLocation",
                  args: [site.slug],
                },
                eventName: "super-daemon-element-method",
                context: [
                  "*",
                  "HAX/action/goToSite/" + site.metadata.site.name,
                ],
                path: "HAX/action/goToSite/" + site.metadata.site.name,
              });
            }
          });
          return results;
        },
      },
      context: ["*"],
    });
    // contribution helpers
    SuperDaemonInstance.defineOption({
      title: "Join our Community",
      icon: "hax:discord",
      priority: -100,
      tags: ["community", "discord", "chat", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://bit.ly/hax-discord"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/join",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "User Tutorials",
      icon: "hax:hax2022",
      priority: -1000,
      tags: ["Documentation", "community", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://haxtheweb.org/tutorials"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/tutorials",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "User Documentation",
      icon: "hax:hax2022",
      tags: ["Documentation", "community", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://haxtheweb.org/documentation"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/documentation",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "HAX Teaching Excellence",
      icon: "hax:hax2022",
      tags: ["Ontology", "community", "pedagogy", "documentation", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://haxtheweb.org/ontology"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/pedagogy",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "Bug / issue",
      icon: "mdi-social:github-circle",
      tags: ["Bug report", "github", "git", "community", "issue queue"],
      value: {
        target: this,
        method: "_haxStoreContribute",
        args: ["bug", "POP,bug"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/contribute",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "Idea / Feature request",
      icon: "mdi-social:github-circle",
      tags: [
        "Feature request",
        "idea",
        "github",
        "git",
        "community",
        "issue queue",
      ],
      value: {
        target: this,
        method: "_haxStoreContribute",
        args: ["feature", "POP,enhancement"],
      },
      context: ["logged-in", "CMS", "HAX", "*"],
      eventName: "super-daemon-element-method",
      path: "HAX/community/contribute",
    });
    this.windowControllers = new AbortController();
    this.__tour = SimpleTourManager;
    this.__tour.registerNewTour({
      key: "hax",
      name: "HAX top menu",
      style: `
      simple-popover-manager::part(simple-popover) {
        max-width: 250px;
        font-family: sans-serif;
      }
      simple-popover-manager button {
        font-family: sans-serif;
        font-size: 12px;
        margin: 0px 2px;
        color: var(--simple-colors-default-theme-grey-12);
      }
      simple-popover-manager p {
        font-family: sans-serif;
        padding: 0;
        margin: 0;
        width: 250px;
        font-size: 10px;
        line-height: 20px;
      }
      simple-popover-manager h1 {
        font-family: sans-serif;
        margin: 0;
        font-size: 12px;
        width: 250px;
        padding: 0;
      }
      simple-popover-manager::part(simple-popover-body),
      simple-popover-manager::part(simple-popover-heading) {
        color: black;
        background-color: white;
        font-family: sans-serif;
      }
      body.dark-mode simple-popover-manager::part(simple-popover-body),
      body.dark-mode simple-popover-manager::part(simple-popover-heading) {
        color: white;
        background-color: black;
        font-family: sans-serif;
      }
      body.dark-mode simple-popover-manager simple-icon-button-lite {
        color: white;
        background-color: black;
        font-family: sans-serif;
      }
      `,
    });
    this.tourName = "hax";
    // manage title when activeItem changes
    autorun(() => {
      const item = toJS(store.activeItem);
      if (item && item.title) {
        store.setPageTitle(item.title);
      }
    });
    autorun(() => {
      this.siteReady = toJS(store.siteReady);
    });
    autorun(() => {
      const badDevice = toJS(store.badDevice);
      if (badDevice === false) {
        import("@haxtheweb/rpg-character/rpg-character.js");
      } else if (badDevice === true) {
        globalThis.document.body.classList.add("bad-device");
      }
    });
    this.userMenuOpen = false;
    this.courses = [];
    this.activeItem = {};
    this.phrases = {
      new: [
        "What's ya name?",
        "HAX to the moon",
        "Welcome to the Jungle",
        "We like to party",
        "Build something awesome",
        "Everything is awesome!",
        "Everything is cool",
        "When you're part of the team",
        "When you're living our dream",
        "Welcome to the up-side-down",
      ],
      return: [
        "Welcome back, take 2?",
        "That wasn't very long",
        "Stranger thiings have happened",
        "Student driven platform",
        "Faculty centered platform",
        "Instructional designer influenced platform",
        "Free, Open, Community driven",
        "One brick at a time..",
        "Sup?",
        "You again? Awesome!",
        "Let's do this",
        "There can only be one ring...",
        "There is another",
        "Fancy that, I love HAX and you show up",
      ],
    };
    this.isNewUser = null;
    this.basePath = "/";
    this.searchTerm = "";
    this.appMode = "";
    this.soundIcon = "";
    // full on store that does the heavy lifting
    this.store = store;
    // centralized sound source to not flood sounds when playing
    this.sound = new Audio();
    // @todo need this from app deploy itself
    autorun(() => {
      this.isNewUser = toJS(store.isNewUser);
      if (
        this.isNewUser &&
        toJS(store.appMode) !== "create" &&
        toJS(store.appMode) !== "404"
      ) {
        store.appMode = "create";
        setTimeout(() => {
          store.createSiteSteps = true;
        }, 0);
      }
    });
    autorun(() => {
      this.userName = toJS(store.user.name);
    });
    autorun(() => {
      this.appMode = toJS(store.appMode);
    });
    autorun(() => {
      this.searchTerm = toJS(store.searchTerm);
    });

    /**
     * When location changes update activeItem / mode of app
     */
    autorun(async () => {
      const location = toJS(store.location);
      if (location && location.route) {
        // verify this is a step vs other operations
        if (!location.route.step) {
          // support external site links
          if (location.route.slug) {
            this.reset();
            setTimeout(() => {
              globalThis.location = location.route.slug;
            }, 0);
          }
          // page miss is high check too
          else if (location.route.name === "404") {
            store.createSiteSteps = false;
            store.appMode = "404";
            setTimeout(() => {
              store.toast("the page miss.. it burns!!!", 3000, {
                fire: true,
                walking: true,
              });
            }, 500);
          }
          // then home / landing page which is default expectation
          else if (
            location.route.name === "home" ||
            location.route.name === "search"
          ) {
            store.appMode = "home";
            store.createSiteSteps = false;
          } else {
            //console.warn(location.route);
          }
        } else {
          // we have a "step" based operation
          store.appMode = "create";
          store.createSiteSteps = true;
        }
      }
    });

    autorun(() => {
      if (store.routes.length > 0 && store.location === null) {
        store.location = toJS(store.routes[0]);
      }
    });
    // manage dark mode
    // only set this initially if we don't have an app state of our own
    if (localStorageGet("app-hax-darkMode", null) === null) {
      store.darkMode = globalThis.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
    }
    autorun(() => {
      localStorageSet("app-hax-darkMode", toJS(store.darkMode));
      requestAnimationFrame(() => {
        if (toJS(store.darkMode)) {
          globalThis.document.body.classList.add("dark-mode");
          store.toast("I'm ascared of the dark", 2000, { fire: true });
          this.dark = true;
          SuperDaemonInstance.dark = true;
          SuperDaemonInstance.toastInstance.darkMode = true;
        } else {
          globalThis.document.body.classList.remove("dark-mode");
          store.toast("Sunny day it is", 2000, { hat: "random" });
          this.dark = false;
          SuperDaemonInstance.dark = false;
          SuperDaemonInstance.toastInstance.darkMode = false;
        }
      });
    });
    autorun(() => {
      const mode = toJS(store.appMode);
      if (mode) {
        globalThis.document.body.classList.remove("app-hax-search");
        globalThis.document.body.classList.remove("app-hax-create");
        globalThis.document.body.classList.remove("app-hax-404");
        globalThis.document.body.classList.remove("app-hax-home");
        globalThis.document.body.classList.add(`app-hax-${mode}`);
      }
    });
  }

  static get properties() {
    return {
      ...super.properties,
      unlockComingSoon: { type: Boolean },
      unlockTerrible: { type: Boolean },
      courses: { type: Array },
      userName: { type: String },
      activeItem: { type: Object },
      soundIcon: { type: String },
      searchTerm: { type: String },
      appMode: { type: String }, // minor context of what we're doing in the app for rendering
      isNewUser: { type: Boolean },
      phrases: { type: Object },
      userMenuOpen: { type: Boolean }, // leave here to ensure hat change and sound effects happen
      siteReady: { type: Boolean },
      basePath: { type: String, attribute: "base-path" },
      token: { type: String },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  reset(reload = false, logout = false) {
    // localStorage possible to be blocked by permission of system
    try {
      globalThis.localStorage.removeItem("app-hax-step");
      globalThis.localStorage.removeItem("app-hax-site");

      // If logout is requested, clear JWT and trigger logout
      if (logout) {
        globalThis.localStorage.removeItem("jwt");
        store.jwt = null;
        // Trigger logout event to clear user session
        globalThis.dispatchEvent(
          new CustomEvent("jwt-login-logout", {
            composed: true,
            bubbles: true,
            cancelable: false,
            detail: true,
          }),
        );
      }

      if (reload) {
        // should always be a base tag for a SPA but just checking
        if (document.querySelector("base")) {
          globalThis.location = globalThis.document.querySelector("base").href;
        } else {
          globalThis.location.reload();
        }
      }
    } catch (e) {
      //console.warn(e);
    }
  }
  fireTerrible() {
    this.unlockTerrible = true;
    store.appEl.playSound("coin").then(() => {
      store.appEl.playSound("coin2").then(() => {
        store.appEl.playSound("success").then(() => {
          SuperDaemonInstance.merlinSpeak(
            "Enjoy these early 2000s table based layouts. May they remind you how never to web, again.",
          );
        });
      });
    });
  }
  fireUnlocked() {
    this.unlockComingSoon = true;
    store.appEl.playSound("coin").then(() => {
      store.appEl.playSound("coin2").then(() => {
        store.appEl.playSound("success").then(() => {
          SuperDaemonInstance.merlinSpeak(
            "Unbelievable! You, (Subject Name), must be the pride of (Subject Hometown). Enjoy all locked features as a boon!",
          );
        });
      });
    });
  }
  // eslint-disable-next-line class-methods-use-this
  logout() {
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      }),
    );
    this.closeMenu();
    this.__logoutUserAction = true;
  }
  // only care about logouts
  _jwtLoggedIn(e) {
    if (e.detail === false && this.__logoutUserAction) {
      this.__logoutUserAction = false;
      // reset login modal flag on logout so user can log in again
      this.__loginModalOpen = false;
      setTimeout(() => {
        this.reset(true);
      }, 100);
    }
    // Note: we do NOT reset __loginModalOpen on successful login
    // The flag stays true to prevent the autorun from triggering login() again
    // It only resets on logout when we actually want to show the login modal again
  }

  // eslint-disable-next-line class-methods-use-this
  login() {
    // prevent multiple login modals from being created
    if (this.__loginModalOpen) {
      return;
    }
    this.__loginModalOpen = true;
    import("./lib/v2/app-hax-site-login.js").then(() => {
      const p = globalThis.document.createElement("app-hax-site-login");
      if (this.querySelector('[slot="externalproviders"]')) {
        const cloneSlot = this.querySelector(
          '[slot="externalproviders"]',
        ).cloneNode(true);
        p.appendChild(cloneSlot);
      }
      import("@haxtheweb/simple-modal/simple-modal.js").then(() => {
        setTimeout(() => {
          this.dispatchEvent(
            new CustomEvent("simple-modal-show", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                title: "Login to HAX",
                elements: { content: p },
                modal: true,
                styles: {
                  "--simple-modal-titlebar-background":
                    "var(--ddd-theme-default-nittanyNavy, #001e44)",
                  "--simple-modal-titlebar-color":
                    "var(--ddd-theme-default-white, white)",
                  "--simple-modal-width": "90vw",
                  "--simple-modal-max-width": "var(--ddd-spacing-32, 480px)",
                  "--simple-modal-min-width": "300px",
                  "--simple-modal-z-index": "1000",
                  "--simple-modal-height": "auto",
                  "--simple-modal-min-height": "300px",
                  "--simple-modal-max-height": "80vh",
                  "--simple-modal-titlebar-height": "80px",
                  "--simple-modal-border-radius": "var(--ddd-radius-md, 8px)",
                  "--simple-modal-background":
                    "var(--ddd-theme-default-white, white)",
                  "--simple-modal-box-shadow": "var(--ddd-boxShadow-xl)",
                },
              },
            }),
          );
        }, 0);
      });
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          overflow: hidden;
          display: block;
          max-width: 100%;
          font-family: var(--ddd-font-primary, sans-serif);
          padding-left: var(--ddd-spacing-5, 20px);
          padding-right: var(--ddd-spacing-5, 20px);
        }
        .contentSection {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          gap: var(--ddd-spacing-12, 48px);
          width: 100%;
          margin: 0;
          margin-top: var(--ddd-spacing-5, 20px);
          padding: 0;
          box-sizing: border-box;
        }
        .leftSection,
        .rightSection {
          display: flex;
          flex-direction: column;
          flex: 1 1 0;
        }
        .leftSection {
          width: 240px;
          min-width: 200px;
          max-width: 260px;
          margin-left: 0;
          padding-top: 0;
          box-sizing: border-box;
          align-self: flex-start;
        }
        .rightSection {
          flex: 1;
          min-width: 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: visible;
        }
        .template-results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          width: 100%;
          min-height: 330px;
          box-sizing: border-box;
          gap: var(--ddd-spacing-2, 16px);
        }
        #returnToSection {
          width: 100%;
        }
        #returnToSection app-hax-search-results {
          width: 100%;
          min-height: 280px;
          box-sizing: border-box;
          height: 300px;
        }
        :host(:not([show-filter])) app-hax-search-results {
          width: 100%;
        }

        h2,
        .returnTo h2,
        .startNew h2 {
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-l, 24px);
          color: var(--app-hax-accent-color, var(--accent-color));
          margin: 0 0 var(--ddd-spacing-4, 16px) 0;
        }
        .startNew,
        .returnTo {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          margin: 0;
        }
        .upper-filter {
          margin-bottom: var(--ddd-spacing-4, 16px);
          position: relative;
          display: inline-block;
          width: 100%;
        }
        input[type="text"] {
          width: 100%;
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-2, 8px)
            var(--ddd-spacing-2, 8px) var(--ddd-spacing-8, 32px);
          font-size: var(--ddd-font-size-xs, 12px);
          border-radius: var(--ddd-radius-sm, 4px);
          border: var(--ddd-border-xs, 1px solid);
          border-color: var(--ddd-theme-default-slateGray, #666);
          background: var(--ddd-theme-default-white, white);
          color: var(--ddd-theme-default-coalyGray, #222);
          transition: all 0.2s ease;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary, sans-serif);
          margin: 0;
          min-height: var(--ddd-spacing-8, 32px);
        }
        :host([dark]) input[type="text"],
        body.dark-mode input[type="text"] {
          background: var(--ddd-theme-default-coalyGray, #333);
          color: var(--ddd-theme-default-white, white);
          border-color: var(--ddd-theme-default-slateGray, #666);
        }
        input[type="text"]:focus {
          border: var(--ddd-border-md, 2px solid);
          border-color: var(--ddd-theme-default-keystoneYellow, #ffd100);
          background: var(--ddd-theme-default-white, white);
          outline: none;
        }
        :host([dark]) input[type="text"]:focus,
        body.dark-mode input[type="text"]:focus {
          background: var(--ddd-theme-default-coalyGray, #333);
          border-color: var(--ddd-theme-default-keystoneYellow, #ffd100);
        }
        .search-icon {
          position: absolute;
          left: var(--ddd-spacing-2, 8px);
          top: 50%;
          transform: translateY(-50%);
          font-size: var(--ddd-font-size-xs, 14px);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          pointer-events: none;
          z-index: 1;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        :host([dark]) .search-icon,
        body.dark-mode .search-icon {
          color: var(--ddd-theme-default-white, white);
        }
        .filter {
          position: relative;
          top: 0;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-5, 20px);
          background: var(--ddd-theme-default-white, white);
          border-radius: var(--ddd-radius-lg, 12px);
          box-shadow: var(--ddd-boxShadow-lg);
          border: var(--ddd-border-xs, 1px solid);
          border-color: var(--ddd-theme-default-slateGray, #666);
          padding: var(--ddd-spacing-6, 24px);
          margin-top: 0;
          margin-bottom: 0;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary, sans-serif);
          transition: box-shadow 0.2s ease;
        }
        :host([dark]) .filter,
        body.dark-mode .filter {
          background: var(--ddd-theme-default-coalyGray, #222);
          border-color: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
        }
        .filter:hover {
          box-shadow: var(--ddd-boxShadow-xl);
        }
        .filterButtons {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3, 12px);
          margin-top: 0;
          border: none;
          padding: 0;
          margin: 0;
        }
        .filter-btn {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--ddd-spacing-1, 4px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          border-radius: var(--ddd-radius-sm, 4px);
          border: var(--ddd-border-xs, 1px solid) transparent;
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          font-size: var(--ddd-font-size-3xs, 11px);
          font-family: var(--ddd-font-primary, sans-serif);
          font-weight: var(--ddd-font-weight-medium, 500);
          cursor: pointer;
          box-shadow: var(--ddd-boxShadow-sm);
          transition: all 0.2s ease;
          outline: none;
          min-height: var(--ddd-spacing-7, 28px);
          text-align: left;
        }
        :host([dark]) .filter-btn,
        body.dark-mode .filter-btn {
          background: var(--ddd-theme-default-slateGray, #444);
          color: var(--ddd-theme-default-white, white);
        }
        .filter-btn.active,
        .filter-btn:active {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
          border-color: var(--ddd-theme-default-keystoneYellow, #ffd100);
          box-shadow: var(--ddd-boxShadow-md);
        }
        :host([dark]) .filter-btn.active,
        :host([dark]) .filter-btn:active,
        body.dark-mode .filter-btn.active,
        body.dark-mode .filter-btn:active {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          border-color: var(--ddd-theme-default-white, white);
        }
        .filter-btn:hover,
        .filter-btn:focus {
          background: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
          transform: translateY(-1px);
        }
        .filter-btn:focus {
          outline: var(--ddd-border-md, 2px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: var(--ddd-spacing-1, 2px);
        }
        :host([dark]) .filter-btn:hover,
        :host([dark]) .filter-btn:focus,
        body.dark-mode .filter-btn:hover,
        body.dark-mode .filter-btn:focus {
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        .filter-btn.active:hover,
        .filter-btn.active:focus {
            background: var(--ddd-theme-default-keystoneYellow, #ffd100);
            color: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        :host([dark]) .filter-btn.active:hover,
        :host([dark]) .filter-btn.active:focus,
        body.dark-mode .filter-btn.active:hover,
        body.dark-mode .filter-btn.active:focus {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        .filter-btn .icon {
          font-size: var(--ddd-font-size-3xs, 12px);
          color: inherit;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          width: var(--ddd-icon-3xs, 20px);
          height: var(--ddd-icon-3xs, 20px);
        }
        .filter-btn .icon simple-icon-lite {
          color: inherit;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .filter-btn.active .icon,
        .filter-btn.active .icon simple-icon-lite {
          color: inherit;
        }
        :host([dark]) .filter-btn.active .icon,
        :host([dark]) .filter-btn.active .icon simple-icon-lite,
        body.dark-mode .filter-btn.active .icon,
        body.dark-mode .filter-btn.active .icon simple-icon-lite {
          color: inherit;
        }
        .filter-btn:hover .icon simple-icon-lite,
        .filter-btn:focus .icon simple-icon-lite {
          color: inherit;
        }
        input[type="checkbox"] {
          display: none;
        }
        .sort-control {
          margin-top: var(--ddd-spacing-2, 8px);
          margin-bottom: var(--ddd-spacing-3, 12px);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1, 4px);
        }
        .sort-label {
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-3xs, 11px);
          color: var(--ddd-theme-default-coalyGray, #222);
        }
        :host([dark]) .sort-label,
        body.dark-mode .sort-label {
          color: var(--ddd-theme-default-limestoneGray, #f5f5f5);
        }
        .sort-select {
          width: 100%;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          font-size: var(--ddd-font-size-3xs, 11px);
          border-radius: var(--ddd-radius-sm, 4px);
          border: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-slateGray, #666);
          background: var(--ddd-theme-default-white, white);
          color: var(--ddd-theme-default-coalyGray, #222);
          font-family: var(--ddd-font-primary, sans-serif);
          box-sizing: border-box;
        }
        :host([dark]) .sort-select,
        body.dark-mode .sort-select {
          background: var(--ddd-theme-default-coalyGray, #333);
          color: var(--ddd-theme-default-white, white);
          border-color: var(--ddd-theme-default-slateGray, #666);
        }
        .sort-select:focus {
          outline: var(--ddd-border-md, 2px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: var(--ddd-spacing-1, 2px);
        }
        .reset-button {
          margin-top: var(--ddd-spacing-1, 4px);
          background: var(--ddd-theme-default-original87Pink, #e4007c);
          border: var(--ddd-border-xs, 1px solid) transparent;
          color: var(--ddd-theme-default-white, white);
          border-radius: var(--ddd-radius-sm, 4px);
          font-size: var(--ddd-font-size-3xs, 11px);
          font-family: var(--ddd-font-primary, sans-serif);
          font-weight: var(--ddd-font-weight-medium, 500);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-1, 4px);
          box-shadow: var(--ddd-boxShadow-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: var(--ddd-spacing-7, 28px);
        }
        .reset-button:hover,
        .reset-button:focus {
          background: var(--ddd-theme-default-beaver70, #c85c2c);
          transform: translateY(-1px);
        }
        .reset-button:focus {
          outline: var(--ddd-border-md, 2px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: var(--ddd-spacing-1, 2px);
        }
        :host([dark]) .reset-button,
        body.dark-mode .reset-button {
          background: var(--ddd-theme-default-beaver70, #c85c2c);
        }
        :host([dark]) .reset-button:hover,
        :host([dark]) .reset-button:focus,
        body.dark-mode .reset-button:hover,
        body.dark-mode .reset-button:focus {
          background: var(--ddd-theme-default-original87Pink, #e4007c);
        }
        .collapseFilter {
          display: none;
        }

        /* Visually hidden content for screen readers */
        .visually-hidden {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        /* Loading and fallback messages */
        .loading-message,
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--ddd-spacing-8, 32px);
          font-size: var(--ddd-font-size-s, 16px);
          color: var(--ddd-theme-default-slateGray, #666);
          font-family: var(--ddd-font-primary, sans-serif);
        }
        :host([dark]) .loading-message,
        :host([dark]) .no-results,
        body.dark-mode .loading-message,
        body.dark-mode .no-results {
          color: var(--ddd-theme-default-limestoneGray, #ccc);
        }
        .fallback-message {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-4, 16px);
        }
        .fallback-message .no-results {
          padding: var(--ddd-spacing-4, 16px) 0;
        }
        .fallback-message app-hax-use-case {
          max-width: 300px;
        }

        /* 780px - 601px */
        @media (max-width: 780px) {
          :host {
            padding-left: var(--ddd-spacing-5, 20px);
            padding-right: var(--ddd-spacing-5, 20px);
          }
          .contentSection {
            display: block;
          }
          .leftSection, .rightSection {
            width: 100%;
            max-width: 100%;
            position: relative;
          }
          .leftSection {
            margin-bottom: var(--ddd-spacing-4, 16px);
          }
          :host([show-filter]) .filter {
            display: flex;
            width: 250px;
            max-width: 250px;
          }
          :host .collapseFilter {
            display: flex;
          }
          h4, .returnTo h4, .startNew h4 {
            font-size: var(--ddd-font-size-m, 20px);
          }
          .template-results {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--ddd-spacing-3, 12px);
          }
        }

        /* 600px - 481px*/
        @media (max-width: 600px) {
          .leftSection {
            margin-bottom: var(--ddd-spacing-3, 12px);
          }
          :host([show-filter]) .filter {
            width: 200px;
          }
          h4, .returnTo h4, .startNew h4 {
            font-size: var(--ddd-font-size-s, 18px);
          }
          .template-results {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-2, 8px);
          }
        }

        /* 480px - 0px*/
        @media (max-width: 480px) {
          h4, .returnTo h4, .startNew h4 {
            font-size: var(--ddd-font-size-s, 16px);
            margin-bottom: var(--ddd-spacing-3, 12px);
          }
          #returnToSection app-hax-search-results {
            min-width: 100%;
          }
        }
        
        .no-results {
          font-size: var(--ddd-font-size-s, 16px);
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #222),
            var(--ddd-theme-default-white, white)
          );
        }
      `,
    ];
  }
  helpClick() {
    // start the tour
    store.appEl.playSound("coin2");
    this.__tour.startTour("hax");
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // update the store as these get set via entrypoint of the app
    // but used downstream in calls
    changedProperties.forEach((oldValue, propName) => {
      // API backend broker settings
      if (["basePath"].includes(propName) && this[propName]) {
        store.AppHaxAPI[propName] = this[propName];
      }
      // settings for the store itself
      if (["token"].includes(propName) && this[propName]) {
        store[propName] = this[propName];
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // required for our early siteList updating
    if (store.AppHaxAPI && this.basePath) {
      store.AppHaxAPI.basePath = this.basePath;
    }
    import("./lib/v2/app-hax-steps.js");
    import("./lib/v2/app-hax-site-button.js");
    import("wired-elements/lib/wired-button.js");
    import("./lib/v2/app-hax-toast.js");
    import("./lib/v2/app-hax-wired-toggle.js");
    import("./lib/v2/app-hax-search-bar.js");
    import("./lib/v2/app-hax-search-results.js");
    import("./lib/v2/app-hax-user-menu.js");
    import("./lib/v2/app-hax-user-menu-button.js");
    this.dispatchEvent(
      new CustomEvent("app-hax-loaded", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      }),
    );
    store.appReady = true;
    autorun(() => {
      if (toJS(store.appReady)) {
        globalThis.document.body.classList.add("app-loaded");
      } else {
        globalThis.document.body.classList.remove("app-loaded");
      }
    });
    store.appEl = this;
    autorun(() => {
      if (store.activeItem) {
        this.activeItem = toJS(store.activeItem);
      }
    });
    autorun(() => {
      this.soundIcon = toJS(store.soundStatus)
        ? new URL("./lib/assets/images/FullVolume.svg", import.meta.url).href
        : new URL("./lib/assets/images/Silence.svg", import.meta.url).href;
      if (!toJS(store.soundStatus)) {
        store.toast("Sound off.. hey! HELLO!?!", 2000, { fire: true });
      } else {
        store.toast("You can hear me now? Good.", 2000, { hat: "random" });
      }
    });

    // App is ready and the user is Logged in
    autorun(async () => {
      if (
        toJS(store.appReady) &&
        store.AppHaxAPI &&
        toJS(store.isLoggedIn) &&
        toJS(store.appSettings) &&
        toJS(store.refreshSiteList)
      ) {
        // Need this for the auto run when testing new user
        // if we get new data source, trigger a rebuild of the site list
        const results = await AppHaxAPI.makeCall("getSitesList");
        store.manifest = results.data;
      } else if (toJS(store.appReady) && !toJS(store.isLoggedIn)) {
        this.login();
      }
    });
  }

  toggleMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    store.appEl.playSound("click");
  }

  closeMenu() {
    this.userMenuOpen = false;
  }

  openMerlin() {
    store.appEl.playSound("click");
    SuperDaemonInstance.open();
  }

  render() {
    return html`<app-hax-router></app-hax-router>
      <header>
        <app-hax-top-bar>
          <slot name="app-header-pre" slot="left"></slot>
          <a
            id="home"
            title="${this.t.home}"
            href="home"
            tabindex="-1"
            slot="left"
          >
            <simple-icon-lite
              id="hlogo"
              icon="hax:hax2022"
              tabindex="0"
              class="haxLogo"
              title="${this.t.home}"
              data-simple-tour-stop
              data-stop-title="data-label"
              data-label="${this.t.home}"
            >
              <div data-stop-content slot="tour" style="display:none;">
                You can come back to this home screen whenever you click this!
              </div>
            </simple-icon-lite>
          </a>
          <simple-tooltip for="hlogo" position="right" slot="left"
            >${this.t.home}</simple-tooltip
          >
          <simple-toolbar-button
            icon="hax:wizard-hat"
            label="${this.t.merlin}"
            voice-command="${this.t.merlin}"
            icon-position="left"
            id="merlin"
            @click="${this.openMerlin}"
            slot="center"
            data-event="super-daemon"
            show-text-label
          ></simple-toolbar-button>
          <wired-button
            elevation="1"
            slot="right"
            class="soundToggle"
            id="soundtb"
            @click="${soundToggle}"
            data-simple-tour-stop
            data-stop-title="data-label"
            data-label="Sound"
            aria-label="Toggle sound effects ${this.soundIcon.includes(
              "FullVolume",
            )
              ? "off"
              : "on"}"
            aria-pressed="${this.soundIcon.includes("FullVolume")}"
          >
            <span class="wired-button-label">Toggle sound effects</span>
            <simple-icon-lite
              src="${this.soundIcon}"
              loading="lazy"
              decoding="async"
              alt="${this.soundIcon.includes("FullVolume")
                ? "Sound enabled"
                : "Sound disabled"}"
            >
            </simple-icon-lite>
            <div slot="tour" data-stop-content>
              Not a fan of the (awesome) sound effects? You can mute them if you
              prefer.
            </div>
          </wired-button>
          <simple-tooltip for="soundtb" position="bottom" slot="right"
            >Toggle sound</simple-tooltip
          >
          <app-hax-wired-toggle id="wt" slot="right"></app-hax-wired-toggle>
          <simple-tooltip for="wt" position="bottom" slot="right"
            >Toggle dark mode</simple-tooltip
          >
          <app-hax-user-menu
            slot="right"
            id="user-menu"
            ?is-open="${this.userMenuOpen}"
            data-simple-tour-stop
            data-stop-title="data-label"
            data-label="Menu"
          >
            <div slot="tour" data-stop-content>
              You want to log out and be someone else? Create a new site? Click
              your character. Your character is unique to you!
            </div>
            <button
              @click="${this.toggleMenu}"
              class="topbar-character"
              slot="menuButton"
              id="tbchar"
              title="System menu"
              aria-label="User menu for ${this.userName}"
              aria-expanded="${this.userMenuOpen}"
              aria-haspopup="menu"
            >
              <rpg-character
                seed="${this.userName}"
                width="68"
                height="68"
                hat="${this.userMenuOpen ? "edit" : "none"}"
                alt="Avatar for ${this.userName}"
                role="img"
              ></rpg-character>
              <span class="characterbtn-name" aria-hidden="true"
                >${this.userName}</span
              >
            </button>
            <a
              slot="main-menu"
              title="${this.t.listMySites}"
              href="home"
              tabindex="-1"
            >
              <app-hax-user-menu-button
                icon="hax:hax2022"
                label="${this.t.listMySites}"
                part="listMySites"
              ></app-hax-user-menu-button>
            </a>
            <!-- <app-hax-user-menu-button
              slot="main-menu"
              icon="face"
              label="Account Info"
            ></app-hax-user-menu-button> -->
            <app-hax-user-menu-button
              slot="post-menu"
              class="logout"
              label="Logout"
              @click=${this.logout}
            ></app-hax-user-menu-button>
          </app-hax-user-menu>
        </app-hax-top-bar>
      </header>
      <main @click="${this.closeMenu}">
        <confetti-container id="confetti">
          <div class="label">
            <app-hax-label heading-level="1">
              HAX Site Dashboard
              <div slot="subtitle">Let's build something awesome!</div>
            </app-hax-label>
          </div>
          <section class="content">
            <div class="start-journey">
              <app-hax-use-case-filter></app-hax-use-case-filter>
            </div>
          </section>
        </confetti-container>
      </main>`;
  }

  siteReadyToGo(e) {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      },
    );
    if (e.detail) {
      store.siteReady = true;
    }
  }
}


customElements.define(AppHax.tag, AppHax);

globalThis.AppHax = globalThis.AppHax || {};

globalThis.AppHax.requestAvailability = () => {
  if (!globalThis.AppHax.instance && globalThis.document) {
    globalThis.AppHax.instance = globalThis.document.querySelector(AppHax.tag);
  }
  return globalThis.AppHax.instance;
};
