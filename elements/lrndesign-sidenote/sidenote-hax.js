import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

class SidenoteHax extends PolymerElement {
  constructor() {
    super();
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div>
        [[title]]
      </div>
    `;
  }

  static get tag() {
    return "sidenote-hax";
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: "",
        reflectToAttribute: true
      }
    };
  }
}

window.customElements.define(SidenoteHax.tag, SidenoteHax);
export { SidenoteHax };
