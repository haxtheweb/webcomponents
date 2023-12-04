
// import stuff
import { LitElement, html, css } from "lit";

export class TrainingButton extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = "";
    this.id = "";
    this.index = null;
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return "training-button";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      id: { type: String },
      index: { type: Number },
    };
  }

  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: block;
        /* margin: 16px;
        padding: 16px; */
      }
      .wrapper {
        /* font-size: larger; */
        text-decoration: none;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        /* font-size: 100px; */
        color: rgb(128, 134, 139);
        min-height: 52px;
        font-weight: bold;
        line-height: 20px;
        box-sizing: content-box;
        position: relative;
        font-family: Roboto, Noto, sans-serif;
        -webkit-font-smoothing: antialiased;
        transition: all 0.3s ease-in-out 0s;
        border: 1px solid rgb(218, 220, 224);
        border-radius: 5px;
        margin: 4px 17px;
        background-color: rgb(255, 255, 255);
      }
      #title {
        font-size: 14px;
        align-items: center;
        margin: auto -2px;
        font-weight: normal;
      }

      h2 {
        font-size: 15px;
        align-items: center;
        margin-left: 10px;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 10px;
        color: white;
      }

      .dot {
        height: 25px;
        width: 25px;
        background-color: rgb(128 134 140);
        border-radius: 50%;
        margin: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .wrapper:active {
        background-color: #1a73e8;
      }
    `;
  }

  updated(changedProperties) {
    // Course progression
    if (changedProperties.has("index") && this.index !== null) {
      const dot = this.shadowRoot.querySelector(".dot");
      const id = this.shadowRoot.querySelector("#title");

      if (parseInt(this.id) - 1 === this.index) {
        id.style.fontWeight = "bold";
      } else {
        id.style.fontWeight = "normal";
      }

      if (parseInt(this.id) - 1 <= this.index) {
        dot.style.backgroundColor = "#1a73e8";
        id.style.color = "black";
      } else {
        dot.style.backgroundColor = "rgb(128, 134, 140)";
        id.style.color = "";
      }
    }
  }

  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
        <span class="dot">
          <h2>${this.id}</h2>
        </span>
        <span id="title">${this.title}</span>
        <slot></slot>
      </div>
    `;
  }
}

// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);