import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/neon-animation/animations/scale-up-animation.js";
import "@polymer/neon-animation/animations/scale-down-animation.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-app-picker-item.js";
/**
 `hax-app-picker`
 A picker for selecting an item from a list of apps / hax gizmos which require
 a decision to be made. This is used when multiple things match either on upload
 in the add operation of the app or in the gizmo selection to render through,
 such as having multiple ways of presenting an image.

@demo demo/index.html

@microcopy - the mental model for this element
 - data - this is the app data model for an element which expresses itself to hax
*/
Polymer({
  _template: html`
    <style is="custom-style" include="materializecss-styles simple-colors">
      :host {
        display: block;
        --hax-app-picker-dialog-background-color: var(
          --simple-colors-default-theme-light-green-1
        );
      }
      hax-app-picker-item {
        -webkit-transition: 0.3s all linear;
        transition: 0.3s all linear;
        display: inline-flex;
      }
      #closedialog {
        float: right;
        top: 15px;
        right: 0;
        position: absolute;
        padding: 4px;
        margin: 0;
        color: var(--simple-colors-default-theme-light-green-1, green);
        background-color: transparent;
        width: 40px;
        height: 40px;
        min-width: unset;
      }
      #ironlist {
        width: 100%;
        height: 30vh;
      }
      #dialog {
        min-width: 30vw;
        min-height: 30vh;
        height: 30vw;
        width: 30vh;
        padding: 8px;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.9);
        border-radius: 16px;
        z-index: 1000000;
        border: 2px solid var(--simple-colors-default-theme-light-green-1);
        @apply --hax-app-picker-dialog;
      }
      #title,
      .element-button > div {
        color: var(--hax-app-picker-dialog-text-color, #ffffff);
      }
      #title {
        padding: 16px;
        border-bottom: 2px solid
          var(--simple-colors-default-theme-light-green-1);
        margin: 0;
        width: calc(100% - 32px);
        color: var(--hax-app-picker-dialog-text-color, #ffffff);
        @apply --paper-font-title;
        @apply --hax-app-picker-dialog-title;
      }
      #buttonlist {
        display: block;
        text-align: left;
        margin: -32px;
        padding: 32px;
        overflow-x: hidden;
        overflow-y: auto;
        --paper-dialog-scrollable: {
          padding: 0 0 78px 0;
        }
      }
      @media (orientation: landscape) {
        #buttonlist,
        #ironlist,
        #dialog {
          width: 40vw;
          height: 50vh;
        }
      }
      @media (orientation: portrait) {
        #buttonlist,
        #ironlist,
        #dialog {
          width: 50vw;
          height: 60vh;
        }
      }
      .element-button {
        display: inline-block;
        width: 72px;
        margin: 8px 4px;
        text-align: center;
      }
      @media screen and (max-width: 550px) {
        #buttonlist,
        #ironlist,
        #dialog {
          max-width: 80%;
          overflow: auto;
        }
        .element-button {
          width: 54px;
          margin: 0px;
        }
      }
    </style>
    <paper-dialog id="dialog" with-backdrop always-on-top>
      <h3 id="title">[[title]]</h3>
      <paper-dialog-scrollable id="buttonlist">
        <iron-list id="ironlist" items="[[selectionList]]" as="element" grid>
          <template>
            <div>
              <hax-app-picker-item
                id$="picker-item-[[index]]"
                class="element-button"
                on-tap="_selected"
                data-selected\$="[[index]]"
                label="[[element.title]]"
                icon="[[element.icon]]"
                color="[[element.color]]"
              ></hax-app-picker-item>
            </div>
          </template>
        </iron-list>
      </paper-dialog-scrollable>
      <paper-button id="closedialog" on-tap="close">
        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
      </paper-button>
    </paper-dialog>
  `,

  is: "hax-app-picker",

  listeners: {
    "iron-overlay-canceled": "close",
    "iron-overlay-closed": "close"
  },

  properties: {
    /**
     * raw element set
     */
    _elements: {
      type: Array,
      value: []
    },
    /**
     * Refactored list for selection purposes
     */
    selectionList: {
      type: Array,
      value: []
    },
    /**
     * Title for the dialog
     */
    title: {
      type: String,
      value: "Pick an options"
    },
    /**
     * Allow multiple uses
     */
    pickerType: {
      type: String,
      value: "gizmo"
    },
    /**
     * Opened status to bind to the dialog box being open
     */
    opened: {
      type: Boolean,
      value: false,
      observer: "_openedChanged"
    }
  },

  /**
   * Attached life cycle
   */
  attached: function() {
    this.fire("hax-register-app-picker", this);
  },

  /**
   * Attached life cycle
   */
  ready: function() {
    document.body.appendChild(this);
  },

  /**
   * Close the picker and ensure body locking is off.
   */
  close: function() {
    this.opened = false;
  },

  /**
   * Open status changed
   */
  _openedChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (newValue) {
        this.$.dialog.open();
        setTimeout(() => {
          this.$.ironlist.fire("iron-resize");
          window.dispatchEvent(new Event("resize"));
        }, 100);
        // lock the background
        document.body.style.overflow = "hidden";
      } else {
        this.$.dialog.close();
        document.body.style.overflow = null;
      }
    }
  },

  /**
   * Present options to the user with a modal and selection method that
   * shifts itself to be above everything (stack order)
   * @param  [array] elements  a list of elements for presenting to the user
   * to select between.
   */
  presentOptions: function(
    elements,
    type,
    title = "Select an option",
    pickerType = "gizmo"
  ) {
    // wipe existing
    this.title = title;
    this.pickerType = pickerType;
    var tmp = [];
    switch (pickerType) {
      // hax gizmo selector
      case "gizmo":
        for (var i in elements) {
          elements[i].__type = type;
          tmp[i] = {
            icon: elements[i].gizmo.icon,
            title: elements[i].gizmo.title,
            color: elements[i].gizmo.color
          };
        }
        break;
      // app selector
      case "app":
        for (var i in elements) {
          tmp[i] = {
            icon: elements[i].details.icon,
            title: elements[i].details.title,
            color: elements[i].details.color
          };
        }
        break;
      // we don't know what to do with this
      default:
        tmp = elements;
        break;
    }
    this._elements = elements;
    this.set("selectionList", []);
    this.set("selectionList", tmp);
    this.opened = true;
    // try to focus on option 0
    setTimeout(() => {
      this.shadowRoot.querySelector("#picker-item-0").focus();
    }, 100);
  },

  /**
   * Handle the user selecting an app.
   */
  _selected: function(e) {
    var normalizedEvent = dom(e);
    let key = normalizedEvent.localTarget.getAttribute("data-selected");
    e.preventDefault();
    e.stopPropagation();
    if (typeof this._elements[key] !== typeof undefined) {
      // haxElement is a unique case
      if (this.pickerType == "gizmo") {
        window.HaxStore.write("activeHaxElement", this._elements[key], this);
        if (this._elements[key].__type === "__convert") {
          window.HaxStore.instance.haxManager.editExistingNode = true;
        }
        // ensure this is open even though it should be
        window.HaxStore.instance.haxManager.selectStep("configure");
        window.HaxStore.instance.haxManager.open();
      } else if (this.pickerType == "delete") {
        if (this._elements[key]["title"] === "Yes") {
          if (
            window.HaxStore.instance.activeHaxBody.activeNode !==
            window.HaxStore.instance.activeHaxBody.activeContainerNode
          ) {
            window.HaxStore.instance.activeHaxBody.haxDeleteNode(
              window.HaxStore.instance.activeHaxBody.activeNode,
              window.HaxStore.instance.activeHaxBody.activeContainerNode
            );
          } else {
            window.HaxStore.instance.activeHaxBody.haxDeleteNode(
              window.HaxStore.instance.activeHaxBody.activeNode
            );
          }
          window.HaxStore.toast("Element deleted", 2000);
        }
      } else {
        // bubble this up
        this.fire("hax-app-picker-selection", this._elements[key]);
      }
    }
    this.opened = false;
  }
});
