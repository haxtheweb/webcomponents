/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `flash-card`
 * @element flash-card
 * @demo demo/index.html
 */
class FlashCard extends SchemaBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        div.card {
          -webkit-perspective: 800;
          width: 400px;
          height: 300px;
          position: relative;
          padding: 0;
          margin: 0;
          box-shadow: 0 5px 5px rgba(0, 0, 0, 0.7);
        }
        div.card.flipped {
          -webkit-transform: rotatex(-180deg);
        }
        div.card.flipped .back {
          z-index: 3;
        }
        div.card {
          -webkit-transform-style: preserve-3d;
          -webkit-transition: 0.5s;
        }
        div.card .face {
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          cursor: pointer;
          position: absolute;
          -webkit-backface-visibility: hidden;
          z-index: 2;
          font-family: Georgia;
          font-size: 48px;
          text-align: center;
          line-height: 200px;
        }
        div.card .front {
          position: absolute;
          z-index: 1;
        }
        div.card .back {
          -webkit-transform: rotatex(-180deg);
        }
      </style>
      <div class="card" id="card" animated-shadow="true">
        <div class="face front white black-text">Front</div>
        <div class="face back black white-text">Back</div>
      </div>
    `;
  }

  static get tag() {
    return "flash-card";
  }

  static get properties() {
    return {
      ...super.properties,

      /**
       * Title
       */
      title: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    setTimeout(() => {
      this.addEventListener("mouseenter", this._flipup.bind(this));
      this.addEventListener("mouseleave", this._flipback.bind(this));
    }, 0);
  }

  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Flash card",
        description: "Flip the card over to learn the term",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Education", "Interactive"],
        handles: [],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title",
          },
        ],
        advanced: [],
      },
    };
  }

  /**
   * Flip up
   */
  _flipup(e) {
    this.shadowRoot.querySelected("#card").classList.add("flipped");
  }

  /**
   * Flip back
   */
  _flipback(e) {
    this.shadowRoot.querySelected("#card").classList.remove("flipped");
  }
}
window.customElements.define(FlashCard.tag, FlashCard);
export { FlashCard };
