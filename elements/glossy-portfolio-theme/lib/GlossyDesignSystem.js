/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Glossy as a DDD-capable design system. It extends "ddd": every DDD style,
 * data attribute and HAX authoring option stays as it is, and the Glossy
 * tokens, the DDD -> Glossy map and Glossy's content link treatment are
 * layered after them, so blocks authored in a portfolio take on the
 * gallery's colors, faces, corners and focus ring. Content stays plain DDD
 * content and keeps working when the site moves to any other theme.
 */
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  GlossyTokens,
  GlossyFonts,
} from "@haxtheweb/glossy-portfolio-theme/lib/GlossyTokens.js";
import {
  GlossyDDDMap,
  GlossyColorNames,
} from "@haxtheweb/glossy-portfolio-theme/lib/GlossyDDDMap.js";
import { GlossyContentStyles } from "@haxtheweb/glossy-portfolio-theme/lib/GlossyContentStyles.js";

export const GLOSSY_SYSTEM = "glossy";

/** register Glossy with the design system manager (once) */
export function registerGlossyDesignSystem(manager = DesignSystemManager) {
  if (manager && !manager.systems[GLOSSY_SYSTEM]) {
    manager.addDesignSystem({
      name: GLOSSY_SYSTEM,
      extends: "ddd",
      styles: [GlossyTokens, GlossyDDDMap, GlossyContentStyles],
      fonts: GlossyFonts,
      // the color pickers name each option after the token it now shows
      colorNames: GlossyColorNames,
    });
  }
  return manager;
}

/** make Glossy the active design system */
export function activateGlossyDesignSystem(manager = DesignSystemManager) {
  registerGlossyDesignSystem(manager);
  if (manager && manager.active !== GLOSSY_SYSTEM) {
    manager.active = GLOSSY_SYSTEM;
  }
  return manager;
}
