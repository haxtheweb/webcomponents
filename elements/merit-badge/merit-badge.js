/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import "./lib/badge-sticker.js";

/**
 * `merit-badge`
 * `visual badge to communicate obtaining a skill`
 * @demo demo/index.html
 * @element merit-badge
 */
class MeritBadge extends SchemaBehaviors(LitElement) {
  static get tag() {
    return "merit-badge";
  }
  static get properties() {
    return {
      badgeDate: { type: String },
      badgeImage: { type: String },
      badgeTitle: { type: String },
      badgeDetails: { type: String },
      hyperLink: { type: String },
      badgeSkills: { type: String },
      skillsOpened: { type: Boolean },
      detailsOpened: { type: Boolean },
      badgeUnlocked: { type: Boolean },
      badgeColor: { type: String },
      skill: { type: String },
    };
  }

  static get styles() {
    return [
      css`
        .container {
          display: flex;
          flex-direction: column;
          float: left;
          width: 250px;
          justify-content: center;
          align-items: center;
          color: white;
        }

        .badges {
          order: 1;
          color: white;
        }

        .unlockButton {
          margin-top: 50px;
          order: 2;
          width: 175px;
          background-color: var(--simple-colors-default-theme-blue-8);
          font-family: "Monaco";
          display: inline-block;
          outline: 0;
          border: none;
          cursor: pointer;
          line-height: 1.2rem;
          font-weight: 900;
          padding: 8px 14px 9px;
          font-size: 15px;
          border-radius: 4px;
          color: #fff;
          height: 36px;
          transition: all 75ms ease-in-out;
          :hover {
            box-shadow: 0 1px 4px rgb(0 0 0 / 30%);
          }
          margin-left: 100px;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.badgeUnlocked = false;
    this.skill = "";
  }

  render() {
    return html`
      <meta property="oer:skill" content="${this.skill}" />
      <div class="container">
        ${this.badgeUnlocked
          ? html`<badge-sticker
              badgeImage="${this.badgeImage}"
              badgeTitle="${this.badgeTitle}"
              badgeDetails="${this.badgeDetails}"
              hyperLink="${this.hyperLink}"
              badgeSkills=${this.badgeSkills}
              badgeUnlocked="false"
              badgeColor="${this.badgeColor}"
            >
            </badge-sticker>`
          : html`<locked-badge></locked-badge>`}
        <button class="unlockButton" @click="${this.unlockButtonClicked}">
          ${this.badgeUnlocked ? "Unlocked" : "Unlock?"}
        </button>
      </div>
    `;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.setAttribute("typeof", "oer:LearningObjective");
  }

  static get haxProperties() {
    return {
      canScale: true,
      canEditSource: true,
      gizmo: {
        title: "Merit Badge",
        description: "Visual badge to communicate obtaining a skill.",
        icon: "icons:verified",
        color: "green",
        tags: ["Instructional", "badge", "skill", "achievement"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "badgeTitle",
            title: "Badge Title",
            description: "Title displayed on the badge.",
            inputMethod: "textfield",
          },
          {
            property: "badgeImage",
            title: "Badge Image",
            description: "Image URL for the badge.",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            noCamera: true,
            noScreenRecord: true,
            noVoiceRecord: true,
          },
          {
            property: "badgeDetails",
            title: "Badge Details",
            description: "Details about the badge.",
            inputMethod: "textfield",
          },
          {
            property: "hyperLink",
            title: "Hyperlink",
            description: "Link associated with the badge.",
            inputMethod: "textfield",
          },
          {
            property: "badgeSkills",
            title: "Badge Skills",
            description: "Skills displayed on the badge.",
            inputMethod: "textfield",
          },
          {
            property: "skill",
            title: "Skill (OER Schema)",
            description:
              "OER Schema: a learned skill obtained by completion of this learning objective.",
            inputMethod: "textfield",
          },
        ],
        advanced: [],
      },
    };
  }

  unlockButtonClicked() {
    this.badgeUnlocked = !this.badgeUnlocked;
  }

  unlockButtonClicked() {
    this.badgeUnlocked = !this.badgeUnlocked;
  }
}

globalThis.customElements.define(MeritBadge.tag, MeritBadge);
export { MeritBadge };
