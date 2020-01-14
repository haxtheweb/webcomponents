/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Inspiration from: https://codepen.io/bradtraversy/pen/odmVgN
 */

/**
 * `drag-n-drop`
 * @customElement drag-n-drop
 * `drag and drop elements and manager`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @demo demo/index.html
 */
class DragNDrop extends HTMLElement {
  
  // render function
  get html() {
    return `
<style>
:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

:host([editing]) .items ::slotted(.hold) {
  border: solid 5px #ccc;
}

:host([editing]) .items ::slotted([data-droppable]) {
  margin: 10px;
  border: solid 3px salmon;
  background: white;
}

:host([editing]) .items ::slotted(.hovered) {
  background: #f4f4f4;
  border-style: dashed;
}
        </style>
<div class="items">
  <slot></slot>
</div>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    return {
  
  ...super.properties,
  
  "editing": {
    "name": "editing",
    "type": Boolean
  }
}
;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "drag-n-drop";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    // dragging tracker
    this.__dragging = {};
    // set tag for later use
    this.tag = DragNDrop.tag;
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/DragNDrop-properties.json
    let obj = DragNDrop.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
    this.template = document.createElement("template");

    this.attachShadow({ mode: "open" });

    if (!delayRender) {
      this.render();
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
  }

  _copyAttribute(name, to) {
    const recipients = this.shadowRoot.querySelectorAll(to);
    const value = this.getAttribute(name);
    const fname = value == null ? "removeAttribute" : "setAttribute";
    for (const node of recipients) {
      node[fname](name, value);
    }
  }

  _setProperty({ name, value }) {
    this[name] = value;
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
    return ["editing"];
  }
  get editing() {
    this.getAttribute("editing");
  }
  set editing(val) {
    if (!val) {
      this.removeAttribute("editing");
    } else {
      this.setAttribute("editing", val);
    }
  }
  // disconnectedCallback() {}
  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === "editing") {
      const draggable = this.querySelectorAll("[data-draggable]");
      const droppable = this.querySelectorAll("[data-droppable]");
      if (newValue) {
        // Loop through empty boxes and add listeners
        for (const dropArea of droppable) {
          dropArea.setAttribute("droppable", "true");
          dropArea.addEventListener("dragover", this.dragOver.bind(this));
          dropArea.addEventListener("dragenter", this.dragEnter.bind(this));
          dropArea.addEventListener("dragleave", this.dragLeave.bind(this));
          dropArea.addEventListener("drop", this.dragDrop.bind(this));
        }
        // Loop through fills and add listeners
        for (const dragItem of draggable) {
          dragItem.setAttribute("draggable", "true");
          dragItem.addEventListener("dragstart", this.dragStart.bind(this));
          dragItem.addEventListener("dragend", this.dragEnd.bind(this));
        }
      } else {
        // Loop through empty boxes and add listeners
        for (const dropArea of droppable) {
          dropArea.removeAttribute("droppable");
          dropArea.removeEventListener("dragover", this.dragOver.bind(this));
          dropArea.removeEventListener("dragenter", this.dragEnter.bind(this));
          dropArea.removeEventListener("dragleave", this.dragLeave.bind(this));
          dropArea.removeEventListener("drop", this.dragDrop.bind(this));
        }
        // Loop through fills and add listeners
        for (const dragItem of draggable) {
          dragItem.removeAttribute("draggable");
          dragItem.removeEventListener("dragstart", this.dragStart.bind(this));
          dragItem.removeEventListener("dragend", this.dragEnd.bind(this));
        }
      }
    }
  }

  // Drag Functions
  dragStart(e) {
    this.__dragging = e.target;
    this.__dragging.className += " hold";
    setTimeout(() => (this.__dragging.className = "invisible"), 0);
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  dragEnd(e) {
    this.__dragging.className = "fill";
  }
  dragOver(e) {
    e.preventDefault();
  }
  dragEnter(e) {
    e.preventDefault();
    e.target.className += " hovered";
  }
  dragLeave(e) {
    e.target.className = "empty";
  }
  dragDrop(e) {
    e.target.className = "empty";
    e.target.appendChild(this.__dragging);
  }
}
window.customElements.define(DragNDrop.tag, DragNDrop);
export { DragNDrop };
