/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { JSONOutlineSchemaItem } from "./lib/json-outline-schema-item.js";
// register globally so we can make sure there is only one
window.JSONOutlineSchema = window.JSONOutlineSchema || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same json-outline-schema element, making it a singleton.
window.JSONOutlineSchema.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!window.JSONOutlineSchema.instance) {
    window.JSONOutlineSchema.instance = document.createElement(
      "json-outline-schema"
    );
    document.body.appendChild(window.JSONOutlineSchema.instance);
  }
  return window.JSONOutlineSchema.instance;
};
/**
 * `json-outline-schema`
 * `JS based state management helper for the json outline schema spec`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */

class JsonOutlineSchema extends HTMLElement {
  // render function
  get html() {
    return `
<style>:host {
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: 1em 0px;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "json-outline-schema";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    // set tag for later use
    this.tag = JsonOutlineSchema.tag;
    // optional queue for future use
    this._queue = [];
    this.template = document.createElement("template");

    this.attachShadow({ mode: "open" });

    if (!delayRender) {
      this.render();
    }
    this.__ready = false;
    this.file = null;
    this.id = this.generateUUID();
    this.title = "New site";
    this.author = "";
    this.description = "";
    this.license = "by-sa";
    this.metadata = {};
    this.items = [];
    this.__debug = false;
    window.JSONOutlineSchema.instance = this;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }

    if (this._queue.length) {
      this._processQueue();
    }
    window.addEventListener(
      "json-outline-schema-debug-toggle",
      this._toggleDebug.bind(this)
    );
    const evt = new CustomEvent("json-outline-schema-ready", {
      bubbles: true,
      cancelable: false,
      detail: true
    });
    this.dispatchEvent(evt);
    this.__ready = true;
  }

  _copyAttribute(name, to) {
    const recipients = this.shadowRoot.querySelectorAll(to);
    const value = this.getAttribute(name);
    const fname = value == null ? "removeAttribute" : "setAttribute";
    for (const node of recipients) {
      node[fname](name, value);
    }
  }

  _queueAction(action) {
    this._queue.push(action);
  }

  _processQueue() {
    this._queue.forEach(action => {
      this[`_${action.type}`](action.data);
    });

    this._queue = [];
  }

  _setProperty({ name, value }) {
    this[name] = value;
  }

  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      "json-outline-schema-debug-toggle",
      this._toggleDebug.bind(this)
    );
    const evt = new CustomEvent("json-outline-schema-unready", {
      bubbles: true,
      cancelable: false,
      detail: true
    });
    this.dispatchEvent(evt);
  }
  /**
   * Get a clone of this JSONOutlineSchema object
   * @return Object
   */
  clone() {
    const schema = {
      id: this.id,
      title: this.title,
      author: this.author,
      description: this.description,
      license: this.license,
      metadata: this.metadata,
      items: this.items
    };
    const obj = JSON.parse(JSON.stringify(schema));
    return obj;
  }
  /**
   * Get a new item matching schema standards
   * @return new JSONOutlineSchemaItem Object
   */
  newItem() {
    return new JSONOutlineSchemaItem();
  }
  /**
   * Add an item to the outline
   * @var item an array of values, keyed to match JSON Outline Schema
   * @return count of items in the array
   */
  addItem(item) {
    let safeItem = this.validateItem(item);
    count = array_push(this.items, safeItem);
    return count;
  }
  /**
   * Validate that an item matches JSONOutlineSchemaItem format
   * @var item JSONOutlineSchemaItem
   * @return JSONOutlineSchemaItem matching the specification
   */
  validateItem(item) {
    // create a generic schema item
    let tmp = new JSONOutlineSchemaItem();
    for (var key in tmp) {
      // only set what the element from spec allows into a new object
      if (typeof item[key] !== typeof undefined) {
        tmp[key] = item[key];
      }
    }
    return tmp;
  }
  /**
   * Remove an item from the outline if it exists
   * @var id an id that's in the array of items
   * @return JSONOutlineSchemaItem or false if not found
   */
  removeItem(id) {
    for (var key in this.items) {
      if (this.items[key].id == id) {
        let tmp = this.items[key];
        delete this.items[key];
        return tmp;
      }
    }
    return false;
  }
  /**
   * Remove an item from the outline if it exists
   * @var id an id that's in the array of items
   * @return JSONOutlineSchemaItem or false if not found
   */
  updateItem(item, save = false) {
    // verify this is a legit item
    let safeItem = this.validateItem(item);
    for (var key in this.items) {
      // match the current item's ID to our safeItem passed in
      if (this.items[key].id == safeItem.id) {
        // overwrite the item
        this.items[key] = safeItem;
        // if we save, then we let that return the whole file
        if (save) {
          return this.save();
        }
        // this was successful
        return true;
      }
    }
    // we didn't find a match on the ID to bother saving an update
    return false;
  }
  /**
   * Load a schema from a file
   */
  load(location) {
    if (location) {
      this.file = location;
      let fileData = json_decode(file_get_contents(location));
      for (var key in fileData) {
        if (typeof this[key] !== typeof undefined && key !== "items") {
          this[key] = fileData[key];
        }
      }
      // check for items and escalate to full JSONOutlineSchemaItem object
      // also ensures data matches only what is supported
      if (isset(fileData.items)) {
        for (var key in fileData.items) {
          let newItem = new JSONOutlineSchemaItem();
          newItem.id = item.id;
          newItem.indent = item.indent;
          newItem.location = item.location;
          newItem.order = item.order;
          newItem.parent = item.parent;
          newItem.title = item.title;
          newItem.description = item.description;
          // metadata can be anything so whatever
          newItem.metadata = item.metadata;
          this.items[key] = newItem;
        }
      }
      return true;
    }
    return false;
  }
  /**
   * Save data back to the file system location
   */
  save() {
    let schema = {
      id: this.id,
      title: this.title,
      author: this.author,
      description: this.description,
      license: this.license,
      metadata: this.metadata,
      items: this.items
    };
    // @todo write contents
    //return @file_put_contents(this.file, JSON.stringify(schema, null, 2));
    return JSON.stringify(schema, null, 2);
  }
  /**
   * Generate a UUID
   */
  generateUUID() {
    return "ss-s-s-s-sss".replace(/s/g, this._uuidPart);
  }
  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  /**
   * Allow toggling of debug mode which visualizes the outline and writes it to console.
   */
  _toggleDebug(e) {
    this.__debug = !this.__debug;
    this._triggerDebugPaint(this.__debug);
  }
  /**
   * Paint the slot in order to debug the object inside
   */
  _triggerDebugPaint(debug) {
    if (debug) {
      let obj = {
        file: this.file,
        id: this.id,
        title: this.title,
        author: this.author,
        description: this.description,
        license: this.license,
        metadata: this.metadata,
        items: this.items
      };
      let span = document.createElement("span");
      span.innerHTML = JSON.stringify(obj, null, 2);
      this.shadowRoot.appendChild(span.cloneNode(true));
    } else {
      this.render();
    }
  }
  static get observedAttributes() {
    return ["file", "id", "title", "author", "description", "license"];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (this.__debug) {
      this.render();
      this._triggerDebugPaint(this.__debug);
    }
  }
  get file() {
    return this.getAttribute("file");
  }
  set file(newValue) {
    if (this.__ready) {
      this.setAttribute("file", newValue);
    }
  }
  get id() {
    return this.getAttribute("id");
  }
  set id(newValue) {
    if (this.__ready) {
      this.setAttribute("id", newValue);
    }
  }
  get title() {
    return this.getAttribute("title");
  }
  set title(newValue) {
    if (this.__ready) {
      this.setAttribute("title", newValue);
    }
  }
  get author() {
    return this.getAttribute("author");
  }
  set author(newValue) {
    if (this.__ready) {
      this.setAttribute("author", newValue);
    }
  }
  get description() {
    return this.getAttribute("description");
  }
  set description(newValue) {
    if (this.__ready) {
      this.setAttribute("description", newValue);
    }
  }
  get license() {
    return this.getAttribute("license");
  }
  set license(newValue) {
    if (this.__ready) {
      this.setAttribute("license", newValue);
    }
  }
  /**
   * Set individual key values pairs on metdata so we can notice it change
   */
  updateMetadata(key, value) {
    this.metadata[key] = value;
    if (this.__debug) {
      this.render();
      this._triggerDebugPaint(this.__debug);
    }
  }
}
window.customElements.define(JsonOutlineSchema.tag, JsonOutlineSchema);
export { JsonOutlineSchema };
