/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';

/**
 * `undo-manager`
 * `an undo history manager element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class UndoManager extends LitElement {
  
  //styles function
  static get styles() {
    return  [
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

<slot></slot>
<div>${this.blocked}</div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
  ...super.properties,
  
  "blocked": {
    "name": "blocked",
    "type": Boolean,
    "value": "false",
    "reflectToAttribute": false,
    "observer": false
  }
};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "undo-manager";
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
customElements.define("undo-manager", UndoManager);
export { UndoManager };
