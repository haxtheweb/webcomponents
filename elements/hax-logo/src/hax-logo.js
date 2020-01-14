/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `hax-logo`
 * `logo element for hax, obviously as a hax capable element.`
 * @demo demo/index.html
 * @customElement hax-logo
 */
class HaxLogo extends HTMLElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hax-logo";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    if (!window.__haxLogoFontLoaded) {
      let link = document.createElement("link");
      link.setAttribute(
        "href",
        "https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap"
      );
      link.setAttribute("rel", "stylesheet");
      document.head.appendChild(link);
      window.__haxLogoFontLoaded = true;
    }
    // set tag for later use
    this.tag = HaxLogo.tag;
    this.template = document.createElement("template");

    this.attachShadow({ mode: "open" });

    if (!delayRender) {
      this.render();
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
  }

  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  get size() {
    return this.getAttribute("size");
  }
  set size(newValue) {
    if (newValue) {
      this.setAttribute("size", newValue);
    }
  }

  get toupper() {
    return this.getAttribute("toupper");
  }
  set toupper(newValue) {
    if (newValue) {
      this.setAttribute("toupper", "toupper");
    }
  }
}
window.customElements.define(HaxLogo.tag, HaxLogo);
export { HaxLogo };
