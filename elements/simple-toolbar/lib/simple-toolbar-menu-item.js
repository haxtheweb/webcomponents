import { LitElement, html, css } from "lit";
import { A11yMenuButtonItemBehaviors } from "@lrnwebcomponents/a11y-menu-button/lib/a11y-menu-button-item.js";
/**
 * `simple-toolbar-menu`
 * `An icon / button that has support for multiple options via drop down.`
 *
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 *
 * @element simple-toolbar-menu-item
 * @extends A11yMenuButtonItemBehaviors
 */
class SimpleToolbarMenuItem extends A11yMenuButtonItemBehaviors(LitElement) {
  constructor() {
    super();
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --simple-toolbar-button-min-width: 100% !important;
        }
        ::slotted(*) {
          --simple-toolbar-border-radius: 0px;
          display: flex;
        }
      `,
    ];
  }

  render() {
    return html`
      <li role="none">
        <slot></slot>
      </li>
    `;
  }
  static get tag() {
    return "simple-toolbar-menu-item";
  }
}
window.customElements.define(SimpleToolbarMenuItem.tag, SimpleToolbarMenuItem);
export { SimpleToolbarMenuItem };
