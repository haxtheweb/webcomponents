/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";

/**
 * `extensible-toolbar`
 * `a toolbar that can be customised with with mixins and json`
 *
### Styling

`<extensible-toolbar>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--extensible-toolbar-visible-until-sm` | display for items that should only be visible when `responsiveSize` < `sm` | unset
`--extensible-toolbar-visible-until-md` | display for items that should only be visible when `responsiveSize` < `md` | unset
`--extensible-toolbar-visible-until-lg` | display for items that should only be visible when `responsiveSize` < `lg` | unset
`--extensible-toolbar-visible-until-xl` | display for items that should only be visible when `responsiveSize` < `xl` | unset
`--extensible-toolbar-hidden-until-sm` | display for items that should only be hidden when `responsiveSize` < `sm` | none
`--extensible-toolbar-hidden-until-md` | display for items that should only be hidden when `responsiveSize` < `md` | none
`--extensible-toolbar-hidden-until-lg` | display for items that should only be hidden when `responsiveSize` < `lg` | none
`--extensible-toolbar-hidden-until-xl` | display for items that should only be hidden when `responsiveSize` < `xl` | none
 * 
 *
 * @element
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class ExtensibleToolbar extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "extensible-toolbar";
  }

  // life cycle
  constructor() {
    super();
    this.tag = ExtensibleToolbar.tag;
    this.collapsed = false;
    this.responsiveSize = "xs";
    this.gte = "xs sm md lg xl";
    this.lte = "xs";
    this.sticky = false;
  }

  /**
   * Connects to responsive utility.
   * Override if element will inherit parent's responsive size.
   */
  initResponsive() {
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: root,
          attribute: "responsive-size",
          relativeToParent: true,
        },
      })
    );
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    initResponsive();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) =>
      /**
       * Fires when collapsed property changes
       * @event collapsed-changed
       */
      /**
       * Fires when responsiveSize property changes
       * @event responsive-size-changed
       */
      /**
       * Fires when sticky property changes
       * @event sticky-changed
       */
      this.dispatchEvent(
        new CustomEvent(
          `${propName
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
            .toLowerCase()}-changed`,
          {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this,
          }
        )
      )
    );
  }
}
customElements.define("extensible-toolbar", ExtensibleToolbar);
export { ExtensibleToolbar };
