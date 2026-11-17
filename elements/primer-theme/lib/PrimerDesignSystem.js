/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * GitHub Primer as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Primer tokens plus the DDD → Primer map are layered after them. Content
 * authored under this system is plain DDD content, so it keeps working when
 * the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  PrimerTokens,
  PrimerFonts,
} from "@haxtheweb/primer-theme/lib/PrimerTokens.js";
import {
  PrimerDDDMap,
  PrimerColorNames,
} from "@haxtheweb/primer-theme/lib/PrimerDDDMap.js";
import { PrimerIcons } from "@haxtheweb/primer-theme/lib/PrimerIcons.js";

export const PRIMER_SYSTEM = "primer";

/** register Primer with the design system manager (once) */
export function registerPrimerDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[PRIMER_SYSTEM]) {
    manager.addDesignSystem({
      name: PRIMER_SYSTEM,
      extends: "ddd",
      styles: [PrimerTokens, PrimerDDDMap],
      fonts: PrimerFonts,
      // the color pickers name each option after the token it now shows
      colorNames: PrimerColorNames,
      // HAX icon names drawn in Primer's own icon set while it is active
      icons: PrimerIcons,
    });
  }
  return manager;
}

/** make Primer the active design system */
export function activatePrimerDesignSystem(manager = DesignSystemManager) {
  registerPrimerDesignSystem(manager);
  if (manager && manager.active !== PRIMER_SYSTEM) {
    manager.active = PRIMER_SYSTEM;
  }
  return manager;
}
