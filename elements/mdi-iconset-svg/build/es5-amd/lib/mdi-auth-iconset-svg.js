var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML =
  '<iron-iconset-svg name="mdi-auth" size="24">\n  <svg>\n\n    <g id="login">\n      <path d="M10,17.25V14H3V10H10V6.75L15.25,12L10,17.25M8,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H8A2,2 0 0,1 6,20V16H8V20H17V4H8V8H6V4A2,2 0 0,1 8,2Z"></path>\n    </g>\n\n  </svg>\n</iron-iconset-svg>';
document.head.appendChild($_documentContainer);
