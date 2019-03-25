/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/json-editor/json-editor.js";
import "@lrnwebcomponents/code-editor/code-editor.js";
import "@vaadin/vaadin-split-layout/vaadin-split-layout.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/hax-body/lib/hax-schema-form.js";
/**
 * `haxschema-builder`
 * `dynamically build and visualize HAXschema`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HaxschemaBuilder extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxschema-builder";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(
      HaxschemaBuilder.haxProperties,
      HaxschemaBuilder.tag,
      this
    );
    if (!this.source) {
      this.haxSchema = JSON.stringify(
        this.HAXWiring.prototypeHaxProperties(),
        null,
        2
      );
    }
    // HACK to get initial paint to have the correct form
    this.$.form.modeTab = "advanced";
    setTimeout(() => {
      this.$.form.modeTab = "configure";
    }, 2000);
  }
  /**
   * Force an update on code editor when this value changes
   */
  _haxSchemaChanged(newValue) {
    if (newValue) {
      this.$.code.editorValue = newValue;
    }
  }
  /**
   * Notice code editor changes and reflect them into this element
   */
  _editorDataChanged(e) {
    // value coming up off of thiss
    this.haxSchema = e.detail.value;
    let hs = JSON.parse(this.haxSchema);
    for (var key in hs.settings) {
      let schema = this.HAXWiring.getHaxJSONSchema(key, hs);
      this.set(key + "Schema", schema);
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(HaxschemaBuilder.tag, HaxschemaBuilder);
export { HaxschemaBuilder };
