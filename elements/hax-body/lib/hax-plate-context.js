import { LitElement, css, html } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu-item.js";
import { HAXStore } from "./hax-store.js";
import "./hax-toolbar-menu.js";
import "./hax-context-item.js";
import { autorun, toJS } from "mobx";
import { HaxContextBehaviors } from "./hax-context-container.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
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
    this.t = {
      dragHandle: "Drag handle",
      moveUp: "Move up",
      moveDown: "Move down",
      addColumn: "Add column",
      removeColumn: "Remove column",
      remove: "Remove",
      duplicate: "Duplicate",
      confirmDelete: "Confirm delete",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
  }
  static get tag() {
    return "hax-plate-context";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          width: 176px;
        }
        hax-toolbar {
          flex: 0 0 auto;
        }
        #remove {
          max-width: 44px;
          overflow: visible;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="toolbar" class="area">
        <hax-toolbar always-expanded>
          <div class="group">
            <hax-toolbar-menu
              ?disabled="${this.hasActiveEditingElement}"
              id="drag"
              action
              icon="hax:arrow-all"
              label="${this.t.dragHandle}"
              draggable="true"
              reset-on-select
              data-simple-tour-stop
              data-stop-title="label"
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
              <div slot="tour" data-stop-content>
                Click the drag handle once to show a menu to just move up or
                down one item in the content OR click and drag to place the item
                exactly where you want it to go.
              </div>
            </hax-toolbar-menu>
          </div>
          <div class="group">
            <hax-context-item
              action
              id="right"
              class="paddle"
              icon="hax:table-column-remove"
              label="${this.t.addColumn}"
              ?disabled="${this.hasActiveEditingElement}"
              event-name="hax-plate-create-right"
              data-simple-tour-stop
              data-stop-title="label"
            >
              <div slot="tour" data-stop-content>
                Add a column to split the current column into two pieces. This
                can be done up to six pieces columns. For differnet layouts see
                Grid settings panel.
              </div>
            </hax-context-item>
            <hax-context-item
              action
              class="paddle"
              icon="hax:table-column-plus-after"
              label="${this.t.removeColumn}"
              ?disabled="${this.hasActiveEditingElement}"
              event-name="hax-plate-remove-right"
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
            <hax-context-item
              action
              ?disabled="${this.hasActiveEditingElement}"
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
          <div class="group">
            <hax-toolbar-menu
              id="remove"
              action
              ?disabled="${this.hasActiveEditingElement}"
              icon="delete"
              label="${this.t.remove}"
              reset-on-select
              data-simple-tour-stop
              data-stop-title="label"
            >
              <simple-toolbar-menu-item slot="menuitem">
                <hax-context-item
                  action
                  danger
                  align-horizontal="left"
                  ?disabled="${this.hasActiveEditingElement}"
                  show-text-label
                  role="menuitem"
                  icon="delete"
                  label="${this.t.confirmDelete}"
                  event-name="hax-plate-delete"
                ></hax-context-item>
              </simple-toolbar-menu-item>
              <div slot="tour" data-stop-content>
                Delete the current item. You can always use the undo arrow to
                bring this back.
              </div>
            </hax-toolbar-menu>
          </div>
        </hax-toolbar>
      </div>
    `;
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

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    autorun(() => {
      const activeNode = toJS(HAXStore.activeNode);
      if (activeNode && this.getAttribute("on-screen")) {
        this.__updatePlatePosition(activeNode);
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
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      hasActiveEditingElement: {
        type: Boolean,
      },
    };
  }
}
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
