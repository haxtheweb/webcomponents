import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-icon/iron-icon.js";

class CourseCard extends SimpleColors {
  static get properties() {
    return {
      ...super.properties,
      url: { type: String },
      image: { type: String },
      alt: { type: String },
      number: { type: String },
      name: { type: String },
      icon: { type: String },
      author: { type: String }
    };
  }
  constructor() {
    super();
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
      ...super.styles,
      css`
        :host {
          display: block;
        }

        a {
          text-decoration: none;
          color: var(--simple-colors-default-theme-accent-12, #363533);
          background-color: var(
            --simple-colors-default-theme-accent-1,
            #ffffff
          );
          display: block;
          width: 100%;
          min-height: 300px;
          border: solid 1px var(--simple-colors-default-theme-accent-2, #dcdcdc);
        }

        a:active,
        a:hover,
        a:focus {
          outline: 1px solid
            var(--simple-colors-default-theme-accent-7, #e2801e);
          box-shadow: 4px 4px 10px
            var(--simple-colors-default-theme-accent-2, #dcdcdc);
        }

        #card_wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #course_number {
          font-size: 28px;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.4;
        }

        #course_name {
          font-size: 18px;
          text-align: center;
          width: 90%;
          margin: 0 0 15px 0;
          line-height: 1.2;
        }

        #course_icon {
          background-color: var(--simple-colors-default-theme-accent-1, #fff);
          border-radius: 50%;
          position: relative;
          bottom: 50px;
          border: solid;
          border-color: var(--simple-colors-default-theme-accent-9, #363533);
          border-width: 5px;
          margin: 0 0 -40px 0;
        }

        iron-icon {
          width: 70px;
          height: 70px;
          fill: var(--simple-colors-default-theme-accent-9, #363533);
        }

        #course_image {
          background-repeat: no-repeat;
          background-size: cover;
          background-position: right center;
          width: 100%;
          height: 150px;
        }
        #course_author {
          margin-top: -10px;
        }
      `
    ];
  }
  render() {
    return html`
      <a href="${this.url}">
        <div id="card_wrap">
          <div
            id="course_image"
            style="background-image:url(${this.image})"
            alt="${this.alt}"
          ></div>
          <div id="course_icon">
            <iron-icon icon="${this.icon}"></iron-icon>
          </div>
          <div id="course_number">${this.number}</div>
          <div id="course_name">${this.name}</div>
          <div id="course_author">By: ${this.author}</div>
        </div>
      </a>
    `;
  }
  static get tag() {
    return "course-card";
  }
}
window.customElements.define(CourseCard.tag, CourseCard);
export { CourseCard };
