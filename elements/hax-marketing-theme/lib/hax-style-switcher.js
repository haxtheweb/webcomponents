/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDPaletteStyles } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { getDDDPaletteOptionByValue } from "@haxtheweb/d-d-d/lib/DDDPaletteRegistry.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  loadDesignSystemRegistry,
  siteDesignSystemName,
  themeAcceptsDesignSystems,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSDesignSystems.js";
import "@haxtheweb/d-d-d/lib/hax-palette-picker.js";

const STORAGE_KEY = "hax-style-switcher";
let themesRequest = null;
// themes.json, the theme list a published site ships with (editors get
// theirs from the backend through the appearance dialog)
function loadThemesRegistry() {
  if (!themesRequest) {
    themesRequest = fetch(
      new URL("../../haxcms-elements/lib/themes.json", import.meta.url),
    )
      .then((response) => (response.ok ? response.json() : {}))
      .catch(() => ({}));
  }
  return themesRequest;
}

/**
 * Someone who can edit the site has the appearance dialog, which previews
 * and saves the same choices. The switcher is for visitors, so it stays out
 * of the way of anything an editor could save.
 */
function canEdit() {
  return !!(store.isLoggedIn && !store.previewMode);
}

/**
 * `hax-style-switcher`
 * Lets a visitor swap the site's theme, palette and design system live.
 *
 * It writes the same manifest.metadata.theme shape the appearance preview
 * writes (element, path, variables.palette, designSystem), so the site
 * builder does the swap. Nothing is saved: the pick is kept for the
 * browser session. Logged-in editors see nothing here; they use the
 * appearance dialog.
 *
 * @element hax-style-switcher
 */
class HaxStyleSwitcher extends I18NMixin(DDD) {
  static get tag() {
    return "hax-style-switcher";
  }

  static get properties() {
    return {
      ...super.properties,
      /** short line above the controls */
      heading: { type: String },
      /** render as a button in the corner that opens a panel */
      floating: { type: Boolean, reflect: true },
      /** the floating panel is open */
      open: { type: Boolean, reflect: true },
      theme: { type: String },
      palette: { type: String },
      designSystem: { type: String, attribute: "design-system" },
      _themes: { type: Object, state: true },
      _systems: { type: Object, state: true },
      _siteTheme: { type: Object, state: true },
      _accepts: { type: Boolean, state: true },
      _editor: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.heading = "";
    this.floating = false;
    this.open = false;
    this.theme = "";
    this.palette = "";
    this.designSystem = "";
    this._themes = {};
    this._systems = {};
    this._siteTheme = null;
    this._accepts = true;
    this._editor = false;
    this.t = {
      theme: "Theme",
      designSystem: "Design system",
      dddDefault: "DDD (default)",
      designSystemHelp:
        "Color, type, corners and focus. The theme keeps the layout.",
      designSystemFixed: "This theme keeps its own design system.",
      palette: "Palette",
      themeDefault: "Theme default",
      paletteNumber: "Palette {n}",
      siteTheme: "{name} (this site's theme)",
      restyle: "Restyle this site",
      close: "Close",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(`../locales/${this.tag}.es.json`, import.meta.url).href +
        "/../",
    });
    loadThemesRegistry().then((themes) => {
      this._themes = themes;
    });
    loadDesignSystemRegistry().then((systems) => {
      this._systems = systems;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      const themeData =
        store.manifest && store.manifest.metadata
          ? toJS(store.manifest.metadata.theme)
          : null;
      const editor = canEdit();
      Promise.resolve().then(() => {
        this._editor = editor;
        if (!themeData) {
          return;
        }
        // the site's own theme, kept so it stays in the list when it is
        // not in themes.json (a custom theme)
        if (!HaxStyleSwitcher.siteTheme) {
          HaxStyleSwitcher.siteTheme = themeData;
        }
        this._siteTheme = HaxStyleSwitcher.siteTheme;
        this.theme = themeData.element || "";
        this.palette =
          themeData.variables &&
          typeof themeData.variables.palette !== "undefined" &&
          themeData.variables.palette !== null
            ? `${themeData.variables.palette}`
            : "";
        this.designSystem = siteDesignSystemName(themeData);
        if (this.theme) {
          globalThis.customElements.whenDefined(this.theme).then(() => {
            this._accepts = themeAcceptsDesignSystems(this.theme);
          });
        }
        // the builder sets the theme's palette a moment after a swap
        setTimeout(() => {
          this.requestUpdate();
        }, 700);
      });
    });
  }

  disconnectedCallback() {
    if (this.__disposer) {
      this.__disposer();
    }
    super.disconnectedCallback();
  }

  static get styles() {
    return [
      super.styles,
      DDDPaletteStyles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        :host([hidden]) {
          display: none;
        }
        details {
          border: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            );
          border-radius: var(--ddd-control-radius, var(--ddd-radius-xs));
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        summary {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-spacing-10);
          box-sizing: border-box;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          cursor: pointer;
        }
        summary:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        summary:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .swatches {
          display: inline-flex;
          margin-left: auto;
        }
        .swatches i {
          width: var(--ddd-spacing-3);
          height: var(--ddd-spacing-5);
        }
        details hax-palette-picker {
          padding: var(--ddd-spacing-2);
          /* twenty palettes is a long list on a phone: scroll it in place */
          max-height: min(50dvh, 420px);
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        :host([floating]) {
          position: fixed;
          right: var(--ddd-spacing-4);
          bottom: var(--ddd-spacing-4);
          z-index: 1000;
          max-width: calc(100vw - var(--ddd-spacing-8));
        }
        :host([floating]) .panel {
          width: min(420px, calc(100vw - var(--ddd-spacing-8)));
          box-sizing: border-box;
          padding: var(--ddd-spacing-4);
          margin-bottom: var(--ddd-spacing-2);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          border: var(--ddd-border-size-sm) solid
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
          border-radius: var(--ddd-radius-md);
          box-shadow: var(--ddd-boxShadow-lg);
          /* stay inside a phone screen: the panel scrolls, the page under it does not */
          max-height: calc(100dvh - var(--ddd-spacing-24, 96px));
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        :host([floating]:not([open])) .panel {
          display: none;
        }
        .toggle {
          display: block;
          margin-left: auto;
          font: inherit;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-rounded);
          border: var(--ddd-border-size-sm) solid
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: inherit;
          box-shadow: var(--ddd-boxShadow-md);
        }
        .toggle:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .toggle:active {
          box-shadow: none;
          transform: translateY(1px);
        }
        .toggle:focus-visible,
        select:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .panel {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: var(--ddd-spacing-3) var(--ddd-spacing-5);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-0);
        }
        .heading {
          flex: 1 1 100%;
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          flex: 1 1 160px;
          min-width: 0;
        }
        .field.palette {
          flex: 2 1 260px;
        }
        label {
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        select {
          font: inherit;
          font-size: var(--ddd-font-size-4xs);
          width: 100%;
          min-height: var(--ddd-spacing-10);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--ddd-control-radius, var(--ddd-radius-xs));
          border: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            );
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: inherit;
        }
        select:hover:not(:disabled) {
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        select:disabled {
          opacity: var(--ddd-state-disabled-opacity, 0.6);
          cursor: not-allowed;
        }
        .help {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-6xs);
          line-height: var(--ddd-lh-140);
        }
      `,
    ];
  }

  /**
   * Write the choices as the theme data the site builder reads. Only
   * theme keys from the shipped registry (or the site's own theme) and
   * design system names from designSystems.json are written.
   */
  _apply(next) {
    if (!store.manifest || !store.manifest.metadata || canEdit()) {
      return;
    }
    const current = store.manifest.metadata.theme
      ? JSON.parse(JSON.stringify(toJS(store.manifest.metadata.theme)))
      : {};
    const pick = {
      theme: this.theme,
      palette: this.palette,
      ds: this.designSystem,
      ...next,
    };
    let registryTheme = null;
    if (
      pick.theme &&
      Object.prototype.hasOwnProperty.call(this._themes, pick.theme)
    ) {
      registryTheme = this._themes[pick.theme];
    } else if (this._siteTheme && this._siteTheme.element === pick.theme) {
      registryTheme = this._siteTheme;
    }
    if (!registryTheme) {
      return;
    }
    const variables = {
      ...(registryTheme.variables || {}),
      ...(current.variables || {}),
    };
    if (/^\d{1,2}$/.test(`${pick.palette}`)) {
      variables.palette = `${pick.palette}`;
    } else {
      delete variables.palette;
    }
    const themeData = {
      ...current,
      ...registryTheme,
      variables: variables,
      regions: current.regions || registryTheme.regions || {},
      element: pick.theme,
    };
    if (
      pick.ds &&
      Object.prototype.hasOwnProperty.call(this._systems, pick.ds)
    ) {
      themeData.designSystem = pick.ds;
    } else {
      delete themeData.designSystem;
    }
    store.manifest.metadata.theme = themeData;
    try {
      globalThis.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme: themeData.element,
          palette: variables.palette || "",
          ds: themeData.designSystem || "",
        }),
      );
    } catch {
      // storage is a convenience; the swap already happened
    }
  }

  _themeChanged(e) {
    this._apply({ theme: e.target.value });
  }

  _paletteChanged(e) {
    const value =
      e.detail && typeof e.detail.value !== "undefined"
        ? e.detail.value
        : e.target.value;
    if (`${value}` !== this._drawnPalette()) {
      this._apply({ palette: `${value}` });
    }
  }

  _designSystemChanged(e) {
    this._apply({ ds: e.target.value });
  }

  /** the palette the theme is drawing: the site's pick, else the theme's own */
  _drawnPalette() {
    const drawn = store.themeElement
      ? store.themeElement.getAttribute("data-palette")
      : null;
    return drawn !== null && drawn !== "" ? `${drawn}` : this.palette;
  }

  _paletteLabel() {
    const palette = this._drawnPalette();
    const option = getDDDPaletteOptionByValue(palette, "");
    if (!option || palette === "") {
      return this.t.themeDefault;
    }
    // under a bridged design system the DDD palette names give way to a
    // generic one; the swatches still show the colors
    return this.designSystem
      ? this.t.paletteNumber.replace(
          "{n}",
          () => `${parseInt(option.dataPalette, 10) + 1}`,
        )
      : option.label;
  }

  _themeOptions() {
    const options = [];
    if (
      this._siteTheme &&
      this._siteTheme.element &&
      !Object.prototype.hasOwnProperty.call(
        this._themes,
        this._siteTheme.element,
      )
    ) {
      options.push({
        element: this._siteTheme.element,
        name: this.t.siteTheme.replace(
          "{name}",
          () => this._siteTheme.name || this._siteTheme.element,
        ),
      });
    }
    Object.keys(this._themes).forEach((key) => {
      const theme = this._themes[key];
      if (theme && !theme.hidden && !theme.terrible) {
        options.push({ element: key, name: theme.name || key });
      }
    });
    return options;
  }

  render() {
    if (this._editor) {
      return html``;
    }
    const drawn = this._drawnPalette();
    const panel = html`
      <div class="panel" id="panel">
        ${this.heading ? html`<p class="heading">${this.heading}</p>` : ``}
        <div class="field">
          <label for="theme">${this.t.theme}</label>
          <select id="theme" @change="${this._themeChanged}">
            ${this._themeOptions().map(
              (option) => html`
                <option
                  value="${option.element}"
                  ?selected="${option.element === this.theme}"
                >
                  ${option.name}
                </option>
              `,
            )}
          </select>
        </div>
        <div class="field">
          <label for="ds">${this.t.designSystem}</label>
          <select
            id="ds"
            @change="${this._designSystemChanged}"
            ?disabled="${!this._accepts}"
            aria-describedby="dshelp"
          >
            <option value="" ?selected="${this.designSystem === ""}">
              ${this.t.dddDefault}
            </option>
            ${Object.keys(this._systems).map(
              (name) => html`
                <option
                  value="${name}"
                  ?selected="${name === this.designSystem}"
                >
                  ${this._systems[name].title || name}
                </option>
              `,
            )}
          </select>
          <p class="help" id="dshelp">
            ${this._accepts ? this.t.designSystemHelp : this.t.designSystemFixed}
          </p>
        </div>
        <div class="field palette">
          <label id="palettelabel">${this.t.palette}</label>
          <details>
            <summary aria-labelledby="palettelabel palettename">
              <span id="palettename">${this._paletteLabel()}</span>
              <span class="swatches" data-palette="${drawn}" aria-hidden="true"
                >${[1, 2, 3, 4, 5, 6, 7].map(
                  (n) =>
                    html`<i
                      style="background-color:var(--ddd-palette-color-${n})"
                    ></i>`,
                )}</span
              >
            </summary>
            <hax-palette-picker
              label="${this.t.palette}"
              .value="${drawn}"
              active-value="${drawn}"
              @value-changed="${this._paletteChanged}"
            ></hax-palette-picker>
          </details>
        </div>
      </div>
    `;
    if (this.floating) {
      return html`
        ${panel}
        <button
          class="toggle"
          aria-expanded="${this.open ? "true" : "false"}"
          aria-controls="panel"
          @click="${() => {
            this.open = !this.open;
          }}"
        >
          ${this.open ? this.t.close : this.t.restyle}
        </button>
      `;
    }
    return panel;
  }
}
// the site's theme before any visitor pick, shared by every switcher
HaxStyleSwitcher.siteTheme = null;
globalThis.customElements.define(HaxStyleSwitcher.tag, HaxStyleSwitcher);

/**
 * Put the session's pick back when a published site loads, so a visitor
 * browses the whole site in what they chose
 */
function restorePick() {
  let pick = null;
  try {
    pick = JSON.parse(globalThis.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    pick = null;
  }
  if (!pick || typeof pick !== "object") {
    return;
  }
  const dispose = autorun(() => {
    if (
      store.manifest &&
      store.manifest.metadata &&
      store.manifest.metadata.theme
    ) {
      Promise.resolve().then(() => {
        dispose();
        if (canEdit()) {
          return;
        }
        const el = globalThis.document.createElement(HaxStyleSwitcher.tag);
        Promise.all([loadThemesRegistry(), loadDesignSystemRegistry()]).then(
          (both) => {
            el._themes = both[0];
            el._systems = both[1];
            el._siteTheme =
              HaxStyleSwitcher.siteTheme || toJS(store.manifest.metadata.theme);
            HaxStyleSwitcher.siteTheme = el._siteTheme;
            el._apply({
              theme: `${pick.theme || ""}`,
              palette: `${pick.palette || ""}`,
              ds: `${pick.ds || ""}`,
            });
          },
        );
      });
    }
  });
}
restorePick();
export { HaxStyleSwitcher };
