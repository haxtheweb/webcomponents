define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/iron-image/iron-image.js",
  "./node_modules/@polymer/iron-icons/iron-icons.js",
  "./node_modules/@polymer/iron-icon/iron-icon.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(
  _polymerLegacy,
  _ironImage,
  _ironIcons,
  _ironIcon,
  _paperButton,
  _HAXWiring
) {
  "use strict";
  function _templateObject_8fd8e040f1e511e8a0915bb6997f7cc5() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        background-color: #222222;\n        overflow: hidden;\n        --magazine-cover-text-color: #EEEEEE;\n      }\n      .overlay {\n        left: 0;\n        right: 0;\n        min-height: 30vh;\n        margin: -38vh 0 0 0;\n        background-color:rgba(0, 0, 0, 0.8);\n        padding: 32px;\n        position: relative;\n      }\n      #image {\n        opacity: .5;\n        filter: alpha(opacity=50);\n        transition: opacity 0.3s linear;\n        width:100%;\n        height:80vh;\n        background-color: #222222;\n        @apply --magazine-cover-image;\n      }\n      #image:hover {\n        opacity: .9;\n        filter: alpha(opacity=90);\n      }\n      #header {\n        color: var(--magazine-cover-text-color);\n        font-size: 48px;\n        padding: 0;\n        margin: 0;\n        font-weight: bold;\n      }\n      #subheader {\n        color: var(--magazine-cover-text-color);\n        font-size: 22.4px;\n        padding: 0;\n        margin: 3.2px 0 16px 0;\n        font-style: italic;\n        font-weight: normal;\n      }\n      #body {\n        color: var(--magazine-cover-text-color);\n        padding: 0;\n        margin: 0;\n        font-size: 19.2px;\n        padding: 0 0 0 3.2px;\n        margin: 0 0 32px 0;\n      }\n      #body p {\n        color: var(--magazine-cover-text-color);\n      }\n      #action {\n        color: var(--magazine-cover-text-color);\n        text-transform: none;\n        font-size: 24px;\n        font-style: italic;\n        font-weight: bold;\n        background-color: #000000;\n        border: 1px solid var(--magazine-cover-text-color);\n        border-radius: 8px;\n        transition: background 0.3s linear;\n        width: 100%;\n        margin: 0;\n      }\n      #action:hover,#action:focus {\n        border-color: #FFFFFF;\n        color: #FFFFFF;\n        background-color:rgba(255, 255, 255, 0.2);\n      }\n      #actionlink {\n        color: var(--magazine-cover-text-color);\n        display: flex;\n        text-decoration: none;\n        border-radius: 8px;\n      }\n      #icon {\n        display: inline-block;\n        width: 19.2px;\n        height: 19.2px;\n        font-size: 19.2px;\n        margin-left: 8px;\n      }\n      #label {\n        text-shadow: -1px 1px 2px #000000;\n      }\n      @media screen and (max-width: 900px) {\n        #header {\n          font-size: 32px;\n        }\n        #subheader {\n          font-size: 16px;\n        }\n        #body {\n          font-size: 16px;\n        }\n        #action {\n          font-size: 19.2px;\n        }\n      }\n      @media screen and (max-width: 650px) {\n        #body {\n          font-size: 12.8px;\n        }\n        #action {\n          font-size: 16px;\n        }\n        .overlay {\n          margin: -50vh 0 0 0;\n          padding: 16px;\n        }\n      }      \n    </style>\n    <iron-image src="[[image]]" preload="" fade="" sizing="cover" id="image"></iron-image>\n    <div class="overlay">\n      <h2 id="header" hidden$="[[!header]]">[[header]]</h2>\n      <div id="subheader" hidden$="[[!subheader]]">[[subheader]]</div>\n      <div id="body">\n        <p hidden$="[[!text]]">[[text]]</p>\n        <slot></slot>\n      </div>\n      <a tabindex="-1" href$="[[link]]" id="actionlink" on-tap="_linkTapped">\n        <paper-button raised="" id="action">\n        <span id="label">[[action]]<iron-icon id="icon" icon="[[icon]]" hidden$="[[!icon]]"></iron-icon></span>\n        </paper-button>\n      </a>\n    </div>\n'
    ]);
    _templateObject_8fd8e040f1e511e8a0915bb6997f7cc5 = function _templateObject_8fd8e040f1e511e8a0915bb6997f7cc5() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8fd8e040f1e511e8a0915bb6997f7cc5()
    ),
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
    _linkTapped: function _linkTapped(e) {
      if ("" !== this.eventName) {
        e.preventDefault();
        e.stopPropagation();
        this.fire(this.eventName, this.eventData);
      }
    },
    attached: function attached() {
      var props = {
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
});
