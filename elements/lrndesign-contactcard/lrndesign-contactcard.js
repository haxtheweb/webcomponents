import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
/**
`lrndesign-contactcard`
lrndesign-contactcard

* @demo demo/index.html
*/
class LrndesignContactcard extends PolymerElement {
  constructor() {
    super();
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --contactcard-icons-hover-color: gray;
          --contactcard-icons-fill-color: #aeaeae;
        }

        .name {
          text-align: center;
          min-height: 16px;
        }
        .name div {
          font-size: 24px;
          margin-bottom: 12px;
        }

        #img_wrap {
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .profile-image {
          background-color: #aeaeae;
          padding: 4px;
          border-radius: 50%;
          width: 50%;
          min-height: 160px;
          margin-top: 25px;
        }

        .position {
          text-align: center;
          font-style: italic;
          font-size: 16px;
          margin: -10px 0 10px;
        }

        .organization {
          text-align: center;
          font-size: 14px;
          margin: -8px 0 10px;
        }

        #mail {
          width: 35px;
          height: 35px;
          color: var(--contactcard-icons-fill-color);
        }

        #mail:hover,
        #mail:focus {
          color: var(--contactcard-icons-hover-color);
        }

        #phone {
          width: 35px;
          height: 35px;
          color: var(--contactcard-icons-fill-color);
        }

        #phone:hover,
        #phone:focus {
          color: var(--contactcard-icons-hover-color);
        }

        #twitter {
          width: 35px;
          height: 35px;
          color: var(--contactcard-icons-fill-color);
        }
        #twitter:hover,
        #twitter:focus {
          color: var(--contactcard-icons-hover-color);
        }

        #website {
          width: 35px;
          height: 35px;
          color: var(--contactcard-icons-fill-color);
        }
        #website:hover,
        #website:focus {
          color: var(--contactcard-icons-hover-color);
        }

        #group_icons {
          width: 70%;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 10px;
          border-top: 2px #aeaeae solid;
          padding-top: 5px;
        }

        .icons {
          display: flex;
          justify-content: center;
          align-items: flext-start;
          padding-top: 5px;
        }

        button {
          padding: 0;
          margin: 0 8px;
          display: block;
          min-width: 16px;
          background-color: transparent;
          border: 0px solid transparent;
        }
      </style>
      <div class="card">
        <div id="img_wrap">
          <img loading="lazy" class="profile-image" src="[[image]]" />
        </div>
        <div class="name">
          <template is="dom-if" if="[[name]]">
            <div>[[name]]</div>
          </template>
        </div>
        <div class="position">[[position]]</div>
        <div class="organization">[[organization]]</div>
        <div id="group_icons">
          <div class="icons">
            <template is="dom-if" if="[[email]]">
              <a tabindex="-1" href$="mailto:[[email]]">
                <button id="mail" title$="Email address [[email]]">
                  <simple-icon-lite
                    icon="mail"
                    class="mail_icon"
                  ></simple-icon-lite>
                </button>
              </a>
              <simple-tooltip for="mail" position="bottom"
                >Email</simple-tooltip
              >
            </template>
            <template is="dom-if" if="[[phone]]">
              <a tabindex="-1" href$="tel:[[phone]]">
                <button id="phone" title$="Phone number [[phone]]">
                  <simple-icon-lite
                    icon="maps:local-phone"
                    class="phone_icon"
                  ></simple-icon-lite>
                </button>
              </a>
              <simple-tooltip for="phone" position="bottom"
                >Call</simple-tooltip
              >
            </template>
            <template is="dom-if" if="[[website]]">
              <a tabindex="-1" href$="[[website]]">
                <button id="website" title$="Website address [[website]]">
                  <simple-icon-lite
                    icon="hardware:desktop-windows"
                    class="computer_icon"
                  ></simple-icon-lite>
                </button>
              </a>
              <simple-tooltip for="website" position="bottom"
                >Visit</simple-tooltip
              >
            </template>
            <template is="dom-if" if="[[twitter]]">
              <a tabindex="-1" href$="[[twitter]]">
                <button id="twitter" title$="Twitter name [[twitter]]">
                  <simple-icon-lite
                    icon="twitter"
                    color="#aeaeae"
                    size="35"
                    class="twitter_icon"
                  ></simple-icon-lite>
                </button>
              </a>
              <simple-tooltip for="twitter" position="bottom"
                >Connect</simple-tooltip
              >
            </template>
          </div>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "lrndesign-contactcard";
  }

  static get properties() {
    return {
      /**
       * A url to the image in question.
       */
      image: {
        type: String,
      },
      /**
       * The email address of the user.
       */
      email: {
        type: String,
      },
      /**
       * The name of the user.
       */
      name: {
        type: String,
      },
      /**
       * The job-title / position of the user.
       */
      position: {
        type: String,
      },
      /**
       * The employer / organization of the user.
       */
      organization: {
        type: String,
      },
      /**
       * The phone number of the user.
       */
      phone: {
        type: String,
      },
      /**
       * The associated website of the user.
       */
      website: {
        type: String,
      },
      /**
       * Twitter account of the user.
       */
      twitter: {
        type: String,
      },
    };
  }
}
window.customElements.define(LrndesignContactcard.tag, LrndesignContactcard);
export { LrndesignContactcard };
