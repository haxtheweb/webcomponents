/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import { ChartistRender } from "@lrnwebcomponents/chartist-render/chartist-render.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `lrndesign-chart-behaviors`
 * a line chart
 *
 * @customElement
 * @demo demo/index.html
 * @demo demo/pie.html pie charts
 * @demo demo/bar.html bar charts
 * @demo demo/line.html line charts
 *
 */
class LrndesignChartBehaviors extends LitElement(SimpleColors) {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        :host {
          --chartist-pie-label-color: var(
            --simple-colors-default-theme-grey-12
          );
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
          --chartist-color-15: var(--simple-colors-default-theme-pink-3);
        }
        :host([dark]) {
          --chartist-color-1: var(--simple-colors-default-theme-red-4);
          --chartist-color-2: var(--simple-colors-default-theme-light-blue-4);
          --chartist-color-3: var(--simple-colors-default-theme-green-4);
          --chartist-color-4: var(--simple-colors-default-theme-purple-4);
          --chartist-color-5: var(--simple-colors-default-theme-indigo-4);
          --chartist-color-6: var(--simple-colors-default-theme-pink-4);
          --chartist-color-7: var(--simple-colors-default-theme-teal-4);
          --chartist-color-8: var(--simple-colors-default-theme-red-3);
          --chartist-color-9: var(--simple-colors-default-theme-light-blue-3);
          --chartist-color-10: var(--simple-colors-default-theme-green-3);
          --chartist-color-11: var(--simple-colors-default-theme-purple-3);
          --chartist-color-12: var(--simple-colors-default-theme-indigo-3);
          --chartist-color-13: var(--simple-colors-default-theme-pink-3);
          --chartist-color-14: var(--simple-colors-default-theme-teal-3);
          --chartist-color-15: var(--simple-colors-default-theme-deep-orange-3);
        }
        :host([accent-color="red"]) {
          --chartist-color-1: var(--simple-colors-default-theme-red-4);
          --chartist-color-2: var(--simple-colors-default-theme-red-3);
          --chartist-color-3: var(--simple-colors-default-theme-red-2);
          --chartist-color-4: var(--simple-colors-default-theme-pink-4);
          --chartist-color-5: var(--simple-colors-default-theme-pink-3);
          --chartist-color-6: var(--simple-colors-default-theme-pink-2);
          --chartist-color-7: var(--simple-colors-default-theme-deep-orange-4);
          --chartist-color-8: var(--simple-colors-default-theme-deep-orange-3);
          --chartist-color-9: var(--simple-colors-default-theme-deep-orange-2);
          --chartist-color-10: var(--simple-colors-default-theme-purple-4);
          --chartist-color-11: var(--simple-colors-default-theme-purple-3);
          --chartist-color-12: var(--simple-colors-default-theme-purple-2);
          --chartist-color-13: var(--simple-colors-default-theme-orange-4);
          --chartist-color-14: var(--simple-colors-default-theme-orange-3);
          --chartist-color-15: var(--simple-colors-default-theme-orange-2);
        }
        :host([accent-color="pink"]) {
          --chartist-color-1: var(--simple-colors-default-theme-pink-4);
          --chartist-color-2: var(--simple-colors-default-theme-pink-3);
          --chartist-color-3: var(--simple-colors-default-theme-pink-2);
          --chartist-color-4: var(--simple-colors-default-theme-purple-4);
          --chartist-color-5: var(--simple-colors-default-theme-purple-3);
          --chartist-color-6: var(--simple-colors-default-theme-purple-2);
          --chartist-color-7: var(--simple-colors-default-theme-red-4);
          --chartist-color-8: var(--simple-colors-default-theme-red-3);
          --chartist-color-9: var(--simple-colors-default-theme-red-2);
          --chartist-color-10: var(--simple-colors-default-theme-deep-purple-4);
          --chartist-color-11: var(--simple-colors-default-theme-deep-purple-3);
          --chartist-color-12: var(--simple-colors-default-theme-deep-purple-2);
          --chartist-color-13: var(--simple-colors-default-theme-deep-orange-4);
          --chartist-color-14: var(--simple-colors-default-theme-deep-orange-3);
          --chartist-color-15: var(--simple-colors-default-theme-deep-orange-2);
        }
        :host([accent-color="purple"]) {
          --chartist-color-1: var(--simple-colors-default-theme-purple-4);
          --chartist-color-2: var(--simple-colors-default-theme-purple-3);
          --chartist-color-3: var(--simple-colors-default-theme-purple-2);
          --chartist-color-4: var(--simple-colors-default-theme-deep-purple-4);
          --chartist-color-5: var(--simple-colors-default-theme-deep-purple-3);
          --chartist-color-6: var(--simple-colors-default-theme-deep-purple-2);
          --chartist-color-7: var(--simple-colors-default-theme-pink-4);
          --chartist-color-8: var(--simple-colors-default-theme-pink-3);
          --chartist-color-9: var(--simple-colors-default-theme-pink-2);
          --chartist-color-10: var(--simple-colors-default-theme-indigo-4);
          --chartist-color-11: var(--simple-colors-default-theme-indigo-3);
          --chartist-color-12: var(--simple-colors-default-theme-indigo-2);
          --chartist-color-13: var(--simple-colors-default-theme-red-4);
          --chartist-color-14: var(--simple-colors-default-theme-red-3);
          --chartist-color-15: var(--simple-colors-default-theme-red-2);
        }
        :host([accent-color="deep-purple"]) {
          --chartist-color-1: var(--simple-colors-default-theme-deep-purple-4);
          --chartist-color-2: var(--simple-colors-default-theme-deep-purple-3);
          --chartist-color-3: var(--simple-colors-default-theme-deep-purple-2);
          --chartist-color-4: var(--simple-colors-default-theme-indigo-4);
          --chartist-color-5: var(--simple-colors-default-theme-indigo-3);
          --chartist-color-6: var(--simple-colors-default-theme-indigo-2);
          --chartist-color-7: var(--simple-colors-default-theme-purple-4);
          --chartist-color-8: var(--simple-colors-default-theme-purple-3);
          --chartist-color-9: var(--simple-colors-default-theme-purple-2);
          --chartist-color-10: var(--simple-colors-default-theme-blue-4);
          --chartist-color-11: var(--simple-colors-default-theme-blue-3);
          --chartist-color-12: var(--simple-colors-default-theme-blue-2);
          --chartist-color-13: var(--simple-colors-default-theme-pink-4);
          --chartist-color-14: var(--simple-colors-default-theme-pink-3);
          --chartist-color-15: var(--simple-colors-default-theme-pink-2);
        }
        :host([accent-color="indigo"]) {
          --chartist-color-1: var(--simple-colors-default-theme-indigo-4);
          --chartist-color-2: var(--simple-colors-default-theme-indigo-3);
          --chartist-color-3: var(--simple-colors-default-theme-indigo-2);
          --chartist-color-4: var(--simple-colors-default-theme-blue-4);
          --chartist-color-5: var(--simple-colors-default-theme-blue-3);
          --chartist-color-6: var(--simple-colors-default-theme-blue-2);
          --chartist-color-7: var(--simple-colors-default-theme-deep-purple-4);
          --chartist-color-8: var(--simple-colors-default-theme-deep-purple-3);
          --chartist-color-9: var(--simple-colors-default-theme-deep-purple-2);
          --chartist-color-10: var(--simple-colors-default-theme-light-blue-4);
          --chartist-color-11: var(--simple-colors-default-theme-light-blue-3);
          --chartist-color-12: var(--simple-colors-default-theme-light-blue-2);
          --chartist-color-13: var(--simple-colors-default-theme-purple-4);
          --chartist-color-14: var(--simple-colors-default-theme-purple-3);
          --chartist-color-15: var(--simple-colors-default-theme-purple-2);
        }
        :host([accent-color="blue"]) {
          --chartist-color-1: var(--simple-colors-default-theme-blue-4);
          --chartist-color-2: var(--simple-colors-default-theme-blue-3);
          --chartist-color-3: var(--simple-colors-default-theme-blue-2);
          --chartist-color-4: var(--simple-colors-default-theme-light-blue-4);
          --chartist-color-5: var(--simple-colors-default-theme-light-blue-3);
          --chartist-color-6: var(--simple-colors-default-theme-light-blue-2);
          --chartist-color-7: var(--simple-colors-default-theme-indigo-4);
          --chartist-color-8: var(--simple-colors-default-theme-indigo-3);
          --chartist-color-9: var(--simple-colors-default-theme-indigo-2);
          --chartist-color-10: var(--simple-colors-default-theme-cyan-4);
          --chartist-color-11: var(--simple-colors-default-theme-cyan-3);
          --chartist-color-12: var(--simple-colors-default-theme-cyan-2);
          --chartist-color-13: var(--simple-colors-default-theme-deep-purple-4);
          --chartist-color-14: var(--simple-colors-default-theme-deep-purple-3);
          --chartist-color-15: var(--simple-colors-default-theme-deep-purple-2);
        }
        :host([accent-color="light-blue"]) {
          --chartist-color-1: var(--simple-colors-default-theme-light-blue-4);
          --chartist-color-2: var(--simple-colors-default-theme-light-blue-3);
          --chartist-color-3: var(--simple-colors-default-theme-light-blue-2);
          --chartist-color-4: var(--simple-colors-default-theme-cyan-4);
          --chartist-color-5: var(--simple-colors-default-theme-cyan-3);
          --chartist-color-6: var(--simple-colors-default-theme-cyan-2);
          --chartist-color-7: var(--simple-colors-default-theme-blue-4);
          --chartist-color-8: var(--simple-colors-default-theme-blue-3);
          --chartist-color-9: var(--simple-colors-default-theme-blue-2);
          --chartist-color-10: var(--simple-colors-default-theme-teal-4);
          --chartist-color-11: var(--simple-colors-default-theme-teal-3);
          --chartist-color-12: var(--simple-colors-default-theme-teal-2);
          --chartist-color-13: var(--simple-colors-default-theme-indigo-4);
          --chartist-color-14: var(--simple-colors-default-theme-indigo-3);
          --chartist-color-15: var(--simple-colors-default-theme-indigo-2);
        }
        :host([accent-color="cyan"]) {
          --chartist-color-1: var(--simple-colors-default-theme-cyan-4);
          --chartist-color-2: var(--simple-colors-default-theme-cyan-3);
          --chartist-color-3: var(--simple-colors-default-theme-cyan-2);
          --chartist-color-4: var(--simple-colors-default-theme-teal-4);
          --chartist-color-5: var(--simple-colors-default-theme-teal-3);
          --chartist-color-6: var(--simple-colors-default-theme-teal-2);
          --chartist-color-7: var(--simple-colors-default-theme-light-blue-4);
          --chartist-color-8: var(--simple-colors-default-theme-light-blue-3);
          --chartist-color-9: var(--simple-colors-default-theme-light-blue-2);
          --chartist-color-10: var(--simple-colors-default-theme-green-4);
          --chartist-color-11: var(--simple-colors-default-theme-green-3);
          --chartist-color-12: var(--simple-colors-default-theme-green-2);
          --chartist-color-13: var(--simple-colors-default-theme-blue-4);
          --chartist-color-14: var(--simple-colors-default-theme-blue-3);
          --chartist-color-15: var(--simple-colors-default-theme-blue-2);
        }
        :host([accent-color="teal"]) {
          --chartist-color-1: var(--simple-colors-default-theme-teal-4);
          --chartist-color-2: var(--simple-colors-default-theme-teal-3);
          --chartist-color-3: var(--simple-colors-default-theme-teal-2);
          --chartist-color-4: var(--simple-colors-default-theme-green-4);
          --chartist-color-5: var(--simple-colors-default-theme-green-3);
          --chartist-color-6: var(--simple-colors-default-theme-green-2);
          --chartist-color-7: var(--simple-colors-default-theme-cyan-4);
          --chartist-color-8: var(--simple-colors-default-theme-cyan-3);
          --chartist-color-9: var(--simple-colors-default-theme-cyan-2);
          --chartist-color-10: var(--simple-colors-default-theme-light-green-4);
          --chartist-color-11: var(--simple-colors-default-theme-light-green-3);
          --chartist-color-12: var(--simple-colors-default-theme-light-green-2);
          --chartist-color-13: var(--simple-colors-default-theme-light-blue-4);
          --chartist-color-14: var(--simple-colors-default-theme-light-blue-3);
          --chartist-color-15: var(--simple-colors-default-theme-light-blue-2);
        }
        :host([accent-color="green"]) {
          --chartist-color-1: var(--simple-colors-default-theme-green-4);
          --chartist-color-2: var(--simple-colors-default-theme-green-3);
          --chartist-color-3: var(--simple-colors-default-theme-green-2);
          --chartist-color-4: var(--simple-colors-default-theme-light-green-4);
          --chartist-color-5: var(--simple-colors-default-theme-light-green-3);
          --chartist-color-6: var(--simple-colors-default-theme-light-green-2);
          --chartist-color-7: var(--simple-colors-default-theme-teal-4);
          --chartist-color-8: var(--simple-colors-default-theme-teal-3);
          --chartist-color-9: var(--simple-colors-default-theme-teal-2);
          --chartist-color-10: var(--simple-colors-default-theme-lime-4);
          --chartist-color-11: var(--simple-colors-default-theme-lime-3);
          --chartist-color-12: var(--simple-colors-default-theme-lime-2);
          --chartist-color-13: var(--simple-colors-default-theme-cyan-4);
          --chartist-color-14: var(--simple-colors-default-theme-cyan-3);
          --chartist-color-15: var(--simple-colors-default-theme-cyan-2);
        }
        :host([accent-color="light-green"]) {
          --chartist-color-1: var(--simple-colors-default-theme-light-green-4);
          --chartist-color-2: var(--simple-colors-default-theme-light-green-3);
          --chartist-color-3: var(--simple-colors-default-theme-light-green-2);
          --chartist-color-4: var(--simple-colors-default-theme-lime-4);
          --chartist-color-5: var(--simple-colors-default-theme-lime-3);
          --chartist-color-6: var(--simple-colors-default-theme-lime-2);
          --chartist-color-7: var(--simple-colors-default-theme-green-4);
          --chartist-color-8: var(--simple-colors-default-theme-green-3);
          --chartist-color-9: var(--simple-colors-default-theme-green-2);
          --chartist-color-10: var(--simple-colors-default-theme-yellow-4);
          --chartist-color-11: var(--simple-colors-default-theme-yellow-3);
          --chartist-color-12: var(--simple-colors-default-theme-yellow-2);
          --chartist-color-13: var(--simple-colors-default-theme-teal-4);
          --chartist-color-14: var(--simple-colors-default-theme-teal-3);
          --chartist-color-15: var(--simple-colors-default-theme-teal-2);
        }
        :host([accent-color="lime"]) {
          --chartist-color-1: var(--simple-colors-default-theme-lime-4);
          --chartist-color-2: var(--simple-colors-default-theme-lime-3);
          --chartist-color-3: var(--simple-colors-default-theme-lime-2);
          --chartist-color-4: var(--simple-colors-default-theme-yellow-4);
          --chartist-color-5: var(--simple-colors-default-theme-yellow-3);
          --chartist-color-6: var(--simple-colors-default-theme-yellow-2);
          --chartist-color-7: var(--simple-colors-default-theme-light-green-4);
          --chartist-color-8: var(--simple-colors-default-theme-light-green-3);
          --chartist-color-9: var(--simple-colors-default-theme-light-green-2);
          --chartist-color-10: var(--simple-colors-default-theme-amber-4);
          --chartist-color-11: var(--simple-colors-default-theme-amber-3);
          --chartist-color-12: var(--simple-colors-default-theme-amber-2);
          --chartist-color-13: var(--simple-colors-default-theme-green-4);
          --chartist-color-14: var(--simple-colors-default-theme-green-3);
          --chartist-color-15: var(--simple-colors-default-theme-green-2);
        }
        :host([accent-color="yellow"]) {
          --chartist-color-1: var(--simple-colors-default-theme-yellow-4);
          --chartist-color-2: var(--simple-colors-default-theme-yellow-3);
          --chartist-color-3: var(--simple-colors-default-theme-yellow-2);
          --chartist-color-4: var(--simple-colors-default-theme-amber-4);
          --chartist-color-5: var(--simple-colors-default-theme-amber-3);
          --chartist-color-6: var(--simple-colors-default-theme-amber-2);
          --chartist-color-7: var(--simple-colors-default-theme-lime-4);
          --chartist-color-8: var(--simple-colors-default-theme-lime-3);
          --chartist-color-9: var(--simple-colors-default-theme-lime-2);
          --chartist-color-10: var(--simple-colors-default-theme-orange-4);
          --chartist-color-11: var(--simple-colors-default-theme-orange-3);
          --chartist-color-12: var(--simple-colors-default-theme-orange-2);
          --chartist-color-13: var(--simple-colors-default-theme-light-green-4);
          --chartist-color-14: var(--simple-colors-default-theme-light-green-3);
          --chartist-color-15: var(--simple-colors-default-theme-light-green-2);
        }
        :host([accent-color="amber"]) {
          --chartist-color-1: var(--simple-colors-default-theme-amber-4);
          --chartist-color-2: var(--simple-colors-default-theme-amber-3);
          --chartist-color-3: var(--simple-colors-default-theme-amber-2);
          --chartist-color-4: var(--simple-colors-default-theme-orange-4);
          --chartist-color-5: var(--simple-colors-default-theme-orange-3);
          --chartist-color-6: var(--simple-colors-default-theme-orange-2);
          --chartist-color-7: var(--simple-colors-default-theme-yellow-4);
          --chartist-color-8: var(--simple-colors-default-theme-yellow-3);
          --chartist-color-9: var(--simple-colors-default-theme-yellow-2);
          --chartist-color-10: var(--simple-colors-default-theme-deep-orange-4);
          --chartist-color-11: var(--simple-colors-default-theme-deep-orange-3);
          --chartist-color-12: var(--simple-colors-default-theme-deep-orange-2);
          --chartist-color-13: var(--simple-colors-default-theme-brown-4);
          --chartist-color-14: var(--simple-colors-default-theme-brown-3);
          --chartist-color-15: var(--simple-colors-default-theme-brown-2);
        }
        :host([accent-color="orange"]) {
          --chartist-color-1: var(--simple-colors-default-theme-orange-4);
          --chartist-color-2: var(--simple-colors-default-theme-orange-3);
          --chartist-color-3: var(--simple-colors-default-theme-orange-2);
          --chartist-color-4: var(--simple-colors-default-theme-deep-orange-4);
          --chartist-color-5: var(--simple-colors-default-theme-deep-orange-3);
          --chartist-color-6: var(--simple-colors-default-theme-deep-orange-2);
          --chartist-color-7: var(--simple-colors-default-theme-amber-4);
          --chartist-color-8: var(--simple-colors-default-theme-amber-3);
          --chartist-color-9: var(--simple-colors-default-theme-amber-2);
          --chartist-color-10: var(--simple-colors-default-theme-red-4);
          --chartist-color-11: var(--simple-colors-default-theme-red-3);
          --chartist-color-12: var(--simple-colors-default-theme-red-2);
          --chartist-color-13: var(--simple-colors-default-theme-brown-4);
          --chartist-color-14: var(--simple-colors-default-theme-brown-3);
          --chartist-color-15: var(--simple-colors-default-theme-brown-2);
        }
        :host([accent-color="deep-orange"]) {
          --chartist-color-1: var(--simple-colors-default-theme-deep-orange-4);
          --chartist-color-2: var(--simple-colors-default-theme-deep-orange-3);
          --chartist-color-3: var(--simple-colors-default-theme-deep-orange-2);
          --chartist-color-4: var(--simple-colors-default-theme-red-4);
          --chartist-color-5: var(--simple-colors-default-theme-red-3);
          --chartist-color-6: var(--simple-colors-default-theme-red-2);
          --chartist-color-7: var(--simple-colors-default-theme-orange-4);
          --chartist-color-8: var(--simple-colors-default-theme-orange-3);
          --chartist-color-9: var(--simple-colors-default-theme-orange-2);
          --chartist-color-10: var(--simple-colors-default-theme-pink-4);
          --chartist-color-11: var(--simple-colors-default-theme-pink-3);
          --chartist-color-12: var(--simple-colors-default-theme-pink-2);
          --chartist-color-13: var(--simple-colors-default-theme-brown-4);
          --chartist-color-14: var(--simple-colors-default-theme-brown-3);
          --chartist-color-15: var(--simple-colors-default-theme-brown-2);
        }
        :host([accent-color="brown"]) {
          --chartist-color-1: var(--simple-colors-default-theme-brown-5);
          --chartist-color-2: var(--simple-colors-default-theme-brown-4);
          --chartist-color-3: var(--simple-colors-default-theme-brown-3);
          --chartist-color-4: var(--simple-colors-default-theme-brown-2);
          --chartist-color-5: var(--simple-colors-default-theme-brown-1);
          --chartist-color-6: var(--simple-colors-default-theme-red-5);
          --chartist-color-7: var(--simple-colors-default-theme-red-4);
          --chartist-color-8: var(--simple-colors-default-theme-red-3);
          --chartist-color-9: var(--simple-colors-default-theme-red-2);
          --chartist-color-10: var(--simple-colors-default-theme-red-1);
          --chartist-color-11: var(--simple-colors-default-theme-deep-orange-5);
          --chartist-color-12: var(--simple-colors-default-theme-deep-orange-4);
          --chartist-color-13: var(--simple-colors-default-theme-deep-orange-3);
          --chartist-color-14: var(--simple-colors-default-theme-deep-orange-2);
          --chartist-color-15: var(--simple-colors-default-theme-deep-orange-1);
        }
        :host([accent-color="blue-grey"]) {
          --chartist-color-1: var(--simple-colors-default-theme-blue-grey-5);
          --chartist-color-2: var(--simple-colors-default-theme-blue-grey-4);
          --chartist-color-3: var(--simple-colors-default-theme-blue-grey-3);
          --chartist-color-4: var(--simple-colors-default-theme-blue-grey-2);
          --chartist-color-5: var(--simple-colors-default-theme-blue-grey-1);
          --chartist-color-6: var(--simple-colors-default-theme-light-blue-5);
          --chartist-color-7: var(--simple-colors-default-theme-light-blue-4);
          --chartist-color-8: var(--simple-colors-default-theme-light-blue-3);
          --chartist-color-9: var(--simple-colors-default-theme-light-blue-2);
          --chartist-color-10: var(--simple-colors-default-theme-light-blue-1);
          --chartist-color-11: var(--simple-colors-default-theme-grey-6);
          --chartist-color-12: var(--simple-colors-default-theme-grey-5);
          --chartist-color-13: var(--simple-colors-default-theme-grey-4);
          --chartist-color-14: var(--simple-colors-default-theme-grey-3);
          --chartist-color-15: var(--simple-colors-default-theme-grey-2);
        }
      `
    ];
  }
  render() {
    return html`
      <iron-ajax
        auto
        handle-as="text"
        url="${this.dataSource}"
        .last-response="${this.rawData}"
        @response="${this.handleResponse}"
      ></iron-ajax>
      <chartist-render
        id="chartist"
        type="${this.type}"
        scale="${this.scale}"
        chart-title="${this.chartTitle}"
        chart-desc="${this.chartDesc}"
        .data="${this.data}"
        .options="${this._getOptions()}"
        .responsive-options="${this.responsiveOptions}"
        @chartist-render-ready="${this._ready}"
      ></chartist-render>
    `;
  }

  constructor() {
    super();
    this.setProperties();
    let checkReady = setInterval(() => {
      if (this.__dataReady) {
        this.shadowRoot.querySelector("#chartist").makeChart();
        clearInterval(checkReady);
      }
    }, 1);
  }

  // properties available to the custom element for data binding
  static get properties() {
    return Object.assign(ChartistRender.properties, {
      /**
       * Location of the CSV file.
       */
      dataSource: {
        type: String,
        attribute: "data-source"
      },
      /**
       * Fixed height for the chart as a string (i.e. '100px' or '50%').
       */
      height: {
        type: String
      },
      /**
       * Raw data pulled in from the csv file.
       */
      rawData: {
        type: String,
        attribute: "raw-data"
      },
      /**
       * Reverse data including labels, the series order as well as
       * the whole series data arrays.
       */
      reverseData: {
        type: Boolean,
        attribute: "reverse-data"
      },
      /**
       * Fixed width for the chart as a string (i.e. '100px' or '50%').
       */
      width: {
        type: String
      }
    });
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-chart-behaviors";
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
       * Position labels at top-left of axis?
       */
      axisXTopLeft: {
        attribute: "axis-x-top-left",
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

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Pie Chart",
        description: "Creates an accessible pie chart based on a CSV.",
        icon: "editor:pie-chart",
        color: "green darken-4",
        groups: ["Data", "Presentation"],
        handles: [
          {
            type: "data",
            url: "csvFile"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "data-source",
            title: "CSV File",
            description: "The URL for your CSV file.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
            required: true
          },
          {
            property: "chartTitle",
            title: "Chart Title",
            description: "Accessible alt text for your chart.",
            inputMethod: "textfield",
            icon: "text-field",
            required: true
          },
          {
            property: "chartDesc",
            title: "Chart Description",
            description: "Accessible description of your chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "width",
            title: "Width",
            description: "The width of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "height",
            title: "Height",
            description: "The height of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "paddingTop",
            title: "Padding-Top",
            description: "The padding at the top of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "paddingRight",
            title: "Padding-Right",
            description: "The padding at the right of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "paddingBottom",
            title: "Padding-Bottom",
            description: "The padding at the bottom of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "paddingLeft",
            title: "Padding-Left",
            description: "The padding at the left of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          }
        ],
        advanced: [
          {
            property: "scale",
            title: "Scale Name",
            description:
              "The ratio of width:height of the chart (See https://gionkunz.github.io/chartist-js/getting-started.html#default-sass-settings for $ct-scales and $ct-scales-names).",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "total",
            title: "Total of All Slices",
            description:
              "Optional total you can specify. By specifying a total value, the sum of the values in the series must be this total in order to draw a full pie. You can use this parameter to draw only parts of a pie or gauge charts.",
            inputMethod: "textfield",
            icon: "text-field",
            validationType: "number"
          },
          {
            property: "showLabel",
            title: "Show labels?",
            description: "Should chart labels be shown?",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "labelOffset",
            title: "Label Offset",
            description:
              "Label position offset from the standard position which is half distance of the radius. This value can be either positive or negative. Positive values will position the label away from the center.",
            inputMethod: "textfield",
            icon: "text-field",
            validationType: "number"
          },
          {
            property: "labelPosition",
            title: "Label Position",
            description:
              'This option can be set to "inside", "outside" or "center". Positioned with "inside" the labels will be placed on half the distance of the radius to the border of the Pie by respecting the "Label Offset". The "outside" option will place the labels at the border of the pie and "center" will place the labels in the absolute center point of the chart. The "center" option only makes sense in conjunction with the "Label Offset" option.',
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "labelDirection",
            title: "Label Direction",
            description:
              'Label direction can be "neutral", "explode" or "implode". The label\'s anchor will be positioned based on those settings as well as the fact if the labels are on the right or left side of the center of the chart. Usually explode is useful when labels are positioned far away from the center.',
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "reverseData",
            title: "Reverse Data",
            description:
              "Reverse data including labels, the series order as well as the whole series data arrays.",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "ignoreEmptyValues",
            title: "Ignore empty values?",
            description:
              "Empty values will be ignored to avoid drawing unncessary slices and labels.",
            inputMethod: "boolean",
            icon: "check-box"
          }
        ]
      }
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "dataSource")
        this.dispatchEvent(
          new CustomEvent("data-source-changed", {
            detail: this
          })
        );
      if (propName === "rawData")
        this.dispatchEvent(
          new CustomEvent("raw-data-changed", {
            detail: this
          })
        );
    });
  }
  /**
   * Sets properties for chart.
   * Specific chart types can extend this function
   * with type-specific properties.
   */
  setProperties() {
    /*
    this.fullWidth = false;
     */
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
   */
  handleResponse(e) {
    let raw = this.CSVtoArray(this.rawData);
    this.data = {
      labels: raw[0],
      series: this.type !== "pie" ? raw.slice(1, raw.length) : raw[1]
    };
    this.options = this._getOptions();
    this.__dataReady = true;
  }

  /**
   * override this with type-specific options
   */
  _getOptions() {
    return {};
  }

  /**
   * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
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
window.customElements.define(
  LrndesignChartBehaviors.tag,
  LrndesignChartBehaviors
);
export { LrndesignChartBehaviors };
