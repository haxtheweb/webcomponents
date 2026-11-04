import { html, css } from "lit";

/**
 * Quiet count of trackable elements (questions, media, checklists, games:
 * the elements that can send learner statements) for a menu item, for
 * authors in edit mode. `trackable` is a count as a string: "" (the
 * default) draws nothing, "0" draws a dash, anything else the number. Grey
 * text only, no colour or icon; the count is also spoken after the title.
 * site-menu fills it from the Learning activity scan while HAX edit mode is
 * on, so learners never see it.
 */
export const MapMenuTrackableStrings = {
  trackableCount: "{count} trackable",
  trackableNone: "nothing trackable",
};

export const mapMenuTrackableStyles = css`
  .trackable-count {
    flex: none;
    align-self: center;
    margin-inline: auto var(--ddd-spacing-2, 8px);
    padding-inline-start: var(--ddd-spacing-2, 8px);
    font-family: var(--ddd-font-navigation, sans-serif);
    font-size: var(--map-menu-trackable-font-size, 12px);
    font-weight: var(--ddd-font-weight-regular, 400);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: var(
      --map-menu-trackable-color,
      light-dark(
        var(--ddd-theme-default-slateGray, #314d64),
        var(--ddd-theme-default-limestoneGray, #a2aaad)
      )
    );
  }
  .trackable-sr {
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
`;

function countOf(trackable) {
  if (trackable === "" || trackable === null || trackable === undefined) {
    return null;
  }
  const n = parseInt(trackable, 10);
  return Number.isNaN(n) || n < 0 ? null : n;
}

export function renderTrackableCount(trackable) {
  const n = countOf(trackable);
  if (n === null) {
    return "";
  }
  return html`<span
    class="trackable-count"
    part="trackable-count"
    aria-hidden="true"
    >${n === 0 ? "—" : String(n)}</span
  >`;
}

// spoken after the title (", 4 trackable"); nothing without a count
export function renderTrackableLabel(trackable, t) {
  const n = countOf(trackable);
  if (n === null) {
    return "";
  }
  const words =
    n === 0
      ? t.trackableNone
      : t.trackableCount.replace("{count}", () => String(n));
  return html`<span class="trackable-sr">, ${words}</span>`;
}
