/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Bootstrap 5 as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Bootstrap tokens plus the DDD → Bootstrap map are layered after them.
 * Content authored under this system is plain DDD content, so it keeps
 * working when the site moves to any other theme.
 *
 * Content authored with the earlier Bootstrap system can carry
 * data-bootstrap-surface and data-bootstrap-emphasis; those keep rendering
 * (BootstrapDesignSystemStyles), and the editor still offers them while
 * Bootstrap is active.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  BootstrapTokens,
  BootstrapFonts,
} from "@haxtheweb/bootstrap-theme/lib/BootstrapTokens.js";
import {
  BootstrapDDDMap,
  BootstrapColorNames,
} from "@haxtheweb/bootstrap-theme/lib/BootstrapDDDMap.js";
import { BootstrapIcons } from "@haxtheweb/bootstrap-theme/lib/BootstrapIcons.js";
import { BootstrapDesignSystemStyles } from "@haxtheweb/bootstrap-theme/lib/BootstrapDesignSystemStyles.js";

export const BOOTSTRAP_SYSTEM = "bootstrap";

/** register Bootstrap with the design system manager (once) */
export function registerBootstrapDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[BOOTSTRAP_SYSTEM]) {
    manager.addDesignSystem({
      name: BOOTSTRAP_SYSTEM,
      extends: "ddd",
      styles: [
        BootstrapTokens,
        BootstrapDDDMap,
        ...BootstrapDesignSystemStyles,
      ],
      fonts: BootstrapFonts,
      // the color pickers name each option after the token it now shows
      colorNames: BootstrapColorNames,
      // HAX icon names drawn in Bootstrap Icons while it is active
      icons: BootstrapIcons,
      integrations: {
        hax: {
          importer: () =>
            import("@haxtheweb/bootstrap-theme/lib/BootstrapStyleGuideAuthoring.js"),
          exportName: "registerBootstrapStyleGuideAuthoring",
          shouldLoad: (context = {}) =>
            !!context.editMode && context.isAuthenticated !== false,
        },
      },
    });
  }
  return manager;
}

/** make Bootstrap the active design system */
export function activateBootstrapDesignSystem(manager = DesignSystemManager) {
  registerBootstrapDesignSystem(manager);
  if (manager && manager.active !== BOOTSTRAP_SYSTEM) {
    manager.active = BOOTSTRAP_SYSTEM;
  }
  return manager;
}
