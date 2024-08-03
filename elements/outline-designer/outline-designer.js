/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, css, html } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { JSONOutlineSchemaItem } from "@haxtheweb/json-outline-schema/lib/json-outline-schema-item.js";
import { JsonOutlineSchema } from "@haxtheweb/json-outline-schema/json-outline-schema.js";
import "@haxtheweb/simple-popover/simple-popover.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import { encapScript, haxElementToNode } from "@haxtheweb/utils/utils.js";
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
          font-family: var(--ddd-font-navigation);
        }
        simple-icon-button[hidden] {
          visibility: hidden !important;
          opacity: 0;
          pointer-events: none;
          padding: 0;
          margin: 0;
          height: 0;
          border: 0;
        }
        .controls {
          position: sticky;
          top: -32px;
          background-color: light-dark(white, #262626);
          z-index: 1;
          padding: 16px 0 8px 0;
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
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          margin: 0 4px;
        }
        .content-adding-operations .operation {
          display: inline-flex;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          margin: 0 4px;
          border: 1px solid black;
          border-radius: 0;
          padding: 4px;
        }
        .lock {
          margin-right: 16px !important;
          visibility: var(--outline-designer-lock-visibility);
        }
        .del {
          margin-left: 32px !important;
        }
        .goto {
          margin-left: 32px !important;
        }
        .add {
          margin-left: 16px !important;
        }
        li .operations {
          justify-content: space-evenly;
          display: flex;
        }
        .content-operation {
          display: inline-flex;
          opacity: 0;
          visibility: hidden;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          margin: 0 4px;
        }
        .content-operations {
          justify-content: space-evenly;
          display: flex;
        }
        li.content-child:hover .content-operation {
          visibility: visible;
          opacity: 1;
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
        /* content not rendered if hidden but in case we change that */
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
        .active-preview-item {
          outline: 1px solid grey;
          outline-offset: -1px;
        }
        .label,
        .label-edit {
          display: none;
        }
        span[disabled].label {
          pointer-events: none;
          opacity: 0.6;
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
          transition: 0.3s all ease-in-out;
          visibility: hidden;
          opacity: 0;
        }
        .outline-designer-hovered .make-child-btn {
          visibility: visible;
          opacity: 0.6;
        }
        .outline-designer-hovered .make-child-btn:hover {
          opacity: 1;
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
          padding: 4px;
          cursor: pointer;
          opacity: 1;
          visibility: visible;
          height: 42px;
          transition:
            0.3s padding ease-in-out,
            0.3s border ease-in-out,
            0.3s margin ease-in-out;
          overflow: hidden;
          align-items: center;
          justify-content: left;
          display: flex;
        }
        .collapse-btn {
          visibility: hidden;
        }
        .item[data-has-children] .collapse-btn {
          visibility: visible;
        }
        .item[data-about-to-delete] {
          background-color: #ffa5a5;
          opacity: 0.5;
          border-color: red;
        }
        .item[data-about-to-delete][hidden] {
          visibility: hidden !important;
          opacity: 0 !important;
          padding: 0;
          margin: 0;
          height: 0;
          border: 0;
        }
        .item:hover,
        .item:focus {
          background-color: #f5f5f5;
        }
        .item:hover .label,
        .item:focus .label {
          color: black;
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
          max-width: 40%;
          line-height: 1.2;
          padding: 0 4px;
          color: light-dark(black, white);
        }

        .content-child {
          margin-left: 46px;
          padding: 8px;
          height: 24px;
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
          padding-left: calc(16px * 2);
        }
        .indent-3 {
          padding-left: calc(16px * 3);
        }
        .indent-4 {
          padding-left: calc(16px * 4);
        }
        .indent-5 {
          padding-left: calc(16px * 5);
        }
        .indent-6 {
          padding-left: calc(16px * 6);
        }
        .indent-7 {
          padding-left: calc(16px * 7);
        }
        .indent-8 {
          padding-left: calc(16px * 8);
        }
        .indent-9 {
          padding-left: calc(16px * 9);
        }
        .indent-10 {
          padding-left: calc(16px * 10);
        }
        .indent-11 {
          padding-left: calc(16px * 11);
        }
        .indent-12 {
          padding-left: calc(16px * 12);
        }
        .indent-13 {
          padding-left: calc(16px * 13);
        }
        .indent-14 {
          padding-left: calc(16px * 14);
        }
        .indent-15 {
          padding-left: calc(16px * 15);
        }
        .indent-16 {
          padding-left: calc(16px * 16);
        }
        .indent-17 {
          padding-left: calc(16px * 17);
        }
        .indent-18 {
          padding-left: calc(16px * 18);
        }
        .indent-19 {
          padding-left: calc(16px * 19);
        }
        .indent-20 {
          padding-left: calc(16px * 20);
        }
      `,
    ];
  }
  constructor() {
    super();
    this._blurBlock = false;
    this.fidelity = "medium";
    this.haxGizmos = [];
    this.hideDelete = false;
    this.activeItemForActions = null;
    this.storeTools = false;
    this.hideContentOps = false;
    this.items = [];
    this.appReady = false;
    this.eventData = {};
    this.activeId = null;
    this.activePreview = null;
    this.activePreviewIndex = -1;
    this.t = {
      selectTarget: "Select target",
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
    // valid list of hax Gizmos
    autorun(() => {
      this.haxGizmos = toJS(HAXStore.gizmoList).filter((schema) => {
        if (schema && schema.meta && schema.meta.outlineDesigner) {
          return true;
        }
        return false;
      });
    });
    this.addEventListener("click", this.resetPopOver.bind(this));
  }
  resetPopOver() {
    // clean up if something is active
    if (this.activePreview) {
      this.shadowRoot
        .querySelector("simple-popover")
        .setAttribute("hidden", "hidden");
      this.activePreview = null;
      this.activePreviewIndex = -1;
    }
  }
  // selectable list of items in the current site
  getSiteItems() {
    // default to null parent as the whole site
    var items = [
      {
        text: this.t.selectTarget,
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
    return html` <div class="controls">
        ${this.storeTools
          ? html`
              <label for="targetselector">${this.t.importThisContent}</label>
              <simple-fields-field
                id="targetselector"
                type="select"
                value="children"
                .itemsList="${[
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
                ]}"
              ></simple-fields-field>
              ${this.t.thisPage}:
              <simple-fields-field
                id="itemselector"
                type="select"
                value="${this.activeId}"
                .itemsList="${this.getSiteItems()}"
              ></simple-fields-field>
              <label for="itemselector"
                >${this.t.importContentUnderThisPage}</label
              >
            `
          : ``}
        <simple-icon-button-lite
          class="control"
          icon="add"
          @click="${this.addItemToTop}"
          >Add page</simple-icon-button-lite
        >
        <simple-icon-button-lite
          icon="hardware:keyboard-arrow-right"
          @click="${this.collapseAll}"
          class="control"
          >Collapse all</simple-icon-button-lite
        >
        <simple-icon-button-lite
          icon="hardware:keyboard-arrow-down"
          @click="${this.expandAll}"
          class="control"
          >Expand all</simple-icon-button-lite
        >
        ${this.hasDeletedItems()
          ? html`<simple-icon-button-lite
              icon="delete"
              @click="${this.toggleDelete}"
              class="control"
              >${!this.hideDelete
                ? "Hide Deleted"
                : "Show Deleted"}</simple-icon-button-lite
            >`
          : ``}
      </div>
      <ul id="list">
        ${this.items.map((item, index) =>
          this.getItemParentsCollapsed(item) === ""
            ? this.renderItem(item, index)
            : ``,
        )}
      </ul>
      <simple-popover auto for="list" hidden>
        <simple-icon-button
          @click="${this.resetPopOver}"
          title="Close"
          icon="cancel"
          class="close-btn"
        ></simple-icon-button>
        ${this.renderActiveContentItem(
          this.activePreview,
          this.activePreviewIndex,
        )}
      </simple-popover>`;
  }

  hasDeletedItems() {
    if (this.items.find((item) => item.delete == true)) {
      return true;
    }
    return false;
  }
  toggleDelete(e) {
    this.hideDelete = !this.hideDelete;
  }

  renderActiveContentItem(activeItemContentNode, targetNodeIndex) {
    if (activeItemContentNode && targetNodeIndex != -1) {
      let item = this.items.find(
        (item) =>
          item.id ===
          activeItemContentNode.getAttribute("data-content-parent-id"),
      );
      // should have contents but verify
      if (item.contents) {
        let div = globalThis.document.createElement("div");
        div.innerHTML = item.contents;
        // walk up to the index in question
        for (let i = 0; i < div.childNodes.length; i++) {
          let node = div.childNodes[i];
          if (i === targetNodeIndex) {
            // unsafe, but we encap script so should be.
            return html`${unsafeHTML(encapScript(node.outerHTML))}`;
          }
        }
      }
    }
  }

  setActiveItemForActions(e) {
    this.activeItemForActions = e.target
      .closest("[data-item-id]")
      .getAttribute("data-item-id");
  }

  renderItem(item, index) {
    return html`
      <li
        @dragenter="${this._dragEnter}"
        @dragleave="${this._dragLeave}"
        @mouseenter="${this.setActiveItemForActions}"
        class="item indent-${item.indent < 20
          ? item.indent
          : 20} ${item.modified
          ? "modified"
          : ""} ${this.getItemParentsCollapsed(item)}"
        data-item-id="${item.id}"
        @focusin="${this.setActiveItemForActions}"
        data-parents="${this.getItemParents(item)}"
        ?data-has-children="${this.hasChildren(item.id)}"
        ?data-about-to-delete="${item.delete}"
        ?hidden="${this.hideDelete && item.delete}"
      >
        <simple-icon-button
          ?disabled="${this.isLocked(index)}"
          class="collapse-btn"
          icon="${this.isCollapsed(item.id)
            ? `hardware:keyboard-arrow-right`
            : `hardware:keyboard-arrow-down`}"
          @click="${this.collapseExpand}"
        ></simple-icon-button>
        <simple-icon-button
          ?disabled="${this.isLocked(index)}"
          @dragstart="${this._dragStart}"
          @dragend="${this._dragEnd}"
          draggable="${!this.isLocked(index)}"
          icon="hax:arrow-all"
        ></simple-icon-button>
        <simple-icon-button-lite
          ?disabled="${this.isLocked(index)}"
          ?hidden="${this.hideContentOps ||
          item.contents === "" ||
          !item.contents}"
          icon="editor:insert-drive-file"
          @click="${this.toggleContent}"
          title="Content structure"
        >
          ${item.new
            ? html`<simple-icon
                ?disabled="${this.isLocked(index)}"
                icon="av:fiber-new"
                title="${this.t.newPage}"
                class="new"
                accent-color="green"
                dark
                contrast="1"
              ></simple-icon>`
            : ``}
        </simple-icon-button-lite>
        <span
          class="label shown"
          ?disabled="${this.isLocked(index)}"
          @dblclick="${this.editTitle}"
          >${item.title}</span
        >
        <span
          class="label-edit"
          @blur="${this.blurTitle}"
          @keypress="${this.monitorTitle}"
          @keydown="${this.monitorEsc}"
        ></span>
        <div class="operations">
          ${this.activeItemForActions === item.id
            ? html`
                <div class="btn-contrast">
                  <simple-icon-button
                    part="lockbtn"
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
                </div>
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
                  icon="${!item.delete ? "delete" : "hax:delete-restore"}"
                  accent-color="red"
                  @click="${(e) => this.itemOp(index, "delete")}"
                  title="${!item.delete ? "Delete" : "Restore"}"
                  ?disabled="${this.isLocked(index)}"
                ></simple-icon-button>
                <simple-icon-button
                  class="operation goto"
                  icon="open-in-browser"
                  accent-color="blue"
                  @click="${(e) => this.itemOp(index, "goto")}"
                  title="Go to page"
                ></simple-icon-button>
              `
            : ``}
        </div>
      </li>
      ${!this.hideContentOps && item.showContent
        ? this.renderItemContents(item)
        : ``}
    `;
  }

  hasContents(item) {
    if (item.contents && item.contents != "") {
      return true;
    }
    return false;
  }

  renderItemContents(item) {
    let render = [this.itemContentsOperations(item)];
    if (item.contents) {
      let div = globalThis.document.createElement("div");
      div.innerHTML = item.contents;
      let activeHeadingDepth = 1;
      let modifier = 0;
      div.childNodes.forEach((node, index) => {
        // increase the indent addition to match the activeheading depth
        // this way h1 gets all things below it indented 1 more level
        // while things 4 in get indented 4.
        modifier = 0;
        if (
          ["h1", "h2", "h3", "h4", "h5", "h6"].includes(
            node.tagName.toLowerCase(),
          )
        ) {
          activeHeadingDepth = parseInt(
            node.tagName.toLowerCase().replace("h", ""),
          );
          // this ensures when we drop a level that the item itself is NOT
          // rendered a level below where it should be
          modifier = -1;
        }
        render.push(
          this.renderNodeAsItem(
            node,
            index,
            item,
            parseInt(item.indent) + activeHeadingDepth + modifier,
          ),
        );
      });
    }
    return render;
  }
  // support very, very, very basic content adding
  itemContentsOperations(item) {
    return html` <li
      class="item content-adding-operations indent-${item.indent < 20
        ? item.indent
        : 20}"
      data-item-for-content-id="${item.id}"
      ?data-contents-collapsed="${!item.showContent}"
      ?data-about-to-delete="${item.delete}"
      ?hidden="${this.hideDelete && item.delete}"
    >
      ${this.haxGizmos.map(
        (gizmo) => html`
          <simple-icon-button-lite
            class="operation"
            icon="${gizmo.icon}"
            value="${gizmo.tag}"
            @click="${this.prependNodeToContent}"
            >Add ${gizmo.title}</simple-icon-button-lite
          >
        `,
      )}
    </li>`;
  }
  // add content to the top of the item in question
  prependNodeToContent(e) {
    let itemId = e.target
      .closest("[data-item-for-content-id]")
      .getAttribute("data-item-for-content-id");
    this.items.map((item, index) => {
      if (item.id === itemId && e.target.value) {
        // @todo add support for surfacing these options from the HAX schema
        // could be something like a gizmo.metadata.outlineDesigner = true flag
        let schema = HAXStore.haxSchemaFromTag(e.target.value);
        let node;
        if (
          schema.gizmo &&
          schema.gizmo.tag &&
          schema.demoSchema &&
          schema.demoSchema[0]
        ) {
          node = haxElementToNode(schema.demoSchema[0]);
        } else {
          node = globalThis.document.createElement(tag);
        }
        this.items[index].contents = node.outerHTML + item.contents;
        this.resetPopOver();
        this.__syncUIAndDataModel();
      }
    });
  }
  // render a content node within an item
  renderNodeAsItem(node, index, item, indent) {
    let tagName = node.tagName.toLowerCase();
    let icon = "hax:bricks";
    let label = tagName;
    let part = "non-heading";
    let schema = HAXStore.haxSchemaFromTag(tagName);
    if (schema && schema.gizmo) {
      icon = schema.gizmo.icon;
      label = schema.gizmo.title;
      // headings we want to render the title as it can become a full page
      switch (tagName) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          label = node.innerText;
          part = "heading";
          break;
      }
    }
    return html` <li
      class="item content-child content-${part} indent-${indent < 20
        ? indent
        : 20}"
      data-node-index="${index}"
      data-content-parent-id="${item.id}"
      ?data-contents-collapsed="${!item.showContent}"
      ?data-about-to-delete="${item.delete}"
      ?hidden="${this.hideDelete && item.delete}"
    >
      <div class="btn-contrast">
        <simple-icon-button-lite
          icon="${icon}"
          title="Click to preview"
          @click="${this.setActivePreview}"
        ></simple-icon-button-lite>
      </div>
      ${part === "heading"
        ? html`
            <span
              class="label shown"
              ?disabled="${item.metadata.locked}"
              @dblclick="${this.editTitle}"
              >${label}</span
            >
            <span
              class="label-edit"
              @keypress="${this.monitorHeading}"
              @keydown="${this.monitorEsc}"
            ></span>
          `
        : html`<span class="label shown">${label}</span>`}
      <div class="content-operations">
        <simple-icon-button
          class="content-operation"
          icon="hax:outline-designer-outdent"
          @click="${(e) => this.modifyContentAction(e, item, "in")}"
          title="Increase heading"
          ?disabled="${tagName === "h1" || item.metadata.locked}"
          ?hidden="${part !== "heading"}"
        ></simple-icon-button>
        <simple-icon-button
          icon="hax:keyboard-arrow-up"
          @click="${(e) => this.modifyContentAction(e, item, "up")}"
          title="Move up"
          ?disabled="${item.metadata.locked}"
          class="content-operation"
        ></simple-icon-button>
        <simple-icon-button
          icon="hax:keyboard-arrow-down"
          @click="${(e) => this.modifyContentAction(e, item, "down")}"
          title="Move down"
          ?disabled="${item.metadata.locked}"
          class="content-operation"
        ></simple-icon-button>
        <simple-icon-button
          class="content-operation"
          icon="hax:outline-designer-indent"
          @click="${(e) => this.modifyContentAction(e, item, "out")}"
          title="Decrease Heading"
          ?disabled="${tagName === "h6" || item.metadata.locked}"
          ?hidden="${part !== "heading"}"
        ></simple-icon-button>
        <simple-icon-button
          class="content-operation"
          icon="editor:format-page-break"
          @click="${(e) => this.pageBreakHere(e, item)}"
          title="Promote to page"
          ?disabled="${item.metadata.locked}"
          ?hidden="${part !== "heading"}"
        ></simple-icon-button>
        <simple-icon-button
          icon="delete"
          @click="${(e) => this.modifyContentAction(e, item, "delete")}"
          class="content-operation del"
          title="Delete"
          ?disabled="${item.metadata.locked}"
          accent-color="red"
        ></simple-icon-button>
      </div>
    </li>`;
  }
  // preview of the item in question
  setActivePreview(e) {
    let target = e.target.closest("[data-content-parent-id]");
    let targetNodeIndex = parseInt(target.getAttribute("data-node-index"));
    this.activePreview = target;
    this.shadowRoot.querySelector("simple-popover").removeAttribute("hidden");
    // set target so it points to our current item
    this.shadowRoot.querySelector("simple-popover").target = target;
    this.activePreviewIndex = targetNodeIndex;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  // ability to mod the content to move heading up or down between h1 and h6
  modifyContentAction(e, item, action) {
    if (!item.metadata.locked) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // Take UI index and split at that dom node by recreating
      // the structure. Bonkers.
      let target = e.target.closest("[data-content-parent-id]");
      let itemId = target.getAttribute("data-content-parent-id");
      let targetNodeIndex = parseInt(target.getAttribute("data-node-index"));
      let item = this.items.find((item) => item.id === itemId);
      // should have contents but verify
      if (item.contents) {
        let div = globalThis.document.createElement("div");
        div.innerHTML = item.contents;
        let content = "";
        // up / down require reorganization prior to html calculation
        switch (action) {
          case "up":
            if (targetNodeIndex !== 0) {
              div.childNodes[
                targetNodeIndex
              ].previousElementSibling.insertAdjacentElement(
                "beforebegin",
                div.childNodes[targetNodeIndex],
              );
            }
            break;
          case "down":
            if (targetNodeIndex !== div.childNodes.length - 1) {
              div.childNodes[
                targetNodeIndex
              ].nextElementSibling.insertAdjacentElement(
                "afterend",
                div.childNodes[targetNodeIndex],
              );
            }
            break;
        }
        // walk up to the index in question
        for (let i = 0; i < div.childNodes.length; i++) {
          let node = div.childNodes[i];
          // so long as index is LOWER than the target, this is original item content
          if (i < targetNodeIndex) {
            content += node.outerHTML;
          } else if (i === targetNodeIndex) {
            switch (action) {
              case "delete":
                // do nothing as we skip this, effectively deleting it
                this.setAttribute("stop-animation", "true");
                break;
              case "up":
              case "down":
                // up and down happen prior to here
                content += node.outerHTML;
                break;
              case "in":
              case "out":
                // heading to modify
                let hlevel = parseInt(
                  node.tagName.toLowerCase().replace("h", ""),
                );
                let h;
                if (action === "in" && hlevel > 1) {
                  h = globalThis.document.createElement(`h${hlevel - 1}`);
                  h.innerText = node.innerText;
                } else if (action === "out" && hlevel < 6) {
                  h = globalThis.document.createElement(`h${hlevel + 1}`);
                  h.innerText = node.innerText;
                } else {
                  // blocked operation
                  h = node;
                }
                content += h.outerHTML;
                break;
            }
          } else {
            content += node.outerHTML;
          }
        }
        item.contents = content;
        this.resetPopOver();
        this.__syncUIAndDataModel();
      }
    }
  }

  // split page to make another one at the heading level
  pageBreakHere(e, item) {
    if (!item.metadata.locked) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // Take UI index and split at that dom node by recreating
      // the structure. Bonkers.
      let target = e.target.closest("[data-content-parent-id]");
      let itemId = target.getAttribute("data-content-parent-id");
      let targetNodeIndex = parseInt(target.getAttribute("data-node-index"));
      let item = this.items.find((item) => item.id === itemId);
      let targetItemIndex;
      this.items.map((item, index) =>
        item.id === itemId ? (targetItemIndex = index) : null,
      );
      // should have contents but verify
      if (item.contents) {
        let div = globalThis.document.createElement("div");
        div.innerHTML = item.contents;
        let oldContent = "";
        let newContent = "";
        let title = this.t.newPage;
        // walk up to the index in question
        for (let i = 0; i < div.childNodes.length; i++) {
          let node = div.childNodes[i];
          // so long as index is LOWER than the target, this is original item content
          if (i < targetNodeIndex) {
            oldContent += node.outerHTML;
          } else if (i === targetNodeIndex) {
            if (node.innerText != "") {
              title = node.innerText;
            }
          } else {
            newContent += node.outerHTML;
          }
        }
        item.contents = oldContent;
        // create a new item
        let newItem = new JSONOutlineSchemaItem();
        newItem.title = title;
        // slug and location NOT set because backend will fill these in
        newItem.order = item.order + 1;
        newItem.parent = item.parent;
        newItem.indent = item.indent;
        newItem.metadata.locked = false;
        newItem.new = true;
        newItem.contents = newContent;
        // set modified on targetItemIndex
        this.items[targetItemIndex].modified = true;
        // splice back into the items array just below where we issued the split
        this.items.splice(targetItemIndex + 1, 0, newItem);
        this.resetPopOver();
        this.__syncUIAndDataModel();
      }
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
        this.removeAttribute("stop-animation");
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
    let list = "";
    while (parent) {
      list += parent.id + " ";
      parent = this.items.find((item) => item.id == parent.parent);
    }
    return list;
  }
  // generate a class that includes all collapsed parents
  // based on the statefulness of that data
  getItemParentsCollapsed(activeItem) {
    let parent = this.items.find((item) => item.id == activeItem.parent);
    let list = "";
    while (parent) {
      if (parent.collapsed && parent.id) {
        list += `collapsed-by-${parent.id}` + " ";
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
    let itemId = e.target
      .closest("[data-item-id]")
      .getAttribute("data-item-id");
    // find the item and act on it's index to toggle content collapse status
    this.items.map((item, index) => {
      if (item.id === itemId && !this.isLocked(index)) {
        if (this.items[index].collapsed) {
          this.items[index].collapsed = false;
        } else {
          this.items[index].collapsed = true;
        }
        this.requestUpdate();
      }
    });
  }

  toggleContent(e) {
    let target = e.target.closest("[data-item-id]");
    // prevent if we are in a disabled state
    if (target && !e.target.disabled) {
      let itemId = target.getAttribute("data-item-id");
      // find the item and act on it's index to toggle content collapse status
      this.items.map((item, index) => {
        if (item.id === itemId) {
          if (this.items[index].showContent) {
            this.items[index].showContent = false;
          } else {
            this.items[index].showContent = true;
          }
        }
      });
      this.requestUpdate();
    }
  }

  editTitle(e) {
    e.target.classList.remove("shown");
    let target = e.target.nextElementSibling;
    target.setAttribute("contenteditable", "true");
    target.classList.add("shown");
    target.innerText = e.target.innerText;
    target.focus();
    // get the selection and select all
    if (this.shadowRoot.getSelection) {
      var range = globalThis.document.createRange();
      range.selectNodeContents(target);
      this.shadowRoot.getSelection().removeAllRanges();
      this.shadowRoot.getSelection().addRange(range);
    }
    // deprecated but best we got
    else {
      try {
        globalThis.document.execCommand("selectAll", false, null);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  monitorTitle(e) {
    if (e.key === "Enter") {
      e.target.classList.remove("shown");
      e.target.previousElementSibling.classList.add("shown");
      e.target.removeAttribute("contenteditable");
      let itemId = e.target
        .closest("[data-item-id]")
        .getAttribute("data-item-id");
      for (let index = 0; index < this.items.length; index++) {
        if (this.items[index].id === itemId && e.target.innerText != "") {
          if (!this.items[index].new) {
            this.items[index].modified = true;
          }
          this.items[index].title = e.target.innerText;
        }
      }
      this.requestUpdate();
    }
  }

  monitorHeading(e) {
    if (e.key === "Enter") {
      e.target.classList.remove("shown");
      e.target.previousElementSibling.classList.add("shown");
      e.target.removeAttribute("contenteditable");
      let target = e.target.closest("[data-content-parent-id]");
      let itemId = target.getAttribute("data-content-parent-id");
      let targetNodeIndex = parseInt(target.getAttribute("data-node-index"));
      let item = this.items.find((item) => item.id === itemId);
      // should have contents but verify
      if (item.contents) {
        let div = globalThis.document.createElement("div");
        div.innerHTML = item.contents;
        let content = "";
        // walk up to the index in question
        for (let i = 0; i < div.childNodes.length; i++) {
          let node = div.childNodes[i];
          // so long as index is LOWER than the target, this is original item content
          if (i < targetNodeIndex) {
            content += node.outerHTML;
          } else if (i === targetNodeIndex) {
            node.innerText = e.target.innerText;
            content += node.outerHTML;
          } else {
            content += node.outerHTML;
          }
        }
        item.contents = content;
        this.resetPopOver();
        this.requestUpdate();
      }
    }
  }

  monitorEsc(e) {
    if (e.key === "Escape") {
      e.target.classList.remove("shown");
      e.target.removeAttribute("contenteditable");
      e.target.previousElementSibling.classList.add("shown");
      e.target.innerText = e.target.previousElementSibling.innerText;
    } else if (e.key === "Enter") {
      this._blurBlock = true;
    }
  }
  blurTitle(e) {
    if (!this._blurBlock) {
      e.target.classList.remove("shown");
      e.target.removeAttribute("contenteditable");
      e.target.previousElementSibling.classList.add("shown");
      e.target.innerText = e.target.previousElementSibling.innerText;
    }
    setTimeout(() => {
      this._blurBlock = false;
    }, 0);
  }
  _mouseDownDrag(e) {
    // force collapse kids on move
    let itemId = e.target
      .closest("[data-item-id]")
      .getAttribute("data-item-id");
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
      e.target
        .closest("[data-item-id]")
        .classList.add("outline-designer-hovered");
      this._targetDrop = e.target.closest("[data-item-id]");
    }
  }
  /**
   * Leaving an element while dragging.
   */
  _dragLeave(e) {
    if (this._targetDrop !== e.target.closest("[data-item-id]")) {
      e.target
        .closest("[data-item-id]")
        .classList.remove("outline-designer-hovered");
    }
  }
  /**
   * When we end dragging this is the same as a drop event; ensure we remove the mover class.
   */
  _dragEnd(e) {
    if (this._targetDrag && this._targetDrop) {
      let here = null;
      let from = null;
      for (let index = 0; index < this.items.length; index++) {
        let item = this.items[index];
        if (item.id === this._targetDrop.getAttribute("data-item-id")) {
          here = index;
        }
        if (item.id === this._targetDrag.getAttribute("data-item-id")) {
          from = index;
        }
      }
      if (from !== null && here !== null) {
        if (!this.items[from].new) {
          this.items[from].modified = true;
        }
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
      this.setAttribute("stop-animation", "true");
      this.__syncUIAndDataModel();
    }
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    if (e.target.getAttribute("disabled") == null) {
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
      haxGizmos: { type: Array },
      hideDelete: { type: Boolean },
      activeItemForActions: { type: String },
      storeTools: { type: Boolean },
      eventData: { type: Object },
      items: { type: Array },
      appReady: { type: Boolean },
      activePreview: { type: Object },
      activePreviewIndex: { type: Number },
      hideContentOps: {
        type: Boolean,
        reflect: true,
        attribute: "hide-content-ops",
      },
      fidelity: { type: String },
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "fidelity" && this[propName]) {
        // @todo these are just conceptual for the moment
        // need requirements / discussion with group to inform low vs high operations
        // and the names could correspond more closely with the process someone is engaged in
        switch (this[propName]) {
          case "low":
            // remove everything except pages
            // button for seeing content of page but not allowed to delve into it
            break;
          case "medium":
            // allow rendering contents, but only headings, no edit operations

            break;
          case "high":
            // allow rendering contents, as well as edit operations
            break;
        }
      }
      if (propName === "activePreview" && oldValue) {
        oldValue.classList.remove("active-preview-item");
      }
      if (propName === "activePreview" && this[propName]) {
        this[propName].classList.add("active-preview-item");
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // avoid some misordering on 1st paint after making lots of things
    if (this.items) {
      setTimeout(() => {
        this.__syncUIAndDataModel();
      }, 0);
    }
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "outline-designer";
  }

  // modifier for adding to the top of the stack
  addItemToTop() {
    this.setAttribute("stop-animation", "true");
    this.addNewItem("top");
    this.__syncUIAndDataModel();
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
      const targetSelector =
        this.shadowRoot.querySelector("#targetselector").value;
      let count = 0;
      await eventData.items.map(async (item, index) => {
        if (parentId && item.parent == null) {
          // helps in supporting multiple imports at a time
          count++;
          let parentItem = await store.findItemAsObject(parentId);
          switch (targetSelector) {
            case "below":
              eventData.items[index].parent = parentItem.parent;
              eventData.items[index].order = parseInt(parentItem.order) + count;
              break;
            case "above":
              eventData.items[index].parent = parentItem.parent;
              // @todo this is currently the reverse order desired if
              // multiple top level children existed on the import
              eventData.items[index].order = parseInt(parentItem.order) - count;
              break;
            case "children":
              eventData.items[index].parent = parentId;
              break;
          }
        }
      });
    }
    return eventData;
  }

  isLocked(index) {
    if (
      index !== false &&
      this.items[index] &&
      this.items[index].metadata &&
      this.items[index].metadata.locked
    ) {
      return true;
    }
    return false;
  }
  // add a new page or duplicate
  addNewItem(targetItemIndex, duplicate = false, newItems = []) {
    let orderAddon = 1;
    if (targetItemIndex === "top") {
      targetItemIndex = 0;
      orderAddon = -1;
    }
    let item = {
      indent: 0,
      parent: null,
      order: 0,
    };
    // edge case, new outline with nothing in it or traget is invalid
    if (this.items && this.items.length > 0 && this.items[targetItemIndex]) {
      item = this.items[targetItemIndex];
    }
    let newItem = new JSONOutlineSchemaItem();
    newItem.order = item.order + orderAddon;
    newItem.parent = item.parent;
    newItem.indent = item.indent;
    // slug and location NOT set because backend will fill these in
    newItem.metadata.locked = false;
    newItem.new = true;
    if (duplicate) {
      newItem.title = `${this.t.copyOf} ${item.title}`;
      newItem.contents = item.contents;
      // reference to what called for this to be created
      newItem.duplicate = item.id;
    } else {
      newItem.contents = `<p></p>`;
    }
    newItems.push(newItem);
    // if we were told to duplicate and we have kids, do the whole tree
    if (
      this.items &&
      this.items.length > 0 &&
      this.items[targetItemIndex] &&
      this.hasChildren(this.items[targetItemIndex].id) &&
      duplicate
    ) {
      // map old id to new one
      let map = {};
      map[this.items[targetItemIndex].id] = newItem.id;
      newItems = this.recurseCopyChildren(
        this.items[targetItemIndex].id,
        map,
        newItems,
      );
    }
    // splice back into the items array just below where we issued the split
    if (this.items && this.items.length > 0) {
      newItems.forEach((spItem, spIndex) =>
        this.items.splice(targetItemIndex + spIndex + 1, 0, spItem),
      );
    } else {
      newItems.forEach((spItem) => this.items.push(spItem));
    }
  }

  recurseCopyChildren(itemId, map, newItems) {
    // deep copy
    let children = this.items.filter((item) => item.parent == itemId);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      let newItem = new JSONOutlineSchemaItem();
      newItem.order = child.order;
      // map old parentID to new one
      newItem.parent = map[child.parent];
      newItem.indent = child.indent;
      // slug and location NOT set because backend will fill these in
      newItem.metadata.locked = false;
      newItem.new = true;
      newItem.title = `${this.t.copyOf} ${child.title}`;
      newItem.contents = child.contents;
      // maintain collapsed state for clarity in larger structures
      newItem.collapsed = child.collapsed;
      // store a reference to where this came from
      newItem.duplicate = children[i].id;
      // map old id to new one
      map[children[i].id] = newItem.id;
      newItems.push(newItem);
      if (this.hasChildren(children[i].id)) {
        this.recurseCopyChildren(children[i].id, map, newItems);
      }
    }
    return newItems;
  }
  // apply an action recursively to children of children
  recurseAction(itemId, action, value = true) {
    let children = this.items.filter((item) => item.parent == itemId);
    for (let i = 0; i < children.length; i++) {
      this.items.map((item, index) => {
        if (item.id === children[i].id) {
          switch (action) {
            case "delete":
              this.items[index].delete = value;
              break;
            case "lock":
              this.items[index].metadata.locked = value;
              break;
          }
        }
      });
      if (this.hasChildren(children[i].id)) {
        this.recurseAction(children[i].id, action, value);
      }
    }
    return true;
  }

  // operations that can be clicked individually per item
  itemOp(index, action) {
    if (index !== false && this.items[index] && action) {
      // verify this is not locked
      if (!this.items[index].metadata.locked) {
        switch (action) {
          // @note this will force reload which is not ideal but not that big a deal
          case "goto":
            this.dispatchEvent(
              new CustomEvent("simple-modal-hide", {
                bubbles: true,
                cancelable: true,
                detail: {},
              }),
            );
            let href = this.items[index].slug || this.items[index].location;
            globalThis.location.href = href;
          case "lock":
            this.items[index].metadata.locked = true;
            if (this.hasChildren(this.items[index].id)) {
              this.recurseAction(
                this.items[index].id,
                action,
                this.items[index].metadata.locked,
              );
            }
            break;
          case "delete":
            if (this.items[index].delete) {
              this.items[index].delete = false;
            } else {
              this.items[index].delete = true;
            }
            if (this.hasChildren(this.items[index].id)) {
              this.recurseAction(
                this.items[index].id,
                action,
                this.items[index].delete,
              );
            }
            break;
          case "add":
            this.setAttribute("stop-animation", "true");
            this.addNewItem(index);
            break;
          case "duplicate":
            this.setAttribute("stop-animation", "true");
            this.addNewItem(index, true);
            break;
          case "in":
            // move below sibling just before it
            if (
              index !== 0 &&
              this.items[index].parent != this.items[index - 1].id
            ) {
              let parent = this.items[index - 1];
              this.items[index].parent = parent.id;
              // this is being made a child of the closest item to it in the array so therefore it's the 1st child
              this.items[index].order = 0;
              this.items[index].indent = parseInt(parent.indent) + 1;
              if (!this.items[index].new) {
                this.items[index].modified = true;
              }
            }
            break;
          case "out":
            if (this.items[index].parent !== null) {
              // move just after parent and take on it's parent
              let sibling = this.items.find(
                (item) => this.items[index].parent === item.id,
              );
              this.items[index].parent = sibling.parent;
              // @todo order needs to be more complex than this potentially
              this.items[index].order = parseInt(sibling.order) + 1;
              this.items[index].indent = parseInt(sibling.indent);
              if (!this.items[index].new) {
                this.items[index].modified = true;
              }
            }
            break;
          case "up":
          case "down":
            this.setAttribute("stop-animation", "true");
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
            siblings.sort((a, b) => {
              if (a.order < b.order) {
                return -1;
              } else if (a.order > b.order) {
                return 1;
              }
              return 0;
            });
            let swapSibling = null;
            // find item just before us; can't use find bc its active 1 only
            // or just after us
            siblings.map((thing, i) => {
              if (action === "up" && i > 0 && thing.id === element.id) {
                swapSibling = siblings[i - 1];
              } else if (
                action === "down" &&
                i < siblings.length - 1 &&
                thing.id === element.id
              ) {
                swapSibling = siblings[i + 1];
              }
            });
            // ensure we found something
            if (swapSibling) {
              // store this before we overwrite it
              const swapOrder = parseInt(swapSibling.order + ".0");
              const elOrder = parseInt(element.order + ".0");
              this.items.map((thing, i) => {
                if (thing.id === swapSibling.id) {
                  this.items[i].order = elOrder;
                  if (!this.items[i].new) {
                    this.items[i].modified = true;
                  }
                } else if (thing.id === element.id) {
                  this.items[i].order = swapOrder;
                  if (!this.items[i].new) {
                    this.items[i].modified = true;
                  }
                }
              });
            }
            break;
        }
        // has to be on its own bc we block ALL actions if we are locked
      } else if (action === "lock") {
        this.items[index].metadata.locked = false;
        if (this.hasChildren(this.items[index].id)) {
          this.recurseAction(
            this.items[index].id,
            action,
            this.items[index].metadata.locked,
          );
        }
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
        this._recurseUpdateIndent(this.items[deepIndex], incr + 1);
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
