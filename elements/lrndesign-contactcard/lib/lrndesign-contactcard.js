import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
import "lrn-icons/lrn-icons.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "social-media-icons/social-media-icons.js";
/**
`lrndesign-contactcard`
lrndesign-contactcard

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        --contactcard-icons-hover-color: gray;
        --contactcard-icons-fill-color: #aeaeae;
      }

      .name {
        text-align: center;
        min-height: 1em;
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
        min-height: 10em;
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

      .mail_icon {
        width: 35px;
        height: 35px;
        color: var(--contactcard-icons-fill-color);
      }

      .mail_icon:hover {
        color: var(--contactcard-icons-hover-color);
      }

      .phone_icon {
        width: 35px;
        height: 35px;
        color: var(--contactcard-icons-fill-color);
      }

      .phone_icon:hover {
        color: var(--contactcard-icons-hover-color);
      }

      .computer_icon {
        width: 35px;
        height: 35px;
        color: var(--contactcard-icons-fill-color);
      }

      .computer_icon:hover {
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
        --social-media-icons-hover-color: var(--contactcard-icons-hover-color);
        margin-left: .5em;
      }

      .icons {
        display: flex;
        justify-content: center;
        align-items: flext-start;
        padding-top: 5px;
      }

      paper-button {
        padding: 0;
        margin: 0;
        min-width: 1rem;
      }
    </style>
    <paper-card>
      <div id="img_wrap"><img class="profile-image" src="[[image]]"></div>
      <div class="name">
        <template is="dom-if" if="[[name]]">
        <h2>[[name]]</h2>
        </template>
      </div>
      <div class="position">[[position]]</div>
      <div class="organization">[[organization]]</div>
      <div id="group_icons">
        <div class="icons">
        <template is="dom-if" if="[[email]]">
          <a href\$="mailto:[[email]]">
            <paper-button id="mail">
              <iron-icon icon="mail" class="mail_icon"></iron-icon>
            </paper-button>
          </a>
          <paper-tooltip for="mail">Email</paper-tooltip>
        </template>
        <template is="dom-if" if="[[phone]]">
          <a href\$="tel:[[phone]]">
            <paper-button id="phone">
              <iron-icon icon="maps:local-phone" class="phone_icon"></iron-icon>
              </paper-button>
          </a>
          <paper-tooltip for="phone">Call</paper-tooltip>
        </template>
        <template is="dom-if" if="[[website]]">
          <a href\$="[[website]]">
            <paper-button id="website">
              <iron-icon icon="hardware:desktop-windows" class="computer_icon"></iron-icon>
              </paper-button>
          </a>
          <paper-tooltip for="website">Visit</paper-tooltip>
        </template>
        <template is="dom-if" if="[[twitter]]">
          <a href\$="[[twitter]]">
            <paper-button id="twitter">
              <social-media-icons icon="twitter" color="#aeaeae" size="35" class="twitter_icon"></social-media-icons>
              </paper-button>
          </a>
          <paper-tooltip for="twitter">Connect</paper-tooltip>
        </template>
        </div>
      </div>
    </paper-card>
`,

  is: "lrndesign-contactcard",

  properties: {
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
  }
});
