import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/iron-icons/iron-icons.js";
/**
`media-image`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        font-family: "Roboto", sans-serif;
        width: 100%;
        --box-background-color: #f7f6ef;
      }

      :host[card] {
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.14);
        padding: 20px;
      }

      :host[box] {
        background-color:var(--box-background-color);
        padding: 20px;
      }

      :host[round] iron-image {
        border-radius: 50%;
      }

      @media screen and (min-width: 450px) {
        :host[size="small"] {
          max-width: 50%;
        }
      }

      @media screen and (min-width: 650px) {
        :host[size="small"] {
          max-width: 35%;
        }
      }

      @media screen and (min-width: 900px) {
        :host[size="small"] {
          max-width: 25%;
        }
      }

      .citation {
        font-size: .8rem;
        font-style: italic;
        color: #4c4c4c;
        margin: 15px 0 15px;
      }

      .caption {
        padding-bottom: 25px;
        border-bottom: dashed 2px lightgray;
        margin-bottom: 25px;
        line-height: 1.5;
        font-size: 18px;
      }

      iron-image {
        width: 100%;
        --iron-image-width: 100%;
      }
    </style>

    <iron-image resource\$="[[schemaResourceID]]-image" src\$="[[source]]" alt\$="[[alt]]"></iron-image>
    <div class="citation">[[citation]]</div>
    <div class="caption">[[caption]]</div>
`,

  is: "media-image",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * Image source.
     */
    source: {
      type: String,
      value: ""
    },
    /**
     * Image citation.
     */
    citation: {
      type: String,
      value: ""
    },
    /**
     * Image caption.
     */
    caption: {
      type: String,
      value: ""
    },
    /**
     * Image alt.
     */
    alt: {
      type: String,
      value: ""
    },
    /**
     * The size of the image (small, wide).
     */
    size: {
      type: String,
      value: "wide",
      reflectToAttribute: true
    },
    /**
     * The shape of the image (round).
     */
    round: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Applies card styling.
     */
    card: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Applies box styling.
     */
    box: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }
  },

  /**
   * Ready.
   */
  ready: function() {
    // Establish hax properties if it exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Styled image",
        descrption:
          "An image gizmo with the ability to provide simple, consistent styling and accessibility options.",
        icon: "editor:insert-photo",
        color: "indigo",
        groups: ["Image", "Media"],
        handles: [
          {
            type: "image",
            source: "source",
            title: "alt",
            alt: "alt",
            citation: "citation",
            caption: "caption"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "source",
            title: "Source",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: true
          },
          {
            property: "alt",
            title: "Alternative text",
            description: "Text to describe the image to non-sighted users.",
            inputMethod: "alt",
            icon: "accessibility",
            required: true
          }
        ],
        configure: [
          {
            property: "source",
            title: "Source",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: true
          },
          {
            property: "caption",
            title: "Caption",
            description: "A caption to describe the image usage",
            inputMethod: "textarea",
            icon: "av:call-to-action"
          },
          {
            property: "alt",
            title: "Alternative text",
            description: "Text to describe the image to non-sighted users.",
            inputMethod: "alt",
            icon: "accessibility",
            required: true
          },
          {
            property: "round",
            title: "Round image",
            description: "Crops the image appearance to be circle in shape.",
            inputMethod: "boolean",
            icon: "account",
            required: false
          },
          {
            property: "card",
            title: "Card",
            description:
              "Apply a drop shadow to give the appearance of being a raised card.",
            inputMethod: "boolean",
            icon: "check-box-outline-blank",
            required: false
          },
          {
            property: "box",
            title: "Box",
            description: "Apply a visual box around the image.",
            inputMethod: "boolean",
            icon: "image:crop-square",
            required: false
          }
        ],
        advanced: [
          {
            property: "citation",
            title: "Citation",
            description: "Citation for the image.",
            inputMethod: "textfield",
            icon: "text-format",
            required: false
          }
        ]
      }
    };
    this.setHaxProperties(props);
  }
});
