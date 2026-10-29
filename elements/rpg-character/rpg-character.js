/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, svg } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import {
  encodeCharacter,
  decodeCharacter,
  codeSlots,
} from "./lib/rpg-character-code.js";
export { encodeCharacter, decodeCharacter, codeSlots };
import {
  skinColors,
  overlayColors,
  expressionArt,
  poseArt,
  armRegions,
  parseCells,
} from "./lib/rpg-character-overlays.js";
import {
  seasonFor,
  seasonalPick,
  easterSunday,
} from "./lib/rpg-character-seasons.js";
export { seasonFor, seasonalPick, easterSunday };
// face expressions drawn over the eyes and mouth
export const expressionList = Object.keys(expressionArt);
// arm poses; a raised arm puts down whatever that hand was holding
export const poseList = Object.keys(poseArt);
// default movement speed
const defaultSpeed = 500;
// default list of non-status related hats
export const hatList = [
  "bunny",
  "coffee",
  "construction",
  "cowboy",
  "education",
  "knight",
  "ninja",
  "party",
  "pirate",
  "watermelon",
  "apple",
  "banana",
  "orange",
  "pineapple",
  "strawberry",
  "hockey",
  "football",
  "firefighter",
  "police",
  "military",
  "nurse",
  "soda",
  "doctor",
  "helmet",
  "headband",
  "baseball",
  "visor",
  "bike-helmet",
  "goggles",
  "chef",
  "straw",
  "beret",
  "mail",
  "pilot",
  "astronaut",
  "wizard",
  "witch",
  "robot",
  "dino",
  "santa",
  "elf",
  "antlers",
  "top-hat",
  "tricorn",
  "wig",
];
// what hat="random" picks from: everyday hats, leaving costume and holiday
// hats to explicit choices and presets
const costumeHats = [
  "helmet",
  "astronaut",
  "wizard",
  "witch",
  "robot",
  "dino",
  "santa",
  "elf",
  "antlers",
  "tricorn",
  "wig",
];
export const randomHatList = hatList.filter((h) => !costumeHats.includes(h));
// full-head or face masks, drawn between the hair and the hat
export const maskList = [
  "lion",
  "plague",
  "theater",
  "pumpkin",
  "ghost",
  "mummy",
];
// makeup replaces the seed-derived face (mouth / facial hair) layer
export const makeupList = [
  "red-lipstick",
  "pink-lipstick",
  "berry-lipstick",
  "clown",
  "fangs",
  "skull",
  "zombie",
  "red-nose",
  "white-beard",
  "domino",
  "carrot",
  "bunny",
];
// things held in the right hand
export const itemList = [
  "football",
  "hockey-stick",
  "sword",
  "flag",
  "milkshake",
  "phone",
  "trophy",
  "basketball",
  "baseball-bat",
  "soccer-ball",
  "tennis-racket",
  "golf-club",
  "book",
  "apple",
  "flask",
  "spatula",
  "pitchfork",
  "paintbrush",
  "guitar",
  "envelope",
  "hammer",
  "wand",
  "broom",
  "candy-cane",
  "gift",
  "basket",
  "candy-bucket",
  "sack",
  "balloon",
];
// things held in the left hand
export const offhandList = ["shield", "palette"];
// things on or under the feet
export const feetList = ["skates", "skateboard"];
// companions beside the character: on the ground by the feet, perched by
// the head (parrot, owl) or floating overhead (bat)
// pets drawn by the head or overhead render above the hat; the rest sit on
// the ground behind anything held in the hands
export const perchedPetList = ["parrot", "owl", "bat"];
export const petList = [
  "cat",
  "dog",
  "bunny",
  "goldfish",
  "slime",
  "squirrel",
  "dragon",
  "parrot",
  "owl",
  "bat",
];
// Presets are a named outfit (lib/shirt/<name>.svg + lib/pants/<name>.svg)
// plus default gear. They never touch the seed-derived traits (skin, base,
// hair, face...), so a preset keeps whoever the seed made, girl or boy, and
// just dresses them. Explicit hat / mask / makeup / item / offhand / feet
// values win over the preset defaults.
export const presets = {
  hockey: { hat: "hockey", item: "hockey-stick", feet: "skates" },
  football: { hat: "football", item: "football" },
  firefighter: { hat: "firefighter" },
  police: { hat: "police" },
  veteran: { hat: "military" },
  nurse: { hat: "nurse" },
  it: { item: "phone" },
  doctor: { hat: "doctor" },
  soda: { hat: "soda", item: "milkshake" },
  knight: { hat: "knight", item: "sword", offhand: "shield" },
  pirate: { hat: "pirate", item: "sword" },
  graduate: { hat: "education" },
  basketball: { hat: "headband", item: "basketball" },
  baseball: { hat: "baseball", item: "baseball-bat" },
  soccer: { item: "soccer-ball" },
  tennis: { hat: "visor", item: "tennis-racket" },
  golf: { hat: "visor", item: "golf-club" },
  cycling: { hat: "bike-helmet" },
  teacher: { item: "book" },
  scientist: { hat: "goggles", item: "flask" },
  chef: { hat: "chef", item: "spatula" },
  farmer: { hat: "straw", item: "pitchfork" },
  artist: { hat: "beret", item: "paintbrush", offhand: "palette" },
  musician: { item: "guitar" },
  mail: { hat: "mail", item: "envelope" },
  pilot: { hat: "pilot" },
  astronaut: { hat: "astronaut" },
  construction: { hat: "construction", item: "hammer" },
  wizard: { hat: "wizard", item: "wand", makeup: "white-beard" },
  superhero: { makeup: "domino" },
  robot: { hat: "robot" },
  dinosaur: { hat: "dino" },
  ninja: { hat: "ninja", item: "sword" },
  witch: { hat: "witch", item: "broom" },
  vampire: { makeup: "fangs" },
  mummy: { mask: "mummy" },
  skeleton: { makeup: "skull" },
  ghost: { mask: "ghost" },
  pumpkin: { mask: "pumpkin", item: "candy-bucket" },
  zombie: { makeup: "zombie" },
  santa: { hat: "santa", item: "sack", makeup: "white-beard" },
  elf: { hat: "elf", item: "candy-cane" },
  reindeer: { hat: "antlers", makeup: "red-nose" },
  snowman: { hat: "top-hat", makeup: "carrot" },
  "easter-bunny": { hat: "bunny", item: "basket", makeup: "bunny" },
  colonial: { hat: "tricorn", item: "sword" },
};

export const charBuilder = {
  accessories: 9,
  base: 1,
  leg: ["", "R", "L"],
  face: 5,
  faceItem: 9,
  hair: 9,
  pants: 9,
  shirt: 9,
  skin: 9,
  hatColor: 9,
};
/**
 * The traits a seed (usually a username) produces. Pure apart from the
 * walking leg pose, which is picked at random as it always has been, so it
 * can be used by tools (like rpg-character-builder) that need a seed's look
 * without rendering a character.
 */
export function traitsFromSeed(seedText, literal = false) {
  // use the seed to generate a random number
  let seed = 54;
  for (let i = 0; i < seedText.length; i++) {
    // hard limit of 64 to be safe bc of calculation since seed is supposed to be like a name
    if (i < 64) {
      seed *= seedText.charCodeAt(i);
    }
  }
  const funKeys = {
    zpg: "7501517984378880262144",
    edtechjoker: "712215550",
    btopro: "7122155501",
  };
  // ensure huge numbers don't bust JS max
  seed = BigInt(seed).toString();
  if (Object.keys(funKeys).includes(seedText)) {
    seed = funKeys[seedText];
  }
  // support a literal seed value which is numerical selection of each of these in order
  if (literal) {
    seed = BigInt(seedText).toString();
  }
  const traits = {};
  Object.keys(charBuilder).forEach((trait, key) => {
    if (seed[key] !== undefined) {
      if (trait === "leg") {
        traits[trait] =
          charBuilder[trait][
            Math.floor(Math.random() * Object.keys(charBuilder[trait]).length)
          ];
      }
      // base needs to be even 50/50 split
      else if (trait === "base") {
        traits[trait] = seed[key] >= 5 ? 1 : 0;
      } else if (trait === "face") {
        traits[trait] = seed[key] > 5 ? 1 : seed[key];
      } else {
        traits[trait] = seed[key];
      }
    } else {
      traits[trait] = 0;
    }
  });
  return traits;
}

/**
 * `rpg-character`
 * `Little RPG character that&#39;s remixable`
 * @demo demo/index.html
 * @element rpg-character
 */
class RpgCharacter extends SimpleColors {
  /**
   * Convention we use
   */
  static get tag() {
    return "rpg-character";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.literalseed = false;
    this.height = 142;
    this.width = 113;
    this.accessories = 0;
    this.base = 0;
    this.face = 0;
    this.faceItem = 0;
    this.hair = 0;
    this.pants = 0;
    this.shirt = 0;
    this.skin = 0;
    this.accentColor = "orange";
    this.seed = null;
    this.walking = false;
    this.leg = "";
    this.speed = 500;
    this.__walkingTimeout = null;
    this.circle = false;
    this.hat = "none";
    this.hatColor = 0;
    this.demo = false;
    this.fire = false;
    // none of these are derived from the seed, so adding them leaves every
    // existing seed / username rendering exactly the same character
    this.preset = "none";
    this.mask = "none";
    this.makeup = "none";
    this.item = "none";
    this.offhand = "none";
    this.feet = "none";
    this.pet = "none";
    this.expression = "none";
    this.pose = "none";
    this.seasonal = false;
    this.seasonalDate = "";
    this.shaved = false;
    this.flagText = "";
    this.code = "";
    // stored so updated() removes the exact reference it added while demo
    // was enabled (a fresh anonymous arrow could never be removed)
    this._demoClickHandler = (_e) => {
      this.seed = Math.random().toString(36).substring(2, 12);
    };
    if (globalThis.matchMedia) {
      this.reduceMotion = globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }
  }

  randomColor(seed = null) {
    if (seed === null) {
      seed = "" + Math.floor(Math.random() * Object.keys(this.colors).length);
    }
    return Object.keys(this.colors)[seed];
  }

  static get properties() {
    return {
      ...super.properties,
      literalseed: { type: Boolean },
      accessories: { type: Number },
      height: { type: Number },
      width: { type: Number },
      base: { type: Number },
      face: { type: Number },
      faceItem: { type: Number },
      hair: { type: Number },
      pants: { type: Number },
      shirt: { type: Number },
      skin: { type: Number },
      hatColor: { type: Number },
      hat: { type: String },
      walking: { type: Boolean, reflect: true },
      leg: { type: String },
      seed: { type: String, reflect: true },
      speed: { type: Number },
      circle: { type: Boolean, reflect: true },
      fire: { type: Boolean, reflect: true },
      demo: { type: Boolean },
      reduceMotion: { type: Boolean },
      preset: { type: String },
      mask: { type: String },
      makeup: { type: String },
      item: { type: String },
      offhand: { type: String },
      feet: { type: String },
      pet: { type: String },
      expression: { type: String },
      pose: { type: String },
      seasonal: { type: Boolean, reflect: true },
      seasonalDate: { type: String, attribute: "seasonal-date" },
      shaved: { type: Boolean, reflect: true },
      flagText: { type: String, attribute: "flag-text" },
      code: { type: String },
    };
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: inline-block;
          margin: 0;
          padding: 0;
          text-align: initial;
          position: relative;
        }
        svg,
        img {
          position: absolute;
          margin: 0;
          padding: 0;
          text-align: initial;
        }
        div {
          transition: var(--ddd-duration-normal, 0.3s) ease-in-out
            background-color;
          margin: 0;
          padding: 0;
          text-align: initial;
        }
        #cardcircle {
          fill: var(--ddd-theme-accent, var(--rpg-character-accent, yellow));
        }
        .flag-text {
          font-family: var(--ddd-font-navigation, monospace);
          font-weight: var(--ddd-font-weight-bold, bold);
        }
        #demo {
          height: 30px;
          padding-top: 10px;
          text-align: center;
          background-color: black;
          color: white;
          font-weight: bold;
        }
      `,
    ];
  }
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // Generate a random seed once if the author didn't supply one. Doing
    // this in willUpdate lets the trait derivation below run in the same
    // update cycle instead of scheduling a redundant second update.
    if (this.seed === null && !this.__seedGenerated) {
      this.__seedGenerated = true;
      this.seed = Math.random().toString(36).substring(2, 12);
    }
    // A character code recalls every visual choice and wins over the seed.
    // Clearing it (or giving one this version cannot read) falls back to the
    // seed so the character never renders blank.
    const decoded = decodeCharacter(this.code);
    if (changedProperties.has("code")) {
      // the code supplies every choice; explicit attributes still win on top
      // (see _slot), so editing one setting never fights the saved code
      this._codeCharacter = decoded;
      if (decoded) {
        codeSlots.forEach((slot) => {
          if (typeof slot.values[0] === "number") {
            this[slot.name] = decoded[slot.name];
          }
        });
        this.leg = "";
      }
    }
    // fire mode speeds up (or restores) the walking animation speed
    if (changedProperties.has("fire") || changedProperties.has("code")) {
      this.speed = this._slot("fire") ? 100 : defaultSpeed;
    }
    // Derive the character's traits from the seed inside the update cycle.
    // Setting these reactive properties in updated() triggered Lit's
    // change-in-update warning because it scheduled a new update after the
    // current one completed.
    if (
      !decoded &&
      (changedProperties.has("seed") || changedProperties.has("code")) &&
      this.seed
    ) {
      const traits = traitsFromSeed(this.seed, this.literalseed);
      Object.keys(traits).forEach((trait) => {
        this[trait] = traits[trait];
      });
    }
  }
  /**
   * The code for the character as currently shown: seed-derived traits plus
   * every explicit choice. Setting it back on any rpg-character (the code
   * attribute) recreates this exact character.
   */
  toCode() {
    const character = { flagText: this._flagText() };
    codeSlots.forEach((slot) => {
      character[slot.name] =
        typeof slot.values[0] === "number"
          ? this[slot.name]
          : this._slot(slot.name);
    });
    return encodeCharacter(character);
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  /**
   * Effective value of a string or boolean slot: an explicit attribute wins,
   * then the character code, otherwise "none" (false for boolean slots).
   */
  _slot(name) {
    if (this[name] && this[name] !== "none") {
      return this[name];
    }
    const fromCode = this._codeCharacter && this._codeCharacter[name];
    if (fromCode && fromCode !== "none") {
      return fromCode;
    }
    return typeof this[name] === "boolean" ? false : "none";
  }

  _flagText() {
    if (this.flagText) {
      return this.flagText;
    }
    return (this._codeCharacter && this._codeCharacter.flagText) || "";
  }

  /**
   * Gear slots also fall back to the (effective) preset's defaults.
   */
  _gear(slot) {
    const chosen = this._slot(slot);
    if (chosen !== "none") {
      return chosen;
    }
    const preset = presets[this._preset()];
    if (preset && preset[slot]) {
      return preset[slot];
    }
    const season = this._season();
    if (season && season.hat && slot === "hat") {
      return seasonalPick(season.hat, this.seed);
    }
    return "none";
  }

  /**
   * The season this character is dressing up for, or null. Only when
   * seasonal is on; seasonal-date (YYYY-MM-DD) previews another day.
   */
  _season() {
    if (!this._slot("seasonal")) {
      return null;
    }
    let date = new Date();
    if (this.seasonalDate) {
      const preview = new Date(`${this.seasonalDate}T12:00:00`);
      if (!Number.isNaN(preview.getTime())) {
        date = preview;
      }
    }
    return seasonFor(date);
  }

  /**
   * Effective preset: an explicit or coded preset wins; otherwise the
   * seasonal costume, if any. Seasonal costumes are never written into the
   * code, so a saved character is not stuck in October.
   */
  _preset() {
    const chosen = this._slot("preset");
    if (chosen !== "none") {
      return chosen;
    }
    const season = this._season();
    if (season && season.preset) {
      return seasonalPick(season.preset, this.seed);
    }
    return "none";
  }

  /**
   * LitElement render callback
   */
  render() {
    this.__clipCount = 0;
    const preset = this._preset();
    const hasPreset = Object.keys(presets).includes(preset);
    const shaved = this._slot("shaved");
    const onFire = this._slot("fire");
    const accessories = new URL(
      `./lib/accessories/${this.accessories}.svg`,
      import.meta.url,
    ).href;
    // a shaved head uses a brimless body outline and skin colored scalp
    const base = shaved
      ? new URL(`./lib/base/shaved${this.leg}.svg`, import.meta.url).href
      : new URL(`./lib/base/${this.base}${this.leg}.svg`, import.meta.url).href;
    const leg = new URL(`./lib/base/${this.leg}.svg`, import.meta.url).href;
    const makeup = this._gear("makeup");
    const face = makeupList.includes(makeup)
      ? new URL(`./lib/makeup/${makeup}.svg`, import.meta.url).href
      : new URL(`./lib/face/${this.face}.svg`, import.meta.url).href;
    const faceItem = new URL(
      `./lib/faceItem/${this.faceItem}.svg`,
      import.meta.url,
    ).href;
    const hair = new URL(`./lib/hair/${this.hair}.svg`, import.meta.url).href;
    const pants = new URL(
      `./lib/pants/${hasPreset ? preset : this.pants}.svg`,
      import.meta.url,
    ).href;
    const shirt = new URL(
      `./lib/shirt/${hasPreset ? preset : this.shirt}.svg`,
      import.meta.url,
    ).href;
    const skin = new URL(`./lib/skin/${this.skin}.svg`, import.meta.url).href;
    let hatFileName = this._gear("hat");
    // special cases to change hat from the one requested
    if (onFire && hatFileName === "none") {
      hatFileName = "coffee";
    } else if (hatFileName === "random") {
      hatFileName =
        randomHatList[Math.floor(Math.random() * randomHatList.length)];
    }
    const hat = new URL(`./lib/hat/${hatFileName}.svg`, import.meta.url).href;
    const hatColor = shaved
      ? new URL(`./lib/scalp/${this.skin}.svg`, import.meta.url).href
      : new URL(`./lib/hatColor/${this.hatColor}.svg`, import.meta.url).href;
    const fire = new URL(`./lib/base/fire.svg`, import.meta.url).href;
    const circle = new URL(`./lib/circle.svg`, import.meta.url).href;
    const item = this._gear("item");
    const offhand = this._gear("offhand");
    const feet = this._gear("feet");
    const pet = petList.includes(this._slot("pet"))
      ? this._slot("pet")
      : "none";
    const mask = maskList.includes(this._gear("mask"))
      ? this._gear("mask")
      : "none";
    const expression = expressionList.includes(this._slot("expression"))
      ? this._slot("expression")
      : "none";
    const pose = poseList.includes(this._slot("pose"))
      ? this._slot("pose")
      : "none";
    // lowered arms a pose raises are clipped out of these layers
    const hide = pose !== "none" ? poseArt[pose].hide : [];
    const holdsItem = !hide.includes("right");
    const holdsOffhand = !hide.includes("left");
    // Dynamic values go through style attribute bindings rather than a style
    // element, because Lit SSR does not support bindings inside raw text
    // elements. The accent color is exposed as a custom property so the static
    // styles can consume it.
    const sizeStyle = `width: ${this.width}px;`;
    const wrapperStyle = `${sizeStyle} height: ${this.height}px; --rpg-character-accent: var(--simple-colors-default-theme-${this.accentColor}-8, var(--simple-colors-default-theme-accent-8, yellow));`;
    return html`
      <div class="wrapper" style="${wrapperStyle}">
        ${this.renderPiece(skin, hide)}
        ${this.base === 1 && !shaved ? this.renderPiece(hair) : ``}
        ${this.renderPiece(face)} ${this.renderPiece(faceItem)}
        ${this.renderPiece(shirt, hide)} ${this.renderPiece(pants)}
        ${this.renderPiece(accessories)} ${this.renderPiece(base, hide)}
        ${this.leg !== "" ? this.renderPiece(leg) : ``}
        ${expression !== "none"
          ? this.renderCells(expressionArt[expression])
          : ``}
        ${feetList.includes(feet)
          ? this.renderPiece(
              new URL(`./lib/feet/${feet}.svg`, import.meta.url).href,
            )
          : ``}
        ${pet !== "none" && !perchedPetList.includes(pet)
          ? this.renderPiece(
              new URL(`./lib/pet/${pet}.svg`, import.meta.url).href,
            )
          : ``}
        ${offhandList.includes(offhand) && holdsOffhand
          ? this.renderPiece(
              new URL(`./lib/offhand/${offhand}.svg`, import.meta.url).href,
            )
          : ``}
        ${this.renderPiece(hatColor)} ${onFire ? this.renderPiece(fire) : ``}
        ${mask !== "none"
          ? this.renderPiece(
              new URL(`./lib/mask/${mask}.svg`, import.meta.url).href,
            )
          : ``}
        ${hatFileName !== "none" ? this.renderPiece(hat) : ``}
        ${pose !== "none" ? this.renderCells(poseArt[pose].cells) : ``}
        ${pet !== "none" && perchedPetList.includes(pet)
          ? this.renderPiece(
              new URL(`./lib/pet/${pet}.svg`, import.meta.url).href,
            )
          : ``}
        ${itemList.includes(item) && holdsItem
          ? this.renderPiece(
              new URL(`./lib/item/${item}.svg`, import.meta.url).href,
            )
          : ``}
        ${item === "flag" && holdsItem && this._flagText()
          ? this.renderFlagText()
          : ``}
        ${this._slot("circle") ? this.renderPiece(circle) : ``}
      </div>
      ${this.demo
        ? html`<div id="demo" style="${sizeStyle}">${this.seed}</div>`
        : ``}
    `;
  }

  /**
   * A layer with the lowered arm(s) of a pose clipped out. Drawn in the
   * 113x142 art space (like the flag text) so the clip lines up with the art
   * at any width / height.
   */
  renderClippedPiece(piece, hide) {
    this.__clipCount = (this.__clipCount || 0) + 1;
    const id = `rpg-clip-${this.__clipCount}`;
    const holes = hide
      .map((side) => {
        const [x, y, w, h] = armRegions[side];
        return `M${x} ${y}h${w}v${h}h-${w}Z`;
      })
      .join("");
    return svg`
    <svg xmlns="http://www.w3.org/2000/svg" part="rpg-character-item" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="xMidYMid meet">
      <svg viewBox="0 0 113 142" width="${this.width}" height="${this.height}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="${id}">
            <path clip-rule="evenodd" d="M0 0h113v142H0Z${holes}"></path>
          </clipPath>
        </defs>
        <image href="${piece}" width="113" height="142" clip-path="url(#${id})" focusable="false"></image>
      </svg>
    </svg>`;
  }

  /**
   * Expression / pose cells, colored to match the character's skin.
   */
  renderCells(cells) {
    const skin = skinColors[Number(this.skin)] || skinColors[0];
    return svg`
    <svg xmlns="http://www.w3.org/2000/svg" part="rpg-character-item" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <svg viewBox="0 0 113 142" width="${this.width}" height="${this.height}" preserveAspectRatio="xMidYMid meet">
        ${parseCells(cells).map(
          ([r, c, color]) =>
            svg`<rect x="${3 + 5 * c}" y="${2 + 5 * r}" width="5" height="5" fill="${color === "S" ? skin : overlayColors[color]}"></rect>`,
        )}
      </svg>
    </svg>`;
  }

  /**
   * Short text on the pennant of the flag item (e.g. a team or school
   * abbreviation). Drawn in the 113x142 art space so it scales with the
   * character the same way every image layer does.
   */
  renderFlagText() {
    const text = this._flagText().substring(0, 4);
    return svg`
    <svg xmlns="http://www.w3.org/2000/svg" part="rpg-character-item" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <svg viewBox="0 0 113 142" width="${this.width}" height="${this.height}" preserveAspectRatio="xMidYMid meet">
        <text class="flag-text" x="103" y="29" text-anchor="middle" font-size="8" fill="#ffffff" textLength="${Math.min(text.length * 5, 18)}" lengthAdjust="spacingAndGlyphs">${text}</text>
      </svg>
    </svg>`;
  }

  renderPiece(piece, hide = []) {
    if (hide.length) {
      return this.renderClippedPiece(piece, hide);
    }
    return svg`
    <svg xmlns="http://www.w3.org/2000/svg" part="rpg-character-item" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="xMidYMid meet">
      <image
        href="${piece}"
        width="${this.width}px"
        height="${this.height}px"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
      ></image>
    </svg>`;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "demo") {
        const wrapper = this.shadowRoot.querySelector(".wrapper");
        if (wrapper && this[propName]) {
          wrapper.addEventListener("click", this._demoClickHandler);
        } else if (wrapper) {
          wrapper.removeEventListener("click", this._demoClickHandler);
        }
      }
      if (
        (propName === "leg" || propName === "walking") &&
        this.walking &&
        !this.reduceMotion
      ) {
        clearTimeout(this.__walkingTimeout);
        this.__walkingTimeout = setTimeout(() => {
          switch (this.leg) {
            case "":
              this.leg = "R";
              break;
            case "R":
              this.leg = "L";
              break;
            case "L":
              this.leg = "";
              break;
          }
        }, this.speed);
      }
    });
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(RpgCharacter.tag, RpgCharacter);
export { RpgCharacter };
