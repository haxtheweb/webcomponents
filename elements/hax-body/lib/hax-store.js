import { LitElement, html } from "lit-element/lit-element.js";
import { SimpleTourManager } from "@lrnwebcomponents/simple-popover/lib/simple-tour.js";
import {
  winEventsElement,
  getRange,
  stripMSWord,
  nodeToHaxElement,
  haxElementToNode,
  validURL,
  camelToDash,
} from "@lrnwebcomponents/utils/utils.js";
import {
  observable,
  makeObservable,
  computed,
  configure,
  autorun,
  toJS,
} from "mobx";
configure({ enforceActions: false }); // strict mode off
import { HAXElement } from "@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";
/**
 * @element hax-store
 */
class HaxStore extends winEventsElement(HAXElement(LitElement)) {
  /**
   * test a hook's existance in a target
   */
  testHook(el, op) {
    return el && typeof el.haxHooks === "function" && el.haxHooks()[op];
  }
  /**
   * run a hook in a target if it exists
   */
  runHook(el, op, data = []) {
    if (this.testHook(el, op)) {
      return el[el.haxHooks()[op]](...data);
    }
    return false;
  }
  /**
   * Selection normalizer
   */
  getSelection() {
    // try and obtain the selection from the nearest shadow
    // which would give us the selection object when running native ShadowDOM
    // with fallback support for the entire window which would imply Shady
    if (this.activeHaxBody && this.activeHaxBody.parentNode) {
      // native API
      if (this.activeHaxBody.parentNode.getSelection) {
        return this.activeHaxBody.parentNode.getSelection();
      }
      // ponyfill from google
      else if (getRange(this.activeHaxBody.parentNode)) {
        return getRange(this.activeHaxBody.parentNode);
      }
    }
    // missed on both, hope the normal one will work
    return window.getSelection();
  }
  /**
   * Get a normalized range based on current selection
   */
  getRange() {
    let sel = this.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else false;
  }
  /**
   * Try and guess the Gizmo based on what we were just handed
   */
  guessGizmo(guess, values, skipPropMatch = false, preferExclusive = false) {
    var matches = [];
    if (typeof guess !== typeof undefined) {
      // verify type
      if (this.validGizmoTypes.includes(guess)) {
        // now we can look through them
        // look for a match
        for (var gizmoposition in this.gizmoList) {
          let gizmo = this.gizmoList[gizmoposition];
          let props = {};
          // reset match per gizmo
          let match = false;
          // ensure this gizmo can handle things
          if (gizmo && gizmo.handles) {
            for (var i = 0; i < gizmo.handles.length; i++) {
              // WHAT!??!?!?!?!
              if (
                guess === gizmo.handles[i].type ||
                (guess === "*" && !match)
              ) {
                for (var property in gizmo.handles[i]) {
                  // ignore type.. but again.. WHAT?!?!?!
                  if (property !== "type") {
                    // check the values that came across to see if there's a match
                    // of any kind, we only need one but can then bind to multiple
                    if (typeof values[property] !== typeof undefined) {
                      // but ensure there's either no meta data OR
                      // the meta data needs to NOT say anythinig about hiding
                      if (
                        guess === "inline" ||
                        !gizmo.meta ||
                        (gizmo.meta &&
                          !gizmo.meta.inlineOnly &&
                          !gizmo.meta.hidden)
                      ) {
                        match = true;
                        props[gizmo.handles[i][property]] = values[property];
                      }
                    }
                  }
                }
                // omg... we just found a match on a property from who knows where!
                if (match || skipPropMatch) {
                  if (preferExclusive && gizmo.handles[i].type_exclusive) {
                    return [this.haxElementPrototype(gizmo, props, "")];
                  } else {
                    matches.push(this.haxElementPrototype(gizmo, props, ""));
                  }
                }
              }
            }
          }
        }
      }
    }
    return matches;
  }
  /**
   * Simple workflow for logic from inserting based on
   * a series of criteria.
   */
  insertLogicFromValues(values, context, failOnAnything = false) {
    // we have no clue what this is.. let's try and guess..
    let type = this.guessGizmoType(values);
    let typeName = type;
    // we want to simplify insert but if we get wildcard... do whatever
    let preferExclusive = true;
    if (type == "*") {
      // allow for logic to bail completely if we are told to
      if (failOnAnything) {
        return false;
      }
      preferExclusive = false;
      typeName = "link";
    }
    let haxElements = this.guessGizmo(type, values, false, preferExclusive);
    // see if we got anything
    if (haxElements.length > 0) {
      if (haxElements.length === 1) {
        if (typeof haxElements[0].tag !== typeof undefined) {
          context.dispatchEvent(
            new CustomEvent("hax-insert-content", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: haxElements[0],
            })
          );
        }
      } else {
        // hand off to hax-app-picker to deal with the rest of this
        this.haxAppPicker.presentOptions(
          haxElements,
          type,
          "Pick how to present this " + typeName,
          "gizmo"
        );
      }
      return true;
    } else {
      this.toast(
        "Sorry, HAX doesn't know how to handle that type of link yet."
      );
      return false;
    }
  }
  /**
   * write to the store and communicate to all pieces
   */
  write(prop, value, obj) {
    if (obj) {
      obj.dispatchEvent(
        new CustomEvent("hax-store-write", {
          composed: true,
          bubbles: true,
          cancelable: false,
          detail: { property: prop, value: value, owner: obj },
        })
      );
    }
  }
  /**
   * Convert a data mime type to gizmo type for rendering
   */
  mimeTypeToGizmoType(mime) {
    let parts = mime.split("/");
    switch (parts[0]) {
      case "audio":
        return "audio";
        break;
      case "image":
        if (parts[1] == "svg+xml") {
          return "svg";
        }
        return "image";
        break;
      case "video":
        return "video";
        break;
      case "text":
        if (["csv", "html", "markdown"].includes(parts[1])) {
          return parts[1];
        }
        return "document";
        break;
      case "application":
        if (parts[1] == "pdf") {
          return "pdf";
        }
        if (["zip", "gzip", "x-tar"].includes(parts[1])) {
          return "archive";
        }
        return "document";
        break;
    }
  }
  /**
   * Guess the type of Gizmo when given some information about what we have.
   */
  guessGizmoType(guess) {
    if (typeof guess.source !== typeof undefined) {
      const source = guess.source.toLowerCase();
      if (
        source.indexOf(".mp3") != -1 ||
        source.indexOf(".midi") != -1 ||
        source.indexOf(".mid") != -1
      ) {
        return "audio";
      } else if (
        source.indexOf(".png") != -1 ||
        source.indexOf(".jpg") != -1 ||
        source.indexOf(".jpeg") != -1 ||
        source.indexOf(".gif") != -1
      ) {
        return "image";
      } else if (source.indexOf(".pdf") != -1) {
        return "pdf";
      } else if (source.indexOf(".svg") != -1) {
        return "svg";
      } else if (source.indexOf(".csv") != -1) {
        return "csv";
      } else if (source.indexOf(".md") != -1) {
        return "markdown";
      } else if (
        source.indexOf(".html") != -1 ||
        source.indexOf(".htm") != -1
      ) {
        return "html";
      } else if (
        source.indexOf(".txt") != -1 ||
        source.indexOf(".doc") != -1 ||
        source.indexOf(".docx") != -1 ||
        source.indexOf(".xls") != -1 ||
        source.indexOf(".xlsx") != -1 ||
        source.indexOf(".vtt") != -1 ||
        source.indexOf(".ppt") != -1
      ) {
        return "document";
      } else if (
        source.indexOf(".zip") != -1 ||
        source.indexOf(".tar.gz") != -1 ||
        source.indexOf(".tar") != -1
      ) {
        return "archive";
      }
      // if it's external we can't assume what it actually is
      else if (window.MediaBehaviors.Video.getVideoType(source) != "external") {
        return "video";
      }
    }
    // we don't know how to handle this so let's just
    // try ANYTHING that matches
    return "*";
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <slot></slot>
      <hal-9000
        id="hal"
        .responds-to="${this.voiceRespondsTo}"
        .debug="${this.voiceDebug}"
      ></hal-9000>
    `;
  }
  __appStoreDataChanged(e) {
    this.__appStoreData = e;
  }
  /**
   * convention
   */
  static get tag() {
    return "hax-store";
  }
  /**
   * Global toast bridge so we don't have to keep writing custom event
   */
  toast(
    message,
    duration = 2000,
    classStyle = "capsule",
    closeText = null,
    eventCallback = null
  ) {
    // gets it all the way to the top immediately
    window.dispatchEvent(
      new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: message,
          duration: duration,
          classStyle: classStyle,
          closeText: closeText,
          eventCallback: eventCallback,
        },
      })
    );
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      voiceDebug: {
        type: Boolean,
        attribute: "voice-debug",
      },
      voiceRespondsTo: {
        type: String,
        attribute: "voice-responses-to",
      },
      /**
       * skipHAXConfirmation
       */
      skipHAXConfirmation: {
        type: Boolean,
        reflect: true,
        attribute: "skip-hax-confirmation",
      },
      /**
       * Local storage bridge
       */
      storageData: {
        type: Object,
      },
      /**
       * Hax tray
       */
      haxTray: {
        type: Object,
      },
      /**
       * Hax autoloader element.
       */
      haxAutoloader: {
        type: Object,
      },
      /**
       * A list of all haxBodies that exist
       */
      haxBodies: {
        type: Array,
      },
      /**
       * An active place holder item reference. This is used
       * for inline drag and drop event detection so that we
       * know what element replace in context.
       */
      activePlaceHolder: {
        type: Object,
      },
      /**
       * The hax-body that is currently active.
       */
      activeHaxBody: {
        type: Object,
      },
      /**
       * Possible appStore endpoint for loading in things dynamically.
       */
      appStore: {
        type: Object,
      },
      /**
       * Session object bridged in from a session method of some kind
       */
      sessionObject: {
        type: Object,
      },
      /**
       * skip the exit trap to prevent losing data
       */
      skipExitTrap: {
        type: Boolean,
      },

      /**
       * Available elements keyed by tagName and with
       * their haxProperties centrally registered.
       */
      elementList: {
        type: Object,
      },
      /**
       * Available hax stax which are just re-usable templates
       */
      staxList: {
        type: Array,
      },
      /**
       * Available hax blox which are grid plate / layout elements
       */
      bloxList: {
        type: Array,
      },
      /**
       * Valid tag list, tag only and including primatives for a baseline.
       */
      validTagList: {
        type: Array,
      },
      /**
       * Valid tag list, tag only and including primatives for a baseline.
       */
      validGridTagList: {
        type: Array,
      },
      /**
       * Gizmo types which can be used to bridge apps to gizmos.
       */
      validGizmoTypes: {
        type: Array,
      },
      /**
       * Sandboxed environment test
       */
      _isSandboxed: {
        type: Boolean,
      },
      /**
       * Internal app store data property after request
       */
      __appStoreData: {
        type: Object,
      },
      __ready: {
        type: Boolean,
      },
      /**
       * Support for deploy specific rewriting for things like JWTs
       */
      connectionRewrites: {
        type: Object,
      },
    };
  }
  /**
   * Local storage data changed; callback to store this data in user storage
   */
  _storageDataChanged(newValue) {
    if (newValue && this.ready && this.__storageDataProcessed) {
      if (window.localStorage.getItem("haxConfirm")) {
        window.localStorage.setItem("haxUserData", JSON.stringify(newValue));
      } else if (window.sessionStorage.getItem("haxConfirm")) {
        window.sessionStorage.setItem("haxUserData", JSON.stringify(newValue));
      }
    }
  }
  /**
   * If this is a text node or not so we know if the inline context
   * operations are valid.
   */
  isTextElement(node) {
    let tag;
    // resolve HAXelements vs nodes
    if (node != null && node.tagName) {
      tag = node.tagName.toLowerCase();
    } else if (node != null && node.tag) {
      tag = node.tag.toLowerCase();
    }
    if (tag && this.validTagList.includes(tag)) {
      if (
        [
          "p",
          "ol",
          "ul",
          "li",
          "a",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "strike",
          "u",
          "b",
          "sub",
          "sup",
          "span",
          "i",
          "bold",
          "em",
          "strong",
          "blockquote",
          "code",
          "figure",
        ].includes(tag)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * test for being a valid grid plate, li is here because
   * nested lists make this really complicated
   */
  isGridPlateElement(node) {
    let tag;
    // resolve HAXelements vs nodes
    if (node && node.tagName) {
      tag = node.tagName.toLowerCase();
    } else if (node && node.tag) {
      tag = node.tag.toLowerCase();
    }
    if (tag && this.validGridTagList.includes(tag)) {
      return true;
    }
    return false;
  }

  /**
   * Notice _appStore changed.
   */
  _appStoreChanged(newValue, oldValue) {
    // if we have an endpoint defined, pull it
    if (
      typeof newValue !== typeof undefined &&
      newValue != null &&
      typeof oldValue !== typeof undefined
    ) {
      // support having the request or remote loading
      // depending on the integration type
      if (typeof newValue.apps === typeof undefined && this.shadowRoot) {
        this.loadAppStore();
      } else {
        // directly injected json object into the DOM
        this.__appStoreData = newValue;
      }
    }
  }

  /**
   * Load and attach items from the app store.
   */
  _loadAppStoreData(appDataResponse) {
    if (appDataResponse != null) {
      var items = {};
      // autoload elements
      if (typeof appDataResponse.autoloader !== typeof undefined) {
        // ensure the list is in the right order so we can async dynamic imports
        // regardless of if its an array or object of values in the right format
        // force this to be an object
        appDataResponse.autoloader = Object.assign(
          {},
          appDataResponse.autoloader
        );
        for (var i in appDataResponse.autoloader) {
          let CEname = i;
          let CEimport = appDataResponse.autoloader[i];
          // helps support array or object based app store spec
          // array was originally in the standard so this lets us support both
          if (!isNaN(CEname)) {
            CEname = appDataResponse.autoloader[i];
            CEimport = `@lrnwebcomponents/${CEname}/${CEname}.js`;
          }
          // force this into the valid tag list so early paints will
          // correctly include the tag without filtering it out incorrectly
          this.validTagList.push(CEname);
          items[CEname] = CEimport;
        }
      }
      // load apps automatically
      if (typeof appDataResponse.apps !== typeof undefined) {
        var apps = appDataResponse.apps;
        for (var i = 0; i < apps.length; i++) {
          let app = document.createElement("hax-app");
          app.data = apps[i];
          this.appendChild(app);
        }
      }
      // load in stax dynamically
      if (typeof appDataResponse.stax !== typeof undefined) {
        var staxs = appDataResponse.stax;
        for (var i = 0; i < staxs.length; i++) {
          let stax = document.createElement("hax-stax");
          stax.data = staxs[i];
          this.appendChild(stax);
        }
      }
      // load in blox dynamically
      if (typeof appDataResponse.blox !== typeof undefined) {
        var bloxs = appDataResponse.blox;
        for (var i = 0; i < bloxs.length; i++) {
          let blox = document.createElement("hax-blox");
          blox.data = bloxs[i];
          this.appendChild(blox);
        }
      }
      this.dispatchEvent(
        new CustomEvent("hax-store-app-store-loaded", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true,
        })
      );
      // now process the dynamic imports
      this._handleDynamicImports(items, this.haxAutoloader);
    }
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  /**
   * Handle all the dynamic imports of things told to autoload
   * This ensures we get the definitions quickly as far as
   * what is a safe / valid tag above but then we import in a way
   * that allows us to correctly associate the hax schema to where
   * it came from.
   */
  async _handleDynamicImports(items, haxAutoloader) {
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    for (var i in items) {
      // try to skip an import
      if (window.customElements.get(i)) {
        if (window.customElements.get(i).haxProperties) {
          this.setHaxProperties(window.customElements.get(i).haxProperties, i);
        } else {
          // edge case of no definition
          haxAutoloader.appendChild(document.createElement(i));
        }
      } else {
        // we have to import and then respond to it being imported by checking again
        await import(`${basePath}../../../${items[i]}`)
          .then((response) => {
            // see if it imported now
            if (
              window.customElements.get(i) &&
              window.customElements.get(i).haxProperties
            ) {
              this.setHaxProperties(
                window.customElements.get(i).haxProperties,
                i
              );
            } else {
              // edge case of no definition
              haxAutoloader.appendChild(document.createElement(i));
            }
          })
          .catch((error) => {
            /* Error handling */
            console.warn(error);
            // also try putting it in the autoloader and hope for the best
            haxAutoloader.appendChild(document.createElement(i));
          });
      }
    }
  }
  _editModeChanged(newValue) {
    if (this.__hal) {
      if (newValue && this.globalPreferences.haxVoiceCommands) {
        this.__hal.auto = true;
      } else {
        this.__hal.auto = false;
      }
    }
  }
  _globalPreferencesChanged(newValue) {
    // regardless of what it is, reflect it globally but only after setup
    if (
      this.__storageDataProcessed &&
      newValue &&
      typeof newValue.haxVoiceCommands !== typeof undefined &&
      this.ready
    ) {
      let storageData = this.storageData;
      storageData.globalPreferences = newValue;
      this.storageData = storageData;
      this._storageDataChanged(this.storageData);
      if (newValue.haxVoiceCommands && this.editMode && this.__hal) {
        this.__hal.auto = true;
      } else {
        this.__hal.auto = false;
      }
    }
  }
  /**
   * A handful of context operations need to bubble up to the top
   * because we don't know where they originate from
   */
  _haxContextOperation(e) {
    let detail = e.detail;
    if (this.activeNode) {
      let changed = false;
      // support a simple insert event to bubble up or everything else
      switch (detail.eventName) {
        // directional / proportion operations
        case "hax-align-left":
          this.activeNode.style.float = null;
          this.activeNode.style.margin = null;
          this.activeNode.style.display = null;
          changed = true;
          break;
        case "hax-align-center":
          this.activeNode.style.float = null;
          this.activeNode.style.margin = "0 auto";
          this.activeNode.style.display = "block";
          changed = true;
          break;
        case "hax-align-right":
          this.activeNode.style.float = "right";
          this.activeNode.style.margin = "0 auto";
          this.activeNode.style.display = "block";
          changed = true;
          break;
        case "hax-size-change":
          if (detail.value == 100) {
            this.activeNode.style.width = null;
          } else {
            this.activeNode.style.width = detail.value + "%";
          }
          changed = true;
          break;
      }
      if (changed) {
        setTimeout(() => {
          this.activeHaxBody.positionContextMenus();
        }, 0);
      }
    }
  }
  /**
   * This only send if they consented to storage of data locally
   */
  _haxConsentTap(e) {
    // store for future local storage usage
    window.localStorage.setItem("haxConfirm", true);
    // most likely nothing but set it anyway
    window.localStorage.setItem(
      "haxUserData",
      JSON.stringify(this.storageData)
    );
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "appStore") {
        this._appStoreChanged(this[propName], oldValue);
      }
      // composite obervation
      if (
        ["__ready", "__appStoreData", "haxAutoloader"].includes(propName) &&
        this.__ready &&
        this.__appStoreData
      ) {
        this._loadAppStoreData(this.__appStoreData);
      }
      if (["haxAutoloader", "activeHaxBody", "haxTray"].includes(propName)) {
        // allow this to verify if everything is here or not
        clearTimeout(this.__storeReady);
        this.__storeReady = setTimeout(() => {
          this._storePiecesAllHere(
            this.haxAutoloader,
            this.activeHaxBody,
            this.haxTray,
            this.haxExport
          );
        }, 0);
      }
    });
  }
  _calculateActiveGizmo(activeNode) {
    if (activeNode == null || !activeNode.tagName) {
      return null;
    }
    for (var gizmoposition in this.gizmoList) {
      var gizmo = this.gizmoList[gizmoposition];
      if (gizmo.tag === activeNode.tagName.toLowerCase()) {
        return gizmo;
      }
    }
  }
  /**
   * generate appstore query
   */
  loadAppStore() {
    const searchParams = new URLSearchParams(this.appStore.params);
    let url = this.appStore.url;
    if (searchParams) {
      url += `?${searchParams}`;
    }
    fetch(url, {
      method: this.method,
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((json) => {
        this.__appStoreDataChanged(json);
      });
  }
  /**
   * ready life cycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // import voice command stuff in the background
    // @todo only activate if the setting to use it is in place
    import("@lrnwebcomponents/hal-9000/hal-9000.js").then((esModule) => {
      this.__hal = this.shadowRoot.querySelector("#hal");
    });
    // set this global flag so we know it's safe to start trusting data
    // that is written to global preferences / storage bin
    setTimeout(() => {
      this.__storageDataProcessed = true;
      if (this.storageData.globalPreferences) {
        this.write(
          "globalPreferences",
          this.storageData.globalPreferences,
          this
        );
      }
    }, 100);

    // see if a global was used to prevent this check
    // this is useful when in trusted environments where the statement
    // has been consented to in the application this is utilized in
    if (this.skipHAXConfirmation) {
      window.sessionStorage.setItem("haxConfirm", true);
      window.localStorage.setItem("haxConfirm", true);
    }
    // check for local storage object
    // if not, then store it in sessionStorage so that all our checks
    // and balances are the same. This could allow for storing these
    // settings on a server in theory
    let haxConfirm =
      window.sessionStorage.getItem("haxConfirm") ||
      window.localStorage.getItem("haxConfirm");
    if (!haxConfirm) {
      // this way it isn't shown EVERY reload, but if they didn't confirm
      // it will show up in the future
      window.sessionStorage.setItem("haxConfirm", true);
      let msg = `
    The HAX content editor keeps preferences in order to improve your experience.
    This data is stored in your browser and is never sent anywhere.
    Click to accept.
    `;
      this.toast(msg, "-1", "fit-bottom", "I Accept", "hax-consent-tap");
    } else {
      if (
        window.sessionStorage.getItem("haxConfirm") &&
        !window.localStorage.getItem("haxConfirm")
      ) {
        // verify there is something there
        try {
          let globalData = window.sessionStorage.getItem("haxUserData")
            ? JSON.parse(window.sessionStorage.getItem("haxUserData"))
            : {};
          this.storageData = globalData;
          this._storageDataChanged(this.storageData);
        } catch (e) {}
      } else {
        try {
          let globalData = window.localStorage.getItem("haxUserData")
            ? JSON.parse(window.localStorage.getItem("haxUserData"))
            : {};
          this.storageData = globalData;
          this._storageDataChanged(this.storageData);
        } catch (e) {}
      }
    }
  }
  _storePiecesAllHere(haxAutoloader, activeHaxBody, haxTray, haxExport) {
    if (
      !this.__ready &&
      activeHaxBody &&
      haxAutoloader &&
      haxTray &&
      haxExport
    ) {
      // send that hax store is ready to go so now we can setup the rest
      this.dispatchEvent(
        new CustomEvent("hax-store-ready", {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: true,
        })
      );
      this.ready = true;
      // associate the export button in the tray to the dialog
      HAXStore.haxExport.shadowRoot
        .querySelector("#dialog")
        .associateEvents(haxTray.shadowRoot.querySelector("#exportbtn"));
      this.__ready = true;
      // register built in primitive definitions
      this._buildPrimitiveDefinitions();
      // initialize voice commands
      this._initVoiceCommands();
      this.__hal.commands = { ...this.voiceCommands };
    }
  }
  /**
   * Build a list of common voice commands
   */
  _initVoiceCommands() {
    this.__voiceInit = true;
    this.voiceCommands[`scroll up ${this.voiceRespondsTo}`] = () => {
      window.scrollBy({
        top: -(window.innerHeight * 0.5),
        left: 0,
        behavior: "smooth",
      });
    };
    this.voiceCommands[`scroll (down) ${this.voiceRespondsTo}`] = () => {
      window.scrollBy({
        top: window.innerHeight * 0.5,
        left: 0,
        behavior: "smooth",
      });
    };
    this.voiceCommands[`scroll to bottom ${this.voiceRespondsTo}`] = () => {
      window.scrollTo(0, document.body.scrollHeight);
    };
    this.voiceCommands[`scroll to top ${this.voiceRespondsTo}`] = () => {
      window.scrollTo(0, 0);
    };
    /**
     * Support for focusing active content and typing in it
     */
    this.voiceCommands[
      `${this.voiceRespondsTo} (show)(focus) active (element)(content)`
    ] = () => {
      try {
        this._positionCursorInNode(this.activeNode);
      } catch (e) {}
    };
    this.voiceCommands[
      `${this.voiceRespondsTo} (focus) previous (element)(content)`
    ] = () => {
      if (this.activeNode.previousElementSibling) {
        this.activeNode = this.activeNode.previousElementSibling;
        this.write("activeNode", this.activeNode, this);
        this._positionCursorInNode(this.activeNode);
      } else {
        this.speak("You are at the top of the document");
      }
    };
    this.voiceCommands[
      `${this.voiceRespondsTo} (focus) next (element)(content)`
    ] = () => {
      if (this.activeNode.nextElementSibling) {
        this.activeNode = this.activeNode.nextElementSibling;
        this.write("activeNode", this.activeNode, this);
        this._positionCursorInNode(this.activeNode);
      } else {
        this.speak("You are at the bottom of the document");
      }
    };
    this.voiceCommands[`${this.voiceRespondsTo} type *mycontent`] = (e) => {
      if (this.isTextElement(this.activeNode)) {
        try {
          let range = this._positionCursorInNode(this.activeNode);
          let text = document.createTextNode(e);
          range.deleteContents();
          range.insertNode(text);
        } catch (e) {
          this.speak("That didn't work");
          console.warn(e);
        }
      } else {
        this.speak(
          "I'm sorry but I can only type in text areas. Try saying Insert Paragraph and try again."
        );
      }
    };
    // trolling
    this.voiceCommands[`hey ${this.voiceRespondsTo}`] = () => {
      this.speak("Yeah what do you want");
    };
    // trolling
    this.voiceCommands[`${this.voiceRespondsTo} now your name is *splat`] = (
      text
    ) => {
      const past = this.voiceRespondsTo;
      this.speak(`I used to be named ${past} but you can call me ${text} now.`);
      this.voiceRespondsTo = `(${text})`;
      // @todo this needs to now update the previous commands somehow to match
      // the new activation name
    };
  }
  /**
   * Speak wrapper on hal to present as text too
   */
  speak(text) {
    if (this.__hal && this.__hal.speak) {
      this.__hal.speak(text);
    }
    // always show for accessibility
    this.toast(`${this.voiceRespondsTo}: ${text}`);
  }
  /**
   * allow uniform method of adding voice commands
   */
  addVoiceCommand(command, context, callback) {
    if (context) {
      command = command.replace(":name:", this.voiceRespondsTo).toLowerCase();
      this.voiceCommands[command] = context[callback].bind(context);
      if (this.__voiceInit) {
        this.__hal.commands = { ...this.voiceCommands };
      }
    }
  }
  /**
   * event driven version
   */
  _addVoiceCommand(e) {
    // without context it's almost worthless so try to fallback on where it came from
    let target = e.detail.context;
    if (!target) {
      target = e.target;
    }
    this.addVoiceCommand(e.detail.command, target, e.detail.callback);
  }
  /**
   * Position cursor at the start of the position of the requested node
   */
  _positionCursorInNode(node, position = 0) {
    this.activeHaxBody.positionContextMenus();
    var range = document.createRange();
    var sel = this.getSelection();
    range.setStart(node, position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    return range;
  }
  /**
   * Before the browser closes / changes paths, ask if they are sure they want to leave
   */
  _onBeforeUnload(e) {
    // ensure we don't leave DURING edit mode
    if (!this.skipExitTrap && this.editMode) {
      return "Are you sure you want to leave? Your work will not be saved!";
    }
  }
  /**
   * detect base64 object
   */
  isBase64(str) {
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }
  retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
    if (pasteEvent.clipboardData == false) {
      if (typeof callback == "function") {
        return callback(undefined);
      }
    }
    var items = pasteEvent.clipboardData.items;
    if (items == undefined) {
      if (typeof callback == "function") {
        return callback(undefined);
      }
    }
    for (var i = 0; i < items.length; i++) {
      // Skip content if not image
      if (items[i].type.indexOf("image") == -1) continue;
      // Retrieve image on clipboard as blob
      var blob = items[i].getAsFile();

      if (typeof callback == "function") {
        return callback(blob);
      }
    }
  }
  /**
   * Intercept paste event and clean it up before inserting the contents
   */
  _onPaste(e) {
    if (
      this.editMode &&
      document.activeElement.tagName !== "HAX-TRAY" &&
      document.activeElement.tagName !== "BODY" &&
      document.activeElement.tagName !== "SIMPLE-MODAL"
    ) {
      // only perform this on a text element that is active
      // otherwise inject a P so we can paste into it
      if (this.isTextElement(this.activeNode)) {
      } else {
        this.activeNode = this.activeHaxBody.haxInsert("p", "", {});
      }
      let pasteContent = "";
      let originalContent = "";
      // intercept paste event
      if (e.clipboardData || e.originalEvent.clipboardData) {
        pasteContent = (e.originalEvent || e).clipboardData.getData(
          "text/html"
        );
        // if it is purely plain text it could fail to come across as HTML and be empty
        if (pasteContent == "") {
          pasteContent = (e.originalEvent || e).clipboardData.getData("text");
        }
      } else if (window.clipboardData) {
        pasteContent = window.clipboardData.getData("Text");
      }
      originalContent = pasteContent;
      // look for base64 like copy and paste of an image from clipboard
      if (this.isBase64(originalContent)) {
        // stop normal paste
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return this.retrieveImageFromClipboardAsBlob(e, (imageBlob) => {
          // If there's an image, display it in the canvas
          if (imageBlob) {
            // Crossbrowser support for URL
            var URLObj = window.URL || window.webkitURL;
            let img = document.createElement("img");
            // turn blob into a url to visualize locally, this is just temporary
            img.src = URLObj.createObjectURL(imageBlob);
            this.activeNode.parentNode.insertBefore(
              img,
              this.activeNode.nextElementSibling
            );
            for (var i in e.clipboardData.items) {
              // generate a file name if one doesn't exist
              if (
                !e.clipboardData.items[i].name &&
                e.clipboardData.items[i].type
              ) {
                e.clipboardData.items[i].name =
                  "image-" +
                  Math.floor(Date.now() / 1000) +
                  e.clipboardData.items[i].type.replace("image/", ".");
              }
            }
            // cannot believe this actually works
            e.dataTransfer = e.clipboardData;
            // refernece of what to replace; this way while uploading, we still see
            // what we pasted and it's in place. It'll gracefully switch over to the
            // real file reference once it finishes uploading
            e.placeHolderElement = img;
            // fire this specialized event up so things like HAX can intercept
            this.dispatchEvent(
              new CustomEvent("place-holder-file-drop", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: e,
              })
            );
            return img;
          }
          return false;
        });
      }
      // we have a "file" paste
      else if (e.clipboardData.files.length > 0) {
        // stop normal paste
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // generate a place holder p tag to replace on upload
        let p = this.activeHaxBody.haxInsert("p", "", {});
        // cannot believe this actually works
        e.dataTransfer = e.clipboardData;
        for (var i in e.clipboardData.files) {
          // generate a file name if one doesn't exist
          if (!e.clipboardData.files[i].name && e.clipboardData.files[i].type) {
            e.clipboardData.files[i].name =
              "image-" +
              Math.floor(Date.now() / 1000) +
              e.clipboardData.files[i].type.replace("image/", ".");
          }
        }
        // refernece of what to replace; this way while uploading, we still see
        // what we pasted and it's in place. It'll gracefully switch over to the
        // real file reference once it finishes uploading
        e.placeHolderElement = p;
        // fire this specialized event up so things like HAX can intercept
        this.dispatchEvent(
          new CustomEvent("place-holder-file-drop", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: e,
          })
        );
      }
      // detect word garbage
      let inlinePaste = false;
      // the string to import as sanitized by hax
      let newContent = "";
      // clear empty span tags that can pop up
      pasteContent = pasteContent.replace(/<span>\s*?<\/span>/g, " ");
      // clean up div tags that can come in from contenteditable pastes
      // p tags make more sense in the content area
      pasteContent = pasteContent.replace(/<div/g, "<p");
      pasteContent = pasteContent.replace(/<\/div>/g, "</p>");
      // NOW we can safely handle paste from word cases
      pasteContent = stripMSWord(pasteContent);
      // edges that some things preserve empty white space needlessly
      let haxElements = this.htmlToHaxElements(pasteContent);
      // if interpretation as HTML fails then let's ignore this whole thing
      // as we allow normal contenteditable to handle the paste
      // we only worry about HTML structures
      if (haxElements.length === 0 && validURL(pasteContent)) {
        // ONLY use this logic if we're on an empty container
        if (this.activeNode.innerText.trim() != "") {
          return false;
        }
        // test for a URL since we didn't have HTML / elements of some kind
        // if it's a URL we might be able to automatically convert it into it's own element
        let values = {
          source: pasteContent,
          title: pasteContent,
        };
        // if we DID get a match, block default values
        if (!this.insertLogicFromValues(values, this)) {
          // prevents the text being inserted previously so that the insertLogic does it
          // for us. false only is returned if we didn't do anthing in this function
          return false;
        }
      } else if (haxElements.length === 0) {
        inlinePaste = true;
        // wrap in a paragraph tag if there is any this ensures it correctly imports
        // as it might not have evaluated above as having elements bc of the scrubber
        if (originalContent != pasteContent) {
          newContent = pasteContent;
        } else {
          return false;
        }
      }
      // account for incredibly basic pastes of single groups of characters
      else if (haxElements.length === 1 && haxElements[0].tag === "p") {
        newContent = pasteContent;
        inlinePaste = true;
      }
      // account for incredibly basic pastes of single groups of characters
      else if (
        haxElements.length === 1 &&
        haxElements[0].tag === "a" &&
        haxElements[0].properties.href
      ) {
        // ONLY use this logic if we're on an empty container
        if (this.activeNode.innerText.trim() != "") {
          newContent = haxElements[0].properties.href;
          inlinePaste = true;
        } else {
          // test for a URL since we didn't have HTML / elements of some kind
          // if it's a URL we might be able to automatically convert it into it's own element
          let values = {
            source: haxElements[0].properties.href,
            title: haxElements[0].content,
          };
          // if we DID get a match, block default values
          if (!this.insertLogicFromValues(values, this)) {
            return false;
          }
        }
      }
      // account for broken pastes in resolution, just let browser handle it
      else if (!this.isGridPlateElement(haxElements[0])) {
        return false;
      } else {
        for (var i in haxElements) {
          // special support for pasting into a list of items
          if (
            haxElements[i].tag == "p" &&
            ["li", "ol", "ul"].includes(this.activeNode.tagName.toLowerCase())
          ) {
            haxElements[i].tag = "li";
          }
          // special traps for word / other styles bleeding through
          delete haxElements[i].properties.style;
          delete haxElements[i].properties.start;
          delete haxElements[i].properties.align;
          // this is not the right function.
          let node = haxElementToNode({
            tag: haxElements[i].tag,
            content: haxElements[i].content
              .replace(/<span>&nbsp;<\/span>/g, " ")
              .trim(),
            properties: haxElements[i].properties,
          });
          newContent += this.nodeToContent(node);
        }
      }
      // if we got here then we have HTML structures to pull together
      // this ensures that the below works out
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      try {
        // get the range that's active and selection
        let range = this.getRange();
        let sel = this.getSelection();
        // tee up a wrapper so we can walk and put every element in
        let newNodes = document.createElement("div");
        // defined so that we can
        newNodes.innerHTML = newContent;
        if (range && sel) {
          for (var i in newNodes.children) {
            // delete nodes that are empty text elements
            if (
              newNodes.children[i].tagName &&
              this.isTextElement(newNodes.children[i]) &&
              newNodes.children[i].innerHTML === ""
            ) {
              newNodes.children[i].remove();
            }
          }
          if (inlinePaste) {
            let txt = document.createTextNode(newNodes.innerHTML);
            range.insertNode(txt);
            setTimeout(() => {
              this._positionCursorInNode(txt, txt.length);
            }, 0);
          } else {
            var _enterSplit, activeEl, siblingEl;
            // only insert a P if we are splitting something
            if (
              this.activeNode.innerText.trim() != "" &&
              range.endOffset != this.activeNode.innerText.length
            ) {
              _enterSplit = true;
              document.execCommand("insertParagraph");
            }
            // sanity check and then insert our new paste node right AFTER the thing we are pasting in the middle of
            // this hopefully captures complex HTML pastes and inserts them in a logical way
            if (
              range.commonAncestorContainer &&
              range.commonAncestorContainer.parentNode
            ) {
              if (
                !siblingEl &&
                this.activeNode != range.commonAncestorContainer
              ) {
                siblingEl = range.commonAncestorContainer.parentNode;
                if (!siblingEl) {
                  siblingEl = range.commonAncestorContainer;
                }
              }
            }
            while (newNodes.firstElementChild) {
              activeEl = newNodes.firstElementChild;
              // should always be there but just in case there was no range
              // so we avoid an infinite loop
              if (siblingEl) {
                // account for a potential textnode
                if (siblingEl.getAttribute && siblingEl.getAttribute("slot")) {
                  activeEl.setAttribute("slot", siblingEl.getAttribute("slot"));
                }
                // if we split an item at the very front with the enter key
                // and we are pasting in complex content then we need to
                // make sure that we move things AHEAD of what will be moved down
                if (_enterSplit) {
                  this.activeHaxBody.haxReplaceNode(
                    siblingEl.previousElementSibling,
                    activeEl
                  );
                  _enterSplit = false;
                } else {
                  siblingEl.parentNode.insertBefore(
                    activeEl,
                    siblingEl.nextElementSibling
                  );
                }
              }
              // attempt insert after active
              else if (this.activeNode) {
                if (this.activeNode.getAttribute("slot")) {
                  activeEl.setAttribute(
                    "slot",
                    this.activeNode.getAttribute("slot")
                  );
                }
                // if we have an empty element we are hitting paste on
                // then leverage it for the 1st item as opposed to making a new line
                if (this.activeNode.innerText.trim() == "") {
                  this.activeHaxBody.haxReplaceNode(this.activeNode, activeEl);
                } else {
                  this.activeNode.parentNode.insertBefore(
                    activeEl,
                    this.activeNode.nextElementSibling
                  );
                }
              }
              // shouldn't be possible but just to be safe
              else {
                this.activeHaxBody.appendChild(activeEl);
              }
              siblingEl = activeEl;
            }
            setTimeout(() => {
              if (activeEl && activeEl.childNodes && activeEl.childNodes[0]) {
                this._positionCursorInNode(
                  activeEl.childNodes[0],
                  activeEl.childNodes[0].length
                );
                activeEl = null;
                siblingEl = null;
              }
            }, 0);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }
  // HTML primatives which are valid grid plate elements
  __validGridTags() {
    return [
      "p",
      "ol",
      "ul",
      "li",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "figure",
    ];
  }
  // internal list of HTML primatives which are valid
  __validTags() {
    return [
      "p",
      "div",
      "span",
      "table",
      "caption",
      "sup",
      "sub",
      "u",
      "strike",
      "tr",
      "th",
      "td",
      "ol",
      "ul",
      "li",
      "a",
      "strong",
      "kbd",
      "tt",
      "em",
      "i",
      "b",
      "hr",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "figure",
      "img",
      "iframe",
      "video",
      "audio",
      "section",
      "grid-plate",
      "template",
      "webview",
    ];
  }
  /**
   * Types that we deem as valid
   */
  __validGizmoTypes() {
    return [
      "data",
      "video",
      "audio",
      "text",
      "link",
      "file",
      "pdf",
      "image",
      "csv",
      "doc",
      "archive",
      "markdown",
      "html",
      "wikipedia",
      "content",
      "text",
      "inline",
      "*",
    ];
  }
  /**
   * Created life-cycle to ensure a single global store.
   */
  constructor() {
    super();
    this.method = "GET";
    this.haxSelectedText = "";
    this.__winEvents = {
      "hax-register-properties": "_haxStoreRegisterProperties",
      "hax-consent-tap": "_haxConsentTap",
      "hax-context-item-selected": "_haxContextOperation",
      onbeforeunload: "_onBeforeUnload",
      paste: "_onPaste",
      "hax-register-app": "_haxStoreRegisterApp",
      "hax-register-stax": "_haxStoreRegisterStax",
      "hax-register-blox": "_haxStoreRegisterBlox",
      "hax-store-write": "_writeHaxStore",
      "hax-register-core-piece": "_haxStorePieceRegistrationManager",
      "hax-register-body": "_haxStoreRegisterBody",
      "hax-insert-content": "_haxStoreInsertContent",
      "hax-insert-content-array": "_haxStoreInsertMultiple",
      "hax-add-voice-command": "_addVoiceCommand",
    };
    // establish the tour
    SimpleTourManager.registerNewTour({
      key: "hax",
      name: "Let's learn HAX",
      style: `
      simple-popover-manager::part(simple-popover) {
        max-width: 250px;
      }
      simple-popover-manager button {
        font-size: 12px;
        margin: 0px 2px;
      }
      simple-popover-manager p {
        --hax-base-styles-p-font-size: 14px;
        padding: 0;
        margin: 0;
        font-size: 14px;
        line-height: 20px;
      }
      simple-popover-manager h3 {
        --hax-base-styles-h3-font-size: 18px;
        margin: 8px 2px;
      }`,
    });
    this.voiceRespondsTo = "(worker)";
    this.voiceCommands = {};
    this.skipHAXConfirmation = false;
    this.storageData = {};
    this.appStore = {
      url: "",
      params: {},
    };
    this.activeNode = null;
    this.haxBodies = [];
    this.activePlaceHolder = null;
    this.sessionObject = {};
    this.editMode = false;
    this.skipExitTrap = false;
    this.elementList = {};
    this.appList = [];
    this.gizmoList = [];
    this.staxList = [];
    this.bloxList = [];
    this.globalPreferences = {};
    this.activeApp = {};
    this.connectionRewrites = {};
    // change this in order to debug voice commands
    this.voiceDebug = false;
    this.validTagList = this.__validTags();
    this.validGridTagList = this.__validGridTags();
    this.validGizmoTypes = this.__validGizmoTypes();
    // test for sandboxed env
    let test = document.createElement("webview");
    this._isSandboxed = typeof test.reload === "function";
    // imports app, blox, stax definitions
    import("./hax-app.js");
    import("@lrnwebcomponents/simple-toast/simple-toast.js").then(() => {
      window.SimpleToast.requestAvailability();
    });

    import("@lrnwebcomponents/media-behaviors/media-behaviors.js");
    document.body.style.setProperty("--hax-ui-headings", "#d4ff77");
    // mobx
    makeObservable(this, {
      gizmoList: observable,
      activeNode: observable,
      globalPreferences: observable,
      activeGizmo: computed,
      editMode: observable,
      appList: observable,
      activeApp: observable,
      haxSelectedText: observable,
    });
    autorun(() => {
      this._globalPreferencesChanged(toJS(this.globalPreferences));
    });
    autorun(() => {
      this._editModeChanged(toJS(this.editMode));
    });
  }
  /**
   * Build HAX property definitions for primitives that we support.
   */
  _buildPrimitiveDefinitions() {
    // sandboxes need a webview definition
    // we don't want people making them but we need to
    // know how to edit them if asked
    if (this._isSandboxed) {
      let webview = {
        type: "element",
        editingElement: "core",
        canScale: true,
        canPosition: true,
        canEditSource: true,
        settings: {
          configure: [
            {
              attribute: "src",
              title: "Source",
              description: "The URL for this video.",
              inputMethod: "textfield",
              icon: "link",
              required: true,
              validationType: "url",
            },
          ],
          advanced: [],
        },
      };
      this.setHaxProperties(webview, "webview");
    }
    let iframe = {
      type: "element",
      editingElement: "core",
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Basic iframe",
        description: "A basic iframe",
        icon: "icons:fullscreen",
        color: "blue-grey",
        groups: ["Content"],
        handles: [
          {
            type: "link",
            source: "src",
            height: "height",
            width: "width",
          },
          {
            type: "pdf",
            source: "src",
            height: "height",
            width: "width",
          },
          {
            type: "document",
            source: "src",
            height: "height",
            width: "width",
          },
          {
            type: "html",
            source: "src",
            height: "height",
            width: "width",
          },
        ],
        meta: {
          author: "W3C",
        },
      },
      settings: {
        configure: [
          {
            attribute: "src",
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url",
          },
        ],
        advanced: [
          {
            attribute: "loading",
            title: "Loading method",
            description: "Whether or not to lazy load this",
            inputMethod: "select",
            options: {
              lazy: "Load when visible",
              auto: "Automatic",
            },
          },
        ],
      },
    };
    this.setHaxProperties(iframe, "iframe");
    let img = {
      canScale: {
        min: 10,
        step: 5,
      },
      type: "element",
      editingElement: "core",
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Image",
        description: "A basic img tag",
        icon: "image:image",
        color: "blue-grey",
        groups: ["Image", "Media"],
        handles: [
          {
            type: "link",
            source: "src",
          },
          {
            type: "image",
            type_exclusive: true,
            source: "src",
            height: "height",
            width: "width",
          },
        ],
        meta: {
          author: "W3C",
        },
      },
      settings: {
        configure: [
          {
            attribute: "src",
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "haxupload",
            icon: "link",
            required: true,
            validationType: "url",
          },
          {
            attribute: "alt",
            title: "Alt text",
            description: "Useful for screen readers and improved SEO.",
            inputMethod: "alt",
            icon: "accessibility",
          },
          {
            attribute: "height",
            title: "Height",
            description:
              "height in pixels of the item. Leave blank to respond to the natural resolution",
            inputMethod: "textfield",
            icon: "icons:swap-vert",
          },
        ],
        advanced: [
          {
            attribute: "aria-describedby",
            title: "Aria-describedby",
            description:
              "Space-separated list of IDs for elements that describe the image.",
            inputMethod: "textfield",
            icon: "accessibility",
          },
          {
            attribute: "loading",
            title: "Loading method",
            description: "Whether or not to lazy load this",
            inputMethod: "select",
            options: {
              lazy: "Load when visible",
              auto: "Automatic",
            },
          },
        ],
      },
    };
    this.setHaxProperties(img, "img");
    let ahref = {
      type: "element",
      editingElement: "core",
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Basic link",
        description: "A basic a tag",
        icon: "icons:link",
        color: "blue-grey",
        groups: ["Link"],
        handles: [],
        meta: {
          author: "W3C",
        },
      },
      settings: {
        configure: [
          {
            attribute: "innerText",
            title: "Text",
            description: "Text of the link",
            inputMethod: "textfield",
            required: true,
          },
          {
            attribute: "href",
            title: "Link",
            description: "The URL for this video.",
            inputMethod: "haxupload",
            icon: "icons:link",
            required: true,
            validationType: "url",
          },
          {
            attribute: "title",
            title: "Title text",
            description: "Useful for screen readers and improved SEO.",
            inputMethod: "textfield",
            icon: "icons:accessibility",
          },
          {
            attribute: "target",
            title: "Target",
            description: "Where to place the link.",
            inputMethod: "select",
            icon: "icons:launch",
            options: {
              "": "Same window",
              _blank: "New window",
              _top: "Top window",
              _parent: "Parent window",
            },
          },
        ],
        advanced: [],
      },
    };
    // anything can be presented as a link
    this.validGizmoTypes.forEach((val) => {
      ahref.gizmo.handles.push({
        type: val,
        source: "href",
        title: "innerText",
        alt: "title",
      });
    });
    this.setHaxProperties(ahref, "a");
    let p = {
      type: "element",
      editingElement: "core",
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Paragraph",
        description: "A basic text area",
        icon: "hax:paragraph",
        color: "blue-grey",
        groups: ["Content"],
        handles: [
          {
            type: "content",
            content: "",
          },
        ],
        meta: {
          author: "W3C",
        },
      },
      settings: {
        configure: [],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "p",
          content: "Text",
          properties: {},
        },
      ],
    };
    this.setHaxProperties(p, "p");
    // table tag which has a custom editing interface
    let table = {
      type: "element",
      editingElement: {
        tag: "editable-table",
        import: "@lrnwebcomponents/editable-table/editable-table.js",
      },
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Table",
        description: "A table for displaying data",
        icon: "image:grid-on",
        color: "blue-grey",
        groups: ["Content", "Table", "Data"],
        meta: {
          author: "W3C",
        },
      },
      settings: {
        configure: [],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "table",
          content:
            "<tr><td>-</td><td>-</td><td>-</td></tr><tr><td>-</td><td>-</td><td>-</td></tr><tr><td>-</td><td>-</td><td>-</td></tr>",
          properties: {},
        },
      ],
    };
    this.setHaxProperties(table, "table");
    let prims = {
      caption: {
        title: "Caption",
        icon: "av:call-to-action",
      },
      video: {
        title: "Video",
        icon: "av:play-circle-filled",
      },
      audio: {
        title: "Audio",
        icon: "image:music-note",
      },
      section: {
        title: "Section",
        icon: "image:crop-landscape",
      },
      ol: {
        title: "Numbered list",
        icon: "editor:format-list-numbered",
      },
      ul: {
        title: "Bulleted list",
        icon: "editor:format-list-bulleted",
      },
      li: {
        title: "List item",
        icon: "editor:format-list-bulleted",
      },
      h1: {
        title: "Heading",
        icon: "hax:h1",
      },
      h2: {
        title: "Heading",
        icon: "hax:h2",
      },
      h3: {
        title: "Heading",
        icon: "hax:h3",
      },
      h4: {
        title: "Heading",
        icon: "hax:h4",
      },
      h5: {
        title: "Heading",
        icon: "hax:h5",
      },
      h6: {
        title: "Heading",
        icon: "hax:h6",
      },
      strike: {
        title: "Cross out",
        icon: "editor:format-strikethrough",
      },
      u: {
        title: "Underline",
        icon: "editor:format-underlined",
      },
      sub: {
        title: "Subscript",
        icon: "mdextra:subscript",
      },
      sup: {
        title: "Superscript",
        icon: "mdextra:superscript",
      },
      div: {
        title: "DIV",
        icon: "image:crop-landscape",
      },
      span: {
        title: "SPAN",
        icon: "editor:short-text",
      },
      i: {
        title: "Italic",
        icon: "editor:format-italic",
      },
      em: {
        title: "Emphasis",
        icon: "editor:format-italic",
      },
      strong: {
        title: "Bold",
        icon: "editor:format-bold",
      },
      b: {
        title: "Bold",
        icon: "editor:format-bold",
      },
      blockquote: {
        title: "Block quote",
        icon: "editor:format-quote",
      },
      code: {
        title: "Code",
        icon: "icons:code",
      },
      figure: {
        title: "Figure",
        icon: "icons:label-outline",
      },
      embed: {
        title: "Embedded object",
        icon: "icons:fullscreen",
      },
    };
    for (var tag in prims) {
      this.setHaxProperties(
        {
          type: "element",
          editingElement: "core",
          canScale: false,
          canPosition: false,
          canEditSource: true,
          gizmo: {
            title: prims[tag].title,
            icon: prims[tag].icon,
            meta: {
              hidden: tag == "h2" ? false : true,
            },
          },
          settings: {
            configure: [],
            advanced: [],
          },
          demoSchema: [
            {
              tag: tag,
              content: tag == "h2" ? "Heading" : "",
              properties: {},
            },
          ],
        },
        tag
      );
    }
    let hr = {
      canScale: {
        min: 25,
        step: 25,
      },
      type: "element",
      editingElement: "core",
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Horizontal line",
        icon: "hax:hr",
        meta: {
          author: "W3C",
        },
      },
      settings: {
        configure: [],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "hr",
          content: "",
          properties: {
            style: "width:50%;",
          },
        },
      ],
    };
    this.setHaxProperties(hr, "hr");
  }
  /**
   * A standard event for registering the different pieces of HAX that check in
   * at run time. This allows for additional flexibility down the road as well as
   * registering pieces we never thought of for custom environments.
   * This also ensures that there are object references in the central store
   * but that load at an unknown time during spin up.
   *
   * @param {CustomEvent} e an event that has the piece to register and the object
   */
  _haxStorePieceRegistrationManager(e) {
    if (e.detail && e.detail.piece && e.detail.object) {
      this[e.detail.piece] = e.detail.object;
    }
  }

  /**
   * Insert content in the body.
   */
  _haxStoreInsertContent(e) {
    if (e.detail) {
      let details = e.detail;
      if (window.customElements.get(details.tag)) {
        let prototypeNode = document.createElement(details.tag);
        // @see haxHooks: preProcessInsertContent
        if (this.testHook(prototypeNode, "preProcessInsertContent")) {
          details = this.runHook(prototypeNode, "preProcessInsertContent", [
            details,
          ]);
        }
      }
      var properties = {};
      // support for properties to be set automatically optionally
      if (typeof details.properties !== typeof undefined) {
        properties = details.properties;
      }
      // support / clean up properties / attributes that have innerHTML / innerText
      // these are reserved words but required for certain bindings
      if (properties.innerHTML) {
        if (details.content == "") {
          details.content = properties.innerHTML;
        }
        delete properties.innerHTML;
      }
      if (properties.innerText) {
        if (details.content == "") {
          details.content = properties.innerText;
        }
        delete properties.innerText;
      }
      // invoke insert or replacement on body, same function so it's easier to trace
      if (
        typeof details.__type !== typeof undefined &&
        details.__type === "inline"
      ) {
        let node = haxElementToNode({
          tag: details.tag,
          content: details.content,
          properties: properties,
        });
        // replace what WAS the active selection w/ this new node
        if (this.activePlaceHolder !== null) {
          this.activePlaceHolder.deleteContents();
          this.activePlaceHolder.insertNode(node);
        }
        // set it to nothing
        this.activePlaceHolder = null;
      } else if (
        details.replace ||
        details.replacement ||
        details.nextToActive
      ) {
        let node = haxElementToNode({
          tag: details.tag,
          content: details.content,
          properties: properties,
        });
        if (this.activePlaceHolder) {
          this.activeHaxBody.haxReplaceNode(this.activePlaceHolder, node);
          this.activePlaceHolder = null;
        } else if (details.nextToActive && this.activeNode) {
          // special support for an active slot
          if (
            this.activeHaxBody.__slot &&
            this.activeNode.tagName === "GRID-PLATE"
          ) {
            this.activeNode.appendChild(node);
          } else {
            this.activeNode.parentNode.insertBefore(node, this.activeNode);
          }
        } else {
          this.activeHaxBody.haxReplaceNode(this.activeNode, node);
        }
      } else if (
        this.activeNode.parentNode &&
        this.activeNode.parentNode.tagName != "HAX-BODY"
      ) {
        let node = haxElementToNode({
          tag: details.tag,
          content: details.content,
          properties: properties,
        });
        // allow for inserting things into things but not grid plate
        if (this.activeNode.parentNode.tagName === "GRID-PLATE") {
          // support slot if we have one on the activeNode (most likely)
          if (this.activeNode.getAttribute("slot") != null) {
            node.setAttribute("slot", this.activeNode.getAttribute("slot"));
          }
          this.activeHaxBody.haxInsert(
            details.tag,
            details.content,
            properties
          );
        } else {
          this.activeHaxBody.haxInsert(
            details.tag,
            details.content,
            properties
          );
        }
      } else {
        this.activeHaxBody.haxInsert(details.tag, details.content, properties);
      }
    }
  }
  /**
   * get the schema from a tag
   */
  haxSchemaFromTag(tag) {
    tag = tag.toLowerCase();
    if (this.elementList && this.elementList[tag]) {
      return this.elementList[tag];
    }
    return {};
  }
  /**
   * Optional send array, to improve performance and event bubbling better
   */
  _haxStoreInsertMultiple(e) {
    if (e.detail) {
      var properties;
      for (var i in e.detail) {
        properties = {};
        // support for properties to be set automatically optionally
        if (typeof e.detail[i].properties !== typeof undefined) {
          properties = e.detail[i].properties;
        }
        this.activeHaxBody.haxInsert(
          e.detail[i].tag,
          e.detail[i].content,
          properties
        );
      }
    }
  }

  /**
   * Set the activeHaxBody and add to the list so we know what to insert into.
   */
  _haxStoreRegisterBody(e) {
    if (e.detail) {
      this.haxBodies.push(e.detail);
      // default active the whatever is last here
      this.activeHaxBody = e.detail;
      // needed so that higher order things can respond to us having a body
      this.write("activeHaxBody", this.activeHaxBody, this);
      this.write("editMode", this.editMode, this);
    }
  }

  /**
   * Feature detect on the bar.
   */
  computePolyfillSafe() {
    /**
     * These are our bad actors in polyfill'ed browsers.
     * This means that https://github.com/webcomponents/webcomponentsjs/commit/ce464bb533bf39b544c312906499a6044ee0d30d
     * explains things but basically if shadow-dom is polyfilled
     * then we can't safely execute a DOM manipulating execCommand.
     * This
     */
    if (document.head.createShadowRoot || document.head.attachShadow) {
      return true;
    } else {
      console.warn("Shadow DOM missing, certain operations hidden");
      return false;
    }
  }

  /**
   * Write store event callback.
   */
  _writeHaxStore(e) {
    // ensure we have a valid store write
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property &&
      e.detail.owner
    ) {
      // only update US if we didn't originate this message
      if (e.detail.owner !== this) {
        if (e.detail.value == null) {
          this[e.detail.property] = null;
        } else if (typeof e.detail.value === "object") {
          this[e.detail.property] = {};
        }
        this[e.detail.property] = e.detail.value;
      }
      // tell everyone regardless
      this.dispatchEvent(
        new CustomEvent("hax-store-property-updated", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            property: e.detail.property,
            value: e.detail.value,
            owner: e.detail.owner,
          },
        })
      );
    }
  }

  /**
   * Notice that an app was set in HAX; register it
   */
  _haxStoreRegisterApp(e) {
    if (e.detail) {
      e.detail.index = this.appList.length;
      this.appList = [...this.appList, e.detail];
      this.write("appList", this.appList, this);
      // preconnect apps at registration time
      if (
        e.detail.connection &&
        e.detail.connection.protocol &&
        e.detail.connection.url
      ) {
        let preconnectlink = document.createElement("link");
        preconnectlink.rel = "preconnect";
        preconnectlink.href =
          e.detail.connection.protocol + "://" + e.detail.connection.url;
        document.head.appendChild(preconnectlink);
      }
      // we don't care about this after it's launched
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-STORE"
      ) {
        e.target.parentElement.removeChild(e.target);
      }
    }
  }

  /**
   * Notice that a stax was set in HAX; register it
   */
  _haxStoreRegisterStax(e) {
    if (e.detail) {
      e.detail.index = this.staxList.length;
      this.staxList = [...this.staxList, e.detail];
      this.write("staxList", this.staxList, this);
      // we don't care about this after it's launched
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-STORE"
      ) {
        e.target.parentElement.removeChild(e.target);
      }
    }
  }

  /**
   * Notice that a blox was set in HAX; register it
   */
  _haxStoreRegisterBlox(e) {
    if (e.detail) {
      e.detail.index = this.bloxList.length;
      this.bloxList = [...this.bloxList, e.detail];
      this.write("bloxList", this.bloxList, this);
      // we don't care about this after it's launched
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-STORE"
      ) {
        e.target.parentElement.removeChild(e.target);
      }
    }
  }
  /**
   * Helper to convert dash to camel; important when reading attributes.
   */
  dashToCamel(str) {
    return str.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
  }
  /**
   * Convert HTML into HAX Elements
   */
  htmlToHaxElements(html) {
    let elements = [];
    const validTags = this.validTagList;
    let fragment = document.createElement("div");
    fragment.innerHTML = html;
    const children = fragment.childNodes;
    // loop over the new nodes
    for (var i = 0; i < children.length; i++) {
      // verify this tag is a valid one
      if (
        typeof children[i].tagName !== typeof undefined &&
        validTags.includes(children[i].tagName.toLowerCase())
      ) {
        elements.push(nodeToHaxElement(children[i], null));
      }
    }
    return elements;
  }
  /**
   * Convert a node to the correct content object for saving.
   * This DOES NOT acccept a HAXElement which is similar
   */
  nodeToContent(node) {
    // @see haxHooks: preProcessNodeToContent
    if (this.testHook(node, "preProcessNodeToContent")) {
      node = this.runHook(node, "preProcessNodeToContent", [node]);
    }
    let tag = node.tagName.toLowerCase();
    // support sandboxed environments which
    // will hate iframe tags but love webview
    if (this._isSandboxed && tag === "webview") {
      tag = "iframe";
    }
    var content = "";
    // start to rebuild the same tag we got in a generalized way
    content += "<" + tag;
    // account for things that say NOT to save slot values
    var props = this.elementList[tag];
    var propvals = {};
    // grab all of the original's attributes, and pass them to the replacement
    for (var j = 0, l = node.attributes.length; j < l; ++j) {
      var nodeName = node.attributes.item(j).nodeName;
      var value = node.attributes.item(j).value;
      // encode objects and arrays because they are special
      if (
        nodeName != "style" &&
        (typeof value === typeof Object || value.constructor === Array)
      ) {
        propvals[nodeName] = JSON.stringify(value).replace(
          new RegExp('"', "g"),
          "&quot;"
        );
      }
      // only write things that aren't empty
      else if (value != null && value != "null") {
        if (value === true || value === "true") {
          propvals[nodeName] = true;
        } else if (value === false) {
          // do nothing, no reason to record false unless written as text
          // in which case below will capture it
        } else {
          // ensure that value doesn't have " in it unencoded
          if (typeof value === "string" && value !== "") {
            value = value.replace(new RegExp('"', "g"), "&quot;");
            propvals[nodeName] = value;
          }
          // special handling for empty string cause it might mean boolean
          // or it might be a string
          else if (value === "") {
            if (value == "" && node.attributes.item(j).value != "") {
              value = node.attributes.item(j).value;
            }
            propvals[nodeName] = value;
          } else {
            propvals[nodeName] = value;
          }
        }
      }
    }
    // now look through properties
    let tmpProps;
    // relatively cross library
    if (customElements.get(tag)) {
      tmpProps = customElements.get(tag).properties;
    }
    // weak fallback
    if (typeof tmpProps === typeof undefined) {
      tmpProps = node.__data;
    }
    if (typeof tmpProps !== typeof undefined) {
      for (var j in tmpProps) {
        var nodeName = camelToDash(j);
        var value = null;
        // prefer local value over properties object if possible
        if (typeof node[j] !== typeof undefined) {
          value = node[j];
        }
        // never allow read only things to recorded as they
        // are run-time creation 99% of the time
        // this is very polymer specific but it allows readOnly and computed props
        // also __ is a popular convention for private values so let's skip them
        if (
          !tmpProps[j].readOnly &&
          !tmpProps[j].computed &&
          value !== tmpProps[j].value &&
          !nodeName.startsWith("__")
        ) {
          // encode objects and arrays because they are special
          if (
            value != null &&
            (typeof value === "object" || value.constructor === Array)
          ) {
            if (value.constructor === Array && value != []) {
              propvals[nodeName] = JSON.stringify(value).replace(
                new RegExp('"', "g"),
                "&quot;"
              );
            } else if (typeof value === "object" && value != {}) {
              propvals[nodeName] = JSON.stringify(value).replace(
                new RegExp('"', "g"),
                "&quot;"
              );
            }
          }
          // only write things that aren't empty
          else if (value != null && value != "null") {
            if (value === true || value === "true") {
              propvals[nodeName] = true;
            } else if (value === false) {
              // do nothing, no reason to record false unless written as text
              // in which case below will capture it
            } else {
              // ensure that value doesn't have " in it unencoded
              if (typeof value === "string" && value !== "") {
                value = value.replace(new RegExp('"', "g"), "&quot;");
                propvals[nodeName] = value;
              }
              // special handling for empty string cause it might mean boolean
              // or it might be a string
              else if (value === "") {
                if (value == "" && tmpProps[j].value != "") {
                  value = tmpProps[j].value;
                } else if (value === "" && tmpProps[j].value == "") {
                  // do nothing, the default value is empty
                  // so lets record less data
                }
              } else {
                propvals[nodeName] = value;
              }
            }
          }
        }
      }
    }
    // support for tag defining which properties NOT to save
    // for simplification, everything is an attribute during this
    // operation
    if (
      typeof props !== typeof undefined &&
      typeof props.saveOptions.unsetAttributes !== typeof undefined
    ) {
      for (var i in props.saveOptions.unsetAttributes) {
        delete propvals[props.saveOptions.unsetAttributes[i]];
      }
    }
    // specialized clean up for some that can leak through from above
    // and are edge case things because #hashtag gotta love HTML attributes
    // and the webview tag. facepalm.
    let delProps = ["inner-text", "inner-html", "tabindex", "guestinstance"];
    for (var delProp in delProps) {
      if (typeof propvals[delProps[delProp]] !== typeof undefined) {
        delete propvals[delProps[delProp]];
      }
    }
    // remove id attribute if it's empty, somehow misses above
    if (typeof propvals.id !== typeof undefined && propvals.id === "") {
      delete propvals.id;
    }
    // drop these known things we never want to save
    delete propvals.draggable;
    delete propvals.contenteditable;
    delete propvals["data-hax-ray"];
    if (propvals.class == "" || propvals.class == "hax-active") {
      delete propvals.class;
    }
    // run through the rest and print to the dom
    for (var i in propvals) {
      if (propvals[i] === true) {
        content += " " + i;
      } else {
        content += " " + i + '="' + propvals[i] + '"';
      }
    }
    // set the opening tag, support self-closing void tags
    let voidTags = [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ];
    if (voidTags.includes(tag)) {
      content += "/>";
    } else {
      content += ">";
    }
    // try and work against anything NOT a P tag
    if (typeof props === typeof undefined || !props.saveOptions.wipeSlot) {
      // get content that is in the slots
      let slotnodes = node.childNodes;
      // ensure there's something inside of this
      if (slotnodes.length > 0) {
        // loop through everything found in the slotted area and put it back in
        for (var j = 0, len2 = slotnodes.length; j < len2; j++) {
          if (typeof slotnodes[j].tagName !== typeof undefined) {
            // if we're a custom element, keep digging, otherwise a simple
            // self append is fine unless template tag cause it's a special
            // case for the web in general as it'll register as not a primative
            // even though it is...
            if (
              !this.HTMLPrimativeTest(slotnodes[j].tagName) &&
              slotnodes[j].tagName !== "TEMPLATE"
            ) {
              content += this.nodeToContent(slotnodes[j]);
            } else {
              slotnodes[j].removeAttribute("data-hax-ray");
              slotnodes[j].contentEditable = false;
              content += slotnodes[j].outerHTML;
            }
          }
          // keep comments with a special case since they need wrapped
          else if (slotnodes[j].nodeType === 8) {
            content += "<!-- " + slotnodes[j].textContent + " -->";
          }
          // keep everything NOT an element at this point, this helps
          // preserve whitespace because we're crazy about accuracy
          else if (
            slotnodes[j].nodeType !== 1 &&
            typeof slotnodes[j].textContent !== typeof undefined &&
            slotnodes[j].textContent !== "undefined"
          ) {
            content += slotnodes[j].textContent;
          }
        }
      }
    }
    // optional support for intentional progressive enhancement
    if (typeof node.haxProgressiveEnhancement === "function") {
      content += node.haxProgressiveEnhancement();
    }
    // don't put return for span since it's an inline tag
    if (tag === "span") {
      content += "</" + tag + ">";
    } else if (tag === "hr" || tag === "br" || tag === "img") {
      // do nothing for self-closing tags they'll resolve themselves
    }
    // close the tag, placing a return in output for block elements
    else {
      content += "</" + tag + ">" + "\n";
    }
    // spacing niceness for output readability
    content = content.replace(/&nbsp;/gm, " ");
    // target and remove hax specific things from output if they slipped through
    content = content.replace(/ data-hax-ray="(\s|.)*?"/gim, "");
    content = content.replace(/ class=""/gim, "");
    content = content.replace(/ class="hax-active"/gim, "");
    content = content.replace(/ contenteditable="(\s|.)*?"/gim, "");
    // wipe pure style spans which can pop up on copy paste if we didn't catch it
    // also ensure that we then remove purely visual chars laying around
    // this also helps clean up when we did a normal contenteditable paste
    // as opposed to our multi-element sanitizing option that we support
    content = content.replace(/<span style="(.*?)">/gim, "<span>");
    content = content.replace(/<span>\s*?<\/span>/g, " ");
    content = content.replace(/<span><br\/><\/span>/gm, "");
    // account for things taht on normal paste would pick up too many css vars
    content = content.replace(/<strong style="(.*?)">/gim, "<strong>");
    content = content.replace(/<b style="(.*?)">/gim, "<b>");
    content = content.replace(/<strike style="(.*?)">/gim, "<strike>");
    content = content.replace(/<em style="(.*?)">/gim, "<em>");
    content = content.replace(/<i style="(.*?)">/gim, "<i>");
    // empty with lots of space
    content = content.replace(/<p>(\s*)<\/p>/gm, "<p></p>");
    // empty p / more or less empty
    content = content.replace(/<p>&nbsp;<\/p>/gm, "<p></p>");
    // br somehow getting through here
    content = content.replace(/<p><br\/><\/p>/gm, "<p></p>");
    content = content.replace(/<p><br><\/p>/gm, "<p></p>");
    // whitespace in reverse of the top case now that we've cleaned it up
    content = content.replace(/<\/p>(\s*)<p>/gm, "</p><p>");
    content = content
      .split("\n\r")
      .join("\n")
      .split("\r")
      .join("\n")
      .split("\n\n")
      .join("\n")
      .split("\n\n")
      .join("\n")
      .split("\n\n")
      .join("\n");
    // @see haxHooks: postProcessNodeToContent
    if (this.testHook(node, "postProcessNodeToContent")) {
      content = this.runHook(node, "postProcessNodeToContent", [content]);
    }
    return content;
  }
  /**
   * Basic HTML Primitives test
   */
  HTMLPrimativeTest(node) {
    if (
      typeof node.tagName !== typeof undefined &&
      node.tagName.indexOf("-") == -1
    ) {
      return true;
    }
    return false;
  }
  /**
   * Filter app store apps to those that accept this file source.
   */
  getHaxAppStoreTargets(type) {
    let targets = this.appList.filter((app) => {
      if (typeof app.connection.operations.add !== typeof undefined) {
        let add = app.connection.operations.add;
        if (
          typeof add.acceptsGizmoTypes !== typeof undefined &&
          add.acceptsGizmoTypes.includes(type)
        ) {
          return true;
        }
      }
      return false;
    });
    return targets;
  }
  /**
   * refresh / rebuild the form based on active item
   */
  refreshActiveNodeForm() {
    this.haxTray.activeHaxElement = nodeToHaxElement(
      this.haxTray.activeNode,
      null
    );
    this.haxTray._setupForm();
  }
  /**
   * Generate Hax Element prototype.
   */
  haxElementPrototype(gizmo, properties, content = "") {
    return {
      tag: gizmo.tag,
      properties: properties,
      content: content,
      gizmo: gizmo,
    };
  }
  /**
   * Slot content w/ support for custom elements in slot.
   */
  getHAXSlot(node) {
    // we can skip all of this if we have a text element / HTML prim!
    if (this.isTextElement(node)) {
      return node.innerHTML;
    }
    let content = "";
    var slotnodes = node.childNodes;
    // ensure there's something inside of this
    if (slotnodes.length > 0) {
      // loop through everything found in the slotted area and put it back in
      for (var j = 0, len2 = slotnodes.length; j < len2; j++) {
        if (typeof slotnodes[j].tagName !== typeof undefined) {
          // if we're a custom element, keep digging, otherwise a simple
          // self append is fine.
          if (slotnodes[j].tagName.indexOf("-") > 0) {
            content += "  " + this.nodeToContent(slotnodes[j]) + "\n";
          } else {
            content += "  " + slotnodes[j].outerHTML + "\n";
          }
        }
        // keep comments with a special case since they need wrapped
        else if (slotnodes[j].nodeType === 8) {
          content += "<!-- " + slotnodes[j].textContent + " -->";
        }
        // keep everything NOT an element at this point, this helps
        // preserve whitespace because we're crazy about accuracy
        else if (
          slotnodes[j].nodeType !== 1 &&
          typeof slotnodes[j].textContent !== typeof undefined &&
          slotnodes[j].textContent !== "undefined"
        ) {
          content += slotnodes[j].textContent;
        }
      }
    }
    return content;
  }
  /**
   * Notice that a property off an element was set in HAX some place; register it here
   */
  _haxStoreRegisterProperties(e) {
    if (e.detail && e.detail.properties && e.detail.tag) {
      // only register tag if we don't know about it already
      if (!this.elementList[e.detail.tag]) {
        // look for a gizmo; it's not required, technically.
        let gizmo = e.detail.properties.gizmo;
        if (gizmo) {
          gizmo.tag = e.detail.tag;
          let gizmos = this.gizmoList;
          gizmos.push(gizmo);
          this.gizmoList = [...gizmos];
          this.write("gizmoList", gizmos, this);
        }
        this.elementList[e.detail.tag] = e.detail.properties;
        // only push new values on if we got something new
        if (
          !this.validTagList.find((element) => {
            return element === e.detail.tag;
          })
        ) {
          this.validTagList.push(e.detail.tag);
        }
        // push to grid list IF this marks itself as a grid
        if (
          e.detail.properties.type == "grid" &&
          !this.validGridTagList.find((element) => {
            return element === e.detail.tag;
          })
        ) {
          this.validGridTagList.push(e.detail.tag);
        }
      }
      // delete this tag if it was in the autoloader as it has served it's purpose.
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-AUTOLOADER"
      ) {
        this.haxAutoloader.removeChild(e.target);
      }
    }
  }
  get activeGizmo() {
    let gizmo = toJS(this._calculateActiveGizmo(this.activeNode));
    this.write("activeGizmo", gizmo, this);
    return gizmo;
  }
}
window.customElements.define(HaxStore.tag, HaxStore);
export { HaxStore };
// window bridge for external projects that want to account for HAX
// yet don't want to require it as part of an import chain
window.HaxStore = window.HaxStore || {};
window.HaxStore.requestAvailability = function () {
  if (!window.HaxStore.instance) {
    window.HaxStore.instance = document.createElement("hax-store");
    document.body.appendChild(window.HaxStore.instance);
  }
  return window.HaxStore.instance;
};
// export the singleton so everyone can directly reference it
export const HAXStore = window.HaxStore.requestAvailability();

// debugging / developer console shortcuts
window.Hax = window.Hax || {};
window.Hax.add = function (tag) {
  if (HAXStore.elementList[tag]) {
    // generate schema from the tag
    let schema = HAXStore.haxSchemaFromTag(tag);
    let target;
    if (schema.gizmo.tag && schema.demoSchema && schema.demoSchema[0]) {
      target = haxElementToNode(schema.demoSchema[0]);
    } else {
      target = document.createElement(tag);
    }
    HAXStore.activeHaxBody.haxReplaceNode(HAXStore.activeNode, target);
    HAXStore.activeHaxBody.__focusLogic(target);
  } else {
    // do nothing, we tried to be a pro but failed :(
    HAXStore.toast(`${tag} is not a valid tag`);
  }
};
window.Hax.delete = function () {
  if (HAXStore.activeNode != null) {
    HAXStore.activeHaxBody.haxDeleteNode(HAXStore.activeNode);
  }
};
window.Hax.duplicate = function () {
  HAXStore.activeHaxBody.haxDuplicateNode(HAXStore.activeNode);
};

window.Hax.move = function (dir = true) {
  if (dir) {
    HAXStore.activeHaxBody.haxMoveGridPlate("up", HAXStore.activeNode);
  } else {
    HAXStore.activeHaxBody.haxMoveGridPlate("down", HAXStore.activeNode);
  }
};

window.Hax.grid = function (op = true) {
  HAXStore.activeHaxBody.haxGridPlateOps(op);
};

window.Hax.set = function (key, value) {
  HAXStore.write(key, value, window);
};

window.Hax.get = function (key) {
  return HAXStore[key];
};

window.Hax.export = function () {
  return HAXStore.activeHaxBody.haxToContent();
};

window.Hax.import = function (htmlContent = "<p></p>") {
  return HAXStore.activeHaxBody.importContent(htmlContent);
};
