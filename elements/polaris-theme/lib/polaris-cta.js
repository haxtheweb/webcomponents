import { LitElement, html, css } from "lit";

export class PolarisCta extends LitElement {
  static get tag() {
    return "polaris-cta";
  }

  constructor() {
    super();
    this.text = "";
    this.link = "";
    this.type = "tinted";
    this.outlined = false;
    this.filled = false;
  }

  static get properties() {
    return {
      text: { type: String },
      link: { type: String },
      type: { type: String, reflect: true },
      outlined: { type: Boolean, reflect: true },
      filled: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin-left: 32px;
          --polaris-cta-psu-white: #ffffff;
          --polaris-cta-psu-blue: #1e407c;
          --polaris-cta-psu-darkblue: #001e44;
          --polaris-cta-psu-lightblue: #96bee6;
          --polaris-cta-psu-gray: #e4e5e7;
          --polaris-cta-psu-black: #000000;
          --polaris-cta-psu-darkgray: #4f627c;
          --polaris-cta-border-width: 2px;
          --polaris-cta-border-radius: 4px;
          --polaris-cta-transition: 0.3s all ease-in-out;
          --polaris-cta-border-style: solid;
          --polaris-cta-border-color: var(--polaris-cta-psu-blue);
          --polaris-cta-background-color: var(--polaris-cta-psu-white);
          --polaris-cta-color: var(--polaris-cta-psu-blue);
        }

        a {
          display: block;
          text-transform: uppercase;
          text-decoration: none;
          font-style: italic;
          font-weight: 700;
          letter-spacing: 0.4px;
          padding: 12px 32px;
          border-radius: var(--polaris-cta-border-radius);
          transition: var(--polaris-cta-transition);
          color: var(--polaris-cta-color);
          border-width: var(--polaris-cta-border-width);
          border-style: var(--polaris-cta-border-style);
          border-color: var(--polaris-cta-border-color);
          background-color: var(--polaris-cta-background-color);
        }

        a:focus {
          outline: none;
        }

        :host([type="primary"][outlined]) a {
          --polaris-cta-border-color: var(--polaris-cta-psu-blue);
          --polaris-cta-background-color: var(--polaris-cta-psu-white);
          --polaris-cta-color: var(--polaris-cta-psu-blue);
        }

        :host([type="primary"][outlined]) a:focus,
        :host([type="primary"][outlined]) a:hover {
          --polaris-cta-border-color: var(--polaris-cta-psu-blue);
          --polaris-cta-background-color: var(--polaris-cta-psu-blue);
          --polaris-cta-color: var(--polaris-cta-psu-white);
        }

        :host([type="primary"][filled]) a {
          --polaris-cta-border-color: var(--polaris-cta-psu-blue);
          --polaris-cta-background-color: var(--polaris-cta-psu-blue);
          --polaris-cta-color: var(--polaris-cta-psu-white);
        }

        :host([type="primary"][filled]) a:focus,
        :host([type="primary"][filled]) a:hover {
          --polaris-cta-border-color: var(--polaris-cta-psu-blue);
          --polaris-cta-background-color: var(--polaris-cta-psu-white);
          --polaris-cta-color: var(--polaris-cta-psu-blue);
        }

        :host([type="tinted"]) a {
          --polaris-cta-border-color: var(--polaris-cta-psu-white);
          --polaris-cta-background-color: var(--polaris-cta-psu-darkgray);
          --polaris-cta-color: var(--polaris-cta-psu-lightblue);
        }

        :host([type="light"][outlined]) a {
          --polaris-cta-border-color: var(--polaris-cta-psu-white);
          --polaris-cta-background-color: var(--polaris-cta-psu-darkblue);
          --polaris-cta-color: var(--polaris-cta-psu-lightblue);
        }

        :host([type="light"][outlined]) a:focus,
        :host([type="light"][outlined]) a:hover {
          --polaris-cta-border-color: var(--polaris-cta-psu-lightblue);
          --polaris-cta-background-color: var(--polaris-cta-psu-lightblue);
          --polaris-cta-color: var(--polaris-cta-psu-darkblue);
        }

        :host([type="light"][filled]) a {
          --polaris-cta-border-color: var(--polaris-cta-psu-lightblue);
          --polaris-cta-background-color: var(--polaris-cta-psu-lightblue);
          --polaris-cta-color: var(--polaris-cta-psu-darkblue);
        }

        :host([type="light"][filled]) a:focus,
        :host([type="light"][filled]) a:hover {
          --polaris-cta-border-color: var(--polaris-cta-psu-white);
          --polaris-cta-background-color: var(--polaris-cta-psu-darkblue);
          --polaris-cta-color: var(--polaris-cta-psu-lightblue);
        }
      `,
    ];
  }

  render() {
    return html`<a href="${this.link}"><slot>${this.text}</slot></a>`;
  }
}

globalThis.customElements.define(PolarisCta.tag, PolarisCta);
