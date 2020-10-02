/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { remoteLinkBehavior } from "@lrnwebcomponents/utils/lib/remoteLinkBehavior.js";
import { activeStateBehavior } from "@lrnwebcomponents/utils/lib/activeStateBehavior.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `simple-cta`
 * `Simple call to action button`
 * @demo demo/index.html
 * @element simple-cta
 */
class SimpleCta extends activeStateBehavior(remoteLinkBehavior(SimpleColors)) {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --simple-cta-color: white;
          --simple-cta-bg-color-is-user-selected: red;
          --simple-cta-bg-color: green;
          margin: 60px 0 0;
        }

        :host([hidden]) {
          display: none;
        }

        :host([is-user-selected]) a {
          background-color: var(
            --simple-colors-default-theme-red-7,
            var(--simple-cta-bg-color-is-user-selected)
          );
        }

        a {
          display: inline-block;
          color: var(
            --simple-colors-default-theme-grey-1,
            var(--simple-cta-color)
          );
          background-color: var(
            --simple-colors-default-theme-green-7,
            var(--simple-cta-bg-color)
          );
          transition: background 0.3s linear, border 0.3s linear,
            border-radius 0.3s linear, box-shadow 0.3s linear;
          text-decoration: none;
          font-size: 1em;
          text-transform: uppercase;
          border-radius: 100px 100px 100px 100px;
          box-shadow: 0 6px 26px 0 rgba(0, 0, 0, 0.16);
          padding: 16px 40px;
          font-family: Sans-serif;
          font-weight: 500;
          outline: 1px solid
            var(--simple-colors-default-theme-grey-1, var(--simple-cta-color));
        }

        a span {
          display: flex;
          justify-content: center;
        }
      `,
    ];
  }

  // Template return function
  render() {
    return html` <a href="${this.link}" role="button">
      <span><slot>${this.title}</slot></span>
    </a>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      link: {
        type: String,
      },
      title: {
        type: String,
      },
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "simple-cta";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.link = "#";
    this.title = null;
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {}
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
customElements.define(SimpleCta.tag, SimpleCta);
export { SimpleCta };
