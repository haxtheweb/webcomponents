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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
