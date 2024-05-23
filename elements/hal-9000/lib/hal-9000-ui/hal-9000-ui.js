import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

export class Hal9000UI extends SimpleColors {
  static get styles() {
    return [
      super.styles,
      css`
        :host([mini]) #container {
          width: 50px;
          height: 50px;
          position: fixed;
          top: 20px;
          right: 20px;
          left: auto;
          border-radius: 5px;
        }

        :host([mini]) .circle {
          width: 15px;
          height: 15px;
        }

        #container {
          width: 150px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: fixed;
          left: 20px;
          bottom: 20px;
          z-index: 10000;
          background-color: var(--simple-colors-default-theme-grey-12);
          border-radius: 15px;
        }

        .circle {
          border-radius: 50%;
          background-color: var(--simple-colors-default-theme-accent-6);
          width: 50px;
          height: 50px;
          position: absolute;
          opacity: 0;
          animation: scaleIn 4s infinite cubic-bezier(0.36, 0.11, 0.89, 0.32);
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.5, 0.5);
            opacity: 0.5;
          }
          to {
            transform: scale(2.5, 2.5);
            opacity: 0;
          }
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      mini: { type: Boolean, reflect: true },
    };
  }

  static get tag() {
    return "hal-9000-ui";
  }

  constructor() {
    super();
    this.mini = false;
  }

  render() {
    return html`
      <div id="container">
        <div class="circle" style="animation-delay: 0s"></div>
        <div class="circle" style="animation-delay: 1s"></div>
        <div class="circle" style="animation-delay: 2s"></div>
      </div>
    `;
  }
}

customElements.define(Hal9000UI.tag, Hal9000UI);
