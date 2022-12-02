/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, css, html } from "lit";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { HAXStore } from "@lrnwebcomponents/hax-body/lib/hax-store";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { JSONOutlineSchemaItem } from "@lrnwebcomponents/json-outline-schema/lib/json-outline-schema-item.js";
import { JsonOutlineSchema } from "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";

/**
  * `outline-designer`
  * @element outline-designer
  * `tools to modify and visualize JSON Outline Schema for editing`
  * @demo demo/index.html
  */
export class OutlineDesigner extends I18NMixin(LitElement) {
  static get styles() {
    return [
      css`
      :host {
        display: block;
      }
      .controls .control {
        border: 1px solid black;
        border-radius: 0;
        padding: 4px;
      }
      simple-popover {
        --simple-popover-max-height: 300px;
      }
      simple-popover *:not(.close-btn) {
        max-width: 40vw;
      }
      simple-popover::part(simple-popover-content) {
        overflow: auto;
      }
      .close-btn {
        z-index: 1000;
        background-color: white;
        border: 0px;
        border-radius: 50%;
        position: absolute;
        top: 24px;
        right: 0;
      }
      .container {
        text-align: left;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      ul li {
        margin: 0;
        padding: 0;
      }
      .operation {
        display: inline-flex;
        opacity: 0;
        visibility: hidden;
        --simple-icon-width: 24px;
        --simple-icon-height: 24px;
        margin: 0 4px;
      }
      .del {
        margin-left: 32px;
      }
      .add {
        margin-left: 16px;
      }
      li .operations {
        justify-content: space-evenly;
        display: flex;
      }
      li[class*="collapsed-by-"] {
        opacity: 0;
        height: 0px !important;
        visibility: hidden;
        padding: 0px !important;
        margin: 0px !important;
        width: 0px !important;
        padding: 0px !important;
        margin: 0px !important;
        border: 0px !important;
        pointer-events: none;
        z-index: -1;
      }
      li[data-contents-collapsed] {
        opacity: 0;
        height: 0px !important;
        visibility: hidden;
        padding: 0px !important;
        margin: 0px !important;
        width: 0px !important;
        padding: 0px !important;
        margin: 0px !important;
        border: 0px !important;
        pointer-events: none;
        z-index: -1;
      }
      li simple-icon-button:hover {
        background-color: #f5f5f5;
      }
      li:hover .operation {
        visibility: visible;
        opacity: 1;
      }
      .label,
      .label-edit  {
        display: none;
      }
      span[disabled].label {
        pointer-events: none;
        opacity: .6;
      }
      .shown {
        display: inline-block;
      }
      .outline-designer-hovered {
        outline: 2px solid black;
        outline-offset: -1px;
        background-color: #e5e5e5;
      }
      .modified .label::after {
        content: "*";
        color: red;
        font-size: 20px;
        line-height: 20px;
      }
      :host([stop-animation]) .item {
        transition: none !important;
      }
      .item {
        display: -webkit-box;
        border: 1px solid grey;
        margin: 0;
        padding: 8px;
        cursor: pointer;
        opacity: 1;
        visibility: visible;
        height: 26px;
        transition: .3s padding ease-in-out, .3s border ease-in-out,.3s margin ease-in-out;
      }
      .collapse-btn {
        visibility: hidden;
      }
      .item[data-has-children] .collapse-btn {
        visibility: visible;
      }
      .item:hover,
      .item:focus {
        background-color: #f5f5f5;
      }
      ul {
        list-style: none;
      }
      .item .label {
        font-size: 14px;
        font-weight: bold;
        min-width: 200px;
        margin-right: 8px;
        max-width: 50%;
        line-height: 1;
      }
      .content-child {
        margin-left: 46px;
        border-top: none;
        border-bottom: none;
      }
      .content-non-heading {
        margin-left: 64px;
      }
      .indent-0 {
        padding-left: 0px;
      }
      .indent-1 {
        padding-left: 16px;
      }
      .indent-2 {
        padding-left: 32px;
      }
      .indent-3 {
        padding-left: 48px;
      }
      .indent-4 {
        padding-left: 64px;
      }
      .indent-5 {
        padding-left: 80px;
      }
      .indent-6 {
        padding-left: 96px;
      }
      .indent-7 {
        padding-left: 112px;
      }
      .indent-8 {
        padding-left: 128px;
      }
      .indent-9 {
        padding-left: 128px;
      }
      .indent-10 {
        padding-left: 128px;
      }
      .indent-11 {
        padding-left: 128px;
      }
      .indent-12 {
        padding-left: 128px;
      }
    `];
  }
  constructor() {
    super();
    this.hideContentOps = false;
    this.items = [];
    this.appReady = false;
    this.eventData = {};
    this.activeId = null;
    this.activePreview = null;
    this.activePreviewIndex = -1;
    this.t = {
      selectParent: "Select target",
      importContentUnderThisPage: "Import content under this page",
      importThisContent: "Import this content",
      thisPage: "this page",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
      locales: ["es"],
    });
    // so we can prepopulate the parent options menu
    autorun(() => {
      this.activeId = toJS(store.activeId);
    });
    autorun(() => {
      this.appReady = toJS(store.appReady);
    });
    this.addEventListener('click', this.resetPopOver.bind(this));
  }
  resetPopOver() {
    // clean up if something is active
    if (this.activePreview) {
      this.shadowRoot.querySelector('simple-popover').setAttribute('hidden','hidden');
      this.activePreview = null;
      this.activePreviewIndex = -1;
    }
  }
  // selectable list of items in the current site
  getSiteItems() {
    // default to null parent as the whole site
    var items = [
      {
        text: this.t.selectParent,
        value: null,
      },
    ];
    if (this.appReady && this.items.length > 0) {
      const rawItemList = store.getManifestItems(true);
      rawItemList.forEach((el) => {
        // calculate -- depth so it looks like a tree
        let itemBuilder = el;
        // walk back through parent tree
        let distance = "- ";
        while (itemBuilder && itemBuilder.parent != null) {
          itemBuilder = rawItemList.find((i) => i.id == itemBuilder.parent);
          // double check structure is sound
          if (itemBuilder) {
            distance = "--" + distance;
          }
        }
        items.push({
          text: distance + el.title,
          value: el.id,
        });
      });
    }
    return items;
  }
  // render function
  render() {
    return html`
    <div class="controls">
      <label for="targetselector">${this.t.importThisContent}</label>
      <simple-fields-field id="targetselector" type="select" value="children" .itemsList="${[
        {
          text: "as children of",
          value: "children",
        },
        {
          text: "Above",
          value: "above",
        },
        {
          text: "Below",
          value: "below",
        },
      ]}"></simple-fields-field>
      ${this.t.thisPage}:
      <simple-fields-field id="itemselector" type="select" value="${this.activeId}" .itemsList="${this.getSiteItems()}"></simple-fields-field>
      <label for="itemselector">${this.t.importContentUnderThisPage}</label>
      <simple-icon-button-lite icon="hardware:keyboard-arrow-right" @click="${this.collapseAll}" class="control">Collapse all</simple-icon-button-lite>
      <simple-icon-button-lite icon="hardware:keyboard-arrow-down" @click="${this.expandAll}" class="control">Expand all</simple-icon-button-lite>
    </div>
    <ul id="list">
      ${this.items.map((item, index) => this.renderItem(item, index))}
    </ul>
    <simple-popover auto for="list" hidden>
      <simple-icon-button @click="${this.resetPopOver}" title="Close" icon="cancel" class="close-btn"></simple-icon-button>
      ${this.renderActiveContentItem(this.activePreview, this.activePreviewIndex)}
    </simple-popover>`;
  }

  renderActiveContentItem(itemId, targetNodeIndex) {
    if (itemId && targetNodeIndex != -1) {
      let item = this.items.find((item) => item.id === itemId);
      // should have contents but verify
      if (item.contents) {
        let div = document.createElement('div');
        div.innerHTML = item.contents;
        // walk up to the index in question
        for (let i=0; i < div.childNodes.length; i++) {
          let node = div.childNodes[i];
          if (i === targetNodeIndex) {
            return html`${unsafeHTML(node.outerHTML)}`;
          }
        }
      }
    }
  }

  renderItem(item, index) {
    return html`
    <li
      @dragenter="${this._dragEnter}"
      @dragleave="${this._dragLeave}"
      class="item indent-${item.indent} ${item.modified ? 'modified' : ''}"
      data-item-id="${item.id}"
      data-parents="${this.getItemParents(item)}"
      ?data-has-children="${this.hasChildren(item.id)}"
      data-collapse-contents="true"
    >
      <simple-icon-button
        class="collapse-btn"
        ?disabled="${this.isLocked(index)}"
        icon="${this.isCollapsed(item.id) ? `hardware:keyboard-arrow-right` : `hardware:keyboard-arrow-down`}"
        @click="${this.collapseExpand}"></simple-icon-button>
      <simple-icon-button
        ?disabled="${this.isLocked(index)}"
        @dragstart="${this._dragStart}"
        @dragend="${this._dragEnd}"
        draggable="${!this.isLocked(index)}"
        icon="hax:arrow-all"></simple-icon-button>
      <simple-icon-button
        ?hidden="${!this.hasContents(item) || this.hideContentOps}"
        icon="editor:insert-drive-file"
        @click="${this.toggleContent}"
        title="Content structure"
        ></simple-icon-button>
      <span class="label shown" ?disabled="${this.isLocked(index)}" @dblclick="${this.editTitle}">${item.title}</span>
      <span class="label-edit" @keypress="${this.monitorTitle}" @keydown="${this.monitorEsc}"></span>
      <div class="operations">
        <simple-icon-button
          class="operation"
          icon="${this.isLocked(index)
            ? "icons:lock"
            : "icons:lock-open"}"
          @click="${(e) => this.itemOp(index, "lock")}"
          title="Lock / Unlock"
        ></simple-icon-button>
        <simple-icon-button
          class="operation"
          icon="hax:keyboard-arrow-up"
          @click="${(e) => this.itemOp(index, "up")}"
          title="Move up"
          ?disabled="${this.isLocked(index)}"
        ></simple-icon-button>
        <simple-icon-button
          class="operation"
          icon="hax:keyboard-arrow-down"
          @click="${(e) => this.itemOp(index, "down")}"
          title="Move down"
          ?disabled="${this.isLocked(index)}"
        ></simple-icon-button>
        <simple-icon-button
          class="operation"
          icon="hax:outline-designer-indent"
          @click="${(e) => this.itemOp(index, "in")}"
          title="Make child"
          ?disabled="${this.isLocked(index)}"
        ></simple-icon-button>
        <simple-icon-button
          class="operation"
          icon="hax:outline-designer-outdent"
          @click="${(e) => this.itemOp(index, "out")}"
          title="Move next to parent"
          ?disabled="${this.isLocked(index)}"
        ></simple-icon-button>
        <simple-icon-button
          class="operation add"
          icon="add"
          accent-color="green"
          @click="${(e) => this.itemOp(index, "add")}"
          title="Add"
          ?disabled="${this.isLocked(index)}"
        ></simple-icon-button>
        <simple-icon-button
          class="operation"
          icon="content-copy"
          accent-color="green"
          @click="${(e) => this.itemOp(index, "duplicate")}"
          title="Duplicate"
          ?disabled="${this.isLocked(index)}"
        ></simple-icon-button>
        <simple-icon-button
          class="operation del"
          icon="delete"
          accent-color="red"
          @click="${(e) => this.itemOp(index, "delete")}"
          title="Delete"
          ?disabled="${this.isLocked(index)}"
        ></simple-icon-button>
      </div>
    </li>
    ${!this.hideContentOps ? this.renderItemContents(item) : ``}
    `;
  }

  hasContents(item) {
    if (item.contents && item.contents != '') {
      return true;
    }
    return false;
  }

  renderItemContents(item) {
    let render = [];
    if (item.contents) {
      let div = document.createElement('div');
      div.innerHTML = item.contents;
      div.childNodes.forEach((node, index) => render.push(this.renderNodeAsItem(node, index, item.id, parseInt(item.indent)+1)));
    }
    return render;
  }
  renderNodeAsItem(node, index, itemId, indent) {
    let tagName = node.tagName.toLowerCase();
    let icon = 'hax:bricks';
    let label = tagName;
    let part = 'non-heading';
    let schema = HAXStore.haxSchemaFromTag(tagName);
    if (schema && schema.gizmo) {
      icon = schema.gizmo.icon;
      label = schema.gizmo.title;
      // headings we want to render the title as it can become a full page
      switch(tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          label = node.innerText;
          part = 'heading';
        break;
      }
    }  
    return html`
    <li @click="${this.setActivePreview}" class="item content-child content-${part} indent-${indent}" data-node-index="${index}" data-content-parent-id="${itemId}" data-contents-collapsed>
      <simple-icon-lite icon="${icon}"></simple-icon-lite>
      <span class="label shown">${label}</span>
      ${part === 'heading' ? html`<simple-icon-button icon="editor:format-page-break" @click="${this.pageBreakHere}" title="Promote to page"></simple-icon-button>` : ``}
    </li>`;
  }
  setActivePreview(e) {
    let target = e.target.closest('[data-content-parent-id]');
    let itemId = target.getAttribute('data-content-parent-id');
    let targetNodeIndex = parseInt(target.getAttribute('data-node-index'));
    this.activePreview = itemId;
    this.shadowRoot.querySelector('simple-popover').removeAttribute('hidden');
    // set target so it points to our current item
    this.shadowRoot.querySelector('simple-popover').target = target;
    this.activePreviewIndex = targetNodeIndex;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  pageBreakHere(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // Take UI index and split at that dom node by recreating
    // the structure. Bonkers.
    let target = e.target.closest('[data-content-parent-id]');
    let itemId = target.getAttribute('data-content-parent-id');
    let targetNodeIndex = parseInt(target.getAttribute('data-node-index'));
    let item = this.items.find((item) => item.id === itemId);
    let targetItemIndex;
    this.items.map((item, index) => item.id === itemId ? targetItemIndex = index : null);
    // should have contents but verify
    if (item.contents) {
      let div = document.createElement('div');
      div.innerHTML = item.contents;
      let oldContent = '';
      let newContent = '';
      let title = 'New page';
      // walk up to the index in question
      for (let i=0; i < div.childNodes.length; i++) {
        let node = div.childNodes[i];
        // so long as index is LOWER than the target, this is original item content
        if (i < targetNodeIndex) {
          oldContent += node.outerHTML;
        }
        else if (i === targetNodeIndex) {
          if (node.innerText != '') {
            title = node.innerText;
          }
        }
        else {
          newContent += node.outerHTML;
        }
      }
      item.contents = oldContent;
      // create a new item
      let newItem = new JSONOutlineSchemaItem();
      newItem.title = title;
      newItem.slug = newItem.id;
      newItem.order = item.order + 1;
      newItem.order = parent.order;
      newItem.indent = item.indent;
      newItem.metadata.locked = false;
      newItem.modified = true;
      newItem.contents = newContent;
      // splice back into the items array just below where we issued the split
      this.items.splice(targetItemIndex+1, 0, newItem);
      this.resetPopOver();
      this.requestUpdate();
    }
  }
  toggleCollapseContentItem(target, itemId, open) {
    if (open) {
      target.setAttribute('data-collapse-contents', 'true');
      this.shadowRoot.querySelectorAll(`[data-content-parent-id="${itemId}"]`).forEach((item => {item.setAttribute('data-contents-collapsed', itemId)}))
    }
    else {
      target.removeAttribute('data-collapse-contents');
      this.shadowRoot.querySelectorAll(`[data-content-parent-id="${itemId}"]`).forEach((item => {item.removeAttribute('data-contents-collapsed')}))
    }
  }

  collapseAll() {
    this.shadowRoot.querySelectorAll('[data-has-children]:not([data-collapsed]) .collapse-btn').forEach((node) => node.click());
  }
  expandAll() {
    this.shadowRoot.querySelectorAll('[data-has-children][data-collapsed] .collapse-btn').forEach((node) => node.click());
  }

  getItemParents(activeItem) {
    let parent = this.items.find((item) => item.id == activeItem.parent);
    let list = '';
    while (parent) {
      list+= parent.id + " ";
      parent = this.items.find((item) => item.id == parent.parent);
    }
    return list;
  }

  isCollapsed(id) {
    if (this.shadowRoot.querySelector(`[data-item-id="${id}"]`) && this.shadowRoot.querySelector(`[data-item-id="${id}"]`).hasAttribute('data-collapsed')) {
      return true;
    }
    return false;
  }

  hasChildren(id) {
    let children = this.items.find((item) => item.parent == id);
    if (children) {
      return true;
    }
    return false;
  }
  collapseExpand(e) {
    let itemId = e.target.closest("[data-item-id]").getAttribute('data-item-id');
    if (e.target.closest("[data-item-id]").hasAttribute('data-collapsed')) {
      this.toggleCollapseItemId(e.target.closest("[data-item-id]"), itemId, true);
    }
    else {
      this.toggleCollapseItemId(e.target.closest("[data-item-id]"), itemId, false);
    }
    this.requestUpdate();
  }
  
  toggleCollapseItemId(target, itemId, open) {
    if (open) {
      target.removeAttribute('data-collapsed');
      this.shadowRoot.querySelectorAll(`.collapsed-by-${itemId}[data-parents~="${itemId}"]`).forEach((item => {item.classList.remove(`collapsed-by-${itemId}`)}))
    }
    else {
      target.setAttribute('data-collapsed', itemId);
      this.shadowRoot.querySelectorAll(`[data-parents~="${itemId}"]`).forEach((item => { item.classList.add(`collapsed-by-${itemId}`)}))
    }
  }

  toggleContent(e) {
    // prevent if we are in a disabled state
    if (!e.target.disabled) {
      let itemId = e.target.closest("[data-item-id]").getAttribute('data-item-id');
      if (e.target.closest("[data-item-id]").getAttribute('data-collapse-contents')) {
        this.toggleCollapseContentItem(e.target.closest("[data-item-id]"), itemId, false);
      }
      else {
        this.toggleCollapseContentItem(e.target.closest("[data-item-id]"), itemId, true);
      }
      this.requestUpdate();
    }
  }

  editTitle(e) {
    e.target.classList.remove('shown');
    e.target.nextElementSibling.classList.add('shown');
    e.target.nextElementSibling.setAttribute('contenteditable','true');
    e.target.nextElementSibling.innerText = e.target.innerText;
    e.target.nextElementSibling.focus();
  }
  
  monitorTitle(e) {
    if (e.key === 'Enter') {
      e.target.classList.remove('shown');
      e.target.previousElementSibling.classList.add('shown');
      e.target.removeAttribute('contenteditable');
      let itemId = e.target.closest("[data-item-id]").getAttribute('data-item-id');
      for ( let index = 0; index < this.items.length; index++) {
        if (this.items[index].id === itemId) {
          this.items[index].modified = true;
          this.items[index].title = e.target.innerText;
        }
      }
      setTimeout(() => {
        this.requestUpdate();
      }, 0);
    }
  }

  monitorEsc(e) {
    if (e.key === 'Escape') {
      e.target.classList.remove('shown');
      e.target.removeAttribute('contenteditable');
      e.target.previousElementSibling.classList.add('shown');
      e.target.innerText = e.target.previousElementSibling.innerText;
    }
  }
  _mouseDownDrag(e) {
    // force collapse kids on move
    let target = e.target.closest("[data-item-id]");
    if (target.getAttribute('data-has-children') != null) {
      this.toggleCollapseItemId(target, target.getAttribute("data-item-id"), false);
      this.requestUpdate();
    }
  }
  /**
   * Enter an element, meaning we've over it while dragging
   */
  _dragEnter(e) {
    if (this._targetDrop !== e.target.closest("[data-item-id]")) {
      e.preventDefault();
      e.target.closest("[data-item-id]").classList.add("outline-designer-hovered");
      this._targetDrop = e.target.closest("[data-item-id]");        
    }
  }
  /**
   * Leaving an element while dragging.
   */
  _dragLeave(e) {
    if (this._targetDrop !== e.target.closest("[data-item-id]")) {
      e.target.closest("[data-item-id]").classList.remove("outline-designer-hovered");
    }
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  _dragEnd(e) {
    if (this._targetDrag && this._targetDrop) {
      let here = null;
      let from = null;
      for ( let index = 0; index < this.items.length; index++) {
        let item = this.items[index];
        if (item.id === this._targetDrop.getAttribute('data-item-id')) {
          here = index;
        }
        if (item.id === this._targetDrag.getAttribute('data-item-id')) {
          from = index;
        }
      }
      if (from !== null && here !== null) {
        let element = this.items.splice(from, 1)[0];
        element.modified = true;
        element.order = this.items[here].order+1;
        element.indent = this.items[here].indent;
        this.items.splice(here, 0, element);
      }
      // expand on drop
      if (this._targetDrag.getAttribute('data-has-children') != null) {
        this.toggleCollapseItemId(this._targetDrag, this._targetDrag.getAttribute("data-item-id"), true);
      }
      this._targetDrag = null;
      this._targetDrop = null;
      setTimeout(() => {
        this.requestUpdate();
      }, 0);
    }
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    if (e.target.getAttribute('disabled') == null) {
      let target = e.target.closest("[data-item-id]");
      this._targetDrop = null;
      this._targetDrag = target;
      this._mouseDownDrag(e);
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setDragImage(target, 24, 16);
      }
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      eventData: { type: Object },
      items: { type: Array },
      appReady: { type: Boolean},
      activePreview: { type: String },
      activePreviewIndex: { type: Number },
      hideContentOps: { type: Boolean, reflect: true, attribute: "hide-content-ops" },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "outline-designer";
  }

  /**
   * Return all data associated with the current tree
   * @note this makes more sense when we allow manipulation via this object and its options
   */
  async getData() {
    const parentId = this.shadowRoot.querySelector("#itemselector").value;
    const targetSelector = this.shadowRoot.querySelector("#targetselector").value;
    let eventData = this.eventData;
    eventData.items = [...this.items];
    let count = 0;
    await eventData.items.map(async (item, index) => {
      if (parentId && item.parent == null) {
        // helps in supporting multiple imports at a time
        count++;
        let parentItem = await store.findItemAsObject(parentId);
        switch (targetSelector) {
          case 'below':
            eventData.items[index].parent = parentItem.parent;
            eventData.items[index].order = parseInt(parentItem.order) + count;  
          break;
          case 'above':
            eventData.items[index].parent = parentItem.parent;
            // @todo this is currently the reverse order desired if
            // multiple top level children existed on the import
            eventData.items[index].order = parseInt(parentItem.order) - count;
          break;
          case 'children':
            eventData.items[index].parent = parentId;
          break;
        }
      }
    })
    return eventData;
  }
  
  isLocked(index) {
    if (index !== false && this.items[index] && this.items[index].metadata && this.items[index].metadata.locked) {
      return true;
    }
    return false;
  }

  addNewItem(targetItemIndex, duplicate = false) {
    const item = this.items[targetItemIndex];
    let newItem = new JSONOutlineSchemaItem();
    newItem.order = item.order + 1;
    newItem.parent = item.parent;
    newItem.indent = item.indent;
    newItem.slug = newItem.id;
    newItem.metadata.locked = false;
    newItem.modified = true;
    newItem.new = true;
    if (duplicate) {
      newItem.title = `copy of ${item.title}`;
      newItem.contents = item.contents;
    }
    else {
      newItem.contents = `<p></p>`;
    }
    // splice back into the items array just below where we issued the split
    this.items.splice(targetItemIndex+1, 0, newItem);
  }
  // operations that can be clicked individually per item
  itemOp(index, action) {
    if (index !== false && this.items[index] && action) {
      // verify this is not locked
      if (!this.items[index].metadata.locked) {
        switch (action) {
          case "lock":
            this.items[index].metadata.locked = true;
            break;
          case "delete":
            this.setAttribute('stop-animation', 'true');
            this.items.splice(index, 1);
            break;
          case "add":
            this.addNewItem(index);
          break;
          case "duplicate":
            this.addNewItem(index, true);
          break;
          case "in":
            // move below sibling just before it
            if (index !== 0 && this.items[index].parent != this.items[index-1].id) {
              let parent = this.items[index-1];
              this.items[index].parent = parent.id;
              this.items[index].order = 0;
              this.items[index].indent = parseInt(parent.indent)+1;
              this.items[index].modified = true;
              // ensure children indent accurately
              this.recurseUpdateIndent(this.items[index], 1);
            }
          break;
          case "out":
            if (this.items[index].parent !== null) {
              // move just after parent and take on it's parent
              let sibling = this.items.find(item => this.items[index].parent === item.id);
              this.items[index].parent = sibling.parent;
              this.items[index].order = parseInt(sibling.order)+1;
              this.items[index].indent = parseInt(sibling.indent);
              this.items[index].modified = true;
              // ensure children indent accurately
              this.recurseUpdateIndent(this.items[index], -1);
            }
          break;
          case "down":
            if (index < this.items.length) {
              // @todo this needs to find thing after it
              // and swap values
              let element = this.items.splice(index, 1)[0];
              element.modified = true;
              element.order = parseInt(element.order)+1;
              this.items.splice(index+1, 0, element);
            }
          break;
          case "up":
            if (index !== 0) {
              // @todo this needs to find thing before it
              // and swap values
              let element = this.items.splice(index, 1)[0];
              element.modified = true;
              element.order = parseInt(element.order)-1;
              this.items.splice(index-1, 0, element);
            }
            break;
        }
      } else if (action === "lock") {
        this.items[index].metadata.locked = false;
      }
      // fake a schema so we can force an order update to JOS format
      // this way the above will ALWAYS order correctly if the data model change is accurate
      let site = new JsonOutlineSchema();
      // we already have our items, pass them in
      let nodes = site.itemsToNodes(this.items);
      // smash outline into flat to get the correct order
      let correctOrder = site.nodesToItems(nodes);
      let newItems = [];
      // build a new array in the correct order by pushing the old items around
      // delete "children" key as we deal in JOS only here
      for (var key in correctOrder) {
        let newItem = this.items.find((element) => {
          return element.id === correctOrder[key].id;
        });
        if (newItem) {
          delete newItem.children;
          newItems.push(
            newItem
          );  
        }
      }
      setTimeout(() => {
        this.items = [...newItems];
        this.requestUpdate();
        setTimeout(() => {
          this.removeAttribute('stop-animation');          
        }, 300);
      }, 0);
    }
  }
  recurseUpdateIndent(topItem, incr) {
    this.items.map((item, deepIndex) => {
      if (item.parent == topItem.id) {
        this.items[deepIndex].indent = parseInt(this.items[deepIndex].indent) + incr;
        this.recurseUpdateIndent(this.items[deepIndex], incr)
      }
    });
  }
}
customElements.define(OutlineDesigner.tag, OutlineDesigner);