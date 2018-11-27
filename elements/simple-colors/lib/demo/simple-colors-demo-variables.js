/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { SimpleColors } from "../../simple-colors.js"; //import the shared styles
import "./simple-colors-demo-select.js";

export { SimpleColorsDemoVariables };
/**
 * `simple-colors-demo-variables`
 * `an example of how to extend simple-colors within a custom element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @see "./simple-colors-demo-select.js"
 * @see "../simple-colors.js"
 * @demo demo/extending.html
 */
class SimpleColorsDemoVariables extends SimpleColors {
  // render function
  static get template() {
    return html`
<style is="custom-style" include="simple-colors">
:host {
  margin: 15px 0;
  padding: 0px;
  display: block;
}
:host([hidden]){
  display: none;
}
:host #inner {
  padding: 15px;
  margin: 15px;
  font-family: monospace;
}
:host #selectors {
  margin: 0 0 15px;
}
:host #result {
  padding: 15px;
}
:host .sr-only {
  position: absolute;
  left: -999999px;
  top: 0;
  height: 0;
  width: 0;
  overflow: hidden;
}
</style>
<div id="inner">
  <div id="selectors">
    <label class="sr-only" for="type">Type</label><simple-colors-demo-select id="type"
      label="type"
      value="background-color" 
      as-code 
      on-type-change="_handleUpdate"
      options='["background-color","color","border-color"]'>
    </simple-colors-demo-select>: 
    
    var(<label class="sr-only" for="theme">Theme</label><simple-colors-demo-select id="theme"
      label="theme"
      value="--simple-colors-default-theme" 
      as-code 
      on-theme-change="_handleUpdate"
      options='["--simple-colors-default-theme","--simple-colors-dark-theme","--simple-colors-light-theme"]'>
    </simple-colors-demo-select>
    -
    <label class="sr-only" for="color">Color</label><simple-colors-demo-select id="color"
      label="accent-color"
      value="grey" 
      as-code 
      on-accent-color-change="_handleUpdate"
      options$="[[_getOptions(colors)]]">
    </simple-colors-demo-select>
    -
    <label class="sr-only" for="level">Level</label><simple-colors-demo-select id="level"
      label="level"
      value="1" 
      as-code 
      on-level-change="_handleUpdate"
      options='["1","2","3","4","5","6","7","8","9","10","11","12"]'>
    </simple-colors-demo-select>);
  </div>
  <div class="tag"><em>div</em> {</div>
  <div id="result"></div>
  <div class="tag">}</div>
</div>`;
  }

  /**
   * gets simple-colors behaviors
   */
  static get behaviors() {
    return [SimpleColors];
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-demo-variables";
  }

  /**
   * gets the options array based on an object's keys
   */
  _getOptions(obj) {
    let opts = Object.keys(obj);
    opts.unshift("accent");
    return opts;
  }

  /**
   * determines if the element is in nested mode
   */
  _handleUpdate() {
    let text,
      bg,
      border,
      color = [this.$.theme.value, this.$.color.value, this.$.level.value].join(
        "-"
      ),
      inverted = parseInt(this.$.level.value) - 6 > 0 ? "1" : "12";
    if (this.$.type.value === "color") {
      text = color;
      border = color;
      bg = this.$.theme.value + "-grey-" + inverted;
    } else if (this.$.type.value === "background-color") {
      bg = color;
      border = color;
      text = this.$.theme.value + "-grey-" + inverted;
    } else {
      border = color;
      bg = this.$.theme.value + "-grey-1";
      text = this.$.theme.value + "-grey-12";
    }
    this.$.result.innerHTML = [
      "color: var(" + text + ");",
      "background-color: var(" + bg + ");",
      "border-color: 1px solid var(" + border + ");"
    ].join("<br>");
    this.$.inner.style = [
      "color: var(" + text + ");",
      "background-color: var(" + bg + ");",
      "border: 1px solid var(" + border + ");"
    ].join("");
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  ready() {
    super.ready();
    this._handleUpdate();
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(
  SimpleColorsDemoVariables.tag,
  SimpleColorsDemoVariables
);
