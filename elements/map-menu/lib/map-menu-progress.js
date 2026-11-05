import { html, css } from "lit";

/**
 * Learner progress marks for menu items. `progress` is one of
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
};

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
