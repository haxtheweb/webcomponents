/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { props, withComponent } from "skatejs";
import withLitHtml from "@skatejs/renderer-lit-html";
import { html } from "lit-html";

export { CarWindow };
// extend into class name matching library for consistency
class SkateJS extends withComponent(withLitHtml()) {}
/**
 * `car-window`
 * `Describe how a car window works`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @skatejs
 * @demo demo/index.html
 */
class CarWindow extends SkateJS {
  // render function
  render() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

.tint-green {
  background-color: green;
}

.tint-clear {
  opacity: .7;
  background-color: grey;
}</style>
<h2>New car window</h2>
<div class="tint-${this.tint}">
    <div hidden="${this.manufacture}">${this.size}</div>
    <slot></slot>
</div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      tint: {
        name: "tint",
        type: "String",
        value: "clear",
        reflectToAttribute: false,
        observer: false
      },
      size: {
        name: "size",
        type: "Number",
        value: "1000",
        reflectToAttribute: false,
        observer: false
      },
      manufacture: {
        name: "manufacture",
        type: "Boolean",
        value: "",
        reflectToAttribute: false,
        observer: false
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "car-window";
  }

  /**
   * life cycle
   */
  constructor() {
    super();

    // silly but this nets us data binding for default values
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/CarWindow-properties.json
    let obj = CarWindow.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          this[p] = obj[p].value;
        }
      }
    }
  }
  // SkateJS props function that we map our abstracted properties object over to
  static get props() {
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/CarWindow-properties.json
    let obj = CarWindow.properties;
    let simpleProps = {};
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        simpleProps[p] = obj[p].value;
      }
    }
    return simpleProps;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connected() {}
}
customElements.define("car-window", CarWindow);
