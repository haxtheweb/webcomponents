/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import "@lrnwebcomponents/lrndesign-gallery/lib/lrndesign-gallery-grid.js";
/**
 * `media-gallery`
 * `Connects lrndesign-gallery to HAX`
 *
 * @microcopy - language worth noting: ```
 <media-gallery  
  accent-color="grey"               //optional, the accent color from simple-colors; default is grey
  dark                              //optional, if true, gallery will use the simple-colors dark theme; default is false (light-theme)
  gallery-id="mygallery1"           //optional, a unique id for the gallery; if true, you can use the id in anchors to access gallery items on page load
  grid                              //optional, if true, gallery will display as a grid; default is a carousel
  sources="[]"                      //required, array of image sources
  sizing="contain"                  //optional, "cover" for cropping (default) or "contain" for letterboxing
  title="My Gallery">               //optional, the title of the gallery
  Optional description of the gallery.
</lrndesign-gallery>```
 </media-gallery>```
 * where `sources` array is:```
[{
  "alt": "IMAGE ALT TEXT",                          //required
  "details": "TEXT ABOUT IMAGE HERE",               //optional 
  "heading": "IMAGE HEADING HERE",                  //required, the image heading when in zoom mode
  "id": "123"                                       //required, unique id  
  "sizing": "contain",                              //optional, "cover" for cropping (default) or "contain" for letterboxing, default is parent's sizing
  "large": "PATH/TO/LARGE/IMAGE/HERE.JPG",          //optional, larger image for zoom instead of src 
  "src": "PATH/TO/FULL/IMAGE/HERE.JPG",             //required
  "thumbnail": "PATH/TO/THUMBAIL/IMAGE/HERE.JPG",   //required
  "tooltip": "IMAGE TOOLTIP HERE",                  //required, the tooltip for the image thumbnail
  "title": "IMAGE TITLE HERE",                      //optional, the image title when viewed
  "type": "image",                                  //required, "image", "video", "audio", etc.
}]
 *
 * @customElement
 * @polymer
 * @demo demo/index.html default gallery (carousel)
 * @demo demo/grid.html gallery grid
 */
class MediaGallery extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
      </style>
      <template is="dom-if" if="[[!grid]]" restamp>
        <lrndesign-gallery
          accent-color$="[[accentColor]]"
          dark$="[[dark]]"
          id$="[[galleryId]]"
          sizing$="[[sizing]]"
          sources$="[[sources]]"
          title$="[[title]]"
        >
          <slot slot="description" name="description"></slot>
        </lrndesign-gallery>
      </template>
      <template is="dom-if" if="[[grid]]" restamp>
        <lrndesign-gallery-grid
          accent-color$="[[accentColor]]"
          dark$="[[dark]]"
          id$="[[galleryId]]"
          sizing$="[[sizing]]"
          sources$="[[sources]]"
          title$="[[title]]"
        >
          <slot slot="description" name="description"></slot>
        </lrndesign-gallery-grid>
      </template>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
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
              }
              /* future feature 
          {
            "property": "large",
            "title": "Source/URL (Zoom)",
            "description": "A larger version of the image (for zooming)",
            "inputMethod": "textfield",
          },
          {
            "property": "thumbnail",
            "title": "Source/URL (Thumbnail)",
            "description": "A smaller version of the image (for thumbnails)",
            "inputMethod": "textfield",
          },
          {
            "property": "zoom",
            "title": "Zoom",
            "description": "Allow zooming.",
            "inputMethod": "boolean",
            "icon": "zoom-in"
          }*/
            ]
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * accent color for gallery
       */
      accentColor: {
        type: "String",
        value: null
      },
      /**
       * use dark theme (default is light)?
       */
      dark: {
        type: "Boolean",
        value: false
      },
      /**
       * gallery's unique id
       */
      galleryId: {
        type: "String",
        value: null
      },
      /**
       * thumbnail grid layout, default is false (carousel layout)
       */
      grid: {
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * array of carousel/grid items
       */
      sources: {
        type: "Array",
        value: []
      },
      /**
       * default sizing: fit screen by cropping (cover)
       * or with letterboxing (contain)
       */
      sizing: {
        type: "String",
        value: "cover"
      },
      /**
       * carousel's title
       */
      title: {
        type: "String",
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "media-gallery";
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(MediaGallery.haxProperties, MediaGallery.tag, this);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(MediaGallery.tag, MediaGallery);
export { MediaGallery };
