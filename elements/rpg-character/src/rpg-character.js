/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
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
    this.leg = '';
    this.speed = 300;
  }

  randomColor(seed = null) {
    if (seed === null) {
      seed = "" + Math.floor(Math.random()*Object.keys(this.colors).length);
    }
    return Object.keys(this.colors)[seed];
  }

  static get properties() {
    return {
      ...super.properties,
      hatColor: { type: String, attribute: "hat-color" },
      pantsColor: { type: String, attribute: "pants-color" },
      accessories: { type: Number },
      base: { type: Number },
      face: { type: Number },
      faceItem: { type: Number },
      hair: { type: Number },
      pants: { type: Number },
      shirt: { type: Number },
      skin: { type: Number },
      walking: { type: Boolean,},
      leg: { type: String },
      seed: { type: String, reflect: true },
      speed: { type: Number },
    }
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
      ...styles,
      css`
        :host {
          display: inline-block;
          margin: 0;
          padding: 0;
        }
        img {
          position: absolute;
          margin: 0;
          padding: 0;
        }
        div {
          width: 113px;
          transition: .3s ease-in-out background-color;
          margin: 0;
          padding: 0;
        }
        #hat {
          height: 55px;
        }
        #face {
          height: 30px;
        }
        #shirt {
          height: 28px;
        }
        #pants {
          height: 20px;
        }
        `
    ];
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.seed === null) {
      this.seed = Math.random().toString(36).substring(2,12);
    }
  }
  /**
   * LitElement render callback
   */
  render() {
    const accessories = new URL(`./lib/accessories/${this.accessories}.svg`, import.meta.url).href;
    const base = new URL(`./lib/base/${this.base}${this.leg}.svg`, import.meta.url).href;
    const leg = new URL(`./lib/base/${this.leg}.svg`, import.meta.url).href;
    const face = new URL(`./lib/face/${this.face}.svg`, import.meta.url).href;
    const faceItem = new URL(`./lib/faceItem/${this.faceItem}.svg`, import.meta.url).href;
    const hair = new URL(`./lib/hair/${this.hair}.svg`, import.meta.url).href;
    const pants = new URL(`./lib/pants/${this.pants}.svg`, import.meta.url).href;
    const shirt = new URL(`./lib/shirt/${this.shirt}.svg`, import.meta.url).href;
    const skin = new URL(`./lib/skin/${this.skin}.svg`, import.meta.url).href;
    return html`
      <img src="${skin}" />
      ${this.base === 1 ? html`<img src="${hair}" />` : ``}
      <img src="${face}" />
      <img src="${faceItem}" />
      <img src="${shirt}" />
      <img src="${pants}" />
      <img src="${accessories}" />
      <img src="${base}" />${this.leg !== '' ? html`<img src="${leg}" />`:``}

      <div id="hat"></div>
      <div id="face"></div>
      <div id="shirt"></div>
      <div id="pants"></div>
      <style>
        #hat {
          background-color: var(--simple-colors-default-theme-${this.hatColor}-7, orange);
        }
        #pants {
          background-color: var(--simple-colors-default-theme-${this.pantsColor}-8, yellow);
        }
      </style>
    `;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "walking" && this[propName]) {
        this.leg = "L";
      }
      if (propName === "leg" && this.walking) {
        setTimeout(() => {
          switch (this.leg) {
            case '':
              this.leg = "R";
            break;
            case 'R':
              this.leg = "L";
            break;
            case 'L':
              this.leg = "";
            break;
          }
        }, this.speed);
      }
      if (propName === "seed" && this[propName]) {
        // use the seed to generate a random number
        let seed = 54;
        for (let i=0; i < (this.seed.length); i++) {
          // hard limit of 64 to be safe bc of calculation since seed is supposed to be like a name
          if (i < 64) {
            seed *= this.seed.charCodeAt(i);
          }
        }
        // ensure huge numbers dont bust JS max
        seed = BigInt(seed).toString();
        if (['edtechjoker', 'btopro'].includes(this[propName])) {
          seed = "712215550";
          this.hatColor = 'red';
          this.pantsColor = 'deep-purple';
        }
        else {
          this.hatColor = this.randomColor();
          this.pantsColor = this.randomColor();
        }
        const charBuilder = {
          accessories : 9,
          base : 1,
          leg : ['', 'L', 'R'],
          face : 5,
          faceItem : 9,
          hair : 9,
          pants : 9,
          shirt : 9,
          skin : 9,
        }
        Object.keys(charBuilder).forEach((trait, key) => {
          if (seed[key] !== undefined) {
            if (trait === "leg") {
              this[trait] = charBuilder[trait][Math.floor(Math.random()*Object.keys(charBuilder[trait]).length)];
            }
            // base needs to be even 50/50 split
            else if (trait === "base") {
              this[trait] = seed[key] >= 5 ? 1 : 0;
            }
            else if (trait === "face") {
              this[trait] = seed[key] > 5 ? 1 : seed[key];
            }
            else {
              this[trait] = seed[key];
            }
          }
          else {
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
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}
customElements.define(RpgCharacter.tag, RpgCharacter);
export { RpgCharacter };
