import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `lrnsys-collapselist`
 * @element lrnsys-collapselist
 */
class LrnsysCollapselist extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: var(--simple-colors-background1);
          --lrnsys-collapselist-text-color: var(--simple-colors-foreground1);
          --lrnsys-collapselist-item-color: var(--simple-colors-background1);
          --lrnsys-collapselist-item-active-color: var(
            --simple-colors-background2
          );
          --lrnsys-collapselist-item-border: var(--simple-colors-background5);
        }
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        ul li {
          width: 100%;
          border: 1px solid var(--lrnsys-collapselist-item-border);
          margin-bottom: -1px;
        }
        ul li lrnsys-collapselist-item {
          height: 32px;
          padding: 8px;
          margin: 0;
          min-width: 0.16px;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          text-transform: unset;
          border-radius: 0;
        }
        ul li lrnsys-collapselist-item iron-icon,
        ul li lrnsys-collapselist-item span {
          pointer-events: none;
        }
        iron-icon {
          display: inline-block;
        }
        .collapse-label {
          margin-left: 8px;
        }
        .collapse-content {
          padding: 16px;
        }
      `,
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.items = [];
    import("@polymer/iron-icon/iron-icon.js");
    import("./lrnsys-collapselist-item.js");
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <ul>
        ${this.items.map(
          (row) => html`
            <li>
              <lrnsys-collapselist-item>
                <span slot="label">
                  <iron-icon icon="${row.icon}"></iron-icon>
                  <span class="collapse-label">${row.label}</span>
                </span>
                <span slot="content"> ${row.content} </span>
              </lrnsys-collapselist-item>
            </li>
          `
        )}
      </ul>
    `;
  }
  static get tag() {
    return "lrnsys-collapselist";
  }

  static get properties() {
    return {
      /**
       * Array of items to present with label and content for the list of collapses.
       */
      items: {
        type: Array,
      },
    };
  }
}
window.customElements.define(LrnsysCollapselist.tag, LrnsysCollapselist);
export { LrnsysCollapselist };
