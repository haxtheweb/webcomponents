/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { ChartistRender } from "@lrnwebcomponents/chartist-render/chartist-render.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `lrndesign-chart-behaviors`
 * @element lrndesign-chart-behaviors
 * a line chart
 *

 * @extends ChartistRender
 * @see @lrnwebcomponents/chartist-render/chartist-render.js
 * @extends SimpleColors
 * @see @lrnwebcomponents/simple-colors/simple-colors.js
 * @extends SchemaBehaviors
 * @see @lrnwebcomponents/schema-behaviors/schema-behaviors.js
 *
 * @demo ./demo/index.html
 * @demo ./demo/pie.html pie charts
 * @demo ./demo/bar.html bar charts
 * @demo ./demo/line.html line charts
 *
 */
class LrndesignChart extends SimpleColors {
  
//styles function
static get styles() {
return  [
...super.styles,
css`
:host {
  --chartist-color-1: var(--simple-colors-default-theme-red-8);
  --chartist-color-2: var(--simple-colors-default-theme-blue-8);
  --chartist-color-3: var(--simple-colors-default-theme-yellow-8);
  --chartist-color-4: var(--simple-colors-default-theme-purple-8);
  --chartist-color-5: var(--simple-colors-default-theme-green-8);
  --chartist-color-6: var(--simple-colors-default-theme-orange-7);
  --chartist-color-7: var(--simple-colors-default-theme-pink-8);
  --chartist-color-8: var(--simple-colors-default-theme-deep-orange-8);
  --chartist-color-9: var(--simple-colors-default-theme-red-9);
  --chartist-color-10: var(--simple-colors-default-theme-blue-9);
  --chartist-color-11: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-12: var(--simple-colors-default-theme-purple-9);
  --chartist-color-13: var(--simple-colors-default-theme-green-9);
  --chartist-color-14: var(--simple-colors-default-theme-orange-8);
  --chartist-color-15: var(--simple-colors-default-theme-pink-9); }

:host([dark]) {
  --chartist-color-1: var(--simple-colors-default-theme-red-4);
  --chartist-color-2: var(--simple-colors-default-theme-blue-4);
  --chartist-color-3: var(--simple-colors-default-theme-yellow-4);
  --chartist-color-4: var(--simple-colors-default-theme-purple-4);
  --chartist-color-5: var(--simple-colors-default-theme-green-4);
  --chartist-color-6: var(--simple-colors-default-theme-orange-5);
  --chartist-color-7: var(--simple-colors-default-theme-pink-4);
  --chartist-color-8: var(--simple-colors-default-theme-deep-orange-4);
  --chartist-color-9: var(--simple-colors-default-theme-red-3);
  --chartist-color-10: var(--simple-colors-default-theme-blue-3);
  --chartist-color-11: var(--simple-colors-default-theme-yellow-3);
  --chartist-color-12: var(--simple-colors-default-theme-purple-3);
  --chartist-color-13: var(--simple-colors-default-theme-green-3);
  --chartist-color-14: var(--simple-colors-default-theme-orange-4);
  --chartist-color-15: var(--simple-colors-default-theme-pink-3); }

:host([accent-color="red"]) {
  --chartist-color-1: var(--simple-colors-default-theme-red-8);
  --chartist-color-2: var(--simple-colors-default-theme-pink-9);
  --chartist-color-3: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-4: var(--simple-colors-default-theme-purple-8);
  --chartist-color-5: var(--simple-colors-default-theme-orange-9);
  --chartist-color-6: var(--simple-colors-default-theme-red-10);
  --chartist-color-7: var(--simple-colors-default-theme-pink-8);
  --chartist-color-8: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-9: var(--simple-colors-default-theme-purple-10);
  --chartist-color-10: var(--simple-colors-default-theme-orange-8);
  --chartist-color-11: var(--simple-colors-default-theme-red-9);
  --chartist-color-12: var(--simple-colors-default-theme-pink-10);
  --chartist-color-13: var(--simple-colors-default-theme-deep-orange-8);
  --chartist-color-14: var(--simple-colors-default-theme-purple-9);
  --chartist-color-15: var(--simple-colors-default-theme-orange-10); }

:host([dark][accent-color="red"]) {
  --chartist-color-1: var(--simple-colors-default-theme-red-4);
  --chartist-color-2: var(--simple-colors-default-theme-pink-3);
  --chartist-color-3: var(--simple-colors-default-theme-deep-orange-2);
  --chartist-color-4: var(--simple-colors-default-theme-purple-4);
  --chartist-color-5: var(--simple-colors-default-theme-orange-3);
  --chartist-color-6: var(--simple-colors-default-theme-red-2);
  --chartist-color-7: var(--simple-colors-default-theme-pink-4);
  --chartist-color-8: var(--simple-colors-default-theme-deep-orange-3);
  --chartist-color-9: var(--simple-colors-default-theme-purple-2);
  --chartist-color-10: var(--simple-colors-default-theme-orange-4);
  --chartist-color-11: var(--simple-colors-default-theme-red-3);
  --chartist-color-12: var(--simple-colors-default-theme-pink-2);
  --chartist-color-13: var(--simple-colors-default-theme-deep-orange-4);
  --chartist-color-14: var(--simple-colors-default-theme-purple-3);
  --chartist-color-15: var(--simple-colors-default-theme-orange-2); }

:host([accent-color="pink"]) {
  --chartist-color-1: var(--simple-colors-default-theme-pink-8);
  --chartist-color-2: var(--simple-colors-default-theme-purple-9);
  --chartist-color-3: var(--simple-colors-default-theme-red-10);
  --chartist-color-4: var(--simple-colors-default-theme-purple-8);
  --chartist-color-5: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-6: var(--simple-colors-default-theme-pink-10);
  --chartist-color-7: var(--simple-colors-default-theme-purple-8);
  --chartist-color-8: var(--simple-colors-default-theme-red-9);
  --chartist-color-9: var(--simple-colors-default-theme-purple-10);
  --chartist-color-10: var(--simple-colors-default-theme-deep-orange-8);
  --chartist-color-11: var(--simple-colors-default-theme-pink-9);
  --chartist-color-12: var(--simple-colors-default-theme-purple-10);
  --chartist-color-13: var(--simple-colors-default-theme-red-8);
  --chartist-color-14: var(--simple-colors-default-theme-purple-9);
  --chartist-color-15: var(--simple-colors-default-theme-deep-orange-10); }

:host([dark][accent-color="pink"]) {
  --chartist-color-1: var(--simple-colors-default-theme-pink-4);
  --chartist-color-2: var(--simple-colors-default-theme-purple-3);
  --chartist-color-3: var(--simple-colors-default-theme-red-2);
  --chartist-color-4: var(--simple-colors-default-theme-purple-4);
  --chartist-color-5: var(--simple-colors-default-theme-deep-orange-3);
  --chartist-color-6: var(--simple-colors-default-theme-pink-2);
  --chartist-color-7: var(--simple-colors-default-theme-purple-4);
  --chartist-color-8: var(--simple-colors-default-theme-red-3);
  --chartist-color-9: var(--simple-colors-default-theme-purple-2);
  --chartist-color-10: var(--simple-colors-default-theme-deep-orange-4);
  --chartist-color-11: var(--simple-colors-default-theme-pink-3);
  --chartist-color-12: var(--simple-colors-default-theme-purple-2);
  --chartist-color-13: var(--simple-colors-default-theme-red-4);
  --chartist-color-14: var(--simple-colors-default-theme-purple-3);
  --chartist-color-15: var(--simple-colors-default-theme-deep-orange-2); }

:host([accent-color="purple"]) {
  --chartist-color-1: var(--simple-colors-default-theme-purple-8);
  --chartist-color-2: var(--simple-colors-default-theme-deep-purple-9);
  --chartist-color-3: var(--simple-colors-default-theme-pink-10);
  --chartist-color-4: var(--simple-colors-default-theme-indigo-8);
  --chartist-color-5: var(--simple-colors-default-theme-red-9);
  --chartist-color-6: var(--simple-colors-default-theme-purple-10);
  --chartist-color-7: var(--simple-colors-default-theme-deep-purple-8);
  --chartist-color-8: var(--simple-colors-default-theme-pink-9);
  --chartist-color-9: var(--simple-colors-default-theme-indigo-10);
  --chartist-color-10: var(--simple-colors-default-theme-red-8);
  --chartist-color-11: var(--simple-colors-default-theme-purple-9);
  --chartist-color-12: var(--simple-colors-default-theme-deep-purple-10);
  --chartist-color-13: var(--simple-colors-default-theme-pink-8);
  --chartist-color-14: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-15: var(--simple-colors-default-theme-red-10); }

:host([dark][accent-color="purple"]) {
  --chartist-color-1: var(--simple-colors-default-theme-purple-4);
  --chartist-color-2: var(--simple-colors-default-theme-deep-purple-3);
  --chartist-color-3: var(--simple-colors-default-theme-pink-2);
  --chartist-color-4: var(--simple-colors-default-theme-indigo-4);
  --chartist-color-5: var(--simple-colors-default-theme-red-3);
  --chartist-color-6: var(--simple-colors-default-theme-purple-2);
  --chartist-color-7: var(--simple-colors-default-theme-deep-purple-4);
  --chartist-color-8: var(--simple-colors-default-theme-pink-3);
  --chartist-color-9: var(--simple-colors-default-theme-indigo-2);
  --chartist-color-10: var(--simple-colors-default-theme-red-4);
  --chartist-color-11: var(--simple-colors-default-theme-purple-3);
  --chartist-color-12: var(--simple-colors-default-theme-deep-purple-2);
  --chartist-color-13: var(--simple-colors-default-theme-pink-4);
  --chartist-color-14: var(--simple-colors-default-theme-indigo-3);
  --chartist-color-15: var(--simple-colors-default-theme-red-2); }

:host([accent-color="deep-purple"]) {
  --chartist-color-1: var(--simple-colors-default-theme-deep-purple-8);
  --chartist-color-2: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-3: var(--simple-colors-default-theme-purple-10);
  --chartist-color-4: var(--simple-colors-default-theme-blue-8);
  --chartist-color-5: var(--simple-colors-default-theme-pink-9);
  --chartist-color-6: var(--simple-colors-default-theme-deep-purple-10);
  --chartist-color-7: var(--simple-colors-default-theme-indigo-8);
  --chartist-color-8: var(--simple-colors-default-theme-purple-9);
  --chartist-color-9: var(--simple-colors-default-theme-blue-10);
  --chartist-color-10: var(--simple-colors-default-theme-pink-8);
  --chartist-color-11: var(--simple-colors-default-theme-deep-purple-9);
  --chartist-color-12: var(--simple-colors-default-theme-indigo-10);
  --chartist-color-13: var(--simple-colors-default-theme-purple-8);
  --chartist-color-14: var(--simple-colors-default-theme-blue-9);
  --chartist-color-15: var(--simple-colors-default-theme-pink-10); }

:host([dark][accent-color="deep-purple"]) {
  --chartist-color-1: var(--simple-colors-default-theme-deep-purple-4);
  --chartist-color-2: var(--simple-colors-default-theme-indigo-3);
  --chartist-color-3: var(--simple-colors-default-theme-purple-2);
  --chartist-color-4: var(--simple-colors-default-theme-blue-4);
  --chartist-color-5: var(--simple-colors-default-theme-pink-3);
  --chartist-color-6: var(--simple-colors-default-theme-deep-purple-2);
  --chartist-color-7: var(--simple-colors-default-theme-indigo-4);
  --chartist-color-8: var(--simple-colors-default-theme-purple-3);
  --chartist-color-9: var(--simple-colors-default-theme-blue-2);
  --chartist-color-10: var(--simple-colors-default-theme-pink-4);
  --chartist-color-11: var(--simple-colors-default-theme-deep-purple-3);
  --chartist-color-12: var(--simple-colors-default-theme-indigo-2);
  --chartist-color-13: var(--simple-colors-default-theme-purple-4);
  --chartist-color-14: var(--simple-colors-default-theme-blue-3);
  --chartist-color-15: var(--simple-colors-default-theme-pink-2); }

:host([accent-color="indigo"]) {
  --chartist-color-1: var(--simple-colors-default-theme-indigo-8);
  --chartist-color-2: var(--simple-colors-default-theme-blue-9);
  --chartist-color-3: var(--simple-colors-default-theme-deep-purple-10);
  --chartist-color-4: var(--simple-colors-default-theme-light-blue-8);
  --chartist-color-5: var(--simple-colors-default-theme-purple-9);
  --chartist-color-6: var(--simple-colors-default-theme-indigo-10);
  --chartist-color-7: var(--simple-colors-default-theme-blue-8);
  --chartist-color-8: var(--simple-colors-default-theme-deep-purple-9);
  --chartist-color-9: var(--simple-colors-default-theme-light-blue-10);
  --chartist-color-10: var(--simple-colors-default-theme-purple-8);
  --chartist-color-11: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-12: var(--simple-colors-default-theme-blue-10);
  --chartist-color-13: var(--simple-colors-default-theme-deep-purple-8);
  --chartist-color-14: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-15: var(--simple-colors-default-theme-purple-10); }

:host([dark][accent-color="indigo"]) {
  --chartist-color-1: var(--simple-colors-default-theme-indigo-4);
  --chartist-color-2: var(--simple-colors-default-theme-blue-3);
  --chartist-color-3: var(--simple-colors-default-theme-deep-purple-2);
  --chartist-color-4: var(--simple-colors-default-theme-light-blue-4);
  --chartist-color-5: var(--simple-colors-default-theme-purple-3);
  --chartist-color-6: var(--simple-colors-default-theme-indigo-2);
  --chartist-color-7: var(--simple-colors-default-theme-blue-4);
  --chartist-color-8: var(--simple-colors-default-theme-deep-purple-3);
  --chartist-color-9: var(--simple-colors-default-theme-light-blue-2);
  --chartist-color-10: var(--simple-colors-default-theme-purple-4);
  --chartist-color-11: var(--simple-colors-default-theme-indigo-3);
  --chartist-color-12: var(--simple-colors-default-theme-blue-2);
  --chartist-color-13: var(--simple-colors-default-theme-deep-purple-4);
  --chartist-color-14: var(--simple-colors-default-theme-light-blue-3);
  --chartist-color-15: var(--simple-colors-default-theme-purple-2); }

:host([accent-color="blue"]) {
  --chartist-color-1: var(--simple-colors-default-theme-blue-8);
  --chartist-color-2: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-3: var(--simple-colors-default-theme-indigo-10);
  --chartist-color-4: var(--simple-colors-default-theme-cyan-8);
  --chartist-color-5: var(--simple-colors-default-theme-deep-purple-9);
  --chartist-color-6: var(--simple-colors-default-theme-blue-10);
  --chartist-color-7: var(--simple-colors-default-theme-light-blue-8);
  --chartist-color-8: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-9: var(--simple-colors-default-theme-cyan-10);
  --chartist-color-10: var(--simple-colors-default-theme-deep-purple-8);
  --chartist-color-11: var(--simple-colors-default-theme-blue-9);
  --chartist-color-12: var(--simple-colors-default-theme-light-blue-10);
  --chartist-color-13: var(--simple-colors-default-theme-indigo-8);
  --chartist-color-14: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-15: var(--simple-colors-default-theme-deep-purple-10); }

:host([dark][accent-color="blue"]) {
  --chartist-color-1: var(--simple-colors-default-theme-blue-4);
  --chartist-color-2: var(--simple-colors-default-theme-light-blue-3);
  --chartist-color-3: var(--simple-colors-default-theme-indigo-2);
  --chartist-color-4: var(--simple-colors-default-theme-cyan-4);
  --chartist-color-5: var(--simple-colors-default-theme-deep-purple-3);
  --chartist-color-6: var(--simple-colors-default-theme-blue-2);
  --chartist-color-7: var(--simple-colors-default-theme-light-blue-4);
  --chartist-color-8: var(--simple-colors-default-theme-indigo-3);
  --chartist-color-9: var(--simple-colors-default-theme-cyan-2);
  --chartist-color-10: var(--simple-colors-default-theme-deep-purple-4);
  --chartist-color-11: var(--simple-colors-default-theme-blue-3);
  --chartist-color-12: var(--simple-colors-default-theme-light-blue-2);
  --chartist-color-13: var(--simple-colors-default-theme-indigo-4);
  --chartist-color-14: var(--simple-colors-default-theme-cyan-3);
  --chartist-color-15: var(--simple-colors-default-theme-deep-purple-2); }

:host([accent-color="light-blue"]) {
  --chartist-color-1: var(--simple-colors-default-theme-light-blue-8);
  --chartist-color-2: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-3: var(--simple-colors-default-theme-blue-10);
  --chartist-color-4: var(--simple-colors-default-theme-teal-8);
  --chartist-color-5: var(--simple-colors-default-theme-indigo-9);
  --chartist-color-6: var(--simple-colors-default-theme-light-blue-10);
  --chartist-color-7: var(--simple-colors-default-theme-cyan-8);
  --chartist-color-8: var(--simple-colors-default-theme-blue-9);
  --chartist-color-9: var(--simple-colors-default-theme-teal-10);
  --chartist-color-10: var(--simple-colors-default-theme-indigo-8);
  --chartist-color-11: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-12: var(--simple-colors-default-theme-cyan-10);
  --chartist-color-13: var(--simple-colors-default-theme-blue-8);
  --chartist-color-14: var(--simple-colors-default-theme-teal-9);
  --chartist-color-15: var(--simple-colors-default-theme-indigo-10); }

:host([dark][accent-color="light-blue"]) {
  --chartist-color-1: var(--simple-colors-default-theme-light-blue-4);
  --chartist-color-2: var(--simple-colors-default-theme-cyan-3);
  --chartist-color-3: var(--simple-colors-default-theme-blue-2);
  --chartist-color-4: var(--simple-colors-default-theme-teal-4);
  --chartist-color-5: var(--simple-colors-default-theme-indigo-3);
  --chartist-color-6: var(--simple-colors-default-theme-light-blue-2);
  --chartist-color-7: var(--simple-colors-default-theme-cyan-4);
  --chartist-color-8: var(--simple-colors-default-theme-blue-3);
  --chartist-color-9: var(--simple-colors-default-theme-teal-2);
  --chartist-color-10: var(--simple-colors-default-theme-indigo-4);
  --chartist-color-11: var(--simple-colors-default-theme-light-blue-3);
  --chartist-color-12: var(--simple-colors-default-theme-cyan-2);
  --chartist-color-13: var(--simple-colors-default-theme-blue-4);
  --chartist-color-14: var(--simple-colors-default-theme-teal-3);
  --chartist-color-15: var(--simple-colors-default-theme-indigo-2); }

:host([accent-color="cyan"]) {
  --chartist-color-1: var(--simple-colors-default-theme-cyan-8);
  --chartist-color-2: var(--simple-colors-default-theme-teal-9);
  --chartist-color-3: var(--simple-colors-default-theme-light-blue-10);
  --chartist-color-4: var(--simple-colors-default-theme-green-8);
  --chartist-color-5: var(--simple-colors-default-theme-blue-9);
  --chartist-color-6: var(--simple-colors-default-theme-cyan-10);
  --chartist-color-7: var(--simple-colors-default-theme-teal-8);
  --chartist-color-8: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-9: var(--simple-colors-default-theme-green-10);
  --chartist-color-10: var(--simple-colors-default-theme-blue-8);
  --chartist-color-11: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-12: var(--simple-colors-default-theme-teal-10);
  --chartist-color-13: var(--simple-colors-default-theme-light-blue-8);
  --chartist-color-14: var(--simple-colors-default-theme-green-9);
  --chartist-color-15: var(--simple-colors-default-theme-blue-10); }

:host([dark][accent-color="cyan"]) {
  --chartist-color-1: var(--simple-colors-default-theme-cyan-4);
  --chartist-color-2: var(--simple-colors-default-theme-teal-3);
  --chartist-color-3: var(--simple-colors-default-theme-light-blue-2);
  --chartist-color-4: var(--simple-colors-default-theme-green-4);
  --chartist-color-5: var(--simple-colors-default-theme-blue-3);
  --chartist-color-6: var(--simple-colors-default-theme-cyan-2);
  --chartist-color-7: var(--simple-colors-default-theme-teal-4);
  --chartist-color-8: var(--simple-colors-default-theme-light-blue-3);
  --chartist-color-9: var(--simple-colors-default-theme-green-2);
  --chartist-color-10: var(--simple-colors-default-theme-blue-4);
  --chartist-color-11: var(--simple-colors-default-theme-cyan-3);
  --chartist-color-12: var(--simple-colors-default-theme-teal-2);
  --chartist-color-13: var(--simple-colors-default-theme-light-blue-4);
  --chartist-color-14: var(--simple-colors-default-theme-green-3);
  --chartist-color-15: var(--simple-colors-default-theme-blue-2); }

:host([accent-color="teal"]) {
  --chartist-color-1: var(--simple-colors-default-theme-teal-8);
  --chartist-color-2: var(--simple-colors-default-theme-green-9);
  --chartist-color-3: var(--simple-colors-default-theme-cyan-10);
  --chartist-color-4: var(--simple-colors-default-theme-light-green-8);
  --chartist-color-5: var(--simple-colors-default-theme-light-blue-9);
  --chartist-color-6: var(--simple-colors-default-theme-teal-10);
  --chartist-color-7: var(--simple-colors-default-theme-green-8);
  --chartist-color-8: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-9: var(--simple-colors-default-theme-light-green-10);
  --chartist-color-10: var(--simple-colors-default-theme-light-blue-8);
  --chartist-color-11: var(--simple-colors-default-theme-teal-9);
  --chartist-color-12: var(--simple-colors-default-theme-green-10);
  --chartist-color-13: var(--simple-colors-default-theme-cyan-8);
  --chartist-color-14: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-15: var(--simple-colors-default-theme-light-blue-10); }

:host([dark][accent-color="teal"]) {
  --chartist-color-1: var(--simple-colors-default-theme-teal-4);
  --chartist-color-2: var(--simple-colors-default-theme-green-3);
  --chartist-color-3: var(--simple-colors-default-theme-cyan-2);
  --chartist-color-4: var(--simple-colors-default-theme-light-green-4);
  --chartist-color-5: var(--simple-colors-default-theme-light-blue-3);
  --chartist-color-6: var(--simple-colors-default-theme-teal-2);
  --chartist-color-7: var(--simple-colors-default-theme-green-4);
  --chartist-color-8: var(--simple-colors-default-theme-cyan-3);
  --chartist-color-9: var(--simple-colors-default-theme-light-green-2);
  --chartist-color-10: var(--simple-colors-default-theme-light-blue-4);
  --chartist-color-11: var(--simple-colors-default-theme-teal-3);
  --chartist-color-12: var(--simple-colors-default-theme-green-2);
  --chartist-color-13: var(--simple-colors-default-theme-cyan-4);
  --chartist-color-14: var(--simple-colors-default-theme-light-green-3);
  --chartist-color-15: var(--simple-colors-default-theme-light-blue-2); }

:host([accent-color="green"]) {
  --chartist-color-1: var(--simple-colors-default-theme-green-8);
  --chartist-color-2: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-3: var(--simple-colors-default-theme-teal-10);
  --chartist-color-4: var(--simple-colors-default-theme-lime-8);
  --chartist-color-5: var(--simple-colors-default-theme-cyan-9);
  --chartist-color-6: var(--simple-colors-default-theme-green-10);
  --chartist-color-7: var(--simple-colors-default-theme-light-green-8);
  --chartist-color-8: var(--simple-colors-default-theme-teal-9);
  --chartist-color-9: var(--simple-colors-default-theme-lime-10);
  --chartist-color-10: var(--simple-colors-default-theme-cyan-8);
  --chartist-color-11: var(--simple-colors-default-theme-green-9);
  --chartist-color-12: var(--simple-colors-default-theme-light-green-10);
  --chartist-color-13: var(--simple-colors-default-theme-teal-8);
  --chartist-color-14: var(--simple-colors-default-theme-lime-9);
  --chartist-color-15: var(--simple-colors-default-theme-cyan-10); }

:host([dark][accent-color="green"]) {
  --chartist-color-1: var(--simple-colors-default-theme-green-4);
  --chartist-color-2: var(--simple-colors-default-theme-light-green-3);
  --chartist-color-3: var(--simple-colors-default-theme-teal-2);
  --chartist-color-4: var(--simple-colors-default-theme-lime-4);
  --chartist-color-5: var(--simple-colors-default-theme-cyan-3);
  --chartist-color-6: var(--simple-colors-default-theme-green-2);
  --chartist-color-7: var(--simple-colors-default-theme-light-green-4);
  --chartist-color-8: var(--simple-colors-default-theme-teal-3);
  --chartist-color-9: var(--simple-colors-default-theme-lime-2);
  --chartist-color-10: var(--simple-colors-default-theme-cyan-4);
  --chartist-color-11: var(--simple-colors-default-theme-green-3);
  --chartist-color-12: var(--simple-colors-default-theme-light-green-2);
  --chartist-color-13: var(--simple-colors-default-theme-teal-4);
  --chartist-color-14: var(--simple-colors-default-theme-lime-3);
  --chartist-color-15: var(--simple-colors-default-theme-cyan-2); }

:host([accent-color="light-green"]) {
  --chartist-color-1: var(--simple-colors-default-theme-light-green-8);
  --chartist-color-2: var(--simple-colors-default-theme-lime-9);
  --chartist-color-3: var(--simple-colors-default-theme-green-10);
  --chartist-color-4: var(--simple-colors-default-theme-amber-8);
  --chartist-color-5: var(--simple-colors-default-theme-teal-9);
  --chartist-color-6: var(--simple-colors-default-theme-light-green-10);
  --chartist-color-7: var(--simple-colors-default-theme-lime-8);
  --chartist-color-8: var(--simple-colors-default-theme-green-9);
  --chartist-color-9: var(--simple-colors-default-theme-amber-10);
  --chartist-color-10: var(--simple-colors-default-theme-teal-8);
  --chartist-color-11: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-12: var(--simple-colors-default-theme-lime-10);
  --chartist-color-13: var(--simple-colors-default-theme-green-8);
  --chartist-color-14: var(--simple-colors-default-theme-amber-9);
  --chartist-color-15: var(--simple-colors-default-theme-teal-10); }

:host([dark][accent-color="light-green"]) {
  --chartist-color-1: var(--simple-colors-default-theme-light-green-4);
  --chartist-color-2: var(--simple-colors-default-theme-lime-3);
  --chartist-color-3: var(--simple-colors-default-theme-green-2);
  --chartist-color-4: var(--simple-colors-default-theme-amber-4);
  --chartist-color-5: var(--simple-colors-default-theme-teal-3);
  --chartist-color-6: var(--simple-colors-default-theme-light-green-2);
  --chartist-color-7: var(--simple-colors-default-theme-lime-4);
  --chartist-color-8: var(--simple-colors-default-theme-green-3);
  --chartist-color-9: var(--simple-colors-default-theme-amber-2);
  --chartist-color-10: var(--simple-colors-default-theme-teal-4);
  --chartist-color-11: var(--simple-colors-default-theme-light-green-3);
  --chartist-color-12: var(--simple-colors-default-theme-lime-2);
  --chartist-color-13: var(--simple-colors-default-theme-green-4);
  --chartist-color-14: var(--simple-colors-default-theme-amber-3);
  --chartist-color-15: var(--simple-colors-default-theme-teal-2); }

:host([accent-color="lime"]) {
  --chartist-color-1: var(--simple-colors-default-theme-lime-8);
  --chartist-color-2: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-3: var(--simple-colors-default-theme-light-green-10);
  --chartist-color-4: var(--simple-colors-default-theme-orange-8);
  --chartist-color-5: var(--simple-colors-default-theme-green-9);
  --chartist-color-6: var(--simple-colors-default-theme-lime-10);
  --chartist-color-7: var(--simple-colors-default-theme-yellow-8);
  --chartist-color-8: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-9: var(--simple-colors-default-theme-orange-10);
  --chartist-color-10: var(--simple-colors-default-theme-green-8);
  --chartist-color-11: var(--simple-colors-default-theme-lime-9);
  --chartist-color-12: var(--simple-colors-default-theme-yellow-10);
  --chartist-color-13: var(--simple-colors-default-theme-light-green-8);
  --chartist-color-14: var(--simple-colors-default-theme-orange-9);
  --chartist-color-15: var(--simple-colors-default-theme-green-10); }

:host([dark][accent-color="lime"]) {
  --chartist-color-1: var(--simple-colors-default-theme-lime-4);
  --chartist-color-2: var(--simple-colors-default-theme-yellow-3);
  --chartist-color-3: var(--simple-colors-default-theme-light-green-2);
  --chartist-color-4: var(--simple-colors-default-theme-orange-4);
  --chartist-color-5: var(--simple-colors-default-theme-green-3);
  --chartist-color-6: var(--simple-colors-default-theme-lime-2);
  --chartist-color-7: var(--simple-colors-default-theme-yellow-4);
  --chartist-color-8: var(--simple-colors-default-theme-light-green-3);
  --chartist-color-9: var(--simple-colors-default-theme-orange-2);
  --chartist-color-10: var(--simple-colors-default-theme-green-4);
  --chartist-color-11: var(--simple-colors-default-theme-lime-3);
  --chartist-color-12: var(--simple-colors-default-theme-yellow-2);
  --chartist-color-13: var(--simple-colors-default-theme-light-green-4);
  --chartist-color-14: var(--simple-colors-default-theme-orange-3);
  --chartist-color-15: var(--simple-colors-default-theme-green-2); }

:host([accent-color="yellow"]) {
  --chartist-color-1: var(--simple-colors-default-theme-yellow-8);
  --chartist-color-2: var(--simple-colors-default-theme-amber-9);
  --chartist-color-3: var(--simple-colors-default-theme-lime-10);
  --chartist-color-4: var(--simple-colors-default-theme-deep-orange-8);
  --chartist-color-5: var(--simple-colors-default-theme-light-green-9);
  --chartist-color-6: var(--simple-colors-default-theme-yellow-10);
  --chartist-color-7: var(--simple-colors-default-theme-amber-8);
  --chartist-color-8: var(--simple-colors-default-theme-lime-9);
  --chartist-color-9: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-10: var(--simple-colors-default-theme-light-green-8);
  --chartist-color-11: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-12: var(--simple-colors-default-theme-amber-10);
  --chartist-color-13: var(--simple-colors-default-theme-lime-8);
  --chartist-color-14: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-15: var(--simple-colors-default-theme-light-green-10); }

:host([dark][accent-color="yellow"]) {
  --chartist-color-1: var(--simple-colors-default-theme-yellow-4);
  --chartist-color-2: var(--simple-colors-default-theme-amber-3);
  --chartist-color-3: var(--simple-colors-default-theme-lime-2);
  --chartist-color-4: var(--simple-colors-default-theme-deep-orange-4);
  --chartist-color-5: var(--simple-colors-default-theme-light-green-3);
  --chartist-color-6: var(--simple-colors-default-theme-yellow-2);
  --chartist-color-7: var(--simple-colors-default-theme-amber-4);
  --chartist-color-8: var(--simple-colors-default-theme-lime-3);
  --chartist-color-9: var(--simple-colors-default-theme-deep-orange-2);
  --chartist-color-10: var(--simple-colors-default-theme-light-green-4);
  --chartist-color-11: var(--simple-colors-default-theme-yellow-3);
  --chartist-color-12: var(--simple-colors-default-theme-amber-2);
  --chartist-color-13: var(--simple-colors-default-theme-lime-4);
  --chartist-color-14: var(--simple-colors-default-theme-deep-orange-3);
  --chartist-color-15: var(--simple-colors-default-theme-light-green-2); }

:host([accent-color="amber"]) {
  --chartist-color-1: var(--simple-colors-default-theme-amber-8);
  --chartist-color-2: var(--simple-colors-default-theme-orange-9);
  --chartist-color-3: var(--simple-colors-default-theme-yellow-10);
  --chartist-color-4: var(--simple-colors-default-theme-red-8);
  --chartist-color-5: var(--simple-colors-default-theme-lime-9);
  --chartist-color-6: var(--simple-colors-default-theme-amber-10);
  --chartist-color-7: var(--simple-colors-default-theme-orange-8);
  --chartist-color-8: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-9: var(--simple-colors-default-theme-red-10);
  --chartist-color-10: var(--simple-colors-default-theme-lime-8);
  --chartist-color-11: var(--simple-colors-default-theme-amber-9);
  --chartist-color-12: var(--simple-colors-default-theme-orange-10);
  --chartist-color-13: var(--simple-colors-default-theme-yellow-8);
  --chartist-color-14: var(--simple-colors-default-theme-red-9);
  --chartist-color-15: var(--simple-colors-default-theme-lime-10); }

:host([dark][accent-color="amber"]) {
  --chartist-color-1: var(--simple-colors-default-theme-amber-4);
  --chartist-color-2: var(--simple-colors-default-theme-orange-3);
  --chartist-color-3: var(--simple-colors-default-theme-yellow-2);
  --chartist-color-4: var(--simple-colors-default-theme-red-4);
  --chartist-color-5: var(--simple-colors-default-theme-lime-3);
  --chartist-color-6: var(--simple-colors-default-theme-amber-2);
  --chartist-color-7: var(--simple-colors-default-theme-orange-4);
  --chartist-color-8: var(--simple-colors-default-theme-yellow-3);
  --chartist-color-9: var(--simple-colors-default-theme-red-2);
  --chartist-color-10: var(--simple-colors-default-theme-lime-4);
  --chartist-color-11: var(--simple-colors-default-theme-amber-3);
  --chartist-color-12: var(--simple-colors-default-theme-orange-2);
  --chartist-color-13: var(--simple-colors-default-theme-yellow-4);
  --chartist-color-14: var(--simple-colors-default-theme-red-3);
  --chartist-color-15: var(--simple-colors-default-theme-lime-2); }

:host([accent-color="orange"]) {
  --chartist-color-1: var(--simple-colors-default-theme-orange-8);
  --chartist-color-2: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-3: var(--simple-colors-default-theme-amber-10);
  --chartist-color-4: var(--simple-colors-default-theme-pink-8);
  --chartist-color-5: var(--simple-colors-default-theme-yellow-9);
  --chartist-color-6: var(--simple-colors-default-theme-orange-10);
  --chartist-color-7: var(--simple-colors-default-theme-deep-orange-8);
  --chartist-color-8: var(--simple-colors-default-theme-amber-9);
  --chartist-color-9: var(--simple-colors-default-theme-pink-10);
  --chartist-color-10: var(--simple-colors-default-theme-yellow-8);
  --chartist-color-11: var(--simple-colors-default-theme-orange-9);
  --chartist-color-12: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-13: var(--simple-colors-default-theme-amber-8);
  --chartist-color-14: var(--simple-colors-default-theme-pink-9);
  --chartist-color-15: var(--simple-colors-default-theme-yellow-10); }

:host([dark][accent-color="orange"]) {
  --chartist-color-1: var(--simple-colors-default-theme-orange-4);
  --chartist-color-2: var(--simple-colors-default-theme-deep-orange-3);
  --chartist-color-3: var(--simple-colors-default-theme-amber-2);
  --chartist-color-4: var(--simple-colors-default-theme-pink-4);
  --chartist-color-5: var(--simple-colors-default-theme-yellow-3);
  --chartist-color-6: var(--simple-colors-default-theme-orange-2);
  --chartist-color-7: var(--simple-colors-default-theme-deep-orange-4);
  --chartist-color-8: var(--simple-colors-default-theme-amber-3);
  --chartist-color-9: var(--simple-colors-default-theme-pink-2);
  --chartist-color-10: var(--simple-colors-default-theme-yellow-4);
  --chartist-color-11: var(--simple-colors-default-theme-orange-3);
  --chartist-color-12: var(--simple-colors-default-theme-deep-orange-2);
  --chartist-color-13: var(--simple-colors-default-theme-amber-4);
  --chartist-color-14: var(--simple-colors-default-theme-pink-3);
  --chartist-color-15: var(--simple-colors-default-theme-yellow-2); }

:host([accent-color="deep-orange"]) {
  --chartist-color-1: var(--simple-colors-default-theme-deep-orange-8);
  --chartist-color-2: var(--simple-colors-default-theme-red-9);
  --chartist-color-3: var(--simple-colors-default-theme-orange-10);
  --chartist-color-4: var(--simple-colors-default-theme-purple-8);
  --chartist-color-5: var(--simple-colors-default-theme-amber-9);
  --chartist-color-6: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-7: var(--simple-colors-default-theme-red-8);
  --chartist-color-8: var(--simple-colors-default-theme-orange-9);
  --chartist-color-9: var(--simple-colors-default-theme-purple-10);
  --chartist-color-10: var(--simple-colors-default-theme-amber-8);
  --chartist-color-11: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-12: var(--simple-colors-default-theme-red-10);
  --chartist-color-13: var(--simple-colors-default-theme-orange-8);
  --chartist-color-14: var(--simple-colors-default-theme-purple-9);
  --chartist-color-15: var(--simple-colors-default-theme-amber-10); }

:host([dark][accent-color="deep-orange"]) {
  --chartist-color-1: var(--simple-colors-default-theme-deep-orange-4);
  --chartist-color-2: var(--simple-colors-default-theme-red-3);
  --chartist-color-3: var(--simple-colors-default-theme-orange-2);
  --chartist-color-4: var(--simple-colors-default-theme-purple-4);
  --chartist-color-5: var(--simple-colors-default-theme-amber-3);
  --chartist-color-6: var(--simple-colors-default-theme-deep-orange-2);
  --chartist-color-7: var(--simple-colors-default-theme-red-4);
  --chartist-color-8: var(--simple-colors-default-theme-orange-3);
  --chartist-color-9: var(--simple-colors-default-theme-purple-2);
  --chartist-color-10: var(--simple-colors-default-theme-amber-4);
  --chartist-color-11: var(--simple-colors-default-theme-deep-orange-3);
  --chartist-color-12: var(--simple-colors-default-theme-red-2);
  --chartist-color-13: var(--simple-colors-default-theme-orange-4);
  --chartist-color-14: var(--simple-colors-default-theme-purple-3);
  --chartist-color-15: var(--simple-colors-default-theme-amber-2); }

:host([accent-color="brown"]) {
  --chartist-color-1: var(--simple-colors-default-theme-brown-8);
  --chartist-color-2: var(--simple-colors-default-theme-red-9);
  --chartist-color-3: var(--simple-colors-default-theme-deep-orange-10);
  --chartist-color-4: var(--simple-colors-default-theme-brown-11);
  --chartist-color-5: var(--simple-colors-default-theme-red-12);
  --chartist-color-6: var(--simple-colors-default-theme-deep-orange-8);
  --chartist-color-7: var(--simple-colors-default-theme-brown-9);
  --chartist-color-8: var(--simple-colors-default-theme-red-10);
  --chartist-color-9: var(--simple-colors-default-theme-deep-orange-11);
  --chartist-color-10: var(--simple-colors-default-theme-brown-12);
  --chartist-color-11: var(--simple-colors-default-theme-red-8);
  --chartist-color-12: var(--simple-colors-default-theme-deep-orange-9);
  --chartist-color-13: var(--simple-colors-default-theme-brown-10);
  --chartist-color-14: var(--simple-colors-default-theme-red-11);
  --chartist-color-15: var(--simple-colors-default-theme-deep-orange-12); }

:host([dark][accent-color="brown"]) {
  --chartist-color-1: var(--simple-colors-default-theme-brown-4);
  --chartist-color-2: var(--simple-colors-default-theme-red-3);
  --chartist-color-3: var(--simple-colors-default-theme-deep-orange-2);
  --chartist-color-4: var(--simple-colors-default-theme-brown-1);
  --chartist-color-5: var(--simple-colors-default-theme-red-0);
  --chartist-color-6: var(--simple-colors-default-theme-deep-orange-4);
  --chartist-color-7: var(--simple-colors-default-theme-brown-3);
  --chartist-color-8: var(--simple-colors-default-theme-red-2);
  --chartist-color-9: var(--simple-colors-default-theme-deep-orange-1);
  --chartist-color-10: var(--simple-colors-default-theme-brown-0);
  --chartist-color-11: var(--simple-colors-default-theme-red-4);
  --chartist-color-12: var(--simple-colors-default-theme-deep-orange-3);
  --chartist-color-13: var(--simple-colors-default-theme-brown-2);
  --chartist-color-14: var(--simple-colors-default-theme-red-1);
  --chartist-color-15: var(--simple-colors-default-theme-deep-orange-0); }

:host {
  display: block; }
`
];
}

// render function
render() {
return html`

<iron-ajax
  auto
  handle-as="text"
  url="${this.dataSource}"
  @response="${this.handleResponse}"
></iron-ajax>
<chartist-render
  id="chartist"
  .type="${this.type}"
  .scale="${this.scale}"
  .chart-title="${this.chartTitle}"
  .chart-desc="${this.chartDesc}"
  .data="${this.data}"
  .responsive-options="${this.responsiveOptions}"
></chartist-render>`;
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
        "property": "data-source",
        "title": "CSV File",
        "description": "The URL for your CSV file.",
        "inputMethod": "textfield",
        "icon": "link",
        "validationType": "url",
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
        "inputMethod": "textfield",
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
  "dataSource": {
    "type": String,
    "attribute": "data-source"
  },
  /**
   * Fixed height for the chart as a string (i.e. '100px' or '50%').
   */
  "height": {
    "type": String
  },
  /**
   * Raw data pulled in from the csv file.
   */
  "rawData": {
    "type": String,
    "attribute": "raw-data"
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
    let checkReady = setInterval(() => {
      if (this.__dataReady) {
        this.makeChart();
        clearInterval(checkReady);
      }
    }, 1);
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
      axisYshowLabel: {
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
          description: "Horizontal position of the X-Axis's label.",
          inputMethod: "number"
        },
        {
          property: "axisXLabelOffsetY",
          title: "X-Axis Label (vertical offset)",
          description: "Vertical position of the X-Axis's label.",
          inputMethod: "number"
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
        }
      ]
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      /**
       * Fired when data source changes.
       *
       * @event data-source-changed
       * @param {string} dataSource data source of the chart
       *
       */
      if (propName === "dataSource")
        this.dispatchEvent(
          new CustomEvent("data-source-changed", {
            detail: this
          })
        );
      /**
       * Fired when raw data changes.
       *
       * @event raw-data-changed
       * @param {string} rawData raw CSV data for the chart which will be converted into an array
       *
       */
      if (propName === "rawData")
        this.dispatchEvent(
          new CustomEvent("raw-data-changed", {
            detail: this
          })
        );
      if (this.__dataReady) {
        this.makeChart();
      }
    });
  }

  /**
   * refreshes the chart
   */
  makeChart() {
    let chart = this.shadowRoot.querySelector("#chartist");
    if (chart) {
      chart.options = this._getOptions();
      /**
       * Fired when chart options change.
       *
       * @event options-changed
       * @param {object} chart options
       *
       */
      this.dispatchEvent(new CustomEvent("options-changed", { detail: this }));
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
   * Sets properties for chart.
   * Specific chart types can extend this function
   * with type-specific properties.
   */
  setProperties() {
    this.chartTitle = null;
    this.chartDesc = null;
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
    this.axisYLabelOffsetX = 0;
    this.axisYLabelOffsetY = 0;
    this.axisYOffset = 30;
    this.axisYOnlyInteger = false;
    this.axisYPosition = "start";
    this.axisYScaleMinSpace = 20;
    this.axisYShowGrid = true;
    this.axisYshowLabel = true;
    this.axisYTopLeft = true;
    this.showGridBackground = false;
    this.chartPaddingBottom = 5;
    this.chartPaddingLeft = 10;
    this.chartPaddingRight = 15;
    this.chartPaddingTop = 15;
  }

  /**
   * Convert from csv text to an array in the table function
   * @param {event} e event data
   */
  handleResponse(e) {
    this.rawData = e.detail.response;
    let raw = this.CSVtoArray(this.rawData);
    this.data = {
      labels: raw[0],
      series: this.type !== "pie" ? raw.slice(1, raw.length) : raw[1]
    };
    this.__dataReady = true;
  }

  /**
   * override this with type-specific options
   * @returns {object} options
   */
  _getOptions() {
    return {
      reverseData: this.reverseData
    };
  }

  /**
   * override this with type-specific options
   * @returns {object} options specific to both bar and line charts
   */
  _getLineBarOptions() {
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
        bottom: this.chartPaddingBottom,
        left: this.chartPaddingLeft,
        right: this.chartPaddingRight,
        top: this.chartPaddingTop
      }
    };
  }

  /**
   * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
   * @param {string} text csv data
   * @returns {array} chart data
   */
  CSVtoArray(text) {
    let p = "",
      row = [""],
      ret = [row],
      i = 0,
      r = 0,
      s = !0,
      l;
    for (l in text) {
      l = text[l];
      if ('"' === l) {
        if (s && l === p) row[i] += l;
        s = !s;
      } else if ("," === l && s) {
        if (row[i].trim().match(/^\d+$/m) !== null)
          row[i] = parseInt(row[i].trim());
        l = row[++i] = "";
      } else if ("\n" === l && s) {
        if ("\r" === p) row[i] = row[i].slice(0, -1);
        if (row[i].trim().match(/^\d+$/m) !== null)
          row[i] = parseInt(row[i].trim());
        row = ret[++r] = [(l = "")];
        i = 0;
      } else row[i] += l;
      p = l;
    }
    if (row[i].trim().match(/^\d+$/m) !== null)
      row[i] = parseInt(row[i].trim());
    return ret;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(LrndesignChart.tag, LrndesignChart);
export { LrndesignChart };
