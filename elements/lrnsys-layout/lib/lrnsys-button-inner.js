import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/iron-icons/iron-icons.js";
/**
`lrnsys-button-inner`


@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host > div > * {
        vertical-align: middle;
      }
      .text-label {
        margin-left: 0.5em;
      }
      .text-label-only {
        margin-left: 0em;
      }
    </style>
    <div>
      <template is="dom-if" if="[[avatar]]">
        <paper-avatar src\$="[[avatar]]"></paper-avatar>
      </template>
      <template is="dom-if" if="[[icon]]">
        <lrn-icon icon="[[icon]]"></lrn-icon>
      </template>
      <template is="dom-if" if="[[text]]">
        <span class\$="[[_getTextLabelClass()]]">[[text]]</span>
      </template>
    </div>
    <div><slot name="button"></slot></div>
`,

  is: "lrnsys-button-inner",

  properties: {
    /**
     * Icon to present for clicking.
     */
    icon: {
      type: String
    },
    /**
     * Icon to present for clicking.
     */
    avatar: {
      type: String
    },
    /**
     * Text to present for clicking.
     */
    text: {
      type: String
    }
  },

  /**
   * Find out if the text does not have an avatar or an icon to the left,
   * and add a class to remove the left margin.
   */
  _getTextLabelClass: function() {
    if (!this.avatar && !this.icon) {
      return "text-label-only";
    }
    return "text-label";
  }
});
