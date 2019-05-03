import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/drawing-icons/drawing-icons.js";
/**
`lrnsys-outline-item`
A LRN element

* @demo demo/index.html

@microcopy - the mental model for this element
 -

*/
class LrnsysOutlineItem extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --indent-multiplier: 36px;
        }
        :host(.collapse-to-remove) #wrapper {
          height: 0px;
          background-color: var(--lrnsys-outline-gap-color, #eeeeee);
          border: 1px solid #999999;
          overflow: hidden;
        }
        :host #wrapper[data-indent="0"] #gap {
          margin-right: calc(var(--indent-multiplier) * 0);
        }
        :host #wrapper[data-indent="1"] #gap {
          margin-right: calc(var(--indent-multiplier) * 1);
        }
        :host #wrapper[data-indent="2"] #gap {
          margin-right: calc(var(--indent-multiplier) * 2);
        }
        :host #wrapper[data-indent="3"] #gap {
          margin-right: calc(var(--indent-multiplier) * 3);
        }
        :host #wrapper[data-indent="4"] #gap {
          margin-right: calc(var(--indent-multiplier) * 4);
        }
        :host #wrapper[data-indent="5"] #gap {
          margin-right: calc(var(--indent-multiplier) * 5);
        }
        :host #wrapper[data-indent="6"] #gap {
          margin-right: calc(var(--indent-multiplier) * 6);
        }
        :host #wrapper[data-indent="7"] #gap {
          margin-right: calc(var(--indent-multiplier) * 7);
        }
        :host #wrapper[data-indent="8"] #gap {
          margin-right: calc(var(--indent-multiplier) * 8);
        }
        :host #wrapper[data-indent="9"] #gap {
          margin-right: calc(var(--indent-multiplier) * 9);
        }
        :host #input {
          flex-grow: 1;
          margin-right: 10px;
        }
        :host #wrapper {
          display: flex;
          height: 40px;
          border-radius: 16px;
          transition: 0.1s all ease;
          background-color: transparent;
          border: 1px solid transparent;
          padding: 8px;
          transition: 0.3s all linear;
        }
        :host([focus-state]) #wrapper,
        :host(:focus) #wrapper,
        :host(:hover) #wrapper {
          cursor: pointer;
          background-color: var(--lrnsys-outline-gap-color, #eeeeee);
          border: 1px solid #999999;
        }
        #gap {
          padding: 2px;
          transition: 0.3s all ease;
          border-left: solid 4px transparent;
        }
        :host([focus-state]) #gap,
        :host(:focus) #gap,
        :host(:hover) #gap {
          border-left: solid 4px var(--lrnsys-outline-gap-color, #aaaaaa);
        }
        paper-icon-button {
          font-size: 16px;
          height: 36px;
          padding: 10px;
          margin: 4px;
          display: none;
          border-radius: 0.16px;
        }
        :host([focus-state]) paper-icon-button,
        :host(:focus) paper-icon-button,
        :host(:hover) paper-icon-button {
          width: 36px;
          display: inline-flex;
        }
        paper-icon-button#add {
          width: 36px;
          margin-right: 2px;
          color: white;
          background-color: var(--lrnsys-outline-add-button-color, #018dff);
        }
        paper-icon-button#delete {
          color: white;
          background-color: var(--lrnsys-outline-delete-button-color, #cc0000);
        }
      </style>
      <div id="wrapper" data-indent$="[[indentLevel]]">
        <div id="gap"></div>
        <paper-input
          id="input"
          label="Enter a page title"
          value="{{title}}"
          no-label-float=""
        >
        </paper-input>
        <paper-icon-button
          id="down"
          title="Move downwards"
          icon="icons:arrow-downward"
          on-tap="moveDown"
        ></paper-icon-button>
        <paper-icon-button
          id="left"
          title="Outdent"
          icon="icons:arrow-back"
          on-tap="moveOut"
        ></paper-icon-button>
        <paper-icon-button
          id="right"
          title="Indent"
          icon="icons:arrow-forward"
          on-tap="moveIn"
        ></paper-icon-button>
        <paper-icon-button
          id="up"
          title="Move upwards"
          icon="icons:arrow-upward"
          on-tap="moveUp"
        ></paper-icon-button>
        <paper-icon-button
          id="add"
          title="Add Item"
          icon="icons:add"
          on-tap="add"
        ></paper-icon-button>
        <paper-icon-button
          id="delete"
          title="Delete"
          icon="icons:delete"
          on-tap="delete"
        ></paper-icon-button>
      </div>
      <iron-a11y-keys
        target="[[__inputTarget]]"
        keys="esc"
        on-keys-pressed="_onEsc"
      ></iron-a11y-keys>
      <iron-a11y-keys
        target="[[__inputTarget]]"
        keys="enter"
        on-keys-pressed="_onEnter"
      ></iron-a11y-keys>
      <iron-a11y-keys
        target="[[__inputTarget]]"
        keys="backspace"
        on-keys-pressed="_onBackspace"
      ></iron-a11y-keys>
      <iron-a11y-keys
        target="[[__inputTarget]]"
        keys="up"
        on-keys-pressed="_onArrowUp"
      ></iron-a11y-keys>
      <iron-a11y-keys
        target="[[__inputTarget]]"
        keys="down"
        on-keys-pressed="_onArrowDown"
      ></iron-a11y-keys>
      <iron-a11y-keys
        target="[[__inputTarget]]"
        keys="tab"
        on-keys-pressed="_onTab"
      ></iron-a11y-keys>
      <iron-a11y-keys
        target="[[__inputTarget]]"
        keys="shift+tab"
        on-keys-pressed="_onShiftTab"
      ></iron-a11y-keys>
      <iron-a11y-keys
        target="[[__inputTarget]]"
        keys="shift+up"
        on-keys-pressed="_onShiftArrowUp"
      ></iron-a11y-keys>
      <iron-a11y-keys
        target="[[__inputTarget]]"
        keys="shift+down"
        on-keys-pressed="_onShiftArrowDown"
      ></iron-a11y-keys>
    `;
  }
  static get tag() {
    return "lrnsys-outline-item";
  }
  static get properties() {
    return {
      indentLevel: {
        type: Number,
        value: 0
      },
      index: {
        type: Number,
        value: 0
      },
      parent: {
        type: String,
        value: null
      },
      title: {
        type: String,
        value: null,
        notify: true,
        reflectToAttribute: true
      },
      /**
       * Tracks if focus state is applied
       */
      focusState: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }
  _focusin(e) {
    this.focusState = true;
  }
  _focusout(e) {
    this.focusState = false;
  }
  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(
      new CustomEvent("attached-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { item: this }
      })
    );
  }
  /**
   * ready life cycle
   */
  ready() {
    super.ready();
    this.__inputTarget = this.$.input;
    this.dispatchEvent(
      new CustomEvent("focus-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    afterNextRender(this, function() {
      this.addEventListener("change", this._onChange.bind(this));
      this.addEventListener("focus", e => {
        this.dispatchEvent(
          new CustomEvent("focus-item", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this
          })
        );
      });
      this.addEventListener("mouseover", e => {
        this.dispatchEvent(
          new CustomEvent("focus-item", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this
          })
        );
      });
      this.addEventListener("blur", e => {
        this.dispatchEvent(
          new CustomEvent("blur-item", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this
          })
        );
      });
      this.addEventListener("mouseout", e => {
        this.dispatchEvent(
          new CustomEvent("blur-item", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this
          })
        );
      });
      this.$.input.addEventListener(
        "focused-changed",
        this._focusin.bind(this)
      );
      this.addEventListener("focusin", this._focusin.bind(this));
      this.addEventListener("focusout", this._focusout.bind(this));
    });
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    this.removeEventListener("change", this._onChange.bind(this));
    this.removeEventListener("focus", e => {
      this.dispatchEvent(
        new CustomEvent("focus-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    });
    this.removeEventListener("mouseover", e => {
      this.dispatchEvent(
        new CustomEvent("focus-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    });
    this.removeEventListener("blur", e => {
      this.dispatchEvent(
        new CustomEvent("blur-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    });
    this.removeEventListener("mouseout", e => {
      this.dispatchEvent(
        new CustomEvent("blur-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    });
    this.$.input.removeEventListener(
      "focused-changed",
      this._focusin.bind(this)
    );
    this.removeEventListener("focusin", this._focusin.bind(this));
    this.removeEventListener("focusout", this._focusout.bind(this));
    super.disconnectedCallback();
  }

  focus() {
    this.$.input.focus();
    return this;
  }

  value() {
    this.title = this.$.input.value;
    return this.title;
  }

  delete() {
    this.dispatchEvent(
      new CustomEvent("delete-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { item: this }
      })
    );
  }

  setIndent(amount) {
    this.dispatchEvent(
      new CustomEvent("indent-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { item: this, increase: amount > 0 }
      })
    );
  }

  add() {
    let i = this.$.input.shadowRoot.querySelector("#" + this.$.input._inputId)
        .inputElement.selectionStart,
      j = this.title;
    this.dispatchEvent(
      new CustomEvent("add-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          item: this,
          value: j.slice(0, i),
          new: j.slice(i, j.length)
        }
      })
    );
    this.title = j.slice(0, i);
  }

  move(amount) {
    this.dispatchEvent(
      new CustomEvent("move-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { item: this, moveUp: amount < 0 }
      })
    );
  }
  moveUp(e) {
    this.move(-1);
  }
  moveDown(e) {
    this.move(1);
  }
  moveOut(e) {
    this.setIndent(-1);
  }
  moveIn(e) {
    this.setIndent(1);
  }
  setSelection(start, end) {
    let s = start !== undefined ? start : 0,
      n = end !== undefined ? end : s;
    try {
      this.$.input.querySelector("input").setSelectionRange(s, n);
    } catch (e) {
      console.log(e);
    }
    this.focus();
  }

  _onChange() {
    this.dispatchEvent(
      new CustomEvent("change-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { item: this, value: this.title }
      })
    );
  }
  _onEsc() {
    this.focus();
    this._focusout();
  }
  _onEnter() {
    let i = this.$.input.shadowRoot.querySelector("#" + this.$.input._inputId)
        .inputElement.selectionStart,
      j = this.title;
    this.dispatchEvent(
      new CustomEvent("add-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          item: this,
          value: j.slice(0, i),
          new: j.slice(i, j.length)
        }
      })
    );
    this.title = j.slice(0, i);
    this._focusout();
  }

  _onBackspace(e) {
    if (this._getSelection().toString() == this.title) {
      e.detail.keyboardEvent.preventDefault();
      this.dispatchEvent(
        new CustomEvent("delete-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { item: this }
        })
      );
    } else if (
      this.$.input.shadowRoot.querySelector("#" + this.$.input._inputId)
        .inputElement.selectionStart == 0
    ) {
      this.dispatchEvent(
        new CustomEvent("indent-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { item: this, increase: false }
        })
      );
    }
  }

  /**
   * Selection normalizer
   */
  _getSelection() {
    // try and obtain the selection from the nearest shadow
    // which would give us the selection object when running native ShadowDOM
    // with fallback support for the entire window which would imply Shady
    if (
      this.parentNode &&
      this.parentNode.parentNode &&
      this.parentNode.parentNode.getSelection
    ) {
      return this.parentNode.parentNode.getSelection();
    }
    return window.getSelection();
  }

  _onArrowUp() {
    if (
      this.$.input.shadowRoot.querySelector("#" + this.$.input._inputId)
        .inputElement.selectionStart == 0
    ) {
      this.dispatchEvent(
        new CustomEvent("focus-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { item: this, moveUp: true }
        })
      );
    }
  }

  _onArrowDown() {
    if (
      this.$.input.shadowRoot.querySelector("#" + this.$.input._inputId)
        .inputElement.selectionStart == this.title.length
    ) {
      this.dispatchEvent(
        new CustomEvent("focus-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { item: this, moveUp: false }
        })
      );
    }
  }

  _onShiftTab() {
    this.setIndent(-1);
  }

  _onTab(e) {
    if (
      this.$.input.shadowRoot.querySelector("#" + this.$.input._inputId)
        .inputElement.selectionStart == 0
    ) {
      e.preventDefault();
      this.setIndent(1);
    }
  }

  _onShiftArrowUp() {
    this.move(-1);
  }

  _onShiftArrowDown() {
    this.move(1);
  }
}
window.customElements.define(LrnsysOutlineItem.tag, LrnsysOutlineItem);
export { LrnsysOutlineItem };
