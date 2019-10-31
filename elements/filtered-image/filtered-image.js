/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
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
class FilteredImage extends SimpleColors {
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
      <style></style>
      <svg id="svg" viewBox$="[[viewBox]]">
        <rect id="rect" x="0" y="0"></rect>
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
        <image id="image" filter$="url(#[[__id]])" x="0" y="0"></image>
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
    let props = {
      src: {
        name: "src",
        type: String,
        value: "",
        observer: "_srcChanged"
      },
      __id: {
        name: "__id",
        type: String,
        computed: "_getID(src,matrix)"
      },
      alt: {
        name: "alt",
        type: String,
        value: ""
      },
      height: {
        name: "width",
        type: String,
        value: "",
        observer: "_heightChanged"
      },
      width: {
        name: "unset",
        type: String,
        value: "",
        observer: "_widthChanged"
      },
      viewBox: {
        name: "viewBox",
        type: String,
        computed: "_getViewBox(height,width)"
      },
      color: {
        name: "color",
        type: String,
        value: "#ffffff"
      },
      strength: {
        name: "strength",
        type: Number,
        value: 1
      },
      contrast: {
        name: "contrast",
        type: Number,
        value: 0
      },
      /*"__filters": {
    "name": "__filters",
    "type": Array,
    "value": {
      "red": [0.750,0.0500,0.000],
      "pink": [0.650,0.0300,0.270],
      "purple": [0.400,0.000,0.650],
      "deep-purple": [0.175,0.000,0.600],
      "indigo": [0.025,0.000,0.675],
      "blue": [0.000,0.100,0.700],
      "light-blue": [0.000,0.200,0.850],
      "cyan": [0.000,0.450,0.750],
      "teal": [0.000,0.550,0.200],
      "green": [0.000,0.650,0.050],
      "light-green": [0.075,0.625,0.000],
      "lime": [0.250,0.750,0.000],
      "yellow": [0.850,0.850,0.000],
      "amber": [0.800,0.500,0.000],
      "orange": [0.850,0.150,0.000],
      "deep-orange": [0.950,0.050,0.000],
      "brown": [0.200,0.100,0.075],
      "blue-grey": [0.100,0.200,0.300]
    }
  },*/
      __matrix: {
        name: "matrix",
        type: Array,
        computed: "_getMatrix(color,contrast,strength)"
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
    return "filtered-image";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this._srcChanged();
  }
  _heightChanged() {
    let svg = this.shadowRoot.querySelector("#svg"),
      image = svg.querySelector("#image"),
      rect = svg.querySelector("#rect");
    svg.setAttribute("height", this.height);
    image.setAttribute("height", this.height);
    rect.setAttribute("height", this.height);
  }
  _widthChanged() {
    let svg = this.shadowRoot.querySelector("#svg"),
      image = svg.querySelector("#image"),
      rect = svg.querySelector("#rect");
    svg.setAttribute("width", this.width);
    image.setAttribute("width", this.width);
    rect.setAttribute("width", this.width);
  }
  _getViewBox(height, width) {
    return `0 0 ${width} ${height}`;
  }
  _srcChanged() {
    let svg = this.shadowRoot.querySelector("#svg"),
      image = svg.querySelector("#image");
    image.setAttribute("href", this.src);
    image.setAttribute("xlink:href", this.src);
  }
  _getMatrix(color, contrast, strength) {
    let values = [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0]
      ],
      svg = this.shadowRoot.querySelector("#svg"),
      matrix = svg.querySelector("#matrix"),
      rgba = null;
    if (color.startsWith("#") && color.length > 6) {
      if (color.length === 7) color += "ff";
      values[0][0] = parseInt(color.substring(1, 3), 16) / 255;
      values[1][1] = parseInt(color.substring(3, 5), 16) / 255;
      values[2][2] = parseInt(color.substring(5, 7), 16) / 255;
      values[3][3] = parseInt(color.substring(7, 9), 16) / 255;
    } else if (color.startsWith("#")) {
      if (color.length === 4) color += "f";
      values[0][0] =
        parseInt(color.substring(1, 2) + color.substring(1, 2), 16) / 255;
      values[1][1] =
        parseInt(color.substring(2, 3) + color.substring(2, 3), 16) / 255;
      values[2][2] =
        parseInt(color.substring(3, 4) + color.substring(3, 4), 16) / 255;
      values[3][3] =
        parseInt(color.substring(4, 5) + color.substring(4, 5), 16) / 255;
    } else if (color.startsWith("rgb")) {
      let temp = color.replace(/rgba?\(/g, "").replace(/\)/g, "");
      rgba = temp.split(",");
      values[0][0] = parseInt(rgba[0] / 255);
      values[1][1] = parseInt(rgba[1] / 255);
      values[2][2] = parseInt(rgba[2] / 255);
      values[3][3] = values[3][3] || "1";
    }
    //console.log(values);

    if (contrast !== 0) {
      values[0][3] = (values[0][0] * contrast) / 100;
      values[1][3] = (values[1][1] * contrast) / 100;
      values[2][3] = (values[2][2] * contrast) / 100;
    }
    if (strength !== 1) {
      let adjust = function(val, strength) {
        let diff = 1 - val,
          pct = diff / 100,
          adjustment = pct * (1 - strength);
        return val + (1 - val) * 0.01 * (1 - strength);
      };
      values[0][0] = values[0][0] + (1 - strength) * (1 - values[0][0]);
      values[1][1] = values[1][1] + (1 - strength) * (1 - values[1][1]);
      values[2][2] = values[2][2] + (1 - strength) * (1 - values[2][2]);
    }

    console.log(values);

    matrix.setAttribute(
      "values",
      JSON.stringify(values).replace(/[,\[\]]/g, " ")
    );
    return values;
  }
  _getID(src, matrix) {
    let id = "svg" + Math.random();
    return id.replace(/0./g, "-");
  }
}
window.customElements.define(FilteredImage.tag, FilteredImage);
export { FilteredImage };
