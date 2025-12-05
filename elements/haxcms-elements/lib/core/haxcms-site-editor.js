/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@polymer/iron-ajax/iron-ajax.js";
import "@haxtheweb/jwt-login/jwt-login.js";
import "@haxtheweb/h-a-x/h-a-x.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import "@haxtheweb/simple-fields/lib/simple-fields-form.js";
import "./haxcms-site-dashboard.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { normalizeEventPath } from "@haxtheweb/utils/utils.js";

/**
 * `haxcms-site-editor`
 * `haxcms editor element that provides all editing capabilities`
 *
 * @demo demo/index.html
 */

class HAXCMSSiteEditor extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-editor";
  }

  constructor() {
    super();
    this.__disposer = [];
    this.method = "POST";
    this.editMode = false;
    globalThis.SimpleModal.requestAvailability();
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      // force import on editMode enabled
      if (this.editMode && toJS(HAXStore.activeHaxBody)) {
        HAXStore.activeHaxBody.importContent(toJS(store.activeItemContent));
      }
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
    // Sync activeItem directly from store via MobX for proper state management
    autorun((reaction) => {
      this.activeItem = toJS(store.activeItem);
      this.__disposer.push(reaction);
    });
  }
  // render function
  render() {
    return html`
      <style>
        haxcms-site-editor {
          display: block;
        }
        haxcms-site-editor[edit-mode] #editbutton {
          width: 100%;
          z-index: 100;
          right: 0;
          bottom: 0;
          border-radius: 0;
          height: 80px;
          margin: 0;
          padding: 8px;
          background-color: lightblue !important;
        }
        h-a-x {
          margin: auto;
          display: none;
        }
        haxcms-site-editor[edit-mode] h-a-x {
          display: block;
        }
      </style>
      <iron-ajax
        reject-with-request
        .headers="${{ Authorization: "Bearer ${this.jwt}" }}"
        id="nodeupdateajax"
        .url="${this.saveNodePath}"
        .method="${this.method}"
        content-type="application/json"
        handle-as="json"
        @last-response-changed="${this._handleNodeResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        .headers="${{ Authorization: "Bearer ${this.jwt}" }}"
        id="outlineupdateajax"
        .url="${this.saveOutlinePath}"
        .method="${this.method}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleOutlineResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        .headers="${{ Authorization: "Bearer ${this.jwt}" }}"
        id="manifestupdateajax"
        .url="${this.saveManifestPath}"
        .method="${this.method}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleManifestResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        .headers="${{ Authorization: "Bearer ${this.jwt}" }}"
        id="createajax"
        .url="${this.createNodePath}"
        .method="${this.method}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleCreateResponse}"
        @last-error-changed="${this.lastErrorChanged}"
        @last-response-changed="${this.__createNodeResponseChanged}"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        .headers="${{ Authorization: "Bearer ${this.jwt}" }}"
        id="deleteajax"
        .url="${this.deleteNodePath}"
        .method="${this.method}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleDeleteResponse}"
        @last-error-changed="${this.lastErrorChanged}"
        @last-response-changed="${this.__deleteNodeResponseChanged}"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        .headers="${{ Authorization: "Bearer ${this.jwt}" }}"
        id="nodedetailsajax"
        .url="${this.saveNodeDetailsPath}"
        .method="${this.method}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleNodeDetailsResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <iron-ajax
        reject-with-request
        .headers="${{ Authorization: "Bearer ${this.jwt}" }}"
        id="getuserdata"
        url="${this.getUserDataPath}"
        method="${this.method}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleUserDataResponse}"
        @last-error-changed="${this.lastErrorChanged}"
      ></iron-ajax>
      <h-a-x
        id="hax"
        element-align="left"
        offset-margin="48px 0 0 0"
        hide-panel-ops="hide-panel-ops"
        hide-toolbar="hide-toolbar"
      ></h-a-x>
    `;
  }

  static get properties() {
    return {
      getUserDataPath: {
        type: String,
        attribute: "get-user-data-path",
      },

      /**
       * Allow method to be overridden, useful in local testing
       */
      method: {
        type: String,
      },

      /**
       * JSON Web token, it'll come from a global call if it's available
       */
      jwt: {
        type: String,
      },

      /**
       * end point for saving nodes
       */
      saveNodePath: {
        type: String,
        attribute: "save-node-path",
      },

      /**
       * end point for create new nodes
       */
      createNodePath: {
        type: String,
        attribute: "create-node-path",
      },

      /**
       * end point for delete nodes
       */
      deleteNodePath: {
        type: String,
        attribute: "delete-node-path",
      },

      /**
       * end point for saving manifest
       */
      saveManifestPath: {
        type: String,
        attribute: "save-manifest-path",
      },

      /**
       * end point for saving node details (singular operations)
       */
      saveNodeDetailsPath: {
        type: String,
        attribute: "save-node-details-path",
      },

      appendTarget: {
        type: Object,
      },
      appElement: {
        type: Object,
      },

      /**
       * end point for saving outline
       */
      saveOutlinePath: {
        type: String,
        attribute: "save-outline-path",
      },

      /**
       * appStore object from backend
       */
      appStore: {
        type: Object,
      },

      /**
       * if the node is in an edit state or not
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      /**
       * Active item of the node being worked on, JSON outline schema item format
       */
      activeItem: {
        type: Object,
      },

      /**
       * Outline of items in json outline schema format
       */
      manifest: {
        type: Object,
      },
      getSiteFieldsPath: {
        type: String,
        attribute: "save-site-fields-path",
      },
      getFormToken: {
        type: String,
        attribute: "get-form-token",
      },
    };
  }

  __deleteNodeResponseChanged(e) {
    // show message
    if (e.detail.value && e.detail.value.data && e.detail.value.data.title) {
      store.toast(
        `Page deleted ${e.detail.value.data.title}, selecting another page`,
        4000,
      );
      store.playSound("coin");
    }
  }

  __createNodeResponseChanged(e) {
    // sanity check we have a slug, move to this page that we just made
    if (e.detail.value && e.detail.value.data && e.detail.value.data.slug) {
      setTimeout(() => {
        store.playSound("coin");
        const node = e.detail.value.data;
        globalThis.history.pushState({}, null, node.slug);
        globalThis.dispatchEvent(new PopStateEvent("popstate"));
        store.toast(`Created ${node.title}!`, 4000, {
          hat: "random",
        });

        // Auto-enter edit mode if this page was created by a Merlin program
        if (this._merlinCreated) {
          store.editMode = true;
          // Clear the flag
          this._merlinCreated = false;
        }
      }, 900);
    }
  }

  _handleUserDataResponse(e) {
    if (e.detail.response && e.detail.response.data) {
      store.userData = e.detail.response.data;
      this.dispatchEvent(
        new CustomEvent("haxcms-user-data-updated", {
          composed: true,
          bubbles: true,
          cancelable: false,
          detail: e.detail.response.data,
        }),
      );
    }
  }

  /**
   * Handle the last error rolling in
   */
  lastErrorChanged(e) {
    if (e.detail.value) {
      console.error(e);
      var target = normalizeEventPath(e)[0];
      // check for JWT needing refreshed vs busted but must be 403
      switch (parseInt(e.detail.value.status)) {
        // cookie data not found, or illegal operation, need to go get it
        // @notice this currently isn't possible but we could modify
        // the backend in the future to support throwing 401s dynamically
        // if we KNOW an event must expire the timing token
        case 405:
        case 401:
          this.dispatchEvent(
            new CustomEvent("jwt-login-logout", {
              composed: true,
              bubbles: true,
              cancelable: false,
              detail: {
                redirect: true,
              },
            }),
          );
          break;
        case 403:
          // if this was a 403 it should be because of a bad jwt
          // or out of date one. This hopefully gets a new one if not
          // other listeners will ensure we redirect appropriately
          this.dispatchEvent(
            new CustomEvent("jwt-login-refresh-token", {
              composed: true,
              bubbles: true,
              cancelable: false,
              detail: {
                element: {
                  obj: this,
                  callback: "refreshRequest",
                  params: [target],
                },
              },
            }),
          );
          break;
        default:
          store.toast(
            e.detail.value.status + " " + e.detail.value.statusText,
            5000,
            { fire: true },
          );
          store.playSound("error");
          break;
      }
    }
  }
  /**
   * Attempt to salvage the request that was kicked off
   * when our JWT needed refreshed
   */
  refreshRequest(jwt, element) {
    // force the jwt to be the updated jwt
    // this helps avoid any possible event timing issue
    this.jwt = jwt;
    element.body.jwt = jwt;
    element.headers = {
      Authorization: `Bearer ${this.jwt}`,
    };
    // again, sanity check on delay
    setTimeout(() => {
      element.generateRequest();
    }, 0);
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
    if (HAXStore.ready) {
      let detail = {
        detail: true,
      };

      this._storeReadyToGo(detail);
    }
    // fire event suggesting that we were authorized to have a site editor
    // so the UI and other pieces can react to this news
    // this tag is going to be added by a backend if it has determined we have a valid one

    globalThis.dispatchEvent(
      new CustomEvent("haxcms-site-editor-loaded", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    // inject cms styles for uniformity between shadowroot
    const link = globalThis.document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("../base.css", import.meta.url).href;
    this.querySelector("#hax")
      .shadowRoot.querySelector("style")
      .parentNode.insertBefore(
        link,
        this.querySelector("#hax").shadowRoot.querySelector("style")
          .nextSibling,
      );
  }

  /**
   * Filter appStore based on platform block restrictions
   * @param {Object} appStore - The original appStore object
   * @returns {Object} Filtered appStore with only allowed blocks in autoloader
   */
  _filterAppStoreByPlatform(appStore) {
    // Check if platform restrictions exist
    const platformConfig =
      this.manifest &&
      this.manifest.metadata &&
      this.manifest.metadata.platform;
    const allowedBlocks = platformConfig && platformConfig.blocks;

    // If no platform blocks restriction, return original appStore
    if (
      !allowedBlocks ||
      !Array.isArray(allowedBlocks) ||
      allowedBlocks.length === 0
    ) {
      return appStore;
    }

    // Create a filtered copy of appStore
    const filteredAppStore = JSON.parse(JSON.stringify(appStore));

    // Filter the autoloader to only include allowed blocks
    if (
      filteredAppStore.autoloader &&
      typeof filteredAppStore.autoloader === "object"
    ) {
      const filteredAutoloader = {};

      // Only include tags that are in the allowed blocks list
      Object.keys(filteredAppStore.autoloader).forEach((tagName) => {
        if (allowedBlocks.includes(tagName)) {
          filteredAutoloader[tagName] = filteredAppStore.autoloader[tagName];
        }
      });

      filteredAppStore.autoloader = filteredAutoloader;
    }

    return filteredAppStore;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "appStore") {
        // Filter appStore based on platform block restrictions
        let filteredAppStore = this._filterAppStoreByPlatform(this[propName]);
        this.querySelector("#hax").setAttribute(
          "app-store",
          JSON.stringify(filteredAppStore),
        );
      }
      if (propName == "activeItem") {
        this.dispatchEvent(
          new CustomEvent("manifest-changed", {
            detail: this[propName],
          }),
        );

        this._activeItemChanged(this[propName], oldValue);
      } else if (propName == "manifest") {
        this.dispatchEvent(
          new CustomEvent("manifest-changed", {
            detail: this[propName],
          }),
        );

        this._manifestChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * Respond to a failed request to refresh the token by killing the logout process
   */
  _tokenRefreshFailed(e) {
    this.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: {
          redirect: true,
        },
      }),
    );
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.windowControllers) {
      this.windowControllers.abort();
    }
    this.windowControllers = new AbortController();
    globalThis.addEventListener(
      "jwt-login-refresh-error",
      this._tokenRefreshFailed.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "hax-store-ready",
      this._storeReadyToGo.bind(this),
      { signal: this.windowControllers.signal },
    );

    // Note: activeItem is now synced via MobX autorun in constructor
    // The json-outline-schema-active-item-changed event is still fired by the store
    // for backward compatibility with external consumers

    globalThis.addEventListener(
      "json-outline-schema-active-body-changed",
      this._bodyChanged.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-save-outline",
      this.saveOutline.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener("haxcms-save-node", this.saveNode.bind(this), {
      signal: this.windowControllers.signal,
    });

    globalThis.addEventListener(
      "haxcms-save-site-data",
      this.saveManifest.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-load-site-dashboard",
      this.loadSiteDashboard.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-load-user-data",
      this.loadUserData.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-create-node",
      this.createNode.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );

    globalThis.addEventListener(
      "haxcms-save-node-details",
      this.saveNodeDetails.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );

    globalThis.addEventListener(
      "haxcms-delete-node",
      this.deleteNode.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
  }

  /**
   * Load user data from backend
   */

  loadUserData(e) {
    this.querySelector("#getuserdata").body = {
      jwt: this.jwt,
    };
    this.querySelector("#getuserdata").generateRequest();
  }
  /**
   * Load site fields
   */

  loadSiteDashboard(e) {
    if (globalThis.document.body.querySelector("haxcms-site-dashboard")) {
      this.siteDashboard = globalThis.document.body.querySelector(
        "haxcms-site-dashboard",
      );
      this.siteDashboard.headers = {
        Authorization: `Bearer ${this.jwt}`,
      };
      this.siteDashboard.jwt = this.jwt;
      this.siteDashboard.method = this.method;
      this.siteDashboard.body = {
        jwt: this.jwt,
        token: this.getFormToken,
        site: {
          name: this.manifest.metadata.site.name,
        },
      };
      this.siteDashboard.loadEndpoint = this.getSiteFieldsPath;
      // delay so propagation can happen into thing building the form
      setTimeout(() => {
        this.siteDashboard.generateRequest();
      }, 0);
    }
  }

  _schemaFormValueChanged(e) {
    let customTag = {
      property: "custom-theme-tag",
      title: "Custom theme tag",
      description: "Tag that supplies the custom theme",
      inputMethod: "textfield",
      required: true,
      validationType: "text",
    }; // @todo figure out why this isn't adding a field in on the fly

    /*if (e.target.value.theme === "haxcms-custom-theme") {
      e.target.addField(customTag.property, customTag);
      e.target.value[customTag.property] = customTag.property;
    } else {
      e.target.removeField(customTag.property);
      delete e.target.value[customTag.property];
    }*/
  }
  /**
   * create node event
   */

  async createNode(e) {
    // Check platform configuration before allowing page creation
    const platformConfig =
      this.manifest &&
      this.manifest.metadata &&
      this.manifest.metadata.platform;
    if (platformConfig && platformConfig.addPage === false) {
      store.toast("Adding pages is disabled for this site", 3000, {
        fire: true,
      });
      return;
    }

    if (e.detail.values) {
      var reqBody = e.detail.values;
      // ensure site name and jwt are set in request
      reqBody.jwt = this.jwt;
      reqBody.site = {
        name: this.manifest.metadata.site.name,
      };
      // store who sent this in-case of multiple instances
      this._originalTarget = e.detail.originalTarget;
      // Store if this was created by a Merlin program for auto-edit enhancement
      this._merlinCreated = reqBody.merlinCreated || false;
      // docxImport use the routine from app-hax
      if (reqBody.docximport) {
        await import(
          "@haxtheweb/file-system-broker/lib/docx-file-system-broker.js"
        ).then(async (e) => {
          // enable core services
          enableServices(["haxcms"]);
          // get the broker for docx selection
          const broker = globalThis.FileSystemBroker.requestAvailability();
          const file = await broker.loadFile("docx");
          // tee up as a form for upload
          const formData = new FormData();
          formData.append("method", reqBody.docximport); // this is a branch or site based importer
          let structure = "course";
          if (
            this.manifest.metadata.build &&
            this.manifest.metadata.structure
          ) {
            structure = this.manifest.metadata.structure;
          }
          formData.append("type", structure);
          formData.append("parentId", reqBody.parent); // optional parent value, if set, this becomes the parent info for top level pages
          formData.append("upload", file);
          this.setProcessingVisual();
          const response = await MicroFrontendRegistry.call(
            "@haxcms/docxToSite",
            formData,
          );
          store.toast("finished!", 300);
          // must be a valid response and have at least SOME html to bother attempting
          if (
            response.status == 200 &&
            response.data &&
            response.data.contents != ""
          ) {
            // @todo right here is where we need to interject our confirmation dialog
            // workflow. We can take the items that just came back and visualize them
            // using our outline / hierarchy visualization
            reqBody.items = response.data.items;
            await import(
              "@haxtheweb/outline-designer/outline-designer.js"
            ).then(async (e) => {
              const outline =
                globalThis.document.createElement("outline-designer");
              outline.items = response.data.items;
              outline.eventData = reqBody;
              outline.storeTools = true;

              const b1 = globalThis.document.createElement("button");
              b1.innerText = "Confirm";
              b1.classList.add("hax-modal-btn");
              b1.addEventListener("click", async (e) => {
                const data = await outline.getData();
                let deleted = 0;
                let modified = 0;
                let added = 0;
                data.items.map((item) => {
                  if (item.delete) {
                    deleted++;
                  } else if (item.new) {
                    added++;
                  } else if (item.modified) {
                    modified++;
                  }
                });
                let sumChanges = `${
                  added > 0 ? `‣ ${added} new pages will be created\n` : ""
                }${
                  modified > 0 ? `‣ ${modified} pages will be updated\n` : ""
                }${deleted > 0 ? `‣ ${deleted} pages will be deleted\n` : ""}`;
                let confirmation = false;
                // no confirmation required if there are no tracked changes
                if (sumChanges == "") {
                  confirmation = true;
                } else {
                  confirmation = globalThis.confirm(
                    `Saving will commit the following actions:\n${sumChanges}\nAre you sure?`,
                  );
                }
                if (confirmation) {
                  this.querySelector("#createajax").body = data;
                  this.setProcessingVisual();
                  this.querySelector("#createajax").generateRequest();
                  const evt = new CustomEvent("simple-modal-hide", {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    detail: {},
                  });
                  globalThis.dispatchEvent(evt);
                }
              });
              const b2 = globalThis.document.createElement("button");
              b2.innerText = "Cancel";
              b2.classList.add("hax-modal-btn");
              b2.classList.add("cancel");
              b2.addEventListener("click", (e) => {
                const evt = new CustomEvent("simple-modal-hide", {
                  bubbles: true,
                  composed: true,
                  cancelable: true,
                  detail: {},
                });
                globalThis.dispatchEvent(evt);
              });
              // button container
              const div = globalThis.document.createElement("div");
              div.appendChild(b1);
              div.appendChild(b2);

              this.dispatchEvent(
                new CustomEvent("simple-modal-show", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: {
                    title: "Confirm structure",
                    elements: { content: outline, buttons: div },
                    modal: true,
                    styles: {
                      "--simple-modal-titlebar-background": "transparent",
                      "--simple-modal-titlebar-color": "light-dark(black, white)",
                      "--simple-modal-width": "90vw",
                      "--simple-modal-min-width": "300px",
                      "--simple-modal-z-index": "100000000",
                      "--simple-modal-height": "90vh",
                      "--simple-modal-min-height": "400px",
                      "--simple-modal-titlebar-height": "80px",
                    },
                  },
                }),
              );
            });
          }
        });
      } else {
        this.querySelector("#createajax").body = reqBody;
        this.setProcessingVisual();
        await this.querySelector("#createajax").generateRequest();
        const evt = new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {},
        });
        globalThis.dispatchEvent(evt);
      }
    }
  }

  _handleCreateResponse(response) {
    setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      this.dispatchEvent(
        new CustomEvent("haxcms-create-node-success", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            value: true,
            originalTarget: this._originalTarget,
          },
        }),
      );
    }, 300);
  }
  /**
   * delete the node we just got
   */

  deleteNode(e) {
    // Check platform configuration before allowing delete
    const platformConfig =
      this.manifest &&
      this.manifest.metadata &&
      this.manifest.metadata.platform;
    if (platformConfig && platformConfig.delete === false) {
      store.toast("Delete is disabled for this site", 3000, { fire: true });
      return;
    }

    this.querySelector("#deleteajax").body = {
      jwt: this.jwt,
      site: {
        name: this.manifest.metadata.site.name,
      },
      node: {
        id: e.detail.item.id,
      },
    };
    this.setProcessingVisual();
    this.querySelector("#deleteajax").generateRequest();
    const evt = new CustomEvent("simple-modal-hide", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {},
    });
    globalThis.dispatchEvent(evt);
  }
  /**
   * node deleted response
   */

  _handleDeleteResponse(response) {
    // this will force ID to update and avoid a page miss
    // when we deleted the node
    globalThis.history.replaceState({}, null, store.fallbackItemSlug());
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
    // delay ensures the fallback has been moved to prior to
    // rebuild of the manifest which should be lacking the deleted ID
    setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
    }, 300);
  }
  /**
   * Establish certain global settings in HAX once it claims to be ready to go
   */

  _storeReadyToGo(event) {
    if (event.detail) {
      HAXStore.connectionRewrites.appendJwt = "jwt";
    }
  }

  /**
   * react to manifest being changed
   */

  _manifestChanged(newValue) {
    if (this.activeItem && newValue.metadata) {
      // set upload manager to point to this location in a more dynamic fashion
      HAXStore.connectionRewrites.appendUploadEndPoint =
        "siteName=" +
        newValue.metadata.site.name +
        "&nodeId=" +
        this.activeItem.id;
    }
  }
  /**
   * active item changed
   */

  _activeItemChanged(newValue, oldValue) {
    if (newValue && this.manifest) {
      // set upload manager to point to this location in a more dynamic fashion
      HAXStore.connectionRewrites.appendUploadEndPoint =
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
      e.detail.value &&
      e.detail.value.data &&
      e.detail.value.data.slug &&
      this.activeItem.slug !== e.detail.value.data.slug
    ) {
      globalThis.history.replaceState({}, null, e.detail.value.data.slug);
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
    }
    setTimeout(() => {
      store.playSound("coin");
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      ); // updates the node contents itself

      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update-node", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );

      // Restore active element position after DOM update for "keep editing" mode
      if (this._restoreKeepEditMode && this._restoreActiveIndex !== null) {
        setTimeout(() => {
          try {
            if (HAXStore.activeHaxBody && HAXStore.activeHaxBody.children) {
              const bodyChildren = Array.from(HAXStore.activeHaxBody.children);
              // Check if the stored index is still valid
              if (
                this._restoreActiveIndex >= 0 &&
                this._restoreActiveIndex < bodyChildren.length
              ) {
                const elementToRestore = bodyChildren[this._restoreActiveIndex];
                if (elementToRestore) {
                  // Simply set the active node - focus and scroll logic will kick in automatically
                  HAXStore.activeNode = elementToRestore;
                }
              } else if (bodyChildren.length > 0) {
                // Fallback: if index is invalid, activate the last available element
                const fallbackIndex = Math.min(
                  this._restoreActiveIndex,
                  bodyChildren.length - 1,
                );
                const fallbackElement = bodyChildren[fallbackIndex];
                if (fallbackElement) {
                  HAXStore.activeNode = fallbackElement;
                }
              }
            }
          } catch (error) {
            console.warn(
              "Failed to restore active element position after save:",
              error,
            );
          }
          // Clean up the restoration flags
          this._restoreActiveIndex = null;
          this._restoreKeepEditMode = false;
        }, 100); // Small delay to ensure DOM is fully updated
      }

      // force an update in the store to reprocess what is "active"
      // otherwise the page data that was just saved won't be reflected until hitting a different
      // page, causing a temporary state error if going to edit again
      let tmp = store.activeId;
      store.activeId = null;
      store.activeId = tmp;
      store.toast(`Page saved!`, 4000, { hat: "random" });
    }, 300);
  }

  _handleOutlineResponse(e) {
    // trigger a refresh of the data in node
    setTimeout(() => {
      store.playSound("coin");
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      store.toast(`Outline saved!`, 4000, { hat: "random" });
    }, 300);
  }

  _handleManifestResponse(e) {
    // trigger a refresh of the data in node
    store.playSound("coin");
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    setTimeout(() => {
      globalThis.location.reload();
    }, 300);
  }

  _handleNodeDetailsResponse(e) {
    setTimeout(() => {
      store.playSound("coin");
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      store.toast(`Operation completed!`, 3000, { hat: "construction" });
    }, 300);
  }
  /**
   * Save node event
   */
  async saveNode(e) {
    // send the request
    if (this.saveNodePath) {
      // Capture active element index before save for "keep editing" mode
      let activeElementIndex = null;
      if (
        e.detail &&
        e.detail.keepEditMode &&
        HAXStore.activeHaxBody &&
        HAXStore.activeNode
      ) {
        const bodyChildren = Array.from(HAXStore.activeHaxBody.children);
        activeElementIndex = bodyChildren.indexOf(HAXStore.activeNode);
        // Store this for restoration after save
        this._restoreActiveIndex = activeElementIndex;
        this._restoreKeepEditMode = true;
      } else {
        this._restoreActiveIndex = null;
        this._restoreKeepEditMode = false;
      }

      // CRITICAL FIX: Force page-break element to use store activeItem values
      // before serialization to prevent & -> &amp; encoding issues
      const pageBreakEl = HAXStore.activeHaxBody.querySelector('page-break');
      if (pageBreakEl && this.activeItem) {
        // Directly set the JavaScript properties from the source of truth (store)
        // This ensures we're not using the already-encoded attribute values
        pageBreakEl.title = this.activeItem.title || '';
        pageBreakEl.description = this.activeItem.description || '';
      }
      
      let body = await HAXStore.activeHaxBody.haxToContent();
      const schema = await HAXStore.htmlToHaxElements(body);
      
      this.querySelector("#nodeupdateajax").body = {
        jwt: this.jwt,
        site: {
          name: this.manifest.metadata.site.name,
        },
        node: {
          id: this.activeItem.id,
          body: body,
          schema: schema,
        },
      };
      this.setProcessingVisual();
      this.querySelector("#nodeupdateajax").generateRequest();
    }
  }
  /**
   * Save node event
   */

  saveNodeDetails(e) {
    // Check platform configuration before allowing outline operations
    const platformConfig =
      this.manifest &&
      this.manifest.metadata &&
      this.manifest.metadata.platform;
    if (platformConfig && platformConfig.outlineDesigner === false) {
      store.toast("Outline operations are disabled for this site", 3000, {
        fire: true,
      });
      return;
    }

    // send the request
    if (this.saveNodeDetailsPath) {
      this.querySelector("#nodedetailsajax").body = {
        jwt: this.jwt,
        site: {
          name: this.manifest.metadata.site.name,
        },
        node: {
          id: e.detail.id,
          details: e.detail,
        },
      };
      this.setProcessingVisual();
      this.querySelector("#nodedetailsajax").generateRequest();
    }
  }
  /**
   * Save the outline based on an event firing.
   */

  saveOutline(e) {
    if (this.saveOutlinePath) {
      this.querySelector("#outlineupdateajax").body = {
        jwt: this.jwt,
        site: {
          name: this.manifest.metadata.site.name,
        },
        items: e.detail,
      };
      this.setProcessingVisual();
      this.querySelector("#outlineupdateajax").generateRequest();
    }
  }
  // processing visualization
  setProcessingVisual() {
    let loadingIcon = globalThis.document.createElement("simple-icon-lite");
    loadingIcon.icon = "hax:loading";
    loadingIcon.style.setProperty("--simple-icon-height", "40px");
    loadingIcon.style.setProperty("--simple-icon-width", "40px");
    loadingIcon.style.height = "150px";
    loadingIcon.style.marginLeft = "8px";
    store.toast(`Processing`, 5000, {
      hat: "construction",
      slot: loadingIcon,
    });
  }
  /**
   * Save the outline based on an event firing.
   */

  saveManifest(e) {
    // now let's work on the outline
    let values = e.detail; // if we have a cssVariable selected then generate a hexCode off of it
    // regions translation to simplify submission
    if (values.manifest.theme && values.manifest.theme.regions) {
      Object.keys(values.manifest.theme.regions).forEach((key, index) => {
        if (
          values.manifest.theme.regions[key] &&
          values.manifest.theme.regions[key].length > 0
        ) {
          values.manifest.theme[key] = values.manifest.theme.regions[key].map(
            (item) => (item.node ? item.node : null),
          );
        }
      });
      delete values.manifest.theme.regions;
    }
    if (values.cssVariable) {
      values.hexCode =
        globalThis.SimpleColorsSharedStyles.colors[
          values.cssVariable
            .replace("--simple-colors-default-theme-", "")
            .replace("-7", "")
        ][6];
    } // add in our standard pieces

    values.jwt = this.jwt;

    if (values.site) {
      values.site.name = this.manifest.metadata.site.name;
    } else {
      values.site = {
        name: this.manifest.metadata.site.name,
      };
    }
    if (this.saveManifestPath) {
      this.querySelector("#manifestupdateajax").body = values;
      this.setProcessingVisual();
      this.querySelector("#manifestupdateajax").generateRequest();
    }
  }
  /**
   * Notice body of content has changed and import into HAX
   */
  _bodyChanged(e) {
    if (HAXStore.activeHaxBody) {
      HAXStore.activeHaxBody.importContent(e.detail);
    }
  }
}

globalThis.customElements.define(HAXCMSSiteEditor.tag, HAXCMSSiteEditor);
export { HAXCMSSiteEditor };
