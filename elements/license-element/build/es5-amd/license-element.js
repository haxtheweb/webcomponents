define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_94f5d620ecf211e88e5d9b3e44b3a814() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        line-height: 32px;\n        --license-text-color: #222222;\n        --license-background-color: #F2F2F2;\n        background-color: var(--license-background-color);\n      }\n      :host:after {\n        content: \'License\';\n        position: relative;\n        float: right;\n        bottom: 36px;\n        right: 8px;\n        font-size: 28px;\n        color: #DDDDDD;\n        font-style: italic;\n      }\n      .license-body {\n        padding: 32px;\n        font-style: italic;\n        background-color: var(--license-background-color);\n        color: var(--license-text-color);\n        @apply --license-body;\n      }\n\n      :host([display-method="footnote"]) {\n        visibility: hidden;\n        opacity: 0;\n      }\n      :host([display-method="popup"]) {\n        display: block;\n      }\n      .license-link {\n        font-style: italic;\n        @apply --license-link;\n      }\n      .big-license-link img {\n        margin-right: 8px;\n        margin-bottom: 8px;\n        width: 88px;\n        height: 31px;\n        vertical-align: middle;\n      }\n      .work-title {\n        font-weight: bold;\n      }\n    </style>\n    <meta rel="cc:license" href$="[[licenseLink]]" content$="License: [[licenseName]]">\n    <div class="license-body" xmlns:cc$="[[licenseLink]]" xmlns:dc="http://purl.org/dc/elements/1.1/">\n      <a class="big-license-link" target="_blank" href="[[licenseLink]]"><img alt="[[licenseName]] graphic" src="[[licenseImage]]" hidden$="[[!licenseImage]]"></a>\n        <span class="work-title" rel="dc:type" href="http://purl.org/dc/dcmitype/Text" property="dc:title">[[title]]</span> by <a rel="cc:attributionURL" property="cc:attributionName" href$="[[source]]">[[creator]]</a> is licensed under a <a class="license-link" target="_blank" href="[[licenseLink]]">[[licenseName]]</a>.\n        <span rel="dc:source" href$="[[source]]"></span>\n\n        <template is="dom-if" if="[[hasMore]]">\n          <span>Permissions beyond the scope of this license are available <a rel="cc:morePermissions" target="_blank" href="[[moreLink]]">[[moreLabel]]</a>.</span>\n        </template>\n    </div>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        line-height: 32px;\n        --license-text-color: #222222;\n        --license-background-color: #F2F2F2;\n        background-color: var(--license-background-color);\n      }\n      :host:after {\n        content: \'License\';\n        position: relative;\n        float: right;\n        bottom: 36px;\n        right: 8px;\n        font-size: 28px;\n        color: #DDDDDD;\n        font-style: italic;\n      }\n      .license-body {\n        padding: 32px;\n        font-style: italic;\n        background-color: var(--license-background-color);\n        color: var(--license-text-color);\n        @apply --license-body;\n      }\n\n      :host([display-method="footnote"]) {\n        visibility: hidden;\n        opacity: 0;\n      }\n      :host([display-method="popup"]) {\n        display: block;\n      }\n      .license-link {\n        font-style: italic;\n        @apply --license-link;\n      }\n      .big-license-link img {\n        margin-right: 8px;\n        margin-bottom: 8px;\n        width: 88px;\n        height: 31px;\n        vertical-align: middle;\n      }\n      .work-title {\n        font-weight: bold;\n      }\n    </style>\n    <meta rel="cc:license" href\\$="[[licenseLink]]" content\\$="License: [[licenseName]]">\n    <div class="license-body" xmlns:cc\\$="[[licenseLink]]" xmlns:dc="http://purl.org/dc/elements/1.1/">\n      <a class="big-license-link" target="_blank" href="[[licenseLink]]"><img alt="[[licenseName]] graphic" src="[[licenseImage]]" hidden\\$="[[!licenseImage]]"></a>\n        <span class="work-title" rel="dc:type" href="http://purl.org/dc/dcmitype/Text" property="dc:title">[[title]]</span> by <a rel="cc:attributionURL" property="cc:attributionName" href\\$="[[source]]">[[creator]]</a> is licensed under a <a class="license-link" target="_blank" href="[[licenseLink]]">[[licenseName]]</a>.\n        <span rel="dc:source" href\\$="[[source]]"></span>\n\n        <template is="dom-if" if="[[hasMore]]">\n          <span>Permissions beyond the scope of this license are available <a rel="cc:morePermissions" target="_blank" href="[[moreLink]]">[[moreLabel]]</a>.</span>\n        </template>\n    </div>\n'
      ]
    );
    _templateObject_94f5d620ecf211e88e5d9b3e44b3a814 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_94f5d620ecf211e88e5d9b3e44b3a814()
    ),
    is: "license-element",
    behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
    properties: {
      title: { type: String },
      creator: { type: String },
      source: { type: String },
      licenseName: { type: String },
      licenseLink: { type: String },
      license: { type: String, observer: "_licenseUpdated" },
      moreLabel: { type: String, value: "on the licensing details page" },
      moreLink: { type: String },
      hasMore: { type: Boolean, computed: "_computeHasMore(moreLink)" }
    },
    attached: function attached() {
      var props = {
        canScale: !1,
        canPosition: !1,
        canEditSource: !1,
        gizmo: {
          title: "License",
          description: "Provide a license for you rwork",
          icon: "icons:theaters",
          color: "grey",
          groups: ["Content", "Copyright"],
          handles: [
            {
              type: "license",
              source: "source",
              title: "title",
              author: "creator",
              license: "license"
            },
            { type: "inline", text: "title" }
          ],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [
            {
              property: "title",
              title: "Title",
              description: "The title of the work being cited.",
              inputMethod: "textfield",
              icon: "editor:title"
            }
          ],
          configure: [
            {
              property: "title",
              title: "Title",
              description: "The title of the work being cited.",
              inputMethod: "textfield",
              icon: "editor:title"
            },
            {
              property: "source",
              title: "Source link",
              description: "The source url for the element this is citing.",
              inputMethod: "textfield",
              icon: "link",
              validationType: "url"
            },
            {
              property: "license",
              title: "License",
              description: "The source url for the element this is citing.",
              inputMethod: "select",
              options: this.licenseList("select"),
              icon: "link"
            },
            {
              property: "creator",
              title: "Creator",
              description: "Who made or owns this.",
              inputMethod: "textfield",
              icon: "link"
            }
          ],
          advanced: [
            {
              property: "moreLink",
              title: "Source link",
              description: "Link to additional licensing details",
              inputMethod: "textfield",
              validationType: "url"
            },
            {
              property: "moreLabel",
              title: "more label",
              description: "Label for more licensing details",
              inputMethod: "textfield"
            }
          ]
        }
      };
      this.setHaxProperties(props);
    },
    _computeHasMore: function _computeHasMore(link) {
      if (babelHelpers.typeof(link) !== "undefined" && "" !== link) {
        return !0;
      }
      return !1;
    },
    licenseList: function licenseList() {
      var mode =
          0 < arguments.length && arguments[0] !== void 0
            ? arguments[0]
            : "full",
        list = {
          by: {
            name: "Creative Commons: Attribution",
            link: "https://creativecommons.org/licenses/by/4.0/",
            image: "https://i.creativecommons.org/l/by/4.0/88x31.png"
          },
          "by-sa": {
            name: "Creative Commons: Attribution Share a like",
            link: "https://creativecommons.org/licenses/by-sa/4.0/",
            image: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
          },
          "by-nd": {
            name: "Creative Commons: Attribution No derivatives",
            link: "https://creativecommons.org/licenses/by-nd/4.0/",
            image: "https://i.creativecommons.org/l/by-nd/4.0/88x31.png"
          },
          "by-nc": {
            name: "Creative Commons: Attribution non-commercial",
            link: "https://creativecommons.org/licenses/by-nc/4.0/",
            image: "https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
          },
          "by-nc-sa": {
            name: "Creative Commons: Attribution non-commercial share a like",
            link: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
            image: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
          },
          "by-nc-nd": {
            name: "Creative Commons: Attribution Non-commercial No derivatives",
            link: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
            image: "https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
          }
        };
      if ("select" == mode) {
        var select = {};
        for (var i in list) {
          select[i] = list[i].name;
        }
        return select;
      }
      return list;
    },
    _licenseUpdated: function _licenseUpdated(newValue) {
      if (babelHelpers.typeof(newValue) !== "undefined") {
        var list = this.licenseList();
        if (babelHelpers.typeof(list[newValue]) !== "undefined") {
          this.licenseName = list[newValue].name;
          this.licenseLink = list[newValue].link;
          this.licenseImage = list[newValue].image;
        }
      }
    }
  });
});
