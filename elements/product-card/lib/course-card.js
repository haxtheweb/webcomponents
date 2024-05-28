import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/simple-icon.js";

class CourseCard extends SimpleColors {
  static get properties() {
    return {
      ...super.properties,
      size: { type: String, reflect: true },
      url: { type: String },
      image: { type: String },
      alt: { type: String },
      number: { type: String },
      name: { type: String },
      icon: { type: String },
      author: { type: String },
      zoom: { type: Boolean, reflect: true },
    };
  }
  constructor() {
    super();
    this.zoom = false;
    this.url = "";
    this.image = "";
    this.alt = "";
    this.number = "";
    this.name = "";
    this.icon = "";
    this.author = "";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        a {
          filter: var(--course-card-filter);
          transition: 0.3s all ease-in-out;
          text-decoration: none;
          color: var(--simple-colors-default-theme-accent-12, #000);
          background-color: var(--simple-colors-default-theme-grey-1, #ffffff);
          display: block;
          width: 100%;
          min-height: 300px;
          border: solid 2px var(--simple-colors-default-theme-grey-1, #ffffff);
        }

        a:active,
        a:hover,
        a:focus {
          filter: var(--course-card-filter-hover);
          outline: 2px solid
            var(--simple-colors-default-theme-accent-7, #666666);
          box-shadow: 2px 2px 10px
            var(--simple-colors-default-theme-accent-2, #eeeeee);
          border: solid 2px var(--simple-colors-default-theme-accent-7, #666666);
        }

        #card_wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #course_number {
          font-size: 28px;
          word-break: break-all;
          text-transform: uppercase;
          text-align: center;
          width: 90%;
          line-height: 1.4;
        }

        #course_name {
          font-size: 18px;
          text-align: center;
          width: 90%;
          margin: 0 0 15px 0;
          line-height: 1.2;
        }
        :host([size="small"]) #course_number {
          font-size: 18px;
        }
        :host([size="small"]) #course_name {
          font-size: 14px;
        }
        :host([size="small"]) #course_author {
          font-size: 12px;
        }
        #course_icon {
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          bottom: 20px;
          border: solid;
          background-color: var(
            --simple-colors-default-theme-accent-7,
            #666666
          );
          border-color: var(--simple-colors-default-theme-grey-1, #ffffff);
          border-width: 5px;
          margin: 0 0 -20px 0;
        }

        simple-icon {
          --simple-icon-width: 48px;
          --simple-icon-height: 48px;
          fill: var(--simple-colors-default-theme-grey-1, #ffffff);
        }

        #course_image {
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
          background-color: var(
            --simple-colors-default-theme-accent-11,
            #363533
          );
          width: 100%;
          height: 150px;
          animation-name: mymove2;
          animation-duration: 0.6s;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }

        @keyframes mymove {
          0% {
            background-size: 100%;
          }
          100% {
            background-size: 150%;
          }
        }
        @keyframes mymove2 {
          0% {
            background-size: 150%;
          }
          100% {
            background-size: 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :host([zoom]) #course_image {
            animation: none !important;
          }
        }

        :host([zoom]) a:active #course_image,
        :host([zoom]) a:hover #course_image,
        :host([zoom]) a:focus #course_image {
          animation-name: mymove;
          animation-duration: 0.6s;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }

        #course_author {
          font-size: 12px;
          margin-top: -10px;
        }
      `,
    ];
  }
  render() {
    return html`
      <a href="${this.url}" title="${this.alt}">
        <div id="card_wrap">
          <div
            id="course_image"
            style="background-image:url('${this.image}')"
          ></div>
          <div id="course_icon">
            <simple-icon
              icon="${this.icon}"
              accent-color="${this.accentColor}"
            ></simple-icon>
          </div>
          <div id="course_number">${this.number}</div>
          <div id="course_name">${this.name}</div>
          ${this.author
            ? html` <div id="course_author">By: ${this.author}</div> `
            : ``}
        </div>
      </a>
    `;
  }
  static get tag() {
    return "course-card";
  }
}
customElements.define(CourseCard.tag, CourseCard);
export { CourseCard };
