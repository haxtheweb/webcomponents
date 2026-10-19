import { html } from "lit";
import "../responsive-utility.js";
/**
 * `responsive-utility-behaviors`
 * A superclass to that custom elements can extend to automatically use ResponsiveUtility.
 *
 * @class ResponsiveUtilityBehaviors
 * @see ResponsiveUtility
 * @demo ../demo/index.html
 */

export const ResponsiveUtilityBehaviors = (SuperClass) => {
  return class extends SuperClass {
    static get properties() {
      let props = {};
      if (super.properties) {
        props = super.properties;
      }
      return {
        ...props,
        disableResponsive: {
          type: Boolean,
          reflect: true,
          attribute: "disable-responsive",
        },
        /*
         * size for responsive styling: xs, sm, md, lg, xl
         */
        responsiveSize: {
          type: String,
          attribute: "responsive-size",
          reflect: true,
        },
        /*
         * width in pixels
         */
        responsiveWidth: {
          type: Number,
          attribute: "responsive-width",
          reflect: true,
        },
        /*
         * Miniumum value for small breakpoint
         */
        sm: {
          type: Number,
          attribute: "sm",
        },
        /*
         * Miniumum value for medium breakpoint
         */
        md: {
          type: Number,
          attribute: "md",
        },
        /*
         * Miniumum value for large breakpoint
         */
        lg: {
          type: Number,
          attribute: "lg",
        },
        /**
         * Miniumum value for extra-large breakpoint
         */
        xl: {
          type: Number,
          attribute: "xl",
        },
      };
    }

    render() {
      return html`<slot></slot>`;
    }

    constructor() {
      super();
      this.responsiveSize = "xs";
      // Mirrors DDDBreakpoints (d-d-d/lib/DDDLayout.js) without importing
      // DDD, so responsive-utility stays dependency-free. Keep in sync with
      // DDD; elements can still set their own sm / md / lg / xl
      this.sm = 600;
      this.md = 900;
      this.lg = 1200;
      this.xl = 1440;
      this.disableResponsive = false;
    }
    /**
     * init the utility & register element
     */
    connectedCallback() {
      super.connectedCallback();
      // Register on first connect (not firstUpdated). The utility's handler
      // sets responsive-size / responsive-width synchronously; doing that
      // before the first update batches those reactive props into it.
      // Registering from firstUpdated set them post-render and scheduled a
      // redundant second update (Lit change-in-update warning). Guarded so
      // a DOM move (reconnect) does not register a duplicate observer.
      if (!this.disableResponsive && !this.__responsiveRegistered) {
        this.__responsiveRegistered = true;
        globalThis.ResponsiveUtility.requestAvailability();
        this.dispatchEvent(
          new CustomEvent("responsive-element", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              attribute: "responsive-size",
              custom: "responsive-width",
              element: this,
              sm: this.sm,
              md: this.md,
              lg: this.lg,
              xl: this.xl,
            },
          }),
        );
      }
    }
    /**
     * detached the element
     */
    disconnectedCallback() {
      if (!this.disableResponsive) {
        this.dispatchEvent(
          new CustomEvent("responsive-element-deleted", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this,
          }),
        );
      }
      super.disconnectedCallback();
    }
  };
};
