var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML =
  '<dom-module id="materializecss-styles-shapes">\n  <template>\n    <custom-style>\n    <style is="custom-style">\n    .circle {\n      border-radius: 50%;\n    }\n    </style>\n    </custom-style>\n  </template>\n</dom-module>';
document.head.appendChild($_documentContainer);
