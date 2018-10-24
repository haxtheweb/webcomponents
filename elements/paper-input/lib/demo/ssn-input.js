import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-input/iron-input.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "./ssn-validator.js";
import { Polymer } from "@polymer/polymer/lib/legacy/polymer-fn.js";
import { IronValidatableBehavior } from "@polymer/iron-validatable-behavior/iron-validatable-behavior.js";
import { DomModule } from "@polymer/polymer/lib/elements/dom-module.js";
import { Element } from "@polymer/polymer/polymer-element.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="ssn-input">
  <template>
    <style>
      :host {
        display: inline-block;
      }

      :host([hidden]) {
        display: none !important;
      }

      input {
        font: inherit;
        outline: none;
        box-shadow: none;
        border: none;
        width: auto;
        text-align: center;
      }

      .container {
        @apply --layout-horizontal;
      }
    </style>

    <ssn-validator></ssn-validator>
    <div class="container">
      <!-- To make the demo work with the hybrid element, we need to conditionally
        load different templates: in 2.0 we lost is=, so the example same template
        can't be used with iron-input 1.0 and 2.0.

        You as a user of paper-input or paper-input-container don't
        need to do this, unless you are trying to vend an element that uses
        paper-input or paper-input-container _and_ works in both Polymer 1.0 or 2.0
      -->
       <span id="template-placeholder"></span>
    </div>
  </template>

  <template id="v0">
    <input is="iron-input" bind-value="{{_ssn1}}" maxlength="3" size="3" aria-label="First 3 digits of social security number">
    -
    <input is="iron-input" bind-value="{{_ssn2}}" maxlength="2" size="2" aria-label="Middle 2 digits of social security number">
    -
    <input is="iron-input" bind-value="{{_ssn3}}" maxlength="4" size="4" aria-label="Last 4 digits of social security number">
  </template>

  <template id="v1">
    <iron-input bind-value="{{_ssn1}}" aria-label="First 3 digits of social security number">
      <input maxlength="3" size="3">
    </iron-input>
    -
    <iron-input bind-value="{{_ssn2}}" aria-label="Middle 2 digits of social security number">
      <input maxlength="2" size="2">
    </iron-input>
    -
    <iron-input bind-value="{{_ssn3}}" aria-label="Last 4 digits of social security number">
      <input maxlength="4" size="4">
    </iron-input>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer);
/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
Polymer({
  is: "ssn-input",

  behaviors: [IronValidatableBehavior],

  properties: {
    value: {
      notify: true,
      type: String
    },

    _ssn1: {
      type: String,
      value: ""
    },

    _ssn2: {
      type: String,
      value: ""
    },

    _ssn3: {
      type: String,
      value: ""
    },

    validator: {
      type: String,
      value: "ssn-validator"
    }
  },

  observers: ["_computeValue(_ssn1,_ssn2,_ssn3)"],

  _computeValue: function(ssn1, ssn2, ssn3) {
    this.value = ssn1.trim() + "-" + ssn2.trim() + "-" + ssn3.trim();
  },

  beforeRegister: function() {
    var template = DomModule.import("ssn-input", "template");
    var version = Element ? "v1" : "v0";
    var inputTemplate = DomModule.import("ssn-input", "template#" + version);
    var inputPlaceholder = template.content.querySelector(
      "#template-placeholder"
    );
    inputPlaceholder.parentNode.replaceChild(
      inputTemplate.content,
      inputPlaceholder
    );
  }
});
