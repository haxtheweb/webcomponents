import { SimpleTourFinder } from "@lrnwebcomponents/simple-popover/lib/SimpleTourFinder";
import { HAXStore } from "./hax-store.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
import { autorun, toJS } from "mobx";
/**
 * `hax-plate-context`
 * `A context menu that provides common grid plate based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 * - grid plate - the container / full HTML tag which can have operations applied to it.
 */
class HaxPlateContext extends SimpleTourFinder(HTMLElement) {
  constructor(delayRender = false) {
    super();
    this.haxUIElement = true;
    this.tourName = "hax";
    // set tag for later use
    this.tag = HaxPlateContext.tag;
    this.template = document.createElement("template");
    this.attachShadow({ mode: "open" });
    if (!delayRender) {
      this.render();
    }
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
      this.render();
    });
  }
  static get tag() {
    return "hax-plate-context";
  }
  get html() {
    return `
    <style>
    :host {
      display: block;
      margin-top: -2px;
      background-color:white;
    }
    hax-context-item {
      display: block;
    }
    hax-context-item[large] {
      display: inline-block;
      margin:0;
      padding:0;
    }
    hax-context-item-menu {
      --hax-context-item-menu-height: 28px;
    }
    .area {
      display: flex;
      visibility: visible;
      opacity: .8;
      transition: .2s all ease-in-out;
    }
    .area:hover {
      opacity: 1;
    }
    button {
      width: 100%;
      text-align: left;
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
      height: 32px;
      padding: 4px;
      margin: 0;
      border-radius: 0;
      display: block;
      overflow: hidden;
      min-height: 24px;
      font-size: 10px;
      color: black;
    }
    #drag hax-context-item:hover,
    button:hover {
      cursor: pointer;
    }
    simple-icon {
      padding: 0 2px;
      --simple-icon-height: 16px;
      --simple-icon-width: 16px;
    }
    :host(.hax-context-pin-top) .area {
      position: fixed;
      top: 28px;
      margin-left: -2px;
      flex-direction: column;
    }
    </style>
    <div class="area" id="area">
      <hax-context-item-menu
        mini
        ${this.hasActiveEditingElement ? `disabled` : ``}
        id="drag"
        action
        icon="hax:arrow-all"
        label="Drag handle"
        draggable="true"
        selected-value="0"
        reset-on-select
        data-simple-tour-stop
        data-stop-title="label">
        <hax-context-item
          action
          mini
          dark
          ${this.hasActiveEditingElement ? `disabled` : ``}
          simple
          icon="hax:keyboard-arrow-up"
          label="Move up"
          event-name="hax-plate-up"
          direction="left"
          ></hax-context-item>
        <hax-context-item
          action
          mini
          dark
          ${this.hasActiveEditingElement ? `disabled` : ``}
          simple
          icon="hax:keyboard-arrow-down"
          label="Move down"
          event-name="hax-plate-down"
          direction="left"
          ></hax-context-item>
        <div slot="tour" data-stop-content>
          Click the drag handle once to show a menu to just move
          up or down one item in the content OR click and drag
          to place the item exactly where you want it to go.
        </div>
      </hax-context-item-menu>
      <hax-context-item
        mini
        action
        id="right"
        class="paddle"
        icon="hax:table-column-remove"
        label="Add column"
        ${this.hasActiveEditingElement ? `disabled` : ``}
        event-name="hax-plate-create-right"
        data-simple-tour-stop
        data-stop-title="label"
      >
      <div slot="tour" data-stop-content>
      Add a column to split the current column into two pieces. This can be done up to
      six pieces columns. For differnet layouts see Grid settings panel.
      </div>
    </hax-context-item>
    <hax-context-item
      mini
      action
      class="paddle"
      icon="hax:table-column-plus-after"
      label="Remove column"
      ${this.hasActiveEditingElement ? `disabled` : ``}
      event-name="hax-plate-remove-right"
      id="rightremove"
      data-simple-tour-stop
      data-stop-title="label"
    >
    <div slot="tour" data-stop-content>
      Remove a column from the split column layout. If at two columns and removing it will
      remove the layout split and make it 100% width.
    </div>
    </hax-context-item>
  <hax-context-item
    mini
    action
    ${this.hasActiveEditingElement ? `disabled` : ``}
    label="Duplicate"
    icon="icons:content-copy"
    event-name="hax-plate-duplicate"
    data-simple-tour-stop
    data-stop-title="label"
    >
    <div slot="tour" data-stop-content>
      Duplicate the active piece of content and place it below the current item.
    </div>
    </hax-context-item>
  <hax-context-item
    mini
    danger
    action
    ${this.hasActiveEditingElement ? `disabled` : ``}
    icon="delete"
    label="Remove"
    event-name="hax-plate-delete"
    data-simple-tour-stop
    data-stop-title="label"
  >
  <div slot="tour" data-stop-content>
      Delete the current item. You can always use the undo arrow to bring this back.
    </div>
  </hax-context-item>
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
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot
      .querySelector("#drag")
      .addEventListener("dragstart", this._dragStart);
    this.shadowRoot
      .querySelector("#drag")
      .addEventListener("dragend", this._dragEnd);
  }
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#drag")
      .removeEventListener("dragstart", this._dragStart);
    this.shadowRoot
      .querySelector("#drag")
      .removeEventListener("dragend", this._dragEnd);
    super.disconnectedCallback();
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  _dragEnd(e) {
    HAXStore._lockContextPosition = false;
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    let target = toJS(HAXStore.activeNode);
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
}
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
