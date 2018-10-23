import "@polymer/polymer/polymer.js";
/**  
`responsive-grid-clear`
A clearumn for the responsive grid

@demo demo/index.html

@microcopy - the mental model for this element
  Example: 
  <responsive-grid-clear 
    xs    //clears the floated columns on an extra small-width screen
    sm    //clears the floated columns on a small-width screen
    md    //clears the floated columns on a medium-width screen
    lg/>  //clears the floated columns on a large-width screen
*/
Polymer({
  _template: `
    <style>
      :host {
        display: none;
        clear: both;
      }
    </style>
`,

  is: "responsive-grid-clear",

  properties: {
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
  }
});
