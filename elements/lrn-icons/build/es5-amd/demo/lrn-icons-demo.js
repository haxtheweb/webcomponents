define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../lrn-icons.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_e9438570ecf111e8a73927e2dd95a29e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n  <ul>\n  <template is="dom-repeat" items="[[iconList]]">\n    <li>\n    <iron-icon icon$="lrn:[[item.icon]]"></iron-icon>\n    <strong>&lt;iron-icon icon="lrn:[[item.icon]]"&gt;</strong>\n    </li>\n  </template>\n  </ul>\n'
      ],
      [
        '\n  <ul>\n  <template is="dom-repeat" items="[[iconList]]">\n    <li>\n    <iron-icon icon\\$="lrn:[[item.icon]]"></iron-icon>\n    <strong>&lt;iron-icon icon="lrn:[[item.icon]]"&gt;</strong>\n    </li>\n  </template>\n  </ul>\n'
      ]
    );
    _templateObject_e9438570ecf111e8a73927e2dd95a29e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e9438570ecf111e8a73927e2dd95a29e()
    ),
    is: "lrn-icons-demo",
    ready: function ready() {
      this.iconList = [
        { icon: "done" },
        { icon: "input" },
        { icon: "about" },
        { icon: "add" },
        { icon: "plus" },
        { icon: "apps" },
        { icon: "network" },
        { icon: "arrow-left" },
        { icon: "arrow-right" },
        { icon: "assignment" },
        { icon: "assignments" },
        { icon: "assessment" },
        { icon: "lab" },
        { icon: "labs" },
        { icon: "beaker" },
        { icon: "blog" },
        { icon: "blogs" },
        { icon: "editorial" },
        { icon: "write" },
        { icon: "bookmark" },
        { icon: "bookmark-outline" },
        { icon: "calendar" },
        { icon: "chevron-down" },
        { icon: "chevron-left" },
        { icon: "chevron-right" },
        { icon: "online" },
        { icon: "cis" },
        { icon: "studio" },
        { icon: "cle" },
        { icon: "close" },
        { icon: "collab" },
        { icon: "comment" },
        { icon: "comply" },
        { icon: "ecd" },
        { icon: "mooc" },
        { icon: "content-outline" },
        { icon: "book" },
        { icon: "courses" },
        { icon: "content" },
        { icon: "dino" },
        { icon: "discuss" },
        { icon: "speechballoons" },
        { icon: "dotgrid" },
        { icon: "download" },
        { icon: "file-download" },
        { icon: "edit" },
        { icon: "media" },
        { icon: "elmsmedia" },
        { icon: "play" },
        { icon: "replay" },
        { icon: "gear" },
        { icon: "settings" },
        { icon: "grades" },
        { icon: "help" },
        { icon: "tour" },
        { icon: "view" },
        { icon: "visible" },
        { icon: "hidden" },
        { icon: "view-off" },
        { icon: "interact" },
        { icon: "icor" },
        { icon: "inbox" },
        { icon: "letter" },
        { icon: "info" },
        { icon: "page" },
        { icon: "pdf" },
        { icon: "people" },
        { icon: "cpr" },
        { icon: "user" },
        { icon: "quiz" },
        { icon: "support" },
        { icon: "teacher" },
        { icon: "instructor" }
      ];
    }
  });
});
