/* eslint-disable no-unused-vars */
import { html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors";

const tape = new URL("../assets/postcard-tape.png", import.meta.url).href;

export class PostCardPhoto extends SimpleColors {
  constructor() {
    super();
    this.accentColor = "grey";
    this.image = new URL(this.image, import.meta.url).href;
    this.alt = "";
  }

  static get tag() {
    return "post-card-photo";
  }

  static get properties() {
    return {
      ...super.properties,
      image: { type: String },
      alt: { type: String, reflect: true },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --img-width: 340px;
        }

        div {
          display: inline-grid;
          grid-template-columns: 1;
          grid-template-rows: 1;
          align-items: center;
        }

        img {
          grid-column: 1;
          grid-row: 1;
          justify-self: center;
        }

        .cardShadow {
          width: calc(var(--img-width) * 1.05);
          height: calc(var(--img-width) * 0.78);
          z-index: 2;
          opacity: 0.5;
          transform: translate(1%, 1.5%) rotate(0.5deg);
        }

        .cardImage {
          width: var(--img-width);
          height: calc(var(--img-width) * 0.7);
          z-index: 2;
          transform: rotate(-3deg);
          border-radius: 5px 5px 0px 5px;
        }

        .cardTape {
          width: auto;
          height: calc(var(--img-width) * 0.8);
          z-index: 3;
        }
      `,
    ];
  }

  render() {
    return html`
      <div>
        <img
          src="../assets/postcard-photo-shadow.png"
          alt=""
          class="cardShadow"
        />
        <img src="${this.image}" alt="${this.alt}" class="cardImage" />
        <img src="${tape}" alt="" class="cardTape" />
      </div>
    `;
  }
}
customElements.define(PostCardPhoto.tag, PostCardPhoto);
