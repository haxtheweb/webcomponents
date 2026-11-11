/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/jwt-login/jwt-login.js";
import "@haxtheweb/h-a-x/h-a-x.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { normalizeEventPath } from "@haxtheweb/utils/lib/events.js";
import { DDDVariables } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import {
  haxcmsApiMessage,
  apiMessageParts,
  isHardDenial,
} from "./utils/HAXCMSApiMessages.js";
import {
  configureHAXCMSSiteApiRegistry,
  waitForHAXCMSSiteApiRegistryReady,
} from "./utils/haxcms-site-api-registry.js";
import { findTagAttrValue } from "@haxtheweb/utils/lib/safe-html.js";

/**
 * `haxcms-site-editor`
 * `haxcms editor element that provides all editing capabilities`
 *
 * @demo demo/index.html
 */

class HAXCMSSiteEditor extends I18NMixin(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-editor";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      sessionExpired: "Session expired, please log in again",
      userDataEndpointUnavailable: "User data endpoint is not available.",
      addingPagesDisabled: "Adding pages is disabled for this site",
      finished: "finished!",
      invalidDocxResponse: "Invalid response from DOCX import.",
      createItemEndpointUnavailable: "Create item endpoint is not available.",
      deleteDisabled: "Delete is disabled for this site",
      unableToDeleteMissingId: "Unable to delete page: missing page id",
      deleteItemEndpointUnavailable: "Delete item endpoint is not available.",
      revisionRestored: "Revision restored as a new commit.",
      unableToSaveMissingSite: "Unable to save page: missing site context",
      pageSaveEndpointUnavailable: "Page save endpoint is not available.",
      outlineOperationsDisabled:
        "Outline operations are disabled for this site",
      unableToCompleteMissingId:
        "Unable to complete operation: missing page id",
      unableToCompleteMissingOperation:
        "Unable to complete operation: missing operation",
      itemUpdateEndpointUnavailable: "Item update endpoint is not available.",
      unableToCompleteOperation: "Unable to complete operation",
      outlineSaveEndpointUnavailable: "Outline save endpoint is not available.",
      siteSaveEndpointUnavailable: "Site save endpoint is not available.",
      slugNormalizationEndpointUnavailable:
        "Slug normalization endpoint is not available.",
      slugNormalizationCompleted: "Slug normalization completed.",
      slugNormalizationFailed: "Slug normalization failed.",
      seoSaveEndpointUnavailable: "SEO save endpoint is not available.",
      appearanceSaveEndpointUnavailable:
        "Appearance save endpoint is not available.",
      platformSettingsSaveEndpointUnavailable:
        "Platform settings save endpoint is not available.",
      editorSettingsSaveEndpointUnavailable:
        "Editor settings save endpoint is not available.",
      editorSettingsInvalid: "Editor settings are invalid.",
      blocksSaveEndpointUnavailable: "Blocks save endpoint is not available.",
      contentReplaceEndpointUnavailable:
        "Content replace endpoint is not available.",
      contentSearchEndpointUnavailable:
        "Content search endpoint is not available.",
      useUploadWorkflow: "Use the existing upload workflow to process files.",
      requestFailed: "Request failed",
      operationFailed: "Operation failed",
      pageDeletedSelecting: "Page deleted {title}, selecting another page",
      createdOpenToEdit: "Created {title} — open it to edit",
      page: "page",
      recoveredUnsavedEdits:
        "Recovered unsaved edits to {title}. Open that page and select Edit to restore them.",
      aPreviousPage: "a previous page",
      restoredUnsavedEdits: "Restored unsaved edits to {title}",
      thisPage: "this page",
      pageSaved: "Page saved!",
      outlineSaved: "Outline saved!",
      saveTimedOut:
        "Saving timed out: the server did not answer. Your changes are kept here, but the server may still finish saving them.",
      operationCompleted: "Operation completed!",
      unableToCompleteOperationStatus:
        "Unable to complete operation ({status})",
      normalizedPageSlugs: "Normalized {count} page slugs",
      createdTitle: "Created {title}!",
      processing: "Processing",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.__disposer = [];
    this.__lastContentDashboardOperation = "search";
    this.__lastContentSearchQuery = "";
    this.__refreshRetryCounts = {};
    this.__maxRefreshRetries = 2;
    // How long (ms) a site admin save may take before it is reported as
    // failed: the outline save's request is aborted after this long, and any
    // admin save waiting on a token refresh gives up after this long. Large
    // outlines rewrite many files, so this is generous; tests lower it.
    this.saveTimeout = 60000;
    // admin saves waiting on a token refresh: request target -> give up
    this.__refreshWaitingSaves = new Map();
    // recovered-edit snapshot (sessionStorage safety net) once restored
    this.__pendingRestore = null;
    this.method = "POST";
    this.editMode = false;
    this.getUserDataHeaders = {};
    globalThis.SimpleModal.requestAvailability();
    this.__setupDisposers();
  }
  __setupDisposers() {
    if (this.__disposer && this.__disposer.length > 0) {
      return;
    }
    this.__disposer = [];
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.editMode);
        const _mobx_val_1 = toJS(HAXStore.activeHaxBody);
        const _mobx_val_2 = toJS(store.activeItemContent);
        Promise.resolve().then(() => {
          const entering = _mobx_val_0 && !this.editMode;
          // keep the viewer content on screen until the editable copy has
          // rendered; must start before editMode flips h-a-x to visible
          if (entering && _mobx_val_1) {
            this.__startEditModeReveal();
          } else if (!_mobx_val_0) {
            this.__finishEditModeReveal();
          }
          this.editMode = _mobx_val_0;
          // force import on editMode enabled
          if (this.editMode && _mobx_val_1) {
            HAXStore.activeHaxBody.importContent(_mobx_val_2);
            // if we recovered unsaved edits from a prior session, apply them
            // after the saved content has been imported into the body
            if (this.__pendingRestore) {
              setTimeout(() => this._applyPendingRestoreIfMatch(), 0);
            }
          }
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.manifest);
        Promise.resolve().then(() => {
          this.manifest = _mobx_val_0;
        });
      }),
    );
    // Sync activeItem directly from store via MobX for proper state management
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.activeItem);
        Promise.resolve().then(() => {
          this.activeItem = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.platformConfig);
        Promise.resolve().then(() => {
          HAXStore.platformConfig = _mobx_val_0;
        });
      }),
    );
  }
  /**
   * Resolves once the editable copy of the page has rendered after edit mode
   * was turned on, so a theme can hide its viewer content in the same frame
   * the editor appears instead of showing an empty page while content is
   * imported (haxtheweb/issues#3263). Resolves right away when no import is
   * on its way.
   * @returns {Promise}
   */
  whenEditModeReady() {
    if (!this.__editModeReveal) {
      const body = HAXStore.activeHaxBody;
      const importing =
        body && body._contentState && body._contentState.getState("importing");
      // our store autorun has not run yet (it will import), or an import
      // is already running
      if (body && store.editMode && (!this.editMode || importing)) {
        this.__startEditModeReveal();
      } else {
        return Promise.resolve();
      }
    }
    return this.__editModeReveal.promise;
  }
  __startEditModeReveal() {
    if (this.__editModeReveal) {
      return this.__editModeReveal;
    }
    const body = HAXStore.activeHaxBody;
    const hax = this.querySelector("h-a-x");
    let resolve;
    const promise = new Promise((r) => {
      resolve = r;
    });
    const reveal = { promise: promise, resolve: resolve, body: body };
    this.__editModeReveal = reveal;
    if (hax) {
      hax.classList.add("haxcms-edit-mode-pending");
      // not shown yet, so keep it out of focus order and the a11y tree
      hax.setAttribute("inert", "");
    }
    // import done: hooks ran and nodes are upgraded. Let the blocks the
    // visitor can already see finish rendering in the hidden copy, then swap
    // on the next frame so the editable state applied in that frame lands
    // with it
    reveal.onReady = () => {
      this.__settleEditableCopy(reveal.body).then(() => {
        requestAnimationFrame(() => {
          if (this.__editModeReveal === reveal) {
            this.__finishEditModeReveal();
          }
        });
      });
    };
    if (body && body.addEventListener) {
      body.addEventListener("hax-body-content-ready", reveal.onReady, {
        once: true,
      });
    }
    // never leave someone looking at the viewer if an import fails or stalls
    reveal.timer = setTimeout(() => {
      if (this.__editModeReveal === reveal) {
        this.__finishEditModeReveal();
      }
    }, 2000);
    return reveal;
  }
  /**
   * Blocks that render lazily (IntersectionObserverMixin, e.g.
   * video-player) only draw a placeholder until their observer
   * fires, which takes at least IODelay (100ms) after they are on screen.
   * The editable copy is hidden until the swap, so without this every such
   * block the visitor was looking at showed as an empty box (white in light
   * mode) for a few frames after the swap (haxtheweb/issues#3263).
   * Any block whose counterpart in the viewer copy is already rendered is
   * rendered now, while hidden, and the swap waits for it (bounded).
   * @param {HTMLElement} body the hax-body being revealed
   * @returns {Promise}
   */
  __settleEditableCopy(body) {
    const viewer = this.appElement;
    if (!body || !viewer || typeof viewer.querySelectorAll !== "function") {
      return Promise.resolve();
    }
    const waits = [];
    const seen = {};
    const nodes = body.querySelectorAll("*");
    for (let i = 0; i < nodes.length; i++) {
      const tag = nodes[i].tagName.toLowerCase();
      if (seen[tag] || !tag.includes("-")) {
        continue;
      }
      seen[tag] = true;
      const editable = body.querySelectorAll(tag);
      const viewed = viewer.querySelectorAll(tag);
      // pair blocks by position; when the copies differ we can't know which
      // block is which, so leave that tag to its observer
      if (editable.length !== viewed.length) {
        continue;
      }
      for (let j = 0; j < editable.length; j++) {
        const el = editable[j];
        if (
          el.elementVisible === false &&
          viewed[j].elementVisible === true &&
          el.IORemoveOnVisible !== false
        ) {
          // same as the observer reaching its limit with IORemoveOnVisible
          if (el.intersectionObserver) {
            el.intersectionObserver.disconnect();
          }
          el.elementVisible = true;
          if (el.updateComplete) {
            waits.push(this.__whenRendered(el, 0));
          }
        }
      }
    }
    // top level blocks still rendering (page-break loads its editing band
    // when edit mode starts and reports it through updateComplete)
    const blocks = body.children;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].updateComplete) {
        waits.push(blocks[i].updateComplete.catch(() => {}));
      }
    }
    // never hold the viewer on screen for long waiting on one block
    return Promise.race([
      Promise.all(waits),
      new Promise((resolve) => {
        setTimeout(resolve, 500);
      }),
    ]);
  }
  /**
   * Resolves once a Lit element and the Lit elements it rendered (a few
   * levels into shadow roots, e.g. video-player > a11y-media-player) have
   * finished updating.
   */
  async __whenRendered(el, depth) {
    try {
      await el.updateComplete;
      // media players (a11y-media-player) only lay out and paint their
      // poster once the media's metadata is in; until then they draw an
      // empty light box. The viewer copy already loaded it, so this is
      // normally a cache hit.
      const media = el.querySelectorAll(":scope > video, :scope > audio");
      const loads = [];
      for (let i = 0; i < media.length; i++) {
        if (media[i].readyState === 0 && media[i].preload !== "none") {
          loads.push(
            new Promise((resolve) => {
              media[i].addEventListener("loadedmetadata", resolve, {
                once: true,
              });
              media[i].addEventListener("error", resolve, { once: true });
            }),
          );
        }
      }
      if (loads.length) {
        await Promise.all(loads);
      }
      // the transcript / caption layout (flex-layout) follows the cues, so
      // wait for caption tracks that are loading as well
      const tracks = [];
      for (let i = 0; i < media.length; i++) {
        const list = media[i].querySelectorAll("track");
        for (let j = 0; j < list.length; j++) {
          const track = list[j];
          if (
            track.readyState < 2 &&
            track.track &&
            track.track.mode !== "disabled"
          ) {
            tracks.push(
              new Promise((resolve) => {
                track.addEventListener("load", resolve, { once: true });
                track.addEventListener("error", resolve, { once: true });
              }),
            );
          }
        }
      }
      if (tracks.length) {
        await Promise.all(tracks);
      }
      if (loads.length || tracks.length) {
        // let the player render what the media / cues changed
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
        await el.updateComplete;
      }
    } catch {
      return;
    }
    if (depth >= 3 || !el.shadowRoot) {
      return;
    }
    const inner = el.shadowRoot.querySelectorAll("*");
    const waits = [];
    for (let i = 0; i < inner.length; i++) {
      if (inner[i].updateComplete) {
        waits.push(this.__whenRendered(inner[i], depth + 1));
      }
    }
    await Promise.all(waits);
  }
  __finishEditModeReveal() {
    const reveal = this.__editModeReveal;
    if (!reveal) {
      return;
    }
    this.__editModeReveal = null;
    clearTimeout(reveal.timer);
    if (reveal.body && reveal.body.removeEventListener) {
      reveal.body.removeEventListener("hax-body-content-ready", reveal.onReady);
    }
    const hax = this.querySelector("h-a-x");
    if (hax) {
      hax.classList.remove("haxcms-edit-mode-pending");
      hax.removeAttribute("inert");
    }
    reveal.resolve();
  }
  __disposeDisposers() {
    if (this.__disposer && this.__disposer.length > 0) {
      for (let i in this.__disposer) {
        const disposer = this.__disposer[i];
        if (typeof disposer === "function") {
          disposer();
        } else if (disposer && typeof disposer.dispose === "function") {
          disposer.dispose();
        }
      }
    }
    this.__disposer = [];
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
        /* entering edit mode: the editable copy lays out at full width but
           takes no space and is not shown until it has rendered, then it
           swaps with the viewer content in one frame. Hidden with opacity
           (not inherited), never visibility: visibility is inherited, so
           blocks with transition: all (a11y-media-player) would animate
           hidden -> visible and paint only their empty light background
           for the first frame after the swap (haxtheweb/issues#3263) */
        haxcms-site-editor[edit-mode] h-a-x.haxcms-edit-mode-pending {
          opacity: 0;
          height: 0;
          overflow: hidden;
          pointer-events: none;
        }
      </style>
      <h-a-x
        id="hax"
        element-align="left"
        offset-margin="64px 0 0 0"
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
      getUserDataHeaders: {
        type: Object,
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

      appendTarget: {
        type: Object,
      },
      appElement: {
        type: Object,
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
    };
  }

  __deleteNodeResponseChanged(e) {
    // show message
    if (e.detail.value && e.detail.value.data && e.detail.value.data.title) {
      store.toast(
        this.t.pageDeletedSelecting.replace(
          "{title}",
          () => e.detail.value.data.title,
        ),
        4000,
      );
      store.playSound("coin");
    }
  }

  __createNodeResponseChanged(e) {
    // sanity check we have a slug, move to this page that we just made
    if (e.detail.value && e.detail.value.data && e.detail.value.data.slug) {
      const keepOpen = !!e.detail.keepOpen;
      setTimeout(() => {
        store.playSound("coin");
        const node = e.detail.value.data;
        // keepOpen (the site admin's add area) stays on the current page
        if (!keepOpen) {
          globalThis.history.pushState({}, null, node.slug);
          globalThis.dispatchEvent(new PopStateEvent("popstate"));
        }
        store.toast(
          this.t.createdTitle.replace("{title}", () => node.title),
          4000,
          {
            hat: "random",
            tone: "success",
          },
        );

        // Auto-enter edit mode if this page was created by a Merlin program.
        // Wait until the store has actually adopted the new page as the
        // active item before flipping editMode on; otherwise the editMode
        // autorun imports the previous page's content into the HAX body and
        // the eventual save writes to the duplication source instead of the
        // new page. See haxtheweb/issues#938.
        if (this._merlinCreated) {
          this._autoEnterEditModeForCreatedNode(node);
        }
      }, 900);
    }
  }
  /**
   * Wait until the store has adopted the just-created page as the active
   * item AND its content (with the correct <page-break item-id>) has loaded
   * before entering edit mode. Replaces a fixed-time delay that raced with
   * the manifest refresh + router re-resolve + page-content fetch.
   *
   * Why the page-break id check: the HAX body is saved by serializing its
   * children, the first of which is <page-break item-id="X">. The backend
   * saveNode resolves the target page from that item-id, OVERRIDING the
   * payload node.id. If editMode engages while store.activeItemContent still
   * holds the PREVIOUS page's content (whose page-break points at the
   * duplication source / parent), the body inherits the wrong item-id and
   * the save silently writes to the wrong page, then redirects to that
   * page's slug. Verifying the content's page-break matches the new node
   * before engaging edit mode closes the race for both duplicate and child
   * creates.
   *
   * A self-disposing autorun fires once activeItem.id and the content's
   * page-break item-id both match the new node. A safety timeout bails out
   * (leaving edit to the user) if the store never catches up, rather than
   * risk editing the wrong page.
   */
  _autoEnterEditModeForCreatedNode(node) {
    if (!node || !node.id) {
      this._merlinCreated = false;
      return;
    }
    // tear down any prior pending auto-edit reaction so repeated page
    // creations don't stack reactions against different nodes
    if (this.__autoEditDisposer) {
      this.__autoEditDisposer();
      this.__autoEditDisposer = null;
    }
    if (this.__autoEditSafetyTimer) {
      clearTimeout(this.__autoEditSafetyTimer);
      this.__autoEditSafetyTimer = null;
    }
    const targetId = String(node.id);
    const finish = () => {
      store.editMode = true;
      this._merlinCreated = false;
      if (this.__autoEditDisposer) {
        this.__autoEditDisposer();
        this.__autoEditDisposer = null;
      }
      if (this.__autoEditSafetyTimer) {
        clearTimeout(this.__autoEditSafetyTimer);
        this.__autoEditSafetyTimer = null;
      }
    };
    // fire once the store has adopted the new page as active AND the
    // content loaded for it (page-break item-id matches). Checking the
    // page-break id — not just "content non-empty" — is what prevents
    // importing the previous page's content (and its page-break) into
    // the HAX body, which would route the save to the wrong page.
    this.__autoEditDisposer = autorun(() => {
      const activeItem = toJS(store.activeItem);
      const content = toJS(store.activeItemContent);
      if (
        activeItem &&
        String(activeItem.id) === targetId &&
        this._extractPageBreakItemId(content) === targetId
      ) {
        finish();
      }
    });
    // safety net: if the store hasn't adopted the new page + content in
    // time, abandon auto-edit rather than risk editing the wrong page.
    // The user can open the new page and edit manually.
    this.__autoEditSafetyTimer = setTimeout(() => {
      if (!this.__autoEditDisposer) {
        return;
      }
      this._merlinCreated = false;
      this.__autoEditDisposer();
      this.__autoEditDisposer = null;
      store.toast(
        this.t.createdOpenToEdit.replace(
          "{title}",
          () => node.title || this.t.page,
        ),
        4000,
        {
          hat: "random",
          tone: "success",
        },
      );
    }, 10000);
  }
  /**
   * Extract the item-id from the first <page-break> in an HTML content
   * string. Used by _autoEnterEditModeForCreatedNode to verify the loaded
   * content actually belongs to the just-created page before editing.
   * Returns null if there's no page-break or no item-id.
   */
  _extractPageBreakItemId(content) {
    if (typeof content !== "string" || content === "") {
      return null;
    }
    const itemId = findTagAttrValue(content, "page-break", "item-id");
    return itemId !== null ? String(itemId) : null;
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
  _handleContentSearchResponse(e) {
    const response = e.detail && e.detail.response ? e.detail.response : {};
    const responseData =
      response.data && typeof response.data === "object" ? response.data : {};
    const responseOperation =
      typeof responseData.operation === "string"
        ? responseData.operation.toLowerCase().trim()
        : "";
    const operation =
      responseOperation || this.__lastContentDashboardOperation || "search";
    let query = this.__lastContentSearchQuery
      ? String(this.__lastContentSearchQuery)
      : "";
    if (responseData && typeof responseData.query === "string") {
      query = responseData.query;
    }
    if (operation === "replace") {
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-content-dashboard-replace-results", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            operation,
            query,
            data: responseData,
            raw: response,
          },
        }),
      );
      return;
    }
    let results = [];
    if (responseData && Array.isArray(responseData.results)) {
      results = responseData.results;
    } else if (responseData && Array.isArray(responseData.matches)) {
      results = responseData.matches;
    } else if (Array.isArray(response.matches)) {
      results = response.matches;
    } else if (response.data && Array.isArray(response.data)) {
      results = response.data;
    }
    const matchIds = [];
    results.forEach((result) => {
      if (typeof result === "string") {
        matchIds.push(result);
      } else if (result && typeof result === "object") {
        if (typeof result.id === "string") {
          matchIds.push(result.id);
        } else if (typeof result.id === "number") {
          matchIds.push(String(result.id));
        }
      }
    });
    const uniqueMatchIds = [...new Set(matchIds)];
    if (uniqueMatchIds.length === 0 && Array.isArray(results)) {
      results.forEach((result) => {
        if (typeof result === "string") {
          uniqueMatchIds.push(result);
        }
      });
    }
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-search-results", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          query,
          matches: uniqueMatchIds,
          results,
          raw: response,
        },
      }),
    );
  }
  _getRefreshRetryKey(target) {
    if (target && target.id) {
      return target.id;
    }
    return "unknown-request";
  }
  _incrementRefreshRetryCount(target) {
    const retryKey = this._getRefreshRetryKey(target);
    if (!this.__refreshRetryCounts[retryKey]) {
      this.__refreshRetryCounts[retryKey] = 0;
    }
    this.__refreshRetryCounts[retryKey] += 1;
    return {
      retryKey,
      retryCount: this.__refreshRetryCounts[retryKey],
    };
  }
  _clearRefreshRetryCount(targetOrKey) {
    let retryKey = targetOrKey;
    if (targetOrKey && typeof targetOrKey === "object") {
      retryKey = this._getRefreshRetryKey(targetOrKey);
    }
    if (this.__refreshRetryCounts[retryKey]) {
      delete this.__refreshRetryCounts[retryKey];
    }
  }
  _clearAllRefreshRetryCounts() {
    this.__refreshRetryCounts = {};
  }
  _resetRefreshRetryCountFromResponse(e) {
    let target = e && e.detail && e.detail.target ? e.detail.target : null;
    if (!target && e && typeof e.composedPath === "function") {
      const path = normalizeEventPath(e);
      target = path && path.length > 0 ? path[0] : null;
    }
    if (target) {
      this._clearRefreshRetryCount(target);
    }
  }
  _responseStatusCode(response) {
    if (!response || typeof response !== "object") {
      return 0;
    }
    if (typeof response.status === "number") {
      return response.status;
    }
    if (typeof response.status === "string") {
      const parsed = parseInt(response.status, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
  _responseStatusText(response, fallbackMessage = this.t.requestFailed) {
    if (!response || typeof response !== "object") {
      return fallbackMessage;
    }
    // the backend's message (translated by its code when possible) is more
    // useful than an HTTP reason phrase like "Bad Request" (issues#3157)
    const apiText = haxcmsApiMessage(response, "");
    if (apiText !== "") {
      return apiText;
    }
    if (
      typeof response.statusText === "string" &&
      response.statusText.trim() !== ""
    ) {
      return response.statusText.trim();
    }
    return fallbackMessage;
  }
  _isSuccessfulResponse(response) {
    const status = this._responseStatusCode(response);
    return status === 0 || (status >= 200 && status < 300);
  }
  _siteName() {
    if (
      this.manifest &&
      this.manifest.metadata &&
      this.manifest.metadata.site &&
      this.manifest.metadata.site.name
    ) {
      return String(this.manifest.metadata.site.name);
    }
    return "";
  }
  _buildRequestTarget(
    requestId = "site-request",
    body = {},
    requestExecutor,
    extraHeaders = {},
  ) {
    const defaultHeaders =
      extraHeaders && typeof extraHeaders === "object"
        ? Object.assign({}, extraHeaders)
        : {};
    const target = {
      id: requestId,
      body: body && typeof body === "object" ? body : {},
      headers: defaultHeaders,
    };
    target.generateRequest = async () => {
      target.headers = Object.assign({}, defaultHeaders);
      if (this.jwt) {
        target.headers.Authorization = `Bearer ${this.jwt}`;
      }
      if (typeof requestExecutor === "function") {
        return requestExecutor(target);
      }
      return null;
    };
    return target;
  }
  _emitRequestError(
    target,
    status,
    statusText = this.t.requestFailed,
    response = null,
  ) {
    const value = {
      status,
      statusText,
    };
    // keep the backend's code and English message so lastErrorChanged can
    // tell an expired session from a denial no refresh can fix
    if (response) {
      const parts = apiMessageParts(response);
      if (parts.code !== "") {
        value.code = parts.code;
      }
      if (parts.message !== "") {
        value.message = parts.message;
      }
    }
    this.lastErrorChanged({
      detail: {
        value,
        target,
      },
    });
  }
  /**
   * Call a Site API operation through MicroFrontendRegistry.
   * With a timeout (ms) the attempt gets an AbortSignal and, if it has not
   * answered by then, is aborted and reported as a failure (a danger toast;
   * the caller sees no response). Its late answer, if any, is ignored: the
   * caller has already been told the attempt failed, so nothing is applied.
   * The server may still finish the work it received; see saveOutline.
   */
  async _callSiteOperation(operationName, payload, target, timeout = 0) {
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !operationName ||
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.call !== "function" ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has(operationName)
    ) {
      return {
        unavailable: true,
        response: null,
      };
    }
    let controller = null;
    let timer = null;
    let timedOut = false;
    let callPayload = payload;
    if (
      timeout > 0 &&
      typeof AbortController === "function" &&
      payload &&
      typeof payload === "object" &&
      !(payload instanceof FormData)
    ) {
      controller = new AbortController();
      // the signal rides on this attempt only; target.body is reused by a
      // retry after a token refresh and stays as the caller built it
      callPayload = Object.assign({}, payload, {
        __fetchOptions: Object.assign({}, payload.__fetchOptions, {
          signal: controller.signal,
        }),
      });
    }
    try {
      const call = MicroFrontendRegistry.call(
        operationName,
        callPayload,
        null,
        null,
      );
      let response;
      if (controller) {
        // the aborted call settles on its own; nothing waits for it
        Promise.resolve(call).catch(() => {});
        try {
          response = await Promise.race([
            call,
            new Promise((resolve) => {
              timer = setTimeout(() => {
                timedOut = true;
                controller.abort();
                resolve(null);
              }, timeout);
            }),
          ]);
        } finally {
          clearTimeout(timer);
        }
      } else {
        response = await call;
      }
      if (timedOut) {
        store.toast(this.t.saveTimedOut, 5000, {
          fire: true,
          tone: "danger",
        });
        store.playSound("error");
        return {
          unavailable: false,
          response: null,
        };
      }
      if (this._isSuccessfulResponse(response)) {
        return {
          unavailable: false,
          response,
        };
      }
      const status = this._responseStatusCode(response);
      const statusText = this._responseStatusText(
        response,
        this.t.operationFailed,
      );
      this._emitRequestError(target, status, statusText, response);
      return {
        unavailable: false,
        response: null,
      };
    } catch (error) {
      let status = 500;
      if (error && typeof error.status !== "undefined") {
        const parsed = parseInt(error.status, 10);
        if (!Number.isNaN(parsed)) {
          status = parsed;
        }
      }
      const statusText =
        error &&
        typeof error.message === "string" &&
        error.message.trim() !== ""
          ? error.message.trim()
          : this.t.operationFailed;
      this._emitRequestError(target, status, statusText);
      return {
        unavailable: false,
        response: null,
      };
    }
  }
  _normalizeEndpointTarget(endpoint = "") {
    const normalizedEndpoint =
      typeof endpoint === "string" ? endpoint.trim() : "";
    if (normalizedEndpoint === "") {
      return "";
    }
    if (
      normalizedEndpoint.indexOf("http://") === 0 ||
      normalizedEndpoint.indexOf("https://") === 0 ||
      normalizedEndpoint.charAt(0) === "/"
    ) {
      return normalizedEndpoint;
    }
    return `/${normalizedEndpoint}`;
  }

  _normalizeRequestMethod(method = "") {
    const normalizedMethod =
      typeof method === "string" ? method.trim().toUpperCase() : "";
    if (normalizedMethod !== "") {
      return normalizedMethod;
    }
    if (this.method && typeof this.method === "string") {
      const defaultMethod = this.method.trim().toUpperCase();
      if (defaultMethod !== "") {
        return defaultMethod;
      }
    }
    return "POST";
  }

  async _callEndpointRequest(
    endpoint = "",
    payload = {},
    target = null,
    method = "",
  ) {
    const requestTarget = this._normalizeEndpointTarget(endpoint);
    if (requestTarget === "") {
      return {
        unavailable: true,
        response: null,
      };
    }
    const requestPayload =
      payload && typeof payload === "object" && !Array.isArray(payload)
        ? payload
        : {};
    const requestMethod = this._normalizeRequestMethod(method);
    const requestHeaders =
      target && target.headers && typeof target.headers === "object"
        ? Object.assign({}, target.headers)
        : {};
    let requestUrl = requestTarget;
    const requestOptions = {
      method: requestMethod,
      headers: requestHeaders,
      credentials: "include",
    };
    if (requestMethod === "GET" || requestMethod === "HEAD") {
      const searchParams = new URLSearchParams();
      const payloadKeys = Object.keys(requestPayload);
      for (let i = 0; i < payloadKeys.length; i++) {
        const key = payloadKeys[i];
        const value = requestPayload[key];
        if (
          typeof value === "undefined" ||
          value === null ||
          typeof value === "object"
        ) {
          continue;
        }
        searchParams.append(key, `${value}`);
      }
      const queryString = searchParams.toString();
      if (queryString !== "") {
        requestUrl += requestUrl.indexOf("?") === -1 ? "?" : "&";
        requestUrl += queryString;
      }
    } else {
      if (
        !Object.prototype.hasOwnProperty.call(
          requestOptions.headers,
          "Content-Type",
        )
      ) {
        requestOptions.headers["Content-Type"] = "application/json";
      }
      requestOptions.body = JSON.stringify(requestPayload);
    }
    try {
      const response = await fetch(requestUrl, requestOptions);
      const responseText = await response.text();
      let responseData = null;
      if (responseText && responseText.trim() !== "") {
        try {
          responseData = JSON.parse(responseText);
        } catch {
          // intentionally empty
        }
      }
      const normalizedResponse =
        responseData && typeof responseData === "object"
          ? Object.assign({}, responseData)
          : {};
      if (typeof normalizedResponse.status === "undefined") {
        normalizedResponse.status = response.status;
      }
      if (
        typeof normalizedResponse.statusText === "undefined" &&
        typeof response.statusText === "string" &&
        response.statusText.trim() !== ""
      ) {
        normalizedResponse.statusText = response.statusText;
      }
      if (this._isSuccessfulResponse(normalizedResponse)) {
        return {
          unavailable: false,
          response: normalizedResponse,
        };
      }
      const status = this._responseStatusCode(normalizedResponse);
      const statusText = this._responseStatusText(
        normalizedResponse,
        this.t.operationFailed,
      );
      this._emitRequestError(
        target,
        status || response.status,
        statusText,
        normalizedResponse,
      );
      return {
        unavailable: false,
        response: null,
      };
    } catch (error) {
      let status = 500;
      if (error && typeof error.status !== "undefined") {
        const parsed = parseInt(error.status, 10);
        if (!Number.isNaN(parsed)) {
          status = parsed;
        }
      }
      const statusText =
        error &&
        typeof error.message === "string" &&
        error.message.trim() !== ""
          ? error.message.trim()
          : this.t.operationFailed;
      this._emitRequestError(target, status, statusText);
      return {
        unavailable: false,
        response: null,
      };
    }
  }

  async _requestJson({
    requestId = "site-request",
    operationName = "",
    payload = {},
    endpoint = "",
    method = "",
    headers = {},
    unavailableMessage = "",
    onSuccess = null,
    timeout = 0,
    onSettled = null,
  } = {}) {
    const requestTarget = this._buildRequestTarget(
      requestId,
      payload,
      async (target) => {
        // a request its caller gave up on (see _requestAdminSave) is never
        // sent again, not even by a late token refresh
        if (target.__abandoned) {
          return null;
        }
        // this attempt is the retry a refresh was waiting for, if any
        target.__refreshPending = false;
        try {
          const response = await this._sendRequestTarget(target, {
            operationName,
            endpoint,
            method,
            unavailableMessage,
            onSuccess,
            timeout,
          });
          if (typeof onSettled === "function") {
            onSettled(response, target);
          }
          return response;
        } catch (error) {
          if (typeof onSettled === "function") {
            onSettled(null, target);
          }
          throw error;
        }
      },
      headers,
    );
    return requestTarget.generateRequest();
  }

  /**
   * One attempt of a _requestJson request: the Site API operation, else the
   * endpoint. Returns the response, or null when it failed (already reported).
   */
  async _sendRequestTarget(
    target,
    { operationName, endpoint, method, unavailableMessage, onSuccess, timeout },
  ) {
    let operationResult = {
      unavailable: true,
      response: null,
    };
    const normalizedOperationName =
      operationName && typeof operationName === "string"
        ? operationName.trim()
        : "";
    if (normalizedOperationName !== "") {
      operationResult = await this._callSiteOperation(
        normalizedOperationName,
        target.body,
        target,
        timeout,
      );
    }
    if (
      !operationResult.response &&
      operationResult.unavailable === true &&
      endpoint &&
      typeof endpoint === "string"
    ) {
      operationResult = await this._callEndpointRequest(
        endpoint,
        target.body,
        target,
        method,
      );
    }
    let response = operationResult.response;
    if (!response) {
      if (operationResult.unavailable && unavailableMessage) {
        store.toast(unavailableMessage, 3000, {
          fire: true,
          tone: "warning",
        });
        store.playSound("error");
      }
      return null;
    }
    this._clearRefreshRetryCount(target);
    if (typeof onSuccess === "function") {
      onSuccess(response, target);
    }
    return response;
  }

  /**
   * Handle the last error rolling in
   */
  lastErrorChanged(e) {
    if (e && e.detail && e.detail.value) {
      console.error(e);
      let target = e.detail.target ? e.detail.target : null;
      if (!target && e && typeof e.composedPath === "function") {
        const path = normalizeEventPath(e);
        target = path && path.length > 0 ? path[0] : null;
      }
      // Expired/invalid JWT OR forbidden. The Site API returns 401 for an
      // expired bearer while the System API returns 403; treat both as
      // "try to refresh first" when we still have a jwt, and only log out
      // when the refresh retry cap is exceeded or there are no credentials
      // to refresh in the first place.
      switch (parseInt(e.detail.value.status, 10)) {
        case 401:
        case 405:
        case 403: {
          // A denial no refresh can fix (feature disabled for this site,
          // file path not allowed, site access denied, method not allowed,
          // ...): tell the user and keep them signed in. Refreshing,
          // retrying and then logging out loses their session over a
          // "you can't do that" answer.
          // 401 means not signed in and keeps its refresh / logout handling.
          if (
            parseInt(e.detail.value.status, 10) !== 401 &&
            isHardDenial(e.detail.value)
          ) {
            if (target) {
              this._clearRefreshRetryCount(target);
            }
            store.toast(
              e.detail.value.statusText && e.detail.value.statusText !== ""
                ? e.detail.value.statusText
                : this.t.requestFailed,
              5000,
              {
                fire: true,
              },
            );
            store.playSound("error");
            return;
          }
          // no credentials at all -> genuine logged-out state
          if (!this.jwt || this.jwt === "" || this.jwt === "null") {
            this._clearAllRefreshRetryCounts();
            this._snapshotPendingEditForLogout();
            this._jwtLogout();
            return;
          }
          const retryMeta = this._incrementRefreshRetryCount(target);
          if (retryMeta.retryCount > this.__maxRefreshRetries) {
            this._clearRefreshRetryCount(retryMeta.retryKey);
            this._clearAllRefreshRetryCounts();
            this._snapshotPendingEditForLogout();
            this._jwtLogout();
            return;
          }
          // the request is retried once jwt-login has a new token
          // (refreshRequest); its caller can wait for that retry
          if (target && typeof target === "object") {
            target.__refreshPending = true;
          }
          this.dispatchEvent(
            new CustomEvent("jwt-login-refresh-token", {
              composed: true,
              bubbles: true,
              cancelable: false,
              detail: {
                element: {
                  obj: this,
                  callback: "refreshRequest",
                  params: [target, retryMeta.retryKey],
                },
              },
            }),
          );
          break;
        }
        default: {
          const statusText =
            e.detail.value.statusText && e.detail.value.statusText !== ""
              ? e.detail.value.statusText
              : this.t.requestFailed;
          store.toast(e.detail.value.status + " " + statusText, 5000, {
            fire: true,
            tone: "danger",
          });
          store.playSound("error");
          break;
        }
      }
    }
  }
  /**
   * Attempt to salvage the request that was kicked off
   * when our JWT needed refreshed
   */
  refreshRequest(jwt, element, retryKey = null) {
    // force the jwt to be the updated jwt
    // this helps avoid any possible event timing issue
    if (!jwt) {
      if (retryKey) {
        this._clearRefreshRetryCount(retryKey);
      }
      // no retry is coming: a save waiting on it has failed
      this._giveUpRefreshWait(element);
      // refresh returned no usable jwt (malformed success). The reactive
      // refresh-failure path (_tokenRefreshFailed) handles the normal case;
      // toast here too so this rare path isn't a silent kick to the homepage.
      try {
        store.toast(this.t.sessionExpired, 4000, {
          fire: true,
          tone: "warning",
        });
      } catch {
        // intentionally empty
      }
      return;
    }
    this.jwt = jwt;
    const appSettings =
      globalThis.appSettings && typeof globalThis.appSettings === "object"
        ? globalThis.appSettings
        : store && store.appSettings
          ? toJS(store.appSettings)
          : {};
    configureHAXCMSSiteApiRegistry(appSettings, this.jwt);
    if (
      element &&
      element.body &&
      Object.prototype.hasOwnProperty.call(element.body, "jwt")
    ) {
      element.body.jwt = jwt;
    }
    if (element) {
      element.headers = {
        Authorization: `Bearer ${this.jwt}`,
      };
    }
    // a request whose caller already reported it failed is not sent again
    if (element && element.__abandoned) {
      return;
    }
    // again, sanity check on delay
    setTimeout(() => {
      if (element && typeof element.generateRequest === "function") {
        element.generateRequest();
      }
    }, 0);
  }

  /**
   * An admin save waiting on a token refresh for this request target stops
   * waiting: the request is never sent again and the save is reported as
   * failed. No-op for a target nothing is waiting on.
   */
  _giveUpRefreshWait(target) {
    if (!target || !this.__refreshWaitingSaves.has(target)) {
      return;
    }
    const giveUp = this.__refreshWaitingSaves.get(target);
    giveUp();
  }

  loadingChanged(e) {
    this.loading = e.detail.value;
  }
  _ensureBaseDDDVariables() {
    if (!globalThis.document || !globalThis.document.head) {
      return;
    }
    const variableStyles =
      DDDVariables && DDDVariables.cssText ? DDDVariables.cssText : "";
    if (!variableStyles) {
      return;
    }
    if (!globalThis.document.head.querySelector("[data-haxcms-ddd-vars]")) {
      const style = globalThis.document.createElement("style");
      style.setAttribute("data-haxcms-ddd-vars", "");
      style.innerHTML = variableStyles;
      globalThis.document.head.appendChild(style);
    }
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
  firstUpdated(_changedProperties) {
    this._ensureBaseDDDVariables();
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

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "appStore") {
        // Passes the location of appstore.json in HAXcms
        const appStoreUrl = JSON.parse(JSON.stringify(this[propName]));

        this.querySelector("#hax").setAttribute(
          "app-store",
          JSON.stringify(appStoreUrl),
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
   * End the session through jwt-login and follow its redirect-url once the
   * logout request settles (jwt-login waits for the server before it
   * navigates). One place for every "session is gone" path in the editor.
   */
  _jwtLogout() {
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

  /**
   * Respond to a failed request to refresh the token by killing the logout process
   */
  // Phase 6 (L2 documentation): refresh-token family revocation on logout
  // (implemented in both backends via revokeRefreshSession) is the primary L2
  // fix. A refresh token exfiltrated before logout is invalidated server-side
  // when the user logs out. Access JWTs remain valid until their 15-minute exp
  // and are NOT revoked server-side; revoking those would require access-token
  // jti denylisting, which is not recommended unless the threat model changes.
  _tokenRefreshFailed(_e) {
    this._clearAllRefreshRetryCounts();
    // no retry is coming for any request that was waiting on this refresh
    Array.from(this.__refreshWaitingSaves.keys()).forEach((target) => {
      this._giveUpRefreshWait(target);
    });
    // only message + snapshot when we actually had a session to lose,
    // so a login failure (no jwt) doesn't toast "session expired"
    if (this.jwt && this.jwt !== "" && this.jwt !== "null") {
      try {
        store.toast(this.t.sessionExpired, 4000, {
          fire: true,
          tone: "warning",
        });
      } catch {
        // intentionally empty
      }
      this._snapshotPendingEditForLogout();
    }
    this._jwtLogout();
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.__disposer || this.__disposer.length === 0) {
      this.__setupDisposers();
    }
    if (this.windowControllers) {
      this.windowControllers.abort();
    }
    this.windowControllers = new AbortController();
    globalThis.addEventListener(
      "jwt-login-refresh-error",
      this._tokenRefreshFailed.bind(this),
      { signal: this.windowControllers.signal },
    );
    this.addEventListener(
      "response",
      this._resetRefreshRetryCountFromResponse.bind(this),
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
      "haxcms-save-seo-data",
      this.saveSEOSettings.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-save-platform-settings",
      this.savePlatformSettings.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-save-allowed-blocks",
      this.saveAllowedBlocks.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-save-editor-settings",
      this.saveEditorSettings.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-save-appearance-settings",
      this.saveAppearanceSettings.bind(this),
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
      "haxcms-load-node-revisions",
      this.loadNodeRevisions.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-load-node-revision",
      this.loadNodeRevision.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-restore-node-revision",
      this.restoreNodeRevision.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-compare-node-revisions",
      this.compareNodeRevisions.bind(this),
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
    globalThis.addEventListener(
      "haxcms-content-dashboard-operation",
      this.contentDashboardOperation.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-files-dashboard-operation",
      this.filesDashboardOperation.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-normalize-slugs",
      this.normalizeSlugs.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
  }
  disconnectedCallback() {
    if (this.windowControllers) {
      this.windowControllers.abort();
    }
    if (
      this._contentReadyHandler &&
      HAXStore.activeHaxBody &&
      HAXStore.activeHaxBody.removeEventListener
    ) {
      HAXStore.activeHaxBody.removeEventListener(
        "hax-body-content-ready",
        this._contentReadyHandler,
      );
      this._contentReadyHandler = null;
    }
    if (this.__autoEditDisposer) {
      this.__autoEditDisposer();
      this.__autoEditDisposer = null;
    }
    if (this.__autoEditSafetyTimer) {
      clearTimeout(this.__autoEditSafetyTimer);
      this.__autoEditSafetyTimer = null;
    }
    this.__finishEditModeReveal();
    this.__disposeDisposers();
    super.disconnectedCallback();
  }

  /**
   * Load user data from backend
   */

  loadUserData(_e) {
    const appSettings =
      globalThis.appSettings && typeof globalThis.appSettings === "object"
        ? globalThis.appSettings
        : null;
    let userHeaders =
      this.getUserDataHeaders && typeof this.getUserDataHeaders === "object"
        ? { ...this.getUserDataHeaders }
        : {};
    if (Object.keys(userHeaders).length === 0) {
      if (appSettings) {
        if (
          appSettings.getUserDataHeaders &&
          typeof appSettings.getUserDataHeaders === "object"
        ) {
          userHeaders = { ...appSettings.getUserDataHeaders };
        }
        if (
          Object.keys(userHeaders).length === 0 &&
          appSettings.userTokenHeader &&
          appSettings.userToken
        ) {
          const userTokenHeaderName = String(
            appSettings.userTokenHeader,
          ).trim();
          const userTokenHeaderValue = String(appSettings.userToken).trim();
          if (userTokenHeaderName !== "" && userTokenHeaderValue !== "") {
            userHeaders[userTokenHeaderName] = userTokenHeaderValue;
          }
        }
      }
    }
    const userDataEndpoint =
      typeof this.getUserDataPath === "string" &&
      this.getUserDataPath.trim() !== ""
        ? this.getUserDataPath.trim()
        : appSettings &&
            typeof appSettings.getUserDataPath === "string" &&
            appSettings.getUserDataPath.trim() !== ""
          ? appSettings.getUserDataPath.trim()
          : "";
    this._requestJson({
      requestId: "getuserdata",
      operationName: "@system/sessionUserGet",
      endpoint: userDataEndpoint,
      method: "GET",
      headers: userHeaders,
      unavailableMessage: this.t.userDataEndpointUnavailable,
      onSuccess: (response) => {
        this._handleUserDataResponse({
          detail: {
            response,
          },
        });
      },
    });
  }

  /**
   * create node event
   */

  async createNode(e) {
    // Check platform configuration before allowing page creation
    if (!store.platformAllows("addPage")) {
      store.toast(this.t.addingPagesDisabled, 3000, {
        fire: true,
        tone: "warning",
      });
      return;
    }

    if (e.detail.values) {
      let reqBody = e.detail.values;
      // ensure site name is set in request
      if (Object.prototype.hasOwnProperty.call(reqBody, "jwt")) {
        delete reqBody.jwt;
      }
      reqBody.site = {
        name: this.manifest.metadata.site.name,
      };
      // store who sent this in-case of multiple instances
      this._originalTarget = e.detail.originalTarget;
      // Store if this was created by a Merlin program for auto-edit enhancement
      this._merlinCreated = reqBody.merlinCreated || false;
      // the site admin's add area keeps its dialog open and stays put
      const keepOpen = !!e.detail.keepOpen;
      // docxImport use the routine from app-hax
      if (reqBody.docximport) {
        await import("@haxtheweb/file-system-broker/lib/docx-file-system-broker.js").then(
          async (_e) => {
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
              "@system/importDocx",
              formData,
            );
            store.toast(this.t.finished, 300);
            if (
              response.status === 200 &&
              response.data &&
              response.data.items &&
              response.data.items.length > 0
            ) {
              globalThis.dispatchEvent(
                new CustomEvent("haxcms-docx-import-items", {
                  bubbles: true,
                  composed: true,
                  cancelable: true,
                  detail: {
                    items: response.data.items,
                    parentId: reqBody.parent,
                  },
                }),
              );
            } else {
              store.toast(this.t.invalidDocxResponse, 4000, {
                hat: "construction",
                tone: "danger",
              });
            }
          },
        );
      } else {
        this.setProcessingVisual();
        await this._requestJson({
          requestId: "createajax",
          operationName: "@site/createItem",
          payload: reqBody,
          unavailableMessage: this.t.createItemEndpointUnavailable,
          onSuccess: (response) => {
            this.__createNodeResponseChanged({
              detail: {
                value: response,
                keepOpen: keepOpen,
              },
            });
            this._handleCreateResponse({
              detail: {
                response,
              },
            });
          },
        });
        if (!keepOpen) {
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
  }

  _handleCreateResponse(_response) {
    const response =
      _response && _response.detail ? _response.detail.response : null;
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
            // the page that was made, for a caller that needs its id
            item: response && response.data ? response.data : null,
          },
        }),
      );
    }, 300);
  }
  /**
   * delete the node we just got. `keepOpen: true` in the detail (the
   * Content admin's bulk Delete) leaves the admin dialog open, and only
   * moves off the page when the deleted page is the one showing.
   */

  deleteNode(e) {
    // Check platform configuration before allowing delete
    if (!store.platformAllows("deletePage")) {
      store.toast(this.t.deleteDisabled, 3000, { fire: true, tone: "warning" });
      return;
    }
    const itemId =
      e && e.detail && e.detail.item && e.detail.item.id
        ? String(e.detail.item.id)
        : "";
    if (!itemId) {
      store.toast(this.t.unableToDeleteMissingId, 3000, {
        fire: true,
        tone: "danger",
      });
      store.playSound("error");
      return;
    }
    const keepOpen = !!(e && e.detail && e.detail.keepOpen);
    this.setProcessingVisual();
    this._requestJson({
      requestId: "deleteajax",
      operationName: "@site/deleteItem",
      payload: {
        idOrSlug: itemId,
        site: {
          name: this._siteName(),
        },
        node: {
          id: itemId,
        },
      },
      unavailableMessage: this.t.deleteItemEndpointUnavailable,
      onSuccess: (response) => {
        this.__deleteNodeResponseChanged({
          detail: {
            value: response,
          },
        });
        this._handleDeleteResponse({
          detail: {
            response,
            keepOpen,
            itemId,
          },
        });
      },
    });
    if (keepOpen) {
      return;
    }
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

  /**
   * The page URL with the admin's own route kept when the admin is open
   * (?admin=…), so moving to another page from inside the admin (a bulk
   * delete of the page showing, a rename that changes its slug) does not
   * close it; with no admin open the URL is the slug alone, as before
   */
  _keepAdminRoute(slug) {
    const params = new URLSearchParams(globalThis.location.search);
    if (!params.has("admin")) {
      return slug;
    }
    return `${slug}${globalThis.location.search}`;
  }

  _handleDeleteResponse(_response) {
    const detail = _response && _response.detail ? _response.detail : {};
    const showing =
      store.activeId && String(store.activeId) === String(detail.itemId);
    // this will force ID to update and avoid a page miss
    // when we deleted the node; a bulk delete that keeps the dialog open
    // only does this for the page that is showing
    if (!detail.keepOpen || showing) {
      // a delete from inside the open admin keeps the admin open
      const slug = detail.keepOpen
        ? this._keepAdminRoute(store.fallbackItemSlug())
        : store.fallbackItemSlug();
      globalThis.history.replaceState({}, null, slug);
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
    }
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
    if (event && event.detail) {
      // JWT is now transmitted exclusively via Authorization header
    }
    // offer to restore any unsaved edits recovered from a prior session
    this._offerPendingEditRestore();
  }
  /**
   * Snapshot the in-memory HAX body into sessionStorage so that a hard
   * logout redirect (real auth failure) doesn't silently destroy the edits
   * the user was working on. Best-effort; only when actively editing.
   */
  _snapshotPendingEditForLogout() {
    try {
      if (!this.editMode) {
        return;
      }
      const activeItem = toJS(store.activeItem);
      if (!activeItem || !activeItem.id) {
        return;
      }
      const body = HAXStore.activeHaxBody;
      if (!body) {
        return;
      }
      const content = body.innerHTML;
      if (!content || content.trim() === "") {
        return;
      }
      const snapshot = {
        itemId: String(activeItem.id),
        slug: activeItem.slug || "",
        title: activeItem.title || "",
        content: content,
        savedAt: Date.now(),
      };
      globalThis.sessionStorage.setItem(
        "haxcms-pending-edit",
        JSON.stringify(snapshot),
      );
    } catch {
      // intentionally empty
    }
  }
  /**
   * On editor startup, look for a recovered-edit snapshot and notify the
   * user. The snapshot is applied automatically when they enter edit mode
   * on the matching page (see the editMode autorun + _applyPendingRestoreIfMatch).
   */
  _offerPendingEditRestore() {
    try {
      const snapRaw = globalThis.sessionStorage.getItem("haxcms-pending-edit");
      if (!snapRaw) {
        return;
      }
      const snapshot = JSON.parse(snapRaw);
      if (!snapshot || !snapshot.itemId || !snapshot.content) {
        globalThis.sessionStorage.removeItem("haxcms-pending-edit");
        return;
      }
      // Phase 4 (L1): enforce a retention TTL so stale snapshots from a
      // long-closed session are not offered indefinitely. Default 30 minutes.
      let maxAgeMs = 30 * 60 * 1000;
      if (
        typeof snapshot.savedAt === "number" &&
        Date.now() - snapshot.savedAt > maxAgeMs
      ) {
        globalThis.sessionStorage.removeItem("haxcms-pending-edit");
        return;
      }
      this.__pendingRestore = snapshot;
      const title = snapshot.title || this.t.aPreviousPage;
      store.toast(
        this.t.recoveredUnsavedEdits.replace("{title}", () => title),
        6000,
        { fire: true, hat: "save", tone: "info" },
      );
    } catch {
      // intentionally empty
    }
  }
  /**
   * Apply a recovered-edit snapshot when the user is editing the page it
   * belonged to. Called after the saved content is imported into the body.
   */
  _applyPendingRestoreIfMatch() {
    if (!this.__pendingRestore) {
      return;
    }
    const snapshot = this.__pendingRestore;
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) {
      return;
    }
    if (String(activeItem.id) !== String(snapshot.itemId)) {
      return;
    }
    if (!this.editMode || !HAXStore.activeHaxBody) {
      return;
    }
    HAXStore.activeHaxBody.importContent(snapshot.content);
    this.__pendingRestore = null;
    try {
      globalThis.sessionStorage.removeItem("haxcms-pending-edit");
    } catch {
      // intentionally empty
    }
    try {
      const title = snapshot.title || this.t.thisPage;
      store.toast(
        this.t.restoredUnsavedEdits.replace("{title}", () => title),
        4000,
        {
          fire: true,
          hat: "save",
          tone: "danger",
        },
      );
    } catch {
      // intentionally empty
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
      // Also expose the active node id directly so hax-upload-field can
      // retarget local HAXcms uploads to POST /x/api/v1/files and send
      // nodeId as a multipart form field (v1 createFile) instead of as a
      // legacy query param. appendUploadEndPoint is kept because the media
      // browser browse path (hax-app-search) still reads it.
      HAXStore.connectionRewrites.uploadNodeId = String(this.activeItem.id);
    }
  }
  /**
   * active item changed
   */

  _activeItemChanged(newValue, _oldValue) {
    if (newValue && this.manifest) {
      // set upload manager to point to this location in a more dynamic fashion
      HAXStore.connectionRewrites.appendUploadEndPoint =
        "siteName=" +
        this.manifest.metadata.site.name +
        "&nodeId=" +
        newValue.id;
      // Mirror the active node id for the v1 upload retarget (see
      // _manifestChanged for the rationale).
      HAXStore.connectionRewrites.uploadNodeId = String(newValue.id);
    }
  }
  /**
   * handle update responses for nodes and outlines
   */

  _handleNodeResponse(e) {
    // node response may include the item that got updated
    // it also may be a new path so let's ensure that's reflected
    const nodeResponse =
      e && e.detail && e.detail.value ? e.detail.value : null;
    const nodeData =
      nodeResponse && nodeResponse.data ? nodeResponse.data : null;
    if (
      nodeData &&
      nodeData.slug &&
      this.activeItem &&
      this.activeItem.slug !== nodeData.slug
    ) {
      globalThis.history.replaceState({}, null, nodeData.slug);
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
    }
    // Patch the local manifest item from the server response so the editor
    // reflects the change immediately (slug/title/metadata.overridePathauto)
    // without waiting for the manifest reload. Without this, a second save
    // within the same second resubmits stale slug/override state (the
    // _timeStamp cache-buster doesn't change in-window, so loadJOSData is
    // skipped), which clobbers a just-set override or reverts a custom slug.
    if (nodeData && nodeData.id) {
      const item = store.findItem(nodeData.id);
      if (item) {
        if (typeof nodeData.title === "string") {
          item.title = nodeData.title;
        }
        if (typeof nodeData.slug === "string") {
          item.slug = nodeData.slug;
        }
        if (typeof nodeData.description === "string") {
          item.description = nodeData.description;
        }
        if (nodeData.metadata && typeof nodeData.metadata === "object") {
          if (!item.metadata || typeof item.metadata !== "object") {
            item.metadata = {};
          }
          // content saves set or clear these metadata fields; mirror the
          // server state locally so the next save serializes fresh values.
          const metadataKeys = [
            "tags",
            "icon",
            "image",
            "relatedItems",
            "locked",
            "published",
            "hideInMenu",
            "overridePathauto",
            "pageType",
            "theme",
            "accentColor",
            "linkUrl",
            "linkTarget",
            "author",
            "readtime",
            "videos",
            "images",
          ];
          metadataKeys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(nodeData.metadata, key)) {
              item.metadata[key] = nodeData.metadata[key];
            } else if (
              Object.prototype.hasOwnProperty.call(item.metadata, key)
            ) {
              delete item.metadata[key];
            }
          });
        }
      }
    }
    // clear a recovered-edit snapshot when its page is successfully saved
    try {
      const snapRaw = globalThis.sessionStorage.getItem("haxcms-pending-edit");
      if (snapRaw) {
        const snap = JSON.parse(snapRaw);
        const currentId = this.activeItem && this.activeItem.id;
        if (snap && String(snap.itemId) === String(currentId)) {
          globalThis.sessionStorage.removeItem("haxcms-pending-edit");
          this.__pendingRestore = null;
        }
      }
    } catch {
      // intentionally empty
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
        // Clean up any existing listener to prevent duplicates
        if (this._contentReadyHandler) {
          HAXStore.activeHaxBody.removeEventListener(
            "hax-body-content-ready",
            this._contentReadyHandler,
          );
        }

        // Wait for hax-body content-ready event instead of arbitrary timeout
        this._contentReadyHandler = () => {
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

            // Force UI component to re-render to update button visibility
            // editMode stayed true, so autorun won't fire - need manual update
            // Use RAF to ensure DOM is settled before requesting update
            requestAnimationFrame(() => {
              const uiElement = globalThis.document.querySelector(
                "haxcms-site-editor-ui",
              );
              if (uiElement) {
                // Force observable to fire by toggling and restoring
                const currentMode = store.editMode;
                store.editMode = false;
                requestAnimationFrame(() => {
                  store.editMode = currentMode;
                });
              }
            });
          } catch (error) {
            console.warn(
              "Failed to restore active element position after save:",
              error,
            );
          }
          // Clean up the restoration flags
          this._restoreActiveIndex = null;
          this._restoreKeepEditMode = false;
          this._contentReadyHandler = null;
        };

        // Listen for content-ready event from hax-body
        if (HAXStore.activeHaxBody) {
          HAXStore.activeHaxBody.addEventListener(
            "hax-body-content-ready",
            this._contentReadyHandler,
            { once: true },
          );
        }
      }

      // force an update in the store to reprocess what is "active"
      // otherwise the page data that was just saved won't be reflected until hitting a different
      // page, causing a temporary state error if going to edit again
      let tmp = store.activeId;
      store.activeId = null;
      store.activeId = tmp;
      store.toast(this.t.pageSaved, 4000, { hat: "random", tone: "success" });
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
      store.toast(this.t.outlineSaved, 4000, {
        hat: "random",
        tone: "success",
      });
      // If the active page's slug changed, redirect to the new URL
      const activeItem = store.activeItem;
      // MicroFrontendRegistry.call returns the full {status, data} envelope,
      // and saveOutline returns {status:200, data:{items: site.manifest.items}}.
      // Read data.items (not response.items, which is always undefined).
      const responseItems =
        e &&
        e.detail &&
        e.detail.response &&
        e.detail.response.data &&
        e.detail.response.data.items
          ? e.detail.response.data.items
          : null;
      if (activeItem && activeItem.id && responseItems) {
        const updatedItem = responseItems.find(
          (item) => item && item.id === activeItem.id,
        );
        if (
          updatedItem &&
          updatedItem.slug &&
          updatedItem.slug !== activeItem.slug
        ) {
          // a rename saved from the open admin (Structure) keeps it open
          const newSlug = this._keepAdminRoute(updatedItem.slug);
          globalThis.history.replaceState({}, null, newSlug);
          globalThis.dispatchEvent(new PopStateEvent("popstate"));
        }
      }
    }, 300);
  }

  _handleManifestResponse(_e) {
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

  _handlePlatformSettingsResponse(_e) {
    // mirror the site manifest save UX
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
  _handleAllowedBlocksResponse(e) {
    this._handlePlatformSettingsResponse(e);
  }
  _handleEditorSettingsResponse(e) {
    this._handlePlatformSettingsResponse(e);
  }

  _handleAppearanceSettingsResponse(_e) {
    // mirror the platform + manifest save UX
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
    // Patch the local manifest item from the server response so the editor
    // reflects the change immediately (title/slug/description/tags/icon/etc.)
    // without waiting for the manifest reload. This avoids stale values when
    // re-opening quick operations like edit-tags, especially when successive
    // saves happen within the same second (the _timeStamp cache-buster would
    // otherwise not change and skip the loadJOSData reload).
    const response = e && e.detail ? e.detail.response : null;
    const data = response && response.data ? response.data : null;
    // Capture the active page's slug BEFORE patching so we can redirect the
    // browser when a node-details op (setTitle/setParent/indent/outdent/setSlug)
    // changed the active page's slug. Without this, the URL bar keeps the stale
    // slug and the next navigation/reload hits page-not-found.
    const activeItem = store.activeItem;
    const activeId = activeItem && activeItem.id ? activeItem.id : null;
    const previousActiveSlug =
      activeItem && typeof activeItem.slug === "string"
        ? activeItem.slug
        : null;
    if (data && data.id) {
      const item = store.findItem(data.id);
      if (item) {
        if (typeof data.title === "string") {
          item.title = data.title;
        }
        if (typeof data.slug === "string") {
          item.slug = data.slug;
        }
        if (typeof data.description === "string") {
          item.description = data.description;
        }
        if (data.metadata && typeof data.metadata === "object") {
          if (!item.metadata || typeof item.metadata !== "object") {
            item.metadata = {};
          }
          // node-detail operations set or clear these metadata fields; the
          // backend deletes on clear, so mirror that locally to keep the
          // manifest item in sync with the server.
          const metadataKeys = [
            "tags",
            "icon",
            "image",
            "relatedItems",
            "locked",
            "published",
            "hideInMenu",
            "overridePathauto",
          ];
          metadataKeys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(data.metadata, key)) {
              item.metadata[key] = data.metadata[key];
            } else if (
              Object.prototype.hasOwnProperty.call(item.metadata, key)
            ) {
              delete item.metadata[key];
            }
          });
        }
      }
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
      );
      store.toast(this.t.operationCompleted, 3000, {
        hat: "construction",
        tone: "success",
      });
      // If this operation changed the active page's slug, redirect to the
      // new URL so the browser doesn't sit on a stale slug that no longer
      // resolves. Mirrors _handleOutlineResponse's redirect behavior.
      if (
        data &&
        data.id &&
        activeId &&
        data.id === activeId &&
        typeof data.slug === "string" &&
        previousActiveSlug !== null &&
        data.slug !== previousActiveSlug
      ) {
        globalThis.history.replaceState({}, null, data.slug);
        globalThis.dispatchEvent(new PopStateEvent("popstate"));
      }
    }, 300);
  }
  _handleRestoreNodeRevisionResponse(e) {
    const response = e && e.detail ? e.detail.response : null;
    if (!response || !response.data) {
      return;
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
      );
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update-node", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      store.toast(this.t.revisionRestored, 4000, {
        hat: "construction",
        tone: "success",
      });
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-node-revision-restored", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            source: "backend",
            data: response.data,
            raw: response,
          },
        }),
      );
    }, 300);
  }
  /**
   * Tell Page history a restore did not happen, so it can say so instead of
   * waiting. Nothing changed on the server.
   */
  _restoreNodeRevisionFailed(nodeId, hash, status) {
    store.playSound("error");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-node-revision-restore-failed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { nodeId: nodeId, hash: hash, status: status },
      }),
    );
  }
  async loadNodeRevisions(e) {
    const detail = e && e.detail ? e.detail : {};
    let nodeId = "";
    if (detail.nodeId) {
      nodeId = String(detail.nodeId);
    } else if (detail.node && detail.node.id) {
      nodeId = String(detail.node.id);
    } else if (this.activeItem && this.activeItem.id) {
      nodeId = String(this.activeItem.id);
    }
    nodeId = nodeId.trim();
    if (!nodeId) {
      return;
    }
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      MicroFrontendRegistry &&
      typeof MicroFrontendRegistry.call === "function" &&
      typeof MicroFrontendRegistry.has === "function" &&
      MicroFrontendRegistry.has("@site/listItemRevisions")
    ) {
      const params = {
        idOrSlug: nodeId,
      };
      if (typeof detail.limit !== "undefined" && detail.limit !== null) {
        params["page.limit"] = String(detail.limit);
      }
      if (typeof detail.offset !== "undefined" && detail.offset !== null) {
        params["page.offset"] = String(detail.offset);
      }
      try {
        const response = await MicroFrontendRegistry.call(
          "@site/listItemRevisions",
          params,
          null,
          null,
        );
        let status = 0;
        if (response && typeof response.status === "number") {
          status = response.status;
        } else if (response && typeof response.status === "string") {
          const parsed = parseInt(response.status, 10);
          status = Number.isNaN(parsed) ? 0 : parsed;
        }
        if (status === 0 || status === 200) {
          const responseData =
            response && response.data && typeof response.data === "object"
              ? response.data
              : null;
          if (responseData) {
            globalThis.dispatchEvent(
              new CustomEvent("haxcms-node-revisions-loaded", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                  source: "backend",
                  data: responseData,
                  raw: response,
                },
              }),
            );
            return;
          }
        }
      } catch {
        // intentionally empty
      }
    }
  }
  async loadNodeRevision(e) {
    const detail = e && e.detail ? e.detail : {};
    let nodeId = "";
    if (detail.nodeId) {
      nodeId = String(detail.nodeId);
    } else if (detail.node && detail.node.id) {
      nodeId = String(detail.node.id);
    } else if (this.activeItem && this.activeItem.id) {
      nodeId = String(this.activeItem.id);
    }
    nodeId = nodeId.trim();
    const hash = detail.hash ? String(detail.hash).trim() : "";
    if (!nodeId || !hash) {
      return;
    }
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.call !== "function" ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has("@site/getItemRevisionById")
    ) {
      return;
    }
    try {
      const response = await MicroFrontendRegistry.call(
        "@site/getItemRevisionById",
        {
          idOrSlug: nodeId,
          revisionId: hash,
        },
        null,
        null,
      );
      let status = 0;
      if (response && typeof response.status === "number") {
        status = response.status;
      } else if (response && typeof response.status === "string") {
        const parsed = parseInt(response.status, 10);
        status = Number.isNaN(parsed) ? 0 : parsed;
      }
      if (
        (status === 0 || status === 200) &&
        response &&
        response.data &&
        typeof response.data === "object"
      ) {
        globalThis.dispatchEvent(
          new CustomEvent("haxcms-node-revision-loaded", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              source: "backend",
              data: response.data,
              raw: response,
            },
          }),
        );
      }
    } catch {
      // intentionally empty
    }
  }
  /**
   * Both sides of a page history comparison in one request, through
   * @site/compareItemRevisions. The event is cancelled at once when this
   * editor takes it, so the page history knows to wait; the answer is
   * haxcms-node-revisions-compared, or haxcms-node-revisions-compare-failed
   * when the backend has no compare (older sites) or it fails, and the page
   * history then loads each version on its own.
   */
  compareNodeRevisions(e) {
    const detail = e && e.detail ? e.detail : {};
    let nodeId = "";
    if (detail.nodeId) {
      nodeId = String(detail.nodeId);
    } else if (detail.node && detail.node.id) {
      nodeId = String(detail.node.id);
    } else if (this.activeItem && this.activeItem.id) {
      nodeId = String(this.activeItem.id);
    }
    nodeId = nodeId.trim();
    const from = detail.from ? String(detail.from).trim() : "";
    const to = detail.to ? String(detail.to).trim() : "";
    if (!nodeId || !from || !to) {
      return;
    }
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    this._compareNodeRevisions(nodeId, from, to);
  }
  async _compareNodeRevisions(nodeId, from, to) {
    const failed = (status) => {
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-node-revisions-compare-failed", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: { nodeId: nodeId, from: from, to: to, status: status },
        }),
      );
    };
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.call !== "function" ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has("@site/compareItemRevisions")
    ) {
      failed(0);
      return;
    }
    try {
      const response = await MicroFrontendRegistry.call(
        "@site/compareItemRevisions",
        {
          idOrSlug: nodeId,
          revisionId: from,
          compareRevisionId: to,
        },
        null,
        null,
      );
      let status = 0;
      if (response && typeof response.status === "number") {
        status = response.status;
      } else if (response && typeof response.status === "string") {
        const parsed = parseInt(response.status, 10);
        status = Number.isNaN(parsed) ? 0 : parsed;
      }
      if (
        (status === 0 || status === 200) &&
        response &&
        response.data &&
        typeof response.data === "object"
      ) {
        globalThis.dispatchEvent(
          new CustomEvent("haxcms-node-revisions-compared", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: {
              source: "backend",
              from: from,
              to: to,
              data: response.data,
              raw: response,
            },
          }),
        );
        return;
      }
      failed(status);
    } catch {
      failed(0);
    }
  }
  async restoreNodeRevision(e) {
    const detail = e && e.detail ? e.detail : {};
    let nodeId = "";
    if (detail.nodeId) {
      nodeId = String(detail.nodeId);
    } else if (detail.node && detail.node.id) {
      nodeId = String(detail.node.id);
    } else if (this.activeItem && this.activeItem.id) {
      nodeId = String(this.activeItem.id);
    }
    nodeId = nodeId.trim();
    const hash = detail.hash ? String(detail.hash).trim() : "";
    if (!nodeId || !hash) {
      return;
    }
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.call !== "function" ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has("@site/restoreItemRevision")
    ) {
      return;
    }
    this.setProcessingVisual();
    try {
      const params = {
        idOrSlug: nodeId,
        revisionId: hash,
      };
      // optional reason, added to the commit summary by the backend
      const note =
        typeof detail.note === "string"
          ? detail.note.replace(/\s+/g, " ").trim()
          : "";
      if (note) {
        params.note = note;
      }
      const response = await MicroFrontendRegistry.call(
        "@site/restoreItemRevision",
        params,
        null,
        null,
      );
      let status = 0;
      if (response && typeof response.status === "number") {
        status = response.status;
      } else if (response && typeof response.status === "string") {
        const parsed = parseInt(response.status, 10);
        status = Number.isNaN(parsed) ? 0 : parsed;
      }
      if (
        (status === 0 || status === 200) &&
        response &&
        response.data &&
        typeof response.data === "object"
      ) {
        this._handleRestoreNodeRevisionResponse({
          detail: {
            response: response,
          },
        });
      } else {
        this._restoreNodeRevisionFailed(nodeId, hash, status);
      }
    } catch (error) {
      console.warn("Restore revision error:", error);
      this._restoreNodeRevisionFailed(nodeId, hash, 0);
    } finally {
      this.clearProcessingVisual();
    }
  }
  /**
   * Save node event
   */
  async saveNode(e) {
    if (!this.activeItem || !this.activeItem.id || !HAXStore.activeHaxBody) {
      return;
    }
    const siteName = this._siteName();
    if (!siteName) {
      store.toast(this.t.unableToSaveMissingSite, 3000, {
        fire: true,
        tone: "danger",
      });
      store.playSound("error");
      return;
    }
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

    // Serialize current DOM content (including page-break) as-is. Entity
    // normalization for attributes like title/description is handled on
    // the backend so we do not clobber freshly edited values here.
    let body = await HAXStore.activeHaxBody.haxToContent();
    const schema = await HAXStore.htmlToHaxElements(body);
    const itemId = String(this.activeItem.id);
    this.setProcessingVisual();
    await this._requestJson({
      requestId: "nodeupdateajax",
      operationName: "@site/updateContentByIdOrSlug",
      payload: {
        idOrSlug: itemId,
        site: {
          name: siteName,
        },
        body,
        schema,
        node: {
          id: itemId,
          body: body,
          schema: schema,
        },
      },
      unavailableMessage: this.t.pageSaveEndpointUnavailable,
      onSuccess: (response) => {
        this._handleNodeResponse({
          detail: {
            value: response,
          },
        });
      },
    });
  }
  /**
   * Save node event
   */

  async saveNodeDetails(e) {
    // Check platform configuration before allowing outline operations
    if (!store.platformAllows("outlineDesigner")) {
      store.toast(this.t.outlineOperationsDisabled, 3000, {
        fire: true,
        tone: "warning",
      });
      return;
    }

    const detail =
      e && e.detail && typeof e.detail === "object" ? e.detail : {};
    const itemId =
      detail && typeof detail.id === "string"
        ? detail.id.trim()
        : detail && detail.id
          ? String(detail.id).trim()
          : detail && typeof detail.idOrSlug === "string"
            ? detail.idOrSlug.trim()
            : detail && detail.idOrSlug
              ? String(detail.idOrSlug).trim()
              : "";
    if (!itemId) {
      store.toast(this.t.unableToCompleteMissingId, 3000, {
        fire: true,
        tone: "danger",
      });
      store.playSound("error");
      return;
    }
    const operation =
      detail && typeof detail.operation === "string"
        ? detail.operation.trim()
        : "";
    if (!operation) {
      store.toast(this.t.unableToCompleteMissingOperation, 3000, {
        fire: true,
        tone: "danger",
      });
      store.playSound("error");
      return;
    }

    this.setProcessingVisual();
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.call !== "function" ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has("@site/updateItem")
    ) {
      store.toast(this.t.itemUpdateEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      return;
    }
    const payload = {
      ...detail,
      idOrSlug: itemId,
    };
    if (Object.prototype.hasOwnProperty.call(payload, "id")) {
      delete payload.id;
    }
    try {
      const response = await MicroFrontendRegistry.call(
        "@site/updateItem",
        payload,
        null,
        null,
      );
      let status = 0;
      if (response && typeof response.status === "number") {
        status = response.status;
      } else if (response && typeof response.status === "string") {
        const parsed = parseInt(response.status, 10);
        status = Number.isNaN(parsed) ? 0 : parsed;
      }
      if (status === 0 || status === 200) {
        this._handleNodeDetailsResponse({
          detail: {
            response: response,
          },
        });
        return;
      }
      const message = haxcmsApiMessage(
        response,
        this.t.unableToCompleteOperationStatus.replace(
          "{status}",
          () => status,
        ),
      );
      store.toast(message, 4000, { fire: true, tone: "danger" });
      store.playSound("error");
    } catch {
      store.toast(this.t.unableToCompleteOperation, 4000, {
        fire: true,
        tone: "danger",
      });
      store.playSound("error");
    }
  }
  /**
   * Save the outline based on an event firing.
   */

  saveOutline(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast(this.t.outlineSaveEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      this._emitAdminSaveResult("@site/updateSiteOutline", false);
      return;
    }
    this.setProcessingVisual();
    // the same request as before; _requestAdminSave also tells the site
    // admin dialog how it went, so Structure shows Saving and Saved
    this._requestAdminSave({
      requestId: "outlineupdateajax",
      operationName: "@site/updateSiteOutline",
      payload: {
        site: {
          name: siteName,
        },
        items: e && e.detail ? e.detail : [],
      },
      unavailableMessage: this.t.outlineSaveEndpointUnavailable,
      // a server that never answers must not leave Structure on Saving with
      // the unsaved outline only a reload away from being lost: after
      // saveTimeout the request is aborted and the save reported as failed,
      // keeping every change. Aborting stops the browser waiting, not the
      // server: it may still finish writing the outline. The next Save then
      // sends the same outline again (the client cannot know what landed),
      // which re-applies it; pages marked new would be created a second time,
      // as after any failure the server did not report (malformed answer,
      // dropped connection).
      timeout: this.saveTimeout,
      onSuccess: (response) => {
        this._handleOutlineResponse({
          detail: {
            response,
          },
        });
      },
    });
  }
  // processing visualization
  // duration defaults to 5s for short operations; pass a larger value for
  // long-running import/export work on very large sites so the indicator
  // does not vanish mid-operation. Pair with clearProcessingVisual().
  setProcessingVisual(duration = 5000) {
    let loadingIcon = globalThis.document.createElement("simple-icon-lite");
    loadingIcon.icon = "hax:loading";
    loadingIcon.style.setProperty("--simple-icon-height", "40px");
    loadingIcon.style.setProperty("--simple-icon-width", "40px");
    loadingIcon.style.height = "150px";
    loadingIcon.style.marginLeft = "8px";
    store.toast(this.t.processing, duration, {
      hat: "construction",
      slot: loadingIcon,
      tone: "working",
    });
  }

  // dismiss the processing toast. Call this before firing a result toast
  // (success or error) so the new toast gets a fresh auto-hide timer.
  clearProcessingVisual() {
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-toast-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
  /**
   * Save the outline based on an event firing.
   */

  saveManifest(e) {
    // now let's work on the outline
    let values = e && e.detail ? e.detail : {};
    if (!values || typeof values !== "object") {
      values = {};
    }
    if (!values.manifest || typeof values.manifest !== "object") {
      values.manifest = {};
    }
    const siteName = this._siteName();
    if (!siteName) {
      store.toast(this.t.siteSaveEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      this._emitAdminSaveResult("@site/updateSiteSummary", false);
      return;
    }
    // add in our standard pieces

    if (values.site) {
      values.site.name = siteName;
    } else {
      values.site = {
        name: siteName,
      };
    }
    this.setProcessingVisual();
    this._requestAdminSave({
      requestId: "manifestupdateajax",
      operationName: "@site/updateSiteSummary",
      payload: values,
      unavailableMessage: this.t.siteSaveEndpointUnavailable,
      onSuccess: (response) => {
        this._handleManifestResponse({
          detail: {
            response,
          },
        });
      },
    });
  }

  /**
   * _requestJson for a site admin save: the same request, plus exactly one
   * haxcms-admin-save-result report with the save's final outcome.
   * - ok when onSuccess runs (the first attempt, or the retry after a token
   *   refresh)
   * - failed when the request resolves empty or throws, unless a token
   *   refresh is under way: then the retry's outcome is the save's outcome,
   *   and the shell keeps showing Saving (Save stays disabled, so nothing can
   *   be sent twice meanwhile)
   * - failed when the refresh fails, returns no token, or has not come back
   *   within saveTimeout; that request is then never sent again, so a save
   *   reported as failed cannot be applied later behind the person's back
   * options.timeout (ms) also bounds each attempt (see _callSiteOperation).
   */
  _requestAdminSave(options) {
    const operation = options.operationName;
    const onSuccess = options.onSuccess;
    let reported = false;
    let waiting = false;
    let waitTimer = null;
    let waitTarget = null;
    const stopWaiting = () => {
      clearTimeout(waitTimer);
      waitTimer = null;
      if (waitTarget) {
        this.__refreshWaitingSaves.delete(waitTarget);
      }
      waiting = false;
    };
    const report = (ok) => {
      stopWaiting();
      if (reported) {
        return;
      }
      reported = true;
      this._emitAdminSaveResult(operation, ok);
    };
    const giveUp = () => {
      if (!waitTarget || !waitTarget.__refreshPending) {
        return;
      }
      waitTarget.__abandoned = true;
      waitTarget.__refreshPending = false;
      this._clearRefreshRetryCount(waitTarget);
      report(false);
    };
    const request = this._requestJson(
      Object.assign({}, options, {
        onSuccess: (response) => {
          report(true);
          if (typeof onSuccess === "function") {
            onSuccess(response);
          }
        },
        onSettled: (response, target) => {
          if (response) {
            return;
          }
          if (target && target.__refreshPending && !reported) {
            // wait for the retry, but not forever
            stopWaiting();
            waiting = true;
            waitTarget = target;
            this.__refreshWaitingSaves.set(target, giveUp);
            const limit = this.saveTimeout > 0 ? this.saveTimeout : 60000;
            waitTimer = setTimeout(giveUp, limit);
            return;
          }
          report(false);
        },
      }),
    );
    Promise.resolve(request)
      .then((response) => {
        if (!response && !waiting) {
          report(false);
        }
      })
      .catch(() => {
        report(false);
      });
    return request;
  }

  /**
   * Tell the site admin dialog (haxcms-site-admin) how a save it sent went,
   * so it can show saved or failed and keep the person on the section.
   * Purely informational: it changes nothing about the save itself.
   */
  _emitAdminSaveResult(operation, ok) {
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-admin-save-result", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { operation: operation, ok: !!ok },
      }),
    );
  }

  async normalizeSlugs(_e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast(this.t.slugNormalizationEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      return;
    }
    this.setProcessingVisual();
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !MicroFrontendRegistry ||
      !MicroFrontendRegistry.has("@site/normalizeSiteSlugs")
    ) {
      store.toast(this.t.slugNormalizationEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      return;
    }
    try {
      const response = await MicroFrontendRegistry.call(
        "@site/normalizeSiteSlugs",
        { site: { name: siteName } },
        null,
        null,
      );
      // normalizeSiteSlugs returns {status:200, data:{changed, preview,
      // changes:[{id,title,oldSlug,newSlug}], skipped:[{...}]}}. Read the
      // changes array (not data.items, which does not exist on this payload).
      if (response && response.data && Array.isArray(response.data.changes)) {
        const changes = response.data.changes;
        store.playSound("success");
        if (changes.length > 0) {
          store.toast(
            this.t.normalizedPageSlugs.replace("{count}", () => changes.length),
            4000,
            {
              hat: "random",
              tone: "success",
            },
          );
        } else {
          store.toast(this.t.slugNormalizationCompleted, 3000, {
            hat: "random",
            tone: "success",
          });
        }
        this.dispatchEvent(
          new CustomEvent("haxcms-trigger-update", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: true,
          }),
        );
        // If the active page's slug changed, redirect to the new URL
        const activeItem = store.activeItem;
        if (activeItem && activeItem.id) {
          const updatedItem = changes.find(
            (change) => change && change.id === activeItem.id,
          );
          if (
            updatedItem &&
            updatedItem.newSlug &&
            updatedItem.newSlug !== activeItem.slug
          ) {
            globalThis.history.replaceState({}, null, updatedItem.newSlug);
            globalThis.dispatchEvent(new PopStateEvent("popstate"));
          }
        }
      } else {
        store.playSound("success");
        store.toast(this.t.slugNormalizationCompleted, 3000, {
          hat: "random",
          tone: "success",
        });
      }
    } catch (error) {
      console.warn(error);
      store.toast(this.t.slugNormalizationFailed, 3000, {
        fire: true,
        tone: "danger",
      });
      store.playSound("error");
    }
  }

  saveSEOSettings(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast(this.t.seoSaveEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      this._emitAdminSaveResult("@site/updateSiteSeo", false);
      return;
    }
    const detail = e && e.detail ? e.detail : {};
    const manifestAuthor =
      this.manifest && this.manifest.metadata && this.manifest.metadata.author
        ? this.manifest.metadata.author
        : {};
    const manifestSite =
      this.manifest && this.manifest.metadata && this.manifest.metadata.site
        ? this.manifest.metadata.site
        : {};
    const manifestSiteSettings =
      manifestSite && manifestSite.settings ? manifestSite.settings : {};
    const normalizeString = (value, fallback = "") =>
      typeof value !== typeof undefined && value !== null
        ? String(value || "")
        : fallback;
    const toBoolValue = (value, defaultValue) => {
      if (
        value === false ||
        value === "false" ||
        value === 0 ||
        value === "0"
      ) {
        return false;
      }
      if (value === true || value === "true" || value === 1 || value === "1") {
        return true;
      }
      return defaultValue;
    };
    const license =
      detail.license && detail.license !== ""
        ? String(detail.license)
        : this.manifest && this.manifest.license
          ? String(this.manifest.license)
          : "by-sa";
    const authorImage = normalizeString(
      detail.authorImage,
      manifestAuthor && manifestAuthor.image
        ? String(manifestAuthor.image)
        : "",
    );
    const authorName = normalizeString(
      detail.authorName,
      manifestAuthor && manifestAuthor.name ? String(manifestAuthor.name) : "",
    );
    const authorEmail = normalizeString(
      detail.authorEmail,
      manifestAuthor && manifestAuthor.email
        ? String(manifestAuthor.email)
        : "",
    );
    const authorSocialLink = normalizeString(
      detail.authorSocialLink,
      manifestAuthor && manifestAuthor.socialLink
        ? String(manifestAuthor.socialLink)
        : "",
    );
    const authorSocialLink2 = normalizeString(
      detail.authorSocialLink2,
      manifestAuthor && manifestAuthor.socialLink2
        ? String(manifestAuthor.socialLink2)
        : "",
    );
    const authorPhone = normalizeString(
      detail.authorPhone,
      manifestAuthor && manifestAuthor.phone
        ? String(manifestAuthor.phone)
        : "",
    );
    const authorLocation = normalizeString(
      detail.authorLocation,
      manifestAuthor && manifestAuthor.location
        ? String(manifestAuthor.location)
        : "",
    );
    const authorWebsite = normalizeString(
      detail.authorWebsite,
      manifestAuthor && manifestAuthor.website
        ? String(manifestAuthor.website)
        : "",
    );
    const authorWebsite2 = normalizeString(
      detail.authorWebsite2,
      manifestAuthor && manifestAuthor.website2
        ? String(manifestAuthor.website2)
        : "",
    );
    const description = normalizeString(
      detail.description,
      this.manifest && this.manifest.description
        ? String(this.manifest.description)
        : "",
    );
    const logo = normalizeString(
      detail.logo,
      manifestSite && manifestSite.logo ? String(manifestSite.logo) : "",
    );
    const domain = normalizeString(
      detail.domain,
      manifestSite && manifestSite.domain ? String(manifestSite.domain) : "",
    );
    const lang = normalizeString(
      detail.lang,
      manifestSiteSettings && manifestSiteSettings.lang
        ? String(manifestSiteSettings.lang)
        : "",
    );
    const gaID = normalizeString(
      detail.gaID,
      manifestSiteSettings && manifestSiteSettings.gaID
        ? String(manifestSiteSettings.gaID)
        : "",
    );
    const privateSite =
      typeof detail.private !== typeof undefined
        ? toBoolValue(detail.private, false)
        : toBoolValue(
            manifestSiteSettings ? manifestSiteSettings.private : undefined,
            false,
          );
    const canonical =
      typeof detail.canonical !== typeof undefined
        ? toBoolValue(detail.canonical, true)
        : toBoolValue(
            manifestSiteSettings ? manifestSiteSettings.canonical : undefined,
            true,
          );
    const pathauto =
      typeof detail.pathauto !== typeof undefined
        ? toBoolValue(detail.pathauto, false)
        : toBoolValue(
            manifestSiteSettings ? manifestSiteSettings.pathauto : undefined,
            false,
          );
    const publishPagesOn =
      typeof detail.publishPagesOn !== typeof undefined
        ? toBoolValue(detail.publishPagesOn, true)
        : toBoolValue(
            manifestSiteSettings
              ? manifestSiteSettings.publishPagesOn
              : undefined,
            true,
          );
    const seoValues = {
      description,
      logo,
      domain,
      lang,
      gaID,
      private: privateSite,
      canonical,
      pathauto,
      publishPagesOn,
    };
    const payload = {
      site: {
        name: siteName,
      },
      seo: seoValues,
      author: {
        license: license,
        image: authorImage,
        name: authorName,
        email: authorEmail,
        socialLink: authorSocialLink,
        socialLink2: authorSocialLink2,
        phone: authorPhone,
        location: authorLocation,
        website: authorWebsite,
        website2: authorWebsite2,
      },
      manifest: {
        author: {
          "manifest.license": license,
          "manifest.metadata.author.image": authorImage,
          "manifest.metadata.author.name": authorName,
          "manifest.metadata.author.email": authorEmail,
          "manifest.metadata.author.socialLink": authorSocialLink,
          "manifest.metadata.author.socialLink2": authorSocialLink2,
          "manifest.metadata.author.phone": authorPhone,
          "manifest.metadata.author.location": authorLocation,
          "manifest.metadata.author.website": authorWebsite,
          "manifest.metadata.author.website2": authorWebsite2,
        },
        seo: {
          "manifest.description": description,
          "manifest.metadata.site.logo": logo,
          "manifest.metadata.site.domain": domain,
          "manifest.metadata.site.settings.lang": lang,
          "manifest.metadata.site.settings.gaID": gaID,
          "manifest.metadata.site.settings.private": privateSite,
          "manifest.metadata.site.settings.canonical": canonical,
          "manifest.metadata.site.settings.pathauto": pathauto,
          "manifest.metadata.site.settings.publishPagesOn": publishPagesOn,
        },
      },
    };
    this.setProcessingVisual();
    this._requestAdminSave({
      requestId: "seoupdateajax",
      operationName: "@site/updateSiteSeo",
      payload,
      unavailableMessage: this.t.seoSaveEndpointUnavailable,
      onSuccess: (response) => {
        this._handleManifestResponse({
          detail: {
            response,
          },
        });
      },
    });
  }

  saveAppearanceSettings(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast(this.t.appearanceSaveEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      this._emitAdminSaveResult("@site/updateSiteAppearance", false);
      return;
    }
    let values = e && e.detail ? JSON.parse(JSON.stringify(e.detail)) : {};
    if (!values.manifest) {
      values.manifest = {};
    }
    if (!values.manifest.theme) {
      values.manifest.theme = {};
    }
    if (values.site) {
      values.site.name = siteName;
    } else {
      values.site = {
        name: siteName,
      };
    }
    this.setProcessingVisual();
    this._requestAdminSave({
      requestId: "appearancesettingsajax",
      operationName: "@site/updateSiteAppearance",
      payload: values,
      unavailableMessage: this.t.appearanceSaveEndpointUnavailable,
      onSuccess: (response) => {
        this._handleAppearanceSettingsResponse({
          detail: {
            response,
          },
        });
      },
    });
  }

  savePlatformSettings(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast(this.t.platformSettingsSaveEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      this._emitAdminSaveResult("@site/updateSitePlatform", false);
      return;
    }
    this.setProcessingVisual();
    this._requestAdminSave({
      requestId: "platformsettingsajax",
      operationName: "@site/updateSitePlatform",
      payload: {
        site: {
          name: siteName,
        },
        platform: e && e.detail ? e.detail : {},
      },
      unavailableMessage: this.t.platformSettingsSaveEndpointUnavailable,
      onSuccess: (response) => {
        this._handlePlatformSettingsResponse({
          detail: {
            response,
          },
        });
      },
    });
  }
  saveEditorSettings(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast(this.t.editorSettingsSaveEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      this._emitAdminSaveResult("@site/updateSiteEditorSettings", false);
      return;
    }
    const detail = e && e.detail ? JSON.parse(JSON.stringify(e.detail)) : {};
    const audience = detail && detail.audience ? String(detail.audience) : "";
    if (audience !== "novice" && audience !== "expert") {
      store.toast(this.t.editorSettingsInvalid, 3000, {
        fire: true,
        tone: "danger",
      });
      store.playSound("error");
      this._emitAdminSaveResult("@site/updateSiteEditorSettings", false);
      return;
    }
    this.setProcessingVisual();
    this._requestAdminSave({
      requestId: "editorsettingsajax",
      operationName: "@site/updateSiteEditorSettings",
      payload: {
        site: {
          name: siteName,
        },
        platform: {
          audience: audience,
        },
      },
      unavailableMessage: this.t.editorSettingsSaveEndpointUnavailable,
      onSuccess: (response) => {
        this._handleEditorSettingsResponse({
          detail: {
            response,
          },
        });
      },
    });
  }
  saveAllowedBlocks(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast(this.t.blocksSaveEndpointUnavailable, 3000, {
        fire: true,
        tone: "warning",
      });
      store.playSound("error");
      this._emitAdminSaveResult("@site/updateSiteAllowedBlocks", false);
      return;
    }
    const detail = e && e.detail ? JSON.parse(JSON.stringify(e.detail)) : {};
    const allowedBlocksDefined = detail.allowedBlocksDefined === true;
    const allowedBlocksValue = Object.prototype.hasOwnProperty.call(
      detail,
      "allowedBlocks",
    )
      ? detail.allowedBlocks
      : [];
    const platform = {};
    if (allowedBlocksDefined) {
      if (allowedBlocksValue === null) {
        platform.allowedBlocks = null;
      } else if (Array.isArray(allowedBlocksValue)) {
        platform.allowedBlocks =
          allowedBlocksValue.length === 0 ? null : allowedBlocksValue;
      } else {
        platform.allowedBlocks = null;
      }
    } else {
      platform.allowedBlocks = [];
    }
    this.setProcessingVisual();
    this._requestAdminSave({
      requestId: "allowedblocksajax",
      operationName: "@site/updateSiteAllowedBlocks",
      payload: {
        site: {
          name: siteName,
        },
        platform: platform,
      },
      unavailableMessage: this.t.blocksSaveEndpointUnavailable,
      onSuccess: (response) => {
        this._handleAllowedBlocksResponse({
          detail: {
            response,
          },
        });
      },
    });
  }
  /**
   * Notice body of content has changed and import into HAX
   */
  _bodyChanged(e) {
    if (HAXStore.activeHaxBody) {
      HAXStore.activeHaxBody.importContent(e.detail);
    }
  }
  async contentDashboardOperation(e) {
    if (!e.detail || !e.detail.operation) {
      return;
    }
    const operation = e.detail.operation;
    const ids = Array.isArray(e.detail.itemIds) ? e.detail.itemIds : [];
    if (operation === "publish" || operation === "unpublish") {
      const published = operation === "publish";
      ids.forEach((id) => {
        this.saveNodeDetails({
          detail: {
            id,
            operation: "setPublished",
            published,
          },
        });
      });
      return;
    }
    if (operation === "delete") {
      ids.forEach((id) => {
        const item = store.findItem(id);
        if (item) {
          this.deleteNode({
            detail: {
              item,
            },
          });
        }
      });
      return;
    }
    if (operation === "search" || operation === "replace") {
      const searchValue =
        e.detail &&
        typeof e.detail.search === "string" &&
        e.detail.search.trim() !== ""
          ? String(e.detail.search).trim()
          : "";
      if (!searchValue) {
        return;
      }
      this.__lastContentDashboardOperation = operation;
      this.__lastContentSearchQuery = searchValue;
      const body = {
        operation: operation,
        search: searchValue,
      };
      const siteName = this._siteName();
      if (siteName !== "") {
        body.site = {
          name: siteName,
        };
      }
      if (operation === "replace") {
        body.searchMode = "fulltext";
        body.searchSelector = false;
        body.searchField = "content";
        body.replace =
          e.detail && typeof e.detail.replace === "string"
            ? e.detail.replace
            : "";
        if (e.detail && e.detail.replaceConfirm === true) {
          body.replaceConfirm = true;
        }
        if (e.detail && e.detail.replaceDestroyConfirm === true) {
          body.replaceDestroyConfirm = true;
        }
        if (e.detail && e.detail.searchCaseSensitive === true) {
          body.searchCaseSensitive = true;
        }
        // only a chosen subset of the matched pages; absent means every
        // matching page, so the default request body is unchanged
        if (e.detail && Array.isArray(e.detail.nodeIds)) {
          body.nodeIds = e.detail.nodeIds.filter(
            (id) => typeof id === "string" && id !== "",
          );
          // the server reads an empty list as "every page"; a subset that
          // names no page must never widen into a site-wide replace
          if (body.nodeIds.length === 0) {
            return;
          }
        }
      } else {
        if (
          e.detail &&
          typeof e.detail.searchField === "string" &&
          e.detail.searchField.trim() !== ""
        ) {
          body.searchField = e.detail.searchField.trim();
        }
        const requestedSearchMode =
          e.detail &&
          typeof e.detail.searchMode === "string" &&
          e.detail.searchMode.trim() !== ""
            ? e.detail.searchMode.trim().toLowerCase()
            : "";
        const selectorMode =
          (e.detail &&
            (e.detail.searchSelector === true ||
              e.detail.searchSelector === "true" ||
              e.detail.searchSelector === 1 ||
              e.detail.searchSelector === "1")) ||
          requestedSearchMode === "selector";
        body.searchSelector = selectorMode;
        if (selectorMode) {
          body.searchMode = "selector";
          body.searchField = "content";
        } else if (requestedSearchMode) {
          body.searchMode = requestedSearchMode;
        }
        if (e.detail && e.detail.searchCaseSensitive === true) {
          body.searchCaseSensitive = true;
        }
        if (
          e.detail &&
          typeof e.detail.searchLimit !== "undefined" &&
          e.detail.searchLimit !== null &&
          e.detail.searchLimit !== ""
        ) {
          const searchLimit = parseInt(e.detail.searchLimit, 10);
          if (!isNaN(searchLimit)) {
            body.searchLimit = searchLimit;
          }
        }
      }
      let response = null;
      if (operation === "replace") {
        response = await this._requestJson({
          requestId: "contentsearchajax",
          operationName: "@site/replaceContent",
          payload: body,
          unavailableMessage: this.t.contentReplaceEndpointUnavailable,
          onSuccess: (responseData) => {
            this._handleContentSearchResponse({
              detail: {
                response: responseData,
              },
            });
          },
        });
      } else {
        const searchPayload = {
          q: searchValue,
        };
        if (
          e.detail &&
          typeof e.detail.searchField === "string" &&
          e.detail.searchField.trim() !== ""
        ) {
          const searchField = e.detail.searchField.trim();
          if (searchField !== "all") {
            searchPayload.fields = searchField;
          }
        }
        if (body.searchMode === "selector") {
          searchPayload.fields = "content";
        }
        if (
          typeof body.searchLimit === "number" &&
          !Number.isNaN(body.searchLimit) &&
          body.searchLimit > 0
        ) {
          searchPayload["page.limit"] = body.searchLimit;
        }
        response = await this._requestJson({
          requestId: "contentsearchajax",
          operationName: "@site/searchContent",
          payload: searchPayload,
          unavailableMessage: this.t.contentSearchEndpointUnavailable,
          onSuccess: (responseData) => {
            this._handleContentSearchResponse({
              detail: {
                response: responseData,
              },
            });
          },
        });
      }
      if (response) {
        return;
      }
      globalThis.dispatchEvent(
        new CustomEvent(
          operation === "replace"
            ? "haxcms-content-dashboard-replace"
            : "haxcms-content-dashboard-search",
          {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: e.detail,
          },
        ),
      );
    }
  }
  filesDashboardOperation(e) {
    if (!e.detail || !e.detail.operation) {
      return;
    }
    if (e.detail.operation === "upload") {
      store.toast(this.t.useUploadWorkflow, 3000, {
        hat: "construction",
      });
      return;
    }
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-files-dashboard-operation-request", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: e.detail,
      }),
    );
  }
}

globalThis.customElements.define(HAXCMSSiteEditor.tag, HAXCMSSiteEditor);
export { HAXCMSSiteEditor };
