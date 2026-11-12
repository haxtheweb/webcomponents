/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * IBM Carbon as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Carbon tokens plus the DDD → Carbon map are layered after them. Content
 * authored under this system is plain DDD content, so it keeps working when
 * the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  CarbonTokens,
  CarbonFonts,
} from "@haxtheweb/carbon-theme/lib/CarbonTokens.js";
import { CarbonDDDMap } from "@haxtheweb/carbon-theme/lib/CarbonDDDMap.js";

export const CARBON_SYSTEM = "carbon";

/** register Carbon with the design system manager (once) */
export function registerCarbonDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[CARBON_SYSTEM]) {
    manager.addDesignSystem({
      name: CARBON_SYSTEM,
      extends: "ddd",
      styles: [CarbonTokens, CarbonDDDMap],
      fonts: CarbonFonts,
    });
  }
  return manager;
}

/** make Carbon the active design system */
export function activateCarbonDesignSystem(manager = DesignSystemManager) {
  registerCarbonDesignSystem(manager);
  if (manager && manager.active !== CARBON_SYSTEM) {
    manager.active = CARBON_SYSTEM;
  }
  return manager;
}
