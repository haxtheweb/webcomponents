/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/polymer/lib/elements/dom-if.js";
/**
 * `md-block`
 * `a markdown block`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MdBlock extends PolymerElement {
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
      </style>
      <div>
        <marked-element markdown="[[markdown]]">
          <div slot="markdown-html"></div>
          <dom-if if="[[hasSource]]">
            <script type="text/markdown" src$="[[source]]"></script>
          </dom-if>
        </marked-element>
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Markdown",
        description: "A block of markdown content directly or remote loaded",
        icon: "icons:code",
        color: "yellow",
        groups: ["Block"],
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
        quick: [
          {
            property: "source",
            title: "Source",
            description: "Source file for markdown",
            inputMethod: "textfield",
            icon: "icons:link"
          }
        ],
        configure: [
          {
            property: "markdown",
            title: "Markdown",
            description: "Raw markdown",
            inputMethod: "code-editor"
          },
          {
            property: "source",
            title: "Source",
            description: "Source file for markdown",
            inputMethod: "haxupload"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      source: {
        name: "source",
        type: "String"
      },
      hasSource: {
        name: "hasSource",
        type: "Boolean",
        computed: "_calculateHasSource(source)"
      },
      markdown: {
        name: "markdown",
        type: "String"
      }
    };
  }
  constructor() {
    super();
    import("@polymer/marked-element/marked-element.js");
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "md-block";
  }
  /**
   * Calculate visibility of the source response
   */
  _calculateHasSource(source) {
    if (source && source != "") {
      return true;
    }
    this.source = null;
    return false;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(MdBlock.haxProperties, MdBlock.tag, this);
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(MdBlock.tag, MdBlock);
export { MdBlock };
