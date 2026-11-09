/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD progress ring (haxtheweb/issues#3267): a ring around an icon that
 * fills with how much of something is done. One look everywhere it is used
 * (the active page in the site menu, the My learning button, the rows of
 * the My learning panel):
 *
 *   not started   faint track, nothing filled       data-state="none"
 *   in progress   ring filled to the percent        data-state="progress"
 *   almost done   75% or more, nearly closed ring   data-state="almost"
 *   done          filled disc with a check          data-state="done"
 *
 * Done never relies on colour alone: the ring becomes a filled disc (reads
 * in grayscale and forced colours) and the icon becomes a check. The ring
 * is decoration (aria-hidden); say the percent in the accessible name and
 * hover text of whatever holds it (dddProgressText gives the words' data).
 *
 * With prefers-reduced-motion the fill does not animate and moves in 25%
 * steps (dddProgressShown), and done swaps straight to its state.
 *
 * Standalone like DDDBlock.js; import it directly:
 *
 *   import {
 *     DDDProgressRingStyles,
 *     renderDDDProgressRing,
 *   } from "@haxtheweb/d-d-d/lib/DDDProgressRing.js";
 *
 *   static get styles() { return [super.styles, DDDProgressRingStyles]; }
 *   render() {
 *     return renderDDDProgressRing({ percent: 0.49, icon: "editor:insert-chart" });
 *   }
 *
 * Custom properties: --ddd-component-progress-ring-size (default
 * --ddd-icon-xs), --ddd-component-progress-ring-color (fill and done disc),
 * --ddd-component-progress-ring-track, --ddd-component-progress-ring-on-color
 * (icon on the done disc), --ddd-component-progress-ring-icon-size,
 * --ddd-component-progress-ring-width / -track-width (stroke widths in
 * viewBox units of 36, default 3) and
 * --ddd-component-progress-ring-empty-opacity (not started, default 0.45).
 * The burst of celebrateDDDCompletion (DDDBlock.js) plays from the ring.
 */
import { html, css, nothing } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  DDDCompletionStyles,
  renderDDDBurst,
  prefersDDDReducedMotion,
} from "./DDDBlock.js";

export const DDDProgressRingStyles = [
  DDDCompletionStyles,
  css`
    .ddd-ring {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      box-sizing: border-box;
      width: var(--ddd-component-progress-ring-size, var(--ddd-icon-xs));
      height: var(--ddd-component-progress-ring-size, var(--ddd-icon-xs));
      border-radius: var(--ddd-radius-circle);
      --simple-icon-color: currentColor;
      --simple-icon-width: var(
        --ddd-component-progress-ring-icon-size,
        var(--ddd-icon-4xs)
      );
      --simple-icon-height: var(
        --ddd-component-progress-ring-icon-size,
        var(--ddd-icon-4xs)
      );
    }
    .ddd-ring-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .ddd-ring-track {
      fill: none;
      stroke: var(
        --ddd-component-progress-ring-track,
        light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-limestoneGray)
        )
      );
      stroke-width: var(--ddd-component-progress-ring-track-width, 3);
    }
    .ddd-ring-fill {
      fill: none;
      stroke: var(
        --ddd-component-progress-ring-color,
        light-dark(
          var(--ddd-theme-default-beaverBlue),
          var(--ddd-theme-default-skyBlue)
        )
      );
      stroke-width: var(--ddd-component-progress-ring-width, 3);
      stroke-linecap: round;
      transition: stroke-dasharray var(--ddd-duration-normal, 300ms)
        var(--ddd-timing-ease, ease);
    }
    .ddd-ring[data-state="none"] .ddd-ring-svg {
      opacity: var(--ddd-component-progress-ring-empty-opacity, 0.45);
    }
    .ddd-ring[data-state="none"] .ddd-ring-fill {
      stroke: none;
    }
    .ddd-ring[data-state="done"] {
      background-color: var(
        --ddd-component-progress-ring-color,
        light-dark(
          var(--ddd-theme-default-beaverBlue),
          var(--ddd-theme-default-skyBlue)
        )
      );
      color: var(
        --ddd-component-progress-ring-on-color,
        light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-coalyGray)
        )
      );
    }
    .ddd-ring[data-state="done"] .ddd-ring-svg {
      display: none;
    }
    .ddd-ring-glyph {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--ddd-font-navigation);
      font-size: var(--ddd-font-size-4xs);
      font-weight: var(--ddd-font-weight-bold);
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
    @media (prefers-reduced-motion: reduce) {
      .ddd-ring-fill {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .ddd-ring-track {
        stroke: GrayText;
      }
      .ddd-ring-fill {
        stroke: CanvasText;
      }
      .ddd-ring[data-state="done"] {
        background-color: CanvasText;
        color: Canvas;
      }
    }
  `,
];

/**
 * 0 to 1, from a number or anything else (0)
 */
export function dddProgressValue(percent) {
  const p = Number(percent);
  if (!isFinite(p) || p <= 0) {
    return 0;
  }
  return p >= 1 ? 1 : p;
}

/**
 * The state of a ring: none (0), progress, almost (75% or more) or done (1)
 * @param {Number} percent 0 to 1
 * @returns {String}
 */
export function dddProgressState(percent) {
  const p = dddProgressValue(percent);
  if (p >= 1) {
    return "done";
  }
  if (p >= 0.75) {
    return "almost";
  }
  return p > 0 ? "progress" : "none";
}

/**
 * How much of the ring is filled: the percent, or with reduced motion the
 * 25% step at or below it (done is always full)
 * @param {Number} percent 0 to 1
 * @param {Boolean} [reduce] defaults to prefers-reduced-motion
 * @returns {Number} 0 to 1
 */
export function dddProgressShown(percent, reduce) {
  const p = dddProgressValue(percent);
  const r = typeof reduce === "boolean" ? reduce : prefersDDDReducedMotion();
  if (!r || p >= 1) {
    return p;
  }
  return Math.floor(p * 4) / 4;
}

/**
 * Whole percent for text: 49 for 0.49; never 100 before it is done
 * @param {Number} percent 0 to 1
 * @returns {Number}
 */
export function dddProgressPercent(percent) {
  const p = dddProgressValue(percent);
  if (p >= 1) {
    return 100;
  }
  return Math.min(99, Math.round(p * 100));
}

/**
 * The ring.
 * @param {Object} o
 * @param {Number} o.percent 0 to 1
 * @param {String} [o.icon] simple-icon in the middle while not done
 * @param {*} [o.glyph] content for the middle instead of an icon (a
 *   percent); not shown once done
 * @param {String} [o.doneIcon] icon once done (icons:check)
 * @param {Boolean} [o.burst] include the completion burst
 * @param {String} [o.part] part name(s) for the ring
 * @param {Boolean} [o.reduce] force reduced motion stepping (tests)
 * @returns {TemplateResult}
 */
export function renderDDDProgressRing(o) {
  const opts = o || {};
  const state = dddProgressState(opts.percent);
  const shown = Math.round(dddProgressShown(opts.percent, opts.reduce) * 100);
  let middle = nothing;
  if (state === "done") {
    middle = html`<simple-icon-lite
      class="ddd-burst-pop"
      icon="${opts.doneIcon || "icons:check"}"
    ></simple-icon-lite>`;
  } else if (opts.glyph) {
    middle = opts.glyph;
  } else if (opts.icon) {
    middle = html`<simple-icon-lite icon="${opts.icon}"></simple-icon-lite>`;
  }
  return html`<span
    class="ddd-ring"
    part="${opts.part || nothing}"
    data-state="${state}"
    data-shown="${shown}"
    aria-hidden="true"
    ><svg class="ddd-ring-svg" viewBox="0 0 36 36" focusable="false">
      <circle
        class="ddd-ring-track"
        cx="18"
        cy="18"
        r="16"
        pathLength="100"
      ></circle>
      <circle
        class="ddd-ring-fill"
        cx="18"
        cy="18"
        r="16"
        pathLength="100"
        stroke-dasharray="${shown} 100"
        transform="rotate(-90 18 18)"
      ></circle></svg
    ><span class="ddd-ring-glyph">${middle}</span>${
      opts.burst ? renderDDDBurst() : nothing
    }</span
  >`;
}
