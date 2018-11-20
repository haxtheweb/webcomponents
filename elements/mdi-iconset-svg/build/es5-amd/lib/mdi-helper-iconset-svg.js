define([
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js",
  "../node_modules/@polymer/polymer/lib/utils/html-tag.js"
], function(_ironIcon, _ironIconsetSvg, _htmlTag) {
  "use strict";
  function _templateObject_0a3abdb0ecf311e8a4a04d64ce82e450() {
    var data = babelHelpers.taggedTemplateLiteral([
      '<iron-iconset-svg name="mdi-helper" size="24">\n  <svg>\n\n    <g id="color-helper">\n      <path d="M0,24H24V20H0V24Z"></path>\n    </g>\n\n  </svg>\n</iron-iconset-svg>'
    ]);
    _templateObject_0a3abdb0ecf311e8a4a04d64ce82e450 = function() {
      return data;
    };
    return data;
  }
  var template = (0, _htmlTag.html)(
    _templateObject_0a3abdb0ecf311e8a4a04d64ce82e450()
  );
  document.head.appendChild(template.content);
});
