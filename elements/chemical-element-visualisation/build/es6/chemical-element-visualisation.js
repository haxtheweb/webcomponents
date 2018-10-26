import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/neon-animation/neon-animation.js";
import "./chemical-element-visualisation.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="chemical-element-visualisation">

  <template>

    <custom-style>
      <style>

        .alkali-metal           { fill: var(--alkali-metal-primary-color, #ff8a65);           }
        .alkaline-earth-metal   { fill: var(--alkaline-earth-metal-primary-color, #ffb74d);   }
        .transition-metal       { fill: var(--transition-metal-primary-color, #ffd54f);       }
        .post-transition-metal  { fill: var(--post-transition-metal-primary-color, #dce775);  }
        .metalloid              { fill: var(--metalloid-primary-color, #aed581);              }
        .other-nonmetal         { fill: var(--other-nonmetal-primary-color, #4db6ac);         }
        .halogen                { fill: var(--halogen-primary-color, #4dd0e1);                }
        .noble-gas              { fill: var(--noble-gas-primary-color, #4fc3f7);              }
        .lanthanide             { fill: var(--lanthanide-primary-color, #9575cd);             }
        .actinide               { fill: var(--actinide-primary-color, #f06292);               }

        .ring
        {
          fill: none;
          stroke: #ddd;
        }

        .electron
        {
          fill: #888;
        }

        .electron-background
        {
          fill: #fff;
        }

        .s-group-electron { fill: var(--s-group-electron-color, #2196f3); }
        .p-group-electron { fill: var(--p-group-electron-color, #ff9800); }
        .d-group-electron { fill: var(--d-group-electron-color, #4caf50); }
        .f-group-electron { fill: var(--f-group-electron-color, #e91e63); }

      </style>
    </custom-style>
    <svg id="element" version="1.1" viewBox="0 0 500 500">
      <title>An animation of the chemical element [[_element.name]].</title>
      <circle cx\$="[[_divide(500, 2)]]" cy\$="[[_divide(500, 2)]]" r\$="[[_divide(500, 10)]]" class\$="[[_element.group]]"></circle>
      <g id="ring-group"></g>
      <g id="electron-group"></g>
    </svg>
    <paper-tooltip for="element" position="bottom" animation-delay="0">
      [[_element.name]]
    </paper-tooltip>
  </template>

  
</dom-module>`;
document.head.appendChild($_documentContainer);
