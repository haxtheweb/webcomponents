import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { flush } from "@polymer/polymer/lib/legacy/polymer.dom.js";

export const PaperInputAddonBehavior = {
  attached: function() {
    // Workaround for https://github.com/webcomponents/shadydom/issues/96
    flush();
    this.fire("addon-attached");
  },

  /**
   * The function called by `<paper-input-container>` when the input value or validity changes.
   * @param {{
   *   inputElement: (Element|undefined),
   *   value: (string|undefined),
   *   invalid: boolean
   * }} state -
   *     inputElement: The input element.
   *     value: The input value.
   *     invalid: True if the input value is invalid.
   */
  update: function(state) {}
};
