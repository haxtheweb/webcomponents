import { html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import { autorun, toJS } from "mobx";
class CourseIntroHeader extends DDD {
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
      super.styles,
      css`
        :host {
          display: block;
        }

        h1,
        h2,
        h3 {
          font-family: var(
            --course-intro-header-font-family,
            var(--ddd-font-navigation)
          );
          font-weight: var(--ddd-font-weight-light);
          color: #ffffff;
        }
        h1 {
          font-size: var(--ddd-font-size-xxl);
        }
        h2 {
          font-size: var(--ddd-font-size-m);
        }
        h3 {
          font-size: var(--ddd-font-size-xs);
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
          min-height: var(--course-intro-header-min-height, 20vw);
        }

        #header-icon {
          background-color: light-dark(white, black);
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

        #info {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 42px 0 18px 0;
          text-transform: uppercase;
          margin-top: -154px;
          text-align: center;
        }
        simple-icon#course-icon {
          --simple-icon-width: 80px;
          --simple-icon-height: 80px;
          --simple-icon-color: light-dark(
            var(--course-intro-header--icon--color, #1e1e1e),
            white
          );
        }

        #header-icon {
          width: 125px;
          height: 125px;
          bottom: 100px;
        }

        @media (max-width: 720px) {
          simple-icon#course-icon {
            --simple-icon-width: 64px;
            --simple-icon-height: 64px;
          }

          #header-icon {
            width: 80px;
            height: 80px;
          }
        }

        #outline-title {
          margin: 0;
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
