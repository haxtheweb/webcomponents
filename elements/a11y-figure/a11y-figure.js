/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from 'lit-element';
import { A11yDetails } from "@lrnwebcomponents/a11y-details/a11y-details.js";

/**
 * `a11y-figure`
 * `accessible figure with image description in details`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class A11yFigure extends A11yDetails {
  
      //styles function
      static get styles() {
        return  [
          ...super.styles,
          css`
    :host {
  display: block;
}

:host([hidden]) {
  display: none;
}
          `
        ];
      }
    
    // render function
      render() {
        return html`
    
    <figure>
  <slot name="image"></slot>
  <figcaption>
    <slot></slot>
    <details id="details">
      <summary 
        @click="${this._handleClick}"  
        @keyup="${this._handleKeyup}" 
        tabindex="0"
        role="button">
        <span class="open-text">${this.openText}</span>
        <span class="close-text">${this.closeText}</span>
        <slot name="summary" class="${this.summaryClasses}"></slot>
      </summary>
      <div id="details-inner"><slot name="details"></slot></div>
    </details>
  </figcaption>
</figure>`;
      }

  // properties available to the custom element for data binding
  static get properties() {
    return {...super.properties};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "a11y-figure";
  }

  // life cycle
  constructor() {
    super();
    
    this.tag = A11yFigure.tag;
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/a11y-figure-properties.json
    let obj = A11yFigure.properties;
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
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
  
}
customElements.define("a11y-figure", A11yFigure);
export { A11yFigure };
