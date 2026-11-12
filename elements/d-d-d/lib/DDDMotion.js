/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD motion library: named keyframes that elements share instead of each
 * writing their own. This is the seed of the motion library proposed in
 * https://github.com/haxtheweb/issues/issues/3221 and follows its rules:
 *
 * - keyframes are prefixed ddd-motion-* so they cannot collide with
 *   element-local keyframes (and pulse keeps its own meaning)
 * - durations and easing come from tokens built on the existing
 *   --ddd-duration-* and --ddd-timing-* scale in DDDStyles.js
 * - prefers-reduced-motion is handled here, centrally, so no element can
 *   forget it
 * - motion is decorative: it is never the only way something is shown
 *
 * Keyframes in the document stylesheet do not reach a shadow root, so this
 * is a css export that components include, like the other DDD shared
 * styles. Standalone on purpose, like DDDBlock.js and DDDChart.js: it adds
 * no exports to d-d-d.js or DDDStyles.js. Import it directly:
 *
 *   import { DDDMotionStyles } from "@haxtheweb/d-d-d/lib/DDDMotion.js";
 *   static get styles() { return [super.styles, DDDMotionStyles, css`...`]; }
 *
 * This first set holds the two line motions graph and diagram blocks need
 * (DDDConnector.js includes them). The icon motions listed in #3221
 * (pop, wiggle, tilt, beat, lift, spin, nudge, strike, glow) are meant to
 * join this file, under the same prefix and the same reduced-motion stop.
 *
 * Motions (class on an SVG path, line or polyline):
 *
 *   .ddd-motion-draw-in  the line draws itself in once, start to end.
 *     Put pathLength="1" on the path, or set --ddd-connector-length to the
 *     path length in user units (measureDDDConnector() in DDDConnector.js
 *     does that) when the line keeps a dash pattern. While it draws the line
 *     is solid; its own dash pattern returns when the motion ends.
 *   .ddd-motion-flow     the dash pattern marches along the line, start to
 *     end, to show direction. It runs a few times and rests (under five
 *     seconds, WCAG 2.2.2); set --ddd-motion-flow-iterations: infinite only
 *     with a visible pause control, and pause with .ddd-motion-paused or
 *     [data-motion-paused]. Always pair it with an arrowhead or other static
 *     cue: under reduced motion the dots stand still.
 *
 * Tokens (set on :host, all optional):
 *   --ddd-motion-draw-in-duration     600ms (--ddd-duration-slow)
 *   --ddd-motion-draw-in-timing       --ddd-timing-enter
 *   --ddd-motion-draw-in-delay        0ms
 *   --ddd-motion-flow-duration        1200ms (two --ddd-duration-slow)
 *   --ddd-motion-flow-timing          --ddd-timing-linear
 *   --ddd-motion-flow-iterations      4
 *   --ddd-motion-flow-dash            0 10 (round dots, for solid lines)
 *   --ddd-motion-flow-period          10 (the length of one dash period)
 */
import { css } from "lit";

export const DDDMotionTokens = css`
  :host {
    --ddd-motion-draw-in-duration: var(--ddd-duration-slow, 600ms);
    --ddd-motion-draw-in-timing: var(--ddd-timing-enter, ease-out);
    --ddd-motion-draw-in-delay: 0ms;
    --ddd-motion-flow-duration: calc(var(--ddd-duration-slow, 600ms) * 2);
    --ddd-motion-flow-timing: var(--ddd-timing-linear, linear);
    --ddd-motion-flow-iterations: 4;
    --ddd-motion-flow-dash: 0 10;
    --ddd-motion-flow-period: 10;
  }
`;

export const DDDMotionStyles = [
  DDDMotionTokens,
  css`
    @keyframes ddd-motion-draw-in {
      from {
        stroke-dasharray: var(--ddd-connector-length, 1);
        stroke-dashoffset: var(--ddd-connector-length, 1);
      }
      to {
        stroke-dasharray: var(--ddd-connector-length, 1);
        stroke-dashoffset: 0;
      }
    }
    @keyframes ddd-motion-flow {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: calc(-1 * var(--ddd-connector-period, 10));
      }
    }
    .ddd-motion-draw-in {
      animation-name: ddd-motion-draw-in;
      animation-duration: var(--ddd-motion-draw-in-duration);
      animation-timing-function: var(--ddd-motion-draw-in-timing);
      animation-delay: var(--ddd-motion-draw-in-delay);
      animation-iteration-count: 1;
      animation-fill-mode: backwards;
    }
    .ddd-motion-flow {
      animation-name: ddd-motion-flow;
      animation-duration: var(--ddd-motion-flow-duration);
      animation-timing-function: var(--ddd-motion-flow-timing);
      animation-iteration-count: var(--ddd-motion-flow-iterations);
    }
    .ddd-motion-paused,
    [data-motion-paused] .ddd-motion-flow,
    [data-motion-paused].ddd-motion-flow {
      animation-play-state: paused;
    }
    @media (prefers-reduced-motion: reduce) {
      .ddd-motion-draw-in,
      .ddd-motion-flow {
        animation: none;
      }
    }
  `,
];
