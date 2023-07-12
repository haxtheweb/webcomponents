import { LitElement, html, css } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import { autorun, toJS } from "mobx";
class CourseIntroHeader extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      backgroundImage: { type: String },
      color: { type: String },
    };
  }
  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.icon = "";
    this.backgroundImage = "";
    this.color = "";
    autorun(() => {
      const manifest = toJS(store.manifest);
      if (
        manifest &&
        manifest.metadata &&
        manifest.metadata.theme &&
        manifest.metadata.theme.variables
      ) {
        this.title = manifest.title;
        this.description = manifest.description;
        this.icon = manifest.metadata.theme.variables.icon;
        this.backgroundImage = `url('${manifest.metadata.theme.variables.image}')`;
        this.color = manifest.metadata.theme.variables.hexCode;
      }
    });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        h1,
        h2,
        h3 {
          font-family: var(--course-intro-header-font-family, "Roboto");
          margin: 0;
          color: #fff;
        }

        @media screen and (min-width: 320px) {
          h1 {
            font-size: 2.5em;
            font-weight: 300;
          }
        }

        @media screen and (min-width: 620px) {
          h1 {
            font-size: 3em;
          }
        }

        @media screen and (min-width: 920px) {
          h1 {
            font-size: 5em;
          }
        }

        @media screen and (min-width: 320px) {
          h2 {
            font-size: 1.5em;
            font-weight: 300;
          }
        }

        @media screen and (min-width: 620px) {
          h2 {
            font-size: 2em;
          }
        }

        @media screen and (min-width: 920px) {
          h2 {
            font-size: 2.5em;
          }
        }

        @media screen and (min-width: 320px) {
          h3 {
            font-size: 1.2em;
            font-weight: 300;
          }
        }

        @media screen and (min-width: 620px) {
          h3 {
            font-size: 1.5em;
          }
        }

        #header-container {
          display: flex;
          flex-direction: column;
          background-color: var(
            --course-intro-header--header--background-color,
            #1e1e1e
          );
        }

        #header {
          display: flex;
          justify-content: center;
          width: 100%;
          background-image: var(
            --course-intro-header--header--background-image
          );
          background-size: var(
            --course-intro-header--header--background-size,
            cover
          );
          background-repeat: var(
            --course-intro-header--header--background-repeat,
            no-repeat
          );
          background-position: var(
            --course-intro-header--header--background-position,
            top center
          );
          min-height: var(--course-intro-header-min-height, 28vw);
        }

        @media screen and (min-width: 320px) {
          #header-icon {
            background-color: #fff;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 6px solid
              var(--course-intro-header--header--background-color, #1e1e1e);
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            bottom: 64px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media screen and (min-width: 320px) {
          simple-icon#course-icon {
            --simple-icon-width: 90px;
            --simple-icon-height: 90px;
            --simple-icon-color: var(
              --course-intro-header--icon--color,
              #1e1e1e
            );
          }
        }

        @media screen and (min-width: 620px) {
          #header-icon {
            width: 140px;
            height: 140px;
            bottom: 86px;
          }
        }

        @media screen and (min-width: 620px) {
          simple-icon#course-icon {
            --simple-icon-width: 110px;
            --simple-icon-height: 110px;
          }
        }

        @media screen and (min-width: 920px) {
          #header-icon {
            width: 210px;
            height: 210px;
            border: 8px solid
              var(--course-intro-header--icon--border-color, #1e1e1e);
            bottom: 128px;
          }
        }

        @media screen and (min-width: 920px) {
          simple-icon#course-icon {
            --simple-icon-width: 190px;
            --simple-icon-height: 190px;
          }
        }

        @media screen and (min-width: 1220px) {
          #header-icon {
            width: 250px;
            height: 250px;
            bottom: 150px;
          }
        }

        @media screen and (min-width: 1220px) {
          simple-icon#course-icon {
            --simple-icon-width: 200px;
            --simple-icon-height: 200px;
          }
        }

        @media screen and (min-width: 320px) {
          #info {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 0;
            text-transform: uppercase;
            font-family: Open Sans;
            margin-top: -110px;
            text-align: center;
          }
        }

        @media screen and (min-width: 620px) {
          #info {
            margin-top: -130px;
          }
        }

        @media screen and (min-width: 920px) {
          #info {
            margin-top: -160px;
          }
        }

        @media screen and (min-width: 1220px) {
          #info {
            margin-top: -190px;
          }
        }

        @media screen and (min-width: 320px) {
          #sub-heading {
            margin-top: -20px;
          }
        }

        @media screen and (min-width: 620px) {
          #sub-heading {
            margin-top: -30px;
          }
        }

        @media screen and (min-width: 920px) {
          #sub-heading {
            margin-top: -40px;
          }
        }

        #outline-title {
          padding: 10px 0 0;
          margin-bottom: -15px;
        }

        #header-branding {
          width: 100%;
        }
      `,
    ];
  }

  render() {
    return html`
      <div id="header-container">
        <div id="header" style="background-image:${this.backgroundImage};">
          <div id="header-branding">
            <slot name="header-left"></slot>
          </div>
        </div>
        <div id="header-icon">
          <simple-icon id="course-icon" icon="${this.icon}"></simple-icon>
        </div>
        <div id="info">
          <h1 id="title">${this.title}</h1>
          <h2 id="sub-heading" style="color:${this.color};">
            ${this.description}
          </h2>
          <h3 id="outline-title">
            <slot name="outline-title"></slot>
          </h3>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "course-intro-header";
  }
}
customElements.define(CourseIntroHeader.tag, CourseIntroHeader);
