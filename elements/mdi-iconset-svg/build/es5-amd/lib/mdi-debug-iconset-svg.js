define([
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js",
  "../node_modules/@polymer/polymer/lib/utils/html-tag.js"
], function(_ironIcon, _ironIconsetSvg, _htmlTag) {
  "use strict";
  function _templateObject_aaf19070e11911e8b3139dad2b8fc394() {
    var data = babelHelpers.taggedTemplateLiteral([
      '<iron-iconset-svg name="mdi-debug" size="24">\n  <svg>\n\n    <g id="debug-step-into">\n      <path d="M12,22A2,2 0 0,1 10,20A2,2 0 0,1 12,18A2,2 0 0,1 14,20A2,2 0 0,1 12,22M13,2V13L17.5,8.5L18.92,9.92L12,16.84L5.08,9.92L6.5,8.5L11,13V2H13Z"></path>\n    </g>\n\n    <g id="debug-step-out">\n      <path d="M12,22A2,2 0 0,1 10,20A2,2 0 0,1 12,18A2,2 0 0,1 14,20A2,2 0 0,1 12,22M13,16H11V6L6.5,10.5L5.08,9.08L12,2.16L18.92,9.08L17.5,10.5L13,6V16Z"></path>\n    </g>\n\n    <g id="debug-step-over">\n      <path d="M12,14A2,2 0 0,1 14,16A2,2 0 0,1 12,18A2,2 0 0,1 10,16A2,2 0 0,1 12,14M23.46,8.86L21.87,15.75L15,14.16L18.8,11.78C17.39,9.5 14.87,8 12,8C8.05,8 4.77,10.86 4.12,14.63L2.15,14.28C2.96,9.58 7.06,6 12,6C15.58,6 18.73,7.89 20.5,10.72L23.46,8.86Z"></path>\n    </g>\n\n    <g id="pause-octagon">\n      <path d="M15.73,3L21,8.27V15.73L15.73,21H8.27L3,15.73V8.27L8.27,3H15.73M15,16V8H13V16H15M11,16V8H9V16H11Z"></path>\n    </g>\n\n    <g id="pause-octagon-outline">\n      <path d="M15,16H13V8H15V16M11,16H9V8H11V16M15.73,3L21,8.27V15.73L15.73,21H8.27L3,15.73V8.27L8.27,3H15.73M14.9,5H9.1L5,9.1V14.9L9.1,19H14.9L19,14.9V9.1L14.9,5Z"></path>\n    </g>\n\n  </svg>\n</iron-iconset-svg>'
    ]);
    _templateObject_aaf19070e11911e8b3139dad2b8fc394 = function() {
      return data;
    };
    return data;
  }
  var template = (0, _htmlTag.html)(
    _templateObject_aaf19070e11911e8b3139dad2b8fc394()
  );
  document.head.appendChild(template.content);
});
