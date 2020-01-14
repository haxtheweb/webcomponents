import "../responsive-utility.js";
/**
 * `responsive-utility-nehaviors`
 * @customElement responsive-utility-nehaviors
 * `A simpler way to use responsive utility.`
 */
export const ResponsiveUtilityBehaviors = function(SuperClass) {
  return class extends SuperClass {
    static get properties() {
      return {
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
      };
    }
    /**
     * init the utility & register element
     */
    connectedCallback() {
      super.connectedCallback();
      window.ResponsiveUtility.requestAvailability();
      this.dispatchEvent(
        new CustomEvent("responsive-element", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            element: this,
            sm: this.sm,
            md: this.md,
            lg: this.lg,
            xl: this.xl,
            responsiveToParent: this.responsiveToParent,
            attribute: this.attribute
          }
        })
      );
    }
    /**
     * detached the element
     */
    disconnectedCallback() {
      this.dispatchEvent(
        new CustomEvent("responsive-element-deleted", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
      super.disconnectedCallback();
    }
  };
};
