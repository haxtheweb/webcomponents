/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import "@lrnwebcomponents/h-a-x/h-a-x.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/hax-body/lib/hax-schema-form.js";
import "./haxcms-site-dashboard.js";

/**
 * `haxcms-site-editor`
 * `haxcms editor element that provides all editing capabilities`
 *
 * @demo demo/index.html
 */
class HAXCMSSiteEditor extends LitElement {
  static get styles() {
    return [
      css`
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
          margin: auto;
          display: none;
        }
        :host([edit-mode]) h-a-x {
          display: block;
        }
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-editor";
  }
  constructor() {
    super();
    this.__disposer = [];
    this.getUserDataBody = {};
    this.method = "POST";
    this.editMode = false;
    this.deleteData = {};
    this.createData = {};
    this.publishSiteData = {};
    this.revertSiteData = {};
    this.syncSiteData = {};
    this.updateManifestData = {};
    this.updateOutlineData = {};
    this.updateManifestData = {};
    this.getNodeFieldsData = {};
  }
  // render function
  render() {
    return html`
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="nodeupdateajax"
        url="${this.saveNodePath}"
        method="${this.method}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleNodeResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="outlineupdateajax"
        url="${this.saveOutlinePath}"
        method="${this.method}"
        .body="${this.updateOutlineData}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleOutlineResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="manifestupdateajax"
        url="${this.saveManifestPath}"
        method="${this.method}"
        .body="${this.updateManifestData}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleManifestResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="publishajax"
        loading="${this.publishing}"
        @loading-changed="${this.loadingChanged}"
        url="${this.publishSitePath}"
        method="${this.method}"
        .body="${this.publishSiteData}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handlePublishResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="revertajax"
        url="${this.revertSitePath}"
        method="${this.method}"
        .body="${this.revertSiteData}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleRevertResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="syncajax"
        url="${this.syncSitePath}"
        method="${this.method}"
        .body="${this.syncSiteData}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleSyncResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="createajax"
        url="${this.createNodePath}"
        method="${this.method}"
        .body="${this.createData}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleCreateResponse}"
        @last-error-changed="${this.lastErrorChanged}"
        @last-response-changed="${this.__createNodeResponseChanged}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="deleteajax"
        url="${this.deleteNodePath}"
        method="${this.method}"
        .body="${this.deleteData}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleDeleteResponse}"
        @last-error-changed="${this.lastErrorChanged}"
        @last-response-changed="${this.__deleteNodeResponseChanged}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="getnodefieldsajax"
        url="${this.getNodeFieldsPath}"
        method="${this.method}"
        .body="${this.getNodeFieldsData}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleGetNodeFieldsResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        headers='{"Authorization": "Bearer ${this.jwt}"}'
        id="getuserdata"
        url="${this.getUserDataPath}"
        method="${this.method}"
        .body="${this.getUserDataBody}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleUserDataResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <h-a-x id="hax" hide-panel-ops></h-a-x>
    `;
  }
  static get properties() {
    return {
      getUserDataPath: {
        type: String
      },
      getUserDataBody: {
        type: Object
      },
      /**
       * Singular error reporter / visual based on requests erroring
       */
      lastError: {
        type: Object
      },
      /**
       * Allow method to be overridden, useful in local testing
       */
      method: {
        type: String
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
      appendTarget: {
        type: Object
      },
      appElement: {
        type: Object
      },
      /**
       * end point for sync
       */
      syncSitePath: {
        type: String
      },
      /**
       * Publishing end point, this has CDN implications so show message
       */
      publishing: {
        type: Boolean
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
        reflect: true
      },
      /**
       * delete node data
       */
      deleteData: {
        type: Object
      },
      /**
       * create new node data
       */
      createData: {
        type: Object
      },
      /**
       * create new node data
       */
      publishSiteData: {
        type: Object
      },
      /**
       * revert site data
       */
      revertSiteData: {
        type: Object
      },
      /**
       * sync site data
       */
      syncSiteData: {
        type: Object
      },
      /**
       * data as part of the POST to the backend
       */
      updateManifestData: {
        type: Object
      },
      /**
       * data as part of the POST to the backend
       */
      updateOutlineData: {
        type: Object
      },
      /**
       * data as part of the POST to the backend
       */
      updateManifestData: {
        type: Object
      },
      /**
       * data as part of the POST to the for field data
       */
      getNodeFieldsData: {
        type: Object
      },
      /**
       * Active item of the node being worked on, JSON outline schema item format
       */
      activeItem: {
        type: Object
      },
      /**
       * Outline of items in json outline schema format
       */
      manifest: {
        type: Object
      },
      getNodeFieldsPath: {
        type: String
      },
      getSiteFieldsPath: {
        type: String
      },
      getFormToken: {
        type: String
      },
      /**
       * Site dashboard element reference
       */
      siteDashboard: {
        type: Object
      }
    };
  }
  __deleteNodeResponseChanged(e) {
    this.__deleteNodeResponse = e.detail.value;
  }
  __createNodeResponseChanged(e) {
    this.__createNodeResponse = e.detail.value;
  }
  _handleUserDataResponse(e) {
    store.userData = e.detail.response.data;
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
  lastErrorChanged(e) {
    this.lastError = e.detail.value;
  }
  loadingChanged(e) {
    this.loading = e.detail.value;
  }
  /**
   * Break the shadow root for this element (by design)
   */
  createRenderRoot() {
    return this;
  }
  /**
   * ready life cycle
   */
  firstUpdated(changedProperties) {
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
    window.addEventListener("hax-store-ready", this._storeReadyToGo.bind(this));
    window.addEventListener(
      "json-outline-schema-active-item-changed",
      this._newActiveItem.bind(this)
    );
    window.addEventListener(
      "json-outline-schema-active-body-changed",
      this._bodyChanged.bind(this)
    );
    window.addEventListener("haxcms-save-outline", this.saveOutline.bind(this));
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
      "haxcms-load-site-dashboard",
      this.loadSiteDashboard.bind(this)
    );
    window.addEventListener(
      "haxcms-load-user-data",
      this.loadUserData.bind(this)
    );
    window.addEventListener("haxcms-publish-site", this.publishSite.bind(this));
    window.addEventListener("haxcms-sync-site", this.syncSite.bind(this));
    window.addEventListener(
      "haxcms-git-revert-last-commit",
      this.revertCommit.bind(this)
    );
    window.addEventListener("haxcms-create-node", this.createNode.bind(this));
    window.addEventListener("haxcms-delete-node", this.deleteNode.bind(this));
    if (window.HaxStore.ready) {
      let detail = {
        detail: true
      };
      this._storeReadyToGo(detail);
    }
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: "You are logged in, edit tools shown."
      }
    });
    window.dispatchEvent(evt);
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
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "appStore") {
        this.querySelector("#hax").appStore = thos[prop];
      }
      if (propName == "lastError") {
        this._lastErrorChanged(this[propName], oldValue);
      } else if (propName == "publishing") {
        this._publishingChanged(this[propName], oldValue);
      } else if (propName == "activeItem") {
        this.dispatchEvent(
          new CustomEvent("manifest-changed", {
            detail: this[propName]
          })
        );
        this._activeItemChanged(this[propName], oldValue);
      } else if (propName == "manifest") {
        this.dispatchEvent(
          new CustomEvent("manifest-changed", {
            detail: this[propName]
          })
        );
        this._manifestChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * Detatched life cycle
   */
  disconnectedCallback() {
    if (this.siteDashboard) {
      this.siteDashboard.remove();
      delete this.siteDashboard;
    }
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
    window.removeEventListener("haxcms-sync-site", this.syncSite.bind(this));
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
      "haxcms-load-site-dashboard",
      this.loadSiteDashboard.bind(this)
    );
    window.removeEventListener(
      "haxcms-load-user-data",
      this.loadUserData.bind(this)
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
   * Load user data from backend
   */
  loadUserData(e) {
    this.getUserDataBody = {};
    this.getUserDataBody = {
      jwt: this.jwt
    };
    this.querySelector("#getuserdata").generateRequest();
  }
  /**
   * Load and display node fields
   */
  loadNodeFields(e) {
    this.__nodeFieldsInvoked = e.detail;
    this.getNodeFieldsData = {};
    this.getNodeFieldsData = {
      jwt: this.jwt,
      token: this.getFormToken,
      site: {
        name: this.manifest.metadata.site.name
      },
      node: {
        id: this.activeItem.id
      }
    };
    this.querySelector("#getnodefieldsajax").generateRequest();
  }
  /**
   * Load site fields
   */
  loadSiteDashboard(e) {
    this.__siteFieldsInvoked = e.detail;
    // ensure it exists as we do this on the fly and clean up constantly
    if (!this.siteDashboard) {
      let builder = document.getElementsByTagName("haxcms-site-builder")[0];
      this.siteDashboard = document.createElement("haxcms-site-dashboard");
      this.siteDashboard.headers = {
        Authorization: `Bearer ${this.jwt}`
      };
      this.siteDashboard.loadEndpoint = this.getSiteFieldsPath;
      this.siteDashboard.method = this.method;
      // insert right before the builder, you sneaky thing you
      builder.parentNode.insertBefore(this.siteDashboard, builder);
    }
    this.siteDashboard.body = {
      jwt: this.jwt,
      token: this.getFormToken,
      site: {
        name: this.manifest.metadata.site.name
      }
    };
    this.siteDashboard.headers = {
      Authorization: `Bearer ${this.jwt}`
    };
    store.dashboardOpened = !store.dashboardOpened;
  }
  /**
   * Handle getting fields response
   */
  _handleGetNodeFieldsResponse(e) {
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
    // we get back HAXSchema from the server
    let b1 = document.createElement("paper-button");
    let icon = document.createElement("iron-icon");
    icon.icon = "icons:save";
    b1.appendChild(icon);
    b1.appendChild(document.createTextNode("Save fields"));
    b1.style.color = "white";
    b1.style.backgroundColor = "#2196f3";
    b1.setAttribute("dialog-confirm", "dialog-confirm");
    b1.addEventListener("click", this._saveNodeFieldsTap.bind(this));
    let b2 = document.createElement("paper-button");
    b2.appendChild(document.createTextNode("cancel"));
    b2.setAttribute("dialog-dismiss", "dialog-dismiss");
    let b = document.createElement("div");
    b.style.position = "absolute";
    b.style.bottom = 0;
    b.style.left = 0;
    b.style.right = 0;
    b.style.zIndex = 1000000;
    b.appendChild(b1);
    b.appendChild(b2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: "Edit " + store.activeTitle + " fields",
        styles: {
          "--simple-modal-width": "75vw",
          "--simple-modal-max-width": "75vw"
        },
        elements: { content: c, buttons: b },
        invokedBy: this.__nodeFieldsInvoked,
        clone: false,
        modal: true
      }
    });
    window.dispatchEvent(evt);
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
   * Save the fields as we get tapped
   */
  _saveNodeFieldsTap(e) {
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
    // fire event with details for saving
    window.dispatchEvent(
      new CustomEvent("haxcms-save-site-data", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: this.querySelector("#siteform").submit()
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
      this.createData = {};
      this.createData = {
        jwt: this.jwt,
        site: {
          name: this.manifest.metadata.site.name
        },
        node: e.detail.values
      };
      this.querySelector("#createajax").generateRequest();
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
    this.deleteData = {};
    this.deleteData = {
      jwt: this.jwt,
      site: {
        name: this.manifest.metadata.site.name
      },
      node: {
        id: e.detail.item.id
      }
    };
    this.querySelector("#deleteajax").generateRequest();
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
        newValue.metadata.site.name +
        "&nodeId=" +
        this.activeItem.id;
    }
  }
  /**
   * update the internal active item
   */
  _newActiveItem(e) {
    this.activeItem = e.detail;
  }
  /**
   * active item changed
   */
  _activeItemChanged(newValue, oldValue) {
    if (newValue && this.manifest) {
      // set upload manager to point to this location in a more dynamic fashion
      window.HaxStore.instance.connectionRewrites.appendUploadEndPoint =
        "siteName=" +
        this.manifest.metadata.site.name +
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
    store.dashboardOpened = false;
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
  /**
   * Handle sync response that site may have changed or been updated
   */
  _handleSyncResponse(e) {
    // trigger a refresh of the data in node
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: "Site synced",
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
    store.dashboardOpened = false;
  }
  /**
   * Publish response
   */
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
    store.dashboardOpened = false;
  }
  /**
   * Save node event
   */
  saveNode(e) {
    // send the request
    if (this.saveNodePath) {
      let body = window.HaxStore.instance.activeHaxBody.haxToContent();
      this.querySelector("#nodeupdateajax").body = {
        jwt: this.jwt,
        site: {
          name: this.manifest.metadata.site.name
        },
        node: {
          id: this.activeItem.id,
          body: body,
          schema: window.HaxStore.htmlToHaxElements(body)
        }
      };
      this.querySelector("#nodeupdateajax").generateRequest();
    }
  }
  /**
   * Save node event
   */
  saveNodeDetails(e) {
    // send the request
    if (this.saveNodePath) {
      this.querySelector("#nodeupdateajax").body = {
        jwt: this.jwt,
        site: {
          name: this.manifest.metadata.site.name
        },
        node: {
          id: e.detail.id,
          details: e.detail
        }
      };
      this.querySelector("#nodeupdateajax").generateRequest();
    }
  }
  /**
   * Save the outline based on an event firing.
   */
  saveOutline(e) {
    this.updateOutlineData = {};
    this.updateOutlineData = {
      jwt: this.jwt,
      site: {
        name: this.manifest.metadata.site.name
      },
      items: e.detail
    };
    if (this.saveOutlinePath) {
      this.querySelector("#outlineupdateajax").generateRequest();
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
    // add in our standard pieces
    values.jwt = this.jwt;
    if (values.site) {
      values.site.name = this.manifest.metadata.site.name;
    } else {
      values.site = {
        name: this.manifest.metadata.site.name
      };
    }
    this.updateManifestData = {};
    this.updateManifestData = values;
    if (this.saveManifestPath) {
      this.querySelector("#manifestupdateajax").generateRequest();
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
  /**
   * Save the outline based on an event firing.
   */
  publishSite(e) {
    this.publishSiteData = {};
    this.publishSiteData = {
      jwt: this.jwt,
      site: {
        name: this.manifest.metadata.site.name
      }
    };
    if (this.publishSitePath) {
      this.querySelector("#publishajax").generateRequest();
    }
  }
  /**
   * Revert last commit
   */
  syncSite(e) {
    this.syncSiteData = {};
    this.syncSiteData = {
      jwt: this.jwt,
      site: {
        name: store.manifest.metadata.site.name
      }
    };
    if (this.syncSitePath) {
      this.querySelector("#syncajax").generateRequest();
    }
  }
  /**
   * Revert last commit
   */
  revertCommit(e) {
    this.revertSiteData = {};
    this.revertSiteData = {
      jwt: this.jwt,
      site: {
        name: store.manifest.metadata.site.name
      }
    };
    if (this.revertSitePath) {
      this.querySelector("#revertajax").generateRequest();
    }
  }
}
window.customElements.define(HAXCMSSiteEditor.tag, HAXCMSSiteEditor);
export { HAXCMSSiteEditor };
