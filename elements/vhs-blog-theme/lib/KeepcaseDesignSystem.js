/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Keepcase as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Keepcase tokens plus the DDD -> Keepcase map are layered after them, so
 * blocks authored in a post take on the den's colors, faces, corners and
 * focus ring. Content stays plain DDD content and keeps working when the
 * site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  KeepcaseTokens,
  KeepcaseFonts,
} from "@haxtheweb/vhs-blog-theme/lib/KeepcaseTokens.js";
import { KeepcaseDDDMap } from "@haxtheweb/vhs-blog-theme/lib/KeepcaseDDDMap.js";

export const KEEPCASE_SYSTEM = "keepcase";

/** register Keepcase with the design system manager (once) */
export function registerKeepcaseDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[KEEPCASE_SYSTEM]) {
    manager.addDesignSystem({
      name: KEEPCASE_SYSTEM,
      extends: "ddd",
      styles: [KeepcaseTokens, KeepcaseDDDMap],
      fonts: KeepcaseFonts,
    });
  }
  return manager;
}

/** make Keepcase the active design system */
export function activateKeepcaseDesignSystem(manager = DesignSystemManager) {
  registerKeepcaseDesignSystem(manager);
  if (manager && manager.active !== KEEPCASE_SYSTEM) {
    manager.active = KEEPCASE_SYSTEM;
  }
  return manager;
}
