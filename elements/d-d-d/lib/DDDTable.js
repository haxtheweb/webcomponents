/**
 * Copyright 2026 The Pennsylvania State University
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD data table: one table look every element in HAX can share
 * (editable-table, lrndesign-chart and anything that shows rows of data),
 * so a table reads the same wherever it shows up, in light and dark mode.
 *
 * The look: DDD primary font, a tinted header row with bold navy (light) or
 * white (dark) text, thin row dividers instead of a full grid, DDD spacing
 * for cell padding and numbers right-aligned with tabular digits so columns
 * of figures line up.
 *
 * Standalone on purpose, like DDDBlock.js, DDDChart.js and DDDAccent.js: it
 * adds no exports to d-d-d.js or DDDStyles.js. Import it directly:
 *
 *   import { DDDTableStyles } from "@haxtheweb/d-d-d/lib/DDDTable.js";
 *   static get styles() { return [super.styles, DDDTableStyles, css`...`]; }
 *
 *   html`<table class="ddd-table striped">...</table>`
 *
 * Class (or attribute) modifiers on the table:
 *   striped / [striped]               zebra rows
 *   column-striped / [column-striped] zebra columns
 *   bordered / [bordered]             full cell borders (a grid)
 *   condensed / [condensed]           smaller cell padding
 * Cells: .num or [data-numeric] right-aligns with tabular digits. A header
 * button with .ddd-table-sort gets the subtle DDD icon button look and a
 * focus ring.
 *
 * Custom properties (all optional, DDD defaults otherwise):
 *   --ddd-table-color, --ddd-table-background, --ddd-table-font-family,
 *   --ddd-table-font-size, --ddd-table-divider (row dividers and borders),
 *   --ddd-table-header-background, --ddd-table-header-color,
 *   --ddd-table-row-header-color, --ddd-table-stripe-background,
 *   --ddd-table-caption-color, --ddd-table-cell-padding-block,
 *   --ddd-table-cell-padding-inline, --ddd-table-cell-padding-block-condensed,
 *   --ddd-table-cell-padding-inline-condensed
 */
import { css } from "lit";

export const DDDTableStyles = css`
  .ddd-table {
    width: 100%;
    border-collapse: collapse;
    border: 0 none;
    border-color: var(
      --ddd-table-divider,
      light-dark(
        var(--ddd-theme-default-limestoneLight),
        var(--ddd-theme-default-slateGray)
      )
    );
    font-family: var(--ddd-table-font-family, var(--ddd-font-primary));
    font-size: var(--ddd-table-font-size, var(--ddd-font-size-4xs));
    font-weight: var(--ddd-font-weight-regular, 400);
    line-height: var(--ddd-lh-140);
    color: var(--ddd-table-color, currentColor);
    background-color: var(--ddd-table-background, transparent);
  }
  .ddd-table thead,
  .ddd-table tbody,
  .ddd-table tfoot,
  .ddd-table tr {
    border: 0 none;
    background-color: transparent;
  }
  .ddd-table th,
  .ddd-table td {
    padding: var(--ddd-table-cell-padding-block, var(--ddd-spacing-2))
      var(--ddd-table-cell-padding-inline, var(--ddd-spacing-3));
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    font-weight: inherit;
    color: inherit;
    text-align: start;
    vertical-align: top;
    background-color: transparent;
    border: 0 none;
    border-bottom: 1px solid
      var(
        --ddd-table-divider,
        light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        )
      );
  }
  .ddd-table thead th,
  .ddd-table thead td {
    vertical-align: bottom;
    font-weight: var(--ddd-font-weight-bold, 700);
    color: var(
      --ddd-table-header-color,
      light-dark(
        var(--ddd-theme-default-nittanyNavy),
        var(--ddd-theme-default-white)
      )
    );
    background-color: var(
      --ddd-table-header-background,
      light-dark(
        var(--ddd-theme-default-limestoneMaxLight),
        var(--ddd-theme-default-coalyGray)
      )
    );
  }
  .ddd-table tbody th,
  .ddd-table tfoot th {
    font-weight: var(--ddd-font-weight-bold, 700);
    color: var(--ddd-table-row-header-color, inherit);
  }
  .ddd-table tbody tr:last-child > th,
  .ddd-table tbody tr:last-child > td {
    border-bottom: 0 none;
  }
  .ddd-table tfoot th,
  .ddd-table tfoot td {
    font-weight: var(--ddd-font-weight-bold, 700);
    border-bottom: 0 none;
    border-top: 2px solid
      var(
        --ddd-table-divider,
        light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        )
      );
  }
  .ddd-table .num,
  .ddd-table [data-numeric] {
    text-align: end;
    font-variant-numeric: tabular-nums;
  }
  .ddd-table caption {
    caption-side: top;
    text-align: start;
    padding: 0 0 var(--ddd-spacing-2);
    font-weight: var(--ddd-font-weight-bold, 700);
    color: var(--ddd-table-caption-color, inherit);
  }

  /* striped: zebra rows (every second body row, so the first row never
     runs into the tinted header) */
  .ddd-table.striped tbody tr:nth-child(even) > *,
  .ddd-table[striped] tbody tr:nth-child(even) > * {
    background-color: var(
      --ddd-table-stripe-background,
      light-dark(
        var(--ddd-theme-default-slateMaxLight),
        var(--ddd-theme-default-nittanyNavy)
      )
    );
  }
  .ddd-table.column-striped tbody tr > :nth-child(even),
  .ddd-table.column-striped tfoot tr > :nth-child(even),
  .ddd-table[column-striped] tbody tr > :nth-child(even),
  .ddd-table[column-striped] tfoot tr > :nth-child(even) {
    background-color: var(
      --ddd-table-stripe-background,
      light-dark(
        var(--ddd-theme-default-slateMaxLight),
        var(--ddd-theme-default-nittanyNavy)
      )
    );
  }

  /* bordered: a full grid in the divider colour */
  .ddd-table.bordered,
  .ddd-table[bordered],
  .ddd-table.bordered th,
  .ddd-table.bordered td,
  .ddd-table[bordered] th,
  .ddd-table[bordered] td {
    border: 1px solid
      var(
        --ddd-table-divider,
        light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        )
      );
  }

  /* condensed: tighter rows */
  .ddd-table.condensed th,
  .ddd-table.condensed td,
  .ddd-table[condensed] th,
  .ddd-table[condensed] td {
    padding: var(--ddd-table-cell-padding-block-condensed, var(--ddd-spacing-1))
      var(--ddd-table-cell-padding-inline-condensed, var(--ddd-spacing-2));
  }

  /* sortable header buttons: a subtle icon button, not a box */
  .ddd-table .ddd-table-sort {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: var(--ddd-spacing-1);
    border: 0 none;
    border-radius: var(--ddd-radius-xs);
    background-color: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .ddd-table .ddd-table-sort:hover {
    background-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
  }
  .ddd-table .ddd-table-sort:focus-visible,
  .ddd-table th button:focus-visible,
  .ddd-table th a:focus-visible {
    outline: var(--ddd-focus-ring, 2px solid currentColor);
    outline-offset: var(--ddd-focus-offset, 2px);
  }
`;
