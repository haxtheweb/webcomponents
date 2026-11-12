/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Material 3 as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Material tokens plus the DDD → Material map are layered after them. Content
 * authored under this system is plain DDD content, so it keeps working when
 * the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  MaterialTokens,
  MaterialFonts,
} from "@haxtheweb/material-theme/lib/MaterialTokens.js";
import { MaterialDDDMap } from "@haxtheweb/material-theme/lib/MaterialDDDMap.js";

export const MATERIAL_SYSTEM = "material";

/** register Material with the design system manager (once) */
export function registerMaterialDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[MATERIAL_SYSTEM]) {
    manager.addDesignSystem({
      name: MATERIAL_SYSTEM,
      extends: "ddd",
      styles: [MaterialTokens, MaterialDDDMap],
      fonts: MaterialFonts,
    });
  }
  return manager;
}

/** make Material the active design system */
export function activateMaterialDesignSystem(manager = DesignSystemManager) {
  registerMaterialDesignSystem(manager);
  if (manager && manager.active !== MATERIAL_SYSTEM) {
    manager.active = MATERIAL_SYSTEM;
  }
  return manager;
}
