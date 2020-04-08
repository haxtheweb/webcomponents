class ELMSLNBase extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      import("./elmsln-base-deps.js");
    }, 0);
  }
}
windiow.customElements.define('elmsln-base', ELMSLNBase);