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
import { getRange } from "@lrnwebcomponents/utils/utils.js";
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
      .lock {
        margin-right: 16px;
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
      .active-preview-item {
        outline: 1px solid grey;
        outline-offset: -1px;
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
      .make-child-btn {
        transition: .3s all ease-in-out;
        visibility: hidden;
        opacity: 0;
      }
      .outline-designer-hovered .make-child-btn {
        visibility: visible;
        opacity: .6;
      }
      .outline-designer-hovered .make-child-btn:hover {
        opacity: 1;
      }
      .item.modified {
        border-color: #ffa5a5;
      }
      .modified .label::after {
        content: "*";
        color: red;
        font-size: 20px;
        line-height: 20px;
      }
      .new {
        --simple-icon-width: 16px;
        --simple-icon-height: 16px;
        background-color: black;
        display: block;
        margin: -14px 0 0 4px;
      }
      :host([stop-animation]) .item {
        transition: none !important;
      }
      .item {
        display: -webkit-box;
        border: 1px solid;
        border-color: grey;
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
      .item .label-edit,
      .item .label {
        cursor: text;
        font-size: 14px;
        font-weight: bold;
        min-width: 200px;
        margin-right: 8px;
        max-width: 50%;
        line-height: 2;
        padding: 0 4px;
      }

      .content-child {
        margin-left: 46px;
        border-top: none;
        border-bottom: none;
      }
      .content-heading,
      .content-non-heading {
        margin-left: 32px;
      }
      .indent-0 {
        padding-left: 0;
      }
      .indent-1 {
        padding-left: 16px;
      }
      .indent-2 {
        padding-left: calc(16px*2);
      }
      .indent-3 {
        padding-left: calc(16px*3);
      }
      .indent-4 {
        padding-left: calc(16px*4);
      }
      .indent-5 {
        padding-left: calc(16px*5);
      }
      .indent-6 {
        padding-left: calc(16px*6);
      }
      .indent-7 {
        padding-left: calc(16px*7);
      }
      .indent-8 {
        padding-left: calc(16px*8);
      }
      .indent-9 {
        padding-left: calc(16px*9);
      }
      .indent-10 {
        padding-left: calc(16px*10);
      }
      .indent-11 {
        padding-left: calc(16px*11);
      }
      .indent-12 {
        padding-left: calc(16px*12);
      }
      .indent-13 {
        padding-left: calc(16px*13);
      }
      .indent-14 {
        padding-left: calc(16px*14);
      }
      .indent-15 {
        padding-left: calc(16px*15);
      }
      .indent-16 {
        padding-left: calc(16px*16);
      }
      .indent-17 {
        padding-left: calc(16px*17);
      }
      .indent-18 {
        padding-left: calc(16px*18);
      }
      .indent-19 {
        padding-left: calc(16px*19);
      }
      .indent-20 {
        padding-left: calc(16px*20);
      }
    `];
  }
  constructor() {
    super();
    this.storeTools = false;
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
      newPage: "New page",
      copyOf: "Copy of",
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
      ${this.storeTools ? html`
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
      `: ``}
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

  renderActiveContentItem(activeItemContentNode, targetNodeIndex) {
    if (activeItemContentNode && targetNodeIndex != -1) {
      let item = this.items.find((item) => item.id === activeItemContentNode.getAttribute('data-content-parent-id'));
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
      class="item indent-${item.indent < 20 ? item.indent : 20} ${item.modified ? 'modified' : ''} ${this.getItemParentsCollapsed(item)}"
      data-item-id="${item.id}"
      data-parents="${this.getItemParents(item)}"
      ?data-has-children="${this.hasChildren(item.id)}"
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
      <simple-icon-button-lite
        ?disabled="${this.isLocked(index)}"
        ?hidden="${this.hideContentOps}"
        icon="editor:insert-drive-file"
        @click="${this.toggleContent}"
        title="Content structure"
        >
        ${item.new ? html`<simple-icon ?disabled="${this.isLocked(index)}"
 icon="av:fiber-new" title="${this.t.newPage}" class="new" accent-color="green" dark contrast="1"></simple-icon>` : ``}
      </simple-icon-button-lite>
      <span class="label shown" ?disabled="${this.isLocked(index)}" @dblclick="${this.editTitle}">${item.title}</span>
      <span class="label-edit" @keypress="${this.monitorTitle}" @keydown="${this.monitorEsc}"></span>
      <div class="operations">
        <simple-icon-button
          class="operation lock"
          icon="${this.isLocked(index)
            ? "icons:lock"
            : "icons:lock-open"}"
          @click="${(e) => this.itemOp(index, "lock")}"
          title="Lock / Unlock"
        ></simple-icon-button>
        <simple-icon-button
          class="operation"
          icon="hax:outline-designer-outdent"
          @click="${(e) => this.itemOp(index, "out")}"
          title="Move next to parent"
          ?disabled="${this.isLocked(index)}"
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
      let activeHeadingDepth = 1;
      let modifier = 0;
      div.childNodes.forEach((node, index) => {
        // increase the indent addition to match the activeheading depth
        // this way h1 gets all things below it indented 1 more level
        // while things 4 in get indented 4.
        modifier = 0;
        if (['h1','h2','h3','h4','h5','h6'].includes(node.tagName.toLowerCase())) {
          activeHeadingDepth = parseInt(node.tagName.toLowerCase().replace('h',''));
          // this ensures when we drop a level that the item itself is NOT
          // rendered a level below where it should be
          modifier = -1;
        }
        render.push(this.renderNodeAsItem(node, index, item, parseInt(item.indent) + activeHeadingDepth + modifier));
      });
    }
    return render;
  }
  // render a content node within an item
  renderNodeAsItem(node, index, item, indent) {
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
    <li 
      @click="${this.setActivePreview}"
      class="item content-child content-${part} indent-${indent < 20 ? indent : 20}" 
      data-node-index="${index}"
      data-content-parent-id="${item.id}" 
      ?data-contents-collapsed="${!item.showContent}">
      <simple-icon-lite icon="${icon}"></simple-icon-lite>
      <span class="label shown">${label}</span>
      ${part === 'heading' ? html`
      <simple-icon-button
          icon="hax:keyboard-arrow-up"
          @click="${this.modifyHeadingLevel}"
          title="Increase heading"
          value="up"
          ?disabled="${tagName === 'h1'}"
        ></simple-icon-button>  
        <simple-icon-button
          icon="hax:keyboard-arrow-down"
          @click="${this.modifyHeadingLevel}"
          title="Decrease Heading"
          value="down"
          ?disabled="${tagName === 'h6'}"
        ></simple-icon-button>
      <simple-icon-button icon="editor:format-page-break" @click="${this.pageBreakHere}" title="Promote to page"></simple-icon-button>` : ``}
    </li>`;
  }
  // preview of the item in question
  setActivePreview(e) {
    let target = e.target.closest('[data-content-parent-id]');
    let targetNodeIndex = parseInt(target.getAttribute('data-node-index'));
    this.activePreview = target;
    this.shadowRoot.querySelector('simple-popover').removeAttribute('hidden');
    // set target so it points to our current item
    this.shadowRoot.querySelector('simple-popover').target = target;
    this.activePreviewIndex = targetNodeIndex;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  // ability to mod the content to move heading up or down between h1 and h6
  modifyHeadingLevel(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // Take UI index and split at that dom node by recreating
    // the structure. Bonkers.
    let direction = e.target.value;
    let target = e.target.closest('[data-content-parent-id]');
    let itemId = target.getAttribute('data-content-parent-id');
    let targetNodeIndex = parseInt(target.getAttribute('data-node-index'));
    let item = this.items.find((item) => item.id === itemId);
    // should have contents but verify
    if (item.contents) {
      let div = document.createElement('div');
      div.innerHTML = item.contents;
      let content = '';
      // walk up to the index in question
      for (let i=0; i < div.childNodes.length; i++) {
        let node = div.childNodes[i];
        // so long as index is LOWER than the target, this is original item content
        if (i < targetNodeIndex) {
          content += node.outerHTML;
        }
        else if (i === targetNodeIndex) {
          // heading to modify
          let hlevel = parseInt(node.tagName.toLowerCase().replace('h',''));
          let h;
          if (direction === 'up' && hlevel > 1) {
            h = document.createElement(`h${hlevel-1}`);
            h.innerText = node.innerText;
          }
          else if (direction === 'down' && hlevel < 6) {
            h = document.createElement(`h${hlevel+1}`);
            h.innerText = node.innerText;
          }
          else {
            // blocked operation
            h = node;
          }
          content+= h.outerHTML;
        }
        else {
          content += node.outerHTML;
        }
      }
      item.contents = content;
      this.resetPopOver();
      this.requestUpdate();
    }
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'activePreview' && oldValue) {
        oldValue.classList.remove('active-preview-item');
      }
      if (propName === 'activePreview' && this[propName]) {
        this[propName].classList.add('active-preview-item');
      }
    });
  }
  // split page to make another one at the heading level
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
      let title = this.t.newPage;
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
      newItem.parent = item.parent;
      newItem.indent = item.indent;
      newItem.metadata.locked = false;
      newItem.new = true;
      newItem.contents = newContent;
      // set modified on targetItemIndex
      this.items[targetItemIndex].modified = true;
      // splice back into the items array just below where we issued the split
      this.items.splice(targetItemIndex+1, 0, newItem);
      this.resetPopOver();
      this.__syncUIAndDataModel();
    }
  }
  // common update
  __syncUIAndDataModel() {
    this._recurseUpdateIndent();
    this._schemaOrderUpdate();
    // delay ensures array data is updated in prior execution loop
    setTimeout(() => {
      this.requestUpdate();
      // if animation was stopped, unset it
      setTimeout(() => {
        this.removeAttribute('stop-animation');          
      }, 300);
    }, 0);
  }

  collapseAll() {
    this.items.map((item, index) => {
      if (this.hasChildren(item.id) && !item.collapsed) {
        this.items[index].collapsed = true;
      }
    });
    setTimeout(() => {
      this.requestUpdate();      
    }, 0);
  }
  expandAll() {
    this.items.map((item, index) => {
      if (this.hasChildren(item.id) && item.collapsed) {
        this.items[index].collapsed = false;
      }
    });
    setTimeout(() => {
      this.requestUpdate();      
    }, 0);
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
  // generate a class that includes all collapsed parents
  // based on the statefulness of that data
  getItemParentsCollapsed(activeItem) {
    let parent = this.items.find((item) => item.id == activeItem.parent);
    let list = '';
    while (parent) {
      if (parent.collapsed && parent.id) {
        list+= `collapsed-by-${parent.id}` + " ";
      } 
      parent = this.items.find((item) => item.id == parent.parent);
    }
    return list;
  }

  isCollapsed(itemId) {
    let item = this.items.find((item) => item.id == itemId);
    if (item.collapsed) {
      return true;
    }
    return false;
  }

  hasChildren(itemId) {
    let children = this.items.find((item) => item.parent == itemId);
    if (children) {
      return true;
    }
    return false;
  }
  collapseExpand(e) {
    let itemId = e.target.closest("[data-item-id]").getAttribute('data-item-id');
    // find the item and act on it's index to toggle content collapse status
    this.items.map((item, index) => {
      if (item.id === itemId) {
        if (this.items[index].collapsed) {
          this.items[index].collapsed = false;
        }
        else {
          this.items[index].collapsed = true;
        }          
      }
    });
    this.requestUpdate();
  }

  toggleContent(e) {
    let target = e.target.closest("[data-item-id]");
    // prevent if we are in a disabled state
    if (target && !e.target.disabled) {
      let itemId = target.getAttribute('data-item-id');
      // find the item and act on it's index to toggle content collapse status
      this.items.map((item, index) => {
        if (item.id === itemId) {
          if (this.items[index].showContent) {
            this.items[index].showContent = false;
          }
          else {
            this.items[index].showContent = true;
          }          
        }
      })
      this.requestUpdate();
    }
  }

  editTitle(e) {
    e.target.classList.remove('shown');
    let target = e.target.nextElementSibling;
    target.setAttribute('contenteditable','true');
    target.classList.add('shown');
    target.innerText = e.target.innerText;
    target.focus();
    // get the selection and select all
    if (this.shadowRoot.getSelection) {
      var range = document.createRange();
      range.selectNodeContents(target);
      this.shadowRoot.getSelection().removeAllRanges();
      this.shadowRoot.getSelection().addRange(range);
    }
    // deprecated but best we got
    else {
      try {
        document.execCommand('selectAll',false,null);
      }
      catch(e) {
        console.warn(e);
      }  
    }
  }
  
  monitorTitle(e) {
    if (e.key === 'Enter') {
      e.target.classList.remove('shown');
      e.target.previousElementSibling.classList.add('shown');
      e.target.removeAttribute('contenteditable');
      let itemId = e.target.closest("[data-item-id]").getAttribute('data-item-id');
      for ( let index = 0; index < this.items.length; index++) {
        if (this.items[index].id === itemId) {
          if (!this.items[index].new) { this.items[index].modified = true; }
          this.items[index].title = e.target.innerText;
        }
      }
      this.requestUpdate();
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
    let itemId = e.target.closest("[data-item-id]").getAttribute('data-item-id');
    this.items.map((item, index) => {
      if (item.id === itemId && this.hasChildren(item.id)) {
        this.items[index].collapsed = true;
      }
    });
    setTimeout(() => {
      this.requestUpdate();      
    }, 0);
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
   * When we end dragging this is the same as a drop event; ensure we remove the mover class.
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
        if (!this.items[from].new) { this.items[from].modified = true; }
        this.items[from].order = this.items[here].order;
        // if 1st in a hierarchy we have to go ahead of it
        if (this.items[from].order === 0) {
          this.items[from].order = -1;
        }
        this.items[from].indent = this.items[here].indent;
        this.items[from].parent = this.items[here].parent;
        if (this.hasChildren(this.items[from].id)) {
          this.items[from].collapsed = false;
        }
      }
      this._targetDrag = null;
      this._targetDrop = null;
      this.setAttribute('stop-animation', 'true');
      this.__syncUIAndDataModel();
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
      storeTools: { type: Boolean },
      eventData: { type: Object },
      items: { type: Array },
      appReady: { type: Boolean},
      activePreview: { type: Object },
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
    let eventData = this.eventData;
    eventData.items = [...this.items];
    // if we're pulling in the store to do re-parenting on the fly
    // like in the case of the import UI
    if (this.storeTools) {
      const parentId = this.shadowRoot.querySelector("#itemselector").value;
      const targetSelector = this.shadowRoot.querySelector("#targetselector").value;
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
    }
    return eventData;
  }
  
  isLocked(index) {
    if (index !== false && this.items[index] && this.items[index].metadata && this.items[index].metadata.locked) {
      return true;
    }
    return false;
  }
  // add a new page or duplicate
  addNewItem(targetItemIndex, duplicate = false, newItems = []) {
    const item = this.items[targetItemIndex];
    let newItem = new JSONOutlineSchemaItem();
    newItem.order = item.order + 1;
    newItem.parent = item.parent;
    newItem.indent = item.indent;
    newItem.slug = newItem.id;
    newItem.metadata.locked = false;
    newItem.new = true;
    if (duplicate) {
      newItem.title = `${this.t.copyOf} ${item.title}`;
      newItem.contents = item.contents;
    }
    else {
      newItem.contents = `<p></p>`;
    }
    newItems.push(newItem);
    // if we were told to duplicate and we have kids, do the whole tree
    if (this.hasChildren(this.items[targetItemIndex].id) && duplicate) {
      // map old id to new one
      let map = {};
      map[this.items[targetItemIndex].id] = newItem.id;
      newItems = this.recurseCopyChildren(this.items[targetItemIndex].id, map, newItems);
    }
    // splice back into the items array just below where we issued the split
    newItems.forEach((spItem, spIndex) => this.items.splice(targetItemIndex+spIndex+1, 0, spItem));
  }

  recurseCopyChildren(itemId, map, newItems) {
    // deep copy
    let children = this.items.filter((item) => item.parent == itemId);
    for (let i=0; i < children.length; i++) {
      const child = children[i];
      let newItem = new JSONOutlineSchemaItem();
      newItem.order = child.order;
      // map old parentID to new one
      newItem.parent =  map[child.parent];
      newItem.indent = child.indent;
      newItem.slug = newItem.id;
      newItem.metadata.locked = false;
      newItem.new = true;
      newItem.title = `${this.t.copyOf} ${child.title}`;
      newItem.contents = child.contents;
      // maintain collapsed state for clarity in larger structures
      newItem.collapsed = child.collapsed;
      // map old id to new one
      map[children[i].id] = newItem.id;
      newItems.push(newItem);
      if (this.hasChildren(children[i].id)) {
        this.recurseCopyChildren(children[i].id, map, newItems);
      }
    }
    return newItems;
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
            this.setAttribute('stop-animation', 'true');
            this.addNewItem(index);
          break;
          case "duplicate":
            this.setAttribute('stop-animation', 'true');
            this.addNewItem(index, true);
          break;
          case "in":
            // move below sibling just before it
            if (index !== 0 && this.items[index].parent != this.items[index-1].id) {
              let parent = this.items[index-1];
              this.items[index].parent = parent.id;
              // this is being made a child of the closest item to it in the array so therefore it's the 1st child
              this.items[index].order = 0;
              this.items[index].indent = parseInt(parent.indent)+1;
              if (!this.items[index].new) { this.items[index].modified = true; }
            }
          break;
          case "out":
            if (this.items[index].parent !== null) {
              // move just after parent and take on it's parent
              let sibling = this.items.find(item => this.items[index].parent === item.id);
              this.items[index].parent = sibling.parent;
              // @todo order needs to be more complex than this potentially
              this.items[index].order = parseInt(sibling.order)+1;
              this.items[index].indent = parseInt(sibling.indent);
              if (!this.items[index].new) { this.items[index].modified = true; }
            }
          break;
          case "up":
          case "down":
            this.setAttribute('stop-animation', 'true');
            // thing in question
            let element = this.items[index];
            // find siblings of the current one by finding same parent
            let siblings = [];
            this.items.map((thing) => {
              if (thing.parent === element.parent) {
                siblings.push(thing);
              }
            });
            // sort order at this level
            siblings.sort((a,b) => {
              if (a.order < b.order) {
                return -1;
              }
              else if (a.order > b.order) {
                return 1;
              }
              return 0;
            });
            let swapSibling = null;
            // find item just before us; can't use find bc its active 1 only
            // or just after us
            siblings.map((thing, i) => {
              if (action === "up" && i > 0 && thing.id === element.id) {
                swapSibling = siblings[i-1];
              }
              else if (action === "down" && i < (siblings.length-1) && thing.id === element.id) {
                swapSibling = siblings[i+1];
              }
            });
            // ensure we found something
            if (swapSibling) {
              // store this before we overwrite it
              const swapOrder = parseInt(swapSibling.order + '.0');
              const elOrder = parseInt(element.order + '.0');
              this.items.map((thing, i) => {
                if (thing.id === swapSibling.id) {
                  this.items[i].order = elOrder;
                  if (!this.items[i].new) { this.items[i].modified = true; }
                }
                else if (thing.id === element.id) {
                  this.items[i].order = swapOrder;
                  if (!this.items[i].new) { this.items[i].modified = true; }

                }
              });

            }
          break;
        }
      } else if (action === "lock") {
        this.items[index].metadata.locked = false;
      }
      this.__syncUIAndDataModel();
    }
  }
  // this forces the indent value for how far in to render
  // to be accurate based on parent depth. If you have
  // 4 ancestors above you you are at the 4th level
  // as we start at 0.
  // @note this exists because of the concept of depth being
  // different from the actual rendered hierarchy but we've
  // never actually used this ability
  _recurseUpdateIndent(topItem = { id: null }, incr = 0) {
    this.items.map((item, deepIndex) => {
      if (item.parent == topItem.id) {
        this.items[deepIndex].indent = incr;
        this._recurseUpdateIndent(this.items[deepIndex], incr+1)
      }
    });
  }
  // force item's schema to be ordered correctly
  // this takes the current data and completely rebuilds it
  // by faking a HTML data structure and then flattening it again
  // this also forces the linear and order property of items to be accurate
  _schemaOrderUpdate() {
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
        newItems.push(newItem);
      }
    }
    this.items = newItems;
  }
}
customElements.define(OutlineDesigner.tag, OutlineDesigner);