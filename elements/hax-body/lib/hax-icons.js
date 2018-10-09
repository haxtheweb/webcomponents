import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
const $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<iron-iconset-svg size="24" name="hax">
    <svg>
        <g id="12" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="24" height="100%"></rect>
        </g>  
        <g id="8/4" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="16" height="100%"></rect>
          <rect x="18" y="0" width="6" height="100%"></rect>
        </g>
        <g id="6/6" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="11" height="100%"></rect>
          <rect x="12" y="0" width="11" height="100%"></rect>
        </g>
        <g id="4/8" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="6" height="100%"></rect>
          <rect x="8" y="0" width="16" height="100%"></rect>
        </g>
        <g id="4/4/4" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="7" height="100%"></rect>
          <rect x="8" y="0" width="7" height="100%"></rect>
          <rect x="16" y="0" width="7" height="100%"></rect>
        </g>
        <g id="3/3/3/3" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="5" height="100%"></rect>
          <rect x="6" y="0" width="5" height="100%"></rect>
          <rect x="12" y="0" width="5" height="100%"></rect>
          <rect x="18" y="0" width="5" height="100%"></rect>
        </g>
    </svg>
</iron-iconset-svg>`;

document.head.appendChild($_documentContainer);
