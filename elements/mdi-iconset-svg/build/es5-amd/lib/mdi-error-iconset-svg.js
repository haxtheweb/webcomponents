define([
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js",
  "../node_modules/@polymer/polymer/lib/utils/html-tag.js"
], function(_ironIcon, _ironIconsetSvg, _htmlTag) {
  "use strict";
  function _templateObject_aafed6e0e11911e8b3139dad2b8fc394() {
    var data = babelHelpers.taggedTemplateLiteral([
      '<iron-iconset-svg name="mdi-error" size="24">\n  <svg>\n\n    <g id="alert">\n      <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"></path>\n    </g>\n\n  </svg>\n</iron-iconset-svg>'
    ]);
    _templateObject_aafed6e0e11911e8b3139dad2b8fc394 = function() {
      return data;
    };
    return data;
  }
  var template = (0, _htmlTag.html)(
    _templateObject_aafed6e0e11911e8b3139dad2b8fc394()
  );
  document.head.appendChild(template.content);
});
