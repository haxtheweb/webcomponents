var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML =
  '<dom-module id="paper-contact-shared-styles">\n\t<template>\n\t\t<style>\n\t\t\t:host {\n\t\t\t\t@apply --layout-vertical;\n\t\t\t}\n\n\t\t\t.item {\n\t\t\t\tcursor: pointer;\n\t\t\t}\n\n\t\t\t.icon {\n\t\t\t\tcolor: var(--disabled-text-color);\n\t\t\t}\n\n\t\t\t.text {\n\t\t\t\tpadding-top: 14px;\n\t\t\t\tpadding-bottom: 14px;\n\t\t\t\twhite-space: pre-wrap;\n\t\t\t\t@apply --paper-font-body1;\n\t\t\t}\n\t\t</style>\n\t</template>\n</dom-module>';
document.head.appendChild($_documentContainer);
