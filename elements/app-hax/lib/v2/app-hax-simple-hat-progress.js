import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class AppHaxSimpleHatProgress extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "app-hax-simple-hat-progress";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      progressHat: "Progress Hat",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
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
        /* the hat art is 405 x 340; every position below is a share of
           that viewBox, so the bar and the number stay on the hat at any
           size (the art has 28px progress slots from x 40 to 376, y 251
           to 299, and the crown is centered on x 208) */
        :host {
          display: block;
          width: 160px;
          aspect-ratio: 405 / 340;
          height: auto;
          position: relative;
          container-type: inline-size;
        }

        .hat-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hat-image {
          display: block;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
          position: relative;
        }

        .progress-bar {
          position: absolute;
          left: calc(40 / 405 * 100%);
          width: calc(336 / 405 * 100%);
          top: calc(251 / 340 * 100%);
          height: calc(48 / 340 * 100%);
          background: var(--ddd-theme-default-limestoneGray, #a2aaad);
          overflow: hidden;
          z-index: 1;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--ddd-theme-default-original87Pink, #bc204b) 0%,
            var(--ddd-theme-default-keystoneYellow, #ffd100) 50%,
            var(--ddd-theme-default-futureLime, #99cc33) 100%
          );
          background-size: calc(336 / 405 * 100cqw) 100%;
          transition: width var(--ddd-duration-slow, 0.6s) ease;
          width: 0%;
        }

        .progress-text {
          position: absolute;
          left: calc(208 / 405 * 100%);
          top: calc(86 / 340 * 100%);
          transform: translate(-50%, -50%);
          color: var(--ddd-theme-default-white, white);
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: 12cqw;
          line-height: 1;
          font-weight: var(--ddd-font-weight-bold, 700);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
          white-space: nowrap;
          z-index: 3;
        }

        @media (prefers-reduced-motion: reduce) {
          .progress-fill {
            transition: none;
          }
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

    const label = `${Math.round(percentage)}%`;
    return html`
      <div
        class="hat-container"
        role="progressbar"
        aria-label="${this.t.progressHat}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${Math.round(percentage)}"
      >
        <img
          class="hat-image"
          src="${
            new URL("../assets/images/HatBlank.svg", import.meta.url).href
          }"
          alt=""
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="progress-text" aria-hidden="true">${label}</div>
      </div>
    `;
  }
}

customElements.define(AppHaxSimpleHatProgress.tag, AppHaxSimpleHatProgress);
