import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<iron-iconset-svg name="editable-table" size="24">
<svg><defs>
<g id="filter"><path d="M5,7l7,7,7-7Z"></path><rect x="11" y="13" width="2" height="4"></rect></g>        
<g id="filter-off"><polygon points="19.26 6.95 10.7 6.95 14.98 11.23 19.26 6.95"></polygon><polygon points="5 4.92 7.03 6.95 5.26 6.95 11.26 12.95 11.26 16.95 13.26 16.95 13.26 13.18 17.57 17.49 18.49 16.57 5.92 4 5 4.92"></polygon></g>
<g id="sortable"><path d="M7,13l5,5l5-5H7z M17,11l-5-5l-5,5H17z"></path></g>
</defs></svg>
</iron-iconset-svg>`;
document.head.appendChild($_documentContainer);
