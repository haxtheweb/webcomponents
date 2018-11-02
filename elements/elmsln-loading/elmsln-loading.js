/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
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
    <style is="custom-style" include="materializecss-styles-colors">
      @-moz-keyframes spin { 100% { -moz-transform: rotate(60deg); filter:saturate(10) invert(.9);} }
      @-webkit-keyframes spin { 100% { -webkit-transform: rotate(60deg); filter:saturate(10) invert(.9);} }
      @keyframes spin { 100% { -webkit-transform: rotate(60deg); transform:rotate(60deg);} }
      :host {
        display: block;
        -webkit-animation:spin 1.25s ease-out infinite;
        -moz-animation:spin 1.25s ease-out infinite;
        animation:spin 1.25s ease-out infinite;
      }
      :host([size="tiny"]) {
        width: 16px;
        height: 16px;
        -webkit-animation:spin .75s ease-out infinite;
        -moz-animation:spin .75s ease-out infinite;
        animation:spin .75s ease-out infinite;
      }
      :host([size="small"]) {
        width: 32px;
        height: 32px;
        -webkit-animation:spin 1s ease-out infinite;
        -moz-animation:spin 1s ease-out infinite;
        animation:spin 1s ease-out infinite;
      }
      :host([size="medium"]) {
        width: 64px;
        height: 64px;
        -webkit-animation:spin 1.25s ease-out infinite;
        -moz-animation:spin 1.25s ease-out infinite;
        animation:spin 1.25s ease-out infinite;
      }
      :host([size="large"]) {
        width: 80px;
        height: 80px;
        -webkit-animation:spin 1.25s ease-out infinite;
        -moz-animation:spin 1.25s ease-out infinite;
        animation:spin 1.25s ease-out infinite;
      }
      :host([size="epic"]) {
        width: 400px;
        height: 400px;
        -webkit-animation:spin 2s ease-out infinite;
        -moz-animation:spin 2s ease-out infinite;
        animation:spin 2s ease-out infinite;
      }
    </style>
    <iron-icon icon="lrn:network" class$="[[color]]"></iron-icon>
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
