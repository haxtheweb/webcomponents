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
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
        code-editor {
          height: 500px;
        }
      </style>
      <vaadin-split-layout>
        <div>
          <paper-button raised noink on-click="addConfigure"
            >Add to configure</paper-button
          >
          <paper-button raised noink on-click="addAdvanced"
            >Add to advanced</paper-button
          >
          <code-editor
            id="code"
            on-value-changed="_editorDataChanged"
            language="json"
          ></code-editor>
          <json-editor
            id="json"
            label="JSON"
            value="{{haxSchema}}"
          ></json-editor>
        </div>
        <div>
          <hax-schema-form
            id="form"
            configure-schema="[[configureSchema]]"
            advanced-schema="[[advancedSchema]]"
            value="{{value}}"
          ></hax-schema-form>
        </div>
      </vaadin-split-layout>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Haxschema builder",
        description: "dynamically build and visualize HAXschema",
        icon: "icons:android",
        color: "green",
        groups: ["Builder"],
        handles: [],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "source",
            description: "",
            inputMethod: "textfield",
            required: true,
            icon: "icons:link",
            validationType: "url"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    let props = {
      /**
       * schema to extract for whatever you wanted it for
       */
      haxSchema: {
        name: "haxSchema",
        type: String,
        notify: true,
        observer: "_haxSchemaChanged"
      },
      /**
       * configure form schema to extract for whatever you wanted it for
       */
      configureSchema: {
        name: "configureSchema",
        type: Object,
        value: {}
      },
      /**
       * advanced form schema to extract for whatever you wanted it for
       */
      advancedSchema: {
        name: "advancedSchema",
        type: Object,
        value: {}
      },
      /**
       * Optional remote source to pull in
       */
      source: {
        name: "source",
        type: String
      },
      /**
       * String based value passed between the elements to stitch together
       */
      value: {
        name: "value",
        type: String
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

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
