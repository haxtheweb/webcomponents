/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';

/**
 * `mutation-observer-import-mixin`
 * `a SuperClass mixin that dynamically imports undefined custom element definitions`
 * @demo demo/index.html
 * @element mutation-observer-import-mixin
 */
class MutationObserverImportMixin extends LitElement {
  
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
   * Convention we use
   */
  static get tag() {
    return "mutation-observer-import-mixin";
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
customElements.define(MutationObserverImportMixin.tag, MutationObserverImportMixin);
export { MutationObserverImportMixin };
