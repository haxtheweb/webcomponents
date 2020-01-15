import "./simple-login-avatar.js";
import "./simple-login-camera.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lnwebcomponents/simple-tooltip/simple-tooltip.js";

class SimpleCameraSnap extends HTMLElement {
  constructor(delayRender = false) {
    super();
    import("@polymer/iron-icons/image-icons.js");
    this.tag = SimpleCameraSnap.tag;
    this.template = document.createElement("template");
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

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  get html() {
    return `
    <style>
      :host {
        /* style simple-login-camera according to simple-login-snap styles */
        --simple-login-camera-background: var(--simple-camera-snap-color, #36bed4);
        --simple-login-camera-error: var(--simple-camera-snap-error, red);
        --simple-login-avatar-color: var(--simple-camera-snap-color, #36bed4);
        --simple-login-camera-width: var(--simple-camera-snap-width, 200px);
        --simple-login-camera-height: var(--simple-camera-snap-height, 200px);

        /* style simple-login-avatar according to simple-login-snap styles */
        --simple-login-avatar-background: var(--simple-camera-snap-background, white);
        --simple-login-avatar-border-radius: var(--simple-camera-snap-border-radius,100%);
        --simple-login-avatar-width: var(--simple-camera-snap-width, 200px);
        --simple-login-avatar-height: var(--simple-camera-snap-height, 200px);
      }
      #selfie {
        position: absolute;
        margin: 0;
        width: var(--simple-camera-snap-width, 200px);
        height: var(--simple-camera-snap-height, 200px);
        display: flex;
        justify-content: center;
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
        position: absolute;
        width: calc(var(--simple-camera-snap-height, 200px) * 16 / 9);
        height: var(--simple-camera-snap-height, 200px);
      }
      .buttons {
        display: flex;
        width: var(--simple-camera-snap-width, 200px);
        justify-content: space-evenly;
        position: var(--simple-camera-snap-button-container-position);
        bottom: var(--simple-camera-snap-button-container-bottom);
        z-index: var(--simple-camera-snap-button-container-z-index);
      }
    </style>
    <simple-login-avatar>
      <div id="selfie"></div>
      <simple-login-camera id="camera" autoplay></simple-login-camera>
    </simple-login-avatar>
    <div class="buttons">
      <paper-icon-button id="snap" icon="image:camera-alt"></paper-icon-button>
      <simple-tooltip for="snap">Take Photo</simple-tooltip>
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
  }
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#snap")
      .removeEventListener("click", this.snapPhoto.bind(this));
  }
  async snapPhoto(e) {
    const camera = this.shadowRoot.querySelector("#camera");
    if (camera.hasAttribute("autoplay")) {
      let raw = await camera.takeASnap();
      let img = await camera.takeASnap().then(camera.renderImage);
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
            raw: raw
          }
        })
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
window.customElements.define(SimpleCameraSnap.tag, SimpleCameraSnap);
export { SimpleCameraSnap };
