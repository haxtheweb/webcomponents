import { LitElement, html, css } from "lit";
/**    
`responsive-grid-col`
A column for the responsive grid
* @demo demo/index.html
@microcopy - the mental model for this element
  Example: 
  <responsive-grid-col 
    xs="1"    //the number of columns on an extra-small-width screen
    md="2"    //the number of columns on a small-width screen
    lg="3"    //the number of columns on a medium-width screen
    xl="4">   //the number of columns on a large-width screen
    CONTENT HERE
  </responsive-grid-col>
*/
class ResponsiveGridCol extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          position: relative;
          min-height: 1px;
          float: left;
        }
        :host:after {
          clear: both;
        }
        #col-inner {
          padding-left: var(--responsive-grid-col-inner-padding-left, 15px);
          padding-right: var(--responsive-grid-col-inner-padding-right, 15px);
        }
        /* Hide Print-Only on Screen */
        @media screen {
          :host([print-only]) {
            display: none;
          }
        }
        /* Hide Screen-Only on Print */
        @media print {
          :host([screen-only]) {
            display: none;
          }
        }
      `,
    ];
  }
  render() {
    return html` <div id="col-inner"><slot></slot></div> `;
  }

  static get tag() {
    return "responsive-grid-col";
  }
  constructor() {
    super();
    this.xl = 1;
    this.lg = 1;
    this.md = 1;
    this.sm = 1;
    this.xs = 1;
  }
  static get properties() {
    return {
      /**
       * the width when viewed on an extra large screen
       */
      xl: {
        type: Number,
      },
      /**
       * the width when viewed on a large screen
       */
      lg: {
        type: Number,
      },
      /**
       * the width when viewed on a medium screen
       */
      md: {
        type: Number,
      },
      /**
       * the width when viewed on a small screen
       */
      sm: {
        type: Number,
      },
      /**
       * the width when viewed on an extra-small screen
       */
      xs: {
        type: Number,
      },
    };
  }
}
customElements.define(ResponsiveGridCol.tag, ResponsiveGridCol);
export { ResponsiveGridCol };
