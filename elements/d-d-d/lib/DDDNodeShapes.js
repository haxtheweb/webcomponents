/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD node shapes: the frames graph, map and diagram blocks draw nodes in,
 * as SVG path data, so a hub, a store or a process looks the same in every
 * block. Shapes follow the diagram conventions readers already know:
 *
 *   circle      a hub, a person, a single thing
 *   hexagon     a tool, a plugin, something you add
 *   tile        a rounded square: the default, a page or an element
 *   cylinder    storage, a database, a file store
 *   stadium     a start or end point, a pill shaped step
 *   subroutine  a box with doubled sides: a process defined elsewhere
 *
 * Shape is a second cue next to the label and icon, never the only one: a
 * node always has a visible label (or an accessible name when the label is
 * shown elsewhere, like a legend or a table).
 *
 * Standalone on purpose, like DDDBlock.js and DDDChart.js: it adds no
 * exports to d-d-d.js or DDDStyles.js. Import it directly:
 *
 *   import {
 *     DDDNodeStyles,
 *     dddNodeShapePath,
 *     dddNodeShapeInset,
 *     dddNodeMonogram,
 *     renderDDDNode,
 *   } from "@haxtheweb/d-d-d/lib/DDDNodeShapes.js";
 *
 *   svg`<g class="ddd-node" transform="translate(${x} ${y})">
 *     ${renderDDDNode({ shape: "hexagon", width: 64, height: 56,
 *       label: "HAX CLI" })}
 *   </g>`
 *
 * Icon box: dddNodeShapeInset() returns the square inside the shape where an
 * icon fits without touching the frame (below the cylinder lid, inside the
 * subroutine sides, inside the hexagon points). Put a simple-icon or an
 * svg <use> there, sized to the box.
 *
 * Monogram fallback: when a node has no icon, show one or two letters from
 * its label (dddNodeMonogram) in the icon box, in the navigation font and
 * bold. Keep the full label visible next to the node; the monogram is a
 * shorthand, not a name. Do not use a monogram for a node whose label starts
 * with a number or a symbol only: show a neutral icon instead.
 *
 * Custom properties, set on :host by DDDNodeStyles and safe to override per
 * element or per node: --ddd-node-fill, --ddd-node-stroke,
 * --ddd-node-stroke-width, --ddd-node-ink (monogram), --ddd-node-active-stroke
 * (.ddd-node[data-active] and focus).
 */
import { css, svg, nothing } from "lit";

export const DDDNodeShapeNames = [
  "circle",
  "hexagon",
  "tile",
  "cylinder",
  "stadium",
  "subroutine",
];

// round to two decimals so path data stays short and stable
const n = (v) => String(Math.round(v * 100) / 100);

function box(width, height, x, y) {
  const w = Number(width);
  const h = Number(height);
  return {
    w: Number.isFinite(w) && w > 0 ? w : 0,
    h: Number.isFinite(h) && h > 0 ? h : 0,
    x: Number.isFinite(Number(x)) ? Number(x) : 0,
    y: Number.isFinite(Number(y)) ? Number(y) : 0,
  };
}

// the inner sizes each shape keeps clear of its frame
function geometry(b) {
  const { w, h } = b;
  return {
    r: Math.min(w, h) / 2,
    hexInset: Math.min(w / 4, h * 0.2887),
    tileRadius: Math.min(w, h) * 0.2,
    lid: Math.min(h * 0.15, w * 0.25),
    side: Math.min(w / 8, h / 4),
  };
}

/**
 * SVG path data for a node frame that fills the box (x, y, width, height).
 * Unknown shapes fall back to the tile. The cylinder adds its lid line and
 * the subroutine its inner side lines as extra subpaths, so one path draws
 * the whole frame.
 * @param {String} shape one of DDDNodeShapeNames
 * @param {Number} width
 * @param {Number} height
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @returns {String} path data, empty for a zero sized box
 */
export function dddNodeShapePath(shape, width, height, x, y) {
  const b = box(width, height, x, y);
  if (!b.w || !b.h) {
    return "";
  }
  const g = geometry(b);
  const { w, h } = b;
  const L = b.x;
  const T = b.y;
  const R = b.x + w;
  const B = b.y + h;
  switch (shape) {
    case "circle": {
      const cx = L + w / 2;
      const cy = T + h / 2;
      const r = g.r;
      return `M${n(cx - r)} ${n(cy)}A${n(r)} ${n(r)} 0 1 0 ${n(cx + r)} ${n(cy)}A${n(r)} ${n(r)} 0 1 0 ${n(cx - r)} ${n(cy)}Z`;
    }
    case "hexagon": {
      const i = g.hexInset;
      const my = T + h / 2;
      return `M${n(L + i)} ${n(T)}H${n(R - i)}L${n(R)} ${n(my)}L${n(R - i)} ${n(B)}H${n(L + i)}L${n(L)} ${n(my)}Z`;
    }
    case "cylinder": {
      const rx = w / 2;
      const ry = g.lid;
      return (
        `M${n(L)} ${n(T + ry)}A${n(rx)} ${n(ry)} 0 0 1 ${n(R)} ${n(T + ry)}` +
        `V${n(B - ry)}A${n(rx)} ${n(ry)} 0 0 1 ${n(L)} ${n(B - ry)}Z` +
        `M${n(L)} ${n(T + ry)}A${n(rx)} ${n(ry)} 0 0 0 ${n(R)} ${n(T + ry)}`
      );
    }
    case "stadium": {
      const r = g.r;
      if (w >= h) {
        return `M${n(L + r)} ${n(T)}H${n(R - r)}A${n(r)} ${n(r)} 0 0 1 ${n(R - r)} ${n(B)}H${n(L + r)}A${n(r)} ${n(r)} 0 0 1 ${n(L + r)} ${n(T)}Z`;
      }
      return `M${n(L)} ${n(T + r)}A${n(r)} ${n(r)} 0 0 1 ${n(R)} ${n(T + r)}V${n(B - r)}A${n(r)} ${n(r)} 0 0 1 ${n(L)} ${n(B - r)}Z`;
    }
    case "subroutine": {
      const d = g.side;
      return (
        `M${n(L)} ${n(T)}H${n(R)}V${n(B)}H${n(L)}Z` +
        `M${n(L + d)} ${n(T)}V${n(B)}M${n(R - d)} ${n(T)}V${n(B)}`
      );
    }
    default: {
      const r = g.tileRadius;
      return (
        `M${n(L + r)} ${n(T)}H${n(R - r)}A${n(r)} ${n(r)} 0 0 1 ${n(R)} ${n(T + r)}` +
        `V${n(B - r)}A${n(r)} ${n(r)} 0 0 1 ${n(R - r)} ${n(B)}` +
        `H${n(L + r)}A${n(r)} ${n(r)} 0 0 1 ${n(L)} ${n(B - r)}` +
        `V${n(T + r)}A${n(r)} ${n(r)} 0 0 1 ${n(L + r)} ${n(T)}Z`
      );
    }
  }
}

/**
 * The square icon box inside a node frame: the largest square that fits the
 * shape's clear area, scaled down by `scale` (default 0.6) and centred in it.
 * @param {String} shape one of DDDNodeShapeNames
 * @param {Number} width
 * @param {Number} height
 * @param {Object} [opts] { x, y, scale }
 * @returns {{x: Number, y: Number, width: Number, height: Number}}
 */
export function dddNodeShapeInset(shape, width, height, opts) {
  const o = opts || {};
  const b = box(width, height, o.x, o.y);
  const scale =
    Number.isFinite(Number(o.scale)) && Number(o.scale) > 0
      ? Math.min(Number(o.scale), 1)
      : 0.6;
  const g = geometry(b);
  let area = { x: b.x, y: b.y, w: b.w, h: b.h };
  if (shape === "circle") {
    // the square inscribed in the circle
    const s = g.r * Math.SQRT2;
    area = {
      x: b.x + (b.w - s) / 2,
      y: b.y + (b.h - s) / 2,
      w: s,
      h: s,
    };
  } else if (shape === "hexagon") {
    area = { x: b.x + g.hexInset, y: b.y, w: b.w - 2 * g.hexInset, h: b.h };
  } else if (shape === "cylinder") {
    area = { x: b.x, y: b.y + 2 * g.lid, w: b.w, h: b.h - 3 * g.lid };
  } else if (shape === "stadium") {
    area =
      b.w >= b.h
        ? { x: b.x + g.r / 2, y: b.y, w: b.w - g.r, h: b.h }
        : { x: b.x, y: b.y + g.r / 2, w: b.w, h: b.h - g.r };
  } else if (shape === "subroutine") {
    area = { x: b.x + g.side, y: b.y, w: b.w - 2 * g.side, h: b.h };
  }
  const side = Math.max(0, Math.min(area.w, area.h) * scale);
  return {
    x: Math.round((area.x + (area.w - side) / 2) * 100) / 100,
    y: Math.round((area.y + (area.h - side) / 2) * 100) / 100,
    width: Math.round(side * 100) / 100,
    height: Math.round(side * 100) / 100,
  };
}

/**
 * One or two letters to stand in for a missing icon: the first letter of
 * the first two words of the label, upper cased ("HAX CLI" -> "HC",
 * "haxcms-nodejs" -> "HN", "Merlin" -> "ME" when max is 2 and the label is
 * one word). Returns "" when the label has no letter to start from.
 * @param {String} label
 * @param {Number} [max=2] 1 or 2
 * @returns {String}
 */
export function dddNodeMonogram(label, max) {
  const limit = max === 1 ? 1 : 2;
  const words = String(label || "")
    .trim()
    .split(/[\s_\-./]+/)
    .filter((word) => word.length > 0);
  if (!words.length) {
    return "";
  }
  const first = Array.from(words[0]);
  if (!/\p{L}/u.test(first[0])) {
    return "";
  }
  let letters = first[0];
  if (limit === 2) {
    if (words.length > 1) {
      const second = Array.from(words[1])[0];
      letters += /\p{L}/u.test(second) ? second : "";
    } else if (first.length > 1 && /\p{L}/u.test(first[1])) {
      letters += first[1];
    }
  }
  return letters.toLocaleUpperCase();
}

/**
 * Render a node frame (and a monogram when there is no icon) as an svg
 * template, to place inside an svg element or a positioned g.ddd-node.
 * @param {Object} o
 * @param {String} [o.shape="tile"]
 * @param {Number} o.width
 * @param {Number} o.height
 * @param {String} [o.label] used for the monogram when o.icon is not set
 * @param {*} [o.icon] svg template drawn in the icon box instead of the
 *   monogram; receives nothing, size it with dddNodeShapeInset()
 * @returns {TemplateResult}
 */
export function renderDDDNode(o) {
  const opts = o || {};
  const shape = DDDNodeShapeNames.includes(opts.shape) ? opts.shape : "tile";
  const d = dddNodeShapePath(shape, opts.width, opts.height);
  const inset = dddNodeShapeInset(shape, opts.width, opts.height);
  const mono = opts.icon ? "" : dddNodeMonogram(opts.label);
  return svg`<path class="ddd-node-frame" data-shape="${shape}" d="${d}"></path>
    ${
      opts.icon
        ? opts.icon
        : mono
          ? svg`<text
              class="ddd-node-monogram"
              aria-hidden="true"
              x="${inset.x + inset.width / 2}"
              y="${inset.y + inset.height / 2}"
              font-size="${Math.max(8, Math.round(inset.height * 0.7))}"
            >${mono}</text>`
          : nothing
    }`;
}

export const DDDNodeStyles = css`
  :host {
    --ddd-node-fill: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    --ddd-node-stroke: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneGray)
    );
    --ddd-node-stroke-width: var(--ddd-border-size-sm);
    --ddd-node-ink: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-white)
    );
    --ddd-node-active-stroke: light-dark(
      var(--ddd-theme-default-link),
      var(--ddd-theme-default-linkLight)
    );
  }
  .ddd-node-frame {
    fill: var(--ddd-node-fill);
    stroke: var(--ddd-node-stroke);
    stroke-width: var(--ddd-node-stroke-width);
    stroke-linejoin: round;
  }
  .ddd-node-monogram {
    font-family: var(--ddd-font-navigation);
    font-weight: var(--ddd-font-weight-bold);
    text-anchor: middle;
    dominant-baseline: central;
    fill: var(--ddd-node-ink);
    pointer-events: none;
  }
  .ddd-node {
    cursor: pointer;
  }
  .ddd-node[data-active] .ddd-node-frame,
  .ddd-node:focus-visible .ddd-node-frame {
    stroke: var(--ddd-node-active-stroke);
    stroke-width: var(--ddd-border-size-md);
  }
  .ddd-node:focus-visible {
    outline: var(--ddd-focus-ring);
    outline-offset: var(--ddd-focus-offset);
  }
`;
