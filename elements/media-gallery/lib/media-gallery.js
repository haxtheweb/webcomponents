import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
/**
`media-gallery`
Connects lrndesign-gallery to HAX

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <lrndesign-gallery accent-color\$="[[accentColor]]" dark\$="[[dark]]" grid\$="[[grid]]" sizing\$="[[sizing]]" sources\$="[[sources]]" title\$="[[title]]">
      <div slot="description"><slot name="description"></slot></div>
    </lrndesign-gallery>
`,

  is: "media-gallery",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * accent color for gallery
     */
    accentColor: {
      type: String,
      value: null
    },
    /**
     * use dark theme (default is light)?
     */
    dark: {
      type: Boolean,
      value: false
    },
    /**
     * thumbnail grid layout, default is false (carousel layout)
     */
    grid: {
      type: Boolean,
      value: false
    },
    /**
     * array of carousel/grid items
     */
    sources: {
      type: Array,
      value: []
    },
    /**
     * default sizing: fit screen by cropping (cover)
     * or with letterboxing (contain)
     */
    sizing: {
      type: String,
      value: "cover"
    },
    /**
     * carousel's title
     */
    title: {
      type: String,
      value: null
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Image Gallery",
        description:
          "Displays carousels, grids, thumbnails, and images with captions.",
        icon: "image:photo-library",
        color: "deep-purple",
        groups: ["Images", "Media"],
        handles: [
          {
            type: "image",
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
            description: "The title of the gallery",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "grid",
            title: "Thumbnails/Grid",
            description: "Display as thumbnails.",
            inputMethod: "boolean",
            icon: "image:grid-on"
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color for the player.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark",
            description: "Use dark theme.",
            inputMethod: "boolean",
            icon: "invert-colors"
          }
        ],
        configure: [
          {
            property: "sizing",
            title: "Sizing",
            description: "How images will fit into the gallery.",
            inputMethod: "select",
            options: {
              cover: "Cover (cropping)",
              contain: "Contain (letterboxing)"
            }
          },
          {
            property: "sources",
            title: "Image(s)",
            description: "Tracks of different languages of closed captions",
            inputMethod: "array",
            properties: [
              {
                property: "title",
                title: "Title",
                description: "Title of the image.",
                inputMethod: "textfield"
              },
              {
                property: "src",
                title: "Source/URL",
                description: "Source of the image",
                inputMethod: "textfield"
              },
              {
                property: "alt",
                title: "Alt text",
                description:
                  "Alternative text of this image (for accessibility).",
                inputMethod: "textfield"
              },
              {
                property: "details",
                title: "Details/long description about this image",
                description: "Alternative text for accessibility.",
                inputMethod: "textfield"
              },
              /* future feature 
              {
                'property': 'large',
                'title': 'Source/URL (Zoom)',
                'description': 'A larger version of the image (for zooming)',
                'inputMethod': 'textfield',
              },
              {
                'property': 'thumbnail',
                'title': 'Source/URL (Thumbnail)',
                'description': 'A smaller version of the image (for thumbnails)',
                'inputMethod': 'textfield',
              },*/
              {
                property: "zoom",
                title: "Zoom",
                description: "Allow zooming.",
                inputMethod: "boolean",
                icon: "zoom-in"
              }
            ]
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
