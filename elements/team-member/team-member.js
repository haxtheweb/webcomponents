import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
/**
 * `team-member`
 * @element team-member
 * `A simple presentation of a team member and basic info`
 * @demo demo/index.html
 */
class TeamMember extends SchemaBehaviors(PolymerElement) {
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --team-member-circle: #1e407d;
          --team-member-border: white;
        }
        .team-member {
          text-align: center;
          padding: 8px;
        }
        iron-image {
          background-color: var(--team-member-color);
          height: 165px;
          width: 165px;
          margin: 0 auto;
          border: 7px solid var(--team-member-border);
          border-radius: 50%;
        }
        .name {
          text-transform: none;
          font-size: 16px;
        }
        .line1 {
          font-size: 12px;
          margin: 0;
          padding: 4px 0;
          line-height: 22px;
        }
        .line2 {
          font-size: 12px;
          margin: 0;
          padding: 4px 0;
          line-height: 18px;
        }
        .social {
          display: inline-block;
          padding-left: 5px;
          padding-right: 5px;
        }
        simple-icon {
          color: var(--team-member-color);
        }
      </style>
      <div class="team-member">
        <iron-image src="[[image]]" sizing="cover" alt=""></iron-image>
        <div class="name">[[fullName]]</div>
        <div hidden$="[[!firstLine]]" class="line1">[[firstLine]]</div>
        <div hidden$="[[!secondLine]]" class="line2">[[secondLine]]</div>
        <div class="social">
          <a tabindex="-1" href$="[[dribble]]" hidden$="[[!dribble]]"
            ><simple-icon icon="mdi-social:dribble"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[facebook]]" hidden$="[[!facebook]]"
            ><simple-icon icon="mdi-social:facebook-box"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[github]]" hidden$="[[!github]]"
            ><simple-icon icon="mdi-social:github-circle"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[google]]" hidden$="[[!google]]"
            ><simple-icon icon="mdi-social:google-plus"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[instagram]]" hidden$="[[!instagram]]"
            ><simple-icon icon="mdi-social:instagram"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[linkedin]]" hidden$="[[!linkedin]]"
            ><simple-icon icon="mdi-social:linkedin"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[pinterest]]" hidden$="[[!pinterest]]"
            ><simple-icon icon="mdi-social:pinterest"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[tumblr]]" hidden$="[[!tumblr]]"
            ><simple-icon icon="mdi-social:tumblr"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[twitch]]" hidden$="[[!twitch]]"
            ><simple-icon icon="mdi-social:twitch"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[twitter]]" hidden$="[[!twitter]]"
            ><simple-icon icon="mdi-social:twitter"></simple-icon
          ></a>
          <a tabindex="-1" href$="[[whatsapp]]" hidden$="[[!whatsapp]]"
            ><simple-icon icon="mdi-social:whatsapp"></simple-icon
          ></a>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "team-member";
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Team Member",
        description: "The user will be able to see this for selection in a UI.",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Content", "Presentation"],
        handles: [],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title",
          },
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title",
          },
        ],
        advanced: [],
      },
    };
  }
  static get properties() {
    return {
      ...super.properties,

      /**
       * Image
       */
      image: {
        type: String,
      },
      /**
       * Full name of the team member
       */
      fullName: {
        type: String,
      },
      /**
       * first line
       */
      firstLine: {
        type: String,
        value: false,
      },
      /**
       * second line
       */
      secondLine: {
        type: String,
        value: false,
      },
      /**
       * dribble
       */
      dribble: {
        type: String,
        value: false,
      },
      /**
       * facebook
       */
      facebook: {
        type: String,
        value: false,
      },
      /**
       * github
       */
      github: {
        type: String,
        value: false,
      },
      /**
       * google
       */
      google: {
        type: String,
        value: false,
      },
      /**
       * instagram
       */
      instagram: {
        type: String,
        value: false,
      },
      /**
       * linkedin
       */
      linkedin: {
        type: String,
        value: false,
      },
      /**
       * pinterest
       */
      pinterest: {
        type: String,
        value: false,
      },
      /**
       * tumblr
       */
      tumblr: {
        type: String,
        value: false,
      },
      /**
       * twitch
       */
      twitch: {
        type: String,
        value: false,
      },
      /**
       * twitter
       */
      twitter: {
        type: String,
        value: false,
      },
      /**
       * whatsapp
       */
      whatsapp: {
        type: String,
        value: false,
      },
    };
  }
}
window.customElements.define(TeamMember.tag, TeamMember);
export { TeamMember };
