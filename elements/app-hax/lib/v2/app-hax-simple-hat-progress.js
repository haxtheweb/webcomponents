import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class AppHaxSimpleHatProgress extends DDDSuper(LitElement) {
  static get tag() {
    return "app-hax-simple-hat-progress";
  }

  constructor() {
    super();
    this.progress = 0;
    this.max = 100;
  }

  static get properties() {
    return {
      progress: { type: Number },
      max: { type: Number },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 160px;
          height: 160px;
          position: relative;
        }

        .hat-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hat-image {
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
          position: relative;
        }

        .progress-bar {
          position: absolute;
          bottom: 24px;
          left: 8px;
          right: 8px;
          height: 12px;
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          border-radius: var(--ddd-radius-sm, 4px);
          overflow: hidden;
          z-index: 1;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--ddd-theme-default-original87Pink, #e4007c) 0%,
            var(--ddd-theme-default-keystoneYellow, #ffd100) 50%,
            var(--ddd-theme-default-futureLime, #99cc33) 100%
          );
          border-radius: var(--ddd-radius-sm, 4px);
          transition: width 0.5s ease;
          width: 0%;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--ddd-theme-default-white, white);
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-s, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          z-index: 3;
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (changedProperties.has("progress")) {
      const progressFill = this.shadowRoot.querySelector(".progress-fill");
      if (progressFill) {
        const percentage = Math.min(
          100,
          Math.max(0, (this.progress / this.max) * 100),
        );
        progressFill.style.width = `${percentage}%`;
      }
    }
  }

  render() {
    const percentage = Math.min(
      100,
      Math.max(0, (this.progress / this.max) * 100),
    );

    return html`
      <div class="hat-container">
        <img
          class="hat-image"
          src="${new URL("../assets/images/HatBlank.svg", import.meta.url)
            .href}"
          alt="Progress Hat"
        />
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="progress-text">${Math.round(percentage)}%</div>
      </div>
    `;
  }
}

customElements.define(AppHaxSimpleHatProgress.tag, AppHaxSimpleHatProgress);
