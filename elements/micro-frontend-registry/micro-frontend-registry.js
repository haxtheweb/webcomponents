/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `micro-frontend-registry`
 * `A singleton for registration and managing access to leverage microservices for web components`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element micro-frontend-registry
 */
class MicroFrontendRegistry extends HTMLElement {
  /**
   * object life cycle
   */
  constructor(delayRender = false) {
    super();

    // create a template element for processing shadowRoot
    this.template = document.createElement("template");
    // create a shadowRoot
    this.attachShadow({ mode: "open" });
    // optional delay in rendering, otherwise it always happens
    if (!delayRender) {
      this.render();
    }
  }
  /**
   * This is a convention, not the standard to return HTML of the element
   */
  get html() {
    return ``;
  }
  /**
   * attributes to notice changes to
   */
  static get observedAttributes() {
    return [];
  }
  /**
   * callback when any observed attribute changes
   */
  attributeChangedCallback(attr, oldValue, newValue) {}
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "micro-frontend-registry";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
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
}
customElements.define(MicroFrontendRegistry.tag, MicroFrontendRegistry);
export { MicroFrontendRegistry };
