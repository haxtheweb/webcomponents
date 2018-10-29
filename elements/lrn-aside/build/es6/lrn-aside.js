import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/lrndesign-panelcard/lrndesign-panelcard.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: flex;
		    padding: 8px;
      }
      :host[sticky] {
        top:0;
        position: sticky;
      }
      :host[direction='left'] {
        float: left;
        max-width: 30em;
      }
      :host[direction='right'] {
        float: right;
        max-width: 30em;
      }
    </style>
    <aside>
      <lrndesign-panelcard title="[[title]]">
        <slot></slot>
      </lrndesign-panelcard>
    </aside>
`,
  is: "lrn-aside",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    title: { type: String, value: "Related content" },
    sticky: { type: Boolean, value: !1, reflectToAttribute: !0 },
    direction: { type: String, value: "", reflectToAttribute: !0 }
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Sticky note",
        description:
          "A sticky note to present some basic info offset on the page.",
        icon: "av:note",
        color: "yellow",
        groups: ["Content"],
        handles: [{ type: "text", title: "title" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "Enter title for sticky note",
            inputMethod: "textfield",
            required: !0
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Enter title for sticky note.",
            inputMethod: "textfield",
            required: !0
          },
          {
            slot: "",
            title: "Content",
            description: "Content of the sticky note",
            inputMethod: "code-editor",
            required: !0
          },
          {
            property: "sticky",
            title: "Stick to page on scroll",
            description: "Appear sticky when the user scrolls past it",
            inputMethod: "boolean"
          },
          {
            property: "direction",
            title: "Direction to hang",
            description: "Location of the sticky note to hang",
            inputMethod: "select",
            options: { "": "none", right: "Right", left: "Left" }
          }
        ],
        advanced: []
      }
    });
  }
});
