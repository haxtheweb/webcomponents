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
      // kebab-case attribute names, aligned with badge-sticker and the
      // serialized attribute contract from the #3086 fix
      badgeDate: { type: String, attribute: "badge-date" },
      badgeImage: { type: String, attribute: "badge-image" },
      badgeTitle: { type: String, attribute: "badge-title" },
      badgeDetails: { type: String, attribute: "badge-details" },
      hyperLink: { type: String, attribute: "hyper-link" },
      badgeSkills: { type: String, attribute: "badge-skills" },
      skillsOpened: { type: Boolean, attribute: "skills-opened" },
      detailsOpened: { type: Boolean, attribute: "details-opened" },
      badgeUnlocked: { type: Boolean, attribute: "badge-unlocked" },
      badgeColor: { type: String, attribute: "badge-color" },
      skill: { type: String, attribute: "skill" },
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
          color: var(--ddd-theme-default-white);
        }

        .badges {
          order: 1;
          color: var(--ddd-theme-default-white);
        }

        /* blue-8 never resolved in this scope (no SimpleColors base), so
           the button rendered transparent; the DDD primary token restores
           a visible, scheme-safe background */
        .unlockButton {
          margin-top: var(--ddd-spacing-12);
          order: 2;
          width: 175px;
          background-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-link)
          );
          font-family: var(--ddd-font-navigation);
          display: inline-block;
          outline: 0;
          border: none;
          cursor: pointer;
          line-height: var(--ddd-lh-120);
          font-weight: var(--ddd-font-weight-black);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3)
            var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-5xs);
          border-radius: var(--ddd-radius-xs);
          color: var(
            --lowContrast-override,
            var(--ddd-theme-bgContrast, var(--ddd-theme-default-white))
          );
          height: var(--ddd-spacing-9);
          transition: all 75ms ease-in-out;
          :hover {
            box-shadow: var(--ddd-boxShadow-sm);
          }
          margin-left: var(--ddd-spacing-25);
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
              badge-image="${this.badgeImage}"
              badge-title="${this.badgeTitle}"
              badge-details="${this.badgeDetails}"
              hyper-link="${this.hyperLink}"
              badge-skills="${this.badgeSkills}"
              badge-unlocked="false"
              badge-color="${this.badgeColor}"
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
}

globalThis.customElements.define(MeritBadge.tag, MeritBadge);
export { MeritBadge };
