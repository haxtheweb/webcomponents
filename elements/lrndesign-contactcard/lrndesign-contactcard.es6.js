import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
`lrndesign-contactcard`
lrndesign-contactcard

* @demo demo/index.html
*/
class LrndesignContactcard extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-card/paper-card.js");
    import("@polymer/paper-button/paper-button.js");
    import("@lrnwebcomponents/lrn-icons/lrn-icons.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/maps-icons.js");
    import("@polymer/iron-icons/hardware-icons.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
    import("@lrnwebcomponents/social-media-icons/social-media-icons.js");
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

        social-media-icons {
          --social-media-icons-hover-color: var(
            --contactcard-icons-hover-color
          );
          margin-left: 8px;
        }

        .icons {
          display: flex;
          justify-content: center;
          align-items: flext-start;
          padding-top: 5px;
        }

        paper-button {
          padding: 0;
          margin: 0 8px;
          display: block;
          min-width: 16px;
        }
      </style>
      <paper-card>
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
              <a tabindex="-1" href\$="mailto:[[email]]">
                <paper-button id="mail" title$="Email address [[email]]">
                  <iron-icon icon="mail" class="mail_icon"></iron-icon>
                </paper-button>
              </a>
              <paper-tooltip for="mail" position="bottom">Email</paper-tooltip>
            </template>
            <template is="dom-if" if="[[phone]]">
              <a tabindex="-1" href\$="tel:[[phone]]">
                <paper-button id="phone" title$="Phone number [[phone]]">
                  <iron-icon
                    icon="maps:local-phone"
                    class="phone_icon"
                  ></iron-icon>
                </paper-button>
              </a>
              <paper-tooltip for="phone" position="bottom">Call</paper-tooltip>
            </template>
            <template is="dom-if" if="[[website]]">
              <a tabindex="-1" href\$="[[website]]">
                <paper-button id="website" title$="Website address [[website]]">
                  <iron-icon
                    icon="hardware:desktop-windows"
                    class="computer_icon"
                  ></iron-icon>
                </paper-button>
              </a>
              <paper-tooltip for="website" position="bottom"
                >Visit</paper-tooltip
              >
            </template>
            <template is="dom-if" if="[[twitter]]">
              <a tabindex="-1" href$="[[twitter]]">
                <paper-button id="twitter" title$="Twitter name [[twitter]]">
                  <social-media-icons
                    icon="twitter"
                    color="#aeaeae"
                    size="35"
                    class="twitter_icon"
                  ></social-media-icons>
                </paper-button>
              </a>
              <paper-tooltip for="twitter" position="bottom"
                >Connect</paper-tooltip
              >
            </template>
          </div>
        </div>
      </paper-card>
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
        type: String
      },
      /**
       * The email address of the user.
       */
      email: {
        type: String
      },
      /**
       * The name of the user.
       */
      name: {
        type: String
      },
      /**
       * The job-title / position of the user.
       */
      position: {
        type: String
      },
      /**
       * The employer / organization of the user.
       */
      organization: {
        type: String
      },
      /**
       * The phone number of the user.
       */
      phone: {
        type: String
      },
      /**
       * The associated website of the user.
       */
      website: {
        type: String
      },
      /**
       * Twitter account of the user.
       */
      twitter: {
        type: String
      }
    };
  }
}
window.customElements.define(LrndesignContactcard.tag, LrndesignContactcard);
export { LrndesignContactcard };
