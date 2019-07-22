/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/relative-heading/relative-heading.js";
/**
 * `topic-heading`
 * `Semantic and visual meaning behind a heading break`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TopicHeading extends PolymerElement {
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

        relative-heading {
          color: var(--topic-heading-heading-color);
          display: inline-flex;
          --relative-heading-heading: {
            padding: 0;
            margin: 0 0 16px 0;
            @apply --topic-heading-heading;
          }
        }
        iron-icon {
          color: var(--topic-heading-icon-color);
          display: inline-flex;
          font-size: 16px;
          height: 32px;
          width: 32px;
          padding: 16px;
          line-height: 16px;
          vertical-align: bottom;
          @apply --topic-heading-icon;
        }
      </style>
      <iron-icon icon="[[icon]]"></iron-icon
      ><relative-heading text="[[title]]"></relative-heading>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Topic heading",
        description: "Semantic and visual meaning behind a heading break",
        icon: "icons:android",
        color: "green",
        groups: ["Heading"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "icon",
            description: "",
            inputMethod: "iconpicker",
            required: false,
            icon: "icons:code"
          },
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:heading"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    let props = {
      icon: {
        name: "icon",
        type: String,
        value: ""
      },
      title: {
        name: "title",
        type: String,
        value: "Heading"
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "topic-heading";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(TopicHeading.haxProperties, TopicHeading.tag, this);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(TopicHeading.tag, TopicHeading);
export { TopicHeading };
