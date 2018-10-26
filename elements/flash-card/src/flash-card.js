import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-card/paper-card.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
`flash-card`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: block;
      }
      paper-card {
        -webkit-perspective: 800;
        width: 400px;
        height: 300px;
        position: relative;
        padding: 0;
        margin: 0;
      }
      paper-card.flipped {
        -webkit-transform: rotatex(-180deg);
      }
      paper-card.flipped .back {
        z-index: 3;
      }
      paper-card {
        -webkit-transform-style: preserve-3d;
        -webkit-transition: 0.5s;
      }
      paper-card .face {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        cursor: pointer;
        position: absolute;
        -webkit-backface-visibility: hidden ;
        z-index: 2;
        font-family: Georgia;
        font-size: 3em;
        text-align: center;
        line-height: 200px;
      }
      paper-card .front {
        position: absolute;
        z-index: 1;
      }
      paper-card .back {
        -webkit-transform: rotatex(-180deg);
      }
    </style>
    <paper-card id="card" animated-shadow="true">
      <div class="face front white black-text">
        Front
      </div>
      <div class="face back black white-text">
          Back
      </div>
    </paper-card>
`,

  is: "flash-card",
  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema
  ],

  listeners: {
    mouseenter: "_flipup",
    mouseleave: "_flipback"
  },

  properties: {
    /**
     * Title
     */
    title: {
      type: String
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Sample gizmo",
        description: "The user will be able to see this for selection in a UI.",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "video",
            url: "source"
          }
        ],
        meta: {
          author: "Your organization on github"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * Flip up
   */
  _flipup: function(e) {
    this.$.card.classList.add("flipped");
  },

  /**
   * Flip back
   */
  _flipback: function(e) {
    this.$.card.classList.remove("flipped");
  }
});
