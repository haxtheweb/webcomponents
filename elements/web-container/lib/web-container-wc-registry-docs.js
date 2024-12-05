import { html } from "lit";
import "./web-container-doc-player.js";
import { DDD } from "@haxtheweb/d-d-d";

export class WebContainerWCRegistryDocs extends DDD {
  static get tag() {
    return 'web-container-wc-registry-docs';
  }

  constructor() {
    super();
    this.text = 'Select the project to produce a demo for. This will make a best attempt';
    this.file = 'https://cdn.hax.cloud/cdn/wc-registry.json';
    this.options = {
      "": ""
    };
  }

  static get properties() {
    return {
      file: { type: String },
      text: { type: String },
      options: { type: Object },
    };
  }

  render() {
    return html`
    <select @change="${this.selectChange}">
      <option></option>
      ${Object.keys(this.options).map((o) => html`<option value="${o}">${o}</option>`)}
    </select>
    <p>${this.text}</p>
    <div id="container"></div>
    `;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has('file') && this.file) {     
      fetch(this.file).then(d => d.json()).then(data => {
        this.options = Object.fromEntries(Object.entries(data).filter(([key, value]) => value.includes('@haxtheweb/') && !key.startsWith('hax')));
      });
    }
  }

  async selectChange(e) {
    const select = this.shadowRoot.querySelector('select');
    if (select.value) {
      // ensure we have a container image
      let wcm = await globalThis.WebContainerManager.requestAvailability();
      let wcdp = globalThis.document.createElement('web-container-doc-player');
      let ary = this.options[select.value].split('/');
      wcdp.project = `${ary.shift()}/${ary.shift()}`;
      wcdp.element = select.value;
      wcdp.importpath = this.options[select.value];
      let container = this.shadowRoot.querySelector('#container');
      container.innerHTML = '';
      container.appendChild(wcdp);
    }
  }
}

globalThis.customElements.define(WebContainerWCRegistryDocs.tag, WebContainerWCRegistryDocs);