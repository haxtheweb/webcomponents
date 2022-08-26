import { LitElement, html, css } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

class CourseIntroFooter extends LitElement {
  static get tag() {
    return "course-intro-footer";
  }

  static get properties() {
    return {
    
    };
  }

  constructor() {
    super();
  
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
      if (
        store.manifest &&
        store.manifest.metadata &&
        store.manifest.metadata.theme &&
        store.manifest.metadata.theme.variables
      ) {
        this.shadowRoot.querySelector(
          "#footer-container"
        ).style.borderColor = `${toJS(
          store.manifest.metadata.theme.variables.hexCode
        )}`;
      }
    });
  }

  render() {
    return html`
      <div id="footer-container">
        <div id="company-logo">
          <slot name="footer-left"></slot>
        </div>
        <div id="organization-logo">
          <slot name="footer-right"></slot>
        </div>
      </div>
    `;
  }
}


customElements.define(CourseIntroFooter.tag, CourseIntroFooter);
