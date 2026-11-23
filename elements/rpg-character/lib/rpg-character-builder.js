/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { HaxUiAdminStyles } from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import { HaxUiAdminSimpleFields } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/i18n-manager.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-pager/simple-pager.js";
import {
  RpgCharacter,
  traitsFromSeed,
  encodeCharacter,
  decodeCharacter,
  codeSlots,
} from "../rpg-character.js";

// numeric look traits a name (seed) picks; every other choice is kept
const lookSlots = [
  "base",
  "skin",
  "hair",
  "hatColor",
  "face",
  "faceItem",
  "accessories",
  "shirt",
  "pants",
];
// slots Surprise me fills about a third of the time
const extraSlots = [
  "preset",
  "hat",
  "mask",
  "makeup",
  "expression",
  "pose",
  "item",
  "offhand",
  "feet",
  "pet",
];
// hats that are really hairstyles, offered in the Hair tab
const hairHats = ["messy-hair", "wild-hair", "flat-top", "wig"];
// on / off effects, each one tile that flips when clicked
const toggleSlots = ["fire", "circle", "seasonal"];
// rows of tiles per page when the builder's height is not bounded (a page)
const ROWS = 3;

// regions of rpg-character's 113 x 142 art, [x, y, w, h], that a tile zooms to
const R = {
  full: [0, 0, 113, 142],
  head: [8, 0, 97, 97],
  face: [20, 42, 73, 56],
  torso: [8, 70, 97, 72],
  legs: [16, 92, 81, 50],
  hands: [10, 40, 103, 102],
  pet: [0, 56, 113, 86],
};
// swatch colors (hex, no #), read from rpg-character's own art: lib/skin, lib/hatColor, lib/hair
const swatches = {
  skin: [
    "F7DECE",
    "F3D2A2",
    "A7A7A7",
    "D5AB88",
    "AF7E57",
    "7C533E",
    "FFDC5D",
    "5DB1FF",
    "66DE52",
    "D772C7",
  ],
  hatColor: [
    "979797",
    "E40101",
    "1390EB",
    "484848",
    "89EDD5",
    "E6EB13",
    "8C13EB",
    "13EB1B",
    "E46001",
    "EB1387",
  ],
  hair: [
    "F8F8F8",
    "282828",
    "A42424",
    "C47328",
    "D5EF38",
    "32923B",
    "3DAAB1",
    "46299B",
    "745336",
    "E3CE96",
  ],
};
// English names for numbered art, read off the art itself; each is a this.t key (shirt3)
const artNames = {
  face: ["Plain", "Frown", "Straight", "Smirk", "Mustache", "Grin"],
  faceItem: [
    "None",
    "Monocle, tinted",
    "Monocle, right",
    "Monocle, left",
    "Eye patch",
    "Eye patch, left",
    "Brown shades",
    "Silver glasses",
    "Gold glasses",
    "Sunglasses",
  ],
  accessories: [
    "None",
    "Gold necklace",
    "Red bow tie",
    "Black bow tie",
    "Blue bow tie",
    "Blue tie",
    "Red tie",
    "Purple tie",
    "Gold chain",
    "Silver chain",
  ],
  shirt: [
    "Black tee",
    "Lace top",
    "White button-up",
    "Red tee",
    "Red long sleeve",
    "Blue long sleeve",
    "White long sleeve",
    "Blue tee",
    "White tee",
    "Black long sleeve",
  ],
  pants: [
    "Black pants",
    "Denim",
    "Charcoal",
    "White pants",
    "White cuffed",
    "Black cuffed",
    "Denim cuffed",
    "Faded denim",
    "Black worn",
    "White worn",
  ],
  skin: [
    "Porcelain",
    "Sand",
    "Stone",
    "Tan",
    "Bronze",
    "Umber",
    "Sunny",
    "Sky",
    "Leaf",
    "Orchid",
  ],
  hatColor: [
    "Gray",
    "Red",
    "Blue",
    "Black",
    "Mint",
    "Yellow",
    "Purple",
    "Green",
    "Orange",
    "Pink",
  ],
  hair: [
    "White",
    "Black",
    "Red",
    "Copper",
    "Lime",
    "Green",
    "Teal",
    "Indigo",
    "Brown",
    "Blonde",
  ],
};
const artKey = (slot, i) => `${slot}${i}`;

const slotValues = (name) => {
  const slot = codeSlots.find((s) => s.name === name);
  // "random" is not something a code can keep
  return slot ? slot.values.filter((v) => v !== "random") : [];
};

/**
 * A character from an address like rpg.art.hax.cloud's: ?code= wins; otherwise
 * ?seed= as a name, or as the 8-digit seed old rpg-me links carry (body, face,
 * glasses, hair, pants, shirt, skin, hair color), plus the old &hat= and
 * &fire= choices. Returns { code, seed, walking }, or null.
 */
export function characterFromParams(search) {
  const params = new URLSearchParams(search || "");
  const walking = params.get("walking") === "true";
  const code = (params.get("code") || "").trim();
  if (code && decodeCharacter(code)) {
    return { code, seed: "", walking };
  }
  const seed = (params.get("seed") || "").trim();
  if (!seed) {
    return null;
  }
  let character;
  if (/^\d{1,8}$/.test(seed)) {
    const d = seed.padStart(8, "0").split("").map(Number);
    const clamp = (name, v) => {
      const values = slotValues(name);
      return values.includes(v) ? v : values[values.length - 1];
    };
    character = {
      base: clamp("base", d[0]),
      face: clamp("face", d[1]),
      faceItem: d[2],
      hair: d[3],
      pants: d[4],
      shirt: d[5],
      skin: d[6],
      hatColor: d[7],
    };
  } else {
    character = traitsFromSeed(seed);
    character.base = Number(character.base);
  }
  const hat = params.get("hat");
  if (hat && slotValues("hat").includes(hat)) {
    character.hat = hat;
  }
  if (params.get("fire") === "true") {
    character.fire = true;
  }
  return {
    code: encodeCharacter(character),
    seed: /^\d+$/.test(seed) ? "" : seed,
    walking,
  };
}

/**
 * `rpg-character-builder`
 * Build an rpg-character by picture, the way the Wii's Mii editor worked:
 * picture tabs (named on hover / focus), a paged grid of tiles that show each
 * option on your own character, colors beside the shapes, and a big preview
 * that tries an option on while you hover or focus it. Gives back a character
 * code that recreates it anywhere (`<rpg-character code="...">`).
 *
 * The same builder runs in HAXcms (the user menu's character, in a dialog
 * with `actions`) and on rpg.art.hax.cloud, which adds `sync-url` so the
 * address bar is always a share link to what is on screen.
 *
 * @demo demo/builder.html
 * @element rpg-character-builder
 * @fires value-changed - detail.value is the new character code
 * @fires rpg-character-builder-save - Save in the action bar; detail.code
 * @fires rpg-character-builder-cancel - Cancel in the action bar; detail.code
 */
class RpgCharacterBuilder extends I18NMixin(DDD) {
  static get tag() {
    return "rpg-character-builder";
  }

  constructor() {
    super();
    this.code = "";
    this.seed = "";
    this.status = "";
    this.actions = false;
    this.saveLabel = "";
    this.cancelLabel = "";
    this.syncUrl = false;
    this.walking = false;
    this.tab = "hair";
    this._section = 0;
    this._offset = 0;
    this._columns = 4;
    this._pageSize = 4 * ROWS;
    this._preview = "";
    this._trying = "";
    this._history = [];
    this._share = false;
    this._tileSize = 84;
    this._labels = {};
    this._initialCode = null;
    this._slide = 0;
    this.t = {
      characterBuilder: "Character builder",
      preview: "Character preview",
      name: "Name",
      nameHelp: "A name picks a look. Your other choices stay.",
      randomize: "Surprise me",
      undo: "Undo",
      undid: "Undid the last change.",
      walk: "Walk",
      stopWalking: "Stop walking",
      share: "Done, share it",
      codeAndEmbed: "Code and embed",
      code: "Character code",
      codeHelp: "Paste a code to load that character.",
      copyCode: "Copy code",
      copyLink: "Copy share link",
      copyEmbed: "Copy embed code",
      copied: "Copied!",
      invalidCode: "That is not a character code.",
      save: "Save",
      cancel: "Cancel",
      unsavedChanges: "Unsaved changes",
      noUnsavedChanges: "No unsaved changes",
      trying: "Trying on: {name}",
      picked: "{section}: {name}",
      removed: "{section}: took off {name}",
      showing: "{first}-{last} of {total}",
      page: "Page {page} of {pages}",
      previousPage: "Previous page",
      nextPage: "Next page",
      on: "On",
      off: "Off",
      none: "None",
      takeOffHint: "Click a chosen one again to take it off.",
      presetHint:
        "You're wearing the {preset} outfit. Picking your own {part} swaps it for your own clothes.",
      hatHint: "Picking a hairstyle takes off your {hat} so you can see it.",
      longHairHint: "Pick Long in Hairstyle to color it.",
      seasonalHint: "Seasonal look changes with the time of year.",
      tabCharacters: "Characters",
      readyMade: "Ready-made characters",
      noneType: "Your own look",
      tabBody: "Body and skin",
      pose: "Pose",
      skin: "Skin",
      hair: "Hair",
      hairstyle: "Hairstyle",
      short: "Short",
      long: "Long",
      shaved: "Shaved",
      hairColor: "Hair color",
      longHairColor: "Long hair color",
      face: "Face",
      mouth: "Mouth",
      expression: "Expression",
      glasses: "Glasses",
      hats: "Hats",
      disguise: "Masks and makeup",
      masks: "Masks",
      makeup: "Makeup",
      outfit: "Outfit",
      shirt: "Shirt",
      pants: "Pants",
      neckwear: "Neckwear",
      heldItems: "Held items",
      rightHand: "Right hand",
      leftHand: "Left hand",
      flagText: "Flag text",
      flagTextHelp: "Up to 4 letters on the flag.",
      feet: "Feet",
      pets: "Pets",
      effects: "Effects",
      fire: "Fire",
      circle: "Circle background",
      seasonal: "Seasonal look",
      walking: "Walking",
    };
    Object.keys(artNames).forEach((slot) => {
      artNames[slot].forEach((name, i) => {
        this.t[artKey(slot, i)] = name;
      });
    });
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales", import.meta.url).href,
    });
    // option and setting labels come from rpg-character's own (already
    // translated) HAX settings so they are never translated twice
    I18NManagerStore.registerLocalization({
      namespace: "rpg-character.haxProperties",
      localesPath: new URL("../locales", import.meta.url).href,
    });
    // tile size follows the builder's own width (a dialog or a page), and
    // a page holds as many tiles as fit; measured on the next frame, since
    // resizing tiles inside the observer would loop it
    this._resizer = new ResizeObserver(() => {
      globalThis.requestAnimationFrame(() => this._measure());
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /** The character code being built; set it to load a character */
      code: { type: String, reflect: true },
      /** Name the look (skin, hair...) is derived from */
      seed: { type: String },
      status: { type: String },
      /**
       * Draw a Cancel / Save action bar (in a dialog). Save fires
       * rpg-character-builder-save, Cancel rpg-character-builder-cancel.
       */
      actions: { type: Boolean, reflect: true },
      /** Label for Save in the action bar */
      saveLabel: { type: String, attribute: "save-label" },
      /** Label for Cancel in the action bar */
      cancelLabel: { type: String, attribute: "cancel-label" },
      /**
       * Keep the page address in step with the character (?code=, &walking=)
       * and load from it, so the address is a share link. Off by default:
       * only a page that is the builder (rpg.art.hax.cloud) turns it on.
       */
      syncUrl: { type: Boolean, attribute: "sync-url" },
      /** Preview only: walk in place (not part of the code) */
      walking: { type: Boolean, reflect: true },
      /** Builder tab on screen */
      tab: { type: String },
      _section: { type: Number, state: true },
      _offset: { type: Number, state: true },
      _columns: { type: Number, state: true },
      _pageSize: { type: Number, state: true },
      _preview: { type: String, state: true },
      _trying: { type: String, state: true },
      _history: { type: Array, state: true },
      _share: { type: Boolean, state: true },
      _tileSize: { type: Number, state: true },
      _labels: { type: Object, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminStyles,
      ...HaxUiAdminSimpleFields,
      css`
        /* the HAX UI admin look: tokens and controls come from
           HaxUiAdminStyles in d-d-d. Selection reads green, as in the Mii
           editor this builder takes after. */
        :host {
          display: block;
          box-sizing: border-box;
          color-scheme: var(--hax-ui-color-scheme, inherit);
          container: rpgb / inline-size;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          --rpgb-on: var(--hax-ui-success);
          --rpgb-on-bg: var(--hax-ui-success-soft);
          --rpgb-on-ink: var(--hax-ui-surface);
          --rpgb-tile-a: var(--hax-ui-surface);
          --rpgb-tile-b: var(--hax-ui-sunken);
        }
        /* in a dialog: fill it below its titlebar, the options scroll and
           the action bar stays */
        :host([actions]) {
          height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                48px
              )
          );
          min-height: 360px;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        button {
          font-family: inherit;
        }
        .frame {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }

        /* picture tabs */
        .tabs {
          flex: none;
          position: relative;
          border-bottom: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-sunken);
        }
        [role="tablist"] {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-5, 20px);
        }
        [role="tab"] {
          flex: none;
          width: 60px;
          height: 56px;
          padding: 0;
          display: grid;
          place-items: center;
          border-radius: var(--hax-ui-radius);
          border: 2px solid var(--hax-ui-line);
          background: linear-gradient(var(--rpgb-tile-a), var(--rpgb-tile-b));
          cursor: pointer;
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        [role="tab"]:hover {
          transform: translateY(-2px);
          border-color: var(--hax-ui-line-strong);
        }
        [role="tab"]:active {
          transform: translateY(1px);
        }
        [role="tab"][aria-selected="true"] {
          background: var(--rpgb-on);
          border-color: var(--rpgb-on);
        }
        [role="tab"][aria-selected="true"] .crop {
          background-color: var(--ddd-theme-default-white, #fff);
          border-radius: var(--ddd-radius-sm, 4px);
        }
        button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }

        .builder {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
        }

        /* preview */
        .preview {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3, 12px);
          padding: var(--ddd-spacing-5, 20px);
          border-right: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-sunken);
          overflow: auto;
        }
        .stage {
          position: relative;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1 / 1.05;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          background: radial-gradient(
            circle at 50% 42%,
            var(--hax-ui-surface) 0,
            var(--hax-ui-sunken) 70%
          );
        }
        .stage rpg-character {
          display: block;
          max-width: 100%;
        }
        .trying {
          position: absolute;
          bottom: var(--ddd-spacing-3, 12px);
          left: 50%;
          transform: translateX(-50%);
          max-width: 92%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 2px 12px;
          border-radius: var(--hax-ui-radius-pill);
          font-size: var(--hax-ui-admin-font-size-xs);
          background-color: var(--hax-ui-text);
          color: var(--hax-ui-surface);
        }
        .buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ddd-spacing-2, 8px);
        }
        .sharebox {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-3, 12px);
          border: 1px dashed var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
        }
        .status {
          min-height: 18px;
          margin: 0;
          text-align: center;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .status.error {
          color: var(--hax-ui-danger);
          font-weight: var(--ddd-font-weight-bold, 700);
        }

        /* option board */
        .board {
          overflow: auto;
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: var(--ddd-spacing-5, 20px);
          align-content: start;
        }
        .board.noside {
          grid-template-columns: minmax(0, 1fr);
        }
        .board-head {
          grid-column: 1 / -1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
        }
        .board-head h3 {
          margin: 0 auto 0 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .seg {
          min-height: 36px;
          padding: 0 12px;
          border-radius: var(--hax-ui-radius-pill);
          border: 2px solid var(--hax-ui-line);
          background-color: transparent;
          color: var(--hax-ui-text);
          font-size: var(--hax-ui-admin-font-size-xs);
          cursor: pointer;
        }
        .seg:hover {
          border-color: var(--hax-ui-line-strong);
        }
        .seg[aria-pressed="true"] {
          background-color: var(--rpgb-on-bg);
          border-color: var(--rpgb-on);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .options {
          min-width: 0;
        }
        .grid {
          display: grid;
          gap: var(--ddd-spacing-3, 12px);
          padding-bottom: var(--ddd-spacing-6, 24px);
        }
        .tile {
          position: relative;
          display: block;
          padding: 4px;
          border-radius: var(--hax-ui-radius);
          border: 2px solid var(--hax-ui-line);
          background: linear-gradient(var(--rpgb-tile-a), var(--rpgb-tile-b));
          cursor: pointer;
          transition:
            transform 0.14s ease,
            box-shadow 0.14s ease;
        }
        .tile[aria-pressed="true"] {
          background: var(--rpgb-on-bg);
          border-color: var(--rpgb-on);
          box-shadow: inset 0 0 0 2px var(--rpgb-on);
        }
        .tile:hover,
        .tile:focus-visible {
          transform: scale(1.28);
          z-index: 3;
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .tile:active {
          transform: scale(1.2);
        }
        .check {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background-color: var(--rpgb-on);
          color: var(--rpgb-on-ink);
        }
        .state {
          position: absolute;
          top: 4px;
          left: 4px;
          z-index: 1;
          padding: 0 6px;
          border-radius: var(--hax-ui-radius-pill);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          background-color: var(--hax-ui-text);
          color: var(--hax-ui-surface);
        }
        .tile[aria-pressed="true"] .state {
          background-color: var(--rpgb-on);
          color: var(--rpgb-on-ink);
        }
        .lbl {
          position: absolute;
          left: 50%;
          top: calc(100% + 4px);
          transform: translateX(-50%) scale(0.8);
          z-index: 4;
          opacity: 0;
          pointer-events: none;
          white-space: nowrap;
          padding: 2px 9px;
          border-radius: var(--hax-ui-radius-pill);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          background-color: var(--hax-ui-text);
          color: var(--hax-ui-surface);
          transition: opacity 0.12s ease;
        }
        .sw .lbl {
          transform: translateX(-50%);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .tile:hover .lbl,
        .tile:focus-visible .lbl,
        .sw:hover .lbl,
        .sw:focus-visible .lbl {
          opacity: 1;
        }
        .crop {
          position: relative;
          display: block;
          overflow: hidden;
        }
        .crop rpg-character {
          position: absolute;
          pointer-events: none;
        }
        simple-pager {
          --simple-pager-font-size: var(--hax-ui-admin-font-size-xs);
          margin: 0 0 var(--ddd-spacing-2, 8px);
        }
        .hint {
          max-width: 60ch;
          margin: 0 0 var(--ddd-spacing-2, 8px);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }

        /* colors beside the shapes */
        .side {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4, 16px);
        }
        .side h4 {
          margin: 0 0 var(--ddd-spacing-2, 8px);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .swatches {
          display: grid;
          grid-template-columns: repeat(5, 44px);
          gap: 6px;
        }
        .sw {
          position: relative;
          width: 44px;
          height: 44px;
          padding: 5px;
          border-radius: var(--ddd-radius-sm, 4px);
          border: 2px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
          cursor: pointer;
          transition: transform 0.12s ease;
        }
        .sw .c {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 3px;
          box-shadow: inset 0 -6px 0 rgba(0, 0, 0, 0.14);
        }
        .sw[aria-pressed="true"] {
          border-color: var(--rpgb-on);
          box-shadow: 0 0 0 2px var(--rpgb-on);
        }
        .sw:hover,
        .sw:focus-visible {
          transform: scale(1.18);
          z-index: 3;
        }
        .sw:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none;
        }

        /* action bar (in a dialog) */
        .ftr {
          flex: none;
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 56px;
          padding: 8px var(--ddd-spacing-5, 20px);
          border-top: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
        }
        .ftr .st {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .ftr .st.dirty {
          color: var(--hax-ui-text);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .ftr .mark {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--hax-ui-accent-strong);
        }

        /* mid widths (a dialog on a laptop): colors move under the tiles
           so the two never overlap */
        @container rpgb (max-width: 940px) {
          .board {
            grid-template-columns: minmax(0, 1fr);
          }
          .side {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
        /* narrow (a phone): the preview sits on top and everything scrolls
           above the action bar */
        @container rpgb (max-width: 720px) {
          .builder {
            display: block;
            overflow: auto;
          }
          .preview {
            border-right: 0;
            border-bottom: 1px solid var(--hax-ui-line);
          }
          .stage {
            aspect-ratio: auto;
            height: 268px;
          }
          .board,
          .board.noside {
            grid-template-columns: minmax(0, 1fr);
            overflow: visible;
            padding: var(--ddd-spacing-3, 12px);
          }
          .grid {
            gap: var(--ddd-spacing-2, 8px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="tab"],
          .tile,
          .sw,
          .lbl {
            transition: none;
          }
          .tile:hover,
          .tile:focus-visible,
          .sw:hover,
          .sw:focus-visible,
          [role="tab"]:hover {
            transform: none;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.syncUrl) {
      const fromUrl = characterFromParams(globalThis.location.search);
      if (fromUrl) {
        this.code = fromUrl.code;
        this.seed = fromUrl.seed;
        this.walking = fromUrl.walking;
      }
    }
    this._resizer.observe(this);
    this._loadLabels();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._resizer.observe(this.shadowRoot.querySelector(".board"));
    this._resizer.observe(this.shadowRoot.querySelector(".options"));
  }

  /**
   * Tile size from the builder's width; columns from the grid's width; rows
   * from the board's height when it is bounded (in a dialog), else 3. The
   * page keeps its first tile in view when the page size changes.
   */
  _measure() {
    const width = this.getBoundingClientRect().width;
    if (!width) {
      return;
    }
    const size = width < 420 ? 58 : width < 720 ? 68 : 84;
    // a tile is the art plus 4px padding and a 2px border on each side
    const tile = size + 12;
    const gap = width < 720 ? 8 : 12;
    const options = this.shadowRoot.querySelector(".options");
    const board = this.shadowRoot.querySelector(".board");
    const columns = Math.max(
      3,
      Math.floor(((options ? options.clientWidth : 0) + gap) / (tile + gap)),
    );
    let rows = ROWS;
    if (this.actions && board && width >= 720) {
      // room left for tiles once the heading, pager and hints are drawn
      const head = this.shadowRoot.querySelector(".board-head");
      const room = board.clientHeight - (head ? head.offsetHeight : 0) - 160;
      rows = Math.min(5, Math.max(2, Math.floor((room + gap) / (tile + gap))));
    }
    const pageSize = columns * rows;
    if (size !== this._tileSize) {
      this._tileSize = size;
    }
    if (columns !== this._columns) {
      this._columns = columns;
    }
    if (pageSize !== this._pageSize) {
      this._offset = Math.floor(this._offset / pageSize) * pageSize;
      this._pageSize = pageSize;
    }
  }

  disconnectedCallback() {
    this._resizer.disconnect();
    super.disconnectedCallback();
  }

  /**
   * English labels from rpg-character's HAX settings, overlaid with the
   * active language's translation when there is one.
   */
  async _loadLabels() {
    const labels = {};
    const merge = (configure) => {
      (configure || []).forEach((entry) => {
        const current = labels[entry.property] || { options: {} };
        labels[entry.property] = {
          title: entry.title || current.title,
          options: { ...current.options, ...(entry.options || {}) },
        };
      });
    };
    try {
      const response = await fetch(RpgCharacter.haxProperties);
      if (response.ok) {
        const schema = await response.json();
        merge(schema.settings && schema.settings.configure);
      }
    } catch {
      // labels fall back to option values
    }
    try {
      const translated = await I18NManagerStore.loadNamespaceFile(
        "rpg-character.haxProperties",
      );
      if (translated && translated.settings) {
        merge(translated.settings.configure);
      }
    } catch {
      // English labels are fine
    }
    this._labels = labels;
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("t") && changedProperties.get("t")) {
      this._loadLabels();
    }
    // a character to start from: the code if given, else the seed's look
    if (!decodeCharacter(this.code)) {
      const traits = traitsFromSeed(this.seed || "rpg");
      traits.base = Number(traits.base);
      this.code = encodeCharacter(traits);
    }
    // with an action bar, changes are staged against what it opened with
    if (this.actions && this._initialCode === null && this.code) {
      this._initialCode = this.code;
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      this.syncUrl &&
      (changedProperties.has("code") || changedProperties.has("walking"))
    ) {
      // the address bar stays a link to what is on screen
      try {
        globalThis.history.replaceState(
          globalThis.history.state,
          "",
          `${globalThis.location.pathname}?${this._query()}${globalThis.location.hash}`,
        );
      } catch {
        // some embedded contexts refuse history changes
      }
    }
    if (changedProperties.has("tab") || changedProperties.has("_section")) {
      // the side column comes and goes with the tab, so the room for tiles
      // can change without the builder changing size
      globalThis.requestAnimationFrame(() => this._measure());
    }
    if (this._slide) {
      // slide a new page of tiles in from the side it came from, so it reads
      // as more options and not the same grid changing
      const grid = this.shadowRoot.querySelector(".grid");
      const still =
        globalThis.matchMedia &&
        globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (grid && grid.animate && !still) {
        grid.animate(
          [
            { transform: `translateX(${this._slide * 48}px)`, opacity: 0 },
            { transform: "translateX(0)", opacity: 1 },
          ],
          { duration: 220, easing: "ease-out" },
        );
      }
      this._slide = 0;
    }
  }

  /** true when the code differs from what the builder opened with */
  get dirty() {
    return this._initialCode !== null && this.code !== this._initialCode;
  }

  get character() {
    return decodeCharacter(this.code) || decodeCharacter("1-");
  }

  _query() {
    const params = new URLSearchParams({ code: this.code });
    if (this.walking) {
      params.set("walking", "true");
    }
    return params.toString();
  }

  /** a link to this character, when the page keeps its address in step */
  get shareLink() {
    return `${globalThis.location.origin}${globalThis.location.pathname}?${this._query()}`;
  }

  /** markup that shows this character on any page that loads HAX */
  get embedCode() {
    return `<rpg-character code="${this.code}"${this.walking ? " walking" : ""}></rpg-character>`;
  }

  _save() {
    this.dispatchEvent(
      new CustomEvent("rpg-character-builder-save", {
        bubbles: true,
        composed: true,
        detail: { code: this.code },
      }),
    );
  }

  _cancel() {
    this.dispatchEvent(
      new CustomEvent("rpg-character-builder-cancel", {
        bubbles: true,
        composed: true,
        detail: { code: this.code },
      }),
    );
  }

  _set(name, value) {
    const character = this.character;
    character[name] = value;
    this._commit(encodeCharacter(character));
  }

  _commit(code) {
    this._preview = "";
    this._trying = "";
    if (code === this.code) {
      return;
    }
    this._history = [...this._history.slice(-29), this.code];
    this.code = code;
    this.status = "";
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: code },
      }),
    );
  }

  /** go back to the code before the last change */
  undo() {
    if (this._history.length) {
      const code = this._history[this._history.length - 1];
      this._history = this._history.slice(0, -1);
      this.code = code;
      this.status = this.t.undid;
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          bubbles: true,
          composed: true,
          detail: { value: code },
        }),
      );
    }
  }

  _seedChanged(e) {
    const value = e.detail.value || "";
    if (value === this.seed) {
      return;
    }
    this.seed = value;
    // a new name gives a new look; every other choice is kept
    const character = this.character;
    const traits = traitsFromSeed(this.seed || "rpg");
    lookSlots.forEach((slot) => {
      character[slot] = Number(traits[slot]);
    });
    this._commit(encodeCharacter(character));
  }

  _codeTyped(e) {
    const value = (e.detail.value || "").trim();
    if (value === this.code) {
      return;
    }
    if (decodeCharacter(value)) {
      this._commit(value);
    } else {
      this.status = this.t.invalidCode;
    }
  }

  randomize() {
    const pick = (list) => list[Math.floor(Math.random() * list.length)];
    const character = traitsFromSeed(Math.random().toString(36).substring(2));
    character.base = Number(character.base);
    extraSlots.forEach((name) => {
      // mostly keep it simple: each slot is set about a third of the time
      const values = slotValues(name).filter((v) => v !== "none");
      character[name] = Math.random() < 0.33 ? pick(values) : "none";
    });
    character.flagText = "";
    this._commit(encodeCharacter(character));
  }

  async _copy(text) {
    try {
      await globalThis.navigator.clipboard.writeText(text);
      this.status = this.t.copied;
    } catch {
      // clipboard blocked: show it so it can be copied by hand
      this.status = text;
    }
  }

  /** copy the character code */
  copyCode() {
    return this._copy(this.code);
  }

  _label(name, value) {
    const entry = this._labels[name];
    if (entry && entry.options && entry.options[value]) {
      return entry.options[value];
    }
    if (value === "none") {
      return this.t.none;
    }
    const text = String(value).replace(/-/g, " ");
    return text.charAt(0).toUpperCase() + text.substring(1);
  }

  _fill(text, values) {
    return Object.keys(values).reduce(
      (out, key) => out.replace(`{${key}}`, () => values[key]),
      text,
    );
  }

  /** the code with some slots changed (and one slot cleared, if asked) */
  _with(set, clears) {
    const character = { ...this.character, ...set };
    if (clears) {
      character[clears] = "none";
    }
    return encodeCharacter(character);
  }

  _isOn(option) {
    const character = this.character;
    return Object.keys(option.set).every((k) => character[k] === option.set[k]);
  }

  /** what a slot goes back to when its chosen tile is clicked again, if anything */
  _offValue(slot) {
    const values = slotValues(slot);
    if (values[0] === "none") {
      return "none";
    }
    if (slot === "faceItem" || slot === "accessories") {
      return 0;
    }
    return null;
  }

  // ---------- builder model ----------

  _slotOptions(slot, region, named) {
    return slotValues(slot).map((value, i) => ({
      key: `${slot}-${value}`,
      slot,
      label: named ? this.t[artKey(slot, i)] : this._label(slot, value),
      set: { [slot]: value },
      region,
    }));
  }

  /** the tabs, in order: id, label, icon (a code and region), sections of tiles, side swatches */
  get tabs() {
    const t = this.t;
    const icon = (set, region) => ({
      code: encodeCharacter({
        base: 0,
        skin: 0,
        hatColor: 3,
        shirt: 7,
        pants: 1,
        ...set,
      }),
      region,
    });
    const styles = [
      {
        key: "short",
        label: t.short,
        set: { base: 0, shaved: false, hat: "none" },
      },
      {
        key: "long",
        label: t.long,
        set: { base: 1, shaved: false, hat: "none" },
      },
      { key: "shaved", label: t.shaved, set: { shaved: true, hat: "none" } },
      ...hairHats.map((hat) => ({
        key: hat,
        label: this._label("hat", hat),
        set: { hat, shaved: false },
      })),
    ].map((o) => ({ ...o, region: R.head }));
    return [
      {
        id: "character",
        label: t.tabCharacters,
        icon: icon({ preset: "knight" }, R.full),
        sections: [
          {
            name: t.readyMade,
            options: slotValues("preset").map((preset) => ({
              key: `preset-${preset}`,
              slot: "preset",
              label:
                preset === "none" ? t.noneType : this._label("preset", preset),
              set: { preset },
              region: R.full,
            })),
          },
        ],
      },
      {
        id: "body",
        label: t.tabBody,
        icon: icon({}, R.full),
        sections: [
          { name: t.pose, options: this._slotOptions("pose", R.full) },
        ],
        side: [{ slot: "skin", name: t.skin }],
      },
      {
        id: "hair",
        label: t.hair,
        icon: icon({ base: 1, hair: 3 }, [8, 40, 97, 70]),
        sections: [{ name: t.hairstyle, options: styles, fixed: true }],
        side: [
          { slot: "hatColor", name: t.hairColor },
          { slot: "hair", name: t.longHairColor, long: true },
        ],
      },
      {
        id: "face",
        label: t.face,
        icon: icon({ face: 5 }, [14, 46, 85, 50]),
        sections: [
          {
            name: t.mouth,
            options: this._slotOptions("face", R.face, true),
            fixed: true,
          },
          {
            name: t.expression,
            options: this._slotOptions("expression", R.face),
          },
        ],
      },
      {
        id: "glasses",
        label: t.glasses,
        icon: icon({ faceItem: 9 }, [20, 52, 73, 36]),
        sections: [
          {
            name: t.glasses,
            options: this._slotOptions("faceItem", R.face, true),
          },
        ],
      },
      {
        id: "hat",
        label: t.hats,
        icon: icon({ hat: "top-hat" }, [8, 0, 97, 62]),
        sections: [{ name: t.hats, options: this._slotOptions("hat", R.head) }],
      },
      {
        id: "disguise",
        label: t.disguise,
        icon: icon({ mask: "theater" }, R.head),
        sections: [
          { name: t.masks, options: this._slotOptions("mask", R.head) },
          { name: t.makeup, options: this._slotOptions("makeup", R.face) },
        ],
      },
      {
        id: "outfit",
        label: t.outfit,
        icon: icon({ shirt: 3, accessories: 6 }, [18, 78, 77, 40]),
        sections: [
          {
            name: t.shirt,
            options: this._slotOptions("shirt", R.torso, true),
            clears: "preset",
            fixed: true,
          },
          {
            name: t.pants,
            options: this._slotOptions("pants", R.legs, true),
            clears: "preset",
            fixed: true,
          },
          {
            name: t.neckwear,
            options: this._slotOptions("accessories", R.torso, true),
          },
        ],
      },
      {
        id: "hands",
        label: t.heldItems,
        icon: icon({ item: "sword" }, [56, 36, 57, 90]),
        sections: [
          { name: t.rightHand, options: this._slotOptions("item", R.hands) },
          { name: t.leftHand, options: this._slotOptions("offhand", R.hands) },
        ],
      },
      {
        id: "feet",
        label: t.feet,
        icon: icon({ feet: "skateboard" }, [12, 100, 89, 42]),
        sections: [
          { name: t.feet, options: this._slotOptions("feet", R.legs) },
        ],
      },
      {
        id: "pet",
        label: t.pets,
        icon: icon({ pet: "cat" }, [0, 90, 52, 52]),
        sections: [{ name: t.pets, options: this._slotOptions("pet", R.pet) }],
      },
      {
        id: "effects",
        label: t.effects,
        icon: icon({ fire: true }, R.full),
        sections: [
          {
            name: t.effects,
            toggles: true,
            options: [
              ...toggleSlots.map((slot) => ({
                key: slot,
                slot,
                label: t[slot],
                set: { [slot]: true },
                region: R.full,
              })),
              {
                key: "walking",
                label: t.walking,
                walking: true,
                region: R.full,
              },
            ],
          },
        ],
      },
    ];
  }

  get tabDef() {
    const tabs = this.tabs;
    return tabs.find((tab) => tab.id === this.tab) || tabs[0];
  }

  _setTab(id) {
    this.tab = id;
    this._section = 0;
    this._offset = 0;
    this._untry();
  }

  _tabKey(e) {
    const ids = this.tabs.map((tab) => tab.id);
    const at = ids.indexOf(this.tab);
    let next = null;
    if (e.key === "ArrowRight") next = ids[(at + 1) % ids.length];
    if (e.key === "ArrowLeft") next = ids[(at - 1 + ids.length) % ids.length];
    if (e.key === "Home") next = ids[0];
    if (e.key === "End") next = ids[ids.length - 1];
    if (next) {
      e.preventDefault();
      this._setTab(next);
      this.updateComplete.then(() => {
        const button = this.shadowRoot.querySelector(`#tab-${next}`);
        if (button) {
          button.focus();
        }
      });
    }
  }

  _pageChanged(e) {
    const offset = e.detail.offset;
    if (offset === this._offset) {
      return;
    }
    this._slide = offset > this._offset ? 1 : -1;
    this._offset = offset;
    this._untry();
  }

  /**
   * What clicking (or trying) a tile does: a toggle flips; a chosen tile of a
   * slot that can be empty goes back to empty; anything else is picked.
   */
  _result(option, section) {
    if (option.walking) {
      return { code: this.code, walking: !this.walking, on: !this.walking };
    }
    if (section.toggles) {
      const on = !this.character[option.slot];
      return { code: this._with({ [option.slot]: on }), on };
    }
    if (this._isOn(option) && option.slot && !section.fixed) {
      const off = this._offValue(option.slot);
      if (off !== null && option.set[option.slot] !== off) {
        return { code: this._with({ [option.slot]: off }), removed: true };
      }
    }
    return { code: this._with(option.set, section.clears) };
  }

  _optionOn(option) {
    return option.walking ? this.walking : this._isOn(option);
  }

  _try(option, section) {
    this._preview = option.walking ? "" : this._result(option, section).code;
    this._trying = option.label;
  }

  _untry() {
    this._preview = "";
    this._trying = "";
  }

  _pick(option, section) {
    const result = this._result(option, section);
    if (option.walking) {
      this.walking = result.walking;
      this._untry();
    } else {
      this._commit(result.code);
    }
    let text = this._fill(this.t.picked, {
      section: section.name,
      name: option.label,
    });
    if (section.toggles) {
      text = this._fill(this.t.picked, {
        section: option.label,
        name: result.on ? this.t.on : this.t.off,
      });
    } else if (result.removed) {
      text = this._fill(this.t.removed, {
        section: section.name,
        name: option.label,
      });
    }
    this.status = text;
  }

  _swatchTry(side, i) {
    this._preview = this._with({ [side.slot]: i });
    this._trying = `${side.name}: ${this.t[artKey(side.slot, i)]}`;
  }

  /** a square window onto a character, zoomed to a region of its art */
  _crop(code, region, size) {
    const [x, y, w, h] = region;
    const most = Math.max(w, h);
    const scale = size / most;
    const left = (-x + (most - w) / 2) * scale;
    const top = (-y + (most - h) / 2) * scale;
    return html`<span class="crop" style="width:${size}px;height:${size}px"
      ><rpg-character
        aria-hidden="true"
        code="${code}"
        width="${Math.round(113 * scale)}"
        height="${Math.round(142 * scale)}"
        style="left:${left}px;top:${top}px"
      ></rpg-character
    ></span>`;
  }

  render() {
    const character = this.character;
    const tabs = this.tabs;
    return html`
      <div class="frame">
        <div class="tabs">
          <div
            role="tablist"
            aria-label="${this.t.characterBuilder}"
            @keydown="${this._tabKey}"
          >
            ${tabs.map(
              (tab) =>
                html`<button
                  type="button"
                  role="tab"
                  id="tab-${tab.id}"
                  aria-controls="panel"
                  aria-label="${tab.label}"
                  aria-selected="${this.tab === tab.id ? "true" : "false"}"
                  tabindex="${this.tab === tab.id ? "0" : "-1"}"
                  @click="${() => this._setTab(tab.id)}"
                >
                  ${this._crop(tab.icon.code, tab.icon.region, 40)}
                </button>`,
            )}
          </div>
          ${tabs.map(
            (tab) =>
              html`<simple-tooltip
                for="tab-${tab.id}"
                position="bottom"
                offset="4"
                >${tab.label}</simple-tooltip
              >`,
          )}
        </div>
        <div class="builder">
          ${this.renderPreview()} ${this.renderBoard(character)}
        </div>
        ${this.actions ? this.renderActions() : ""}
      </div>
    `;
  }

  renderPreview() {
    const invalid = this.status === this.t.invalidCode;
    const big = this._tileSize > 70;
    return html`<div class="preview">
      <figure class="stage" aria-label="${this.t.preview}">
        <rpg-character
          code="${this._preview || this.code}"
          ?walking="${this.walking}"
          width="${big ? 226 : 190}"
          height="${big ? 284 : 239}"
        ></rpg-character>
        ${
          this._trying
            ? html`<figcaption class="trying">
                ${this._fill(this.t.trying, { name: this._trying })}
              </figcaption>`
            : ""
        }
      </figure>
      <simple-fields-field
        class="hax-ui-simple-field"
        id="seed"
        label="${this.t.name}"
        description="${this.t.nameHelp}"
        .value="${this.seed}"
        @value-changed="${this._seedChanged}"
      ></simple-fields-field>
      <div class="buttons">
        <button
          type="button"
          class="hax-ui-btn undo"
          ?disabled="${!this._history.length}"
          @click="${this.undo}"
        >
          ${this.t.undo}
        </button>
        <button
          type="button"
          class="hax-ui-btn randomize"
          @click="${this.randomize}"
        >
          ${this.t.randomize}
        </button>
        <button
          type="button"
          class="hax-ui-btn"
          aria-pressed="${this.walking ? "true" : "false"}"
          @click="${() => {
            this.walking = !this.walking;
          }}"
        >
          ${this.walking ? this.t.stopWalking : this.t.walk}
        </button>
        <button
          type="button"
          class="hax-ui-btn ${this.actions ? "" : "primary"} share"
          aria-expanded="${this._share ? "true" : "false"}"
          aria-controls="sharebox"
          @click="${() => {
            this._share = !this._share;
          }}"
        >
          ${this.actions ? this.t.codeAndEmbed : this.t.share}
        </button>
      </div>
      ${
        this._share
          ? html`<div class="sharebox" id="sharebox">
              <simple-fields-field
                class="hax-ui-simple-field"
                id="code"
                label="${this.t.code}"
                description="${this.t.codeHelp}"
                .value="${this.code}"
                @value-changed="${this._codeTyped}"
              ></simple-fields-field>
              <div class="buttons">
                <button
                  type="button"
                  class="hax-ui-btn"
                  @click="${this.copyCode}"
                >
                  ${this.t.copyCode}
                </button>
                ${
                  this.syncUrl
                    ? html`<button
                        type="button"
                        class="hax-ui-btn"
                        @click="${() => this._copy(this.shareLink)}"
                      >
                        ${this.t.copyLink}
                      </button>`
                    : ""
                }
                <button
                  type="button"
                  class="hax-ui-btn"
                  @click="${() => this._copy(this.embedCode)}"
                >
                  ${this.t.copyEmbed}
                </button>
              </div>
            </div>`
          : ""
      }
      <p
        class="status ${invalid ? "error" : ""}"
        id="code-status"
        role="status"
        aria-live="polite"
      >
        ${this.status}
      </p>
    </div>`;
  }

  renderBoard(character) {
    const tab = this.tabDef;
    const section = tab.sections[this._section] || tab.sections[0];
    const total = section.options.length;
    const size = this._pageSize;
    const first = Math.min(this._offset, Math.floor((total - 1) / size) * size);
    const options = section.options.slice(first, first + size);
    const removable =
      !section.fixed &&
      !section.toggles &&
      section.options.some((o) => o.slot && this._offValue(o.slot) !== null);
    const flag = ["flag", "sparkle-flag"].includes(character.item);
    const hasSide = tab.side || (tab.id === "hands" && flag);
    return html`<div
      class="board ${hasSide ? "" : "noside"}"
      role="tabpanel"
      id="panel"
      aria-labelledby="tab-${tab.id}"
    >
      <div class="board-head">
        <h3>${tab.label}</h3>
        ${
          tab.sections.length > 1
            ? tab.sections.map(
                (s, i) =>
                  html`<button
                    type="button"
                    class="seg"
                    aria-pressed="${i === this._section ? "true" : "false"}"
                    @click="${() => {
                      this._section = i;
                      this._offset = 0;
                      this._untry();
                    }}"
                  >
                    ${s.name}
                  </button>`,
              )
            : ""
        }
      </div>
      <div class="options">
        <div
          class="grid"
          role="group"
          aria-label="${section.name}"
          style="grid-template-columns:repeat(${this._columns},max-content)"
        >
          ${options.map((option) => this.renderTile(option, section))}
        </div>
        <simple-pager
          mode="full"
          limit="${size}"
          offset="${first}"
          total="${total}"
          count="${options.length}"
          max-page-buttons="7"
          label="${section.name}"
          @page-changed="${this._pageChanged}"
        ></simple-pager>
        ${this.renderHints(tab, section, character, removable)}
      </div>
      ${
        hasSide
          ? html`<div class="side">
              ${(tab.side || []).map((side) =>
                this.renderSwatches(side, character),
              )}
              ${
                tab.id === "hands" && flag
                  ? html`<simple-fields-field
                      class="hax-ui-simple-field"
                      id="flag-text"
                      label="${this.t.flagText}"
                      description="${this.t.flagTextHelp}"
                      maxlength="4"
                      .value="${character.flagText}"
                      @value-changed="${(e) => {
                        const value = (e.detail.value || "").substring(0, 4);
                        if (value !== this.character.flagText) {
                          this._set("flagText", value);
                        }
                      }}"
                    ></simple-fields-field>`
                  : ""
              }
            </div>`
          : ""
      }
    </div>`;
  }

  renderTile(option, section) {
    const on = this._optionOn(option);
    // toggles always show the effect on, so the tile says what it does
    const code =
      section.toggles && option.slot
        ? this._with({ [option.slot]: true })
        : this._with(option.set || {}, section.clears);
    return html`<button
      type="button"
      class="tile"
      data-option="${option.key}"
      aria-pressed="${on ? "true" : "false"}"
      @pointerenter="${() => this._try(option, section)}"
      @pointerleave="${this._untry}"
      @focus="${() => this._try(option, section)}"
      @blur="${this._untry}"
      @click="${() => this._pick(option, section)}"
    >
      ${
        section.toggles
          ? html`<span class="state" aria-hidden="true"
              >${on ? this.t.on : this.t.off}</span
            >`
          : ""
      }
      ${this._crop(code, option.region, this._tileSize)}
      ${
        on && !section.toggles
          ? html`<span class="check" aria-hidden="true"
              ><svg width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M2 6.5 5 9.5 10 3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ></path></svg
            ></span>`
          : ""
      }
      <span class="lbl">${option.label}</span>
    </button>`;
  }

  renderHints(tab, section, character, removable) {
    const hints = [];
    if (removable) {
      hints.push(this.t.takeOffHint);
    }
    if (section.clears && character.preset !== "none") {
      hints.push(
        this._fill(this.t.presetHint, {
          preset: this._label("preset", character.preset),
          part: section.name.toLowerCase(),
        }),
      );
    }
    if (
      tab.id === "hair" &&
      character.hat !== "none" &&
      !hairHats.includes(character.hat)
    ) {
      hints.push(
        this._fill(this.t.hatHint, {
          hat: this._label("hat", character.hat).toLowerCase(),
        }),
      );
    }
    if (tab.id === "effects") {
      hints.push(this.t.seasonalHint);
    }
    return hints.map((hint) => html`<p class="hint">${hint}</p>`);
  }

  renderSwatches(side, character) {
    const off = side.long && character.base !== 1;
    return html`<div role="group" aria-labelledby="side-${side.slot}">
      <h4 id="side-${side.slot}">${side.name}</h4>
      <div class="swatches">
        ${swatches[side.slot].map((hex, i) => {
          const name = this.t[artKey(side.slot, i)];
          return html`<button
            type="button"
            class="sw"
            data-swatch="${side.slot}-${i}"
            aria-label="${side.name}: ${name}"
            aria-pressed="${
              Number(character[side.slot]) === i ? "true" : "false"
            }"
            ?disabled="${off}"
            @pointerenter="${() => {
              if (!off) {
                this._swatchTry(side, i);
              }
            }}"
            @pointerleave="${this._untry}"
            @focus="${() => this._swatchTry(side, i)}"
            @blur="${this._untry}"
            @click="${() => {
              this._set(side.slot, i);
              this.status = this._fill(this.t.picked, {
                section: side.name,
                name,
              });
            }}"
          >
            <span class="c" style="background-color:#${hex}"></span
            ><span class="lbl" aria-hidden="true">${name}</span>
          </button>`;
        })}
      </div>
      ${off ? html`<p class="hint">${this.t.longHairHint}</p>` : ""}
    </div>`;
  }

  renderActions() {
    const dirty = this.dirty;
    return html`<div class="ftr">
      <div class="st ${dirty ? "dirty" : ""}" role="status" aria-live="polite">
        ${
          dirty
            ? html`<span class="mark" aria-hidden="true"></span>${
                  this.t.unsavedChanges
                }`
            : this.t.noUnsavedChanges
        }
      </div>
      <button
        type="button"
        class="hax-ui-btn ghost cancel"
        @click="${this._cancel}"
      >
        ${this.cancelLabel || this.t.cancel}
      </button>
      <button
        type="button"
        class="hax-ui-btn ${dirty ? "primary" : ""} save"
        ?disabled="${!dirty}"
        @click="${this._save}"
      >
        ${this.saveLabel || this.t.save}
      </button>
    </div>`;
  }
}
globalThis.customElements.define(RpgCharacterBuilder.tag, RpgCharacterBuilder);
export { RpgCharacterBuilder };
