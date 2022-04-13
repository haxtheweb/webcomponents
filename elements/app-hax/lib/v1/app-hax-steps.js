/* eslint-disable lit/attribute-value-entities */
/* eslint-disable lit/binding-positions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
import { html, css } from "lit";
import { autorun, toJS } from "mobx";
import "./AppHaxRouter.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { store } from "./AppHaxStore.js";
import {
  localStorageSet,
  localStorageGet,
} from "@lrnwebcomponents/utils/utils.js";
import "scrollable-component/index.js";
import "./app-hax-site-button.js";
import "./app-hax-hat-progress.js";
import "./app-hax-button.js";

export class AppHaxSteps extends SimpleColors {
  static get tag() {
    return "app-hax-steps";
  }

  constructor() {
    super();
    this.stepRoutes = [];
    this._progressReady = false;
    this.step = null;
    this.loaded = false;
    this.themeNames = [];
    this.appSettings = {};
    autorun(() => {
      this.appSettings = toJS(store.appSettings);
      this.themeNames = Object.keys(this.appSettings.themes);
    });
    autorun(() => {
      localStorageSet("app-hax-step", toJS(store.step));
    });
    autorun(() => {
      localStorageSet("app-hax-site", toJS(store.site));
      this.step = store.stepTest(this.step);
    });
    autorun(() => {
      if (toJS(store.createSiteSteps)) {
        const location = toJS(store.location);
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
      loaded: { type: Boolean, reflect: true },
      appSettings: { type: Object },
    };
  }

  // step 1
  chooseStructure(e) {
    const { value } = e.target;
    store.site.structure = value;
    store.appEl.playSound("click2");
  }

  // step 2
  chooseType(e) {
    const { value } = e.target;
    store.site.type = value;
    store.appEl.playSound("click2");
  }

  // step 3
  chooseTheme(e) {
    const { value } = e.target;
    store.site.theme = value;
    store.appEl.playSound("click2");
  }

  // step 4
  chooseName(e) {
    const value = this.shadowRoot.querySelector("#sitename").value;
    store.site.name = value;
    store.appEl.playSound("click2");
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
          store.site.name
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
        store[propName] = this[propName];
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.maintainScroll.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.maintainScroll.bind(this));
    super.disconnectedCallback();
  }

  // account for resizing

  maintainScroll() {
    if (this.shadowRoot && this.step) {
      this.scrollToThing(`#step-${this.step}`, {
        behavior: "instant",
        block: "nearest",
        inline: "nearest",
      });
      // account for an animated window drag... stupid.
      setTimeout(() => {
        this.scrollToThing(`#step-${this.step}`, {
          behavior: "instant",
          block: "nearest",
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
        block: "nearest",
        inline: "nearest",
      });
    }, 100);

    autorun(() => {
      // verify we are in the site creation process
      if (toJS(store.createSiteSteps) && toJS(store.appReady)) {
        const location = toJS(store.location);
        if (location.route && location.route.step && location.route.id) {
          // account for an animated window drag... stupid.
          setTimeout(() => {
            this.scrollToThing("#".concat(location.route.id), {
              block: "nearest",
              inline: "nearest",
              behavior: "smooth",
            });
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
        if (activeItem && activeItem.step && !this.__overrideProgression) {
          this.shadowRoot.querySelector("#link-".concat(activeItem.id)).click();
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
    const isSafari = window.safari !== undefined;
    if (isSafari) {
      this.shadowRoot.querySelector(sel).scrollIntoView();
    } else {
      this.shadowRoot.querySelector(sel).scrollIntoView(props);
    }
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          color: var(--app-hax-accent-color, var(--accent-color));
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
          grid-template-columns: 200px 200px;
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
          justify-content: center;
          scroll-snap-align: center;
          scroll-snap-stop: always;
          width: var(--viewport-width);
          font-size: 1.5rem;
          text-align: center;
          overflow: hidden;
          margin-top: 48px;
        }
        #step-links {
          padding: 0;
          margin: 0;
        }
        li {
          display: inline-flex;
          margin: 4px;
        }
        li {
          border: 1px solid black;
          border-radius: 50%;
          background-color: black;
        }
        li a {
          padding: 5px;
          width: 5px;
          height: 5px;
          margin: 0;
          display: block;
        }
        li a[disabled] {
          pointer-events: none;
        }
        li[disabled] {
          background-color: grey;
        }
        li.active-step {
          background-color: orange;
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
          width: 60vw;
        }
        .theme-button {
          background-color: transparent;
          border: none;
          margin: 8px;
          padding: 8px;
          width: 245px;
        }
        .theme-button div {
          font-family: "Press Start 2P", sans-serif;
          font-size: 16px;
          margin-top: 16px;
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
          font-size: 64px;
          padding: 8px;
          width: 40vw;
          text-align: center;
        }

        app-hax-site-button {
          --app-hax-site-button-width: 30vw;
          --app-hax-site-button-min-width: 300px;
        }
        app-hax-hat-progress {
          height: 400px;
          width: 400px;
          display: block;
        }
      `,
    ];
  }

  progressFinished(e) {
    if (e.detail) {
      this.loaded = true;
      store.appEl.playSound("success");
    }
  }

  stepLinkClick(e) {
    const clickedStep = parseInt(e.target.getAttribute("data-step"));
    if (this.step < clickedStep) {
      e.preventDefault();
    }
    // means user went backwards
    else if (this.step > clickedStep) {
      if (clickedStep === 1) {
        store.site.structure = null;
        store.site.type = null;
        store.site.theme = null;
      } else if (clickedStep === 2) {
        store.site.type = null;
        store.site.theme = null;
      } else if (clickedStep === 3) {
        store.site.theme = null;
      }
      this.step = clickedStep;
    }
  }

  renderTypes(step) {
    const structure = toJS(store.site.structure);
    var template = html``;
    switch (structure) {
      case "portfolio":
        template = html` <app-hax-button
            tabindex="${this.step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="Technology"
          ></app-hax-button>
          <app-hax-button
            tabindex="${this.step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="Business"
          ></app-hax-button>
          <app-hax-button
            tabindex="${this.step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="Art"
          ></app-hax-button>
          <app-hax-button
            tabindex="${this.step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
          ></app-hax-button>`;
        break;
      default:
      case "course":
        template = html` <app-hax-button
            tabindex="${this.step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="6w"
          ></app-hax-button>
          <app-hax-button
            tabindex="${this.step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="15w"
          ></app-hax-button>
          <app-hax-button
            tabindex="${this.step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
            type="training"
          ></app-hax-button>
          <app-hax-button
            tabindex="${this.step !== 2 ? "-1" : ""}"
            @click=${this.chooseType}
          ></app-hax-button>`;
        break;
    }
    return template;
  }
  render() {
    return html`
      <div id="container">
        <ul id="step-links">
          ${this.stepRoutes.map(
            (item) =>
              html`<li
                ?disabled="${this.step < item.step ? true : false}"
                class="${this.step === item.step ? "active-step" : ""}"
              >
                <a
                  href="${item.path}"
                  ?disabled="${this.step < item.step ? true : false}"
                  @click="${this.stepLinkClick}"
                  id="link-${item.id}"
                  title="${item.label}"
                  data-step="${item.step}"
                ></a>
              </li>`
          )}
        </ul>
        <scrollable-component>
          <div class="carousel-with-snapping-track">
            <div class="carousel-with-snapping-item" id="step-1">
              <div class="step-wrapper">
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? "-1" : ""}"
                  label="> Course"
                  value="course"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? "-1" : ""}"
                  label="> Portfolio"
                  value="portfolio"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
              </div>
            </div>
            <div class="carousel-with-snapping-item" id="step-2">
              <div id="grid-container">
                ${this.renderTypes(this.step)}
              </div>
          </div>
          <div class="carousel-with-snapping-item" id="step-3">
              <div id="themeContainer">
                ${
                  this.appSettings && this.appSettings.themes
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
                              src=${this.appSettings.themes[themeKey].thumbnail}
                              alt=""
                              loading="lazy"
                              decoding="async"
                            />
                            <div>${this.appSettings.themes[themeKey].name}</div>
                          </button>
                        `
                      )
                    : ``
                }
              </div>
            </div>
            <div class="carousel-with-snapping-item" id="step-4">
              <input id="sitename"
              tabindex="${this.step !== 4 ? "-1" : ""}">
              <app-hax-site-button
                  class="sitenamebtn"
                  tabindex="${this.step !== 4 ? "-1" : ""}"
                  label="> Create journey"
                  @click=${this.chooseName}
                ></app-hax-site-button>
            </div>
            <div class="carousel-with-snapping-item" id="step-5">
              <app-hax-hat-progress
                @progress-ready="${this.progressReady}"
                @promise-progress-finished="${this.progressFinished}"
                tabindex="${this.step !== 5 ? "-1" : ""}"
              ></app-hax-hat-progress>
            </div>
        </scrollable-component>
      </div>
    `;
  }
}
customElements.define(AppHaxSteps.tag, AppHaxSteps);
