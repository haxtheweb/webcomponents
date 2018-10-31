import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/lrndesign-panelcard/lrndesign-panelcard.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
/**
 * `lrn-aside`
 * A content aside as a panel
 *
 * @demo demo/index.html
 */
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
    /**
     * Title for the aside.
     */
    title: {
      type: String,
      value: "Related content"
    },
    /**
     * Apply CSS sticky styling
     */
    sticky: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Direction to hang off UI if sticky, left or right.
     */
    direction: {
      type: String,
      value: "",
      reflectToAttribute: true
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
        title: "Sticky note",
        description:
          "A sticky note to present some basic info offset on the page.",
        icon: "av:note",
        color: "yellow",
        groups: ["Content"],
        handles: [
          {
            type: "text",
            title: "title"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "Enter title for sticky note",
            inputMethod: "textfield",
            required: true
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Enter title for sticky note.",
            inputMethod: "textfield",
            required: true
          },
          {
            slot: "",
            title: "Content",
            description: "Content of the sticky note",
            inputMethod: "code-editor",
            required: true
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
            options: {
              "": "none",
              right: "Right",
              left: "Left"
            }
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
