/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';

/**
 * `simple-tooltip`
 * `a simple tooltip forked from paper-tooltip with the same api`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @customElement simple-tooltip
 */
class SimpleTooltip extends LitElement {
  
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

<div id="tooltip" class="hidden">
  <slot></slot>
</div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {...super.properties};
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "simple-tooltip";
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
customElements.define(SimpleTooltip.tag, SimpleTooltip);
export { SimpleTooltip };
