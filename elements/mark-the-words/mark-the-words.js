/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 * @demo demo/index.html
 */
// dependencies / things imported
import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";

export class MarkTheWords extends I18NMixin(LitElement) {
  static get tag() {
    return "mark-the-words";
  }

  constructor() {
    super();
    this.answers = null;
    this.correctAnswers = [];
    this.wordList = this.innerText.trim().split(/\s+/g);
    this.question = "Mark the words that are correct";
    this.isEnabled = true;
    this.numberCorrect = 0;
    this.numberGuessed = 0;
    this._haxstate = false;
    this.demoMode = false;
    this.t = {
      check: "Check",
      tryAgain: "Try Again",
      editMode: "Edit Mode",
      tryMode: "Try Mode",
    };
  }

  static get properties() {
    return {
      ...super.properties,
      wordList: { type: Array },
      demoMode: { type: Boolean },
      answers: { type: String },
      correctAnswers: { type: Array },
      missedAnswers: { type: Array },
      question: { type: String },
      isEnabled: { type: Boolean },
      _haxstate: { type: Boolean },
      numberCorrect: { type: Number },
      numberGuessed: { type: Number },
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "wordList") {
        this.rebuildContents(this[propName]);
      }
      if (propName === "answers" && this[propName]) {
        this.correctAnswers = this[propName].split(",");
        for (var i = 0; i < this.correctAnswers.length; i++) {
          this.correctAnswers[i] = this.correctAnswers[i].toUpperCase();
        }
      }
      if (
        propName === "numberCorrect" &&
        this.numberCorrect === this.numberGuessed &&
        this.numberCorrect !== 0 &&
        this.numberGuessed !== 0
      ) {
        import(
          "@lrnwebcomponents/multiple-choice/lib/confetti-container.js"
        ).then((module) => {
          setTimeout(() => {
            this.shadowRoot
              .querySelector("#confetti")
              .setAttribute("popped", "");
          }, 0);
        });
      }
    });
  }

  rebuildContents(ary) {
    //wipe out inner
    this.shadowRoot.querySelector(".text").innerHTML = "";
    ary.forEach((word) => {
      let button = document.createElement("button");
      button.innerText = word;
      button.addEventListener("click", this.selectWord.bind(this));
      this.shadowRoot.querySelector(".text").appendChild(button);
    });
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      css`
        :host {
          display: grid;
          padding: 16px;
          margin: 0px;
          border: 2px solid black;
        }
        simple-toolbar-button {
          font-size: 24px;
        }
        button {
          display: inline-flex;
          font-size: var(--x-ample-font-size, 24px);
          padding: 8px 16px;
          margin: 0 4px;
          border-radius: none;
          transition: outline 0.2s ease-in-out;
        }
        button:active,
        button:hover,
        button:focus {
          outline: 3px dashed blue;
          cursor: pointer;
        }
        button[data-selected] {
          outline: 3px solid orange;
        }
        button[data-selected]:hover,
        button[data-selected]:focus {
          outline: 3px solid blue;
        }
        button[data-status="correct"] {
          outline: 3px solid green;
        }
        button[data-status="correct"]::after {
          content: "+1";
          color: green;
          font-size: 14px;
          font-weight: bold;
          border-radius: 50%;
          border: 3px solid green;
          padding: 6px;
          margin-left: 14px;
          line-height: 14px;
          height: 14px;
          width: 14px;
        }
        button[data-status="incorrect"] {
          outline: 3px solid purple;
        }
        button[data-status="incorrect"]::after {
          content: "-1";
          font-size: 14px;
          color: purple;
          font-weight: bold;
          border-radius: 50%;
          border: 3px solid purple;
          padding: 6px;
          margin-left: 14px;
          line-height: 14px;
          height: 14px;
          width: 14px;
        }
        button[check-mode="active"] {
          pointer-events: none;
        }
        .buttons {
          grid-column: 1;
          grid-row: 3;
          margin: 8px;
          display: flex;
        }
        .correct {
          grid-column: 1;
          grid-row: 3;
          margin-top: 20px;
        }
        .question {
          margin-bottom: 0px;
          margin-top: 0px;
          grid-column: 1;
          grid-row: 1;
          font-size: 32px;
        }
        .text {
          grid-column: 1;
          grid-row: 2;
          margin: 16px;
          border: 2px solid black;
          padding: 16px;
        }
        .scoreExp {
          margin-top: 1px;
          margin-bottom: 1px;
          text-decoration: underline;
        }

        .score {
          margin: 0 16px;
          font-size: 22px;
          font-weight: bold;
          line-height: 30px;
          display: inline-block;
          vertical-align: middle;
        }
      `,
    ];
  }

  selectWord(e) {
    if (e.target.getAttribute("data-selected")) {
      e.target.removeAttribute("data-selected");
    } else {
      e.target.setAttribute("data-selected", "data-selected");
    }
  }

  checkAnswer(e) {
    if (this.isEnabled) {
      this.isEnabled = false;
      for (var i = 0; i < this.wordList.length; i++) {
        if (
          this.correctAnswers.includes(
            this.wordList[i].replace(/[&#^,+()$~%.":*?<>{}]/g, "").toUpperCase()
          )
        ) {
          this.numberCorrect++;
        }
      }

      const selected = this.shadowRoot.querySelectorAll(
        ".text button[data-selected]"
      );
      for (var i = 0; i < selected.length; i++) {
        const el = selected[i];

        if (
          this.correctAnswers.includes(
            el.innerText.replace(/[&#^,+()$~%.":*?<>{}]/g, "").toUpperCase()
          )
        ) {
          el.setAttribute("data-status", "correct");
          this.numberGuessed++;
        } else {
          el.setAttribute("data-status", "incorrect");
          if (this.numberGuessed > 0) {
            this.numberGuessed--;
          }
        }
      }
      const allWords = this.shadowRoot.querySelectorAll(".text button");
      for (var i = 0; i < allWords.length; i++) {
        const el = allWords[i];

        el.setAttribute("check-mode", "active");
      }
    } else {
      this.isEnabled = true;
      this.numberGuessed = 0;
      this.numberCorrect = 0;
      const selected = this.shadowRoot.querySelectorAll(
        ".text button[data-selected]"
      );
      for (var i = 0; i < selected.length; i++) {
        const el = selected[i];

        if (el.getAttribute("data-status")) {
          el.removeAttribute("data-status");
          el.removeAttribute("data-selected");
        }
      }
      const allWords = this.shadowRoot.querySelectorAll(".text button");
      for (var i = 0; i < allWords.length; i++) {
        const el = allWords[i];

        el.setAttribute("check-mode", "inactive");
      }
    }
  }

  // HTML - specific to Lit
  render() {
    return html`
      <confetti-container id="confetti">
        <p class="question">${this.question}</p>
        ${this._haxstate && this.demoMode
          ? html`<slot></slot>`
          : html`<div class="text"></div>`}
        <div class="buttons">
          <simple-toolbar-button
            @click="${this.checkAnswer}"
            icon="${this.isEnabled ? "check" : "refresh"}"
            label="${this.isEnabled ? this.t.check : this.t.tryAgain}"
            show-text-label
            icon-position="left"
            align-vertical="center"
            align-horizontal="center"
          ></simple-toolbar-button>
          <span class="score">
          ${this.isEnabled
            ? ``
            : html`${this.numberGuessed}/${this.numberCorrect}
              ${Math.round(
                10 * ((this.numberGuessed / this.numberCorrect) * 100)
              ) / 10}%`}
          </span>
          ${this._haxstate
            ? html`<simple-toolbar-button
                @click="${this.toggleDemo}"
                icon="${this.demoMode ? "av:play-circle-filled" : "image:edit"}"
                label="${this.demoMode ? this.t.tryMode : this.t.editMode}"
                show-text-label
                icon-position="left"
                align-vertical="center"
                align-horizontal="center"
              ></simple-toolbar-button>`
            : ``}
        </div>
      </confetti-container>
    `;
  }

  toggleDemo() {
    this.demoMode = !this.demoMode;
    // rebuild wordList when we go OUT of demo mode
    if (!this.demoMode) {
      this.wordList = this.innerText.trim().split(/\s+/g);
    }
  }

  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this._haxstate = value;
    }
  }

  haxeditModeChanged(value) {
    this._haxstate = value;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

customElements.define(MarkTheWords.tag, MarkTheWords);
