import { html, css } from "lit";
import {
  DDDProgressRingStyles,
  dddProgressPercent,
  renderDDDProgressRing,
} from "@haxtheweb/d-d-d/lib/DDDProgressRing.js";
import {
  DDDCompletionTracker,
  celebrateDDDCompletion,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";

/**
 * Active page ring (haxtheweb/issues#3267): the item of the page open now
 * (activeProgress, 0 to 1, set by site-menu) shows a DDD progress ring
 * around its icon area, filled to that page's percent and turning into a
 * filled disc with a check once the page is done; the first time it
 * completes while open the ring bursts once (DDDBlock.js). Its percent is
 * the link's hover text and is spoken after the title. Other items show no
 * ring. Colours: --map-menu-progress-ring-color, --map-menu-progress-ring-
 * track, --map-menu-progress-ring-on-color (defaults read on a dark active
 * row in light mode and a light one in dark mode).
 *
 * Learner progress marks for menu items (the progress property; site-menu
 * no longer sets it, it is kept so menus that do still work). `progress` is one of
 * "done", "in-progress", "visited" or "not-started"; anything else draws
 * nothing, so menus without progress data look exactly as before. Each mark
 * is a ring with a glyph (check, half, dot, empty) plus spoken text after the
 * title, so state never relies on colour alone.
 */
export const MAP_MENU_PROGRESS_STATES = [
  "done",
  "in-progress",
  "visited",
  "not-started",
];

export const MapMenuProgressStrings = {
  progressDone: "Done",
  progressInProgress: "In progress",
  progressVisited: "Visited",
  progressPercentComplete: "{percent}% complete",
  progressComplete: "Complete",
};

export const mapMenuActiveRingStyles = [
  DDDProgressRingStyles,
  css`
    .active-ring {
      display: inline-flex;
      flex: none;
      align-self: center;
      /* the ring is taller than a line of the menu; keep the row height */
      margin: calc(-1 * var(--ddd-spacing-2)) var(--ddd-spacing-2)
        calc(-1 * var(--ddd-spacing-2)) 0;
      --ddd-component-progress-ring-color: var(
        --map-menu-progress-ring-color,
        light-dark(
          var(--ddd-theme-default-skyBlue),
          var(--ddd-theme-default-beaverBlue)
        )
      );
      --ddd-component-progress-ring-track: var(
        --map-menu-progress-ring-track,
        light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-limestoneGray)
        )
      );
      --ddd-component-progress-ring-on-color: var(
        --map-menu-progress-ring-on-color,
        light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-coalyGray)
        )
      );
      --ddd-component-progress-ring-size: var(
        --map-menu-progress-ring-size,
        var(--ddd-icon-xs)
      );
    }
    .active-ring .ddd-ring simple-icon-lite {
      margin: 0;
      visibility: visible;
      opacity: 1;
      --simple-icon-height: var(--ddd-icon-4xs);
      --simple-icon-width: var(--ddd-icon-4xs);
    }
  `,
];

/**
 * Whether activeProgress asks for the ring (a number from 0 to 1)
 */
export function hasActiveRing(activeProgress) {
  return (
    typeof activeProgress === "number" &&
    isFinite(activeProgress) &&
    activeProgress >= 0
  );
}

// "49% complete" / "Complete"
export function activeRingText(activeProgress, t) {
  if (activeProgress >= 1) {
    return t.progressComplete;
  }
  return String(t.progressPercentComplete).replace(
    "{percent}",
    dddProgressPercent(activeProgress),
  );
}

/**
 * The ring around the icon area of the active item (with its icon, or
 * nothing in it when the item has none); id lets an icon tooltip point at it
 */
export function renderActiveRing(activeProgress, icon, id) {
  return html`<span class="active-ring" id="${id || "progress-ring"}"
    >${renderDDDProgressRing({
      percent: activeProgress,
      icon: icon || "",
      burst: true,
      part: "progress-ring",
    })}</span
  >`;
}

// spoken after the title: ", 49% complete"
export function renderActiveRingLabel(activeProgress, t) {
  return hasActiveRing(activeProgress)
    ? html`<span class="progress-sr"
        >, ${activeRingText(activeProgress, t)}</span
      >`
    : "";
}

/**
 * After an update of a menu item / header: burst the ring the first time
 * the page open now completes (never when it was already done when shown)
 */
export function updateActiveRing(el, changedProperties) {
  if (!changedProperties.has("activeProgress")) {
    return;
  }
  const p = el.activeProgress;
  const key = el.id || el.url || "";
  // per item: the first time the page it opens completes while it shows
  if (!el.__activeCompletion) {
    el.__activeCompletion = new DDDCompletionTracker();
  }
  const tracker = el.__activeCompletion;
  if (!hasActiveRing(p)) {
    tracker.forget(key);
    return;
  }
  if (tracker.update(key, p >= 1) && el.shadowRoot) {
    celebrateDDDCompletion(
      el.shadowRoot.querySelector(".active-ring .ddd-ring"),
    );
  }
}

export const mapMenuProgressStyles = css`
  .progress-mark {
    --map-menu-progress-done: light-dark(
      var(--ddd-theme-default-opportunityGreen, #008755),
      var(--ddd-theme-default-futureLime, #99cc00)
    );
    --map-menu-progress-partial: light-dark(
      var(--ddd-theme-default-inventOrange, #e98300),
      var(--ddd-theme-default-keystoneYellow, #ffd100)
    );
    --map-menu-progress-visited: light-dark(
      var(--ddd-theme-default-slateGray, #314d64),
      var(--ddd-theme-default-limestoneGray, #a2aaad)
    );
    --map-menu-progress-empty: light-dark(
      var(--ddd-theme-default-limestoneGray, #a2aaad),
      var(--ddd-theme-default-slateGray, #314d64)
    );
    box-sizing: border-box;
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--map-menu-progress-size, 18px);
    height: var(--map-menu-progress-size, 18px);
    margin: 0 var(--ddd-spacing-2, 8px) 0 0;
    border-radius: var(--ddd-radius-circle, 100%);
    border-width: var(--ddd-border-size-sm, 2px);
    border-style: solid;
    border-color: var(--map-menu-progress-empty);
    align-self: center;
    line-height: 1;
    font-size: 11px;
    font-weight: var(--ddd-font-weight-bold, 700);
  }
  .progress-mark[data-progress="done"] {
    border-color: var(--map-menu-progress-done);
    color: var(--map-menu-progress-done);
  }
  .progress-mark[data-progress="in-progress"] {
    border-color: var(--map-menu-progress-partial);
    background: linear-gradient(
      90deg,
      var(--map-menu-progress-partial) 50%,
      transparent 50%
    );
  }
  .progress-mark[data-progress="visited"] {
    border-color: var(--map-menu-progress-visited);
  }
  .progress-mark[data-progress="visited"]::after {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: var(--ddd-radius-circle, 100%);
    background-color: var(--map-menu-progress-visited);
  }
  .progress-mark simple-icon-lite {
    --simple-icon-height: 12px;
    --simple-icon-width: 12px;
    margin: 0;
  }
  .progress-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  @media (forced-colors: active) {
    .progress-mark,
    .progress-mark[data-progress] {
      border-color: CanvasText;
      color: CanvasText;
    }
    .progress-mark[data-progress="in-progress"] {
      background: linear-gradient(90deg, CanvasText 50%, transparent 50%);
    }
    .progress-mark[data-progress="visited"]::after {
      background-color: CanvasText;
    }
  }
`;

export function hasProgressMark(progress) {
  return MAP_MENU_PROGRESS_STATES.includes(progress);
}

export function renderProgressMark(progress) {
  if (!hasProgressMark(progress)) {
    return "";
  }
  const icon =
    progress === "done"
      ? html`<simple-icon-lite icon="icons:check"></simple-icon-lite>`
      : "";
  return html`<span
    class="progress-mark"
    part="progress-mark"
    data-progress="${progress}"
    aria-hidden="true"
    >${icon}</span
  >`;
}

// spoken after the title, ", Done"; nothing for pages not started
export function renderProgressLabel(progress, t) {
  const words = {
    done: t.progressDone,
    "in-progress": t.progressInProgress,
    visited: t.progressVisited,
  };
  return words[progress]
    ? html`<span class="progress-sr">, ${words[progress]}</span>`
    : "";
}
