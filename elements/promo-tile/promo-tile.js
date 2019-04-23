import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
/**
`promo-tile`
A LRN element

* @demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
let PromoTile = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        --tile-image: "";
        --front-title-text-shadow: #363533;
        --title-font-size: 34px;
        --title-font-weight: 400;
        --back-content-font-size: 18px;
        --back-content-font-weight: 100;
        --font-color: #fff;
        --hover-background-color: #e2801e;
        --button-hover-color: #363533;
      }

      a {
        text-decoration: none;
      }

      #container {
        width: 100%;
        height: auto;
      }

      .back_card {
        background-color: var(--hover-background-color);
        height: 460px;
        opacity: 0;
        display: flex;
        flex-direction: column;
      }

      :host([hover]) #container .back_card {
        opacity: 0.9;
        transition: all 0.3s ease-in-out;
      }

      :host([hover]) #container .front_card .front_title {
        opacity: 0;
        transition: all 0.3s ease-in-out;
      }

      .image {
        display: flex;
        justify-content: center;
        background-image: var(--tile-image);
        background-position: top center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        height: 100%;
      }

      .front_title {
        opacity: 1;
        position: absolute;
        display: flex;
        align-self: flex-end;
        padding-bottom: 25px;
      }

      .front_title h1 {
        color: var(--font-color);
        font-size: var(--title-font-size);
        font-weight: var(--title-font-weight);
        text-shadow: 1px 1px 3px var(--front-title-text-shadow);
      }

      .back_title {
        opacity: 1;
        display: flex;
        justify-content: center;
        padding: 20px 0 0;
      }

      .back_title h1 {
        color: var(--font-color);
        font-size: var(--title-font-size);
        font-weight: var(--title-font-weight);
      }

      .back_content {
        color: var(--font-color);
        font-size: var(--back-content-font-size);
        font-weight: var(--back-content-font-weight);
        padding: 0 20px;
      }

      paper-button#learn {
        display: flex;
        margin-top: 180px;
        font-size: 16px;
        color: var(--font-color);
        border: solid 1px #fff;
        border-radius: 0;
        width: 50%;
        margin-left: auto;
        margin-right: auto;
      }

      paper-button#learn:hover,
      paper-button#learn:focus {
        background-color: var(--button-hover-color);
      }
    </style>

    <div id="container">
      <div class="front_card">
        <div id="front_image" class="image" alt="[[alt]]">
          <div class="front_title">
            <h1>[[title]]</h1>
          </div>
          <div class="back_card" id="cardBack" on-click="activateBtn">
            <div class="back_title">
              <h1>[[title]]</h1>
            </div>
            <div class="back_content">
              <slot></slot>
            </div>
            <div class="learn_more">
              <a
                tabindex="-1"
                href="[[url]]"
                id="link"
                target$="[[_urlTarget(url)]]"
              >
                <paper-button id="learn" no-ink
                  >[[label]]
                  <iron-icon icon="chevron-right"></iron-icon>
                </paper-button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  is: "promo-tile",
  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema
  ],

  properties: {
    /**
     * Image source
     */
    image: {
      type: String,
      value: "",
      reflectToAttribute: true
    },
    /**
     * Alt text for image
     */
    alt: {
      type: String,
      value: "",
      reflectToAttribute: true
    },
    /**
     * Label for button
     */
    label: {
      type: String,
      value: "",
      reflectToAttribute: true
    },
    /**
     * Title of tile
     */
    title: {
      type: String,
      value: "",
      reflectToAttribute: true
    },
    /**
     * Url for tile
     */
    url: {
      type: String,
      value: "",
      reflectToAttribute: true
    },
    /**
     * Hover state
     */
    hover: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }
  },

  observers: ["__updateStyles(image)"],

  listeners: {
    mouseover: "__hoverIn",
    mouseout: "__hoverOut",
    focusin: "__hoverIn",
    focusout: "__hoverOut"
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
        title: "Promo-Tile",
        description: "A tile element for promoting content.",
        icon: "icons:dashboard",
        color: "orange",
        groups: ["Content", "Media"],
        handles: [
          {
            type: "content",
            source: "image",
            title: "citation",
            url: "source"
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
            description: "The title of the tile",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "image",
            title: "Image",
            description: "The image of the tile",
            inputMethod: "textfield",
            icon: "editor:insert-photo"
          },
          {
            property: "url",
            title: "Link",
            description: "The link of the tile",
            inputMethod: "textfield",
            icon: "editor:insert-link"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the tile",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "image",
            title: "Image",
            description: "The image of the tile",
            inputMethod: "textfield",
            icon: "editor:insert-photo"
          },
          {
            property: "alt",
            title: "Alt",
            description: "The alt text for the image",
            inputMethod: "textfield",
            icon: "editor:mode-edit"
          },
          {
            property: "url",
            title: "Link",
            description: "The link of the tile",
            inputMethod: "textfield",
            icon: "editor:insert-link"
          },
          {
            property: "label",
            title: "Label",
            description: "The label for the button",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  __updateStyles: function(image) {
    this.updateStyles({ "--tile-image": `url(${image})` });
  },

  /**
   * Internal function to check if a url is external
   */
  _outsideLink: function(url) {
    if (url.indexOf("http") != 0) return false;
    var loc = location.href,
      path = location.pathname,
      root = loc.substring(0, loc.indexOf(path));
    return url.indexOf(root) != 0;
  },

  /**
   * If url is external, open link in new window, otherwise open link in same window.
   */
  _urlTarget: function(url) {
    if (url) {
      const external = this._outsideLink(url);
      if (external) {
        return "_blank";
      }
    }
    return false;
  },

  activateBtn: function() {
    if (this.hover) {
      const link = this.$.link;
      if (window.innerWidth > 700) {
        link.click();
      }
    }
  },

  __hoverIn: function() {
    this.hover = true;
  },
  __hoverOut: function() {
    this.hover = false;
  }
});
export { PromoTile };
