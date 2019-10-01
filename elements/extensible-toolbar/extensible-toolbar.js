/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { AbsolutePositionBehavior } from "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./lib/extensible-toolbar-styles.js";
import "./lib/extensible-toolbar-group.js";
import "./lib/extensible-toolbar-button.js";
import "./lib/extensible-toolbar-more-button.js";
import "./lib/extensible-toolbar-button-styles.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@lrnwebcomponents/md-extra-icons/md-extra-icons.js";

/**
 * `extensible-toolbar`
 * `a toolbar UI that can be customized and extended`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class ExtensibleToolbar extends AbsolutePositionBehavior {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        :host #toolbar {
          width: 100%;
          display: flex;
          opacity: 1;
          z-index: 1;
          margin: 0;
          align-items: stretch;
          flex-wrap: wrap;
          justify-content: flex-start;
          background-color: var(--extensible-toolbar-bg);
          border: var(--extensible-toolbar-border);
          font-size: 12px;
          transition: all 0.5s;
          @apply --extensible-toolbar;
        }
        :host #toolbar[aria-hidden] {
          visibility: hidden;
          opacity: 0;
          height: 0;
        }
        :host #toolbar .toolbar-group {
          display: flex;
          flex: 1 1 auto;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: stretch;
          padding: 0 3px;
          @apply --extensible-toolbar-group;
        }
        :host #toolbar .toolbar-group:not(:last-of-type) {
          margin-right: 3px;
          border-right: var(--extensible-toolbar-border);
          @apply --extensible-toolbar-divider;
        }
        :host #toolbar .button {
          display: flex;
          flex: 0 0 auto;
          align-items: stretch;
        }
        :host #toolbar #morebutton {
          flex: 1 0 auto;
          justify-content: flex-end;
        }

        :host([responsive-size="xs"]) #morebutton[collapse-max="xs"],
        :host([responsive-size="sm"]) #morebutton[collapse-max*="s"],
        :host([responsive-size="md"]) #morebutton:not([collapse-max*="l"]),
        :host([responsive-size="lg"]) #morebutton:not([collapse-max="xl"]),
        :host([responsive-size="xl"]) #morebutton,
        :host([responsive-size="xs"])
          #toolbar:not([aria-expanded])
          *[collapsed-until*="m"],
        :host([responsive-size="xs"])
          #toolbar:not([aria-expanded])
          *[collapsed-until*="l"],
        :host([responsive-size="sm"])
          #toolbar:not([aria-expanded])
          *[collapsed-until="md"],
        :host([responsive-size="sm"])
          #toolbar:not([aria-expanded])
          *[collapsed-until*="l"],
        :host([responsive-size="md"])
          #toolbar:not([aria-expanded])
          *[collapsed-until*="l"],
        :host([responsive-size="lg"])
          #toolbar:not([aria-expanded])
          *[collapsed-until="xl"] {
          display: none;
        }
      </style>
      <style
        include="extensible-toolbar-styles extensible-toolbar-button-styles"
      ></style>
      <div
        id="toolbar"
        aria-live="polite"
        aria-hidden$="[[!controls]]"
        aria-expanded$="[[!collapsed]]"
      >
        <extensible-toolbar-more-button
          id="morebutton"
          auto$="[[floating]]"
          class="button"
          collapse-max="[[__collapseMax]]"
          controls="toolbar"
          fit-to-visible-bounds
          for$="[[controls]]"
          icon$="[[moreIcon]]"
          label$="[[moreLabel]]"
          show-text-label$="[[moreShowTextLabel]]"
          label-toggled$="[[moreLabelToggled]]"
          position="[[_getPosition(positionBelow)]]"
          toggled$="[[!collapsed]]"
          on-click="_toggleMore"
        >
        </extensible-toolbar-more-button>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The editor buttons, as determined by `config`.
       */
      buttons: {
        name: "buttons",
        type: "Array",
        computed: "_getButtons(config)"
      },
      /**
       * Is the toolbar collapsed?
       */
      collapsed: {
        name: "collapsed",
        type: "Boolean",
        value: true
      },

      /**
       * Custom configuration of toolbar groups and buttons.
       * (See default value for example using default configuration.)
       */
      config: {
        name: "config",
        type: "Object",
        value: []
      },

      /**
       * The `id` of the object the extensible toolbar controls.
       */
      controls: {
        name: "controls",
        type: "String",
        value: null
      },

      /**
       * The `extensible-toolbar` element that uis currently in `contenteditable` mode
       */
      editor: {
        name: "editor",
        type: "Object",
        value: null
      },
      /**
       * float the toolbar above the object it controls?
       */
      floating: {
        name: "floating",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * whether or not the toolbar is hidden
       */
      hidden: {
        name: "hidden",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * The icon for the more button.
       */
      moreIcon: {
        name: "moreIcon",
        type: "String",
        value: "more-vert"
      },
      /**
       * The label for the more button.
       */
      moreLabel: {
        name: "moreLabel",
        type: "String",
        value: "More Buttons"
      },
      /**
       * The label for the more button when toggled.
       */
      moreLabelToggled: {
        name: "moreLabelToggled",
        type: "String",
        value: "Fewer Buttons"
      },
      /**
       * The show text label for more button.
       */
      moreShowTextLabel: {
        name: "moreShowTextLabel",
        type: "Boolean",
        value: false
      },
      /**
       * position the toolbar below the object it contrls
       */
      positionBelow: {
        name: "positionBelow",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * The the size of the toolbar.
       */
      responsiveSize: {
        name: "responsiveSize",
        type: "String",
        value: "xs",
        reflectToAttribute: true
      },
      /**
       * Should the toolbar stick to the top so that it is always visible?
       */
      sticky: {
        name: "sticky",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * The maximum size where all of the buttons display
       */
      __collapseMax: {
        name: "__collapseMax",
        type: "String",
        value: "xs"
      },

      /**
       * Optional space-sperated list of keyboard shortcuts for the editor
       * to fire this button, see iron-a11y-keys for more info.
       */
      __shortcutKeys: {
        name: "__shortcutKeys",
        type: "Array",
        value: []
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "extensible-toolbar";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    /** turn on responsive options */
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    this.addEventListener("button-action", e => {
      this.dispatchEvent(
        new CustomEvent("toolbar-action", {
          detail: {
            toolbar: this,
            button: e.detail
          }
        })
      );
    });
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
   * Adds a button to the toolbar
   *
   * @param {object} child the child object in the config object
   * @param {object} parent the parent object in the config object
   * @returns {object} the button
   */
  _addButton(child, parent) {
    console.log("_addButton", child, parent);
    let button = document.createElement(child.type),
      keys = button.shortcutKeys;

    this.set(`__shortcutKeys.${keys}`, button);

    for (var key in child) {
      button[key] = child[key];
    }
    button.setAttribute("class", "button");
    parent.appendChild(button);
    return button;
  }
  /**
   * Adds a button to the toolbar
   *
   * @param {object} child the child object in the config object
   * @param {object} parent the parent object in the config object
   * @returns {object} the button
   */
  _addGroup(child, parent) {
    console.log("_addGroup", child, parent);
    let group = document.createElement(child.type);
    group.setAttribute("class", "toolbar-group");

    for (var key in child) {
      if (key !== "buttons") group[key] = child[key];
    }
    parent.appendChild(group);
    return group;
  }

  /**
   * Gets the groups array for the dom-repeat.
   *
   * @param {object} config the toolbar buttons config object
   * @returns {array} the buttons array
   */
  _getButtons(config) {
    let root = this,
      toolbar = this.$.toolbar,
      max = 0,
      sizes = ["xs", "sm", "md", "lg", "xl"],
      temp = [];
    toolbar.innerHTML = "";
    this.set("__shortcutKeys", []);
    config.forEach(item => {
      if (item.type === "extensible-toolbar-group") {
        let group = this._addGroup(item, toolbar);
        max = Math.max(max, sizes.indexOf(item.collapsedUntil));
        item.buttons.forEach(button => {
          max = Math.max(max, sizes.indexOf(button.collapsedUntil));
          temp.push(root._addButton(button, group));
        });
        toolbar.appendChild(group);
      } else {
        max = Math.max(max, sizes.indexOf(item.collapsedUntil));
        temp.push(root._addButton(item, toolbar));
      }
      this.__collapseMax = sizes[max];
      toolbar.appendChild(this.$.morebutton);
    });
    return temp;
  }
  /**
   * gets the absolute positioning
   */
  _getPosition(positionBelow) {
    return positionBelow ? "bottom" : "top";
  }

  /**
   * when a shortcut key is pressed, fire the keypressed event on the button associated with it
   * @param {event} e the key event
   */

  _handleShortcutKeys(e) {
    let key = e.key;
    if (e.shiftKey) key = "shift+" + key;
    if (e.altKey) key = "alt+" + key;
    if ((window.navigator.platform === "MacIntel" && e.metaKey) || e.ctrlKey) {
      key = "ctrl+" + key;
    }
    if (this.__shortcutKeys[key]) this.__shortcutKeys[key]._keysPressed(e);
  }

  /**
   * handles toggling the more button
   */
  _toggleMore() {
    this.collapsed = !this.collapsed;
  }
}
window.customElements.define(ExtensibleToolbar.tag, ExtensibleToolbar);
export { ExtensibleToolbar };
