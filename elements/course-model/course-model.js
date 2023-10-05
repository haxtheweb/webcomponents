/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@google/model-viewer/dist/model-viewer.js";
import "./lib/model-option.js";
import "./lib/model-info.js";
/**
 * `course-model`
 * `view 3d models with multiple angel rotation for a course experience`
 * @demo demo/index.html
 * @element course-model
 */
class CourseModel extends LitElement {
  static get tag() {
    return "course-model";
  }

  static get properties() {
    return {
      visible: {
        type: String,
        reflect: true,
      },
      title: { type: String },
      src: { type: String },
      alt: { type: String },
    };
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    if (
      !this._sent &&
      window.HaxStore &&
      window.HaxStore.instance &&
      window.HaxStore.instance.ready
    ) {
      this._sent = true;
      window.HaxStore.instance.setHaxProperties(
        {
          api: "1",
          canScale: true,
          canPosition: true,
          canEditSource: true,
          contentEditable: false,
          gizmo: {
            title: "3d Model",
            description: "3D Model viewer",
            icon: "icons:android",
            color: "purple",
            tags: ["Resource", "3D", "model", "viewer"],
            handles: [],
            meta: {
              author: "Google",
            },
          },
          settings: {
            configure: [
              {
                property: "poster",
                title: "Poster image",
                inputMethod: "haxupload",
                noVoiceRecord: true,
              },
              {
                property: "src",
                title: "Source",
                inputMethod: "haxupload",
                noVoiceRecord: true,
                noCamera: true,
              },
              {
                property: "alt",
                title: "Alternate Text",
                inputMethod: "alt",
              },
            ],
            advanced: [
              {
                attribute: "environment-image",
                title: "Environment Image",
                inputMethod: "haxupload",
                noVoiceRecord: true,
                noCamera: true,
              },
              {
                property: "ar",
                title: "Augmented Reality",
                inputMethod: "boolean",
              },
              {
                attribute: "camera-controls",
                title: "Camera controls",
                inputMethod: "boolean",
              },
              {
                attribute: "touch-action",
                title: "Touch action",
                inputMethod: "textfield",
              },
              {
                attribute: "shadow-intensity",
                title: "Shadow intensity",
                inputMethod: "number",
              },
            ],
            developer: [],
          },
          demoSchema: [
            {
              tag: "model-viewer",
              content: "",
              properties: {
                alt: "Neil Armstrong's Spacesuit from the Smithsonian Digitization Programs Office and National Air and Space Museum",
                src: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
                ar: true,
                "environment-image":
                  "https://modelviewer.dev/shared-assets/environments/moon_1k.hdr",
                poster:
                  "https://modelviewer.dev/shared-assets/models/NeilArmstrong.webp",
                "shadow-intensity": "1",
                "camera-controls": true,
                "touch-action": "pan-y",
                style: "height: 500px;",
              },
            },
          ],
        },
        "model-viewer"
      );
    }

    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  constructor() {
    super();
    this.visible = "model";
    this.title = "";
    this.src = "";
    this.addEventListener("model-select", this._srcChanged);
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([visible="model"]) .overlay {
          display: none;
        }

        :host([visible="model-info"]) .slotted-text,
        .slotted-animation {
          display: none;
        }

        :host([visible="model-text"]) .slotted-info,
        .slotted-animation,
        .slotted-check {
          display: none;
        }

        :host([visible="model-text"]) .slotted-text {
          display: block;
        }

        :host([visible="model-animation"]) .slotted-info,
        .slotted-text {
          display: none;
        }

        :host([visible="model-animation"]) .slotted-animation {
          display: block;
        }

        :host([visible="model-check"]) .slotted-check {
          display: block;
        }

        :host([visible="model-check"]) .slotted-info {
          display: none;
        }

        h1 {
          color: #fff;
          margin: 0;
        }

        @media screen and (min-width: 320px) {
          h1 {
            font-size: 16px;
          }
        }

        @media screen and (min-width: 920px) {
          h1 {
            font-size: 24px;
          }
        }

        .model-wrap {
          position: relative;
        }

        #info-wrap {
          background: rgba(0, 0, 0, 0.8);
          color: rgb(255, 255, 255);
          position: absolute;
          z-index: 1;
          overflow-y: scroll;
          overflow-x: hidden;
          max-height: 750px;
          width: 100%;
        }

        @media screen and (min-width: 320px) {
          #info-wrap {
            min-height: 350px;
            max-height: 350px;
          }
        }

        @media screen and (min-width: 920px) {
          #info-wrap {
            min-height: 750px;
            max-height: 750px;
          }
        }

        .slotted-text {
          padding: 25px;
        }

        model-viewer {
          --progress-bar-height: 0px;
          width: 100%;
          background-color: #eee;
        }

        @media screen and (min-width: 320px) {
          model-viewer {
            height: 350px;
          }
        }

        @media screen and (min-width: 920px) {
          model-viewer {
            height: 750px;
          }
        }

        #toolbar-wrap {
          display: inline-flex;
          align-items: center;
          background-color: #363533;
          width: 100%;
        }

        @media screen and (min-width: 320px) {
          #toolbar-wrap {
            height: 40px;
          }
        }

        @media screen and (min-width: 920px) {
          #toolbar-wrap {
            height: 75px;
          }
        }

        .tool-button {
          background-color: transparent;
          border: none;
        }

        @media screen and (min-width: 320px) {
          .tool-button {
            height: 40px;
            width: 40px;
          }
        }

        @media screen and (min-width: 920px) {
          .tool-button {
            height: 75px;
            width: 75px;
          }
        }

        .tool-button:hover {
          background-color: #e2801e;
        }

        .tool-button:focus {
          background-color: #e2801e;
        }

        .tool-button:active {
          background-color: #e2801e;
        }

        @media screen and (min-width: 320px) {
          svg {
            height: 20px;
            width: 20px;
          }
        }

        @media screen and (min-width: 920px) {
          svg {
            height: 36px;
            width: 36px;
          }
        }

        #title {
          flex-grow: 1;
          background-color: dimgray;
          height: inherit;
          display: flex;
          align-items: center;
          padding: 0 0 0 15px;
        }

        @media screen and (min-width: 320px) {
          img#brand {
            width: 45px;
          }
        }

        @media screen and (min-width: 920px) {
          img#brand {
            width: 70px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="model-wrap">
        <div id="toolbar-wrap">
          <div id="nav">
            <button
              title="Explore Models"
              id="explore"
              class="tool-button"
              @click="${this._openInfo}"
            >
              <svg fill="#fff" viewBox="0 0 24 24">
                <path
                  d="M13.818 16.646c-1.273.797-2.726 1.256-4.202 1.354l-.537-1.983c2.083-.019 4.132-.951 5.49-2.724 2.135-2.79 1.824-6.69-.575-9.138l-1.772 2.314-1.77-6.469h6.645l-1.877 2.553c3.075 2.941 3.681 7.659 1.423 11.262l7.357 7.357-2.828 2.828-7.354-7.354zm-11.024-1.124c-1.831-1.745-2.788-4.126-2.794-6.522-.005-1.908.592-3.822 1.84-5.452 1.637-2.138 4.051-3.366 6.549-3.529l.544 1.981c-2.087.015-4.142.989-5.502 2.766-2.139 2.795-1.822 6.705.589 9.154l1.774-2.317 1.778 6.397h-6.639l1.861-2.478z"
                />
              </svg>
            </button>
            <button
              title="More Information"
              id="moreinfo"
              class="tool-button"
              @click="${this._openText}"
            >
              <svg fill="#fff" viewBox="0 0 24 24">
                <path
                  d="M4 22v-20h16v11.543c0 4.107-6 2.457-6 2.457s1.518 6-2.638 6h-7.362zm18-7.614v-14.386h-20v24h10.189c3.163 0 9.811-7.223 9.811-9.614zm-5-1.386h-10v-1h10v1zm0-4h-10v1h10v-1zm0-3h-10v1h10v-1z"
                />
              </svg>
            </button>
            <button
              title="Play Animation"
              id="animation"
              class="tool-button"
              @click="${this._openAnimation}"
            >
              <svg fill="#fff" viewBox="0 0 24 24">
                <path
                  d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"
                />
              </svg>
            </button>
            <button
              title="Knowledge Check"
              id="check"
              class="tool-button"
              @click="${this._openCheck}"
            >
              <svg fill="#fff" viewBox="0 0 24 24">
                <path
                  d="M21.856 10.303c.086.554.144 1.118.144 1.697 0 6.075-4.925 11-11 11s-11-4.925-11-11 4.925-11 11-11c2.347 0 4.518.741 6.304 1.993l-1.422 1.457c-1.408-.913-3.082-1.45-4.882-1.45-4.962 0-9 4.038-9 9s4.038 9 9 9c4.894 0 8.879-3.928 8.99-8.795l1.866-1.902zm-.952-8.136l-9.404 9.639-3.843-3.614-3.095 3.098 6.938 6.71 12.5-12.737-3.096-3.096z"
                />
              </svg>
            </button>
          </div>
          <div id="title"><h1>${this.title}</h1></div>
          <div id="logo">
            <slot name="logo"></slot>
          </div>
        </div>
        <div id="info-wrap" class="overlay">
          <div class="slotted-info"><slot></slot></div>
          <div class="slotted-text">
            <slot name="detail"></slot>
          </div>
          <div class="slotted-animation"><slot name="animation"></slot></div>
          <div class="slotted-check"><slot name="check"></slot></div>
        </div>
        <div class="model-wrap model">
          <model-viewer
            title="${this.title}"
            src="${this.src}"
            alt="${this.alt}"
            camera-controls
            exposure="6"
            camera-orbit="60deg"
            shadow-intensity="0.5"
            ar
          ></model-viewer>
        </div>
      </div>
    `;
  }

  /**
   * Open Explore Slot
   */
  _openInfo(e) {
    if (this.visible == "model-info") {
      this.visible = "model";
    } else if (this.visible != "model-info") {
      this.visible = "model-info";
    }
  }
  /**
   * Open Info Slot
   */
  _openText(e) {
    if (this.visible == "model-text") {
      this.visible = "model";
    } else if (this.visible != "model-text") {
      this.visible = "model-text";
    }
  }
  /**
   * Open Animation Slot
   */
  _openAnimation(e) {
    if (this.visible == "model-animation") {
      this.visible = "model";
    } else if (this.visible != "model-animation") {
      this.visible = "model-animation";
    }
  }
  /**
   * Open Knowledge-Check Slot
   */
  _openCheck(e) {
    if (this.visible == "model-check") {
      this.visible = "model";
    } else if (this.visible != "model-check") {
      this.visible = "model-check";
    }
  }
  /**
   * Receives 'model-select' event from 'model-option' and updates properties accordingly.
   */
  _srcChanged(e) {
    this.src = e.detail.src;
    this.title = e.detail.title;
    this.visible = "model";
  }
}

customElements.define(CourseModel.tag, CourseModel);
export { CourseModel };
