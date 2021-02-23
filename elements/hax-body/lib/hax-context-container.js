import { LitElement, html, css } from "lit-element/lit-element.js";
import { HaxTrayBaseStyles } from "@lrnwebcomponents/hax-body/lib/hax-ui-styles.js";
import { SimpleTourFinder } from "@lrnwebcomponents/simple-popover/lib/SimpleTourFinder";
/**
 *
 * @customElement
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
const HaxContextBehaviors = function (SuperClass) {
  return class extends SimpleTourFinder(SuperClass) {
    /**
     * LitElement constructable styles enhancement
     */
    static get styles() {
      return [
        ...HaxTrayBaseStyles,
        css`
          :host {
            display: block;
            pointer-events: none;
            --hax-ui-spacing-sm: 1px;
          }
          :host [hidden] {
            display: none;
          }
          :host > * {
            margin: 0 auto;
          }
          .selected-buttons {
            transition: 0.1s all ease-in-out;
            width: 0;
          }
          :host([has-selected-text]) .selected-buttons {
            width: 100%;
          }
          :host(.hax-context-pin-top) #toolbar {
            position: fixed;
            top: 0px;
          }
          :host(:hover),
          :host(:focus-within) {
            z-index: var(--hax-ui-focus-z-index) !important;
          }
          .group {
            padding: 0;
          }
          hax-toolbar {
            flex: 0 1 auto;
            border: none !important;
          }
          hax-toolbar[collapse-disabled]::part(morebutton) {
            display: none !important;
          }
          hax-toolbar *[hidden] {
            display: none !important;
          }
          hax-toolbar[collapse-disabled]::part(morebutton) {
            display: none !important;
          }
        `,
      ];
    }

    constructor() {
      super();
    }
    render() {
      return html`<slot></slot> `;
    }
    static get tag() {
      return "hax-context-container";
    }
  };
};
/**
 *
 *
 * @class HaxContext
 * @extends {LitElement}
 */
class HaxContextContainer extends HaxContextBehaviors(LitElement) {}
window.customElements.define(HaxContextContainer.tag, HaxContextContainer);
export { HaxContextContainer, HaxContextBehaviors };
