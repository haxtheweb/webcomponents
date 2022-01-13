/* eslint-disable no-unused-vars */
import { html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors";

export class PostCardPostmark extends SimpleColors {
  constructor() {
    super();
    this.accentColor = "grey";
    this.image = new URL(
      "../assets/postcard-postmark.svg",
      import.meta.url
    ).href;
    this.alt = "Post Mark";
    this.locations = "insert - locations - here";
  }

  static get tag() {
    return "post-card-postmark";
  }

  static get properties() {
    return {
      ...super.properties,
      image: { type: String },
      alt: { type: String },
      locations: { type: String },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --img-width: 250px;
          font-family: "Bebas Neue", sans-serif;
        }
        div {
          width: var(--img-width);
          /* border: 1px dashed black; */
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0.8;
        }
        img {
          width: var(--img-width);
          height: calc(var(--img-width) * (1 / 3));
          filter: invert(62%) sepia(0%) saturate(329%) hue-rotate(162deg)
            brightness(98%) contrast(95%); /* created using: https://codepen.io/sosuke/pen/Pjoqqp */
        }
        p {
          width: var(--img-width);
          text-transform: uppercase;
          text-align: center;
          color: var(--simple-colors-default-theme-accent-6);
          margin: 0px;
          font-size: 16px;
          letter-spacing: 2px;
          text-align: center;
          overflow: hidden;
        }
      `,
    ];
  }

  render() {
    return html`
      <div>
        <img src="${this.image}" alt="${this.alt}" />
        <p>${this.locations}</p>
      </div>
    `;
  }
}
customElements.define(PostCardPostmark.tag, PostCardPostmark);
