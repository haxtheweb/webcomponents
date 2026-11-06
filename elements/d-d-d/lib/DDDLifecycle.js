/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD lifecycle status: where a project, element or feature is in its life
 * (released, pre-release, planned, legacy), as tokens and a small pill.
 *
 * Like the answer states in DDDStatusTokens.js, each lifecycle state names a
 * signal colour (the border), an ink colour (the word), a background and a
 * line style, and the pill always shows the word. So the states read apart
 * by line and word as well as colour, in greyscale and for readers with
 * colour blindness:
 *
 *   released     solid border    shipped and supported
 *   pre-release  dashed border   usable, still changing (alpha, beta, rc)
 *   planned      dotted border   not built yet
 *   legacy       double border   still works, not where new work goes
 *
 * Standalone on purpose, like DDDBlock.js and DDDChart.js: it adds no
 * exports to d-d-d.js or DDDStyles.js. Import it directly:
 *
 *   import {
 *     DDDLifecycleStyles,
 *     renderDDDStatusPill,
 *   } from "@haxtheweb/d-d-d/lib/DDDLifecycle.js";
 *   static get styles() { return [super.styles, DDDLifecycleStyles]; }
 *
 *   html`${renderDDDStatusPill({ state: "pre-release", label: this.t.beta })}`
 *   or by hand:
 *   html`<span class="ddd-status-pill" data-lifecycle="planned">Planned</span>`
 *
 * Tokens, for each state in DDDLifecycleStates:
 *   --ddd-lifecycle-{state}-signal  border colour (3:1 non-text contrast)
 *   --ddd-lifecycle-{state}-ink     word colour (4.5:1 text contrast)
 *   --ddd-lifecycle-{state}-bg      pill background
 *   --ddd-lifecycle-{state}-line    border style
 * Usage outside the pill:
 *   border: 2px var(--ddd-lifecycle-legacy-line)
 *     var(--ddd-lifecycle-legacy-signal);
 *
 * Pass a translated label: the default words are English and only there so
 * a pill is never empty.
 */
import { html, css, unsafeCSS } from "lit";

export const DDDLifecycleStates = [
  "released",
  "pre-release",
  "planned",
  "legacy",
];

const DEFAULT_WORDS = {
  released: "Released",
  "pre-release": "Pre-release",
  planned: "Planned",
  legacy: "Legacy",
};

export const DDDLifecycleTokens = css`
  :root,
  :host {
    --ddd-lifecycle-released-signal: light-dark(
      var(--ddd-theme-default-opportunityGreen),
      var(--ddd-theme-default-futureLime)
    );
    --ddd-lifecycle-released-ink: light-dark(
      var(--ddd-theme-default-success),
      var(--ddd-theme-default-futureLime)
    );
    --ddd-lifecycle-released-bg: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    --ddd-lifecycle-released-line: solid;
    --ddd-lifecycle-pre-release-signal: light-dark(
      var(--ddd-theme-default-link),
      var(--ddd-theme-default-skyBlue)
    );
    --ddd-lifecycle-pre-release-ink: light-dark(
      var(--ddd-theme-default-link),
      var(--ddd-theme-default-linkLight)
    );
    --ddd-lifecycle-pre-release-bg: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    --ddd-lifecycle-pre-release-line: dashed;
    --ddd-lifecycle-planned-signal: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneGray)
    );
    --ddd-lifecycle-planned-ink: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneLight)
    );
    --ddd-lifecycle-planned-bg: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    --ddd-lifecycle-planned-line: dotted;
    --ddd-lifecycle-legacy-signal: light-dark(
      var(--ddd-theme-default-roarGolden),
      var(--ddd-theme-default-inventOrange)
    );
    --ddd-lifecycle-legacy-ink: light-dark(
      var(--ddd-theme-default-warning),
      var(--ddd-theme-default-roarLight)
    );
    --ddd-lifecycle-legacy-bg: light-dark(
      var(--ddd-theme-default-roarMaxlight),
      var(--ddd-theme-default-coalyGray)
    );
    --ddd-lifecycle-legacy-line: double;
  }
`;

const pillStates = DDDLifecycleStates.map(
  (s) => `.ddd-status-pill[data-lifecycle="${s}"] {
    --ddd-status-pill-signal: var(--ddd-lifecycle-${s}-signal);
    --ddd-status-pill-ink: var(--ddd-lifecycle-${s}-ink);
    --ddd-status-pill-bg: var(--ddd-lifecycle-${s}-bg);
    --ddd-status-pill-line: var(--ddd-lifecycle-${s}-line);
  }`,
).join("\n  ");

export const DDDLifecycleStyles = [
  DDDLifecycleTokens,
  css`
    .ddd-status-pill {
      --ddd-status-pill-signal: var(--ddd-lifecycle-planned-signal);
      --ddd-status-pill-ink: var(--ddd-lifecycle-planned-ink);
      --ddd-status-pill-bg: var(--ddd-lifecycle-planned-bg);
      --ddd-status-pill-line: var(--ddd-lifecycle-planned-line);
      display: inline-flex;
      align-items: center;
      gap: var(--ddd-spacing-1);
      box-sizing: border-box;
      min-height: var(--ddd-icon-xxs);
      padding-block: var(--ddd-spacing-0);
      padding-inline: var(--ddd-spacing-2);
      border-width: var(--ddd-border-size-md);
      border-style: var(--ddd-status-pill-line);
      border-color: var(--ddd-status-pill-signal);
      border-radius: var(--ddd-radius-rounded);
      background-color: var(--ddd-status-pill-bg);
      color: var(--ddd-status-pill-ink);
      font-family: var(--ddd-font-navigation);
      font-size: var(--ddd-font-size-6xs);
      font-weight: var(--ddd-font-weight-bold);
      line-height: var(--ddd-lh-120);
      white-space: nowrap;
      vertical-align: middle;
      --simple-icon-color: currentColor;
      --simple-icon-width: var(--ddd-icon-4xs);
      --simple-icon-height: var(--ddd-icon-4xs);
    }
    ${unsafeCSS(pillStates)}
  `,
];

/**
 * Render a lifecycle pill. Unknown states render as planned (the most
 * cautious reading). The label is always shown.
 * @param {Object} o
 * @param {String} o.state one of DDDLifecycleStates
 * @param {*} [o.label] the word to show, translated; defaults to English
 * @returns {TemplateResult}
 */
export function renderDDDStatusPill(o) {
  const opts = o || {};
  const state = DDDLifecycleStates.includes(opts.state)
    ? opts.state
    : "planned";
  return html`<span class="ddd-status-pill" data-lifecycle="${state}"
    >${opts.label ? opts.label : DEFAULT_WORDS[state]}</span
  >`;
}
