/**
 * Copyright 2021
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin";

/**
 * `check-it-out`
 * `View codepen or stackblitz demos`
 * @demo demo/index.html
 * @element check-it-out
 */
class CheckItOut extends IntersectionObserverMixin(LitElement) {
  static get properties() {
    return {
      ...super.properties,
      checkedOut: {
        type: Boolean,
        attribute: "checked-out",
        reflect: true,
      },
      source: {
        type: String,
      },
      __computedSource: {
        type: String
      },
      type: {
        type: String,
        reflect: true,
      },
      label: {
        type: String,
        reflect: true,
      },
      modal: {
        type: Boolean,
        reflect: true,
      },
      // stackblitz file path
      filePath: {
        type: String,
        attribute: "file-path",
      },
      // hides stackblitz file explorer pane
      hideExplorer: {
        type: Boolean,
        attribute: "hide-explorer",
      }
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
          display: block;
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
    let icon = "";
    if (this.type === "code"){icon = "code"}
    else if (this.type === "pdf"){icon = "book"}
    else if (this.type === "video"){icon = "av:play-arrow"}
    return  html` ${this.elementVisible ? html`
        <button class="check-it-out-btn" @click="${this._handleClick}">
          <simple-icon-lite  icon="${icon}">
          </simple-icon-lite>
          ${this.label}
          <slot></slot>
        </button>
      <!-- <simple-modal opened=${this.checkedOut}> -->
      ${["code", "pdf"].includes(this.type)
        ? html`<div class="container">
            <iframe-loader>
              <span class="close-btn" @click="${this._handleClick}"></span>
              <iframe class="iframe-container" src=${this.__computedSource} loading="lazy"></iframe>
            </iframe-loader>
          </div>`
        : html`
            <div class="container">
              <span class="close-btn" @click="${this._handleClick}" sandbox></span>
              <video-player
                class="video-player"
                source=${this.__computedSource}
              ></video-player>
            </div>
          `}
        <!-- </simple-modal> -->
    ` : ``}`;
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.checkedOut = false;
    this.type = "";
    this.hideExplorer = false;
  }

  _handleClick() {
    if (this.checkedOut) {
      this.checkedOut = false;
    } else {
      this.checkedOut = true;
    }
  }

  checkType(sourceStr) {
    // if (this.type){return sourceStr;}
    let videoTypes = [".mp4", ".mkv", ".flv", ".wmv"];
    if (videoTypes.filter(type => sourceStr.endsWith(type)).length > 0 || sourceStr.includes("youtube.com")) {
      this.type = "video";
      import("@lrnwebcomponents/video-player/video-player");
    } else if (sourceStr.endsWith(".pdf")) {
      this.type = "pdf";
      import("@lrnwebcomponents/iframe-loader/iframe-loader");
    } else if (sourceStr.includes("stackblitz.com")) {
      this.type = "code";
      import("@lrnwebcomponents/iframe-loader/iframe-loader");
      if (!sourceStr.includes("embed=1")) {
        if (sourceStr.includes("?")) {
          sourceStr += "&embed=1";
        } else {
          sourceStr += "?embed=1";
        }
      }
      sourceStr = this.checkStackblitzProps(sourceStr);
    } else if (sourceStr.includes("codepen.io")) {
      this.type = "code";
      import("@lrnwebcomponents/iframe-loader/iframe-loader");
      if (!sourceStr.includes("embed")) {
        sourceStr = sourceStr.replace("/pen/", "/embed/");
      }
    }
    return sourceStr;
  }

  checkStackblitzProps(sourceStr){
    if (this.filePath) {
      sourceStr += "&file=" + this.filePath;
    }
    console.log(this.hideExplorer);
    if (this.hideExplorer) {
      sourceStr += "&hideExplorer=1";
    }
    return sourceStr;
  }

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated){
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          this.__computedSource = this.checkType(this.source);
        }, 0);
      }
      else if (propName === "modal" && this[propName]){
        import("@lrnwebcomponents/simple-modal/simple-modal");
      }
    });
  }
}
customElements.define(CheckItOut.tag, CheckItOut);
export { CheckItOut };
