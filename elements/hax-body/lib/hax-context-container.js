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
          position: absolute;
          visibility: hidden;
          opacity: 0;
          z-index: 1000;
          display: block;
          transition: 0.2s opacity ease-in-out;
          width: 100%;
          top: var(--hax-context-container-top, 0px);
        }
        :host([menus-visible]) {
          position: absolute;
          visibility: visible;
          opacity: 1;
        }
        :host([menu-sticky]) {
          position: fixed;
          top: 0;
          left: var(--hax-context-container-left, 0px);
          max-width: var(--hax-context-container-width, 100%);
        }
        #inner {
          width: 100%;
          position: absolute;
          bottom: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          top: unset;
        }
        :host([below]) #inner {
          bottom: unset;
          top: 0;
        }
        :host([menu-sticky]) #inner {
          bottom: unset;
          top: var(--hax-context-container-target-top, 0px);
        }
        :host([below]) ::slotted(*) {
          --simple-toolbar-button-padding: var(--hax-tray-margin, 4px);
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
      menuSticky: {
        type: Boolean,
        attribute: "menu-sticky",
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
