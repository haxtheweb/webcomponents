import { LitElement, html, css } from "lit";
/**  
`responsive-grid-clear`
A clearumn for the responsive grid
@microcopy - the mental model for this element
  Example: 
  <responsive-grid-clear 
    xs    //clears the floated columns on an extra small-width screen
    sm    //clears the floated columns on a small-width screen
    md    //clears the floated columns on a medium-width screen
    lg/>  //clears the floated columns on a large-width screen
*/
class ResponsiveGridClear extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: none;
          clear: both;
        }
      `,
    ];
  }
  render() {
    return html``;
  }

  static get tag() {
    return "responsive-grid-clear";
  }
  constructor() {
    super();
    this.xl = false;
    this.lg = false;
    this.md = false;
    this.sm = false;
    this.xs = false;
  }
  static get properties() {
    return {
      /**
       * clear the float and force a new worw on an extra-large screen?
       */
      xl: {
        type: Boolean,
      },
      /**
       * clear the float and force a new worw on a large screen?
       */
      lg: {
        type: Boolean,
      },
      /**
       * clear the float and force a new worw on a medium screen?
       */
      md: {
        type: Boolean,
      },
      /**
       * clear the float and force a new worw on a small screen?
       */
      sm: {
        type: Boolean,
      },
      /**
       * clear the float and force a new worw on an extra-small screen?
       */
      xs: {
        type: Boolean,
      },
    };
  }
}
customElements.define(ResponsiveGridClear.tag, ResponsiveGridClear);
export { ResponsiveGridClear };
