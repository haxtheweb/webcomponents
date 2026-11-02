import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "../flash-card.js";

export class FlashCardSet extends I18NMixin(DDD) {
  static get tag() {
    return "flash-card-set";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      previousCard: "Previous card",
      nextCard: "Next card",
      practice: "Practice",
      flashCards: "Flash cards",
      cardCount: "{current} of {total}",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this.questions = [];
    this.currentQuestion = 0;
    this.cardLength = 4;
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      questions: {
        type: Array,
      },
    };
  }

  updated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.renderTags();
  }
  _prevCard() {
    if (this.currentQuestion > 0) {
      this.currentQuestion -= 1;
      this.changeVisible();
    }
  }
  _nextCard() {
    if (this.currentQuestion < this.questions.length / 4 - 1) {
      this.currentQuestion += 1;
      this.changeVisible();
    }
  }
  /**
   * Block header type label, with the position in the set once it has cards
   */
  _frameLabel() {
    const total = this.questions.length / this.cardLength;
    let label = `${this.t.practice} · ${this.t.flashCards}`;
    if (total > 0) {
      label +=
        " · " +
        this.t.cardCount
          .replace("{current}", () => String(this.currentQuestion + 1))
          .replace("{total}", () => String(total));
    }
    return label;
  }
  /**
   * The cards are built imperatively and moving between them must not
   * re-render (that would rebuild every card and drop answers in progress),
   * so the header counter and the previous / next states are synced by hand
   */
  _syncHeader() {
    if (!this.shadowRoot) {
      return;
    }
    const label = this.shadowRoot.querySelector(".frame-label");
    if (label) {
      label.textContent = this._frameLabel();
    }
    const total = this.questions.length / this.cardLength;
    const prev = this.shadowRoot.querySelector(".arrow-left");
    const next = this.shadowRoot.querySelector(".arrow-right");
    if (prev) {
      prev.disabled = this.currentQuestion <= 0;
    }
    if (next) {
      next.disabled = this.currentQuestion >= total - 1;
    }
  }

  getData() {
    const slotData2 = this.shadowRoot
      .querySelector(`slot`)
      .assignedNodes({ flatten: true })[1].childNodes;
    const questionData = ["", "", "", ""];

    for (let i = 0; i < slotData2.length; i++) {
      if (i % 2 === 1) {
        for (let j = 0; j < slotData2[i].childNodes.length; j++) {
          if (j % 2 === 1) {
            const { slot } = slotData2[i].childNodes[j];
            if (slot === "front") {
              questionData[0] = slotData2[i].childNodes[j].innerHTML;
            }
            if (slot === "back") {
              questionData[1] = slotData2[i].childNodes[j].innerHTML;
            }
            if (slot === "image") {
              questionData[2] = slotData2[i].childNodes[j].innerHTML;
            }
            if (slot === "attributes") {
              questionData[3] = slotData2[i].childNodes[j].innerHTML;
            }
          }
        }

        for (let k = 0; k < questionData.length; k++) {
          this.questions.push(questionData[k]);
        }

        for (let l = 0; l < 4; l++) {
          questionData[l] = "";
        }
      }
    }
  }

  renderTags() {
    // clear prior data and rendered cards so reactive updates rebuild the
    // set instead of doubling questions and appending duplicate cards
    this.questions.length = 0;
    const content = this.shadowRoot.querySelector("#content");
    if (content) {
      content.innerHTML = "";
    }
    this.getData();
    // a rebuild keeps the card the learner was on (and the header counter
    // in step with it) when the set still has that many cards
    const total = this.questions.length / this.cardLength;
    if (this.currentQuestion > total - 1) {
      this.currentQuestion = Math.max(0, total - 1);
    }
    for (let i = 0; i < this.questions.length; i += this.cardLength) {
      this.formatEl(
        i / this.cardLength,
        this.questions[i],
        this.questions[i + 1],
        this.questions[i + 2],
        this.questions[i + 3],
      );
    }
    this._syncHeader();
  }

  formatEl(number) {
    // console.log(this.currentQuestion, this.questions, this.cardLength);
    // create a new element
    const el = globalThis.document.createElement("flash-card");
    el.setAttribute("id", `card${number}`);
    if (number !== this.currentQuestion) {
      el.className = "hidden";
    }
    // add the text
    // the set header names the block, so the card drops its own
    el._inSet = true;
    el.innerHTML = `
      <p slot="front">${arguments[1]}</p>
      <p slot="back">${arguments[2]}</p>`;

    el.setAttribute("img-source", arguments[3]);

    if (arguments[4].includes("dark")) {
      el.setAttribute("dark", "");
    }
    // append it to the parent
    this.shadowRoot.querySelector("#content").appendChild(el);
  }

  changeVisible() {
    for (let i = 0; i < this.questions.length; i += this.cardLength) {
      const el = this.shadowRoot.querySelector(`#card${i / this.cardLength}`);
      if (i / this.cardLength === this.currentQuestion) {
        el.className = "visible";
      } else {
        el.className = "hidden";
      }
    }
    this._syncHeader();
  }

  // CSS - specific to Lit
  static get styles() {
    return css`
      :host {
        display: block;
      }
      /* block header shared with the other DDD learning blocks */
      .frame {
        box-sizing: border-box;
        border: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        border-radius: var(--ddd-radius-md);
        overflow: hidden;
        font-family: var(--ddd-font-primary);
      }
      .frame-header {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-3);
        padding-block: var(--ddd-spacing-2);
        padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
        min-height: var(--ddd-control-height-sm);
        border-bottom: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
      }
      .frame-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        width: var(--ddd-icon-xs);
        height: var(--ddd-icon-xs);
        border-radius: var(--ddd-radius-circle);
        background-color: light-dark(
          var(--ddd-theme-default-beaverBlue),
          var(--ddd-theme-default-skyBlue)
        );
        color: light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-potentialMidnight)
        );
        --simple-icon-width: var(--ddd-icon-3xs);
        --simple-icon-height: var(--ddd-icon-3xs);
      }
      .frame-label {
        flex: 1 1 auto;
        min-width: 0;
        font-family: var(--ddd-font-navigation);
        font-size: var(--ddd-font-size-4xs);
        font-weight: var(--ddd-font-weight-medium);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: light-dark(
          var(--ddd-theme-default-slateGray),
          var(--ddd-theme-default-limestoneLight)
        );
      }
      :host(:lang(ar)) .frame-label,
      :host(:lang(fa)) .frame-label,
      :host(:lang(he)) .frame-label,
      :host(:lang(ur)) .frame-label {
        letter-spacing: 0;
      }
      .frame-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        box-sizing: border-box;
        width: var(--ddd-control-height-sm);
        height: var(--ddd-control-height-sm);
        padding: var(--ddd-spacing-0);
        border: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        border-radius: var(--ddd-radius-rounded);
        background-color: transparent;
        color: light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-linkLight)
        );
        cursor: pointer;
        --simple-icon-width: var(--ddd-icon-4xs);
        --simple-icon-height: var(--ddd-icon-4xs);
      }
      .frame-action:hover:not([disabled]) {
        border-color: light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-linkLight)
        );
      }
      .frame-action:focus-visible {
        outline: var(--ddd-focus-ring);
        outline-offset: var(--ddd-focus-offset);
      }
      .frame-action[disabled] {
        cursor: not-allowed;
        border-style: dashed;
        color: light-dark(
          var(--ddd-theme-default-slateGray),
          var(--ddd-theme-default-limestoneGray)
        );
      }
      .frame-body {
        padding: var(--ddd-spacing-2);
      }
      .frame-body flash-card {
        margin: 0;
        border: 0;
        min-width: 0;
      }
      .visible {
        transform: scale(1);
        display: block;
        transition: all 1s ease-in-out;
        top: 0;
        left: 0;
      }
      .hidden {
        transform: scale(0);
        display: none;
        transition: all 1s ease-in-out;
        top: 0;
        left: 0;
      }
      #content {
        position: relative;
      }
    `;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div id="container" class="frame">
        <div class="frame-header">
          <span class="frame-chip" aria-hidden="true"
            ><simple-icon-lite icon="image:style"></simple-icon-lite
          ></span>
          <span class="frame-label" aria-live="polite"></span>
          <button
            type="button"
            class="frame-action arrow-left"
            aria-label="${this.t.previousCard}"
            title="${this.t.previousCard}"
            @click="${this._prevCard}"
          >
            <simple-icon-lite
              icon="icons:arrow-back"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>
          <button
            type="button"
            class="frame-action arrow-right"
            aria-label="${this.t.nextCard}"
            title="${this.t.nextCard}"
            @click="${this._nextCard}"
          >
            <simple-icon-lite
              icon="icons:arrow-forward"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>
        </div>
        <div class="frame-body">
          <div id="content"></div>
        </div>
        <slot style="display: none"></slot>
      </div>
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`../lib/flash-card.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(FlashCardSet.tag, FlashCardSet);
