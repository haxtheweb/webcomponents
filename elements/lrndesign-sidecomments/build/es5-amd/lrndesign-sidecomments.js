define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./lib/side-comments.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_161b5bf0dbb711e88319274610fd77ba() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n       :host {\n        display: block;\n      }\n    </style>\n    <div id="commentable-area">\n      <p data-section-id="1" class="commentable-section">\n        This is a section that can be commented on.\n        This is a section that can be commented on.\n        This is a section that can be commented on.\n        This is a section that can be commented on.\n        This is a section that can be commented on.\n        This is a section that can be commented on.\n      </p>\n      <p data-section-id="2" class="commentable-section">\n        This is a another section that can be commented on.\n        This is a another section that can be commented on.\n        This is a another section that can be commented on.\n        This is a another section that can be commented on.\n        This is a another section that can be commented on.\n        This is a another section that can be commented on.\n        This is a another section that can be commented on.\n      </p>\n      <p data-section-id="3" class="commentable-section">\n        This is yet another section that can be commented on.\n        This is yet another section that can be commented on.\n        This is yet another section that can be commented on.\n        This is yet another section that can be commented on.\n        This is yet another section that can be commented on.\n      </p>\n    </div>\n'
    ]);
    _templateObject_161b5bf0dbb711e88319274610fd77ba = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_161b5bf0dbb711e88319274610fd77ba()
    ),
    is: "lrndesign-sidecomments",
    properties: { title: { type: String, value: "lrndesign-sidecomments" } },
    ready: function ready() {
      var SideComments = require("side-comments"),
        target = this.shadowRoot.querySelector("#commentable-area");
      sideComments = new SideComments(
        target,
        {
          id: 1,
          avatarUrl:
            "http://f.cl.ly/items/0s1a0q1y2Z2k2I193k1y/default-user.png",
          name: "You"
        },
        [
          {
            sectionId: "1",
            comments: [
              {
                authorAvatarUrl:
                  "http://f.cl.ly/items/1W303Y360b260u3v1P0T/jon_snow_small.png",
                authorName: "Jon Sno",
                comment: "I'm Ned Stark's bastard. Related: I know nothing."
              },
              {
                authorAvatarUrl:
                  "http://f.cl.ly/items/2o1a3d2f051L0V0q1p19/donald_draper.png",
                authorName: "Donald Draper",
                comment: "I need a scotch."
              }
            ]
          },
          {
            sectionId: "3",
            comments: [
              {
                authorAvatarUrl:
                  "http://f.cl.ly/items/0l1j230k080S0N1P0M3e/clay-davis.png",
                authorName: "Senator Clay Davis",
                comment:
                  "These Side Comments are incredible. Sssshhhiiiiieeeee."
              }
            ]
          }
        ]
      );
    }
  });
});
