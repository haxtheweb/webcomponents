/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/HAXCMSThemeWiring.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/active-pieces/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-pieces/site-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-pieces/site-rss-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-menu-button.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@polymer/paper-icon-button/paper-icon-button.js";

/**
 * `learn-two-theme`
 * `Learn2 theme for HAXcms`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LearnTwoTheme extends HAXCMSTheme(PolymerElement) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "learn-two-theme";
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    let props = super.properties;
    props.opened = {
      type: Boolean,
      reflectToAttribute: true
    };
    return props;
  }
  toggleDrawer(e) {
    this.$.drawer.toggle();
  }
}
window.customElements.define(LearnTwoTheme.tag, LearnTwoTheme);
export { LearnTwoTheme };
