import { css, html } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-modal/simple-modal.js";

export class MiniMap extends DDD {
  static properties = {
    gridSize: { type: Number },
    nodeList: { type: Array },
    lineList: { type: Array },
    activeNode: { type: Object },
    availableNodes: { type: Array },
  };

  constructor() {
    super();
    this.gridSize = 7;
    this.nodeList = [];
    this.lineList = [];
    this.activeNode = null;
    this.availableNodes = [];
    // modal buttons keep their listeners because simple-modal receives the
    // original nodes (clone: false); bind once so `this` is the MiniMap
    this.saveNode = this.saveNode.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host,
        * {
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-theme-body-font-size, 16px);
        }
        .grid {
          display: grid;
          gap: var(--ddd-spacing-16, 64px);
          margin: var(--ddd-spacing-4, 16px);
        }
        .cell {
          appearance: none;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          aspect-ratio: 1 / 1;
          padding: 0;
          border: var(--ddd-border-xs, 1px solid #ccc);
          border-radius: var(--ddd-radius-xs, 4px);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneLight)
          );
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          cursor: pointer;
        }
        .cell:hover,
        .cell:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .cell[data-line] {
          background-color: var(--ddd-theme-default-original87Pink);
        }
        .node {
          position: relative;
          display: inline-block;
          align-content: center;
          text-align: center;
          margin: auto;
          padding: var(--ddd-spacing-2, 8px);
          border: var(--ddd-border-xs, 1px solid #ccc);
          text-decoration: none;
          height: calc(100% - var(--ddd-spacing-5, 20px));
          width: calc(100% - var(--ddd-spacing-5, 20px));
          border-radius: var(--ddd-radius-circle, 100%);
          --ddd-theme-accent: var(--ddd-theme-default-skyLight, lightblue);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .cell:has(.node) {
          width: 138px;
          height: 138px;
        }
      `,
    ];
  }

  renderCell(index) {
    const node = this.nodeList.find((node) => node.id === index);
    return html`
      <button
        class="cell"
        id="cell-${index}"
        ?data-line="${this.lineList.includes(index)}"
        @click="${this._handleCellClick}"
      >
        ${node
          ? html`<span
              class="node node-${node.type}"
              data-type="${node.type}"
              id="node-${index}"
              >${node.name}</span
            >`
          : index}
      </button>
    `;
  }

  _handleCellClick(e) {
    // currentTarget is the cell even when an inner element is clicked;
    // fall back to target so tests can send simplified events
    const cell = e.currentTarget || e.target;
    const id = cell.id.split("-")[1];
    this.showModal(id, cell);
  }

  showModal(id, invokedBy) {
    const node = this.nodeList.find((node) => node.id === Number(id));
    const type = node ? node.type : "topic";
    const name = node ? node.name : "";
    const url = node ? node.url : "";
    const active = node ? node.isActive : false;

    const content = globalThis.document.createElement("div");
    content.classList.add("modal-form");
    content.innerHTML = `
    <style>
      simple-modal {
        --simple-modal-width: 30%;
        font-family: var(--ddd-font-primary, sans-serif);
      }
      .modal-form {
        display: flex;
        flex-direction: column;
        gap: var(--ddd-spacing-4, 16px);
        padding: var(--ddd-spacing-4, 16px);
        margin: auto;
        align-items: center;
        justify-content: center;
      }
      .modal-form label {
        display: inline-block;
        gap: var(--ddd-spacing-2, 8px);
      }
      .modal-form input,
      .modal-form select {
        padding: var(--ddd-spacing-2, 8px);
        border-radius: var(--ddd-radius-xs, 4px);
        border: var(--ddd-border-xs, 1px solid #ccc);
      }
      .modal-buttons button {
        display: inline-block;
        padding: var(--ddd-spacing-2, 8px);
        border-radius: var(--ddd-radius-xs, 4px);
        border: var(--ddd-border-xs, 1px solid #ccc);
        background-color: var(--ddd-theme-default-limestoneLight, #ccc);
        width: fit-content;
      }
    </style>
    <span id="node-input-id" hidden></span>
    <label>Type:
      <select id="node-input-type">
        <option value="topic">Topic</option>
        <option value="subsection">Subsection</option>
      </select>
    </label>
    <label>Name: <input type="text" id="node-input-name" placeholder="Enter Name"></label>
    <label>URL: <input type="url" id="node-input-url" placeholder="Enter URL"></label>
    <div>
      <label>Active Node? <input type="checkbox" id="node-input-active"></label>
    </div>
    `;
    // populate the form from node data instead of interpolating it into HTML
    content.querySelector("#node-input-id").textContent = id;
    content.querySelector("#node-input-type").value = type || "topic";
    content.querySelector("#node-input-name").value = name || "";
    content.querySelector("#node-input-url").value = url || "";
    content.querySelector("#node-input-active").checked = !!active;
    this.__modalForm = content;

    const buttons = globalThis.document.createElement("div");
    buttons.classList.add("modal-buttons");
    const saveButton = globalThis.document.createElement("button");
    saveButton.id = "nodeSaveBtn";
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", this.saveNode);
    const cancelButton = globalThis.document.createElement("button");
    cancelButton.id = "nodeCancelBtn";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", this.closeModal);
    const deleteButton = globalThis.document.createElement("button");
    deleteButton.id = "nodeDeleteBtn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", this.deleteNode);
    buttons.append(saveButton, cancelButton, deleteButton);

    const evnt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        title: "Node " + id,
        elements: { content, buttons },
        invokedBy: invokedBy || saveButton,
        clone: false,
      },
    });
    globalThis.dispatchEvent(evnt);
  }

  closeModal() {
    const evnt = new CustomEvent("simple-modal-hide", {
      bubbles: true,
      cancelable: true,
    });
    globalThis.dispatchEvent(evnt);
  }

  saveNode() {
    const form = this.__modalForm;
    if (!form) {
      return;
    }
    const id = Number(form.querySelector("#node-input-id").textContent);
    const type = form.querySelector("#node-input-type").value;
    const name = form.querySelector("#node-input-name").value;
    const url = form.querySelector("#node-input-url").value;
    const isActive = form.querySelector("#node-input-active").checked;
    const existing = this.nodeList.find((node) => node.id === id);
    if (existing) {
      this.nodeList = this.nodeList.map((node) =>
        node.id === id ? { ...node, type, name, url, isActive } : node,
      );
    } else {
      this.addNode(id, type, name, url, isActive);
    }
    this.closeModal();
  }

  deleteNode() {
    const form = this.__modalForm;
    if (!form) {
      return;
    }
    const id = Number(form.querySelector("#node-input-id").textContent);
    this.removeNode(id);
    this.closeModal();
  }

  renderCanvas() {}

  addNode(id, type, name, url, isActive = false) {
    // immutable update so Lit re-renders the cells that contain this node
    this.nodeList = [
      ...this.nodeList,
      { id: Number(id), type, name, url, isActive },
    ];
  }

  removeNode(id) {
    this.nodeList = this.nodeList.filter((node) => node.id !== id);
  }

  removeAllNodes() {
    this.nodeList = [];
  }

  addLine(id) {
    this.lineList = [...this.lineList, Number(id)];
  }

  removeLine(id) {
    this.lineList = this.lineList.filter((line) => line !== Number(id));
  }

  render() {
    return html`
      <button>Edit Nodes</button>
      <button>Edit Lines</button>
      <button @click="${this.removeAllNodes}">Reset</button>
      <button>Save</button>
      <div
        id="gridTarget"
        class="grid"
        style="grid-template-columns: repeat(${this.gridSize}, auto)"
      >
        ${Array.from({ length: this.gridSize * this.gridSize }, (_, index) =>
          this.renderCell(index),
        )}
      </div>
    `;
  }
}

globalThis.customElements.define("mini-map", MiniMap);
