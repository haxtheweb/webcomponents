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
 * Design system bridges: every colour is a named DDD token or a mix of one,
 * so a bridge (PatternFly, Carbon, ...) restyles the table without touching
 * it. The header and stripe tints are mixed from the text token rather than
 * a named tint, because bridges map the named tints to values that either
 * vanish on their page (slateMaxLight) or turn into vivid brand colours that
 * text can't sit on (nittanyNavy). Mixed from text, they show at the same
 * strength under every system.
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
 *   --ddd-table-cell-padding-inline-condensed, --ddd-table-header-rule (line
 *   under the header row), --ddd-table-strong-rule (line above the footer),
 *   --ddd-table-grid (bordered grid lines), --ddd-table-edge-padding (inline
 *   padding of the first and last cell when the table is not bordered; a
 *   block sets it to --ddd-surface-padding so cells line up with its header)
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
    line-height: var(--ddd-lh-150);
    color: var(--ddd-table-color, currentColor);
    background-color: var(--ddd-table-background, transparent);
  }
  /* the DDD reset sizes table parts with the body font size; the table
     sets its own size, so the parts inherit it */
  .ddd-table thead,
  .ddd-table tbody,
  .ddd-table tfoot,
  .ddd-table tr {
    border: 0 none;
    background-color: transparent;
    font-size: inherit;
    font-family: inherit;
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
        color-mix(in srgb, var(--ddd-theme-default-coalyGray) 6%, transparent),
        var(--ddd-theme-default-slateGray)
      )
    );
    border-bottom: 2px solid
      var(
        --ddd-table-header-rule,
        light-dark(
          var(--ddd-theme-default-limestoneGray),
          var(--ddd-theme-default-slateGray)
        )
      );
  }
  .ddd-table tbody th,
  .ddd-table tfoot th {
    font-weight: var(--ddd-font-weight-bold, 700);
    color: var(--ddd-table-row-header-color, inherit);
  }
  /* a column of row headers gets a stronger divider than the rows */
  .ddd-table tbody tr > th:first-child,
  .ddd-table tfoot tr > th:first-child {
    border-inline-end: 2px solid
      var(
        --ddd-table-divider,
        light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        )
      );
  }
  /* edge padding: the first and last cell line up with whatever frames the
     table (a block header uses --ddd-surface-padding) */
  .ddd-table:not(.bordered):not([bordered]) tr > :first-child {
    padding-inline-start: var(
      --ddd-table-edge-padding,
      var(--ddd-table-cell-padding-inline, var(--ddd-spacing-3))
    );
  }
  .ddd-table:not(.bordered):not([bordered]) tr > :last-child {
    padding-inline-end: var(
      --ddd-table-edge-padding,
      var(--ddd-table-cell-padding-inline, var(--ddd-spacing-3))
    );
  }
  .ddd-table.condensed:not(.bordered):not([bordered]) tr > :first-child,
  .ddd-table[condensed]:not(.bordered):not([bordered]) tr > :first-child {
    padding-inline-start: var(
      --ddd-table-edge-padding,
      var(--ddd-table-cell-padding-inline-condensed, var(--ddd-spacing-2))
    );
  }
  .ddd-table.condensed:not(.bordered):not([bordered]) tr > :last-child,
  .ddd-table[condensed]:not(.bordered):not([bordered]) tr > :last-child {
    padding-inline-end: var(
      --ddd-table-edge-padding,
      var(--ddd-table-cell-padding-inline-condensed, var(--ddd-spacing-2))
    );
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
      var(--ddd-table-strong-rule, var(--ddd-theme-default-limestoneGray));
  }
  .ddd-table .num,
  .ddd-table [data-numeric] {
    text-align: end;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
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
        color-mix(in srgb, var(--ddd-theme-default-coalyGray) 4%, transparent),
        color-mix(
          in srgb,
          var(--ddd-theme-default-limestoneLight) 8%,
          transparent
        )
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
        color-mix(in srgb, var(--ddd-theme-default-coalyGray) 4%, transparent),
        color-mix(
          in srgb,
          var(--ddd-theme-default-limestoneLight) 8%,
          transparent
        )
      )
    );
  }

  /* bordered: a full grid, one step stronger than the row dividers so it
     shows in light mode */
  .ddd-table.bordered,
  .ddd-table[bordered],
  .ddd-table.bordered th,
  .ddd-table.bordered td,
  .ddd-table[bordered] th,
  .ddd-table[bordered] td {
    border: 1px solid
      var(
        --ddd-table-grid,
        var(
          --ddd-table-divider,
          light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          )
        )
      );
  }
  .ddd-table.bordered thead th,
  .ddd-table[bordered] thead th {
    border-bottom-width: 2px;
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

  /* rule and grid colours: the DDD reset forces border-color: inherit
     !important on table parts inside DDDSuper shadow roots, which would
     flatten every line to the divider colour, so these lines say their
     colour with !important as well */
  .ddd-table thead th,
  .ddd-table thead td {
    border-bottom-color: var(
      --ddd-table-header-rule,
      light-dark(
        var(--ddd-theme-default-limestoneGray),
        var(--ddd-theme-default-slateGray)
      )
    ) !important;
  }
  .ddd-table tfoot th,
  .ddd-table tfoot td {
    border-top-color: var(
      --ddd-table-strong-rule,
      var(--ddd-theme-default-limestoneGray)
    ) !important;
  }
  .ddd-table.bordered th,
  .ddd-table.bordered td,
  .ddd-table[bordered] th,
  .ddd-table[bordered] td {
    border-color: var(
      --ddd-table-grid,
      var(
        --ddd-table-divider,
        light-dark(
          var(--ddd-theme-default-limestoneGray),
          var(--ddd-theme-default-slateGray)
        )
      )
    ) !important;
  }
  .ddd-table.bordered thead th,
  .ddd-table[bordered] thead th {
    border-bottom-color: var(
      --ddd-table-header-rule,
      var(--ddd-theme-default-limestoneGray)
    ) !important;
  }
  .ddd-table.bordered tfoot th,
  .ddd-table.bordered tfoot td,
  .ddd-table[bordered] tfoot th,
  .ddd-table[bordered] tfoot td {
    border-top-color: var(
      --ddd-table-strong-rule,
      var(--ddd-theme-default-limestoneGray)
    ) !important;
  }
`;
