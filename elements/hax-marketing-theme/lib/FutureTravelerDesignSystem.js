/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Future Traveler as a DDD-capable design system: the colors of the Future
 * Traveler logo, a slab display face, rounder corners and sticker-weight
 * rules. It extends "ddd": every DDD style, data attribute and HAX authoring
 * option stays as it is, and the Future Traveler tokens plus the DDD ->
 * Future Traveler map are layered after them. Content stays plain DDD
 * content and keeps working when the site moves to any other design system.
 *
 * It also brings a default palette, so a site reads as Future Traveler
 * until it picks a palette of its own.
 */
import { css } from "lit";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  FutureTravelerTokens,
  FutureTravelerFonts,
} from "@haxtheweb/hax-marketing-theme/lib/FutureTravelerTokens.js";
import {
  FutureTravelerDDDMap,
  FutureTravelerColorNames,
} from "@haxtheweb/hax-marketing-theme/lib/FutureTravelerDDDMap.js";

export const FUTURE_TRAVELER_SYSTEM = "future-traveler";

/**
 * The palette a site gets under this system until it picks one: the
 * traveler's own colors. Any other palette swaps these out, and the theme
 * and its blocks follow.
 */
export const FutureTravelerPalette = css`
  html,
  :root {
    --ddd-palette-color-1: var(--ft-midnight);
    --ddd-palette-color-2: var(--ft-navy);
    --ddd-palette-color-3: var(--ft-red);
    --ddd-palette-color-4: var(--ft-bulb);
    --ddd-palette-color-5: var(--ft-lens);
    --ddd-palette-color-6: var(--ft-red);
    --ddd-palette-color-7: var(--ft-pack);
    --ddd-palette-text-color-1: #ffffff;
    --ddd-palette-text-color-2: #ffffff;
    --ddd-palette-text-color-3: #ffffff;
    --ddd-palette-text-color-4: var(--ft-midnight);
    --ddd-palette-text-color-5: var(--ft-midnight);
    --ddd-palette-text-color-6: #ffffff;
    --ddd-palette-text-color-7: #ffffff;
  }
`;

/** register Future Traveler with the design system manager (once) */
export function registerFutureTravelerDesignSystem(
  manager = DesignSystemManager,
) {
  if (manager && !manager.systems[FUTURE_TRAVELER_SYSTEM]) {
    manager.addDesignSystem({
      name: FUTURE_TRAVELER_SYSTEM,
      extends: "ddd",
      styles: [
        FutureTravelerTokens,
        FutureTravelerDDDMap,
        FutureTravelerPalette,
      ],
      fonts: FutureTravelerFonts,
      colorNames: FutureTravelerColorNames,
    });
  }
  return manager;
}

/** make Future Traveler the active design system */
export function activateFutureTravelerDesignSystem(
  manager = DesignSystemManager,
) {
  registerFutureTravelerDesignSystem(manager);
  if (manager && manager.active !== FUTURE_TRAVELER_SYSTEM) {
    manager.active = FUTURE_TRAVELER_SYSTEM;
  }
  return manager;
}
