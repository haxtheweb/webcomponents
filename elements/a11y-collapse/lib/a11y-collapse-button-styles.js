/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `a11y-collapse-button-styles`
 * `a shared set of styles for a11y-collapse-button`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @pseudoElement
 * @polymer
 * @demo demo/index.html
 * @see lib/a11y-collapse-button-styles-demo.js
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
const styleElement = document.createElement("dom-module");

const css = html`
  <style>
    :host #heading {
      display: flex;
      justify-content: stretch;
      align-items: center;
      padding: 0 var(--a11y-collapse-horizontal-padding, 16px);
      font-weight: bold;
      @apply --a11y-collapse-heading;
    }
    :host #text {
      flex-grow: 1;
      @apply --a11y-collapse-heading-text;
    }
    :host #expand {
      transition: transform 0.5s;
      @apply --a11y-collapse-icon;
    }
    :host #expand[rotated] {
      transform: rotate(-90deg);
      @apply --a11y-collapse-icon-rotated;
    }
    :host [aria-controls] {
      cursor: pointer;
    }
    :host([disabled]) [aria-controls] {
      cursor: not-allowed;
    }
    :host([expanded]) #heading {
      @apply --a11y-collapse-heading-expanded;
    }
    :host([expanded]) #text {
      @apply --a11y-collapse-heading-text-expanded;
    }
    :host([expanded]) #expand {
      @apply --a11y-collapse-icon-expanded;
    }
  </style>
`;
styleElement.appendChild(css);

styleElement.register("a11y-collapse-button-styles");
