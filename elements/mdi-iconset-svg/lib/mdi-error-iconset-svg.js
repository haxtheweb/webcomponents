var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<iron-iconset-svg name="mdi-error" size="24">
  <svg>

    <g id="alert">
      <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"></path>
    </g>

  </svg>
</iron-iconset-svg>`;

document.head.appendChild($_documentContainer);

/**
Material design: [Icons](https://material.io/guidelines/style/icons.html)

`mdi-error-iconset-svg` is a iconset for the Material Design Icons collection with the "error" tag

Example:

    <iron-icon icon="mdi-error:alert"></iron-icon>

@demo demo/index.html
*/
