/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * PatternFly as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays exactly as it is, and
 * the PatternFly tokens plus the DDD → PatternFly map are layered after
 * them. Content authored under this system is plain DDD content, so it keeps
 * working when the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  PatternflyTokens,
  PatternflyFonts,
} from "@haxtheweb/patternfly-theme/lib/PatternflyTokens.js";
import { PatternflyDDDMap } from "@haxtheweb/patternfly-theme/lib/PatternflyDDDMap.js";

export const PATTERNFLY_SYSTEM = "patternfly";

/** register PatternFly with the design system manager (once) */
export function registerPatternflyDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[PATTERNFLY_SYSTEM]) {
    manager.addDesignSystem({
      name: PATTERNFLY_SYSTEM,
      extends: "ddd",
      styles: [PatternflyTokens, PatternflyDDDMap],
      fonts: PatternflyFonts,
    });
  }
  return manager;
}

/** make PatternFly the active design system */
export function activatePatternflyDesignSystem(manager = DesignSystemManager) {
  registerPatternflyDesignSystem(manager);
  if (manager && manager.active !== PATTERNFLY_SYSTEM) {
    manager.active = PATTERNFLY_SYSTEM;
  }
  return manager;
}
