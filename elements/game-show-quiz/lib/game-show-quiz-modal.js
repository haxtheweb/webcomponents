import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-dialog/paper-dialog.js";
/**
 * `game-show-quiz-modal`
 * `Modal for the quiz show`
 * @microcopy - the mental model for this element
 * - game show - a display board in the style of Jeopardy
 */
class GameShowQuizModal extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #dialog {
          min-width: 60%;
          top: 5%;
          bottom: 5%;
          margin: 0;
          padding: 0;
          left: 15%;
          right: 15%;
          position: fixed;
          overflow: hidden;
        }
        .content {
          font-size: 16px;
          overflow: scroll;
          min-height: 60vh;
          height: 80vh;
          margin: 0;
          padding: 0;
        }
        h2 {
          font-size: 32px;
          background-color: var(--game-show-bg-color);
          color: var(--game-show-text-color);
          margin: 0;
          padding: 16px;
          text-align: center;
        }
        .buttons {
          font-size: 20px;
          font-weight: bold;
          background-color: var(--game-show-bg-color);
          bottom: 0;
          position: absolute;
          left: 0;
          right: 0;
        }
        .buttons ::slotted(*) {
          width: 50%;
          margin: 0 auto;
          color: var(--game-show-bg-color);
          background-color: var(--game-show-text-color);
        }
        .buttons ::slotted(*[disabled]) {
          background: #eaeaea;
          color: #a8a8a8;
        }
        .buttons ::slotted(#continue) {
          color: #004400;
          background-color: #eeffee;
        }
        @media screen and (max-width: 600px) {
          #dialog {
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
          h2 {
            font-size: 20px;
          }
          .buttons {
            font-size: 12px;
          }
          .buttons ::slotted(*) {
            width: 100%;
          }
          .content {
            font-size: 12px;
          }
        }
      </style>
      <paper-dialog id="dialog" modal="">
        <h2>[[title]]</h2>
        <div class="content"><slot name="content"></slot></div>
        <div class="buttons"><slot name="buttons"></slot></div>
      </paper-dialog>
    `;
  }

  static get tag() {
    return "game-show-quiz-modal";
  }
  static get properties() {
    return {
      /**
       * Title
       */
      title: {
        type: String
      }
    };
  }
  toggle() {
    this.$.dialog.toggle();
  }
}
window.customElements.define(GameShowQuizModal.tag, GameShowQuizModal);
export { GameShowQuizModal };
