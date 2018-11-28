define([
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js"
], function(_ironIcon, _ironIconsetSvg) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<iron-iconset-svg size="24" name="persontestimonial">\n<svg><defs>\n<g id="format-quote"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path></g>\n</defs></svg>\n</iron-iconset-svg>';
  document.head.appendChild($_documentContainer);
});
