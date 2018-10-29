import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./node_modules/@polymer/iron-icon/iron-icon.js";
import "./lib/stop-icon.js";
Polymer({
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

      :host[icon="stopnoteicons:stop-icon"] {
        --accent-color: #d8261c;
      }

      :host[icon="stopnoteicons:warning-icon"] {
        --accent-color: #ffeb3b;
      }

      :host[icon="stopnoteicons:confirm-icon"] {
        --accent-color: #81c784;
      }

      :host[icon="stopnoteicons:book-icon"] {
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
        font-size: 2em;
        margin-top: 10px;
      }

      .secondary_message {
        margin-top: 5px;
        font-size: 1.2em;
        float: left;
      }

      .link a {
        margin-top: 5px;
        font-size: 1.2em;
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
        <div class="svg">
          <iron-icon icon="[[icon]]"></iron-icon>
        </div>
      </div>
      <div class="message_wrap">
        <div class="main_message">[[title]]</div>
        <div class="secondary_message">
          <slot name="message"></slot>
        </div>
        <template is="dom-if" if="[[url]]">
          <div class="link">
            <a href="[[url]]" target\$="[[_urlTarget(url)]]">More Information &gt;</a>
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
    title: { type: String, value: "Title", reflectToAttribute: !0 },
    url: { type: String, value: null, reflectToAttribute: !0 },
    icon: {
      type: String,
      value: "stopnoteicons:stop-icon",
      reflectToAttribute: !0
    }
  },
  _iconChanged: function() {
    this.updateStyles();
  },
  _urlTarget: function(url) {
    if (url) {
      const external = this._outsideLink(url);
      if (external) {
        return "_blank";
      }
    }
    return !1;
  },
  _outsideLink: function(url) {
    if (0 != url.indexOf("http")) return !1;
    var loc = location.href,
      path = location.pathname,
      root = loc.substring(0, loc.indexOf(path));
    return 0 != url.indexOf(root);
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Stop Note",
        description: "A message to alert readers to specific directions.",
        icon: "icons:report",
        color: "orange",
        groups: ["Video", "Media"],
        handles: [{ type: "text", title: "label" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "Enter title for stop-note.",
            inputMethod: "textfield",
            required: !0
          },
          {
            property: "url",
            title: "URL",
            description: "Enter an external url.",
            inputMethod: "textfield",
            required: !0
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Enter title for stop-note.",
            inputMethod: "textfield",
            required: !0
          },
          {
            property: "url",
            title: "URL",
            description: "Enter an external url.",
            inputMethod: "textfield",
            required: !0
          },
          {
            slot: "message",
            title: "Message",
            description: "Enter a message for stop-note.",
            inputMethod: "code-editor",
            required: !0
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
    });
  }
});
