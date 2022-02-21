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
    };
  }
  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.icon = "";
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
          min-height: 28vw;
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

        #lesson {
          padding: 10px 0 0;
          margin-bottom: -15px;
        }

        #header-shield {
          width: 100%;
        }

        @media screen and (min-width: 320px) {
          svg#psu-logo {
            width: 45px;
            height: 45px;
            padding: 10px 0 0 10px;
          }
        }

        @media screen and (min-width: 620px) {
          svg#psu-logo {
            width: 55px;
            height: 55px;
            padding: 12px 0 0 12px;
          }
        }

        @media screen and (min-width: 920px) {
          svg#psu-logo {
            width: 80px;
            height: 80px;
            padding: 15px 0 0 15px;
          }
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    this._disposer = autorun(() => {
      this.title = toJS(store.manifest.title);
      this.description = toJS(store.manifest.description);
      this.icon = toJS(store.manifest.metadata.theme.variables.icon);

      this.shadowRoot.querySelector("#sub-heading").style.color = `${toJS(
        store.manifest.metadata.theme.variables.hexCode
      )}`;

      this.shadowRoot.querySelector(
        "#header"
      ).style.backgroundImage = `url(${toJS(
        store.manifest.metadata.theme.variables.image
      )})`;
    });
  }

  render() {
    return html`
      <div id="header-container">
        <div id="header">
          <div id="header-shield">
            <a href="https://www.psu.edu" target="_blank">
              <svg
                id="psu-logo"
                name="Penn State Logo Blue"
                viewBox="0 0 90 90"
              >
                <defs>
                  <style>
                    .b7fa77f5-1930-4db8-8b8c-83ec9083c90c {
                      fill: #fff;
                    }
                    .abbe09ff-d9b5-4fdb-805a-9f82ce1b20d2 {
                      fill: #1e407c;
                    }
                    .afd38d5d-29d0-4cce-8d23-74da5499bd69 {
                      fill: #96bee6;
                    }
                  </style>
                </defs>
                <path
                  class="b7fa77f5-1930-4db8-8b8c-83ec9083c90c"
                  d="M41.47,86.16C24.24,75.92,2.51,61,2.51,34.72V7c8-3,20.23-6.77,39-6.77,19,0,32,4.09,39,6.77V34.72C80.43,61.24,57.86,76.53,41.47,86.16Z"
                />
                <path
                  class="abbe09ff-d9b5-4fdb-805a-9f82ce1b20d2"
                  d="M53.19,50.2c0-.59.49-1.5.49-2.32,0-1-1.19-1.28-2.12-1.41-2-.27-2.6-.18-2.6-.61s.26-.61.62-1.12A3.81,3.81,0,0,1,52,43.61a21.48,21.48,0,0,1,3-.23,16.47,16.47,0,0,1,2.91.28c1.2.21,1.38.71,1.38,1.27v.56c0,.56-.46.85-1.29,1l-.64.13c-.61.13-1.35.25-1.62,1-.57,1.64-1.56,2.92-2.29,2.89A.31.31,0,0,1,53.19,50.2Zm1.72-26.38c-.07,0-.32-.13-.32-.38s.21-.59.63-1.15c1-1.31,2.32-2.92,2.81-2.92.24,0,.39.17.68.73A3.23,3.23,0,0,1,59,21.52a7.27,7.27,0,0,1-1.53,4.34A12.35,12.35,0,0,0,54.91,23.82ZM26.29,27.06c.44,0,.77-.29,1.43-1,1.48-1.63,2.91-1.85,2.91-2.55a2,2,0,0,0-.41-.95A63.57,63.57,0,0,1,27,17c-.34-.65-.78-1.1-1.12-1.1-.55,0-1.12.64-1.46,1.19a5.16,5.16,0,0,0-.94,2.42,17.34,17.34,0,0,0,.79,4.77C24.84,25.74,25.61,27.06,26.29,27.06Zm17.79,5.7a3,3,0,0,0-3.15-2.51,3.87,3.87,0,0,0-3.49,2.39A3.63,3.63,0,0,0,40,34.85c.23.07.45.08.45.27s-.28.41-.89.41A4.38,4.38,0,0,1,36,34.07a13.05,13.05,0,0,1-1.8.29.79.79,0,0,1-.86-.9,2.65,2.65,0,0,1,.3-1.13c.12-.23.23-.47.32-.63a5.72,5.72,0,0,1,2.52-2.9l1-.6a5.08,5.08,0,0,1,2.94-.73h.87A3.87,3.87,0,0,1,44,28.4c1.27,1.07,2,1.65,2,2.45a3.5,3.5,0,0,1-.75,2.49,3.14,3.14,0,0,1-2.07,1.33c-.16,0-.21-.09-.21-.18s.14-.18.28-.3A3.33,3.33,0,0,0,44.08,32.76Zm8.55,27.31a15.12,15.12,0,0,1-3.9.25c-4.42,0-5.17-1.09-5.17-2,0-1.44,6.34-2.45,8.84-2.45s3.45.77,3.45,1.35S54.77,59.56,52.63,60.07ZM27.13,73a139.9,139.9,0,0,0,14.34,9.64h0c.05-4.33-.09-6.88,2.84-10,1.19-1.24,2.41-2.51,3.52-3.65.83-.87,1.5-1.51,1.9-1.51s.4.15.4.53a8.86,8.86,0,0,0,1.06,3.5,4.38,4.38,0,0,0,3.23,2.51C67,64.64,77.48,52.27,77.48,34.66V9c-3.1-1-15.82-5.93-36-5.93S8.56,8,5.46,9V34.66A40.71,40.71,0,0,0,10.83,55c.34-3.57,2.75-5.25,2.75-8.76,0-2.44-.7-4-.7-6,0-3.69,5-11.3,7.59-14.4.07-.09.24-.31.45-.31a.54.54,0,0,1,.44.3c.26.41.38.62.66.62s.39-.16.39-.41a21.69,21.69,0,0,1-.74-5.92c0-2.94.68-3.56,2.51-5.35a4,4,0,0,1,2.33-1.31,3.08,3.08,0,0,1,2.29,1.32c1.13,1.15,2.7,3.18,3,3.5a.32.32,0,0,0,.29.18c.52,0,1-.16,3.22-.16,4.13,0,10.34.65,13.53,1.69a23.9,23.9,0,0,0,2.42.91c.22,0,.23-.14.23-.25s-.43-.54-.43-.82a.5.5,0,0,1,.3-.41c2.39-1.28,4.42-2.25,6.28-2.25,1.08,0,1.62.94,2.07,1.87a6.22,6.22,0,0,1,.74,2.69,8.22,8.22,0,0,1-1.73,5.13c.36.38.89.95,1.2,1.33a4.29,4.29,0,0,1,1.25,2.47,8.83,8.83,0,0,1-.31,1.51c0,.22-.24.67-.62.66s-.44-.39-.45-.72a2.24,2.24,0,0,1,0-.26,3.86,3.86,0,0,0-3.26-3.76h-.31a3.31,3.31,0,0,0-2.55,1,2.45,2.45,0,0,0-.78,1.79,5,5,0,0,0,.7,1.78c.24.47.85,1.61,1.19,2.19a1.18,1.18,0,0,0,1.08.69c1,0,1.92-.14,1.92-.45,0-.09-.05-.16-.19-.16l-.32,0c-1.34,0-2.06-1.71-2.73-3.25a2.84,2.84,0,0,1,2.14-1,2,2,0,0,1,2.21,2.06,3.2,3.2,0,0,1-.28,1.28.66.66,0,0,0-.08.24c0,.18.23.22.59.3l.53.13a1.61,1.61,0,0,1,1,.93c.11.32.38,1,.44,1.21a8.41,8.41,0,0,1,.58,2.78,8,8,0,0,1-.4,2.71,15.77,15.77,0,0,0-.67,2.94,2.51,2.51,0,0,1,.22.49,5.72,5.72,0,0,1,.53,2.33v.79A6,6,0,0,1,60,52.52c-.51.69-1.24,1.67-1.67,2.21a1.39,1.39,0,0,1-1,.56,2.89,2.89,0,0,1-.66-.12l-1-.26a2.12,2.12,0,0,1-1.52-1.6l-.22-.56c-.22-.55-.34-.91-.68-.91s-.5.17-.75.55a4.13,4.13,0,0,1-3,2.23l-2.3.51a21.4,21.4,0,0,1-3.58.65,4.54,4.54,0,0,1-.63,0c-1.3-.18-2.22-.26-3.83-2.19-2.22-2.65-2-3-2.13-6.6,0-.4-.14-.9-.56-.9s-.53.76-.67,1.84c-.16,1.26-.45,2.57-1.07,2.57a4.17,4.17,0,0,1-1.39-.28c-.81-.27-2.82-1-3.87-1.29-1.44-.48-2.82-.86-3.37-2.13-.27-.6-.75-1.72-1-2.3-.17-.41-.3-.62-.57-.62s-.47.45-.51.81-.15,1.35-.2,1.93a8.09,8.09,0,0,1-1.77,4.94c-.48.64-.94,1.29-1.48,2a8.37,8.37,0,0,0-1.73,5.8c0,.18,0,1.24,0,1.73C18.94,65.27,20,67.35,27.13,73Z"
                />
                <path
                  class="afd38d5d-29d0-4cce-8d23-74da5499bd69"
                  d="M60.6,35.67h0c.11.32.38,1,.44,1.21a8.41,8.41,0,0,1,.58,2.78,8,8,0,0,1-.4,2.71,15.77,15.77,0,0,0-.67,2.94c-.11-.24-2.28-4-2.44-4.28a1.91,1.91,0,0,1-.31-1c0-.38.17-.61.63-.9l.88-.51a2.12,2.12,0,0,0,1.38-2A6.48,6.48,0,0,0,60.6,35.67Zm-9.44,6a2.58,2.58,0,0,1,.22.88,1.24,1.24,0,0,1-.45,1.06l-.58.52a2.09,2.09,0,0,0-.77.63c-.36.51-.62.82-.62,1.12a.24.24,0,0,0,.1.21,1.52,1.52,0,0,1-.6-1.24c0-.4.13-.6.13-1a2.59,2.59,0,0,0-.15-.8c-.6-2-1.61-4.4-2.23-6s-1.14-2.56-1.85-2.56c-.4,0-.76.2-1.18.2a3.14,3.14,0,0,0,2.07-1.33A3.5,3.5,0,0,0,46,30.85a1.62,1.62,0,0,0-.45-1.06,12.13,12.13,0,0,1,2.11,3.42C49,36.07,50.18,39.2,51.16,41.65ZM18.84,61.05c0-.49,0-1.55,0-1.73a8.37,8.37,0,0,1,1.73-5.8c.54-.71,1-1.36,1.48-2a8.09,8.09,0,0,0,1.77-4.94c.05-.58.15-1.52.2-1.93s.13-.81.51-.81.4.21.57.62c.24.58.72,1.7,1,2.3.55,1.27,1.93,1.65,3.37,2.13,1.05.34,3.06,1,3.87,1.29a4.17,4.17,0,0,0,1.39.28c.62,0,.91-1.31,1.07-2.57.14-1.08.3-1.84.67-1.84s.55.5.56.9c.14,3.58-.09,3.95,2.13,6.6,1.61,1.93,2.53,2,3.83,2.19a1.77,1.77,0,0,1-1.1-1.87V52.59a4.88,4.88,0,0,1,.39-2c.15-.35.33-1,.49-1.36a2.21,2.21,0,0,0,.15-1.29,7.41,7.41,0,0,0-.55-2.14c-.2-.6-.46-1.47-.72-2.19-.81-2.25-1.13-2.77-3.81-3.13-.86-.11-4.63-.65-5.42-.76-3-.43-5.37-.57-6.59-2.59-1.47-2.41-1.32-5.34-2.73-5.34-.67,0-1,.74-1,1.83s.43,3,.43,6.23c0,2.79-.26,3.57-1.89,5.63-.42.53-1,1.31-1.35,1.77-1.21,1.52-1.75,2.37-1.67,4.14A59.54,59.54,0,0,0,18.84,61.05Zm30.7,10.77c.1-1.12.59-3,.59-3.74h0c0-.38-.12-.53-.4-.53s-1.07.64-1.9,1.51c-1.11,1.14-2.33,2.41-3.52,3.65-2.93,3.07-2.79,5.62-2.84,10h0c3.26-2,6.24-3.85,8.45-5.36A17.1,17.1,0,0,1,49.54,71.82Z"
                />
              </svg>
            </a>
          </div>
        </div>
        <div id="header-icon">
          <simple-icon id="course-icon" icon="${this.icon}"></simple-icon>
        </div>

        <div id="info">
          <h1 id="title">${this.title}</h1>
          <h2 id="sub-heading">${this.description}</h2>
          <h3 id="lesson">Lesson Plan</h3>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "course-intro-header";
  }
}
customElements.define(CourseIntroHeader.tag, CourseIntroHeader);
