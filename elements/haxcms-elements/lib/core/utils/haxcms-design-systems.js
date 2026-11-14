/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Design systems a site can pick separately from its theme
 * (haxtheweb/issues#3350). The theme decides layout; the design system
 * decides color, type, corners, elevation, focus and density.
 *
 * Each entry is a DDD bridge (elements/<theme>/design-system/bridge.json)
 * whose `lib/<Prefix>DesignSystem.js` registers it with DesignSystemManager
 * as `extends: "ddd"`. Only the chosen one is imported, on demand; a site
 * on plain DDD loads nothing from here. scripts/test/design-system-
 * registry.test.mjs keeps this list in step with the bridges.
 *
 * Keepcase (vhs-blog-theme) is left out on purpose: it is dark by design
 * and only meant for its own theme.
 */

export const DEFAULT_DESIGN_SYSTEM = "ddd";

export const HAXCMS_DESIGN_SYSTEMS = [
  {
    name: "carbon",
    title: "Carbon",
    theme: "carbon-theme",
    module: "carbon-theme/lib/CarbonDesignSystem.js",
    activate: "activateCarbonDesignSystem",
    homepage: "https://carbondesignsystem.com",
    license: "Apache-2.0",
  },
  {
    name: "material",
    title: "Material 3",
    theme: "material-theme",
    module: "material-theme/lib/MaterialDesignSystem.js",
    activate: "activateMaterialDesignSystem",
    homepage: "https://m3.material.io",
    license: "Apache-2.0",
  },
  {
    name: "patternfly",
    title: "PatternFly",
    theme: "patternfly-theme",
    module: "patternfly-theme/lib/PatternflyDesignSystem.js",
    activate: "activatePatternflyDesignSystem",
    homepage: "https://www.patternfly.org",
    license: "MIT",
  },
  {
    name: "shadcn",
    title: "shadcn/ui",
    theme: "shadcn-theme",
    module: "shadcn-theme/lib/ShadcnDesignSystem.js",
    activate: "activateShadcnDesignSystem",
    homepage: "https://ui.shadcn.com",
    license: "MIT",
  },
  {
    name: "spectrum",
    title: "Spectrum",
    theme: "spectrum-theme",
    module: "spectrum-theme/lib/SpectrumDesignSystem.js",
    activate: "activateSpectrumDesignSystem",
    homepage: "https://spectrum.adobe.com",
    license: "Apache-2.0",
  },
  {
    name: "tailwind",
    title: "Tailwind",
    theme: "tailwind-theme",
    module: "tailwind-theme/lib/TailwindDesignSystem.js",
    activate: "activateTailwindDesignSystem",
    homepage: "https://tailwindcss.com",
    license: "MIT",
  },
  {
    name: "uswds",
    title: "USWDS",
    theme: "uswds-theme",
    module: "uswds-theme/lib/UswdsDesignSystem.js",
    activate: "activateUswdsDesignSystem",
    homepage: "https://designsystem.digital.gov",
    license: "CC0-1.0",
  },
  {
    name: "webawesome",
    title: "Web Awesome",
    theme: "webawesome-theme",
    module: "webawesome-theme/lib/WebawesomeDesignSystem.js",
    activate: "activateWebawesomeDesignSystem",
    homepage: "https://webawesome.com",
    license: "MIT",
  },
];

/**
 * The registry entry for a design system name, or null (also for "ddd",
 * which needs no module)
 * @param {string} name
 * @returns {object|null}
 */
export function getDesignSystemEntry(name = "") {
  const key = `${name || ""}`.trim().toLowerCase();
  return HAXCMS_DESIGN_SYSTEMS.find((entry) => entry.name === key) || null;
}

/**
 * The design system a theme's site data asks for: a registry name, else
 * "ddd" (absent, empty, "ddd" or a name this build does not ship)
 * @param {object} themeData manifest.metadata.theme
 * @returns {string}
 */
export function siteDesignSystemName(themeData) {
  const name =
    themeData && typeof themeData.designSystem === "string"
      ? themeData.designSystem.trim().toLowerCase()
      : "";
  return getDesignSystemEntry(name) ? name : DEFAULT_DESIGN_SYSTEM;
}

/**
 * Whether a theme lets the site pick its design system. A theme opts in
 * with `static get designSystems() { return "any"; }` when its chrome reads
 * only --ddd-* tokens. Bridged themes (carbon-theme, ...) keep their own.
 * @param {string} themeTag
 * @returns {boolean}
 */
export function themeSupportsDesignSystems(themeTag = "") {
  if (!themeTag || !globalThis.customElements) {
    return false;
  }
  const ThemeClass = globalThis.customElements.get(themeTag);
  return Boolean(ThemeClass && ThemeClass.designSystems === "any");
}

const loaded = {};
/**
 * Import one design system's module and make it the active system.
 * @param {string} name a registry name
 * @returns {Promise<boolean>} true when it is active
 */
export async function activateSiteDesignSystem(name = "") {
  const entry = getDesignSystemEntry(name);
  if (!entry) {
    return false;
  }
  try {
    if (!loaded[entry.name]) {
      // this file sits in @haxtheweb/haxcms-elements/lib/core/utils/, so
      // four levels up is the folder every @haxtheweb package lives in
      loaded[entry.name] = import(
        new URL(`../../../../${entry.module}`, import.meta.url).href
      );
    }
    const mod = await loaded[entry.name];
    if (mod && typeof mod[entry.activate] === "function") {
      mod[entry.activate]();
      return true;
    }
  } catch (e) {
    delete loaded[entry.name];
    console.warn(`haxcms: could not load the ${entry.name} design system`, e);
  }
  return false;
}
