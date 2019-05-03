import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
/**
`random-image`
Element to show random image from a given group.

* @demo demo/index.html
*/
class RandomImage extends PolymerElement {
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .is-circle {
          border: 1px solid grey;
          border-radius: 50%;
          box-shadow: 0px 5px 10px #ccc;
        }
      </style>
      <iron-image
        style="width:200px; height:200px;"
        class$="[[mode]]"
        sizing="contain"
        src$="[[imgSrc]]"
        title$="[[imgTitle]]"
      ></iron-image>
    `;
  }

  static get tag() {
    return "random-image";
  }

  static get properties() {
    return {
      mode: {
        type: String,
        notify: true,
        value: ""
      },
      imgSrc: {
        type: String
      },
      imgTitle: {
        type: String
      },
      imagesList: {
        type: Object,
        notify: true,
        // When initializing a property to an object or array value, use a function to ensure that each element
        // gets its own copy of the value, rather than having an object or array shared across all instances of the element
        value() {
          return [];
        }
      }
    };
  }

  _pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj) if (Math.random() < 1 / ++count) result = prop;
    return result;
  }

  ready() {
    super.ready();
    var randomPos = this._pickRandomProperty(this.imagesList);
    this.imgSrc = this.imagesList[randomPos].path;
    this.imgTitle = this.imagesList[randomPos].title;
  }
}
window.customElements.define(RandomImage.tag, RandomImage);
export { RandomImage };
