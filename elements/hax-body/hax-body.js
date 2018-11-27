import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { flush } from "@polymer/polymer/lib/utils/flush.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "./lib/hax-text-context.js";
import "./lib/hax-ce-context.js";
import "./lib/hax-plate-context.js";
import "./lib/hax-input-mixer.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="hax-body">
  <template strip-whitespace="">
    <style>
      :host {
        display: block;
        min-height: 32px;
        min-width: 32px;
        /*font-family: sans-serif;*/
      }
      :host #bodycontainer ::slotted(.hax-context-menu) {
        padding: 0;
        margin: 0;
        position: absolute;
        visibility: hidden;
        opacity: 0;
        transition: all .3s ease;
        z-index: 100;
        float: left;
        display: block;
      }
      :host #bodycontainer ::slotted(#haxinputmixer) {
        z-index: 10000000;
      }
      :host #bodycontainer ::slotted(.hax-context-visible) {
        visibility: visible;
        opacity: 1;
      }
      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]) {
        outline: none;
        transition:
          .6s width ease-in-out,
          .6s height ease-in-out,
          .6s margin ease-in-out;
      }
      :host([edit-mode]) #bodycontainer ::slotted(p):empty {
        background: #f8f8f8;
      }
      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]):hover {
        outline: 1px dotted #d3d3d3;
        outline-offset: 2px;
      }
      :host([edit-mode]) #bodycontainer ::slotted(* [data-editable]):hover {
        outline: 1px dotted #d3d3d3;
        outline-offset: 2px;
      }
      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]):before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 32px;
        transition: .6s all ease;
      }
      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]):hover:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 32px;
        transition: .6s all ease;
      }
      :host([edit-mode]) #bodycontainer ::slotted(*.hax-active[data-editable]) {
        cursor: text !important;
        outline: 1px dashed #c3c3c3 !important;
        outline-offset: 4px;
      }
      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable] .hax-active) {
        cursor: text !important;
        outline: 1px dashed #c3c3c3 !important;
        outline-offset: 4px;
      }
      :host([edit-mode]) #bodycontainer ::slotted(*.hax-active[data-editable]):before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 32px;
        transition: .6s all ease;
      }
      :host([edit-mode]) #bodycontainer ::slotted(code.hax-active[data-editable]) {
        display: block;
      }
      :host([edit-mode]) #bodycontainer ::slotted(hr[data-editable]) {
        height:4px;
        background-color: #EEEEEE;
        padding-top: 8px;
        padding-bottom: 8px;
      }
      /** Fix to support safari as it defaults to none */
      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]) {
        -webkit-user-select: text;
        cursor:pointer;
      }

      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]::-moz-selection),
      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable] *::-moz-selection) {
        background-color: var(--hax-body-highlight, --paper-yellow-300);
        color: black;
      }
      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]::selection),
      :host([edit-mode]) #bodycontainer ::slotted(*[data-editable] *::selection) {
        background-color: var(--hax-body-highlight, --paper-yellow-300);
        color: black;
      }
      #bodycontainer {
        -webkit-user-select: text;
        user-select: text;
      }

      #contextcontainer {
        display: none;
      }
      :host([edit-mode])[hax-ray-mode] #bodycontainer ::slotted(*[data-editable]) {
        outline: 1px dashed #d3d3d3;
        outline-offset: 4px;
      }
      :host([edit-mode])[hax-ray-mode] #bodycontainer ::slotted(*[data-editable]):before {
        content: attr(data-hax-ray) " " attr(resource) " " attr(typeof) " " attr(property) " " attr(content);
        font-size: 10px;
        font-style: italic;
        left: unset;
        right: unset;
        top: unset;
        background-color: #d3d3d3;
        color: #000000;
        bottom: unset;
        width: auto;
        padding: 8px;
        margin: 0;
        z-index: 1;
        margin: -16px 0 0 0;
        float: left;
        line-height: 2;
      }
    </style>
    <div id="bodycontainer" class="ignore-activation">
      <slot id="body"></slot>
    </div>
    <div id="contextcontainer">
      <hax-text-context id="textcontextmenu" class="hax-context-menu ignore-activation"></hax-text-context>
      <hax-ce-context id="cecontextmenu" class="hax-context-menu ignore-activation"></hax-ce-context>
      <hax-plate-context id="platecontextmenu" class="hax-context-menu ignore-activation"></hax-plate-context>
      <hax-input-mixer id="haxinputmixer" class="hax-context-menu ignore-activation"></hax-input-mixer>
    </div>
    <iron-a11y-keys target="[[activeContainerNode]]" keys="esc" on-keys-pressed="_escKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>
    <iron-a11y-keys target="[[activeContainerNode]]" keys="del backspace" on-keys-pressed="_delKeyPressed"></iron-a11y-keys>
    <iron-a11y-keys target="[[activeContainerNode]]" keys="shift+tab" on-keys-pressed="_tabBackKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>
    <iron-a11y-keys target="[[activeContainerNode]]" keys="tab" on-keys-pressed="_tabKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>
    <iron-a11y-keys target="[[activeContainerNode]]" keys="up" on-keys-pressed="_upKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>
    <iron-a11y-keys target="[[activeContainerNode]]" keys="down" on-keys-pressed="_downKeyPressed" stop-keyboard-event-propagation=""></iron-a11y-keys>

  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer);
/**
`hax-body`
A LRN element that will change the world.

@demo demo/index.html

@microcopy - the mental model for this element
 - body is effectively a body of content that can be manipulated in the browser. This is for other HAX elements ultimately to interface with and reside in. It is the controller of input and output for all of HAX as it exists in a document. body is not the <body> tag but we need a similar mental model container for all our other elements.
 - text-context - the context menu that shows up when an item is active so it can have text based operations performed to it.
 - plate/grid plate - a plate or grid plate is a container that we can operate on in HAX. it can also have layout / "global" type of body operations performed on it such as delete, duplicate and higher level format styling.

*/
Polymer({
  is: "hax-body",
  listeners: {
    focusin: "_focusIn",
    mousedown: "_focusIn",
    "hax-context-item-selected": "_haxContextOperation",
    "hax-input-mixer-update": "_haxInputMixerOperation",
    "place-holder-replace": "replacePlaceholder"
  },
  behaviors: [simpleColorsBehaviors],
  properties: {
    /**
     * State of if we are editing or not.
     */
    editMode: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: "_editModeChanged"
    },
    /**
     * Access to the global properties object.
     */
    globalPreferences: {
      type: Object,
      value: {},
      observer: "_globalPreferencesUpdated"
    },
    /**
     * Bust out the HAX Ray mode
     */
    haxRayMode: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * A reference to the active node in the slot.
     */
    activeNode: {
      type: Object,
      value: null,
      notify: true,
      observer: "_activeNodeChanged"
    },
    /**
     * A reference to the active node in the slot.
     */
    activeContainerNode: {
      type: Object,
      value: null,
      notify: true,
      observer: "_activeContainerNodeChanged"
    }
  },
  /**
   * Ready state to tee everything up.
   */
  ready: function() {
    this.polyfillSafe = window.HaxStore.instance.computePolyfillSafe();
    // mutation observer that ensures state of hax applied correctly
    this._observer = new FlattenedNodesObserver(this, info => {
      // MAKE SURE WE KNOW WHAT JUST GOT ADDED HERE
      flush();
      // if we've got new nodes, we have to react to that
      if (info.addedNodes.length > 0) {
        info.addedNodes.map(node => {
          if (this._haxElementTest(node)) {
            if (this._HTMLPrimativeTest(node)) {
              node.contentEditable = this.editMode;
            }
            // this does the real targetting
            node.setAttribute("data-editable", this.editMode);
            node.setAttribute("data-hax-ray", node.tagName);
            this.fire("hax-body-tag-added", { node: node });
          }
        });
      }
      // if we dropped nodes via the UI (delete event basically)
      if (info.removedNodes.length > 0) {
        // handle removing items... not sure we need to do anything here
        info.removedNodes.map(node => {
          if (
            this._haxElementTest(node) &&
            !node.classList.contains("hax-active")
          ) {
            this.fire("hax-body-tag-removed", { node: node });
          }
        });
      }
    });
  },
  /**
   * Attached to the DOM; now we can fire event to the store that
   * we exist and are the thing being edited.
   */
  attached: function() {
    this.__tabTrap = false;
    this.fire("hax-register-body", this);
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.addEventListener(
      "selectstart",
      this._selectionChange.bind(this)
    );
    document.body.addEventListener(
      "mouseup",
      this._selectionMouseUp.bind(this)
    );
    window.addEventListener("scroll", this._keepContextVisible.bind(this));
  },
  /**
   * Detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.removeEventListener(
      "selectstart",
      this._selectionChange.bind(this)
    );
    document.body.removeEventListener(
      "mouseup",
      this._selectionMouseUp.bind(this)
    );
    window.removeEventListener("scroll", this._keepContextVisible.bind(this));
  },
  /**
   * Keep the context menu visible if needed
   */
  _keepContextVisible: function(e) {
    // see if the text context menu is visible
    let el = false;
    if (this.$.textcontextmenu.classList.contains("hax-context-visible")) {
      el = this.$.textcontextmenu;
    } else if (this.$.cecontextmenu.classList.contains("hax-context-visible")) {
      el = this.$.cecontextmenu;
    }
    // if we see it, ensure we don't have the pin
    if (el) {
      if (this.elementInViewport(el)) {
        el.classList.remove("hax-context-pin-bottom");
        el.classList.remove("hax-context-pin-top");
      } else {
        if (this.__OffBottom) {
          el.classList.add("hax-context-pin-top");
        } else {
          el.classList.add("hax-context-pin-bottom");
        }
      }
    }
  },
  /**
   * Check if part of the passed element is int he viewport
   */
  elementInViewport: function(el) {
    let top =
      el.offsetTop -
      32 -
      window.HaxStore.instance.haxPanel.$.drawer.offsetHeight;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;
    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }
    this.__OffBottom = top < window.pageYOffset + window.innerHeight;
    return (
      top < window.pageYOffset + window.innerHeight &&
      left < window.pageXOffset + window.innerWidth &&
      top + height > window.pageYOffset &&
      left + width > window.pageXOffset
    );
  },
  /**
   * Selection changed
   */
  _selectionChange: function(e) {
    window.__startedSelection = true;
  },
  _selectionMouseUp: function(e) {
    if (window.__startedSelection && this.editMode) {
      try {
        let selection = window.getSelection();
        let range = selection.getRangeAt(0);
        let newRange = range.cloneRange();
        window.__startedSelection = false;
        if (
          newRange.startContainer.parentNode.parentNode.parentElement
            .tagName === "HAX-BODY" ||
          newRange.startContainer.parentNode.parentElement.tagName ===
            "HAX-BODY"
        ) {
          window.HaxStore.write("activePlaceHolder", newRange, this);
        }
      } catch (err) {}
    }
  },
  /**
   * Replace place holder after an event has called for it in the element itself
   */
  replacePlaceholder: function(e) {
    // generate a paragraph of text here on click
    if (e.detail === "text") {
      // make sure text just escalates to a paragraph tag
      let p = document.createElement("p");
      this.haxReplaceNode(this.activeNode, p, dom(this.activeNode).parentNode);
      // allow swap out to happen
      setTimeout(() => {
        // set active to this p tag
        window.HaxStore.write("activeNode", p, this);
        // focus on it
        p.focus();
      }, 100);
    } else {
      this.replaceElementWorkflow();
    }
  },
  /**
   * Whole workflow of replacing something in place contextually.
   * This can fire for things like events needing this workflow to
   * invoke whether it's a "convert" event or a "replace placeholder" event
   */
  replaceElementWorkflow: function() {
    let element = window.HaxStore.nodeToHaxElement(this.activeNode, null);
    let type = "*";
    let skipPropMatch = false;
    // special support for place holder which defines exactly
    // what the user wants this replaced with
    if (
      element.tag === "place-holder" &&
      typeof element.properties["type"] !== typeof undefined
    ) {
      type = element.properties["type"];
      skipPropMatch = true;
    }
    var props = {};
    // see if we have a gizmo as it's not a requirement to registration
    // as well as having handlers since mapping is not required either
    if (
      typeof window.HaxStore.instance.elementList[element.tag] !==
        typeof undefined &&
      window.HaxStore.instance.elementList[element.tag].gizmo !== false &&
      typeof window.HaxStore.instance.elementList[element.tag].gizmo.handles !==
        typeof undefined &&
      window.HaxStore.instance.elementList[element.tag].gizmo.handles.length > 0
    ) {
      // get the haxProperties for this item
      let gizmo = window.HaxStore.instance.elementList[element.tag].gizmo;
      // walk through each handler
      for (var i = 0; i < gizmo.handles.length; i++) {
        // walk the properties defined as they would be to the
        // left side of the ledger and tell us which property to
        // mesh with. This effectively rehydrates / inverts that
        // relationship where we have an element and want to say
        // "oh ya, but what could have handled this" so that we
        // can use that translation to offer up convertion to a
        // new element. This is insane.
        for (var prop in gizmo.handles[i]) {
          // type is a reserved handler but any other property
          // which we actually have in our element let's go for it
          if (
            prop !== "type" &&
            typeof element.properties[gizmo.handles[i][prop]] !==
              typeof undefined
          ) {
            // The cake is a lie... oh wait... no it's not.
            // This will completely bend your mind when it comes to
            // what HTML is, how it should operate and what universe
            // we can now contort as a result. This effectively allows
            // reverse engineering any element on the page into any
            // other compatible element based on the properties in
            // each element claiming to be compatible.
            props[prop] = element.properties[gizmo.handles[i][prop]];
          }
        }
      }
    }
    let haxElements = window.HaxStore.guessGizmo(type, props, skipPropMatch);
    // see if we got anything
    if (haxElements.length > 0) {
      // hand off to hax-app-picker to deal with the rest of this
      let tag = this.activeNode.tagName.toLowerCase();
      let humanName = tag.replace("-", " ");
      if (
        typeof window.HaxStore.instance.elementList[tag] !== typeof undefined &&
        window.HaxStore.instance.elementList[tag].gizmo !== false
      ) {
        humanName = window.HaxStore.instance.elementList[tag].gizmo.title;
      }
      window.HaxStore.instance.haxAppPicker.presentOptions(
        haxElements,
        "__convert",
        `Transform ${humanName} to..`,
        "gizmo"
      );
    } else {
      window.HaxStore.toast("Sorry, this can not be transformed!", 5000);
    }
  },
  /**
   * Global prefs updated, let's visualize stuff from hax-ray
   */
  _globalPreferencesUpdated: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue != null) {
      this.haxRayMode = newValue.haxRayMode;
    }
  },
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (typeof e.detail.value === "object") {
        this.set(e.detail.property, null);
      }
      this.set(e.detail.property, e.detail.value);
    }
  },
  /**
   * Clear area.
   */
  haxClearBody: function(confirm = true) {
    let status = true;
    // only confirm if asked so we can support wipes without it
    if (confirm) {
      status = prompt("Are you sure you want to delete all content?");
    }
    // ensure they said yes
    if (status) {
      window.HaxStore.wipeSlot(this);
    }
  },
  /**
   * Insert new tag + content into the local DOM as a node.
   */
  haxInsert: function(tag, content, properties = {}) {
    var tags = window.HaxStore.instance.validTagList;
    // verify this tag is a valid one
    if (tags.includes(tag)) {
      // create a new element fragment w/ content in it
      // if this is a custom-element it won't expand though
      var frag = document.createElement(tag);
      frag.innerHTML = content;
      // clone the fragment which will force an escalation to full node
      var newNode = frag.cloneNode(true);
      // support for properties if they exist
      for (var property in properties) {
        let attributeName = window.HaxStore.camelToDash(property);
        if (properties.hasOwnProperty(property)) {
          // special supporting for boolean because html is weird :p
          if (properties[property] === true) {
            newNode.setAttribute(attributeName, properties[property]);
          } else if (properties[property] === false) {
            newNode.removeAttribute(attributeName);
          } else if (
            properties[property] != null &&
            properties[property].constructor === Array &&
            !newNode.properties[property].readOnly
          ) {
            newNode.set(attributeName, properties[property]);
          } else if (
            properties[property] != null &&
            properties[property].constructor === Object &&
            !newNode.properties[property].readOnly
          ) {
            newNode.set(attributeName, properties[property]);
          } else {
            newNode.setAttribute(attributeName, properties[property]);
          }
        }
      }
      // special support for a drag and drop into a place-holder tag
      // as this is a more aggressive operation then the others
      if (
        window.HaxStore.instance.activePlaceHolder !== null &&
        typeof window.HaxStore.instance.activePlaceHolder.style !==
          typeof undefined
      ) {
        // replicate styles so that it doesn't jar the UI
        newNode.style.width =
          window.HaxStore.instance.activePlaceHolder.style.width;
        newNode.style.float =
          window.HaxStore.instance.activePlaceHolder.style.float;
        newNode.style.margin =
          window.HaxStore.instance.activePlaceHolder.style.margin;
        newNode.style.display =
          window.HaxStore.instance.activePlaceHolder.style.display;
        this.haxReplaceNode(
          window.HaxStore.instance.activePlaceHolder,
          newNode,
          dom(window.HaxStore.instance.activePlaceHolder).parentNode
        );
        window.HaxStore.instance.activePlaceHolder = null;
      }
      // insert at active insert point if we have one
      else if (this.activeContainerNode !== null) {
        // allow for inserting things into things but not grid plate
        if (
          newNode.tagName !== "GRID-PLATE" &&
          this.activeContainerNode.tagName === "GRID-PLATE" &&
          this.activeContainerNode !== this.activeNode
        ) {
          newNode.setAttribute("slot", this.activeNode.getAttribute("slot"));
          dom(this.activeContainerNode).insertBefore(newNode, this.activeNode);
        } else {
          dom(this).insertBefore(
            newNode,
            this.activeContainerNode.nextElementSibling
          );
        }
      } else {
        // send this into the root, which should filter it back down into the slot
        dom(this).appendChild(newNode);
      }
      this.$.textcontextmenu.highlightOps = false;
      // wait so that the DOM can have the node to then attach to
      setTimeout(() => {
        window.HaxStore.write("activeContainerNode", newNode, this);
        window.HaxStore.write("activeNode", newNode, this);
        // attempt to focus on the new node, may not always work
        newNode.focus();
        // scroll to it
        if (typeof newNode.scrollIntoViewIfNeeded === "function") {
          newNode.scrollIntoViewIfNeeded(true);
        } else {
          newNode.scrollIntoView({ behavior: "smooth", inline: "center" });
        }
      }, 100);
      return true;
    }
    return false;
  },
  /**
   * Return the current hax content area as text that could be
   * inserted into something.
   */
  haxToContent: function() {
    // remove from the body area so we can generate a legit html structure
    this.hideContextMenus();
    var __active = this.activeNode;
    // null this to drop hax based classes
    window.HaxStore.write("activeNode", null, this);
    window.HaxStore.write("activeContainerNode", null, this);
    let children = dom(this.$.body).getDistributedNodes();
    if (this.globalPreferences.haxDeveloperMode) {
      console.log(children);
    }
    var content = "";
    for (var i = 0, len = children.length; i < len; i++) {
      // see if this is a valid element or not, providing
      // some mild front-end sanitization
      if (this._haxElementTest(children[i])) {
        children[i].removeAttribute("data-editable");
        children[i].removeAttribute("data-hax-ray");
        children[i].contentEditable = false;
        content += window.HaxStore.haxNodeToContent(children[i]);
        if (children[i].tagName.toLowerCase() === "grid-plate") {
          this._applyContentEditable(this.editMode, children[i]);
        }
      }
      // keep comments with a special case since they need wrapped
      else if (children[i].nodeType === 8) {
        content += "<!-- " + children[i].textContent + " -->";
      }
      // keep everything NOT an element at this point, this helps
      // preserve whitespace because we're crazy about accuracy
      else if (
        children[i].nodeType !== 1 &&
        typeof children[i].textContent !== typeof undefined &&
        children[i].textContent !== "undefined"
      ) {
        content += children[i].textContent;
      }
    }
    // remove the contenteditable attribute
    content = content.replace(/\scontenteditable=\"false\"/g, "");
    // remove the data-editable attribute
    content = content.replace(/\sdata-editable=\"true\"/g, "");
    content = content.replace(/\sdata-editable=\"false\"/g, "");
    content = content.replace(/\sdata-editable=\""/g, "");
    // remove other attributes that can linger in slots
    content = content.replace(/\sdata-editable/g, "");
    content = content.replace(/\scontenteditable/g, "");
    content = content.replace(/\sdraggable/g, "");
    content = content.replace(/\sdata-draggable/g, "");
    // clean up stray hax-ray leftovers
    content = content.replace(/\sdata-hax-ray=\".*?\"/g, "");
    // remove HAX specific classes / scoping classes
    if (this.parentNode.tagName) {
      let parentTag = this.parentNode.tagName.toLowerCase();
      let string = "style-scope " + parentTag + " x-scope";
      let re = new RegExp(string, "g");
      content = content.replace(re, "");
      // remove without the deeeper scope as well for primitives
      string = "style-scope " + parentTag;
      re = new RegExp(string, "g");
      content = content.replace(re, "");
      // remove the last common one unpacked
      string = "x-scope " + parentTag + "-0";
      re = new RegExp(string, "g");
      content = content.replace(re, "");
      // now all tags we have defined as valid
      let tags = window.HaxStore.instance.validTagList;
      tags.push("hax-preview");
      for (var i in tags) {
        string = "style-scope " + tags[i];
        re = new RegExp(string, "g");
        content = content.replace(re, "");
        string = "x-scope " + tags[i] + "-0 ";
        re = new RegExp(string, "g");
        content = content.replace(re, "");
        string = "x-scope " + tags[i] + "-0";
        re = new RegExp(string, "g");
        content = content.replace(re, "");
      }
    }
    // remove empty class structures
    content = content.replace(/\sclass=\"\"/g, "");
    content = content.replace(/\sclass=\"\s\"/g, "");
    // re-apply contenteditable if needed
    this._applyContentEditable(this.editMode);
    // set active again
    window.HaxStore.write("activeNode", __active, this);
    window.HaxStore.write("activeContainerNode", __active, this);
    // oh one last thing. escape all script/style tags
    content = window.HaxStore.encapScript(content);
    if (this.globalPreferences.haxDeveloperMode) {
      console.log(content);
    }
    return content;
  },
  /**
   * Duplicate node into the local DOM below the current item if we can.
   */
  haxDuplicateNode: function(node, parent = this) {
    // move the context menu before duplicating!!!!
    this.hideContextMenus();
    var nodeClone = dom(node).cloneNode(true);
    if (
      nodeClone.tagName.toLowerCase() === "webview" &&
      window.HaxStore.instance._isSandboxed &&
      typeof nodeClone.guestinstance !== typeof undefined
    ) {
      delete nodeClone.guestinstance;
    }
    // shouldn't be possible but might as well check
    if (node !== null) {
      dom(parent).insertBefore(nodeClone, dom(node).nextSibling);
    } else {
      dom(parent).appendChild(nodeClone);
    }
    setTimeout(() => {
      // test for a grid plate clone
      if (parent === this) {
        window.HaxStore.write("activeContainerNode", nodeClone, this);
      }
      window.HaxStore.write("activeNode", nodeClone, this);
    }, 100);
    return true;
  },
  /**
   * Hide all context menus.
   */
  hideContextMenus: function() {
    // primary context menus
    this._hideContextMenu(this.$.textcontextmenu);
    this._hideContextMenu(this.$.cecontextmenu);
    // secondary menus and clean up areas
    this._hideContextMenu(this.$.platecontextmenu);
    this._hideContextMenu(this.$.haxinputmixer);
    // force context menu state to closed
    this.$.textcontextmenu.highlightOps = false;
  },
  /**
   * Reposition context menus to match an element.
   */
  positionContextMenus: function(node, container) {
    let tag = node.tagName.toLowerCase();
    if (window.HaxStore.instance._isSandboxed && tag === "webview") {
      tag = "iframe";
    }
    let props = window.HaxStore.instance.elementList[tag];
    // get width from window size and do very minor responsive inline support
    let w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    let offsetmenu = -39;
    let offsetplate = -31;
    // if we go below 800 break point, change menu positioning
    if (w < 800) {
      offsetmenu = 0;
      offsetplate = 0;
    }
    // try and work against anything NOT a P tag
    if (typeof props !== typeof undefined && node.tagName !== "P") {
      this.__activeContextType = this.$.cecontextmenu;
      props.element = node;
      this.__activeContextType.setHaxProperties(props);
    } else {
      // @todo test if this is a custom element, then if it is
      // try and guess what the properties are based on what's
      // currently been set. it's by no means perfect but it'll
      // be a really good start
      this.__activeContextType = this.$.textcontextmenu;
    }
    this._positionContextMenu(
      this.__activeContextType,
      container,
      offsetmenu,
      -37
    );
    this._positionContextMenu(
      this.$.platecontextmenu,
      container,
      offsetplate,
      0,
      false
    );
    // special case for node not matching container
    if (!this._HTMLPrimativeTest(node) && node !== container) {
      container.contentEditable = false;
    } else if (this._HTMLPrimativeTest(container)) {
      container.contentEditable = true;
    }
  },
  /**
   * Move grid plate around
   */
  haxMoveGridPlate: function(direction, node, container) {
    // menu is actually in the element for render purposes
    this.hideContextMenus();
    // support moving things multiple directions
    switch (direction) {
      case "first":
        // ensure we can go up, first being a mode of up
        if (container.previousElementSibling !== null) {
          dom(this).insertBefore(container, dom(this).firstChild);
        }
        break;
      case "up":
        // ensure we can go up
        if (container.previousElementSibling !== null) {
          dom(this).insertBefore(container, container.previousElementSibling);
        }
        break;
      case "down":
        if (container.nextElementSibling !== null) {
          dom(this).insertBefore(container.nextElementSibling, container);
        }
        break;
      case "last":
        if (container.nextElementSibling !== null) {
          dom(this).appendChild(container);
        }
        break;
      // @todo support other directions for when inside of an element
    }
    this.positionContextMenus(node, container);
    setTimeout(() => {
      if (typeof container.scrollIntoViewIfNeeded === "function") {
        container.scrollIntoViewIfNeeded(true);
      } else {
        container.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }, 250);
    return true;
  },
  /**
   * Convert an element from one tag to another.
   */
  haxReplaceNode: function(node, replacement, parent = this) {
    // ensure we're not in the document tree for the replaced node
    this.hideContextMenus();
    // Switch, try loop in case we screwed up elsewhere
    try {
      // test for slots to match
      if (node.getAttribute("slot") != null) {
        replacement.setAttribute("slot", node.getAttribute("slot"));
      }
      dom(parent).replaceChild(replacement, node);
    } catch (e) {
      console.log(e);
    }
    return replacement;
  },
  /**
   * Convert an element from one tag to another.
   */
  haxChangeTagName: function(node, tagName, newNode) {
    // ensure we're not in the document tree for the replaced node
    this.hideContextMenus();
    // Create a replacement tag of the desired type
    var replacement = document.createElement(tagName);
    // Grab all of the original's attributes, and pass them to the replacement
    for (var i = 0, l = node.attributes.length; i < l; ++i) {
      var nodeName = node.attributes.item(i).nodeName;
      var value = node.attributes.item(i).value;
      replacement.setAttribute(nodeName, value);
    }
    // Persist contents
    replacement.innerHTML = node.innerHTML;
    // Switch!
    dom(this).replaceChild(replacement, node);
    return replacement;
  },
  /**
   * Delete the node passed in
   */
  haxDeleteNode: function(node, parent = this) {
    // move the context menu before deleting!!!!
    this.hideContextMenus();
    // shift active to a viable replacement
    if (
      this.activeContainerNode != null &&
      this.activeContainerNode.previousElementSibling !== null
    ) {
      this.activeContainerNode.previousElementSibling.focus();
      // cursor at the END of the element assuming not empty
      if (
        this.activeContainerNode != null &&
        window.HaxStore.instance.isTextElement(this.activeContainerNode) &&
        dom(this.activeContainerNode).textContent !== ""
      ) {
        try {
          var range = document.createRange();
          var sel = window.getSelection();
          range.setStart(this.activeContainerNode, 1);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          this.activeContainerNode.focus();
        } catch (e) {
          console.log(e);
        }
      }
    } else if (
      this.activeContainerNode != null &&
      this.activeContainerNode.nextElementSibling !== null
    ) {
      this.activeContainerNode.nextElementSibling.focus();
    } else {
      window.HaxStore.write("activeContainerNode", null, this);
      window.HaxStore.write("activeNode", null, this);
    }
    // @todo figure out why this is complaining
    try {
      return dom(parent).removeChild(node);
    } catch (e) {
      console.log(e);
    }
  },
  /**
   * Bulk import HTML with option to clear what is currently
   * in the slot of this tag. This also validates tags
   * that are being inserted for security based on the
   * internal whitelist.
   */
  importContent: function(html, clear = true) {
    // kill the slot of the active body, all of it
    if (clear) {
      window.HaxStore.wipeSlot(this, "*");
    }
    // pause quickly to ensure wipe goes through successfully
    setTimeout(() => {
      html = window.HaxStore.encapScript(html);
      const validTags = window.HaxStore.instance.validTagList;
      let fragment = document.createElement("div");
      fragment.insertAdjacentHTML("beforeend", html);
      while (fragment.firstChild !== null) {
        if (
          typeof fragment.firstChild.tagName !== typeof undefined &&
          validTags.includes(fragment.firstChild.tagName.toLowerCase())
        ) {
          // ensure import doesn't import non-sandbox safe things!
          if (
            window.HaxStore.instance._isSandboxed &&
            fragment.firstChild.tagName.toLowerCase() === "iframe"
          ) {
            // Create a replacement tag of the desired type
            var replacement = document.createElement("webview");
            // Grab all of the original's attributes, and pass them to the replacement
            for (
              var j = 0, l = fragment.firstChild.attributes.length;
              j < l;
              ++j
            ) {
              var nodeName = fragment.firstChild.attributes.item(j).nodeName;
              var value = fragment.firstChild.attributes.item(j).value;
              if (nodeName === "height" || nodeName === "width") {
                replacement.style[nodeName] == value;
              }
              replacement.setAttribute(nodeName, value);
            }
            dom(this).appendChild(replacement);
          } else {
            dom(this).appendChild(fragment.firstChild);
          }
        } else {
          // this tag didn't pass the test, get rid of it
          fragment.removeChild(fragment.firstChild);
        }
      }
    }, 200);
  },
  /**
   * Respond to hax operations.
   */
  _haxContextOperation: function(e) {
    let detail = e.detail;
    var haxElement;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      // text based operations for primatives
      case "p":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
      case "code":
      case "blockquote":
        // trigger the default selected value in context menu to match
        this.$.textcontextmenu.selectedValue = detail.eventName;
        window.HaxStore.write(
          "activeContainerNode",
          this.haxChangeTagName(this.activeContainerNode, detail.eventName),
          this
        );
        break;
      case "text-align-left":
        this.activeNode.style.textAlign = null;
        this.positionContextMenus(this.activeNode, this.activeContainerNode);
        break;
      case "text-align-right":
        this.activeNode.style.textAlign = "right";
        this.positionContextMenus(this.activeNode, this.activeContainerNode);
        break;
      // grid plate based operations
      // allow for transforming this haxElement into another one
      case "grid-plate-convert":
        this.replaceElementWorkflow();
        break;
      // duplicate the active item or container
      case "grid-plate-duplicate":
        if (this.activeNode === this.activeContainerNode) {
          this.haxDuplicateNode(this.activeNode);
        } else {
          this.haxDuplicateNode(this.activeNode, this.activeContainerNode);
        }
        break;
      case "grid-plate-delete":
        let options = [
          {
            icon: "thumb-up",
            color: "green",
            title: "Yes"
          },
          {
            icon: "thumb-down",
            color: "red",
            title: "No"
          }
        ];
        let tag = this.activeNode.tagName.toLowerCase();
        let humanName = tag.replace("-", " ");
        if (
          typeof window.HaxStore.instance.elementList[tag] !==
            typeof undefined &&
          window.HaxStore.instance.elementList[tag].gizmo !== false
        ) {
          humanName = window.HaxStore.instance.elementList[tag].gizmo.title;
        }
        window.HaxStore.instance.haxAppPicker.presentOptions(
          options,
          "",
          `Remove this \`${humanName}\`?`,
          "delete"
        );
        break;
      case "grid-plate-first":
        this.haxMoveGridPlate(
          "first",
          this.activeNode,
          this.activeContainerNode
        );
        break;
      case "grid-plate-up":
        this.haxMoveGridPlate("up", this.activeNode, this.activeContainerNode);
        break;
      case "hax-manager-open":
        window.HaxStore.write("activeHaxElement", {}, this);
        window.HaxStore.instance.haxManager.resetManager(
          parseInt(detail.value)
        );
        window.HaxStore.instance.haxManager.toggleDialog();
        break;
      case "grid-plate-down":
        this.haxMoveGridPlate(
          "down",
          this.activeNode,
          this.activeContainerNode
        );
        break;
      case "grid-plate-last":
        this.haxMoveGridPlate(
          "last",
          this.activeNode,
          this.activeContainerNode
        );
        break;
      case "close-menu":
        // this is the equivalent of hiding menus and resetting the board
        window.HaxStore.write("activeContainerNode", null, this);
        window.HaxStore.write("activeNode", null, this);
        break;
      case "hax-edit-property":
        let haxInputMixer = this.$.haxinputmixer;
        haxInputMixer.label = detail.target.label;
        haxInputMixer.options = detail.target.options;
        haxInputMixer.icon = detail.target.icon;
        haxInputMixer.description = detail.target.description;
        haxInputMixer.required = detail.target.required;
        haxInputMixer.validation = detail.target.validation;
        haxInputMixer.validationType = detail.target.validationType;
        haxInputMixer.inputMethod = detail.target.inputMethod;
        haxInputMixer.value = "";
        // see if response should bind to the slot or property
        if (
          typeof detail.target.propertyToBind !== typeof undefined &&
          detail.target.propertyToBind != null &&
          detail.target.propertyToBind != false
        ) {
          haxInputMixer.propertyToBind = detail.target.propertyToBind;
          if (
            typeof this.activeNode[detail.target.propertyToBind] !==
            typeof undefined
          ) {
            haxInputMixer.value = this.activeNode[detail.target.propertyToBind];
          }
          // try to get an attribute bind
          else {
            haxInputMixer.value = this.activeNode.getAttribute(
              detail.target.propertyToBind
            );
          }
          // @todo need to be able to support slot binding
        }
        // make input mixer show up
        this._positionContextMenu(
          haxInputMixer,
          this.$.cecontextmenu,
          -6,
          -116
        );
        haxInputMixer.style.width = null;
        break;
      // directional / proportion operations
      case "hax-align-left":
        this.activeNode.style.float = null;
        this.activeNode.style.margin = null;
        this.activeNode.style.display = null;
        this.positionContextMenus(this.activeNode, this.activeContainerNode);
        break;
      case "hax-align-center":
        this.activeNode.style.float = null;
        this.activeNode.style.margin = "0 auto";
        this.activeNode.style.display = "block";
        this.positionContextMenus(this.activeNode, this.activeContainerNode);
        break;
      case "hax-align-right":
        this.activeNode.style.float = "right";
        this.activeNode.style.margin = null;
        this.activeNode.style.display = null;
        this.positionContextMenus(this.activeNode, this.activeContainerNode);
        break;
      case "hax-size-change":
        this.activeNode.style.width = detail.value + "%";
        setTimeout(() => {
          this.positionContextMenus(this.activeNode, this.activeContainerNode);
        }, 1000);
        break;
      // settings button selected from hax-ce-context bar
      // which means we should skip to the settings page after
      // we set the thing selected as the active element to work
      // on in the manager
      case "hax-manager-configure":
        // make sure input mixer is closed
        this._hideContextMenu(this.$.haxinputmixer);
        // reset the manager
        window.HaxStore.instance.haxManager.resetManager();
        // write activeElement updated so it'll go into the preview
        haxElement = window.HaxStore.nodeToHaxElement(
          window.HaxStore.instance.activeNode
        );
        window.HaxStore.write("activeHaxElement", haxElement, this);
        // clean up the manager before opening
        window.HaxStore.instance.haxManager.editExistingNode = true;
        window.HaxStore.instance.haxManager.selectStep("configure");
        window.HaxStore.instance.haxManager.toggleDialog();
        // accessibility enhancement to keyboard focus configure button
        setTimeout(() => {
          window.HaxStore.instance.haxManager.$.preview.$.configurebutton.focus();
        }, 100);
        break;
      // container / layout settings button has been activated
      case "hax-manager-configure-container":
        window.HaxStore.write(
          "activeNode",
          window.HaxStore.instance.activeContainerNode,
          this
        );
        // make sure input mixer is closed
        this._hideContextMenu(this.$.haxinputmixer);
        // reset the manager
        window.HaxStore.instance.haxManager.resetManager();
        // write activeElement updated so it'll go into the preview
        haxElement = window.HaxStore.nodeToHaxElement(
          window.HaxStore.instance.activeNode
        );
        window.HaxStore.write("activeHaxElement", haxElement, this);
        // clean up the manager before opening
        window.HaxStore.instance.haxManager.editExistingNode = true;
        window.HaxStore.instance.haxManager.selectStep("configure");
        window.HaxStore.instance.haxManager.toggleDialog();
        // accessibility enhancement to keyboard focus configure button
        setTimeout(() => {
          window.HaxStore.instance.haxManager.$.preview.$.configurebutton.focus();
        }, 100);
        break;
    }
  },
  /**
   * Respond to an input mixer call.
   */
  _haxInputMixerOperation: function(e) {
    // this is a big deal how simple this part is in the end
    let mixer = e.detail.inputMixer;
    // if we have a property to bind, set that value from the
    // widget that was dictated by the element itself
    if (mixer.propertyToBind != null) {
      this.activeNode[mixer.propertyToBind] = mixer.value;
    }
    // if we're told instead to do a slot bind, make a span tag
    // with height same as parent and then mix in the innerHTML
    else if (mixer.slotToBind != null) {
      item = document.createElement("span");
      item.style.height = "inherit";
      item.innerHTML = mixer.value;
      //item.attribute.slot = mixer.slotToBind;
      item.slot = mixer.slotToBind;
      this.activeNode.appendChild(item);
    }
    // hide mixer
    this._hideContextMenu(this.$.haxinputmixer);
  },
  /**
   * Item has gained focus, change active element to match
   */
  _focusIn: function(e) {
    // only worry about these when we are in edit mode
    if (this.editMode && !this.__tabTrap) {
      var normalizedEvent = dom(e);
      var local = normalizedEvent.localTarget;
      var tags = window.HaxStore.instance.validTagList;
      let containerNode = local;
      let activeNode = null;
      // ensure this is valid
      if (
        this._haxElementTest(containerNode) &&
        containerNode.parentNode != null
      ) {
        // keep looking til we are juuuust below the container
        // @todo this is where we force a selection on highest level
        // of the document
        while (containerNode.parentNode.tagName != "HAX-BODY") {
          // make sure active is set after closest legit element
          if (
            activeNode === null &&
            tags.includes(containerNode.tagName.toLowerCase()) &&
            containerNode.tagName !== "LI" &&
            containerNode.tagName !== "B" &&
            containerNode.tagName !== "I" &&
            containerNode.tagName !== "STRONG" &&
            containerNode.tagName !== "EM"
          ) {
            activeNode = containerNode;
          }
          containerNode = containerNode.parentNode;
        }
        // case with simple element
        if (activeNode === null) {
          activeNode = containerNode;
        }
        // we only allow disconnected node from container when
        // the container is a grid plate
        else if (!window.HaxStore.instance.isGridPlateElement(containerNode)) {
          activeNode = containerNode;
        }
        // won't deal with lists inside of p tags
        else if (
          ["UL", "OL", "LI", "P", "GRID-PLATE"].includes(
            containerNode.tagName
          ) &&
          ["UL", "OL", "LI"].includes(activeNode.tagName)
        ) {
          activeNode = containerNode;
        }
        // ensure this is a tag we care about / have support for and
        // that it is a new value
        if (
          this.activeContainerNode !== containerNode &&
          tags.includes(containerNode.tagName.toLowerCase()) &&
          !containerNode.classList.contains("ignore-activation")
        ) {
          window.HaxStore.write("activeContainerNode", containerNode, this);
          e.stopPropagation();
        } else if (containerNode.classList.contains("ignore-activation")) {
          e.stopPropagation();
        }
        // test for active node changing
        if (
          this.activeNode !== activeNode &&
          tags.includes(containerNode.tagName.toLowerCase()) &&
          !activeNode.classList.contains("ignore-activation")
        ) {
          setTimeout(() => {
            window.HaxStore.write("activeNode", activeNode, this);
          }, 50);
          e.stopPropagation();
        }
      }
    } else {
      this.__tabTrap = false;
    }
  },
  /**
   * Notice the change between states for editing.
   */
  _editModeChanged: function(newValue, oldValue) {
    // fire above that we have changed states so things can react if needed
    if (typeof oldValue !== typeof undefined) {
      this._applyContentEditable(newValue);
      if (
        newValue !== false &&
        typeof this.activeNode !== typeof undefined &&
        this.activeNode !== null
      ) {
        this.positionContextMenus(this.activeNode, this.activeContainerNode);
      }
    }
    // hide menus when state changes
    if (newValue === false) {
      this.hideContextMenus();
    }
  },
  /**
   * Test if this is a HAX element or not
   */
  _haxResolvePreviousElement: function(node) {
    node = dom(node).previousElementSibling;
    while (
      typeof node.tagName !== typeof undefined &&
      node.tagName.substring(0, 4) === "HAX-"
    ) {
      node = dom(node).previousElementSibling;
    }
    return node;
  },
  /**
   * Test if this is a HAX element or not
   */
  _haxElementTest: function(node) {
    if (
      typeof node.tagName !== typeof undefined &&
      node.tagName.substring(0, 4) !== "HAX-"
    ) {
      return true;
    }
    return false;
  },
  /**
   * Test if this is an HTML primative
   */
  _HTMLPrimativeTest: function(node) {
    if (
      typeof node.tagName !== typeof undefined &&
      node.tagName.indexOf("-") == -1
    ) {
      return true;
    }
    return false;
  },
  /**
   * Walk everything we find and either enable or disable editable state.
   */
  _applyContentEditable: function(status, target = this.$.body) {
    let children = dom(target).getDistributedNodes();
    // fallback for content nodes if not polymer managed nodes above
    if (children.length === 0) {
      children = dom(target).getEffectiveChildNodes();
    }
    for (var i = 0, len = children.length; i < len; i++) {
      // we have to tell the browser that primatives are editable
      if (this._HTMLPrimativeTest(children[i])) {
        children[i].contentEditable = status;
      }
      // this does the real targetting
      if (this._haxElementTest(children[i])) {
        if (status) {
          children[i].setAttribute("data-editable", status);
          children[i].setAttribute("data-hax-ray", children[i].tagName);
        } else {
          children[i].removeAttribute("data-editable");
          children[i].removeAttribute("data-hax-ray");
        }
      }
    }
  },
  /**
   * Container has changed
   */
  _activeContainerNodeChanged: function(newValue, oldValue) {
    if (
      this.editMode &&
      typeof newValue !== typeof undefined &&
      newValue !== null
    ) {
      let tag = newValue.tagName.toLowerCase();
      // special case for the grid plate since it brings in dom nodes
      // nested in it and needs to be put into an editMode
      if (tag === "grid-plate") {
        newValue.editMode = this.editMode;
        this._applyContentEditable(this.editMode, newValue);
      }
    }
  },
  /**
   * React to a new node being set to active.
   */
  _activeNodeChanged: function(newValue, oldValue) {
    // clean up the older one
    if (typeof oldValue !== typeof undefined && oldValue != null) {
      oldValue.classList.remove("hax-active");
    }
    if (
      this.editMode &&
      typeof newValue !== typeof undefined &&
      newValue !== null
    ) {
      let tag = newValue.tagName.toLowerCase();
      // remove the menu, establish the new active, then reapply
      // this is nessecary because the context menu gets appended into
      // the document
      // only hide if we change containers
      newValue.classList.add("hax-active");
      this.$.textcontextmenu.selectedValue = tag;
      // position the operations / in context element
      setTimeout(() => {
        this.positionContextMenus(
          newValue,
          window.HaxStore.instance.activeContainerNode
        );
      }, 25);
      if (newValue.style.textAlign == "right") {
        this.$.textcontextmenu.justifyIcon = "editor:format-align-right";
        this.$.textcontextmenu.justifyValue = "text-align-right";
      } else if (newValue.style.textAlign == "left") {
        this.$.textcontextmenu.justifyIcon = "editor:format-align-left";
        this.$.textcontextmenu.justifyValue = "text-align-left";
      } else if (newValue.style.float == "left") {
        this.$.cecontextmenu.justifyIcon = "editor:format-align-left";
        this.$.cecontextmenu.justifyValue = "hax-align-left";
      } else if (newValue.style.float == "right") {
        this.$.cecontextmenu.justifyIcon = "editor:format-align-right";
        this.$.cecontextmenu.justifyValue = "hax-align-right";
      } else if (newValue.style.margin == "0 auto") {
        this.$.cecontextmenu.justifyIcon = "editor:format-align-center";
        this.$.cecontextmenu.justifyValue = "hax-align-center";
      }
    }
    // just hide menus if we don't have an active item
    else if (newValue === null) {
      this.hideContextMenus();
      this.$.textcontextmenu.justifyIcon = "editor:format-align-left";
      this.$.textcontextmenu.justifyValue = "text-align-left";
    }
  },
  /**
   * Handle display and position of the context menu
   */
  _positionContextMenu: function(
    menu,
    target,
    xoffset,
    yoffset,
    matchStyle = true
  ) {
    try {
      dom(this).insertBefore(menu, target);
    } catch (err) {
      try {
        dom(target.parentNode).insertBefore(menu, target);
      } catch (err2) {}
    }
    // account for the target using these layout busters
    if (matchStyle) {
      menu.style.width = target.style.width;
    }
    // make it account for the offset if it's floated over to one side
    // or inside of something that's over that way
    let style = target.currentStyle || window.getComputedStyle(target);
    if (parseInt(style.marginLeft) != 0) {
      xoffset = xoffset + parseInt(style.marginLeft);
    } else {
      xoffset = xoffset + parseInt(target.offsetLeft) - this.offsetLeft;
    }
    if (xoffset != null) {
      menu.style["margin-left"] = xoffset + "px";
    }
    if (yoffset != null) {
      menu.style["margin-top"] = yoffset + "px";
    }
    menu.classList.add("hax-context-visible");
    async.microTask.run(this._keepContextVisible());
  },
  /**
   * Simple hide / reset of whatever menu it's handed.
   */
  _hideContextMenu: function(menu) {
    menu.classList.remove("hax-context-visible");
    menu.classList.remove("hax-context-pin-top");
    menu.classList.remove("hax-context-pin-bottom");
    dom(this.$.contextcontainer).appendChild(menu);
  },
  /**
   * When the user hits escape key, let's deselect what we have now
   */
  _escKeyPressed: function(e) {
    if (this.editMode) {
      e.preventDefault();
      e.stopPropagation();
      // support 1st press only closing the inline context menu
      if (this.$.textcontextmenu.highlightOps) {
        this.$.textcontextmenu.highlightOps = false;
        // ensure these are the same
        window.HaxStore.write("activeNode", this.activeContainerNode, this);
        this.activeContainerNode.focus();
      } else if (this.activeNode === this.activeContainerNode) {
        window.HaxStore.write("activeContainerNode", null, this);
        window.HaxStore.write("activeNode", null, this);
        document.body.focus();
      } else {
        window.HaxStore.write("activeNode", this.activeContainerNode, this);
        this.activeContainerNode.focus();
      }
    }
  },
  /**
   * When the user hits delete, test if there's any content
   * left in this container. If thre isn't then delete the
   * container itself
   */
  _delKeyPressed: function(e) {
    if (this.editMode) {
      const activeNodeTextContent = dom(this.activeContainerNode).textContent;
      if (activeNodeTextContent === "") {
        e.preventDefault();
        e.stopPropagation();
        this.haxDeleteNode(this.activeContainerNode);
      } else if (
        window.HaxStore.instance.isTextElement(
          this._haxResolvePreviousElement(this.activeContainerNode)
        )
      ) {
        // test selection to see if we are at beginning of
        // whatever element this is
        var selection = window.getSelection();
        let range = selection.getRangeAt(0).cloneRange();
        // ensure our range is not inside of a list item
        let tagTest = range.commonAncestorContainer.tagName;
        if (typeof tagTest === typeof undefined) {
          tagTest = range.commonAncestorContainer.parentNode.tagName;
        }
        // must strictly be single placement cursor at start of tag
        if (
          range.startOffset === 0 &&
          range.endOffset === 0 &&
          !["UL", "OL", "LI"].includes(tagTest)
        ) {
          e.preventDefault();
          e.stopPropagation();
          while (this.activeContainerNode.firstChild) {
            this._haxResolvePreviousElement(
              this.activeContainerNode
            ).appendChild(this.activeContainerNode.firstChild);
          }
          setTimeout(() => {
            this.haxDeleteNode(this.activeContainerNode);
          }, 100);
        }
      }
    }
  },
  /**
   * Move between things pressing up and down if empty
   */
  _upKeyPressed: function(e) {
    if (this.editMode && dom(this.activeContainerNode).textContent === "") {
      let node = this._haxResolvePreviousElement(this.activeContainerNode);
      // see if we can focus it otherwise we were at the top
      try {
        node.focus();
      } catch (e) {
        // if an error then we are at the top anyway
      }
    }
  },
  /**
   * Move between things pressing up and down if empty
   */
  _downKeyPressed: function(e) {
    if (this.editMode && dom(this.activeContainerNode).textContent === "") {
      let node = dom(this.activeContainerNode);
      // try and focus on the next thing
      try {
        node.nextElementSibling.focus();
      } catch (e) {
        // do nothing, at bottom
      }
    }
  },
  /**
   * Find the next thing to tab forward to.
   */
  _tabKeyPressed: function(e) {
    if (this.editMode) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      let focus = false;
      let node = this.activeContainerNode;
      const activeNodeTagName = this.activeContainerNode.tagName;
      // try selection / tab block since range can cause issues
      try {
        var selection = window.getSelection();
        let range = selection.getRangeAt(0).cloneRange();
        var tagTest = range.commonAncestorContainer.tagName;
        if (typeof tagTest === typeof undefined) {
          tagTest = range.commonAncestorContainer.parentNode.tagName;
        }
        if (
          ["UL", "OL", "LI"].includes(activeNodeTagName) ||
          ["UL", "OL", "LI"].includes(tagTest)
        ) {
          if (this.polyfillSafe) {
            document.execCommand("indent");
            this.__tabTrap = true;
          }
        } else {
          while (!focus) {
            // do nothing
            if (dom(node).nextSibling == null) {
              focus = true;
            } else if (dom(node).nextSibling.focus === "function") {
              dom(node).nextSibling.focus();
              focus = true;
            } else {
              node = dom(node).nextSibling;
            }
          }
        }
      } catch (e) {}
    }
  },
  /**
   * Move back through things when tab back pressed
   */
  _tabBackKeyPressed: function(e) {
    if (this.editMode) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      let node = dom(this.activeContainerNode).previousSibling;
      const activeNodeTagName = this.activeContainerNode.tagName;
      var selection = window.getSelection();
      try {
        let range = selection.getRangeAt(0).cloneRange();
        if (
          ["UL", "OL", "LI"].includes(activeNodeTagName) ||
          ["UL", "OL", "LI"].includes(
            range.commonAncestorContainer.parentElement.tagName
          )
        ) {
          if (this.polyfillSafe) {
            document.execCommand("outdent");
            this.__tabTrap = true;
          }
        } else {
          if (node != null) {
            // step back ignoring hax- prefixed elements
            while (node != null && !this._haxElementTest(node)) {
              node = dom(node).previousSibling;
            }
          }
          if (node != null) {
            setTimeout(() => {
              node.focus();
            }, 100);
          }
        }
      } catch (e) {}
    }
  }
});
