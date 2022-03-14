/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `rpg-character`
 * `Little RPG character that&#39;s remixable`
 * @demo demo/index.html
 * @element rpg-character
 */
class RpgCharacter extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
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
          display: block;
          background-color:blue;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <img src="${new URL('./lib/base.svg', import.meta.url).href}" />
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
