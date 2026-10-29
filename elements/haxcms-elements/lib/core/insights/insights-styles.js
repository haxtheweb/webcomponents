/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Shared styles for the Reports (Insights) container and its section
 * screens, on the HAX UI admin layer (HaxUiAdminTokens / Primitives).
 * Sections import InsightsStyles so tiles, tables, pills and lists look the
 * same on every tab. See haxtheweb/issues#3180.
 */
import { css } from "lit";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";

export const InsightsStyles = [
  ...HaxUiAdminTokens,
  ...HaxUiAdminPrimitives,
  css`
    :host {
      display: block;
      font-family: var(--hax-ui-admin-font-family);
      font-size: var(--hax-ui-admin-font-size);
      color: var(--hax-ui-text);
      /* proposed tokens, written as DDD values until adopted:
         --hax-ui-warning(-soft) sits between danger and accent */
      --insights-warning: light-dark(#8a5300, #ffcf80);
      --insights-warning-soft: light-dark(
        var(--ddd-theme-default-warningLight, #fff4e5),
        rgba(255, 174, 0, 0.14)
      );
      --insights-row: var(--hax-ui-row-height);
      --insights-gap: var(--hax-ui-gap-lg);
    }
    :host([density="compact"]) {
      --insights-row: var(--hax-ui-row-height-compact);
      --insights-gap: var(--hax-ui-gap-md);
    }
    :host([density="roomy"]) {
      --insights-row: var(--hax-ui-row-height-roomy);
      --insights-gap: var(--ddd-spacing-4, 16px);
    }
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    button,
    input,
    select {
      font-family: inherit;
      font-size: inherit;
      color: inherit;
    }
    button:focus-visible,
    a:focus-visible,
    input:focus-visible,
    select:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: 2px;
    }
    a {
      color: var(--hax-ui-accent);
    }
    .num,
    td.num,
    th.num {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    /* section layout */
    .sec {
      display: flex;
      flex-direction: column;
      gap: var(--ddd-spacing-5, 20px);
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--ddd-spacing-5, 20px);
    }
    @media (max-width: 900px) {
      .grid-2 {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    h3.block {
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      margin: 0 0 var(--hax-ui-gap-md);
      font-size: var(--hax-ui-admin-font-size);
      font-weight: var(--ddd-font-weight-bold, 700);
    }
    h3.block .hint {
      font-weight: var(--ddd-font-weight-regular, 400);
      color: var(--hax-ui-text-muted);
      font-size: var(--hax-ui-admin-font-size-xs);
    }
    p.help {
      margin: 0 0 var(--hax-ui-gap-md);
      color: var(--hax-ui-text-muted);
      font-size: var(--hax-ui-admin-font-size-xs);
    }

    /* KPI tiles: a row of numbers that matter on this tab */
    .kpis {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: var(--hax-ui-gap-lg);
    }
    .kpi {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: var(--hax-ui-gap-lg);
      border: 1px solid var(--hax-ui-line);
      border-radius: var(--hax-ui-radius-lg);
      min-width: 0;
    }
    .kpi .v {
      font-size: 22px;
      font-weight: var(--ddd-font-weight-bold, 700);
      font-variant-numeric: tabular-nums;
      line-height: 1.2;
    }
    .kpi .l {
      font-size: var(--hax-ui-admin-font-size-xs);
      color: var(--hax-ui-text-muted);
    }
    .kpi[data-tone="danger"] .v {
      color: var(--hax-ui-danger);
    }
    .kpi[data-tone="warning"] .v {
      color: var(--insights-warning);
    }
    .kpi[data-tone="soon"] {
      border-style: dashed;
    }
    .kpi[data-tone="soon"] .v {
      color: var(--hax-ui-text-muted);
    }

    /* tables */
    .tbl-wrap {
      overflow-x: auto;
      border: 1px solid var(--hax-ui-line);
      border-radius: var(--hax-ui-radius);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--hax-ui-admin-font-size-xs);
    }
    th {
      position: sticky;
      top: 0;
      z-index: 1;
      text-align: left;
      font-weight: var(--ddd-font-weight-bold, 700);
      color: var(--hax-ui-text-muted);
      padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
      background-color: var(--hax-ui-surface);
      border-bottom: 1px solid var(--hax-ui-line-strong);
      white-space: nowrap;
    }
    td {
      height: var(--insights-row);
      padding: 0 var(--hax-ui-gap-md);
      border-bottom: 1px solid var(--hax-ui-line);
      vertical-align: middle;
    }
    tbody tr:hover {
      background-color: var(--hax-ui-hover);
    }
    tbody tr:last-child td {
      border-bottom: 0;
    }

    /* finding lists: one row per issue, severity first */
    .findings {
      list-style: none;
      margin: 0;
      padding: 0;
      border: 1px solid var(--hax-ui-line);
      border-radius: var(--hax-ui-radius);
    }
    .findings li {
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      min-height: var(--insights-row);
      padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
      border-bottom: 1px solid var(--hax-ui-line);
    }
    .findings li:last-child {
      border-bottom: 0;
    }
    .findings .t {
      flex: 1;
      min-width: 0;
    }
    .findings .d {
      display: block;
      color: var(--hax-ui-text-muted);
      font-size: var(--hax-ui-admin-font-size-xs);
    }

    /* pills: hax-ui-pill tones plus warning and soon */
    .hax-ui-pill[data-tone="warning"] {
      color: var(--insights-warning);
      background-color: var(--insights-warning-soft);
    }
    .hax-ui-pill[data-tone="soon"] {
      color: var(--hax-ui-text-muted);
      background-color: transparent;
      box-shadow: inset 0 0 0 1px var(--hax-ui-line-strong);
    }

    /* horizontal bars for distributions */
    .bars {
      display: flex;
      flex-direction: column;
      gap: var(--hax-ui-gap);
    }
    .bar {
      display: grid;
      grid-template-columns: minmax(80px, 30%) 1fr 48px;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      font-size: var(--hax-ui-admin-font-size-xs);
    }
    .bar .track {
      height: 10px;
      border-radius: 5px;
      background-color: var(--hax-ui-hover);
      overflow: hidden;
    }
    .bar .fill {
      height: 100%;
      background-color: var(--hax-ui-accent);
    }
    .bar .fill[data-tone="danger"] {
      background-color: var(--hax-ui-danger);
    }
    .bar .fill[data-tone="warning"] {
      background-color: var(--insights-warning);
    }

    /* small buttons inside screens (Open page, Coming soon controls) */
    .sbtn {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--hax-ui-gap);
      height: calc(var(--insights-row) - 6px);
      padding: 0 var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      font-size: var(--hax-ui-admin-font-size-xs);
      white-space: nowrap;
    }
    .sbtn:hover {
      background-color: var(--hax-ui-hover);
    }
    .sbtn[disabled],
    .sbtn[aria-disabled="true"] {
      cursor: default;
      color: var(--hax-ui-text-muted);
      border-style: dashed;
      background-color: transparent;
    }
    .soon-panel {
      padding: var(--hax-ui-gap-lg);
      border: 1px dashed var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      color: var(--hax-ui-text-muted);
      font-size: var(--hax-ui-admin-font-size-xs);
    }
    .empty {
      padding: var(--ddd-spacing-4, 16px);
      text-align: center;
      color: var(--hax-ui-text-muted);
      border: 1px dashed var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `,
];
