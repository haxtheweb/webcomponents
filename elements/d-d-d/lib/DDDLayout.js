/**
 * DDD layout scale: the single source of truth for breakpoints and the
 * named widths used to build themes and layout elements (content column,
 * sidebar, outer container, gutters).
 *
 * This module has no imports so that lightweight elements (grid-plate,
 * responsive-utility consumers, themes) can read the scale without pulling
 * in the full DDD style payload. DDDStyles.js generates the matching
 * --ddd-breakpoint-* and --ddd-*-width custom properties from these values.
 *
 * Why export numbers: CSS custom properties cannot be used inside media
 * queries, so `@media (min-width: var(--ddd-breakpoint-md))` does not work.
 * Use these values with unsafeCSS in a lit css template, or pass them to
 * responsive-utility for container-relative sizing.
 *
 * @example
 * import { css, unsafeCSS } from "lit";
 * import { DDDBreakpoints } from "@haxtheweb/d-d-d/lib/DDDLayout.js";
 * css`
 *   @media (max-width: ${unsafeCSS(DDDBreakpoints.md - 1)}px) { ... }
 * `;
 */

/**
 * Breakpoints in px, named by size rather than device so the same scale can
 * describe the viewport (themes) or an element's own width (grid-plate).
 * sm/md/lg keep the 600/900/1200 values the component layer already used
 * (grid-plate, ResponsiveUtilityBehaviors, lrndesign-timeline) so adopting
 * the scale does not shift existing layouts:
 * 600 (narrow / phones), 900 (sidebar collapses below this),
 * 1200 (default sidebar + content column + two gutters fit: 300+840+48),
 * 1440 (wide desktop, matches the large container width).
 */
export const DDDBreakpoints = Object.freeze({
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1440,
});

/**
 * Readable content column widths in px. md (840) is the de-facto default
 * across HAXcms themes.
 */
export const DDDContentWidths = Object.freeze({
  sm: 640,
  md: 840,
  lg: 960,
});

/**
 * Sidebar / navigation drawer widths in px. md (300) is the de-facto default
 * across HAXcms themes; rail is the collapsed icon-only state.
 */
export const DDDSidebarWidths = Object.freeze({
  rail: 56,
  sm: 240,
  md: 300,
  lg: 360,
});

/**
 * Outer page container widths in px.
 */
export const DDDContainerWidths = Object.freeze({
  md: 1200,
  lg: 1440,
});

/**
 * Convenience lookup of every layout scale, keyed by token family.
 */
export const DDDLayout = Object.freeze({
  breakpoint: DDDBreakpoints,
  contentWidth: DDDContentWidths,
  sidebarWidth: DDDSidebarWidths,
  containerWidth: DDDContainerWidths,
});

/**
 * Return the size name (xs, sm, md, lg, xl) for a width in px, using the
 * DDD breakpoint scale. Anything below sm is xs.
 * @param {Number} width
 * @returns {String}
 */
export function dddSizeForWidth(width = 0) {
  if (width >= DDDBreakpoints.xl) return "xl";
  if (width >= DDDBreakpoints.lg) return "lg";
  if (width >= DDDBreakpoints.md) return "md";
  if (width >= DDDBreakpoints.sm) return "sm";
  return "xs";
}
