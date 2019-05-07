/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { AbsolutePositionBehavior } from "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
/**
 * `simple-popover`
 * `A popover alertdialog that is positioned next to a target element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimplePopover extends AbsolutePositionBehavior {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          align-items: center;
          flex-direction: column-reverse;
          justify-content: stretch;
          --simple-popover-border-radius: 3px;
          --simple-popover-color: #222;
          --simple-popover-padding: 10px;
          --simple-popover-background-color: white;
          --simple-popover-border-color: #bbb;
          --simple-popover-box-shadow: rgba(60, 64, 67, 0.3) 0px 4px 8px 3px;
        }
        :host([hidden]) {
          display: none;
        }
        :host([position="left"]) {
          flex-direction: row;
        }
        :host([position="right"]) {
          flex-direction: row-reverse;
        }
        :host([position="top"]) {
          flex-direction: column;
        }
        :host > * {
          width: 100%;
        }
        :host([position="left"]) > *,
        :host([position="right"]) > * {
          width: unset;
        }
        :host #content {
          margin: 0 auto;
          padding: var(--simple-popover-padding);
          color: var(--simple-popover-color);
          background-color: var(--simple-popover-background-color);
          border: 1px solid var(--simple-popover-border-color);
          min-height: 20px;
          border-radius: var(--simple-popover-border-radius);
          box-shadow: var(--simple-popover-box-shadow);
          @apply --simple-popover-content;
        }
        :host #pointer {
          width: 20px;
          height: 20px;
          position: relative;
          overflow: hidden;
          flex: 0 0 20px;
          margin: 0 0 -1px;
        }
        :host([position="top"]) #pointer {
          margin: -0.5px 0 0;
        }
        :host([position="left"]) #pointer {
          margin: 0 0 0 -1px;
        }
        :host([position="right"]) #pointer {
          width: unset;
          margin: 0 -1px 0 0;
        }
        :host #pointer:after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: var(--simple-popover-background-color);
          border: 1px solid var(--simple-popover-border-color);
          transform: rotate(45deg);
          top: 15px;
          left: 5px;
        }
        :host([position="top"]) #pointer:after {
          top: -6px;
          left: 5px;
        }
        :host([position="right"]) #pointer:after {
          top: 5px;
          left: 15px;
        }
        :host([position="left"]) #pointer:after {
          top: 5px;
          left: -6px;
        }
      </style>
      <div id="content" role="alertdialog">
        <slot></slot>
      </div>
      <div><div id="pointer" style$="[[__pointerOffSetStyle]]"></div></div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Simple popover",
        description:
          "A popover alertdialog that is positioned next to a target element",
        icon: "icons:android",
        color: "green",
        groups: ["Popover"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "nikkimk",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Offset to compensate for the popover pointers.
       */
      fitToVisibleBounds: {
        type: Boolean,
        value: true,
        readOnly: true
      },
      /**
       * Offset to compensate for the popover pointers.
       */
      offset: {
        type: Number,
        value: -10
      },
      /**
       * Positions the tooltip to the top, right, bottom, left of its content.
       */
      position: {
        type: String,
        value: "bottom",
        observer: "updatePosition",
        reflectToAttribute: true
      },
      /**
       * The actual target element
       */
      target: {
        type: Object,
        observer: "updatePosition"
      },
      /**
       * Tthe margin styles to offset the pointer
       */
      __pointerOffSetStyle: {
        type: Object,
        computed: "_getMargins(__positions)"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-popover";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(SimplePopover.haxProperties, SimplePopover.tag, this);
  }
  /**
   * sets pointer position based on popover and target middles
   *
   * @param {object} positions object that contains postions for popover and target
   * @returns {string} a string with margin styles to offset pointer
   */
  _getMargins(positions) {
    let style = "",
      v =
        positions.target.top +
        positions.target.height / 2 -
        positions.self.top -
        positions.self.height / 2 -
        10,
      h =
        positions.target.left +
        positions.target.width / 2 -
        positions.self.left -
        positions.self.width / 2 -
        10;
    switch (this.position) {
      case "left":
        style = `margin: ${v}px 0 0 -1px;`;
        break;
      case "right":
        style = `margin: ${v}px 0 -1px 0;`;
        break;
      case "top":
        style = `margin: -0.5 0 0 -1px ${h}px;`;
        break;
      default:
        style = `margin: 0 0 -1px ${h}px;`;
    }
    return style;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimplePopover.tag, SimplePopover);
export { SimplePopover };
