/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Classic Desktop as a DDD-capable design system: the 20 static colors of
 * the classic system palette, square corners, two-tone bevels and a dotted
 * focus ring. It extends "ddd": every DDD style, data attribute and HAX
 * authoring option stays as it is, and the Classic Desktop tokens plus the
 * DDD -> Classic Desktop map are layered after them. Content stays plain
 * DDD content and keeps working when the site moves to any other theme.
 *
 * It also carries a HAX UI skin (lib/ClassicDesktopHaxUiSkin.js), so the
 * editor takes on the same look while the system is active.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  ClassicDesktopTokens,
  ClassicDesktopFonts,
} from "@haxtheweb/wysiwyg96-theme/lib/ClassicDesktopTokens.js";
import {
  ClassicDesktopDDDMap,
  ClassicDesktopColorNames,
} from "@haxtheweb/wysiwyg96-theme/lib/ClassicDesktopDDDMap.js";
import { ClassicDesktopHaxUiSkin } from "@haxtheweb/wysiwyg96-theme/lib/ClassicDesktopHaxUiSkin.js";

export const CLASSIC_DESKTOP_SYSTEM = "classic-desktop";

/** register Classic Desktop with the design system manager (once) */
export function registerClassicDesktopDesignSystem(
  manager = DesignSystemManager,
) {
  if (manager && !manager.systems[CLASSIC_DESKTOP_SYSTEM]) {
    manager.addDesignSystem({
      name: CLASSIC_DESKTOP_SYSTEM,
      extends: "ddd",
      styles: [
        ClassicDesktopTokens,
        ClassicDesktopDDDMap,
        ClassicDesktopHaxUiSkin,
      ],
      fonts: ClassicDesktopFonts,
      // the color pickers name each option after the classic color it shows
      colorNames: ClassicDesktopColorNames,
    });
  }
  return manager;
}

/** make Classic Desktop the active design system */
export function activateClassicDesktopDesignSystem(
  manager = DesignSystemManager,
) {
  registerClassicDesktopDesignSystem(manager);
  if (manager && manager.active !== CLASSIC_DESKTOP_SYSTEM) {
    manager.active = CLASSIC_DESKTOP_SYSTEM;
  }
  return manager;
}
