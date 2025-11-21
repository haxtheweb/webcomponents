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
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-fields/lib/simple-context-menu.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
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
          --outline-designer-zoom: 1;
        }
        :host(.zoom-out-1) {
          --outline-designer-zoom: 0.85;
        }
        :host(.zoom-out-2) {
          --outline-designer-zoom: 0.7;
        }
        :host(.zoom-out-3) {
          --outline-designer-zoom: 0.55;
        }
        .item {
          transform: scale(var(--outline-designer-zoom));
          transform-origin: left center;
          margin-bottom: calc(
            var(--ddd-spacing-1) * var(--outline-designer-zoom)
          );
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
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          z-index: 1;
          padding: var(--ddd-spacing-4) 0 var(--ddd-spacing-2) 0;
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-primary-5)
          );
        }
        .controls simple-toolbar-button.control {
          --simple-toolbar-button-border-width: 1px;
          --simple-toolbar-border-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --simple-toolbar-border-radius: var(--ddd-radius-xs);
          --simple-toolbar-button-padding: var(--ddd-spacing-1);
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-3)
          );
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        .controls simple-toolbar-button.control:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
          --simple-toolbar-border-color: light-dark(
            var(--ddd-primary-1),
            var(--ddd-accent-5)
          );
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
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          border: var(--ddd-border-xs);
          border-color: light-dark(var(--ddd-primary-5), var(--ddd-accent-5));
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
          margin: 0 var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-1);
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-3)
          );
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        .content-adding-operations .operation:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
          border-color: light-dark(var(--ddd-primary-1), var(--ddd-accent-5));
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
        li.content-child:hover .content-operation,
        li.content-child:focus-within .content-operation {
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
        li simple-icon-button-lite:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
        }
        .active-preview-item {
          outline: var(--ddd-border-xs);
          outline-color: light-dark(var(--ddd-primary-5), var(--ddd-accent-5));
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
          outline: var(--ddd-border-sm);
          outline-color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          outline-offset: -1px;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
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
          color: light-dark(var(--ddd-primary-22), var(--ddd-primary-12));
          font-size: 20px;
          line-height: 20px;
        }
        .new {
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
          background-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          color: light-dark(var(--ddd-accent-6), var(--ddd-primary-4));
          display: block;
          margin: -14px 0 0 4px;
        }
        :host([stop-animation]) .item {
          transition: none !important;
        }
        .item {
          display: -webkit-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(var(--ddd-primary-5), var(--ddd-accent-5));
          margin: 0;
          padding: var(--ddd-spacing-1);
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
          background-color: light-dark(
            var(--ddd-theme-default-errorLight),
            var(--ddd-primary-22)
          );
          opacity: 0.8;
          border-color: light-dark(
            var(--ddd-primary-22),
            var(--ddd-primary-12)
          );
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
        .item:focus,
        .item:focus-within {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
          outline: var(--ddd-border-sm);
          outline-color: light-dark(var(--ddd-primary-1), var(--ddd-accent-5));
          outline-offset: -2px;
          box-shadow: var(--ddd-boxShadow-sm);
        }
        .item.active-page {
          background-color: light-dark(
            var(--ddd-accent-5),
            var(--ddd-primary-6)
          );
          outline: 2px solid
            light-dark(var(--ddd-primary-2), var(--ddd-accent-4));
          outline-offset: -2px;
          box-shadow: var(--ddd-boxShadow-md);
        }
        .item.selected-page {
          background-color: light-dark(
            var(--ddd-accent-4),
            var(--ddd-primary-7)
          );
          outline: 2px solid
            light-dark(var(--ddd-primary-3), var(--ddd-accent-3));
          outline-offset: -2px;
        }
        .item[data-dragging="true"] {
          box-shadow: var(--ddd-boxShadow-lg);
          opacity: 0.8;
          transform: scale(1.02);
          z-index: 1000;
        }
        .item[data-dragging="true"] {
          box-shadow: var(--ddd-boxShadow-lg);
          opacity: 0.8;
          transform: scale(1.02);
          z-index: 1000;
        }
        /* Menu button styling */
        .actions-menu {
          margin-left: var(--ddd-spacing-2);
        }
        .actions-menu::part(button) {
          padding: var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-xs);
          border: var(--ddd-border-xs);
          background: light-dark(var(--ddd-accent-6), var(--ddd-primary-3));
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        .actions-menu::part(button):hover {
          background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-primary-5)
          );
        }
        .actions-menu simple-toolbar-button {
          text-align: left;
          justify-content: flex-start;
          padding-left: var(--ddd-spacing-2);
          padding-right: var(--ddd-spacing-4);
          --simple-toolbar-button-justify: flex-start;
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
        }
        .actions-menu simple-toolbar-button.delete-button {
          border-top: var(--ddd-border-sm) solid
            var(--ddd-theme-default-limestoneGray);
          margin-top: var(--ddd-spacing-2);
          padding-top: var(--ddd-spacing-2);
        }
        .actions-menu simple-toolbar-button.delete-button:hover {
          color: var(--ddd-theme-default-error);
          background-color: var(--ddd-theme-default-errorLight);
        }

        simple-icon-button-lite {
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }

        simple-context-menu {
          text-align: left;
        }
        simple-context-menu::part(content) {
          text-align: left;
          align-items: flex-start;
        }
        .item:hover .label,
        .item:focus .label,
        .item:focus-within .label {
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
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
          color: light-dark(
            var(--ddd-theme-default-originalBlack),
            var(--ddd-theme-default-white)
          );
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
          position: relative;
        }
        .indent-1 {
          padding-left: calc(16px * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-2 {
          padding-left: calc(16px * 2 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-3 {
          padding-left: calc(16px * 3 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-4 {
          padding-left: calc(16px * 4 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-5 {
          padding-left: calc(16px * 5 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-6 {
          padding-left: calc(16px * 6 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-7 {
          padding-left: calc(16px * 7 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-8 {
          padding-left: calc(16px * 8 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-9 {
          padding-left: calc(16px * 9 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-10 {
          padding-left: calc(16px * 10 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-11 {
          padding-left: calc(16px * 11 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-12 {
          padding-left: calc(16px * 12 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-13 {
          padding-left: calc(16px * 13 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-14 {
          padding-left: calc(16px * 14 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-15 {
          padding-left: calc(16px * 15 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-16 {
          padding-left: calc(16px * 16 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-17 {
          padding-left: calc(16px * 17 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-18 {
          padding-left: calc(16px * 18 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-19 {
          padding-left: calc(16px * 19 * var(--outline-designer-zoom));
          position: relative;
        }
        .indent-20 {
          padding-left: calc(16px * 20 * var(--outline-designer-zoom));
          position: relative;
        }
        .sr-only {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        /* Drop zone indicators for drag and drop - kanban style */
        .drop-indicator {
          height: calc(42px * var(--outline-designer-zoom, 1));
          background: light-dark(
            rgba(33, 150, 243, 0.08),
            rgba(33, 150, 243, 0.12)
          );
          border: 2px dashed var(--ddd-accent-4);
          border-radius: var(--ddd-radius-sm);
          margin: var(--ddd-spacing-1) 0;
          position: relative;
          z-index: 100;
          opacity: 0;
          transform: scaleY(0);
          transform-origin: top;
          transition: all 0.15s ease-out;
        }
        .drop-indicator.show {
          opacity: 1;
          transform: scaleY(1);
        }
        .drop-indicator.indent-visual {
          border-left: 4px solid var(--ddd-accent-3);
          background: light-dark(
            rgba(33, 150, 243, 0.15),
            rgba(33, 150, 243, 0.2)
          );
        }
        .drop-target-child {
          outline: 2px dashed var(--ddd-accent-4) !important;
          outline-offset: 2px;
          background: light-dark(
            rgba(135, 206, 235, 0.15),
            rgba(135, 206, 235, 0.1)
          ) !important;
        }
        /* Drag preview styles */
        .drag-preview {
          position: absolute;
          top: -1000px;
          left: -1000px;
          padding: 8px 12px;
          background: light-dark(var(--ddd-accent-6), var(--ddd-primary-3));
          border: 2px solid
            light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          border-radius: var(--ddd-radius-sm);
          font-weight: var(--ddd-font-weight-bold);
          box-shadow: var(--ddd-boxShadow-lg);
          z-index: 10000;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        /* Stacked effect for items with children */
        .drag-preview.has-children {
          position: relative;
        }
        .drag-preview.has-children::before,
        .drag-preview.has-children::after {
          content: "";
          position: absolute;
          left: 3px;
          right: -3px;
          height: 100%;
          background: light-dark(var(--ddd-accent-6), var(--ddd-primary-3));
          border: 2px solid
            light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          border-radius: var(--ddd-radius-sm);
          z-index: -1;
        }
        .drag-preview.has-children::before {
          top: -3px;
          opacity: 0.7;
        }
        .drag-preview.has-children::after {
          top: -6px;
          opacity: 0.4;
        }
        .drag-preview-children {
          opacity: 0.7;
          font-size: 12px;
          font-weight: var(--ddd-font-weight-regular);
        }
        .drag-handle-active {
          outline: 2px solid
            light-dark(var(--ddd-accent-4), var(--ddd-accent-3));
          outline-offset: 2px;
          background-color: light-dark(
            var(--ddd-accent-5),
            var(--ddd-primary-6)
          );
        }
        /* Push-aside animation for drop target */
        .item.drop-above-target {
          margin-top: 48px;
          transition: margin-top 0.2s ease-out;
        }
        .item.drop-below-target {
          margin-bottom: 48px;
          transition: margin-bottom 0.2s ease-out;
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
    this.liveRegionText = "";
    this._dropZone = null;
    this._dragPreviewElement = null;
    this.activePage = null;
    this.selectedPages = [];
    this.zoomLevel = 1;
    this._dragHandleActive = null;
    this.t = {
      selectTarget: "Select target",
      importContentUnderThisPage: "Import content under this page",
      importThisContent: "Import this content",
      thisPage: "this page",
      newPage: "New page",
      copyOf: "Copy of",
      pageActions: "Page Actions",
      editTitle: "Edit title",
      lock: "Lock",
      unlock: "Unlock",
      moveUp: "Move up",
      moveDown: "Move down",
      makeChild: "Make child",
      moveToParentLevel: "Move to parent level",
      addPage: "Add page",
      duplicate: "Duplicate",
      delete: "Delete",
      restore: "Restore",
      goToPage: "Go to page",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
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
        <simple-toolbar-button
          class="control"
          icon="add"
          @click="${this.addItemToTop}"
          label="Add page"
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="hardware:keyboard-arrow-right"
          @click="${this.collapseAll}"
          class="control"
          label="Collapse all"
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="hardware:keyboard-arrow-down"
          @click="${this.expandAll}"
          class="control"
          label="Expand all"
        ></simple-toolbar-button>
        ${this.selectedPages.length > 0
          ? html`<simple-toolbar-button
              icon="delete"
              @click="${this.deleteSelected}"
              class="control"
              label="Delete Selected (${this.selectedPages.length})"
            ></simple-toolbar-button>`
          : ``}
        ${this.hasDeletedItems()
          ? html`<simple-toolbar-button
              icon="delete"
              @click="${this.toggleDelete}"
              class="control"
              label="${!this.hideDelete
                ? "Hide Deleted"
                : "Show Deleted"}"
            ></simple-toolbar-button>`
          : ``}
        <simple-toolbar-button
          icon="zoom-in"
          @click="${this.zoomIn}"
          class="control"
          ?disabled="${this.zoomLevel >= 1}"
          label="Zoom In"
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="zoom-out"
          @click="${this.zoomOut}"
          class="control"
          ?disabled="${this.zoomLevel <= -3}"
          label="Zoom Out"
        ></simple-toolbar-button>
      </div>
      <ul
        id="list"
        role="tree"
        aria-label="Outline structure of pages and content"
      >
        ${this.items.map((item, index) =>
          this.getItemParentsCollapsed(item) === ""
            ? this.renderItem(item, index)
            : ``,
        )}
      </ul>
      <div aria-live="polite" aria-atomic="true" class="sr-only">
        ${this.liveRegionText}
      </div>
      <simple-popover auto for="list" hidden>
        <simple-icon-button-lite
          @click="${this.resetPopOver}"
          title="Close"
          icon="cancel"
          class="close-btn"
        ></simple-icon-button-lite>
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

  handleItemClick(e) {
    const target = e.target.closest("[data-item-id]");
    if (!target) return;

    const itemId = target.getAttribute("data-item-id");

    if (e.ctrlKey || e.metaKey) {
      this.togglePageSelection(itemId);
    } else if (e.shiftKey && this.activePage) {
      this.selectPageRange(this.activePage, itemId);
    } else {
      if (
        !e.target.closest("simple-toolbar-button") &&
        !e.target.closest("simple-icon-button-lite") &&
        !e.target.closest(".label-edit")
      ) {
        this.activePage = itemId;
        this.requestUpdate();
      }
    }
  }

  togglePageSelection(itemId) {
    const index = this.selectedPages.indexOf(itemId);
    if (index > -1) {
      this.selectedPages.splice(index, 1);
    } else {
      this.selectedPages.push(itemId);
    }
    this.activePage = itemId;
    this.requestUpdate();
  }

  selectPageRange(startId, endId) {
    const startIndex = this.items.findIndex((item) => item.id === startId);
    const endIndex = this.items.findIndex((item) => item.id === endId);

    if (startIndex === -1 || endIndex === -1) return;

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    this.selectedPages = [];
    for (let i = minIndex; i <= maxIndex; i++) {
      if (this.getItemParentsCollapsed(this.items[i]) === "") {
        this.selectedPages.push(this.items[i].id);
      }
    }
    this.requestUpdate();
  }

  deleteSelected() {
    this.selectedPages.forEach((pageId) => {
      const index = this.items.findIndex((item) => item.id === pageId);
      if (index !== -1 && !this.isLocked(index)) {
        this.items[index].delete = true;
        if (this.hasChildren(this.items[index].id)) {
          this.recurseAction(this.items[index].id, "delete", true);
        }
      }
    });
    this.selectedPages = [];
    this.__syncUIAndDataModel();
  }

  zoomIn() {
    if (this.zoomLevel < 1) {
      this.zoomLevel++;
      this.updateZoomClass();
    }
  }

  zoomOut() {
    if (this.zoomLevel > -3) {
      this.zoomLevel--;
      this.updateZoomClass();
    }
  }

  updateZoomClass() {
    this.classList.remove("zoom-out-1", "zoom-out-2", "zoom-out-3");
    if (this.zoomLevel === 0) {
      this.classList.add("zoom-out-1");
    } else if (this.zoomLevel === -1) {
      this.classList.add("zoom-out-2");
    } else if (this.zoomLevel <= -2) {
      this.classList.add("zoom-out-3");
    }
    this.requestUpdate();
  }

  _toggleActionsMenu(e, index) {
    e.stopPropagation();
    const button = e.target;
    const listItem = button.closest("li");
    const menu = listItem.querySelector(".actions-menu");
    if (menu) {
      menu.toggle(button);
    }
  }

  _handleMenuAction(e, index, action) {
    e.stopPropagation();
    const button = e.target;
    const listItem = button.closest("li");
    const menu = listItem.querySelector(".actions-menu");
    if (menu) menu.close();

    if (action === "edit-title" && index !== false) {
      // Trigger edit mode for the title
      const labelElement = listItem.querySelector(".label.shown");
      if (labelElement && !this.isLocked(index)) {
        this.editTitle({ target: labelElement });
      }
    } else if (action && index !== false) {
      this.itemOp(index, action);
    }
  }

  renderItem(item, index) {
    return html`
      <li
        role="treeitem"
        tabindex="${index === 0 ? "0" : "-1"}"
        aria-label="${item.title}${item.modified
          ? " (modified)"
          : ""}${item.delete ? " (marked for deletion)" : ""}"
        aria-expanded="${this.hasChildren(item.id)
          ? this.isCollapsed(item.id)
            ? "false"
            : "true"
          : "undefined"}"
        aria-level="${item.indent + 1}"
        aria-setsize="${this.items.filter((i) => i.parent === item.parent)
          .length}"
        aria-posinset="${this.items
          .filter((i) => i.parent === item.parent)
          .indexOf(item) + 1}"
        @keydown="${this.handleTreeItemKeydown}"
        @dragenter="${this._dragEnter}"
        @dragleave="${this._dragLeave}"
        @mouseenter="${this.setActiveItemForActions}"
        @click="${this.handleItemClick}"
        class="item indent-${item.indent < 20
          ? item.indent
          : 20} ${item.modified
          ? "modified"
          : ""} ${this.getItemParentsCollapsed(item)} ${this.activePage ===
        item.id
          ? "active-page"
          : ""} ${this.selectedPages.includes(item.id) ? "selected-page" : ""}"
        data-item-id="${item.id}"
        @focusin="${this.setActiveItemForActions}"
        data-parents="${this.getItemParents(item)}"
        ?data-has-children="${this.hasChildren(item.id)}"
        ?data-about-to-delete="${item.delete}"
        ?hidden="${this.hideDelete && item.delete}"
      >
        <simple-toolbar-button
          class="actions-menu-button"
          icon="icons:more-vert"
          label="${this.t.pageActions}"
          @click="${(e) => this._toggleActionsMenu(e, index)}"
        ></simple-toolbar-button>
        <simple-icon-button-lite
          ?disabled="${this.isLocked(index)}"
          class="collapse-btn"
          icon="${this.isCollapsed(item.id)
            ? `hardware:keyboard-arrow-right`
            : `hardware:keyboard-arrow-down`}"
          @click="${this.collapseExpand}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          ?disabled="${this.isLocked(index)}"
          @dragstart="${this._dragStart}"
          @dragend="${this._dragEnd}"
          @drag="${this._onDrag}"
          @keydown="${this._handleDragHandleKeydown}"
          draggable="${!this.isLocked(index)}"
          icon="icons:reorder"
          class="drag-handle ${this._dragHandleActive === item.id
            ? "drag-handle-active"
            : ""}"
          title="Drag to reorder or press Enter to activate keyboard controls"
          data-drag-handle-id="${item.id}"
        ></simple-icon-button-lite>
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
          @keydown="${this.handleLabelKeydown}"
          tabindex="0"
          >${item.title}</span
        >
        <span
          class="label-edit"
          @blur="${this.blurTitle}"
          @keypress="${this.monitorTitle}"
          @keydown="${this.monitorEsc}"
        ></span>
        <simple-context-menu
          class="actions-menu"
          data-item-index="${index}"
          title="${this.t.pageActions}"
        >
          <simple-toolbar-button
            value="up"
            ?disabled="${this.isLocked(index)}"
            icon="icons:arrow-upward"
            label="${this.t.moveUp}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "up")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="down"
            ?disabled="${this.isLocked(index)}"
            icon="icons:arrow-downward"
            label="${this.t.moveDown}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "down")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="in"
            ?disabled="${this.isLocked(index)}"
            icon="hax:outline-designer-indent"
            label="Indent"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "in")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="out"
            ?disabled="${this.isLocked(index)}"
            icon="hax:outline-designer-outdent"
            label="Outdent"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "out")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="edit-title"
            ?disabled="${this.isLocked(index)}"
            icon="editor:mode-edit"
            label="${this.t.editTitle}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "edit-title")}"
            autofocus
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="add"
            ?disabled="${this.isLocked(index)}"
            icon="hax:add-page"
            label="${this.t.addPage}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "add")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="duplicate"
            ?disabled="${this.isLocked(index)}"
            icon="content-copy"
            label="${this.t.duplicate}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "duplicate")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="goto"
            icon="open-in-browser"
            label="${this.t.goToPage}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "goto")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            value="lock"
            icon="${this.isLocked(index) ? "icons:lock" : "icons:lock-open"}"
            label="${this.isLocked(index) ? this.t.unlock : this.t.lock}"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "lock")}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            class="delete-button"
            value="delete"
            ?disabled="${this.isLocked(index)}"
            icon="icons:delete"
            label="Delete"
            show-text-label
            @click="${(e) => this._handleMenuAction(e, index, "delete")}"
          ></simple-toolbar-button>
        </simple-context-menu>
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
        <simple-icon-button-lite
          class="content-operation"
          icon="hax:outline-designer-outdent"
          @click="${(e) => this.modifyContentAction(e, item, "in")}"
          title="Increase heading"
          ?disabled="${tagName === "h1" || item.metadata.locked}"
          ?hidden="${part !== "heading"}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          icon="hax:keyboard-arrow-up"
          @click="${(e) => this.modifyContentAction(e, item, "up")}"
          title="Move up"
          ?disabled="${item.metadata.locked}"
          class="content-operation"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          icon="hax:keyboard-arrow-down"
          @click="${(e) => this.modifyContentAction(e, item, "down")}"
          title="Move down"
          ?disabled="${item.metadata.locked}"
          class="content-operation"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="content-operation"
          icon="hax:outline-designer-indent"
          @click="${(e) => this.modifyContentAction(e, item, "out")}"
          title="Decrease Heading"
          ?disabled="${tagName === "h6" || item.metadata.locked}"
          ?hidden="${part !== "heading"}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="content-operation"
          icon="editor:format-page-break"
          @click="${(e) => this.pageBreakHere(e, item)}"
          title="Promote to page"
          ?disabled="${item.metadata.locked}"
          ?hidden="${part !== "heading"}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          icon="delete"
          @click="${(e) => this.modifyContentAction(e, item, "delete")}"
          class="content-operation del"
          title="Delete"
          ?disabled="${item.metadata.locked}"
          accent-color="red"
        ></simple-icon-button-lite>
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

  // Handle keyboard navigation for drag handle
  _handleDragHandleKeydown(e) {
    const dragHandle = e.target;
    const itemId = dragHandle.getAttribute("data-drag-handle-id");
    const itemIndex = this.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1 || this.isLocked(itemIndex)) return;

    // Enter key activates/deactivates keyboard drag mode
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if (this._dragHandleActive === itemId) {
        // Deactivate
        this._dragHandleActive = null;
        this.announceAction("Keyboard controls deactivated");
      } else {
        // Activate
        this._dragHandleActive = itemId;
        this.announceAction(
          "Keyboard controls activated. Use arrow keys to move, Enter or Escape to deactivate",
        );
      }
      this.requestUpdate();
      return;
    }

    // Escape key deactivates keyboard drag mode
    if (e.key === "Escape" && this._dragHandleActive === itemId) {
      e.preventDefault();
      e.stopPropagation();
      this._dragHandleActive = null;
      this.announceAction("Keyboard controls deactivated");
      this.requestUpdate();
      return;
    }

    // Only process arrow keys if this handle is active
    if (this._dragHandleActive !== itemId) return;

    let action = null;
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        action = "up";
        this.announceAction("Moving item up");
        break;
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        action = "down";
        this.announceAction("Moving item down");
        break;
      case "ArrowLeft":
        e.preventDefault();
        e.stopPropagation();
        action = "in";
        this.announceAction("Indenting item");
        break;
      case "ArrowRight":
        e.preventDefault();
        e.stopPropagation();
        action = "out";
        this.announceAction("Outdenting item");
        break;
    }

    if (action) {
      this.itemOp(itemIndex, action);
    }
  }

  // Handle Enter key on label to activate editing mode
  handleLabelKeydown(e) {
    // Only handle Enter key and prevent if disabled
    if (e.key === "Enter" && !e.target.hasAttribute("disabled")) {
      e.preventDefault();
      e.stopPropagation();
      this.editTitle(e);
      this.announceAction("Title editing activated");
    }
  }

  // Handle keyboard navigation for tree structure
  handleTreeItemKeydown(e) {
    // Only handle navigation keys when focused directly on the tree item
    // Allow other elements (buttons, inputs) to handle their own keyboard events
    if (
      e.target.tagName.toLowerCase() !== "li" ||
      !e.target.hasAttribute("role")
    ) {
      return;
    }

    const currentItem = e.target;
    const itemId = currentItem.getAttribute("data-item-id");
    const itemIndex = this.items.findIndex((item) => item.id === itemId);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.focusNextItem(itemIndex);
        this.announceNavigation("Moved to next item");
        break;
      case "ArrowUp":
        e.preventDefault();
        this.focusPreviousItem(itemIndex);
        this.announceNavigation("Moved to previous item");
        break;
      case "ArrowRight":
        e.preventDefault();
        if (this.hasChildren(itemId) && this.isCollapsed(itemId)) {
          this.collapseExpand(e);
          this.announceStateChange("Expanded");
        } else {
          this.focusFirstChild(itemIndex);
          this.announceNavigation("Moved to first child");
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (this.hasChildren(itemId) && !this.isCollapsed(itemId)) {
          this.collapseExpand(e);
          this.announceStateChange("Collapsed");
        } else {
          this.focusParent(itemIndex);
          this.announceNavigation("Moved to parent");
        }
        break;
      case "Enter":
      case " ":
        // Only handle expand/collapse if no operations are visible
        if (this.activeItemForActions !== itemId && this.hasChildren(itemId)) {
          e.preventDefault();
          this.collapseExpand(e);
          const newState = this.isCollapsed(itemId) ? "Collapsed" : "Expanded";
          this.announceStateChange(newState);
        }
        break;
      case "Home":
        e.preventDefault();
        this.focusFirstItem();
        this.announceNavigation("Moved to first item");
        break;
      case "End":
        e.preventDefault();
        this.focusLastItem();
        this.announceNavigation("Moved to last item");
        break;
      case "Delete":
      case "Backspace":
        // Keyboard shortcut for delete operation
        if (this.activeItemForActions === itemId && !this.isLocked(itemIndex)) {
          e.preventDefault();
          this.itemOp(itemIndex, "delete");
          this.announceAction("Item marked for deletion");
        }
        break;
      case "d":
        // Keyboard shortcut for duplicate
        if (
          e.ctrlKey &&
          this.activeItemForActions === itemId &&
          !this.isLocked(itemIndex)
        ) {
          e.preventDefault();
          this.itemOp(itemIndex, "duplicate");
          this.announceAction("Item duplicated");
        }
        break;
    }
  }

  focusNextItem(currentIndex) {
    const visibleItems = this.items.filter(
      (item, index) =>
        (this.getItemParentsCollapsed(item) === "" && !this.hideDelete) ||
        !item.delete,
    );
    const currentVisibleIndex = visibleItems.findIndex(
      (item) => item.id === this.items[currentIndex].id,
    );
    const nextIndex = Math.min(
      currentVisibleIndex + 1,
      visibleItems.length - 1,
    );
    this.focusItem(visibleItems[nextIndex].id);
  }

  focusPreviousItem(currentIndex) {
    const visibleItems = this.items.filter(
      (item, index) =>
        (this.getItemParentsCollapsed(item) === "" && !this.hideDelete) ||
        !item.delete,
    );
    const currentVisibleIndex = visibleItems.findIndex(
      (item) => item.id === this.items[currentIndex].id,
    );
    const prevIndex = Math.max(currentVisibleIndex - 1, 0);
    this.focusItem(visibleItems[prevIndex].id);
  }

  focusFirstChild(parentIndex) {
    const parentId = this.items[parentIndex].id;
    const firstChild = this.items.find((item) => item.parent === parentId);
    if (firstChild && this.getItemParentsCollapsed(firstChild) === "") {
      this.focusItem(firstChild.id);
    }
  }

  focusParent(childIndex) {
    const parentId = this.items[childIndex].parent;
    if (parentId) {
      this.focusItem(parentId);
    }
  }

  focusFirstItem() {
    const firstItem = this.items.find(
      (item) =>
        this.getItemParentsCollapsed(item) === "" &&
        (!this.hideDelete || !item.delete),
    );
    if (firstItem) {
      this.focusItem(firstItem.id);
    }
  }

  focusLastItem() {
    const visibleItems = this.items.filter(
      (item) =>
        this.getItemParentsCollapsed(item) === "" &&
        (!this.hideDelete || !item.delete),
    );
    if (visibleItems.length > 0) {
      this.focusItem(visibleItems[visibleItems.length - 1].id);
    }
  }

  focusItem(itemId) {
    // Remove tabindex from all items
    const allItems = this.shadowRoot.querySelectorAll('[role="treeitem"]');
    allItems.forEach((item) => {
      item.setAttribute("tabindex", "-1");
    });

    // Set tabindex and focus on target item
    const targetItem = this.shadowRoot.querySelector(
      `[data-item-id="${itemId}"]`,
    );
    if (targetItem) {
      targetItem.setAttribute("tabindex", "0");
      targetItem.focus();
    }
  }

  // Accessibility announcement helpers
  announceNavigation(message) {
    this.liveRegionText = message;
    this.requestUpdate();
    // Clear after announcement to avoid repetition
    setTimeout(() => {
      this.liveRegionText = "";
      this.requestUpdate();
    }, 1000);
  }

  announceStateChange(state) {
    this.liveRegionText = state;
    this.requestUpdate();
    // Clear after announcement
    setTimeout(() => {
      this.liveRegionText = "";
      this.requestUpdate();
    }, 1000);
  }

  announceAction(action) {
    this.liveRegionText = action;
    this.requestUpdate();
    // Clear after announcement
    setTimeout(() => {
      this.liveRegionText = "";
      this.requestUpdate();
    }, 1000);
  }

  // Helper method to scroll item into view if not visible
  scrollIntoViewIfNeeded(itemId, delay = 2000) {
    setTimeout(() => {
      const targetItem = this.shadowRoot.querySelector(
        `[data-item-id="${itemId}"]`,
      );
      if (targetItem) {
        const rect = targetItem.getBoundingClientRect();
        const viewportHeight = globalThis.innerHeight;
        const viewportWidth = globalThis.innerWidth;

        // Check if item is outside viewport
        const isOutsideViewport =
          rect.bottom < 0 ||
          rect.top > viewportHeight ||
          rect.right < 0 ||
          rect.left > viewportWidth;

        if (isOutsideViewport) {
          targetItem.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
    }, delay);
  }

  /**
   * Create custom drag preview element
   */
  _createDragPreview(target) {
    const itemId = target.getAttribute("data-item-id");
    const item = this.items.find((i) => i.id === itemId);

    if (!item) return null;

    const preview = globalThis.document.createElement("div");
    preview.className = "drag-preview";

    // Count all descendants recursively
    const totalDescendants = this._countAllDescendants(itemId);

    // Add stacked class if has children
    if (totalDescendants > 0) {
      preview.classList.add("has-children");
    }

    // Create icon
    const icon = globalThis.document.createElement("simple-icon-lite");
    icon.setAttribute("icon", "icons:reorder");

    // Create title span
    const title = globalThis.document.createElement("span");
    title.textContent =
      item.title.length > 40 ? item.title.substring(0, 40) + "..." : item.title;

    preview.appendChild(icon);
    preview.appendChild(title);

    // Add descendant count if applicable
    if (totalDescendants > 0) {
      const childCountSpan = globalThis.document.createElement("span");
      childCountSpan.className = "drag-preview-children";
      childCountSpan.textContent = `(+${totalDescendants} page${totalDescendants !== 1 ? "s" : ""})`;
      preview.appendChild(childCountSpan);
    }

    return preview;
  }

  /**
   * Recursively count all descendants of an item
   */
  _countAllDescendants(itemId) {
    const directChildren = this.items.filter((i) => i.parent === itemId);
    let count = directChildren.length;

    // Recursively add counts for each child's descendants
    directChildren.forEach((child) => {
      count += this._countAllDescendants(child.id);
    });

    return count;
  }
  _onDrag(e) {
    // Continuously update drag position for better feedback
    if (this._targetDrag && e.clientX && e.clientY) {
      // Trigger dragenter to update drop indicators
      const elementAtPoint = globalThis.document.elementFromPoint(
        e.clientX,
        e.clientY,
      );
      if (elementAtPoint) {
        const target = elementAtPoint.closest("[data-item-id]");
        if (target && target !== this._lastDragTarget) {
          this._lastDragTarget = target;
          this._dragEnter(e);
        }
      }
    }
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
    const target = e.target.closest("[data-item-id]");
    if (!target || !this._targetDrag) return;

    // Don't allow dropping on itself
    if (target === this._targetDrag) return;

    e.preventDefault();

    // Calculate drop zone based on cursor position
    const rect = target.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const x = e.clientX - rect.left;
    const height = rect.height;
    const width = rect.width;

    // Determine if indenting based on horizontal position
    // More than 40px from left = potential indent/child drop
    const indentThreshold = 40;
    const isIndentZone = x > indentThreshold;

    // Top 30% = above, middle 40% = child (or indent), bottom 30% = below
    let dropZone = "child";
    if (y < height * 0.3 && !isIndentZone) {
      dropZone = "above";
    } else if (y > height * 0.7 && !isIndentZone) {
      dropZone = "below";
    } else if (isIndentZone) {
      dropZone = "child";
    }

    // Only update if target or zone changed
    if (this._targetDrop !== target || this._dropZone !== dropZone) {
      // Clean up previous indicators
      this.shadowRoot
        .querySelectorAll(".drop-indicator")
        .forEach((el) => el.remove());
      this.shadowRoot.querySelectorAll(".drop-target-child").forEach((el) => {
        el.classList.remove("drop-target-child");
      });
      this.shadowRoot
        .querySelectorAll(".outline-designer-hovered")
        .forEach((el) => {
          el.classList.remove("outline-designer-hovered");
        });
      // Clean up push-aside classes
      this.shadowRoot.querySelectorAll(".drop-above-target").forEach((el) => {
        el.classList.remove("drop-above-target");
      });
      this.shadowRoot.querySelectorAll(".drop-below-target").forEach((el) => {
        el.classList.remove("drop-below-target");
      });

      // Add new indicator based on drop zone with animation
      if (dropZone === "above") {
        const indicator = globalThis.document.createElement("div");
        indicator.className = "drop-indicator drop-above";
        target.insertAdjacentElement("beforebegin", indicator);
        // Show with animation immediately
        setTimeout(() => indicator.classList.add("show"), 10);
        // Add push-aside animation to target
        target.classList.add("drop-above-target");
      } else if (dropZone === "below") {
        const indicator = globalThis.document.createElement("div");
        indicator.className = "drop-indicator drop-below";
        target.insertAdjacentElement("afterend", indicator);
        // Show with animation immediately
        setTimeout(() => indicator.classList.add("show"), 10);
        // Add push-aside animation to target
        target.classList.add("drop-below-target");
      } else {
        // child - show dashed outline with indent visual
        target.classList.add("drop-target-child");
        const indicator = globalThis.document.createElement("div");
        indicator.className = "drop-indicator indent-visual";
        indicator.style.marginLeft = "40px";
        target.insertAdjacentElement("afterend", indicator);
        setTimeout(() => indicator.classList.add("show"), 10);
      }

      this._targetDrop = target;
      this._dropZone = dropZone;

      // Announce to screen readers
      const targetItem = this.items.find(
        (item) => item.id === target.getAttribute("data-item-id"),
      );
      if (targetItem) {
        const dragItem = this.items.find(
          (item) => item.id === this._targetDrag.getAttribute("data-item-id"),
        );
        let announcement = "";
        if (dropZone === "above") {
          announcement = `Drop above ${targetItem.title}`;
        } else if (dropZone === "below") {
          announcement = `Drop below ${targetItem.title}`;
        } else {
          announcement = `Drop as child of ${targetItem.title}`;
        }
        this.announceAction(announcement);
      }
    }
  }
  /**
   * Leaving an element while dragging.
   */
  _dragLeave(e) {
    // Cleanup is now handled in _dragEnter for better accuracy
    // This prevents flickering when moving between child elements
  }
  /**
   * When we end dragging this is the same as a drop event; ensure we remove the mover class.
   */
  _dragEnd(e) {
    // Remove dragging state
    if (this._targetDrag) {
      this._targetDrag.removeAttribute("data-dragging");
    }

    // Clean up drag preview
    if (this._dragPreviewElement) {
      this._dragPreviewElement.remove();
      this._dragPreviewElement = null;
    }

    // Clean up drop indicators
    this.shadowRoot
      .querySelectorAll(".drop-indicator")
      .forEach((el) => el.remove());
    this.shadowRoot.querySelectorAll(".drop-target-child").forEach((el) => {
      el.classList.remove("drop-target-child");
    });
    this.shadowRoot
      .querySelectorAll(".outline-designer-hovered")
      .forEach((el) => {
        el.classList.remove("outline-designer-hovered");
      });
    // Clean up push-aside classes
    this.shadowRoot.querySelectorAll(".drop-above-target").forEach((el) => {
      el.classList.remove("drop-above-target");
    });
    this.shadowRoot.querySelectorAll(".drop-below-target").forEach((el) => {
      el.classList.remove("drop-below-target");
    });

    if (this._targetDrag && this._targetDrop && this._dropZone) {
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

        // Apply drop based on zone
        switch (this._dropZone) {
          case "above":
            this.items[from].order = this.items[here].order - 0.5;
            this.items[from].parent = this.items[here].parent;
            this.items[from].indent = this.items[here].indent;
            break;
          case "below":
            this.items[from].order = this.items[here].order + 0.5;
            this.items[from].parent = this.items[here].parent;
            this.items[from].indent = this.items[here].indent;
            break;
          case "child":
            this.items[from].parent = this.items[here].id;
            this.items[from].order = 0;
            this.items[from].indent = this.items[here].indent + 1;
            break;
        }

        if (this.hasChildren(this.items[from].id)) {
          this.items[from].collapsed = false;
        }

        // Scroll moved item into view after a delay if it's outside viewport
        this.scrollIntoViewIfNeeded(this.items[from].id);
      }
      this.setAttribute("stop-animation", "true");
      this.__syncUIAndDataModel();
    }

    // Reset drag state
    this._targetDrag = null;
    this._targetDrop = null;
    this._dropZone = null;
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    if (e.target.getAttribute("disabled") == null) {
      let target = e.target.closest("[data-item-id]");
      this._targetDrop = null;
      this._targetDrag = target;

      // Add dragging state for styling
      target.setAttribute("data-dragging", "true");

      // Create custom drag preview
      const dragPreview = this._createDragPreview(target);
      if (dragPreview) {
        globalThis.document.body.appendChild(dragPreview);
        this._dragPreviewElement = dragPreview;

        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.dropEffect = "move";
          // Use custom preview as drag image
          e.dataTransfer.setDragImage(dragPreview, 20, 20);
        }
      }

      this._mouseDownDrag(e);
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
      liveRegionText: { type: String },
      activePage: { type: String },
      selectedPages: { type: Array },
      zoomLevel: { type: Number },
      _dragHandleActive: { type: String },
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
              // Scroll moved item into view after a delay if it's outside viewport
              this.scrollIntoViewIfNeeded(element.id);
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
globalThis.customElements.define(OutlineDesigner.tag, OutlineDesigner);
