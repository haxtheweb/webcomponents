import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/dist/mobx.esm.js";
class CourseIntroHeader extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
    };
  }
  constructor() {
    super();
    this.title = "";
    this.description = "";
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._disposer = autorun(() => {
      this.title = toJS(store.manifest.title);
      this.description = toJS(store.manifest.description);
      this.shadowRoot.querySelector(
        "header"
      ).style.backgroundImage = `url(${toJS(
        store.manifest.metadata.theme.variables.image
      )})`;
    });
  }
  render() {
    return html`
      <header>
        <div id="info">
          <h1 id="title">${this.title}</h1>
          <div id="sub-heading">${this.description}</div>
        </div>
        <div id="header-bottom"></div>
      </header>
    `;
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        header {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-end;
          overflow: hidden;
          width: 100%;
          background-image: var(
            --course-intro-header--header--background-image
          );
          background-size: var(
            --course-intro-header--header--background-size,
            contain
          );
          background-repeat: var(
            --course-intro-header--header--background-repeat,
            no-repeat
          );
          background-position: var(
            --course-intro-header--header--background-position,
            top center
          );
          background-color: rgba(var(--course-intro-bg-color), 1);
          min-height: 50vw;
          min-height: 60vh;
          color: white;
        }
        header > * {
          align-self: flex-end;
          justify-self: center;
          width: 100%;
          flex: 0 0 auto;
          text-align: center;
          position: relative;
        }
        #info {
          background: linear-gradient(
            rgba(var(--course-intro-bg-color), 0),
            rgba(var(--course-intro-bg-color), 1) 100px
          );
          padding: 40px 0;
        }
        #title {
          margin: 0;
          font-family: Lato;
          font-size: var(--course-intro-header--title--FontSize, 56px);
          line-height: 1.2;
          flex: 1 1 auto;
        }
        #sub-heading {
          margin: 0;
          font-family: Lato;
          font-size: var(--course-intro-header--sub-heading--FontSize, 40px);
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 300;
          line-height: 1.2;
        }
        #header-bottom {
          height: 50px;
          background: rgba(var(--course-intro-bg-color), 1);
        }
      `,
    ];
  }
  static get tag() {
    return "course-intro-header";
  }
}
customElements.define(CourseIntroHeader.tag, CourseIntroHeader);
