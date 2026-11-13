/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * USWDS as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * USWDS palette plus the DDD → USWDS map are layered after them. Content
 * authored under this system is plain DDD content, so it keeps working when
 * the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  UswdsTokens,
  UswdsFonts,
} from "@haxtheweb/uswds-theme/lib/UswdsTokens.js";
import { UswdsDDDMap } from "@haxtheweb/uswds-theme/lib/UswdsDDDMap.js";

export const USWDS_SYSTEM = "uswds";

/** register USWDS with the design system manager (once) */
export function registerUswdsDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[USWDS_SYSTEM]) {
    manager.addDesignSystem({
      name: USWDS_SYSTEM,
      extends: "ddd",
      styles: [UswdsTokens, UswdsDDDMap],
      fonts: UswdsFonts,
    });
  }
  return manager;
}

/** make USWDS the active design system */
export function activateUswdsDesignSystem(manager = DesignSystemManager) {
  registerUswdsDesignSystem(manager);
  if (manager && manager.active !== USWDS_SYSTEM) {
    manager.active = USWDS_SYSTEM;
  }
  return manager;
}
