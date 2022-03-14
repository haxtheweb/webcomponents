/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, unsafeCSS } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `rpg-character`
 * `Little RPG character that&#39;s remixable`
 * @demo demo/index.html
 * @element rpg-character
 */
class RpgCharacter extends SimpleColors {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.hatColor = this.randomColor();
    this.shirtColor = this.randomColor();
    this.faceColor = this.randomColor();
    this.pantsColor = this.randomColor();
    this.accentColor = "orange";
  }

  randomColor() {
    return Object.keys(this.colors)[Math.floor(Math.random()*Object.keys(this.colors).length)];
  }

  static get properties() {
    return {
      ...super.properties,
      hatColor: { type: String, attribute: "hat-color" },
      shirtColor: { type: String, attribute: "shirt-color" },
      faceColor: { type: String, attribute: "face-color" },
      pantsColor: { type: String, attribute: "pants-color" },
      
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
  /**
   * LitElement render callback
   */
  render() {
    return html`
    
      <img src="${new URL('./lib/base.svg', import.meta.url).href}" />
      <div id="hat"></div>
      <div id="face"></div>
      <div id="shirt"></div>
      <div id="pants"></div>
      <style>
        #hat {
          background-color: var(--simple-colors-default-theme-${this.hatColor}-6, orange);
        }
        #face {
          background-color: var(--simple-colors-default-theme-${this.faceColor}-3, blue);
        }
        #shirt {
          background-color: var(--simple-colors-default-theme-${this.shirtColor}-8, purple);
        }
        #pants {
          background-color: var(--simple-colors-default-theme-${this.pantsColor}-10, yellow);
        }
      </style>
    `;
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "rpg-character";
  }
}
customElements.define(RpgCharacter.tag, RpgCharacter);
export { RpgCharacter };
