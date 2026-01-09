// dependencies / things imported
import { LitElement, html, css } from "lit";

export class AppHaxLabel extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-label";
  }

  constructor() {
    super();
    this.title = "HAX site list";
    this.subtitle = "Let's build something awesome!";
  }

  static get properties() {
    return {
      title: { type: String },
      subtitle: { type: String },
    };
  }

  // TODO: If scaling is weird with font-sizes, try using clamp() (https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/)
  static get styles() {
    return css`
      :host {
        font-family: var(--ddd-font-primary);
        text-align: flex-start;
        width: 100%;
        max-width: 800px;
      }

      .topBar {
        display: flex;
        align-items: baseline;
        gap: var(--ddd-spacing-4, 8px);
      }

      .title {
        -webkit-text-stroke: 1px
          var(--app-hax-accent-color, var(--accent-color));
        -webkit-text-fill-color: var(
          --app-hax-background-color,
          var(--background-color)
        );
        font-weight: normal;
        font-size: var(--ddd-font-size-l, 1.8vw);
        display: inline-flex;
        align-items: baseline;
        min-width: fit-content;
      }

      .subtitle {
        color: var(--app-hax-accent-color, var(--accent-color));
        font-weight: normal;
        font-size: var(--ddd-font-size-s, 16px);
        font-family: var(--ddd-font-secondary, sans-serif);
        margin: 0;
        flex: 1;
        min-width: fit-content;
      }

      @media (max-width: 700px) {
        .topBar {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--ddd-spacing-1, 4px);
        }
        .subtitle {
          font-size: var(--ddd-font-size-xs, 12px);
        }
        .title {
          font-size: var(--ddd-font-size-s, 2vw);
        }
      }

      .bracket {
        font-size: var(--ddd-font-size-m);
        font-weight: normal;
        vertical-align: middle;
        -webkit-text-stroke: 0px;
        -webkit-text-fill-color: var(
          --app-hax-accent-color,
          var(--accent-color)
        );
      }

      @media (max-height: 500px) {
        .title {
          -webkit-text-stroke: unset;
          -webkit-text-fill-color: unset;
        }
        .bracket {
          font-size: var(--ddd-font-size-m);
          margin: 0;
          padding: 0;
        }
      }
    `;
  }

  render() {
    return html`
      <header class="topBar" role="banner" aria-labelledby="main-heading">
        <h1 id="main-heading" class="title" part="title">
          <span class="bracket" aria-hidden="true">&#60;</span>
          <slot>${this.title}</slot>
          <span class="bracket" aria-hidden="true">&#62;</span>
        </h1>
        <div class="subtitle" part="subtitle" role="doc-subtitle">
          <slot name="subtitle">${this.subtitle}</slot>
        </div>
      </header>
    `;
  }
}
customElements.define(AppHaxLabel.tag, AppHaxLabel);
