var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<iron-iconset-svg name="mdi-vector" size="24">
  <svg>

    <g id="vector-square">
      <path d="M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z"></path>
    </g>

  </svg>
</iron-iconset-svg>`;

document.head.appendChild($_documentContainer);

/**
Material design: [Icons](https://material.io/guidelines/style/icons.html)

`mdi-vector-iconset-svg` is a iconset for the Material Design Icons collection with the "vector" tag

Example:

    <iron-icon icon="mdi-vector:vector-square"></iron-icon>

@demo demo/index.html
*/
