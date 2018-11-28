define([
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js",
  "../node_modules/@polymer/polymer/lib/utils/html-tag.js"
], function(_ironIcon, _ironIconsetSvg, _htmlTag) {
  "use strict";
  function _templateObject_b02a4c00f32d11e892cde59bc435fe90() {
    var data = babelHelpers.taggedTemplateLiteral([
      '<iron-iconset-svg name="mdi-auth" size="24">\n  <svg>\n\n    <g id="login">\n      <path d="M10,17.25V14H3V10H10V6.75L15.25,12L10,17.25M8,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H8A2,2 0 0,1 6,20V16H8V20H17V4H8V8H6V4A2,2 0 0,1 8,2Z"></path>\n    </g>\n\n  </svg>\n</iron-iconset-svg>'
    ]);
    _templateObject_b02a4c00f32d11e892cde59bc435fe90 = function _templateObject_b02a4c00f32d11e892cde59bc435fe90() {
      return data;
    };
    return data;
  }
  var template = (0, _htmlTag.html)(
    _templateObject_b02a4c00f32d11e892cde59bc435fe90()
  );
  document.head.appendChild(template.content);
});
