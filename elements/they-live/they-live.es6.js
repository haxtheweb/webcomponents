/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';

/**
 * `they-live`
 * `To demonstrate the hidden reality behind the component`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class TheyLive extends LitElement {
  
  // render function
  render() {
    return html`
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
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "they-live";
  }
  /**
   * Register CSS styles
   */
  static get styles() {
    return [css`
    :host {
      display: block;
    }
  `];
  }

  // life cycle
  constructor() {
    super();
    // put default values here
    
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    
  }
  /**
   * life cycle, element removed from DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  /**
   * runs on first go
   */
  firstUpdated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {

    });
  }
  /**
   * updated / notice property changes
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {

    });
  }
  
}
customElements.define("they-live", TheyLive);
export { TheyLive };
