/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/chartist-render/chartist-render.js";
/**
 * `progress-donut`
 * @element progress-donut
 * shows progress in as a rounded shape w/ hollow middle
 *

 * @extends ChartistRender
 * @see @lrnwebcomponents/chartist-render/chartist-render.js
 * @extends SimpleColors
 * @see @lrnwebcomponents/simple-colors/simple-colors.js
 * @extends SchemaBehaviors
 * @see @lrnwebcomponents/schema-behaviors/schema-behaviors.js
 *
 * @demo demo/index.html
 */
class ProgressDonut extends SchemaBehaviors(SimpleColors) {
  
  //styles function
  static get styles() {
    return  [
      
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
  overflow: visible;
  display: flex;
  margin: 15px; }

:host #wrapper {
  margin: 0 auto;
  position: relative;
  padding-top: 100%;
  display: flex;
  align-items: stretch;
  justify-content: space-around; }

:host #wrapper > * {
  position: absolute; }

:host #chart {
  left: 0;
  top: 0;
  flex: 1 1 100%; }

:host #wrapper,
:host #chart {
  width: 100%; }

:host #image {
  left: 15%;
  top: 15%;
  width: 70%;
  height: 70%;
  -webkit-clip-path: circle(50% at 50% 50%);
  clip-path: circle(50% at 50% 50%); }
      `
    ];
  }
  // render function
  render() {
    return html`

<div id="wrapper">
  <img
    id="image"
    alt="${this.imageAlt}"
    aria-hidden="true"
    src="${this.imageSrc}"
    ?hidden="${!this.imageSrc || this.imageSrc == ''}"
  />
  <chartist-render
    id="chart"
    type="pie"
    scale="ct-square"
    .chart-title="${this.title}"
    .chart-desc="${this.desc}"
    @chartist-render-draw="${this._onCreated}"
  >
  </chartist-render>
</div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Progress Donut",
    "description": "The user will be able to see this for selection in a UI.",
    "icon": "av:play-circle-filled",
    "color": "grey",
    "groups": ["Video", "Media"],
    "handles": [
      {
        "type": "image",
        "url": "source"
      }
    ],
    "meta": {
      "author": "Your organization on github"
    }
  },
  "settings": {
    "quick": [
      {
        "property": "animated",
        "title": "Animated",
        "description": "Whether progress animates on first load",
        "inputMethod": "boolean"
      },
      {
        "property": "complete",
        "title": "Complete",
        "description": "An array of completed values.",
        "inputMethod": "array",
        "properties": [
          {
            "title": "Number",
            "description": "Completed number.",
            "inputMethod": "number"
          }
        ]
      },
      {
        "property": "total",
        "title": "Total",
        "description": "Total when all items are complete.",
        "inputMethod": "number"
      },
      {
        "property": "startAngle",
        "title": "Start Angle",
        "description": "Donut angle where progress starts",
        "inputMethod": "number"
      }
    ],
    "configure": [
      {
        "property": "title",
        "title": "Title",
        "description": "The title of the element",
        "inputMethod": "textfield",
        "icon": "editor:title"
      },
      {
        "property": "desc",
        "title": "Description",
        "description": "Accessible long description",
        "inputMethod": "textfield"
      },
      {
        "property": "imageSrc",
        "title": "Image Source",
        "description": "Source of image inside donut.",
        "inputMethod": "haxupload",
        "icon": "link",
        "validationType": "url"
      },
      {
        "property": "imageAlt",
        "title": "Image Alt Text",
        "description": "Alt text for image.",
        "inputMethod": "alt"
      },
      {
        "property": "animated",
        "title": "Animated",
        "description": "Whether progress animates on first load",
        "inputMethod": "boolean"
      },
      {
        "property": "complete",
        "title": "Complete",
        "description": "An array of completed values.",
        "inputMethod": "array"
      },
      {
        "property": "total",
        "title": "Total",
        "description": "Total when all items are complete.",
        "inputMethod": "arrnumberay"
      },
      {
        "property": "startAngle",
        "title": "Start Angle",
        "description": "Donut angle where progress starts",
        "inputMethod": "number"
      }
    ],
    "advanced": []
  }
}
;
  }
  // properties available to the custom element for data binding
    static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * Whether progress animates on first load
   */
  "animated": {
    "type": Boolean
  },
  /**
   * An array of completed values
   */
  "complete": {
    "type": Array
  },
  /**
   * Accessible long description
   */
  "desc": {
    "type": String
  },
  /**
   * Source of image in the center of the object.
   */
  "imageSrc": {
    "attribute": "image-src",
    "type": String,
    "reflect": true
  },
  /**
   * Alt text for image.
   */
  "imageAlt": {
    "attribute": "image-alt",
    "type": String,
    "reflect": true
  },
  /**
   * Donut angle where progress starts
   */
  "startAngle": {
    "attribute": "start-angle",
    "type": Number
  },
  /**
   * Title of donut
   */
  "title": {
    "type": String
  },
  /**
   * Array of incomplete values
   */
  "total": {
    "type": Number
  }
}
;
  }

  constructor() {
    super();
    this.animated = false;
    this.accentColor = "grey";
    this.dark = false;
    this.complete = [];
    this.desc = "";
    this.title = "";
    this.imageSrc = "";
    this.imageAlt = "";
    this.total = 100;
  }
  static get tag() {
    return "progress-donut";
  }

  updated(changedProperties) {
    this.makeChart();
  }

  /**
   * Handles chart creation event.
   * @param {event} e create event
   */
  _onCreated(e) {
    if (this.animated)
      e.detail.on("draw", function(data) {
        if (data.type === "slice") {
          var pathLength = data.element._node.getTotalLength();
          data.element.attr({
            "stroke-dasharray": pathLength + "px " + pathLength + "px"
          });
          var animationDefinition = {
            "stroke-dashoffset": {
              id: "anim" + data.index,
              dur: 500,
              from: -pathLength + "px",
              to: "0px",
              easing: Chartist.Svg.Easing.easeOutQuint,
              fill: "freeze"
            }
          };
          if (data.index !== 0) {
            animationDefinition["stroke-dashoffset"].begin =
              "anim" + (data.index - 1) + ".end";
          }
          data.element.attr({ "stroke-dashoffset": -pathLength + "px" });
          data.element.animate(animationDefinition, false);
        }
      });
  }

  /**
   * refreshes the chart
   */
  makeChart() {
    let sum = 0,
      chart = this.shadowRoot.querySelector("#chart");
    for (let i = 0; i < this.complete.length; i++) {
      sum += parseFloat(this.complete[i]);
    }
    if (chart) {
      chart.data = { series: this.complete };
      chart.options = {
        donut: true,
        donutWidth: "25%",
        chartPadding: 0,
        showLabel: false,
        startAngle: 0,
        total: Math.max(sum, this.total)
      };
      /**
       * Fired when options change.
       *
       * @event options-changed
       *
       */
      this.dispatchEvent(new CustomEvent("options-changed", { detail: this }));
      chart.makeChart();
    }
    /**
     * Fired when chart changes.
     *
     * @event chart-changed
     *
     */
    this.dispatchEvent(new CustomEvent("chart-changed", { detail: this }));
    return chart;
  }
}
window.customElements.define(ProgressDonut.tag, ProgressDonut);
export { ProgressDonut };
