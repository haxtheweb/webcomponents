import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/neon-animation/animations/scale-up-animation.js";
import "@polymer/neon-animation/animations/scale-down-animation.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
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
    <style is="custom-style" include="materializecss-styles">
      :host {
        display: block;
        --hax-app-picker-dialog-background-color: var(--simple-colors-light-green-background1);
      };
      #dialog {
        min-width: 25vw;
        min-height: 25vh;
        background-color: rgba(0,0,0,.9);
        border-radius: 16px;
        z-index: 1000000;
        border: 4px solid var(--simple-colors-light-green-background1);
        @apply --hax-app-picker-dialog;
      }
      #title, .element-button > div {
        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);
      }
      #title {
        padding: 16px;
        margin: 0;
        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);
        @apply --paper-font-title;
        @apply --hax-app-picker-dialog-title;
      }
      #buttonlist {
        border-top: 1px solid var(--simple-colors-light-green-background1);
        display: block;
        text-align: center;
        margin: auto;
        padding: 8px;
        overflow-x: hidden;
        overflow-y: auto;
        --paper-dialog-scrollable: {
          padding: 0;
        }
      }
      @media (orientation: landscape) {
        #buttonlist {
          max-height: 50vh;
        }
        #dialog {
          max-width: 30vw;
        }
      }
      @media (orientation: portrait) {
        #buttonlist {
          max-height: 60vh;
        }
        #dialog {
          max-width: 40vw;
        }
      }
      .element-button {
        display: inline-block;
        width: 72px;
        margin: 8px 4px;
        text-align: center;
      }
      .element-button > div {
        @apply --paper-font-caption;
        margin-top: 8px;
        color: #FFFFFF;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        @apply --hax-app-picker-hax-element-text;
      }
      .icon {
        cursor: pointer;
        width: 64px;
        height: 64px;
        padding: 16px;
        color: white;
        border-radius: 50%;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        -webkit-transition: box-shadow .2s;
        -moz-transition: box-shadow .2s;
        -ms-transition: box-shadow .2s;
        -o-transition: box-shadow .2s;
        transition: box-shadow .2s;
        @apply --hax-app-picker-hax-element--icon;
      }
      .icon:hover, .icon:focus {
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
      }
      .icon:active {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }
      @media screen and (max-width: 550px) {
        #dialog {
          max-width: 80%;
          overflow: auto;
        }
        .icon {
          width: 32px;
          height: 32px;
          padding: 8px;
        }
        .element-button {
          width: 54px;
          margin: 0px;
        }
      }
    </style>
    <paper-dialog id="dialog">
      <h3 id="title">[[title]]</h3>
      <paper-dialog-scrollable id="buttonlist">
      <template is="dom-repeat" items="[[selectionList]]" as="element">
        <div class="element-button" on-tap="_selected" data-selected\$="[[index]]" title="[[element.title]]">
          <paper-icon-button id\$="picker-item-[[index]]" on-tap="_selected" data-selected\$="[[index]]" class\$="icon [[element.color]]" icon="[[element.icon]]"></paper-icon-button>
          <div>[[element.title]]</div>
        </div>
      </template>
      </paper-dialog-scrollable>
    </paper-dialog>
`,

  is: "hax-app-picker",

  listeners: {
    "dialog.iron-overlay-canceled": "close",
    "dialog.iron-overlay-closed": "close"
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
