import { LitElement, html, css } from "lit-element/lit-element.js";

import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/word-count/word-count.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
class LrnappStudioSubmissionComment extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
      
      `
    ];
  }
  render() {
    return html`
      <style>
        :host {
          display: flex;
        }
        paper-card {
          margin: 20px;
          padding: 16px;
        }
        h1,
        h2,
        h3,
        h4 {
          text-align: left;
        }
        p {
          font-size: 14px;
          line-height: 18px;
          text-align: left;
        }
        .nowrap p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .right-actions {
          float: right;
        }
        .paper-card-length-1 {
          width: 85%;
          margin-bottom: 8px;
        }
        .paper-card-length-2 {
          width: 81%;
          margin-top: 0;
          margin-bottom: 8px;
        }
        .paper-card-length-3 {
          width: 77%;
          margin-top: 0;
          margin-bottom: 8px;
        }
        .comment-depth-2 {
          margin: 8px;
        }
        .comment-depth-3 {
          margin: 16px;
        }
        .comment-depth-4 {
          margin: 16px;
        }
        .comment-depth-5 {
          margin: 16px;
        }
        .comment-depth-6 {
          margin: 16px;
        }
        .center {
          padding: 0;
        }
      </style>
      <div class="center comment-depth-[[comment.attributes.threadDepth]]">
        <lrndesign-avatar
          label="[[comment.relationships.author.data.name]]"
          class="float-left"
        ></lrndesign-avatar>
      </div>
      <paper-card
        class="paper-card-length-[[comment.attributes.threadDepth]]"
      >
        <div id="body" class="comment-body nowrap">
          <h4>
            [[comment.relationships.author.data.name]]
            <span class="grey-said"> said:</span>
          </h4>
          <word-count>[[comment.attributes.body]]</word-count>
        </div>
        <div class="card-actions">
          <paper-icon-button
            class="right-actions"
            id="reply"
            icon="icons:reply"
          ></paper-icon-button>
          <paper-tooltip for="reply" animation-delay="0">Reply</paper-tooltip>
          <paper-icon-button
            class="right-actions"
            id="edit"
            icon="icons:create"
          ></paper-icon-button>
          <paper-tooltip for="edit" animation-delay="0">Edit</paper-tooltip>
          <paper-icon-button
            class="right-actions"
            id="delete"
            icon="icons:delete-forever"
          ></paper-icon-button>
          <paper-tooltip for="delete" animation-delay="0">Delete</paper-tooltip>
        </div>
      </paper-card>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-comment";
  }
  static get properties() {
    return {
      comment: {
        type: Object
      }
    };
  }
  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.shadowRoot.querySelector("#body").addEventListener("click", e => {
        this.shadowRoot.querySelector("#body").classList.toggle("nowrap");
      });
    });
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    this.shadowRoot.querySelector("#body").removeEventListener("click", e => {
      this.shadowRoot.querySelector("#body").classList.toggle("nowrap");
    });
    super.disconnectedCallback();
  }
}
window.customElements.define(
  LrnappStudioSubmissionComment.tag,
  LrnappStudioSubmissionComment
);
export { LrnappStudioSubmissionComment };
