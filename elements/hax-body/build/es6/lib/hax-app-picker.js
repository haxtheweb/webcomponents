import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/iron-list/iron-list.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-dialog/paper-dialog.js";
import "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "../node_modules/@polymer/paper-ripple/paper-ripple.js";
import "../node_modules/@polymer/paper-toast/paper-toast.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../node_modules/@polymer/neon-animation/neon-animation.js";
import "../node_modules/@polymer/neon-animation/animations/scale-up-animation.js";
import "../node_modules/@polymer/neon-animation/animations/scale-down-animation.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-app-picker-item.js";
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
    _elements: { type: Array, value: [] },
    selectionList: { type: Array, value: [] },
    title: { type: String, value: "Pick an options" },
    pickerType: { type: String, value: "gizmo" },
    opened: { type: Boolean, value: !1, observer: "_openedChanged" }
  },
  attached: function() {
    this.fire("hax-register-app-picker", this);
  },
  ready: function() {
    document.body.appendChild(this);
  },
  close: function() {
    this.opened = !1;
  },
  _openedChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof void 0) {
      if (newValue) {
        this.$.dialog.open();
        setTimeout(() => {
          this.$.ironlist.fire("iron-resize");
          window.dispatchEvent(new Event("resize"));
        }, 100);
        document.body.style.overflow = "hidden";
      } else {
        this.$.dialog.close();
        document.body.style.overflow = null;
      }
    }
  },
  presentOptions: function(
    elements,
    type,
    title = "Select an option",
    pickerType = "gizmo"
  ) {
    this.title = title;
    this.pickerType = pickerType;
    var tmp = [];
    switch (pickerType) {
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
      case "app":
        for (var i in elements) {
          tmp[i] = {
            icon: elements[i].details.icon,
            title: elements[i].details.title,
            color: elements[i].details.color
          };
        }
        break;
      default:
        tmp = elements;
        break;
    }
    this._elements = elements;
    this.set("selectionList", []);
    this.set("selectionList", tmp);
    this.opened = !0;
    setTimeout(() => {
      this.shadowRoot.querySelector("#picker-item-0").focus();
    }, 100);
  },
  _selected: function(e) {
    var normalizedEvent = dom(e);
    let key = normalizedEvent.localTarget.getAttribute("data-selected");
    e.preventDefault();
    e.stopPropagation();
    if (typeof this._elements[key] !== typeof void 0) {
      if ("gizmo" == this.pickerType) {
        window.HaxStore.write("activeHaxElement", this._elements[key], this);
        if ("__convert" === this._elements[key].__type) {
          window.HaxStore.instance.haxManager.editExistingNode = !0;
        }
        window.HaxStore.instance.haxManager.selectStep("configure");
        window.HaxStore.instance.haxManager.open();
      } else if ("delete" == this.pickerType) {
        if ("Yes" === this._elements[key].title) {
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
          window.HaxStore.toast("Element deleted", 2e3);
        }
      } else {
        this.fire("hax-app-picker-selection", this._elements[key]);
      }
    }
    this.opened = !1;
  }
});
