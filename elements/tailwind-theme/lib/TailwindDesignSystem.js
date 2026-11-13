/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Tailwind as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Tailwind tokens plus the DDD → Tailwind map are layered after them. Content
 * authored under this system is plain DDD content, so it keeps working when
 * the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  TailwindTokens,
  TailwindFonts,
} from "@haxtheweb/tailwind-theme/lib/TailwindTokens.js";
import { TailwindDDDMap } from "@haxtheweb/tailwind-theme/lib/TailwindDDDMap.js";

export const TAILWIND_SYSTEM = "tailwind";

/** register Tailwind with the design system manager (once) */
export function registerTailwindDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[TAILWIND_SYSTEM]) {
    manager.addDesignSystem({
      name: TAILWIND_SYSTEM,
      extends: "ddd",
      styles: [TailwindTokens, TailwindDDDMap],
      fonts: TailwindFonts,
    });
  }
  return manager;
}

/** make Tailwind the active design system */
export function activateTailwindDesignSystem(manager = DesignSystemManager) {
  registerTailwindDesignSystem(manager);
  if (manager && manager.active !== TAILWIND_SYSTEM) {
    manager.active = TAILWIND_SYSTEM;
  }
  return manager;
}
