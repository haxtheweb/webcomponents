/**
 * Copyright 2021
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `check-it-out`
 * `View codepen or stackblitz demos`
 * @demo demo/index.html
 * @element check-it-out
 */
class CheckItOut extends LitElement {


  static get properties(){
    return {
      sourceUri: {
        type: String,
        attribute: "source-uri"
      }
    }
  }
  

  static get styles(){
    return [
      css`
        :host {
          display: inline-flex;
        }

        .container {
          width: var(--check-it-out-width, 800px);
        }

        .iframe-container {
          width: var(--check-it-out-iframe-width, 800px);
          height: var(--check-it-out-iframe-height, 500px);
        }

      `
    ]
  }
  
  /**
   * Convention we use
   */
  static get tag() {
    return "check-it-out";
  }

  render(){
    return html`
      <div class="container">
        <iframe class="iframe-container" src=${this.sourceUri}></iframe>
      </div>
    `
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
  }

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {}

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
    });
  }
}
customElements.define(CheckItOut.tag, CheckItOut);
export { CheckItOut };
