/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `collection-list`
 * `listing and display elements for collections of items`
 * @demo demo/index.html
 * @element collection-list
 */
class CollectionList extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host {
          display: block;
        }
        .wrapper {
          display: flex;
        }
        .wrapper ::slotted(*) {
          display: inline-flex;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="wrapper">
        <slot></slot>
      </div>
    `;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "collection-list";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
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
customElements.define(CollectionList.tag, CollectionList);
export { CollectionList };
