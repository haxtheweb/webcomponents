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
      import("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");
      import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
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
      width: 56;
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
      width: 40px;
      float: left;
      visibility: visible;
      transition: 0.2s all linear;
    }
    .leftside {
      width: 20px;
      float: left;
      visibility: visible;
      transition: 0.2s all linear;
    }
    .rightside {
      width: 20px;
      float: right;
      visibility: visible;
      transition: 0.2s all linear;
    }
    #right {
      position:fixed;
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
    <div class="leftside">
      <hax-context-item
        light
        large
        icon="icons:add"
        label="Add column"
        event-name="grid-plate-create-left"
        direction="right"
        id="left"
      ></hax-context-item>
    </div>
    <div class="rightside">
      <hax-context-item
      light
      large
      id="right"
      icon="icons:add"
      label="Add column"
      event-name="grid-plate-create-right"
      direction="left"
    ></hax-context-item>
    </div>`;
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
      e.detail.property === "activeNode"
    ) {
      // when activeNode changes make sure we reposition
      this.__updatePlatePosition();
    }
  }
  __updatePlatePosition() {
    let rect = window.HaxStore.instance.activeNode.getBoundingClientRect();
    this.shadowRoot.querySelector("#right").style.top = rect.y - 2 + "px";
    this.shadowRoot.querySelector("#right").style.left =
      rect.left + rect.width + 2 + "px";
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
    }, 0);
  }
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#drag")
      .removeEventListener("dragstart", this._dragstart);
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
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setDragImage(target, 25, 25);
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
