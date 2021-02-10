/**
 * Copyright 2021
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template";

/**
 * `check-it-out-modal`
 * `View codepen, stackblitz, pdf, and videos in a modal`
 * @demo demo/modal.html
 * @element check-it-out-modal
 */
class CheckItOutModal extends IntersectionObserverMixin(LitElement) {
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Check it out modal",
        description:
          "Clickable button for media and code previews in modal form",
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
          {
            property: "modalTitle",
            title: "Modal Title",
            description: "Title at the top of modal",
            inputMethod: "textfield",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "check-it-out-modal",
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
      // modal header
      modalTitle: {
        type: String,
        attribute: "modal-title",
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
        }

        simple-modal-template[modal-id="m1"] {
          --simple-modal-width: var(--check-it-out-modal-width, 900px);
          --simple-modal-height: var(--check-it-out-modal-height, 550px);
          --simple-modal-min-width: var(--check-it-out-modal-min-width, 900px);
          --simple-modal-min-height: var(
            --check-it-out-modal-min-heihgt,
            550px
          );
        }

        .container {
          display: none;
          position: relative;
          width: var(--check-it-out-modal-container-width, 800px);
        }

        :host([checked-out]) .container {
          display: flex;
        }

        .check-it-out-btn {
          display: block;
          background-color: transparent;
          font-size: var(--check-it-out-modal-button-font-size, 18px);
          border: 2px solid var(--check-it-out-button-border-color, #000);
          font-weight: 700;
          padding: 10px 25px;
        }

        .check-it-out-btn:hover {
          border: 3px solid var(--check-it-out-button-border-color, #000);
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
    return "check-it-out-modal";
  }

  render() {
    this.icon = this.icon ? this.icon : this.typeIconObj[this.type];
    return html` ${this.elementVisible
      ? html`
          <button
            class="check-it-out-btn"
            controls="m1"
            @click="${this._handleClick}"
          >
            <simple-icon-lite icon="${this.icon}"> </simple-icon-lite>
            ${this.label}
            <slot></slot>
          </button>
          <simple-modal-template
            title=${this.modalTitle}
            @click="${this._handleClick}"
            modal-id="m1"
          >
            ${["code", "pdf"].includes(this.type)
              ? html`<div class="container" slot="content">
                  <iframe-loader style="text-align: center;">
                    <iframe
                      class="iframe-container"
                      src=${this.__computedSource}
                      loading="lazy"
                      style="width: 800px; height: 500px;"
                    ></iframe>
                  </iframe-loader>
                </div>`
              : html`
                  <div class="container" slot="content">
                    <video-player
                      class="video-player"
                      source=${this.__computedSource}
                    ></video-player>
                  </div>
                `}
          </simple-modal-template>
        `
      : ``}`;
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
    this.icon = "";
    this.type = "";
    this.hideExplorer = false;
    this.ctl = false;
    this.view = "both";
    this.modalTitle = "";
  }

  _handleClick(event) {
    if (this._haxstate) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
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
      if (propName === "source" && this[propName]) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          this.__computedSource = this.checkType(this.source);
        }, 0);
      }
    });
    this.shadowRoot
      .querySelector('[modal-id="m1"]')
      .associateEvents(this.shadowRoot.querySelector('[controls="m1"]'));
  }
}
customElements.define(CheckItOutModal.tag, CheckItOutModal);
export { CheckItOutModal };
