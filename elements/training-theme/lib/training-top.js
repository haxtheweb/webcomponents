// import stuff
import { LitElement, html, css } from "lit";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";

export class TrainingTop extends LitElement {
  // defaults
  constructor() {
    super();
    this.id = "";
    this.time = "";
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return "training-top";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      presenter: { type: String },
      id: { type: String },
      time: { type: String },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: block;
      }
      .wrapper {
        padding: 16px;
        background-color: #eeeeee;
      }

      site-title {
        color: black;
        --site-title-link-h1-display: inline-block;
        --site-title-link-display: flex;
        --site-title-link-text-decoration: none;
        --site-title-heading-font-family: var(
          --__learn-two-theme-default-font-family
        );
        --site-title-heading-font-size: 32px;
        --site-title-heading-margin: 0;
        --site-title-heading-padding: 0;
        --site-title-heading-text-align: center;
        --site-title-heading-text-rendering: optimizelegibility;
        --site-title-heading-font-weight: 100;
      }

      #codelab-title {
        background: #fff;
        box-shadow:
          0 1px 2px 0 rgba(60, 64, 67, 0.3),
          0 2px 6px 2px rgba(60, 64, 67, 0.15);
        color: #3c4043;
        display: flex;
        grid-area: title;
        align-items: center;
        justify-content: space-between;
        height: 64px;
        padding: 0 0 0 16px;
        width: 100%;
      }

      .title {
        width: auto;
        color: #3c4043;
        top: 0;
        font-size: 20px;
        font-weight: 400;
        margin: 0 8px;
        font-family: Roboto, Noto, sans-serif;
        flex-grow: 1;
        flex-shrink: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 0;
        display: inline-block;
      }

      .title a {
        color: #5a5e61;
        text-decoration: none;
      }
    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div id="codelab-title">
        <site-title icon="home" position="top"></site-title>
        <div class="codelab-time-container">
          <div
            class="time-remaining"
            tabindex="0"
            role="timer"
            data-title="Estimated time remaining: 40 minutes"
          >
            ${this.time}
          </div>
        </div>
      </div>
    `;
  }
}
// tell the browser about our tag and class it should run when it sees it
globalThis.customElements.define(TrainingTop.tag, TrainingTop);
