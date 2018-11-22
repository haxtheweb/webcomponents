/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `lrn-shared-styles-demo`
 * `a demo of lrn-shared-styles`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo ../demo/index.html
 * @see ../lrn-shared-styles.js
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "../lrn-shared-styles.js"; //import the shared styles

class LrnSharedStylesDemo extends PolymerElement {
  static get template() {
    return html`<style include="lrn-shared-styles"></style>
    <p class="sr-only visible">This text can only be read on screen readers. It is not visible on screen.</p>
    <p class="screen-only visible">This text can only be read on screen. It will not print.</p>
    <p class="print-only visible">This text can only be read when printed. It will not be visible on screen.</p></template>`;
  }
}
customElements.define("lrn-shared-styles-demo", LrnSharedStylesDemo);
