/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { autorun, toJS } from "mobx";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { getDDDPaletteOptions } from "@haxtheweb/d-d-d/lib/DDDPaletteRegistry.js";
import { store } from "../haxcms-site-store.js";
import {
  loadDesignSystemRegistry,
  siteDesignSystemName,
  themeAcceptsDesignSystems,
} from "../utils/HAXCMSDesignSystems.js";

const NAME = /^[a-z0-9-]+$/;
let themeRegistryRequest = null;

/** every theme HAXcms ships, by tag (lib/themes.json) */
function loadThemeRegistry() {
  if (!themeRegistryRequest) {
    themeRegistryRequest = fetch(new URL("../../themes.json", import.meta.url))
      .then((response) => (response.ok ? response.json() : {}))
      .catch(() => ({}));
  }
  return themeRegistryRequest;
}

/**
 * `haxcms-appearance-switcher`
 * Three selects that change how the site on the page looks, live: its theme,
 * its palette and its design system. Nothing is saved; it rewrites
 * metadata.theme on the loaded manifest the way Theme Preview does, and the
 * site builder swaps the theme. For demos and showcases, not for site
 * settings (Appearance in Site Settings is where a choice is kept).
 *
 * Security: a pick is only ever a key into the theme registry
 * (lib/themes.json), the palette registry or the design system registry
 * (lib/designSystems.json); the module that loads is the one the registry
 * lists for that key.
 *
 * sync-url keeps ?theme=&palette=&designSystem= in the address, so a look
 * can be linked to.
 *
 * @element haxcms-appearance-switcher
 */
class HAXCMSAppearanceSwitcher extends I18NMixin(LitElement) {
  static get tag() {
    return "haxcms-appearance-switcher";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      theme: "Theme",
      palette: "Palette",
      themeDefault: "Theme default",
      designSystem: "Design system",
      designSystemDefault: "DDD (default)",
      designSystemUnavailable: "This theme keeps its own design system",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.syncUrl = false;
    this.theme = "";
    this.palette = "";
    this.designSystem = "";
    this._themes = {};
    this._designSystems = {};
    this._acceptsSystems = false;
    this.__disposer = [];
  }

  static get properties() {
    return {
      ...super.properties,
      syncUrl: { type: Boolean, attribute: "sync-url" },
      theme: { type: String },
      palette: { type: String },
      designSystem: { type: String, attribute: "design-system" },
      _themes: { type: Object, state: true },
      _designSystems: { type: Object, state: true },
      _acceptsSystems: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      css`
        /* the three pickers wrap onto their own rows where the bar is
           narrow (phones), instead of running off its edge */
        :host {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          max-width: 100%;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          color: inherit;
        }
        label {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          white-space: nowrap;
        }
        select {
          max-width: var(--haxcms-appearance-switcher-select-width, 152px);
          min-height: var(--haxcms-appearance-switcher-control-height, 28px);
          padding: 0 var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-color: currentColor;
          border-radius: var(--ddd-radius-xs);
          color: inherit;
          background-color: transparent;
          font: inherit;
          cursor: pointer;
        }
        select:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        select:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
        /* the open list is the browser's own surface, not the bar's */
        option {
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
        }
      `,
    ];
  }

  /** themes by name; a theme with no name sorts by its tag */
  get themeOptions() {
    return Object.keys(this._themes)
      .filter((tag) => NAME.test(tag) && this._themes[tag].path)
      .map((tag) => ({ tag, name: this._themes[tag].name || tag }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** palettes the active theme supports; all of them when it does not say */
  get paletteOptions() {
    const all = getDDDPaletteOptions();
    const entry = this._themes[this.theme];
    const ThemeClass = this.theme
      ? globalThis.customElements.get(this.theme)
      : null;
    let supported =
      entry && Array.isArray(entry.supportedPalettes)
        ? entry.supportedPalettes
        : ThemeClass && Array.isArray(ThemeClass.supportedPalettes)
          ? ThemeClass.supportedPalettes
          : null;
    if (!supported || supported.length === 0) {
      return all;
    }
    supported = supported.map((value) => String(value));
    return all.filter((option) =>
      supported.includes(String(option.dataPalette)),
    );
  }

  render() {
    const systems = Object.keys(this._designSystems).filter((name) =>
      NAME.test(name),
    );
    return html`
      <label
        >${this.t.theme}
        <select id="theme" part="theme" @change="${this.__themeChanged}">
          ${this.themeOptions.map(
            (option) =>
              html`<option
                value="${option.tag}"
                ?selected="${option.tag === this.theme}"
              >
                ${option.name}
              </option>`,
          )}
        </select>
      </label>
      <label
        >${this.t.palette}
        <select id="palette" part="palette" @change="${this.__paletteChanged}">
          <option value="" ?selected="${this.palette === ""}">
            ${this.t.themeDefault}
          </option>
          ${this.paletteOptions.map(
            (option) =>
              html`<option
                value="${option.dataPalette}"
                ?selected="${String(option.dataPalette) === this.palette}"
              >
                ${option.label}
              </option>`,
          )}
        </select>
      </label>
      <label
        >${this.t.designSystem}
        <select
          id="designSystem"
          part="design-system"
          ?disabled="${!this._acceptsSystems}"
          title="${this._acceptsSystems ? "" : this.t.designSystemUnavailable}"
          @change="${this.__designSystemChanged}"
        >
          <option value="" ?selected="${this.designSystem === ""}">
            ${this.t.designSystemDefault}
          </option>
          ${systems.map(
            (name) =>
              html`<option
                value="${name}"
                ?selected="${name === this.designSystem}"
              >
                ${this._designSystems[name].title || name}
              </option>`,
          )}
        </select>
      </label>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    loadThemeRegistry().then((themes) => {
      this._themes = themes && typeof themes === "object" ? themes : {};
    });
    loadDesignSystemRegistry().then((systems) => {
      this._designSystems =
        systems && typeof systems === "object" ? systems : {};
    });
    // follow the site: what it loads with, and what anything else changes
    this.__disposer.push(
      autorun(() => {
        const manifest = toJS(store.manifest);
        const data =
          manifest && manifest.metadata && manifest.metadata.theme
            ? manifest.metadata.theme
            : {};
        this.theme = typeof data.element === "string" ? data.element : "";
        this.palette =
          data.variables &&
          data.variables.palette !== undefined &&
          data.variables.palette !== null
            ? String(data.variables.palette).trim()
            : "";
        this.designSystem = siteDesignSystemName(data);
      }),
    );
  }

  disconnectedCallback() {
    this.__disposer.forEach((dispose) => dispose());
    this.__disposer = [];
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has("theme")) {
      this.__checkAcceptsSystems();
    }
    // a select keeps the value the reader picked; put all three back in
    // line with the site after anything changes
    ["theme", "palette", "designSystem"].forEach((id) => {
      const select = this.shadowRoot.querySelector(`#${id}`);
      if (select && select.value !== this[id]) {
        select.value = this[id];
      }
    });
  }

  // whether a theme takes a design system is on its class, known once the
  // theme's module has loaded
  __checkAcceptsSystems() {
    const tag = this.theme;
    this._acceptsSystems = themeAcceptsDesignSystems(tag);
    if (tag && NAME.test(tag) && !globalThis.customElements.get(tag)) {
      globalThis.customElements.whenDefined(tag).then(() => {
        if (tag === this.theme) {
          this._acceptsSystems = themeAcceptsDesignSystems(tag);
        }
      });
    }
  }

  __themeChanged(e) {
    const tag = e.target.value;
    if (!NAME.test(tag) || !this._themes[tag] || tag === this.theme) {
      return;
    }
    // a palette the new theme does not support goes back to its default
    const entry = this._themes[tag];
    let palette = this.palette;
    if (
      palette &&
      Array.isArray(entry.supportedPalettes) &&
      entry.supportedPalettes.length > 0 &&
      !entry.supportedPalettes.map((p) => String(p)).includes(palette)
    ) {
      palette = "";
    }
    this.__apply({ theme: tag, palette, designSystem: this.designSystem });
  }

  __paletteChanged(e) {
    const value = e.target.value;
    const known =
      value === "" ||
      getDDDPaletteOptions().some(
        (option) => String(option.dataPalette) === value,
      );
    if (!known) {
      return;
    }
    this.__apply({
      theme: this.theme,
      palette: value,
      designSystem: this.designSystem,
    });
  }

  __designSystemChanged(e) {
    const value = e.target.value;
    if (value !== "" && !this._designSystems[value]) {
      return;
    }
    this.__apply({
      theme: this.theme,
      palette: this.palette,
      designSystem: value,
    });
  }

  /**
   * Put a look on the loaded site: the registry's entry for the theme, the
   * palette as a theme variable and the design system by name.
   */
  __apply(look) {
    if (!store.manifest || !store.manifest.metadata) {
      return;
    }
    const current =
      store.manifest.metadata.theme &&
      typeof store.manifest.metadata.theme === "object"
        ? toJS(store.manifest.metadata.theme)
        : {};
    const entry = this._themes[look.theme] || {};
    const variables = {
      ...(entry.variables && typeof entry.variables === "object"
        ? entry.variables
        : {}),
      ...(current.variables && typeof current.variables === "object"
        ? current.variables
        : {}),
    };
    if (look.palette !== "") {
      variables.palette = look.palette;
    } else {
      delete variables.palette;
    }
    const next = {
      ...current,
      variables,
      regions:
        current.regions && typeof current.regions === "object"
          ? current.regions
          : {},
    };
    if (entry.element && entry.path) {
      next.element = entry.element;
      next.path = entry.path;
      next.name = entry.name || entry.element;
    }
    if (look.designSystem) {
      next.designSystem = look.designSystem;
    } else {
      delete next.designSystem;
    }
    store.manifest.metadata.theme = next;
    if (this.syncUrl) {
      this.__syncUrl(look);
    }
    this.dispatchEvent(
      new CustomEvent("appearance-changed", {
        bubbles: true,
        composed: true,
        detail: { ...look },
      }),
    );
  }

  __syncUrl(look) {
    const url = new URL(globalThis.location.href);
    [
      ["theme", look.theme],
      ["palette", look.palette],
      ["designSystem", look.designSystem],
    ].forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    globalThis.history.replaceState(globalThis.history.state, "", url.href);
  }
}
globalThis.customElements.define(
  HAXCMSAppearanceSwitcher.tag,
  HAXCMSAppearanceSwitcher,
);
export { HAXCMSAppearanceSwitcher };
