/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-card/paper-card.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
/**
`lrndesign-panelcard`
A LRN element

* @demo demo/index.html
*/
let LrndesignPanelcard = Polymer({
  _template: html`
    <style include="simple-colors"></style>
    <style>
      :host {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        --lrndesign-panelcard-text-color: var(
          --simple-colors-default-theme-grey-12
        );
        --lrndesign-panelcard-color: var(
          --simple-colors-default-theme-accent-1
        );
      }
      :host([dark]:not([accent-color="grey"])) {
        --lrndesign-panelcard-color: var(
          --simple-colors-default-theme-accent-3
        );
      }
      .card-panel {
        transition: box-shadow 0.25s;
        padding: 24px;
        margin: 0;
        border-radius: 2px;
        color: var(--lrndesign-panelcard-text-color);
        background-color: var(--lrndesign-panelcard-color);
      }

      h3 {
        padding: 0;
        margin: 0 0 8px 0;
      }
    </style>
    <aside>
      <paper-card elevation="[[elevation]]">
        <div class="card-panel">
          <h3>[[title]]</h3>
          <span><slot></slot></span>
        </div>
      </paper-card>
    </aside>
  `,

  is: "lrndesign-panelcard",

  behaviors: [HAXBehaviors.PropertiesBehaviors, SimpleColors],

  properties: {
    /**
     * Title of the panel
     */
    title: {
      type: String,
      value: "Block heading",
      reflectToAttribute: true
    },
    /**
     * Height of the paper.
     */
    elevation: {
      type: Number,
      value: 2,
      reflectToAttribute: true
    }
  },

  /**
   * Attached.
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Note card",
        description: "A small note to offset text used for asides.",
        icon: "icons:check-box-outline-blank",
        color: "grey",
        groups: ["Content", "Visual Treatment"],
        handles: [
          {
            type: "text",
            text: "title"
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
            description: "The heading for this sticky note",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "color",
            title: "Background color",
            description: "Select the background color use",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "elevation",
            title: "Elevation",
            description: "Visually how high this is off the page",
            inputMethod: "textfield",
            icon: "icons:content-copy"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The heading for this sticky note",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            slot: "",
            title: "Text",
            description: "The text for our sticky note",
            inputMethod: "textarea",
            icon: "editor:title",
            required: false,
            validationType: "text"
          },
          {
            property: "color",
            title: "Background color",
            description: "Select the background color use",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "elevation",
            title: "Elevation",
            description: "Visually how high this is off the page",
            inputMethod: "select",
            options: {
              0: "0",
              1: "1",
              2: "2",
              3: "3",
              4: "4",
              5: "5"
            }
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
export { LrndesignPanelcard };
