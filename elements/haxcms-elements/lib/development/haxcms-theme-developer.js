/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
import { HAXCMSPolymerElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSPolymerElementTheme.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-rss-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
/**
 * `haxcms-dev-theme`
 * `This is a theme used to make new themes (wwaaaaaaa?)
 *

 * @polymer
 * @demo demo/index.html
 */
class HAXCMSThemeDeveloper extends HAXCMSPolymerElementTheme {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-theme-developer";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          /* theme color which is dictated by the manifest */
          background-color: var(--haxcms-color, black);
        }
        /**
         * Hide the slotted content during edit mode. This must be here to work.
         */
        :host([edit-mode]) #slot {
          display: none;
        }
      </style>
      <div id="contentcontainer">
        <div id="slot"></div>
      </div>
    `;
  }
  /**
   * this is gonna be fun
   */
  _fireDefinitions(e) {
    let props = {
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "HAXcms active title",
        description: "",
        icon: "icons:android",
        color: "pink",
        tags: ["Other", "haxcms"],
        handles: [],
        meta: {
          author: "HAXcms",
        },
      },
      settings: {
        configure: [],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["page-title"],
      },
    };
    this.HAXWiring.setHaxProperties(props, "site-active-title", this, true);
    props = {
      type: "element",
      editingElement: "core",
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "HAXcms breadcrumb",
        description: "",
        icon: "icons:android",
        color: "pink",
        tags: ["Other", "haxcms"],
        handles: [],
        meta: {
          author: "HAXcms",
        },
      },
      settings: {
        configure: [],
        advanced: [],
      },
      saveOptions: {
        wipeSlot: false,
      },
    };
    this.HAXWiring.setHaxProperties(props, "site-breadcrumb", this, true);
    props = {
      type: "element",
      editingElement: "core",
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "HAXcms menu",
        description: "",
        icon: "icons:android",
        color: "pink",
        tags: ["Other", "haxcms"],
        handles: [],
        meta: {
          author: "HAXcms",
        },
      },
      settings: {
        configure: [
          {
            property: "preventAutoScroll",
            title: "Prevent auto scroll",
            description: "If the menu should automatically scroll into view",
            inputMethod: "boolean",
          },
          {
            property: "hideActiveIndicator",
            title: "Hide active indicator",
            description:
              "Hide active indicator that highlights the active item",
            inputMethod: "boolean",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        wipeSlot: false,
        unsetAttributes: ["active-id"],
      },
    };
    this.HAXWiring.setHaxProperties(props, "site-menu", this, true);
    props = {
      type: "element",
      editingElement: "core",
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "HAXcms menu button",
        description: "",
        icon: "icons:android",
        color: "pink",
        tags: ["Other", "haxcms"],
        handles: [],
        meta: {
          author: "HAXcms",
        },
      },
      settings: {
        configure: [
          {
            property: "type",
            title: "Button type",
            description: "Which direction should the button be activating",
            inputMethod: "select",
            options: {
              prev: "Previous",
              next: "Next",
            },
          },
          {
            property: "position",
            title: "Label position",
            description: "direction for the label to hang on hover",
            inputMethod: "select",
            options: {
              left: "left",
              right: "right",
              above: "above",
              below: "below",
            },
          },
          {
            property: "label",
            title: "Label",
            description: "label to show on hover",
            inputMethod: "textfield",
          },
          {
            property: "label",
            title: "Label",
            description: "label to show on hover",
            inputMethod: "textfield",
          },
          {
            property: "icon",
            title: "Icon",
            description: "icon for the button",
            inputMethod: "iconpicker",
          },
          {
            property: "raised",
            title: "Raised",
            description: "If this has a drop shadow or is flat",
            inputMethod: "boolean",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["link"],
      },
    };
    this.HAXWiring.setHaxProperties(props, "site-menu-button", this, true);
    props = {
      type: "element",
      editingElement: "core",
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "HAXcms RSS button",
        description: "",
        icon: "icons:android",
        color: "pink",
        tags: ["Other", "haxcms"],
        handles: [],
        meta: {
          author: "HAXcms",
        },
      },
      settings: {
        configure: [
          {
            property: "type",
            title: "Button type",
            description: "What feed to point",
            inputMethod: "select",
            options: {
              rss: "RSS 2.0",
              atom: "Atom 1.0",
            },
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["icon", "label", "href"],
      },
    };
    this.HAXWiring.setHaxProperties(props, "site-rss-button", this, true);
    props = {
      type: "element",
      editingElement: "core",
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "HAXcms title",
        description: "",
        icon: "icons:android",
        color: "pink",
        tags: ["Other", "haxcms"],
        handles: [],
        meta: {
          author: "HAXcms",
        },
      },
      settings: {
        configure: [],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["site-title", "home-link"],
      },
    };
    this.HAXWiring.setHaxProperties(props, "site-title", this, true);
    props = {
      type: "element",
      editingElement: "core",
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "HAXcms query",
        description: "The most powerful element in the known universe",
        icon: "icons:android",
        color: "pink",
        tags: ["Other", "haxcms"],
        handles: [],
        meta: {
          author: "HAXcms",
        },
      },
      settings: {
        configure: [
          {
            property: "conditions",
            title: "Conditions",
            description: "A JSON object of conditions",
            inputMethod: "code-editor",
          },
          {
            property: "sort",
            title: "Sort",
            description: "A JSON object of sort conditions",
            inputMethod: "code-editor",
          },
          {
            property: "grid",
            title: "Display as grid",
            description: "Flex vs display block for all items.",
            inputMethod: "boolean",
          },
          {
            slot: "",
            slotWrapper: "template",
            slotAttributes: {
              "preserve-content": "preserve-content",
            },
            title: "Tag to render",
            description: "Render through this per item",
            inputMethod: "code-editor",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        wipeSlot: false,
        unsetAttributes: ["active-id"],
      },
    };
    this.HAXWiring.setHaxProperties(props, "site-query", this, true);
  }
  constructor() {
    super();
    this.windowControllers = new AbortController();

    this.HAXWiring = new HAXWiring();
  }
  connectedCallback() {
    super.connectedCallback();
    // account for switching to this theme
    if (HAXStore.ready) {
      this._setDefinitions();
    }
    globalThis.addEventListener(
      "hax-store-ready",
      this._fireDefinitions.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.windowControllers.abort();
  }
}
customElements.define(HAXCMSThemeDeveloper.tag, HAXCMSThemeDeveloper);
export { HAXCMSThemeDeveloper };
