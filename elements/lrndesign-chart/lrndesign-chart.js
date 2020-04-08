/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ChartistRenderSuper } from "@lrnwebcomponents/chartist-render/chartist-render.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `lrndesign-chart`
 * common properties and behaviors for lrndesign chart types
 *
 * @extends ChartistRenderSuper
 * @see @lrnwebcomponents/chartist-render/chartist-render.js
 * @see @lrnwebcomponents/simple-colors/simple-colors.js
 */
const LrndesignChart = function(SuperClass) {
  return class extends ChartistRenderSuper(SuperClass) {
    
//styles function
static get styles() {
return  [
...super.styles,...SimpleColors.styles,
css`
:host {
  background-color: var(--simple-colors-default-theme-grey-1);
  color: var(--simple-colors-default-theme-grey-12);
  --chartist-color-1: var(--simple-colors-default-theme-red-9);
  --chartist-color-2: var(--simple-colors-default-theme-blue-10);
  --chartist-color-3: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-4: var(--simple-colors-default-theme-purple-10);
  --chartist-color-5: var(--simple-colors-default-theme-green-9);
  --chartist-color-6: var(--simple-colors-default-theme-orange-10);
  --chartist-color-7: var(--simple-colors-default-theme-pink-9);
  --chartist-color-8: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-9: var(--simple-colors-default-theme-red-9);
  --chartist-color-10: var(--simple-colors-default-theme-blue-10);
  --chartist-color-11: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-12: var(--simple-colors-default-theme-purple-10);
  --chartist-color-13: var(--simple-colors-default-theme-green-9);
  --chartist-color-14: var(--simple-colors-default-theme-orange-10);
  --chartist-color-15: var(--simple-colors-default-theme-pink-9); }

:host([dark]) {
  --chartist-padding: 10px; }

:host([accent-color="red"]) {
  --chartist-color-1: var(--simple-colors-default-theme-red-9);
  --chartist-color-2: var(--simple-colors-default-theme-pink-10);
  --chartist-color-3: var(--simple-colors-default-theme-deep-orange-11);
  --chartist-color-4: var(--simple-colors-default-theme-purple-9);
  --chartist-color-5: var(--simple-colors-default-theme-orange-10);
  --chartist-color-6: var(--simple-colors-default-theme-red-11);
  --chartist-color-7: var(--simple-colors-default-theme-pink-9);
  --chartist-color-8: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-9: var(--simple-colors-default-theme-purple-11);
  --chartist-color-10: var(--simple-colors-default-theme-orange-9);
  --chartist-color-11: var(--simple-colors-default-theme-red-10);
  --chartist-color-12: var(--simple-colors-default-theme-pink-11);
  --chartist-color-13: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-14: var(--simple-colors-default-theme-purple-10);
  --chartist-color-15: var(--simple-colors-default-theme-orange-11); }

:host([accent-color="pink"]) {
  --chartist-color-1: var(--simple-colors-default-theme-pink-9);
  --chartist-color-2: var(--simple-colors-default-theme-purple-10);
  --chartist-color-3: var(--simple-colors-default-theme-red-11);
  --chartist-color-4: var(--simple-colors-default-theme-purple-9);
  --chartist-color-5: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-6: var(--simple-colors-default-theme-pink-11);
  --chartist-color-7: var(--simple-colors-default-theme-purple-9);
  --chartist-color-8: var(--simple-colors-default-theme-red-10);
  --chartist-color-9: var(--simple-colors-default-theme-purple-11);
  --chartist-color-10: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-11: var(--simple-colors-default-theme-pink-10);
  --chartist-color-12: var(--simple-colors-default-theme-purple-11);
  --chartist-color-13: var(--simple-colors-default-theme-red-9);
  --chartist-color-14: var(--simple-colors-default-theme-purple-10);
  --chartist-color-15: var(--simple-colors-default-theme-deep-orange-11); }

:host([accent-color="purple"]) {
  --chartist-color-1: var(--simple-colors-default-theme-purple-9);
  --chartist-color-2: var(--simple-colors-default-theme-deep-purple-10);
  --chartist-color-3: var(--simple-colors-default-theme-pink-11);
  --chartist-color-4: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-5: var(--simple-colors-default-theme-red-10);
  --chartist-color-6: var(--simple-colors-default-theme-purple-11);
  --chartist-color-7: var(--simple-colors-default-theme-deep-purple-9);
  --chartist-color-8: var(--simple-colors-default-theme-pink-10);
  --chartist-color-9: var(--simple-colors-default-theme-indigo-11);
  --chartist-color-10: var(--simple-colors-default-theme-red-9);
  --chartist-color-11: var(--simple-colors-default-theme-purple-10);
  --chartist-color-12: var(--simple-colors-default-theme-deep-purple-11);
  --chartist-color-13: var(--simple-colors-default-theme-pink-9);
  --chartist-color-14: var(--simple-colors-default-theme-indigo-10);
  --chartist-color-15: var(--simple-colors-default-theme-red-11); }

:host([accent-color="deep-purple"]) {
  --chartist-color-1: var(--simple-colors-default-theme-deep-purple-9);
  --chartist-color-2: var(--simple-colors-default-theme-indigo-10);
  --chartist-color-3: var(--simple-colors-default-theme-purple-11);
  --chartist-color-4: var(--simple-colors-default-theme-blue-9);
  --chartist-color-5: var(--simple-colors-default-theme-pink-10);
  --chartist-color-6: var(--simple-colors-default-theme-deep-purple-11);
  --chartist-color-7: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-8: var(--simple-colors-default-theme-purple-10);
  --chartist-color-9: var(--simple-colors-default-theme-blue-11);
  --chartist-color-10: var(--simple-colors-default-theme-pink-9);
  --chartist-color-11: var(--simple-colors-default-theme-deep-purple-10);
  --chartist-color-12: var(--simple-colors-default-theme-indigo-11);
  --chartist-color-13: var(--simple-colors-default-theme-purple-9);
  --chartist-color-14: var(--simple-colors-default-theme-blue-10);
  --chartist-color-15: var(--simple-colors-default-theme-pink-11); }

:host([accent-color="indigo"]) {
  --chartist-color-1: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-2: var(--simple-colors-default-theme-blue-10);
  --chartist-color-3: var(--simple-colors-default-theme-deep-purple-11);
  --chartist-color-4: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-5: var(--simple-colors-default-theme-purple-10);
  --chartist-color-6: var(--simple-colors-default-theme-indigo-11);
  --chartist-color-7: var(--simple-colors-default-theme-blue-9);
  --chartist-color-8: var(--simple-colors-default-theme-deep-purple-10);
  --chartist-color-9: var(--simple-colors-default-theme-light-blue-11);
  --chartist-color-10: var(--simple-colors-default-theme-purple-9);
  --chartist-color-11: var(--simple-colors-default-theme-indigo-10);
  --chartist-color-12: var(--simple-colors-default-theme-blue-11);
  --chartist-color-13: var(--simple-colors-default-theme-deep-purple-9);
  --chartist-color-14: var(--simple-colors-default-theme-light-blue-10);
  --chartist-color-15: var(--simple-colors-default-theme-purple-11); }

:host([accent-color="blue"]) {
  --chartist-color-1: var(--simple-colors-default-theme-blue-9);
  --chartist-color-2: var(--simple-colors-default-theme-light-blue-10);
  --chartist-color-3: var(--simple-colors-default-theme-indigo-11);
  --chartist-color-4: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-5: var(--simple-colors-default-theme-deep-purple-10);
  --chartist-color-6: var(--simple-colors-default-theme-blue-11);
  --chartist-color-7: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-8: var(--simple-colors-default-theme-indigo-10);
  --chartist-color-9: var(--simple-colors-default-theme-cyan-11);
  --chartist-color-10: var(--simple-colors-default-theme-deep-purple-9);
  --chartist-color-11: var(--simple-colors-default-theme-blue-10);
  --chartist-color-12: var(--simple-colors-default-theme-light-blue-11);
  --chartist-color-13: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-14: var(--simple-colors-default-theme-cyan-10);
  --chartist-color-15: var(--simple-colors-default-theme-deep-purple-11); }

:host([accent-color="light-blue"]) {
  --chartist-color-1: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-2: var(--simple-colors-default-theme-cyan-10);
  --chartist-color-3: var(--simple-colors-default-theme-blue-11);
  --chartist-color-4: var(--simple-colors-default-theme-teal-9);
  --chartist-color-5: var(--simple-colors-default-theme-indigo-10);
  --chartist-color-6: var(--simple-colors-default-theme-light-blue-11);
  --chartist-color-7: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-8: var(--simple-colors-default-theme-blue-10);
  --chartist-color-9: var(--simple-colors-default-theme-teal-11);
  --chartist-color-10: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-11: var(--simple-colors-default-theme-light-blue-10);
  --chartist-color-12: var(--simple-colors-default-theme-cyan-11);
  --chartist-color-13: var(--simple-colors-default-theme-blue-9);
  --chartist-color-14: var(--simple-colors-default-theme-teal-10);
  --chartist-color-15: var(--simple-colors-default-theme-indigo-11); }

:host([accent-color="cyan"]) {
  --chartist-color-1: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-2: var(--simple-colors-default-theme-teal-10);
  --chartist-color-3: var(--simple-colors-default-theme-light-blue-11);
  --chartist-color-4: var(--simple-colors-default-theme-green-9);
  --chartist-color-5: var(--simple-colors-default-theme-blue-10);
  --chartist-color-6: var(--simple-colors-default-theme-cyan-11);
  --chartist-color-7: var(--simple-colors-default-theme-teal-9);
  --chartist-color-8: var(--simple-colors-default-theme-light-blue-10);
  --chartist-color-9: var(--simple-colors-default-theme-green-11);
  --chartist-color-10: var(--simple-colors-default-theme-blue-9);
  --chartist-color-11: var(--simple-colors-default-theme-cyan-10);
  --chartist-color-12: var(--simple-colors-default-theme-teal-11);
  --chartist-color-13: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-14: var(--simple-colors-default-theme-green-10);
  --chartist-color-15: var(--simple-colors-default-theme-blue-11); }

:host([accent-color="teal"]) {
  --chartist-color-1: var(--simple-colors-default-theme-teal-9);
  --chartist-color-2: var(--simple-colors-default-theme-green-10);
  --chartist-color-3: var(--simple-colors-default-theme-cyan-11);
  --chartist-color-4: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-5: var(--simple-colors-default-theme-light-blue-10);
  --chartist-color-6: var(--simple-colors-default-theme-teal-11);
  --chartist-color-7: var(--simple-colors-default-theme-green-9);
  --chartist-color-8: var(--simple-colors-default-theme-cyan-10);
  --chartist-color-9: var(--simple-colors-default-theme-light-green-11);
  --chartist-color-10: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-11: var(--simple-colors-default-theme-teal-10);
  --chartist-color-12: var(--simple-colors-default-theme-green-11);
  --chartist-color-13: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-14: var(--simple-colors-default-theme-light-green-10);
  --chartist-color-15: var(--simple-colors-default-theme-light-blue-11); }

:host([accent-color="green"]) {
  --chartist-color-1: var(--simple-colors-default-theme-green-9);
  --chartist-color-2: var(--simple-colors-default-theme-light-green-10);
  --chartist-color-3: var(--simple-colors-default-theme-teal-11);
  --chartist-color-4: var(--simple-colors-default-theme-lime-9);
  --chartist-color-5: var(--simple-colors-default-theme-cyan-10);
  --chartist-color-6: var(--simple-colors-default-theme-green-11);
  --chartist-color-7: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-8: var(--simple-colors-default-theme-teal-10);
  --chartist-color-9: var(--simple-colors-default-theme-lime-11);
  --chartist-color-10: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-11: var(--simple-colors-default-theme-green-10);
  --chartist-color-12: var(--simple-colors-default-theme-light-green-11);
  --chartist-color-13: var(--simple-colors-default-theme-teal-9);
  --chartist-color-14: var(--simple-colors-default-theme-lime-10);
  --chartist-color-15: var(--simple-colors-default-theme-cyan-11); }

:host([accent-color="light-green"]) {
  --chartist-color-1: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-2: var(--simple-colors-default-theme-lime-10);
  --chartist-color-3: var(--simple-colors-default-theme-green-11);
  --chartist-color-4: var(--simple-colors-default-theme-amber-9);
  --chartist-color-5: var(--simple-colors-default-theme-teal-10);
  --chartist-color-6: var(--simple-colors-default-theme-light-green-11);
  --chartist-color-7: var(--simple-colors-default-theme-lime-9);
  --chartist-color-8: var(--simple-colors-default-theme-green-10);
  --chartist-color-9: var(--simple-colors-default-theme-amber-11);
  --chartist-color-10: var(--simple-colors-default-theme-teal-9);
  --chartist-color-11: var(--simple-colors-default-theme-light-green-10);
  --chartist-color-12: var(--simple-colors-default-theme-lime-11);
  --chartist-color-13: var(--simple-colors-default-theme-green-9);
  --chartist-color-14: var(--simple-colors-default-theme-amber-10);
  --chartist-color-15: var(--simple-colors-default-theme-teal-11); }

:host([accent-color="lime"]) {
  --chartist-color-1: var(--simple-colors-default-theme-lime-9);
  --chartist-color-2: var(--simple-colors-default-theme-yellow-10);
  --chartist-color-3: var(--simple-colors-default-theme-light-green-11);
  --chartist-color-4: var(--simple-colors-default-theme-orange-9);
  --chartist-color-5: var(--simple-colors-default-theme-green-10);
  --chartist-color-6: var(--simple-colors-default-theme-lime-11);
  --chartist-color-7: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-8: var(--simple-colors-default-theme-light-green-10);
  --chartist-color-9: var(--simple-colors-default-theme-orange-11);
  --chartist-color-10: var(--simple-colors-default-theme-green-9);
  --chartist-color-11: var(--simple-colors-default-theme-lime-10);
  --chartist-color-12: var(--simple-colors-default-theme-yellow-11);
  --chartist-color-13: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-14: var(--simple-colors-default-theme-orange-10);
  --chartist-color-15: var(--simple-colors-default-theme-green-11); }

:host([accent-color="yellow"]) {
  --chartist-color-1: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-2: var(--simple-colors-default-theme-amber-10);
  --chartist-color-3: var(--simple-colors-default-theme-lime-11);
  --chartist-color-4: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-5: var(--simple-colors-default-theme-light-green-10);
  --chartist-color-6: var(--simple-colors-default-theme-yellow-11);
  --chartist-color-7: var(--simple-colors-default-theme-amber-9);
  --chartist-color-8: var(--simple-colors-default-theme-lime-10);
  --chartist-color-9: var(--simple-colors-default-theme-deep-orange-11);
  --chartist-color-10: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-11: var(--simple-colors-default-theme-yellow-10);
  --chartist-color-12: var(--simple-colors-default-theme-amber-11);
  --chartist-color-13: var(--simple-colors-default-theme-lime-9);
  --chartist-color-14: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-15: var(--simple-colors-default-theme-light-green-11); }

:host([accent-color="amber"]) {
  --chartist-color-1: var(--simple-colors-default-theme-amber-9);
  --chartist-color-2: var(--simple-colors-default-theme-orange-10);
  --chartist-color-3: var(--simple-colors-default-theme-yellow-11);
  --chartist-color-4: var(--simple-colors-default-theme-red-9);
  --chartist-color-5: var(--simple-colors-default-theme-lime-10);
  --chartist-color-6: var(--simple-colors-default-theme-amber-11);
  --chartist-color-7: var(--simple-colors-default-theme-orange-9);
  --chartist-color-8: var(--simple-colors-default-theme-yellow-10);
  --chartist-color-9: var(--simple-colors-default-theme-red-11);
  --chartist-color-10: var(--simple-colors-default-theme-lime-9);
  --chartist-color-11: var(--simple-colors-default-theme-amber-10);
  --chartist-color-12: var(--simple-colors-default-theme-orange-11);
  --chartist-color-13: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-14: var(--simple-colors-default-theme-red-10);
  --chartist-color-15: var(--simple-colors-default-theme-lime-11); }

:host([accent-color="orange"]) {
  --chartist-color-1: var(--simple-colors-default-theme-orange-9);
  --chartist-color-2: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-3: var(--simple-colors-default-theme-amber-11);
  --chartist-color-4: var(--simple-colors-default-theme-pink-9);
  --chartist-color-5: var(--simple-colors-default-theme-yellow-10);
  --chartist-color-6: var(--simple-colors-default-theme-orange-11);
  --chartist-color-7: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-8: var(--simple-colors-default-theme-amber-10);
  --chartist-color-9: var(--simple-colors-default-theme-pink-11);
  --chartist-color-10: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-11: var(--simple-colors-default-theme-orange-10);
  --chartist-color-12: var(--simple-colors-default-theme-deep-orange-11);
  --chartist-color-13: var(--simple-colors-default-theme-amber-9);
  --chartist-color-14: var(--simple-colors-default-theme-pink-10);
  --chartist-color-15: var(--simple-colors-default-theme-yellow-11); }

:host([accent-color="deep-orange"]) {
  --chartist-color-1: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-2: var(--simple-colors-default-theme-red-10);
  --chartist-color-3: var(--simple-colors-default-theme-orange-11);
  --chartist-color-4: var(--simple-colors-default-theme-purple-9);
  --chartist-color-5: var(--simple-colors-default-theme-amber-10);
  --chartist-color-6: var(--simple-colors-default-theme-deep-orange-11);
  --chartist-color-7: var(--simple-colors-default-theme-red-9);
  --chartist-color-8: var(--simple-colors-default-theme-orange-10);
  --chartist-color-9: var(--simple-colors-default-theme-purple-11);
  --chartist-color-10: var(--simple-colors-default-theme-amber-9);
  --chartist-color-11: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-12: var(--simple-colors-default-theme-red-11);
  --chartist-color-13: var(--simple-colors-default-theme-orange-9);
  --chartist-color-14: var(--simple-colors-default-theme-purple-10);
  --chartist-color-15: var(--simple-colors-default-theme-amber-11); }

:host([accent-color="brown"]) {
  --chartist-color-1: var(--simple-colors-default-theme-brown-9);
  --chartist-color-2: var(--simple-colors-default-theme-red-10);
  --chartist-color-3: var(--simple-colors-default-theme-deep-orange-11);
  --chartist-color-4: var(--simple-colors-default-theme-brown-12);
  --chartist-color-5: var(--simple-colors-default-theme-red-13);
  --chartist-color-6: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-7: var(--simple-colors-default-theme-brown-10);
  --chartist-color-8: var(--simple-colors-default-theme-red-11);
  --chartist-color-9: var(--simple-colors-default-theme-deep-orange-12);
  --chartist-color-10: var(--simple-colors-default-theme-brown-13);
  --chartist-color-11: var(--simple-colors-default-theme-red-9);
  --chartist-color-12: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-13: var(--simple-colors-default-theme-brown-11);
  --chartist-color-14: var(--simple-colors-default-theme-red-12);
  --chartist-color-15: var(--simple-colors-default-theme-deep-orange-13); }

#chart,
::slotted(table) {
  font-family: sans-serif;
  --chartist-grid-color: var(--simple-colors-default-theme-grey-6);
  --chartist-bg-color: var(--simple-colors-default-theme-grey-1);
  --chartist-text-color: var(--simple-colors-default-theme-grey-12); }

:host([label-position="inside"]) .ct-label {
  --chartist-text-color: var(--simple-colors-default-theme-grey-1); }

:host([dark]) ::slotted(table) {
  --chartist-text-color: var(--simple-colors-default-theme-grey-12);
  --chartist-grid-color: var(--simple-colors-default-theme-grey-6); }
`
];
}

// render function
render() {
return html`

${super.render()}`;
}

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "description": "Creates an accessible chart based on a CSV.",
    "color": "green darken-4",
    "groups": ["Data", "Presentation"],
    "handles": [
      {
        "type": "data",
        "url": "csvFile"
      }
    ],
    "meta": {
      "author": "LRNWebComponents"
    }
  },
  "settings": {
    "quick": [
      {
        "property": "accentColor",
        "title": "Accent Color",
        "description": "An optional accent color.",
        "inputMethod": "colorpicker",
        "icon": "editor:format-color-fill"
      },
      {
        "property": "dark",
        "title": "Dark Theme",
        "description": "Enable Dark Theme",
        "inputMethod": "boolean",
        "icon": "icons:invert-colors"
      },
      {
        "property": "chartTitle",
        "title": "Chart Title",
        "description": "Accessible alt text for your chart.",
        "inputMethod": "textfield",
        "icon": "text-field",
        "required": true
      }
    ],
    "configure": [
      {
        "property": "accentColor",
        "title": "Accent Color",
        "description": "An optional accent color.",
        "inputMethod": "colorpicker"
      },
      {
        "property": "dark",
        "title": "Dark Theme",
        "description": "Enable Dark Theme",
        "inputMethod": "boolean"
      },
      {
        "property": "dataSource",
        "title": "CSV File",
        "description": "Load data from a CSV.",
        "inputMethod": "haxupload",
        "icon": "link",
        "required": true
      },
      {
        "property": "chartTitle",
        "title": "Chart Title",
        "description": "Accessible alt text for your chart.",
        "inputMethod": "textfield",
        "icon": "text-field",
        "required": true
      },
      {
        "property": "chartDesc",
        "title": "Chart Description",
        "description": "Accessible description of your chart.",
        "inputMethod": "textfield",
        "icon": "text-field"
      }
    ],
    "advanced": [
      {
        "property": "scale",
        "title": "Scale Name",
        "description": "The ratio of width:height of the chart (See https://gionkunz.github.io/chartist-js/getting-started.html#default-sass-settings for $ct-scales and $ct-scales-names).",
        "inputMethod": "select",
        "options": {
          "ct-square": "ct-square (1:1)",
          "ct-minor-second": "ct-minor-second  (15:16)",
          "ct-major-second": "ct-major-second  (8:9)",
          "ct-minor-third": "ct-minor-third  (5:6)",
          "ct-major-third": "ct-major-third  (4:5)",
          "ct-perfect-fourth": "ct-perfect-fourth  (3:4)",
          "ct-perfect-fifth": "ct-perfect-fifth  (2:3)",
          "ct-minor-sixth": "ct-minor-sixth  (5:8)",
          "ct-golden-section": "ct-golden-section  (1:1.618)",
          "ct-major-sixth": "ct-major-sixth  (3:5)",
          "ct-minor-seventh": "ct-minor-seventh  (9:16)",
          "ct-major-seventh": "ct-major-seventh  (8:15)",
          "ct-octave": "ct-octave  (1:2)",
          "ct-major-tenth": "ct-major-tenth  (2:5)",
          "ct-major-eleventh": "ct-major-eleventh  (3:8)",
          "ct-major-twelfth": "ct-major-twelfth  (1:3)",
          "ct-double-octave": "ct-double-octave  (1:4`)"
        },
        "icon": "text-field"
      },
      {
        "property": "reverseData",
        "title": "Reverse Data",
        "description": "Reverse data including labels, the series order as well as the whole series data arrays.",
        "inputMethod": "boolean",
        "icon": "check-box"
      }
    ]
  }
}
;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * Location of the CSV file.
   */
  "accentColor": {
    "type": String,
    "attribute": "accent-color",
    "reflect": true
  },
  /**
   * Location of the CSV file.
   */
  "dark": {
    "type": Boolean,
    "attribute": "dark",
    "reflect": true
  },
  /**
   * Fixed height for the chart as a string (i.e. '100px' or '50%').
   */
  "height": {
    "type": String
  },
  /**
   * Reverse data including labels, the series order as well as
   * the whole series data arrays.
   */
  "reverseData": {
    "type": Boolean,
    "attribute": "reverse-data"
  },
  /**
   * Fixed width for the chart as a string (i.e. '100px' or '50%').
   */
  "width": {
    "type": String
  }
}
;
  }

    constructor() {
      super();
      this.setProperties();
      this.makeChart();
    }

    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "lrndesign-chart";
    }

    //properties common to line and bar charts
    static get lineBarProperties() {
      return {
        /**
         * Offset X of labels for X-axis
         */
        axisXLabelOffsetX: {
          attribute: "axis-x-label-offset-x",
          type: Number
        },
        /**
         * Offset Y of labels for X-axis
         */
        axisXLabelOffsetY: {
          attribute: "axis-x-label-offset-y",
          type: Number
        },
        /**
         * The offset of the chart drawing area to the border of the container.
         */
        axisXOffset: {
          attribute: "axis-x-offset",
          type: Number
        },
        /**
         * Position where labels are placed.
         * Can be set to `start` or `end`
         * where `start` is equivalent to left or top on vertical axis
         * and `end` is equivalent to right or bottom on horizontal axis.
         */
        axisXPosition: {
          attribute: "axis-x-position",
          type: String
        },
        /**
         * Show axis X grid?
         */
        axisXShowGrid: {
          attribute: "axis-x-show-grid",
          type: Boolean
        },
        /**
         * Show axis X labels?
         */
        axisXShowLabel: {
          attribute: "axis-x-show-label",
          type: Boolean
        },
        /**
         * Optional title of x-axis
         */
        axisXTitle: {
          attribute: "axis-x-title",
          type: String
        },
        /**
         * Optional x-offset for x-axis title
         */
        axisXTitleOffsetX: {
          attribute: "axis-x-title-offset",
          type: Number
        },
        /**
         * Optional y-offset for x-axis title
         */
        axisXTitleOffsetY: {
          attribute: "axis-x-title-offset",
          type: Number
        },
        /**
         * Optional title of x-axis. Possible values are 'start', 'end' and 'middle'.
         */
        axisXTitleAnchor: {
          attribute: "axis-x-title-anchor",
          type: String
        },
        /**
        /**
         * Offset X of labels for Y-axis
         */
        axisYLabelOffsetX: {
          attribute: "axis-y-label-offset-x",
          type: Number
        },
        /**
         * Offset Y of labels for Y-axis
         */
        axisYLabelOffsetY: {
          attribute: "axis-y-label-offset-y",
          type: Number
        },
        /**
         * Position where labels are placed.
         * Can be set to `start` or `end`
         * where `start` is equivalent to left or top on vertical axis
         * and `end` is equivalent to right or bottom on horizontal axis.
         */
        axisYPosition: {
          attribute: "axis-y-position",
          type: String
        },
        /**
         * Specifies minimum height in pixel of scale steps
         */
        axisYScaleMinSpace: {
          attribute: "axis-y-scale-min-space",
          type: Number
        },
        /**
         * The offset of the chart drawing area to the border of the container.
         */
        axisYOffset: {
          attribute: "axis-y-offset",
          type: Number
        },
        /**
         * Use only integer values (whole numbers) for the scale steps
         */
        axisYOnlyInteger: {
          attribute: "axis-y-only-integer",
          type: Boolean
        },
        /**
         * Show axis Y grid?
         */
        axisYshowGrid: {
          attribute: "axis-y-show-grid",
          type: Boolean
        },
        /**
         * Show axis Y labels?
         */
        axisYShowLabel: {
          attribute: "axis-y-show-label",
          type: Boolean
        },
        /**
         * Position labels at top-left of axis?
         */
        axisYTopLeft: {
          attribute: "axis-y-top-left",
          type: Boolean
        },
        /**
         * Optional title of y-axis
         */
        axisYTitle: {
          attribute: "axis-y-title",
          type: String
        },
        /**
         * Optional x-offset for y-axis title.
         * Please note, x and y offset values for axisY are flipped due to the rotation of the axisY title by 90 degrees.
         * Therefore changing y moves left/right.
         */
        axisYTitleOffsetX: {
          attribute: "axis-y-title-offset",
          type: Number
        },
        /**
         * Optional y-offset for y-axis title.
         * Please note, x and y offset values for axisY are flipped due to the rotation of the axisY title by 90 degrees.
         * Therefore changing the x value moves up/down the chart.
         */
        axisYTitleOffsetY: {
          attribute: "axis-y-title-offset",
          type: Number
        },
        /**
         * Optional title of y-axis. Possible values are 'start', 'end' and 'middle'.
         */
        axisYTitleAnchor: {
          attribute: "axis-y-title-anchor",
          type: String
        },
        /**
         * Optional title of y-axis
         */
        axisYTitleFlip: {
          attribute: "axis-y-title-flip",
          type: Boolean
        },

        /**
         * Padding below chart drawing area
         */
        chartPaddingBottom: {
          attribute: "chart-padding-bottom",
          type: String
        },

        /**
         * Padding left of chart drawing area
         */
        chartPaddingLeft: {
          attribute: "chart-padding-left",
          type: String
        },

        /**
         * Padding right of chart drawing area
         */
        chartPaddingRight: {
          attribute: "chart-padding-right",
          type: String
        },

        /**
         * Padding above chart drawing area
         */
        chartPaddingTop: {
          attribute: "chart-padding-top",
          type: String
        },
        /**
         * Overriding the natural high of the chart allows you to zoom in
         * or limit the charts highest displayed value.
         */
        high: {
          type: Number
        },
        /**
         * Overriding the natural low of the chart allows you to zoom in
         * or limit the charts lowest displayed value.
         */
        low: {
          type: Number
        },
        /**
         * If the bar chart should add a background fill to the .ct-grids group.
         */
        showGridBackground: {
          attribute: "show-grid-background",
          type: Boolean
        }
      };
    }

    // extends haxProperty definition to line and bar properties
    static get lineBarHaxProperties() {
      return {
        gridBackground: [
          {
            property: "showGridBackground",
            title: "Show Grid Background",
            inputMethod: "boolean"
          }
        ],
        padding: [
          {
            property: "chartPaddingTop",
            title: "Chart Padding (top)",
            inputMethod: "text-field"
          },
          {
            property: "chartPaddingBottom",
            title: "Chart Padding (bottom)",
            inputMethod: "text-field"
          },
          {
            property: "chartPaddingLeft",
            title: "Chart Padding (left)",
            inputMethod: "text-field"
          },
          {
            property: "chartPaddingRight",
            title: "Chart Padding (right)",
            inputMethod: "text-field"
          }
        ],
        minMax: [
          {
            property: "low",
            title: "Chart Minimum",
            description: `
            Overriding the natural low of the chart allows you to zoom in 
            or limit the chart's lowest displayed value`,
            inputMethod: "number"
          },
          {
            property: "high",
            title: "Chart Maximum",
            description: `
            Overriding the natural high of the chart allows you to zoom in 
            or limit the chart's highest displayed value`,
            inputMethod: "number"
          }
        ],
        xAxis: [
          {
            property: "axisXShowGrid",
            title: "X-Axis Show Grid",
            description: "Show the X-Axis's grid.",
            inputMethod: "boolean"
          },
          {
            property: "axisXOffset",
            title: "X-Axis Offset",
            inputMethod: "number"
          },
          {
            property: "axisXPosition",
            title: "X-Axis Position",
            description: `
              Position where labels are placed. Can be set to "start" or "end" 
              where "start" is equivalent to left or top on vertical axis
              and "end" is equivalent to right or bottom on horizontal axis`,
            inputMethod: "text-field"
          },
          {
            property: "axisXShowLabel",
            title: "X-Axis Show Label",
            description: "Show the X-Axis's label.",
            inputMethod: "boolean"
          },
          {
            property: "axisXLabelOffsetX",
            title: "X-Axis Label (horizontal offset)",
            description: "Horizontal position of the X-Axis's labels.",
            inputMethod: "number"
          },
          {
            property: "axisXTitleOffsetY",
            title: "X-Axis Label (vertical offset)",
            description: "Vertical position of the X-Axis's labels.",
            inputMethod: "number"
          },
          {
            property: "axisXTitle",
            title: "X-Axis Title",
            description: "Optional title for X-axis.",
            inputMethod: "textfield"
          },
          {
            property: "axisXTitleOffsetX",
            title: "X-Axis Title (horizontal offset)",
            description: "Horizontal position of the X-Axis's title.",
            inputMethod: "number"
          },
          {
            property: "axisXLabelOffsetY",
            title: "X-Axis Title (vertical offset)",
            description: "Vertical position of the X-Axis's title.",
            inputMethod: "number"
          },
          {
            property: "axisXTitleAnchor",
            title: "X-Axis Title Anchoe",
            description: "Optional anchor for X-axis's title.",
            inputMethod: "select",
            options: {
              middle: "middle",
              end: "end",
              start: "start"
            }
          }
        ],
        yAxis: [
          {
            property: "axisYShowGrid",
            title: "Y-Axis: Show Grid",
            description: "Show the Y-Axis's grid.",
            inputMethod: "boolean"
          },
          {
            property: "axisYOffset",
            title: "Y-Axis Offset",
            inputMethod: "number"
          },
          {
            property: "axisYPosition",
            title: "Y-Axis Position",
            description: `
              Position where labels are placed. Can be set to "start" or "end" 
              where "start" is equivalent to left or top on vertical axis
              and "end" is equivalent to right or bottom on horizontal axis`,
            inputMethod: "text-field"
          },
          {
            property: "axisYShowLabel",
            title: "Y-Axis Show Label",
            description: "Show the Y-Axis's label.",
            inputMethod: "boolean"
          },
          {
            property: "axisYLabelOffsetX",
            title: "Y-Axis Label (horizontal offset)",
            description: "Horizontal position of the Y-Axis's label.",
            inputMethod: "number"
          },
          {
            property: "axisYLabelOffsetY",
            title: "Y-Axis Label (vertical offset)",
            description: "Vertical position of the Y-Axis's label.",
            inputMethod: "number"
          },
          {
            property: "axisYScaleMinSpace",
            title: "Y-Axis Scale Minimum Space",
            description: "Specifies minimum height in pixel of scale steps.",
            inputMethod: "number"
          },
          {
            property: "axisYOnlyInteger",
            title: "Y-Axis Scale (only integers)",
            description:
              "Use only integer values (whole numbers) for the scale steps.",
            inputMethod: "boolean"
          },
          {
            property: "axisYTitle",
            title: "Y-Axis Title",
            description: "Optional title for Y-axis.",
            inputMethod: "textfield"
          },
          {
            property: "axisYTitleOffsetX",
            title: "Y-Axis Title (vertical offset)",
            description: "Horizontal position of the Y-Axis's title.",
            inputMethod: "number"
          },
          {
            property: "axisYLabelOffsetY",
            title: "Y-Axis Title (horizontal offset)",
            description: "Horizontal position of the Y-Axis's title.",
            inputMethod: "number"
          },
          {
            property: "axisYTitleAnchor",
            title: "Y-Axis Title Anchoe",
            description: "Optional anchor for Y-axis's title.",
            inputMethod: "select",
            options: {
              middle: "middle",
              end: "end",
              start: "start"
            }
          },
          {
            property: "axisYTitleFlip",
            title: "Y-Axis Title Flip",
            description: "Flip the title for Y-axis?",
            inputMethod: "boolean"
          }
        ]
      };
    }

    /**
     * override this with type-specific options
     * @returns {object} options specific to both bar and line charts
     * @readonly
     * @memberof LrndesignChart
     * @memberof LrndesignChart
     */
    get lineBarOptions() {
      return {
        high: this.high,
        low: this.low,
        axisX: {
          labelOffset: {
            x: this.axisXLabelOffsetX,
            y: this.axisXLabelOffsetY,
            offset: this.axisXOffset
          },
          position: this.axisXPosition,
          showGrid: this.axisXShowGrid,
          showLabel: this.axisXShowLabel
        },
        axisY: {
          labelOffset: {
            x: this.axisYLabelOffsetX,
            y: this.axisYLabelOffsetY,
            offset: this.axisYOffset
          },
          position: this.axisYPosition,
          showGrid: this.axisYShowGrid,
          showLabel: this.axisYShowLabel,
          onlyInteger: this.axisYOnlyInteger,
          scaleMinSpace: this.axisYScaleMinSpace
        },
        showGridBackground: this.showGridBackground,
        chartPadding: {
          bottom: this.chartPaddingBottom + (this.axisXTitle ? 40 : 0),
          left: this.chartPaddingLeft + (this.axisYTitle ? 30 : 0),
          right: this.chartPaddingRight + (this.axisYTitle ? 15 : 0),
          top: this.chartPaddingTop  + (this.axisXTitle ? 20 : 0)
        }
      };
    }

    /**
     *
     * override this with type-specific options
     * @returns {object} options
     * @readonly
     * @memberof LrndesignChart
     */
    get options() {
      return {
        reverseData: this.reverseData
      };
    }

    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        if((propName.indexOf('axisXTitle') > -1 || propName.indexOf('axisYTitle') > -1) && this[propName] !== oldValue){
          this.pluginAxisTitle = this.axisTitles;
        }
      });
      if (super.updated) super.updated(changedProperties);
    }

    /**
     * creates an accessible table based on data object
     * @memberof LrndesignChart
     */
    _renderTable() {
      let table = this.querySelector("table");
      if (table) table.remove();
      let html = "";
      table = document.createElement("table");
      if (this.data.labels)
        html += `<thead><tr>${(this.data.labels || [])
          .map(label => `<th scope="col">${label}</th>`)
          .join("")}</tr></thead>`;
      if (this.data.series)
        html += `<tbody>
          ${
            this.data.series && Array.isArray(this.data.series[0])
              ? (this.data.series || [])
                  .map(
                    row =>
                      `<tr>${(row || [])
                        .map(col => `<td>${col}</td>`)
                        .join("")}</tr>`
                  )
                  .join("")
              : `<tr>${(this.data.series || [])
                  .map(col => `<td>${col}</td>`)
                  .join("")}</tr>`
          }
        </tbody>`;
      table.innerHTML = html;
      this.appendChild(table);
    }

    /**
     * refreshes the chart
     */
    makeChart() {
      let chart = this.shadowRoot.querySelector("#chart");
      if (chart) {
        chart.options = this._getOptions();
        /**
         * Fired when chart options change.
         *
         * @event options-changed
         * @param {object} chart options
         *
         */
        this.dispatchEvent(
          new CustomEvent("options-changed", { detail: this })
        );
        chart.makeChart();
        /**
         * Fired when chart changes.
         *
         * @event chart-changed
         *
         */
        this.dispatchEvent(new CustomEvent("chart-changed", { detail: this }));
      }
    }
    /**
     * gets axis title options
     * @readonly
     */
    get axisTitles() {
      let axisTitles = {};
      if(this.axisXTitle) axisTitles.axisX = {
        axisTitle: this.axisXTitle,
        offset: { x: this.axisXTitleOffsetX, y: this.axisXTitleOffsetY },
        textAnchor: ["start","end","middle"].includes(this.axisXTitleAnchor) ? this.axisXTitleAnchor : "middle"
      };
      if(this.axisYTitle) axisTitles.axisY = {
        axisTitle: this.axisYTitle,
        offset: { x: this.axisYTitleOffsetX, y: this.axisYTitleOffsetY },
        textAnchor: ["start","end","middle"].includes(this.axisYTitleAnchor) ? this.axisYTitleAnchor : "middle"
      };
      return this.axisXTitle || this.axisYTitle
        ? axisTitles
        : undefined;
    }

    /**
     * Sets properties for chart.
     * Specific chart types can extend this function
     * with type-specific properties.
     */
    setProperties() {
      this.dark = false;
      this.scale = "ct-minor-seventh";
      this.reverseData = false;
      this.rawData = "";
    }

    /**
     * Sets properties specific to bar and line charts.
     * Bar and line charts can include this function
     * in their extended setProperties function.
     */
    setBarLineProperties() {
      this.high = undefined;
      this.low = undefined;
      this.axisXLabelOffsetX = 0;
      this.axisXLabelOffsetY = 0;
      this.axisXOffset = 30;
      this.axisXPosition = "end";
      this.axisXShowGrid = true;
      this.axisXShowLabel = true;
      this.axisXTopLeft = false;
      this.axisXTitleOffsetX  = 0; 
      this.axisXTitleOffsetY  = 50;
      this.axisXTitleAnchor = 'middle'; 
      this.axisYTitleOffsetX  = 0; 
      this.axisYTitleOffsetY  = -25; 
      this.axisYTitleAnchor = 'middle'; 
      this.axisYTitleFlip = false;
      this.axisYLabelOffsetX = 0;
      this.axisYLabelOffsetY = 0;
      this.axisYOffset = 30;
      this.axisYOnlyInteger = false;
      this.axisYPosition = "start";
      this.axisYScaleMinSpace = 20;
      this.axisYShowGrid = true;
      this.axisYShowLabel = true;
      this.axisYTopLeft = true;
      this.showGridBackground = false;
      this.chartPaddingBottom = 15;
      this.chartPaddingLeft = 15;
      this.chartPaddingRight = 15;
      this.chartPaddingTop = 15;
    }
    /**
     * life cycle, element is removed from the DOM
     */
    //disconnectedCallback() {}
  };
};
export { LrndesignChart };
