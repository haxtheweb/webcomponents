import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/iron-icon/iron-icon.js";
import "./lib/stop-icon.js";
/**
 * `stop-note`
 * `A note that directs people to an action item of different warning levels`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * -
 */
let StopNote = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        width: auto;
        --background-color: #f7f7f7;
        --accent-color: #d32f2f;
        margin-bottom: 20px;
      }

      iron-icon {
        height: 100px;
        width: 100px;
      }

      :host([icon="stopnoteicons:stop-icon"]) {
        --accent-color: #d8261c;
      }

      :host([icon="stopnoteicons:warning-icon"]) {
        --accent-color: #ffeb3b;
      }

      :host([icon="stopnoteicons:confirm-icon"]) {
        --accent-color: #81c784;
      }

      :host([icon="stopnoteicons:book-icon"]) {
        --accent-color: #21a3db;
      }

      .container {
        display: flex;
        width: auto;
      }

      .message_wrap {
        border-right: 7px solid var(--accent-color);
        padding: 10px 25px;
        flex: 1 1 auto;
        background-color: var(--background-color);
      }

      .main_message {
        font-size: 32px;
        margin-top: 10px;
      }

      .secondary_message {
        margin-top: 5px;
        font-size: 19.2px;
        float: left;
      }

      .link a {
        margin-top: 5px;
        font-size: 19.2px;
        float: left;
        clear: left;
        text-decoration: none;
        color: #2196f3;
      }

      .link a:hover {
        color: #1976d2;
      }

      .svg {
        display: flex;
        justify-content: center;
      }

      .svg_wrap {
        background-color: var(--accent-color);
        padding: 5px;
        width: auto;
      }
    </style>

    <div class="container">
      <div class="svg_wrap">
        <div class="svg"><iron-icon icon="[[icon]]"></iron-icon></div>
      </div>
      <div class="message_wrap">
        <div class="main_message">[[title]]</div>
        <div class="secondary_message"><slot name="message"></slot></div>
        <template is="dom-if" if="[[url]]">
          <div class="link">
            <a href="[[url]]" target\$="[[_urlTarget(url)]]"
              >More Information &gt;</a
            >
          </div>
        </template>
      </div>
    </div>
  `,

  is: "stop-note",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema
  ],

  observers: ["_iconChanged(icon)"],

  properties: {
    /**
     * Title Message
     */
    title: {
      type: String,
      value: "Title",
      reflectToAttribute: true
    },

    /**
     * url to additional resources
     */
    url: {
      type: String,
      value: null,
      reflectToAttribute: true
    },

    /**
     * Icon selected
     */
    icon: {
      type: String,
      value: "stopnoteicons:stop-icon",
      reflectToAttribute: true
    }
  },

  /**
   * Update styles based on icon selected.
   */

  _iconChanged: function(icon) {
    this.updateStyles();
  },

  /**
   * Evaluates url for correct targeting.
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
   * Attached to the DOM, now fire.
   */

  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Stop Note",
        description: "A message to alert readers to specific directions.",
        icon: "icons:report",
        color: "orange",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "text",
            title: "label"
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
            description: "Enter title for stop-note.",
            inputMethod: "textfield",
            required: true
          },
          {
            property: "url",
            title: "URL",
            description: "Enter an external url.",
            inputMethod: "textfield",
            required: true
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Enter title for stop-note.",
            inputMethod: "textfield",
            required: true
          },
          {
            property: "url",
            title: "URL",
            description: "Enter an external url.",
            inputMethod: "haxupload",
            required: true
          },
          {
            slot: "message",
            title: "Message",
            description: "Enter a message for stop-note.",
            inputMethod: "code-editor",
            required: true
          },
          {
            property: "icon",
            title: "Action Icon",
            description: "Icon used for stop-note",
            inputMethod: "iconpicker",
            options: [
              "stopnoteicons:stop-icon",
              "stopnoteicons:warning-icon",
              "stopnoteicons:confirm-icon",
              "stopnoteicons:book-icon"
            ]
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
export { StopNote };
