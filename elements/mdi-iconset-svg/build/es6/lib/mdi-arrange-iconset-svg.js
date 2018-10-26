var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<iron-iconset-svg name="mdi-arrange" size="24">
  <svg>

    <g id="arrange-bring-forward">
      <path d="M2,2H16V16H2V2M22,8V22H8V18H10V20H20V10H18V8H22Z"></path>
    </g>

    <g id="arrange-bring-to-front">
      <path d="M2,2H11V6H9V4H4V9H6V11H2V2M22,13V22H13V18H15V20H20V15H18V13H22M8,8H16V16H8V8Z"></path>
    </g>

    <g id="arrange-send-backward">
      <path d="M2,2H16V16H2V2M22,8V22H8V18H18V8H22M4,4V14H14V4H4Z"></path>
    </g>

    <g id="arrange-send-to-back">
      <path d="M2,2H11V11H2V2M9,4H4V9H9V4M22,13V22H13V13H22M15,20H20V15H15V20M16,8V11H13V8H16M11,16H8V13H11V16Z"></path>
    </g>

    <g id="flip-to-back">
      <path d="M15,17H17V15H15M15,5H17V3H15M5,7H3V19A2,2 0 0,0 5,21H17V19H5M19,17A2,2 0 0,0 21,15H19M19,9H21V7H19M19,13H21V11H19M9,17V15H7A2,2 0 0,0 9,17M13,3H11V5H13M19,3V5H21C21,3.89 20.1,3 19,3M13,15H11V17H13M9,3C7.89,3 7,3.89 7,5H9M9,11H7V13H9M9,7H7V9H9V7Z"></path>
    </g>

    <g id="flip-to-front">
      <path d="M7,21H9V19H7M11,21H13V19H11M19,15H9V5H19M19,3H9C7.89,3 7,3.89 7,5V15A2,2 0 0,0 9,17H14L18,17H19A2,2 0 0,0 21,15V5C21,3.89 20.1,3 19,3M15,21H17V19H15M3,9H5V7H3M5,21V19H3A2,2 0 0,0 5,21M3,17H5V15H3M3,13H5V11H3V13Z"></path>
    </g>


  </svg>
</iron-iconset-svg>`;
document.head.appendChild($_documentContainer);
