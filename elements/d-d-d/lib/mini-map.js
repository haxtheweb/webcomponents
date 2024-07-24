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
          gap: 64px;
          margin: 16px;
        }
        .cell {
          margin: auto;
          aspect-ratio: 1 / 1;
        }
        .node {
          position: relative;
          display: inline-block;
          align-content: center;
          text-align: center;
          margin: auto;
          padding: 8px;
          border: 1px solid #ccc;
          text-decoration: none;
          height: calc(100% - 20px);
          width: calc(100% - 20px);
          border-radius: 100%;
          --ddd-theme-accent: lightblue;
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
      <div class="cell" id="cell-${index}" @click="${this._handleCellClick}">
        ${node
          ? html`<a
              class="node node-${node.type}"
              href="#"
              data-type="${node.type}"
              id="node-${index}"
              @click="${(e) => {
                e.preventDefault();
                this.showModal(index);
              }}"
              >${node.name}</a
            >`
          : index}
      </div>
    `;
  }

  _handleCellClick(e) {
    console.log(e.target.id);
    const id = e.target.id.split("-")[1];
    this.showModal(id);
  }

  showModal(id) {
    const c = globalThis.document.createElement("div");
    c.classList.add("modal-form");
    const nodeExists = this.nodeList ? this.nodeList.includes(id) : false;
    const type = nodeExists ? nodeExists.type : "topic";
    const name = nodeExists ? nodeExists.name : "";
    const url = nodeExists ? nodeExists.url : "";
    const active = nodeExists ? nodeExists.isActive : false;

    c.innerHTML = `
    <style>
      simple-modal{
        --simple-modal-width: 30%;
        font-family: var(--ddd-font-primary, sans-serif);
      }
      .modal-form{
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
        margin: auto;
        align-items: center;
        justify-content: center;
      }
      label{
        display: inline-block;
        gap: 8px;
      }
      input, select{
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
      }
      button{
        display: inline-block;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background-color: #ccc;
        width: fit-content;
      }
    </style>
      <h2>Node ${id}</h2>
      <span id="node-input-id" hidden>${id}</span>
      <label>Type: 
        <select id="node-input-type">
          <option value="topic" ${type === "topic" ? "selected" : ""}>Topic</option>
          <option value="subsection" ${type === "subsection" ? "selected" : ""}>Subsection</option>
        </select>
      </label>
      <label>Name: <input type="text" id="node-input-name" placeholder="Enter Name" value="${name}"></label>
      <label>URL: <input type="url" id="node-input-url" placeholder="Enter URL" value="${url}"></label>
      <div>
        <label>Active Node? <input type="checkbox" id="node-input-active" ${active ? "checked" : ""}></label>
      </div>
    `;

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

    c.appendChild(saveButton);
    c.appendChild(cancelButton);
    c.appendChild(deleteButton);

    const evnt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        elements: { content: c },
        invokedBy: saveButton, // Pass the saveButton as the element that invoked the modal
        clone: true, // This will clone the content into the modal
        onShow: () => this.addModalListeners(), // Add the event listeners when the modal is shown
      },
    });
    dispatchEvent(evnt);

    globalThis.document.addEventListener("simple-modal-opened", (e) => {
      console.log("Modal opened", e);
      this.addModalListeners();
    });
  }

  closeModal() {
    const evnt = new CustomEvent("simple-modal-hide", {
      bubbles: true,
      cancelable: true,
    });
    dispatchEvent(evnt);
  }

  addModalListeners() {
    document
      .querySelector("#nodeSaveBtn")
      .addEventListener("click", this.saveNode);
    document
      .querySelector("#nodeCancelBtn")
      .addEventListener("click", this.closeModal);
  }

  renderCanvas() {}

  saveNode() {
    const type = globalThis.document.querySelector("#node-input-type").value;
    const name = globalThis.document.querySelector("#node-input-name").value;
    const url = globalThis.document.querySelector("#node-input-url").value;
    const id = globalThis.document.querySelector("#node-input-id").innerText;
    console.log(id, type, name, url);
    this.nodeList = this.nodeList ? this.nodeList : [];
    if (this.nodeList.length != 0 && this.nodeList.includes(id)) {
      document
        .querySelector("mini-map")
        .shadowRoot.querySelector("#node-" + id)
        .setAttribute("type", type);
      document
        .querySelector("mini-map")
        .shadowRoot.querySelector("#node-" + id)
        .setAttribute("name", name);
      document
        .querySelector("mini-map")
        .shadowRoot.querySelector("#node-" + id)
        .setAttribute("url", url);
    } else {
      globalThis.document.querySelector("mini-map").nodeList.push(id);
      globalThis.document
        .querySelector("mini-map")
        .addNode(id, type, name, url);
    }
    globalThis.document.querySelector("mini-map").closeModal();
  }

  async addNode(id, type, name, url) {
    const miniMap = globalThis.document.querySelector("mini-map").shadowRoot;
    const cell = miniMap.querySelector(`#cell-${id}`);
    const node = globalThis.document.createElement("a");
    node.classList.add("node");
    node.classList.add(`node-${type}`);
    node.setAttribute("href", "#");
    node.setAttribute("data-type", type);
    node.setAttribute("id", `node-${id}`);
    node.innerText = name;
    cell.innerHTML = "";
    await cell.appendChild(node);

    miniMap.querySelector(`#node-${id}`).addEventListener("click", (e) => {
      e.preventDefault();
      this.showModal(id);
    });
  }

  removeNode() {}

  removeAllNodes() {
    this.nodeList = [...this.nodeList];
    this.nodeList.length = 0;
    this.shadowRoot.querySelectorAll(".cell").forEach((cell) => cell.remove());
    this.shadowRoot.querySelector("#gridTarget").innerHTML = Array.from(
      { length: this.gridSize * this.gridSize },
      (_, index) => this.renderCell(index),
    );
  }

  addLine(id, type, name, url) {
    this.nodeList.push(id);
    this.shadowRoot.querySelector(`#cell-${id}`).style.backgroundColor = "red";
  }

  removeLine() {}

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
