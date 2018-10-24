/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/materializecss-styles/colors.js";
/**
 * `elmsln-loading`
 * A spinner to tell the user that something is loading.
 * This is just the spinner though and doesn't provide any text or anything else.
 *
 * @microcopy - language worth noting:
 *  - elmsln - an open source NGDLE to save education
 *
 * @customElement
 * @polymer
 * @polymerLegacy
 * @demo demo/index.html
 */
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: block;
      }
      iron-icon {
        -webkit-animation:spin 1.25s ease-out infinite;
        -moz-animation:spin 1.25s ease-out infinite;
        animation:spin 1.25s ease-out infinite;
      }
      .tiny {
        width: 1em;
        height: 1em;
        -webkit-animation:spin .75s ease-out infinite;
        -moz-animation:spin .75s ease-out infinite;
        animation:spin .75s ease-out infinite;
      }
      .small {
        width: 2em;
        height: 2em;
        -webkit-animation:spin 1s ease-out infinite;
        -moz-animation:spin 1s ease-out infinite;
        animation:spin 1s ease-out infinite;
      }
      .medium {
        width: 4em;
        height: 4em;
      }
      .large {
        width: 5em;
        height: 5em;
        -webkit-animation:spin 1.25s ease-out infinite;
        -moz-animation:spin 1.25s ease-out infinite;
        animation:spin 1.25s ease-out infinite;
      }
      .epic {
        width: 25em;
        height: 25em;
        -webkit-animation:spin 2s ease-out infinite;
        -moz-animation:spin 2s ease-out infinite;
        animation:spin 2s ease-out infinite;
      }
      @-moz-keyframes spin { 100% { -moz-transform: rotate(60deg); filter:saturate(10) invert(.9);} }
      @-webkit-keyframes spin { 100% { -webkit-transform: rotate(60deg); filter:saturate(10) invert(.9);} }
      @keyframes spin { 100% { -webkit-transform: rotate(60deg); transform:rotate(60deg);} }
    </style>
    <iron-icon icon="lrn:network" class\$="[[color]] [[size]]"></iron-icon>
`,

  is: "elmsln-loading",

  properties: {
    /**
     * materialize class names for color
     */
    color: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * tiny, small, medium, large, epic sizing.
     */
    size: {
      type: String,
      reflectToAttribute: true,
      value: "medium"
    }
  }
});
