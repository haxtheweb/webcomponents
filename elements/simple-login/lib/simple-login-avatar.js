/**
 * `simple-login-avatar`
 * @element simple-login-avatar
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
    this.template = globalThis.document.createElement("template");
    this.attachShadow({ mode: "open" });
    if (!delayRender) {
      this.render();
    }
  }
  connectedCallback() {
    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.styleElement(this);
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
    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  get html() {
    return `
    <style>
      :host {
        margin: 0;
        display: block;
        max-width: 100%; 
      }
      :host([hidden]){
        display: none;
      }
      #svg {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        fill: var(--simple-login-avatar-background, white);
      }
      .avatar {
        position:relative;
        margin: 0 auto;
        display: block;
        overflow: hidden;
        text-decoration: none;
        line-height: 240%;
        color: var(--simple-login-avatar-background, white);
        background: var(--simple-login-avatar-color, #36bed4);
        border-radius: var(--simple-login-avatar-border-radius, 100%);
      }
    </style>
    <div class="avatar">
      <svg id="svg" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block;"><g><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></g></svg>
      <slot></slot>
    </div>`;
  }
}
customElements.define(SimpleLoginAvatar.tag, SimpleLoginAvatar);
export { SimpleLoginAvatar };
