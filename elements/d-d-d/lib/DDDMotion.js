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
 * no exports to d-d-d.js or DDDStyles.js (d-d-d.js only adds the icon
 * motions to the sheet DDD puts in the document). Import it directly:
 *
 *   import { DDDMotionStyles } from "@haxtheweb/d-d-d/lib/DDDMotion.js";
 *   static get styles() { return [super.styles, DDDMotionStyles, css`...`]; }
 *
 * Two sets live here: the line motions graph and diagram blocks need
 * (DDDMotionStyles, which DDDConnector.js includes) and the icon motions
 * (DDDMotionIconStyles and DDDMotionIconHostStyles, described above their
 * exports further down).
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
import { css, unsafeCSS } from "lit";

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

/**
 * Icon motions: short decorative motions for an icon (or any small glyph)
 * that play once when it is hovered or takes keyboard focus.
 *
 *   pop     scale up and settle           hubs, the thing a page is about
 *   wiggle  quick side to side rotation   things you edit or report
 *   tilt    tip back and return           tools in hand
 *   beat    two soft scale beats          living things, status
 *   lift    rise a little and come back   layers, storage, files
 *   spin    one full turn                 reserved, use sparingly
 *   nudge   slide forward and back        flows, pipes, next steps
 *   strike  swing down and back           gavel-like actions, rules
 *   glow    brighten with a soft halo     ideas, magic
 *
 * beat is the scale motion; pulse (DDDAnimations in DDDStyles.js) is the
 * box-shadow ring that asks for attention and is a different thing.
 *
 * Rules every icon motion keeps:
 * - it plays once per hover or focus and then rests
 * - it lasts under a second (600ms unless a token changes it)
 * - it is decoration: nothing is said by the motion alone
 * - under prefers-reduced-motion: reduce nothing moves. The keyframes and
 *   every rule that plays them sit inside a no-preference media query, so
 *   with reduced motion the keyframes do not exist and a rule a component
 *   wrote itself has nothing to play either.
 *
 * The keyframes animate the scale, rotate and translate properties (and
 * filter for glow), not transform, so a transform the element already has
 * (a flipped arrow, for example) stays in place while it moves. They need
 * a box that can transform: inline-block, inline-flex, block. A plain
 * inline span does not move.
 *
 * DDDMotionIconStyles: include in a component's shadow styles (the DDD
 * design system also puts it in the document). Then, in that scope:
 *
 *   class="ddd-motion-wiggle"     plays when the element itself is hovered
 *                                 or focused with the keyboard
 *   class="ddd-motion-trigger"    on a card, tile, button or link: hovering
 *                                 it, or focus anywhere inside it, plays the
 *                                 motion of each .ddd-motion-<name> or
 *                                 [motion="<name>"] element inside. On the
 *                                 component itself (the host) it also plays
 *                                 slotted ones.
 *   class="ddd-motion-play"       beside ddd-motion-<name>: plays now, once
 *                                 (script adds and removes it)
 *
 * DDDMotionIconHostStyles: the same motions for an element that takes a
 * motion attribute on itself, as simple-icon and simple-icon-lite do:
 *
 *   <simple-icon icon="icons:build" motion="wiggle"></simple-icon>
 *
 * plays on its own hover or keyboard focus, and while it has the
 * motion-active attribute. simple-icon does not import DDD: this module
 * hands the sheet to it through globalThis.DDDMotion.adoptHost(shadowRoot),
 * so where DDD is not loaded the attribute does nothing.
 *
 * Tokens (DDD sets the defaults on the page; override on the element or
 * any ancestor):
 *   --ddd-motion-icon-duration   600ms (--ddd-duration-slow)
 *   --ddd-motion-icon-timing     --ddd-timing-ease
 *   --ddd-motion-icon-distance   how far lift and nudge travel and how wide
 *                                the glow halo is, 4px (--ddd-spacing-1)
 */
export const DDDMotionIconNames = [
  "pop",
  "wiggle",
  "tilt",
  "beat",
  "lift",
  "spin",
  "nudge",
  "strike",
  "glow",
];

// keyframes only; always wrapped in the no-preference query below
const DDDMotionIconKeyframes = css`
  @keyframes ddd-motion-pop {
    0%,
    100% {
      scale: 1;
    }
    45% {
      scale: 1.25;
    }
  }
  @keyframes ddd-motion-wiggle {
    0%,
    100% {
      rotate: 0deg;
    }
    20% {
      rotate: -11deg;
    }
    45% {
      rotate: 10deg;
    }
    70% {
      rotate: -6deg;
    }
  }
  @keyframes ddd-motion-tilt {
    0%,
    100% {
      rotate: 0deg;
    }
    50% {
      rotate: -16deg;
    }
  }
  @keyframes ddd-motion-beat {
    0%,
    100% {
      scale: 1;
    }
    30% {
      scale: 1.14;
    }
    55% {
      scale: 0.97;
    }
    80% {
      scale: 1.07;
    }
  }
  @keyframes ddd-motion-lift {
    0%,
    100% {
      translate: 0 0;
    }
    45% {
      translate: 0
        calc(-1.5 * var(--ddd-motion-icon-distance, var(--ddd-spacing-1, 4px)));
    }
  }
  @keyframes ddd-motion-spin {
    0% {
      rotate: 0deg;
    }
    100% {
      rotate: 360deg;
    }
  }
  @keyframes ddd-motion-nudge {
    0%,
    100% {
      translate: 0 0;
    }
    40% {
      translate: calc(
          1.25 * var(--ddd-motion-icon-distance, var(--ddd-spacing-1, 4px))
        )
        0;
    }
    70% {
      translate: calc(
          -0.25 * var(--ddd-motion-icon-distance, var(--ddd-spacing-1, 4px))
        )
        0;
    }
  }
  @keyframes ddd-motion-strike {
    0%,
    80%,
    100% {
      rotate: 0deg;
    }
    35% {
      rotate: -24deg;
    }
    60% {
      rotate: 8deg;
    }
  }
  @keyframes ddd-motion-glow {
    0%,
    100% {
      filter: drop-shadow(0 0 0 currentColor) brightness(1);
    }
    50% {
      filter: drop-shadow(
          0 0 var(--ddd-motion-icon-distance, var(--ddd-spacing-1, 4px))
            currentColor
        )
        brightness(1.2);
    }
  }
`;

// one declaration plays a motion: name, duration, easing, once
const iconMotionPlay = (name) =>
  `animation: ddd-motion-${name} var(--ddd-motion-icon-duration, var(--ddd-duration-slow, 600ms)) var(--ddd-motion-icon-timing, var(--ddd-timing-ease, ease-in-out)) 1;`;

// selectors that play a motion on an element inside the including scope
const iconMotionSelectors = (name) => {
  const targets = [`.ddd-motion-${name}`, `[motion="${name}"]`];
  const list = [
    `.ddd-motion-${name}:hover`,
    `.ddd-motion-${name}:focus-visible`,
    `.ddd-motion-${name}.ddd-motion-play`,
  ];
  targets.forEach((target) => {
    ["hover", "focus-within"].forEach((state) => {
      list.push(`.ddd-motion-trigger:${state} ${target}`);
      list.push(`:host(.ddd-motion-trigger:${state}) ${target}`);
      list.push(`:host(.ddd-motion-trigger:${state}) ::slotted(${target})`);
    });
  });
  return list.join(",\n");
};

// selectors that play a motion on the host that carries the attribute
const iconMotionHostSelectors = (name) =>
  [
    `:host([motion="${name}"]:hover)`,
    `:host([motion="${name}"]:focus-visible)`,
    `:host([motion="${name}"][motion-active])`,
  ].join(",\n");

const iconMotionRules = (selectors) =>
  DDDMotionIconNames.map(
    (name) => `${selectors(name)} {\n${iconMotionPlay(name)}\n}`,
  ).join("\n");

export const DDDMotionIconStyles = css`
  /* the defaults, for the page; a shadow root reads them by inheritance
     and every use carries the same fallback for where DDD is not loaded */
  html {
    --ddd-motion-icon-duration: var(--ddd-duration-slow, 600ms);
    --ddd-motion-icon-timing: var(--ddd-timing-ease, ease-in-out);
    --ddd-motion-icon-distance: var(--ddd-spacing-1, 4px);
  }
  @media (prefers-reduced-motion: no-preference) {
    ${DDDMotionIconKeyframes}
    ${unsafeCSS(iconMotionRules(iconMotionSelectors))}
  }
`;

export const DDDMotionIconHostStyles = css`
  @media (prefers-reduced-motion: no-preference) {
    ${DDDMotionIconKeyframes}
    ${unsafeCSS(iconMotionRules(iconMotionHostSelectors))}
  }
`;

/**
 * Adds the host motions to a shadow root, once. Elements that take a motion
 * attribute but do not depend on DDD (simple-icon) call this through
 * globalThis.DDDMotion.adoptHost; returns true when the sheet is in place.
 */
export function adoptDDDMotionIconHost(root) {
  const sheet = DDDMotionIconHostStyles.styleSheet;
  if (!root || !sheet || !root.adoptedStyleSheets) {
    return false;
  }
  if (root.adoptedStyleSheets.indexOf(sheet) === -1) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  }
  return true;
}

// announce the library so elements that only know the motion attribute can
// pick it up, whether they were on the page before this module or after
if (globalThis.document && globalThis.dispatchEvent) {
  globalThis.DDDMotion = globalThis.DDDMotion || {};
  globalThis.DDDMotion.names = DDDMotionIconNames;
  globalThis.DDDMotion.adoptHost = adoptDDDMotionIconHost;
  globalThis.dispatchEvent(new CustomEvent("ddd-motion-ready"));
}
