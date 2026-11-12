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
    this.__pendingIntegrations = {};
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
            oldValue ? this.resolvedSystem(oldValue) : null,
            this.resolvedSystem(this.active),
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
  /**
   * A system can declare `extends: "<other system>"` to be a dialect of it:
   * it keeps every style and HAX integration of the base and adds its own
   * styles after them (a DDD-capable bridge such as patternfly maps the
   * --ddd-* tokens onto its own and leaves DDD's authoring untouched).
   * @param {String} name system name
   * @returns {Array<Object>} the system and its bases, base first
   */
  systemChain(name) {
    const chain = [];
    let current = this.systems[name];
    while (current && !chain.includes(current)) {
      chain.unshift(current);
      current = current.extends ? this.systems[current.extends] : null;
    }
    return chain;
  }
  /**
   * Whether the active system is `name` or a dialect that extends it, so
   * integrations written for a base (DDD's authoring) keep working
   * @param {String} name system name
   * @returns {Boolean}
   */
  isActiveCompatible(name) {
    if (!this.active) {
      return false;
    }
    return this.systemChain(this.active).some((system) => system.name === name);
  }
  /**
   * The system as applied: a dialect's styles follow its bases', its fonts
   * replace theirs when it has any, and anything it doesn't set is inherited
   * @param {String} name system name
   * @returns {Object|null}
   */
  resolvedSystem(name) {
    const chain = this.systemChain(name);
    if (chain.length === 0) {
      return null;
    }
    const resolved = { ...chain[chain.length - 1] };
    resolved.styles = [];
    chain.forEach((system) => {
      resolved.styles = [...resolved.styles, ...(system.styles || [])];
      if (system.fonts && system.fonts.length > 0) {
        resolved.fonts = system.fonts;
      }
      ["hax", "onload"].forEach((key) => {
        if (system[key] !== undefined) {
          resolved[key] = system[key];
        }
      });
    });
    if (!resolved.fonts) {
      resolved.fonts = [];
    }
    return resolved;
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
    // a second request while the first is still loading (an active change
    // and an explicit load together) waits on it instead of loading again
    if (this.__pendingIntegrations[cacheKey]) {
      return this.__pendingIntegrations[cacheKey];
    }
    this.__pendingIntegrations[cacheKey] = this._runSystemIntegration(
      system,
      systemName,
      integrationName,
      integration,
      context,
      cacheKey,
    );
    try {
      await this.__pendingIntegrations[cacheKey];
    } finally {
      delete this.__pendingIntegrations[cacheKey];
    }
  }
  async _runSystemIntegration(
    system,
    systemName,
    integrationName,
    integration,
    context,
    cacheKey,
  ) {
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
    // a dialect also runs its bases' integrations (base first); each is
    // cached under the system that owns it, so a base loads only once
    const chain = this.systemChain(this.active);
    for (const system of chain) {
      await this.loadSystemIntegration(system.name, integrationName, context);
    }
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
