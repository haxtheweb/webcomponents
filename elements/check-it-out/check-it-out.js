/**
 * Copyright 2021
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/video-player/video-player";
import "@lrnwebcomponents/lrn-button/lrn-button";
import "@lrnwebcomponents/simple-icon/lib/simple-icons";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button";

/**
 * `check-it-out`
 * `View codepen or stackblitz demos`
 * @demo demo/index.html
 * @element check-it-out
 */
class CheckItOut extends LitElement {
  static get properties() {
    return {
      checkedOut: {
        type: Boolean,
        attribute: "checked-out",
        reflect: true,
      },
      source: {
        type: String,
      },
      type: {
        type: String,
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
        }

        .container {
          display: none;
          position: relative;
          width: var(--check-it-out-width, 800px);
        }

        :host([checked-out]) .container {
          display: flex;
        }

        .check-it-out-btn {
          display: flex;
        }

        :host([checked-out]) .check-it-out-btn {
          display: none;
        }

        .close-btn {
          display: none;
          position: absolute;
          top: 0px;
          right: 0px;
          width: 32px;
          height: 32px;
          opacity: 0.6;
        }

        .close-btn:hover {
          opacity: 1;
        }

        .close-btn:before,
        .close-btn:after {
          position: absolute;
          left: 15px;
          content: " ";
          height: 33px;
          width: 2px;
          background-color: red;
        }

        .close-btn:before {
          transform: rotate(45deg);
        }

        .close-btn:after {
          transform: rotate(-45deg);
        }

        :host([checked-out]) .close-btn {
          display: flex;
        }

        .iframe-container {
          width: var(--check-it-out-iframe-width, 800px);
          height: var(--check-it-out-iframe-height, 500px);
        }

        .video-player {
          width: var(--check-it-out-video-width, 800px);
          height: var(--check-it-out-video-height, 500px);
        }
      `,
    ];
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "check-it-out";
  }

  render() {
    return html`
      ${this.type === "code"
        ? html`<lrn-button
            class="check-it-out-btn"
            icon="code"
            label="Check it out"
            @click="${this._handleClick}"
          ></lrn-button>`
        : this.type === "pdf"
        ? html`<lrn-button
            class="check-it-out-btn"
            icon="book"
            label="Check it out"
            @click="${this._handleClick}"
          ></lrn-button>`
        : this.type === "video"
        ? html`<lrn-button
            class="check-it-out-btn"
            icon="av:play-arrow"
            label="Check it out"
            @click="${this._handleClick}"
          ></lrn-button>`
        : html`<p>None of the above</p>`}
      ${["code", "pdf"].includes(this.type)
        ? html`<div class="container">
            <span class="close-btn" @click="${this._handleClick}"></span>
            <iframe class="iframe-container" src=${this.source}></iframe>
          </div>`
        : html`
            <div class="container">
              <span class="close-btn" @click="${this._handleClick}"></span>
              <video-player
                class="video-player"
                source=${this.source}
              ></video-player>
            </div>
          `}
    `;

    // more readable? preferred approach?
    if (this.type === "video") {
      return html`
        <lrn-button
          class="check-it-out-btn"
          icon="av:play-arrow"
          label="Check it out"
          @click="${this._handleClick}"
        ></lrn-button>
        <div class="container">
          <span class="close-btn" @click="${this._handleClick}"></span>
          <video-player
            class="video-player"
            source=${this.source}
          ></video-player>
        </div>
      `;
    } else if (this.type === "pdf") {
      return html`
        <lrn-button
          class="check-it-out-btn"
          icon="book"
          label="Check it out"
          @click="${this._handleClick}"
        ></lrn-button>
        <div class="container">
          <span class="close-btn" @click="${this._handleClick}"></span>
          <iframe class="iframe-container" src=${this.source}></iframe>
        </div>
      `;
    } else if (this.type === "code") {
      return html`
        <lrn-button
          class="check-it-out-btn"
          icon="code"
          label="Check it out"
          @click="${this._handleClick}"
        ></lrn-button>
        <div class="container">
          <span class="close-btn" @click="${this._handleClick}"></span>
          <iframe class="iframe-container" src=${this.source}></iframe>
        </div>
      `;
    } else {
      return html` <h1>Asset not found!</h1> `;
    }
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.checkedOut = false;
    this.type = "";
  }

  _handleClick() {
    if (this.checkedOut) {
      this.checkedOut = false;
    } else {
      this.checkedOut = true;
    }
  }

  checktype(sourceStr) {
    if (sourceStr.endsWith(".mp4") || sourceStr.includes("youtube.com")) {
      this.type = "video";
    } else if (sourceStr.endsWith(".pdf")) {
      this.type = "pdf";
    } else if (sourceStr.includes("stackblitz.com")) {
      this.type = "code";
      if (!sourceStr.includes("embed=1")) {
        if (sourceStr.includes("?")) {
          sourceStr += "&embed=1";
        } else {
          sourceStr += "?embed=1";
        }
      }
    } else if (sourceStr.includes("codepen.io")) {
      this.type = "code";
      if (!sourceStr.includes("embed")) {
        sourceStr = sourceStr.replace("/pen/", "/embed/");
      }
    }
    return sourceStr;
  }

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {}

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          this.source = this.checktype(this.source);
        }, 0);
      }
    });
  }
}
customElements.define(CheckItOut.tag, CheckItOut);
export { CheckItOut };
