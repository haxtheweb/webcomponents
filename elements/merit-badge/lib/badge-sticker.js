/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
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
      ...styles,
      css`
  :host {
    display: block;
  }
  .badge {
    color: white;
    margin: 20px;
    width: 200px;
    height: 200px;
    border-radius: 50%
    padding: 20px;
    background: var(--badge-color, var(--simple-colors-default-theme));
    font-size: 21px;
    font-weight: bold;
    line-height: 1.3em;
    border: 2px dashed #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 4px var(--badge-color, var(--simple-colors-default-theme)), 3px 1.5px 9px 6px var(--simple-colors-default-theme-grey-9);
    font-weight: normal;
    position: relative;    
    font-family: "Monaco";
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
    color: white;
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
  }
  .detailsicon {
    position: absolute;
    top: 32%;
    left: 82%;
  }
  .button {
    position: absolute;
    top: 33%;
    left: 82%;
    cursor: pointer;
  }
  .button i {
    margin-right: 8px;
  }
  .popover {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    padding: 10px;
    background-color: lightgray;
    border: 1px solid black;
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    color: black;
    text-shadow: none;
    font-size: 15px;
    font-family: "Monaco";
    box-shadow: rgba(0, 0, 0, 0.2) 0px 60px 40px -7px;
    border-radius: 15px;
  }
`,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      badgeDate: { type: String },
      badgeImage: { type: String },
      badgeTitle: { type: String },
      badgeDetails: { type: String },
      hyperLink: { type: String },
      badgeSkills: { type: String },
      skillsOpened: { type: Boolean },
      detailsOpened: { type: Boolean },
      badgeColor: { type: String },
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

        <img class="badgepic" src="${this.badgeImage}" alt="image" />

        <div class="details">
          <div class="button" @click="${this.skillClick}">
            <i class="fas fa-info-circle"></i>
            <img
              class="detailsicon"
              src="https://www.iconpacks.net/icons/1/free-information-icon-348-thumb.png"
              alt="linkicons"
              height="20px"
              width="20px"
            />
          </div>
        </div>
        <div class="verificationlink">
          <a href="${this.hyperLink}" target="_blank">
            <img
              class="linkicon"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Chain_link_icon_slanted.png/800px-Chain_link_icon_slanted.png"
              alt="detailsicons"
              height="20px"
              width="20px"
            />
          </a>
        </div>
      </div>
      <absolute-position-behavior
        class="popover"
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
          `
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
customElements.define(BadgeSticker.tag, BadgeSticker);
export { BadgeSticker };
