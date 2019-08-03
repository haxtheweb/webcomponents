import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `team-member`
 * `A simple presentation of a team member and basic info`
 * @demo demo/index.html
 */
class TeamMember extends SchemaBehaviors(PolymerElement) {
  constructor() {
    super();
    import("@polymer/iron-iconset-svg/iron-iconset-svg.js");
    import("@polymer/iron-image/iron-image.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@lrnwebcomponents/mdi-iconset-svg/lib/mdi-social-iconset-svg.js");
    afterNextRender(this, function() {
      this.HAXWiring = new HAXWiring();
      this.HAXWiring.setup(TeamMember.haxProperties, TeamMember.tag, this);
    });
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
        paper-icon-button {
          color: var(--team-member-color);
        }
      </style>
      <div class="team-member">
        <iron-image src="[[image]]" sizing="cover" alt=""></iron-image>
        <div class="name">[[fullName]]</div>
        <div hidden\$="[[!firstLine]]" class="line1">[[firstLine]]</div>
        <div hidden\$="[[!secondLine]]" class="line2">[[secondLine]]</div>
        <div class="social">
          <a tabindex="-1" href\$="[[dribble]]" hidden\$="[[!dribble]]"
            ><paper-icon-button icon="mdi-social:dribble"></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[facebook]]" hidden\$="[[!facebook]]"
            ><paper-icon-button
              icon="mdi-social:facebook-box"
            ></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[github]]" hidden\$="[[!github]]"
            ><paper-icon-button
              icon="mdi-social:github-circle"
            ></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[google]]" hidden\$="[[!google]]"
            ><paper-icon-button
              icon="mdi-social:google-plus"
            ></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[instagram]]" hidden\$="[[!instagram]]"
            ><paper-icon-button icon="mdi-social:instagram"></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[linkedin]]" hidden\$="[[!linkedin]]"
            ><paper-icon-button icon="mdi-social:linkedin"></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[pinterest]]" hidden\$="[[!pinterest]]"
            ><paper-icon-button icon="mdi-social:pinterest"></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[tumblr]]" hidden\$="[[!tumblr]]"
            ><paper-icon-button icon="mdi-social:tumblr"></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[twitch]]" hidden\$="[[!twitch]]"
            ><paper-icon-button icon="mdi-social:twitch"></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[twitter]]" hidden\$="[[!twitter]]"
            ><paper-icon-button icon="mdi-social:twitter"></paper-icon-button
          ></a>
          <a tabindex="-1" href\$="[[whatsapp]]" hidden\$="[[!whatsapp]]"
            ><paper-icon-button icon="mdi-social:whatsapp"></paper-icon-button
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
        title: "Sample gizmo",
        description: "The user will be able to see this for selection in a UI.",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "video",
            url: "source"
          }
        ],
        meta: {
          author: "Your organization on github"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
  }
  static get properties() {
    let props = {
      /**
       * Image
       */
      image: {
        type: String
      },
      /**
       * Full name of the team member
       */
      fullName: {
        type: String
      },
      /**
       * first line
       */
      firstLine: {
        type: String,
        value: false
      },
      /**
       * second line
       */
      secondLine: {
        type: String,
        value: false
      },
      /**
       * dribble
       */
      dribble: {
        type: String,
        value: false
      },
      /**
       * facebook
       */
      facebook: {
        type: String,
        value: false
      },
      /**
       * github
       */
      github: {
        type: String,
        value: false
      },
      /**
       * google
       */
      google: {
        type: String,
        value: false
      },
      /**
       * instagram
       */
      instagram: {
        type: String,
        value: false
      },
      /**
       * linkedin
       */
      linkedin: {
        type: String,
        value: false
      },
      /**
       * pinterest
       */
      pinterest: {
        type: String,
        value: false
      },
      /**
       * tumblr
       */
      tumblr: {
        type: String,
        value: false
      },
      /**
       * twitch
       */
      twitch: {
        type: String,
        value: false
      },
      /**
       * twitter
       */
      twitter: {
        type: String,
        value: false
      },
      /**
       * whatsapp
       */
      whatsapp: {
        type: String,
        value: false
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }
}
window.customElements.define(TeamMember.tag, TeamMember);
export { TeamMember };
