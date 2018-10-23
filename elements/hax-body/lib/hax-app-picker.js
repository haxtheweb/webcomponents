import "@polymer/polymer/polymer.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/neon-animation/web-animations.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/neon-animation/animations/scale-up-animation.js";
import "@polymer/neon-animation/animations/scale-down-animation.js";
import "materializecss-styles/materializecss-styles.js";
import "simple-colors/simple-colors.js";
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
  _template: `
    <style is="custom-style" include="materializecss-styles">
      :host {
        display: block;
        --hax-app-picker-dialog-background-color: var(--simple-colors-light-green-background1);
      };
      hax-app-picker-item {
        -webkit-transition: .3s all linear;
        transition: .3s all linear;
        display: inline-flex;
      }
      paper-icon-button.close {
        float: right;
        top: 0;
        right: 0;
        position: absolute;
        padding: 4px;
        margin: 0;
        color: var(--simple-colors-light-green-background1);
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
        background-color: rgba(0,0,0,.9);
        border-radius: 16px;
        z-index: 1000000;
        border: 2px solid var(--simple-colors-light-green-background1);
        @apply --hax-app-picker-dialog;
      }
      #title, .element-button > div {
        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);
      }
      #title {
        padding: 16px;
        border-bottom: 2px solid var(--simple-colors-light-green-background1);
        margin: 0;
        width: calc(100% - 32px);
        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);
        @apply --paper-font-title;
        @apply --hax-app-picker-dialog-title;
      }
      #buttonlist {
        display: block;
        text-align: left;
        margin: auto;
        padding: 8px;
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
    <paper-dialog id="dialog" with-backdrop="" always-on-top="">
      <h3 id="title">[[title]]</h3>
      <paper-dialog-scrollable id="buttonlist">
        <iron-list id="ironlist" items="[[selectionList]]" as="element" grid="">
          <template>
            <div>
            <hax-app-picker-item id\$="picker-item-[[index]]" class="element-button" on-tap="_selected" data-selected\$="[[index]]" label="[[element.title]]" icon="[[element.icon]]" color="[[element.color]]"></hax-app-picker-item></div>
          </template>
        </iron-list>
      </paper-dialog-scrollable>
      <paper-icon-button dialog-dismiss="" icon="icons:cancel" class="close" title="Close dialog"></paper-icon-button>
    </paper-dialog>
`,

  is: "hax-app-picker",

  listeners: {
    "dialog.iron-overlay-canceled": "close",
    "dialog.iron-overlay-closed": "close"
  },

  behaviors: [simpleColorsBehaviors],

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
      this.$$("#picker-item-0").focus();
    }, 100);
  },

  /**
   * Handle the user selecting an app.
   */
  _selected: function(e) {
    var normalizedEvent = Polymer.dom(e);
    let key = normalizedEvent.localTarget.getAttribute("data-selected");
    e.preventDefault();
    e.stopPropagation();
    if (typeof this._elements[key] !== typeof undefined) {
      // haxElement is a unique case
      if (this.pickerType == "gizmo") {
        Polymer.HaxStore.write("activeHaxElement", this._elements[key], this);
        if (this._elements[key].__type === "__convert") {
          Polymer.HaxStore.instance.haxManager.editExistingNode = true;
        }
        // ensure this is open even though it should be
        Polymer.HaxStore.instance.haxManager.selectStep("configure");
        Polymer.HaxStore.instance.haxManager.open();
      } else if (this.pickerType == "delete") {
        if (this._elements[key]["title"] === "Yes") {
          if (
            Polymer.HaxStore.instance.activeHaxBody.activeNode !==
            Polymer.HaxStore.instance.activeHaxBody.activeContainerNode
          ) {
            Polymer.HaxStore.instance.activeHaxBody.haxDeleteNode(
              Polymer.HaxStore.instance.activeHaxBody.activeNode,
              Polymer.HaxStore.instance.activeHaxBody.activeContainerNode
            );
          } else {
            Polymer.HaxStore.instance.activeHaxBody.haxDeleteNode(
              Polymer.HaxStore.instance.activeHaxBody.activeNode
            );
          }
          Polymer.HaxStore.toast("Element deleted", 2000);
        }
      } else {
        // bubble this up
        this.fire("hax-app-picker-selection", this._elements[key]);
      }
    }
    this.opened = false;
  }
});
