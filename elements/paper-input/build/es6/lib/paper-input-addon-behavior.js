import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { flush } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
export const PaperInputAddonBehavior = {
  attached: function() {
    flush();
    this.fire("addon-attached");
  },
  update: function() {}
};
