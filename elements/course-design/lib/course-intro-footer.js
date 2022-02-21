import { LitElement, html, css } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

class CourseIntroFooter extends LitElement {
  static get tag() {
    return "course-intro-footer";
  }

  static get properties() {
    return {
      organization: { type: String },
      organizationLink: { type: String },
      company: { type: String },
      companyLink: { type: String },
    };
  }

  constructor() {
    super();
    this.organization = "";
    this.organizationLink = "";
    this.company = "";
    this.companyLink = "";
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        @media screen and (min-width: 320px) {
          #footer-container {
            min-height: 150px;
            border-top: solid 3px;
          }
        }

        @media screen and (min-width: 620px) {
          #footer-container {
            min-height: 200px;
            border-top: solid 4px;
          }
        }

        @media screen and (min-width: 920px) {
          #footer-container {
            min-height: 250px;
            border-top: solid 5px;
          }
        }

        #footer-container {
          background-color: #000;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media screen and (min-width: 320px) {
          #company-logo img {
            height: 70px;
          }
        }

        @media screen and (min-width: 620px) {
          #company-logo img {
            height: 80px;
          }
        }

        @media screen and (min-width: 920px) {
          #company-logo img {
            height: 100px;
          }
        }

        @media screen and (min-width: 1120px) {
          #company-logo img {
            height: 120px;
          }
        }

        @media screen and (min-width: 320px) {
          #organization-logo img {
            height: 70px;
          }
        }

        @media screen and (min-width: 620px) {
          #organization-logo img {
            height: 80px;
          }
        }

        @media screen and (min-width: 920px) {
          #organization-logo img {
            height: 100px;
          }
        }

        @media screen and (min-width: 1120px) {
          #organization-logo img {
            height: 120px;
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
      this.organization = toJS(
        store.manifest.metadata.theme.variables.organization
      );
    });
    this._disposer = autorun(() => {
      this.company = toJS(store.manifest.metadata.theme.variables.company);
    });
    this._disposer = autorun(() => {
      this.companyLink = toJS(
        store.manifest.metadata.theme.variables.companyLink
      );
    });
    this._disposer = autorun(() => {
      this.organizationLink = toJS(
        store.manifest.metadata.theme.variables.organizationLink
      );
    });
    this.shadowRoot.querySelector(
      "#footer-container"
    ).style.borderColor = `${toJS(
      store.manifest.metadata.theme.variables.hexCode
    )}`;
  }

  render() {
    return html`
      <div id="footer-container">
        <div id="company-logo">
          <a href="${this.companyLink}" target="_blank">
            <img src="${this.company}" />
          </a>
        </div>
        <div id="organization-logo">
          <a href="${this.organizationLink}" target="_blank">
            <img src="${this.organization}" />
          </a>
        </div>
      </div>
    `;
  }
}
customElements.define(CourseIntroFooter.tag, CourseIntroFooter);
