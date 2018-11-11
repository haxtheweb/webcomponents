import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/paper-card/paper-card.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
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
        font-size: 48px;
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
  listeners: { mouseenter: "_flipup", mouseleave: "_flipback" },
  properties: { title: { type: String } },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Sample gizmo",
        description: "The user will be able to see this for selection in a UI.",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [{ type: "video", url: "source" }],
        meta: { author: "Your organization on github" }
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
    });
  },
  _flipup: function() {
    this.$.card.classList.add("flipped");
  },
  _flipback: function() {
    this.$.card.classList.remove("flipped");
  }
});
