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
          locales: ["es"],
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
        --simple-login-camera-background: var(--simple-camera-snap-color, #36bed4);
        --simple-login-camera-error: var(--simple-camera-snap-error, red);
        --simple-login-avatar-color: var(--simple-camera-snap-color, #36bed4);
        --simple-login-camera-size: var(--simple-camera-snap-height, calc(var(--simple-camera-snap-width, unset) * 16/9));

        /* style simple-login-avatar according to simple-login-snap styles */
        --simple-login-avatar-background: var(--simple-camera-snap-background, white);
        --simple-login-avatar-border-radius: var(--simple-camera-snap-border-radius,100%);
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
        color: var(--simple-camera-snap-color, #36bed4);
        background-color: var(--simple-camera-snap-background, white);
        border-radius: var(--simple-camera-snap-button-border-radius);
        opacity: var(--simple-camera-snap-button-opacity);
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
        position: var(--simple-camera-snap-button-container-position);
        bottom: var(--simple-camera-snap-button-container-bottom);
        z-index: var(--simple-camera-snap-button-container-z-index);
      }
    </style>
    <simple-login-avatar part="avatar">
      <div id="selfie" part="selfie"></div>
      <simple-login-camera id="camera" autoplay part="camera"></simple-login-camera>
    </simple-login-avatar>
    <div class="buttons">
      <simple-icon-button-lite id="snap" icon="image:camera-alt" part="snap-button"></simple-icon-button-lite>
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
        console.log(e);
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
customElements.define(SimpleCameraSnap.tag, SimpleCameraSnap);
export { SimpleCameraSnap };
