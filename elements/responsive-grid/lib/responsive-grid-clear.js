import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**  
`responsive-grid-clear`
A clearumn for the responsive grid

* @demo demo/index.html

@microcopy - the mental model for this element
  Example: 
  <responsive-grid-clear 
    xs    //clears the floated columns on an extra small-width screen
    sm    //clears the floated columns on a small-width screen
    md    //clears the floated columns on a medium-width screen
    lg/>  //clears the floated columns on a large-width screen
*/
class ResponsiveGridClear extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: none;
          clear: both;
        }
      </style>
    `;
  }

  static get tag() {
    return "responsive-grid-clear";
  }

  static get properties() {
    return {
      /**
       * clear the float and force a new worw on an extra-large screen?
       */
      xl: {
        type: Boolean,
        value: false
      },
      /**
       * clear the float and force a new worw on a large screen?
       */
      lg: {
        type: Boolean,
        value: false
      },
      /**
       * clear the float and force a new worw on a medium screen?
       */
      md: {
        type: Boolean,
        value: false
      },
      /**
       * clear the float and force a new worw on a small screen?
       */
      sm: {
        type: Boolean,
        value: false
      },
      /**
       * clear the float and force a new worw on an extra-small screen?
       */
      xs: {
        type: Boolean,
        value: false
      }
    };
  }
}
window.customElements.define(ResponsiveGridClear.tag, ResponsiveGridClear);
export { ResponsiveGridClear };
