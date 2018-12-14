var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="materializecss-styles-shapes">
  <template>
    <custom-style>
    <style is="custom-style">
    .circle {
      border-radius: 50%;
    }
    </style>
    </custom-style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);

/**
`materializecss-styles`
Some styling helpers from the materializecss project

* @demo demo/index.html
*/
