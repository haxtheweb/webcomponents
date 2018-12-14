import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-image/iron-image.js";
/**
`random-image`
Element to show random image from a given group.

* @demo demo/index.html
*/
let RandomImage = Polymer({
  _template: html`
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
  `,

  is: "random-image",

  properties: {
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
      value: function() {
        return [];
      }
    }
  },

  _pickRandomProperty: function(obj) {
    var result;
    var count = 0;
    for (var prop in obj) if (Math.random() < 1 / ++count) result = prop;
    return result;
  },

  ready: function() {
    var randomPos = this._pickRandomProperty(this.imagesList);
    this.imgSrc = this.imagesList[randomPos].path;
    this.imgTitle = this.imagesList[randomPos].title;
  }
});
export { RandomImage };
