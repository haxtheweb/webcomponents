import "./simple-login-avatar.js";
import "./simple-login-camera.js";
import "@polymer/paper-icon-button/paper-icon-button.js";

class SimpleCameraSnap extends HTMLElement {
  constructor(delayRender = false) {
    super();
    import("@polymer/iron-icons/iron-icons.js");
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
      simple-login-avatar {
        margin: 0;
        width: 205px;
        display: block;
      }
      #selfie {
        position: absolute;
        margin: 0;
      }
      .has-snap {
        z-index: 3;
      }
      #selfie img {
        z-index: 2;
        position: absolute;
        margin: 0 0 0 -122.5px;
        width: 355px;
        height: 200px;
      }
      .buttons {
        display: flex;
        width: 200px;
        justify-content: space-evenly;
      }
    </style>
    <simple-login-avatar>
      <div id="selfie"></div>
      <simple-login-camera id="camera" autoplay></simple-login-camera>
    </simple-login-avatar>
    <div class="buttons">
      <paper-icon-button id="snap" icon="image:image"></paper-icon-button>
      <paper-icon-button id="newsnap" icon="icons:clear"></paper-icon-button>
    </div>
    `;
  }
  connectedCallback() {
    // ensure support for the camera snap functionality...
    // this would be an environment like http that doesn't support camera functionality
    if (!navigator.mediaDevices) {
      this.shadowRoot.querySelector("#snap").style.display = "none";
      this.shadowRoot.querySelector("#newsnap").style.display = "none";
    }
    this.shadowRoot
      .querySelector("#snap")
      .addEventListener("click", this.snapPhoto.bind(this));
    this.shadowRoot
      .querySelector("#newsnap")
      .addEventListener("click", this.clearPhoto.bind(this));
  }
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#snap")
      .removeEventListener("click", this.snapPhoto.bind(this));
    this.shadowRoot
      .querySelector("#newsnap")
      .removeEventListener("click", this.clearPhoto.bind(this));
  }
  async snapPhoto(e) {
    const camera = this.shadowRoot.querySelector("#camera");
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
