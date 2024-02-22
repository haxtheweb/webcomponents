import { LitElement, html, css } from "lit";
const postCardStampBg = new URL(
  "./assets/postcard-stamp-bg.png",
  import.meta.url,
).href;
export class PostCardStamp extends LitElement {
  constructor() {
    super();
    this.image = new URL(this.image, import.meta.url).href;
  }

  static get tag() {
    return "post-card-stamp";
  }

  static get properties() {
    return {
      image: { type: String, reflect: true },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          --post-card-img-width: 100px;
        }

        div {
          display: inline-grid;
          grid-template-columns: 1;
          grid-template-rows: 1;
        }
        img {
          grid-column: 1;
          grid-row: 1;
          justify-content: center;
        }
        .stampImage {
          width: var(--post-card-img-width);
          height: calc(var(--post-card-img-width) * 1.25);
          justify-self: center;
          padding-top: 10px;
          transform: rotate(1.5deg);
          z-index: 3;
        }
        .stampBackground {
          width: calc(var(--post-card-img-width) + 20px);
          height: calc(var(--post-card-img-width) * 1.25 + 20px);
          z-index: 2;
        }
      `,
    ];
  }

  render() {
    return html`
      <div>
        <img
          loading="lazy"
          src="${postCardStampBg}"
          alt=""
          class="stampBackground"
        />
        <img loading="lazy" src="${this.image}" alt="" class="stampImage" />
      </div>
    `;
  }
}
customElements.define(PostCardStamp.tag, PostCardStamp);
