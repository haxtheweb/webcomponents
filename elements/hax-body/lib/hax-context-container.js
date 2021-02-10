import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *
 * @customElement
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class HaxContextContainer extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          padding: 0;
          position: fixed;
          visibility: hidden;
          opacity: 0;
          z-index: 1000;
          display: block;
          transition: 0.2s all ease-in-out;
          width: 100%;
        }
        :host([menus-visible]) {
          position: absolute;
          visibility: visible;
          opacity: 1;
        }
        :host([sticky]) {
          position: fixed;
          top: 0;
        }
        :host([sticky][below]) {
          bottom: 0;
        }
        #inner {
          width: 100%;
          position: absolute;
          bottom: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        :host([sticky]) #inner,
        :host([below]) #inner {
          bottom: unset;
          top: 0;
        }
        :host([sticky][below]) #inner {
          bottom: 0;
          top: unset;
        }
      `,
    ];
  }

  constructor() {
    super();
  }
  render() {
    return html`
      <div id="inner">
        <slot></slot>
      </div>
    `;
  }

  static get properties() {
    return {
      menusVisible: {
        type: Boolean,
        attribute: "menus-visible",
        reflect: true,
      },
      sticky: {
        type: Boolean,
        attribute: "sticky",
        reflect: true,
      },
      below: {
        type: Boolean,
        attribute: "below",
        reflect: true,
      },
    };
  }
  static get tag() {
    return "hax-context-container";
  }
}
window.customElements.define(HaxContextContainer.tag, HaxContextContainer);
export { HaxContextContainer };
