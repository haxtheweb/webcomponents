define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@polymer/iron-image/iron-image.js",
  "./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_32ecd020e11a11e898beffa128da4aa5() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n        width: 100%;\n        min-height: 600px;\n        height: 100%;\n        max-height: 600px;\n        overflow: hidden;\n        position: relative;\n      }\n      .image {\n        position: absolute;\n        left: 0;\n        right: 0;\n      }\n      .itemwrapper {\n        position: absolute;\n        bottom: 10%;\n        left: 10%;\n        width: 50%;\n      }\n      .title {\n        background-color: rgba(0,0,0,0.5);\n        padding: 10px 16px;\n        font-size: 32px;\n        color: #FFFFFF;\n        margin: 4px 0;\n        font-family: \'Roboto\';\n        font-weight: 500;\n      }\n      .details {\n        background-color: rgba(0,0,0,0.5);\n        padding: 10px 16px;\n        font-size: 16px;\n        color: #FFFFFF;\n        margin: 4px 0;\n        font-family: \'Roboto\';\n      }\n      .linkbutton {\n        padding: 0;\n        margin: 8px 0;\n        color: #FFFFFF;\n        text-decoration: none;\n        font-family: \'Roboto\';\n      }\n      .linkbutton paper-button {\n        text-transform: none;\n        font-weight: bold;\n      }\n      @media screen and (max-width: 720px) {\n        .title {\n          font-size: 20px;\n        }\n        .details {\n          font-size: 12px;\n        }\n        .itemwrapper {\n          left: 5%;\n          width: 50%;\n        }\n      }\n      @media screen and (max-width: 500px) {\n        .title {\n          font-size: 16px;\n        }\n        .details {\n          display: none;\n        }\n        .itemwrapper {\n          left: 0;\n          width: 300px;\n        }\n      }\n\n    </style>\n    <iron-image class="image" src$="[[image]]" fade="" preload="" sizing="cover" style="background-color:grey;width: 100%;height: 100%;"></iron-image>\n    <div class="itemwrapper">\n      <div class="title">[[title]]</div>\n      <div class="details">[[details]]</div>\n      <a class="linkbutton" href$="[[buttonLink]]"><paper-button raised="" class$="[[buttonColorClass]] [[textColorClass]]">[[buttonText]]</paper-button></a>\n    </div>\n'
      ],
      [
        '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n        width: 100%;\n        min-height: 600px;\n        height: 100%;\n        max-height: 600px;\n        overflow: hidden;\n        position: relative;\n      }\n      .image {\n        position: absolute;\n        left: 0;\n        right: 0;\n      }\n      .itemwrapper {\n        position: absolute;\n        bottom: 10%;\n        left: 10%;\n        width: 50%;\n      }\n      .title {\n        background-color: rgba(0,0,0,0.5);\n        padding: 10px 16px;\n        font-size: 32px;\n        color: #FFFFFF;\n        margin: 4px 0;\n        font-family: \'Roboto\';\n        font-weight: 500;\n      }\n      .details {\n        background-color: rgba(0,0,0,0.5);\n        padding: 10px 16px;\n        font-size: 16px;\n        color: #FFFFFF;\n        margin: 4px 0;\n        font-family: \'Roboto\';\n      }\n      .linkbutton {\n        padding: 0;\n        margin: 8px 0;\n        color: #FFFFFF;\n        text-decoration: none;\n        font-family: \'Roboto\';\n      }\n      .linkbutton paper-button {\n        text-transform: none;\n        font-weight: bold;\n      }\n      @media screen and (max-width: 720px) {\n        .title {\n          font-size: 20px;\n        }\n        .details {\n          font-size: 12px;\n        }\n        .itemwrapper {\n          left: 5%;\n          width: 50%;\n        }\n      }\n      @media screen and (max-width: 500px) {\n        .title {\n          font-size: 16px;\n        }\n        .details {\n          display: none;\n        }\n        .itemwrapper {\n          left: 0;\n          width: 300px;\n        }\n      }\n\n    </style>\n    <iron-image class="image" src\\$="[[image]]" fade="" preload="" sizing="cover" style="background-color:grey;width: 100%;height: 100%;"></iron-image>\n    <div class="itemwrapper">\n      <div class="title">[[title]]</div>\n      <div class="details">[[details]]</div>\n      <a class="linkbutton" href\\$="[[buttonLink]]"><paper-button raised="" class\\$="[[buttonColorClass]] [[textColorClass]]">[[buttonText]]</paper-button></a>\n    </div>\n'
      ]
    );
    _templateObject_32ecd020e11a11e898beffa128da4aa5 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_32ecd020e11a11e898beffa128da4aa5()
    ),
    is: "hero-banner",
    behaviors: [
      HAXBehaviors.PropertiesBehaviors,
      A11yBehaviors.A11y,
      MaterializeCSSBehaviors.ColorBehaviors
    ],
    properties: {
      title: { type: String, value: "Title" },
      image: { type: String },
      details: { type: String, value: "Details" },
      buttonText: { type: String, value: "Find out more" },
      buttonColor: {
        type: String,
        value: "red darken-4",
        observer: "_buttonColorChanged"
      },
      buttonColorClass: {
        type: String,
        reflectToAttribute: !0,
        computed: "_computeColorClass(buttonColor)"
      },
      buttonLink: { type: String },
      textColor: { type: String, value: "#FFFFFF", reflectToAttribute: !0 },
      textColorClass: {
        type: String,
        value: null,
        reflectToAttribute: !0,
        computed: "_computeColorClass(textColor)"
      }
    },
    _buttonColorChanged: function _buttonColorChanged(newValue) {
      if (babelHelpers.typeof(newValue) !== "undefined" && null != newValue) {
        this.computeTextPropContrast("textColor", "buttonColor");
      }
    },
    _computeColorClass: function _computeColorClass(color) {
      if (null != color && "#ffffff" == color.toLowerCase()) {
        return "white-text";
      } else if (null != color && "#000000" == color) {
        return "black-text";
      } else if (null != color && "#" == color.substring(0, 1)) {
        return this._colorTransform(color.toLowerCase(), "", "");
      }
    },
    attached: function attached() {
      this.setHaxProperties({
        canScale: !1,
        canPosition: !1,
        canEditSource: !1,
        gizmo: {
          title: "Hero image",
          description:
            "Typically fancy banner image calling your attention to something.",
          icon: "image:panorama",
          color: "red",
          groups: ["Image", "Media"],
          handles: [
            {
              type: "image",
              source: "image",
              title: "title",
              description: "details",
              link: "buttonLink"
            }
          ],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [
            {
              property: "title",
              title: "Title",
              description: "The title of the element",
              inputMethod: "textfield",
              icon: "editor:title"
            },
            {
              property: "image",
              title: "Image",
              description: "URL of the image",
              inputMethod: "textfield",
              icon: "image:panorama"
            },
            {
              property: "details",
              title: "Details",
              description: "Additional text detail / teaser data",
              inputMethod: "textfield",
              icon: "editor:text-fields"
            },
            {
              property: "buttonText",
              title: "Button",
              description: "Label of the button",
              inputMethod: "textfield",
              icon: "icons:radio-button-unchecked"
            },
            {
              property: "buttonColor",
              title: "Button - Color",
              description: "Color of the button",
              inputMethod: "colorpicker",
              icon: "editor:format-color-fill"
            },
            {
              property: "buttonLink",
              title: "Button - Link",
              description: "Label of the button",
              inputMethod: "textfield",
              validationType: "url",
              icon: "icons:link"
            }
          ],
          configure: [
            {
              property: "title",
              title: "Title",
              description: "The title of the element",
              inputMethod: "textfield",
              icon: "editor:title"
            },
            {
              property: "image",
              title: "Image",
              description: "URL of the image",
              inputMethod: "textfield",
              icon: "image:panorama"
            },
            {
              property: "details",
              title: "Details",
              description: "Additional text detail / teaser data",
              inputMethod: "textfield",
              icon: "editor:text-fields"
            },
            {
              property: "buttonText",
              title: "Button",
              description: "Label of the button",
              inputMethod: "textfield",
              icon: "icons:radio-button-unchecked"
            },
            {
              property: "buttonColor",
              title: "Button - Color",
              description: "Color of the button",
              inputMethod: "colorpicker",
              icon: "editor:format-color-fill"
            },
            {
              property: "buttonLink",
              title: "Button - Link",
              description: "Label of the button",
              inputMethod: "textfield",
              validationType: "url",
              icon: "icons:link"
            }
          ],
          advanced: []
        }
      });
    }
  });
});
