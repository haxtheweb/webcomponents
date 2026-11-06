/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD reader controls: a search combobox and a toggle group for the people
 * reading a block, not editing it. The admin layer (HaxUiAdminControls.js:
 * .hax-ui-input, .hax-ui-seg) is the editor's look and is only loaded with
 * the editor; these sit with DDDBlock.js and use the same fonts, borders,
 * radii and focus ring as its header actions.
 *
 * Standalone on purpose, like DDDBlock.js and DDDChart.js: it adds no
 * exports to d-d-d.js or DDDStyles.js. Import it directly:
 *
 *   import {
 *     DDDComboboxStyles,
 *     DDDToggleGroupStyles,
 *   } from "@haxtheweb/d-d-d/lib/DDDReaderControls.js";
 *   static get styles() {
 *     return [super.styles, DDDComboboxStyles, DDDToggleGroupStyles];
 *   }
 *
 * SEARCH COMBOBOX (ARIA combobox with a listbox popup)
 *
 *   <div class="ddd-combobox">
 *     <label class="ddd-combobox-label" for="q">Find a project</label>
 *     <input class="ddd-combobox-input" id="q" type="search"
 *       role="combobox" aria-expanded="true" aria-controls="lb"
 *       aria-autocomplete="list" aria-activedescendant="o2" />
 *     <div class="ddd-combobox-listbox" id="lb" role="listbox"
 *       aria-label="Results">
 *       <div class="ddd-combobox-group" role="group" aria-labelledby="g1">
 *         <div class="ddd-combobox-group-label" id="g1"
 *           role="presentation">Tools</div>
 *         <div class="ddd-combobox-option" id="o1" role="option"
 *           aria-selected="false">HAX CLI</div>
 *         <div class="ddd-combobox-option" id="o2" role="option"
 *           aria-selected="true">haxcms-nodejs
 *           <span class="ddd-combobox-option-meta">Backend</span></div>
 *       </div>
 *       <div class="ddd-combobox-empty" role="presentation">No matches</div>
 *     </div>
 *   </div>
 *
 * Parts: .ddd-combobox (wrapper; the listbox opens under it),
 * .ddd-combobox-label, .ddd-combobox-input, .ddd-combobox-listbox (hidden
 * with the hidden attribute when closed), .ddd-combobox-group,
 * .ddd-combobox-group-label, .ddd-combobox-option (aria-selected="true" is
 * the active option: an accent bar, a tint and bold text, so it does not
 * rely on colour), .ddd-combobox-option-meta (a muted second line or tag),
 * .ddd-combobox-empty. Keep focus on the input and move the active option
 * with aria-activedescendant; the input shows the DDD focus ring.
 *
 * TOGGLE GROUP (joined .ddd-block-action.has-text buttons, aria-pressed)
 *
 *   <div class="ddd-toggle-group" role="group" aria-label="Show">
 *     <button class="ddd-block-action has-text" aria-pressed="true">All</button>
 *     <button class="ddd-block-action has-text" aria-pressed="false">Tools</button>
 *   </div>
 *
 * Pressed buttons keep the DDDBlock look (navy fill). For toggles that carry
 * meaning inside them, like a legend whose buttons show a coloured line
 * sample, add .swatches to the group: pressed then shows an accent border,
 * a light tint and bold text instead of a full fill, so the sample keeps its
 * own colour. Put the sample in a .ddd-toggle-swatch span and give it its
 * colour and line style:
 *
 *   <div class="ddd-toggle-group swatches" role="group" aria-label="Lines">
 *     <button class="ddd-block-action has-text" aria-pressed="true">
 *       <span class="ddd-toggle-swatch" aria-hidden="true"
 *         style="--ddd-toggle-swatch-color: var(--ddd-chart-3);
 *           --ddd-toggle-swatch-line: dashed"></span>Contract
 *     </button>
 *   </div>
 *
 * Not pressed, a swatch dims but keeps its colour and line style, and the
 * button word stays at full contrast. Both looks need DDDBlockStyles, which
 * DDDToggleGroupStyles includes.
 *
 * Custom properties, set on :host and safe to override: --ddd-combobox-max-height,
 * --ddd-toggle-swatch-color (currentColor), --ddd-toggle-swatch-line (a
 * border-style, solid), --ddd-toggle-swatch-width (line thickness).
 */
import { css } from "lit";
import { DDDBlockStyles } from "./DDDBlock.js";

export const DDDComboboxStyles = css`
  :host {
    --ddd-combobox-max-height: 320px;
  }
  .ddd-combobox {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--ddd-spacing-1);
    font-family: var(--ddd-font-primary);
    min-width: 0;
  }
  .ddd-combobox-label {
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-font-size-4xs);
    font-weight: var(--ddd-font-weight-medium);
    color: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-white)
    );
  }
  .ddd-combobox-input {
    box-sizing: border-box;
    width: 100%;
    min-height: var(--ddd-control-height-sm);
    margin: var(--ddd-spacing-0);
    padding-block: var(--ddd-spacing-2);
    padding-inline: var(--ddd-spacing-3);
    border: var(--ddd-border-size-xs) solid
      light-dark(
        var(--ddd-theme-default-slateGray),
        var(--ddd-theme-default-limestoneGray)
      );
    border-radius: var(--ddd-radius-sm);
    background-color: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    color: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-white)
    );
    font-family: var(--ddd-font-primary);
    font-size: var(--ddd-font-size-4xs);
    line-height: var(--ddd-lh-140);
  }
  .ddd-combobox-input::placeholder {
    color: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneLight)
    );
    opacity: 1;
  }
  .ddd-combobox-input:hover {
    border-color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
  }
  .ddd-combobox-input:focus-visible {
    outline: var(--ddd-focus-ring);
    outline-offset: var(--ddd-focus-offset);
  }
  .ddd-combobox-listbox {
    position: absolute;
    inset-block-start: 100%;
    inset-inline: var(--ddd-spacing-0);
    z-index: var(--ddd-z-dropdown);
    box-sizing: border-box;
    max-height: var(--ddd-combobox-max-height);
    overflow-y: auto;
    margin-block-start: var(--ddd-spacing-1);
    padding-block: var(--ddd-spacing-1);
    border: var(--ddd-border-xs);
    border-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
    border-radius: var(--ddd-radius-sm);
    background-color: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    box-shadow: var(--ddd-boxShadow-md);
  }
  .ddd-combobox-listbox[hidden] {
    display: none;
  }
  .ddd-combobox-group + .ddd-combobox-group {
    margin-block-start: var(--ddd-spacing-1);
    padding-block-start: var(--ddd-spacing-1);
    border-block-start: var(--ddd-border-xs);
    border-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
  }
  .ddd-combobox-group-label {
    padding-block: var(--ddd-spacing-1);
    padding-inline: var(--ddd-spacing-3);
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-font-size-6xs);
    font-weight: var(--ddd-font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneLight)
    );
  }
  :host(:lang(ar)) .ddd-combobox-group-label,
  :host(:lang(fa)) .ddd-combobox-group-label,
  :host(:lang(he)) .ddd-combobox-group-label,
  :host(:lang(ur)) .ddd-combobox-group-label {
    letter-spacing: 0;
  }
  .ddd-combobox-option {
    display: flex;
    align-items: center;
    gap: var(--ddd-spacing-2);
    min-height: var(--ddd-control-height-sm);
    box-sizing: border-box;
    padding-block: var(--ddd-spacing-1);
    padding-inline: var(--ddd-spacing-3);
    border-inline-start: var(--ddd-border-size-md) solid transparent;
    font-size: var(--ddd-font-size-4xs);
    line-height: var(--ddd-lh-120);
    color: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-white)
    );
    cursor: pointer;
    overflow-wrap: anywhere;
  }
  .ddd-combobox-option:hover {
    background-color: light-dark(
      var(--ddd-theme-default-limestoneMaxLight),
      var(--ddd-theme-default-potentialMidnight)
    );
  }
  .ddd-combobox-option[aria-selected="true"] {
    border-inline-start-color: light-dark(
      var(--ddd-theme-default-link),
      var(--ddd-theme-default-linkLight)
    );
    background-color: light-dark(
      var(--ddd-theme-default-skyMaxLight),
      var(--ddd-theme-default-potentialMidnight)
    );
    color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-white)
    );
    font-weight: var(--ddd-font-weight-bold);
  }
  .ddd-combobox-option[aria-disabled="true"] {
    cursor: default;
    opacity: 0.6;
  }
  .ddd-combobox-option-meta {
    margin-inline-start: auto;
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-font-size-6xs);
    font-weight: var(--ddd-font-weight-regular);
    color: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneLight)
    );
  }
  .ddd-combobox-empty {
    padding-block: var(--ddd-spacing-2);
    padding-inline: var(--ddd-spacing-3);
    font-size: var(--ddd-font-size-5xs);
    font-style: italic;
    color: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneLight)
    );
  }
  @media (forced-colors: active) {
    .ddd-combobox-option[aria-selected="true"] {
      border-inline-start-color: Highlight;
      outline: var(--ddd-border-size-xs) solid Highlight;
    }
  }
`;

export const DDDToggleGroupStyles = [
  DDDBlockStyles,
  css`
    :host {
      --ddd-toggle-swatch-color: currentColor;
      --ddd-toggle-swatch-line: solid;
      --ddd-toggle-swatch-width: var(--ddd-border-size-md);
    }
    .ddd-toggle-group {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: stretch;
      max-width: 100%;
    }
    .ddd-toggle-group > .ddd-block-action {
      border-radius: 0;
    }
    .ddd-toggle-group > .ddd-block-action + .ddd-block-action {
      margin-inline-start: calc(-1 * var(--ddd-border-size-xs));
    }
    .ddd-toggle-group > .ddd-block-action:first-child {
      border-start-start-radius: var(--ddd-radius-rounded);
      border-end-start-radius: var(--ddd-radius-rounded);
    }
    .ddd-toggle-group > .ddd-block-action:last-child {
      border-start-end-radius: var(--ddd-radius-rounded);
      border-end-end-radius: var(--ddd-radius-rounded);
    }
    /* the hovered, pressed or focused button draws over its neighbours so
       its whole border shows */
    .ddd-toggle-group > .ddd-block-action:hover,
    .ddd-toggle-group > .ddd-block-action:focus-visible,
    .ddd-toggle-group > .ddd-block-action[aria-pressed="true"] {
      position: relative;
      z-index: 1;
    }
    .ddd-toggle-group > .ddd-block-action:focus-visible {
      z-index: 2;
    }
    /* pressed variant for toggles that carry a swatch: accent border, a
       light tint and bold text, never a fill that hides the swatch */
    .ddd-toggle-group.swatches > .ddd-block-action[aria-pressed="true"] {
      border-color: light-dark(
        var(--ddd-theme-default-link),
        var(--ddd-theme-default-linkLight)
      );
      box-shadow: inset 0 0 0 var(--ddd-border-size-xs)
        light-dark(
          var(--ddd-theme-default-link),
          var(--ddd-theme-default-linkLight)
        );
      background-color: light-dark(
        var(--ddd-theme-default-skyMaxLight),
        var(--ddd-theme-default-potentialMidnight)
      );
      color: light-dark(
        var(--ddd-theme-default-nittanyNavy),
        var(--ddd-theme-default-white)
      );
      font-weight: var(--ddd-font-weight-bold);
    }
    .ddd-toggle-swatch {
      display: inline-block;
      flex: none;
      width: var(--ddd-icon-4xs);
      height: 0;
      border-block-start: var(--ddd-toggle-swatch-width)
        var(--ddd-toggle-swatch-line) var(--ddd-toggle-swatch-color);
    }
    .ddd-toggle-group.swatches
      > .ddd-block-action[aria-pressed="false"]
      .ddd-toggle-swatch {
      opacity: var(--ddd-opacity-60, 0.6);
    }
    @media (forced-colors: active) {
      .ddd-toggle-group.swatches > .ddd-block-action[aria-pressed="true"] {
        border-color: Highlight;
        box-shadow: inset 0 0 0 var(--ddd-border-size-xs) Highlight;
      }
    }
  `,
];
