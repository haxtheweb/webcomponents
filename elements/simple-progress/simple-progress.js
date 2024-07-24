/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `simple-progress`
 * `a simple progress slider bar`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element simple-progress
 */
class SimpleProgress extends HTMLElement {
  // Template return function
  get html() {
    return `
    <style>
    :host {
      display: block;
      width: 100%;
      height: 4px;
      position: relative;
      overflow: hidden;
    }

    :host([hidden]) {
      display: none !important;
    }

    #primaryProgress {
      background: var(--simple-progress-color, #37A0CE);
      position:  absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: scaleX(0);
      transform-origin: right center;
      animation: indeterminate-bar var(--simple-progress-duration, 2s) var(--simple-progress-delay, 0s) linear infinite;
    }

    #primaryProgress.finished {
      animation: none;
    }

    #primaryProgress::after {
      content: "";
      transform-origin: center center;
      animation: indeterminate-splitter var(--simple-progress-duration, 2s) var(--simple-progress-delay, 0s) linear infinite;
    }

    #primaryProgress.finished::after {
      animation: none;
    }

    @keyframes indeterminate-bar {
      0% {
        transform: scaleX(1) translateX(-100%);
      }
      50% {
        transform: scaleX(1) translateX(0%);
      }
      75% {
        transform: scaleX(1) translateX(0%);
        animation-timing-function: cubic-bezier(.28,.62,.37,.91);
      }
      100% {
        transform: scaleX(0) translateX(0%);
      }
    }

    @keyframes indeterminate-splitter {
      0% {
        transform: scaleX(.75) translateX(-125%);
      }
      30% {
        transform: scaleX(.75) translateX(-125%);
        animation-timing-function: cubic-bezier(.42,0,.6,.8);
      }
      90% {
        transform: scaleX(.75) translateX(125%);
      }
      100% {
        transform: scaleX(.75) translateX(125%);
      }
    }
  </style>

  <div id="primaryProgress"></div>`;
  }
  static get tag() {
    return "simple-progress";
  }

  constructor() {
    super();
    // create a template element for processing shadowRoot
    this.template = globalThis.document.createElement("template");
    // create a shadowRoot
    this.attachShadow({ mode: "open" });
    this.render();
  }

  static get observedAttributes() {
    return ["disabled"];
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  _iterationCallback() {
    this.shadowRoot.querySelector("#primaryProgress").classList.add("finished");
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.styleElement(this);
    }
  }
  /**
   * Render / rerender the shadowRoot
   */
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  attributeChangedCallback() {
    const progress = this.shadowRoot.querySelector("#primaryProgress");
    if (this.disabled)
      progress.addEventListener(
        "animationiteration",
        this._iterationCallback.bind(this),
        { once: true, passive: true },
      );
    else progress.classList.remove("finished");
  }
}
customElements.define(SimpleProgress.tag, SimpleProgress);
export { SimpleProgress };
