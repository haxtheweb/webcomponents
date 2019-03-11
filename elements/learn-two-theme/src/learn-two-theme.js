/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@lrnwebcomponents/map-menu/map-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/jos-breadcrumb.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/HAXCMSThemeWiring.js";
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
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.$.menu.addEventListener(
      "active-item",
      this.mapMenuActiveChanged.bind(this)
    );
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.$.menu.removeEventListener(
      "active-item",
      this.mapMenuActiveChanged.bind(this)
    );
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
  /**
   * When map menu changes let's set a track icon internal to it.
   */
  mapMenuActiveChanged(e) {
    // update the UI directly
    e.detail.trackIcon = "icons:check";
    // now work on the user data object in the theme layer
    let userData = JSON.parse(window.localStorage.getItem("HAXCMSSystemData"));
    userData.manifests[this.manifest.id].accessData[e.detail.id] = {
      timestamp: Math.floor(Date.now() / 1000),
      trackIcon: "icons:check"
    };
    for (var i in this.manifest.items) {
      if (this.manifest.items[i].id === e.detail.id) {
        this.manifest.items[i].metadata.accessData =
          userData.manifests[this.manifest.id].accessData[e.detail.id];
      }
    }
    // save this back to the system data
    window.localStorage.setItem("HAXCMSSystemData", JSON.stringify(userData));
  }
  /**
   * Previous page to hook into when prev is hit
   */
  prevPage(e) {
    super.prevPage(e);
  }
  /**
   * Next page to hook into when next is hit
   */
  nextPage(e) {
    super.nextPage(e);
  }
  toggleDrawer(e) {
    this.$.drawer.toggle();
  }
}
window.customElements.define(LearnTwoTheme.tag, LearnTwoTheme);
export { LearnTwoTheme };
