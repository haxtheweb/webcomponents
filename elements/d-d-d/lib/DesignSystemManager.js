/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement } from "lit";

/**
 * Need to think about support for multiple Design systems at the global level
 * for example, simple colors + DDD
 * Need to test if we can actually start as one and remove and use another
 * clean-portfolio-theme would be a good one to attempt to leverage
 */

export class DesignSystem extends LitElement {
  constructor() {
    super();
    this.active = null;
    this.systems = [];
    this.__loadedIntegrations = {};
  }
  static get tag() {
    return "design-system";
  }

  static get properties() {
    return {
      active: { type: String },
      systems: { type: Object },
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "active" && this[propName]) {
        // remove the current global stylesheet / adopted styles for the design system
        // replace it with the new active one
        if (
          this.systems[this.active] &&
          globalThis.document &&
          globalThis.document.head
        ) {
          this.applyDesignSystem(
            oldValue ? this.systems[oldValue] : null,
            this.systems[this.active],
          );
          const context = this._integrationContextFromRuntime();
          Promise.resolve(this.loadActiveSystemIntegrations(context))
            .catch((e) => {
              console.warn(e);
            })
            .finally(() => {
              this._rehydrateHAXElementList();
              globalThis.dispatchEvent(
                new CustomEvent("design-system-active-changed", {
                  bubbles: true,
                  cancelable: false,
                  composed: true,
                  detail: {
                    active: this.active,
                    previous: oldValue || null,
                    context,
                  },
                }),
              );
            });
        }
      }
    });
  }
  // add a system so that we can leverage it later
  addDesignSystem(system) {
    if (system.name && system.styles && system.fonts) {
      this.systems[system.name] = system;
    }
  }
  _integrationContextFromRuntime() {
    let editMode = false;
    let isAuthenticated = true;
    if (
      globalThis.HaxStore &&
      typeof globalThis.HaxStore.requestAvailability === "function"
    ) {
      const haxStore = globalThis.HaxStore.requestAvailability();
      editMode = !!haxStore.editMode;
    }
    if (
      globalThis.HAXCMS &&
      globalThis.HAXCMS.instance &&
      globalThis.HAXCMS.instance.store &&
      typeof globalThis.HAXCMS.instance.store.isLoggedIn !== "undefined"
    ) {
      isAuthenticated = !!globalThis.HAXCMS.instance.store.isLoggedIn;
    }
    return {
      editMode,
      isAuthenticated,
    };
  }
  _integrationCacheKey(systemName, integrationName) {
    return `${systemName}::${integrationName}`;
  }
  async loadSystemIntegration(
    systemName,
    integrationName = "hax",
    context = {},
  ) {
    const system = this.systems[systemName];
    if (
      !system ||
      !system.integrations ||
      !system.integrations[integrationName]
    ) {
      return;
    }
    const integration = system.integrations[integrationName];
    if (
      !integration ||
      (!integration.module && typeof integration.importer !== "function")
    ) {
      return;
    }
    if (
      integration.shouldLoad &&
      typeof integration.shouldLoad === "function" &&
      !integration.shouldLoad(context)
    ) {
      return;
    }
    const cacheKey = this._integrationCacheKey(systemName, integrationName);
    if (this.__loadedIntegrations[cacheKey]) {
      return;
    }
    try {
      const mod =
        typeof integration.importer === "function"
          ? await integration.importer()
          : await import(integration.module);
      const payload = {
        manager: this,
        systemName,
        system,
        integrationName,
        integration,
        context,
        options: integration.options || {},
      };
      if (
        integration.exportName &&
        typeof mod[integration.exportName] === "function"
      ) {
        await mod[integration.exportName](payload);
      } else if (typeof mod.default === "function") {
        await mod.default(payload);
      }
      this.__loadedIntegrations[cacheKey] = true;
    } catch (e) {
      console.warn(e);
    }
  }
  async loadActiveSystemIntegrations(context = {}, integrationName = "hax") {
    if (!this.active) {
      return;
    }
    await this.loadSystemIntegration(this.active, integrationName, context);
  }
  _rehydrateHAXElementList() {
    if (
      !globalThis.HaxStore ||
      typeof globalThis.HaxStore.requestAvailability !== "function"
    ) {
      return;
    }
    const HAXStore = globalThis.HaxStore.requestAvailability();
    if (!HAXStore || typeof HAXStore.designSystemHAXProperties !== "function") {
      return;
    }
    Object.keys(HAXStore.elementList || {}).forEach((registeredTag) => {
      if (HAXStore.elementList[registeredTag]) {
        HAXStore.elementList[registeredTag] =
          HAXStore.designSystemHAXProperties(
            HAXStore.elementList[registeredTag],
            registeredTag,
          );
      }
    });
  }

  applyDesignSystem(oldSystem, newSystem) {
    // ensure we clean up the old one
    if (oldSystem) {
      // remove the global css style / fonts
      try {
        if (globalThis.document.adoptedStyleSheets) {
          globalThis.document.adoptedStyleSheets.map((sheet, index) => {
            if (sheet.ds) {
              globalThis.document.adoptedStyleSheets.splice(index, 1);
            }
          });
        }
      } catch {
        // browsers without constructable stylesheets: remove the <style>
        // fallback that was added for the old system
        globalThis.document
          .querySelectorAll('style[data-ds="style"]')
          .forEach((style) => {
            style.remove();
          });
      }
      if (oldSystem.fonts) {
        globalThis.document.head
          .querySelectorAll("[data-ds]")
          .forEach((font) => {
            font.remove();
          });
      }
      if (oldSystem.onload) {
        globalThis.document.onload = null;
      }
    }
    // theoretically could turn something on then back off again
    if (newSystem) {
      // convert css into text content of arrays mashed together
      // this way we can inject it into a global style sheet
      let globalStyles = newSystem.styles
        .map((st) => (st.cssText ? st.cssText : ""))
        .join("");
      try {
        const adoptableDS = new CSSStyleSheet();
        // flag it so we can remove it later
        adoptableDS.ds = true;
        adoptableDS.replaceSync(globalStyles);
        // THIS FLAG MAKES HAX LOAD IT IN ITS SHADOW ROOT!!!!
        if (newSystem.hax) {
          adoptableDS.hax = true;
        }
        // Combine the existing adopted sheets if we need to but these will work everywhere
        // and are very fast
        globalThis.document.adoptedStyleSheets = [
          ...globalThis.document.adoptedStyleSheets,
          adoptableDS,
        ];
      } catch {
        const oldStyleSafariBs = globalThis.document.createElement("style");
        oldStyleSafariBs.setAttribute("data-ds", "style");
        oldStyleSafariBs.innerHTML = globalStyles;
        globalThis.document.head.appendChild(oldStyleSafariBs);
      }
      if (newSystem.fonts) {
        mergeGoogleFontsURLs(newSystem.fonts).forEach((font) => {
          const link = globalThis.document.createElement("link");
          link.setAttribute("href", font);
          link.setAttribute("rel", "stylesheet");
          link.setAttribute("fetchpriority", "low");
          link.setAttribute("data-ds", "font");
          globalThis.document.head.appendChild(link);
        });
      }
      if (newSystem.onload) {
        globalThis.document.onload = newSystem.onload();
      }
    }
  }
}

/**
 * Google Fonts serves any number of families from one css2 request, so
 * several css2 URLs with the same display value become one stylesheet (one
 * request instead of one per family). Anything else is kept as given.
 * @param {Array<String>} fonts stylesheet URLs
 * @returns {Array<String>} the URLs to load
 */
export function mergeGoogleFontsURLs(fonts) {
  const list = Array.isArray(fonts) ? fonts : [];
  const groups = {};
  const out = [];
  list.forEach((font) => {
    let url = null;
    try {
      url = new URL(font);
    } catch {
      url = null;
    }
    if (
      url &&
      url.protocol === "https:" &&
      url.hostname === "fonts.googleapis.com" &&
      url.pathname === "/css2" &&
      url.searchParams.getAll("family").length > 0 &&
      Array.from(url.searchParams.keys()).every(
        (key) => key === "family" || key === "display",
      )
    ) {
      const display = url.searchParams.get("display") || "";
      if (!groups[display]) {
        groups[display] = { families: [], index: out.length };
        out.push(null);
      }
      url.searchParams.getAll("family").forEach((family) => {
        if (!groups[display].families.includes(family)) {
          groups[display].families.push(family);
        }
      });
    } else {
      out.push(font);
    }
  });
  // the css2 syntax (Roboto+Slab:wght@300;400) reads best unescaped
  const encode = (value) =>
    encodeURIComponent(value)
      .replace(/%20/g, "+")
      .replace(/%3A/gi, ":")
      .replace(/%3B/gi, ";")
      .replace(/%2C/gi, ",")
      .replace(/%40/gi, "@");
  Object.keys(groups).forEach((display) => {
    const params = groups[display].families.map(
      (family) => `family=${encode(family)}`,
    );
    if (display) {
      params.push(`display=${encode(display)}`);
    }
    out[groups[display].index] =
      "https://fonts.googleapis.com/css2?" + params.join("&");
  });
  return out;
}

globalThis.customElements.define(DesignSystem.tag, DesignSystem);

globalThis.DesignSystemManager = globalThis.DesignSystemManager || {};
globalThis.DesignSystemManager.requestAvailability = () => {
  if (
    !globalThis.DesignSystemManager.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    let ds = globalThis.document.createElement("design-system");
    globalThis.document.body.appendChild(ds);
    globalThis.DesignSystemManager.instance = ds;
  } else if (!globalThis.DesignSystemManager.instance && globalThis.document) {
    // no body to attach to (server side render): a detached instance still
    // answers importers that use the singleton at import time
    globalThis.DesignSystemManager.instance = new DesignSystem();
  }
  return globalThis.DesignSystemManager.instance;
};

export const DesignSystemManager =
  globalThis.DesignSystemManager.requestAvailability();
