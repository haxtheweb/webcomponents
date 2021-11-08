import { LitElement, css, html } from "lit";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu-item.js";
import { HAXStore } from "./hax-store.js";
import "./hax-toolbar-menu.js";
import "./hax-toolbar.js";
import "./hax-context-item.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils";
import { autorun, toJS } from "mobx";
import { HaxContextBehaviors } from "./hax-context-behaviors.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import { SimpleToast } from "@lrnwebcomponents/simple-toast/simple-toast";

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
    this.hasActiveEditingElement = false;
    this.haxUIElement = true;
    this.tourName = "hax";
    this.trayDetail = "content-edit";
    this.trayStatus = "collapsed";
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
      modifyHTMLSource: "Modify HTML source",
      clickToChange: "Click to change",
      regions: "Available regions",
      insertItemAbove: "Insert item above",
      insertItemAboveOrBelow: "Insert item above or below",
      insertItemBelow: "Insert item below",
      selectLayout: "Select Layout Element",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    //this.onScreen = false;
    this.ceButtons = [];
    this.activeTagName = "";
    this.activeTagIcon = "hax:paragraph";
    this.addEventListener(
      "hax-context-item-selected",
      this.handleCECustomEvent.bind(this)
    );
  }
  static get tag() {
    return "hax-plate-context";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          width: calc(100% - 2px);
          align-items: stretch;
          border: 1px solid var(--hax-ui-border-color);
        }
        hax-toolbar::part(morebutton) {
          --simple-toolbar-button-color: var(--hax-ui-color);
          --simple-toolbar-button-bg: var(--hax-ui-background-color);
          --simple-toolbar-button-border-color: var(--hax-ui-border-color);
          --simple-toolbar-button-border-width: 1px;
          --simple-toolbar-button-hover-color: var(--hax-ui-color);
          --simple-toolbar-button-hover-bg: var(
            --hax-ui-background-color-secondary
          );
          --simple-toolbar-button-toggled-color: var(--hax-ui-color-accent);
          --simple-toolbar-button-toggled-bg: var(--hax-ui-background-color);
          --simple-toolbar-button-toggled-border-color: var(
            --hax-ui-color-accent
          );
          --simple-toolbar-button-disabled-opacity: 1;
          --simple-toolbar-button-disabled-color: var(--hax-ui-disabled-color);
          --simple-toolbar-button-disabled-bg: var(--hax-ui-background-color);
          --simple-toolbar-button-disabled-border-color: unset;
          --simple-toolbar-border-radius: 0;
          align-self: flex-end;
          justify-self: stretch;
          margin: 0px -2px 0px 2px;
        }
        #remove {
          max-width: 44px;
          overflow: visible;
        }
        hax-toolbar {
          max-width: calc(100% - 2px);
          display: flex;
          align-items: stretch;
          justify-content: flex-start;
        }
        .group {
          display: flex;
          align-items: stretch;
          flex: 0 0 auto;
          justify-content: center;
          border: 1px solid var(--rich-text-editor-border-color, #ddd);
          padding: 0;
          border-width: 1px;
          margin: -1px;
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
        .first-slot {
          border-top: 1px solid black;
        }
      `,
    ];
  }
  render() {
    return html`
      <hax-toolbar>
        <div class="group">
          <hax-toolbar-menu
            ?disabled="${
              this.hasActiveEditingElement ||
              !this.canMoveElement ||
              this.viewSource
            }"
            id="drag"
            action
            icon="hax:arrow-all"
            label="${this.t.dragHandle}"
            draggable="true"
            reset-on-select
            data-simple-tour-stop
            data-stop-title="label"
            ?hidden="${!this.canMoveElement}"
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
            ${(this.siblingSlots || []).map(
              (slot, i) => html`
                <simple-toolbar-menu-item
                  slot="menuitem"
                  class="move-to-slot ${i < 1 ? "first-slot" : ""}"
                >
                  <hax-context-item
                    action
                    align-horizontal="left"
                    ?disabled="${this.activeNode &&
                    slot.slot === this.activeNode.slot}"
                    show-text-label
                    role="menuitem"
                    data-slot="${slot.slot}"
                    event-name="move-to-slot"
                    label="${slot.title || slot.slot}"
                  ></hax-context-item>
                </simple-toolbar-menu-item>
              `
            )}
            <div slot="tour" data-stop-content>
              Click the drag handle once to show a menu to just move up or down
              one item in the content OR click and drag to place the item
              exactly where you want it to go.
            </div>
          </hax-toolbar-menu>
          <hax-toolbar-menu
            action
            align-horizontal="left"
            ?disabled="${this.viewSource}"
            icon="hax:select-element"
            label="${this.t.selectLayout} ${
      !this.activeNode ? "" : this.activeNode.tagName
    }"
          >
            <simple-toolbar-menu-item slot="menuitem">
              <hax-context-item
                action
                align-horizontal="left"
                ?disabled="${this.viewSource}"
                ?hidden="${!this.isGridLayoutSlot}"
                .icon="${this.gridIcon}"
                label="${this.gridLabel}"
                event-name="hax-select-grid"
                .eventData="${
                  !this.isGridLayoutSlot
                    ? undefined
                    : this.activeNode.parentNode
                }"
                role="menuitem"
                show-text-label
              >
              </hax-context-item>
            </simple-toolbar-menu-item>
            ${(this.slottedItems || []).map((slot, i) =>
              slot.items.map(
                (item, j) =>
                  html`
                    <simple-toolbar-menu-item slot="menuitem">
                      <hax-context-item
                        action
                        align-horizontal="left"
                        ?disabled="${this.viewSource ||
                        this.activeNode === item}"
                        label="${slot.label}${slot.items.length > 1
                          ? ` (${j + 1})`
                          : ""}"
                        event-name="hax-select-grid-item"
                        .eventData="${{
                          target: item,
                          grid: slot.grid,
                          editMode: slot.editMode,
                        }}"
                        role="menuitem"
                        show-text-label
                        @click="${this.checkEditMode}"
                      >
                      </hax-context-item>
                    </simple-toolbar-menu-item>
                  `
              )
            )}
            
          </hax-toolbar-menu>
          <slot name="primary"></slot>
          <hax-toolbar-menu
            icon="add-box"
            label="${this.t.insertItemAboveOrBelow}"
            ?disabled="${this.viewSource}"
          >
            <simple-toolbar-menu-item slot="menuitem">
              <hax-context-item
                action
                align-horizontal="left"
                show-text-label
                role="menuitem"
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
            ${(this.childSlots || []).map(
              (slot, i) => html`
                <simple-toolbar-menu-item
                  slot="menuitem"
                  class="move-to-slot ${i < 1 ? "first-slot" : ""}"
                >
                  <hax-context-item
                    action
                    align-horizontal="left"
                    ?disabled="${this.activeNode &&
                    slot.slot === this.activeNode.slot}"
                    show-text-label
                    role="menuitem"
                    event-name="insert-into-active"
                    data-slot="${slot.slot}"
                    label="${slot.title || slot.slot}"
                  ></hax-context-item>
                </simple-toolbar-menu-item>
              `
            )}
          </hax-toolbar-menu>
          <hax-context-item
            action
            ?disabled="${this.hasActiveEditingElement || this.viewSource}"
            label="${this.t.duplicate}"
            icon="icons:content-copy"
            event-name="hax-plate-duplicate"
            data-simple-tour-stop
            data-stop-title="label"
          >
            <div slot="tour" data-stop-content>
              Duplicate the active piece of content and place it below the
              current item.
            </div>
          </hax-context-item>
        </div>
        <hax-context-item
          action
          icon="delete"
          ?disabled="${this.hasActiveEditingElement || this.viewSource}"
          icon="delete"
          label="${this.t.remove}"
          event-name="hax-plate-delete"
          data-simple-tour-stop
          data-stop-title="label"
      >
          <div slot="tour" data-stop-content>
            Delete the current item. You can always use the undo arrow to
            bring this back.
          </div>
        </hax-context-item>
          ${this.ceButtons.map((el) => {
            return html` <hax-context-item
              action
              icon="${el.icon}"
              label="${el.label}"
              event-name="hax-ce-custom-button"
              value="${el.callback}"
              ?disabled="${this.viewSource}"
            ></hax-context-item>`;
          })}
          <hax-context-item
            action
            id="right"
            class="paddle"
            icon="hax:table-column-remove"
            label="${this.t.addColumn}"
            ?disabled="${this.hasActiveEditingElement || this.viewSource}"
            event-name="hax-plate-create-right"
            data-simple-tour-stop
            data-stop-title="label"
          >
            <div slot="tour" data-stop-content>
              Add a column to split the current column into two pieces. This can
              be done up to six pieces columns. For differnet layouts see Grid
              settings panel.
            </div>
          </hax-context-item>
          <hax-context-item
            action
            class="paddle"
            icon="hax:table-column-plus-after"
            label="${this.t.removeColumn}"
            ?disabled="${this.hasActiveEditingElement || this.viewSource}"
            event-name="hax-plate-remove-right"
            ?hidden="${!this.isGridPlate()}"
            id="rightremove"
            data-simple-tour-stop
            data-stop-title="label"
          >
            <div slot="tour" data-stop-content>
              Remove a column from the split column layout. If at two columns
              and removing it will remove the layout split and make it 100%
              width.
            </div>
          </hax-context-item>
          <slot name="secondary"></slot>
        </div>
        <div class="group">
          <hax-context-item
            action
            more
            label="${this.t.changeTo}..."
            tooltip="${this.activeTagName}, ${this.t.clickToChange}"
            ?disabled="${this.disableTransform || this.viewSource}"
            event-name="hax-transform-node"
          ></hax-context-item>
          <hax-context-item
            action
            icon="icons:code"
            label="${this.t.modifyHTMLSource}"
            ?disabled="${!this.sourceView}"
            event-name="hax-source-view-toggle"
            toggles
            ?toggled="${this.viewSource}"
          ></hax-context-item>
          <slot name="more"></slot>
          <hax-context-item
            icon="build"
            action
            align-horizontal="left"
            ?disabled="${this.hasActiveEditingElement || this.viewSource}"
            label="${this.t.edit}"
            data-simple-tour-stop
            data-stop-title="label"
            event-name="content-edit"
            toggles
            ?toggled="${
              this.trayDetail === "content-edit" &&
              this.trayStatus !== "collapsed"
            }"
          >
            <div slot="tour" data-stop-content>
              Opens the Edit panel for more advanced settings.
            </div>
          </hax-context-item>
        </div>
      </hax-toolbar>
    `;
  }
  get gridEventData() {
    let target = this.isGridLayoutSlot ? undefined : this.activeNode.parentNode;
    return {
      target: target,
    };
  }

  get childSlots() {
    let oldGrid = this.isGridPlate(),
      selfSchema = this.activeNode
        ? HAXStore.haxSchemaFromTag(this.activeNode.tagName)
        : undefined;
    return oldGrid
      ? this.gridPlateSlots(this.activeNode.layout)
      : HAXStore.isGridPlateElement(this.activeNode)
      ? HAXStore.slotsFromSchema(selfSchema || {})
      : [];
  }
  get siblingSlots() {
    if (!this.activeNode || !this.activeNode.parentNode) return [];
    let oldGrid = this.isGridPlate(this.activeNode.parentNode);
    return oldGrid
      ? this.gridPlateSlots(this.activeNode.parentNode.layout)
      : HAXStore.isGridPlateElement(this.activeNode.parentNode)
      ? HAXStore.slotsFromSchema(this.parentSchema || {})
      : [];
  }

  getEditMode(node) {
    if (!!node) {
      let schema = HAXStore.haxSchemaFromTag(node.tagName),
        editMode = schema.editMode;
      return editMode;
    } else {
      return undefined;
    }
  }

  getSlottedItems(parentNode, slots = []) {
    return !parentNode
      ? []
      : slots.map((slot) => {
          return {
            slot: slot.slot,
            editMode: {
              ...(parentNode.editMode || {}),
              ...(slot.editMode || {}),
            },
            grid: parentNode,
            label: slot.title || slot.slot,
            items:
              slot.slot !== ""
                ? [...parentNode.querySelectorAll(`[slot=${slot.slot}]`)]
                : [...parentNode.children].filter(
                    (child) => !child.matches("[slot]")
                  ),
          };
        });
  }

  get slottedItems() {
    if (!this.activeNode) return [];
    let slots = HAXStore.isGridPlateElement(this.activeNode)
        ? this.childSlots
        : this.siblingSlots,
      target = HAXStore.isGridPlateElement(this.activeNode)
        ? this.activeNode
        : this.activeNode.parentNode;
    return this.getSlottedItems(target, slots);
  }

  get gridIcon() {
    return this.gridProperties ? this.gridProperties.icon : undefined;
  }

  get gridLabel() {
    return this.gridProperties
      ? this.gridProperties.title || this.gridProperties.tag
      : "";
  }

  get gridProperties() {
    return this.isGridLayoutSlot && this.parentSchema.gizmo
      ? this.parentSchema.gizmo
      : undefined;
  }

  get filteredBlocks() {
    return this.getFilteredBlocks(this.formatBlocks);
  }

  get isGridLayoutSlot() {
    if (!this.activeNode || !this.activeNode.parentNode) return false;
    return HAXStore.isGridPlateElement(this.activeNode.parentNode);
  }

  isGridPlate(node = this.activeNode) {
    return node && node.tagName && node.tagName === "GRID-PLATE";
  }

  gridPlateSlots(layout = "1-1-1-1-1-1") {
    let slotConfig = (num) => {
        let slot = `col-${num}`,
          label = `Column ${num}`,
          config = {
            slot: slot,
            title: label,
            excludedSlotWrappers: ["grid-plate"],
          };
        return config;
      },
      slots = layout.split("-");
    slots = slots.map((col, num) => slotConfig(num + 1));
    return slots;
  }
  __updatePlatePosition(active) {
    let right = this.shadowRoot.querySelector("#right");
    let rightremove = this.shadowRoot.querySelector("#rightremove");
    // support for enabling or disabling
    right.disabled = false;
    rightremove.disabled = false;
    if (active && active.tagName == "GRID-PLATE") {
      if (active.layout == "1-1-1-1-1-1") {
        right.disabled = true;
      }
    } else {
      rightremove.disabled = true;
    }
  }

  __dblClickFire(event) {
    if (event.target.id === "remove") {
      this.dispatchEvent(
        new CustomEvent("hax-context-item-selected", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            target: event.target,
            eventName: "hax-plate-delete",
            value: event.target.value,
          },
        })
      );
    }
  }
  _handleOpen(e) {
    this.dispatchEvent(
      new CustomEvent("hax-transform-node", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: HAXStore.elementList[el],
      })
    );
  }
  handleCECustomEvent(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
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
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "onScreen" && this.onScreen) {
        this._resetCEMenu();
      }
      if (propName === "formatBlocks")
        this.disableTransform = this.filteredBlocks.length < 1;
    });
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    autorun(() => {
      this.activeNode = toJS(HAXStore.activeNode);
      if (this.activeNode && this.activeNode.classList) {
        this._resetCEMenu();
      }
      if (this.activeNode && this.getAttribute("on-screen")) {
        this.__updatePlatePosition(this.activeNode);
      }
    });
    autorun(() => {
      if (toJS(HAXStore.activeEditingElement)) {
        this.hasActiveEditingElement = true;
      } else {
        this.hasActiveEditingElement = false;
      }
    });
    this.shadowRoot
      .querySelector("#drag")
      .addEventListener("dragstart", this._dragStart);
    this.shadowRoot
      .querySelector("#drag")
      .addEventListener("dragend", this._dragEnd);
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
      HAXStore.activeHaxBody.contextMenus.add
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
      if (this.activeNode) {
        // detect if this can be transformed into anything else
        let elements =
            (await HAXStore.activeHaxBody.replaceElementWorkflow(
              this.activeNode,
              true
            )) || [],
          tag =
            !!this.activeNode && !!this.activeNode.tagName
              ? this.activeNode.tagName.toLowerCase()
              : undefined,
          primTag = HAXStore.activeHaxBody.primitiveTextBlocks.includes(tag)
            ? "p"
            : undefined;
        this.formatBlocks = !!tag
          ? elements.filter((el) => el.tag && ![tag, primTag].includes(el.tag))
          : elements;
        this.disableTransform = this.filteredBlocks.length === 0 ? true : false;
      }
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
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      activeTagIcon: {
        type: String,
      },
      activeTagName: {
        type: String,
      },
      canMoveElement: {
        type: Boolean,
      },
      ceButtons: {
        type: Array,
      },
      disableTransform: {
        type: Boolean,
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
      formatBlocks: {
        type: Array,
      },
      /**
       * is hax tray collapsed, side-panel, or full-panel
       */
      trayDetail: {
        type: String,
        reflect: true,
        attribute: "tray-detail",
      },
      /**
       * is hax tray collapsed, side-panel, or full-panel
       */
      trayStatus: {
        type: String,
        reflect: true,
        attribute: "tray-status",
      },
    };
  }
}
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
