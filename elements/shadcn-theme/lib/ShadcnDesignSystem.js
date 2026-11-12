/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * shadcn/ui as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Shadcn tokens plus the DDD → Shadcn map are layered after them. Content
 * authored under this system is plain DDD content, so it keeps working when
 * the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  ShadcnTokens,
  ShadcnFonts,
} from "@haxtheweb/shadcn-theme/lib/ShadcnTokens.js";
import { ShadcnDDDMap } from "@haxtheweb/shadcn-theme/lib/ShadcnDDDMap.js";

export const SHADCN_SYSTEM = "shadcn";

/** register Shadcn with the design system manager (once) */
export function registerShadcnDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[SHADCN_SYSTEM]) {
    manager.addDesignSystem({
      name: SHADCN_SYSTEM,
      extends: "ddd",
      styles: [ShadcnTokens, ShadcnDDDMap],
      fonts: ShadcnFonts,
    });
  }
  return manager;
}

/** make Shadcn the active design system */
export function activateShadcnDesignSystem(manager = DesignSystemManager) {
  registerShadcnDesignSystem(manager);
  if (manager && manager.active !== SHADCN_SYSTEM) {
    manager.active = SHADCN_SYSTEM;
  }
  return manager;
}
