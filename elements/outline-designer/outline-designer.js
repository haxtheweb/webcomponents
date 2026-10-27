/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, css, html, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { JSONOutlineSchemaItem } from "@haxtheweb/json-outline-schema/lib/json-outline-schema-item.js";
import { JsonOutlineSchema } from "@haxtheweb/json-outline-schema/json-outline-schema.js";
import "@haxtheweb/simple-popover/simple-popover.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-fields/lib/simple-context-menu.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import {
  haxElementToNode,
  sanitizeHTMLString,
} from "@haxtheweb/utils/utils.js";

// pointer travel (px) before a mouse or pen press becomes a drag
const DRAG_THRESHOLD = 5;
// touch: how long a still finger rests on a row before it picks the row up
const TOUCH_HOLD_MS = 350;
// mouse: how long a still press on an open parent waits before folding it
const FOLD_HOLD_MS = 700;
// distance from the scroll container edge that starts auto-scrolling
const AUTOSCROLL_EDGE = 40;
const MAX_DEPTH = 20;
const DENSITIES = ["compact", "default", "roomy"];
const DENSITY_KEY = "outline-designer-density";
// how much to show after a change, by the input that made it: a drag
// already showed a mouse user where things went, so mouse stays light;
// touch, where a finger hides the spot, gets the most
const MOTION = {
  mouse: {
    slide: 1,
    grow: 1,
    flip: 1.6,
    landed: 700,
    quiet: true,
    flash: 0,
    nudge: false,
    scroll: "nearest",
    dropSlide: false,
  },
  keyboard: {
    slide: 1.2,
    grow: 1.2,
    flip: 2,
    landed: 1100,
    quiet: false,
    flash: 700,
    nudge: false,
    scroll: "nearest",
    dropSlide: true,
  },
  touch: {
    slide: 1.7,
    grow: 1.7,
    flip: 2.6,
    landed: 1500,
    quiet: false,
    flash: 1000,
    nudge: true,
    scroll: "center",
    dropSlide: true,
  },
};
const UNDO_MS = 8000;
const NUDGE_MS = 6000;
/**
 * `outline-designer`
 * @element outline-designer
 * `tools to modify and visualize JSON Outline Schema for editing`
 *
 * Interaction (haxtheweb/issues#3180): one pointer-based drag for mouse,
 * pen and touch with an insertion line that shows the landing level,
 * sideways dragging to change level, roving keyboard focus with
 * Alt+arrow moves, and density in place of zoom. The items it reads and
 * the getData() it returns are unchanged.
 * @demo demo/index.html
 */
export class OutlineDesigner extends SchemaBehaviors(I18NMixin(LitElement)) {
  static get styles() {
    return [
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          display: block;
          font-family: var(--hax-ui-admin-font-family);
          color: var(--hax-ui-text);
          --outline-designer-row-height: var(--hax-ui-row-height);
          --outline-designer-indent: var(--hax-ui-indent);
          margin-bottom: var(--ddd-spacing-10);
        }
        :host([density="compact"]) {
          --outline-designer-row-height: var(--hax-ui-row-height-compact);
        }
        :host([density="roomy"]) {
          --outline-designer-row-height: var(--hax-ui-row-height-roomy);
        }
        .controls simple-toolbar-button.control[disabled] {
          --simple-toolbar-button-disabled-opacity: 0.3;
        }
        .controls {
          position: sticky;
          top: -16px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-primary-4)
          );
          z-index: 1;
          padding: var(--ddd-spacing-2) 0;
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-primary-5)
          );
        }
        .controls.store-tools {
          gap: var(--ddd-spacing-2);
          align-items: flex-end;
        }
        .import-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          gap: var(--ddd-spacing-3);
          margin-right: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-accent-5)
          );
          border-radius: var(--ddd-radius-sm);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
        }
        .import-field {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          min-width: 220px;
        }
        .import-field label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .import-field simple-fields-field {
          min-height: 42px;
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-accent-5)
          );
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          --simple-fields-font-size: var(--ddd-font-size-4xs);
          --simple-fields-line-height: var(--ddd-lh-120, 1.2);
          --simple-fields-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-fields-background-color: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.2)
          );
          --simple-fields-border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-accent-5)
          );
          --simple-fields-border-bottom-size: 0;
          --simple-fields-accent-color: var(--ddd-theme-default-skyBlue);
        }
        .import-field simple-fields-field:focus-within {
          outline: var(--ddd-border-size-xs) solid
            var(--ddd-theme-default-keystoneYellow);
          outline-offset: 2px;
        }
        .controls simple-toolbar-button.control {
          margin: 0;
          --simple-toolbar-button-height: var(--ddd-icon-md);
          --simple-toolbar-button-min-width: var(--ddd-icon-md);
          --simple-toolbar-button-border-width: 1px;
          --simple-toolbar-border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-accent-5)
          );
          --simple-toolbar-border-radius: var(--ddd-radius-md);
          border-radius: var(--ddd-radius-md);
          --simple-toolbar-button-padding: 3px 6px;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-3)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-accent-6)
          );
        }
        .controls simple-toolbar-button.control:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
          --simple-toolbar-border-color: light-dark(
            var(--ddd-primary-1),
            var(--ddd-accent-5)
          );
        }
        @media screen and (max-width: 900px) {
          .controls.store-tools {
            align-items: stretch;
          }
          .import-controls {
            width: 100%;
            margin-right: 0;
            gap: var(--ddd-spacing-2);
          }
          .import-field {
            min-width: 0;
            flex: 1 1 180px;
          }
        }
        simple-popover {
          --simple-popover-max-height: 300px;
        }
        simple-popover *:not(.close-btn) {
          max-width: 40vw;
        }
        simple-popover::part(simple-popover-content) {
          overflow: auto;
        }
        .close-btn {
          z-index: 1000;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          border: var(--ddd-border-xs);
          border-color: light-dark(var(--ddd-primary-5), var(--ddd-accent-5));
          border-radius: var(--ddd-radius-circle, 50%);
          position: absolute;
          top: 24px;
          right: 0;
        }
        /* toolbar buttons at row height, with their words showing */
        .controls simple-toolbar-button.control {
          --simple-toolbar-button-height: var(--hax-ui-row-height);
          --simple-toolbar-button-min-width: var(--hax-ui-row-height);
          --simple-toolbar-button-padding: 0 var(--hax-ui-gap-md);
          --simple-toolbar-border-radius: var(--hax-ui-radius);
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .density {
          display: inline-flex;
          align-items: stretch;
          height: var(--hax-ui-row-height);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
        }
        .density button {
          all: unset;
          display: inline-flex;
          align-items: center;
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          cursor: pointer;
        }
        .density button + button {
          border-left: 1px solid var(--hax-ui-line-strong);
        }
        .density button:hover {
          background-color: var(--hax-ui-hover);
          color: var(--hax-ui-text);
        }
        .density button[aria-pressed="true"] {
          background-color: var(--hax-ui-accent-soft);
          color: var(--hax-ui-text);
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .density button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        .summary {
          margin-left: auto;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .container {
          text-align: left;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        ul li {
          margin: 0;
        }
        [hidden] {
          display: none !important;
        }

        /* the tree */
        .tree-wrap {
          position: relative;
          padding: var(--hax-ui-gap) 0;
        }
        li.item {
          position: relative;
          display: flex;
          align-items: center;
          height: var(--outline-designer-row-height);
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          outline: none;
          cursor: default;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          touch-action: pan-y;
        }
        li.item:hover {
          background-color: var(--hax-ui-hover);
        }
        li.item:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        li.item.selected-page {
          background-color: var(--hax-ui-selected);
        }
        li.item.current-page {
          box-shadow: inset 3px 0 0 var(--hax-ui-accent);
        }
        li.item[data-about-to-delete] {
          background-image: repeating-linear-gradient(
            -45deg,
            var(--hax-ui-danger-soft) 0 6px,
            transparent 6px 12px
          );
        }
        li.item[data-about-to-delete] .label {
          text-decoration: line-through;
          color: var(--hax-ui-text-muted);
        }
        /* carried rows dim their lines and controls; the text stays
           readable (muted, not faded) */
        li.item[data-dragging] {
          color: var(--hax-ui-text-muted);
        }
        li.item[data-dragging] .cols,
        li.item[data-dragging] .toggle,
        li.item[data-dragging] .grip {
          opacity: var(--ddd-opacity-40, 0.4);
        }
        li.item.drop-target-child {
          background-color: var(--hax-ui-accent-soft);
          outline: var(--hax-ui-drop-width) dashed var(--hax-ui-drop);
          outline-offset: calc(-1 * var(--hax-ui-drop-width));
        }
        li.item.pressing::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: var(--hax-ui-drop-width);
          background-color: var(--hax-ui-drop);
          animation: outline-designer-press var(--outline-designer-press-ms)
            linear forwards;
        }
        @keyframes outline-designer-press {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .active-preview-item {
          outline: 1px solid var(--hax-ui-line-strong);
          outline-offset: -1px;
        }

        /* indent columns and connector lines */
        .cols {
          display: flex;
          height: 100%;
          flex: none;
          align-self: stretch;
        }
        .col {
          position: relative;
          width: var(--outline-designer-indent);
          height: 100%;
          flex: none;
        }
        .ln {
          position: absolute;
          background-color: var(--hax-ui-line);
        }
        .ln.full,
        .ln.top,
        .ln.bot {
          left: calc(var(--outline-designer-indent) / 2 - 0.5px);
          width: 1px;
        }
        .ln.full {
          top: 0;
          bottom: 0;
        }
        .ln.top {
          top: 0;
          height: 50%;
        }
        .ln.bot {
          top: 50%;
          bottom: 0;
        }
        .ln.tick {
          left: calc(var(--outline-designer-indent) / 2 - 0.5px);
          top: 50%;
          height: 1px;
          width: calc(var(--outline-designer-indent) - 3px);
        }
        .ln.hl {
          background-color: var(--hax-ui-drop);
        }
        .ln.full.hl,
        .ln.top.hl,
        .ln.bot.hl {
          width: var(--hax-ui-drop-width);
          left: calc(var(--outline-designer-indent) / 2 - 1px);
        }
        .ln.tick.hl {
          height: var(--hax-ui-drop-width);
        }
        .toggle {
          position: relative;
          z-index: 1;
          width: var(--outline-designer-indent);
          height: 100%;
          flex: none;
          display: grid;
          place-items: center;
        }
        .collapse-btn {
          all: unset;
          position: relative;
          box-sizing: border-box;
          width: var(--hax-ui-icon);
          height: var(--hax-ui-icon);
          border-radius: var(--hax-ui-radius);
          display: grid;
          place-items: center;
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-surface);
          cursor: pointer;
          --simple-icon-width: 12px;
          --simple-icon-height: 12px;
        }
        /* a 24px hit area around the 16px chevron */
        .collapse-btn::before {
          content: "";
          position: absolute;
          inset: calc((var(--hax-ui-icon) - var(--hax-ui-target)) / 2);
        }
        li.item:hover .collapse-btn,
        li.item.selected-page .collapse-btn {
          background-color: transparent;
        }
        .collapse-btn:hover {
          background-color: var(--hax-ui-line);
          color: var(--hax-ui-text);
        }
        .collapse-btn.hl {
          box-shadow: 0 0 0 1.5px var(--hax-ui-drop);
          color: var(--hax-ui-drop);
        }
        .leaf {
          width: 6px;
          height: 6px;
          border-radius: var(--ddd-radius-circle, 50%);
          background-color: var(--hax-ui-line-strong);
        }
        .leaf.hl {
          background-color: var(--hax-ui-drop);
        }
        .grip {
          display: none;
        }
        .title {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          height: 100%;
          padding: 0 var(--hax-ui-gap-md);
          cursor: grab;
        }
        li.item.locked .title {
          cursor: default;
        }
        .label,
        .label-edit {
          display: none;
        }
        .label.shown {
          display: block;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        li.item[aria-level="1"] .label {
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        span[disabled].label {
          pointer-events: none;
        }
        .label-edit.shown {
          display: block;
          flex: 1;
          min-width: 0;
          padding: 0 var(--hax-ui-gap);
          white-space: nowrap;
          overflow: hidden;
          cursor: text;
          user-select: text;
          -webkit-user-select: text;
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
        }
        .modified-dot {
          flex: none;
          width: 7px;
          height: 7px;
          border-radius: var(--ddd-radius-circle, 50%);
          background-color: var(--hax-ui-accent-strong);
        }
        .lock-icon {
          flex: none;
          color: var(--hax-ui-text-muted);
          --simple-icon-width: 12px;
          --simple-icon-height: 12px;
        }
        li.item .hax-ui-pill {
          margin-right: var(--hax-ui-gap);
        }
        .trail {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: none;
          opacity: 0;
        }
        li.item:hover .trail,
        li.item:focus-visible .trail,
        li.item:focus-within .trail {
          opacity: 1;
        }
        .act {
          all: unset;
          box-sizing: border-box;
          width: var(--hax-ui-target);
          height: var(--hax-ui-target);
          border-radius: var(--hax-ui-radius);
          display: grid;
          place-items: center;
          color: var(--hax-ui-text-muted);
          cursor: pointer;
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
        }
        .act:hover {
          background-color: var(--hax-ui-line);
          color: var(--hax-ui-text);
        }
        .act[aria-pressed="true"] {
          color: var(--hax-ui-accent-strong);
        }
        .content-toggle-btn {
          position: relative;
          opacity: 0;
        }
        li.item:hover .content-toggle-btn,
        li.item:focus-visible .content-toggle-btn,
        li.item:focus-within .content-toggle-btn,
        .content-toggle-btn[aria-pressed="true"] {
          opacity: 1;
        }
        :host([data-dragging]) .trail,
        :host([data-dragging]) .content-toggle-btn {
          opacity: 0 !important;
        }

        /* rows that add a page at the end of a level */
        li.add-row {
          position: relative;
          display: flex;
          align-items: center;
          height: var(--hax-ui-target);
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
        }
        li.add-row .plus {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 14px;
          height: 14px;
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-drop);
          color: var(--hax-ui-on-accent);
          display: none;
          place-items: center;
          --simple-icon-width: 10px;
          --simple-icon-height: 10px;
        }
        li.add-row .add-label {
          padding-left: var(--hax-ui-gap-md);
          opacity: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        li.add-row:hover .add-label {
          opacity: 1;
          color: var(--hax-ui-text);
        }
        li.add-row:hover .plus {
          display: grid;
        }
        /* the level's corner line closes it; the dot and words wait for hover */
        li.add-row .leaf {
          visibility: hidden;
        }
        li.add-row:hover .ln.top,
        li.add-row:hover .ln.tick {
          background-color: var(--hax-ui-drop);
        }

        /* drag feedback */
        .dropline {
          position: absolute;
          right: var(--hax-ui-gap-md);
          height: var(--hax-ui-drop-width);
          margin-top: calc(var(--hax-ui-drop-width) / -2);
          background-color: var(--hax-ui-drop);
          border-radius: var(--ddd-radius-xs, 4px);
          pointer-events: none;
          z-index: 3;
        }
        .dropline::before {
          content: "";
          position: absolute;
          left: -5px;
          top: -4px;
          width: 10px;
          height: 10px;
          box-sizing: border-box;
          border-radius: var(--ddd-radius-circle, 50%);
          border: var(--hax-ui-drop-width) solid var(--hax-ui-drop);
          background-color: var(--hax-ui-surface);
        }
        .drag-ghost {
          position: fixed;
          left: 0;
          top: 0;
          z-index: var(--ddd-z-dropdown, 100);
          pointer-events: none;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          max-width: min(320px, 80vw);
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          border: 1px solid var(--hax-ui-drop);
          border-radius: var(--hax-ui-radius);
          box-shadow: var(--hax-ui-shadow-popover);
          white-space: nowrap;
        }
        .drag-ghost .ghost-title {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .drag-ghost .ghost-count {
          font-weight: var(--ddd-font-weight-regular, 400);
          color: var(--hax-ui-text-muted);
        }
        .drag-status {
          min-height: var(--hax-ui-row-height);
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: 0 var(--hax-ui-gap-md);
          border-top: 1px solid var(--hax-ui-line);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .drag-status.live {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-accent-soft);
        }
        .drag-status .arrow {
          color: var(--hax-ui-drop);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .hints {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap) var(--hax-ui-gap-lg);
          padding: var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }

        /* showing what changed (see _withMotion) */
        .tree-wrap.vt {
          contain: layout;
        }
        /* the transition is scoped to the tree, so * is only its rows;
           Chromium does not match view-transition-class inside shadow DOM */
        ::view-transition-group(*) {
          animation-duration: var(--outline-designer-vt-ms, 150ms);
          animation-timing-function: var(--hax-ui-easing-move);
        }
        ::view-transition-old(*),
        ::view-transition-new(*) {
          animation-duration: var(--outline-designer-vt-ms, 150ms);
        }
        ::view-transition-new(*):only-child {
          animation: outline-designer-grow
            var(--outline-designer-grow-ms, 150ms) var(--hax-ui-easing-move)
            both;
        }
        ::view-transition-old(*):only-child {
          animation: outline-designer-shrink
            var(--outline-designer-vt-ms, 150ms) var(--hax-ui-easing) both;
        }
        @keyframes outline-designer-grow {
          from {
            opacity: 0;
            transform: translateY(-35%) scaleY(0.5);
          }
        }
        @keyframes outline-designer-shrink {
          to {
            opacity: 0;
            transform: scaleY(0.5);
          }
        }
        /* pages flipping into and out of existence (added, deleted,
           restored); timing per page is set while a change runs */
        @keyframes outline-designer-flip-in {
          from {
            opacity: 0;
            transform: perspective(700px) rotateX(-90deg);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes outline-designer-flip-out {
          from {
            opacity: 1;
            transform: none;
          }
          to {
            opacity: 0;
            transform: perspective(700px) rotateX(90deg);
          }
        }
        /* touch: move buttons that stay on the row after a menu move */
        li.item.nudging .trail,
        li.item.nudging .content-toggle-btn,
        li.item.nudging .hax-ui-pill {
          visibility: hidden;
        }
        .nudge {
          position: absolute;
          right: var(--hax-ui-gap-md);
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          display: flex;
          gap: 2px;
          padding: 2px;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-pill);
          background-color: var(--hax-ui-surface);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .nudge-btn {
          all: unset;
          box-sizing: border-box;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: var(--ddd-radius-circle, 50%);
          color: var(--hax-ui-text);
          cursor: pointer;
          touch-action: manipulation;
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
        }
        .nudge-btn:active,
        .nudge-btn:hover {
          background-color: var(--hax-ui-accent-soft);
        }
        .nudge-btn:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
        }
        .nudge-btn[disabled] {
          opacity: var(--ddd-state-disabled-opacity, 0.4);
          pointer-events: none;
        }
        .nudge-btn.done {
          color: var(--hax-ui-accent-strong);
        }
        /* the last change, with undo */
        .drag-status .status-text {
          flex: 1;
          min-width: 0;
        }
        .undo-btn {
          all: unset;
          flex: none;
          cursor: pointer;
          color: var(--hax-ui-accent-strong);
          font-weight: var(--ddd-font-weight-medium, 500);
          text-decoration: underline;
          text-underline-offset: 2px;
          padding: 0 var(--hax-ui-gap);
          border-radius: var(--hax-ui-radius);
        }
        .undo-btn:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
        }
        :host([data-modality="touch"]) .undo-btn {
          text-decoration: none;
          min-height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-accent-strong);
          border-radius: var(--hax-ui-radius-pill);
          display: inline-flex;
          align-items: center;
        }

        /* page content structure rows: tucked under their page, a little
           shorter, tinted as one group, and joined to the page by a line
           that runs down from its dot or chevron and branches to each */
        li.content-child,
        li.content-adding-operations {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-content-group);
        }
        li.content-child {
          /* a fixed height so the tree lines (height: 100%) can draw */
          height: calc(var(--outline-designer-row-height) - 4px);
        }
        li.content-child.last {
          border-end-start-radius: var(--hax-ui-radius);
          border-end-end-radius: var(--hax-ui-radius);
        }
        li.content-child.last .ln.content-bot {
          display: none;
        }
        li.item.content-open .toggle::after {
          content: "";
          position: absolute;
          left: calc(50% - 0.5px);
          top: calc(50% + 4px);
          bottom: 0;
          width: 1px;
          background-color: var(--hax-ui-line);
        }
        li.content-child:hover {
          background-color: var(--hax-ui-hover);
        }
        li.content-child .label.shown,
        li.content-child .label-edit.shown {
          flex: 1;
          padding: 0 var(--hax-ui-gap-md);
        }
        li.content-heading .label.shown {
          color: var(--hax-ui-text);
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        li.content-child .btn-contrast simple-icon-button-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
        }
        li.content-adding-operations {
          flex-wrap: wrap;
          gap: var(--hax-ui-gap);
          padding-block: var(--hax-ui-gap);
        }
        .content-adding-operations .operation {
          display: inline-flex;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          margin: 0 var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-1);
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-3)
          );
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        .content-adding-operations .operation:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
          border-color: light-dark(var(--ddd-primary-1), var(--ddd-accent-5));
        }
        .content-operation {
          display: inline-flex;
          opacity: 0;
          visibility: hidden;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          margin: 0 4px;
        }
        .content-operations {
          justify-content: space-evenly;
          display: flex;
        }
        li.content-child:hover .content-operation,
        li.content-child:focus-within .content-operation {
          visibility: visible;
          opacity: 1;
        }
        li[class*="collapsed-by-"] {
          opacity: 0;
          height: 0px !important;
          visibility: hidden;
          padding: 0px !important;
          margin: 0px !important;
          width: 0px !important;
          padding: 0px !important;
          margin: 0px !important;
          border: 0px !important;
          pointer-events: none;
          z-index: -1;
        }
        /* content not rendered if hidden but in case we change that */
        li[data-contents-collapsed] {
          opacity: 0;
          height: 0px !important;
          visibility: hidden;
          padding: 0px !important;
          margin: 0px !important;
          width: 0px !important;
          padding: 0px !important;
          margin: 0px !important;
          border: 0px !important;
          pointer-events: none;
          z-index: -1;
        }
        /* Menu button styling */
        .actions-menu {
          margin-left: var(--ddd-spacing-2);
        }
        .actions-menu::part(button) {
          padding: var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-xs);
          border: var(--ddd-border-xs);
          background: light-dark(var(--ddd-accent-6), var(--ddd-primary-3));
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        .actions-menu::part(button):hover {
          background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
        }
        .actions-menu simple-toolbar-button {
          text-align: left;
          justify-content: flex-start;
          padding-left: var(--ddd-spacing-2);
          padding-right: var(--ddd-spacing-4);
          --simple-toolbar-button-justify: flex-start;
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
        }
        .actions-menu simple-toolbar-button.delete-button {
          border-top: var(--ddd-border-size-sm) solid
            var(--ddd-theme-default-limestoneGray);
          margin-top: var(--ddd-spacing-2);
          padding-top: var(--ddd-spacing-2);
        }
        .actions-menu simple-toolbar-button.delete-button:hover {
          color: var(--ddd-theme-default-error);
          background-color: var(--ddd-theme-default-errorLight);
        }

        simple-icon-button-lite {
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }

        simple-context-menu {
          text-align: left;
        }
        simple-context-menu::part(content) {
          text-align: left;
          align-items: flex-start;
        }
        .sr-only {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        @media (pointer: coarse) {
          li.item .grip {
            display: grid;
            place-items: center;
            flex: none;
            width: var(--hax-ui-target);
            height: 100%;
            color: var(--hax-ui-text-muted);
            touch-action: none;
            --simple-icon-width: var(--hax-ui-icon);
            --simple-icon-height: var(--hax-ui-icon);
          }
          li.item.locked .grip {
            visibility: hidden;
          }
          /* touch rows keep the grip and the actions menu; adding a
             sub-page and the content structure live in that menu */
          .trail {
            opacity: 1;
          }
          .add-child-btn,
          .content-toggle-btn:not([aria-pressed="true"]) {
            display: none;
          }
          .content-toggle-btn[aria-pressed="true"] {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .trail,
          .content-toggle-btn,
          li.add-row .add-label {
            transition: opacity var(--hax-ui-duration) var(--hax-ui-easing);
          }
        }
        @media (forced-colors: active) {
          li.item:focus-visible {
            outline-color: Highlight;
          }
          li.item.selected-page {
            outline: 1px solid Highlight;
            outline-offset: -1px;
          }
          li.item.current-page {
            border-left: 3px solid Highlight;
          }
          li.item.drop-target-child {
            outline-color: Highlight;
          }
          .ln,
          .leaf {
            forced-color-adjust: none;
            background-color: CanvasText;
          }
          .dropline,
          .ln.hl,
          .leaf.hl {
            forced-color-adjust: none;
            background-color: Highlight;
          }
          .dropline::before {
            border-color: Highlight;
            background-color: Canvas;
          }
        }
      `,
    ];
  }
  constructor() {
    super();
    this._blurBlock = false;
    this.fidelity = "medium";
    this.haxGizmos = [];
    this.hideDelete = false;
    this.activeItemForActions = null;
    this.storeTools = false;
    this.hideContentOps = false;
    this.items = [];
    this.appReady = false;
    this.eventData = {};
    this.activeId = null;
    this.activePreview = null;
    this.activePreviewIndex = -1;
    this.liveRegionText = "";
    // pointer drag state: _press is a pointer that may become a drag,
    // _drag the drag in progress, _dropTarget where it would land
    this._press = null;
    this._drag = null;
    this._dropTarget = null;
    this._statusText = "";
    this._focusId = null;
    this._typed = "";
    this._typedAt = 0;
    this.hideAddRows = false;
    // motion: which input made the last change, and preview overrides
    this.motionProfile = "auto";
    this.reducedMotion = "auto";
    this._lastModality = null;
    this._vtActive = false;
    // rows whose title flips with the row instead of sliding on its own
    this._vtPlain = new Set();
    this._flashGroup = null;
    this._nudgeId = null;
    this._undo = null;
    this.addEventListener(
      "pointerdown",
      (e) => {
        this._lastModality = e.pointerType === "mouse" ? "mouse" : "touch";
        this._syncModality();
        // a tap anywhere but the move buttons puts them away
        if (
          this._nudgeId &&
          !e
            .composedPath()
            .some((n) => n.classList && n.classList.contains("nudge"))
        ) {
          this._hideNudge();
        }
      },
      true,
    );
    this.addEventListener(
      "keydown",
      () => {
        this._lastModality = "keyboard";
        this._syncModality();
      },
      true,
    );
    this.__windowUp = (e) => this._onPointerUp(e);
    this.__windowCancel = (e) => this._onPointerCancel(e);
    // a drag ends with a click on whatever is under the pointer; swallow it
    this._clickGuard = {
      capture: true,
      handleEvent: (e) => {
        if (this._suppressClick) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
    };
    this.activePage = null;
    this.selectedPages = [];
    this.density = "default";
    try {
      const saved = globalThis.localStorage.getItem(DENSITY_KEY);
      if (DENSITIES.includes(saved)) {
        this.density = saved;
      }
    } catch {
      // storage can be blocked; the default density is fine
    }
    this.t = {
      selectTarget: "Select target",
      importContentUnderThisPage: "Import content under this page",
      importThisContent: "Import this content",
      thisPage: "this page",
      newPage: "New page",
      copyOf: "Copy of",
      pageActions: "Page Actions",
      editTitle: "Edit title",
      lock: "Lock",
      unlock: "Unlock",
      moveUp: "Move up",
      moveDown: "Move down",
      makeChild: "Make child",
      moveToParentLevel: "Move to parent level",
      addPage: "Add page",
      duplicate: "Duplicate",
      delete: "Delete",
      restore: "Restore",
      goToPage: "Go to page",
      collapseAll: "Collapse all",
      expandAll: "Expand all",
      deleteSelected: "Delete Selected ({count})",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      hideDeleted: "Hide Deleted",
      showDeleted: "Show Deleted",
      outlineStructure: "Outline structure of pages and content",
      close: "Close",
      asChildrenOf: "as children of",
      above: "Above",
      below: "Below",
      modified: "modified",
      markedForDeletion: "marked for deletion",
      expandChildren: "Expand children",
      collapseChildren: "Collapse children",
      dragToReorder: "Drag to reorder",
      dragToReorderKeyboard:
        "Drag to reorder or press Enter to activate keyboard controls",
      contentStructure: "Content structure",
      indent: "Indent",
      outdent: "Outdent",
      addContentType: "Add {title}",
      contentOfPage: "{content}, in {title}",
      headingLabel: "Heading",
      clickToPreview: "Click to preview",
      increaseHeading: "Increase heading",
      decreaseHeading: "Decrease Heading",
      promoteToPage: "Promote to page",
      keyboardControlsDeactivated: "Keyboard controls deactivated",
      keyboardControlsActivated:
        "Keyboard controls activated. Use arrow keys to move, Enter or Escape to deactivate",
      movingItemUp: "Moving item up",
      movingItemDown: "Moving item down",
      indentingItem: "Indenting item",
      outdentingItem: "Outdenting item",
      titleEditingActivated: "Title editing activated",
      movedToNextItem: "Moved to next item",
      movedToPreviousItem: "Moved to previous item",
      expanded: "Expanded",
      collapsed: "Collapsed",
      movedToFirstChild: "Moved to first child",
      movedToParent: "Moved to parent",
      movedToFirstItem: "Moved to first item",
      movedToLastItem: "Moved to last item",
      itemMarkedForDeletion: "Item marked for deletion",
      itemDuplicated: "Item duplicated",
      dropAbove: "Drop above {title}",
      dropBelow: "Drop below {title}",
      dropAsChildOf: "Drop as child of {title}",
      dropAtEndOf: "At the end of {title}",
      dropAtEndOfTop: "At the end of the top level",
      dropLevelOnly: "Change its level",
      dropInPlace: "Where it is",
      dropTopLevel: "top level",
      dropLevelUnder: "level {level} under {title}",
      dropSideways: "drag sideways for level {min} to {max}",
      movingPage: "Moving {title}",
      withSubpages: "with {count} sub-pages",
      subpageCount: "{count} sub-pages",
      movedPage: "Moved {title}",
      moveCancelled: "Move cancelled",
      dragHint:
        "Drag a page by its title. Its top or bottom edge places it before or after, the middle nests it, and dragging sideways changes its level.",
      touchDragHint:
        "Press and hold a page, or drag its grip, to move it. Drag sideways to change its level.",
      foldedToMove:
        "Folded {title}. Drag it now to move it with its sub-pages folded.",
      addSubpage: "Add sub-page",
      addPageIn: "Add page in {title}",
      currentPage: "Current page",
      newBadge: "New",
      deletingBadge: "Deleting",
      locked: "locked",
      hiddenSubpages: "{count} hidden sub-pages",
      isLocked: "{title} is locked. Unlock it to change it.",
      insideDeleted: "{title} will be deleted on save. Restore it first.",
      alreadyFirst: "{title} is already first in its group.",
      alreadyLast: "{title} is already last in its group.",
      nothingAbove:
        "There is no page above {title} at its level to put it inside.",
      alreadyTop: "{title} is already at the top level.",
      movedUp: "Moved {title} up",
      movedDown: "Moved {title} down",
      indentedUnder: "{title} is now inside {parent}",
      outdented: "{title} moved out a level",
      restored: "Restored {title}",
      selectedCount: "{count} selected",
      selectionCleared: "Selection cleared",
      density: "Row density",
      densityCompact: "Compact",
      densityDefault: "Default",
      densityRoomy: "Roomy",
      pageCount: "{count} pages",
      pending: "Unsaved: {list}",
      pendingNew: "{count} new",
      pendingChanged: "{count} changed",
      pendingDelete: "{count} to delete",
      keyboardHelp: "Keyboard",
      hintFocus: "move focus",
      hintFold: "fold or open",
      hintReorder: "reorder",
      hintIndent: "outdent or indent",
      hintRename: "rename",
      hintAddAfter: "add page after",
      hintSelect: "select",
      hintDelete: "delete or restore",
      hintActions: "actions",
      undo: "Undo",
      undoAction: "Undo: {action}",
      undone: "Undid: {action}",
      movePage: "Move {title}",
      nudgeDone: "Done moving",
      addedPage: "Added a page",
      addedSubpage: "Added a sub-page under {title}",
      lockedPage: "Locked {title}",
      unlockedPage: "Unlocked {title}",
      markedPage: "{title} will be deleted on save",
      markedPages: "{count} pages will be deleted on save",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
    // so we can prepopulate the parent options menu
    autorun(() => {
      const _mobx_val_0 = toJS(store.activeId);
      Promise.resolve().then(() => {
        this.activeId = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.appReady);
      Promise.resolve().then(() => {
        this.appReady = _mobx_val_0;
      });
    });
    // valid list of hax Gizmos
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.gizmoList);
      Promise.resolve().then(() => {
        this.haxGizmos = _mobx_val_0.filter((schema) => {
          if (schema && schema.meta && schema.meta.outlineDesigner) {
            return true;
          }
          return false;
        });
      });
    });
    this.addEventListener("click", this.resetPopOver.bind(this));
  }
  resetPopOver() {
    // clean up if something is active
    if (this.activePreview) {
      this.shadowRoot
        .querySelector("simple-popover")
        .setAttribute("hidden", "hidden");
      this.activePreview = null;
      this.activePreviewIndex = -1;
    }
  }
  // selectable list of items in the current site
  getSiteItems() {
    // default to null parent as the whole site
    let items = [
      {
        text: this.t.selectTarget,
        value: null,
      },
    ];
    if (this.appReady && this.items.length > 0) {
      const rawItemList = store.getManifestItems(true);
      rawItemList.forEach((el) => {
        // calculate -- depth so it looks like a tree
        let itemBuilder = el;
        // walk back through parent tree
        let distance = "- ";
        while (itemBuilder && itemBuilder.parent != null) {
          itemBuilder = rawItemList.find((i) => i.id == itemBuilder.parent);
          // double check structure is sound
          if (itemBuilder) {
            distance = "--" + distance;
          }
        }
        items.push({
          text: distance + el.title,
          value: el.id,
        });
      });
    }
    return items;
  }
  // render function
  render() {
    const entries = this._buildEntries();
    const dt = this._dropTarget;
    const mod = this._isMac() ? "⌘" : "Ctrl";
    return html` <div class="controls ${this.storeTools ? "store-tools" : ""}">
        ${this.storeTools
          ? html`
              <div class="import-controls">
                <div class="import-field">
                  <label for="targetselector"
                    >${this.t.importThisContent}</label
                  >
                  <simple-fields-field
                    id="targetselector"
                    type="select"
                    value="children"
                    .itemsList="${[
                      {
                        text: this.t.asChildrenOf,
                        value: "children",
                      },
                      {
                        text: this.t.above,
                        value: "above",
                      },
                      {
                        text: this.t.below,
                        value: "below",
                      },
                    ]}"
                  ></simple-fields-field>
                </div>
                <div class="import-field">
                  <label for="itemselector"
                    >${this.t.importContentUnderThisPage}</label
                  >
                  <simple-fields-field
                    id="itemselector"
                    type="select"
                    value="${this.activeId}"
                    .itemsList="${this.getSiteItems()}"
                  ></simple-fields-field>
                </div>
              </div>
            `
          : ``}
        <simple-toolbar-button
          class="control"
          icon="add"
          @click="${this._addTop}"
          label="${this.t.addPage}"
          show-text-label
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="hardware:keyboard-arrow-right"
          @click="${this.collapseAll}"
          class="control"
          label="${this.t.collapseAll}"
          show-text-label
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="hardware:keyboard-arrow-down"
          @click="${this.expandAll}"
          class="control"
          label="${this.t.expandAll}"
          show-text-label
        ></simple-toolbar-button>
        ${this.selectedPages.length > 0
          ? html`<simple-toolbar-button
              icon="delete"
              @click="${this._deleteSelectedShown}"
              class="control"
              show-text-label
              label="${this.t.deleteSelected.replace(
                "{count}",
                () => this.selectedPages.length,
              )}"
            ></simple-toolbar-button>`
          : ``}
        ${this.hasDeletedItems()
          ? html`<simple-toolbar-button
              icon="delete"
              @click="${this.toggleDelete}"
              class="control"
              show-text-label
              label="${!this.hideDelete
                ? this.t.hideDeleted
                : this.t.showDeleted}"
            ></simple-toolbar-button>`
          : ``}
        <div class="density" role="group" aria-label="${this.t.density}">
          ${DENSITIES.map(
            (d) =>
              html`<button
                type="button"
                aria-pressed="${this.density === d ? "true" : "false"}"
                @click="${() => this.setDensity(d)}"
              >
                ${this.t[`density${d.charAt(0).toUpperCase()}${d.slice(1)}`]}
              </button>`,
          )}
        </div>
        <span class="summary">${this._summaryText()}</span>
      </div>
      <div class="tree-wrap">
        <ul
          id="list"
          role="tree"
          aria-label="${this.t.outlineStructure}"
          aria-multiselectable="true"
          aria-describedby="hints"
          typeof="oer:TableOfContents"
          @pointerdown="${this._onPointerDown}"
          @pointermove="${this._onPointerMove}"
          @pointerup="${this._onPointerUp}"
          @pointercancel="${this._onPointerCancel}"
          @lostpointercapture="${this._onPointerCancel}"
          @click="${this._clickGuard}"
        >
          ${entries.map((entry) => this._renderEntry(entry))}
        </ul>
        <div
          class="dropline"
          aria-hidden="true"
          ?hidden="${!dt || !dt.line}"
          style="${dt && dt.line
            ? `top:${dt.line.top}px;left:${dt.line.left}px`
            : ""}"
        ></div>
      </div>
      <div
        class="drag-ghost"
        ?hidden="${!this._drag}"
        aria-hidden="true"
        style="${this._drag
          ? `transform:translate(${this._drag.x + 14}px, ${this._drag.y + (this._drag.touch ? -48 : 14)}px)`
          : ""}"
      >
        ${this._drag
          ? html`<span class="ghost-title">${this._drag.title}</span>${this
                ._drag.count
                ? html`<span class="ghost-count">+${this._drag.count}</span>`
                : ``}`
          : ``}
      </div>
      <div class="drag-status ${this._drag || this._undo ? "live" : ""}">
        <span class="status-text" aria-hidden="true"
          >${this._drag
            ? this._statusText
            : this._undo
              ? this._undo.message
              : this._coarsePointer()
                ? this.t.touchDragHint
                : this.t.dragHint}</span
        >
        ${this._undo && !this._drag
          ? html`<button
              type="button"
              class="undo-btn"
              aria-label="${this.t.undoAction.replace(
                "{action}",
                () => this._undo.message,
              )}"
              @click="${this.undo}"
            >
              ${this.t.undo}
            </button>`
          : nothing}
      </div>
      <div class="hints" id="hints">
        <span class="hax-ui-sr-only">${this.t.keyboardHelp}:</span>
        <span
          ><kbd class="hax-ui-kbd">↑</kbd><kbd class="hax-ui-kbd">↓</kbd> ${this
            .t.hintFocus}</span
        >
        <span
          ><kbd class="hax-ui-kbd">←</kbd><kbd class="hax-ui-kbd">→</kbd> ${this
            .t.hintFold}</span
        >
        <span
          ><kbd class="hax-ui-kbd">Alt</kbd>+<kbd class="hax-ui-kbd">↑</kbd
          ><kbd class="hax-ui-kbd">↓</kbd> ${this.t.hintReorder}</span
        >
        <span
          ><kbd class="hax-ui-kbd">Alt</kbd>+<kbd class="hax-ui-kbd">←</kbd
          ><kbd class="hax-ui-kbd">→</kbd> ${this.t.hintIndent}</span
        >
        <span
          ><kbd class="hax-ui-kbd">Enter</kbd> /
          <kbd class="hax-ui-kbd">F2</kbd> ${this.t.hintRename}</span
        >
        <span
          ><kbd class="hax-ui-kbd">${mod}</kbd>+<kbd class="hax-ui-kbd"
            >Enter</kbd
          >
          ${this.t.hintAddAfter}</span
        >
        <span><kbd class="hax-ui-kbd">Space</kbd> ${this.t.hintSelect}</span>
        <span><kbd class="hax-ui-kbd">Del</kbd> ${this.t.hintDelete}</span>
        <span
          ><kbd class="hax-ui-kbd">Shift</kbd>+<kbd class="hax-ui-kbd">F10</kbd>
          ${this.t.hintActions}</span
        >
      </div>
      <div aria-live="polite" aria-atomic="true" class="sr-only">
        ${this.liveRegionText}
      </div>
      <simple-popover auto for="list" hidden>
        <simple-icon-button-lite
          @click="${this.resetPopOver}"
          title="${this.t.close}"
          icon="cancel"
          class="close-btn"
        ></simple-icon-button-lite>
        ${this.renderActiveContentItem(
          this.activePreview,
          this.activePreviewIndex,
        )}
      </simple-popover>`;
  }

  _isMac() {
    const nav = globalThis.navigator || {};
    return /Mac|iPhone|iPad/.test(nav.platform || nav.userAgent || "");
  }

  _coarsePointer() {
    return !!(
      globalThis.matchMedia &&
      globalThis.matchMedia("(pointer: coarse)").matches
    );
  }

  // "12 pages · Unsaved: 2 changed, 1 new"
  _summaryText() {
    const items = this.items || [];
    const count = (fn) => items.filter(fn).length;
    const parts = [];
    const added = count((i) => i.new);
    const changed = count((i) => !i.new && i.modified);
    const deleting = count((i) => i.delete);
    if (added) {
      parts.push(this.t.pendingNew.replace("{count}", () => added));
    }
    if (changed) {
      parts.push(this.t.pendingChanged.replace("{count}", () => changed));
    }
    if (deleting) {
      parts.push(this.t.pendingDelete.replace("{count}", () => deleting));
    }
    const total = this.t.pageCount.replace("{count}", () => items.length);
    return parts.length
      ? `${total} · ${this.t.pending.replace("{list}", () => parts.join(", "))}`
      : total;
  }

  /**
   * Visible items in tree order, without collapsed descendants or, while
   * deleted pages are hidden, deleted ones
   */
  _visibleItems() {
    return (this.items || []).filter(
      (item) =>
        this.getItemParentsCollapsed(item) === "" &&
        !(this.hideDelete && item.delete),
    );
  }

  /**
   * The rows to draw: pages, their content structure and the add rows
   * closing each level, each with its depth, its ancestors and which
   * indent columns carry a connector line on past it
   */
  _buildEntries() {
    const items = this.items || [];
    const visible = this._visibleItems();
    const byId = new Map(items.map((item) => [item.id, item]));
    const entries = [];
    const stack = [];
    visible.forEach((item, k) => {
      const depth = parseInt(item.indent) || 0;
      stack[depth] = item.id;
      stack.length = depth + 1;
      entries.push({
        kind: "item",
        item,
        index: items.indexOf(item),
        depth,
        anc: stack.slice(),
      });
      if (!this.hideContentOps && item.showContent) {
        entries.push({
          kind: "contents",
          item,
          depth: depth + 1,
          anc: stack.slice(),
        });
      }
      if (this.hideAddRows) {
        return;
      }
      const next = visible[k + 1];
      const nextDepth = next ? parseInt(next.indent) || 0 : -1;
      for (let d = depth; d > nextDepth; d--) {
        const parentId = d ? stack[d - 1] : null;
        const parent = parentId ? byId.get(parentId) : null;
        if (parent && parent.metadata && parent.metadata.locked) {
          continue;
        }
        entries.push({
          kind: "add",
          depth: d,
          parentId,
          anc: stack.slice(0, d),
        });
      }
    });
    if (!visible.length && !this.hideAddRows) {
      entries.push({ kind: "add", depth: 0, parentId: null, anc: [] });
    }
    // which columns continue below each entry: a later entry sits at that
    // depth before anything shallower closes the column
    const flag = [];
    for (let k = entries.length - 1; k >= 0; k--) {
      const D = entries[k].depth;
      entries[k].cont = flag.slice(0, D + 1);
      flag[D] = true;
      for (let d = D + 1; d < flag.length; d++) {
        flag[d] = false;
      }
    }
    return entries;
  }

  // the sibling group a column belongs to: its parent id and depth
  _groupKey(anc, depth) {
    return `${depth ? anc[depth - 1] : "root"}|${depth}`;
  }

  _hl(group) {
    return (this._dropTarget && this._dropTarget.group === group) ||
      this._flashGroup === group
      ? "hl"
      : "";
  }

  // a view-transition-name for a row part, valid as a CSS ident
  _vtName(kind, id) {
    return `od-${kind}-${String(id).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  }

  _renderCols(entry, mode) {
    const cols = [];
    for (let d = 1; d <= entry.depth; d++) {
      const g = this._groupKey(entry.anc, d);
      const cont = entry.cont[d];
      if (mode === "contents" && d === entry.depth) {
        // the page's own column: each content row branches off a line
        // running down from the page, which stops at the last one
        cols.push(
          html`<span class="col"
            ><i class="ln top"></i><i class="ln tick"></i
            ><i class="ln bot content-bot"></i
          ></span>`,
        );
      } else if (d < entry.depth || mode === "contents") {
        cols.push(
          html`<span class="col"
            >${cont
              ? html`<i class="ln full ${this._hl(g)}"></i>`
              : nothing}</span
          >`,
        );
      } else {
        cols.push(
          html`<span class="col"
            ><i class="ln top ${this._hl(g)}"></i
            ><i class="ln tick ${this._hl(g)}"></i>${cont && mode === "item"
              ? html`<i class="ln bot ${this._hl(g)}"></i>`
              : nothing}</span
          >`,
        );
      }
    }
    return html`<span class="cols" aria-hidden="true">${cols}</span>`;
  }

  _renderEntry(entry) {
    if (entry.kind === "contents") {
      return this.renderItemContents(
        entry.item,
        this._renderCols(entry, "contents"),
      );
    }
    if (entry.kind === "add") {
      const parent = entry.parentId
        ? this.items.find((i) => i.id === entry.parentId)
        : null;
      const label = parent
        ? this.t.addPageIn.replace("{title}", () => parent.title)
        : this.t.addPage;
      const g = this._groupKey(entry.anc, entry.depth);
      return html`<li
        class="add-row"
        role="none"
        aria-hidden="true"
        title="${label}"
        data-add-parent="${entry.parentId || ""}"
        data-add-depth="${entry.depth}"
        style="${this._vtActive
          ? `view-transition-name:${this._vtName(
              "a",
              `${entry.parentId || "root"}-${entry.depth}`,
            )};view-transition-class:od-row`
          : ""}"
        @click="${() => this._addInGroup(entry.parentId)}"
      >
        ${this._renderCols(entry, "add")}
        <span class="toggle"
          ><span class="leaf ${this._hl(g)}"></span
          ><span class="plus"
            ><simple-icon-lite icon="add"></simple-icon-lite></span
        ></span>
        <span class="add-label">${label}</span>
      </li>`;
    }
    return this.renderItem(entry.item, entry.index, {
      cols: this._renderCols(entry, "item"),
      group: this._groupKey(entry.anc, entry.depth),
    });
  }
  hasDeletedItems() {
    if (this.items.find((item) => item.delete == true)) {
      return true;
    }
    return false;
  }
  toggleDelete(_e) {
    this.hideDelete = !this.hideDelete;
  }

  renderActiveContentItem(activeItemContentNode, targetNodeIndex) {
    if (activeItemContentNode && targetNodeIndex != -1) {
      let item = this.items.find(
        (item) =>
          item.id ===
          activeItemContentNode.getAttribute("data-content-parent-id"),
      );
      // should have contents but verify
      // a stale preview node can point at an item that is no longer in the
      // tree, so guard the find result before reading contents off it
      if (item && item.contents) {
        let div = globalThis.document.createElement("div");
        div.innerHTML = item.contents;
        // walk up to the index in question
        for (let i = 0; i < div.childNodes.length; i++) {
          let node = div.childNodes[i];
          if (i === targetNodeIndex) {
            // security (JS-XSS-001): full sanitizer (also strips on* handlers
            // and javascript: URLs), not just script encapsulation
            return html`${unsafeHTML(sanitizeHTMLString(node.outerHTML))}`;
          }
        }
      }
    }
  }

  setActiveItemForActions(e) {
    this.activeItemForActions = e.target
      .closest("[data-item-id]")
      .getAttribute("data-item-id");
  }

  handleItemClick(e) {
    const target = e.target.closest("[data-item-id]");
    if (!target) return;

    const itemId = target.getAttribute("data-item-id");

    if (e.ctrlKey || e.metaKey) {
      this.togglePageSelection(itemId);
    } else if (e.shiftKey && this.activePage) {
      this.selectPageRange(this.activePage, itemId);
    } else {
      if (
        !e.target.closest("simple-toolbar-button") &&
        !e.target.closest("simple-icon-button-lite") &&
        !e.target.closest("button") &&
        !e.target.closest(".label-edit")
      ) {
        this.activePage = itemId;
        this._focusId = itemId;
        this.requestUpdate();
      }
    }
  }
  togglePageSelection(itemId) {
    const index = this.selectedPages.indexOf(itemId);
    if (index > -1) {
      this.selectedPages.splice(index, 1);
    } else {
      this.selectedPages.push(itemId);
    }
    this.activePage = itemId;
    this.requestUpdate();
  }

  selectPageRange(startId, endId) {
    const startIndex = this.items.findIndex((item) => item.id === startId);
    const endIndex = this.items.findIndex((item) => item.id === endId);

    if (startIndex === -1 || endIndex === -1) return;

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    this.selectedPages = [];
    for (let i = minIndex; i <= maxIndex; i++) {
      if (this.getItemParentsCollapsed(this.items[i]) === "") {
        this.selectedPages.push(this.items[i].id);
      }
    }
    this.requestUpdate();
  }

  deleteSelected() {
    this.selectedPages.forEach((pageId) => {
      const index = this.items.findIndex((item) => item.id === pageId);
      if (index !== -1 && !this.isLocked(index)) {
        this.items[index].delete = true;
        if (this.hasChildren(this.items[index].id)) {
          this.recurseAction(this.items[index].id, "delete", true);
        }
      }
    });
    this.selectedPages = [];
    // a preview of deleted content cannot linger into the next render
    this.resetPopOver();
    this.__syncUIAndDataModel();
  }

  /**
   * Row density: compact, default or roomy. Rows reflow at the new height
   * (zoom used to scale them, which left the layout box behind). The
   * choice is remembered per browser.
   */
  setDensity(density) {
    if (!DENSITIES.includes(density)) {
      return;
    }
    this.density = density;
    try {
      globalThis.localStorage.setItem(DENSITY_KEY, density);
    } catch {
      // storage can be blocked; the choice still applies until reload
    }
  }

  _toggleActionsMenu(e, _index) {
    e.stopPropagation();
    const button = e.target.closest("button") || e.target;
    const listItem = button.closest("li");
    const menu = listItem.querySelector(".actions-menu");
    if (menu) {
      menu.toggle(button);
    }
  }

  // Shift+F10, the context menu key or a right click
  _openActionsMenu(listItem) {
    if (!listItem) return;
    const menu = listItem.querySelector(".actions-menu");
    if (menu && !menu.open) {
      menu.openMenu(listItem.querySelector(".actions-menu-button") || listItem);
    }
  }

  _onContextMenu(e) {
    // on touch a hold picks the row up for dragging (the ⋯ button has the
    // actions), and phones raise this event for that same hold, sometimes
    // after the finger has lifted
    if (this._press || this._drag || this._recentTouch()) {
      e.preventDefault();
      return;
    }
    const listItem = e.target.closest("li[data-item-id]");
    if (!listItem || e.target.closest(".label-edit.shown")) return;
    e.preventDefault();
    this._openActionsMenu(listItem);
  }

  // focus goes back to the row when its menu closes without moving it
  _onMenuClosed(e) {
    const listItem = e.target.closest("li[data-item-id]");
    if (!listItem) return;
    const itemId = listItem.getAttribute("data-item-id");
    setTimeout(() => {
      const active = this.shadowRoot.activeElement;
      if (
        !active ||
        active === listItem ||
        (active.closest && active.closest(".actions-menu"))
      ) {
        this.focusItem(itemId);
      }
    }, 0);
  }

  _handleMenuAction(e, index, action) {
    e.stopPropagation();
    const button = e.target;
    const listItem = button.closest("li");
    const menu = listItem.querySelector(".actions-menu");
    if (menu) menu.close();

    if (action === "edit-title" && index !== false) {
      // Trigger edit mode for the title
      const labelElement = listItem.querySelector(".label.shown");
      if (labelElement && !this.isLocked(index)) {
        this.editTitle({ target: labelElement });
      }
    } else if (action === "add-child" && index !== false) {
      this.addChildItem(index);
    } else if (action === "content" && index !== false) {
      this.toggleContent({ target: listItem });
    } else if (
      ["up", "down", "in", "out"].includes(action) &&
      index !== false
    ) {
      this._moveByKeyboard(index, action, { fromMenu: true });
    } else if (action === "add" && index !== false) {
      this._addAfterAndEdit(index);
    } else if (action === "duplicate" && index !== false) {
      this._duplicate(index);
    } else if (action === "delete" && index !== false) {
      this._toggleDelete(index);
    } else if (action === "lock" && index !== false) {
      this._toggleLock(index);
    } else if (action && index !== false) {
      this.itemOp(index, action);
    }
  }
  renderItem(item, index, ctx = {}) {
    const hasKids = this.hasChildren(item.id);
    const collapsed = hasKids && this.isCollapsed(item.id);
    const locked = this.isLocked(index);
    const hiddenCount = collapsed ? this._countAllDescendants(item.id) : 0;
    const current = !!this.activeId && this.activeId === item.id;
    const selected = this.selectedPages.includes(item.id);
    const drag = this._drag;
    const dt = this._dropTarget;
    const pressing = this._press && this._press.id === item.id;
    // only the siblings that are drawn count toward size and position
    const siblings = this.items.filter(
      (i) => i.parent === item.parent && !(this.hideDelete && i.delete),
    );
    const group = ctx.group || "";
    // the name starts with what the row shows (title, then its pills in
    // order) so the visible text is part of it, then the rest
    const states = [];
    if (item.new) states.push(this.t.newBadge);
    if (item.delete) states.push(this.t.deletingBadge);
    if (current) states.push(this.t.currentPage);
    if (item.modified) states.push(this.t.modified);
    if (locked) states.push(this.t.locked);
    if (hiddenCount) {
      states.push(this.t.hiddenSubpages.replace("{count}", () => hiddenCount));
    }
    return html`
      <li
        role="treeitem"
        tabindex="${this._rovingId() === item.id ? "0" : "-1"}"
        aria-label="${item.title}${states.length
          ? `, ${states.join(", ")}`
          : ""}"
        aria-expanded="${hasKids ? (collapsed ? "false" : "true") : nothing}"
        aria-level="${parseInt(item.indent) + 1}"
        aria-setsize="${siblings.length}"
        aria-posinset="${siblings.indexOf(item) + 1}"
        aria-selected="${selected ? "true" : "false"}"
        @keydown="${this.handleTreeItemKeydown}"
        @mouseenter="${this.setActiveItemForActions}"
        @click="${this.handleItemClick}"
        @contextmenu="${this._onContextMenu}"
        class="item indent-${item.indent < 20 ? item.indent : 20} ${!this
          .hideContentOps && item.showContent
          ? "content-open"
          : ""} ${item.modified
          ? "modified"
          : ""} ${this.getItemParentsCollapsed(item)} ${this.activePage ===
        item.id
          ? "active-page"
          : ""} ${selected ? "selected-page" : ""} ${locked
          ? "locked"
          : ""} ${current ? "current-page" : ""} ${dt &&
        dt.zone === "child" &&
        dt.targetId === item.id
          ? "drop-target-child"
          : ""} ${pressing ? "pressing" : ""} ${this._nudgeId === item.id
          ? "nudging"
          : ""}"
        style="${[
          pressing ? `--outline-designer-press-ms:${this._press.holdMs}ms` : "",
          this._vtActive
            ? `view-transition-name:${this._vtName("r", item.id)};view-transition-class:od-row`
            : "",
        ]
          .filter(Boolean)
          .join(";")}"
        data-item-id="${item.id}"
        @focusin="${this._onItemFocusIn}"
        data-parents="${this.getItemParents(item)}"
        ?data-has-children="${hasKids}"
        ?data-about-to-delete="${item.delete}"
        ?data-dragging="${!!drag && drag.ids.has(item.id)}"
        typeof="oer:TableOfContentsEntry"
        property="oer:entry"
      >
        <meta property="oer:forComponent" content="${item.id}" />
        ${ctx.cols || nothing}
        <span class="toggle">
          ${hasKids
            ? html`<button
                type="button"
                class="collapse-btn ${this._hl(group)}"
                tabindex="-1"
                aria-hidden="true"
                ?disabled="${locked}"
                title="${collapsed
                  ? this.t.expandChildren
                  : this.t.collapseChildren}"
                @click="${this._onChevronClick}"
              >
                <simple-icon-lite
                  icon="${collapsed
                    ? "hardware:keyboard-arrow-right"
                    : "hardware:keyboard-arrow-down"}"
                ></simple-icon-lite>
              </button>`
            : html`<span class="leaf ${this._hl(group)}"></span>`}
        </span>
        <span class="grip" aria-hidden="true" title="${this.t.dragToReorder}"
          ><simple-icon-lite icon="icons:reorder"></simple-icon-lite
        ></span>
        <span
          class="title"
          style="${this._vtActive && !this._vtPlain.has(item.id)
            ? `view-transition-name:${this._vtName("t", item.id)};view-transition-class:od-title`
            : ""}"
        >
          <span
            class="label shown"
            ?disabled="${locked}"
            @dblclick="${this.editTitle}"
            @keydown="${this.handleLabelKeydown}"
            property="oer:title"
            >${item.title}</span
          >
          <span
            class="label-edit"
            @blur="${this.blurTitle}"
            @keydown="${this.monitorEsc}"
          ></span>
          ${item.modified && !item.new
            ? html`<span
                class="modified-dot"
                title="${this.t.modified}"
              ></span>`
            : nothing}
          ${locked
            ? html`<simple-icon-lite
                class="lock-icon"
                icon="icons:lock"
                title="${this.t.lock}"
              ></simple-icon-lite>`
            : nothing}
        </span>
        ${item.new
          ? html`<span class="hax-ui-pill" data-tone="success"
              >${this.t.newBadge}</span
            >`
          : nothing}
        ${item.delete
          ? html`<span class="hax-ui-pill" data-tone="danger"
              >${this.t.deletingBadge}</span
            >`
          : nothing}
        ${current
          ? html`<span class="hax-ui-pill" data-tone="accent"
              >${this.t.currentPage}</span
            >`
          : nothing}
        ${hiddenCount
          ? html`<span
              class="hax-ui-pill"
              title="${this.t.hiddenSubpages.replace(
                "{count}",
                () => hiddenCount,
              )}"
              >${hiddenCount}</span
            >`
          : nothing}
        <button
          type="button"
          class="act content-toggle-btn"
          tabindex="-1"
          aria-hidden="true"
          aria-pressed="${item.showContent ? "true" : "false"}"
          ?hidden="${this.hideContentOps ||
          item.contents === "" ||
          !item.contents}"
          ?disabled="${locked}"
          title="${this.t.contentStructure}"
          @click="${this.toggleContent}"
        >
          <simple-icon-lite icon="editor:insert-drive-file"></simple-icon-lite>
        </button>
        <span class="trail">
          ${locked
            ? nothing
            : html`<button
                type="button"
                class="act add-child-btn"
                tabindex="-1"
                aria-hidden="true"
                title="${this.t.addSubpage}"
                @click="${(e) => {
                  e.stopPropagation();
                  this.addChildItem(index);
                }}"
              >
                <simple-icon-lite icon="add"></simple-icon-lite>
              </button>`}
          <button
            type="button"
            class="act actions-menu-button"
            tabindex="-1"
            aria-hidden="true"
            title="${this.t.pageActions}"
            @click="${(e) => this._toggleActionsMenu(e, index)}"
          >
            <simple-icon-lite icon="icons:more-horiz"></simple-icon-lite>
          </button>
        </span>
        ${this._nudgeId === item.id ? this._renderNudge(item, index) : nothing}
        <simple-context-menu
          class="actions-menu"
          data-item-index="${index}"
          title="${this.t.pageActions}"
          @simple-context-menu-closed="${this._onMenuClosed}"
        >
          <simple-toolbar-button
            value="up"
            ?disabled="${locked}"
            icon="icons:arrow-upward"
            label="${this.t.moveUp}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "up")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="down"
            ?disabled="${locked}"
            icon="icons:arrow-downward"
            label="${this.t.moveDown}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "down")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="in"
            ?disabled="${locked}"
            icon="hax:outline-designer-indent"
            label="${this.t.indent}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "in")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="out"
            ?disabled="${locked}"
            icon="hax:outline-designer-outdent"
            label="${this.t.outdent}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "out")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="edit-title"
            ?disabled="${locked}"
            icon="editor:mode-edit"
            label="${this.t.editTitle}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "edit-title")}"
            autofocus
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="add"
            ?disabled="${locked}"
            icon="hax:add-page"
            label="${this.t.addPage}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "add")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="add-child"
            ?disabled="${locked}"
            icon="hax:add-child-page"
            label="${this.t.addSubpage}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "add-child")}"
          ></simple-toolbar-button>
          ${this.hideContentOps || !item.contents
            ? nothing
            : html`<simple-toolbar-button
                value="content"
                ?disabled="${locked}"
                icon="editor:insert-drive-file"
                label="${this.t.contentStructure}"
                show-text-label
                @click="${(e) => this._handleMenuAction(e, index, "content")}"
              ></simple-toolbar-button>`}
          <simple-toolbar-button
            value="duplicate"
            ?disabled="${locked}"
            icon="content-copy"
            label="${this.t.duplicate}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "duplicate")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="goto"
            icon="open-in-browser"
            label="${this.t.goToPage}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "goto")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="lock"
            icon="${locked ? "icons:lock" : "icons:lock-open"}"
            label="${locked ? this.t.unlock : this.t.lock}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "lock")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            class="delete-button"
            value="delete"
            ?disabled="${locked}"
            icon="${item.delete ? "icons:restore" : "icons:delete"}"
            label="${item.delete ? this.t.restore : this.t.delete}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "delete")}"
          ></simple-toolbar-button>
        </simple-context-menu>
      </li>
    `;
  }
  hasContents(item) {
    if (item.contents && item.contents != "") {
      return true;
    }
    return false;
  }

  renderItemContents(item, cols = nothing) {
    let render = [this.itemContentsOperations(item, cols)];
    if (item.contents) {
      let div = globalThis.document.createElement("div");
      div.innerHTML = item.contents;
      let activeHeadingDepth = 1;
      let modifier = 0;
      div.childNodes.forEach((node, index) => {
        // increase the indent addition to match the activeheading depth
        // this way h1 gets all things below it indented 1 more level
        // while things 4 in get indented 4.
        modifier = 0;
        if (
          ["h1", "h2", "h3", "h4", "h5", "h6"].includes(
            node.tagName.toLowerCase(),
          )
        ) {
          activeHeadingDepth = parseInt(
            node.tagName.toLowerCase().replace("h", ""),
          );
          // this ensures when we drop a level that the item itself is NOT
          // rendered a level below where it should be
          modifier = -1;
        }
        render.push(
          this.renderNodeAsItem(
            node,
            index,
            item,
            parseInt(item.indent) + activeHeadingDepth + modifier,
            cols,
            index === div.childNodes.length - 1,
          ),
        );
      });
    }
    return render;
  }
  // support very, very, very basic content adding
  itemContentsOperations(item, cols = nothing) {
    // nothing to offer: no row (an empty one only left a gap)
    if (!this.haxGizmos || !this.haxGizmos.length) {
      return nothing;
    }
    return html` <li
      role="treeitem"
      aria-level="${parseInt(item.indent) + 2}"
      tabindex="-1"
      class="content-adding-operations indent-${item.indent < 20
        ? item.indent
        : 20}"
      data-item-for-content-id="${item.id}"
      ?data-contents-collapsed="${!item.showContent}"
      ?data-about-to-delete="${item.delete}"
      ?hidden="${this.hideDelete && item.delete}"
    >
      ${cols}
      ${this.haxGizmos.map(
        (gizmo) => html`
          <simple-icon-button-lite
            class="operation"
            icon="${gizmo.icon}"
            value="${gizmo.tag}"
            label="${this.t.addContentType.replace(
              "{title}",
              () => gizmo.title,
            )}"
            @click="${this.prependNodeToContent}"
            >${this.t.addContentType.replace(
              "{title}",
              () => gizmo.title,
            )}</simple-icon-button-lite
          >
        `,
      )}
    </li>`;
  }
  // add content to the top of the item in question
  prependNodeToContent(e) {
    let itemId = e.target
      .closest("[data-item-for-content-id]")
      .getAttribute("data-item-for-content-id");
    this.items.map((item, index) => {
      if (item.id === itemId && e.target.value) {
        // @todo add support for surfacing these options from the HAX schema
        // could be something like a gizmo.metadata.outlineDesigner = true flag
        let schema = HAXStore.haxSchemaFromTag(e.target.value);
        let node;
        if (
          schema.gizmo &&
          schema.gizmo.tag &&
          schema.demoSchema &&
          schema.demoSchema[0]
        ) {
          node = haxElementToNode(schema.demoSchema[0]);
        } else {
          // fall back to the clicked gizmo tag
          node = globalThis.document.createElement(e.target.value);
        }
        this.items[index].contents = node.outerHTML + item.contents;
        this.resetPopOver();
        this.__syncUIAndDataModel();
      }
    });
  }
  // render a content node within an item
  renderNodeAsItem(node, index, item, indent, cols = nothing, last = false) {
    let tagName = node.tagName.toLowerCase();
    let icon = "hax:bricks";
    let label = tagName;
    let part = "non-heading";
    let schema = HAXStore.haxSchemaFromTag(tagName);
    if (schema && schema.gizmo) {
      icon = schema.gizmo.icon;
      label = schema.gizmo.title;
      // headings we want to render the title as it can become a full page
      switch (tagName) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          label = node.innerText;
          part = "heading";
          break;
      }
    }
    // a child of its page in the tree, one level below it, outside the
    // arrow-key page navigation (tabindex -1)
    return html` <li
      role="treeitem"
      aria-level="${parseInt(item.indent) + 2}"
      aria-label="${this.t.contentOfPage
        .replace("{content}", () =>
          part === "heading" ? `${this.t.headingLabel}: ${label}` : label,
        )
        .replace("{title}", () => item.title)}"
      tabindex="-1"
      class="content-child content-${part} indent-${indent < 20
        ? indent
        : 20} ${last ? "last" : ""}"
      data-node-index="${index}"
      data-content-parent-id="${item.id}"
      ?data-contents-collapsed="${!item.showContent}"
      ?data-about-to-delete="${item.delete}"
      ?hidden="${this.hideDelete && item.delete}"
    >
      ${cols}
      <div class="btn-contrast">
        <simple-icon-button-lite
          icon="${icon}"
          title="${this.t.clickToPreview}"
          @click="${this.setActivePreview}"
        ></simple-icon-button-lite>
      </div>
      ${part === "heading"
        ? html`
            <span
              class="label shown"
              ?disabled="${item.metadata.locked}"
              @dblclick="${this.editTitle}"
              >${label}</span
            >
            <span class="label-edit" @keydown="${this.monitorEsc}"></span>
          `
        : html`<span class="label shown">${label}</span>`}
      <div class="content-operations">
        <simple-icon-button-lite
          class="content-operation"
          icon="hax:outline-designer-outdent"
          @click="${(e) => this.modifyContentAction(e, item, "in")}"
          title="${this.t.increaseHeading}"
          ?disabled="${tagName === "h1" || item.metadata.locked}"
          ?hidden="${part !== "heading"}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          icon="hax:keyboard-arrow-up"
          @click="${(e) => this.modifyContentAction(e, item, "up")}"
          title="${this.t.moveUp}"
          ?disabled="${item.metadata.locked}"
          class="content-operation"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          icon="hax:keyboard-arrow-down"
          @click="${(e) => this.modifyContentAction(e, item, "down")}"
          title="${this.t.moveDown}"
          ?disabled="${item.metadata.locked}"
          class="content-operation"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="content-operation"
          icon="hax:outline-designer-indent"
          @click="${(e) => this.modifyContentAction(e, item, "out")}"
          title="${this.t.decreaseHeading}"
          ?disabled="${tagName === "h6" || item.metadata.locked}"
          ?hidden="${part !== "heading"}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="content-operation"
          icon="editor:format-page-break"
          @click="${(e) => this.pageBreakHere(e, item)}"
          title="${this.t.promoteToPage}"
          ?disabled="${item.metadata.locked}"
          ?hidden="${part !== "heading"}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          icon="delete"
          @click="${(e) => this.modifyContentAction(e, item, "delete")}"
          class="content-operation del"
          title="${this.t.delete}"
          ?disabled="${item.metadata.locked}"
          accent-color="red"
        ></simple-icon-button-lite>
      </div>
    </li>`;
  }
  // preview of the item in question
  setActivePreview(e) {
    let target = e.target.closest("[data-content-parent-id]");
    let targetNodeIndex = parseInt(target.getAttribute("data-node-index"));
    this.activePreview = target;
    this.shadowRoot.querySelector("simple-popover").removeAttribute("hidden");
    // set target so it points to our current item
    this.shadowRoot.querySelector("simple-popover").target = target;
    this.activePreviewIndex = targetNodeIndex;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  // ability to mod the content to move heading up or down between h1 and h6
  modifyContentAction(e, item, action) {
    if (!item.metadata.locked) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // Take UI index and split at that dom node by recreating
      // the structure. Bonkers.
      let target = e.target.closest("[data-content-parent-id]");
      let itemId = target.getAttribute("data-content-parent-id");
      let targetNodeIndex = parseInt(target.getAttribute("data-node-index"));
      let item = this.items.find((item) => item.id === itemId);
      // should have contents but verify
      if (item.contents) {
        let div = globalThis.document.createElement("div");
        div.innerHTML = item.contents;
        let content = "";
        // up / down require reorganization prior to html calculation
        switch (action) {
          case "up":
            if (targetNodeIndex !== 0) {
              div.childNodes[
                targetNodeIndex
              ].previousElementSibling.insertAdjacentElement(
                "beforebegin",
                div.childNodes[targetNodeIndex],
              );
            }
            break;
          case "down":
            if (targetNodeIndex !== div.childNodes.length - 1) {
              div.childNodes[
                targetNodeIndex
              ].nextElementSibling.insertAdjacentElement(
                "afterend",
                div.childNodes[targetNodeIndex],
              );
            }
            break;
        }
        // walk up to the index in question
        for (let i = 0; i < div.childNodes.length; i++) {
          let node = div.childNodes[i];
          // so long as index is LOWER than the target, this is original item content
          if (i < targetNodeIndex) {
            content += node.outerHTML;
          } else if (i === targetNodeIndex) {
            switch (action) {
              case "delete":
                // do nothing as we skip this, effectively deleting it
                this.setAttribute("stop-animation", "true");
                break;
              case "up":
              case "down":
                // up and down happen prior to here
                content += node.outerHTML;
                break;
              case "in":
              case "out": {
                // heading to modify
                let hlevel = parseInt(
                  node.tagName.toLowerCase().replace("h", ""),
                );
                let h;
                if (action === "in" && hlevel > 1) {
                  h = globalThis.document.createElement(`h${hlevel - 1}`);
                } else if (action === "out" && hlevel < 6) {
                  h = globalThis.document.createElement(`h${hlevel + 1}`);
                } else {
                  // blocked operation
                  h = node;
                }
                if (h !== node) {
                  // carry the existing attributes (ids, anchor links) onto the
                  // rebuilt heading so a level change does not drop them
                  for (let i = 0; i < node.attributes.length; i++) {
                    h.setAttribute(
                      node.attributes[i].name,
                      node.attributes[i].value,
                    );
                  }
                  h.innerText = node.innerText;
                }
                content += h.outerHTML;
                break;
              }
            }
          } else {
            content += node.outerHTML;
          }
        }
        item.contents = content;
        this.resetPopOver();
        this.__syncUIAndDataModel();
      }
    }
  }

  // split page to make another one at the heading level
  pageBreakHere(e, item) {
    if (!item.metadata.locked) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // Take UI index and split at that dom node by recreating
      // the structure. Bonkers.
      let target = e.target.closest("[data-content-parent-id]");
      let itemId = target.getAttribute("data-content-parent-id");
      let targetNodeIndex = parseInt(target.getAttribute("data-node-index"));
      let item = this.items.find((item) => item.id === itemId);
      let targetItemIndex;
      this.items.map((item, index) =>
        item.id === itemId ? (targetItemIndex = index) : null,
      );
      // should have contents but verify
      if (item.contents) {
        let div = globalThis.document.createElement("div");
        div.innerHTML = item.contents;
        let oldContent = "";
        let newContent = "";
        let title = this.t.newPage;
        // walk up to the index in question
        for (let i = 0; i < div.childNodes.length; i++) {
          let node = div.childNodes[i];
          // so long as index is LOWER than the target, this is original item content
          if (i < targetNodeIndex) {
            oldContent += node.outerHTML;
          } else if (i === targetNodeIndex) {
            if (node.innerText !== "") {
              title = node.innerText;
            }
          } else {
            newContent += node.outerHTML;
          }
        }
        item.contents = oldContent;
        // create a new item
        let newItem = new JSONOutlineSchemaItem();
        newItem.title = title;
        // slug and location NOT set because backend will fill these in
        newItem.order = item.order + 1;
        newItem.parent = item.parent;
        newItem.indent = item.indent;
        newItem.metadata.locked = false;
        newItem.new = true;
        newItem.contents = newContent;
        // set modified on targetItemIndex
        this.items[targetItemIndex].modified = true;
        // splice back into the items array just below where we issued the split
        this.items.splice(targetItemIndex + 1, 0, newItem);
        this.resetPopOver();
        this.__syncUIAndDataModel();
      }
    }
  }
  // common update
  __syncUIAndDataModel() {
    this._recurseUpdateIndent();
    this._schemaOrderUpdate();
    // delay ensures array data is updated in prior execution loop
    setTimeout(() => {
      this.requestUpdate();
      // if animation was stopped, unset it
      setTimeout(() => {
        this.removeAttribute("stop-animation");
      }, 300);
    }, 0);
  }

  collapseAll() {
    this.items.map((item, index) => {
      if (this.hasChildren(item.id) && !item.collapsed) {
        this.items[index].collapsed = true;
      }
    });
    setTimeout(() => {
      this.requestUpdate();
    }, 0);
  }
  expandAll() {
    this.items.map((item, index) => {
      if (this.hasChildren(item.id) && item.collapsed) {
        this.items[index].collapsed = false;
      }
    });
    setTimeout(() => {
      this.requestUpdate();
    }, 0);
  }

  getItemParents(activeItem) {
    let parent = this.items.find((item) => item.id == activeItem.parent);
    let list = "";
    while (parent) {
      list += parent.id + " ";
      parent = this.items.find((item) => item.id == parent.parent);
    }
    return list;
  }
  // generate a class that includes all collapsed parents
  // based on the statefulness of that data
  getItemParentsCollapsed(activeItem) {
    let parent = this.items.find((item) => item.id == activeItem.parent);
    let list = "";
    while (parent) {
      if (parent.collapsed && parent.id) {
        list += `collapsed-by-${parent.id}` + " ";
      }
      parent = this.items.find((item) => item.id == parent.parent);
    }
    return list;
  }

  isCollapsed(itemId) {
    let item = this.items.find((item) => item.id == itemId);
    if (item.collapsed) {
      return true;
    }
    return false;
  }

  hasChildren(itemId) {
    let children = this.items.find((item) => item.parent == itemId);
    if (children) {
      return true;
    }
    return false;
  }
  collapseExpand(e) {
    let itemId = e.target
      .closest("[data-item-id]")
      .getAttribute("data-item-id");
    // find the item and act on it's index to toggle content collapse status
    this.items.map((item, index) => {
      if (item.id === itemId && !this.isLocked(index)) {
        if (this.items[index].collapsed) {
          this.items[index].collapsed = false;
        } else {
          this.items[index].collapsed = true;
        }
        this.requestUpdate();
      }
    });
  }

  toggleContent(e) {
    let target = e.target.closest("[data-item-id]");
    // prevent if we are in a disabled state
    if (target && !e.target.disabled) {
      let itemId = target.getAttribute("data-item-id");
      // find the item and act on it's index to toggle content collapse status
      this.items.map((item, index) => {
        if (item.id === itemId) {
          if (this.items[index].showContent) {
            this.items[index].showContent = false;
          } else {
            this.items[index].showContent = true;
          }
        }
      });
      this.requestUpdate();
    }
  }

  editTitle(e) {
    e.target.classList.remove("shown");
    let target = e.target.nextElementSibling;
    target.setAttribute("contenteditable", "true");
    target.classList.add("shown");
    target.innerText = e.target.innerText;
    target.focus();
    // get the selection and select all
    if (this.shadowRoot.getSelection) {
      let range = globalThis.document.createRange();
      range.selectNodeContents(target);
      this.shadowRoot.getSelection().removeAllRanges();
      this.shadowRoot.getSelection().addRange(range);
    }
    // deprecated but best we got
    else {
      try {
        globalThis.document.execCommand("selectAll", false, null);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  monitorTitle(e) {
    if (e.key === "Enter") {
      e.target.classList.remove("shown");
      e.target.previousElementSibling.classList.add("shown");
      // capture the text BEFORE removing the attribute; Chromium rolls
      // the focused editing host back to its pre-edit text once the
      // contenteditable attribute comes off the element
      let title = e.target.innerText;
      e.target.removeAttribute("contenteditable");
      let itemId = e.target
        .closest("[data-item-id]")
        .getAttribute("data-item-id");
      for (let index = 0; index < this.items.length; index++) {
        if (this.items[index].id === itemId && title != "") {
          if (!this.items[index].new) {
            this.items[index].modified = true;
          }
          this.items[index].title = title;
        }
      }
      this.requestUpdate();
    }
  }

  monitorHeading(e) {
    if (e.key === "Enter") {
      e.target.classList.remove("shown");
      e.target.previousElementSibling.classList.add("shown");
      e.target.removeAttribute("contenteditable");
      let target = e.target.closest("[data-content-parent-id]");
      let itemId = target.getAttribute("data-content-parent-id");
      let targetNodeIndex = parseInt(target.getAttribute("data-node-index"));
      let item = this.items.find((item) => item.id === itemId);
      // should have contents but verify
      if (item.contents) {
        let div = globalThis.document.createElement("div");
        div.innerHTML = item.contents;
        let content = "";
        // walk up to the index in question
        for (let i = 0; i < div.childNodes.length; i++) {
          let node = div.childNodes[i];
          // so long as index is LOWER than the target, this is original item content
          if (i < targetNodeIndex) {
            content += node.outerHTML;
          } else if (i === targetNodeIndex) {
            node.innerText = e.target.innerText;
            content += node.outerHTML;
          } else {
            content += node.outerHTML;
          }
        }
        item.contents = content;
        this.resetPopOver();
        this.requestUpdate();
      }
    }
  }

  monitorEsc(e) {
    if (e.key === "Escape") {
      e.target.classList.remove("shown");
      e.target.removeAttribute("contenteditable");
      e.target.previousElementSibling.classList.add("shown");
      e.target.innerText = e.target.previousElementSibling.innerText;
    } else if (e.key === "Enter") {
      // Enter commits the edit through the row's own monitor, folded
      // in here since lit allows only one binding per event name
      e.preventDefault();
      this._blurBlock = true;
      if (e.target.closest("[data-item-id]")) {
        this.monitorTitle(e);
      } else if (e.target.closest("[data-content-parent-id]")) {
        this.monitorHeading(e);
      }
    }
  }
  blurTitle(e) {
    if (!this._blurBlock) {
      e.target.classList.remove("shown");
      e.target.removeAttribute("contenteditable");
      e.target.previousElementSibling.classList.add("shown");
      e.target.innerText = e.target.previousElementSibling.innerText;
    }
    setTimeout(() => {
      this._blurBlock = false;
    }, 0);
  }

  // Handle Enter key on label to activate editing mode
  handleLabelKeydown(e) {
    // Only handle Enter key and prevent if disabled
    if (e.key === "Enter" && !e.target.hasAttribute("disabled")) {
      e.preventDefault();
      e.stopPropagation();
      this.editTitle(e);
      this.announceAction(this.t.titleEditingActivated);
    }
  }

  // Handle keyboard navigation for tree structure
  handleTreeItemKeydown(e) {
    // Only handle navigation keys when focused directly on the tree item
    // Allow other elements (buttons, inputs) to handle their own keyboard events
    if (
      e.target.tagName.toLowerCase() !== "li" ||
      !e.target.hasAttribute("role") ||
      e.isComposing
    ) {
      return;
    }

    const currentItem = e.target;
    const itemId = currentItem.getAttribute("data-item-id");
    const itemIndex = this.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;
    const mod = e.ctrlKey || e.metaKey;
    const moves = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowRight: "in",
      ArrowLeft: "out",
    };
    let handled = true;

    if (e.altKey && !mod && moves[e.key]) {
      // Alt+arrows move the page (with its sub-pages) straight from the row
      this._moveByKeyboard(itemIndex, moves[e.key]);
    } else if ((e.shiftKey && e.key === "F10") || e.key === "ContextMenu") {
      this._openActionsMenu(currentItem);
    } else if (mod && e.key === "Enter") {
      if (e.shiftKey) {
        this.addChildItem(itemIndex);
      } else {
        this._addAfterAndEdit(itemIndex);
      }
    } else if (mod && (e.key === "d" || e.key === "D")) {
      // Keyboard shortcut for duplicate
      this._duplicate(itemIndex);
    } else if (mod && !e.shiftKey && (e.key === "z" || e.key === "Z")) {
      if (this._undo) {
        this.undo();
      } else {
        handled = false;
      }
    } else if (mod || e.altKey) {
      handled = false;
    } else {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp":
          if (e.shiftKey) {
            this._extendSelection(itemIndex, e.key === "ArrowDown" ? 1 : -1);
          } else if (e.key === "ArrowDown") {
            this.focusNextItem(itemIndex);
          } else {
            this.focusPreviousItem(itemIndex);
          }
          break;
        case "ArrowRight":
          if (this.hasChildren(itemId) && this.isCollapsed(itemId)) {
            this._fold(currentItem);
            this.announceStateChange(this.t.expanded);
          } else {
            this.focusFirstChild(itemIndex);
          }
          break;
        case "ArrowLeft":
          if (this.hasChildren(itemId) && !this.isCollapsed(itemId)) {
            this._fold(currentItem);
            this.announceStateChange(this.t.collapsed);
          } else {
            this.focusParent(itemIndex);
          }
          break;
        case "Home":
          this.focusFirstItem();
          break;
        case "End":
          this.focusLastItem();
          break;
        case "Enter":
        case "F2": {
          const label = currentItem.querySelector(".label.shown");
          if (label && !this.isLocked(itemIndex)) {
            this.editTitle({ target: label });
            this.announceAction(this.t.titleEditingActivated);
          } else if (this.isLocked(itemIndex)) {
            this._sayLocked(itemIndex);
          }
          break;
        }
        case " ":
          this.togglePageSelection(itemId);
          this.announceAction(
            this.t.selectedCount.replace(
              "{count}",
              () => this.selectedPages.length,
            ),
          );
          break;
        case "Delete":
        case "Backspace":
          this._toggleDelete(itemIndex);
          break;
        case "Escape":
          if (this._nudgeId) {
            this._hideNudge();
          } else if (this.selectedPages.length) {
            this.selectedPages = [];
            this.announceAction(this.t.selectionCleared);
          } else {
            handled = false;
          }
          break;
        default:
          if (e.key.length === 1 && e.key.trim() !== "" && !e.shiftKey) {
            this._typeAhead(e.key, itemIndex);
          } else {
            handled = false;
          }
      }
    }
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  _sayLocked(index) {
    this.announceAction(
      this.t.isLocked.replace("{title}", () => this.items[index].title),
    );
  }

  /**
   * The page marked for deletion that a page sits in (itself or an
   * ancestor), if any. Saving deletes it and moves any kept page left
   * inside it to the top level, so nothing new may go into it.
   */
  _deletedFrom(id) {
    let item = id ? this.items.find((i) => i.id === id) : null;
    while (item) {
      if (item.delete) return item;
      const parent = item.parent;
      item = parent ? this.items.find((i) => i.id === parent) : null;
    }
    return null;
  }

  // says why a page cannot go there; true when it cannot
  _blockedByDeleted(id) {
    const deleted = this._deletedFrom(id);
    if (deleted) {
      this.announceAction(
        this.t.insideDeleted.replace("{title}", () => deleted.title),
      );
    }
    return !!deleted;
  }

  /* ---------- showing what changed ----------
   * Every change made from the menu, the keyboard, the touch move buttons
   * or a drop goes through _withMotion, so the person can see it happen:
   * rows slide to their new places (a view transition scoped to the tree
   * where the browser supports one, a FLIP slide otherwise), new pages
   * grow in, the page that moved gets a short highlight, the group it
   * joined lights up, and the change can be undone. How much of that
   * shows depends on the input (MOTION): a mouse drag already showed
   * where things went, so mouse stays light; touch gets the most.
   * Reduced motion keeps only a still highlight.
   */
  _modality() {
    if (MOTION[this.motionProfile]) {
      return this.motionProfile;
    }
    return this._lastModality || "mouse";
  }

  _syncModality() {
    this.setAttribute("data-modality", this._modality());
  }

  _reduceMotion() {
    if (this.reducedMotion === "reduce") return true;
    if (this.reducedMotion === "full") return false;
    return !!(
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  _motionMs() {
    const ms = parseFloat(
      getComputedStyle(this).getPropertyValue("--hax-ui-duration-move"),
    );
    return Number.isFinite(ms) && ms > 0 ? ms : 150;
  }

  _motionEasing() {
    const easing = getComputedStyle(this)
      .getPropertyValue("--hax-ui-easing-move")
      .trim();
    return easing || "cubic-bezier(0.2, 0, 0, 1)";
  }

  // let the pending outline sync land and render
  async _settled() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await this.updateComplete;
    await this.updateComplete;
  }

  /**
   * Run a change and show it. run() makes the change and returns
   * { focusId, landed, message, edit, quiet, focusOnly } or false when
   * nothing changed. Options: slide (animate positions), undo (offer
   * undo), nudge (show touch move buttons afterwards), flips (ids of
   * pages that may flip into or out of existence, or between kept and
   * deleted; what actually changed is worked out afterwards), rows
   * (the change adds or removes rows).
   *
   * Changes that keep the same rows run as a view transition scoped to
   * the tree. Chromium aborts a scoped transition when a named row is
   * added or removed during it ("Prepaint layout check failed"), so
   * changes that add or remove rows animate the rows directly instead,
   * as does any transition the browser skips.
   */
  async _withMotion(
    run,
    {
      slide = true,
      undo = false,
      nudge = false,
      flips = [],
      rows = false,
    } = {},
  ) {
    const modality = this._modality();
    const profile = MOTION[modality];
    const reduce = this._reduceMotion();
    const snapshot = undo ? this.items.map((i) => structuredClone(i)) : null;
    const slideOn = slide && !reduce;
    const ms = Math.round(this._motionMs() * profile.slide);
    const growMs = Math.round(this._motionMs() * profile.grow);
    const flipMs = Math.round(this._motionMs() * profile.flip);
    const shownBefore = new Map(
      this._visibleItems().map((i) => [i.id, !!i.delete]),
    );
    const wrap = this.shadowRoot.querySelector(".tree-wrap");
    const useVT =
      slideOn &&
      wrap &&
      typeof wrap.startViewTransition === "function" &&
      !rows &&
      shownBefore.size <= 400;
    let info = null;
    let changes = { appeared: [], left: [], flipped: [] };
    let going = [];
    const apply = async () => {
      info = (await run()) || { changed: false };
      // rows that turned away are let go before the change is drawn
      going.forEach((a) => a.cancel());
      going = [];
      await this._settled();
      if (slideOn && !info.quiet && info.changed !== false) {
        changes = this._whatFlipped(shownBefore);
        if (useVT && changes.appeared.length) {
          // a new page flips in whole, its title with it
          changes.appeared.forEach((id) => this._vtPlain.add(id));
          this.requestUpdate();
          await this.updateComplete;
        }
        if (useVT) this._setFlipRules(changes, ms, flipMs);
      }
      if (info.focusId) {
        this._revealRow(info.focusId, profile.scroll);
      }
    };
    if (useVT) {
      // scoped to the tree: only it is captured and the rest of the
      // page stays usable while the rows move
      this.style.setProperty("--outline-designer-vt-ms", `${ms}ms`);
      this.style.setProperty("--outline-designer-grow-ms", `${growMs}ms`);
      // a change started while another still plays takes over; only the
      // latest one cleans up after itself
      const runId = (this._motionRun = (this._motionRun || 0) + 1);
      this._vtPlain = new Set(flips);
      this._vtActive = true;
      this.requestUpdate();
      await this.updateComplete;
      wrap.classList.add("vt");
      const before = this._rowRects();
      let skipped = false;
      try {
        const transition = wrap.startViewTransition(apply);
        // a skipped transition still runs apply; only the animation is lost
        transition.ready.catch(() => {
          skipped = true;
        });
        await transition.finished;
      } catch {
        skipped = true;
        if (!info) await apply();
      }
      if (this._motionRun === runId) {
        wrap.classList.remove("vt");
        this._clearFlipRules();
        this._vtPlain = new Set();
        this._vtActive = false;
        this.requestUpdate();
        if (skipped) {
          // still show it: slide the rows from where they were
          await this.updateComplete;
          this._flip(before, ms, growMs, {
            flipMs,
            changes,
            quiet: info.quiet,
          });
        }
      }
    } else if (slideOn) {
      // flip the pages that may go first, then slide everything to its
      // new place
      going = await this._flipAway(flips, flipMs);
      const before = this._rowRects();
      await apply();
      this._flip(before, ms, growMs, { flipMs, changes, quiet: info.quiet });
    } else {
      await apply();
    }
    if (snapshot && info && info.changed !== false && info.message) {
      this._offerUndo(snapshot, info.message, info.focusId);
    }
    if (!info || info.changed === false || !info.focusId) {
      const target = info && (info.focusId || info.focusOnly);
      if (target) this.focusItem(target);
      return info;
    }
    if (!info.quiet) {
      const landed = info.landed || [info.focusId];
      this._showLanded(landed, profile, reduce);
      if (profile.flash) {
        const item = this.items.find((i) => i.id === info.focusId);
        if (item) {
          this._flash(
            `${item.parent || "root"}|${parseInt(item.indent) || 0}`,
            profile.flash,
          );
        }
      }
    }
    if (nudge && profile.nudge) {
      this._showNudge(info.focusId);
    }
    if (info.edit) {
      const label = this.shadowRoot.querySelector(
        `[data-item-id="${info.focusId}"] .label.shown`,
      );
      if (label) this.editTitle({ target: label });
    } else {
      this.focusItem(info.focusId);
    }
    return info;
  }

  /**
   * Which rows came into view, left it, or switched between kept and
   * deleted, against the visible rows from before a change
   */
  _whatFlipped(shownBefore) {
    const now = this._visibleItems();
    const nowIds = new Set(now.map((i) => i.id));
    return {
      appeared: now.filter((i) => !shownBefore.has(i.id)).map((i) => i.id),
      left: [...shownBefore.keys()].filter((id) => !nowIds.has(id)),
      flipped: now
        .filter(
          (i) => shownBefore.has(i.id) && shownBefore.get(i.id) !== !!i.delete,
        )
        .map((i) => i.id),
    };
  }

  /**
   * Per-page view transition timing for the pages that flip. Added pages
   * flip down into the gap that opens for them; pages that go flip up
   * and away before the gap closes; a page marked deleted or restored
   * turns over in place to show its other side. Sub-pages follow a beat
   * behind their parent.
   */
  _setFlipRules({ appeared, left, flipped }, ms, flipMs) {
    if (!appeared.length && !left.length && !flipped.length) {
      this._clearFlipRules();
      return;
    }
    if (!this._flipSheet) {
      this._flipSheet = new CSSStyleSheet();
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets,
        this._flipSheet,
      ];
    }
    const ease = "var(--hax-ui-easing-move)";
    const beat = (i) => Math.min(i, 8) * 30;
    const half = Math.round(flipMs / 2);
    const both = (side, id) => {
      const n = this._vtName("r", id);
      return `::view-transition-${side}(${n}),::view-transition-${side}(${n}):only-child`;
    };
    const rules = [];
    appeared.forEach((id, i) => {
      rules.push(
        `${both("new", id)}{animation:outline-designer-flip-in ${flipMs}ms ${ease} ${Math.round(ms * 0.4) + beat(i)}ms both;transform-origin:top center}`,
      );
    });
    let wait = 0;
    left.forEach((id, i) => {
      rules.push(
        `${both("old", id)}{animation:outline-designer-flip-out ${flipMs}ms ease-in ${beat(i)}ms both;transform-origin:top center}`,
      );
      wait = Math.max(wait, beat(i) + Math.round(flipMs * 0.7));
    });
    flipped.forEach((id, i) => {
      rules.push(
        `${both("old", id)}{animation:outline-designer-flip-out ${half}ms ease-in ${beat(i)}ms both;transform-origin:center;mix-blend-mode:normal}`,
        `${both("new", id)}{animation:outline-designer-flip-in ${half}ms ease-out ${half + beat(i)}ms both;transform-origin:center;mix-blend-mode:normal}`,
      );
    });
    if (wait) {
      // the rest close the gap once the leaving pages have turned away
      rules.push(
        `::view-transition-group(*){animation-delay:${wait}ms;animation-fill-mode:both}`,
      );
    }
    this._flipSheet.replaceSync(rules.join("\n"));
  }

  _clearFlipRules() {
    if (this._flipSheet) this._flipSheet.replaceSync("");
  }

  // FLIP fallback: turn away the rows that may go, before the change
  async _flipAway(ids, flipMs) {
    const going = [];
    ids.forEach((id, i) => {
      const li = this.shadowRoot.querySelector(`li.item[data-item-id="${id}"]`);
      if (!li || li.hidden || typeof li.animate !== "function") return;
      going.push(
        li.animate(
          [
            { opacity: 1, transform: "none" },
            {
              opacity: 0,
              transform: "perspective(700px) rotateX(90deg)",
            },
          ],
          {
            duration: Math.round(flipMs / 2),
            delay: Math.min(i, 8) * 30,
            easing: "ease-in",
            fill: "forwards",
          },
        ),
      );
    });
    await Promise.all(going.map((a) => a.finished.catch(() => {})));
    return going;
  }

  // where each visible row is now, for the FLIP fallback
  _rowRects() {
    const rects = new Map();
    this.shadowRoot.querySelectorAll("li.item[data-item-id]").forEach((li) => {
      const title = li.querySelector(".title");
      rects.set(li.getAttribute("data-item-id"), {
        top: li.getBoundingClientRect().top,
        left: (title || li).getBoundingClientRect().left,
      });
    });
    return rects;
  }

  // slide rows from where they were (no view transitions in this browser)
  _flip(
    before,
    ms,
    growMs,
    { flipMs = 0, changes = null, quiet = false } = {},
  ) {
    const easing = this._motionEasing();
    const flipped = new Set(changes ? changes.flipped : []);
    let added = 0;
    this.shadowRoot.querySelectorAll("li.item[data-item-id]").forEach((li) => {
      if (typeof li.animate !== "function") return;
      const id = li.getAttribute("data-item-id");
      const was = before.get(id);
      if (!was) {
        if (flipMs && !quiet) {
          li.animate(
            [
              {
                opacity: 0,
                transform: "perspective(700px) rotateX(-90deg)",
                transformOrigin: "top center",
              },
              { opacity: 1, transform: "none", transformOrigin: "top center" },
            ],
            {
              duration: flipMs,
              delay: Math.round(ms * 0.4) + Math.min(added++, 8) * 30,
              easing,
              fill: "backwards",
            },
          );
        } else {
          li.animate(
            [
              { opacity: 0, transform: "translateY(-35%) scaleY(0.5)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: growMs, easing },
          );
        }
        return;
      }
      if (flipped.has(id)) {
        // the second half of the turn: its other side comes round
        li.animate(
          [
            { opacity: 0, transform: "perspective(700px) rotateX(-90deg)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: Math.round(flipMs / 2), easing: "ease-out" },
        );
      }
      const title = li.querySelector(".title");
      const dy = was.top - li.getBoundingClientRect().top;
      const dx = was.left - (title || li).getBoundingClientRect().left;
      if (dy) {
        li.animate(
          [{ transform: `translateY(${dy}px)` }, { transform: "none" }],
          { duration: ms, easing, composite: "add" },
        );
      }
      if (dx && title) {
        title.animate(
          [{ transform: `translateX(${dx}px)` }, { transform: "none" }],
          { duration: ms, easing },
        );
      }
    });
  }

  /**
   * A token resolved to a plain color. Chromium crashes animating colors
   * that still hold light-dark() (as these tokens do), so animations get
   * the resolved value; a hidden probe resolves it in the current theme.
   */
  _resolvedColor(token) {
    if (!this._colorProbe) {
      this._colorProbe = globalThis.document.createElement("span");
      this._colorProbe.hidden = true;
      this.shadowRoot.appendChild(this._colorProbe);
    }
    this._colorProbe.style.color = `var(${token})`;
    return getComputedStyle(this._colorProbe).color;
  }

  // a short highlight on the page that moved or arrived
  _showLanded(ids, profile, reduce) {
    const accent = this._resolvedColor("--hax-ui-accent-strong");
    const tint = this._resolvedColor("--hax-ui-landed");
    ids.forEach((id) => {
      const li = this.shadowRoot.querySelector(`li.item[data-item-id="${id}"]`);
      if (!li || typeof li.animate !== "function") return;
      if (reduce) {
        // no fading or moving: a still outline that goes away
        li.animate(
          [
            { boxShadow: `inset 0 0 0 2px ${accent}` },
            { boxShadow: `inset 0 0 0 2px ${accent}` },
          ],
          { duration: 1500, easing: "steps(1, end)" },
        );
      } else if (profile.quiet) {
        li.animate(
          [
            { backgroundColor: tint, offset: 0 },
            { backgroundColor: "transparent", offset: 1 },
          ],
          { duration: profile.landed, easing: "ease-out" },
        );
      } else {
        li.animate(
          [
            {
              backgroundColor: tint,
              boxShadow: `inset 0 0 0 2px ${accent}`,
              offset: 0,
            },
            {
              backgroundColor: tint,
              boxShadow: `inset 0 0 0 2px ${accent}`,
              offset: 0.35,
            },
            {
              backgroundColor: "transparent",
              boxShadow: "inset 0 0 0 2px transparent",
              offset: 1,
            },
          ],
          { duration: profile.landed, easing: "ease-out" },
        );
      }
    });
  }

  // light up the tree lines of the group a page joined
  _flash(group, ms) {
    clearTimeout(this._flashTimer);
    this._flashGroup = group;
    this._flashTimer = setTimeout(() => {
      this._flashGroup = null;
    }, ms);
  }

  // scroll a row into view if it moved out of sight
  _revealRow(id, block) {
    const li = this.shadowRoot.querySelector(`li.item[data-item-id="${id}"]`);
    if (!li) return;
    const scroller = this._scrollParent();
    const isPage =
      scroller === globalThis.document.scrollingElement ||
      scroller === globalThis.document.documentElement;
    const box = isPage
      ? { top: 0, bottom: globalThis.innerHeight }
      : scroller.getBoundingClientRect();
    const r = li.getBoundingClientRect();
    if (r.top < box.top + 8 || r.bottom > box.bottom - 8) {
      li.scrollIntoView({ block, inline: "nearest" });
    }
  }

  /* ---------- undo ---------- */
  _offerUndo(snapshot, message, focusId) {
    clearTimeout(this._undoTimer);
    this._undo = { items: snapshot, message, focusId };
    this._undoTimer = setTimeout(() => {
      this._undo = null;
    }, UNDO_MS);
  }

  /**
   * Put the outline back as it was before the last change (the items
   * themselves are restored, so getData() is exactly as it was)
   */
  undo() {
    const last = this._undo;
    if (!last) return;
    clearTimeout(this._undoTimer);
    this._undo = null;
    this._hideNudge();
    // pages added since go away, pages deleted since come back, and
    // pages whose deletion is undone turn over
    const then = new Map(last.items.map((i) => [i.id, !!i.delete]));
    const flips = this.items
      .filter((i) => !then.has(i.id) || then.get(i.id) !== !!i.delete)
      .map((i) => i.id);
    // rows come or go when pages were added or removed, deleted pages
    // are hidden, or a fold changed
    const was = new Map(last.items.map((i) => [i.id, i]));
    const rows =
      last.items.length !== this.items.length ||
      (this.hideDelete && flips.length > 0) ||
      this.items.some(
        (i) => was.has(i.id) && !!was.get(i.id).collapsed !== !!i.collapsed,
      );
    this._withMotion(
      () => {
        this.items = last.items;
        this.setAttribute("stop-animation", "true");
        this.__syncUIAndDataModel();
        const still = last.items.some((i) => i.id === last.focusId);
        return still
          ? { focusId: last.focusId }
          : { changed: true, focusId: null };
      },
      { flips, rows },
    );
    this.announceAction(this.t.undone.replace("{action}", () => last.message));
  }

  /* ---------- touch: move buttons after a menu move ---------- */
  _showNudge(id) {
    this._nudgeId = id;
    this._armNudge();
  }

  _armNudge() {
    clearTimeout(this._nudgeTimer);
    this._nudgeTimer = setTimeout(() => this._hideNudge(), NUDGE_MS);
  }

  _hideNudge() {
    clearTimeout(this._nudgeTimer);
    if (this._nudgeId) {
      const id = this._nudgeId;
      this._nudgeId = null;
      this._focusId = id;
    }
  }

  _nudge(action) {
    const index = this.items.findIndex((i) => i.id === this._nudgeId);
    if (index === -1) return;
    this._armNudge();
    this._moveByKeyboard(index, action, { fromMenu: true });
  }

  _renderNudge(item, index) {
    const can = {
      up: this._siblingBefore(index) !== null,
      down: this._siblingAfter(index) !== null,
      in: this._siblingBefore(index) !== null,
      out: !!item.parent,
    };
    const button = (action, icon, label) =>
      html`<button
        type="button"
        class="nudge-btn"
        aria-label="${label}"
        title="${label}"
        ?disabled="${!can[action]}"
        @click="${(e) => {
          e.stopPropagation();
          this._nudge(action);
        }}"
      >
        <simple-icon-lite icon="${icon}"></simple-icon-lite>
      </button>`;
    return html`<span
      class="nudge"
      role="group"
      aria-label="${this.t.movePage.replace("{title}", () => item.title)}"
    >
      ${button("up", "icons:arrow-upward", this.t.moveUp)}
      ${button("down", "icons:arrow-downward", this.t.moveDown)}
      ${button("out", "hax:outline-designer-outdent", this.t.outdent)}
      ${button("in", "hax:outline-designer-indent", this.t.indent)}
      <button
        type="button"
        class="nudge-btn done"
        aria-label="${this.t.nudgeDone}"
        title="${this.t.nudgeDone}"
        @click="${(e) => {
          e.stopPropagation();
          this._hideNudge();
          this.focusItem(item.id);
        }}"
      >
        <simple-icon-lite icon="icons:check"></simple-icon-lite>
      </button>
    </span>`;
  }

  _siblingBefore(index) {
    const item = this.items[index];
    for (let i = index - 1; i >= 0; i--) {
      if (this.items[i].id === item.parent) return null;
      if ((this.items[i].parent || null) === (item.parent || null)) return i;
    }
    return null;
  }

  _siblingAfter(index) {
    const item = this.items[index];
    for (let i = index + 1; i < this.items.length; i++) {
      const p = this.items[i].parent || null;
      if (p === (item.parent || null)) return i;
      if (parseInt(this.items[i].indent) < parseInt(item.indent)) return null;
    }
    return null;
  }

  /* ---------- operations, shown ---------- */

  /**
   * Move a page with the keyboard, its menu or the touch move buttons
   * and show where it went. The operation itself is itemOp, so the data
   * written is the same.
   */
  _moveByKeyboard(index, action, { fromMenu = false } = {}) {
    const item = this.items[index];
    if (!item) return;
    if (this.isLocked(index)) {
      this._sayLocked(index);
      return;
    }
    const title = item.title;
    return this._withMotion(
      () => {
        const before = { parent: item.parent, order: item.order };
        this.itemOp(index, action);
        const changed =
          item.parent !== before.parent || item.order !== before.order;
        let message;
        if (!changed) {
          message = {
            up: this.t.alreadyFirst,
            down: this.t.alreadyLast,
            in: this.t.nothingAbove,
            out: this.t.alreadyTop,
          }[action];
        } else if (action === "in") {
          const parent = this.items.find((i) => i.id === item.parent);
          message = this.t.indentedUnder.replace("{parent}", () =>
            parent ? parent.title : "",
          );
        } else {
          message = {
            up: this.t.movedUp,
            down: this.t.movedDown,
            out: this.t.outdented,
          }[action];
        }
        message = message.replace("{title}", () => title);
        this.announceAction(message);
        return changed
          ? { focusId: item.id, message }
          : { changed: false, focusId: item.id };
      },
      { undo: true, nudge: fromMenu },
    );
  }

  // focus a row once the pending outline sync has re-rendered
  _focusAfterSync(itemId, edit = false) {
    this._focusId = itemId;
    setTimeout(() => {
      this.updateComplete.then(() => {
        if (edit) {
          const label = this.shadowRoot.querySelector(
            `[data-item-id="${itemId}"] .label.shown`,
          );
          if (label) {
            this.editTitle({ target: label });
            return;
          }
        }
        this.focusItem(itemId);
      });
    }, 0);
  }

  // add a page after this one, grow it in and start naming it
  _addAfterAndEdit(index) {
    if (this.isLocked(index)) {
      this._sayLocked(index);
      return;
    }
    return this._withMotion(
      () => {
        const added = [];
        this.setAttribute("stop-animation", "true");
        this.addNewItem(index, false, added);
        this.__syncUIAndDataModel();
        if (!added[0]) return false;
        this.announceAction(this.t.addedPage);
        return { focusId: added[0].id, edit: true, message: this.t.addedPage };
      },
      { undo: true, rows: true },
    );
  }

  /**
   * Add a page as the last child of the page at index, grow it in and
   * start naming it. Same item shape as addNewItem.
   */
  addChildItem(index) {
    const parent = this.items[index];
    if (!parent || this.isLocked(index)) {
      if (parent) this._sayLocked(index);
      return;
    }
    if (this._blockedByDeleted(parent.id)) return;
    return this._withMotion(
      () => {
        const children = this.items.filter((i) => i.parent === parent.id);
        const newItem = new JSONOutlineSchemaItem();
        newItem.parent = parent.id;
        newItem.indent = parseInt(parent.indent) + 1;
        newItem.order = children.length
          ? Math.max(...children.map((c) => Number(c.order) || 0)) + 1
          : 0;
        newItem.metadata.locked = false;
        newItem.new = true;
        newItem.contents = `<p></p>`;
        let end = this.items.indexOf(parent) + 1;
        while (
          end < this.items.length &&
          parseInt(this.items[end].indent) > parseInt(parent.indent)
        ) {
          end++;
        }
        this.items.splice(end, 0, newItem);
        if (parent.collapsed) parent.collapsed = false;
        this.setAttribute("stop-animation", "true");
        this.__syncUIAndDataModel();
        const message = this.t.addedSubpage.replace(
          "{title}",
          () => parent.title,
        );
        this.announceAction(message);
        return { focusId: newItem.id, edit: true, message };
      },
      { undo: true, rows: true },
    );
  }

  // duplicate a page (and its sub-pages) right after it
  _duplicate(index) {
    if (this.isLocked(index)) {
      this._sayLocked(index);
      return;
    }
    return this._withMotion(
      () => {
        const before = new Set(this.items.map((i) => i.id));
        this.itemOp(index, "duplicate");
        const added = this.items.filter((i) => !before.has(i.id));
        if (!added.length) return false;
        this.announceAction(this.t.itemDuplicated);
        return {
          focusId: added[0].id,
          landed: added.map((i) => i.id),
          message: this.t.itemDuplicated,
        };
      },
      { undo: true, rows: true },
    );
  }

  // mark for deletion or restore; rows only move if deleted ones hide
  _toggleDelete(index) {
    if (this.isLocked(index)) {
      this._sayLocked(index);
      return;
    }
    const item = this.items[index];
    const restoring = !!item.delete;
    const message = restoring
      ? this.t.restored.replace("{title}", () => item.title)
      : this.t.markedPage.replace("{title}", () => item.title);
    const flips = this._subtreeIds(index);
    const gone = this.hideDelete && !restoring;
    const neighbour = gone ? this._neighbourOutside(flips) : null;
    return this._withMotion(
      () => {
        this.itemOp(index, "delete");
        this.announceAction(message);
        // a page that disappears has nowhere to highlight; focus moves
        // to the row that takes its place
        return gone
          ? { focusId: null, changed: true, message, focusOnly: neighbour }
          : { focusId: item.id, message };
      },
      { undo: true, flips, rows: this.hideDelete },
    );
  }

  // a page and every page under it, in outline order
  _subtreeIds(index) {
    const item = this.items[index];
    if (!item) return [];
    const ids = [item.id];
    const depth = parseInt(item.indent) || 0;
    for (let i = index + 1; i < this.items.length; i++) {
      if ((parseInt(this.items[i].indent) || 0) <= depth) break;
      ids.push(this.items[i].id);
    }
    return ids;
  }

  // the visible row after (or else before) a set of rows that will go
  _neighbourOutside(ids) {
    const going = new Set(ids);
    const visible = this._visibleItems();
    const first = visible.findIndex((i) => going.has(i.id));
    if (first === -1) return null;
    const after = visible.slice(first).find((i) => !going.has(i.id));
    if (after) return after.id;
    const before = visible
      .slice(0, first)
      .reverse()
      .find((i) => !going.has(i.id));
    return before ? before.id : null;
  }

  // the toolbar delete: the selected pages turn over (or flip away)
  _deleteSelectedShown() {
    const flips = [];
    let count = 0;
    this.selectedPages.forEach((id) => {
      const index = this.items.findIndex((i) => i.id === id);
      if (index !== -1 && !this.isLocked(index)) {
        count++;
        this._subtreeIds(index).forEach((sub) => {
          if (!flips.includes(sub)) flips.push(sub);
        });
      }
    });
    if (!count) return;
    const message =
      count === 1
        ? this.t.markedPage.replace(
            "{title}",
            () => this.items.find((i) => i.id === flips[0]).title,
          )
        : this.t.markedPages.replace("{count}", () => count);
    const keep = this.hideDelete ? null : flips[0];
    const neighbour = this.hideDelete ? this._neighbourOutside(flips) : null;
    return this._withMotion(
      () => {
        this.deleteSelected();
        this.announceAction(message);
        return keep
          ? { focusId: keep, message, landed: flips }
          : { focusId: null, changed: true, message, focusOnly: neighbour };
      },
      { undo: true, flips, rows: this.hideDelete },
    );
  }

  // the toolbar add: a new page flips in at the top and is named
  _addTop() {
    return this._withMotion(
      () => {
        const before = new Set(this.items.map((i) => i.id));
        this.addItemToTop();
        const added = this.items.find((i) => !before.has(i.id));
        if (!added) return false;
        this.announceAction(this.t.addedPage);
        return { focusId: added.id, edit: true, message: this.t.addedPage };
      },
      { undo: true, rows: true },
    );
  }

  _toggleLock(index) {
    const item = this.items[index];
    const locking = !this.isLocked(index);
    const message = (locking ? this.t.lockedPage : this.t.unlockedPage).replace(
      "{title}",
      () => item.title,
    );
    return this._withMotion(
      () => {
        this.itemOp(index, "lock");
        this.announceAction(message);
        return { focusId: item.id, message };
      },
      { undo: true, slide: false },
    );
  }

  // fold or open a page; slides for keyboard and touch, instant for mouse
  _fold(listItem) {
    const id = listItem.getAttribute("data-item-id");
    if (this._modality() === "mouse") {
      this.collapseExpand({ target: listItem });
      return;
    }
    this._withMotion(
      () => {
        this.collapseExpand({ target: listItem });
        return { focusId: id, quiet: true };
      },
      { rows: true },
    );
  }

  _onChevronClick(e) {
    e.stopPropagation();
    const listItem = e.target.closest("li[data-item-id]");
    if (listItem) this._fold(listItem);
  }

  // the add row closing a level: a page at the end of that level
  _addInGroup(parentId) {
    const siblings = this.items.filter(
      (i) => (i.parent || null) === (parentId || null),
    );
    if (siblings.length) {
      const last = siblings.reduce((a, b) =>
        Number(b.order) >= Number(a.order) ? b : a,
      );
      this._addAfterAndEdit(this.items.indexOf(last));
    } else if (parentId) {
      this.addChildItem(this.items.findIndex((i) => i.id === parentId));
    } else {
      this._addTop();
    }
  }

  // Shift+arrows grow the selection from the focused row
  _extendSelection(index, step) {
    const visible = this._visibleItems();
    const at = visible.findIndex((i) => i.id === this.items[index].id);
    const next = visible[at + step];
    if (!next) return;
    [this.items[index].id, next.id].forEach((id) => {
      if (!this.selectedPages.includes(id)) {
        this.selectedPages.push(id);
      }
    });
    this.activePage = next.id;
    this.requestUpdate();
    this.focusItem(next.id);
  }

  // typing letters jumps to the next page whose title starts with them
  _typeAhead(key, index) {
    const now = globalThis.performance
      ? globalThis.performance.now()
      : Date.now();
    this._typed =
      now - this._typedAt < 700
        ? this._typed + key.toLowerCase()
        : key.toLowerCase();
    this._typedAt = now;
    const visible = this._visibleItems();
    const at = visible.findIndex((i) => i.id === this.items[index].id);
    const from = this._typed.length === 1 ? at + 1 : at;
    for (let k = 0; k < visible.length; k++) {
      const item = visible[(from + k) % visible.length];
      if ((item.title || "").toLowerCase().startsWith(this._typed)) {
        this.focusItem(item.id);
        return;
      }
    }
  }

  // the row that takes Tab: the focused one, else the first visible
  _rovingId() {
    const visible = this._visibleItems();
    if (this._focusId && visible.some((i) => i.id === this._focusId)) {
      return this._focusId;
    }
    return visible.length ? visible[0].id : null;
  }

  _onItemFocusIn(e) {
    this.setActiveItemForActions(e);
    const li = e.target.closest("[data-item-id]");
    if (li && e.target === li) {
      this._focusId = li.getAttribute("data-item-id");
    }
  }

  focusNextItem(currentIndex) {
    const visibleItems = this._visibleItems();
    const currentVisibleIndex = visibleItems.findIndex(
      (item) => item.id === this.items[currentIndex].id,
    );
    const nextIndex = Math.min(
      currentVisibleIndex + 1,
      visibleItems.length - 1,
    );
    this.focusItem(visibleItems[nextIndex].id);
  }

  focusPreviousItem(currentIndex) {
    const visibleItems = this._visibleItems();
    const currentVisibleIndex = visibleItems.findIndex(
      (item) => item.id === this.items[currentIndex].id,
    );
    const prevIndex = Math.max(currentVisibleIndex - 1, 0);
    this.focusItem(visibleItems[prevIndex].id);
  }

  focusFirstChild(parentIndex) {
    const parentId = this.items[parentIndex].id;
    const firstChild = this.items.find((item) => item.parent === parentId);
    if (firstChild && this.getItemParentsCollapsed(firstChild) === "") {
      this.focusItem(firstChild.id);
    }
  }

  focusParent(childIndex) {
    const parentId = this.items[childIndex].parent;
    if (parentId) {
      this.focusItem(parentId);
    }
  }

  focusFirstItem() {
    const visibleItems = this._visibleItems();
    if (visibleItems.length > 0) {
      this.focusItem(visibleItems[0].id);
    }
  }

  focusLastItem() {
    const visibleItems = this._visibleItems();
    if (visibleItems.length > 0) {
      this.focusItem(visibleItems[visibleItems.length - 1].id);
    }
  }

  focusItem(itemId) {
    this._focusId = itemId;
    // Remove tabindex from all items
    const allItems = this.shadowRoot.querySelectorAll('[role="treeitem"]');
    allItems.forEach((item) => {
      item.setAttribute("tabindex", "-1");
    });

    // Set tabindex and focus on target item
    const targetItem = this.shadowRoot.querySelector(
      `[data-item-id="${itemId}"]`,
    );
    if (targetItem) {
      targetItem.setAttribute("tabindex", "0");
      targetItem.focus();
      if (targetItem.scrollIntoView) {
        targetItem.scrollIntoView({ block: "nearest" });
      }
    }
  }
  // Accessibility announcement helpers
  announceNavigation(message) {
    this.liveRegionText = message;
    this.requestUpdate();
    // Clear after announcement to avoid repetition
    setTimeout(() => {
      this.liveRegionText = "";
      this.requestUpdate();
    }, 1000);
  }

  announceStateChange(state) {
    this.liveRegionText = state;
    this.requestUpdate();
    // Clear after announcement
    setTimeout(() => {
      this.liveRegionText = "";
      this.requestUpdate();
    }, 1000);
  }

  announceAction(action) {
    this.liveRegionText = action;
    this.requestUpdate();
    // Clear after announcement
    setTimeout(() => {
      this.liveRegionText = "";
      this.requestUpdate();
    }, 1000);
  }

  // Helper method to scroll item into view if not visible
  scrollIntoViewIfNeeded(itemId, delay = 2000) {
    setTimeout(() => {
      const targetItem = this.shadowRoot.querySelector(
        `[data-item-id="${itemId}"]`,
      );
      if (targetItem) {
        const rect = targetItem.getBoundingClientRect();
        const viewportHeight = globalThis.innerHeight;
        const viewportWidth = globalThis.innerWidth;

        // Check if item is outside viewport
        const isOutsideViewport =
          rect.bottom < 0 ||
          rect.top > viewportHeight ||
          rect.right < 0 ||
          rect.left > viewportWidth;

        if (isOutsideViewport) {
          targetItem.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
    }, delay);
  }

  /**
   * Recursively count all descendants of an item
   */
  _countAllDescendants(itemId) {
    const directChildren = this.items.filter((i) => i.parent === itemId);
    let count = directChildren.length;

    // Recursively add counts for each child's descendants
    directChildren.forEach((child) => {
      count += this._countAllDescendants(child.id);
    });

    return count;
  }
  _targetFromPoint(clientX, clientY) {
    let elementAtPoint = null;
    if (this.shadowRoot && this.shadowRoot.elementFromPoint) {
      elementAtPoint = this.shadowRoot.elementFromPoint(clientX, clientY);
    }
    if (!elementAtPoint) {
      elementAtPoint = globalThis.document.elementFromPoint(clientX, clientY);
    }
    if (!elementAtPoint || !elementAtPoint.closest) {
      return null;
    }
    return elementAtPoint.closest("[data-item-id]");
  }

  /* ---------- pointer drag: mouse, pen and touch ----------
   * A press on a row becomes a drag once a mouse or pen moves a few
   * pixels, or once a finger rests still (or drags the grip). While
   * dragging, the row under the pointer decides the drop: its top 30%
   * places the page before it, the bottom 30% after it, the middle
   * nests it. Moving sideways changes the landing level within what the
   * neighbours allow, and an insertion line with a dot shows the result.
   */
  _onPointerDown(e) {
    if (this._drag || (e.pointerType === "mouse" && e.button !== 0)) return;
    const path = e.composedPath ? e.composedPath() : [];
    const grip = path.some((n) => n.classList && n.classList.contains("grip"));
    if (
      !grip &&
      e.target.closest &&
      e.target.closest(
        "button, simple-toolbar-button, simple-icon-button-lite, simple-context-menu, .label-edit.shown, li.add-row, li.content-child, li.content-adding-operations",
      )
    ) {
      return;
    }
    const row = e.target.closest && e.target.closest("li[data-item-id]");
    if (!row) return;
    const id = row.getAttribute("data-item-id");
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1 || this.isLocked(index)) return;
    const touch = e.pointerType === "touch";
    this._press = {
      id,
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      touch,
      grip,
      holdMs: touch ? TOUCH_HOLD_MS : FOLD_HOLD_MS,
      timer: null,
    };
    if (touch && !grip) {
      // a still finger picks the row up; moving first means scrolling
      this._press.timer = setTimeout(() => {
        if (this._press && this._press.id === id) {
          this._startDrag(this._press.x, this._press.y);
        }
      }, TOUCH_HOLD_MS);
      this.requestUpdate();
    } else if (!touch && this.hasChildren(id) && !this.isCollapsed(id)) {
      // holding an open parent folds it, so it moves as one compact row
      this._press.timer = setTimeout(() => {
        if (this._press && this._press.id === id && !this._drag) {
          this.items[index].collapsed = true;
          this._press.timer = null;
          this.announceAction(
            this.t.foldedToMove.replace(
              "{title}",
              () => this.items[index].title,
            ),
          );
          this.requestUpdate();
        }
      }, FOLD_HOLD_MS);
      this.requestUpdate();
    }
  }

  _onPointerMove(e) {
    const press = this._press;
    if (this._drag) {
      if (e.pointerId !== this._drag.pointerId) return;
      e.preventDefault();
      this._dragTo(e.clientX, e.clientY);
      return;
    }
    if (!press || e.pointerId !== press.pointerId) return;
    const moved = Math.hypot(e.clientX - press.x, e.clientY - press.y);
    if (press.touch && !press.grip) {
      // the finger moved before the hold finished: it is scrolling
      if (moved > 8) {
        this._clearPress();
      }
      return;
    }
    if (moved > DRAG_THRESHOLD) {
      this._startDrag(e.clientX, e.clientY);
      if (this._drag) {
        this._dragTo(e.clientX, e.clientY);
      }
    }
  }

  _onPointerUp(e) {
    if (this._drag && e.pointerId === this._drag.pointerId) {
      this._finishDrag(true);
      // the click that follows a drag is not a click on the row
      this._suppressClick = true;
      setTimeout(() => {
        this._suppressClick = false;
      }, 0);
      return;
    }
    this._clearPress();
  }

  // a finger is on the outline, or was a moment ago
  _recentTouch() {
    return this._touchDown || Date.now() - (this._touchAt || 0) < 1000;
  }

  _onPointerCancel(e) {
    // phones cancel the pointer when their own long-press gesture kicks
    // in; a touch drag already picked up carries on from touch events
    if (this._drag && this._drag.touch && this._touchDown) {
      return;
    }
    if (this._drag && e.pointerId === this._drag.pointerId) {
      this._finishDrag(false);
      return;
    }
    if (this._press && e.pointerId === this._press.pointerId) {
      this._clearPress();
    }
  }

  _clearPress() {
    if (!this._press) return;
    clearTimeout(this._press.timer);
    this._press = null;
    this.requestUpdate();
  }

  // rows in tree order with their depth, as the drag sees them
  _dragRows() {
    return this.items.map((item) => ({
      item,
      depth: parseInt(item.indent) || 0,
    }));
  }

  _startDrag(x, y) {
    const press = this._press;
    if (!press) return;
    clearTimeout(press.timer);
    const rows = this._dragRows();
    const i = rows.findIndex((r) => r.item.id === press.id);
    if (i === -1) {
      this._press = null;
      return;
    }
    let end = i + 1;
    while (end < rows.length && rows[end].depth > rows[i].depth) end++;
    const sub = rows.slice(i, end);
    const list = this.shadowRoot.querySelector("#list");
    const indentPx =
      parseFloat(getComputedStyle(this).getPropertyValue("--hax-ui-indent")) ||
      20;
    this._drag = {
      id: press.id,
      pointerId: press.pointerId,
      touch: press.touch,
      i,
      rows,
      ids: new Set(sub.map((r) => r.item.id)),
      startX: x,
      x,
      y,
      origDepth: rows[i].depth,
      subDepth: Math.max(...sub.map((r) => r.depth)) - rows[i].depth,
      count: sub.length - 1,
      title: rows[i].item.title,
      visible: new Set(this._visibleItems().map((v) => v.id)),
      indentPx,
      scroller: this._scrollParent(),
      key: "",
    };
    this._press = null;
    this._dropTarget = null;
    if (list && list.setPointerCapture) {
      try {
        list.setPointerCapture(this._drag.pointerId);
      } catch {
        // capture is best effort; moves still reach the list
      }
    }
    this.setAttribute("data-dragging", "true");
    // if pointer capture fails, still end the drag wherever it is released
    globalThis.addEventListener("pointerup", this.__windowUp);
    globalThis.addEventListener("pointercancel", this.__windowCancel);
    const moving = this.t.movingPage.replace("{title}", () => this._drag.title);
    this._statusText = this._drag.count
      ? `${moving} ${this.t.withSubpages.replace("{count}", () => this._drag.count)}`
      : moving;
    this.announceAction(this._statusText);
    this.requestUpdate();
  }

  _dragTo(x, y) {
    const drag = this._drag;
    drag.x = x;
    drag.y = y;
    const ghost = this.shadowRoot.querySelector(".drag-ghost");
    if (ghost) {
      // above the finger on touch so it stays visible
      const dy = drag.touch ? -48 : 14;
      ghost.style.transform = `translate(${x + 14}px, ${y + dy}px)`;
    }
    this._autoScroll();
    const list = this.shadowRoot.querySelector("#list");
    const bounds = list ? list.getBoundingClientRect() : null;
    const inside =
      bounds &&
      x >= bounds.left - 40 &&
      x <= bounds.right + 40 &&
      y >= bounds.top - 16 &&
      y <= bounds.bottom + 16;
    if (!inside) {
      if (this._dropTarget || drag.key !== "outside") {
        this._dropTarget = null;
        drag.key = "outside";
        this._statusText = this.t.moveCancelled;
        this.requestUpdate();
      }
      return;
    }
    let el = null;
    const hit = this.shadowRoot.elementFromPoint
      ? this.shadowRoot.elementFromPoint(
          Math.min(Math.max(x, bounds.left + 1), bounds.right - 1),
          y,
        )
      : null;
    if (hit && hit.closest) {
      el = hit.closest("li[data-item-id], li.add-row");
    }
    // over a gap or content row: keep the last target
    if (!el) return;
    const target = this._computeDropTarget(el, x);
    const key = target
      ? [target.zone, target.targetId, target.insertIdx, target.depth].join("|")
      : "none";
    if (key === drag.key) return;
    drag.key = key;
    this._dropTarget = target;
    if (target) {
      const r = drag.rows[drag.i];
      this._statusText = `${r.item.title} → ${target.text}`;
      this.announceAction(target.text);
    }
    this.requestUpdate();
  }

  /**
   * Where the dragged page would land over row el at horizontal x.
   * Returns { zone, targetId, insertIdx, depth, group, line, text }:
   * insertIdx counts in the rows without the dragged page and its
   * sub-pages; depth is never deeper than one below the row above and
   * never shallower than the row below, so no other page changes parent.
   */
  _computeDropTarget(el, x) {
    const drag = this._drag;
    const rest = drag.rows.filter((r) => !drag.ids.has(r.item.id));
    const at = (id) => rest.findIndex((r) => r.item.id === id);
    const endIn = (i) => {
      let j = i + 1;
      while (j < rest.length && rest[j].depth > rest[i].depth) j++;
      return j;
    };
    const visiblePrev = (k) => {
      for (let j = k - 1; j >= 0; j--) {
        if (drag.visible.has(rest[j].item.id)) return rest[j];
      }
      return null;
    };
    const cap = MAX_DEPTH - drag.subDepth;
    const dx = Math.round((x - drag.startX) / drag.indentPx);
    let zone;
    let insertIdx;
    let depth;
    let target = null;
    let anchor = el;
    let edge = "top";
    if (el.classList.contains("add-row")) {
      const parentId = el.getAttribute("data-add-parent") || null;
      if (parentId && drag.ids.has(parentId)) return null;
      zone = "add";
      insertIdx = parentId ? endIn(at(parentId)) : rest.length;
      depth = parseInt(el.getAttribute("data-add-depth")) || 0;
      if (depth > cap) return null;
    } else if (drag.ids.has(el.getAttribute("data-item-id"))) {
      zone = "self";
      insertIdx = drag.i;
      anchor = this.shadowRoot.querySelector(`[data-item-id="${drag.id}"]`);
    } else {
      const ti = at(el.getAttribute("data-item-id"));
      if (ti === -1) return null;
      target = rest[ti];
      const box = el.getBoundingClientRect();
      const pct = (drag.y - box.top) / box.height;
      zone = pct < 0.3 ? "before" : pct > 0.7 ? "after" : "child";
      const lockedTarget = target.item.metadata && target.item.metadata.locked;
      if (zone === "child" && (target.depth + 1 > cap || lockedTarget)) {
        zone = pct < 0.5 ? "before" : "after";
      }
      if (zone === "child") {
        insertIdx = endIn(ti);
        depth = target.depth + 1;
      } else if (zone === "before") {
        insertIdx = ti;
      } else {
        edge = "bottom";
        const next = rest[ti + 1];
        insertIdx =
          next && next.depth > target.depth && drag.visible.has(next.item.id)
            ? ti + 1
            : endIn(ti);
      }
    }
    let min = 0;
    let max = 0;
    if (depth === undefined) {
      const prev = visiblePrev(insertIdx);
      const next = rest[insertIdx];
      max = Math.min(prev ? prev.depth + 1 : 0, cap);
      min = next ? next.depth : 0;
      depth =
        min > max ? min : Math.max(min, Math.min(max, drag.origDepth + dx));
    }
    let parent = null;
    if (depth > 0) {
      for (let j = insertIdx - 1; j >= 0; j--) {
        if (rest[j].depth === depth - 1) {
          parent = rest[j];
          break;
        }
        if (rest[j].depth < depth - 1) break;
      }
    }
    // text for the status line and screen readers
    const t = this.t;
    const title = (r) => (r ? r.item.title : "");
    let text;
    if (zone === "child") {
      text = t.dropAsChildOf.replace("{title}", () => title(target));
    } else if (zone === "before") {
      text = t.dropAbove.replace("{title}", () => title(target));
    } else if (zone === "after") {
      text = t.dropBelow.replace("{title}", () => title(target));
    } else if (zone === "add") {
      text = parent
        ? t.dropAtEndOf.replace("{title}", () => title(parent))
        : t.dropAtEndOfTop;
    } else {
      text = depth === drag.origDepth ? t.dropInPlace : t.dropLevelOnly;
    }
    if (zone !== "child" && !(zone === "self" && depth === drag.origDepth)) {
      text += `, ${
        depth
          ? t.dropLevelUnder
              .replace("{level}", () => depth + 1)
              .replace("{title}", () => title(parent))
          : t.dropTopLevel
      }`;
      if (max > min) {
        text += ` (${t.dropSideways
          .replace("{min}", () => min + 1)
          .replace("{max}", () => max + 1)})`;
      }
    }
    // the insertion line, in the coordinates of .tree-wrap
    let line = null;
    if (
      zone !== "child" &&
      !(zone === "self" && depth === drag.origDepth) &&
      anchor
    ) {
      const pad = parseFloat(getComputedStyle(anchor).paddingLeft) || 0;
      line = {
        top: anchor.offsetTop + (edge === "bottom" ? anchor.offsetHeight : 0),
        left: pad + depth * drag.indentPx + drag.indentPx / 2,
      };
    }
    return {
      zone,
      targetId: target ? target.item.id : null,
      insertIdx,
      depth,
      parentId: parent ? parent.item.id : null,
      group: `${parent ? parent.item.id : "root"}|${depth}`,
      line,
      text,
    };
  }

  _finishDrag(commit) {
    const drag = this._drag;
    if (!drag) return;
    const target = this._dropTarget;
    const list = this.shadowRoot.querySelector("#list");
    if (list && list.releasePointerCapture) {
      try {
        list.releasePointerCapture(drag.pointerId);
      } catch {
        // already released
      }
    }
    cancelAnimationFrame(this._scrollFrame);
    this._scrollFrame = null;
    this._drag = null;
    this._dropTarget = null;
    this.removeAttribute("data-dragging");
    globalThis.removeEventListener("pointerup", this.__windowUp);
    globalThis.removeEventListener("pointercancel", this.__windowCancel);
    if (
      commit &&
      target &&
      !(target.zone === "self" && target.depth === drag.origDepth)
    ) {
      this._statusText = "";
      const profile = MOTION[this._modality()];
      this._withMotion(
        () => {
          const id = this._applyDrop(drag, target);
          if (!id) return false;
          const root = this.items.find((i) => i.id === id);
          return {
            focusId: id,
            message: this.t.movedPage.replace("{title}", () => root.title),
          };
        },
        { undo: true, slide: profile.dropSlide },
      );
      return;
    }
    if (!commit || target) {
      this.announceAction(this.t.moveCancelled);
    }
    this._statusText = "";
    this.requestUpdate();
  }

  /**
   * Put the dragged page (and its sub-pages) where target says. Only the
   * dragged page changes parent; its old and new sibling groups are
   * renumbered so order stays whole numbers, and anything whose parent or
   * order changed is marked modified, as itemOp does.
   */
  _applyDrop(drag, target) {
    if (target.zone === "self" && target.depth === drag.origDepth) {
      return false;
    }
    const dragged = this.items.find((i) => i.id === drag.id);
    if (
      dragged &&
      !dragged.delete &&
      this._blockedByDeleted(target.parentId || null)
    ) {
      return false;
    }
    const moved = drag.rows.slice(drag.i, drag.i + drag.count + 1);
    const rest = drag.rows.filter((r) => !drag.ids.has(r.item.id));
    const delta = target.depth - drag.origDepth;
    const placed = moved.map((r) => ({ item: r.item, depth: r.depth + delta }));
    const arrangement = [...rest];
    arrangement.splice(target.insertIdx, 0, ...placed);
    const root = moved[0].item;
    const oldParent = root.parent || null;
    const newParent = target.parentId || null;
    if (oldParent !== newParent) {
      root.parent = newParent;
      if (!root.new) {
        root.modified = true;
      }
    }
    // the new sibling group, in its new order
    this._renumber(
      arrangement
        .filter(
          (r) =>
            r.depth === target.depth && (r.item.parent || null) === newParent,
        )
        .map((r) => r.item),
    );
    if (oldParent !== newParent) {
      this._renumber(
        this.items
          .filter((i) => (i.parent || null) === oldParent)
          .sort((a, b) => Number(a.order) - Number(b.order)),
      );
    }
    // keep the moved page in view: open whatever now contains it
    let parentId = newParent;
    while (parentId) {
      const parent = this.items.find((i) => i.id === parentId);
      if (!parent) break;
      parent.collapsed = false;
      parentId = parent.parent;
    }
    this.announceAction(this.t.movedPage.replace("{title}", () => root.title));
    this.setAttribute("stop-animation", "true");
    this.__syncUIAndDataModel();
    return root.id;
  }

  // give a sibling group the orders 0, 1, 2… in the order given
  _renumber(list) {
    list.forEach((item, order) => {
      if (Number(item.order) !== order) {
        item.order = order;
        if (!item.new) {
          item.modified = true;
        }
      }
    });
  }

  // the nearest scrolling ancestor, across shadow roots
  _scrollParent() {
    let node = this;
    while (node) {
      node = node.parentNode || node.host;
      if (!node || node === globalThis.document) break;
      if (node.nodeType === 1) {
        const style = getComputedStyle(node);
        if (
          /(auto|scroll)/.test(style.overflowY) &&
          node.scrollHeight > node.clientHeight
        ) {
          return node;
        }
      }
    }
    return (
      globalThis.document.scrollingElement ||
      globalThis.document.documentElement
    );
  }

  // scroll while the pointer is near the top or bottom of the scroller
  _autoScroll() {
    const drag = this._drag;
    if (!drag || this._scrollFrame) return;
    const step = () => {
      this._scrollFrame = null;
      const d = this._drag;
      if (!d || !d.scroller) return;
      const isPage =
        d.scroller === globalThis.document.scrollingElement ||
        d.scroller === globalThis.document.documentElement;
      const box = isPage
        ? { top: 0, bottom: globalThis.innerHeight }
        : d.scroller.getBoundingClientRect();
      let dy = 0;
      if (d.y < box.top + AUTOSCROLL_EDGE) {
        dy = -Math.ceil((box.top + AUTOSCROLL_EDGE - d.y) / 4);
      } else if (d.y > box.bottom - AUTOSCROLL_EDGE) {
        dy = Math.ceil((d.y - (box.bottom - AUTOSCROLL_EDGE)) / 4);
      }
      if (dy) {
        d.scroller.scrollTop += dy;
        this._scrollFrame = requestAnimationFrame(() => {
          this._scrollFrame = null;
          if (this._drag) {
            this._dragTo(this._drag.x, this._drag.y);
          }
        });
      }
    };
    step();
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      schemaMap: { type: Object },
      haxGizmos: { type: Array },
      hideDelete: { type: Boolean },
      activeItemForActions: { type: String },
      storeTools: { type: Boolean },
      eventData: { type: Object },
      items: { type: Array },
      appReady: { type: Boolean },
      activePreview: { type: Object },
      activePreviewIndex: { type: Number },
      hideContentOps: {
        type: Boolean,
        reflect: true,
        attribute: "hide-content-ops",
      },
      /**
       * Hide the rows that add a page at the end of each level
       */
      hideAddRows: {
        type: Boolean,
        reflect: true,
        attribute: "hide-add-rows",
      },
      /**
       * Row density: compact, default or roomy
       */
      density: { type: String, reflect: true },
      fidelity: { type: String },
      liveRegionText: { type: String },
      activePage: { type: String },
      selectedPages: { type: Array },
      /**
       * Preview how changes are shown: auto (follow the input in use),
       * mouse, keyboard or touch
       */
      motionProfile: { type: String, attribute: "motion-profile" },
      /**
       * auto (follow prefers-reduced-motion), reduce or full
       */
      reducedMotion: { type: String, attribute: "reduced-motion" },
      _focusId: { state: true },
      _statusText: { state: true },
      _vtActive: { state: true },
      _flashGroup: { state: true },
      _nudgeId: { state: true },
      _undo: { state: true },
    };
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("motionProfile")) {
      this._syncModality();
      this._hideNudge();
    }
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName === "items" &&
        this[propName] &&
        this[propName].length > 0 &&
        (!oldValue || oldValue.length === 0)
      ) {
        this.__syncUIAndDataModel();
      }
      if (propName === "fidelity" && this[propName]) {
        // @todo these are just conceptual for the moment
        // need requirements / discussion with group to inform low vs high operations
        // and the names could correspond more closely with the process someone is engaged in
        switch (this[propName]) {
          case "low":
            // remove everything except pages
            // button for seeing content of page but not allowed to delve into it
            break;
          case "medium":
            // allow rendering contents, but only headings, no edit operations

            break;
          case "high":
            // allow rendering contents, as well as edit operations
            break;
        }
      }
      if (propName === "activePreview" && oldValue) {
        oldValue.classList.remove("active-preview-item");
      }
      if (propName === "activePreview" && this[propName]) {
        this[propName].classList.add("active-preview-item");
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // avoid some misordering on 1st paint after making lots of things
    if (this.items) {
      setTimeout(() => {
        this.__syncUIAndDataModel();
      }, 0);
    }
    // once a touch drag has picked a row up, the finger moves the row
    // rather than scrolling the page (needs a non-passive listener)
    // touch events keep a touch drag going even after the browser has
    // cancelled the pointer for its long-press gesture
    const list = this.shadowRoot.querySelector("#list");
    if (list) {
      list.addEventListener(
        "touchstart",
        () => {
          this._touchDown = true;
          this._touchAt = Date.now();
        },
        { passive: true },
      );
      list.addEventListener(
        "touchmove",
        (e) => {
          if (!this._drag) return;
          if (e.cancelable) e.preventDefault();
          const touch = e.changedTouches[0];
          if (this._drag.touch && touch) {
            this._dragTo(touch.clientX, touch.clientY);
          }
        },
        { passive: false },
      );
      const touchEnd = (e) => {
        this._touchDown = e.touches.length > 0;
        this._touchAt = Date.now();
        if (this._drag && this._drag.touch && !this._touchDown) {
          this._finishDrag(e.type === "touchend");
          this._suppressClick = true;
          setTimeout(() => {
            this._suppressClick = false;
          }, 0);
        }
      };
      list.addEventListener("touchend", touchEnd);
      list.addEventListener("touchcancel", touchEnd);
      // no text selection or callout while a row is held or carried
      list.addEventListener("selectstart", (e) => {
        if (this._press || this._drag) e.preventDefault();
      });
    }
  }

  disconnectedCallback() {
    if (this._drag) {
      this._finishDrag(false);
    }
    this._clearPress();
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "outline-designer";
  }

  // modifier for adding to the top of the stack
  addItemToTop() {
    this.setAttribute("stop-animation", "true");
    this.addNewItem("top");
    this.__syncUIAndDataModel();
  }

  /**
   * Return all data associated with the current tree
   * @note this makes more sense when we allow manipulation via this object and its options
   */
  async getData() {
    let eventData = this.eventData;
    eventData.items = [...this.items];
    // if we're pulling in the store to do re-parenting on the fly
    // like in the case of the import UI
    if (this.storeTools) {
      const parentId = this.shadowRoot.querySelector("#itemselector").value;
      const targetSelector =
        this.shadowRoot.querySelector("#targetselector").value;
      let count = 0;
      await eventData.items.map(async (item, index) => {
        if (parentId && item.parent == null) {
          // helps in supporting multiple imports at a time
          // capture this import position BEFORE awaiting anything; the
          // shared counter finishes all of its increments by the time any
          // of the async callbacks resume, so reading it after the await
          // hands every import the same final order
          const itemOrder = ++count;
          let parentItem = await store.findItemAsObject(parentId);
          switch (targetSelector) {
            case "below":
              eventData.items[index].parent = parentItem.parent;
              eventData.items[index].order =
                parseInt(parentItem.order) + itemOrder;
              break;
            case "above":
              eventData.items[index].parent = parentItem.parent;
              // @todo this is currently the reverse order desired if
              // multiple top level children existed on the import
              eventData.items[index].order =
                parseInt(parentItem.order) - itemOrder;
              break;
            case "children":
              eventData.items[index].parent = parentId;
              break;
          }
        }
      });
    }
    return eventData;
  }

  isLocked(index) {
    if (
      index !== false &&
      this.items[index] &&
      this.items[index].metadata &&
      this.items[index].metadata.locked
    ) {
      return true;
    }
    return false;
  }
  // add a new page or duplicate
  addNewItem(targetItemIndex, duplicate = false, newItems = []) {
    let orderAddon = 1;
    if (targetItemIndex === "top") {
      targetItemIndex = 0;
      orderAddon = -1;
    }
    let item = {
      indent: 0,
      parent: null,
      order: 0,
    };
    // edge case, new outline with nothing in it or traget is invalid
    if (this.items && this.items.length > 0 && this.items[targetItemIndex]) {
      item = this.items[targetItemIndex];
    }
    // a new page never goes inside a page marked for deletion
    if (orderAddon === 1 && this._blockedByDeleted(item.parent)) {
      return;
    }
    let newItem = new JSONOutlineSchemaItem();
    newItem.order = item.order + orderAddon;
    newItem.parent = item.parent;
    newItem.indent = item.indent;
    // make room after the target: the backend breaks order ties by putting
    // new pages last, so a new page sharing the next sibling's order would
    // save one place lower than it shows
    if (orderAddon === 1 && this.items) {
      this.items.forEach((sibling) => {
        if (
          sibling !== item &&
          (sibling.parent || null) === (newItem.parent || null) &&
          Number(sibling.order) >= newItem.order
        ) {
          sibling.order = Number(sibling.order) + 1;
          if (!sibling.new) {
            sibling.modified = true;
          }
        }
      });
    }
    // slug and location NOT set because backend will fill these in
    newItem.metadata.locked = false;
    newItem.new = true;
    if (duplicate) {
      newItem.title = `${this.t.copyOf} ${item.title}`;
      newItem.contents = item.contents;
      // reference to what called for this to be created
      newItem.duplicate = item.id;
    } else {
      newItem.contents = `<p></p>`;
    }
    newItems.push(newItem);
    // if we were told to duplicate and we have kids, do the whole tree
    if (
      this.items &&
      this.items.length > 0 &&
      this.items[targetItemIndex] &&
      this.hasChildren(this.items[targetItemIndex].id) &&
      duplicate
    ) {
      // map old id to new one
      let map = {};
      map[this.items[targetItemIndex].id] = newItem.id;
      newItems = this.recurseCopyChildren(
        this.items[targetItemIndex].id,
        map,
        newItems,
      );
    }
    // splice back into the items array just below where we issued the split
    if (this.items && this.items.length > 0) {
      newItems.forEach((spItem, spIndex) =>
        this.items.splice(targetItemIndex + spIndex + 1, 0, spItem),
      );
    } else {
      newItems.forEach((spItem) => this.items.push(spItem));
    }
  }

  recurseCopyChildren(itemId, map, newItems) {
    // deep copy
    let children = this.items.filter((item) => item.parent == itemId);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      let newItem = new JSONOutlineSchemaItem();
      newItem.order = child.order;
      // map old parentID to new one
      newItem.parent = map[child.parent];
      newItem.indent = child.indent;
      // slug and location NOT set because backend will fill these in
      newItem.metadata.locked = false;
      newItem.new = true;
      newItem.title = `${this.t.copyOf} ${child.title}`;
      newItem.contents = child.contents;
      // maintain collapsed state for clarity in larger structures
      newItem.collapsed = child.collapsed;
      // store a reference to where this came from
      newItem.duplicate = children[i].id;
      // map old id to new one
      map[children[i].id] = newItem.id;
      newItems.push(newItem);
      if (this.hasChildren(children[i].id)) {
        this.recurseCopyChildren(children[i].id, map, newItems);
      }
    }
    return newItems;
  }
  // apply an action recursively to children of children
  recurseAction(itemId, action, value = true) {
    let children = this.items.filter((item) => item.parent == itemId);
    for (let i = 0; i < children.length; i++) {
      this.items.map((item, index) => {
        if (item.id === children[i].id) {
          switch (action) {
            case "delete":
              this.items[index].delete = value;
              break;
            case "lock":
              this.items[index].metadata.locked = value;
              break;
          }
        }
      });
      if (this.hasChildren(children[i].id)) {
        this.recurseAction(children[i].id, action, value);
      }
    }
    return true;
  }

  // operations that can be clicked individually per item
  itemOp(index, action) {
    if (index !== false && this.items[index] && action) {
      // verify this is not locked
      if (!this.items[index].metadata.locked) {
        switch (action) {
          // @note this will force reload which is not ideal but not that big a deal
          case "goto": {
            let href = this.items[index].slug || this.items[index].location;
            const navigationRequested = this.dispatchEvent(
              new CustomEvent("outline-designer-request-navigate", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                  href: href,
                  item: this.items[index],
                },
              }),
            );
            if (!navigationRequested) {
              break;
            }
            this.dispatchEvent(
              new CustomEvent("simple-modal-hide", {
                bubbles: true,
                cancelable: true,
                detail: {},
              }),
            );
            globalThis.location.href = href;
            break;
          }
          case "lock":
            this.items[index].metadata.locked = true;
            if (this.hasChildren(this.items[index].id)) {
              this.recurseAction(
                this.items[index].id,
                action,
                this.items[index].metadata.locked,
              );
            }
            break;
          case "delete":
            if (this.items[index].delete) {
              this.items[index].delete = false;
              // a kept page cannot stay inside a deleted one: saving would
              // delete the parent and move this page to the top level, so
              // restoring it restores the pages above it as well
              let up = this.items.find(
                (i) => i.id === this.items[index].parent,
              );
              while (up) {
                if (up.delete) up.delete = false;
                const next = up.parent;
                up = next ? this.items.find((i) => i.id === next) : null;
              }
            } else {
              this.items[index].delete = true;
            }
            if (this.hasChildren(this.items[index].id)) {
              this.recurseAction(
                this.items[index].id,
                action,
                this.items[index].delete,
              );
            }
            break;
          case "add":
            this.setAttribute("stop-animation", "true");
            this.addNewItem(index);
            break;
          case "duplicate":
            this.setAttribute("stop-animation", "true");
            this.addNewItem(index, true);
            break;
          case "in": {
            // become the last child of the sibling just above (the
            // nearest earlier item with the same parent); rows between
            // the two are that sibling's own descendants
            const item = this.items[index];
            let sibling = null;
            for (let i = index - 1; i >= 0; i--) {
              if (this.items[i].id === item.parent) {
                break;
              }
              if ((this.items[i].parent || null) === (item.parent || null)) {
                sibling = this.items[i];
                break;
              }
            }
            if (sibling && !item.delete && this._blockedByDeleted(sibling.id)) {
              sibling = null;
            }
            if (sibling) {
              const children = this.items.filter(
                (i) => i.parent === sibling.id,
              );
              item.parent = sibling.id;
              item.order = children.length
                ? Math.max(...children.map((c) => Number(c.order) || 0)) + 1
                : 0;
              item.indent = parseInt(sibling.indent) + 1;
              // open it only if it was folded, so an open parent's saved
              // data is not touched
              if (sibling.collapsed) sibling.collapsed = false;
              if (!item.new) {
                item.modified = true;
              }
            }
            break;
          }
          case "out":
            if (
              this.items[index].parent !== null &&
              this.items[index].parent !== undefined &&
              this.items[index].parent !== ""
            ) {
              // move just after parent and take on it's parent
              let sibling = this.items.find(
                (item) => this.items[index].parent === item.id,
              );
              this.items[index].parent = sibling.parent;
              this.items[index].indent = parseInt(sibling.indent);
              if (!this.items[index].new) {
                this.items[index].modified = true;
              }
              // land right after the old parent, renumbering that group so
              // it doesn't share an order with the parent's next sibling
              this.items[index].order = Number(sibling.order) + 0.5;
              this._renumber(
                this.items
                  .filter(
                    (item) =>
                      (item.parent || null) ===
                      (this.items[index].parent || null),
                  )
                  .sort((a, b) => Number(a.order) - Number(b.order)),
              );
            }
            break;
          case "up":
          case "down": {
            this.setAttribute("stop-animation", "true");
            // thing in question
            let element = this.items[index];
            // find siblings of the current one by finding same parent
            let siblings = [];
            this.items.map((thing) => {
              if (thing.parent === element.parent) {
                siblings.push(thing);
              }
            });
            // sort order at this level
            siblings.sort((a, b) => {
              if (a.order < b.order) {
                return -1;
              } else if (a.order > b.order) {
                return 1;
              }
              return 0;
            });
            let swapSibling = null;
            // find item just before us; can't use find bc its active 1 only
            // or just after us
            siblings.map((thing, i) => {
              if (action === "up" && i > 0 && thing.id === element.id) {
                swapSibling = siblings[i - 1];
              } else if (
                action === "down" &&
                i < siblings.length - 1 &&
                thing.id === element.id
              ) {
                swapSibling = siblings[i + 1];
              }
            });
            // ensure we found something
            if (swapSibling) {
              // store this before we overwrite it
              const swapOrder = parseInt(swapSibling.order + ".0");
              const elOrder = parseInt(element.order + ".0");
              this.items.map((thing, i) => {
                if (thing.id === swapSibling.id) {
                  this.items[i].order = elOrder;
                  if (!this.items[i].new) {
                    this.items[i].modified = true;
                  }
                } else if (thing.id === element.id) {
                  this.items[i].order = swapOrder;
                  if (!this.items[i].new) {
                    this.items[i].modified = true;
                  }
                }
              });
              // Scroll moved item into view after a delay if it's outside viewport
              this.scrollIntoViewIfNeeded(element.id);
            }
            break;
          }
        }
        // has to be on its own bc we block ALL actions if we are locked
      } else if (action === "lock") {
        this.items[index].metadata.locked = false;
        if (this.hasChildren(this.items[index].id)) {
          this.recurseAction(
            this.items[index].id,
            action,
            this.items[index].metadata.locked,
          );
        }
      }
      this.__syncUIAndDataModel();
    }
  }
  // this forces the indent value for how far in to render
  // to be accurate based on parent depth. If you have
  // 4 ancestors above you you are at the 4th level
  // as we start at 0.
  // @note this exists because of the concept of depth being
  // different from the actual rendered hierarchy but we've
  // never actually used this ability
  _recurseUpdateIndent(topItem = { id: null }, incr = 0) {
    this.items.map((item, deepIndex) => {
      if (item.parent == topItem.id) {
        this.items[deepIndex].indent = incr;
        this._recurseUpdateIndent(this.items[deepIndex], incr + 1);
      }
    });
  }
  // force item's schema to be ordered correctly
  // this takes the current data and completely rebuilds it
  // by faking a HTML data structure and then flattening it again
  // this also forces the linear and order property of items to be accurate
  _schemaOrderUpdate() {
    // fake a schema so we can force an order update to JOS format
    // this way the above will ALWAYS order correctly if the data model change is accurate
    let site = new JsonOutlineSchema();
    // Normalize parent values so itemsToNodes correctly identifies top-level items
    // when the backend omits parent or sends "" instead of null
    let normalizedItems = this.items.map((item) => {
      let normalized = { ...item };
      if (normalized.parent === undefined || normalized.parent === "") {
        normalized.parent = null;
      }
      return normalized;
    });
    // we already have our items, pass them in
    let nodes = site.itemsToNodes(normalizedItems);
    // smash outline into flat to get the correct order
    let correctOrder = site.nodesToItems(nodes);
    let newItems = [];
    // build a new array in the correct order by pushing the old items around
    // delete "children" key as we deal in JOS only here
    for (let key in correctOrder) {
      let newItem = this.items.find((element) => {
        // IDs may be converted to strings during DOM round-trip;
        // compare as strings to avoid losing items on mismatch
        return String(element.id) === String(correctOrder[key].id);
      });
      if (newItem) {
        delete newItem.children;
        newItems.push(newItem);
      }
    }
    // Only replace items if the round-trip successfully matched them.
    // If newItems is empty (e.g., structural mismatch), preserve the original
    // array so the UI doesn't go blank.
    if (newItems.length > 0) {
      this.items = newItems;
    }
  }
}
globalThis.customElements.define(OutlineDesigner.tag, OutlineDesigner);
