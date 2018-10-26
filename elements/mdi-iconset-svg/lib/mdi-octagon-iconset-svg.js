var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<iron-iconset-svg name="mdi-octagon" size="24">
  <svg>

    <g id="pause-octagon">
      <path d="M15.73,3L21,8.27V15.73L15.73,21H8.27L3,15.73V8.27L8.27,3H15.73M15,16V8H13V16H15M11,16V8H9V16H11Z"></path>
    </g>

    <g id="pause-octagon-outline">
      <path d="M15,16H13V8H15V16M11,16H9V8H11V16M15.73,3L21,8.27V15.73L15.73,21H8.27L3,15.73V8.27L8.27,3H15.73M14.9,5H9.1L5,9.1V14.9L9.1,19H14.9L19,14.9V9.1L14.9,5Z"></path>
    </g>

  </svg>
</iron-iconset-svg>`;

document.head.appendChild($_documentContainer);

/**
Material design: [Icons](https://material.io/guidelines/style/icons.html)

`mdi-octagon-iconset-svg` is a iconset for the Material Design Icons collection with the "octagon" tag

Example:

    <iron-icon icon="mdi-octagon:pause-octagon"></iron-icon>

@demo demo/index.html
*/
