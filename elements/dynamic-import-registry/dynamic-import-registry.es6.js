/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `dynamic-import-registry`
 * `maintain manage the registration and usage of dynamic imports`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element dynamic-import-registry
 */
class DynamicImportRegistry extends HTMLElement {
  
  // render function
  get html() {
    return `
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    let props = {};
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "dynamic-import-registry";
  }
  /**
   * object life cycle
   */
  constructor(delayRender = false) {
    super();
    
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/dynamic-import-registry-properties.json
    let obj = DynamicImportRegistry.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        }
        else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
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
  /**
   * attributes to notice changes to
   */
  static get observedAttributes() {
    return [];
  }
  /**
   * callback when any observed attribute changes
   */
  attributeChangedCallback(attr, oldValue, newValue) {

  }
  
}
window.customElements.define(DynamicImportRegistry.tag, DynamicImportRegistry);
export { DynamicImportRegistry };
