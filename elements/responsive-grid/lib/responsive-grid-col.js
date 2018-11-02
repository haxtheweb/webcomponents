import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**    
`responsive-grid-col`
A column for the responsive grid

@demo demo/index.html

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
Polymer({
  _template: html`
    <style>
      :host {
        position: relative;
        min-height: 1px;
        float: left;
      }
      :host:after {
        clear: both;
      }
      #col-inner {
        padding-left: 15px;
        padding-right: 15px;
        @apply --responsive-grid-col-inner;
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
    </style>
    <div id="col-inner"><slot></slot></div>
`,

  is: "responsive-grid-col",

  properties: {
    /**
     * the width when viewed on an extra large screen
     */
    xl: {
      type: Number,
      value: 1
    },
    /**
     * the width when viewed on a large screen
     */
    lg: {
      type: Number,
      value: 1
    },
    /**
     * the width when viewed on a medium screen
     */
    md: {
      type: Number,
      value: 1
    },
    /**
     * the width when viewed on a small screen
     */
    sm: {
      type: Number,
      value: 1
    },
    /**
     * the width when viewed on an extra-small screen
     */
    xs: {
      type: Number,
      value: 1
    }
  }
});
