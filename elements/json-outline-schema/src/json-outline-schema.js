/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { JSONOutlineSchemaItem } from "./lib/json-outline-schema-item.js";
// register globally so we can make sure there is only one
globalThis.JSONOutlineSchema = globalThis.JSONOutlineSchema || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same json-outline-schema element, making it a singleton.
globalThis.JSONOutlineSchema.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (
    !globalThis.JSONOutlineSchema.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.JSONOutlineSchema.instance = globalThis.document.createElement(
      "json-outline-schema",
    );
    globalThis.document.body.appendChild(globalThis.JSONOutlineSchema.instance);
  }
  return globalThis.JSONOutlineSchema.instance;
};
/**
 * `json-outline-schema`
 * `JS based state management helper for the json outline schema spec`
 * @demo demo/index.html Demo
 * @demo demo/listing.html Listing
 * @element json-outline-schema
 */
class JsonOutlineSchema extends HTMLElement {
  // render function
  get html() {
    return `
<style>
:host {
  display: block;
}
:host([debug]) {
  font-family: monospace;
  white-space: pre;
  margin: 16px 0px;
}
:host([hidden]) {
  display: none;
}
        </style>
<slot></slot>`;
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
    this.windowControllers = new AbortController();
    // set tag for later use
    this.tag = JsonOutlineSchema.tag;
    this.template = globalThis.document.createElement("template");

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
    this.debug = false;
    globalThis.JSONOutlineSchema.instance = this;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.styleElement(this);
    }

    globalThis.addEventListener(
      "json-outline-schema-debug-toggle",
      this._toggleDebug.bind(this),
      { signal: this.windowControllers.signal },
    );

    const evt = new CustomEvent("json-outline-schema-ready", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: true,
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

  _setProperty({ name, value }) {
    this[name] = value;
  }

  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    const evt = new CustomEvent("json-outline-schema-unready", {
      bubbles: true,
      cancelable: false,
      detail: true,
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
      items: this.items,
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
    this.items.push(safeItem);
    return this.items.length;
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
  async load(location) {
    if (location) {
      this.file = location;
      let data = await fetch(location).then(function (response) {
        return response.text();
      });
      let fileData = JSON.parse(data);
      for (var key in fileData) {
        if (typeof this[key] !== typeof undefined && key !== "items") {
          this[key] = fileData[key];
        }
      }
      // check for items and escalate to full JSONOutlineSchemaItem object
      // also ensures data matches only what is supported
      if (fileData.items) {
        for (var key in fileData.items) {
          let item = fileData.items[key];
          let newItem = new JSONOutlineSchemaItem();
          newItem.id = item.id;
          newItem.indent = item.indent;
          newItem.location = item.location;
          newItem.slug = item.slug;
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
      items: this.items,
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
    this.debug = !this.debug;
    this._triggerDebugPaint(this.debug);
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
        items: this.items,
      };
      let span = globalThis.document.createElement("span");
      span.innerHTML = JSON.stringify(obj, null, 2);
      this.shadowRoot.appendChild(span.cloneNode(true));
    } else {
      this.render();
    }
  }
  static get observedAttributes() {
    return ["file", "id", "title", "author", "description", "license", "debug"];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (this.debug) {
      this.render();
      this._triggerDebugPaint(this.debug);
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
  get debug() {
    return this.getAttribute("debug");
  }
  set debug(newValue) {
    if (this.__ready && newValue) {
      this.setAttribute("debug", newValue);
    } else {
      this.removeAttribute("debug");
    }
  }
  /**
   * Set individual key values pairs on metdata so we can notice it change
   */
  updateMetadata(key, value) {
    this.metadata[key] = value;
    if (this.debug) {
      this.render();
      this._triggerDebugPaint(this.debug);
    }
  }

  /**
   * Return some items populated correctly
   */
  getItemValues(item, parent = false) {
    var valid;
    if (item) {
      valid = this.validateItem(item);
    } else {
      valid = new JSONOutlineSchemaItem();
    }
    // treat this item as the parent
    if (parent) {
      valid.parent = parent.id;
    }
    return valid;
  }
  /**
   * Return valid JSON Schema relative to what asked for
   */
  getItemSchema(requested = "item") {
    var schema = {
      $schema: "http://json-schema.org/schema#",
      title: this.title,
      type: "object",
      properties: {},
    };
    var obj;
    if (requested == "item") {
      obj = new JSONOutlineSchemaItem();
    } else {
      // current object definition but without the outline
      obj = {
        file: this.file,
        id: this.id,
        title: this.title,
        author: this.author,
        description: this.description,
        license: this.license,
        metadata: this.metadata,
      };
      // support this as fallback
      if (requested == "outline") {
        obj.items = this.items;
      }
    }
    for (var key in obj) {
      let props = {
        title: key,
        type: "string",
        value: obj[key],
      };
      switch (key) {
        case "file":
        case "id":
        case "title":
        case "author":
        case "description":
        case "license":
        case "location":
        // @todo break parent out into selector
        case "parent":
          props.component = {
            name: "paper-input",
            valueProperty: "value",
            properties: {
              required: true,
            },
          };
          break;
        case "indent":
        case "order":
          props.component = {
            name: "paper-input",
            valueProperty: "value",
            properties: {
              required: true,
            },
            attributes: {
              type: "number",
            },
          };
        case "metadata":
        case "items":
          props.type = "array";
          props.items = {
            type: "object",
            properties: {
              key: {
                title: "key",
                type: "string",
                component: {
                  name: "paper-input",
                  valueProperty: "value",
                  properties: {
                    required: true,
                  },
                },
              },
              value: {
                title: "value",
                type: "string",
                component: {
                  name: "paper-input",
                  valueProperty: "value",
                  properties: {
                    required: true,
                  },
                },
              },
            },
          };
          break;
        default:
          console.warn(key);
          break;
      }
      schema.properties[key] = props;
    }
    return schema;
  }
  /**
   * Take the items of the manifest (or passed in) and generate an HTML list hierarchy from it
   */
  itemsToNodes(items = []) {
    if (items.length === 0) {
      items = this.items;
    }
    let tree = this.unflattenItems(items);
    return this.treeToNodes(tree, globalThis.document.createElement("ul"));
  }
  treeToNodes(tree, appendTarget) {
    for (var i in tree) {
      let li = globalThis.document.createElement("li");
      li.innerText = tree[i].title;
      li.setAttribute("data-jos-id", tree[i].id);
      if (tree[i].location) {
        li.setAttribute("data-jos-location", tree[i].location);
      }
      if (tree[i].slug) {
        li.setAttribute("data-jos-slug", tree[i].slug);
      }
      if (typeof tree[i].metadata !== "undefined") {
        if (typeof tree[i].metadata.published !== "undefined") {
          li.setAttribute("data-jos-published", tree[i].metadata.published);
        }
      }
      appendTarget.appendChild(li);
      if (tree[i].children && tree[i].children.length > 0) {
        appendTarget.appendChild(
          this.treeToNodes(
            tree[i].children,
            globalThis.document.createElement("ul"),
          ),
        );
      }
    }
    return appendTarget;
  }
  /**
   * Helper to unflatten an array and make it into a tree
   */
  unflattenItems(items, parent, tree) {
    tree = typeof tree !== "undefined" ? tree : [];
    parent = typeof parent !== "undefined" ? parent : { id: null };
    let children = items.filter((child) => {
      return child.parent === parent.id;
    });
    if (children.length) {
      if (!parent.id) {
        tree = children;
      } else {
        parent.children = children;
      }
      // sort order at this level
      children.sort((a, b) => {
        if (a.order < b.order) {
          return -1;
        } else if (a.order > b.order) {
          return 1;
        }
        return 0;
      });
      // forcibly reset the order based on how many child there are
      // the previous sort will respect the order they came in
      // and then this one ensures duplicate entries get healed
      children.map((item, i) => {
        children[i].order = i;
      });
      children.forEach((child) => {
        this.unflattenItems(items, child);
      });
    }
    return tree;
  }
  /**
   * Scrubs data-jos metadata from node and any children of the node.
   * Useful when dealing with text based data being turned into nodes (like a paste)
   */
  scrubElementJOSData(node) {
    // attempt to replace things inside very aggressively
    for (var i in node.children) {
      node.removeAttribute("data-jos-id");
      node.removeAttribute("data-jos-location");
      node.removeAttribute("data-jos-slug");
      // deep scrub child references
      if (node.children[i].children) {
        this.scrubElementJOSData(node.children[i]);
      }
    }
  }
  /**
   * Take an HTML node and convert it into a JSON Outline Schema based
   * on parent child relationshios found in the node. Commonly used with ul / ol
   */
  nodesToItems(node, save = false) {
    const items = this.getChildOutline(node);
    if (save) {
      this.items = items;
      // update if debugging is turned on
      if (this.debug) {
        this.render();
        this._triggerDebugPaint(this.debug);
      }
    }
    return items;
  }
  /**
   * Generate a flat listing of items in JSON OUtline Schema format
   * from a hierarchy of HTML nodes
   */
  getChildOutline(node, order = 0, indent = 0, parent = null) {
    // deep clone the first node so we don't destroy the original
    const clone = node.cloneNode(true);
    let items = [];
    let item = {};
    while (clone.firstChild !== null) {
      // only work on things if they are valid HTML nodes
      if (typeof clone.firstChild.tagName !== typeof undefined) {
        const child = clone.firstChild;
        // walk deeper as this element has a child element
        if (
          child.firstChild !== null &&
          typeof child.firstChild.tagName !== typeof undefined
        ) {
          // usually this will happen but it's possible to have a corrupted
          // structure in HTML where there are lots of ULs with no immediate children
          // in this case we defer to whoever the parent of this item was
          // This means on a recall that the visual issue would be corrected
          // but it also means the data will technically transform the HTML structure
          // which for our purposes, is a good thing.
          let parentPassdown = parent;
          // ensure this is set
          if (typeof item.id !== typeof undefined) {
            parentPassdown = item.id;
          }
          // recursive; dive in using the current child as the starting point
          // and merge in everything we dig up from there
          items = items.concat(
            this.getChildOutline(child, 0, indent + 1, parentPassdown),
          );
        } else {
          item = new JSONOutlineSchemaItem();
          // allow for DOM to have defined an id ahead of time
          if (child.getAttribute("data-jos-id")) {
            item.id = child.getAttribute("data-jos-id");
          }
          if (child.getAttribute("data-jos-location")) {
            item.location = child.getAttribute("data-jos-location");
          } else {
            item.location = "";
          }
          if (child.getAttribute("data-jos-slug")) {
            item.slug = child.getAttribute("data-jos-slug");
          } else {
            item.slug = "";
          }
          item.indent = indent;
          item.order = order;
          order = order + 1;
          // @todo mayyyyyy work but if nested structures may not for text
          // @todo need to look for a textNode that has the element content
          item.title = child.innerText;
          item.parent = parent;
          items.push(item);
        }
      }
      clone.removeChild(clone.firstChild);
    }
    return items;
  }
}
customElements.define(JsonOutlineSchema.tag, JsonOutlineSchema);
export { JsonOutlineSchema, JSONOutlineSchemaItem };
