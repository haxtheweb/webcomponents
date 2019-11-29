/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
// html to handle template variable binding
import { html } from "@polymer/polymer/polymer-element.js";
// this is the PolymerElement base theme
import { HAXCMSPolymerElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSPolymerElementTheme.js";
// our store implements Mobx and ensures that we maintain state across the application
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
// While not needing to directly implement mobx classes this can let you do more advanced
// integrations with the store and listening for updates to properties elsewhere in the application
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * `example-haxcms-theme`
 * @customElement example-haxcms-theme
 * `A basic, well documented example theme for HAXcms`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A content management system that builds state of the art one page apps via GUI
 *

 * @polymerElement
 * @demo demo/index.html
 */
class ExampleHaxcmsTheme extends HAXCMSPolymerElementTheme {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;

          --example-haxcms-theme-color: #222222;
        }

        :host([hidden]) {
          display: none;
        }

        :host([edit-mode]) #slot {
          display: none;
        }

        :host #slot ::slotted(*) {
          color: var(--example-haxcms-theme-color);
        }
      </style>
      <site-top-menu noink indicator="arrow" arrow-size="8">
        <site-title slot="prefix" class="spacing"></site-title>
        <site-modal
          slot="suffix"
          icon="icons:search"
          title="Search site"
          button-label="Search"
        >
          <site-search></site-search>
        </site-modal>
      </site-top-menu>
      <site-breadcrumb></site-breadcrumb>
      <div id="contentcontainer">
        <div id="slot">
          <slot></slot>
        </div>
      </div>
      <site-menu-button type="prev" position="top"></site-menu-button>
      <site-menu-button type="next" position="top"></site-menu-button>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Edit mode which will be updated whenever HAXcms store
       * has been updated. It's also reflected to attribute which
       * is a Polymer convention to allow it to be leveraged in
       * CSS styling.
       */
      editMode: {
        name: "editMode",
        type: Boolean,
        reflectToAttribute: true
      },
      /**
       * Current array index of the active page that's been loaded.
       */
      activeManifestIndex: {
        name: "activeManifestIndex",
        type: Number
      }
    };
  }

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
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js");
    // create a blank array to store mobx reactions
    // this allows us to nicely clean up state after the theme
    // has been disconnected from the DOM
    this.__disposer = [];
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
