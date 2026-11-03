/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * HAX UI admin layer: the admin shell (rail, page header, action bar,
 * overflow menu, leave prompt).
 * Part of @haxtheweb/d-d-d/lib/HaxUiAdminStyles.js, which re-exports it
 * with the rest of the layer. Import this file directly when an element
 * needs only this piece, so a page does not download the whole layer.
 */
import { css } from "lit";

/**
 * The admin shell, as the HaxUiAdminShell and HaxUiAdminActionBar cards
 * describe it: the section rail (nested parts, badges, collapse to icons,
 * narrow overlay), page header, body, action bar with status and changed
 * dot, overflow menu for bulk actions, the leave prompt and group titles.
 * Taken from haxcms-site-admin, the reference; system settings shares it.
 *
 * Its class names (.section, .rail*, .main, .ph*, .body, .ftr, .st, .dot,
 * .more-*, .scrim, .leave, .group-title) are the shell's vocabulary, so it
 * is not part of HaxUiAdminStyles: only an element that draws the shell
 * spreads it, after HaxUiAdminStyles. Buttons are .hax-ui-btn.
 */
export const HaxUiAdminShell = [
  css`
    .group-title {
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-lg);
      margin: var(--ddd-spacing-6, 24px) 0 var(--hax-ui-gap-md);
      font-size: var(--hax-ui-admin-font-size-xs);
      font-weight: var(--ddd-font-weight-bold, 700);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--hax-ui-text-muted);
    }
    .group-title::after {
      content: "";
      flex: 1;
      border-top: 1px solid var(--hax-ui-line);
    }

    /* section layout */
    .section {
      display: flex;
      height: 100%;
      min-height: 0;
    }
    .section {
      position: relative;
    }
    .rail {
      width: var(--hax-ui-rail-width);
      flex: none;
      transition: width var(--hax-ui-duration) var(--hax-ui-easing);
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: var(--hax-ui-gap-md);
      overflow: auto;
      background-color: var(--hax-ui-sunken);
      border-right: 1px solid var(--hax-ui-line);
    }
    .rail ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .rail-help {
      margin-top: auto;
      padding-top: var(--hax-ui-gap-md);
      border-top: 1px solid var(--hax-ui-line);
    }
    .rail-label {
      padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-md) var(--hax-ui-gap);
      font-size: 11px;
      font-weight: var(--ddd-font-weight-bold, 700);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--hax-ui-text-muted);
    }
    .rail-item {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      width: 100%;
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius);
      color: var(--hax-ui-text);
    }
    .rail-item:hover {
      background-color: var(--hax-ui-hover);
    }
    .rail-item:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: calc(-1 * var(--hax-ui-focus-width));
    }
    .rail-row {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .rail-row .rail-item {
      flex: 1;
      min-width: 0;
    }
    .rail-toggle {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      flex: none;
      display: grid;
      place-items: center;
      width: 24px;
      height: var(--hax-ui-row-height);
      border-radius: var(--hax-ui-radius);
      color: var(--hax-ui-text-muted);
    }
    .rail-toggle:hover {
      background-color: var(--hax-ui-hover);
      color: var(--hax-ui-text);
    }
    .rail-toggle:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: calc(-1 * var(--hax-ui-focus-width));
    }
    .rail-toggle simple-icon-lite {
      transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
    }
    .rail-toggle[aria-expanded="true"] simple-icon-lite {
      transform: rotate(90deg);
    }
    /* parts sit one indent in, under a guide line from the section's
           icon with a tick into each part, like outline-designer's tree */
    .rail-sub {
      margin: 2px 0 var(--hax-ui-gap);
    }
    .rail-sub > li {
      position: relative;
      padding-left: var(--hax-ui-indent);
      margin-left: calc(var(--hax-ui-gap-md) + var(--hax-ui-icon) / 2);
    }
    .rail-sub > li::before,
    .rail-sub > li::after {
      content: "";
      position: absolute;
      left: 0;
      background-color: var(--hax-ui-line-strong);
    }
    .rail-sub > li::before {
      top: 0;
      bottom: 0;
      width: 1px;
    }
    .rail-sub > li:last-child::before {
      bottom: 50%;
    }
    .rail-sub > li::after {
      top: 50%;
      width: calc(var(--hax-ui-indent) - 6px);
      height: 1px;
    }
    .rail-item.sub {
      height: calc(var(--hax-ui-row-height) - 4px);
      padding: 0 var(--hax-ui-gap-md);
      font-size: var(--hax-ui-admin-font-size-xs);
    }
    .rail-item.sub simple-icon-lite {
      --simple-icon-width: 14px;
      --simple-icon-height: 14px;
      opacity: 0.8;
    }
    .rail-item.sub .label {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .rail-item[aria-current="true"] {
      font-weight: var(--ddd-font-weight-bold, 700);
    }
    .rail-item.sub[aria-current="location"] {
      font-weight: var(--ddd-font-weight-bold, 700);
      color: var(--hax-ui-text);
    }
    .rail-badge {
      flex: none;
      min-width: 20px;
      padding: 0 6px;
      border-radius: var(--hax-ui-radius-pill);
      font-size: 11px;
      font-weight: var(--ddd-font-weight-bold, 700);
      line-height: 1.6;
      text-align: center;
      font-variant-numeric: tabular-nums;
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-hover);
    }
    .rail-badge[data-tone="danger"] {
      color: var(--hax-ui-danger);
      background-color: var(--hax-ui-danger-soft);
    }
    .rail-badge[data-tone="warning"] {
      color: var(--hax-ui-warning);
      background-color: var(--hax-ui-warning-soft);
    }
    .rail-item[aria-current="page"] {
      font-weight: var(--ddd-font-weight-bold, 700);
      background-color: var(--hax-ui-selected);
      box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
    }
    .rail-collapse {
      margin-bottom: var(--hax-ui-gap);
      color: var(--hax-ui-text-muted);
    }
    .rail-collapse:hover {
      color: var(--hax-ui-text);
    }
    .rail-collapse .label {
      font-size: var(--hax-ui-admin-font-size-xs);
    }

    /* collapsed: icons only, each named in a tooltip */
    .rail-collapsed .rail {
      width: var(--hax-ui-rail-width-collapsed);
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap);
      overflow-x: hidden;
    }
    .rail-collapsed .rail-item,
    .rail-collapsed .rail-item.sub {
      position: relative;
      justify-content: center;
      padding: 0;
    }
    .rail-collapsed .rail-item .label,
    .rail-collapsed .rail-label .label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
    .rail-collapsed .rail-label {
      margin: var(--hax-ui-gap-md) var(--hax-ui-gap);
      padding: 0;
      border-top: 1px solid var(--hax-ui-line-strong);
    }
    /* the open section's parts sit in one sunken group under it */
    .rail-collapsed .rail-sub {
      margin: 2px 0 var(--hax-ui-gap);
      padding: 2px 0;
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-surface);
    }
    .rail-collapsed .rail-sub > li {
      padding-left: 0;
      margin-left: 0;
    }
    .rail-collapsed .rail-sub > li::before,
    .rail-collapsed .rail-sub > li::after {
      display: none;
    }
    .rail-collapsed .rail-item.sub simple-icon-lite {
      --simple-icon-width: 16px;
      --simple-icon-height: 16px;
    }
    .rail-collapsed .rail-item.sub[aria-current="page"],
    .rail-collapsed .rail-item.sub[aria-current="location"] {
      background-color: var(--hax-ui-selected);
      box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
    }
    /* a badge becomes a dot on the icon; its number stays for readers */
    .rail-collapsed .rail-badge {
      position: absolute;
      top: 3px;
      right: 6px;
      min-width: 0;
      width: 8px;
      height: 8px;
      padding: 0;
      overflow: hidden;
      font-size: 0;
      line-height: 0;
      background-color: var(--hax-ui-text-muted);
    }
    .rail-collapsed .rail-badge[data-tone="danger"] {
      background-color: var(--hax-ui-danger);
    }
    .rail-collapsed .rail-badge[data-tone="warning"] {
      background-color: var(--hax-ui-warning);
    }
    /* Beta and Soon name a section's state, not a count */
    .rail-badge[data-tone="beta"],
    .rail-badge[data-tone="soon"] {
      color: var(--hax-ui-accent-strong);
      background-color: transparent;
      box-shadow: inset 0 0 0 1px currentColor;
      font-weight: var(--ddd-font-weight-medium, 500);
      letter-spacing: 0.02em;
    }
    .rail-badge[data-tone="soon"] {
      color: var(--hax-ui-text-muted);
      box-shadow: inset 0 0 0 1px var(--hax-ui-line-strong);
    }
    .rail-collapsed .rail-badge[data-tone="beta"] {
      box-shadow: none;
      background-color: var(--hax-ui-accent-strong);
    }
    .rail-collapsed .rail-badge[data-tone="soon"] {
      display: none;
    }
    .ph-status {
      font-size: var(--hax-ui-admin-font-size-xs);
      font-family: var(--hax-ui-admin-font-family);
    }
    /* an action bar holding a selection and a form: the selection's
       actions, a rule, then Discard and Save */
    .ftr .bar-sep {
      align-self: stretch;
      width: 1px;
      margin: var(--hax-ui-gap) 0;
      background-color: var(--hax-ui-line);
    }
    .st .sep {
      color: var(--hax-ui-text-muted);
    }
    .rail-tip {
      position: absolute;
      z-index: 4;
      transform: translateY(-50%);
      padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius);
      font-size: var(--hax-ui-admin-font-size-xs);
      font-weight: var(--ddd-font-weight-medium, 500);
      white-space: nowrap;
      pointer-events: none;
      color: var(--hax-ui-on-primary);
      background-color: var(--hax-ui-primary);
      box-shadow: var(--hax-ui-shadow-popover);
    }

    /* narrow screens: icons hold their place, the open rail lays over
           the section until a pick, Esc or a click outside closes it */
    .narrow .rail {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 3;
    }
    .narrow .main {
      margin-left: var(--hax-ui-rail-width-collapsed);
    }
    .rail-overlay .rail {
      width: min(260px, 85%);
      box-shadow: var(--hax-ui-shadow-popover);
      /* the sunken tint is see-through in dark; lay it on the surface */
      background-color: var(--hax-ui-surface);
      background-image: linear-gradient(
        var(--hax-ui-sunken),
        var(--hax-ui-sunken)
      );
    }
    .rail-scrim {
      position: absolute;
      inset: 0;
      z-index: 3;
      background-color: rgba(0, 3, 33, 0.32);
    }

    .main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      /* keep a section's own stacking (sticky toolbars) under the rail,
             its tooltip and the open menu */
      isolation: isolate;
    }
    .ph {
      display: flex;
      align-items: flex-start;
      gap: var(--hax-ui-gap-lg);
      padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px)
        var(--hax-ui-gap-lg);
      border-bottom: 1px solid var(--hax-ui-line);
    }
    .ph-text {
      flex: 1;
      min-width: 0;
    }
    .ph-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--hax-ui-gap-md);
    }
    /* the add area of a record panel; under the title on a narrow screen */
    .narrow .ph-add {
      width: 100%;
    }
    .ph h2 {
      margin: 0;
      font-size: 22px;
      font-weight: var(--ddd-font-weight-bold, 700);
      line-height: 1.2;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--hax-ui-gap-md);
    }
    .ph p {
      margin: var(--hax-ui-gap) 0 0;
      color: var(--hax-ui-text-muted);
    }
    .body {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
    /* a section that scrolls inside itself (Structure) fills the body */
    .body.fill {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .body.fill ::slotted(*) {
      flex: 1 1 auto;
      min-height: 0;
    }

    /* action bar */
    .ftr {
      flex: none;
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-lg);
      min-height: 56px;
      padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px);
      border-top: 1px solid var(--hax-ui-line);
    }
    .st {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      font-size: 13px;
    }
    .st .muted,
    .st.muted {
      color: var(--hax-ui-text-muted);
    }
    .st .list {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--hax-ui-text-muted);
    }
    .st.error {
      color: var(--hax-ui-danger);
    }
    .st.saved {
      color: var(--hax-ui-text);
    }
    .st.saved simple-icon-lite {
      color: var(--hax-ui-success);
    }
    .dot {
      width: 8px;
      height: 8px;
      flex: none;
      border-radius: 50%;
      background-color: var(--hax-ui-accent-strong);
    }

    /* bulk actions that do not fit a narrow bar */
    .more-wrap {
      position: relative;
    }
    .more-btn simple-icon-lite {
      transform: rotate(-90deg);
    }
    .more-btn[aria-expanded="true"] simple-icon-lite {
      transform: rotate(90deg);
    }
    .more-menu {
      position: absolute;
      right: 0;
      bottom: calc(100% + 6px);
      z-index: 4;
      display: flex;
      flex-direction: column;
      gap: var(--hax-ui-gap);
      min-width: 200px;
      padding: var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius-lg);
      background-color: var(--hax-ui-surface);
      box-shadow: var(--hax-ui-shadow-popover);
    }
    .more-menu .hax-ui-btn {
      justify-content: flex-start;
      width: 100%;
    }

    /* narrow: a compact page header and bars that stay one row */
    .narrow .ph {
      flex-wrap: wrap;
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
      gap: var(--hax-ui-gap-md);
    }
    /* header actions (Views) drop below the title instead of crushing it */
    .narrow .ph-text {
      flex: 1 1 100%;
    }
    .narrow .ph h2 {
      font-size: 18px;
    }
    .narrow .ph p {
      font-size: var(--hax-ui-admin-font-size-xs);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .narrow .ftr {
      gap: var(--hax-ui-gap-md);
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
      min-height: 52px;
    }
    .narrow .st {
      font-size: var(--hax-ui-admin-font-size-xs);
    }
    .narrow .st {
      flex: 1 0 auto;
    }
    .narrow .st b {
      white-space: nowrap;
    }
    .narrow .ftr .hax-ui-btn {
      padding: 0 var(--hax-ui-gap-md);
    }

    /* leave prompt */
    .scrim {
      position: absolute;
      inset: 0;
      z-index: 5;
      display: grid;
      place-items: center;
      padding: var(--ddd-spacing-4, 16px);
      background-color: rgba(0, 3, 33, 0.32);
    }
    .leave {
      width: min(460px, 100%);
      padding: var(--ddd-spacing-4, 16px);
      border: 1px solid var(--hax-ui-line-strong);
      border-radius: var(--hax-ui-radius-lg);
      background-color: var(--hax-ui-surface);
      box-shadow: var(--hax-ui-shadow-popover);
    }
    .leave h3 {
      margin: 0;
      font-size: 15px;
      font-weight: var(--ddd-font-weight-bold, 700);
    }
    .leave p {
      margin: var(--hax-ui-gap) 0 var(--hax-ui-gap-lg);
      font-size: 13px;
      color: var(--hax-ui-text-muted);
    }
    .leave .acts {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: var(--hax-ui-gap-md);
    }
    @media (max-width: 768px) {
      .ftr {
        flex-wrap: wrap;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .rail {
        transition: none;
      }
    }
  `,
];
