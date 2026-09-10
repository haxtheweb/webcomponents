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
 * Build a stax-shaped object from a registry pattern (the same shape
 * hax-store._haxStoreRegisterStax consumes via the <hax-stax> data property).
 * @param {object} pattern registry entry
 * @returns {object} stax data shape
 */
function buildStaxData(pattern) {
  return {
    details: {
      title: pattern.title,
      image: "",
      author: "DDD Pattern Library",
      description: pattern.description,
      status: "available",
      rating: "0",
      tags: ["ddd", "pattern-library", pattern.level, pattern.hax.templateType],
      templateType: pattern.hax.templateType,
    },
    // The stax payload is the canonical HTML recipe; hax-store will convert
    // it via htmlToHaxElements at registration time.
    stax: pattern.html,
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
 * Mirrors how hax-store._loadAppStoreData registers stax from the app store:
 * it creates a <hax-stax> element, sets .data, and appends it; the store's
 * _haxStoreRegisterStax listener picks it up and adds it to staxList.
 * @param {object} store HaxStore instance
 * @param {object} pattern registry entry
 */
function registerStaxPattern(store, pattern) {
  if (!store || !globalThis.document) {
    return;
  }
  const staxEl = globalThis.document.createElement("hax-stax");
  staxEl.data = buildStaxData(pattern);
  store.appendChild(staxEl);
}

/**
 * Register a single-element molecule as a demoSchema override for its
 * target element. Mirrors hax-store._updateElementDemoSchema: writes into
 * HAXStore.styleGuideSchema[targetTag].demoSchema so inserting that element
 * from the gizmo tray uses the canonical recipe.
 * @param {object} store HaxStore instance
 * @param {object} pattern registry entry (hax.publish === 'demoSchemaOverride')
 */
function registerDemoSchemaOverride(store, pattern) {
  if (!store) {
    return;
  }
  const tag = pattern.hax.targetTag;
  if (!tag) {
    return;
  }
  if (!store.styleGuideSchema) {
    store.styleGuideSchema = {};
  }
  if (!store.styleGuideSchema[tag]) {
    store.styleGuideSchema[tag] = {};
  }
  // Wrap the canonical HTML so it parses as a single HAX element with its
  // slotted content. hax-store expects demoSchema items of shape
  // { tag, properties, content }.
  store.styleGuideSchema[tag].demoSchema = [
    {
      tag: tag,
      properties: {},
      content: pattern.html,
    },
  ];
}

/**
 * Publish all gate-passing patterns to the HAX store. Called once the store
 * is ready and DDD is the active design system. Respects platformAllows
 * gating for blockTemplates (area) and pageTemplates (page).
 * @param {object} store HaxStore instance
 * @returns {{registeredStax: string[], registeredOverrides: string[], skipped: object[], gaps: object[]}}
 */
export function publishDDDPatternsToHax(store) {
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
  DDDPATTERNS.forEach((pattern) => {
    if (!pattern.hax || pattern.hax.publish === "recipe-only") {
      // atoms and pure-HTML molecules: documentation only, no rail entry
      return;
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
      return;
    }
    if (pattern.hax.publish === "stax-area") {
      if (!allowBlock) {
        result.skipped.push({
          id: pattern.id,
          reason: "blockTemplates not allowed on this platform",
        });
        return;
      }
      registerStaxPattern(store, pattern);
      result.registeredStax.push(pattern.id);
    } else if (pattern.hax.publish === "stax-page") {
      if (!allowPage) {
        result.skipped.push({
          id: pattern.id,
          reason: "pageTemplates not allowed on this platform",
        });
        return;
      }
      registerStaxPattern(store, pattern);
      result.registeredStax.push(pattern.id);
    } else if (pattern.hax.publish === "demoSchemaOverride") {
      registerDemoSchemaOverride(store, pattern);
      result.registeredOverrides.push(pattern.id);
    }
  });
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
  function tryPublish() {
    const store = getHaxStore();
    if (!store || store[KEY] || !isDDDActive()) {
      return;
    }
    store[KEY] = true;
    publishDDDPatternsToHax(store);
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
