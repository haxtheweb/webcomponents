import "./simple-login-avatar.js";
import "./simple-login-camera.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

class SimpleCameraSnap extends HTMLElement {
  constructor(delayRender = false) {
    super();
    this.tag = SimpleCameraSnap.tag;
    this.t = {
      takePhoto: "Take Photo",
    };
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          context: this,
          namespace: "simple-login",
          localesPath:
            new URL("../locales/simple-login.es.json", import.meta.url).href +
            "/../",
          updateCallback: "render",
        },
      }),
    );
    this.template = globalThis.document.createElement("template");
    this.attachShadow({ mode: "open" });
    if (!delayRender) {
      this.render();
    }
  }
  static get tag() {
    return "simple-camera-snap";
  }
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  get html() {
    return `
    <style>
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        /* style simple-login-camera according to simple-login-snap styles */
        --simple-login-camera-background: var(--simple-camera-snap-color, var(--ddd-theme-default-coalyGray, #36bed4));
        --simple-login-camera-error: var(--simple-camera-snap-error, var(--ddd-theme-default-error, red));
        --simple-login-avatar-color: var(--simple-camera-snap-color, var(--ddd-theme-default-coalyGray, #36bed4));
        --simple-login-camera-size: var(--simple-camera-snap-height, calc(var(--simple-camera-snap-width, 150px) * 16/9));

        /* style simple-login-avatar according to simple-login-snap styles */
        --simple-login-avatar-background: var(--simple-camera-snap-background, var(--ddd-theme-default-white, white));
        --simple-login-avatar-border-radius: var(--simple-camera-snap-border-radius, var(--ddd-radius-rounded, 100%));
      }
      :host([hidden]) {
        display: none !important;
      }
      #selfie {
        position: absolute;
        margin: 0;
        display: flex;
        justify-content: center;
        width: 100%;
        overflow: hidden;
      }
      #snap {
        color: white;
        background-color: var(--ddd-theme-default-error, #d32f2f);
        border-radius: var(--simple-camera-snap-button-border-radius, var(--ddd-radius-sm, 4px));
        opacity: var(--simple-camera-snap-button-opacity, 1);
        border: none;
        padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
        margin: var(--ddd-spacing-1, 4px);
        font-family: var(--ddd-font-navigation, sans-serif);
        font-size: var(--ddd-font-size-4xs, 10px);
        cursor: pointer;
        min-width: 60px;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
      }
      .has-snap {
        z-index: 3;
      }
      #selfie img {
        z-index: 2;        
        width: calc(177.77777777777% / var(--simple-login-camera-aspect, 1));
        background-color: rgba(0, 0, 0, 0);
      }
      .buttons {
        display: flex;
        width: 100%;
        justify-content: space-around;
        position: var(--simple-camera-snap-button-container-position, relative);
        bottom: var(--simple-camera-snap-button-container-bottom, var(--ddd-spacing-1, 4px));
        z-index: var(--simple-camera-snap-button-container-z-index, 5);
        margin-top: var(--ddd-spacing-1, 4px);
      }
    </style>
    <simple-login-avatar part="avatar">
      <div id="selfie" part="selfie"></div>
      <simple-login-camera id="camera" autoplay part="camera"></simple-login-camera>
    </simple-login-avatar>
    <div class="buttons">
      <simple-icon-button-lite id="snap" icon="image:camera-alt" part="snap-button">
        ${this.t.takePhoto}
      </simple-icon-button-lite>
      <simple-tooltip for="snap" part="snap-tooltip">${this.t.takePhoto}</simple-tooltip>
      <slot></slot>
    </div>
    `;
  }
  connectedCallback() {
    // ensure support for the camera snap functionality...
    // this would be an environment like http that doesn't support camera functionality
    if (!navigator.mediaDevices) {
      this.shadowRoot.querySelector("#snap").style.display = "none";
    }
    this.shadowRoot
      .querySelector("#snap")
      .addEventListener("click", this.snapPhoto.bind(this));
    this._t = { ...this.t };
  }
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#snap")
      .removeEventListener("click", this.snapPhoto.bind(this));
  }
  async snapPhoto(e) {
    const camera = this.shadowRoot.querySelector("#camera");
    if (camera.hasAttribute("autoplay")) {
      let img = "";
      let raw = await camera.takeASnap();
      try {
        img = await camera.takeASnap().then((d) => camera.renderImage(d));
      } catch (e) {
        console.warn(e);
      }
      camera.removeAttribute("autoplay");
      const selfie = this.shadowRoot.querySelector("#selfie");
      selfie.innerHTML = "";
      selfie.appendChild(img);
      // throw up event for other things to find the image
      this.dispatchEvent(
        new CustomEvent("simple-camera-snap-image", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            img: img,
            raw: raw,
          },
        }),
      );
      selfie.classList.add("has-snap");
    } else {
      this.clearPhoto(e);
    }
  }
  clearPhoto(e) {
    const camera = this.shadowRoot.querySelector("#camera");
    camera.setAttribute("autoplay", "autoplay");
    const selfie = this.shadowRoot.querySelector("#selfie");
    selfie.innerHTML = "";
    selfie.classList.remove("has-snap");
  }
}
globalThis.customElements.define(SimpleCameraSnap.tag, SimpleCameraSnap);
export { SimpleCameraSnap };
