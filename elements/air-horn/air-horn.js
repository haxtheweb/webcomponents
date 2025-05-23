/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `air-horn`
 * @element air-horn
 * `demonstrative purposes via meme`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @demo demo/index.html
 */
class AirHorn extends HTMLElement {
  // render function
  get html() {
    return `
<style>
:host {
  display: inline-flex;
}

:host([hidden]) {
  display: none;
}
        </style>
<slot></slot>`;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "air-horn";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    // set tag for later use
    this.tag = AirHorn.tag;
    this.template = globalThis.document.createElement("template");

    this.attachShadow({ mode: "open" });

    if (!delayRender) {
      this.render();
    }
    setTimeout(() => {
      this.addEventListener("click", this._playSound.bind(this));
    }, 0);
  }

  /**
   * Play the sound effect.
   */
  _playSound(e) {
    let audio = new Audio(new URL(`./lib/airhorn.mp3`, import.meta.url).href);
    audio.play();
  }

  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
}
globalThis.customElements.define(AirHorn.tag, AirHorn);
export { AirHorn };
