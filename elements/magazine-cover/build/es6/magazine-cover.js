import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/iron-image/iron-image.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/iron-icon/iron-icon.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        background-color: #222222;
        overflow: hidden;
        --magazine-cover-text-color: #EEEEEE;
      }
      .overlay {
        left: 0;
        right: 0;
        min-height: 30vh;
        margin: -38vh 0 0 0;
        background-color:rgba(0, 0, 0, 0.8);
        padding: 32px;
        position: relative;
      }
      #image {
        opacity: .5;
        filter: alpha(opacity=50);
        transition: opacity 0.3s linear;
        width:100%;
        height:80vh;
        background-color: #222222;
        @apply --magazine-cover-image;
      }
      #image:hover {
        opacity: .9;
        filter: alpha(opacity=90);
      }
      #header {
        color: var(--magazine-cover-text-color);
        font-size: 48px;
        padding: 0;
        margin: 0;
        font-weight: bold;
      }
      #subheader {
        color: var(--magazine-cover-text-color);
        font-size: 22.4px;
        padding: 0;
        margin: 3.2px 0 16px 0;
        font-style: italic;
        font-weight: normal;
      }
      #body {
        color: var(--magazine-cover-text-color);
        padding: 0;
        margin: 0;
        font-size: 19.2px;
        padding: 0 0 0 3.2px;
        margin: 0 0 32px 0;
      }
      #body p {
        color: var(--magazine-cover-text-color);
      }
      #action {
        color: var(--magazine-cover-text-color);
        text-transform: none;
        font-size: 24px;
        font-style: italic;
        font-weight: bold;
        background-color: #000000;
        border: 1px solid var(--magazine-cover-text-color);
        border-radius: 8px;
        transition: background 0.3s linear;
        width: 100%;
        margin: 0;
      }
      #action:hover,#action:focus {
        border-color: #FFFFFF;
        color: #FFFFFF;
        background-color:rgba(255, 255, 255, 0.2);
      }
      #actionlink {
        color: var(--magazine-cover-text-color);
        display: flex;
        text-decoration: none;
        border-radius: 8px;
      }
      #icon {
        display: inline-block;
        width: 19.2px;
        height: 19.2px;
        font-size: 19.2px;
        margin-left: 8px;
      }
      #label {
        text-shadow: -1px 1px 2px #000000;
      }
      @media screen and (max-width: 900px) {
        #header {
          font-size: 32px;
        }
        #subheader {
          font-size: 16px;
        }
        #body {
          font-size: 16px;
        }
        #action {
          font-size: 19.2px;
        }
      }
      @media screen and (max-width: 650px) {
        #body {
          font-size: 12.8px;
        }
        #action {
          font-size: 16px;
        }
        .overlay {
          margin: -50vh 0 0 0;
          padding: 16px;
        }
      }      
    </style>
    <iron-image src="[[image]]" preload="" fade="" sizing="cover" id="image"></iron-image>
    <div class="overlay">
      <h2 id="header" hidden$="[[!header]]">[[header]]</h2>
      <div id="subheader" hidden$="[[!subheader]]">[[subheader]]</div>
      <div id="body">
        <p hidden$="[[!text]]">[[text]]</p>
        <slot></slot>
      </div>
      <a tabindex="-1" href$="[[link]]" id="actionlink" on-tap="_linkTapped">
        <paper-button raised="" id="action">
        <span id="label">[[action]]<iron-icon id="icon" icon="[[icon]]" hidden$="[[!icon]]"></iron-icon></span>
        </paper-button>
      </a>
    </div>
`,
  is: "magazine-cover",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    header: { type: String },
    subheader: { type: String },
    text: { type: String },
    image: { type: String },
    action: { type: String, value: "Touch to learn more" },
    icon: { type: String, value: "trending-flat" },
    link: { type: String, value: "" },
    eventName: { type: String, value: "" },
    eventData: { type: Object, value: {} }
  },
  _linkTapped: function(e) {
    if ("" !== this.eventName) {
      e.preventDefault();
      e.stopPropagation();
      this.fire(this.eventName, this.eventData);
    }
  },
  attached: function() {
    let props = {
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Cover image",
        description:
          "Present a full screen cover image with a call to action. Good for starting off a series of content",
        icon: "flip-to-front",
        color: "teal",
        groups: ["Image", "Media", "Presentation"],
        handles: [
          {
            type: "image",
            source: "image",
            title: "header",
            caption: "subheader",
            citation: "subheader",
            description: "text"
          }
        ],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "image",
            title: "Image",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: !0,
            validationType: "url"
          },
          {
            property: "link",
            title: "Link",
            description: "The URL for the action.",
            inputMethod: "textfield",
            icon: "send",
            required: !0,
            validationType: "url"
          },
          {
            property: "header",
            title: "Header",
            description: "Primary header",
            inputMethod: "textfield",
            icon: "editor:title",
            required: !0
          },
          {
            property: "subheader",
            title: "Sub-header",
            description: "Secondary header",
            inputMethod: "textfield",
            icon: "editor:text-fields"
          }
        ],
        configure: [
          {
            property: "image",
            title: "Image",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: !0,
            validationType: "url"
          },
          {
            property: "header",
            title: "Header",
            description: "Primary header",
            inputMethod: "textfield",
            icon: "editor:title",
            required: !0
          },
          {
            property: "subheader",
            title: "Sub-header",
            description: "Secondary header",
            inputMethod: "textfield",
            icon: "editor:text-fields"
          },
          {
            property: "text",
            title: "Text",
            description: "Secondary header",
            inputMethod: "textfield",
            icon: "editor:text-fields"
          },
          {
            property: "action",
            title: "Call to action",
            description: "Text that lives on the button",
            inputMethod: "textfield",
            icon: "trending-flat"
          },
          {
            property: "link",
            title: "URL",
            description: "Enter URL for your action link",
            inputMethod: "textfield",
            icon: "send"
          },
          {
            property: "icon",
            title: "Action icon",
            description: "Icon used for the call to action",
            inputMethod: "iconpicker",
            options: [
              "icons:trending-flat",
              "icons:launch",
              "icons:pan-tool",
              "icons:link",
              "icons:check",
              "icons:favorite",
              "icons:thumb-up",
              "icons:send"
            ]
          }
        ],
        advanced: [
          {
            property: "event-name",
            title: "Event name",
            description: "Name of the event to fire",
            inputMethod: "textfield"
          },
          {
            property: "event-data",
            title: "Event data (JSON)",
            description: "JSON blob of data to send along",
            inputMethod: "code-editor"
          }
        ]
      }
    };
    this.setHaxProperties(props);
  }
});
