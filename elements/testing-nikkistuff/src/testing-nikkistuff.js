/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

/**
 * `testing-nikkistuff`
 * `...`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TestingNikkistuff extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  /*@mixin dark-shades($name,$color){
  color: "color-#{$index}";
  @for $i from 1 through 12 {
    $shade: #{get-color(13-$i)};
    --simple-colors-default-theme-grey-#{$i}: #{map-get($color,$shade)};
  }
:host([dark]), :host [dark] {
  @include dark-shades("grey", $greys);
}
  color: var(--simple-colors-grey-1);
  background-color: var(--simple-colors-grey-12);


@function get-color($index){
  @return "color-#{$index}";
}
  
}*/
  /*
@function get-variable($color,$theme,$index){
  @return " --simple-colors-#{$theme}-theme-#{$color}-#{$index}";
}
  @for $i from 1 through 1 {
    color: "color-#{$index}";
    $shade: #{get-color($i)};
    --simple-colors-default-theme-grey-#{$i}: #{map-get($color,$shade)};
  }*/

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "testing-nikkistuff";
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
window.customElements.define(TestingNikkistuff.tag, TestingNikkistuff);
export { TestingNikkistuff };
