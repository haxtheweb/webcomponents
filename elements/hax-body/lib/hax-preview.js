import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { wipeSlot } from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import "@polymer/iron-media-query/iron-media-query.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
/**
 * `hax-preview`
 * `An element that can generate a form`
 * @microcopy - the mental model for this element
 *  - element - the element to work against. an object that expresses enough information to create an element in the DOM. This is useful for remixing a tag via the json-form
 *  - source - a json object from some place loaded in remotely which will then be in json-schema format. This will then be parsed into a form which can be used to manipulate the element.
 */
class HaxPreview extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-card/paper-card.js");
    import("@polymer/paper-tabs/paper-tabs.js");
    import("@polymer/paper-tabs/paper-tab.js");
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@vaadin/vaadin-split-layout/vaadin-split-layout.js");
    import("@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js");
    import("@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js");
    import("@lrnwebcomponents/code-editor/code-editor.js");
    import("@polymer/paper-input/paper-textarea.js");
    import("app-datepicker/app-datepicker.js");
    import("@polymer/paper-toggle-button/paper-toggle-button.js");
    import("@lrnwebcomponents/hax-body/lib/hax-upload-field.js");
    import("@lrnwebcomponents/simple-picker/simple-picker.js");
    import("@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js");
    import("@lrnwebcomponents/paper-input-flagged/paper-input-flagged.js");
  }
  static get template() {
    return html`
      <style include="simple-colors hax-shared-styles">
        :host {
          display: block;
          background-color: #ffffff;
          overflow: hidden;
        }
        iron-icon:not(:defined),
        paper-button:not(:defined) {
          display: none;
        }
        paper-card.form-wrapper {
          margin: 0;
          padding: 0 16px 80px 16px;
          width: 100%;
          min-height: 160px;
          background-color: transparent;
          overflow: auto;
          height: 100%;
        }

        vaadin-split-layout {
          display: flex;
          justify-content: space-around;
          height: 100%;
        }
        eco-json-schema-object {
          width: 50%;
        }

        .vaadin-split-layout-panel {
          flex: 1 1 auto;
          width: 100%;
          flex-wrap: nowrap;
          margin: 0;
          height: 100%;
          overflow: hidden;
        }
        #form {
          --eco-json-schema-object-form: {
            display: block !important;
          }
        }
        #preview {
          padding: 16px;
          color: #000000;
          background-color: var(--hax-color-bg-accent);
          max-height: 63vh;
          overflow: scroll;
        }
        #preview ::slotted(*) {
          float: unset !important;
          margin: unset !important;
          width: unset !important;
          position: unset !important;
          top: unset !important;
          left: unset !important;
          right: unset !important;
          bottom: unset !important;
        }
        .preview-text {
          font-size: 14px;
          color: var(--hax-color-text);
          font-style: italic;
          width: 100%;
          height: 24px;
          border-bottom: 1px solid var(--hax-color-border-outline);
          text-align: center;
          padding: 8px 0;
          box-sizing: content-box;
        }
        .preview-text iron-icon {
          margin: 0 8px;
          display: inline-block;
        }
        .preview-text-bottom {
          border-bottom: unset;
          border-top: 1px solid var(--hax-color-border-outline);
        }
        @media screen and (max-width: 550px) {
          .hide-on-mobile {
            opacity: 0;
            visibility: hidden;
            position: absolute;
            left: -9999px;
          }
        }

        #modetabs {
          height: 64px;
          padding: 0px;
          margin: 16px 0 0 0;
          box-sizing: content-box;
          color: var(--hax-color-text);
          text-align: center;
          background-color: transparent;
          border-bottom: 1px solid var(--hax-color-border-outline);
          display: block;
          justify-content: space-evenly;
          --paper-tabs-selection-bar-color: var(--hax-color-accent1);
          --paper-tabs: {
            background: transparent;
          }
        }

        #modetabs paper-tab {
          display: inline-flex;
          height: 100%;
          --paper-tab-ink: var(--hax-color-accent1);
          --paper-tab: {
            font-size: 16px;
          }
        }
        #modetabs paper-tab paper-button {
          min-width: unset;
          width: 100%;
          background-color: var(--hax-color-accent1);
          color: var(--hax-color-accent1-text);
        }
        .preview-buttons {
          height: 64px;
          padding: 0px;
          color: var(--hax-color-text);
          border-bottom: 1px solid var(--hax-color-border-outline);
          background-color: transparent;
          margin: 16px 0 0 0;
          text-align: center;
          box-sizing: content-box;
        }
        eco-json-schema-object {
          color: var(--hax-text-color);
          --eco-json-schema-object-form : {
            -ms-flex: unset;
            -webkit-flex: unset;
            flex: unset;
            -webkit-flex-basis: unset;
            flex-basis: unset;
          }
        }
        .preview-buttons paper-button {
          min-width: unset;
          width: 40%;
          color: var(--hax-color-accent1-text);
          display: inline-block;
          background-color: var(--hax-color-accent1);
        }
        .vaadin-layout-width {
          min-width: 30%;
          width: 50%;
          max-width: 70%;
        }
        .vaadin-layout-height {
          min-height: 40%;
          height: 50%;
          max-height: 60%;
        }
      </style>
      <vaadin-split-layout class="panel-wrapper" orientation="[[orientation]]">
        <div
          id="ppanel1"
          class$="vaadin-split-layout-panel vaadin-layout-[[orientationDirection]]"
        >
          <div class="preview-buttons">
            <paper-button id="insert" raised on-click="insert"
              >[[editTitle]]</paper-button
            >
            <paper-button id="cancel" raised on-click="cancel"
              >Cancel</paper-button
            >
          </div>
          <div class="preview-text">
            <iron-icon icon="icons:arrow-drop-down"></iron-icon
            ><iron-icon icon="icons:arrow-drop-down"></iron-icon
            ><iron-icon icon="icons:arrow-drop-down"></iron-icon>[[humanName]]
            preview<iron-icon icon="icons:arrow-drop-down"></iron-icon
            ><iron-icon icon="icons:arrow-drop-down"></iron-icon
            ><iron-icon icon="icons:arrow-drop-down"></iron-icon>
          </div>
          <div id="preview"><slot></slot></div>
          <div class="preview-text preview-text-bottom">
            <iron-icon icon="icons:arrow-drop-up"></iron-icon
            ><iron-icon icon="icons:arrow-drop-up"></iron-icon
            ><iron-icon icon="icons:arrow-drop-up"></iron-icon>end
            preview<iron-icon icon="icons:arrow-drop-up"></iron-icon
            ><iron-icon icon="icons:arrow-drop-up"></iron-icon
            ><iron-icon icon="icons:arrow-drop-up"></iron-icon>
          </div>
        </div>
        <div
          id="ppanel2"
          class$="vaadin-split-layout-panel vaadin-layout-[[orientationDirection]]"
        >
          <paper-tabs
            hidden\$="[[!haspreviewNode]]"
            id="modetabs"
            selected="{{modeTab}}"
            attr-for-selected="data-mode"
          >
            <paper-tab id="configurebutton" data-mode="configure"
              ><paper-button raised="" noink=""
                >Configure</paper-button
              ></paper-tab
            >
            <paper-tab id="advancedbutton" data-mode="advanced"
              ><paper-button raised="" noink=""
                >Advanced</paper-button
              ></paper-tab
            >
          </paper-tabs>
          <paper-card class="form-wrapper">
            <eco-json-schema-object
              id="form"
              schema="[[schema]]"
              value="{{value}}"
            ></eco-json-schema-object>
          </paper-card>
        </div>
      </vaadin-split-layout>
      <iron-media-query
        query="[[_computeMediaQuery(responsiveWidth)]]"
        on-query-matches-changed="_onQueryMatchesChanged"
      ></iron-media-query>
    `;
  }
  static get tag() {
    return "hax-preview";
  }
  static get observers() {
    return ["_valueChanged(value.*)"];
  }
  static get properties() {
    return {
      responsiveWidth: {
        type: String,
        value: "800px"
      },
      orientation: {
        type: String,
        value: "horizontal"
      },
      orientationDirection: {
        type: String,
        value: "width"
      },
      /**
       * A reference to the previewNode so we can do data binding correctly.
       */
      previewNode: {
        type: Object,
        value: {},
        notify: true,
        observer: "_previewNodeChanged"
      },
      /**
       * Returned value from the form input.
       */
      value: {
        type: Object,
        notify: true,
        value: {}
      },
      /**
       * State of mode tabs.
       */
      modeTab: {
        type: String,
        value: "configure",
        observer: "_editorModeChanged"
      },
      /**
       * Edit title since it can change based on the operation
       */
      editTitle: {
        type: String,
        value: "Update"
      },
      /**
       * The element to work against expressing the structure of the DOM element
       * to create in the preview area.
       */
      element: {
        type: Object,
        observer: "_elementChanged"
      },
      /**
       * Boolean association for a preview node existing.
       */
      haspreviewNode: {
        type: Boolean,
        computed: "_computedHasPreviewNode(previewNode)"
      },
      /**
       * JSON Schema.
       */
      schema: {
        type: Object,
        value: {
          schema: {}
        }
      },
      /**
       * If this is the advancedForm or not. Default to not but slider allows
       * switching mode for the form to be presented.
       */
      advancedForm: {
        type: Boolean,
        value: false
      },
      /**
       * If we should show source view or not.
       */
      canEditSource: {
        type: Boolean,
        computed: "_computedEditSource(formKey)"
      },
      /**
       * Form key from hax to target.
       */
      formKey: {
        type: String,
        computed: "_computedFormKey(advancedForm)",
        observer: "_formKeyChanged"
      },
      /**
       * Active Name from the properties
       */
      humanName: {
        type: String
      }
    };
  }
  _onQueryMatchesChanged(e) {
    if (e.detail.value) {
      this.orientation = "vertical";
      this.orientationDirection = "height";
    } else {
      this.orientation = "horizontal";
      this.orientationDirection = "width";
    }
  }

  _computeMediaQuery(responsiveWidth) {
    return "(max-width: " + responsiveWidth + ")";
  }
  /**
   * Trigger cancel on manager as it is the parent here.
   */
  cancel(e) {
    window.HaxStore.instance.haxManager.cancel(e);
  }

  /**
   * Trigger insert on manager as it is the parent here.
   */
  insert(e) {
    window.HaxStore.instance.haxManager.insertHaxElement(e);
  }

  /**
   * Make a boolean to match the preview node's existance.
   */
  _computedHasPreviewNode(previewNode) {
    if (typeof previewNode.tagName === typeof undefined) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Edit source.
   */
  _computedEditSource(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (
        typeof this.previewNode.tagName !== typeof undefined &&
        window.HaxStore.instance.elementList[
          this.previewNode.tagName.toLowerCase()
        ]
      ) {
        return window.HaxStore.instance.elementList[
          this.previewNode.tagName.toLowerCase()
        ].canEditSource;
      }
    }
    return true;
  }

  /**
   * Compute form key to use.
   */
  _computedFormKey(advanced) {
    if (advanced) {
      return "advanced";
    } else {
      return "configure";
    }
  }

  /**
   * Form key changed, rebuild schema for the form
   * but don't update the element. Critical difference.
   */
  _formKeyChanged(newValue, oldValue) {
    // ensure this doesn't run the 1st pass
    if (typeof oldValue !== typeof undefined) {
      var schema = {};
      // see if we can get schema off of this.
      if (
        typeof this.previewNode !== typeof undefined &&
        typeof this.previewNode.tagName !== typeof undefined &&
        typeof window.HaxStore.instance.elementList[
          this.previewNode.tagName.toLowerCase()
        ] !== typeof undefined
      ) {
        let element = this.element;
        let props =
          window.HaxStore.instance.elementList[
            this.previewNode.tagName.toLowerCase()
          ];
        if (typeof this.previewNode.getHaxJSONSchemaType === "function") {
          schema = window.HaxStore.instance.getHaxJSONSchema(
            newValue,
            props,
            this.previewNode
          );
        } else {
          schema = window.HaxStore.instance.getHaxJSONSchema(newValue, props);
        }
        for (var property in element.properties) {
          if (element.properties.hasOwnProperty(property)) {
            if (typeof schema.properties[property] !== typeof undefined) {
              schema.properties[property].value = element.properties[property];
              // support custom element input
              if (
                typeof schema.properties[property].component !==
                typeof undefined
              ) {
                schema.properties[property].component.properties.value =
                  element.properties[property];
              }
              // attempt to set the property in the preview node
              if (
                property != "prefix" &&
                element.properties[property] != null &&
                !element.properties[property].readOnly
              ) {
                if (typeof this.previewNode.set === "function") {
                  // attempt to set it, should be no problem but never know
                  try {
                    this.previewNode.set(
                      property,
                      element.properties[property]
                    );
                  } catch (e) {
                    console.warn(`${property} is busted some how`);
                    console.log(e);
                  }
                } else {
                  // set attribute, this doesn't have the Polymer convention
                  // this is Vanilla, Lit, etc
                  // set is powerful though for objects and arrays so they will reflect instantly
                  this.previewNode.setAttribute(
                    property,
                    element.properties[property]
                  );
                }
              } else if (property === "prefix") {
                this.previewNode.setAttribute(
                  "prefix",
                  element.properties[property]
                );
              } else {
                console.warn(`${property} is busted some how`);
              }
            }
            this.set("value." + property, element.properties[property]);
            this.notifyPath("value." + property);
          }
        }
        var slotsApplied = false;
        for (var prop in props.settings[newValue]) {
          let previewNode = this.previewNode;
          if (
            typeof props.settings[this.formKey][prop].slot !==
              typeof undefined &&
            !slotsApplied
          ) {
            slotsApplied = true;
            // walk through the slots looking for the value of it
            for (var i in dom(previewNode).getEffectiveChildNodes()) {
              // test for element nodes to be safe
              if (
                typeof dom(previewNode).getEffectiveChildNodes()[i] !==
                  typeof undefined &&
                dom(previewNode).getEffectiveChildNodes()[i].nodeType === 1 &&
                dom(previewNode).getEffectiveChildNodes()[i].slot ===
                  props.settings[this.formKey][prop].slot
              ) {
                if (
                  typeof dom(previewNode).getEffectiveChildNodes()[i]
                    .innerHTML !== typeof undefined
                ) {
                  schema.properties[
                    props.settings[this.formKey][prop].slot
                  ].value = dom(previewNode).getEffectiveChildNodes()[
                    i
                  ].innerHTML;
                  this.set(
                    "value." + props.settings[this.formKey][prop].slot,
                    dom(previewNode).getEffectiveChildNodes()[i].innerHTML
                  );
                  this.notifyPath(
                    "value." + props.settings[this.formKey][prop].slot
                  );
                }
              }
            }
          }
        }
      }
      this.set("schema", {});
      this.set("schema", schema);
    }
  }

  /**
   * When the preview node is updated, pull schema associated with it
   */
  _previewNodeChanged(newValue, oldValue) {
    // ensure this doesn't run the 1st pass
    if (typeof oldValue !== typeof undefined && newValue != oldValue) {
      // see if we can get schema off of this.
      if (
        typeof newValue.tagName !== typeof undefined &&
        typeof window.HaxStore.instance.elementList[
          newValue.tagName.toLowerCase()
        ] !== typeof undefined
      ) {
        const element = this.element;
        let props =
          window.HaxStore.instance.elementList[newValue.tagName.toLowerCase()];
        let schema = {};
        if (typeof newValue.getHaxJSONSchemaType === "function") {
          schema = window.HaxStore.instance.getHaxJSONSchema(
            this.formKey,
            props,
            newValue
          );
        } else {
          schema = window.HaxStore.instance.getHaxJSONSchema(
            this.formKey,
            props
          );
        }
        // generate a human name for this
        if (typeof props.gizmo.title === typeof undefined) {
          this.humanName = newValue.tagName.replace("-", " ").toLowerCase();
        } else {
          this.humanName = props.gizmo.title;
        }
        // first, allow element properties to dictate defaults
        for (var property in element.properties) {
          if (element.properties.hasOwnProperty(property)) {
            if (typeof schema.properties[property] !== typeof undefined) {
              schema.properties[property].value = element.properties[property];
              // support custom element input
              if (
                typeof schema.properties[property].component !==
                typeof undefined
              ) {
                schema.properties[property].component.properties.value =
                  element.properties[property];
              }
            }
            // ensure this isn't read only
            if (
              element.properties[property] != null &&
              !element.properties[property].readOnly
            ) {
              // attempt to set it, should be no problem but never know
              try {
                newValue.set(property, element.properties[property]);
              } catch (e) {}
            }
            this.set("value." + property, element.properties[property]);
            this.notifyPath("value." + property);
          }
        }
        // then, let the node itself dictate defaults if things are not set
        for (var property in newValue) {
          if (
            newValue.hasOwnProperty(property) &&
            typeof schema.properties[property] !== typeof undefined &&
            typeof newValue[property].value !== typeof undefined &&
            newValue[property].value !== null
          ) {
            schema.properties[property].value =
              newValue.properties[property].value;
            // support custom element input
            if (
              typeof schema.properties[property].component !== typeof undefined
            ) {
              schema.properties[property].component.properties.value =
                newValue.properties[property].value;
            }
            this.set("value." + property, newValue.properties[property].value);
            this.notifyPath("value." + property);
          }
        }
        // need to specifically walk through slots if there is anything
        // that says it has to come from a slot
        for (var prop in props.settings[this.formKey]) {
          if (
            typeof props.settings[this.formKey][prop].slot !== typeof undefined
          ) {
            // walk through the slots looking for the value of it
            for (var i in dom(newValue).getEffectiveChildNodes()) {
              // test for element nodes to be safe
              if (
                typeof dom(newValue).getEffectiveChildNodes()[i] !==
                  typeof undefined &&
                dom(newValue).getEffectiveChildNodes()[i].nodeType === 1 &&
                dom(newValue).getEffectiveChildNodes()[i].slot ===
                  props.settings[this.formKey][prop].slot
              ) {
                if (
                  typeof dom(newValue).getEffectiveChildNodes()[i].innerHTML !==
                  typeof undefined
                ) {
                  schema.properties[
                    props.settings[this.formKey][prop].slot
                  ].value = dom(newValue).getEffectiveChildNodes()[i].innerHTML;
                  this.set(
                    "value." + props.settings[this.formKey][prop].slot,
                    dom(newValue).getEffectiveChildNodes()[i].innerHTML
                  );
                  this.notifyPath(
                    "value." + props.settings[this.formKey][prop].slot
                  );
                }
              }
            }
          }
        }
        this.set("schema", {});
        this.set("schema", schema);
      }
    }
  }

  /**
   * Element changed, update the preview area.
   */
  _elementChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      // wipe the preview area and assocaited node
      let preview = dom(this);
      wipeSlot(preview, "*");
      this.set("previewNode", {});
      this.modeTab = "configure";
      // if we have something, generate the new element inside it
      if (newValue != null && newValue.length != 0) {
        var frag = document.createElement(newValue.tag);
        frag.innerHTML = newValue.content;
        // clone the fragment which will force an escalation to full node
        var newNode = frag.cloneNode(true);
        newNode.setAttribute("hax-preview-mode", "hax-preview-mode");
        // send this into the root, which should filter it back down into the slot
        preview.appendChild(newNode);
        // need to let append propagate, it probably takes like no time
        this.set("previewNode", newNode);
      }
    } else {
      this.modeTab = "advanced";
      this.set("previewNode", {});
    }
  }
  /**
   * Value in the form has changed, reflect to the preview.
   */
  _valueChanged(valueChange) {
    var node = this.previewNode;
    // sanity check and then get props and mesh with form value response
    if (
      typeof node.tagName !== typeof undefined &&
      typeof window.HaxStore.instance.elementList[
        node.tagName.toLowerCase()
      ] !== typeof undefined
    ) {
      for (var path in valueChange.base) {
        // load up the property bindings we care about from the store
        let props =
          window.HaxStore.instance.elementList[node.tagName.toLowerCase()];
        // translate key name to array position
        var propSettings = props.settings[this.formKey].filter(n => {
          if (typeof n.attribute !== typeof undefined) {
            return n.attribute === path;
          } else if (typeof n.property !== typeof undefined) {
            return n.property === path;
          } else if (typeof n.slot !== typeof undefined) {
            return n.slot === path;
          }
        });
        // ensure we have anything before moving forward (usually we will)
        if (propSettings.length > 0) {
          var propData = propSettings.pop();
          if (propData.attribute) {
            let attributeName = window.HaxStore.camelToDash(propData.attribute);
            // special supporting for boolean because html is weird :p
            if (valueChange.base[path] === true) {
              node.setAttribute(attributeName, attributeName);
            } else if (valueChange.base[path] === false) {
              node.removeAttribute(attributeName);
            } else {
              // special support for innerText which is an html attribute...sorta
              if (attributeName === "inner-text") {
                node.innerText = valueChange.base[path];
                node.removeAttribute("innertext");
              } else if (
                valueChange.base[path] !== null &&
                valueChange.base[path] !== "null"
              ) {
                node.setAttribute(attributeName, valueChange.base[path]);
              }
            }
            this.set(
              "element.properties." + propData.attribute,
              valueChange.base[path]
            );
            this.notifyPath("element.properties." + propData.attribute);
          } else if (propData.property) {
            if (
              valueChange.base[path] === true ||
              valueChange.base[path] === false
            ) {
              node[propData.property] = valueChange.base[path];
            } else {
              // account for a splice because... ugh
              if (
                valueChange.base[path] != null &&
                valueChange.base[path].indexSplices &&
                valueChange.base[path].indexSplices[0]
              ) {
                // dirty check, if this is a vanillaJS element w/ array splices
                // it might get PO'ed but time will tell
                if (typeof node.set === "function") {
                  node.set(
                    propData.property,
                    valueChange.base[path].indexSplices[0].object
                  );
                  node.notifyPath(propData.property + ".*");
                } else {
                  node[propData.property] =
                    valueChange.base[path].indexSplices[0].object;
                }
              }
              // account for Array based values on initial set
              else if (
                valueChange.base[path] != null &&
                valueChange.base[path].constructor === Array
              ) {
                // look for polymer setter to notify paths correctly
                if (typeof node.set === "function") {
                  node.set(
                    propData.property,
                    window.HaxStore.toArray(valueChange.base[path])
                  );
                } else {
                  node[propData.property] = window.HaxStore.toArray(
                    valueChange.base[path]
                  );
                }
              } else {
                if (typeof node.set === "function") {
                  node.set(propData.property, valueChange.base[path]);
                } else {
                  node[propData.property] = valueChange.base[path];
                }
              }
            }
            this.set(
              "element.properties." + propData.property,
              valueChange.base[path]
            );
            this.notifyPath("element.properties." + propData.property);
          } else if (typeof propData.slot !== typeof undefined) {
            let slotTag = "span";
            if (propData.slotWrapper) {
              slotTag = propData.slotWrapper;
            } else if (node.tagName.toLowerCase() === "code-editor") {
              slotTag = "template";
            }
            var tmpel = document.createElement(slotTag);
            if (propData.slotAttributes) {
              for (var attr in propData.slotAttributes) {
                tmpel.setAttribute(attr, propData.slotAttributes[attr]);
              }
            }
            // support unnamed slots
            if (propData.slot !== "") {
              tmpel.slot = propData.slot;
            }
            tmpel.innerHTML = valueChange.base[path];
            // wipe just the slot in question
            wipeSlot(node, propData.slot);
            const cloneIt = tmpel.cloneNode(true);
            // inject the slotted content
            dom(node).appendChild(cloneIt);
            this.set(
              "element.content",
              "<template>" + cloneIt.outerHTML + "</template>"
            );
            this.notifyPath("element.content");
          }
        }
      }
    }
  }
  /**
   * Editor mode changed handler
   */
  _editorModeChanged(mode) {
    if (mode) {
      // if it's the advanced setting then toggle the advancedForm setting
      if (mode === "advanced") {
        this.advancedForm = true;
      } else {
        this.advancedForm = false;
      }
    }
  }
}
window.customElements.define(HaxPreview.tag, HaxPreview);
export { HaxPreview };
