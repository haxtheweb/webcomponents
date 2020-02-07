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
      import("@lrnwebcomponents/hax-iconset/hax-iconset.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/iron-icons/hardware-icons.js");
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
      color: white;
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
      height: 24px;
      padding: 0 4px;
      min-height: 24px;
      font-size: 10px;
    }
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
      <hax-context-item
        large
        action
        icon="hardware:keyboard-arrow-up"
        label="Move up"
        event-name="hax-plate-up"
        direction="left"
      ></hax-context-item>
      <hax-context-item
        id="drag"
        large
        action
        icon="editor:drag-handle"
        label="Drag"
        draggable="true"
        direction="left"
      ></hax-context-item>
      <hax-context-item
        large
        action
        icon="hardware:keyboard-arrow-down"
        label="Move down"
        event-name="hax-plate-down"
        direction="left"
      ></hax-context-item>
      <hax-context-item
      action
      large
      id="right"
      class="paddle"
      icon="icons:add"
      label="Add column"
      event-name="hax-plate-create-right"
      direction="left"
    ></hax-context-item>
    <hax-context-item
      action
      large
      class="paddle"
      icon="icons:remove"
      label="Remove column"
      event-name="hax-plate-remove-right"
      direction="left"
      id="rightremove"
    ></hax-context-item>
    <hax-context-item
    action
    large
    icon="hax:bricks"
    label="Change type"
    event-name="hax-plate-convert"
  ></hax-context-item>
  <hax-context-item
    action
    large
    icon="delete"
    label="Remove"
    event-name="hax-plate-delete"
  ></hax-context-item>
  <hax-context-item
      action
      large
      label="Duplicate"
      icon="icons:content-copy"
      event-name="hax-plate-duplicate"
      ></hax-context-item>
    
      <hax-context-item-menu
      action
      large
      id="rightadd"
      class="paddle"
      icon="hax:add-brick"
      label="Insert new.."
      event-name="hax-plate-add-element"
      direction="left"
      selected-value="0"
      reset-on-select
    >
    <paper-item value="" hidden></paper-item>
      <paper-item value='{"tag":"p","content":"", "properties": {}}'>
        <iron-icon icon="hax:paragraph"></iron-icon>Paragraph
      </paper-item>
      <paper-item value='{"tag":"h2","content":"Heading", "properties": {}}'>
        <iron-icon icon="hax:h2"></iron-icon>Heading
      </paper-item>
      <paper-item value='{"tag":"ul","content":"<li>List</li>", "properties": {}}'>
        <iron-icon icon="editor:format-list-bulleted"></iron-icon>Bulleted list
      </paper-item>
      <paper-item value='{"tag":"hr","content":"", "properties": {}}'>
        <iron-icon icon="hax:hr"></iron-icon>Horizontal line
      </paper-item>
      <paper-item value='{"tag":"place-holder","content":"", "properties": {"type": "image", "text": "Image"}}'>
        <iron-icon icon="hax:placeholder"></iron-icon>Image placeholder
      </paper-item>
      <paper-item value='other'>
        <iron-icon icon="hax:add-brick"></iron-icon>Other element
      </paper-item>
    </hax-context-item-menu>
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
        .addEventListener("dragstart", this._dragstart);
      this.shadowRoot
        .querySelector("#drag")
        .addEventListener("dragend", this.dragEnd);
    }, 0);
  }
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#drag")
      .removeEventListener("dragstart", this._dragstart);
    this.shadowRoot
      .querySelector("#drag")
      .removeEventListener("dragend", this.dragEnd);
    super.disconnectedCallback();
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  dragEnd(e) {
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
      }
    }
  }
  /**
   * Drag start so we know what target to set
   */
  _dragstart(e) {
    let target = window.HaxStore.instance.activeNode;
    if (window.HaxStore.instance.activeContainerNode) {
      target = window.HaxStore.instance.activeContainerNode;
    }
    window.HaxStore.instance.__dragTarget = target;
    target.classList.add("moving");
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setDragImage(target, 0, 0);
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
          }
        }
      }
    }, 10);
  }
}
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
