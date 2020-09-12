/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `moar-sarcasm`
 * `Provide a laugh and a good example of VanillaJS for demos`
 * @demo demo/index.html
 * @element moar-sarcasm
 */
class MoarSarcasm extends HTMLElement {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "moar-sarcasm";
  }
  /**
   * object life cycle
   */
  constructor() {
    super();
    this.a11y = "the following is sarcastic ";
    // create a template element for processing shadowRoot
    this.template = document.createElement("template");
    // create a shadowRoot
    this.attachShadow({ mode: "open" });
    this.render();
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        this.say = this.innerText;
      });
    });
    this.observer.observe(this, {
      characterData: true,
      attributes: false,
      childList: false,
      subtree: true
    });
  }
  // render HTML
  get html() {
    return `
      <style>
        :host {
          display: inline-block;
        }
        span {
          font-style: italic;
        }
        .letter:nth-child(odd) {
          text-transform: uppercase;
        }
        .letter:nth-child(even) {
          text-transform: lowercase;
        }
        .slot {
          position: absolute!important;
          width: 1px!important;
          height: 1px!important;
          padding: 0!important;
          margin: -1px!important;
          overflow: hidden!important;
          clip: rect(0,0,0,0)!important;
          white-space: nowrap!important;
          border: 0!important;
        }
      </style>
      <span class="sarcastic" aria-hidden="true"></span>
      <span class="slot">${this.a11y}<slot></slot></span>
    `;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
    this.say = this.innerText;
  }
  /**
   * Render / rerender the shadowRoot
   */
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  /**
   * Process the text in question
   */
  processText(text) {
    // empty whats there
    this.shadowRoot.querySelector(".sarcastic").innerHTML = "";
    // loop through text to process and convert to span tags
    for (var i = 0; i < text.length; i++) {
      let tag = document.createElement("span");
      if (text.charAt(i).match(/[a-z]/i)) {
        tag.classList.add("letter");
        tag.innerText = text.charAt(i);
      } else {
        tag = document.createTextNode(text.charAt(i));
      }
      this.shadowRoot.querySelector(".sarcastic").appendChild(tag);
    }
  }
  /**
   * attributes to notice changes to
   */
  static get observedAttributes() {
    return ["say", "a11y"];
  }
  set say(val) {
    this.setAttribute("say", val);
  }
  set a11y(val) {
    this.setAttribute("a11y", val);
  }
  get say() {
    return this.getAttribute("say");
  }
  get a11y() {
    return this.getAttribute("a11y");
  }
  /**
   * callback when any observed attribute changes
   */
  attributeChangedCallback(attr, oldValue, newValue) {
    if (newValue) {
      switch (attr) {
        case "say":
          this.processText(newValue);
          break;
        case "a11y":
          this.render();
          break;
      }
    }
  }
}
customElements.define(MoarSarcasm.tag, MoarSarcasm);
export { MoarSarcasm };
