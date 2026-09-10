/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDDPatternStax.js
 * -----------------
 * Wires the DDDPatternLibrary registry into the existing HAX stax rail.
 * No new tray UI is built: hax-stax-browser already renders whatever is in
 * HAXStore.staxList, and hax-store already converts <page-template
 * schema="area|page|block"> content into stax entries and demoSchema
 * overrides (see hax-store.js detectAndRegisterPageTemplateStax +
 * _updateElementDemoSchema). This module produces those same shapes from the
 * registry so the pattern library's templates/organisms appear as
 * click-to-insert blocks and single-element molecules override that
 * element's demoSchema on insert.
 *
 * Gate rules (per plan):
 *  - A pattern is only published if every component it references is
 *    HAX-capable (HAX_CAPABILITY === true). Non-HAX components are excluded
 *    and logged as gaps so the audit skill can surface them.
 *  - Platform gating: respect HAXStore.platformAllows('blockTemplates') and
 *    HAXStore.platformAllows('pageTemplates') before registering.
 */

import {
  DDDPATTERNS,
  HAX_CAPABILITY,
  resolveHaxCapabilityReport,
} from "./DDDPatternLibrary.js";

/**
 * Build the stax details metadata (title, description, tags, etc).
 * The actual stax payload (HAX element objects) is set by the caller
 * after converting the HTML recipe via store.htmlToHaxElements().
 * @param {object} pattern registry entry
 * @returns {object} stax details shape
 */
function buildStaxDetails(pattern) {
  return {
    title: pattern.title,
    image: "",
    author: "DDD Pattern Library",
    description: pattern.description,
    status: "available",
    rating: "0",
    tags: ["ddd", "pattern-library", pattern.level, pattern.hax.templateType],
    templateType: pattern.hax.templateType,
  };
}

/**
 * Determine whether a pattern passes the HAX-capability gate.
 * @param {object} pattern
 * @returns {boolean}
 */
function patternPassesGate(pattern) {
  return (pattern.components || []).every(
    (tag) => HAX_CAPABILITY[tag] === true,
  );
}

/**
 * Get the HaxStore if available.
 * @returns {object|null}
 */
function getHaxStore() {
  if (
    globalThis.HaxStore &&
    typeof globalThis.HaxStore.requestAvailability === "function"
  ) {
    try {
      return globalThis.HaxStore.requestAvailability();
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Is DDD the active design system? Only publish DDD patterns when it is.
 * @returns {boolean}
 */
function isDDDActive() {
  if (
    globalThis.DesignSystemManager &&
    typeof globalThis.DesignSystemManager.requestAvailability === "function"
  ) {
    try {
      const manager = globalThis.DesignSystemManager.requestAvailability();
      return !!manager && manager.active === "ddd";
    } catch (e) {
      return false;
    }
  }
  return false;
}

/**
 * Register a single pattern as a stax entry via the existing store hook.
 * Converts the canonical HTML recipe to HAX element objects (the shape
 * hax-insert-content-array expects) using store.htmlToHaxElements(),
 * then creates a <hax-stax> element with that data. Mirrors how
 * hax-store.detectAndRegisterPageTemplateStax builds stax entries.
 * @param {object} store HaxStore instance
 * @param {object} pattern registry entry
 */
async function registerStaxPattern(store, pattern) {
  if (!store || !globalThis.document) {
    return;
  }
  // Convert the HTML recipe to HAX element objects — this is the shape
  // the stax tray passes to hax-insert-content-array on click.
  let staxElements = [];
  try {
    staxElements = await store.htmlToHaxElements(pattern.html);
  } catch (e) {
    // if conversion fails, skip this pattern rather than insert undefined
    return;
  }
  if (!staxElements || staxElements.length === 0) {
    return;
  }
  const staxEl = globalThis.document.createElement("hax-stax");
  staxEl.data = {
    details: buildStaxDetails(pattern),
    stax: staxElements,
  };
  store.appendChild(staxEl);
}

/**
 * Register a single-element molecule as a demoSchema override for its
 * target element. Converts the canonical HTML recipe to a HAX element
 * object so the tag, properties, and inner content are correctly split.
 * Mirrors hax-store._updateElementDemoSchema: writes into
 * HAXStore.styleGuideSchema[targetTag].demoSchema so inserting that element
 * from the gizmo tray uses the canonical recipe.
 * @param {object} store HaxStore instance
 * @param {object} pattern registry entry (hax.publish === 'demoSchemaOverride')
 */
async function registerDemoSchemaOverride(store, pattern) {
  if (!store) {
    return;
  }
  const tag = pattern.hax.targetTag;
  if (!tag) {
    return;
  }
  // Convert the HTML recipe to HAX element objects so we get the correct
  // tag / properties / content split rather than dumping the full HTML
  // string as content (which would double-wrap the tag).
  let elements = [];
  try {
    elements = await store.htmlToHaxElements(pattern.html);
  } catch (e) {
    return;
  }
  if (!elements || elements.length === 0) {
    return;
  }
  // Use the first (root) element as the demoSchema entry.
  const el = elements[0];
  if (!store.styleGuideSchema) {
    store.styleGuideSchema = {};
  }
  if (!store.styleGuideSchema[tag]) {
    store.styleGuideSchema[tag] = {};
  }
  store.styleGuideSchema[tag].demoSchema = [
    {
      tag: el.tag || tag,
      properties: el.properties || {},
      content: el.content || "",
    },
  ];
}

/**
 * Publish all gate-passing patterns to the HAX store. Called once the store
 * is ready and DDD is the active design system. Respects platformAllows
 * gating for blockTemplates (area) and pageTemplates (page).
 * Async because each pattern's HTML recipe must be converted to HAX element
 * objects via store.htmlToHaxElements() before registering.
 * @param {object} store HaxStore instance
 * @returns {Promise<{registeredStax: string[], registeredOverrides: string[], skipped: object[], gaps: object[]}>}
 */
export async function publishDDDPatternsToHax(store) {
  const result = {
    registeredStax: [],
    registeredOverrides: [],
    skipped: [],
    gaps: [],
  };
  if (!store) {
    return result;
  }
  const allowBlock = store.platformAllows
    ? store.platformAllows("blockTemplates")
    : true;
  const allowPage = store.platformAllows
    ? store.platformAllows("pageTemplates")
    : true;
  // Process patterns sequentially so each htmlToHaxElements call completes
  // before the next registration. This avoids race conditions in the store.
  for (const pattern of DDDPATTERNS) {
    if (!pattern.hax || pattern.hax.publish === "recipe-only") {
      continue;
    }
    if (!patternPassesGate(pattern)) {
      result.gaps.push({
        id: pattern.id,
        title: pattern.title,
        reason: "non-HAX-capable component referenced",
        components: (pattern.components || []).filter(
          (tag) => HAX_CAPABILITY[tag] !== true,
        ),
      });
      continue;
    }
    if (pattern.hax.publish === "stax-area") {
      if (!allowBlock) {
        result.skipped.push({
          id: pattern.id,
          reason: "blockTemplates not allowed on this platform",
        });
        continue;
      }
      await registerStaxPattern(store, pattern);
      result.registeredStax.push(pattern.id);
    } else if (pattern.hax.publish === "stax-page") {
      if (!allowPage) {
        result.skipped.push({
          id: pattern.id,
          reason: "pageTemplates not allowed on this platform",
        });
        continue;
      }
      await registerStaxPattern(store, pattern);
      result.registeredStax.push(pattern.id);
    } else if (pattern.hax.publish === "demoSchemaOverride") {
      await registerDemoSchemaOverride(store, pattern);
      result.registeredOverrides.push(pattern.id);
    }
  }
  return result;
}

/**
 * One-time activation. Waits for the HAX store to be ready and DDD to be the
 * active design system, then publishes. Safe to call multiple times; the
 * store flag prevents double-registration.
 * @returns {void}
 */
export function activateDDDPatternStax() {
  const KEY = "__dddPatternStaxPublished";
  async function tryPublish() {
    const store = getHaxStore();
    if (!store || store[KEY] || !isDDDActive()) {
      return;
    }
    store[KEY] = true;
    await publishDDDPatternsToHax(store);
  }
  tryPublish();
  if (globalThis.addEventListener) {
    globalThis.addEventListener("hax-store-ready", tryPublish, { once: true });
    globalThis.addEventListener("design-system-active-changed", tryPublish);
  }
}

/**
 * Expose the capability report so the demo / audit tooling can show which
 * patterns were gated and why.
 * @returns {object}
 */
export function getDDDPatternGateReport() {
  return resolveHaxCapabilityReport();
}
