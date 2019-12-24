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
      visibility: visible;
      transition: 0.2s height linear;
    }
    .paddle {
      position:fixed;
      width: unset;
      height: unset;
      visibility: visible;
      opacity: .6;
      transition: 0.2s height linear;
    }
    .paddle:hover {
      opacity: 1;
    }
    paper-item {
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
      height: 20px;
      padding: 0 4px;
      min-height: 20px;
      font-size: 10px;
    }
    paper-item:hover {
      background-color: #d3d3d3;
      cursor: pointer;
    }
    iron-icon {
      padding: 0 2px;
      width: 16px;
      height: 16px;
    }
    </style>
    <div class="area">
      <hax-context-item
        light
        icon="hardware:keyboard-arrow-up"
        label="Move up"
        event-name="grid-plate-up"
        direction="left"
      ></hax-context-item>
      <hax-context-item
        id="drag"
        light
        icon="editor:drag-handle"
        label="Drag"
        draggable="true"
        direction="left"
      ></hax-context-item>
      <hax-context-item
        light
        icon="hardware:keyboard-arrow-down"
        label="Move down"
        event-name="grid-plate-down"
        direction="left"
      ></hax-context-item>
    </div>
    <hax-context-item
      light
      large
      class="paddle"
      icon="icons:add"
      label="Add column"
      event-name="grid-plate-create-left"
      direction="right"
      id="left"
    ></hax-context-item>
    <hax-context-item-menu
      mini
      id="leftadd"
      class="paddle"
      icon="hax:add-brick"
      label="Insert new.."
      event-name="grid-plate-add-element"
      direction="right"
      selected-value="0"
      reset-on-select
    >
    <paper-item value="" hidden></paper-item>
      <paper-item value='{"tag":"p","content":"", "properties": {}}'
      ><iron-icon icon="hax:paragraph"></iron-icon>Paragraph</paper-item
      >
      <paper-item value='{"tag":"h2","content":"Heading", "properties": {}}'
      ><iron-icon icon="hax:h2"></iron-icon>Heading
    </paper-item>
      <paper-item value='{"tag":"ul","content":"<li>List</li>", "properties": {}}'
        ><iron-icon icon="editor:format-list-bulleted"></iron-icon>Bulleted
        list</paper-item
      >
      <paper-item value='{"tag":"hr","content":"", "properties": {}}'
        ><iron-icon icon="hax:hr"></iron-icon>Horizontal line
      </paper-item>
      <paper-item value='{"tag":"place-holder","content":"", "properties": {"type": "image", "text": "Image"}}'
      ><iron-icon icon="hax:placeholder"></iron-icon>Image placeholder
    </paper-item>
    </hax-context-item-menu>
    <hax-context-item
      light
      large
      id="right"
      class="paddle"
      icon="icons:add"
      label="Add column"
      event-name="grid-plate-create-right"
      direction="left"
    ></hax-context-item>
  `;
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property &&
      this.getAttribute("on-screen") != null &&
      e.detail.property === "activeContainerNode"
    ) {
      // when activeNode changes make sure we reposition
      this.__updatePlatePosition();
    }
  }
  __updatePlatePosition() {
    setTimeout(() => {
      let activeRec = window.HaxStore.instance.activeNode.getBoundingClientRect();
      let rect = activeRec;
      let right = this.shadowRoot.querySelector("#right");
      let left = this.shadowRoot.querySelector("#left");
      let leftadd = this.shadowRoot.querySelector("#leftadd");
      if (window.HaxStore.instance.activeContainerNode) {
        rect = window.HaxStore.instance.activeContainerNode.getBoundingClientRect();
      }
      right.style.top = Math.round(rect.y - 1) + "px";
      right.style.left = Math.round(rect.left + rect.width + 2) + "px";
      left.style.top = Math.round(rect.y - 1) + "px";
      left.style.left = Math.round(rect.left - 22) + "px";
      right.height = Math.round(rect.height + 2) + "px";
      left.height = right.height;
      this.style.height = right.height;
      leftadd.style.top = Math.round(activeRec.y + activeRec.height + 1) + "px";
      leftadd.style.left = Math.round(activeRec.left - 22) + "px";
    }, 0);
  }
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  static get observedAttributes() {
    return ["on-screen"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "on-screen" && newValue) {
      this.__updatePlatePosition();
    } else {
      // offscreen
    }
  }

  connectedCallback() {
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
