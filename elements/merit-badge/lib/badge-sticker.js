/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/absolute-position-behavior/absolute-position-behavior.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "./date-title.js";
import "./locked-badge.js";
/**
 * `badge-sticker`
 * `visual badge to communicate obtaining a skill`
 * @demo demo/index.html
 * @element merit-badge
 */
class BadgeSticker extends SimpleColors {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    const currentDate = new Date();
    this.badgeDate = currentDate.toLocaleDateString();
    this.badgeImage = "";
    this.badgeTitle = "";
    this.badgeDetails = "";
    this.hyperLink = "";
    this.badgeSkills = "";
    this.skillsOpened = false;
    this.detailsOpened = false;
    this.skillsArray = [];
    this.badgeColor = "";
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
  :host {
    display: block;
  }
  .badge {
    color: var(--ddd-theme-default-white);
    margin: var(--ddd-spacing-5);
    width: 200px;
    height: 200px;
    border-radius: 50%
    padding: var(--ddd-spacing-5);
    background: var(
      --badge-color,
      var(--ddd-theme-primary, var(--ddd-theme-default-beaverBlue, #1e407c))
    );
    font-size: var(--ddd-font-size-xs);
    font-weight: bold;
    line-height: 1.3em;
    border: var(--ddd-border-size-sm) dashed var(--ddd-theme-default-white);
    border-radius: 50%;
    box-shadow: 0 0 0 4px var(--badge-color, var(--ddd-theme-primary, var(--ddd-theme-default-beaverBlue))), var(--ddd-boxShadow-md);
    font-weight: normal;
    position: relative;    
    font-family: var(--ddd-font-navigation);
  }

  .badgeImage {
    width: 75px;
    height: 75px;
    position: absolute;
    top: -24%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .date-title {
    color: var(--ddd-theme-default-white);
    position: absolute;
    top: -24%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .badgepic {
    max-width: 75px;
    max-height: 75px;
    position: absolute;
    top: 32%;
    left: 32%;
  }

  .linkicon {
    position: absolute;
    top: 32%;
    left: 12%;
    height: var(--ddd-icon-3xs, 20px);
    width: var(--ddd-icon-3xs, 20px);
  }
  .detailsicon {
    position: absolute;
    top: 32%;
    left: 82%;
    height: var(--ddd-icon-3xs, 20px);
    width: var(--ddd-icon-3xs, 20px);
  }
  .button {
    position: absolute;
    top: 33%;
    left: 82%;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    font: inherit;
  }
  .button i {
    margin-right: 8px;
  }
  /* popover colors migrate to scheme-safe DDD pairs; duplicated
     box-shadow and border-radius declarations collapse onto tokens */
  .popover {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    padding: var(--ddd-spacing-2);
    background-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-coalyGray)
    );
    border: var(--ddd-border-size-xs) solid
      light-dark(
        var(--ddd-theme-default-coalyGray),
        var(--ddd-theme-default-white)
      );
    border-radius: var(--ddd-radius-lg);
    box-shadow: var(--ddd-boxShadow-xl);
    color: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-white)
    );
    text-shadow: none;
    font-size: var(--ddd-font-size-5xs);
    font-family: var(--ddd-font-navigation);
  }
`,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      badgeDate: { type: String, attribute: "badge-date" },
      badgeImage: { type: String, attribute: "badge-image" },
      badgeTitle: { type: String, attribute: "badge-title" },
      badgeDetails: { type: String, attribute: "badge-details" },
      hyperLink: { type: String, attribute: "hyper-link" },
      badgeSkills: { type: String, attribute: "badge-skills" },
      skillsOpened: { type: Boolean, attribute: "skills-opened" },
      detailsOpened: { type: Boolean, attribute: "details-opened" },
      badgeColor: { type: String, attribute: "badge-color" },
    };
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="badge" style="--badge-color: ${this.badgeColor}">
        <date-title
          class="date-title"
          title="${this.badgeTitle}"
          date="${this.badgeDate}"
        ></date-title>

        <img class="badgepic" src="${this.badgeImage}" alt="${this.badgeTitle}" />

        <div class="details">
          <button
            class="button"
            @click="${this.skillClick}"
            aria-expanded="${this.skillsOpened}"
            aria-controls="skills-popover"
          >
            <i class="fas fa-info-circle" aria-hidden="true"></i>
            <simple-icon-lite
              class="detailsicon"
              icon="icons:info"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>
        </div>
        <div class="verificationlink">
          <a
            href="${this.hyperLink}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Verify this badge"
          >
            <simple-icon-lite
              class="linkicon"
              icon="icons:link"
              aria-hidden="true"
            ></simple-icon-lite>
          </a>
        </div>
      </div>
      <absolute-position-behavior
        class="popover"
        id="skills-popover"
        justify
        position="bottom"
        allow-overlap
        sticky
        auto
        .target="${this.activeNode}"
        ?hidden="${!this.skillsOpened}"
      >
        <h3>Details</h3>
        <p>${this.badgeDetails}</p>
        <h3>Skills</h3>
        ${this.skillsArray.map(
          (item) => html`
            <ul>
              <li>${item}</li>
            </ul>
          `,
        )}
      </absolute-position-behavior>
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "badge-sticker";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.activeNode = this.shadowRoot.querySelector(".badge");
    this.skillsArray = this.badgeSkills.split(",");
  }

  skillClick(e) {
    this.skillsOpened = !this.skillsOpened;
  }
}
globalThis.customElements.define(BadgeSticker.tag, BadgeSticker);
export { BadgeSticker };
