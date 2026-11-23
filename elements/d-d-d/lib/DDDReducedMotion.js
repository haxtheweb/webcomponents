/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * DDD reduced motion: the one rule that stops motion for people who ask
 * for less of it (prefers-reduced-motion: reduce).
 *
 * Durations drop to --ddd-duration-reduced (0.01ms) instead of the
 * transition or animation being removed, so transitionend and animationend
 * still fire and code that waits on them still finishes. Loops play once
 * and delays on transitions are dropped. Animation delays are kept: they
 * are timing (a tooltip that waits before it shows, a toast that waits
 * before it leaves), not motion.
 *
 * Every element that extends DDD or DDDSuper already has this rule, from
 * d-d-d.js. An element in a DDD context that does not extend DDD adds it
 * to its own styles:
 *
 *   import { DDDReducedMotion } from "@haxtheweb/d-d-d/lib/DDDReducedMotion.js";
 *   static get styles() { return [css`...`, DDDReducedMotion]; }
 *
 * An element that has to work where DDD is not installed writes the same
 * media query itself, with var(--ddd-duration-reduced, 0.01ms) so the
 * token still applies when DDD is on the page. Where a loop has to stand
 * still as a picture (a loading shape, say) and nothing waits on its end
 * event, animation: none is the right stop.
 *
 * :host is in the selector because * only matches inside the shadow root,
 * so motion on the element itself would escape the stop.
 */
import { css } from "lit";

export const DDDReducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    :host,
    *,
    *::before,
    *::after {
      animation-duration: var(--ddd-duration-reduced, 0.01ms) !important;
      animation-iteration-count: 1 !important;
      transition-duration: var(--ddd-duration-reduced, 0.01ms) !important;
      transition-delay: 0ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
