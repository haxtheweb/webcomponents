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
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class ExtensibleToolbar extends LitElement {
  
  // render function
  render() {
    return html`
<style>:host {
  display: flex;
  opacity: 1;
  z-index: 1;
  margin: 0;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: flex-start;
  transition: all 0.5s;
  --extensible-toolbar-visible-until-sm: unset;
  --extensible-toolbar-visible-until-md: unset;
  --extensible-toolbar-visible-until-lg: unset;
  --extensible-toolbar-visible-until-xl: unset;
  --extensible-toolbar-hidden-until-sm: none;
  --extensible-toolbar-hidden-until-md: none;
  --extensible-toolbar-hidden-until-lg: none;
  --extensible-toolbar-hidden-until-xl: none;
}
:host([hidden]) {
  display: none;
}
:host([aria-hidden]) {
  visibility: hidden;
  opacity: 0;
  height: 0;
}
:host([sticky]) {
  position: sticky;
  top: 0;
}
:host([collapsed]:not([responsive-size="xs"])){
  --extensible-toolbar-visible-until-sm: none;
  --extensible-toolbar-hidden-until-sm: unset;
}
:host([collapsed]:not([responsive-size*="s"])){
  --extensible-toolbar-visible-until-md: none;
  --extensible-toolbar-hidden-until-md: none;
}
:host([collapsed][responsive-size*="l"]){
  --extensible-toolbar-visible-until-lg: none;
  --extensible-toolbar-hidden-until-lg: none;
}
:host([collapsed][responsive-size="xl"]){
  --extensible-toolbar-visible-until-xl: none;
  --extensible-toolbar-hidden-until-xl: none;
}</style>
<slot></slot>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
  /**
   * Is the toolbar collapsed?
   */
  "collapsed": {
    "attribute": "collapsed",
    "reflect": true,
    "type": "Boolean"
  },

  /**
   * Size of the toolbar, as `xs`, `sm`, `md`, `lg`, or `xl`.
   */
  "responsiveSize": {
    "attribute": "responsive-size",
    "type": "String"
  },

  /**
   * Should the toolbar stick to top so that it's always visible?
   */
  "sticky": {
    "attribute": "sticky",
    "type": "Boolean",
    "reflectToAttribute": true
  }
}
;
  }

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
          relativeToParent: true
        }
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
            detail: this
          }
        )
      )
    );
  }
}
customElements.define("extensible-toolbar", ExtensibleToolbar);
export { ExtensibleToolbar };
