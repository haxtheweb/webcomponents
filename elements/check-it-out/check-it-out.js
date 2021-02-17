/**
 * Copyright 2021
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";

/**
 * `check-it-out`
 * `View codepen or stackblitz demos`
 * @demo demo/index.html
 * @element check-it-out
 */
class CheckItOut extends IntersectionObserverMixin(LitElement) {
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Check it out",
        description: "Clickable button for media and code previews",
        icon: "check-circle",
        color: "grey",
        groups: ["developer", "code", "video", "pdf"],
        handles: [],
        meta: {
          author: "collinkleest",
          owner: "ELMS:LN",
        },
      },
      settings: {
        configure: [
          {
            property: "source",
            title: "Resource url",
            description: "Resource url",
            inputMethod: "textfield",
          },
          {
            property: "icon",
            title: "Icon",
            description: "Icon for button",
            inputMethod: "textfield",
          },
          {
            property: "type",
            title: "Type of resource",
            description: "Type of resource in url (video, code, pdf)",
            inputMethod: "select",
            options: {
              code: "Code Snippet",
              video: "Video",
              pdf: "PDF / Document",
            },
          },
          {
            property: "label",
            title: "Button label",
            description: "Text to display in check-it-out button",
            inputMethod: "textfield",
          },
          {
            property: "modal",
            title: "Enable Modal Mode",
            description: "Puts content inside a popup modal",
            inputMethod: "boolean",
          },
          {
            property: "modal-title",
            title: "Popup Modal Title",
            description: "Puts a title at the top of popup modal",
            inputMethod: "textfield",
          },
          {
            property: "filePath",
            title: "File Path",
            description: "File path for stackblitz embed",
            inputMethod: "textfield",
          },
          {
            property: "hideExplorer",
            title: "Hide file explorer",
            description: "Hide the file explorer in a stackblitz embed",
            inputMethod: "boolean",
          },
          {
            property: "ctl",
            title: "Click to load stackblitz",
            description: "Require click to load stackblitz embed",
            inputMethod: "boolean",
          },
          {
            property: "view",
            title: "View",
            description: "Stackblitz default view (preview, editor, or both)",
            inputMethod: "select",
            options: {
              preview: "Preview",
              editor: "Editor",
              both: "Both",
            },
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "check-it-out",
          properties: {
            org: "elmsln",
            repo: "lrnwebcomponents",
          },
          content: "",
        },
      ],
    };
  }

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
      // icon for button
      icon: {
        type: String,
      },
      // modified source depending on media type
      __computedSource: {
        type: String,
      },
      // type of media (i.e. pdf, video, codepen, stackblitz)
      type: {
        type: String,
        reflect: true,
      },
      // button text
      label: {
        type: String,
        reflect: true,
      },
      // stackblitz file path
      filePath: {
        type: String,
        attribute: "file-path",
      },
      // modal header
      modalTitle: {
        type: String,
        attribute: "modal-title",
      },
      // hides stackblitz file explorer pane
      hideExplorer: {
        type: Boolean,
        attribute: "hide-explorer",
      },
      // require user to click to load stackblitz embed
      ctl: {
        type: Boolean,
      },
      // stackblitz "editor", "preview" or "both" open by default
      view: {
        type: String,
      },
      modal: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          --check-it-out-content-width: var(
            --check-it-out-container-width,
            800px
          );
          --check-it-out-content-height: 500px;
        }

        .container {
          display: none;
          position: relative;
          width: var(--check-it-out-container-width, 800px);
        }

        :host([checked-out]) .container {
          display: flex;
        }

        .check-it-out-btn {
          display: inline-flex;
          background-color: transparent;
          font-size: var(--check-it-out-modal-button-font-size, 18px);
          border: 2px solid var(--check-it-out-button-border-color, #000);
          font-weight: 700;
          padding: 10px 25px;
        }

        .check-it-out-btn:active,
        .check-it-out-btn:focus,
        .check-it-out-btn:hover {
          outline: 2px dashed var(--check-it-out-button-border-color, #000);
          outline-offset: 2px;
        }

        :host([checked-out]) .check-it-out-btn {
          display: none;
        }

        :host([checked-out]) .close-btn {
          display: flex;
        }

        .close-btn {
          display: none;
          border-radius: 50%;
          padding: 0.5em;
          width: 30px;
          height: 30px;
          border: 2px solid black;
          color: grey;
          position: absolute;
          top: -10px;
          right: -10px;
          z-index: 2;
        }

        .close-btn:hover {
          border: 2px solid black;
          background-color: grey;
          color: #ffffff;
        }

        .close-btn::before {
          content: " ";
          position: absolute;
          background-color: black;
          width: 2px;
          left: 12px;
          top: 5px;
          bottom: 5px;
          transform: rotate(45deg);
        }

        .close-btn::after {
          content: " ";
          position: absolute;
          background-color: black;
          height: 2px;
          top: 12px;
          left: 5px;
          right: 5px;
          transform: rotate(45deg);
        }
        simple-modal-template[modal-id="m1"] {
          --simple-modal-width: var(--check-it-out-modal-width, 80vw);
          --simple-modal-height: var(--check-it-out-modal-height, 55vh);
          --simple-modal-min-width: var(--check-it-out-modal-width, 80vw);
          --simple-modal-min-height: var(--check-it-out-modal-height, 55vh);
        }

        .iframe-container {
          width: var(--check-it-out-content-width, 800px);
          height: var(--check-it-out-content-height, 500px);
        }

        .video-player {
          width: var(--check-it-out-content-width, 800px);
          height: var(--check-it-out-content-height, 500px);
        }
        iframe-loader {
          text-align: center;
          display: block;
          width: var(--check-it-out-content-width, 800px);
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
    this.icon = this.icon ? this.icon : this.typeIconObj[this.type];
    return html` ${this.elementVisible
      ? html`
          <button
            class="check-it-out-btn"
            @click="${this._handleClick}"
            controls="m1"
          >
            <simple-icon-lite icon="${this.icon}"> </simple-icon-lite>
            ${this.label}
            <slot></slot>
          </button>
          ${this.modal
            ? html`
                <simple-modal-template
                  title="${this.modalTitle}"
                  @click="${this._handleClick}"
                  modal-id="m1"
                >
                  <div slot="content">
                    <!-- bandaid and a terrible one -->
                    <style>
                      simple-modal .container {
                        display: block;
                        position: relative;
                        width: var(--check-it-out-container-width, 70vw);
                      }
                      simple-modal .container .iframe-container {
                        width: var(--check-it-out-content-width, 70vw);
                        height: var(--check-it-out-content-height, 45vh);
                      }

                      simple-modal .container .video-player {
                        width: var(--check-it-out-content-width, 70vw);
                        height: var(--check-it-out-content-height, 45vh);
                      }
                      simple-modal .container iframe-loader {
                        text-align: center;
                        display: block;
                        width: var(--check-it-out-content-width, 45vh);
                      }
                    </style>
                    ${this.renderLogic()}
                  </div>
                </simple-modal-template>
              `
            : html` ${this.renderLogic()} `}
        `
      : ``}`;
  }
  renderLogic() {
    return html`
      ${["code", "pdf"].includes(this.type)
        ? html`<div class="container">
            <iframe-loader>
              <iframe
                class="iframe-container"
                src=${this.__computedSource}
                loading="lazy"
              ></iframe>
              ${!this.modal
                ? html`
                    <button
                      class="close-btn"
                      @click="${this._handleClick}"
                    ></button>
                  `
                : ``}
            </iframe-loader>
          </div>`
        : html`
            <div class="container">
              <video-player
                class="video-player"
                source=${this.__computedSource}
              >
              </video-player>
              ${!this.modal
                ? html`
                    <button
                      class="close-btn"
                      @click="${this._handleClick}"
                    ></button>
                  `
                : ``}
            </div>
          `}
    `;
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.typeIconObj = {
      code: "code",
      pdf: "book",
      video: "av:play-arrow",
    };
    this.icon = "code";
    this.modalTitle = "";
    this.checkedOut = false;
    this.type = "";
    this.hideExplorer = false;
    this.ctl = false;
    this.view = "both";
  }

  _handleClick(event) {
    if (this._haxstate && this.modal) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    } else if (!this._haxstate && !this.modal) {
      if (this.checkedOut) {
        this.checkedOut = false;
      } else {
        this.checkedOut = true;
      }
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

  /*
    Checks source string and determines a type
  */
  checkType(sourceStr) {
    let videoTypes = [".mp4", ".mkv", ".flv", ".wmv", ".ovg", ".webm", ".mov"];
    if (
      videoTypes.filter((type) => sourceStr.endsWith(type)).length > 0 ||
      sourceStr.includes("youtube.com")
    ) {
      this.type = "video";
      import("@lrnwebcomponents/video-player/video-player.js");
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
      sourceStr = this.checkStackblitzProps(sourceStr);
    } else if (sourceStr.includes("codepen.io")) {
      this.type = "code";
      if (!sourceStr.includes("embed")) {
        sourceStr = sourceStr.replace("/pen/", "/embed/");
      }
    }
    if (this.type != "video") {
      import("@lrnwebcomponents/iframe-loader/iframe-loader.js");
    }
    return sourceStr;
  }

  /* 
    Apply additional stackblitz properties
  */
  checkStackblitzProps(sourceStr) {
    if (this.filePath) {
      sourceStr += "&file=" + this.filePath;
    }
    if (this.hideExplorer) {
      sourceStr += "&hideExplorer=1";
    }
    if (this.ctl) {
      sourceStr += "&ctl=1";
    }
    sourceStr += `&view=${this.view}`;
    return sourceStr;
  }

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // import modal if we need it only when we actually leverage it
      if (propName === "modal" && this[propName]) {
        import(
          "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js"
        ).then(() => {
          if (this.shadowRoot) {
            this.shadowRoot
              .querySelector('[modal-id="m1"]')
              .associateEvents(
                this.shadowRoot.querySelector('[controls="m1"]')
              );
          }
        });
      }
      if (propName === "source" && this[propName]) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          this.__computedSource = this.checkType(this.source);
        }, 0);
      }
    });
  }
}
customElements.define(CheckItOut.tag, CheckItOut);
export { CheckItOut };
