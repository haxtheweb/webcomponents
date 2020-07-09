/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';

/**
 * `service-card`
 * `simple showcase of services provided`
 * @demo demo/index.html
 * @element service-card
 */
class ServiceCard extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Convention we use
   */
  static get tag() {
    return "service-card";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
  
}
customElements.define(ServiceCard.tag, ServiceCard);
export { ServiceCard };
