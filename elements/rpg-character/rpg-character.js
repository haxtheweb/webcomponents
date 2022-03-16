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
    this.base = 0;
    this.face = 0;
    this.faceItem = 0;
    this.skin = 0;
    this.hair = 0;
    this.accentColor = "orange";
    this.seed = null;
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
      shirtColor: { type: String, attribute: "shirt-color" },
      pantsColor: { type: String, attribute: "pants-color" },
      base: { type: Number },
      face: { type: Number },
      faceItem: { type: Number },
      skin: { type: Number },
      hair: { type: Number },
      seed: { type: String },
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
        }
        img {
          position: absolute;
          margin: 0;
          padding: 0;
        }
        div {
          width: 113px;
          transition: .3s ease-in-out background-color;
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
  firstUpdated() {
    if (this.seed === null) {
      this.seed = Math.random().toString(36).substring(2,12);
    }
  }
  /**
   * LitElement render callback
   */
  render() {
    const skin = new URL(`./lib/skin/${this.skin}.svg`, import.meta.url).href;
    const base = new URL(`./lib/base/${this.base}.svg`, import.meta.url).href;
    const hair = new URL(`./lib/hair/${this.hair}.svg`, import.meta.url).href;
    const face = new URL(`./lib/face/${this.face}.svg`, import.meta.url).href;
    const faceItem = new URL(`./lib/faceItem/${this.faceItem}.svg`, import.meta.url).href;
    return html`
      <img src="${skin}" />
      <img src="${base}" />
      ${this.base === 1 ? html`<img src="${hair}" />` : ``}
      <img src="${face}" />
      <img src="${faceItem}" />
      <div id="hat"></div>
      <div id="face"></div>
      <div id="shirt"></div>
      <div id="pants"></div>
      <style>
        #hat {
          background-color: var(--simple-colors-default-theme-${this.hatColor}-7, orange);
        }
        #shirt {
          background-color: var(--simple-colors-default-theme-${this.shirtColor}-5, purple);
        }
        #pants {
          background-color: var(--simple-colors-default-theme-${this.pantsColor}-8, yellow);
        }
      </style>
    `;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "seed" && this[propName]) {
        // use the seed to generate a random number
        let seed = 540;
        for (let i=0; i < this.seed.length; i++) {
          seed *= this.seed.charCodeAt(i);
        }
        seed = seed.toString();
        this.skin = seed[0];
        this.base = seed[1] > 5 ? 1 : 0;
        this.hair = seed[2];
        this.face = seed[3] > 5 ? 5 : seed[3];
        this.faceItem = seed[4];
        this.hatColor = this.randomColor();
        this.shirtColor = this.randomColor();
        this.pantsColor = this.randomColor();
      }
    });
  }
}
customElements.define(RpgCharacter.tag, RpgCharacter);
export { RpgCharacter };
