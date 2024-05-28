import { LitElement, css, html } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import "@haxtheweb/simple-datetime/simple-datetime.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-picker/lib/simple-emoji-picker.js";

export class PageFlagComment extends LitElement {
  static get tag() {
    return "page-flag-comment";
  }
  static get properties() {
    return {
      seed: {
        type: String,
      },
      timestamp: {
        type: Number,
      },
      mood: {
        type: String,
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      canEdit: {
        type: Boolean,
      },
      reply: {
        type: Number,
        reflect: true,
      },
      readOnly: {
        type: Boolean,
      },
    };
  }
  testCanUpdate(user) {
    if (this.seed === user) {
      this.canEdit = true;
    } else {
      this.canEdit = false;
    }
  }
  constructor() {
    super();
    this.mood = null;
    this.seed = "abc123";
    this.timestamp = Date.now() / 1000;
    this.reply = 0;
    this.editMode = false;
    this.canEdit = false;
    this.readOnly = true;
    this.haxUIElement = true;
  }
  deleteOp() {
    this.dispatchEvent(
      new CustomEvent("page-flag-comment-delete", {
        bubbles: true,
        cancelable: true,
        detail: this,
      }),
    );
  }
  replyOp() {
    this.dispatchEvent(
      new CustomEvent("page-flag-comment-reply", {
        bubbles: true,
        cancelable: true,
        detail: this,
      }),
    );
  }
  editOp() {
    this.dispatchEvent(
      new CustomEvent("page-flag-comment-edit", {
        bubbles: true,
        cancelable: true,
        detail: this,
      }),
    );
  }
  render() {
    return html`
      <div class="comment">
        ${this.editMode
          ? html`<simple-emoji-picker
              align-right
              label="Reaction"
              value="${this.mood}"
              @value-changed="${this.emojiChanged}"
            ></simple-emoji-picker>`
          : html`<div class="emoji" .innerHTML="${this.mood}"></div>`}
        <div class="comment__header">
          <div class="comment__header__avatar">
            <rpg-character
              seed="${this.seed}"
              width="40"
              height="40"
              hat="${this.editMode ? "edit" : "none"}"
            ></rpg-character>
          </div>
          <div class="comment__header__info">
            <div class="comment__header__info__name">${this.seed}</div>
            <div class="comment__header__info__date">
              <simple-datetime
                format="m/j/y h:i"
                .timestamp="${this.timestamp}"
                unix
              ></simple-datetime>
            </div>
          </div>
        </div>
        <div class="comment__body">
          <simple-fields-field type="textarea"></simple-fields-field>
          <slot></slot>
        </div>
        <div class="comment__footer">
          <div class="comment__footer__actions">
            ${!this.readOnly
              ? html`
                  ${this.canEdit
                    ? html`<simple-icon-button
                        icon="${this.editMode ? "save" : "editor:mode-edit"}"
                        title="${this.editMode ? "Edit" : "Update"}"
                        @click="${this.editOp}"
                      ></simple-icon-button> `
                    : ``}
                  <simple-icon-button
                    icon="reply"
                    title="Reply"
                    @click="${this.replyOp}"
                  ></simple-icon-button>
                  ${this.canEdit
                    ? html`<simple-icon-button
                        icon="delete"
                        title="Delete"
                        @click="${this.deleteOp}"
                      ></simple-icon-button>`
                    : ``}
                `
              : ``}
          </div>
        </div>
      </div>
    `;
  }
  emojiChanged(e) {
    this.mood = e.detail.value;
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.shadowRoot.querySelector("simple-fields-field").value = this.innerHTML;
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode" && oldValue !== undefined) {
        if (this[propName]) {
          this.shadowRoot.querySelector("simple-fields-field").value =
            this.innerHTML;
          setTimeout(() => {
            this.shadowRoot.querySelector("simple-fields-field").focus();
            this.shadowRoot.querySelector("simple-fields-field").select();
          }, 0);
        } else {
          this.innerHTML = this.shadowRoot.querySelector(
            "simple-fields-field",
          ).value;
        }
      }
    });
  }
  static get styles() {
    return [
      ,
      css`
        :host {
          display: block;
        }
        :host slot {
          display: block;
        }
        :host simple-emoji-picker,
        :host simple-fields-field {
          display: none;
        }
        :host([edit-mode]) simple-emoji-picker,
        :host([edit-mode]) simple-fields-field {
          display: block;
        }
        simple-emoji-picker {
          float: right;
          width: 40px;
        }
        .emoji {
          float: right;
          width: 40px;
          height: 40px;
          font-size: 32px;
        }
        :host([edit-mode]) slot {
          display: none;
        }
        :host([reply="1"]) .comment {
          margin-left: 16px;
        }
        :host([reply="2"]) .comment {
          margin-left: 32px;
        }
        .comment {
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          padding: 10px;
          margin-bottom: 10px;
        }
        simple-icon-button {
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
          margin: 0 6px;
        }
        .comment__header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .comment__header__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid black;
          margin-right: 8px;
        }
        .comment__header__info {
          display: flex;
          flex-direction: column;
        }
        .comment__header__info__name {
          font-weight: bold;
          font-size: 14px;
        }
        .comment__header__info__date {
          font-size: 12px;
          color: #999;
        }
        .comment__body {
          margin-bottom: 10px;
        }
        .comment__footer {
          display: flex;
          justify-content: flex-end;
        }
        .comment__footer__actions {
          display: flex;
        }
        .comment__footer__actions__button {
          background-color: transparent;
          border: none;
          color: #999;
          font-size: 12px;
          cursor: pointer;
          margin-left: 10px;
        }
      `,
    ];
  }
}
customElements.define(PageFlagComment.tag, PageFlagComment);
