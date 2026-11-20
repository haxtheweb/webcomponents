/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
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
    // remember what the author set so only what this element adds changes
    this.__explicitRole = this.hasAttribute("role");
    this.__explicitTabindex = this.hasAttribute("tabindex");
    this.__explicitAriaLabel = this.hasAttribute("aria-label");
    this._updateAriaLabel();
    this._recheckWhenDefined();
    // content that draws its controls once it scrolls into view (players,
    // lazy media) is looked at again after it has had a frame to render
    if (globalThis.IntersectionObserver && !this.__visibleObserver) {
      this.__visibleObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          globalThis.requestAnimationFrame(() =>
            globalThis.requestAnimationFrame(() => {
              if (this.isConnected) this._updateAriaLabel();
            }),
          );
        }
      });
      this.__visibleObserver.observe(this);
    }
    this.addEventListener("click", this.__playSoundBound);
    this.addEventListener("keydown", this.__keyDownBound);
    this.__slotChangeBound = () => {
      this._updateAriaLabel();
      this._recheckWhenDefined();
    };
    this.shadowRoot
      .querySelector("slot")
      .addEventListener("slotchange", this.__slotChangeBound);
  }

  /**
   * HTMLElement life cycle - removed from the DOM
   */
  disconnectedCallback() {
    if (this.__visibleObserver) {
      this.__visibleObserver.disconnect();
      this.__visibleObserver = null;
    }
    this.removeEventListener("click", this.__playSoundBound);
    this.removeEventListener("keydown", this.__keyDownBound);
    const slot = this.shadowRoot.querySelector("slot");
    if (slot && this.__slotChangeBound) {
      slot.removeEventListener("slotchange", this.__slotChangeBound);
    }
  }

  /**
   * Keep the accessible name in sync with the visible slotted text so the
   * two never mismatch (label-content-name-mismatch).
   */
  _updateAriaLabel() {
    // content that is already a control (a link, a button, a player) is
    // what people operate: the host stays a plain wrapper so controls are
    // never nested in a button, and a click on that control still bubbles
    // up and plays the horn
    this.__wrapsControl = this._hasControl();
    if (this.__wrapsControl) {
      if (!this.__explicitRole) this.removeAttribute("role");
      if (!this.__explicitTabindex) this.removeAttribute("tabindex");
      if (!this.__explicitAriaLabel) this.removeAttribute("aria-label");
      return;
    }
    // otherwise expose the clickable host as a keyboard-operable button
    if (!this.__explicitRole) this.setAttribute("role", "button");
    if (!this.__explicitTabindex) this.setAttribute("tabindex", "0");
    if (this.__explicitAriaLabel) {
      return;
    }
    // the name starts with the visible text (WCAG 2.5.3 label in name)
    const text = this.textContent.trim();
    this.setAttribute("aria-label", text ? `${text}, air horn` : "Air horn");
  }

  /**
   * Slotted custom elements draw their controls once they upgrade and
   * render; look again then.
   */
  _recheckWhenDefined() {
    const pending = Array.from(this.querySelectorAll("*"))
      .filter((node) => node.localName.includes("-"))
      .map((node) =>
        globalThis.customElements
          .whenDefined(node.localName)
          .then(() => node.updateComplete),
      );
    if (pending.length) {
      Promise.all(pending)
        .then(() => {
          if (this.isConnected) this._updateAriaLabel();
        })
        .catch(() => {});
    }
  }

  /**
   * Whether the slotted content holds something focusable of its own.
   */
  _hasControl() {
    const focusable =
      'a[href], button, input, select, textarea, audio[controls], video[controls], [tabindex]:not([tabindex="-1"]), [contenteditable=""], [contenteditable="true"]';
    const nodes = this.querySelectorAll("*");
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (
        node.matches(focusable) ||
        (node.shadowRoot && node.shadowRoot.querySelector(focusable))
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Enter and Space activate the horn like a native button would.
   */
  _keyDown(e) {
    // a wrapped control activates itself; its click bubbles here
    if (this.__wrapsControl || e.target !== this) {
      return;
    }
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      this.click();
    }
  }

  /**
   * Play the sound effect.
   */
  _playSound(_e) {
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
