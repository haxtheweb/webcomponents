/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Microsoft Fluent 2 as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Fluent tokens plus the DDD → Fluent map are layered after them. Content
 * authored under this system is plain DDD content, so it keeps working when
 * the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  FluentTokens,
  FluentFonts,
} from "@haxtheweb/fluent-theme/lib/FluentTokens.js";
import { FluentDDDMap } from "@haxtheweb/fluent-theme/lib/FluentDDDMap.js";
import { FluentIcons } from "@haxtheweb/fluent-theme/lib/FluentIcons.js";

export const FLUENT_SYSTEM = "fluent";

/** register Fluent with the design system manager (once) */
export function registerFluentDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[FLUENT_SYSTEM]) {
    manager.addDesignSystem({
      name: FLUENT_SYSTEM,
      extends: "ddd",
      styles: [FluentTokens, FluentDDDMap],
      fonts: FluentFonts,
      // HAX icon names drawn in Fluent's own icon set while it is active
      icons: FluentIcons,
    });
  }
  return manager;
}

/** make Fluent the active design system */
export function activateFluentDesignSystem(manager = DesignSystemManager) {
  registerFluentDesignSystem(manager);
  if (manager && manager.active !== FLUENT_SYSTEM) {
    manager.active = FLUENT_SYSTEM;
  }
  return manager;
}
