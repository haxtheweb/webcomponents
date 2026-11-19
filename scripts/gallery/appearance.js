/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Component gallery appearance: the design system and palette a reviewer
 * picks, applied the way a HAXcms site applies them, so the gallery
 * dogfoods theme development.
 *
 * scripts/build-component-gallery.js copies this file to
 * gallery-data/appearance.js. It runs once in each document that loads it,
 * the gallery page and every demo frame the gallery opens, and applies
 * what the document's root carries:
 *   - data-gallery-system: a design system name, a key into
 *     elements/haxcms-elements/lib/designSystems.json, imported through
 *     HAXCMSDesignSystems (never a path from the URL). Empty means DDD.
 *   - data-palette: a DDD palette, as on a HAXcms theme.
 * After changing them, dispatch "gallery-appearance" on the window to
 * apply again.
 */
import { loadDesignSystem } from "../elements/haxcms-elements/lib/core/utils/HAXCMSDesignSystems.js";
import { DesignSystemManager } from "../elements/d-d-d/lib/DesignSystemManager.js";

const DDD = "ddd";
let stamp = 0;

async function apply() {
  const mine = ++stamp;
  const name = (
    globalThis.document.documentElement.dataset.gallerySystem || ""
  ).trim();
  const manager = DesignSystemManager || globalThis.DesignSystemManager;
  if (!manager) {
    return;
  }
  const loaded = name && name !== DDD ? await loadDesignSystem(name) : null;
  // a quicker second pick wins
  if (mine !== stamp) {
    return;
  }
  if (loaded && typeof loaded.module[loaded.entry.activate] === "function") {
    loaded.module[loaded.entry.activate](manager);
  } else if (manager.systems && manager.systems[DDD]) {
    if (manager.active !== DDD) {
      manager.active = DDD;
    }
  }
  globalThis.document.documentElement.dataset.galleryApplied = loaded
    ? loaded.entry.name
    : DDD;
}

globalThis.addEventListener("gallery-appearance", apply);
apply();
