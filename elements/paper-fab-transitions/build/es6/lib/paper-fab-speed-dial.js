import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";
import "../node_modules/@polymer/iron-dropdown/iron-dropdown.js";
import "../node_modules/@polymer/neon-animation/neon-animations.js";
import "./paper-square-grow-animation.js";
(function(Polymer) {
  Polymer({
    _template: html`
    <custom-style>
    <style>
      :host .vertical ::content .dropdown-content {
        @apply --layout-vertical;
      }
      :host .horizontal ::content .dropdown-content {
        @apply --layout-horizontal;
      }
      :host ::content .dropdown-content > * {
        margin: 8px;
        @apply --paper-fab-speed-dial-option;
      }
    </style>
    </custom-style>
    <slot id="fabContainer" name="dropdown-trigger"></slot>
    <iron-dropdown id="dropdown" open-animation-config="[[openAnimationConfig]]" close-animation-config="[[closeAnimationConfig]]">
      <slot id="contentContainer" name="dropdown-content"></slot>
    </iron-dropdown>
`,
    is: "paper-fab-speed-dial",
    properties: {
      direction: { type: String, value: "bottom" },
      offset: { type: Number, value: 66 },
      openAnimationConfig: {
        type: Array,
        value: function() {
          return [
            { name: "fade-in-animation", timing: { delay: 150, duration: 50 } },
            {
              name: "paper-square-grow-animation",
              startSize: 56,
              timing: { delay: 150, duration: 200 }
            }
          ];
        }
      },
      closeAnimationConfig: {
        type: Array,
        value: function() {
          return [{ name: "fade-out-animation", timing: { duration: 200 } }];
        }
      }
    },
    observers: ["_updateDropdown(direction, offset)"],
    ready: function() {
      var fab = dom(this.$.fabContainer).getDistributedNodes()[0];
      fab.addEventListener(
        "tap",
        function() {
          this.$.dropdown.open();
        }.bind(this)
      );
      var content = dom(this.$.contentContainer).getDistributedNodes()[0];
      content.addEventListener(
        "tap",
        function() {
          this.$.dropdown.close();
        }.bind(this)
      );
    },
    open: function() {
      this.$.dropdown.open();
    },
    close: function() {
      this.$.dropdown.close();
    },
    _updateDropdown: function(direction, offset) {
      var d = this.$.dropdown;
      switch (direction) {
        case "bottom":
          d.verticalAlign = "top";
          d.horizontalOffset = 0;
          d.verticalOffset = offset;
          d.classList.add("vertical");
          d.classList.remove("horizontal");
          break;
        case "top":
          d.verticalAlign = "bottom";
          d.horizontalOffset = 0;
          d.verticalOffset = offset;
          d.classList.add("vertical");
          d.classList.remove("horizontal");
          break;
        case "right":
          d.horizontalAlign = "left";
          d.horizontalOffset = offset;
          d.verticalOffset = 0;
          d.classList.add("horizontal");
          d.classList.remove("vertical");
          break;
        case "left":
          d.horizontalAlign = "right";
          d.horizontalOffset = offset;
          d.verticalOffset = 0;
          d.classList.add("horizontal");
          d.classList.remove("vertical");
          break;
        default:
          throw "Invalid direction. Must be one of [top, bottom, left, right].";
      }
    }
  });
})(Polymer);
