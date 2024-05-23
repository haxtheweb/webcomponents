/* eslint-disable lit/attribute-value-entities */
/* eslint-disable lit/binding-positions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
import { html, css, unsafeCSS } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { autorun, toJS } from "mobx";
import { store } from "./AppHaxStore.js";
import { localStorageSet } from "@haxtheweb/utils/utils.js";
import "scrollable-component/index.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import "./app-hax-site-button.js";
import "./app-hax-hat-progress.js";
import "./app-hax-button.js";

const homeIcon = new URL("../assets/images/Home.svg", import.meta.url).href;
const disabledCircle = new URL(
  "../assets/images/DisabledCircle.svg",
  import.meta.url,
).href;
const transparentCircle = new URL(
  "../assets/images/TransparentCircle.svg",
  import.meta.url,
).href;
const enabledCircle = new URL(
  "../assets/images/EnabledCircle.svg",
  import.meta.url,
).href;

const themeContext = {
  collection: ["collections-theme", "bootstrap-theme"],
  blog: ["haxor-slevin"],
  course: ["clean-one", "clean-two", "learn-two-theme"],
  website: ["polaris-theme"],
  training: ["training-theme"],
  import: ["clean-one", "clean-two", "learn-two-theme"],
};
export class AppHaxSteps extends SimpleColors {
  static get tag() {
    return "app-hax-steps";
  }

  constructor() {
    super();
    this.unlockComingSoon = false;
    this.unlockTerrible = false;
    this.windowControllers = new AbortController();
    this.nameTyped = "";
    this.stepRoutes = [];
    this._progressReady = false;
    this.step = null;
    this.loaded = false;
    this.themeNames = [];
    this.appSettings = {};
    autorun(() => {
      this.appSettings = toJS(store.appSettings);
      const contextKey = toJS(store.site.structure);
      this.themeNames = Object.keys(this.appSettings.themes).filter(
        (value) =>
          contextKey &&
          themeContext[contextKey] &&
          themeContext[contextKey].includes(value),
      );
    });
    autorun(() => {
      this.dark = toJS(store.darkMode);
    });
    autorun(() => {
      localStorageSet("app-hax-step", toJS(store.step));
    });
    autorun(() => {
      localStorageSet("app-hax-site", toJS(store.site));
      this.step = store.stepTest(this.step);
    });
    autorun(() => {
      if (toJS(store.createSiteSteps) && toJS(store.location)) {
        this.step = store.stepTest(this.step);
      }
    });
    // routes, but only the ones that have a step property
    autorun(() => {
      const routes = toJS(store.routes);
      this.stepRoutes = routes.filter((item) => item.step);
    });
  }

  static get properties() {
    return {
      ...super.properties,
      step: { type: Number, reflect: true },
      stepRoutes: { type: Array },
      themeNames: { type: Array },
      unlockComingSoon: {
        type: Boolean,
        reflect: true,
        attribute: "unlock-coming-soon",
      },
      unlockTerrible: {
        type: Boolean,
        reflect: true,
        attribute: "unlock-terrible",
      },
      loaded: { type: Boolean, reflect: true },
      appSettings: { type: Object },
      nameTyped: { type: String },
    };
  }

  // step 1
  chooseStructure(e) {
    if (!e.target.comingSoon) {
      const { value } = e.target;
      store.site.structure = value;
      // @note for now, auto select type and theme if making a course
      // we might want to revisit this in the future
      if (value === "course") {
        store.site.type = "own";
        store.site.theme = "clean-one";
      }
      if (value === "blog") {
        store.site.type = "own";
        store.site.theme = "haxor-slevin";
      }
      if (value === "collection") {
        store.site.type = "own";
        store.site.theme = "collections-theme";
      }
      if (value === "website") {
        store.site.type = "own";
        store.site.theme = "polaris-theme";
      }
      if (value === "training") {
        store.site.type = "own";
        store.site.theme = "training-theme";
      }
      store.appEl.playSound("click2");
    }
  }

  // step 2
  chooseType(e) {
    if (!e.target.comingSoon) {
      const { type } = e.target;
      store.site.type = type;
      store.appEl.playSound("click2");
    }
  }
  // step 2, doc import
  async docxImport(e) {
    if (!e.target.comingSoon) {
      const { type } = e.target;
      import(
        "@haxtheweb/file-system-broker/lib/docx-file-system-broker.js"
      ).then(async (e) => {
        // enable core services
        enableServices(["haxcms"]);
        // get the broker for docx selection
        const broker = globalThis.FileSystemBroker.requestAvailability();
        const file = await broker.loadFile("docx");
        // tee up as a form for upload
        const formData = new FormData();
        formData.append("method", "site"); // this is a site based importer
        formData.append("type", toJS(store.site.structure));
        formData.append("upload", file);
        this.setProcessingVisual();
        const response = await MicroFrontendRegistry.call(
          "@haxcms/docxToSite",
          formData,
        );
        store.toast(`Processed!`, 300);
        // must be a valid response and have at least SOME html to bother attempting
        if (
          response.status == 200 &&
          response.data &&
          response.data.contents != ""
        ) {
          store.items = response.data.items;
          if (response.data.files) {
            store.itemFiles = response.data.files;
          }
          // invoke a file broker for a docx file
          // send to the endpoint and wait
          // if it comes back with content, then we engineer details off of it
          this.nameTyped = response.data.filename
            .replace(".docx", "")
            .replace("outline", "")
            .replace(/\s/g, "")
            .replace(/-/g, "")
            .toLowerCase();
          setTimeout(() => {
            this.shadowRoot.querySelector("#sitename").value = this.nameTyped;
            this.shadowRoot.querySelector("#sitename").select();
          }, 800);
          store.site.type = type;
          store.site.theme = "clean-one";
          store.appEl.playSound("click2");
        } else {
          store.appEl.playSound("error");
          store.toast(`File did not return valid HTML structure`);
        }
      });
    }
  }
  // evolution import
  async evoImport(e) {
    if (!e.target.comingSoon) {
      const { type } = e.target;
      import("@haxtheweb/file-system-broker/file-system-broker.js").then(
        async (e) => {
          // enable core services
          enableServices(["haxcms"]);
          // get the broker for docx selection
          const broker = globalThis.FileSystemBroker.requestAvailability();
          const file = await broker.loadFile("zip");
          // tee up as a form for upload
          const formData = new FormData();
          formData.append("method", "site"); // this is a site based importer
          formData.append("type", toJS(store.site.structure));
          formData.append("upload", file);
          // local end point + stupid JWT thing
          this.setProcessingVisual();
          const response = await MicroFrontendRegistry.call(
            "@haxcms/evolutionToSite",
            formData,
            null,
            null,
            "?jwt=" + toJS(store.AppHaxAPI.jwt),
          );
          store.toast(`Processed!`, 300);
          // must be a valid response and have at least SOME html to bother attempting
          if (
            response.status == 200 &&
            response.data &&
            response.data.contents != ""
          ) {
            store.items = response.data.items;
            // invoke a file broker for a docx file
            // send to the endpoint and wait
            // if it comes back with content, then we engineer details off of it
            this.nameTyped = response.data.filename
              .replace(".zip", "")
              .replace("outline", "")
              .replace(/\s/g, "")
              .replace(/-/g, "")
              .toLowerCase();
            setTimeout(() => {
              this.shadowRoot.querySelector("#sitename").value = this.nameTyped;
              this.shadowRoot.querySelector("#sitename").select();
            }, 800);
            store.site.type = type;
            store.site.theme = "clean-one";
            store.appEl.playSound("click2");
          } else {
            store.appEl.playSound("error");
            store.toast(`File did not return valid HTML structure`);
          }
        },
      );
    }
  }
  // gitbook import endpoint
  async gbImport(e) {
    if (!e.target.comingSoon) {
      const { type } = e.target;
      let gbURL = globalThis.prompt("URL for the Gitbook repo");
      enableServices(["haxcms"]);
      this.setProcessingVisual();
      const response = await MicroFrontendRegistry.call(
        "@haxcms/gitbookToSite",
        { md: gbURL },
      );
      store.toast(`Processed!`, 300);
      // must be a valid response and have at least SOME html to bother attempting
      if (
        response.status == 200 &&
        response.data &&
        response.data.contents != ""
      ) {
        store.items = response.data.items;
        if (response.data.files) {
          store.itemFiles = response.data.files;
        }
        // invoke a file broker for a docx file
        // send to the endpoint and wait
        // if it comes back with content, then we engineer details off of it
        this.nameTyped = response.data.filename
          .replace(/\s/g, "")
          .replace(/-/g, "")
          .toLowerCase();
        setTimeout(() => {
          this.shadowRoot.querySelector("#sitename").value = this.nameTyped;
          this.shadowRoot.querySelector("#sitename").select();
        }, 800);
        store.site.type = type;
        store.site.theme = "clean-one";
        store.appEl.playSound("click2");
      } else {
        store.appEl.playSound("error");
        store.toast(`Repo did not return valid structure`);
      }
    }
  }
  async importFromURL(e) {
    const { type, prompt, callback, param } = e.target;
    if (!e.target.comingSoon) {
      let promptUrl = globalThis.prompt(prompt);
      enableServices(["haxcms"]);
      this.setProcessingVisual();
      const params = {};
      params[param] = promptUrl;
      const response = await MicroFrontendRegistry.call(callback, params);
      store.toast(`Processed!`, 300);
      // must be a valid response and have at least SOME html to bother attempting
      if (
        response.status == 200 &&
        response.data &&
        response.data.contents != ""
      ) {
        store.items = response.data.items;
        if (response.data.files) {
          store.itemFiles = response.data.files;
        }
        // invoke a file broker for a docx file
        // send to the endpoint and wait
        // if it comes back with content, then we engineer details off of it
        this.nameTyped = response.data.filename
          .replace(/\s/g, "")
          .replace(/-/g, "")
          .toLowerCase();
        setTimeout(() => {
          this.shadowRoot.querySelector("#sitename").value = this.nameTyped;
          this.shadowRoot.querySelector("#sitename").select();
        }, 800);
        store.site.type = type;
        store.site.theme = "clean-one";
        store.appEl.playSound("click2");
      } else {
        store.appEl.playSound("error");
        store.toast(`Repo did not return valid structure`);
      }
    }
  }
  // notion import endpoint
  async notionImport(e) {
    if (!e.target.comingSoon) {
      const { type } = e.target;
      let notionUrl = globalThis.prompt("URL for the Github Notion repo");
      enableServices(["haxcms"]);
      this.setProcessingVisual();
      const response = await MicroFrontendRegistry.call(
        "@haxcms/notionToSite",
        { repoUrl: notionUrl },
      );
      store.toast(`Processed!`, 300);
      // must be a valid response and have at least SOME html to bother attempting
      if (
        response.status == 200 &&
        response.data &&
        response.data.contents != ""
      ) {
        store.items = response.data.items;
        if (response.data.files) {
          store.itemFiles = response.data.files;
        }
        // invoke a file broker for a docx file
        // send to the endpoint and wait
        // if it comes back with content, then we engineer details off of it
        this.nameTyped = response.data.filename
          .replace(/\s/g, "")
          .replace(/-/g, "")
          .toLowerCase();
        setTimeout(() => {
          this.shadowRoot.querySelector("#sitename").value = this.nameTyped;
          this.shadowRoot.querySelector("#sitename").select();
        }, 800);
        store.site.type = type;
        store.site.theme = "clean-one";
        store.appEl.playSound("click2");
      } else {
        store.appEl.playSound("error");
        store.toast(`Repo did not return valid structure`);
      }
    }
  }
  // pressbooks import endpoint
  async pressbooksImport(e) {
    if (!e.target.comingSoon) {
      const { type } = e.target;
      import(
        "@haxtheweb/file-system-broker/lib/docx-file-system-broker.js"
      ).then(async (e) => {
        // enable core services
        enableServices(["haxcms"]);
        // get the broker for docx selection
        const broker = globalThis.FileSystemBroker.requestAvailability();
        const file = await broker.loadFile("html");
        // tee up as a form for upload
        const formData = new FormData();
        formData.append("method", "site"); // this is a site based importer
        formData.append("type", toJS(store.site.structure));
        formData.append("upload", file);
        this.setProcessingVisual();
        const response = await MicroFrontendRegistry.call(
          "@haxcms/pressbooksToSite",
          formData,
        );
        store.toast(`Processed!`, 300);
        // must be a valid response and have at least SOME html to bother attempting
        if (
          response.status == 200 &&
          response.data &&
          response.data.contents != ""
        ) {
          store.items = response.data.items;
          if (response.data.files) {
            store.itemFiles = response.data.files;
          }
          // invoke a file broker for a html file
          // send to the endpoint and wait
          // if it comes back with content, then we engineer details off of it
          this.nameTyped = response.data.filename
            .replace(".html", "")
            .replace("outline", "")
            .replace(/\s/g, "")
            .replace(/-/g, "")
            .toLowerCase();
          setTimeout(() => {
            this.shadowRoot.querySelector("#sitename").value = this.nameTyped;
            this.shadowRoot.querySelector("#sitename").select();
          }, 800);
          store.site.type = type;
          store.site.theme = "clean-one";
          store.appEl.playSound("click2");
        } else {
          store.appEl.playSound("error");
          store.toast(`File did not return valid HTML structure`);
        }
      });
    }
  }
  // makes guy have hat on, shows it's doing something
  setProcessingVisual() {
    let loadingIcon = globalThis.document.createElement("simple-icon-lite");
    loadingIcon.icon = "hax:loading";
    loadingIcon.style.setProperty("--simple-icon-height", "40px");
    loadingIcon.style.setProperty("--simple-icon-width", "40px");
    loadingIcon.style.height = "150px";
    loadingIcon.style.marginLeft = "8px";
    store.toast(`Processing`, 60000, {
      hat: "construction",
      slot: loadingIcon,
    });
  }
  // step 3
  chooseTheme(e) {
    if (!e.target.comingSoon) {
      const { value } = e.target;
      store.site.theme = value;
      store.appEl.playSound("click2");
    }
  }

  // step 4
  chooseName() {
    if (this.nameTyped !== "") {
      const value = this.shadowRoot.querySelector("#sitename").value;
      store.site.name = value;
      store.appEl.playSound("click2");
    }
  }

  progressReady(e) {
    if (e.detail) {
      this._progressReady = true;
      if (this.step === 5) {
        setTimeout(() => {
          this.shadowRoot.querySelector("app-hax-hat-progress").process();
        }, 300);
      }
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // set input field to whats in store if we have it
      if (this.step === 4 && propName === "step" && this.shadowRoot) {
        this.shadowRoot.querySelector("#sitename").value = toJS(
          store.site.name,
        );
      }
      // progress
      if (
        this.step === 5 &&
        propName === "step" &&
        this.shadowRoot &&
        this._progressReady
      ) {
        setTimeout(() => {
          this.shadowRoot.querySelector("app-hax-hat-progress").process();
        }, 600);
      }
      // update the store for step when it changes internal to our step flow
      if (propName === "step") {
        store.step = this.step;
      }
      if (propName === "unlockTerrible" && this[propName]) {
        Object.keys(themeContext).forEach((key) => {
          themeContext[key] = [
            ...themeContext[key],
            "terrible-themes",
            "terrible-productionz-themes",
            "terrible-outlet-themes",
            "terrible-best-themes",
            "terrible-resume-themes",
          ];
        });
        const contextKey = toJS(store.site.structure);
        this.themeNames = Object.keys(this.appSettings.themes).filter(
          (value) =>
            contextKey &&
            themeContext[contextKey] &&
            themeContext[contextKey].includes(value),
        );
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("resize", this.maintainScroll.bind(this), {
      signal: this.windowControllers.signal,
    });
    globalThis.addEventListener("popstate", this.popstateListener.bind(this), {
      signal: this.windowControllers.signal,
    });
  }

  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  // see if user navigates forward or backward while in app
  popstateListener(e) {
    // filter out vaadin link clicks which have a state signature
    if (e.type === "popstate" && e.state === null) {
      // a lot going on here, just to be safe
      try {
        // the delay allows clicking for step to change, process, and then testing it
        setTimeout(() => {
          const link = e.target.document.location.pathname.split("/").pop();
          // other links we don't care about validating state
          if (link.includes("createSite")) {
            const step = parseInt(link.replace("createSite-step-", ""));
            if (step < store.stepTest(step)) {
              this.shadowRoot.querySelector("#link-step-" + step).click();
            } else if (step > store.stepTest(step)) {
              store.toast(`Please select an option`);
              this.step = store.stepTest(step);
              // forces state by maintaining where we are
              this.shadowRoot.querySelector("#link-step-" + this.step).click();
            }
          }
        }, 0);
      } catch (e) {}
    }
  }

  // account for resizing
  maintainScroll() {
    if (this.shadowRoot && this.step) {
      this.scrollToThing(`#step-${this.step}`, {
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
      // account for an animated window drag... stupid.
      setTimeout(() => {
        this.scrollToThing(`#step-${this.step}`, {
          behavior: "instant",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    setTimeout(() => {
      // ensure paint issues not a factor for null step
      if (this.step === null) {
        this.step = 1;
      }
      this.scrollToThing(`#step-${this.step}`, {
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
    }, 100);

    autorun(() => {
      // verify we are in the site creation process
      if (toJS(store.createSiteSteps) && toJS(store.appReady)) {
        const location = toJS(store.location);
        if (location.route && location.route.step && location.route.name) {
          // account for an animated window drag... stupid.
          setTimeout(() => {
            this.scrollToThing("#".concat(location.route.name), {
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
            /// just for step 4 since it has an input
            if (location.route.step === 4 && store.stepTest(4) === 4) {
              setTimeout(() => {
                this.shadowRoot.querySelector("#sitename").focus();
                this.scrollToThing(`#step-4`, {
                  behavior: "instant",
                  block: "start",
                  inline: "nearest",
                });
              }, 800);
            }
          }, 300); // this delay helps w/ initial paint timing but also user perception
          // there's a desire to have a delay especialy when tapping things of
          // about 300ms
        }
      }
    });
    autorun(() => {
      if (
        this.shadowRoot &&
        toJS(store.createSiteSteps) &&
        toJS(store.appReady)
      ) {
        const activeItem = toJS(store.activeItem);
        if (
          activeItem &&
          activeItem.name &&
          activeItem.step &&
          !this.__overrideProgression
        ) {
          this.shadowRoot
            .querySelector("#link-".concat(activeItem.name))
            .click();
        }
      }
    });
  }

  /**
   * Yet another reason Apple doesn't let us have nice things.
   * This detects the NONSTANDARD BS VERSION OF SCROLLINTOVIEW
   * and then ensures that it incorrectly calls to scroll into view
   * WITHOUT the wonderful params that ALL OTHER BROWSERS ACCEPT
   * AND MAKE OUR LIVES SO WONDERFUL TO SCROLL TO THINGS SMOOTHLY
   */
  scrollToThing(sel, props) {
    const isSafari = globalThis.safari !== undefined;
    if (
      this.shadowRoot.querySelector(".carousel-with-snapping-item.active-step")
    ) {
      this.shadowRoot
        .querySelector(".carousel-with-snapping-item.active-step")
        .classList.remove("active-step");
    }
    if (isSafari) {
      this.shadowRoot.querySelector(sel).scrollIntoView();
    } else {
      this.shadowRoot.querySelector(sel).scrollIntoView(props);
    }
    this.shadowRoot.querySelector(sel).classList.add("active-step");
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        scrollable-component {
          --scrollbar-width: 0px;
          --scrollbar-height: 0px;
          --scrollbar-padding: 0;
          --viewport-overflow-x: hidden;
          overflow: hidden;
        }
        #grid-container {
          display: grid;
          grid-template-columns: 200px 200px 200px;
          background: transparent;
        }
        .carousel-with-snapping-track {
          display: grid;
          grid-auto-flow: column;
          grid-gap: 30px;
        }
        .carousel-with-snapping-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: normal;
          scroll-snap-align: center;
          scroll-snap-stop: always;
          scrollbar-gutter: stable;
          width: var(--viewport-width);
          font-size: 1.5rem;
          text-align: center;
          overflow-x: hidden;
          max-height: 60vh;
          padding-top: 1vh;
        }
        #step-links {
          padding: 0;
          margin: 0;
        }
        ul,
        li {
          list-style: none;
        }
        li {
          vertical-align: middle;
          display: inline-flex;
          margin: 5px;
        }
        li.step {
          border-radius: 50%;
          background-color: transparent;
        }
        li a {
          font-size: 12px;
          color: var(--simple-colors-default-theme-grey-12, white);
          text-decoration: none;
          padding: 5px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          margin: 0;
          display: block;
          border: 0;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-size: 30px 30px;
          background-color: var(--simple-colors-default-theme-grey-1, white);
          background-image: url("${unsafeCSS(enabledCircle)}");
          transition:
            0.3s ease-in-out background,
            0.3s ease-in-out color;
          transition-delay: 0.6s, 0.3s;
        }
        li a[disabled] {
          background-image: url("${unsafeCSS(disabledCircle)}");
          pointer-events: none;
          color: var(--simple-colors-default-theme-grey-7, grey);
          user-select: none;
        }
        li[disabled] {
          background-color: grey;
        }
        li.active-step a {
          background-color: orange;
          background-image: url("${unsafeCSS(transparentCircle)}");
        }
        app-hax-button {
          padding: 10px 0px 10px 0px;
          background: transparent;
        }
        #theme-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        img {
          pointer-events: none;
        }
        #themeContainer {
          width: 70vw;
          height: 55vh;
        }
        .theme-button {
          background-color: transparent;
          color: var(--simple-colors-default-theme-grey-12, white);
          border: none;
          margin: 8px;
          padding: 8px;
          width: 245px;
        }

        .theme-button div {
          font-family: "Press Start 2P", sans-serif;
          font-size: 14px;
          margin-top: 12px;
        }
        .theme-button:focus,
        .theme-button:hover {
          outline: 4px solid var(--app-hax-accent-color, var(--accent-color));
          outline-offset: 4px;
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
        #sitename {
          font-family: "Press Start 2P", sans-serif;
          font-size: 32px;
          padding: 8px;
          width: 40vw;
        }
        #homebtn {
          --simple-icon-height: 30px;
          --simple-icon-width: 30px;
          border-radius: 50%;
          cursor: pointer;
          background-color: var(--simple-colors-default-theme-grey-1, white);
        }
        .homelnk {
          background-image: none;
          display: flex;
          padding: 0;
          margin: 0;
          height: 30px;
          width: 30px;
        }
        app-hax-site-button {
          justify-content: center;
          --app-hax-site-button-width: 35vw;
          --app-hax-site-button-min-width: 240px;
        }
        app-hax-hat-progress {
          height: 400px;
          width: 400px;
          display: block;
        }

        @media (max-width: 800px) {
          .theme-button {
            width: unset;
            padding: 0;
          }
          .theme-button div {
            font-size: 12px;
            margin-top: 8px;
          }
          .theme-button img {
            height: 70px;
          }
          app-hax-site-button {
            width: 320px;
            max-width: 60vw;
            --app-hax-site-button-font-size: 2.5vw;
          }
          #sitename {
            width: 70vw;
            font-size: 20px;
          }
          #grid-container {
            grid-template-columns: 150px 150px 150px;
          }
        }
        @media (max-height: 600px) {
          .carousel-with-snapping-item {
            padding-top: 4px;
            max-height: 57vh;
          }
          #sitename {
            width: 40vw;
            font-size: 14px;
          }
          app-hax-hat-progress {
            transform: scale(0.5);
            margin-top: -18vh;
          }
        }
        @media (max-width: 500px) {
          app-hax-hat-progress {
            transform: scale(0.5);
            margin-top: -15vh;
          }
        }
        @media (max-height: 400px) {
          .carousel-with-snapping-item {
            padding-top: 4px;
            max-height: 40vh;
          }
          app-hax-hat-progress {
            transform: scale(0.3);
          }
          .carousel-with-snapping-item.active-step app-hax-hat-progress {
            position: fixed;
            top: 20%;
            left: 20%;
          }
        }
      `,
    ];
  }

  progressFinished(e) {
    if (e.detail) {
      this.loaded = true;
      store.appEl.playSound("success");
      // focus the button for going to the site
      e.target.shadowRoot.querySelector(".game").focus();
      this.scrollToThing(`#step-${this.step}`, {
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
    }
  }

  typeKey() {
    this.nameTyped = this.shadowRoot.querySelector("#sitename").value;
  }
  keydown(e) {
    // some trapping for common characters that make us sad
    if (
      [
        " ",
        "/",
        "\\",
        "&",
        "#",
        "?",
        "+",
        "=",
        "{",
        "}",
        "|",
        "^",
        "~",
        "[",
        "]",
        "`",
        '"',
        "'",
      ].includes(e.key)
    ) {
      store.appEl.playSound("error");
      store.toast(`"${e.key}" is not allowed. Use - or _`);
      e.preventDefault();
    } else if (e.key === "Enter") {
      this.chooseName();
    } else if (
      ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(e.key)
    ) {
      // do nothing, directional keys for modifying word
    } else {
      store.appEl.playSound("click");
    }
  }

  stepLinkClick(e) {
    const clickedStep = parseInt(e.target.getAttribute("data-step"), 10);
    if (this.step < clickedStep) {
      e.preventDefault();
    } else if (e.target.getAttribute("data-step") === null) {
      store.createSiteSteps = false;
      store.appMode = "home";
      this.nameTyped = "";
      store.siteReady = false;
      store.site.structure = null;
      store.site.type = null;
      store.site.theme = null;
      store.site.name = null;
    }
    // means user went backwards
    else if (this.step > clickedStep) {
      this.nameTyped = "";
      store.siteReady = false;
      if (clickedStep === 1) {
        store.site.structure = null;
        store.site.type = null;
        store.site.theme = null;
        store.site.name = null;
      } else if (clickedStep === 2) {
        store.site.type = null;
        store.site.theme = null;
        store.site.name = null;
      } else if (clickedStep === 3) {
        store.site.theme = null;
        store.site.name = null;
      } else if (clickedStep === 4) {
        store.site.name = null;
      }
      this.step = clickedStep;
    }
  }

  renderTypes(step) {
    const structure = toJS(store.site.structure);
    var template = html``;
    switch (structure) {
      case "collection":
        template = html` <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="technology"
            ?coming-soon="${!this.unlockComingSoon}"
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="business"
            ?coming-soon="${!this.unlockComingSoon}"
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="art"
            ?coming-soon="${!this.unlockComingSoon}"
          ></app-hax-button>`;
        break;
      default:
      case "course":
        template = html` <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="15w"
          ></app-hax-button>`;
        break;
      case "website":
        template = html` <app-hax-button
          tabindex="${step !== 2 ? "-1" : ""}"
          @click=${this.chooseType}
          type="website"
        ></app-hax-button>`;
        break;
      case "training":
        template = html` <app-hax-button
          tabindex="${step !== 2 ? "-1" : ""}"
          @click=${this.chooseType}
          type="training"
        ></app-hax-button>`;
        break;
      case "blog":
        template = html` <app-hax-button
          tabindex="${step !== 2 ? "-1" : ""}"
          @click=${this.chooseType}
          type="blog"
        ></app-hax-button>`;
        break;
      case "import":
        template = html` <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.docxImport}
            type="docx"
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.importFromURL}
            type="elms:ln"
            prompt="URL for the ELMS:LN site"
            callback="@haxcms/elmslnToSite"
            param="repoUrl"
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.importFromURL}
            type="haxcms"
            prompt="URL for the HAXcms site"
            callback="@haxcms/haxcmsToSite"
            param="repoUrl"
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.evoImport}
            type="evolution"
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.importFromURL}
            type="notion"
            prompt="URL for the Notion git repo"
            callback="@haxcms/notionToSite"
            param="repoUrl"
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.importFromURL}
            type="gitbook"
            prompt="URL for the Gitbook git repo"
            callback="@haxcms/gitbookToSite"
            param="md"
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.importFromURL}
            type="html"
            prompt="URL for the html content"
            callback="@haxcms/htmlToSite"
            param="repoUrl"
          ></app-hax-button>
          <app-hax-button
            tabindex="${step !== 2 ? "-1" : ""}"
            @click=${this.pressbooksImport}
            type="pressbooks"
            beta
          ></app-hax-button>`;
        break;
    }
    return template;
  }

  render() {
    return html`
      <div id="container">
        <ul id="step-links">
          <li>
            ${!toJS(store.isNewUser)
              ? html`
                  <a href="home" class="homelnk" tabindex="-1">
                    <simple-icon-lite
                      tabindex="0"
                      src="${homeIcon}"
                      id="homebtn"
                      title="Site list"
                      @click="${this.stepLinkClick}"
                    ></simple-icon-lite>
                  </a>
                  <simple-tooltip for="homebtn" position="bottom"
                    >Site list</simple-tooltip
                  >
                `
              : html``}
          </li>
          ${this.stepRoutes.map(
            (item, index) =>
              html`<li
                ?disabled="${this.step < item.step || this.step === 5
                  ? true
                  : false}"
                class="step ${this.step === item.step ? "active-step" : ""}"
              >
                <a
                  href="${item.path}"
                  ?disabled="${this.step < item.step || this.step === 5
                    ? true
                    : false}"
                  tabindex="${this.step <= item.step ? "-1" : "0"}"
                  @click="${this.stepLinkClick}"
                  id="link-${item.name}"
                  title="Step ${index + 1}: ${item.label}"
                  data-step="${item.step}"
                  >${index + 1}</a
                >
                <simple-tooltip for="link-${item.name}" position="bottom"
                  >Step ${index + 1}: ${item.label}</simple-tooltip
                >
              </li>`,
          )}
        </ul>
        <scrollable-component>
          <div class="carousel-with-snapping-track">
            <div class="carousel-with-snapping-item" id="step-1">
              <div class="step-wrapper">
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? "-1" : ""}"
                  label="&gt; Blog"
                  value="blog"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? "-1" : ""}"
                  label="&gt; Collection"
                  value="collection"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? "-1" : ""}"
                  label="&gt; Course"
                  value="course"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? "-1" : ""}"
                  label="&gt; Training"
                  value="training"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? "-1" : ""}"
                  label="&gt; Website"
                  value="website"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? "-1" : ""}"
                  label="&gt; Import site from.."
                  value="import"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
              </div>
            </div>
            <div class="carousel-with-snapping-item" id="step-2">
              <div id="grid-container">${this.renderTypes(this.step)}</div>
            </div>
            <div class="carousel-with-snapping-item" id="step-3">
              <div id="themeContainer">
                ${this.appSettings && this.appSettings.themes
                  ? this.themeNames.map(
                      (themeKey) => html`
                        <button
                          aria-label="${this.appSettings.themes[themeKey]
                            .name} theme"
                          value="${themeKey}"
                          class="theme-button"
                          @click=${this.chooseTheme}
                          tabindex="${this.step !== 3 ? "-1" : ""}"
                        >
                          <img
                            class="theme-img"
                            src="${this.appSettings.themes[themeKey].thumbnail}"
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                          <div>${this.appSettings.themes[themeKey].name}</div>
                        </button>
                      `,
                    )
                  : ``}
              </div>
            </div>
            <div class="carousel-with-snapping-item" id="step-4">
              <input
                id="sitename"
                @input="${this.typeKey}"
                @keydown="${this.keydown}"
                maxlength="30"
                placeholder="${toJS(store.site.structure)} name.."
                tabindex="${this.step !== 4 ? "-1" : ""}"
              />
              <app-hax-site-button
                class="sitenamebtn"
                tabindex="${this.step !== 4 ? "-1" : ""}"
                label="&gt; Create journey"
                @click=${this.chooseName}
                ?disabled="${this.nameTyped === ""}"
              >
              </app-hax-site-button>
            </div>
            <div class="carousel-with-snapping-item" id="step-5">
              <app-hax-hat-progress
                @progress-ready="${this.progressReady}"
                @promise-progress-finished="${this.progressFinished}"
                tabindex="${this.step !== 5 ? "-1" : ""}"
              ></app-hax-hat-progress>
            </div>
          </div>
        </scrollable-component>
      </div>
    `;
  }
}
customElements.define(AppHaxSteps.tag, AppHaxSteps);
