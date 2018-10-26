var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML =
  '<iron-iconset-svg name="mdi-helper" size="24">\n  <svg>\n\n    <g id="color-helper">\n      <path d="M0,24H24V20H0V24Z"></path>\n    </g>\n\n  </svg>\n</iron-iconset-svg>';
document.head.appendChild($_documentContainer);
