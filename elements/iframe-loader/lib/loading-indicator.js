import { LitElement, html, css, nothing } from "lit";
class LoadingIndicator extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
      .progress-line,
      .progress-line:before {
        height: 5px;
        width: 100%;
        margin: auto;
      }
      :host([full]) .progress-line {
        --loading-indicator-width: 100%;
      }
      .progress-line {
        background-color: var(
          --loading-indicator-background-color,
          rgba(0, 0, 0, 0.05)
        );
        display: -webkit-flex;
        display: flex;
        width: var(--loading-indicator-width, 300px);
      }
      .progress-line:before {
        background-color: var(--loading-indicator-color, black);
        content: "";
        animation: running-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      @keyframes running-progress {
        0% {
          margin-left: 0px;
          margin-right: 100%;
        }
        50% {
          margin-left: 25%;
          margin-right: 0%;
        }
        100% {
          margin-left: 100%;
          margin-right: 0;
        }
      }
      @keyframes fade-out {
        0% {
          opacity: 1;
        }
        99% {
          opacity: 0;
        }
        100% {
          opacity: 0;
        }
      }
    `;
  }
  static get properties() {
    return {
      full: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
    };
  }
  constructor() {
    super();
    this.full = false;
    this.loading = false;
  }
  render() {
    return this.loading ? html`<div class="progress-line"></div>` : nothing;
  }
  static get tag() {
    return "loading-indicator";
  }
}
customElements.define(LoadingIndicator.tag, LoadingIndicator);
