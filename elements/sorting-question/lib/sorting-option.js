/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

export class SortingOption extends I18NMixin(DDDSuper(LitElement)) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "sorting-option";
  }

  // delegatesFocus must be declared as a static getter so the shadow root is
  // actually created with it — assigning it in the constructor is too late.
  static get shadowRootOptions() {
    return {
      ...super.shadowRootOptions,
      delegatesFocus: true,
    };
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      disabled: { type: Boolean, reflect: true },
      dragging: { type: Boolean, reflect: true },
      correct: { type: Boolean, reflect: true },
      incorrect: { type: Boolean, reflect: true },
      /**
       * "cards": an image card with the position, the image, then move
       * earlier / later buttons. Anything else is the row.
       */
      layout: { type: String, reflect: true },
      _first: { type: Boolean, state: true },
      _last: { type: Boolean, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._sortParent = this.parentNode;
    // siblings are still being added; look once they are all in
    queueMicrotask(() => this._syncEnds(this._sortParent));
  }

  disconnectedCallback() {
    const parent = this._sortParent;
    this._sortParent = null;
    super.disconnectedCallback();
    this._syncEnds(parent);
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("layout")) {
      this._syncEnds(this.parentNode);
    }
    // align disable w/ draggable
    if (changedProperties.has("disabled")) {
      if (this.disabled) {
        this.removeAttribute("draggable");
      } else {
        this.setAttribute("draggable", true);
      }
    }
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      answerInCorrectOrder: "Answer is in correct order",
      answerInIncorrectOrder: "Answer is in incorrect order",
      moveOptionUp: "Select to move option up in order",
      moveOptionDown: "Select to move option down in order",
      moveEarlier: "Move earlier",
      moveLater: "Move later",
      correct: "Correct",
      incorrect: "Incorrect",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this.dragging = false;
    this.disabled = false;
    this.addEventListener("mousedown", this.getCurrentPosition);
    this.addEventListener("drag", this.dragStart);
    this.addEventListener("dragend", this.dragEnd);
    this.addEventListener("mouseup", this.dragEnd);
  }

  getCurrentPosition(e) {
    if (!this.disabled) {
      this.correct = null;
      this.incorrect = null;
      let posY = e.clientY;
      this.currentPosition = posY;
    }
  }

  dragStart(e) {
    const reduceMotion =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      globalThis.document &&
      globalThis.document.startViewTransition &&
      !reduceMotion
    ) {
      const transition = globalThis.document.startViewTransition(() => {
        this.dragStartCallback(e);
      });
      transition.ready.catch(() => {});
    } else {
      this.dragStartCallback(e);
    }
  }

  // ---------- card layout ----------

  // the cards that share this one's container, in order
  _cards(parent) {
    return parent && parent.children
      ? Array.from(parent.children).filter(
          (el) => el.tagName === "SORTING-OPTION",
        )
      : [];
  }
  // cards at either end have nowhere further to go; rows keep both arrows
  _syncEnds(parent) {
    const cards = this._cards(parent);
    cards.forEach((card, i) => {
      if (card.layout === "cards") {
        card._first = i === 0;
        card._last = i === cards.length - 1;
      }
    });
  }
  // what the card says, for button names and the move announcement
  _cardLabel() {
    return typeof this.textContent === "string"
      ? this.textContent.replace(/\s+/g, " ").trim()
      : "";
  }
  // after a card changed place: refresh the end buttons and tell the
  // question so it can announce the new position
  _cardMoved() {
    const cards = this._cards(this.parentNode);
    this._syncEnds(this.parentNode);
    this.dispatchEvent(
      new CustomEvent("sorting-option-moved", {
        bubbles: true,
        detail: {
          label: this._cardLabel(),
          position: cards.indexOf(this) + 1,
          total: cards.length,
        },
      }),
    );
  }
  // move one place earlier (-1) or later (1) and keep focus on this card
  _cardMove(direction) {
    const other =
      direction > 0 ? this.nextElementSibling : this.previousElementSibling;
    if (!other || other.tagName !== "SORTING-OPTION") {
      return;
    }
    if (direction > 0) {
      this.parentNode.insertBefore(other, this);
    } else {
      this.parentNode.insertBefore(this, other);
    }
    this._cardMoved();
    this.updateComplete.then(() => {
      // the same button, or the other one when this card reached an end
      const id =
        direction > 0
          ? this._last
            ? "upArrow"
            : "downArrow"
          : this._first
            ? "downArrow"
            : "upArrow";
      const arrow = this.shadowRoot && this.shadowRoot.querySelector(`#${id}`);
      const button =
        arrow && arrow.shadowRoot && arrow.shadowRoot.querySelector("button");
      if (button) {
        button.focus();
      }
    });
  }
  // dragging a card over another one takes that one's place
  _cardDrag(e) {
    const x = e.clientX;
    const y = e.clientY;
    // the last drag event of a gesture reports 0,0
    if (!(x > 0) || !(y > 0)) {
      return;
    }
    const cards = this._cards(this.parentNode);
    const over = cards.find((card) => {
      const r = card.getBoundingClientRect();
      return (
        card !== this &&
        x >= r.left &&
        x <= r.right &&
        y >= r.top &&
        y <= r.bottom
      );
    });
    if (over) {
      this.parentNode.insertBefore(
        this,
        cards.indexOf(this) < cards.indexOf(over)
          ? over.nextElementSibling
          : over,
      );
      this._cardMoved();
    }
  }

  dragStartCallback(e) {
    if (!this.disabled && this.layout === "cards") {
      this.dragging = true;
      this._cardDrag(e);
      return;
    }
    if (!this.disabled) {
      this.dragging = true;
      // distance above or below current pos to switch index
      let changeBuffer = 64;
      //if slottted images increase change buffer size
      if (this.querySelectorAll("img").length > 0) {
        changeBuffer = 92;
      }
      let posY = e.clientY;
      //drag stop counts as drag for some reason so make sure not to set drag pos to zero
      if (posY != 0 && posY > 0) {
        this.dragPosition = posY;
      }
      let element = this;
      let parent = this.parentNode;
      //going up
      if (this.dragPosition + changeBuffer < this.currentPosition) {
        //find old index
        let oldIndex;
        for (let i = 0; i < parent.children.length; i++) {
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
        let oldIndex;
        for (let i = 0; i < parent.children.length; i++) {
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
      this.dragging = false;
    }
  }

  arrowSort(e) {
    const target = e.target;
    const reduceMotion =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      globalThis.document &&
      globalThis.document.startViewTransition &&
      !reduceMotion
    ) {
      const transition = globalThis.document.startViewTransition(() => {
        this.arrowSortCallback(target);
      });
      transition.ready.catch(() => {});
    } else {
      this.arrowSortCallback(target);
    }
  }
  arrowSortCallback(target) {
    if (!this.disabled && this.layout === "cards") {
      this._cardMove(target.getAttribute("id") === "downArrow" ? 1 : -1);
      return;
    }
    if (!this.disabled) {
      let parent = this.parentNode;
      //set new index
      if (target.getAttribute("id") === "downArrow") {
        if (
          this.nextElementSibling &&
          this.nextElementSibling.tagName === "SORTING-OPTION"
        ) {
          let ref = parent.insertBefore(this.nextElementSibling, this);
          // focus the inner button of the moved option's arrow control,
          // matching the upArrow branch below; the arrow host itself has
          // no delegatesFocus so focusing it drops keyboard focus
          ref.shadowRoot
            .querySelector("#downArrow")
            .shadowRoot.querySelector("button")
            .focus();
        }
      } else {
        if (
          this.previousElementSibling &&
          this.previousElementSibling.tagName === "SORTING-OPTION"
        ) {
          let ref = parent.insertBefore(this, this.previousElementSibling);
          ref.shadowRoot
            .querySelector("#upArrow")
            .shadowRoot.querySelector("button")
            .focus();
        }
      }
      // give a ghosting effect on move
      this.style.backgroundColor = "var(--ddd-status-answered-bg)";
      setTimeout(() => {
        this.style.backgroundColor = "";
      }, 500);
    }
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      DDDStatusTokens,
      css`
        /* a compact full-width row: position, label, then move buttons */
        :host {
          view-transition-name: sort-option;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          width: 100%;
          min-height: var(--ddd-control-height-md);
          margin: 0;
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-3) var(--ddd-spacing-1);
          z-index: 1;
          overflow: hidden;
          transition: all var(--ddd-duration-normal, 0.3s) ease-in-out 0s;
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          border-radius: var(--ddd-radius-sm);
          background-color: transparent;
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          --simple-icon-height: var(--ddd-icon-3xs);
          --simple-icon-width: var(--ddd-icon-3xs);
        }
        /* a card needs an edge that shows on any page; the status, hover
           and drag rules below still replace it */
        :host([layout="cards"]) {
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
        }
        button[disabled]:not([correct]):not([incorrect]) {
          opacity: var(--ddd-opacity-80, 0.7);
        }
        :host(:not([disabled])) {
          cursor: grab;
        }
        :host([correct]) {
          border-width: var(--ddd-border-size-sm);
          border-style: var(--ddd-status-correct-line);
          border-color: var(--ddd-status-correct-signal);
        }
        :host([incorrect]) {
          border-width: var(--ddd-border-size-sm);
          border-style: var(--ddd-status-incorrect-line);
          border-color: var(--ddd-status-incorrect-signal);
        }
        .icon {
          display: block;
          height: var(--ddd-icon-3xs);
          width: var(--ddd-icon-3xs);
        }
        :host([correct]) .icon {
          --simple-icon-color: var(--ddd-status-correct-ink);
          color: var(--ddd-status-correct-ink);
        }
        :host([incorrect]) .icon {
          --simple-icon-color: var(--ddd-status-incorrect-ink);
          color: var(--ddd-status-incorrect-ink);
        }
        .option-slot-wrapper {
          display: flex;
          flex: 1 1 auto;
          min-width: 0;
          align-items: center;
          gap: var(--ddd-spacing-3);
          z-index: 2;
          background-color: transparent;
          border: none;
          text-align: inherit;
          overflow-wrap: anywhere;
        }
        div ::slotted(img) {
          height: var(--ddd-icon-lg);
          width: auto;
          pointer-events: none;
        }
        .arrow-container {
          display: flex;
          flex: none;
          align-items: center;
          gap: var(--ddd-spacing-1);
          background-color: transparent;
        }
        /* the result icon only takes room once answers are checked */
        .feedback-container {
          display: flex;
          flex: none;
          background-color: transparent;
        }
        :host(:not([correct]):not([incorrect])) .feedback-container {
          display: none;
        }
        :host([dragging]) {
          background-color: var(--ddd-status-answered-bg);
          border-color: var(--ddd-status-answered-signal);
        }
        :host(:focus-within:not([disabled])),
        :host(:hover:not([disabled])) {
          border-color: var(--ddd-status-answered-signal);
          background-color: var(--ddd-status-answered-bg);
          box-shadow: var(--ddd-boxShadow-sm);
        }
        simple-icon-button-lite {
          width: var(--ddd-control-height-sm);
          height: var(--ddd-control-height-sm);
          border-radius: var(--ddd-radius-sm);
          border: none;
          background-color: transparent;
          color: var(--ddd-status-answered-ink);
        }
        simple-icon-button-lite::part(button) {
          border: none;
          border-radius: var(--ddd-radius-sm);
          outline-offset: 2px;
        }
        :host(:not([disabled])) simple-icon-button-lite:hover,
        :host(:not([disabled])) simple-icon-button-lite:focus,
        :host(:not([disabled])) simple-icon-button-lite:focus-within {
          /* the move arrows take the palette accent (data-palette) */
          background-color: var(
            --ddd-palette-accent,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            )
          );
          color: var(
            --ddd-palette-accent-ink,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-potentialMidnight)
            )
          );
        }
        :host([disabled]) simple-icon-button-lite {
          color: var(--ddd-status-disabled-ink);
        }
        /* ---------- card layout: position, image, label, move buttons ---------- */
        :host([layout="cards"]) {
          display: grid;
          justify-items: center;
          align-content: start;
          gap: var(--ddd-spacing-1);
          width: auto;
          min-width: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-md);
          text-align: center;
        }
        :host([layout="cards"]) .option-slot-wrapper {
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          width: 100%;
        }
        :host([layout="cards"][correct]) {
          background-color: var(--ddd-status-correct-bg);
        }
        :host([layout="cards"][incorrect]) {
          background-color: var(--ddd-status-incorrect-bg);
        }
        .card-status {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
        }
        :host([correct]) .card-status {
          color: var(--ddd-status-correct-ink);
        }
        :host([incorrect]) .card-status {
          color: var(--ddd-status-incorrect-ink);
        }
        :host([layout="cards"]) simple-icon-button-lite[disabled] {
          color: var(--ddd-status-disabled-ink);
        }
      `,
    ];
  }

  // the card layout: the slot (image and label), the result once checked,
  // then a move earlier and a move later button on every card
  renderCard() {
    const label = this._cardLabel();
    const earlier = label
      ? `${this.t.moveEarlier}: ${label}`
      : this.t.moveEarlier;
    const later = label ? `${this.t.moveLater}: ${label}` : this.t.moveLater;
    return html`
      <div class="option-slot-wrapper"><slot></slot></div>
      ${
        this.correct || this.incorrect
          ? html`<div class="card-status">
              <simple-icon-lite
                class="icon"
                icon="${this.correct ? "check" : "clear"}"
                aria-hidden="true"
              ></simple-icon-lite
              >${this.correct ? this.t.correct : this.t.incorrect}
            </div>`
          : ""
      }
      <div class="arrow-container">
        <simple-icon-button-lite
          id="upArrow"
          ?disabled="${this.disabled || this._first}"
          icon="arrow-back"
          @click="${this.arrowSort}"
          label="${earlier}"
          title="${this.t.moveEarlier}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          id="downArrow"
          ?disabled="${this.disabled || this._last}"
          icon="arrow-forward"
          @click="${this.arrowSort}"
          label="${later}"
          title="${this.t.moveLater}"
        ></simple-icon-button-lite>
      </div>
    `;
  }

  // HTML - specific to Lit
  render() {
    if (this.layout === "cards") {
      return this.renderCard();
    }
    return html`
      <div class="feedback-container">
        ${
          this.correct || this.incorrect
            ? html`<simple-icon-lite
                class="icon"
                icon="${this.correct ? "check" : "clear"}"
                title="${
                  this.correct
                    ? this.t.answerInCorrectOrder
                    : this.t.answerInIncorrectOrder
                }"
              ></simple-icon-lite>`
            : html`<div class="icon"></div>`
        }
      </div>
      <div class="option-slot-wrapper"><slot></slot></div>
      <div class="arrow-container">
        <simple-icon-button-lite
          id="upArrow"
          ?disabled="${this.disabled}"
          icon="arrow-upward"
          @click="${this.arrowSort}"
          title="${this.t.moveOptionUp}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          id="downArrow"
          ?disabled="${this.disabled}"
          icon="arrow-downward"
          @click="${this.arrowSort}"
          title="${this.t.moveOptionDown}"
        ></simple-icon-button-lite>
      </div>
    `;
  }
}

//define element

globalThis.customElements.define(SortingOption.tag, SortingOption);
