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

    // cache the bound handlers once so disconnectedCallback can remove
    // them (previously a fresh .bind was created inside a setTimeout,
    // leaving no storable reference and no cleanup path at all)
    this.__playSoundBound = this._playSound.bind(this);
    this.__keyDownBound = this._keyDown.bind(this);

    if (!delayRender) {
      this.render();
    }
  }

  /**
   * HTMLElement life cycle - inserted into the DOM
   */
  connectedCallback() {
    // expose the clickable host as a keyboard-operable button
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button");
    }
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "Play air horn");
    }
    this.addEventListener("click", this.__playSoundBound);
    this.addEventListener("keydown", this.__keyDownBound);
  }

  /**
   * HTMLElement life cycle - removed from the DOM
   */
  disconnectedCallback() {
    this.removeEventListener("click", this.__playSoundBound);
    this.removeEventListener("keydown", this.__keyDownBound);
  }

  /**
   * Enter and Space activate the horn like a native button would.
   */
  _keyDown(e) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      this.click();
    }
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
