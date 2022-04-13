// dependencies / things imported
import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/future-terminal-text/future-terminal-text.js';

export class AppHaxLabel extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'app-hax-label';
  }

  constructor() {
    super();
    this.title = 'Welcome';
    this.subtitle = 'Start your journey now!';
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
        font-family: 'Press Start 2P', sans-serif;
        text-align: center;
      }

      .title {
        -webkit-text-stroke: 1px
          var(--app-hax-accent-color, var(--accent-color));
        -webkit-text-fill-color: var(
          --app-hax-background-color,
          var(--background-color)
        );
        font-weight: normal;
        font-size: 4vw;
        display: inline-flex;
        align-items: center;
      }

      .subtitle {
        color: var(--app-hax-accent-color, var(--accent-color));
        font-weight: normal;
        margin-top: 2.5px;
        font-size: 2vw;
      }

      .bracket {
        font-size: 10vw;
        font-weight: normal;
        vertical-align: middle;
        -webkit-text-stroke: 0px;
        -webkit-text-fill-color: var(
          --app-hax-accent-color,
          var(--accent-color)
        );
      }
    `;
  }

  render() {
    return html`
      <div class="topBar">
        <div class="title" part="title">
          <span class="bracket">&#60;</span><slot>${this.title}</slot
          ><span class="bracket">&#62;</span>
        </div>
        <div class="subtitle" part="subtitle">
          <slot name="subtitle">${this.subtitle}</slot>
        </div>
      </div>
    `;
  }
}
customElements.define(AppHaxLabel.tag, AppHaxLabel);
