import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
/**
 * `hax-plate-context`
 * `A context menu that provides common grid plate based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 * - grid plate - the container / full HTML tag which can have operations applied to it.
 */
class HaxPlateContext extends winEventsElement(HTMLElement) {
  constructor(delayRender = false) {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    // set tag for later use
    this.tag = HaxPlateContext.tag;
    this.template = document.createElement("template");
    this.attachShadow({ mode: "open" });
    if (!delayRender) {
      this.render();
    }
    setTimeout(() => {
      import("@polymer/paper-item/paper-item.js");
      import("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");
      import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
    }, 0);
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
    }
    .area {
      opacity: 1;
    }
    .paddle {
      width: unset;
      height: unset;
      visibility: visible;
      opacity: .9;
    }
    .paddle:hover {
      opacity: 1;
    }
    paper-item {
      background-color: var(--hax-contextual-action-color);
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
      height: 24px;
      padding: 0 4px;
      min-height: 24px;
      font-size: 10px;
      color: white;
    }
    #drag hax-context-item:hover,
    paper-item:hover {
      cursor: pointer;
      color: black;
    }
    iron-icon {
      padding: 0 2px;
      width: 16px;
      height: 16px;
    }
    </style>
    <div class="area" id="area">
      <hax-context-item-menu
        mini
        id="drag"
        action
        icon="hax:arrow-all"
        label="Drag"
        draggable="true"
        selected-value="0"
        reset-on-select>
      <hax-context-item
        action
        mini
        icon="hardware:keyboard-arrow-up"
        label="Move up"
        event-name="hax-plate-up"
        direction="left"
        ></hax-context-item>
      <hax-context-item
        action
        mini
        icon="hardware:keyboard-arrow-down"
        label="Move down"
        event-name="hax-plate-down"
        direction="left"
        ></hax-context-item>
    </hax-context-item-menu>
      <hax-context-item
      mini
      action
      id="right"
      class="paddle"
      icon="hax:table-column-remove"
      label="Add column"
      event-name="hax-plate-create-right"
    ></hax-context-item>
    <hax-context-item
      mini
      action
      class="paddle"
      icon="hax:table-column-plus-after"
      label="Remove column"
      event-name="hax-plate-remove-right"
      id="rightremove"
    ></hax-context-item>
  <hax-context-item
    mini
    action
    label="Duplicate"
    icon="icons:content-copy"
    event-name="hax-plate-duplicate"
    ></hax-context-item>
  <hax-context-item
    mini
    action
    icon="delete"
    label="Remove"
    event-name="hax-plate-delete"
  ></hax-context-item>
  </div>
  `;
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    setTimeout(() => {
      if (
        e.detail &&
        typeof e.detail.value !== typeof undefined &&
        e.detail.property &&
        this.getAttribute("on-screen") != null &&
        ["activeNode", "activeContainerNode"].includes(e.detail.property)
      ) {
        // when activeNode changes make sure we reposition
        this.__updatePlatePosition();
      }
    }, 10);
  }
  __updatePlatePosition() {
    setTimeout(() => {
      let active = window.HaxStore.instance.activeNode;
      let right = this.shadowRoot.querySelector("#right");
      let rightremove = this.shadowRoot.querySelector("#rightremove");
      if (window.HaxStore.instance.activeContainerNode) {
        active = window.HaxStore.instance.activeContainerNode;
      }
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
    }, 100);
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
    setTimeout(() => {
      this.shadowRoot
        .querySelector("#drag")
        .addEventListener("dragstart", this._dragStart);
      this.shadowRoot
        .querySelector("#drag")
        .addEventListener("dragend", this._dragEnd);
    }, 0);
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
    let children = window.HaxStore.instance.activeHaxBody.children;
    // walk the children and apply the draggable state needed
    for (var i in children) {
      if (typeof children[i].classList !== typeof undefined) {
        children[i].classList.remove(
          "mover",
          "hovered",
          "moving",
          "grid-plate-active-item"
        );
        children[i].removeEventListener("click", this._clickPlace);
      }
    }
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    let target = window.HaxStore.instance.activeNode;
    window.HaxStore.instance.__dragTarget = target;
    target.classList.add("moving");
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setDragImage(target, 0, 0);
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
    setTimeout(() => {
      // show where things can be dropped only during the drag
      if (
        !window.HaxStore.instance.activeHaxBody.openDrawer &&
        window.HaxStore.instance.editMode
      ) {
        let children = window.HaxStore.instance.activeHaxBody.children;
        // walk the children and apply the draggable state needed
        for (var i in children) {
          if (children[i].classList && target !== children[i]) {
            children[i].classList.add("mover");
            children[i].addEventListener("click", this._clickPlace);
          }
        }
      }
    }, 10);
  }
}
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
