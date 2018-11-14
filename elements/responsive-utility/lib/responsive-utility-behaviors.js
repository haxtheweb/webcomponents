import "../responsive-utility.js";
/**
 * `responsive-utility-nehaviors`
 * `A simpler way to use responsive utility.`
 *
 * To use in a webcomponent:
 *   1. <link rel="import" href="path/to/responsive-utility/responsive-utility-behaviors.html">
 * 2. behaviors: [ResponsiveUtilityBehaviors]
 */
// ensure ResponsiveUtilityBehaviors exists globally before acting on them
window.ResponsiveUtilityBehaviors = window.ResponsiveUtilityBehaviors || {};
// create a behavior for elements that have a 'display' connotation
window.ResponsiveUtilityBehaviors = {
  properties: {
    /*
     * parent size for responsive styling
     */
    responsiveSize: {
      type: String,
      value: "xs",
      reflectToAttribute: true
    },
    /*
     * acts like an element query instead of @media query
     */
    responsiveToParent: {
      type: Boolean,
      value: true
    },
    /*
     * Miniumum value for small breakpoint
     */
    sm: {
      type: Number,
      value: 600
    },
    /*
     * Miniumum value for medium breakpoint
     */
    md: {
      type: Number,
      value: 900
    },
    /*
     * Miniumum value for large breakpoint
     */
    md: {
      type: Number,
      value: 1200
    },
    /**
     * Miniumum value for extra-large breakpoint
     */
    md: {
      type: Number,
      value: 1500
    }
  },
  /**
   * init the utility & register element
   */
  attached: function() {
    window.ResponsiveUtility.requestAvailability();
    this.fire("responsive-element", {
      element: this,
      sm: this.sm,
      md: this.md,
      lg: this.lg,
      xl: this.xl,
      responsiveToParent: this.responsiveToParent,
      attribute: this.attribute
    });
  },
  /**
   * detached the element
   */
  detached: function() {
    this.fire("responsive-element-deleted", this);
  }
};
