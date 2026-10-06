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
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  /**
   * object life cycle
   */
  constructor() {
    super();
    // create a template element for processing shadowRoot
    this.template = globalThis.document.createElement("template");
    // create a shadowRoot
    this.attachShadow({ mode: "open" });
    this.render();
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.say = this.innerText;
      });
    });
    this.observer.observe(this, {
      characterData: true,
      attributes: false,
      childList: true,
      subtree: true,
    });
  }
  // render HTML
  get html() {
    return `
      <style>
        :host {
          display: inline-block;
          word-break: break-all;
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
    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.styleElement(this);
    }
    if (!this.hasAttribute("a11y")) {
      this.a11y = "the following is sarcastic:";
    }
    // only derive say from the light DOM when it hasn't already been
    // established (e.g. restored from previously saved markup). Otherwise
    // reconnecting (such as on page load) would clobber a saved say value
    // with whatever stale text still lives in the light DOM.
    if (!this.hasAttribute("say")) {
      this.say = this.innerText;
    } else {
      this.processText(this.getAttribute("say"));
    }
  }
  /**
   * Render / rerender the shadowRoot
   */
  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = null;
    }
    if (this.template) {
      this.template.innerHTML = this.html;
    }
    if (globalThis.ShadyCSS && this.template) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    if (this.shadowRoot && this.template) {
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    }
  }
  /**
   * Process the text in question
   */
  processText(text) {
    // empty whats there
    this.shadowRoot.querySelector(".sarcastic").innerHTML = "";
    // loop through text to process and convert to span tags
    for (var i = 0; i < text.length; i++) {
      let tag = globalThis.document.createElement("span");
      if (text.charAt(i).match(/[a-z]/i)) {
        tag.classList.add("letter");
        tag.innerText = text.charAt(i);
      } else {
        tag = globalThis.document.createTextNode(text.charAt(i));
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
    if (val !== this.innerText) {
      this.innerText = val;
    } else {
      this.setAttribute("say", val);
    }
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
          // Keep the light DOM (slotted content) in sync with say so that
          // serializing this element (eg on HAX save) reflects the actual
          // value. say can be changed either through the say setter (which
          // already keeps innerText in sync) or directly via setAttribute
          // (eg the HAX settings tray writes attributes directly for
          // properties that aren't own-properties), which otherwise would
          // leave the light DOM stale.
          if (newValue !== this.innerText) {
            this.observer.disconnect();
            this.innerText = newValue;
            this.observer.observe(this, {
              characterData: true,
              attributes: false,
              childList: true,
              subtree: true,
            });
          }
          break;
        case "a11y":
          this.render();
          break;
      }
    }
  }
}
globalThis.customElements.define(MoarSarcasm.tag, MoarSarcasm);
export { MoarSarcasm };
