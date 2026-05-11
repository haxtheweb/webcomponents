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
  async loadSystemIntegration(systemName, integrationName = "hax", context = {}) {
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
      if (integration.exportName && typeof mod[integration.exportName] === "function") {
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
        HAXStore.elementList[registeredTag] = HAXStore.designSystemHAXProperties(
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
      } catch (e) {
        const oldStyleSafariBs = globalThis.document.createElement("style");
        oldStyleSafariBs.innerHTML = globalStyles;
        globalThis.document.head.appendChild(oldStyleSafariBs);
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
      } catch (e) {
        const oldStyleSafariBs = globalThis.document.createElement("style");
        oldStyleSafariBs.innerHTML = globalStyles;
        globalThis.document.head.appendChild(oldStyleSafariBs);
      }
      if (newSystem.fonts) {
        newSystem.fonts.forEach((font) => {
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
  }
  return globalThis.DesignSystemManager.instance;
};

export const DesignSystemManager =
  globalThis.DesignSystemManager.requestAvailability();
