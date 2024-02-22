import { LitElement, html, css } from "lit";

export class PostCardPostmark extends LitElement {
  constructor() {
    super();
    this.image = new URL(
      "./assets/postcard-postmark.svg",
      import.meta.url,
    ).href;
    this.alt = "";
    this.locations = "";
  }

  static get tag() {
    return "post-card-postmark";
  }

  static get properties() {
    return {
      image: { type: String },
      alt: { type: String },
      locations: { type: String },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          --post-card-img-width: 250px;
          font-family: "Bebas Neue", sans-serif;
        }
        div {
          width: var(--post-card-img-width);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0.8;
        }
        img {
          width: var(--post-card-img-width);
          height: calc(var(--post-card-img-width) * (1 / 3));
          filter: invert(62%) sepia(0%) saturate(329%) hue-rotate(162deg)
            brightness(98%) contrast(95%); /* created using: https://codepen.io/sosuke/pen/Pjoqqp */
        }
        p {
          width: var(--post-card-img-width);
          text-transform: uppercase;
          text-align: center;
          color: black;
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
        <img loading="lazy" src="${this.image}" alt="${this.alt}" />
        <p>${this.locations}</p>
      </div>
    `;
  }
}
customElements.define(PostCardPostmark.tag, PostCardPostmark);
