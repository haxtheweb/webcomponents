import { LitElement, html, css } from "lit";
import { DDDSuper } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";

export class SortingOption extends DDDSuper(LitElement) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "sorting-option";
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      disabled: { type: Boolean },
      correct: { type: Boolean, reflect: true },
      incorrect: { type: Boolean, reflect: true },
      option: { type: String },
    };
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.option = "option";
    this.setAttribute("draggable", true);
    this.addEventListener("mousedown", this.getCurrentPosition);
    this.addEventListener("drag", this.dragStart);
    this.addEventListener("dragend", this.dragEnd);
    this.addEventListener("mouseup", this.dragEnd);
  }

  getCurrentPosition(e) {
    if (!this.disabled) {
      this.style.backgroundColor = 'var(--ddd-theme-default-infoLight)';
      this.correct = null;
      this.incorrect = null;
      var posY = e.clientY;
      this.currentPosition = posY;
    }
  }

  dragStart(e) {
    if (!this.disabled) {
      //distance above or below current pos to switch index
      var changeBuffer = 30;
      //if slottted images increase change buffer size
      if (this.querySelectorAll("img").length > 0) {
        changeBuffer = 70;
      }
      // this.style.visibility = "hidden";
      var posY = e.clientY;
      //drag stop counts as drag for some reason so make sure not to set drag pos to zero
      if (posY != 0 && posY > 0) {
        this.dragPosition = posY;
      }
      var element = this;
      var parent = this.parentNode;
      //going up
      if (this.dragPosition + changeBuffer < this.currentPosition) {
        //find old index
        var oldIndex;
        for (var i = 0; i < parent.children.length; i++) {
          if (parent.children[i].isEqualNode(element)) {
            oldIndex = i;
          }
        }
        //set new index
        if (oldIndex != 0) {
          parent.insertBefore(element, parent.children[oldIndex - 1]);
          this.currentPosition = this.dragPosition;
          return;
        }
      }
      //going down
      if (this.dragPosition - changeBuffer > this.currentPosition) {
        //find old index
        var oldIndex;
        for (var i = 0; i < parent.children.length; i++) {
          if (parent.children[i].isEqualNode(element)) {
            oldIndex = i;
          }
        }
        //set new index
        if (oldIndex != parent.children.length - 1) {
          parent.insertBefore(parent.children[oldIndex + 1], element);
          this.currentPosition = this.dragPosition;
          return;
        }
      }
    }
  }
  dragEnd() {
    if (!this.disabled) {
      this.style.backgroundColor = "";
    }
  }

  //To Do: change color of up arrowed otption to see which one moved better
  // then reset the color of all other options

  upArrowSort() {
    if (!this.disabled) {
      var parent = this.parentNode;
      parent.childNodes.forEach((child) => {
        if (child.tagName === "SORTING-OPTION") {
          child.style.backgroundColor = "";
        }
      });
      this.style.backgroundColor = "var(--ddd-theme-default-infoLight)";
      //find old index
      var oldIndex;
      for (var i = 0; i < parent.children.length; i++) {
        if (parent.children[i].isEqualNode(this)) {
          oldIndex = i;
        }
      }
      //set new index
      if (oldIndex != 0) {
        parent.insertBefore(this, parent.children[oldIndex - 1]);
        this.shadowRoot.querySelector("#upArrow").focus();
        return;
      }
      //keep focus on up-sort
    }
  }

  downArrowSort() {
    if (!this.disabled) {
      var parent = this.parentNode;
      parent.childNodes.forEach((child) => {
        if (child.tagName === "SORTING-OPTION") {
          child.style.backgroundColor = "";
        }
      });
      this.style.backgroundColor = "var(--ddd-theme-default-infoLight)";
      //find old index
      var oldIndex;
      for (var i = 0; i < parent.children.length; i++) {
        if (parent.children[i].isEqualNode(this)) {
          oldIndex = i;
        }
      }
      //set new index
      if (oldIndex != parent.children.length - 1) {
        parent.insertBefore(parent.children[oldIndex + 1], this);
        return;
      }
    }
  }


  // CSS - specific to Lit
  static get styles() {
    return [super.styles,
    css`
      :host {
        width: 95%;
        height: 100%;
        min-height: 25px;
        display: flex;
        align-items: center;
        cursor: grab;
        z-index: 1;
        overflow: hidden;
        padding: var(--ddd-spacing-4);
        transition: all 0.3s ease-in-out 0s;
        margin: 0px;
        border: var(--ddd-border-md);
        border-radius: var(--ddd-radius-xs);
        color: var(--simple-colors-default-theme-accent-10);
        background-color: var(--simple-colors-default-theme-accent-2);
        font-family: var(--ddd-font-navigation);
        font-size: var(--ddd-font-size-xs);
        line-height: var(--ddd-font-size-xs);
        --simple-icon-height: var(--ddd-icon-xs);
        --simple-icon-width: var(--ddd-icon-xs);
      }

      :host([correct]) {
        background-color: var(
          --option-background-color-correct,
          var(--ddd-theme-default-successLight)
        ) !important;
      }

      :host([incorrect]) {
        background-color: var(
          --option-background-color-incorrect,
          var(--ddd-theme-default-alertImmediate)
        ) !important;
      }

      :host([incorrect]) #incorrect-icon {
        display: block;
      }
      :host([correct]) #correct-icon {
        display: block;
      }

      .option-slot-wrapper {
        display: flex;
        align-items: center;
        z-index: 2;
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: none;
        text-align: inherit;
        font-weight: bold;
      }
      :host button {
        cursor: grab;
        font-weight: bold;
      }
      :host button:active {
        cursor: grabbing;
      }

      ::slotted(*) {
        max-height: 75px;
      }

      .arrow-container {
        display: flex;
        justify-content: flex-end;
        padding-right: 5px;
        position: relative;
        right: 0px;
        width: 20%;
        height: 100%;
        background-color: transparent;
        align-items: center;
      }

      .arrow {
        height: 15px;
        width: 15px;
        border-style: solid;
        border-width: 1px;
        border-color: black;
        cursor: pointer;
        margin-left: 1px;
        margin-right: 1px;
        border-radius: 5px;
        box-shadow: 0px 0px 1px 0px;
      }

      .up-arrow {
        transform: rotate(270deg);
      }

      .down-arrow {
        transform: rotate(90deg);
      }

      .feedback-container {
        width: fit-content;
        display: flex;
        align-items: center;
        margin-right: var(--ddd-spacing-3);
        background-color: transparent;
      }

      #correct-icon {
        display: none;
      }

      #incorrect-icon {
        display: none;
      }
    `];
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div class="feedback-container">
        <simple-icon-lite
          id="correct-icon"
          icon="check"
          title="Answer is correct"
        ></simple-icon-lite>
        <simple-icon-lite
          id="incorrect-icon"
          icon="clear"
          title="Answer is incorrect"
        ></simple-icon-lite>
      </div>
      <div class="option-slot-wrapper"><slot></slot></div>
      <div class="arrow-container">
        <simple-icon-button-lite
          id="upArrow"
          icon="arrow-upward"
          @click="${this.upArrowSort}"
          title="Select to move option up in order"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          id="downArrow"
          icon="arrow-downward"
          @click="${this.downArrowSort}"
          title="Select to move option down in order"
        ></simple-icon-button-lite>
      </div>
    `;
  }
}

//define element

globalThis.customElements.define(SortingOption.tag, SortingOption);
