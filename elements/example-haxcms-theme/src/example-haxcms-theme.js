/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
// while we're using PolymerElement here it's not required
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
// we use this to help speed up time to first paint but it's not required
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
// this is required for any HAXcms theme unless you directly implement what this superClass does
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/HAXCMSThemeWiring.js";
// our store implements Mobx and ensures that we maintain state across the application
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
// While not needing to directly implement mobx classes this can let you do more advanced
// integrations with the store and listening for updates to properties elsewhere in the application
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * `example-haxcms-theme`
 * `A basic, well documented example theme for HAXcms`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A content management system that builds state of the art one page apps via GUI
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class ExampleHaxcmsTheme extends HAXCMSTheme(PolymerElement) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "example-haxcms-theme";
  }
  /**
   * life cycle, constructor
   */
  constructor() {
    super();
    // dynamic import ensures that your theme will end users a better experience
    // by reducing the time to first paint. JS Modules block the tree until all imports
    // at the top of the document have been resolved. Dynamic imports ike these
    // can be used to ensure that they still load but that the user starts to see
    // content prior to all assets loading.
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-top-menu.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js");
    // create a blank array to store mobx reactions
    // this allows us to nicely clean up state after the theme
    // has been disconnected from the DOM
    this.__disposer = [];
    // afterNextRender is a life cycle event specific to Polymer but ensures that
    // these items don't fire until after the element has been rendered to the screen
    // This happens AFTER DOM connection and visibility of the element meaning it's
    // very late in the life cycle. This is useful for things that are not critical to the
    // initial UI / UX of the site. In this example, the menu buttons to navigate back and forth
    // as well as the search engine. These WILL load but might not be available until a few seconds
    // after the page loads (the first time). Again, this helps unblock the render tree
    // to deliver the page to users faster
    afterNextRender(this, function() {
      import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js");
      import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js");
    });
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    // HAXcms's theme layer uses Mobx to ensure state is simple and maintained
    // accurately across theme changes and the many site- elements.
    // This example will maintain the active manifest index in this theme
    // meaning the array position of the currently active page. This is
    // useful when creating in theme pagination or reacting to specific
    // indexes like 1st and last.
    autorun(reaction => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });
    // editMode is the global state of the HAXeditor as reflected in HAXcms
    autorun(reaction => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    // this ensures that we clean up the listeners on mobx after the theme
    // has been disconnected. This happens when we have multiple theme tags or
    // the user has defined that specific nodes should have different designs
    // which then disconnects this theme and connects the new one.
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}
window.customElements.define(ExampleHaxcmsTheme.tag, ExampleHaxcmsTheme);
export { ExampleHaxcmsTheme };
