/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, svg, unsafeCSS } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
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
];

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
          transition: 0.3s ease-in-out background-color;
          margin: 0;
          padding: 0;
          text-align: initial;
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
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.seed === null) {
      this.seed = Math.random().toString(36).substring(2, 12);
    }
  }
  /**
   * LitElement render callback
   */
  render() {
    const accessories = new URL(
      `./lib/accessories/${this.accessories}.svg`,
      import.meta.url,
    ).href;
    const base = new URL(
      `./lib/base/${this.base}${this.leg}.svg`,
      import.meta.url,
    ).href;
    const leg = new URL(`./lib/base/${this.leg}.svg`, import.meta.url).href;
    const face = new URL(`./lib/face/${this.face}.svg`, import.meta.url).href;
    const faceItem = new URL(
      `./lib/faceItem/${this.faceItem}.svg`,
      import.meta.url,
    ).href;
    const hair = new URL(`./lib/hair/${this.hair}.svg`, import.meta.url).href;
    const pants = new URL(`./lib/pants/${this.pants}.svg`, import.meta.url)
      .href;
    const shirt = new URL(`./lib/shirt/${this.shirt}.svg`, import.meta.url)
      .href;
    const skin = new URL(`./lib/skin/${this.skin}.svg`, import.meta.url).href;
    let hatFileName = this.hat;
    // special cases to change hat from the one requested
    if (this.fire && this.hat === "none") {
      hatFileName = "coffee";
    } else if (this.hat === "random") {
      hatFileName = hatList[Math.floor(Math.random() * hatList.length)];
    }
    const hat = new URL(`./lib/hat/${hatFileName}.svg`, import.meta.url).href;
    const hatColor = new URL(
      `./lib/hatColor/${this.hatColor}.svg`,
      import.meta.url,
    ).href;
    const fire = new URL(`./lib/base/fire.svg`, import.meta.url).href;
    const circle = new URL(`./lib/circle.svg`, import.meta.url).href;
    return html`
      <div class="wrapper">
        ${this.renderPiece(skin)}
        ${this.base === 1 ? this.renderPiece(hair) : ``}
        ${this.renderPiece(face)} ${this.renderPiece(faceItem)}
        ${this.renderPiece(shirt)} ${this.renderPiece(pants)}
        ${this.renderPiece(accessories)} ${this.renderPiece(base)}
        ${this.leg !== "" ? this.renderPiece(leg) : ``}
        ${this.renderPiece(hatColor)} ${this.fire ? this.renderPiece(fire) : ``}
        ${hatFileName !== "none" ? this.renderPiece(hat) : ``}
        ${this.circle ? this.renderPiece(circle) : ``}
      </div>
      ${this.demo ? html`<div id="demo">${this.seed}</div>` : ``}
      <style>
        #cardcircle {
          fill: var(
            --simple-colors-default-theme-${this.accentColor}-8,
            var(--simple-colors-default-theme-accent-8, yellow)
          );
        }
        div {
          width: ${this.width + "px"};
        }
        .wrapper {
          height: ${this.height + "px"};
        }
      </style>
    `;
  }

  renderPiece(piece) {
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
      if (propName === "fire") {
        this.speed = this[propName] ? 100 : defaultSpeed;
      }
      if (propName === "demo") {
        if (this[propName]) {
          this.shadowRoot
            .querySelector(".wrapper")
            .addEventListener("click", (e) => {
              this.seed = Math.random().toString(36).substring(2, 12);
            });
        } else {
          this.shadowRoot
            .querySelector(".wrapper")
            .removeEventListener("click", (e) => {
              e.target.seed = Math.random().toString(36).substring(2, 12);
            });
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
      if (propName === "seed" && this[propName]) {
        // use the seed to generate a random number
        let seed = 54;
        for (let i = 0; i < this.seed.length; i++) {
          // hard limit of 64 to be safe bc of calculation since seed is supposed to be like a name
          if (i < 64) {
            seed *= this.seed.charCodeAt(i);
          }
        }
        const funKeys = {
          zpg: "7501517984378880262144",
          edtechjoker: "712215550",
          btopro: "7122155501",
        };
        // ensure huge numbers dont bust JS max
        seed = BigInt(seed).toString();
        if (Object.keys(funKeys).includes(this[propName])) {
          seed = funKeys[this[propName]];
        }
        // support a literal seed value which is numerical selection of each of these in order
        if (this.literalseed) {
          seed = BigInt(this.seed).toString();
        }
        Object.keys(charBuilder).forEach((trait, key) => {
          if (seed[key] !== undefined) {
            if (trait === "leg") {
              this[trait] =
                charBuilder[trait][
                  Math.floor(
                    Math.random() * Object.keys(charBuilder[trait]).length,
                  )
                ];
            }
            // base needs to be even 50/50 split
            else if (trait === "base") {
              this[trait] = seed[key] >= 5 ? 1 : 0;
            } else if (trait === "face") {
              this[trait] = seed[key] > 5 ? 1 : seed[key];
            } else {
              this[trait] = seed[key];
            }
          } else {
            this[trait] = 0;
          }
        });
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
customElements.define(RpgCharacter.tag, RpgCharacter);
export { RpgCharacter };
