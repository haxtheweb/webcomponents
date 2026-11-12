/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "./lib/badge-sticker.js";

/**
 * `merit-badge`
 * `visual badge to communicate obtaining a skill`
 * @demo demo/index.html
 * @element merit-badge
 */
class MeritBadge extends I18NMixin(SchemaBehaviors(LitElement)) {
  static get tag() {
    return "merit-badge";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
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
          float: inline-start;
          width: 250px;
          justify-content: center;
          align-items: center;
          color: var(--ddd-theme-default-white);
        }

        .badges {
          order: 1;
          color: var(--ddd-theme-default-white);
        }

        /* DDD pill button: navy (white in dark) while locked, a soft tint
           with a green check once unlocked; both carry the DDD focus ring */
        .unlockButton {
          order: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-1, 4px);
          min-height: var(--ddd-spacing-8, 32px);
          margin-top: var(--ddd-spacing-2, 8px);
          padding: 0 var(--ddd-spacing-4, 16px);
          border-radius: var(--ddd-radius-rounded, 100px);
          border: var(--ddd-border-size-xs, 1px) solid
            light-dark(
              var(--ddd-theme-default-nittanyNavy, #001e44),
              var(--ddd-theme-default-white, #ffffff)
            );
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-white, #ffffff)
          );
          color: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-4xs, 14px);
          font-weight: var(--ddd-font-weight-medium, 500);
          line-height: var(--ddd-lh-120, 1.2);
          cursor: pointer;
          transition:
            box-shadow 75ms ease-in-out,
            background-color 75ms ease-in-out;
        }
        .unlockButton:hover {
          box-shadow: var(--ddd-boxShadow-sm);
        }
        .unlockButton:focus-visible {
          outline: var(--ddd-focus-ring, 2px solid #005fa9);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
        .unlockButton.unlocked {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight, #f5f5f5),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight, #e4e5e7),
            var(--ddd-theme-default-slateGray, #314d64)
          );
          color: light-dark(
            var(--ddd-theme-default-opportunityGreen, #008755),
            var(--ddd-theme-default-futureLime, #99cc00)
          );
        }
        .unlockButton simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-4xs, 16px);
          --simple-icon-width: var(--ddd-icon-4xs, 16px);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      unlock: "Unlock?",
      unlocked: "Unlocked",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.typeof = "oer:LearningObjective";
    this.badgeUnlocked = false;
    this.skill = "";
  }

  render() {
    return html`
      <meta property="oer:skill" content="${this.skill}" />
      <div class="container">
        ${
          this.badgeUnlocked
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
            : html`<locked-badge></locked-badge>`
        }
        <button
          class="unlockButton ${this.badgeUnlocked ? "unlocked" : ""}"
          @click="${this.unlockButtonClicked}"
        >
          ${
            this.badgeUnlocked
              ? html`<simple-icon-lite
                    icon="icons:check"
                    aria-hidden="true"
                  ></simple-icon-lite
                  ><span class="label">${this.t.unlocked}</span>`
              : html`<span class="label">${this.t.unlock}</span>`
          }
        </button>
      </div>
    `;
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
      demoSchema: [
        {
          tag: "merit-badge",
          properties: {},
          content: "",
        },
      ],
    };
  }

  unlockButtonClicked() {
    this.badgeUnlocked = !this.badgeUnlocked;
  }
}

globalThis.customElements.define(MeritBadge.tag, MeritBadge);
export { MeritBadge };
