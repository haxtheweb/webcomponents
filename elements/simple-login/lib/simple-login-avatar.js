/**
 * `simple-login-avatar`
 * Inspiration from https://clicknathan.com/web-design/css-avatar-icons/
 */
class SimpleLoginAvatar extends HTMLElement {
  static get tag() {
    return "simple-login-avatar";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    this.tag = SimpleLoginAvatar.tag;
    this.template = document.createElement("template");
    this.attachShadow({ mode: "open" });
    if (!delayRender) {
      this.render();
    }
  }
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
  }
  _copyAttribute(name, to) {
    const recipients = this.shadowRoot.querySelectorAll(to);
    const value = this.getAttribute(name);
    const fname = value == null ? "removeAttribute" : "setAttribute";
    for (const node of recipients) {
      node[fname](name, value);
    }
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
        --simple-login-avatar-color: #36bed4;
      }
      .avatar {
        margin: 0 auto;
        text-decoration:none;
        background: var(--simple-login-avatar-color);
        color:var(--simple-login-avatar-color);;
        position:relative;
        padding-left:55px;
        width:150px;
        height:200px;
        border-radius:250px;
        display:block;
        line-height:240%;
        overflow:hidden;
      }
      .avatar:before, .avatar:after {
        position:absolute;
        color:var(--simple-login-avatar-color);;
        background:white;
        box-shadow:0 0 10px 0px rgba(0,0,0,0.2);
      }
      .avatar:before {
        content: "\\00a0";
        border: 0px solid white;
        border-radius: 75px;
        top: 20px;
        left: 50%;
        height: 100px;
        width: 100px;
        line-height: 70%;
        font-size: 44px;
        font-weight: normal;
        text-indent: -1px;
        margin-left: -25%;
        z-index: 2;
      }
      .avatar:after {
        content: "\\00a0";
        border-radius: 20px;
        top: 115px;
        left: 50%;
        width: 100px;
        height: 103px;
        text-align: center;
        font-size: 33px;
        font-weight: bold;
        line-height: 130%;
        margin-left: -25%;
      }
      .avatar ::slotted(*) {
        z-index: 2;
        margin: 20px 0 0 -4px;
        width: 100px;
        height: 100px;
      }
      .avatar ::slotted(simple-login-camera) {
        z-index: 2;
        position: absolute;
        margin: 0 0 0 -122.5px;
        width: 355px;
        height: 200px;
      }
    </style>
    <div class="avatar"><slot></slot></div>`;
  }
}
window.customElements.define(SimpleLoginAvatar.tag, SimpleLoginAvatar);
export { SimpleLoginAvatar };
