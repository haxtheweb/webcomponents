import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./lib/relative-heading-manager.js";
/**
`relative-heading`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -
 -

*/
let RelativeHeading = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <div id="html"></div>
  `,

  is: "relative-heading",

  properties: {
    /*
     * id of the heading element that this heading is a subtopic of
     */
    subtopicOf: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
    /*
     * text of the heading
     */
    text: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
    /*
     * the id of the heading element that this heading is a subtopic of
     */
    parentHeading: {
      type: Object,
      value: {}
    },
    /*
     * the heading tag, eg. <h1/>, <h2/> ...
     */
    tag: {
      type: String,
      value: null,
      reflectToAttribute: true
    }
  },

  /*
   * make sure the heading manager is ready to listen
   */
  created: function() {
    window.RelativeHeadingManager.requestAvailability();
  },

  /*
   * fire a heading created event for the heading manager
   */
  attached: function() {
    this.fire("heading-created", this);
  },

  /*
   * fired if the subtopic changes
   */
  attributeChanged: function(name, type) {
    if (name === "subtopic-of") {
      this.fire("heading-created", this);
    } else if (name === "tag") {
      this.fire("heading-changed", this);
      this.$.html.innerHTML =
        "<" + this.tag + ">" + this.text + "</" + this.tag + ">";
    }
  },

  /*
   * sets the parent of the heading
   */
  _setParent: function(el) {
    let root = this;
    if (root.__parentListener !== undefined)
      root.parentHeading.removeEventListener("heading-changed");
    root.parentHeading = el;
    if (el !== null) {
      root.__parentListener = root.parentHeading.addEventListener(
        "heading-changed",
        function(e) {
          root._setTag();
        }
      );
    }
    this._setTag();
  },

  /*
   * gets the  heading tag name
   */
  _setTag: function() {
    let tag = "h1",
      level = 1,
      h = function(level) {
        // get the tag name based on the number of the heading, eg. 1 for <h1/>, 2 for <h2/>
        return "h" + Math.max(Math.min(level, 6), 1);
      };
    // if there is a parent heading, get the parent's tag attribute or tagName attribute
    if (this.parentHeading !== null) {
      if (
        this.parentHeading.tag !== undefined &&
        this.parentHeading.tag !== null
      ) {
        level =
          parseInt(this.parentHeading.tag.toLowerCase().replace("h", "")) + 1;
      } else if (
        this.parentHeading.tagName !== undefined &&
        this.parentHeading.tagName.match(/^H[0-6]$/)
      ) {
        level =
          parseInt(this.parentHeading.tagName.toLowerCase().replace("h", "")) +
          1;
      }
      // if there is a tag attribute, get that
    } else if (this.tag !== undefined && this.tag !== null) {
      level = parseInt(this.tag.toLowerCase().replace("h", ""));
    }
    tag = h(level);
    this.tag = tag;
  }
});
export { RelativeHeading };
