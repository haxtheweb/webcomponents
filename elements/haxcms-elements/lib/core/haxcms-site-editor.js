/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import "@lrnwebcomponents/h-a-x/h-a-x.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";

/**
 * `haxcms-site-editor`
 * `haxcms editor element that provides all editing capabilities`
 *
 * @demo demo/index.html
 */
class HAXCMSSiteEditor extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-site-editor";
  }
  constructor() {
    super();
    this.__disposer = [];
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #editbutton {
          position: fixed;
          bottom: 0;
          right: 0;
          margin: 16px;
          padding: 2px;
          width: 40px;
          height: 40px;
          visibility: visible;
          opacity: 1;
          transition: all 0.4s ease;
          z-index: 1000;
        }
        #outlinebutton {
          position: fixed;
          bottom: 0;
          right: 46px;
          margin: 16px;
          padding: 2px;
          width: 40px;
          height: 40px;
          visibility: visible;
          opacity: 1;
          transition: all 0.4s ease;
          z-index: 1000;
        }
        :host([edit-mode]) #editbutton {
          width: 100%;
          z-index: 100;
          right: 0;
          bottom: 0;
          border-radius: 0;
          height: 80px;
          margin: 0;
          padding: 8px;
          background-color: var(--paper-blue-500) !important;
        }
        h-a-x {
          padding: 80px 40px;
          margin: auto;
          display: none;
        }
        :host([edit-mode]) h-a-x {
          display: block;
        }
      </style>
      <iron-ajax
        headers='{"Authorization": "Bearer [[jwt]]"}'
        id="nodeupdateajax"
        url="[[saveNodePath]]"
        method="[[method]]"
        body="[[updateNodeData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleNodeResponse"
        last-error="{{lastError}}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer [[jwt]]"}'
        id="outlineupdateajax"
        url="[[saveOutlinePath]]"
        method="[[method]]"
        body="[[updateOutlineData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleOutlineResponse"
        last-error="{{lastError}}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer [[jwt]]"}'
        id="getfieldsajax"
        url="[[getNodeFieldsPath]]"
        method="[[method]]"
        body="[[getFieldsData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleGetFieldsResponse"
        last-error="{{lastError}}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer [[jwt]]"}'
        id="getsitefieldsajax"
        url="[[getSiteFieldsPath]]"
        method="[[method]]"
        body="[[getSiteFieldsData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleGetSiteFieldsResponse"
        last-error="{{lastError}}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer [[jwt]]"}'
        id="manifestupdateajax"
        url="[[saveManifestPath]]"
        method="[[method]]"
        body="[[updateManifestData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleManifestResponse"
        last-error="{{lastError}}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer [[jwt]]"}'
        id="publishajax"
        loading="{{publishing}}"
        url="[[publishSitePath]]"
        method="[[method]]"
        body="[[publishSiteData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handlePublishResponse"
        last-error="{{lastError}}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer [[jwt]]"}'
        id="revertajax"
        url="[[revertSitePath]]"
        method="[[method]]"
        body="[[revertSiteData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleRevertResponse"
        last-error="{{lastError}}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer [[jwt]]"}'
        id="createajax"
        url="[[createNodePath]]"
        method="[[method]]"
        body="[[createData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleCreateResponse"
        last-response="{{__createNodeResponse}}"
        last-error="{{lastError}}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer [[jwt]]"}'
        id="deleteajax"
        url="[[deleteNodePath]]"
        method="[[method]]"
        body="[[deleteData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleDeleteResponse"
        last-response="{{__deleteNodeResponse}}"
        last-error="{{lastError}}"
      ></iron-ajax>
      <h-a-x app-store$="[[appStore]]" hide-panel-ops></h-a-x>
    `;
  }
  static get properties() {
    return {
      /**
       * Singular error reporter / visual based on requests erroring
       */
      lastError: {
        type: Object,
        observer: "_lastErrorChanged"
      },
      /**
       * Allow method to be overridden, useful in local testing
       */
      method: {
        type: String,
        value: "POST"
      },
      /**
       * JSON Web token, it'll come from a global call if it's available
       */
      jwt: {
        type: String
      },
      /**
       * end point for saving nodes
       */
      saveNodePath: {
        type: String
      },
      /**
       * end point for create new nodes
       */
      createNodePath: {
        type: String
      },
      /**
       * end point for delete nodes
       */
      deleteNodePath: {
        type: String
      },
      /**
       * end point for saving manifest
       */
      saveManifestPath: {
        type: String
      },
      /**
       * end point for publishing
       */
      publishSitePath: {
        type: String
      },
      /**
       * end point for revert
       */
      revertSitePath: {
        type: String
      },
      /**
       * Publishing end point, this has CDN implications so show message
       */
      publishing: {
        type: Boolean,
        observer: "_publishingChanged"
      },
      /**
       * end point for saving outline
       */
      saveOutlinePath: {
        type: String
      },
      /**
       * appStore object from backend
       */
      appStore: {
        type: Object
      },
      /**
       * if the node is in an edit state or not
       */
      editMode: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * data as part of the POST to the backend
       */
      updateNodeData: {
        type: Object,
        value: {}
      },
      /**
       * delete node data
       */
      deleteData: {
        type: Object,
        value: {}
      },
      /**
       * create new node data
       */
      createData: {
        type: Object,
        value: {}
      },
      /**
       * create new node data
       */
      publishSiteData: {
        type: Object,
        value: {}
      },
      /**
       * revert site data
       */
      revertSiteData: {
        type: Object,
        value: {}
      },
      /**
       * data as part of the POST to the backend
       */
      updateManifestData: {
        type: Object,
        value: {}
      },
      /**
       * data as part of the POST to the backend
       */
      updateOutlineData: {
        type: Object,
        value: {}
      },
      /**
       * data as part of the POST to the backend
       */
      updateManifestData: {
        type: Object,
        value: {}
      },
      /**
       * data as part of the POST to the for field data
       */
      getFieldsData: {
        type: Object,
        value: {}
      },
      /**
       * data as part of the POST to the for field data
       */
      getSiteFieldsData: {
        type: Object,
        value: {}
      },
      /**
       * Active item of the node being worked on, JSON outline schema item format
       */
      activeItem: {
        type: Object,
        notify: true,
        observer: "_activeItemChanged"
      },
      /**
       * Outline of items in json outline schema format
       */
      manifest: {
        type: Object,
        notify: true,
        observer: "_manifestChanged"
      },
      getNodeFieldsPath: {
        type: String
      },
      getSiteFieldsPath: {
        type: String
      },
      getFieldsToken: {
        type: String
      }
    };
  }
  _lastErrorChanged(newValue) {
    if (newValue) {
      console.error(newValue);
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: newValue.error
        }
      });
      window.dispatchEvent(evt);
    }
  }
  /**
   * Break the shadow root for this element (by design)
   */
  _attachDom(dom) {
    this.appendChild(dom);
  }
  /**
   * ready life cycle
   */
  ready() {
    super.ready();
    afterNextRender(this, function() {
      import("@polymer/paper-button/paper-button.js");
      import("@lrnwebcomponents/hax-body/lib/hax-schema-form.js");
      autorun(reaction => {
        this.editMode = toJS(store.editMode);
        this.__disposer.push(reaction);
      });
      autorun(reaction => {
        this.manifest = toJS(store.manifest);
        this.__disposer.push(reaction);
      });
      autorun(reaction => {
        this.activeItem = toJS(store.activeItem);
        this.__disposer.push(reaction);
      });
      window.SimpleToast.requestAvailability();
      window.SimpleModal.requestAvailability();
      window.addEventListener(
        "hax-store-ready",
        this._storeReadyToGo.bind(this)
      );
      window.addEventListener(
        "json-outline-schema-active-item-changed",
        this._newActiveItem.bind(this)
      );
      window.addEventListener(
        "json-outline-schema-active-body-changed",
        this._bodyChanged.bind(this)
      );
      window.addEventListener(
        "haxcms-save-outline",
        this.saveOutline.bind(this)
      );
      window.addEventListener("haxcms-save-node", this.saveNode.bind(this));
      window.addEventListener(
        "haxcms-save-node-details",
        this.saveNodeDetails.bind(this)
      );
      window.addEventListener(
        "haxcms-save-site-data",
        this.saveManifest.bind(this)
      );
      window.addEventListener(
        "haxcms-load-node-fields",
        this.loadNodeFields.bind(this)
      );
      window.addEventListener(
        "haxcms-load-site-fields",
        this.loadSiteFields.bind(this)
      );
      window.addEventListener("haxcms-create-node", this.createNode.bind(this));
      window.addEventListener("haxcms-delete-node", this.deleteNode.bind(this));
      window.addEventListener(
        "haxcms-publish-site",
        this.publishSite.bind(this)
      );
      window.addEventListener(
        "haxcms-git-revert-last-commit",
        this.revertCommit.bind(this)
      );
      microTask.run(() => {
        this.updateStyles();
        if (window.HaxStore.ready) {
          let detail = {
            detail: true
          };
          this._storeReadyToGo(detail);
        }
      });
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: "You are logged in, edit tools shown."
        }
      });
      window.dispatchEvent(evt);
    });
  }
  connectedCallback() {
    super.connectedCallback();
    // fire event suggesting that we were authorized to have a site editor
    // so the UI and other pieces can react to this news
    // this tag is going to be added by a backend if it has determined we have a valid one
    window.dispatchEvent(
      new CustomEvent("haxcms-site-editor-loaded", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
  }
  /**
   * Detatched life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    window.removeEventListener(
      "hax-store-ready",
      this._storeReadyToGo.bind(this)
    );
    window.removeEventListener(
      "haxcms-save-outline",
      this.saveOutline.bind(this)
    );
    window.removeEventListener("haxcms-save-node", this.saveNode.bind(this));
    window.removeEventListener(
      "haxcms-save-node-details",
      this.saveNodeDetails.bind(this)
    );
    window.removeEventListener(
      "haxcms-save-site-data",
      this.saveManifest.bind(this)
    );
    window.removeEventListener(
      "haxcms-publish-site",
      this.publishSite.bind(this)
    );
    window.removeEventListener(
      "haxcms-git-revert-last-commit",
      this.revertCommit.bind(this)
    );
    window.removeEventListener(
      "json-outline-schema-active-item-changed",
      this._newActiveItem.bind(this)
    );
    window.removeEventListener(
      "json-outline-schema-active-body-changed",
      this._bodyChanged.bind(this)
    );
    window.removeEventListener(
      "haxcms-load-node-fields",
      this.loadNodeFields.bind(this)
    );
    window.removeEventListener(
      "haxcms-load-site-fields",
      this.loadSiteFields.bind(this)
    );
    window.removeEventListener(
      "haxcms-create-node",
      this.createNode.bind(this)
    );
    window.removeEventListener(
      "haxcms-delete-node",
      this.deleteNode.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * Load and display node fields
   */
  loadNodeFields(e) {
    this.__nodeFieldsInvoked = e.detail;
    // pass along the jwt for user "session" purposes
    this.set("getFieldsData.jwt", this.jwt);
    this.notifyPath("getFieldsData.jwt");
    this.set("getFieldsData.token", this.getFieldsToken);
    this.notifyPath("getFieldsData.token");
    this.set("getFieldsData.siteName", this.manifest.metadata.siteName);
    this.notifyPath("getFieldsData.siteName");
    this.set("getFieldsData.nodeId", this.activeItem.id);
    this.notifyPath("getFieldsData.nodeId");
    this.$.getfieldsajax.generateRequest();
  }
  /**
   * Load site fields
   */
  loadSiteFields(e) {
    this.__siteFieldsInvoked = e.detail;
    // pass along the jwt for user "session" purposes
    this.set("getSiteFieldsData.jwt", this.jwt);
    this.notifyPath("getSiteFieldsData.jwt");
    this.set("getSiteFieldsData.token", this.getFieldsToken);
    this.notifyPath("getSiteFieldsData.token");
    this.set("getSiteFieldsData.siteName", this.manifest.metadata.siteName);
    this.notifyPath("getSiteFieldsData.siteName");
    this.$.getsitefieldsajax.generateRequest();
  }
  /**
   * Handle getting fields response
   */
  _handleGetFieldsResponse(e) {
    // we get back HAXSchema from the server
    let wiring = new HAXWiring();
    this._haxSchema = wiring.prototypeHaxProperties();
    this._haxSchema.settings = e.detail.response.haxSchema;
    let values = e.detail.response.values;
    let c = document.createElement("hax-schema-form");
    // set a min width of 50 viewable
    c.style.minWidth = "50vw";
    for (var key in this._haxSchema.settings) {
      let schema = wiring.getHaxJSONSchema(key, this._haxSchema);
      for (var i in schema.properties) {
        if (values[i]) {
          schema.properties[i].value = values[i];
        }
      }
      c.set(key + "Schema", schema);
    }
    this.__fieldsForm = c;
    let b1 = document.createElement("paper-button");
    b1.raised = true;
    let icon = document.createElement("iron-icon");
    icon.icon = "icons:save";
    b1.appendChild(icon);
    b1.appendChild(document.createTextNode("Save fields"));
    b1.setAttribute("dialog-confirm", "dialog-confirm");
    b1.addEventListener("click", this._saveFieldsTap.bind(this));
    let b2 = document.createElement("paper-button");
    b2.appendChild(document.createTextNode("cancel"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    let b = document.createElement("div");
    b.style.position = "absolute";
    b.style.bottom = 0;
    b.style.left = 0;
    b.style.right = 0;
    b.style.zIndex = 1000000;
    b.style.backgroundColor = "#ddd";
    b.appendChild(b1);
    b.appendChild(b2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      styles: {
        "--simple-modal-width": "70vw",
        "--simple-modal-height": "70vh",
        "--simple-modal-max-width": "70vw",
        "--simple-modal-max-height": "70vh"
      },
      detail: {
        title: "Edit " + store.activeTitle + " fields",
        elements: { content: c, buttons: b },
        invokedBy: this.__nodeFieldsInvoked,
        clone: false,
        modal: true
      }
    });
    window.dispatchEvent(evt);
  }
  /**
   * Handle getting fields response
   */
  _handleGetSiteFieldsResponse(e) {
    // we get back HAXSchema from the server
    let wiring = new HAXWiring();
    this._haxSchema = wiring.prototypeHaxProperties();
    this._haxSchema.settings = e.detail.response.haxSchema;
    let values = e.detail.response.values;
    let h = "";
    if (this.manifest.metadata.publishedLocation) {
      h = document.createElement("a");
      h.setAttribute("tabindex", "-1");
      h.setAttribute("href", this.manifest.metadata.publishedLocation);
      h.setAttribute("target", "_blank");
      h.innerHTML =
        '<paper-button raised style="text-transform:none;">Access published version</paper-button>';
    }
    let c = document.createElement("hax-schema-form");
    c.addEventListener(
      "value-changed",
      this._schemaFormValueChanged.bind(this)
    );
    // set a min width of 50 viewable
    c.style.minWidth = "50vw";
    for (var key in this._haxSchema.settings) {
      let schema = wiring.getHaxJSONSchema(key, this._haxSchema);
      for (var i in schema.properties) {
        if (values[i]) {
          schema.properties[i].value = values[i];
        }
      }
      c.set(key + "Schema", schema);
    }
    this.__siteFieldsForm = c;
    // build a save button
    let b1 = document.createElement("paper-button");
    b1.raised = true;
    let icon = document.createElement("iron-icon");
    icon.icon = "icons:save";
    b1.appendChild(icon);
    b1.appendChild(document.createTextNode("Save fields"));
    b1.setAttribute("dialog-confirm", "dialog-confirm");
    b1.addEventListener("click", this._saveSiteFieldsTap.bind(this));
    // cancel
    let b2 = document.createElement("paper-button");
    b2.appendChild(document.createTextNode("cancel"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    // publish button
    let icon2 = document.createElement("iron-icon");
    icon2.icon = "icons:cloud-upload";
    let b3 = document.createElement("paper-button");
    b3.raised = true;
    b3.appendChild(icon2);
    b3.appendChild(document.createTextNode("Publish"));
    b3.setAttribute("dialog-confirm", "dialog-confirm");
    b3.addEventListener("click", this._publishTap.bind(this));
    b3.style.minWidth = "100px";
    b3.style.backgroundColor = "var(--haxcms-color)";
    let b4 = document.createElement("paper-button");
    b4.raised = true;
    b4.appendChild(document.createTextNode("Roll site back"));
    b4.setAttribute("dialog-confirm", "dialog-confirm");
    b4.addEventListener("click", this._revertCommit.bind(this));
    b4.style.minWidth = "100px";
    b4.style.marginLeft = "50px";
    b4.style.backgroundColor = "var(--simple-colors-default-theme-red-8)";
    b4.style.color = "white";

    let b = document.createElement("div");
    b.style.position = "absolute";
    b.style.bottom = 0;
    b.style.left = 0;
    b.style.right = 0;
    b.style.zIndex = 1000000;
    b.style.backgroundColor = "#ddd";
    b.appendChild(b1);
    b.appendChild(b2);
    b.appendChild(b3);
    b.appendChild(b4);
    window.dispatchEvent(
      new CustomEvent("simple-modal-show", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          title: "Edit site fields",
          elements: { header: h, content: c, buttons: b },
          invokedBy: this.__siteFieldsInvoked,
          clone: false,
          modal: true
        }
      })
    );
  }
  _schemaFormValueChanged(e) {
    let customTag = {
      property: "custom-theme-tag",
      title: "Custom theme tag",
      description: "Tag that supplies the custom theme",
      inputMethod: "textfield",
      required: true,
      validationType: "text"
    };
    // @todo figure out why this isn't adding a field in on the fly
    /*if (e.target.value.theme === "haxcms-custom-theme") {
      e.target.addField(customTag.property, customTag);
      e.target.value[customTag.property] = customTag.property;
    } else {
      e.target.removeField(customTag.property);
      delete e.target.value[customTag.property];
    }*/
  }
  /**
   * Publish request send to backend from button
   */
  _publishTap(e) {
    this.dispatchEvent(
      new CustomEvent("haxcms-publish-site", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
  }
  /**
   * Revert Commit pressed
   */
  _revertCommit(e) {
    this.dispatchEvent(
      new CustomEvent("haxcms-git-revert-last-commit", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
  }
  /**
   * Save the fields as we get tapped
   */
  _saveFieldsTap(e) {
    let values = this.__fieldsForm.value;
    values.id = this.activeItem.id;
    // fire event with details for saving
    window.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: values
      })
    );
    // fire event to close the modal
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {}
      })
    );
  }
  /**
   * Save the fields as we get tapped
   */
  _saveSiteFieldsTap(e) {
    let values = this.__siteFieldsForm.value;
    // fire event with details for saving
    window.dispatchEvent(
      new CustomEvent("haxcms-save-site-data", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: values
      })
    );
    // fire event to close the modal
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {}
      })
    );
  }
  /**
   * create node event
   */
  createNode(e) {
    if (e.detail.values) {
      this.set("createData", {});
      this.set("createData", e.detail.values);
      this.notifyPath("createData.*");
      this.set("createData.siteName", this.manifest.metadata.siteName);
      this.notifyPath("createData.siteName");
      this.set("createData.jwt", this.jwt);
      this.notifyPath("createData.jwt");
      this.$.createajax.generateRequest();
      const evt = new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {}
      });
      window.dispatchEvent(evt);
    }
  }
  _handleCreateResponse(response) {
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: `Created ${this.__createNodeResponse.title}!`,
        duration: 3000
      }
    });
    window.dispatchEvent(evt);
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
  }
  /**
   * delete the node we just got
   */
  deleteNode(e) {
    this.set("deleteData", {});
    this.set("deleteData.nodeId", e.detail.item.id);
    this.notifyPath("deleteData.nodeId");
    this.set("deleteData.siteName", this.manifest.metadata.siteName);
    this.notifyPath("deleteData.siteName");
    this.set("deleteData.jwt", this.jwt);
    this.notifyPath("deleteData.jwt");
    this.$.deleteajax.generateRequest();
    const evt = new CustomEvent("simple-modal-hide", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {}
    });
    window.dispatchEvent(evt);
  }
  /**
   * node deleted response
   */
  _handleDeleteResponse(response) {
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: `Deleted ${this.__deleteNodeResponse.title}`,
        duration: 3000
      }
    });
    this.dispatchEvent(evt);
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
  }
  /**
   * Establish certain global settings in HAX once it claims to be ready to go
   */
  _storeReadyToGo(event) {
    if (event.detail) {
      window.HaxStore.instance.connectionRewrites.appendJwt = "jwt";
      window.HaxStore.instance.haxPanel.align = "left";
      window.HaxStore.instance.haxPanel.hidePanelOps = true;
    }
  }
  /**
   * notice publishing callback changing state
   */
  _publishingChanged(newValue, oldValue) {
    if (newValue) {
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: "Publishing...",
          duration: 0
        }
      });
      window.dispatchEvent(evt);
    } else if (!newValue && oldValue) {
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: "Publishing...",
          duration: 3000
        }
      });
      window.dispatchEvent(evt);
    }
  }
  /**
   * react to manifest being changed
   */
  _manifestChanged(newValue) {
    if (this.activeItem && newValue.metadata) {
      // set upload manager to point to this location in a more dynamic fashion
      window.HaxStore.instance.connectionRewrites.appendUploadEndPoint =
        "siteName=" +
        newValue.metadata.siteName +
        "&nodeId=" +
        this.activeItem.id;
    }
  }
  /**
   * update the internal active item
   */
  _newActiveItem(e) {
    this.set("activeItem", e.detail);
    this.notifyPath("activeItem.*");
  }
  /**
   * active item changed
   */
  _activeItemChanged(newValue, oldValue) {
    if (newValue && this.manifest) {
      // set upload manager to point to this location in a more dynamic fashion
      window.HaxStore.instance.connectionRewrites.appendUploadEndPoint =
        "siteName=" +
        this.manifest.metadata.siteName +
        "&nodeId=" +
        newValue.id;
    }
  }
  /**
   * handle update responses for nodes and outlines
   */
  _handleNodeResponse(e) {
    // node response may include the item that got updated
    // it also may be a new path so let's ensure that's reflected
    if (
      typeof e.detail.location !== "undefined" &&
      this.activeItem.location !== e.detail.location
    ) {
      window.location(e.detail.location);
      window.history.pushState({}, null, e.detail.location);
      window.dispatchEvent(new PopStateEvent("popstate"));
      const active = this.manifest.items.find(i => {
        return i.id === e.detail.id;
      });
      this.activeItem = active;
      this.dispatchEvent(
        new CustomEvent("json-outline-schema-active-item-changed", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: active
        })
      );
    }
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: "Page saved!",
        duration: 4000
      }
    });
    window.dispatchEvent(evt);
    // updates the manifest
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
    // updates the node contents itself
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update-node", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
  }
  _handleOutlineResponse(e) {
    // trigger a refresh of the data in node
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: "Outline saved!",
        duration: 3000
      }
    });
    window.dispatchEvent(evt);
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
  }
  _handleManifestResponse(e) {
    // trigger a refresh of the data in node
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: "Site details saved!",
        duration: 3000
      }
    });
    this.dispatchEvent(evt);
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
  }
  /**
   * Tell the user we undid their last state of the site and trigger
   * everything to update to reflect this
   */
  _handleRevertResponse(e) {
    // trigger a refresh of the data in node
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: "Last save undone",
        duration: 3000
      }
    });
    this.dispatchEvent(evt);
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true
      })
    );
  }
  _handlePublishResponse(e) {
    let data = e.detail.response;
    // show the published response
    let content = document.createElement("span");
    content.innerHTML = `
    <a href="${data.url}" target="_blank">
      <paper-button raised style="color:yellow;text-transform: none;font-weight: bold;">
      ${data.label}
      </paper-button>
    </a>`;
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: data.response,
        duration: 10000,
        slot: content.cloneNode(true)
      }
    });
    window.dispatchEvent(evt);
  }
  /**
   * Save node event
   */
  saveNode(e) {
    this.set("updateNodeData", {});
    this.set("updateNodeData.siteName", this.manifest.metadata.siteName);
    this.notifyPath("updateNodeData.siteName");
    // get the body from what's there currently
    let body = window.HaxStore.instance.activeHaxBody.haxToContent();
    this.set("updateNodeData.body", body);
    this.notifyPath("updateNodeData.body");
    // convert to schema so we can ship that too if we want to process
    this.set("updateNodeData.schema", window.HaxStore.htmlToHaxElements(body));
    this.notifyPath("updateNodeData.schema");
    this.set("updateNodeData.nodeId", this.activeItem.id);
    this.notifyPath("updateNodeData.nodeId");
    this.set("updateNodeData.jwt", this.jwt);
    this.notifyPath("updateNodeData.jwt");
    // send the request
    if (this.saveNodePath) {
      this.$.nodeupdateajax.generateRequest();
    }
  }
  /**
   * Save node event
   */
  saveNodeDetails(e) {
    this.set("updateNodeData", {});
    this.set("updateNodeData.siteName", this.manifest.metadata.siteName);
    this.notifyPath("updateNodeData.siteName");
    this.set("updateNodeData.nodeId", e.detail.id);
    this.notifyPath("updateNodeData.nodeId");
    this.set("updateNodeData.details", e.detail);
    this.notifyPath("updateNodeData.details");
    this.set("updateNodeData.jwt", this.jwt);
    this.notifyPath("updateNodeData.jwt");
    // send the request
    if (this.saveNodePath) {
      this.$.nodeupdateajax.generateRequest();
    }
  }
  /**
   * Save the outline based on an event firing.
   */
  saveOutline(e) {
    // now let's work on the outline
    this.set("updateOutlineData.siteName", this.manifest.metadata.siteName);
    this.notifyPath("updateOutlineData.siteName");
    this.set("updateOutlineData.items", e.detail);
    this.notifyPath("updateOutlineData.items");
    this.set("updateOutlineData.jwt", this.jwt);
    this.notifyPath("updateOutlineData.jwt");
    if (this.saveOutlinePath) {
      this.$.outlineupdateajax.generateRequest();
    }
  }
  /**
   * Save the outline based on an event firing.
   */
  saveManifest(e) {
    // now let's work on the outline
    let values = e.detail;
    // if we have a cssVariable selected then generate a hexCode off of it
    if (values.cssVariable) {
      values.hexCode =
        window.SimpleColorsStyles.colors[
          values.cssVariable
            .replace("--simple-colors-default-theme-", "")
            .replace("-7", "")
        ][6];
    }
    this.set("updateManifestData.siteName", this.manifest.metadata.siteName);
    this.notifyPath("updateManifestData.siteName");
    this.set("updateManifestData.manifest", values);
    this.notifyPath("updateManifestData.manifest");
    this.set("updateManifestData.jwt", this.jwt);
    this.notifyPath("updateManifestData.jwt");
    if (this.saveManifestPath) {
      this.$.manifestupdateajax.generateRequest();
    }
  }
  /**
   * Save the outline based on an event firing.
   */
  publishSite(e) {
    this.set("publishSiteData.siteName", this.manifest.metadata.siteName);
    this.notifyPath("publishSiteData.siteName");
    this.set("publishSiteData.jwt", this.jwt);
    this.notifyPath("publishSiteData.jwt");
    if (this.publishSitePath) {
      this.$.publishajax.generateRequest();
    }
  }
  /**
   * Revert last commit
   */
  revertCommit(e) {
    this.set("revertSiteData.siteName", this.manifest.metadata.siteName);
    this.notifyPath("revertSiteData.siteName");
    this.set("revertSiteData.jwt", this.jwt);
    this.notifyPath("revertSiteData.jwt");
    if (this.revertSitePath) {
      this.$.revertajax.generateRequest();
    }
  }
  /**
   * Notice body of content has changed and import into HAX
   */
  _bodyChanged(e) {
    if (window.HaxStore.instance.activeHaxBody) {
      window.HaxStore.instance.activeHaxBody.importContent(e.detail);
    }
  }
}
window.customElements.define(HAXCMSSiteEditor.tag, HAXCMSSiteEditor);
export { HAXCMSSiteEditor };
