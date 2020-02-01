import { LitElement, html, css } from "lit-element/lit-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { winEventsElement, wipeSlot } from "@lrnwebcomponents/utils/utils.js";
import "@polymer/iron-media-query/iron-media-query.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `hax-preview`
 * @customElement hax-preview
 * `An element that can generate a form`
 * @microcopy - the mental model for this element
 *  - element - the element to work against. an object that expresses enough information to create an element in the DOM. This is useful for remixing a tag via the json-form
 *  - source - a json object from some place loaded in remotely which will then be in json-schema format. This will then be parsed into a form which can be used to manipulate the element.
 */
class HaxPreview extends winEventsElement(LitElement) {
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      css`
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
          --eco-json-field-margin: var(--hax-field-margin, 0 0 4px);
          color: var(--hax-text-color);
        }

        .vaadin-split-layout-panel {
          flex: 1 1 auto;
          width: 100%;
          flex-wrap: nowrap;
          margin: 0;
          height: 100%;
          overflow: hidden;
        }
        #preview {
          padding: 16px;
          color: #000000;
          background-color: white;
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
        }
        #modetabs paper-tab {
          display: inline-flex;
          height: 100%;
          --paper-tab-ink: var(--hax-color-accent1);
        }
        #modetabs paper-tab paper-button {
          min-width: unset;
          width: 100%;
          background-color: var(--hax-preview-button-bg, white);
          color: var(--hax-preview-button-color, black);
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
        .preview-buttons paper-button {
          min-width: unset;
          width: 40%;
          color: var(--hax-preview-button-color, black);
          display: inline-block;
          background-color: var(--hax-preview-button-bg, white);
        }
        #insert {
          background-color: var(
            --hax-preview-insert-button-bg,
            --hax-preview-button-bg
          );
        }
        #cancel {
          background-color: var(
            --hax-preview-cancel-button-bg,
            --hax-preview-button-bg
          );
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
      `
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    this.responsiveWidth = "800px";
    this.orientation = "horizontal";
    this.orientationDirection = "width";
    this.previewNode = {};
    this.value = {};
    this.modeTab = "configure";
    this.editTitle = "Update";
    this.schema = {
      schema: {}
    };
    this.activeHaxElement = {};
    this.advancedForm = false;
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <custom-style>
        <style>
          #form {
            --eco-json-schema-object-form: {
              display: block !important;
            }
          }
          #modetabs {
            --paper-tabs: {
              background: transparent;
            }
          }
          #modetabs paper-tab {
            --paper-tab: {
              font-size: 16px;
            }
          }
          eco-json-schema-object {
            --eco-json-schema-object-form : {
              -ms-flex: unset;
              -webkit-flex: unset;
              flex: unset;
              -webkit-flex-basis: unset;
              flex-basis: unset;
            }
          }
        </style>
      </custom-style>
      <vaadin-split-layout
        class="panel-wrapper"
        orientation="${this.orientation}"
      >
        <div
          id="ppanel1"
          class="vaadin-split-layout-panel vaadin-layout-${this
            .orientationDirection}"
        >
          <div class="preview-buttons">
            <paper-button id="insert" raised @click="${this.insert}"
              >${this.editTitle}</paper-button
            >
            <paper-button id="cancel" raised @click="${this.cancel}"
              >Cancel</paper-button
            >
          </div>
          <div class="preview-text hide-on-mobile">
            <iron-icon icon="icons:arrow-drop-down"></iron-icon
            ><iron-icon icon="icons:arrow-drop-down"></iron-icon
            ><iron-icon icon="icons:arrow-drop-down"></iron-icon>${this
              .humanName}
            preview<iron-icon icon="icons:arrow-drop-down"></iron-icon
            ><iron-icon icon="icons:arrow-drop-down"></iron-icon
            ><iron-icon icon="icons:arrow-drop-down"></iron-icon>
          </div>
          <div id="preview"><slot></slot></div>
          <div class="preview-text preview-text-bottom hide-on-mobile">
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
          class="vaadin-split-layout-panel vaadin-layout-${this
            .orientationDirection}"
        >
          <paper-tabs
            .hidden="${!this.haspreviewNode}"
            id="modetabs"
            selected="${this.modeTab}"
            @selected-changed="${this.__modeTabChanged}"
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
              .schema="${this.schema}"
              .value="${this.value}"
              @value-changed="${this.__valueChangedEvent}"
            ></eco-json-schema-object>
          </paper-card>
        </div>
      </vaadin-split-layout>
      <iron-media-query
        query="${this._computeMediaQuery(this.responsiveWidth)}"
        @query-matches-changed="${this._onQueryMatchesChanged}"
      ></iron-media-query>
    `;
  }
  /**
   * Notice change in eco and bubble up
   * @todo this needs replaced with simple-fields
   */
  __valueChangedEvent(e) {
    this.value = { ...e.detail.value };
  }
  /**
   * Tab change
   */
  __modeTabChanged(e) {
    this.modeTab = e.detail.value;
  }
  static get tag() {
    return "hax-preview";
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "value") {
        this._valueChanged(this[propName]);
        // notify
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName === "previewNode") {
        this._previewNodeChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("preview-node-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName === "activeHaxElement") {
        this._activeHaxElementChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("active-hax-element-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName === "modeTab") {
        this._editorModeChanged(this[propName], oldValue);
      }
      if (propName === "formKey") {
        this._formKeyChanged(this[propName], oldValue);
      }
      if (propName === "advancedForm") {
        this.formKey = this._computedFormKey(this[propName]);
      }
      if (propName === "formKey") {
        this.canEditSource = this._computedEditSource(this[propName]);
      }
      if (propName === "previewNode") {
        this.haspreviewNode = this._computedHasPreviewNode(this[propName]);
      }
    });
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      responsiveWidth: {
        type: String,
        attribute: "responsive-width"
      },
      orientation: {
        type: String
      },
      orientationDirection: {
        type: String,
        attribute: "orientation-direction"
      },
      /**
       * A reference to the previewNode so we can do data binding correctly.
       */
      previewNode: {
        type: Object
      },
      /**
       * Returned value from the form input.
       */
      value: {
        type: Object
      },
      /**
       * State of mode tabs.
       */
      modeTab: {
        type: String
      },
      /**
       * Edit title since it can change based on the operation
       */
      editTitle: {
        type: String
      },
      /**
       * The element to work against expressing the structure of the DOM element
       * to create in the preview area.
       */
      activeHaxElement: {
        type: Object
      },
      /**
       * Boolean association for a preview node existing.
       */
      haspreviewNode: {
        type: Boolean
      },
      /**
       * JSON Schema.
       */
      schema: {
        type: Object
      },
      /**
       * If this is the advancedForm or not. Default to not but slider allows
       * switching mode for the form to be presented.
       */
      advancedForm: {
        type: Boolean
      },
      /**
       * If we should show source view or not.
       */
      canEditSource: {
        type: Boolean,
        attribute: "can-edit-source"
      },
      /**
       * Form key from hax to target.
       */
      formKey: {
        type: String,
        attribute: "form-key"
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
    window.HaxStore.write("openDrawer", false, this);
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
        for (var property in this.activeHaxElement.properties) {
          if (this.activeHaxElement.properties.hasOwnProperty(property)) {
            if (typeof schema.properties[property] !== typeof undefined) {
              schema.properties[
                property
              ].value = this.activeHaxElement.properties[property];
              // support custom element input
              if (
                typeof schema.properties[property].component !==
                  typeof undefined &&
                schema.properties[property].component.properties
              ) {
                schema.properties[
                  property
                ].component.properties.value = this.activeHaxElement.properties[
                  property
                ];
              }
              // attempt to set the property in the preview node
              if (
                property != "prefix" &&
                this.activeHaxElement.properties[property] != null &&
                !this.activeHaxElement.properties[property].readOnly
              ) {
                if (typeof this.previewNode.set === "function") {
                  // attempt to set it, should be no problem but never know
                  try {
                    this.previewNode.set(
                      property,
                      this.activeHaxElement.properties[property]
                    );
                  } catch (e) {
                    console.warn(`${property} is busted some how`);
                    console.warn(e);
                  }
                } else if (this.previewNode[property]) {
                  this.previewNode[property] = this.activeHaxElement.properties[
                    property
                  ];
                } else {
                  // set attribute, this doesn't have the Polymer convention
                  // this is Vanilla, Lit, etc
                  // set is powerful though for objects and arrays so they will reflect instantly
                  this.previewNode.setAttribute(
                    property,
                    this.activeHaxElement.properties[property]
                  );
                }
              } else if (property === "prefix") {
                this.previewNode.setAttribute(
                  "prefix",
                  this.activeHaxElement.properties[property]
                );
              } else {
                console.warn(`${property} is busted some how`);
              }
            }
            this.value[property] = this.activeHaxElement.properties[property];
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
            const previewNodeChildren = FlattenedNodesObserver.getFlattenedNodes(
              previewNode
            );
            for (var i in previewNodeChildren) {
              // test for element nodes to be safe
              if (
                typeof previewNodeChildren[i] !== typeof undefined &&
                previewNodeChildren[i].nodeType === 1 &&
                previewNodeChildren[i].slot ===
                  props.settings[this.formKey][prop].slot
              ) {
                if (
                  typeof previewNodeChildren[i].innerHTML !== typeof undefined
                ) {
                  schema.properties[
                    props.settings[this.formKey][prop].slot
                  ].value = previewNodeChildren[i].innerHTML;
                  this.value[props.settings[this.formKey][prop].slot] =
                    previewNodeChildren[i].innerHTML;
                }
              }
            }
          }
        }
      }
      this.schema = { ...schema };
    }
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (e.detail.property == "activeHaxElement") {
        this.activeHaxElement = { ...e.detail.value };
        // ensure we don't get an empty properties object here
        this.activeHaxElement.properties = { ...e.detail.value.properties };
      }
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
        for (var property in this.activeHaxElement.properties) {
          if (this.activeHaxElement.properties.hasOwnProperty(property)) {
            if (typeof schema.properties[property] !== typeof undefined) {
              schema.properties[
                property
              ].value = this.activeHaxElement.properties[property];
              // support custom element input
              if (
                typeof schema.properties[property].component !==
                  typeof undefined &&
                schema.properties[property].component.properties
              ) {
                schema.properties[
                  property
                ].component.properties.value = this.activeHaxElement.properties[
                  property
                ];
              }
            }
            // ensure this isn't read only
            if (
              this.activeHaxElement.properties[property] != null &&
              !this.activeHaxElement.properties[property].readOnly
            ) {
              // make sure slot is NEVER set in the preview
              // or it'll not show up and we'll get inconsistency with it
              // when in the context of being inserted into hax-body's shadow
              // slot is also a special attribute
              if (property === "slot") {
                // temp prop we use
                property = "data-hax-slot";
                // move it over
                this.activeHaxElement.properties[
                  property
                ] = this.activeHaxElement.properties["slot"];
                // delete the slot
                delete this.activeHaxElement.properties["slot"];
                if (this.activeHaxElement.properties[property] != null) {
                  newValue.setAttribute(
                    "data-hax-slot",
                    this.activeHaxElement.properties[property]
                  );
                }
              }
              // prefix is a special attribute and must be handled this way
              else if (property === "prefix") {
                newValue.setAttribute(
                  "prefix",
                  this.activeHaxElement.properties[property]
                );
              }
              // set is a Polymer convention but help w/ data binding there a lot
              else if (typeof newValue.set === "function") {
                // just to be safe
                try {
                  newValue.set(
                    property,
                    this.activeHaxElement.properties[property]
                  );
                } catch (e) {
                  console.warn(e);
                }
              }
              // vanilla / anything else we should just be able to set the prop
              else if (newValue[property]) {
                try {
                  newValue[property] = this.activeHaxElement.properties[property];
                } catch (e) {
                  console.warn(e);
                }
              } else {
                // @todo may need to bind differently for vanilla elements
                try {
                  newValue.setAttribute(
                    property,
                    this.activeHaxElement.properties[property]
                  );
                } catch (e) {
                  console.warn(e);
                }
              }
            }
            this.value[property] = this.activeHaxElement.properties[property];
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
              typeof schema.properties[property].component !==
                typeof undefined &&
              schema.properties[property].component.properties
            ) {
              schema.properties[property].component.properties.value =
                newValue.properties[property].value;
            }
            this.value[property] = newValue.properties[property].value;
          }
        }
        // need to specifically walk through slots if there is anything
        // that says it has to come from a slot
        for (var prop in props.settings[this.formKey]) {
          if (
            typeof props.settings[this.formKey][prop].slot !== typeof undefined
          ) {
            const newValueChildren = FlattenedNodesObserver.getFlattenedNodes(
              newValue
            );
            // walk through the slots looking for the value of it
            for (var i in newValueChildren) {
              // test for element nodes to be safe
              if (
                typeof newValueChildren[i] !== typeof undefined &&
                newValueChildren[i].nodeType === 1 &&
                newValueChildren[i].slot ===
                  props.settings[this.formKey][prop].slot
              ) {
                if (typeof newValueChildren[i].innerHTML !== typeof undefined) {
                  schema.properties[
                    props.settings[this.formKey][prop].slot
                  ].value = newValueChildren[i].innerHTML;
                  this.value[props.settings[this.formKey][prop].slot] =
                    newValueChildren[i].innerHTML;
                }
              }
            }
          }
        }
        this.schema = { ...schema };
      }
    }
  }

  /**
   * Element changed, update the preview area.
   */
  _activeHaxElementChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      // wipe the preview area and assocaited node
      wipeSlot(this, "*");
      this.previewNode = {};
      this.value = {};
      this.schema = {};
      this.schema = {
        schema: {}
      };
      this.modeTab = "configure";
      // if we have something, generate the new element inside it
      if (
        newValue &&
        newValue != null &&
        newValue.length != 0 &&
        newValue.tag
      ) {
        var frag = document.createElement(newValue.tag);
        frag.innerHTML = newValue.content;
        // clone the fragment which will force an escalation to full node
        var newNode = frag.cloneNode(true);
        newNode.setAttribute("hax-preview-mode", "hax-preview-mode");
        // if there is slot we need to shift it
        if (newNode.getAttribute("slot") != null) {
          newNode.setAttribute("data-hax-slot", newNode.getAttribute("slot"));
          newNode.removeAttribute("slot");
        }
        // send this into the root, which should filter it back down into the slot
        this.appendChild(newNode);
        // need to let append propagate, it probably takes like no time
        this.previewNode = newNode;
      }
    } else {
      this.modeTab = "advanced";
      this.previewNode = {};
    }
  }
  /**
   * Value in the form has changed, reflect to the preview
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
      for (var path in valueChange) {
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
            if (valueChange[path] === true) {
              node.setAttribute(attributeName, attributeName);
            } else if (valueChange[path] === false) {
              node.removeAttribute(attributeName);
            } else {
              // special support for innerText which is an html attribute...sorta
              if (attributeName === "inner-text") {
                node.innerText = valueChange[path];
                node.removeAttribute("innertext");
              } else if (
                valueChange[path] !== null &&
                valueChange[path] !== "null"
              ) {
                node.setAttribute(attributeName, valueChange[path]);
              }
            }
            this.activeHaxElement.properties[propData.attribute] =
              valueChange[path];
          } else if (propData.property) {
            if (valueChange[path] === true || valueChange[path] === false) {
              node[propData.property] = valueChange[path];
            } else {
              // account for a splice because... ugh
              if (
                valueChange[path] != null &&
                valueChange[path].indexSplices &&
                valueChange[path].indexSplices[0]
              ) {
                // dirty check, if this is a vanillaJS element w/ array splices
                // it might get PO'ed but time will tell
                // @notice polymer specific
                if (typeof node.set === "function") {
                  node.set(
                    propData.property,
                    valueChange[path].indexSplices[0].object
                  );
                  node.notifyPath(propData.property + ".*");
                } else {
                  node[propData.property] =
                    valueChange[path].indexSplices[0].object;
                }
              }
              // account for Array based values on initial set
              else if (
                valueChange[path] != null &&
                valueChange[path].constructor === Array
              ) {
                // look for polymer setter to notify paths correctly
                if (typeof node.set === "function") {
                  node.set(
                    propData.property,
                    window.HaxStore.toArray(valueChange[path])
                  );
                } else {
                  node[propData.property] = window.HaxStore.toArray(
                    valueChange[path]
                  );
                }
              } else {
                if (typeof node.set === "function") {
                  node.set(propData.property, valueChange[path]);
                } else {
                  node[propData.property] = valueChange[path];
                }
              }
            }
            this.activeHaxElement.properties[propData.property] =
              valueChange[path];
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
            tmpel.innerHTML = valueChange[path];
            const cloneIt = tmpel.cloneNode(true);
            // inject the slotted content but use text nodes if this is a text element
            if (window.HaxStore.instance.isTextElement(node)) {
              node.innerHTML = tmpel.innerHTML;
            } else {
              // wipe just the slot in question
              wipeSlot(node, propData.slot);
              node.appendChild(cloneIt);
            }
            this.activeHaxElement.content =
              "<template>" + cloneIt.outerHTML + "</template>";
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
