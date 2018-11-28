define([
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js",
  "../node_modules/@polymer/polymer/lib/utils/html-tag.js"
], function(_ironIcon, _ironIconsetSvg, _htmlTag) {
  "use strict";
  function _templateObject_b0aa0350f32d11e892cde59bc435fe90() {
    var data = babelHelpers.taggedTemplateLiteral([
      '<iron-iconset-svg name="mdi-error" size="24">\n  <svg>\n\n    <g id="alert">\n      <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"></path>\n    </g>\n\n  </svg>\n</iron-iconset-svg>'
    ]);
    _templateObject_b0aa0350f32d11e892cde59bc435fe90 = function _templateObject_b0aa0350f32d11e892cde59bc435fe90() {
      return data;
    };
    return data;
  }
  var template = (0, _htmlTag.html)(
    _templateObject_b0aa0350f32d11e892cde59bc435fe90()
  );
  document.head.appendChild(template.content);
});
