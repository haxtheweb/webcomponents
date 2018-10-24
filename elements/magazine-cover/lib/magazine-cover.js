import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
import "hax-body-behaviors/hax-body-behaviors.js";
/**
`magazine-cover`
A Magazine cover element

Example:
  ```html
  <magazine-cover image="demo/picture2.jpg" header="Sunset" action="Click, Breath, Relax" link="https://www.elmsln.org/">
    A simple time, a simple life. America may be fast paced and brutal on health but in Canada, people enjoy sitting and watching the sunset. Learn how Canadians manage stress.
  </magazine-cover>
  ```

@demo demo/index.html
*/
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
        padding: 2em;
        position: relative;
      }
      #image {
        opacity: .5;
        filter: alpha(opacity=50);
        transition: opacity 0.3s linear;
        width:100%;
        height:80vh;
        background-color: #222222;
        @apply(--magazine-cover-image);
      }
      #image:hover {
        opacity: .9;
        filter: alpha(opacity=90);
      }
      #header {
        color: var(--magazine-cover-text-color);
        font-size: 3em;
        padding: 0;
        margin: 0;
        font-weight: bold;
      }
      #subheader {
        color: var(--magazine-cover-text-color);
        font-size: 1.4em;
        padding: 0;
        margin: .2em 0 1em 0;
        font-style: italic;
        font-weight: normal;
      }
      #body {
        color: var(--magazine-cover-text-color);
        padding: 0;
        margin: 0;
        font-size: 1.2em;
        padding: 0 0 0 .2em;
        margin: 0 0 2em 0;
      }
      #body p {
        color: var(--magazine-cover-text-color);
      }
      #action {
        color: var(--magazine-cover-text-color);
        text-transform: none;
        font-size: 1.5em;
        font-style: italic;
        font-weight: bold;
        background-color: #000000;
        border: 1px solid var(--magazine-cover-text-color);
        border-radius: .5em;
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
        border-radius: .5em;
      }
      #icon {
        width: 1.2em;
        height: 1.2em;
        font-size: 1.2em;
        margin-left: .5em;
      }
      #label {
        text-shadow: -1px 1px 2px #000000;
      }
      @media screen and (max-width: 900px) {
        #header {
          font-size: 2em;
        }
        #subheader {
          font-size: 1em;
        }
        #body {
          font-size: 1em;
        }
        #action {
          font-size: 1.2em;
        }
      }
      @media screen and (max-width: 650px) {
        #body {
          font-size: .8em;
        }
        #action {
          font-size: 1em;
        }
        .overlay {
          margin: -50vh 0 0 0;
          padding: 1em;
        }
      }      
    </style>
    <iron-image src="[[image]]" preload="" fade="" sizing="cover" id="image"></iron-image>
    <div class="overlay">
      <h2 id="header" hidden\$="[[!header]]">[[header]]</h2>
      <div id="subheader" hidden\$="[[!subheader]]">[[subheader]]</div>
      <div id="body">
        <p hidden\$="[[!text]]">[[text]]</p>
        <slot></slot>
      </div>
      <a tabindex="-1" href\$="[[link]]" id="actionlink">
        <paper-button raised="" id="action">
        <span id="label">[[action]]<iron-icon id="icon" icon="[[icon]]" hidden\$="[[!icon]]"></iron-icon></span>
        </paper-button>
      </a>
    </div>
`,

  is: "magazine-cover",

  listeners: {
    "actionlink.tap": "_linkTapped"
  },

  behaviors: [HAXBehaviors.PropertiesBehaviors],

  properties: {
    /**
     * Title / heading
     */
    header: {
      type: String
    },
    /**
     * A secondary title
     */
    subheader: {
      type: String
    },
    /**
     * Internal text.
     */
    text: {
      type: String
    },
    /**
     * Title / heading
     */
    image: {
      type: String
    },
    /**
     * Call to action
     */
    action: {
      type: String,
      value: "Touch to learn more"
    },
    /**
     * Call to action icon
     */
    icon: {
      type: String,
      value: "trending-flat"
    },
    /**
     * Link to go to on click.
     */
    link: {
      type: String,
      value: ""
    },
    /**
     * Optional event binding for the button press.
     */
    eventName: {
      type: String,
      value: ""
    },
    /**
     * Optional event data to send along
     */
    eventData: {
      type: Object,
      value: {}
    }
  },

  /**
   * Link tap, fire event if we have one
   */
  _linkTapped: function(e) {
    if (this.eventName !== "") {
      e.preventDefault();
      e.stopPropagation();
      this.fire(this.eventName, this.eventData);
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
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "image",
            title: "Image",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            property: "link",
            title: "Link",
            description: "The URL for the action.",
            inputMethod: "textfield",
            icon: "send",
            required: true,
            validationType: "url"
          },
          {
            property: "header",
            title: "Header",
            description: "Primary header",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true
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
            required: true,
            validationType: "url"
          },
          {
            property: "header",
            title: "Header",
            description: "Primary header",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true
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
