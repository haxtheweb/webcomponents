/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Spectrum as a DDD-capable design system. It extends "ddd": every DDD
 * style, data attribute and HAX authoring option stays as it is, and the
 * Spectrum tokens plus the DDD → Spectrum map are layered after them. Content
 * authored under this system is plain DDD content, so it keeps working when
 * the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  SpectrumTokens,
  SpectrumFonts,
} from "@haxtheweb/spectrum-theme/lib/SpectrumTokens.js";
import { SpectrumDDDMap } from "@haxtheweb/spectrum-theme/lib/SpectrumDDDMap.js";

export const SPECTRUM_SYSTEM = "spectrum";

/** register Spectrum with the design system manager (once) */
export function registerSpectrumDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[SPECTRUM_SYSTEM]) {
    manager.addDesignSystem({
      name: SPECTRUM_SYSTEM,
      extends: "ddd",
      styles: [SpectrumTokens, SpectrumDDDMap],
      fonts: SpectrumFonts,
    });
  }
  return manager;
}

/** make Spectrum the active design system */
export function activateSpectrumDesignSystem(manager = DesignSystemManager) {
  registerSpectrumDesignSystem(manager);
  if (manager && manager.active !== SPECTRUM_SYSTEM) {
    manager.active = SPECTRUM_SYSTEM;
  }
  return manager;
}
