/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
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
    if (!this.source) {
      this.haxSchema = JSON.stringify(
        this.HAXWiring.prototypeHaxProperties(),
        null,
        2
      );
    }
    // HACK to get initial paint to have the correct form
    this.shadowRoot.querySelector("#form").modeTab = "advanced";
    setTimeout(() => {
      this.shadowRoot.querySelector("#form").modeTab = "configure";
    }, 2000);
  }
  /**
   * Force an update on code editor when this value changes
   */
  _haxSchemaChanged(newValue) {
    if (newValue) {
      this.shadowRoot.querySelector("#code").editorValue = newValue;
    }
  }
  /**
   * Notice code editor changes and reflect them into this element
   */
  _editorDataChanged(e) {
    // value coming up off of this and get it propegated correctly
    this.haxSchema = e.detail.value;
    let hs = JSON.parse(this.haxSchema);
    for (var key in hs.settings) {
      let schema = this.HAXWiring.getHaxJSONSchema(key, hs);
      this.set(key + "Schema", schema);
    }
  }
  addAdvanced(e) {
    let hs = JSON.parse(this.haxSchema);
    hs.settings.advanced.push(this.__propPrototype());
    this.__refreshSchemas(hs);
  }
  addConfigure(e) {
    let hs = JSON.parse(this.haxSchema);
    hs.settings.configure.push(this.__propPrototype());
    this.__refreshSchemas(hs);
  }
  __refreshSchemas(hs) {
    for (var key in hs.settings) {
      let schema = this.HAXWiring.getHaxJSONSchema(key, hs);
      this.set(key + "Schema", schema);
    }
    this.haxSchema = JSON.stringify(hs);
  }
  __propPrototype() {
    return {
      property: "title",
      title: "Title",
      description: "",
      inputMethod: "textfield",
      icon: "android",
      required: true,
      validationType: "text"
    };
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(HaxschemaBuilder.tag, HaxschemaBuilder);
export { HaxschemaBuilder };
