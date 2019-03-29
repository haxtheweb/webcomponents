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
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
        :host > * {
          margin: 0 auto;
        }
        :host #after {
          display: none;
        }
        :host #before {
          display: block;
        }
        :host([position="top"]) #after {
          display: block;
        }
        :host([position="top"]) #before {
          display: none;
        }
        :host([position="left"]) #before,
        :host([position="left"]) #middle {
          display: inline-block;
        }
        :host([position="right"]) #before,
        :host([position="right"]) #middle {
          display: inline-block;
        }
        :host #before,
        :host #after {
          width: 0;
          height: 0;
          border-style: solid;
        }
        :host #before {
          border-width: 0 10px 15px 10px;
          border-color: transparent transparent black;
        }
        :host([position="left"]) #after {
          border-width: 10px 0 10px 15px;
          border-color: transparent black transparent;
        }

        :host #after {
          border-width: 15px 10px 0 10px;
          border-color: black transparent transparent;
        }

        :host([position="right"]) #before {
          border-width: 10px 0105px 10px 0px;
          border-color: transparent black transparent;
        }

        :host #middle {
          padding: 5px;
          color: white;
          background-color: black;
          border-radius: 3px;
          min-height: 20px;
        }
      </style>
      <div id="before"></div>
      <div id="middle">
        <slot></slot>
      </div>
      <div id="after"></div>
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
      title: {
        name: "title",
        type: "String",
        value: null
      },
      showBefore: {
        name: "showBefore",
        type: "Boolean",
        computed: "_showBefore(position)"
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

  _showBefore(position) {
    console.log(position, position === "top" || position === "left");
    return position === "top" || position === "left";
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimplePopover.tag, SimplePopover);
export { SimplePopover };
