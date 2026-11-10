import { LitElement, css, html } from "lit";
import "@haxtheweb/hax-body/lib/hax-toolbar.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu-item.js";
import { HAXStore } from "./hax-store.js";
import "./hax-toolbar-menu.js";
import "./hax-toolbar.js";
import "./hax-context-item.js";
import { wipeSlot } from "@haxtheweb/utils/lib/slot.js";
import { autorun, toJS } from "mobx";
import { HaxContextBehaviors } from "./hax-context-behaviors.js";
import { normalizeEventPath } from "@haxtheweb/utils/lib/events.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `hax-plate-context`
 * `A context menu that provides common grid plate based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 * - grid plate - the container / full HTML tag which can have operations applied to it.
 */
class HaxPlateContext extends I18NMixin(HaxContextBehaviors(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  constructor() {
    super();
    this.disableOps = false;
    this.disableItemOps = false;
    this.insertAbove = true;
    this.disableDuplicate = false;
    this.hasActiveEditingElement = false;
    this.haxUIElement = true;
    this.barSize = "compact";
    this._confirmRemove = false;
    this.t = {
      edit: "Edit",
      dragHandle: "Drag handle",
      moveUp: "Move up",
      moveDown: "Move down",
      addColumn: "Add column",
      removeColumn: "Remove column",
      remove: "Remove",
      duplicate: "Duplicate",
      confirmDelete: "Confirm delete",
      changeTo: "Change to",
      editElement: "Edit Mode",
      modifyHTMLSource: "Modify HTML source",
      regions: "Available regions",
      insertItemAbove: "Insert item above",
      insertItemAboveOrBelow: "Insert item above or below",
      insertItemBelow: "Insert item below",
      selectLayout: "Select Layout Element",
      lockContent: "Lock content",
      unlockContent: "Unlock content",
      layout: "Layout",
      more: "More",
      showAllTools: "Show all tools",
      showFewerTools: "Show fewer tools",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    this.ceButtons = [];
    this.activeTagName = "";
    this.activeTagIcon = "hax:paragraph";
    this.addEventListener(
      "hax-context-item-selected",
      this.handleCECustomEvent.bind(this),
    );
  }
  static get tag() {
    return "hax-plate-context";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: auto;
          max-width: 100%;
          align-items: stretch;
        }
        hax-toolbar::part(morebutton) {
          --simple-toolbar-button-color: var(--hax-ui-color);
          --simple-toolbar-button-bg: var(--hax-ui-surface);
          --simple-toolbar-button-border-color: transparent;
          --simple-toolbar-button-hover-color: var(--hax-ui-color);
          --simple-toolbar-button-hover-bg: var(--hax-ui-hover);
          --simple-toolbar-button-toggled-color: var(--hax-ui-color-accent);
          --simple-toolbar-button-toggled-bg: var(--hax-ui-selected);
          --simple-toolbar-button-toggled-border-color: transparent;
          --simple-toolbar-button-disabled-opacity: 1;
          --simple-toolbar-button-disabled-color: var(--hax-ui-disabled-color);
          --simple-toolbar-button-disabled-bg: var(--hax-ui-surface);
          --simple-toolbar-button-disabled-border-color: unset;
          --simple-toolbar-border-radius: var(--hax-ui-radius);
          align-self: flex-end;
          justify-self: stretch;
        }
        #remove {
          max-width: 44px;
          overflow: visible;
        }
        hax-toolbar {
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          --simple-toolbar-border-width: 0;
        }
        .group {
          display: flex;
          align-items: center;
          flex: 0 0 auto;
          justify-content: center;
          border: 0;
          padding: 0;
          gap: 1px;
          background-color: transparent;
        }
        .group + .group {
          border-left: 1px solid var(--hax-ui-line);
          padding-left: 1px;
          margin-left: 1px;
        }
        .group,
        .group > * {
          z-index: 1;
        }
        .group:empty {
          display: none;
        }
        .group > *,
        :host([collapsed]) .group {
          flex: 0 0 auto;
        }
        .group *:not([toggled])::part(button) {
          border-color: transparent;
        }
        :host .group:focus,
        :host .group:focus-within,
        :host .group > *:focus,
        :host .group > *:focus-within {
          z-index: 2;
        }
        :host .group:hover,
        :host .group > *:hover {
          z-index: 3;
        }
        .first-slot:not(:first-child) {
          border-top: 1px solid var(--hax-ui-line);
        }
        hax-toolbar-menu,
        hax-context-item {
          line-height: 30px;
        }
        hax-context-item {
          --simple-toolbar-button-width: 26px;
          --simple-toolbar-button-height: 26px;
        }
        /* a phone keeps one view: there is no room for all tools */
        @media screen and (max-width: 600px) {
          #barsize {
            display: none;
          }
        }
        #remove[confirm]::part(button) {
          color: var(--hax-ui-on-primary);
          background-color: var(--hax-ui-danger);
        }
      `,
    ];
  }
  /**
   * drag handle with its keyboard menu (move up / down / to a slot)
   */
  _dragTemplate() {
    return html`
      <hax-toolbar-menu
        ?disabled="${
          this.hasActiveEditingElement ||
          !this.canMoveElement ||
          this.viewSource
        }"
        id="drag"
        action
        icon="hax:admin-drag"
        label="${this.t.dragHandle}"
        draggable="true"
        reset-on-select
        ?hidden="${!this.canMoveElement}"
        @dragstart="${this._dragStart}"
        @dragend="${this._dragEnd}"
      >
        <simple-toolbar-menu-item slot="menuitem">
          <hax-context-item
            action
            align-horizontal="left"
            ?disabled="${this.hasActiveEditingElement}"
            show-text-label
            role="menuitem"
            icon="hax:keyboard-arrow-up"
            label="${this.t.moveUp}"
            event-name="hax-plate-up"
          ></hax-context-item>
        </simple-toolbar-menu-item>
        <simple-toolbar-menu-item slot="menuitem">
          <hax-context-item
            action
            align-horizontal="left"
            ?disabled="${this.hasActiveEditingElement}"
            role="menuitem"
            show-text-label
            icon="hax:keyboard-arrow-down"
            label="${this.t.moveDown}"
            event-name="hax-plate-down"
          ></hax-context-item>
        </simple-toolbar-menu-item>
        ${
          !this.activeNode ||
          !this.activeNode.parentNode ||
          !HAXStore.isLayoutElement(this.activeNode.parentNode)
            ? ""
            : (this.slottedItems || []).map(
                (slot, i) => html`
                  <simple-toolbar-menu-item
                    slot="menuitem"
                    class="move-to-slot ${i < 1 ? "first-slot" : ""}"
                  >
                    <hax-context-item
                      action
                      align-horizontal="left"
                      ?disabled="${this.viewSource}"
                      label="${slot.label}"
                      event-name="move-to-slot"
                      data-slot="${slot.slot}"
                      role="menuitem"
                      show-text-label
                    >
                    </hax-context-item>
                  </simple-toolbar-menu-item>
                `,
              )
        }
      </hax-toolbar-menu>
    `;
  }
  /**
   * Move up and Move down, one click each (also in the drag handle menu)
   */
  _moveTemplate() {
    const disabled =
      this.hasActiveEditingElement || !this.canMoveElement || this.viewSource;
    return html`
      <hax-context-item
        action
        ?disabled="${disabled}"
        ?hidden="${!this.canMoveElement}"
        icon="icons:arrow-upward"
        label="${this.t.moveUp}"
        event-name="hax-plate-up"
      ></hax-context-item>
      <hax-context-item
        action
        ?disabled="${disabled}"
        ?hidden="${!this.canMoveElement}"
        icon="icons:arrow-downward"
        label="${this.t.moveDown}"
        event-name="hax-plate-down"
      ></hax-context-item>
    `;
  }
  /**
   * menu items that select the surrounding layout or one of its slots
   */
  _selectLayoutItems() {
    return html`
      <simple-toolbar-menu-item slot="menuitem">
        <hax-context-item
          action
          align-horizontal="left"
          ?hidden="${!this.layoutParent || this.activeNode !== this.layoutElement}"
          .icon="${this.elementIcon(this.layoutParent)}"
          label="${this.elementLabel(this.layoutParent)}"
          event-name="hax-select-grid"
          .eventData="${this.layoutParent}"
          role="menuitem"
          show-text-label
        >
        </hax-context-item>
        <hax-context-item
          action
          align-horizontal="left"
          ?disabled="${this.activeNode === this.layoutElement}"
          ?hidden="${!this.layoutElement}"
          .icon="${this.elementIcon(this.layoutElement)}"
          label="${this.elementLabel(this.layoutElement)}"
          event-name="hax-select-grid"
          .eventData="${this.layoutElement}"
          role="menuitem"
          show-text-label
        >
        </hax-context-item>
      </simple-toolbar-menu-item>
      ${(this.slottedItems || []).map((slot, i) =>
        (slot.items || []).map(
          (item, j) => html`
            <simple-toolbar-menu-item
              slot="menuitem"
              class="hax-select-grid-item ${i < 1 && j < 1 ? "first-slot" : ""}"
            >
              <hax-context-item
                action
                align-horizontal="left"
                ?disabled="${this.viewSource || this.activeNode === item}"
                label="${slot.title || slot.id}${
                  slot.items.length > 1 ? ` (${j + 1})` : ""
                }"
                event-name="hax-select-grid-item"
                .eventData="${{
                  target: item,
                  grid: slot.grid,
                  slot: slot.slot,
                  index: j,
                  editMode: slot.editMode,
                }}"
                role="menuitem"
                show-text-label
              >
              </hax-context-item>
            </simple-toolbar-menu-item>
          `,
        ),
      )}
    `;
  }
  get _selectLayoutDisabled() {
    return (
      this.viewSource ||
      this.disableOps ||
      ((!this.layoutParent || this.activeNode !== this.layoutElement) &&
        !this.layoutElement)
    );
  }
  _selectLayoutTemplate() {
    return html`
      <hax-toolbar-menu
        action
        align-horizontal="left"
        ?disabled="${this._selectLayoutDisabled}"
        ?hidden="${HAXStore.isPlatformAudience("novice")}"
        icon="hax:select-element"
        label="${this.t.selectLayout}"
      >
        ${this._selectLayoutItems()}
      </hax-toolbar-menu>
    `;
  }
  _insertTemplate() {
    return html`
      <hax-toolbar-menu
        icon="add-box"
        label="${this.t.insertItemAboveOrBelow}"
        ?disabled="${this.viewSource}"
        @dblclick="${this.__dblClickFireInsert}"
      >
        <simple-toolbar-menu-item slot="menuitem">
          <hax-context-item
            action
            align-horizontal="left"
            show-text-label
            role="menuitem"
            ?disabled="${!this.insertAbove}"
            icon="hardware:keyboard-arrow-up"
            event-name="insert-above-active"
            label="${this.t.insertItemAbove}"
          ></hax-context-item>
        </simple-toolbar-menu-item>
        <simple-toolbar-menu-item slot="menuitem">
          <hax-context-item
            action
            align-horizontal="left"
            show-text-label
            role="menuitem"
            icon="hardware:keyboard-arrow-down"
            event-name="insert-below-active"
            label="${this.t.insertItemBelow}"
            ?disabled="${this.viewSource}"
          ></hax-context-item>
        </simple-toolbar-menu-item>
        ${
          !HAXStore.isLayoutElement(this.activeNode)
            ? ""
            : (this.slottedItems || []).map(
                (slot, i) => html`
                  <simple-toolbar-menu-item
                    slot="menuitem"
                    class="insert-into-active ${i < 1 ? "first-slot" : ""}"
                  >
                    <hax-context-item
                      action
                      align-horizontal="left"
                      ?disabled="${this.viewSource}"
                      label="${slot.label}"
                      event-name="insert-into-active"
                      data-slot="${slot.slot}"
                      role="menuitem"
                      show-text-label
                    >
                    </hax-context-item>
                  </simple-toolbar-menu-item>
                `,
              )
        }
      </hax-toolbar-menu>
    `;
  }
  get _columnOpsDisabled() {
    return this.hasActiveEditingElement || this.viewSource || this.disableOps;
  }
  /**
   * Add column / Remove column; in a menu they show their text label
   */
  _columnTemplate(inMenu = false) {
    const wrap = (item) =>
      inMenu
        ? html`<simple-toolbar-menu-item slot="menuitem"
            >${item}</simple-toolbar-menu-item
          >`
        : item;
    return html`
      ${wrap(
        html`<hax-context-item
          action
          id="right"
          class="paddle"
          icon="hax:table-column-plus-after"
          label="${this.t.addColumn}"
          ?disabled="${this._columnOpsDisabled}"
          ?hidden="${HAXStore.isPlatformAudience("novice")}"
          event-name="hax-plate-create-right"
          ?show-text-label="${inMenu}"
          align-horizontal="${inMenu ? "left" : "center"}"
          role="${inMenu ? "menuitem" : "button"}"
        >
        </hax-context-item>`,
      )}
      ${wrap(
        html`<hax-context-item
          action
          class="paddle"
          icon="hax:table-column-remove"
          label="${this.t.removeColumn}"
          ?disabled="${this._columnOpsDisabled}"
          event-name="hax-plate-remove-right"
          ?hidden="${!this.activeNode || HAXStore.isPlatformAudience("novice")}"
          id="rightremove"
          ?show-text-label="${inMenu}"
          align-horizontal="${inMenu ? "left" : "center"}"
          role="${inMenu ? "menuitem" : "button"}"
        >
        </hax-context-item>`,
      )}
    `;
  }
  /**
   * Layout menu (compact bar): select the surrounding layout, add or
   * remove a column
   */
  _layoutMenuTemplate() {
    return html`
      <hax-toolbar-menu
        id="layoutmenu"
        action
        align-horizontal="left"
        ?disabled="${this.viewSource || this.disableOps}"
        ?hidden="${HAXStore.isPlatformAudience("novice")}"
        icon="icons:view-column"
        label="${this.t.layout}"
      >
        ${this._selectLayoutDisabled ? "" : this._selectLayoutItems()}
        ${this._columnTemplate(true)}
      </hax-toolbar-menu>
    `;
  }
  _duplicateTemplate(inMenu = false) {
    return html`<hax-context-item
      action
      ?disabled="${
        this.hasActiveEditingElement ||
        this.viewSource ||
        this.disableOps ||
        this.disableDuplicate
      }"
      ?hidden="${HAXStore.isPlatformAudience("novice")}"
      label="${this.t.duplicate}"
      icon="icons:content-copy"
      event-name="hax-plate-duplicate"
      ?show-text-label="${inMenu}"
      align-horizontal="${inMenu ? "left" : "center"}"
      role="${inMenu ? "menuitem" : "button"}"
    >
    </hax-context-item>`;
  }
  /**
   * Remove asks once: the first click turns the button into
   * Confirm delete, the second removes the block
   */
  _removeTemplate() {
    return html`<hax-context-item
      action
      id="remove"
      icon="delete"
      ?confirm="${this._confirmRemove}"
      ?show-text-label="${this._confirmRemove}"
      ?disabled="${
        this.hasActiveEditingElement || this.viewSource || this.disableOps
      }"
      label="${this._confirmRemove ? this.t.confirmDelete : this.t.remove}"
      event-name="${
        this._confirmRemove ? "hax-plate-delete" : "hax-plate-delete-arm"
      }"
      @blur="${this._removeBlur}"
    >
    </hax-context-item>`;
  }
  _ceButtonsTemplate(inMenu = false) {
    return this.ceButtons.map((el) => {
      const item = html`<hax-context-item
        action
        icon="${el.icon}"
        label="${el.label}"
        event-name="hax-ce-custom-button"
        value="${el.callback}"
        ?disabled="${el.disabled || this.disableItemOps}"
        ?show-text-label="${inMenu}"
        align-horizontal="${inMenu ? "left" : "center"}"
        role="${inMenu ? "menuitem" : "button"}"
      ></hax-context-item>`;
      return inMenu
        ? html`<simple-toolbar-menu-item slot="menuitem"
            >${item}</simple-toolbar-menu-item
          >`
        : item;
    });
  }
  /**
   * Edit Mode, Modify HTML source, Lock content
   */
  _advancedTemplate(inMenu = false) {
    const wrap = (item) =>
      inMenu
        ? html`<simple-toolbar-menu-item slot="menuitem"
            >${item}</simple-toolbar-menu-item
          >`
        : item;
    return html`
      ${
        this.editElementProperty
          ? wrap(
              html`<hax-context-item
                action
                label="${this.t.editElement}"
                ?disabled="${this.viewSource || this.disableOps}"
                event-name="hax-edit-element-toggle"
                .eventData="${{
                  target: this.activeNode,
                  editMode: this.editElementProperty,
                }}"
                toggles
                ?toggled="${this.editElementToggled}"
                ?show-text-label="${inMenu}"
                align-horizontal="${inMenu ? "left" : "center"}"
                role="${inMenu ? "menuitem" : "button"}"
              ></hax-context-item>`,
            )
          : ""
      }
      ${wrap(
        html`<hax-context-item
          action
          icon="icons:code"
          label="${this.t.modifyHTMLSource}"
          ?disabled="${
            !this.sourceView || this.disableOps || this.editElementToggled
          }"
          event-name="hax-source-view-toggle"
          toggles
          ?toggled="${this.viewSource}"
          ?show-text-label="${inMenu}"
          align-horizontal="${inMenu ? "left" : "center"}"
          role="${inMenu ? "menuitem" : "button"}"
        ></hax-context-item>`,
      )}
      ${wrap(
        html`<hax-context-item
          action
          icon="${this.isLocked ? "icons:lock" : "icons:lock-open"}"
          label="${this.isLocked ? this.t.unlockContent : this.t.lockContent}"
          ?disabled="${this.viewSource}"
          @click="${this._toggleActiveNodeLock}"
          toggles
          ?toggled="${this.isLocked}"
          ?show-text-label="${inMenu}"
          align-horizontal="${inMenu ? "left" : "center"}"
          role="${inMenu ? "menuitem" : "button"}"
        ></hax-context-item>`,
      )}
    `;
  }
  /**
   * Show all tools / Show fewer tools
   */
  _sizeToggleTemplate() {
    const full = this.barSize === "full";
    return html`<hax-context-item
      action
      id="barsize"
      icon="${full ? "icons:unfold-less" : "icons:unfold-more"}"
      label="${full ? this.t.showFewerTools : this.t.showAllTools}"
      toggles
      ?toggled="${full}"
      event-name="hax-block-bar-size-toggle"
    ></hax-context-item>`;
  }
  render() {
    const novice = HAXStore.isPlatformAudience("novice");
    if (this.barSize === "full") {
      return html`
        <hax-toolbar
          always-expanded
          ?hidden=${novice && HAXStore.isTextElement(this.activeNode)}
        >
          <div class="group">
            ${this._dragTemplate()} ${this._moveTemplate()}
            ${this._selectLayoutTemplate()}
            <slot name="primary"></slot>
            ${this._insertTemplate()} ${this._duplicateTemplate()}
          </div>
          <div class="group">
            ${this._removeTemplate()} ${this._columnTemplate()}
            ${this._ceButtonsTemplate()}
            <slot name="secondary"></slot>
          </div>
          <div class="group" ?hidden="${novice}">
            ${this._advancedTemplate()}
            <slot name="more"></slot>
          </div>
          <div class="group">${this._sizeToggleTemplate()}</div>
        </hax-toolbar>
      `;
    }
    return html`
      <hax-toolbar
        always-expanded
        ?hidden=${novice && HAXStore.isTextElement(this.activeNode)}
      >
        <div class="group">${this._dragTemplate()} ${this._moveTemplate()}</div>
        <div class="group">
          <slot name="primary"></slot>
          ${this._insertTemplate()} ${this._layoutMenuTemplate()}
          ${this._removeTemplate()}
          <slot name="secondary"></slot>
        </div>
        <div class="group">
          <hax-toolbar-menu
            id="moremenu"
            action
            align-horizontal="left"
            icon="icons:more-vert"
            label="${this.t.more}"
            ?disabled="${this.disableOps}"
          >
            <simple-toolbar-menu-item slot="menuitem">
              ${this._duplicateTemplate(true)}
            </simple-toolbar-menu-item>
            ${this._ceButtonsTemplate(true)}
            ${novice ? "" : this._advancedTemplate(true)}
          </hax-toolbar-menu>
          <slot name="more"></slot>
          ${this._sizeToggleTemplate()}
        </div>
      </hax-toolbar>
    `;
  }
  _toggleBarSize() {
    this.dispatchEvent(
      new CustomEvent("hax-block-bar-size", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          size: this.barSize === "full" ? "compact" : "full",
        },
      }),
    );
  }
  _removeBlur() {
    this._confirmRemove = false;
  }

  /**
   * get a list of valid blocks for active node
   * (if active node is a slot, some blockes may not be permitted)
   *
   * @readonly
   * @returns {array}
   * @memberof HaxPlateContext
   */
  get filteredBlocks() {
    return this.getFilteredBlocks(this.formatBlocks);
  }

  __updatePlatePosition(active) {
    let right = this.shadowRoot.querySelector("#right");
    let rightremove = this.shadowRoot.querySelector("#rightremove");
    // support for enabling or disabling
    // @note this is a hacky way of evaluating this
    right.disabled = false;
    rightremove.disabled = false;
    if (active && active.tagName === "GRID-PLATE") {
      if (active.layout == "1-1-1-1") {
        right.disabled = true;
      }
    } else {
      rightremove.disabled = true;
    }
  }

  __dblClickFireInsert(event) {
    this.dispatchEvent(
      new CustomEvent("hax-context-item-selected", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          target: event.target,
          eventName: "insert-below-active",
        },
      }),
    );
  }
  handleCECustomEvent(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      // first click on Remove arms it; the second sends hax-plate-delete
      case "hax-plate-delete-arm":
        e.stopPropagation();
        this._confirmRemove = true;
        break;
      case "hax-plate-delete":
        this._confirmRemove = false;
        break;
      case "hax-block-bar-size-toggle":
        e.stopPropagation();
        this._toggleBarSize();
        break;
      case "hax-ce-custom-button":
        if (
          this.activeNode &&
          typeof this.activeNode[detail.value] === "function"
        ) {
          if (this.activeNode[detail.value](e)) {
            HAXStore.refreshActiveNodeForm();
          }
        }
        break;
    }
  }
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // Derive reactive state in willUpdate so it batches into the current
    // update cycle. Setting these in updated() scheduled a redundant second
    // update (Lit change-in-update warning).
    if (changedProperties.has("activeNode")) {
      this.isLocked = this._isNodeLocked(this.activeNode);
      this._confirmRemove = false;
    }
    if (
      changedProperties.has("activeNode") ||
      changedProperties.has("activeEditingElement")
    ) {
      this.activeSchema = HAXStore.activeSchema();
      this.editElementProperty =
        this.activeSchema && this.activeSchema.editElement
          ? this.activeSchema.editElement
          : false;
      this.editElementToggled =
        this.activeNode &&
        this.editElementProperty &&
        !!this.activeNode[this.editElementProperty];
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "onScreen" && this.onScreen) {
        this._resetCEMenu();
      }
    });
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeNode);
      const _mobx_val_1 = toJS(HAXStore.editMode);
      Promise.resolve().then(() => {
        this.activeNode = _mobx_val_0;
        if (this.activeNode && this.activeNode.classList) {
          this._resetCEMenu();
        }
        // if active, and we are editing, then make suree plate ops match expectation
        if (this.activeNode && _mobx_val_1) {
          setTimeout(() => {
            this.__updatePlatePosition(this.activeNode);
          }, 0);
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeEditingElement);
      Promise.resolve().then(() => {
        if (_mobx_val_0) {
          this.hasActiveEditingElement = true;
        } else {
          this.hasActiveEditingElement = false;
        }
      });
    });
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  _dragEnd(e) {
    let menu = normalizeEventPath(e) ? normalizeEventPath(e)[0] : undefined;
    if (menu) menu.close(true);
    HAXStore._lockContextPosition = false;
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    let target = toJS(HAXStore.activeNode),
      menu = normalizeEventPath(e) ? normalizeEventPath(e)[0] : undefined;
    if (menu) menu.close(true);
    HAXStore.__dragTarget = target;
    HAXStore._lockContextPosition = true;
    // wipe the add context menu for motion
    HAXStore.activeHaxBody.__activeHover = null;
    HAXStore.activeHaxBody._hideContextMenu(
      HAXStore.activeHaxBody.contextMenus.add,
    );
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setDragImage(target, -20, -20);
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  /**
   * HAX properties changed, update buttons available.
   */
  async _resetCEMenu() {
    if (this.shadowRoot) {
      wipeSlot(this, "*");
    }
    // reset buttons in-case this element has new ones
    this.ceButtons = [];
    if (HAXStore.activeHaxBody && this.activeNode != null) {
      let schema = HAXStore.haxSchemaFromTag(this.activeNode.tagName);
      this.sourceView = schema.canEditSource;
      if (HAXStore.activeGizmo) {
        this.activeTagName = HAXStore.activeGizmo.title;
        this.activeTagIcon = HAXStore.activeGizmo.icon;
      }
    } else if (HAXStore.activeGizmo) {
      this.activeTagName = HAXStore.activeGizmo.title;
      this.activeTagIcon = HAXStore.activeGizmo.icon;
    } else {
      this.activeTagName = "";
      this.activeTagIcon = "";
    }
    // @see haxHook inlineContextMenu
    await HAXStore.runHook(this.activeNode, "inlineContextMenu", [this]);
  }
  _isNodeLocked(node) {
    if (!node || !node.getAttribute) {
      return false;
    }
    if (node.getAttribute("data-hax-lock") != null) {
      return true;
    }
    if (
      node.parentNode &&
      node.parentNode.getAttribute &&
      node.parentNode.getAttribute("data-hax-lock") != null
    ) {
      return true;
    }
    return false;
  }
  _toggleActiveNodeLock(e) {
    if (!this.activeNode || !this.activeNode.getAttribute) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const node = this.activeNode;
    let locked = node.getAttribute("data-hax-lock") != null;
    if (locked) {
      node.removeAttribute("data-hax-lock");
      locked = false;
    } else {
      node.setAttribute("data-hax-lock", "data-hax-lock");
      locked = true;
    }
    this.isLocked = locked;
    this.dispatchEvent(
      new CustomEvent("hax-toggle-active-node-lock", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          lock: locked,
          node: node,
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
      activeTagIcon: {
        type: String,
      },
      activeSchema: {
        type: Object,
      },
      editElementProperty: {
        type: String,
      },
      editElementToggled: {
        type: Boolean,
      },
      activeTagName: {
        type: String,
      },
      disableOps: {
        type: Boolean,
      },
      disableItemOps: {
        type: Boolean,
      },
      insertAbove: {
        type: Boolean,
      },
      disableDuplicate: {
        type: Boolean,
      },
      canMoveElement: {
        type: Boolean,
      },
      ceButtons: {
        type: Array,
      },
      hasActiveEditingElement: {
        type: Boolean,
      },
      onScreen: {
        type: Boolean,
        attribute: "on-screen",
        reflect: true,
      },
      sourceView: {
        type: Boolean,
      },
      isLocked: {
        type: Boolean,
      },
      /**
       * "compact" (one row) or "full" (every tool)
       */
      barSize: {
        type: String,
        attribute: "bar-size",
        reflect: true,
      },
      _confirmRemove: {
        type: Boolean,
        state: true,
      },
    };
  }
}
globalThis.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
