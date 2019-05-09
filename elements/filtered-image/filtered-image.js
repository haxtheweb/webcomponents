/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
/**
 * `filtered-image`
 * `An image using an SVG filter. Can be used to make background images have more contrast with text.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @demo demo/filters.html Filters
 */
class FilteredImage extends PolymerElement {
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
      <svg id="svg" viewBox$="[[viewBox]]">
        <filter id$="[[__id]]">
          <feColorMatrix
            id="matrix"
            type="matrix"
            values=" 1   0   0   0   0
               0   1   0   0   0
               0   0   1   0   0
               0   0   0   1   0 "
          />
        </filter>
        <image id="image" filter$="url(#[[__id]])"></image>
      </svg>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Filtered image",
        description:
          "An image using an SVG filter. Can be used to make background images have more contrast with text.",
        icon: "icons:android",
        color: "green",
        groups: ["Image"],
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
        quick: [
          {
            property: "src",
            description: "",
            inputMethod: "textfield",
            required: true,
            icon: "icons:link",
            validationType: "url"
          },
          {
            property: "alt",
            description: "",
            inputMethod: "alt",
            required: true,
            icon: "icons:accessibility"
          }
        ],
        configure: [
          {
            property: "src",
            description: "",
            inputMethod: "textfield",
            required: true,
            icon: "icons:link",
            validationType: "url"
          },
          {
            property: "alt",
            description: "",
            inputMethod: "alt",
            required: true,
            icon: "icons:accessibility"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      src: {
        name: "src",
        type: "String",
        value: "",
        observer: "_srcChanged"
      },
      __id: {
        name: "__id",
        type: "String",
        computed: "_getID(src,matrix)"
      },
      alt: {
        name: "alt",
        type: "String",
        value: ""
      },
      height: {
        name: "width",
        type: "String",
        value: "",
        observer: "_heightChanged"
      },
      width: {
        name: "unset",
        type: "String",
        value: "",
        observer: "_widthChanged"
      },
      viewBox: {
        name: "viewBox",
        type: "String",
        computed: "_getViewBox(height,width)"
      },
      matrix: {
        name: "matrix",
        type: "Array",
        value: "1 0 0 0 0   0 1 0 0 0   0 0 1 0 0   0 0 0 1 0",
        observer: "_matrixChanged"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "filtered-image";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(FilteredImage.haxProperties, FilteredImage.tag, this);
    this._matrixChanged();
    this._srcChanged();
  }
  _heightChanged() {
    let svg = this.$.svg,
      image = svg.querySelector("#image");
    svg.setAttribute("height", this.height);
    image.setAttribute("height", this.height);
  }
  _widthChanged() {
    let svg = this.$.svg,
      image = svg.querySelector("#image");
    svg.setAttribute("width", this.width);
    image.setAttribute("width", this.width);
  }
  _getViewBox(height, width) {
    return `0 0 ${width} ${height}`;
  }
  _srcChanged() {
    let svg = this.$.svg,
      image = svg.querySelector("#image");
    image.setAttribute("href", this.src);
    image.setAttribute("xlink:href", this.src);
  }
  _matrixChanged() {
    let svg = this.$.svg,
      matrix = svg.querySelector("#matrix");
    matrix.setAttribute("values", this.matrix);
  }
  _getID(src, matrix) {
    let id = "svg" + Math.random();
    return id.replace(/0./g, "-");
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(FilteredImage.tag, FilteredImage);
export { FilteredImage };
