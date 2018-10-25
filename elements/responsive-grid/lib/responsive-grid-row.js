import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./responsive-grid-col.js";
import "./responsive-grid-clear.js";
/**   
`responsive-grid-row`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 Example:
  <responsive-grid-row 
    sm="600"                      //custom breakpoint for small screens
    md="900"                      //custom breakpoint for medium screens
    sm="1200"                     //custom breakpoint for large screens
    md="1800"                     //custom breakpoint for extra-large screens
    responsive-to-parent="true">  //make responsive to parent container instead of window/screen
    <responsive-grid-col xl="2" lg="3" md="4" sm="6" xs="12">Content</responsive-grid-col>
    <responsive-grid-col xl="2" lg="3" md="4" sm="6" xs="12">Content</responsive-grid-col>
    <responsive-grid-clear sm/>
    <responsive-grid-col xl="2" lg="3" md="4" sm="6" xs="12">Content</responsive-grid-col>
    <responsive-grid-col xl="2" lg="3" md="4" sm="6" xs="12">Content</responsive-grid-col>
  </responsive-grid-row>

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
      :host:before,
      :host:after {
        content: " ";
        display: table;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
      #row-inner {
        margin-left: -15px;
        margin-right: -15px;
        @apply --responsive-grid-row-inner;
      }
      :host #row-inner:before,
      :host #row-inner:after {
        content: " ";
        display: table;
      }
      :host #row-inner:after {
        clear: both;
      }
      :host #row-inner:before,
      :host #row-inner:after {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-clear[xs]), 
      #row-inner[screen="sm"] ::slotted(responsive-grid-clear[sm]), 
      #row-inner[screen="md"] ::slotted(responsive-grid-clear[md]), 
      #row-inner[screen="lg"] ::slotted(responsive-grid-clear[lg]), 
      #row-inner[screen="xl"] ::slotted(responsive-grid-clear[xl]){
        display: block;
      }
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[xs="0"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[sm="0"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[md="0"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[lg="0"]) {
        display: inline-block;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="12"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="12"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="12"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="12"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="12"]) {
        width: 100%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="11"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="11"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="11"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="11"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="11"]) {
        width: 91.66666667%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="10"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="10"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="10"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="10"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="10"]) {
        width: 83.33333333%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="9"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="9"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="9"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="9"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="9"]) {
        width: 75%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="8"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="8"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="8"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="8"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="8"]) {
        width: 66.66666667%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="7"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="7"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="7"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="7"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="7"]) {
        width: 58.33333333%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="6"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="6"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="6"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="6"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="6"]) {
        width: 50%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="5"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="5"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="5"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="5"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="5"]) {
        width: 41.66666667%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="4"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="4"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="4"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="4"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="4"]) {
        width: 33.33333333%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="3"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="3"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="3"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="3"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="3"]) {
        width: 25%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="2"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="2"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="2"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="2"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="2"]) {
        width: 16.66666667%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="1"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="1"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="1"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="1"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="1"]) {
        width: 8.33333333%;
      }
      #row-inner[screen="xs"] ::slotted(responsive-grid-col[xs="0"]),
      #row-inner[screen="sm"] ::slotted(responsive-grid-col[sm="0"]),
      #row-inner[screen="md"] ::slotted(responsive-grid-col[md="0"]),
      #row-inner[screen="lg"] ::slotted(responsive-grid-col[lg="0"]),
      #row-inner[screen="xl"] ::slotted(responsive-grid-col[xl="0"]) {
        display: none;
      }
      :host #row-inner ::slotted(* > #col-inner) {
        padding: 0px;
      }
      :host #row-inner[gutter="1"] ::slotted(* > #col-inner) {
        padding: 5px;
      }
      :host #row-inner[gutter="2"] ::slotted(* > #col-inner) {
        padding: 10px;
      }
      :host #row-inner[gutter="3"] ::slotted(* > #col-inner) {
        padding: 15px;
      }
      :host #row-inner[gutter="4"] ::slotted(* > #col-inner) {
        padding: 20px;
      }
    </style>
    <responsive-utility sm\$="[[sm]]" md\$="[[sm]]" lg\$="[[lg]]" xl\$="[[xl]]" responsive-to-parent\$="[[responsiveToParent]]">
    </responsive-utility>
    <div id="row-inner" screen\$="[[screen]]" gutter\$="[[gutter]]"><slot></slot></div>
`,

  is: "responsive-grid-row",

  properties: {
    /**
     * Custom small breakpoint
     */
    sm: {
      type: Number,
      value: null
    },
    /**
     * Custom medium breakpoint
     */
    md: {
      type: Number,
      value: null
    },
    /**
     * Custom large breakpoint
     */
    lg: {
      type: Number,
      value: null
    },
    /**
     * Custom extra-large breakpoint
     */
    xl: {
      type: Number,
      value: null
    },
    /**
     * the gutter-level for the columns from 0-4
     */
    gutter: {
      type: Number,
      value: 0
    },
    /**
     * make responsive based on a container instead of the window
     */
    responsiveToParent: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /*
     * screen size: xs, sm, md, lg, or xl
     */
    screen: {
      type: String,
      value: "xs",
      notify: true,
      reflectToAttribute: true
    }
  },

  attached: function() {
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    root.fire("responsive-element", {
      element: root,
      attribute: "screen",
      relativeToParent: root.responsiveToParent
    });
  }
});
