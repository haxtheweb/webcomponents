import { LitElement, html, nothing } from "lit";
import { SimpleTourManager } from "@haxtheweb/simple-popover/lib/simple-tour.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import {
  winEventsElement,
  getRange,
  stripMSWord,
  removeBadJSEventAttributes,
  nodeToHaxElement,
  haxElementToNode,
  validURL,
  camelToDash,
  htmlEntities,
  localStorageGet,
  localStorageSet,
  detectMarkdown,
  markdownToHTML,
} from "@haxtheweb/utils/utils.js";
import {
  observable,
  makeObservable,
  computed,
  configure,
  autorun,
  toJS,
} from "mobx";
configure({ enforceActions: false }); // strict mode off
import { HAXElement } from "@haxtheweb/hax-body-behaviors/hax-body-behaviors.js";
import {
  I18NMixin,
  I18NManagerStore,
} from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import "@haxtheweb/media-behaviors/media-behaviors.js";
import "@haxtheweb/editable-table/editable-table.js";
import "@haxtheweb/iframe-loader/iframe-loader.js";
import "@haxtheweb/hax-iconset/lib/hax-iconset-manifest.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import "./hax-app.js";

function sessionStorageGet(name) {
  try {
    return sessionStorage.getItem(name);
  } catch (e) {
    return false;
  }
}

function sessionStorageSet(name, newItem) {
  try {
    return sessionStorage.setItem(name, newItem);
  } catch (e) {
    return false;
  }
}

/**
 * @element hax-store
 */
class HaxStore extends I18NMixin(winEventsElement(HAXElement(LitElement))) {
  /**
   * test a hook's existance in a target
   */
  testHook(el, op) {
    // support for primatives
    if (
      el &&
      el.tagName &&
      this.HTMLPrimativeTest(el) &&
      this.primativeHooks[el.tagName.toLowerCase()] &&
      this.primativeHooks[el.tagName.toLowerCase()][op]
    ) {
      return true;
    }
    return el && typeof el.haxHooks === "function" && el.haxHooks()[op];
  }
  /**
   * run a hook in a target if it exists
   */
  async runHook(el, op, data = []) {
    if (this.testHook(el, op)) {
      //console.warn('running hook: ' + op);
      if (this.HTMLPrimativeTest(el)) {
        return await this.primativeHooks[el.tagName.toLowerCase()][op](...data);
      }
      return await el[el.haxHooks()[op]](...data);
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
      // this could fail depending on polyfills and stuff
      try {
        // ponyfill from google
        if (getRange(this.activeHaxBody.parentNode)) {
          return getRange(this.activeHaxBody.parentNode);
        }
      } catch (e) {}
    }
    // missed on both, hope the normal one will work
    return globalThis.getSelection();
  }
  /**
   * Get a normalized range based on current selection
   */
  getRange() {
    let sel = this.getSelection();
    if (sel && sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else {
      return false;
    }
  }

  /**
   * Try and guess the Gizmo based on what we were just handed
   */
  guessGizmo(guess, values, skipPropMatch = false, preferExclusive = false) {
    var matches = [],
      matchedTags = [];
    if (typeof guess !== typeof undefined) {
      // verify type
      if (this.validGizmoTypes.includes(guess)) {
        // now we can look through them
        // look for a match
        for (let gizmoposition in this.gizmoList) {
          let gizmo = toJS(this.gizmoList[gizmoposition]);
          let props = !!values.innerHTML ? { innerHTML: values.innerHTML } : {};
          // reset match per gizmo
          let match = false;
          // ensure this gizmo can handle things
          if (gizmo && gizmo.handles) {
            for (let i = 0; i < gizmo.handles.length; i++) {
              // WHAT!??!?!?!?!
              if (
                guess === gizmo.handles[i].type ||
                (guess === "*" && !match)
              ) {
                for (let property in gizmo.handles[i]) {
                  // ignore type.. but again.. WHAT?!?!?!
                  if (property !== "type") {
                    // check the values that came across to see if there's a match
                    // of any kind, we only need one but can then bind to multiple
                    if (typeof values[property] !== typeof undefined) {
                      // but ensure there's either no meta data OR
                      // the meta data needs to NOT say anythinig about hiding
                      if (
                        gizmo.handles[i][property] !== "" &&
                        (guess === "inline" ||
                          !gizmo.meta ||
                          (gizmo.meta &&
                            !gizmo.meta.inlineOnly &&
                            !gizmo.meta.hidden))
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
                    let keywords = {};
                    [...gizmo.handles].forEach((i) => {
                      if (!!i && !!i.type && i.type != "")
                        keywords[i.type.toLowerCase()] = true;
                    });
                    if (gizmo.tags && gizmo.tags.length > 0) {
                      [...gizmo.tags].forEach((i) => {
                        if (!!i && i != "") keywords[i.toLowerCase()] = true;
                      });
                    }
                    gizmo.keywords = Object.keys(keywords);
                    //prevent duplicates
                    if (!matchedTags.includes(gizmo.tag)) {
                      matches.push(this.haxElementPrototype(gizmo, props, ""));
                      matchedTags.push(gizmo.tag);
                    }
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
  insertLogicFromValues(
    values,
    context,
    failOnAnything = false,
    linkOnMultiple = false,
  ) {
    // we have no clue what this is.. let's try and guess..
    let type =
      this.activePlaceHolderOperationType || this.guessGizmoType(values);
    if (type === "upload-only") {
      this.toast("Upload successful!");
      return false;
    }
    // told to insert a link based on operation executed
    if (this.activePlaceHolderOperationType === "link") {
      linkOnMultiple = true;
    }
    // reset this after
    this.activePlaceHolderOperationType = null;
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
    
    // Auto-handle image drop scenarios without showing picker
    if (type === "image" && this.activePlaceHolder) {
      // Check if dropping on an image - auto-create gallery
      if (this._isImageElement(this.activePlaceHolder)) {
        this._createImageGallery(this.activePlaceHolder, values.source);
        return true;
      }

      // Check if dropping into or onto a play-list - auto-add to that gallery
      let targetPlayList = null;
      // Prefer checking from the placeholder (where the drop occurred)
      targetPlayList = this._nearestContainerTag(this.activePlaceHolder, "play-list");
      // Fallback: check from the active node (drop target container)
      if (!targetPlayList && this.activeNode) {
        targetPlayList = this._nearestContainerTag(this.activeNode, "play-list");
      }
      if (targetPlayList) {
        this._addImageToPlayList(targetPlayList, values.source);
        return true;
      }
    }

    // see if we got anything
    if (haxElements.length > 0) {
      // if we ONLY have 1 thing or we say "make it a link if multiple"
      // special case for pasting into the page
      if (haxElements.length === 1 || linkOnMultiple) {
        if (
          haxElements.length === 1 &&
          typeof haxElements[0].tag !== typeof undefined
        ) {
          context.dispatchEvent(
            new CustomEvent("hax-insert-content", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: haxElements[0],
            }),
          );
        } else if (linkOnMultiple) {
          context.dispatchEvent(
            new CustomEvent("hax-insert-content", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: haxElements.find((item) => {
                return item.tag == "a";
              }),
            }),
          );
        }
      } else {
        // @todo this should somehow get it's options passed to and from merlin
        // hand off to hax-app-picker to deal with the rest of this
        this.haxAppPicker.presentOptions(
          haxElements,
          type,
          "Pick how to present this " + typeName,
          "gizmo",
        );
      }
      return true;
    } else {
      this.toast(
        "Sorry, HAX doesn't know how to handle that type of link yet.",
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
        }),
      );
    }
  }
  /**
   * Find the nearest ancestor element matching tag name from a starting node
   */
  _nearestContainerTag(node, tagName) {
    let current = node;
    const match = (el) => el && el.tagName && el.tagName.toLowerCase() === tagName;
    // If node supports closest (Elements), use it first for performance
    try {
      if (current && typeof current.closest === "function") {
        const found = current.closest(tagName);
        if (found) return found;
      }
    } catch (e) {}
    // Fallback manual traversal (covers non-Elements or when closest not available)
    while (current) {
      if (match(current)) return current;
      current = current.parentNode;
    }
    return null;
  }

  /**
   * Check if an element is an image element by tag name or schema metadata
   */
  _isImageElement(element) {
    if (!element || !element.tagName) {
      return false;
    }

    const tagName = element.tagName.toLowerCase();

    // Check for direct image element tag names
    const directImageElements = [
      "media-image",
      "img",
      "image",
      "a11y-figure",
      "full-width-image",
      "parallax-image",
    ];
    if (directImageElements.includes(tagName)) {
      return true;
    }

    // Check schema metadata for image tag
    const schema = this.haxSchemaFromTag(tagName);
    if (schema && schema.gizmo && schema.gizmo.tags) {
      // Check if the element's gizmo tags include 'image'
      return schema.gizmo.tags.some(
        (tag) => typeof tag === "string" && tag.toLowerCase() === "image",
      );
    }

    return false;
  }

  /**
   * Create an image gallery by wrapping the original image and adding the new image
   */
  _createImageGallery(originalImageElement, newImageSource) {
    // Create the play-list element
    const playList = globalThis.document.createElement('play-list');
    
    // Set gallery-friendly defaults using properties
    playList.pagination = true;
    playList.navigation = true;
    playList.loop = true;
    
    // Copy any slot attribute from the original image
    if (originalImageElement.getAttribute('slot')) {
      playList.setAttribute('slot', originalImageElement.getAttribute('slot'));
    }
    
    // Clone the original image element
    const originalImageClone = originalImageElement.cloneNode(true);
    
    // Create the new image element
    let newImage;
    if (originalImageElement.tagName.toLowerCase() === 'media-image') {
      // If original is media-image, create matching element
      newImage = globalThis.document.createElement('media-image');
      newImage.source = newImageSource;
      newImage.alt = 'Image from gallery';
      
      // Copy relevant properties from original for consistency
      ['card', 'box', 'round', 'size', 'offset'].forEach(prop => {
        if (originalImageElement[prop] !== undefined && originalImageElement[prop] !== null) {
          newImage[prop] = originalImageElement[prop];
        }
      });
    } else {
      // For other image types, create a media-image
      newImage = globalThis.document.createElement('media-image');
      newImage.source = newImageSource;
      newImage.alt = 'Image from gallery';
    }
    
    // Add both images to the play-list
    playList.appendChild(originalImageClone);
    playList.appendChild(newImage);
    
    // Replace the original image with the play-list
    if (this.activeHaxBody && originalImageElement.parentNode) {
      this.activeHaxBody.haxReplaceNode(originalImageElement, playList);
    }
    
    // Clean up
    this.activePlaceHolder = null;
    
    // Set the new play-list as active
    this.activeNode = playList;
    
    // Show success message
    this.toast('Image gallery created successfully!');
  }

  /**
   * Add an image to an existing play-list
   */
  _addImageToPlayList(playListElement, imageSource) {
    // Create the new image element
    const newImage = globalThis.document.createElement('media-image');
    newImage.source = imageSource;
    newImage.alt = 'Added to gallery';
    
    // Check if there are existing images in the play-list to copy properties from
    const existingImages = playListElement.querySelectorAll('media-image');
    if (existingImages.length > 0) {
      const firstImage = existingImages[0];
      // Copy relevant properties from first image for consistency
      ['card', 'box', 'round', 'size', 'offset'].forEach(prop => {
        if (firstImage[prop] !== undefined && firstImage[prop] !== null) {
          newImage[prop] = firstImage[prop];
        }
      });
    }
    
    // Add the new image to the play-list
    playListElement.appendChild(newImage);
    
    // If a temporary placeholder node was created for drop positioning, remove it
    try {
      if (
        this.activePlaceHolder &&
        this.activePlaceHolder.parentNode &&
        this.activePlaceHolder !== playListElement
      ) {
        this.activePlaceHolder.parentNode.removeChild(this.activePlaceHolder);
      }
    } catch (e) {}
    
    // Clean up
    this.activePlaceHolder = null;
    
    // Set the play-list as active
    this.activeNode = playListElement;
    
    // Show success message
    this.toast('Image added to gallery successfully!');
  }

  /**
   * Create a single image gallery from Magic File Wand
   */
  _createSingleImageGallery(imageSource) {
    // Create the play-list element
    const playList = globalThis.document.createElement('play-list');
    
    // Set gallery-friendly defaults using properties
    playList.pagination = true;
    playList.navigation = true;
    playList.loop = true;
    
    // Create the image element
    const image = globalThis.document.createElement('media-image');
    image.source = imageSource;
    image.alt = 'Gallery image';
    
    // Add the image to the play-list
    playList.appendChild(image);
    
    // Insert the play-list using normal insertion logic
    this.activeHaxBody.haxInsert('play-list', playList.innerHTML, {
      pagination: true,
      navigation: true,
      loop: true,
    });
    
    // Show success message
    this.toast('Image gallery created! Add more images by editing the gallery.');
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
        source.indexOf(".jpeg") != -1
      ) {
        return "image";
      } else if (source.indexOf(".gif") != -1) {
        return "gif";
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
      else if (
        globalThis.MediaBehaviors.Video.getVideoType(source) != "external"
      ) {
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
    return html` <slot></slot> `;
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
    extras = {},
    classStyle = "capsule",
    closeText = this.t.close,
    eventCallback = null,
    slot = null,
  ) {
    // gets it all the way to the top immediately
    globalThis.dispatchEvent(
      new CustomEvent(this.toastShowEventName, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: message,
          duration: duration,
          classStyle: classStyle,
          closeText: closeText,
          eventCallback: eventCallback,
          slot: slot,
          ...extras,
        },
      }),
    );
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
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
       * Hax cancel dialog
       */
      haxCancel: {
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
      // we might not have this value, or we might have a specific way we want to handle this
      // other than just displaying the configuration of how to display this
      activePlaceHolderOperationType: {
        type: String,
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
      ready: {
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
      if (localStorageGet("haxConfirm", false)) {
        localStorageSet("haxUserData", newValue);
      } else if (sessionStorageGet("haxConfirm", false)) {
        sessionStorageSet("haxUserData", newValue);
      }
    }
  }

  isSingleSlotElement(node) {
    let slots = Object.keys(this.slotsSchemaFromNode(node));
    return slots.length == 1 && slots[0].length === 0;
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
          "mark",
          "abbr",
          "i",
          "bold",
          "time",
          "cite",
          "em",
          "strong",
          "pre",
          "section",
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
   * see if this is an inline element
   */
  isInlineElement(node) {
    let tag;
    // resolve HAXelements vs nodes
    if (node != null && node.tagName) {
      tag = node.tagName.toLowerCase();
    } else if (node != null && node.tag) {
      tag = node.tag.toLowerCase();
    } else if (typeof node === "string") {
      tag = node;
    }
    if (tag && this.validTagList.includes(tag)) {
      if (
        (this.haxSchemaFromTag(tag) &&
          this.haxSchemaFromTag(tag).meta &&
          this.haxSchemaFromTag(tag).meta.inlineOnly) ||
        [
          "a",
          "strike",
          "u",
          "b",
          "sub",
          "sup",
          "span",
          "code",
          "mark",
          "time",
          "cite",
          "abbr",
          "i",
          "bold",
          "em",
          "strong",
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
   * test for being a valid layout based on `type: grid` in HAXProperties
   * @param {object} node custom element
   * @returns {boolean} whether custom element is layout
   */
  isLayoutElement(node) {
    let schema =
      !!node && !!node.tagName ? this.haxSchemaFromTag(node.tagName) || {} : {};
    return schema.type && schema.type === "grid";
  }

  /**
   * test for being a slot in a valid layout based on `type: grid` in parent's HAXProperties
   * @param {object} node custom element
   * @returns {boolean} whether custom element is slot in a layout
   */
  isLayoutSlot(node) {
    if (!node || !node.parentNode) return false;
    return this.isLayoutElement(node.parentNode);
  }

  /**
   * test for being thhe original <grid-plate> element
   * @param {object} node custom element
   * @returns {boolean} whether custom element is grid-plate
   */
  isOriginalGridPlate(node) {
    return !!node && node.tagName === "GRID-PLATE";
  }
  /**
   * gets schema for activeNode
   *
   * @returns {object} haxSchema for node
   * @memberof HaxStore
   */
  activeSchema() {
    return this.activeNode
      ? this.haxSchemaFromTag(this.activeNode.tagName)
      : undefined;
  }

  /**
   * gets schema for activeNode's parent
   *
   * @returns {object} haxSchema for parent node
   * @memberof HaxStore
   */
  activeParentSchema() {
    return this.activeNode && this.activeNode.parentNode
      ? this.haxSchemaFromTag(this.activeNode.parentNode.tagName)
      : undefined;
  }
  /**
   * provides metadata for slotted content of a given custom element
   *
   * @param {object} node ustom element with slots
   * @returns {object} Ex: {slotId: {...slotsSchemaFromNode, items: [slottedChild, slottedChild, etc.]}}
   * @memberof HaxStore
   */
  slottedContentByNode(node) {
    let slots = { ...(this.slotsSchemaFromNode(node) || {}) };
    if (!node) return slots;
    [...(node.children || [])].forEach((child) => {
      if (child.slot && child.slot !== "" && slots[child.slot]) {
        slots[child.slot].items = slots[child.slot].items || [];
        slots[child.slot].items.push(child);
      } else if ((!child.slot || child.slot === "") && slots[""]) {
        slots[""].items = slots[""].items || [];
        slots[""].items.push(child);
      }
    });
    return slots;
  }

  /**
   * provides metadata for slotted content of a given custom element
   *
   * @param {object} node custom element with slots
   * @returns {object} Ex: {slotId: {...node's haxSchema for slot, label: slot's title or id, editMode: properties to set slot in editMode, grid: parent node}
   * @memberof HaxStore
   */
  slotsSchemaFromNode(node) {
    if (!node || !node.tagName) return {};
    let slotsSchema = {},
      schema = this.haxSchemaFromTag(node.tagName || {}),
      slots = this.slotsFromSchema(schema);

    if (this.isOriginalGridPlate(node)) {
      let layout = node.layout || "1-1-1-1";
      layout.split("-").map((item, num) => {
        slots.push({
          slot: `col-${num + 1}`,
          title: `Column ${num + 1}`,
          excludedSlotWrappers: ["grid-plate"],
        });
      });
    }
    slots.forEach((slot) => {
      //need to empty this
      slot.items = undefined;
      slot.label = slot.title || slot.slot;
      slot.editMode = { ...schema.editMode, ...slot.editMode };
      slot.grid = node;
      if (!!slot.slot || slot.slot === "") slotsSchema[slot.slot] = slot;
    });
    return slotsSchema;
  }
  /**
   * gets a single slot's schema
   *
   * @param {object} node custom element with slots
   * @param {string} slotId unique id for slot
   * @returns
   * @memberof HaxStore
   */
  schemaBySlotId(node, slotId) {
    return (this.slotsSchemaFromNode(node) || {})[slotId];
  }

  /**
   * Notice _appStore changed.
   */
  _appStoreChanged(newValue, oldValue) {
    // if we have an endpoint defined, pull it
    if (newValue && oldValue) {
      // support having the request or remote loading
      // depending on the integration type
      if (newValue.url && !newValue.apps && this.shadowRoot) {
        this.loadAppStoreFromRemote();
      } else {
        // directly injected json object into the DOM
        this.__appStoreData = newValue;
      }
    }
  }

  /**
   * Load and attach items from the app store.
   */
  async _loadAppStoreData(appDataResponse) {
    if (appDataResponse != null) {
      var items = {};
      // autoload elements
      if (typeof appDataResponse.autoloader !== typeof undefined) {
        // ensure the list is in the right order so we can async dynamic imports
        // regardless of if its an array or object of values in the right format
        // force this to be an object
        appDataResponse.autoloader = Object.assign(
          {},
          appDataResponse.autoloader,
        );
        for (let i in appDataResponse.autoloader) {
          let CEname = i;
          let CEimport = appDataResponse.autoloader[i];
          // helps support array or object based app store spec
          // array was originally in the standard so this lets us support both
          if (!isNaN(CEname)) {
            CEname = appDataResponse.autoloader[i];
            CEimport = `@haxtheweb/${CEname}/${CEname}.js`;
          }
          // support for element response shipping w/ the UI for the element
          // this allows backends to define haxSchema at run time!
          if (typeof CEimport !== "string") {
            // definition over the wire
            if (CEimport.haxProperties) {
              this.setHaxProperties(
                appDataResponse.autoloader[i].haxProperties,
                CEname,
              );
            }
            CEimport = appDataResponse.autoloader[i].import;
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
        for (let i = 0; i < apps.length; i++) {
          let app = globalThis.document.createElement("hax-app");
          app.data = apps[i];
          this.appendChild(app);
        }
      }
      // load in stax dynamically
      if (typeof appDataResponse.stax !== typeof undefined) {
        var staxs = appDataResponse.stax;
        for (let i = 0; i < staxs.length; i++) {
          let stax = globalThis.document.createElement("hax-stax");
          stax.data = staxs[i];
          this.appendChild(stax);
        }
      }

      this.dispatchEvent(
        new CustomEvent("hax-store-app-store-loaded", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true,
        }),
      );
      // now process the dynamic imports
      await this._handleDynamicImports(items, this.haxAutoloader);

      // detect and register page-template elements from style guide as stax if available
      // Try again here in case HAXcms wasn't ready during initial store setup
      await this._detectStyleGuideTemplates();

      this.appStoreLoaded = true;
    }
  }
  /**
   * Handle all the dynamic imports of things told to autoload
   * This ensures we get the definitions quickly as far as
   * what is a safe / valid tag above but then we import in a way
   * that allows us to correctly associate the hax schema to where
   * it came from.
   */
  async _handleDynamicImports(items, haxAutoloader) {
    let basePath =
      new URL("./hax-store.js", import.meta.url).href + "/../../../../";
    if (globalThis.WCGlobalBasePath) {
      basePath = globalThis.WCGlobalBasePath;
    }
    for (let i in items) {
      // try to skip an import
      if (globalThis.customElements.get(i)) {
        if (globalThis.customElements.get(i).haxProperties) {
          this.setHaxProperties(
            globalThis.customElements.get(i).haxProperties,
            i,
          );
        } else {
          // edge case of no definition
          try {
            let tmpEl = globalThis.document.createElement(i);
            haxAutoloader.appendChild(tmpEl);
          } catch (e) {}
        }
      } else {
        let importPath = `${basePath}${items[i]}`;
        // account for external app store reference on import
        if (this.isExternalURLImport(items[i])) {
          importPath = items[i];
        }
        // we have to import and then respond to it being imported by checking again
        await import(importPath)
          .then((response) => {
            // see if it imported now
            if (
              globalThis.customElements.get(i) &&
              globalThis.customElements.get(i).haxProperties
            ) {
              this.setHaxProperties(
                globalThis.customElements.get(i).haxProperties,
                i,
              );
            } else {
              // edge case of no definition
              haxAutoloader.appendChild(globalThis.document.createElement(i));
            }
          })
          .catch((error) => {
            /* Error handling */
            console.warn(error);
            // also try putting it in the autoloader and hope for the best
            haxAutoloader.appendChild(globalThis.document.createElement(i));
          });
      }
    }
  }
  isExternalURLImport(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return new URL(url).origin !== location.origin;
  }
  _editModeChanged(newValue) {
    // trap for very slow loading environments that might miss on initial setup timing
    if (
      newValue &&
      !this.appStoreLoaded &&
      this.__appStoreData &&
      this.haxAutoloader
    ) {
      clearTimeout(this.__readyToProcessAppStoreData);
      this._loadAppStoreData(this.__appStoreData);
    }
    // also try force loading if we don't have app store data but do have appStore config
    else if (
      newValue &&
      !this.appStoreLoaded &&
      this.appStore &&
      this.appStore.url &&
      this.haxAutoloader
    ) {
      this.forceAppStoreLoad();
    }
  }
  async _globalPreferencesChanged(newValue) {
    // regardless of what it is, reflect it globally but only after setup
    if (this.__storageDataProcessed && newValue && this.ready) {
      let storageData = this.storageData;
      // ensure storageData is an object
      if (typeof storageData === "string") {
        storageData = JSON.parse(storageData);
      }
      storageData.globalPreferences = newValue;
      this.storageData = storageData;
      this._storageDataChanged(this.storageData);
      // only translate if we are ready, and editing, and have a language other than default
      if (HAXStore.editMode) {
        clearTimeout(this._debounceLang);
        // debounce helps prevent flooding based on this variable being updated
        // we also don't need to instantly update language as it's an aggressive action
        // so this 100ms delay helps quiet this down
        this._debounceLang = setTimeout(async () => {
          // run through language matches as nessecary to translate haxProperties definitions
          for (let i in this.elementList) {
            let el = this.elementList[i];
            // run through translations to see if we have any
            // apply as nessecary; abstract out the current translation thing to be reused
            el = await this.attemptGizmoTranslation(i, el);
            this.elementList[i] = el;
          }
          this.gizmoList.forEach((el) => {
            // if a title / description exists; "translate" it to match what came across
            if (this.elementList[el.tag].gizmo.title) {
              el.title = this.elementList[el.tag].gizmo.title;
            }
            if (this.elementList[el.tag].gizmo.description) {
              el.description = this.elementList[el.tag].gizmo.description;
            }
          });
        }, 100);
      }
    }
  }
  /**
   * This only send if they consented to storage of data locally
   */
  _haxConsentTap(e) {
    // store for future local storage usage
    localStorageSet("haxConfirm", true);
    // most likely nothing but set it anyway
    localStorageSet("haxUserData", JSON.stringify(this.storageData));
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "appStore" && this[propName]) {
        this._appStoreChanged(this[propName], oldValue);
      }
      // composite obervation
      if (
        ["ready", "__appStoreData", "haxAutoloader"].includes(propName) &&
        this.ready &&
        this.__appStoreData &&
        this.haxAutoloader
      ) {
        clearTimeout(this.__readyToProcessAppStoreData);
        this.__readyToProcessAppStoreData = setTimeout(() => {
          this._loadAppStoreData(this.__appStoreData);
        }, 0);
      }
      if (["haxAutoloader", "haxTray", "haxCancel"].includes(propName)) {
        // allow this to verify if everything is here or not
        clearTimeout(this.__storeReady);
        this.__storeReady = setTimeout(() => {
          this._storePiecesAllHere(
            this.haxAutoloader,
            this.activeHaxBody,
            this.haxTray,
            this.haxCancel,
          );
        }, 0);
      }
    });
  }
  _calculateActiveGizmo(activeNode) {
    if (activeNode == null || !activeNode.tagName) {
      return null;
    }
    for (let gizmoposition in this.gizmoList) {
      var gizmo = this.gizmoList[gizmoposition];
      if (gizmo.tag === activeNode.tagName.toLowerCase()) {
        return gizmo;
      }
    }
  }
  /**
   * generate appstore query
   */
  loadAppStoreFromRemote() {
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
        this.__appStoreData = json;
      });
  }
  /**
   * ready life cycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // set this global flag so we know it's safe to start trusting data
    // that is written to global preferences / storage bin
    setTimeout(() => {
      this.__storageDataProcessed = true;
      if (this.storageData.globalPreferences) {
        this.write(
          "globalPreferences",
          this.storageData.globalPreferences,
          this,
        );
      }
    }, 0);
  }
  _storePiecesAllHere(haxAutoloader, activeHaxBody, haxTray, haxCancel) {
    if (!this.ready && activeHaxBody && haxAutoloader && haxTray && haxCancel) {
      // send that hax store is ready to go so now we can setup the rest
      this.dispatchEvent(
        new CustomEvent("hax-store-ready", {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: true,
        }),
      );
      // normalize the rich teext editor prompts w/ the rest of HAX
      let rtep = globalThis.RichTextEditorPrompt.requestAvailability();
      if (rtep) {
        rtep.shadowRoot.querySelector("#formfields").schematizer =
          HaxSchematizer;
        rtep.shadowRoot.querySelector("#formfields").elementizer =
          HaxElementizer;
      }
      // these operations can be hidden in CMS environments
      if (haxTray.shadowRoot.querySelector("#haxcancelbutton")) {
        // associate the cancel button in the tray to the dialog
        haxCancel.shadowRoot
          .querySelector("#dialog")
          .associateEvents(
            haxTray.shadowRoot.querySelector("#haxcancelbutton"),
          );
        if (!!haxCancel.shadowRoot.querySelector("#dialog")) {
          globalThis.addEventListener(
            "simple-modal-confirmed",
            this._handleConfirmCancel.bind(this),
          );
        }
      }
      this.ready = true;
      // see if a global was used to prevent this check
      // this is useful when in trusted environments where the statement
      // has been consented to in the application this is utilized in
      if (this.skipHAXConfirmation) {
        sessionStorageSet("haxConfirm", true);
        localStorageSet("haxConfirm", true);
      }
      // check for local storage object
      // if not, then store it in sessionStorage so that all our checks
      // and balances are the same. This could allow for storing these
      // settings on a server in theory
      let haxConfirm =
        sessionStorageGet("haxConfirm") || localStorageGet("haxConfirm");
      if (!haxConfirm) {
        // this way it isn't shown EVERY reload, but if they didn't confirm
        // it will show up in the future
        sessionStorageSet("haxConfirm", true);
        let msg = `
      The HAX content editor keeps preferences in order to improve your experience.
      This data is stored in your browser and is never sent anywhere.
      Click to accept.
      `;
        this.toast(msg, "-1", {}, "fit-bottom", "I Accept", "hax-consent-tap");
      } else {
        if (sessionStorageGet("haxConfirm") && !localStorageGet("haxConfirm")) {
          // verify there is something there
          try {
            let globalData = sessionStorageGet("haxUserData")
              ? JSON.parse(sessionStorageGet("haxUserData"))
              : {};
            this.storageData = globalData;
            this._storageDataChanged(this.storageData);
          } catch (e) {}
        } else {
          try {
            let globalData = localStorageGet("haxUserData", {});
            this.storageData = globalData;
            this._storageDataChanged(this.storageData);
          } catch (e) {}
        }
      }
      // register built in primitive definitions
      this._buildPrimitiveDefinitions();

      // load style guide templates early if available
      this._detectStyleGuideTemplates();
    }
  }
  _handleConfirmCancel(e) {
    if (
      e.detail.invokedBy ===
      this.haxTray.shadowRoot.querySelector("#haxcancelbutton")
    ) {
      this.editMode = false;
      this.dispatchEvent(
        new CustomEvent("hax-cancel", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: e.detail,
        }),
      );
    }
  }

  /**
   * Position cursor at the start of the position of the requested node
   */
  _positionCursorInNode(node, position = 0) {
    this.activeHaxBody.positionContextMenus();
    var range = globalThis.document.createRange();
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
    for (let i = 0; i < items.length; i++) {
      // Skip content if not image
      if (items[i].type.indexOf("image") == -1) continue;
      // Retrieve image on clipboard as blob
      var blob = items[i].getAsFile();

      if (typeof callback == "function") {
        return callback(blob);
      }
    }
  }

  // normalize this functionality with what we preovide in the View Source based method
  _onCommand(e) {
    if (e.detail.command && e.detail.command === "removeFormat") {
      this.activeNode.innerHTML = stripMSWord(this.activeNode.innerHTML);
    }
    // @todo this will help with keeping styling and slot in some situation
    // there's still something odd w/ ul/ol in grids that will need explored.
    if (e.detail.command && e.detail.command === "formatBlock") {
      let dataset = { ...this.activeNode.dataset };
      let slot = this.activeNode.slot;
      // the delay allows HAX to switch the element and insert where it used to be
      // after which point we can quickly set these prims that get lost otherwise
      // as this is handled by the browser to do the text editing transform
      // as opposed to HAX directly like web components get :)
      setTimeout(() => {
        for (var i in dataset) {
          if (!i.startsWith("hax")) {
            this.activeNode.dataset[i] = dataset[i];
          }
        }
        // if it had a slot, ensure we maintain that
        if (slot) {
          this.activeNode.setAttribute("slot", slot);
        }
      }, 0);
    }
  }
  /**
   * Intercept paste event and clean it up before inserting the contents
   */
  async _onPaste(e) {
    if (
      // only apply if we're editing, othewise don't listen
      this.editMode &&
      // ensure we're not in the surrounding UI elements that allow pasting
      !["HAX-TRAY", "BODY", "SIMPLE-MODAL", "SUPER-DAEMON"].includes(
        globalThis.document.activeElement.tagName,
      ) &&
      // special test for the table editor as it's a rare element that can accept text
      this.activeNode &&
      this.activeNode.tagName !== "EDITABLE-TABLE"
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
          "text/html",
        );
        // if it is purely plain text it could fail to come across as HTML and be empty
        if (pasteContent == "") {
          pasteContent = (e.originalEvent || e).clipboardData.getData("text");
        }
      } else if (globalThis.clipboardData) {
        pasteContent = globalThis.clipboardData.getData("Text");
      }
      pasteContent = pasteContent.trim();
      // clear empty span tags that can pop up
      pasteContent = pasteContent.replace(/<span>\s*?<\/span>/g, " ");
      //remove styling
      pasteContent = pasteContent.replace(
        /(?:style="(\S+:\s*[^;"]+;\s*)*)+"/g,
        "",
      );
      // clean up div tags that can come in from contenteditable pastes
      // p tags make more sense in the content area
      pasteContent = pasteContent.replace(/<div/g, "<p");
      pasteContent = pasteContent.replace(/<\/div>/g, "</p>");
      originalContent = pasteContent;

      // Check for markdown FIRST (before any other processing)
      // Get the plain text content for markdown detection
      let textContent = "";
      if (e.clipboardData || e.originalEvent.clipboardData) {
        textContent =
          (e.originalEvent || e).clipboardData.getData("text/plain") || "";
      } else if (globalThis.clipboardData) {
        textContent = globalThis.clipboardData.getData("Text") || "";
      }

      // If we detect markdown, prevent default and convert immediately
      if (
        textContent &&
        textContent.length > 0 &&
        textContent.length < 100000 &&
        detectMarkdown(textContent)
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        try {
          const markdownHTML = await markdownToHTML(textContent);
          if (markdownHTML && markdownHTML !== textContent) {
            pasteContent = markdownHTML;
            originalContent = pasteContent;
          }
        } catch (error) {
          console.warn("Failed to convert markdown to HTML:", error);
          // Continue with original content if markdown conversion fails
        }
      }
      // Performance-aware paste handling: check quick binary/blob tests
      // look for base64 like copy and paste of an image from clipboard
      else if (this.isBase64(originalContent)) {
        // stop normal paste
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return this.retrieveImageFromClipboardAsBlob(e, (imageBlob) => {
          // If there's an image, display it in the canvas
          if (imageBlob) {
            // Crossbrowser support for URL
            var URLObj = globalThis.URL || globalThis.webkitURL;
            let img = globalThis.document.createElement("img");
            // turn blob into a url to visualize locally, this is just temporary
            img.src = URLObj.createObjectURL(imageBlob);
            this.activeNode.parentNode.insertBefore(
              img,
              this.activeNode.nextElementSibling,
            );
            for (let i in e.clipboardData.items) {
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
              }),
            );
            return img;
          }
          return false;
        });
      }
      // we have a "file" paste
      else if (
        e.clipboardData &&
        e.clipboardData.files &&
        e.clipboardData.files.length > 0
      ) {
        // stop normal paste
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // generate a place holder p tag to replace on upload
        let p = this.activeHaxBody.haxInsert("p", "", {});
        // cannot believe this actually works
        e.dataTransfer = e.clipboardData;
        for (let i in e.clipboardData.files) {
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
          }),
        );
      }

      // detect word garbage
      let inlinePaste = false;
      // the string to import as sanitized by hax
      let newContent = "";
      // verify this is HTML prior to treating it as such
      // HTML pasting to ensure it's clean is very slow
      // Clean paste content FIRST before any processing
      pasteContent = stripMSWord(pasteContent);

      let fragment = globalThis.document.createElement("div");
      fragment.innerHTML = pasteContent;
      let haxElements = [];

      // Check if we're pasting into the middle of an existing text element (inline paste)
      let range = this.getRange();
      let isInlinePaste = false;
      if (range && this.activeNode && this.isTextElement(this.activeNode)) {
        // If cursor is not at the beginning/end of the element, it's an inline paste
        let selection = this.getSelection();
        if (selection && !selection.isCollapsed) {
          // User has selected text - inline paste
          isInlinePaste = true;
        } else if (
          range.startOffset > 0 &&
          range.startOffset < this.activeNode.textContent.length
        ) {
          // Cursor is in the middle - inline paste
          isInlinePaste = true;
        }
      }

      // Check if we have mixed content (text + inline elements) without proper block wrapper
      // This needs to happen AFTER stripMSWord to work with cleaned content
      let hasTextNodes = Array.from(fragment.childNodes).some(
        (node) =>
          node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "",
      );
      let hasInlineElements = Array.from(fragment.children).some((child) =>
        [
          "strong",
          "em",
          "b",
          "i",
          "a",
          "span",
          "code",
          "mark",
          "sup",
          "sub",
        ].includes(child.tagName.toLowerCase()),
      );
      let hasBlockElements = Array.from(fragment.children).some((child) =>
        this.__validGridTags().includes(child.tagName.toLowerCase()),
      );

      // If we have mixed content without proper block wrapper, wrap it
      // For inline paste, handle mixed content specially to preserve all text
      if (
        (hasTextNodes || hasInlineElements) &&
        !hasBlockElements &&
        fragment.children.length > 0
      ) {
        if (isInlinePaste) {
          // For inline paste, skip HAX element processing and handle directly as HTML
          newContent = pasteContent;
          inlinePaste = true;
          // Skip the rest of the processing and go straight to inline paste handler
        } else {
          pasteContent = `<p>${pasteContent}</p>`;
          fragment.innerHTML = pasteContent; // Update fragment with wrapped content
        }
      }

      // test that this is valid HTML before we dig into it as elements
      // and that it actually has children prior to parsing for children
      // Skip this processing if we already handled inline mixed content above
      if (fragment.children && !(inlinePaste && newContent)) {
        // we force h2 to be highest document level on pasted content
        pasteContent = pasteContent.replace(/<h1>/g, "<h2>");
        pasteContent = pasteContent.replace(/<\/h1>/g, "</h2>");
        // convert all images to place-holder tags and then reference the internal file system object
        // this probably means nothing to the user but MIGHT be a real file in some cases that they
        // could potentially paste / find
        pasteContent = pasteContent.replace(
          /<img src=\"file:(.*?)\/>/g,
          function (placeholder, part) {
            let s = part.split('"');
            return `<place-holder type=\"image\" text=\"file:${s[0]}"></place-holder>`;
          },
        );
        // edges that some things preserve empty white space needlessly
        haxElements = await this.htmlToHaxElements(pasteContent);
        // ensure that if we only have 1 element that we are wrapped correctly
        // as some things enjoy pasted absolute nonesense like a strong tag
        // that wraps all the rest of the content... looking at you Google Docs
        if (
          haxElements.length === 1 &&
          !this.__validGridTags().includes(haxElements[0].tag)
        ) {
          haxElements = await this.htmlToHaxElements(haxElements[0].content);
        }
      }
      // if interpretation as HTML fails then let's ignore this whole thing
      // as we allow normal contenteditable to handle the paste
      // we only worry about HTML structures
      if (haxElements.length === 0 && validURL(pasteContent)) {
        // Check if there's selected text - if so, apply URL as link to selected text
        let range = this.getRange();
        let sel = this.getSelection();
        let selectedText = sel && !sel.isCollapsed ? sel.toString().trim() : "";

        if (selectedText && range) {
          // User has text selected and is pasting a URL - create a link
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          let linkElement = globalThis.document.createElement("a");
          linkElement.setAttribute("href", pasteContent.trim());
          linkElement.setAttribute("target", "_blank");
          linkElement.setAttribute("rel", "noopener noreferrer");
          linkElement.textContent = selectedText;

          range.deleteContents();
          range.insertNode(linkElement);

          // Position cursor after the link
          setTimeout(() => {
            range.setStartAfter(linkElement);
            range.setEndAfter(linkElement);
            sel.removeAllRanges();
            sel.addRange(range);
          }, 0);

          return false;
        }

        // ONLY use this logic if we're on an empty container
        if (this.activeNode.innerText.trim() != "") {
          inlinePaste = true;
        }

        // Instead of immediately processing, trigger Magic Link Wand for user choice
        if (!inlinePaste) {
          // Stop the paste and trigger Magic Link Wand
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Trigger Magic Link Wand with the pasted URL
          if (globalThis.SuperDaemonInstance) {
            // Set the UserScaffold to indicate this is a paste action
            import("@haxtheweb/user-scaffold/user-scaffold.js").then(() => {
              globalThis.UserScaffoldInstance.action = {
                type: "paste",
                architype: "input",
              };
              globalThis.UserScaffoldInstance.data = {
                raw: pasteContent,
                text: pasteContent,
                value: pasteContent,
                architype: "url",
              };

              // Wave the Magic Link Wand
              globalThis.SuperDaemonInstance.waveWand(
                [
                  "",
                  "/",
                  {
                    operation: "url-selected",
                    url: pasteContent.trim(),
                    data: pasteContent,
                    context: "paste",
                  },
                  "hax-link-agent",
                  "Link Agent",
                ],
                this.activeHaxBody,
                "coin2",
              );
            });
          } else {
            // Fallback to original logic if SuperDaemon not available
            let values = {
              source: pasteContent,
              title: pasteContent,
            };
            if (!this.insertLogicFromValues(values, this, false, true)) {
              return false;
            }
          }
          return false;
        }

        // For inline pastes, continue with original logic
        let values = {
          source: pasteContent,
          title: pasteContent,
        };
        // if we DID get a match, block default values
        if (!this.insertLogicFromValues(values, this, false, true)) {
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
        inlinePaste = isInlinePaste; // Use our early detection instead of always true
      }
      // account for incredibly basic pastes of single groups of characters
      else if (
        haxElements.length === 1 &&
        haxElements[0].tag === "a" &&
        haxElements[0].properties.href
      ) {
        // Check if there's selected text - if so, apply URL as link to selected text
        let range = this.getRange();
        let sel = this.getSelection();
        let selectedText = sel && !sel.isCollapsed ? sel.toString().trim() : "";

        if (selectedText && range) {
          // User has text selected and is pasting a URL - create a link
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          let linkElement = globalThis.document.createElement("a");
          linkElement.setAttribute("href", haxElements[0].properties.href);
          linkElement.setAttribute("target", "_blank");
          linkElement.setAttribute("rel", "noopener noreferrer");
          linkElement.textContent = selectedText;

          range.deleteContents();
          range.insertNode(linkElement);

          // Position cursor after the link
          setTimeout(() => {
            range.setStartAfter(linkElement);
            range.setEndAfter(linkElement);
            sel.removeAllRanges();
            sel.addRange(range);
          }, 0);

          return false;
        }

        // ONLY use this logic if we're on an empty container
        if (this.activeNode.innerText.trim() != "") {
          newContent = haxElements[0].properties.href;
          inlinePaste = true;
        } else {
          // Instead of immediately processing, trigger Magic Link Wand for user choice
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Trigger Magic Link Wand with the pasted URL from anchor tag
          if (globalThis.SuperDaemonInstance) {
            import("@haxtheweb/user-scaffold/user-scaffold.js").then(() => {
              globalThis.UserScaffoldInstance.action = {
                type: "paste",
                architype: "input",
              };
              globalThis.UserScaffoldInstance.data = {
                raw: haxElements[0].properties.href,
                text: haxElements[0].properties.href,
                value: haxElements[0].properties.href,
                architype: "url",
              };

              // Wave the Magic Link Wand
              globalThis.SuperDaemonInstance.waveWand(
                [
                  "",
                  "/",
                  {
                    operation: "url-selected",
                    url: haxElements[0].properties.href,
                    data: haxElements[0].properties.href,
                    title: haxElements[0].content,
                    context: "paste",
                  },
                  "hax-link-agent",
                  "Link Agent",
                ],
                this.activeHaxBody,
                "coin2",
              );
            });
          } else {
            // Fallback to original logic if SuperDaemon not available
            let values = {
              source: haxElements[0].properties.href,
              title: haxElements[0].content,
            };
            if (!this.insertLogicFromValues(values, this)) {
              return false;
            }
          }
          return false;
        }
      }
      // account for broken pastes in resolution, just let browser handle it
      else if (!this.isGridPlateElement(haxElements[0])) {
        return false;
      } else {
        for (let i in haxElements) {
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
          newContent += await this.nodeToContent(node);
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
        let newNodes = globalThis.document.createElement("div");
        // defined so that we can
        newNodes.innerHTML = newContent;
        if (range && sel) {
          for (let i in newNodes.children) {
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
            let txt;
            // we got here via an inline paste trap for a URL or other inline content
            if (!validURL(pasteContent)) {
              // For mixed content (text + inline elements), insert all nodes in reverse order
              if (newNodes.childNodes && newNodes.childNodes.length > 1) {
                // Clone the nodes array since we'll be modifying it
                let nodesToInsert = Array.from(newNodes.childNodes);
                let lastInsertedNode = null;
                // Insert all nodes in reverse order (last to first)
                for (let i = nodesToInsert.length - 1; i >= 0; i--) {
                  let nodeToInsert = nodesToInsert[i].cloneNode(true);
                  range.insertNode(nodeToInsert);
                  // Keep track of the first node we insert (which will be the last in document order)
                  if (i === nodesToInsert.length - 1) {
                    lastInsertedNode = nodeToInsert;
                  }
                }
                // Position cursor at the end of the last inserted node
                setTimeout(() => {
                  if (lastInsertedNode) {
                    // If it's a text node, position at the end of the text
                    if (lastInsertedNode.nodeType === Node.TEXT_NODE) {
                      this._positionCursorInNode(
                        lastInsertedNode,
                        lastInsertedNode.textContent.length,
                      );
                    } else {
                      // If it's an element, position after it
                      let newRange = this.getRange();
                      if (newRange) {
                        newRange.setStartAfter(lastInsertedNode);
                        newRange.setEndAfter(lastInsertedNode);
                        let sel = this.getSelection();
                        if (sel) {
                          sel.removeAllRanges();
                          sel.addRange(newRange);
                        }
                      }
                    }
                  }
                }, 0);
                // Don't insert anything else, we're done
                return;
              } else if (newNodes.children && newNodes.children.length > 0) {
                while (newNodes.childNodes.length > 1) {
                  let nodeToInsert = Array.from(newNodes.childNodes).pop();
                  range.insertNode(nodeToInsert);
                }
                // this should append the HTML elements / textnodes correctly
                txt = Array.from(newNodes.childNodes).pop();
              } else {
                // just make a text node if this is NODE a link
                txt = globalThis.document.createTextNode(newNodes.innerHTML);
              }
            } else {
              // make a link because we have something that looks like one
              // and we passed all above checks
              txt = globalThis.document.createElement("a");
              txt.setAttribute("href", pasteContent);
              txt.setAttribute("rel", "noopener noreferrer");
              txt.setAttribute("target", "_blank");
              txt.innerText = pasteContent;
            }
            // Only insert txt if it exists (not for mixed content case)
            if (txt) {
              range.deleteContents();
              range.insertNode(txt);
            }
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
              globalThis.document.execCommand("insertParagraph");
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
                    activeEl,
                  );
                  _enterSplit = false;
                } else if (siblingEl.parentNode) {
                  siblingEl.parentNode.insertBefore(
                    activeEl,
                    siblingEl.nextElementSibling,
                  );
                } else {
                  siblingEl.insertBefore(
                    activeEl,
                    siblingEl.nextElementSibling,
                  );
                }
              }
              // attempt insert after active
              else if (this.activeNode) {
                if (this.activeNode.getAttribute("slot")) {
                  activeEl.setAttribute(
                    "slot",
                    this.activeNode.getAttribute("slot"),
                  );
                }
                // if we have an empty element we are hitting paste on
                // then leverage it for the 1st item as opposed to making a new line
                if (this.activeNode.innerText.trim() == "") {
                  this.activeHaxBody.haxReplaceNode(this.activeNode, activeEl);
                } else {
                  this.activeNode.parentNode.insertBefore(
                    activeEl,
                    this.activeNode.nextElementSibling,
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
              if (
                activeEl &&
                activeEl.childNodes &&
                activeEl.childNodes.length > 0
              ) {
                // Position cursor at the end of the last child node to ensure it's at the end of content
                let lastChild =
                  activeEl.childNodes[activeEl.childNodes.length - 1];
                if (lastChild.nodeType === Node.TEXT_NODE) {
                  // If last child is a text node, position at end of text
                  this._positionCursorInNode(
                    lastChild,
                    lastChild.textContent.length,
                  );
                } else {
                  // If last child is an element, try to find the deepest last text node
                  let deepestTextNode =
                    this._findDeepestLastTextNode(lastChild);
                  if (deepestTextNode) {
                    this._positionCursorInNode(
                      deepestTextNode,
                      deepestTextNode.textContent.length,
                    );
                  } else {
                    // Fallback to positioning after the element
                    let range = this.getRange();
                    let sel = this.getSelection();
                    if (range && sel) {
                      range.setStartAfter(lastChild);
                      range.setEndAfter(lastChild);
                      sel.removeAllRanges();
                      sel.addRange(range);
                    }
                  }
                }
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
  /**
   * Helper method to find the deepest last text node within an element
   * Used for proper cursor positioning at the end of content
   */
  _findDeepestLastTextNode(element) {
    if (!element || !element.childNodes) {
      return null;
    }

    // Work backwards through child nodes to find the last text node or element with text
    for (let i = element.childNodes.length - 1; i >= 0; i--) {
      let node = element.childNodes[i];
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        return node;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recursively search in the element
        let deeperTextNode = this._findDeepestLastTextNode(node);
        if (deeperTextNode) {
          return deeperTextNode;
        }
      }
    }

    return null;
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
      "section",
      "dl",
      "dd",
      "dt",
      "figure",
    ];
  }
  // internal list of HTML primatives which are valid
  __validTags() {
    return [
      "p",
      "div",
      "span",
      "mark",
      "abbr",
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
      "pre",
      "blockquote",
      "code",
      "figure",
      "figcaption",
      "img",
      "iframe",
      "video",
      "audio",
      "picture",
      "section",
      "dl",
      "dt",
      "dd",
      "template",
      "webview",
      "time",
      "cite",
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
      "document",
      "archive",
      "markdown",
      "html",
      "content",
      "text",
      "gif",
      "inline",
      "*",
    ];
  }
  /**
   * Created life-cycle to ensure a single global store.
   */
  constructor() {
    super();
    enableServices(["core"]);
    this.toastShowEventName = globalThis.HAXCMS
      ? "haxcms-toast-show"
      : "simple-toast-show";
    this.t = {
      close: "Close",
    };
    // customizations to daemon
    if (
      typeof globalThis.speechSynthesis !== "undefined" &&
      (globalThis.SpeechRecognition ||
        globalThis.webkitSpeechRecognition ||
        globalThis.mozSpeechRecognition ||
        globalThis.msSpeechRecognition ||
        globalThis.oSpeechRecognition)
    ) {
      SuperDaemonInstance.voiceSearch = true;
    }
    SuperDaemonInstance.icon = "hax:wizard-hat";
    // ensure we are running HAX / ready and in edit mode before allowing commands to go through
    SuperDaemonInstance.allowedCallback = () => {
      if (this.ready && this.editMode) {
        return true;
      }
      return false;
    };

    // emoji picker
    SuperDaemonInstance.defineOption({
      title: "Insert emoji",
      icon: "editor:insert-emoticon",
      tags: ["emoji"],
      value: {
        name: "Insert emoji",
        context: "/",
        program: async (input, values) => {
          let results = [];
          let txt = globalThis.document.createElement("textarea");
          await Object.keys(globalThis.SimplePickerEmojis).forEach(
            async (category) => {
              await globalThis.SimplePickerEmojis[category].forEach(
                async (emoji) => {
                  if (input == "" || emoji.description.includes(input)) {
                    txt.innerHTML = emoji.value;
                    results.push({
                      title: emoji.description,
                      textCharacter: txt.value,
                      tags: [category],
                      value: {
                        target: this,
                        method: "_insertTextResult",
                        args: [txt.value],
                      },
                      context: ["/", "/HAX/text/emoji/" + txt.value],
                      eventName: "super-daemon-element-method",
                      path: "/HAX/text/emoji/" + txt.value,
                    });
                  }
                },
              );
            },
          );
          return results;
        },
      },
      context: ["HAX", "/"],
      eventName: "super-daemon-run-program",
      path: "/HAX/text/emoji",
    });

    // symbol picker
    SuperDaemonInstance.defineOption({
      title: "Insert symbol",
      icon: "editor:functions",
      tags: ["symbol"],
      value: {
        name: "Insert symbol",
        context: "/",
        program: async (input, values) => {
          let results = [];
          let txt = globalThis.document.createElement("textarea");
          await Object.keys(globalThis.SimplePickerSymbols).forEach(
            async (category) => {
              await globalThis.SimplePickerSymbols[category].forEach(
                async (symbol) => {
                  if (input == "" || category.includes(input)) {
                    txt.innerHTML = symbol.value;
                    results.push({
                      title: `${category}: ${txt.value}`,
                      textCharacter: txt.value,
                      tags: [category],
                      value: {
                        target: this,
                        method: "_insertTextResult",
                        args: [txt.value],
                      },
                      context: ["/", "/HAX/text/symbol/" + txt.value],
                      eventName: "super-daemon-element-method",
                      path: "/HAX/text/symbol/" + txt.value,
                    });
                  }
                },
              );
            },
          );
          return results;
        },
      },
      context: ["HAX", "/"],
      eventName: "super-daemon-run-program",
      path: "/HAX/text/symbol",
    });

    // contribution helpers
    SuperDaemonInstance.defineOption({
      title: "Join our Community",
      icon: "hax:discord",
      priority: -100,
      tags: ["community", "discord", "chat", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://bit.ly/hax-discord"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/join",
      context: ["logged-in", "CMS", "HAX"],
    });
    SuperDaemonInstance.defineOption({
      title: "User Tutorials",
      icon: "hax:hax2022",
      priority: -1000,
      tags: ["Documentation", "community", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://haxtheweb.org/tutorials"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/tutorials",
      context: ["logged-in", "CMS", "HAX"],
    });
    SuperDaemonInstance.defineOption({
      title: "User Documentation",
      icon: "hax:hax2022",
      tags: ["Documentation", "community", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://haxtheweb.org/documentation"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/documentation",
      context: ["logged-in", "CMS", "HAX"],
    });
    SuperDaemonInstance.defineOption({
      title: "HAX Teaching Excellence",
      icon: "hax:hax2022",
      tags: ["Ontology", "community", "pedagogy", "documentation", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://haxtheweb.org/ontology"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/pedagogy",
      context: ["logged-in", "CMS", "HAX"],
    });
    SuperDaemonInstance.defineOption({
      title: "Bug / issue",
      icon: "mdi-social:github-circle",
      tags: ["Bug report", "github", "git", "community", "issue queue"],
      value: {
        target: this,
        method: "_haxStoreContribute",
        args: ["bug", "POP,bug"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/contribute",
      context: ["logged-in", "CMS", "HAX"],
    });
    SuperDaemonInstance.defineOption({
      title: "Idea / Feature request",
      icon: "mdi-social:github-circle",
      tags: [
        "Feature request",
        "idea",
        "github",
        "git",
        "community",
        "issue queue",
      ],
      value: {
        target: this,
        method: "_haxStoreContribute",
        args: ["feature", "POP,enhancement"],
      },
      context: ["logged-in", "CMS", "HAX"],
      eventName: "super-daemon-element-method",
      path: "HAX/community/contribute",
    });
    // container for HTML primatives to have hooks declared on their behalf
    this.primativeHooks = {};
    this.__dragTarget = null;
    this.registerLocalization({
      context: this,
      namespace: "hax",
      basePath: import.meta.url + "/../../",
      // Remove locales array to rely on manifest-based detection
    });
    this.appSearch = null;
    this.method = "GET";
    this.haxSelectedText = "";
    this.__winEvents = {
      "hax-super-daemon-insert-tag": "_superDaemonInsert",
      "hax-register-properties": "_haxStoreRegisterProperties",
      "hax-consent-tap": "_haxConsentTap",
      onbeforeunload: "_onBeforeUnload",
      paste: "_onPaste",
      command: "_onCommand",
      "hax-register-app": "_haxStoreRegisterApp",
      "hax-register-stax": "_haxStoreRegisterStax",
      "hax-register-core-piece": "_haxStorePieceRegistrationManager",
      "hax-register-body": "_haxStoreRegisterBody",
      "hax-insert-content": "_haxStoreInsertContent",
      "hax-insert-content-array": "_haxStoreInsertMultiple",
      "hax-refresh-tray-form": "refreshActiveNodeForm",
      "rich-text-editor-prompt-open": "_richTextEditorPromptOpen",
      "rich-text-editor-prompt-confirm": "_richTextEditorPromptConfirm",
    };
    // prevent leaving if we are in editMode
    globalThis.onbeforeunload = (e) => {
      if (!this.skipExitTrap && this.editMode) {
        var saving =
          "Are you sure you want to leave? Your work will not be saved!";
        e.returnValue = saving;
        return saving;
      }
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
        padding: 0;
        margin: 0;
        font-size: 14px;
        line-height: 20px;
      }
      simple-popover-manager h3 {
        margin: 8px 2px;
      }`,
    });
    this.skipHAXConfirmation = false;
    this.storageData = {};
    this.appStore = {
      url: "",
      params: {},
    };
    this.daemonKeyCombo = `${SuperDaemonInstance.key1} + ${SuperDaemonInstance.key2} + `;
    this.activeNode = null;
    this.activeEditingElement = null;
    this.haxBodies = [];
    this.activePlaceHolder = null;
    this.activePlaceHolderOperationType = null;
    this.activePlaceHolderCallback = null;
    this.sessionObject = {};
    this.editMode = false;
    this.skipExitTrap = false;
    this.appStoreLoaded = false;
    this.elementList = {};
    //if hax-tray-elementAlign exists use that other wise left
    this.elementAlign = localStorageGet("hax-tray-elementAlign");
    if (!this.elementAlign || this.elementAlign == null) {
      this.elementAlign = "left";
    }
    this.trayStatus = "collapsed";
    this.trayDetail = "content-edit";
    this.appList = [];
    this.gizmoList = [];
    this.recentGizmoList =
      UserScaffoldInstance.readMemory("recentGizmoList") || [];
    this.haxAutoloader = null;
    this.activeHaxBody = null;
    this.haxTray = null;
    this.haxCancel = null;
    this.staxList = [];
    this.globalPreferences = {};
    this.activeApp = {};
    this.connectionRewrites = {};
    // change this in order to debug voice commands
    this.daemonCommands = {};
    // keyboard shortcuts, implementing haxHook: gizmoRegistration can ovewrite these as needed
    // these are basic markdown shortcuts
    this.keyboardShortcuts = {
      "#": { tag: "h2", content: "" },
      "##": { tag: "h3", content: "" },
      "###": { tag: "h4", content: "" },
      "####": { tag: "h5", content: "" },
      "#####": { tag: "h6", content: "" },
      "######": { tag: "h6", content: "" },
      "1.": { tag: "ol", content: "<li></li>" },
      "-": { tag: "ul", content: "<li></li>" },
      "*": { tag: "ul", content: "<li></li>" },
      "+": { tag: "ul", content: "<li></li>" },
      "---": { tag: "hr" },
      "***": { tag: "hr" },
      ___: { tag: "hr" },
      "```": { tag: "code", content: "" },
      ">": { tag: "blockquote", content: "" },
    };
    // used for helping to build out the primitives schemas
    this.__primsBuilder = {
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
      dl: {
        title: "Data list",
        icon: "editor:format-list-bulleted",
      },
      dt: {
        title: "Data term",
        icon: "editor:format-list-bulleted",
      },
      dd: {
        title: "Data definition",
        icon: "editor:format-list-bulleted",
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
        tags: ["Writing", "h2", "html", "text", "heading", "header"],
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
        handles: [
          {
            type: "inline",
            text: "text",
          },
        ],
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
      pre: {
        title: "Preformatted",
        icon: "icons:code",
      },
      time: {
        title: "Time",
        icon: "icons:code",
      },
      cite: {
        title: "Citation",
        icon: "icons:code",
      },
      embed: {
        title: "Embedded object",
        icon: "icons:fullscreen",
      },
      picture: {
        title: "Picture",
        icon: "image:image",
      },
    };
    this.validTagList = this.__validTags();
    this.validGridTagList = this.__validGridTags();
    this.validGizmoTypes = this.__validGizmoTypes();
    this.styleGuideSchema = {};
    // test for sandboxed env
    let test = globalThis.document.createElement("webview");
    this._isSandboxed = typeof test.reload === "function";
    globalThis.document.body.style.setProperty("--hax-ui-headings", "#d4ff77");
    // mobx
    makeObservable(this, {
      daemonKeyCombo: observable,
      gizmoList: observable,
      recentGizmoList: observable,
      activeNode: observable,
      globalPreferences: observable,
      activeGizmo: computed,
      activeNodeIndex: computed,
      editMode: observable,
      elementAlign: observable,
      trayStatus: observable,
      trayDetail: observable,
      appList: observable,
      activeApp: observable,
      haxSelectedText: observable,
      activeEditingElement: observable,
      activeHaxBody: observable,
      appStoreLoaded: observable,
    });
    autorun(() => {
      this._globalPreferencesChanged(toJS(this.globalPreferences));
    });
    autorun(() => {
      this._editModeChanged(toJS(this.editMode));
    });
    // when recent updates anywhere, write this to memory
    autorun(() => {
      const recentGizmoList = toJS(this.recentGizmoList);
      if (recentGizmoList.length > 6) {
        recentGizmoList.length = 6;
      }
      // prevent writing to memory while we are writing to memory
      // so that MobX doesn't loop on itself
      if (recentGizmoList.length > 0 && !this.__writingMemory) {
        this.__writingMemory = true;
        UserScaffoldInstance.writeMemory(
          "recentGizmoList",
          recentGizmoList,
          "long",
        );
      } else {
        this.__writingMemory = false;
      }
    });
  }
  pushWithLimit(array, element, limit) {
    array.push(element);

    if (array.length > limit) {
      array.shift(); // Remove the first element (oldest)
    }
  }
  // select the text in question and insert in the correct location
  async _insertTextResult(text) {
    this.activeNode.focus();
    // @todo seems to insert at the end always
    if (SuperDaemonInstance.activeRange) {
      SuperDaemonInstance.activeRange.setStart(this.activeNode, 0);
      SuperDaemonInstance.activeRange.collapse(true);
      SuperDaemonInstance.activeSelection.removeAllRanges();
      SuperDaemonInstance.activeSelection.addRange(
        SuperDaemonInstance.activeRange,
      );
      SuperDaemonInstance.activeSelection.selectAllChildren(this.activeNode);
      SuperDaemonInstance.activeSelection.collapseToEnd();
    }
    setTimeout(() => {
      if (this.activeNode.textContent == "") {
        this.activeNode.textContent = text;
      } else {
        globalThis.document.execCommand("insertHTML", false, text);
      }
    }, 0);
  }

  _openExternalLink(link) {
    globalThis.open(link, "_blank");
  }

  async _haxStoreContribute(type, tags, daemonTerm = null) {
    let body = "";
    if (type == "merlin") {
      var title = `[${type}] New command request from HAX daemon`;
      body = `Location: ${globalThis.location.href}
Merlin command: ${daemonTerm}
What did you want merlin to do?
`;
    } else {
      var title = `[${type}] User report from HAX daemon`;
      body = `Location: ${globalThis.location.href}
Browser: ${navigator.userAgent}
OS: ${this.getOperatingSystem()} - ${navigator.deviceMemory}GB RAM - ${navigator.hardwareConcurrency} cores
Screen: ${globalThis.screen.width}x${globalThis.screen.height}
Window size: ${globalThis.innerWidth}x${globalThis.innerHeight}
`;
      if (navigator.getBattery) {
        const stats = await globalThis.navigator.getBattery();
        body += `Battery: ${stats.level * 100}%
`;
      }
      // some things report the "type" of internet connection speed
      // for terrible connections lets save frustration
      if (
        navigator.connection &&
        globalThis.navigator.connection.effectiveType
      ) {
        body += `Connection: ${navigator.connection.effectiveType}
`;
      }
      body += `${type == "feature" ? `Your idea:` : `Bug you experienced:`}
`;
    }
    globalThis.open(
      `https://github.com/haxtheweb/issues/issues/new?assignees=&labels=${tags}&template=issue-report.md&title=${title}&body=${encodeURIComponent(
        body,
      )}`,
      "_blank",
    );
  }

  /**
   * @description - Gets operating system from browser navigator
   * @returns {string} - The operating system either from userAgentData (if supported) with userAgent as back up
   */
  getOperatingSystem() {
    if (navigator.userAgentData && navigator.userAgentData.platform) {
      return navigator.userAgentData.platform;
    } else {
      const USER_AGENT = navigator.userAgent.toLowerCase();
      if (USER_AGENT.includes("windows")) {
        return "Windows";
      } else if (USER_AGENT.includes("iphone")) {
        return "iOS";
      } else if (USER_AGENT.includes("mac os")) {
        return "macOS";
      } else if (USER_AGENT.includes("linux")) {
        return "Linux";
      } else if (USER_AGENT.includes("android")) {
        return "Android";
      } else {
        return "Unknown";
      }
    }
  }

  async _richTextEditorPromptOpen(e) {
    if (e.detail.element && e.detail.element.gizmo.tag) {
      const fakeNode = globalThis.document.createElement(
        e.detail.element.gizmo.tag,
      );
      // @see haxHook: setupActiveElementForm - allow elements to modify the properties to be rendered
      if (HAXStore.testHook(fakeNode, "setupActiveElementForm")) {
        await HAXStore.runHook(fakeNode, "setupActiveElementForm", [
          e.detail.element,
        ]);
      }
    }
    // support contextual hax hooks for active item form overwrites

    // verify that we are not overflowing, a lot of themes have this ability
    // which renders hax popups very difficult / unreliable to work with
    const compStyles = globalThis.getComputedStyle(globalThis.document.body);
    if (compStyles.getPropertyValue("overflow") == "hidden") {
      this.__overflowHiddenOnOpen = compStyles.getPropertyValue("overflow");
      globalThis.document.body.style.overflow = "auto";
    }
    setTimeout(() => {
      const actions = globalThis.document
        .querySelector("rich-text-editor-prompt")
        .shadowRoot.querySelector("simple-popover");
      if (typeof actions.scrollIntoViewIfNeeded === "function") {
        actions.scrollIntoViewIfNeeded(true);
      } else {
        actions.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "center",
        });
      }
    }, 100);
  }
  // set things back on close event
  _richTextEditorPromptConfirm(e) {
    const target =
      e.detail.value && e.detail.value.target ? e.detail.value.target : null;
    setTimeout(() => {
      // hack for newly created links
      if (this.activeNode.tagName === "A" && target) {
        this.activeNode.setAttribute("target", target);
        this.refreshActiveNodeForm();
      }
    }, 0);
    if (this.__overflowHiddenOnOpen) {
      globalThis.document.body.style.overflow = this.__overflowHiddenOnOpen;
      this.__overflowHiddenOnOpen = null;
    }
  }

  /**
   * Build HAX property definitions for primitives that we support.
   * @note if someone wants to MANUALLY inject definitions similar
   * to how this is doing so they can with this hack from a global
   * application context. This is going to inject a definition
   * at run time that's for a theoretical tag defined with this
   * but that hasn't been used yet.
    globalThis.addEventListener("hax-store-ready", function(e) {
        setTimeout(() => {
          globalThis.HaxStore.requestAvailability().setHaxProperties(globalThis.customElements.get('instruction-card').haxProperties, 'instruction-card');
        }, 1000);
      });
    });
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
        designSystem: {
          card: true,
          primary: true,
        },
        canEditSource: true,
        settings: {
          configure: [
            {
              attribute: "src",
              title: "Source",
              description: "The URL for this resource.",
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
    let img = {
      canScale: true,
      type: "element",
      designSystem: {
        card: true,
        primary: true,
      },
      editingElement: "core",
      canEditSource: true,
      gizmo: {
        title: "Basic Image",
        description: "A basic img tag",
        icon: "image:image",
        color: "blue-grey",
        tags: ["Media", "media", "img", "html"],
        handles: [],
        meta: {
          author: "W3C",
        },
      },
      settings: {
        configure: [
          {
            attribute: "src",
            title: "Source",
            description: "The URL for this image.",
            inputMethod: "haxupload",
            noVoiceRecord: true,
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
      demoSchema: [
        {
          tag: "img",
          content: "",
          properties: {
            src: "https://cdn2.thecatapi.com/images/9j5.jpg",
            loading: "lazy",
          },
        },
      ],
    };
    this.setHaxProperties(img, "img");
    let figure = {
      canScale: true,
      type: "grid",
      canEditSource: true,
      gizmo: {
        title: "Figure",
        description: "A basic figure tag",
        icon: "hax:figure",
        color: "blue-grey",
        tags: ["Media", "media", "figure", "html"],
        requiresChildren: "figcaption",
        handles: [],
        meta: {
          author: "W3C",
          hidden: true,
        },
      },
      settings: {
        configure: [],
      },
      demoSchema: [
        {
          tag: "figure",
          properties: {},
          content:
            '<img src="https://dummyimage.com/300x200/000/fff" alt="image other media here">\n<figcaption><p>Image Caption Here</p></figcaption>',
        },
      ],
    };
    this.setHaxProperties(figure, "figure");
    let figcaption = {
      canScale: true,
      type: "grid",
      editingElement: "core",
      canEditSource: true,
      gizmo: {
        title: "Figure caption",
        description: "Used inside of a figure tag",
        icon: "image:image",
        color: "blue-grey",
        tags: ["Media", "media", "caption", "figure", "html"],
        handles: [],
        requiresParent: "figure",
        meta: {
          author: "W3C",
          hidden: true,
        },
      },
      settings: {
        configure: [
          {
            slot: "",
            title: "Figure Caption",
            description: "Caption for the figure",
            inputMethod: "code-editor",
          },
        ],
      },
      demoSchema: [
        {
          tag: "figcaption",
          properties: {},
          content: "Image Caption Here",
        },
      ],
    };
    this.setHaxProperties(figcaption, "figcaption");
    let mark = {
      type: "element",
      editingElement: "core",
      canScale: false,
      designSystem: {
        primary: true,
      },
      canEditSource: true,
      contentEditable: true,
      gizmo: {
        title: "Highlight",
        description: "Highlight text within a block of content",
        icon: "editor:highlight",
        color: "yellow",
        tags: ["Content", "text", "highlight", "mark", "html"],
        handles: [],
        meta: {
          author: "W3C",
          hidden: true,
        },
      },
      settings: {
        configure: [
          {
            attribute: "innerText",
            title: "Text",
            description: "Text of the highlight",
            inputMethod: "textfield",
            required: true,
          },
        ],
        advanced: [],
        developer: [],
      },
      demoSchema: [
        {
          tag: "mark",
          content: "Highlight me",
          properties: {},
        },
      ],
    };
    this.setHaxProperties(mark, "mark");
    let abbr = {
      type: "element",
      editingElement: "core",
      canScale: false,
      designSystem: {
        primary: true,
      },
      canEditSource: true,
      contentEditable: true,
      gizmo: {
        title: "Abbreviation",
        description: "Simple abbreviation with tooltip of full word",
        icon: "hax:abbr",
        color: "yellow",
        tags: ["Content", "text", "abbr", "html"],
        handles: [],
        meta: {
          author: "W3C",
          hidden: true,
        },
      },
      settings: {
        configure: [
          {
            attribute: "innerText",
            title: "Text",
            description: "Text that is visible, the abbreviation",
            inputMethod: "textfield",
            required: true,
          },
          {
            attribute: "title",
            title: "Word",
            description: "Word that the abbreviation is representing",
            inputMethod: "textfield",
            required: true,
          },
        ],
        advanced: [],
        developer: [],
      },
      demoSchema: [
        {
          tag: "abbr",
          content: "Abbr",
          properties: {
            title: "Abbreviation",
          },
        },
      ],
    };
    this.setHaxProperties(abbr, "abbr");
    let ahref = {
      type: "element",
      editingElement: "core",
      canScale: false,
      designSystem: {
        accent: true,
      },
      canEditSource: true,
      contentEditable: true,
      gizmo: {
        title: "Basic link",
        description: "A basic a tag",
        icon: "icons:link",
        color: "blue-grey",
        tags: [
          "Resource",
          "link",
          "a",
          "url",
          "html",
          "href",
          "address",
          "http",
        ],
        handles: [],
        meta: {
          author: "W3C",
        },
      },
      settings: {
        configure: [
          {
            attribute: "href",
            title: "Link",
            description: "The URL for the link",
            inputMethod: "haxupload",
            required: true,
            validationType: "url",
          },
          {
            attribute: "innerText",
            title: "Text",
            description: "Text of the link",
            inputMethod: "textfield",
            required: true,
          },
          {
            attribute: "target",
            title: "Target",
            description: "Where to open the link.",
            inputMethod: "select",
            options: {
              "": "Same window",
              _blank: "New window - _blank",
              _top: "Top window - _top",
              _parent: "Parent window - _parent",
            },
          },
        ],
        advanced: [],
        developer: [
          {
            attribute: "title",
            title: "Title text",
            description: "Useful for screen readers and improved SEO.",
            inputMethod: "textfield",
          },
          {
            attribute: "rel",
            title: "rel",
            description:
              "Specifies the relationship between this document and the opened globalThis.document. Change as part of security or SEO policy.",
            inputMethod: "select",
            options: {
              noopener: "noopener",
              "noopener noreferrer": "noopener noreferrer",
              "nofollow ": "nofollow",
              "noopener noreferrer nofollow": "noopener noreferrer nofollow",
              opener: "opener",
            },
          },
        ],
      },
      demoSchema: [
        {
          tag: "p",
          content: '<a href="#">Link to content</a>',
          properties: {},
        },
      ],
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
      designSystem: true,
      canEditSource: true,
      contentEditable: true,
      gizmo: {
        title: "Paragraph",
        description: "A basic text area",
        icon: "hax:paragraph",
        color: "blue-grey",
        tags: ["Writing", "p", "paragraph", "text", "html"],
        handles: [
          {
            type: "content",
            title: "innerHTML",
            alt: "title",
          },
        ],
        meta: {
          author: "W3C",
          outlineDesigner: true, // you sly dog you..
        },
      },
      settings: {
        configure: [],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "p",
          content: "Deep thoughts..",
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
        import: "@haxtheweb/editable-table/editable-table.js",
        callback: this.setupEditableTable.bind(this),
      },
      canScale: true,
      canEditSource: false,
      gizmo: {
        title: "Table",
        description: "A table for displaying data",
        icon: "image:grid-on",
        color: "blue-grey",
        tags: [
          "Instructional",
          "table",
          "data",
          "html",
          "grid",
          "matrix",
          "spreadsheet",
          "csv",
          "excel",
        ],
        meta: {
          hidden: true,
          author: "W3C",
        },
      },
      settings: {
        configure: [],
        advanced: [],
      },
    };
    this.setHaxProperties(table, "table");
    // kinda silly but need the definitions for editable-table as well
    let eTable = globalThis.document.createElement("editable-table");
    this.haxAutoloader.appendChild(eTable);
    // iframe needs a wrapper or you can't select them because of the spec
    let iframe = {
      type: "element",
      editingElement: {
        tag: "iframe-loader",
        import: "@haxtheweb/iframe-loader/iframe-loader.js",
        callback: this.setupIframeLoader.bind(this),
      },
      canScale: false,
      designSystem: {
        card: true,
        primary: true,
      },
      canEditSource: false,
      gizmo: {
        title: "iFrame",
        description: "A basic way to frame external web content",
        icon: "hax:iframe",
        color: "blue-grey",
        tags: [
          "Resource",
          "iframe",
          "content",
          "url",
          "link",
          "embed",
          "https",
          "html",
          "address",
        ],
        handles: [],
        meta: {
          author: "W3C",
          hidden: true,
        },
      },
      settings: {
        configure: [
          {
            attribute: "src",
            title: "Source",
            description: "The URL for this resource.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url",
          },
        ],
      },
    };
    this.setHaxProperties(iframe, "iframe");
    // gets the definition in by force as if iframes don't exist
    let iframeLoader = globalThis.document.createElement("iframe-loader");
    this.haxAutoloader.appendChild(iframeLoader);
    for (let tag in this.__primsBuilder) {
      let primContentDemo = "";
      if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
        primContentDemo = "Heading";
      } else if (tag == "ul" || tag == "ol") {
        primContentDemo = "<li>Item</li><li>Item</li>";
      }
      this.setHaxProperties(
        {
          type: "element",
          editingElement: "core",
          canScale: false,
          designSystem: ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)
            ? {
                text: true,
                card: true,
                primary: true,
                designTreatment: true,
              }
            : ["ol", "ul"].includes(tag)
              ? {
                  text: true,
                  card: true,
                  accent: true,
                  primary: true,
                }
              : false,
          canEditSource: true,
          contentEditable: true,
          gizmo: {
            title: this.__primsBuilder[tag].title,
            icon: this.__primsBuilder[tag].icon,
            tags: this.__primsBuilder[tag].tags || [
              "Writing",
              tag,
              "html",
              "text",
            ],
            handles: this.__primsBuilder[tag].handles || [],
            meta: {
              author: "W3C",
              inlineOnly: [
                "em",
                "b",
                "strong",
                "i",
                "strike",
                "u",
                "sub",
                "sup",
                "span",
                "code",
                "time",
                "cite",
              ].includes(tag)
                ? true
                : false,
              hidden: ["h1", "h2", "h3", "h4", "ul"].includes(tag)
                ? false
                : true,
              outlineDesigner: ["h2", "ul"].includes(tag) ? true : false, // Oh no you didn't..
            },
          },
          settings: {
            configure: [],
            advanced: [],
          },
          saveOptions: ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)
            ? {
                unsetAttributes: ["data-original-level"],
              }
            : {},
          demoSchema: [
            {
              tag: tag,
              content: primContentDemo,
              properties: {},
            },
          ],
        },
        tag,
      );
    }
    let hr = {
      canScale: true,
      type: "element",
      editingElement: "core",
      designSystem: {
        primary: true,
      },
      canEditSource: false,
      contentEditable: true,
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
            "data-width": "50",
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
   * set up the editableTable to behave as the node itself
   */
  setupEditableTable(editor) {
    this.activeNode = editor;
    setTimeout(() => {
      editor.editMode = true;
      editor.focus();
    }, 0);
  }
  /**
   * set up the iframeLoader to behave as the node itself
   */
  setupIframeLoader(editor) {
    this.activeNode = editor;
    // SHOULD set this itself but just to be sure
    setTimeout(() => {
      editor.disabled = true;
    }, 0);
  }
  /**
   * Insert content in the body.
   */
  async _haxStoreInsertContent(e) {
    if (e.detail) {
      let details = e.detail;
      if (globalThis.customElements.get(details.tag)) {
        let prototypeNode = globalThis.document.createElement(details.tag);
        // @see haxHooks: preProcessInsertContent
        if (this.testHook(prototypeNode, "preProcessInsertContent")) {
          details = await this.runHook(
            prototypeNode,
            "preProcessInsertContent",
            [details, this.activeNode],
          );
        }
      }
      var properties = {};
      // support for properties to be set automatically optionally
      if (typeof details.properties !== typeof undefined) {
        properties = details.properties;
      }

      // Apply style guide defaults for elements inserted via Super Daemon or other insert methods
      // Check if this is coming from a context where we want to apply style guide defaults
      const styleGuideOverride = this._getStyleGuideSchemaOverride(details.tag);
      if (
        styleGuideOverride &&
        styleGuideOverride.demoSchema &&
        styleGuideOverride.demoSchema[0]
      ) {
        const demo = styleGuideOverride.demoSchema[0];
        if (demo.properties) {
          // Merge style guide properties with existing properties
          // Existing properties take precedence over style guide defaults
          properties = { ...demo.properties, ...properties };
        }
      }
      // Special handling for gallery creation
      if (
        properties._isGalleryCreation &&
        properties._originalImageElement &&
        properties._newImageSource
      ) {
        this._createImageGallery(
          properties._originalImageElement,
          properties._newImageSource,
        );
        return;
      }
      
      // Handle single image gallery creation (Magic File Wand)
      if (properties._isSingleImageGallery && properties._imageSource) {
        this._createSingleImageGallery(properties._imageSource);
        return;
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
          if (this.activeHaxBody.__slot && this.activeNode.haxLayoutContainer) {
            this.activeNode.appendChild(node);
          } else {
            this.activeNode.parentNode.insertBefore(node, this.activeNode);
          }
        } else {
          this.activeHaxBody.haxReplaceNode(this.activeNode, node);
        }
      } else if (
        this.activeNode &&
        this.activeNode.parentNode &&
        this.activeNode.parentNode.tagName != "HAX-BODY"
      ) {
        let node = haxElementToNode({
          tag: details.tag,
          content: details.content,
          properties: properties,
        });
        // allow for inserting things into things but not grid plate
        if (this.activeNode.parentNode.haxLayoutContainer) {
          // support slot if we have one on the activeNode (most likely)
          if (this.activeNode.getAttribute("slot") != null) {
            node.setAttribute("slot", this.activeNode.getAttribute("slot"));
          }
          this.activeHaxBody.haxInsert(
            details.tag,
            details.content,
            properties,
          );
        } else {
          this.activeHaxBody.haxInsert(
            details.tag,
            details.content,
            properties,
          );
        }
      } else {
        this.activeHaxBody.haxInsert(details.tag, details.content, properties);
      }
    }
  }
  /**
   * if given a schema, returns slots as array
   *
   * @param {object} schema
   * @param {boolean} [optionalOnly=false]
   * @returns {array}
   * @memberof HaxStore
   */
  slotsFromSchema(schema, optionalOnly = false) {
    let settings = schema ? schema.settings : {},
      slotsList = [];
    return Object.keys({ ...(settings || {}) })
      .map((setting) =>
        (settings[setting] || []).filter((prop) => {
          let show = !optionalOnly || !prop.required;
          if (
            (!!prop.slot || prop.slot === "") &&
            !slotsList.includes(prop.slot) &&
            show
          ) {
            slotsList.push(prop.slot);
            return true;
          } else {
            return false;
          }
        }),
      )
      .flat();
  }
  /**
   * Check if style guide has schema overrides for a tag
   */
  _getStyleGuideSchemaOverride(tag) {
    if (this.styleGuideSchema && this.styleGuideSchema[tag]) {
      return this.styleGuideSchema[tag];
    }
    return null;
  }

  /**
   * get the schema from a tag
   */
  haxSchemaFromTag(tag) {
    if (tag && tag.toLowerCase) {
      tag = tag.toLowerCase();
      if (this.elementList && this.elementList[tag]) {
        let schema = { ...this.elementList[tag] };

        // Check for style guide overrides
        const styleGuideOverride = this._getStyleGuideSchemaOverride(tag);
        if (styleGuideOverride && styleGuideOverride.demoSchema) {
          schema.demoSchema = styleGuideOverride.demoSchema;
        }

        return schema;
      }
    }
    return {};
  }
  /**
   * Optional send array, to improve performance and event bubbling better
   */
  _haxStoreInsertMultiple(e) {
    if (e.detail) {
      var properties;
      for (let i in e.detail) {
        properties = {};
        // support for properties to be set automatically optionally
        if (typeof e.detail[i].properties !== typeof undefined) {
          properties = e.detail[i].properties;
        }
        this.activeHaxBody.haxInsert(
          e.detail[i].tag,
          e.detail[i].content,
          properties,
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
      // allow this to verify if everything is here or not
      clearTimeout(this.__storeReady);
      this.__storeReady = setTimeout(() => {
        this._storePiecesAllHere(
          this.haxAutoloader,
          this.activeHaxBody,
          this.haxTray,
          this.haxCancel,
        );
      }, 0);
    }
  }
  // divert this event at haxTray
  _superDaemonInsert(e) {
    if (
      SuperDaemonInstance.programTarget &&
      e.detail.properties &&
      (e.detail.properties.src ||
        e.detail.properties.source ||
        e.detail.properties.href)
    ) {
      SuperDaemonInstance.programTarget.value =
        e.detail.properties.src ||
        e.detail.properties.source ||
        e.detail.properties.href;
    } else {
      this.haxTray._processTrayEvent(e);
    }
    SuperDaemonInstance.programTarget = null;
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
    if (
      globalThis.document.head.createShadowRoot ||
      globalThis.document.head.attachShadow
    ) {
      return true;
    } else {
      console.warn("Shadow DOM missing, certain operations hidden");
      return false;
    }
  }

  /**
   * Notice that an app was set in HAX; register it
   */
  _haxStoreRegisterApp(e) {
    if (e.detail) {
      const app = e.detail;
      app.index = this.appList.length;
      this.appList = [...this.appList, app];
      this.write("appList", toJS(this.appList), this);
      let defaultType = "media";
      if (
        app.connection.operations &&
        app.connection.operations.browse &&
        app.connection.operations.browse.resultMap &&
        app.connection.operations.browse.resultMap.defaultGizmoType
      ) {
        defaultType =
          app.connection.operations.browse.resultMap.defaultGizmoType;
      }
      // slash command context
      SuperDaemonInstance.defineOption({
        title: "Search " + app.details.title,
        icon: app.details.icon,
        tags: ["Search", ...app.details.tags, defaultType],
        more:
          app.details.tos && app.details.tos.length > 0
            ? html`<div class="tos-text">Terms of service:</div>
                <ul class="tos-text">
                  ${app.details.tos.map((item) => {
                    return html`
                      <li>
                        <a
                          href="${item.link}"
                          target="_blank"
                          rel="noopener nofollow noreferrer"
                          >${item.title}</a
                        >
                      </li>
                    `;
                  })}
                </ul>`
            : null,
        value: {
          name: "Search " + app.details.title,
          context: "/",
          index: app.index,
          detail: app,
          program: async (input, values) => {
            const t1 = toJS(HAXStore.activeApp);
            const t2 = toJS(HAXStore.appList[values.index]);
            if (t1.index != t2.index) {
              HAXStore.activeApp = toJS(HAXStore.appList[values.index]);
            }
            let queryParam = Object.keys(
              values.detail.connection.operations.browse.search,
            )[0];
            let searchDataMap = {};
            searchDataMap[queryParam] = input;
            HAXStore.appSearch.updateSearchValues(searchDataMap);
            let data = await HAXStore.appSearch.loadAppData();
            let results = [];
            await data.forEach(async (item) => {
              var map = item.map;
              var gizmoType = item.type;
              // sanity check as well as guessing based on type if we absolutely have to
              if (
                (!gizmoType ||
                  gizmoType == null ||
                  gizmoType == "" ||
                  gizmoType == "undefined") &&
                map.source
              ) {
                gizmoType = HAXStore.guessGizmoType(map);
              }
              let haxElements = HAXStore.guessGizmo(
                gizmoType,
                map,
                false,
                true,
              );
              // see if we got anything
              if (haxElements.length > 0) {
                if (typeof haxElements[0].tag !== typeof undefined) {
                  haxElements[0].nextToActive = true;
                }
              }
              results.push({
                title: item.title,
                image: item.image,
                tags: [],
                value: {
                  value: haxElements[0].tag,
                  eventName: "insert-tag",
                  properties: haxElements[0].properties,
                },
                context: ["/", "/sources/" + app.details.title.toLowerCase()],
                eventName: "hax-super-daemon-insert-tag",
                path: "/sources/" + app.details.title.toLowerCase(),
              });
            });
            return results;
          },
        },
        context: ["HAX", "/"],
        eventName: "super-daemon-run-program",
        path: "/sources/" + app.details.title.toLowerCase(),
        priority: app.details.title.toLowerCase() === "local files" ? -100 : 0,
      });
      // preconnect apps at registration time
      if (app.connection && app.connection.protocol && app.connection.url) {
        let preconnectlink = globalThis.document.createElement("link");
        preconnectlink.rel = "preconnect";
        preconnectlink.href =
          app.connection.protocol + "://" + app.connection.url;
        globalThis.document.head.appendChild(preconnectlink);
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
      const newStax = e.detail;

      // Check for duplicates based on data-haxsg-id if available
      const newHaxsgId = newStax.details && newStax.details.haxsgId;
      if (newHaxsgId) {
        const existingStax = this.staxList.find(
          (stax) => stax.details && stax.details.haxsgId === newHaxsgId,
        );

        // If duplicate found, don't add it
        if (existingStax) {
          // Remove the element after processing to clean up
          if (
            typeof e.target.parentElement !== typeof undefined &&
            e.target.parentElement.tagName === "HAX-STORE"
          ) {
            e.target.parentElement.removeChild(e.target);
          }
          return;
        }
      }

      newStax.index = this.staxList.length;
      this.staxList = [...this.staxList, newStax];
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
  // allow modification of the activation toggle in active body
  // this allows outside tags to inform the hax-body that they
  // are going to modify it's lightDOM children but that it
  // does NOT want it to process the changes
  // example; lightDom insert moved to shadow / processed differently
  // in a way not intended for users to actually have access to modify
  // after the fact
  activeBodyIgnoreActive(status) {
    this.activeHaxBody.__ignoreActive = status;
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
   * Convert HTML into HAX Elements; if its valid HTML
   */
  async htmlToHaxElements(html) {
    let elements = [];
    let fragment = globalThis.document.createElement("div");
    fragment.innerHTML = html;
    // test that this is valid HTML before we dig into it as elements
    // and that it actually has children prior to parsing for children
    if (fragment.children) {
      // page template is a valid tag in this context
      const validTags = [...this.validTagList, "page-template"];
      const children = fragment.children;
      // loop over the new nodes
      for (let i = 0; i < children.length; i++) {
        // verify this tag is a valid one
        if (
          typeof children[i].tagName !== typeof undefined &&
          validTags.includes(children[i].tagName.toLowerCase())
        ) {
          elements.push(await nodeToHaxElement(children[i], null));
        }
      }
    }
    return elements;
  }

  /**
   * Check if style guide content is available and detect page-template elements
   * This is called during app store loading to register any available templates
   */
  async _detectStyleGuideTemplates() {
    try {
      // Check if we have access to HAXcms store for style guide content
      if (
        typeof globalThis.HAXCMS !== "undefined" &&
        globalThis.HAXCMS &&
        globalThis.HAXCMS.instance
      ) {
        const styleGuideContent =
          await globalThis.HAXCMS.instance.store.loadStyleGuideContent();
        if (styleGuideContent) {
          await this.detectAndRegisterPageTemplateStax(styleGuideContent);
        }
      }
    } catch (error) {
      // Style guide may not be available in all contexts, which is fine
    }
  }

  /**
   * Force app store loading if it hasn't loaded yet
   * This can be called from external contexts like the style guide route
   */
  async forceAppStoreLoad() {
    // Only force load if not already loaded and we have the necessary pieces
    if (
      !this.appStoreLoaded &&
      this.ready &&
      this.__appStoreData &&
      this.haxAutoloader
    ) {
      await this._loadAppStoreData(this.__appStoreData);
    }
    // Also try to trigger from appStore property if set
    else if (
      !this.appStoreLoaded &&
      this.appStore &&
      this.appStore.url &&
      this.haxAutoloader
    ) {
      this.loadAppStoreFromRemote();
    }
  }

  /**
   * Detect page-template elements from style guide content and register them as stax or demoSchema
   * Multi-child templates become stax, single-child templates replace demoSchema for that element
   * Uses the same HAX schema conversion approach as the style guide system
   * @param {string} styleGuideContent - The HTML content of the style guide
   */
  async detectAndRegisterPageTemplateStax(styleGuideContent) {
    if (!styleGuideContent) {
      return;
    }

    try {
      // Convert style guide content to HAXSchema elements using existing method
      const styleGuideElements =
        await this.htmlToHaxElements(styleGuideContent);

      for (const styleElement of styleGuideElements) {
        // Look for page-template elements
        if (styleElement && styleElement.tag === "page-template") {
          // Get template name, schema, and haxsg-id from properties
          const templateName =
            styleElement.properties && styleElement.properties.name;
          const templateSchema =
            (styleElement.properties && styleElement.properties.schema) ||
            "area";
          const haxsgId =
            styleElement.properties && styleElement.properties["data-haxsg-id"];

          if (templateName && styleElement.content) {
            // Convert the content inside page-template to HAX elements
            const templateContentElements = await this.htmlToHaxElements(
              styleElement.content,
            );

            if (templateContentElements && templateContentElements.length > 0) {
              if (templateSchema === "block") {
                // Block templates: replace demoSchema for the specific element type
                if (templateContentElements.length === 1) {
                  await this._updateElementDemoSchema(
                    templateContentElements[0],
                  );
                }
              } else if (
                templateSchema === "area" ||
                templateSchema === "page"
              ) {
                // Area or Page templates: register as stax template
                const staxData = {
                  details: {
                    title: templateName,
                    image: "",
                    author: "Style Guide",
                    description: `Template: ${templateName}`,
                    status: "available",
                    rating: "0",
                    tags: ["template", "style-guide", templateSchema],
                    templateType: templateSchema, // Add templateType for filtering
                    haxsgId: haxsgId, // Store the haxsg-id for deduplication
                  },
                  stax: templateContentElements, // Use the HAX elements directly (excludes page-template wrapper)
                };

                // Create and register the stax element
                let stax = globalThis.document.createElement("hax-stax");
                stax.data = staxData;
                this.appendChild(stax);
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn("Error detecting page-template elements:", error);
    }
  }

  /**
   * Update the demoSchema for an element based on page-template content
   * @param {Object} haxElement - HAX element schema from page-template content
   */
  async _updateElementDemoSchema(haxElement) {
    if (!haxElement || !haxElement.tag) {
      return;
    }

    try {
      const tagName = haxElement.tag;

      // Create new demoSchema entry based on the page-template content
      const newDemoSchema = {
        tag: tagName,
        properties: haxElement.properties || {},
        content: haxElement.content || "",
      };

      // Store in styleGuideSchema for later lookup
      if (!this.styleGuideSchema[tagName]) {
        this.styleGuideSchema[tagName] = {};
      }
      this.styleGuideSchema[tagName].demoSchema = [newDemoSchema];
    } catch (error) {
      console.warn("Error updating element demoSchema:", error);
    }
  }

  /**
   * Convert a node to the correct content object for saving.
   * This DOES NOT acccept a HAXElement which is similar
   */
  async nodeToContent(node) {
    // @see haxHooks: preProcessNodeToContent
    if (this.testHook(node, "preProcessNodeToContent")) {
      node = await this.runHook(node, "preProcessNodeToContent", [node]);
    }
    // preprocess could have destroyed the node in the process
    if (node && !node.tagName) {
      return node;
    }
    let tag = node.tagName.toLowerCase();
    // support sandboxed environments which
    // will hate iframe tags but love webview
    if (this._isSandboxed && tag === "webview") {
      tag = "iframe";
    }
    // force any and all content being taken from a dom node to content to be forced into sandbox mode
    // this way we can ensure that we don't have any scripts running that confuse the user into
    // leaking sensative information
    if (tag === "iframe") {
      node.setAttribute("sandbox", "allow-scripts allow-same-origin");
    }

    var content = "";
    // start to rebuild the same tag we got in a generalized way
    content += "<" + tag;
    // account for things that say NOT to save slot values
    var props = this.elementList[tag];
    var propvals = {};
    // prevent these from being put in the DOM
    var badAttributes = [
      "data-hax-ray",
      "data-hax-layout",
      "data-hax-grid",
      "data-hax-active",
      '="true"',
      "contenteditable",
      "draggable",
      "role",
      "t",
    ];
    // remove any attributes that are not allowed
    for (let i = 0; i < badAttributes.length; i++) {
      node.removeAttribute(badAttributes[i]);
    }
    removeBadJSEventAttributes(node);
    // grab all of the original's attributes, and pass them to the replacement
    for (let j = 0, l = node.attributes.length; j < l; ++j) {
      var nodeName = node.attributes.item(j).nodeName;
      var value = node.attributes.item(j).value;
      // encode objects and arrays because they are special
      if (
        nodeName != "style" &&
        (typeof value === typeof Object || value.constructor === Array)
      ) {
        propvals[nodeName] = JSON.stringify(value).replace(
          new RegExp('"', "g"),
          "&quot;",
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
            value = value.replace(new RegExp("&", "g"), "&amp;");
            value = value.replace(new RegExp('"', "g"), "&quot;");
            value = value.replace(new RegExp("<", "g"), "&#60;");
            value = value.replace(new RegExp(">", "g"), "&#62;");
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
    if (globalThis.customElements.get(tag)) {
      tmpProps = globalThis.customElements.get(tag).properties;
    }
    // weak fallback
    if (typeof tmpProps === typeof undefined) {
      tmpProps = node.__data;
    }
    if (typeof tmpProps !== typeof undefined) {
      for (let j in tmpProps) {
        // skip innerHTML and innerText as they should be handled as content, not attributes
        if (j === "innerHTML" || j === "innerText") {
          continue;
        }
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
                "&quot;",
              );
            } else if (typeof value === "object" && value != {}) {
              propvals[nodeName] = JSON.stringify(value).replace(
                new RegExp('"', "g"),
                "&quot;",
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
                value = value.replace(new RegExp("&", "g"), "&amp;");
                value = value.replace(new RegExp('"', "g"), "&quot;");
                value = value.replace(new RegExp("<", "g"), "&#60;");
                value = value.replace(new RegExp(">", "g"), "&#62;");
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
      for (let i in props.saveOptions.unsetAttributes) {
        delete propvals[props.saveOptions.unsetAttributes[i]];
      }
    }
    // specialized clean up for some that can leak through from above
    // and are edge case things because #hashtag gotta love HTML attributes
    // and the webview tag. facepalm.
    let delProps = ["inner-text", "inner-html", "tabindex", "guestinstance"];
    for (let delProp in delProps) {
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
    delete propvals.role;
    delete propvals.t;
    delete propvals["data-hax-ray"];
    delete propvals["data-hax-layout"];
    delete propvals["data-hax-grid"];
    delete propvals["data-hax-active"];
    if (propvals.class == "") {
      delete propvals.class;
    }
    // run through the rest and print to the dom
    for (let i in propvals) {
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
        for (let j = 0, len2 = slotnodes.length; j < len2; j++) {
          if (typeof slotnodes[j].tagName !== typeof undefined) {
            // if we're a custom element, keep digging, otherwise a simple
            // self append is fine unless template tag cause it's a special
            // case for the web in general as it'll register as not a primative
            // even though it is...
            if (
              (!this.HTMLPrimativeTest(slotnodes[j]) ||
                (this.HTMLPrimativeTest(slotnodes[j]) &&
                  slotnodes[j].children.length > 0)) &&
              slotnodes[j].tagName !== "TEMPLATE"
            ) {
              content += await this.nodeToContent(slotnodes[j]);
            } else {
              for (let i = 0; i < badAttributes.length; i++) {
                slotnodes[j].removeAttribute(badAttributes[i]);
              }
              removeBadJSEventAttributes(slotnodes[j]);
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
            content += htmlEntities(slotnodes[j].textContent);
          }
        }
      }
    }
    // @see haxHooks: progressiveEnhancement
    if (this.testHook(node, "progressiveEnhancement")) {
      content += await this.runHook(node, "progressiveEnhancement", [node]);
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
    content = content.replace(/ data-hax-active="(\s|.)*?"/gim, "");
    content = content.replace(/ class=""/gim, "");
    content = content.replace(/ style=""/gim, "");
    content = content.replace(/ contenteditable="(\s|.)*?"/gim, "");
    content = content.replace(/ t="(\s|.)*?"/gim, "");
    // wipe pure style spans which can pop up on copy paste if we didn't catch it
    // also ensure that we then remove purely visual chars laying around
    // this also helps clean up when we did a normal contenteditable paste
    // as opposed to our multi-element sanitizing option that we support
    content = content.replace(/<span style="(.*?)">/gim, "<span>");
    content = content.replace(/<span>\s*?<\/span>/g, " ");
    content = content.replace(/<span><br\/><\/span>/gm, "");
    // account for things that on normal paste would pick up too many css vars
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
    // @see haxHooks: postProcessNodeToContent
    if (this.testHook(node, "postProcessNodeToContent")) {
      content = await this.runHook(node, "postProcessNodeToContent", [content]);
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
    const appList = toJS(this.appList);
    let targets = appList.filter((app) => {
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
  async refreshActiveNodeForm() {
    this.haxTray.activeHaxElement = await nodeToHaxElement(
      this.haxTray.activeNode,
      null,
    );
    await this.haxTray._setupForm();
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
  async getHAXSlot(node) {
    // we can skip all of this if we have a text element / HTML prim!
    if (this.isTextElement(node)) {
      return node.innerHTML;
    }
    let content = "";
    var slotnodes = node.childNodes;
    // ensure there's something inside of this
    if (slotnodes.length > 0) {
      // loop through everything found in the slotted area and put it back in
      for (let j = 0, len2 = slotnodes.length; j < len2; j++) {
        if (!slotnodes[j]) return;
        if (typeof slotnodes[j].tagName !== typeof undefined) {
          // if we're a custom element, keep digging, otherwise a simple
          // self append is fine.
          if (slotnodes[j].tagName.indexOf("-") > 0) {
            content += "  " + (await this.nodeToContent(slotnodes[j])) + "\n";
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
  async _haxStoreRegisterProperties(e) {
    if (e.detail && e.detail.properties && e.detail.tag) {
      // only register tag if we don't know about it already
      if (!this.elementList[e.detail.tag]) {
        let detail = e.detail;
        detail.properties = await this.attemptGizmoTranslation(
          detail.tag,
          detail.properties,
        );

        // look for a gizmo; it's not required, technically.
        let gizmo = detail.properties.gizmo;
        if (gizmo) {
          gizmo.tag = detail.tag;

          let gizmos = this.gizmoList;
          gizmos.push(gizmo);
          this.gizmoList = [...gizmos];
          this.write("gizmoList", gizmos, this);
          // only add in support for commands we'd expect to see
          if (!gizmo.meta || (!gizmo.meta.inlineOnly && !gizmo.meta.hidden)) {
            SuperDaemonInstance.defineOption({
              title: gizmo.title,
              icon: gizmo.icon,
              tags: gizmo.tags || [],
              value: {
                value: gizmo.tag,
                eventName: "insert-tag",
                demoSchema: true,
              },
              context: ["HAX"],
              eventName: "hax-super-daemon-insert-tag",
              path: "HAX/insert/block/" + gizmo.tag,
            });
          }
        }
        this.elementList[detail.tag] = detail.properties;
        // only push new values on if we got something new
        if (
          !this.validTagList.find((element) => {
            return element === detail.tag;
          })
        ) {
          this.validTagList.push(detail.tag);
        }
        // push to grid list IF this marks itself as a grid
        if (
          detail.properties.type == "grid" &&
          !this.validGridTagList.find((element) => {
            return element === detail.tag;
          })
        ) {
          this.validGridTagList.push(detail.tag);
        }
        // @see haxHook: gizmoRegistration - allow elements to define their own
        // custom functionality to run when a gizmo is registered
        //console.warn(e.detail.tag);
        if (
          globalThis.customElements.get(e.detail.tag) &&
          this.testHook(
            globalThis.document.createElement(e.detail.tag),
            "gizmoRegistration",
          )
        ) {
          await this.runHook(
            globalThis.document.createElement(e.detail.tag),
            "gizmoRegistration",
            [this],
          );
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
  // find node index / order based on
  get activeNodeIndex() {
    let nodeLookup = null;
    if (this.activeNode) {
      Array.from(toJS(this.activeHaxBody).children).map((el, i) => {
        if (
          toJS(this.activeNode) === el ||
          toJS(this.activeNode).parentElement === el
        ) {
          nodeLookup = i;
        }
      });
    }
    return nodeLookup;
  }
  async attemptGizmoTranslation(tag, properties) {
    // support locales if available and not default lang
    var translationMap = await I18NManagerStore.loadNamespaceFile(
      tag + ".haxProperties",
    );
    // if we have a map, rewrite the matching properties within the objects
    if (
      !translationMap &&
      globalThis.customElements.get(tag) &&
      globalThis.customElements.get(tag).haxProperties
    ) {
      translationMap = globalThis.customElements.get(tag).haxProperties;
      // support
      if (typeof translationMap === "string") {
        translationMap = await fetch(translationMap).then((response) => {
          if (response && response.json) return response.json();
          return false;
        });
      }
    }
    if (translationMap) {
      // gizmo shows user text
      if (properties.gizmo && translationMap.gizmo) {
        for (let i in translationMap.gizmo) {
          properties.gizmo[i] = translationMap.gizmo[i];
        }
      }
      // settings pages
      if (properties.settings && translationMap.settings) {
        let sTabs = {
          advanced: "advanced",
          configure: "configure",
        };
        for (let h in sTabs) {
          if (properties.settings[h] && translationMap.settings[h]) {
            for (let i in translationMap.settings[h]) {
              for (let j in translationMap.settings[h][i]) {
                properties.settings[h][i][j] = translationMap.settings[h][i][j];
              }
            }
          }
        }
      }
      // demo schema can be rewritten too
      if (properties.demoSchema && translationMap.demoSchema) {
        for (let i in translationMap.demoSchema) {
          if (translationMap.demoSchema[i].properties) {
            for (let j in translationMap.demoSchema[i].properties) {
              properties.demoSchema[i].properties[j] =
                translationMap.demoSchema[i].properties[j];
            }
          }
        }
      }
    }
    return properties;
  }
}
globalThis.customElements.define(HaxStore.tag, HaxStore);
export { HaxStore };
// window bridge for external projects that want to account for HAX
// yet don't want to require it as part of an import chain
globalThis.HaxStore = globalThis.HaxStore || {};
globalThis.HaxStore.requestAvailability = function () {
  if (!globalThis.HaxStore.instance) {
    globalThis.HaxStore.instance =
      globalThis.document.createElement("hax-store");
    globalThis.document.body.appendChild(globalThis.HaxStore.instance);
  }
  return globalThis.HaxStore.instance;
};
// export the singleton so everyone can directly reference it
export const HAXStore = globalThis.HaxStore.requestAvailability();

// debugging / developer console shortcuts
globalThis.Hax = globalThis.Hax || {};
globalThis.Hax.add = function (tag) {
  if (HAXStore.elementList[tag]) {
    // generate schema from the tag
    let schema = HAXStore.haxSchemaFromTag(tag);
    let target;
    if (schema.gizmo.tag && schema.demoSchema && schema.demoSchema[0]) {
      target = haxElementToNode(schema.demoSchema[0]);
    } else {
      target = globalThis.document.createElement(tag);
    }
    HAXStore.activeHaxBody.haxReplaceNode(HAXStore.activeNode, target);
    HAXStore.activeHaxBody.__focusLogic(target);
  } else {
    // do nothing, we tried to be a pro but failed :(
    HAXStore.toast(`${tag} is not a valid tag`);
  }
};
globalThis.Hax.delete = function () {
  if (HAXStore.activeNode != null) {
    HAXStore.activeHaxBody.haxDeleteNode(HAXStore.activeNode);
  }
};
globalThis.Hax.duplicate = function () {
  HAXStore.activeHaxBody.haxDuplicateNode(HAXStore.activeNode);
};

globalThis.Hax.move = function (dir = true) {
  if (dir) {
    HAXStore.activeHaxBody.haxMoveGridPlate(HAXStore.activeNode, -1);
  } else {
    HAXStore.activeHaxBody.haxMoveGridPlate(HAXStore.activeNode);
  }
};

globalThis.Hax.grid = function (op = true) {
  HAXStore.activeHaxBody.haxGridPlateOps(op);
};

globalThis.Hax.set = function (key, value) {
  HAXStore.write(key, value, window);
};

globalThis.Hax.get = function (key) {
  return HAXStore[key];
};

globalThis.Hax.export = async function () {
  return await HAXStore.activeHaxBody.haxToContent();
};

globalThis.Hax.import = function (htmlContent = "<p></p>") {
  return HAXStore.activeHaxBody.importContent(htmlContent);
};
