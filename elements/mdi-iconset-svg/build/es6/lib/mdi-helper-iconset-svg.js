var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<iron-iconset-svg name="mdi-helper" size="24">
  <svg>

    <g id="color-helper">
      <path d="M0,24H24V20H0V24Z"></path>
    </g>

  </svg>
</iron-iconset-svg>`;
document.head.appendChild($_documentContainer);
