import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="hax-stax">

  <template>
    <style>
    :host {
      display:none;
    }
  </style>
  </template>

  
</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "hax-blox",
  properties: { data: { type: Object } },
  attached: function() {
    if (typeof this.data !== typeof void 0) {
      this.fire("hax-register-blox", this.data);
    }
  }
});
