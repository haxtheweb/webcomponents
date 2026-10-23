/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";

/**
 * Presentation shared by the concept games: the frame, top bar, dialog, finish
 * panel, prompt box and the color tokens used for tiles and pips.
 */
export const gameChromeStyles = css`
  :host {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    padding: 0 var(--ddd-spacing-2) var(--ddd-spacing-2) 0;
    --cmg-c0: light-dark(
      var(--ddd-theme-default-beaverBlue),
      var(--ddd-theme-default-pughBlue)
    );
    --cmg-c1: light-dark(
      var(--ddd-theme-default-forestGreen),
      var(--ddd-theme-default-futureLime)
    );
    --cmg-c2: light-dark(
      var(--ddd-theme-default-wonderPurple),
      var(--ddd-theme-default-athertonViolet)
    );
    --cmg-c3: light-dark(
      var(--ddd-theme-default-original87Pink),
      var(--ddd-theme-default-discoveryCoral)
    );
    --cmg-c4: light-dark(
      var(--ddd-theme-default-landgrantBrown),
      var(--ddd-theme-default-roarGolden)
    );
    --cmg-c5: light-dark(
      color-mix(in srgb, var(--ddd-theme-default-creekTeal) 65%, black),
      var(--ddd-theme-default-creekTeal)
    );
    --cmg-c6: light-dark(
      color-mix(in srgb, var(--ddd-theme-default-inventOrange) 70%, black),
      var(--ddd-theme-default-inventOrange)
    );
    --cmg-on: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-potentialMidnight)
    );
    --cmg-grid: light-dark(
      var(--ddd-theme-default-limestoneLight),
      color-mix(in srgb, var(--ddd-theme-default-nittanyNavy) 80%, white)
    );
    --cmg-track: light-dark(
      var(--ddd-theme-default-limestoneLight),
      color-mix(in srgb, var(--ddd-theme-default-nittanyNavy) 70%, white)
    );
    --cmg-gold: var(--ddd-theme-default-keystoneYellow);
    --cmg-on-gold: var(--ddd-theme-default-nittanyNavy);
  }

  .frame {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    border: var(--ddd-border-md);
    border-color: var(--micro-game-ink);
    background: var(--micro-game-panel);
    box-shadow: var(--ddd-spacing-2) var(--ddd-spacing-2) 0
      var(--micro-game-shadow);
  }

  .bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
    padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
    border-bottom: var(--ddd-border-md);
    border-color: var(--micro-game-ink);
  }

  .text,
  .fin-sum,
  .fallback dd {
    text-align: left;
  }

  .fallback {
    max-width: none;
  }

  .btn.small {
    min-height: 36px;
    padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
  }

  .code,
  .fallback {
    -webkit-user-select: text;
    user-select: text;
  }

  .more {
    color: var(--micro-game-accent);
    font-weight: var(--ddd-font-weight-bold);
  }

  .more:focus-visible {
    outline: var(--ddd-border-md);
    outline-color: var(--micro-game-ink);
    outline-offset: 2px;
  }

  .finish:focus {
    outline: none;
  }

  .finish:focus-visible {
    outline: var(--ddd-border-md);
    outline-color: var(--micro-game-accent);
    outline-offset: -6px;
  }

  .count {
    font-family: var(--ddd-font-navigation);
    font-size: calc(var(--ddd-font-size-4xs) * 0.875);
    font-weight: var(--ddd-font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .hint {
    margin-left: auto;
    font-size: calc(var(--ddd-font-size-4xs) * 0.875);
    color: var(--micro-game-soft);
  }

  .dialog {
    position: relative;
    min-height: 9.5rem;
    padding: var(--ddd-spacing-3) var(--ddd-spacing-4) var(--ddd-spacing-4);
    border-top: var(--ddd-border-md);
    border-color: var(--micro-game-ink);
  }

  @container (max-width: 600px) {
    .dialog {
      min-height: 12.5rem;
    }
  }

  .tag {
    display: inline-block;
    padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    background: var(--nc, var(--micro-game-accent));
    color: var(--tc, var(--micro-game-on-accent));
    font-family: var(--ddd-font-navigation);
    font-size: calc(var(--ddd-font-size-4xs) * 0.85);
    font-weight: var(--ddd-font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .text {
    margin: var(--ddd-spacing-3) 0 0;
    max-width: 62ch;
    font-size: var(--ddd-font-size-4xs);
    line-height: 1.55;
  }

  .fallback {
    padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
    border-top: var(--ddd-border-md);
    border-color: var(--micro-game-ink);
  }

  .fallback summary {
    min-height: 28px;
    cursor: pointer;
    font-weight: var(--ddd-font-weight-bold);
  }

  .fallback summary:focus-visible {
    outline: var(--ddd-border-md);
    outline-color: var(--micro-game-accent);
    outline-offset: 3px;
  }

  .fallback dl {
    max-width: 64ch;
    margin: var(--ddd-spacing-3) 0 0;
  }

  .fallback dt {
    font-weight: var(--ddd-font-weight-bold);
  }

  .fallback dd {
    margin: 0 0 var(--ddd-spacing-3);
    color: var(--micro-game-soft);
  }

  .finish {
    display: grid;
    gap: var(--ddd-spacing-3);
    padding: var(--ddd-spacing-4);
    border-top: var(--ddd-border-md);
    border-color: var(--micro-game-ink);
    background: var(--micro-game-paper);
  }

  .finish p {
    margin: 0;
  }

  .fin-tag {
    max-width: 100%;
    overflow-wrap: anywhere;
    justify-self: start;
    padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    border: var(--ddd-border-md);
    border-color: var(--micro-game-ink);
    background: var(--cmg-gold);
    color: var(--cmg-on-gold);
    font-family: var(--ddd-font-navigation);
    font-weight: var(--ddd-font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .fin-sum {
    max-width: 64ch;
    font-size: var(--ddd-font-size-4xs);
  }

  .fin-stats {
    color: var(--micro-game-soft);
    font-size: calc(var(--ddd-font-size-4xs) * 0.875);
  }

  .fin-lead {
    font-weight: var(--ddd-font-weight-bold);
  }

  .code {
    min-width: 0;
    overflow-x: auto;
    border: var(--ddd-border-md);
    border-color: var(--micro-game-ink);
    background: var(--ddd-theme-default-nittanyNavy);
  }

  pre {
    margin: 0;
    padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
    color: var(--ddd-theme-default-limestoneMaxLight);
    font-family: ui-monospace, monospace;
    font-size: calc(var(--ddd-font-size-4xs) * 0.85);
    line-height: 1.6;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ddd-spacing-3);
  }

  .status {
    min-height: 1.5em;
    color: var(--micro-game-soft);
    font-size: calc(var(--ddd-font-size-4xs) * 0.875);
  }
  .recap {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--ddd-spacing-4);
  }
  .rc-h {
    margin: 0 0 var(--ddd-spacing-2);
    font-family: var(--ddd-font-navigation);
    font-weight: var(--ddd-font-weight-bold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .rc-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: var(--ddd-spacing-2);
  }
  .rc-list li {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px var(--ddd-spacing-2);
    padding: var(--ddd-spacing-2);
    border: var(--ddd-border-sm);
    border-color: var(--micro-game-ink);
    border-left-width: 6px;
  }
  .rc-list li.ok {
    border-left-color: var(--cmg-c1);
  }
  .rc-list li.bad {
    border-left-color: var(--cmg-c3);
  }
  .rc-label {
    font-weight: var(--ddd-font-weight-bold);
  }
  .rc-state {
    color: var(--micro-game-soft);
    font-size: calc(var(--ddd-font-size-4xs) * 0.9);
  }
  .rc-text {
    grid-column: 1 / -1;
    color: var(--micro-game-soft);
    font-size: calc(var(--ddd-font-size-4xs) * 0.95);
  }
`;
