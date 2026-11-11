import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// fill {key} placeholders in a translated string
const fill = (str, values) =>
  String(str).replace(/\{([a-zA-Z]+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m,
  );

export class UnSdg extends I18NMixin(SchemaBehaviors(LitElement)) {
  static get tag() {
    return "un-sdg";
  }
  constructor() {
    super();
    this.typeof = "oer:Topic";
    this.goal = 1;
    this.alt = "";
    this.colorOnly = false;
    this.loading = "lazy";
    this.fetchpriority = "low";
    // the official goal names; the tile artwork stays in English
    this.t = {
      goalLabel: "Goal {goal}: {name}",
      goal1: "No Poverty",
      goal2: "Zero Hunger",
      goal3: "Good Health and Well-being",
      goal4: "Quality Education",
      goal5: "Gender Equality",
      goal6: "Clean Water and Sanitation",
      goal7: "Affordable and Clean Energy",
      goal8: "Decent Work and Economic Growth",
      goal9: "Industry, Innovation and Infrastructure",
      goal10: "Reduced Inequalities",
      goal11: "Sustainable Cities and Communities",
      goal12: "Responsible Consumption and Production",
      goal13: "Climate Action",
      goal14: "Life Below Water",
      goal15: "Life on Land",
      goal16: "Peace, Justice and Strong Institutions",
      goal17: "Partnerships for the Goals",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }
  static get properties() {
    return {
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      loading: { type: String },
      fetchpriority: { type: String },
      goal: { type: Number, reflect: true },
      colorOnly: { type: Boolean, attribute: "color-only" },
      alt: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 152px;
        height: auto;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
        vertical-align: top;
        /* clip the tile to any border-radius a page gives the element, so
           the colour reaches the border instead of corners poking past it */
        overflow: hidden;
      }
      div,
      img {
        position: absolute;
        inset: var(--ddd-spacing-0, 0);
        box-sizing: border-box;
        width: 100%;
        height: 100%;
      }
      img {
        /* the official art is 404 x 405, so cover fills the square box
           (cropping under a pixel) instead of leaving a gap under the colour */
        object-fit: cover;
      }
    `;
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive alt from goal, and self-correct invalid goals, in willUpdate
    // so reactive sets batch into the current update cycle. Setting these
    // in updated() scheduled a redundant second update (Lit change-in-update
    // warning).
    if (changedProperties.has("goal") || changedProperties.has("t")) {
      if (this.goal >= 1 && this.goal <= 17) {
        this.alt = this.goalLabel(this.goal);
      } else {
        this.goal = 1;
      }
    }
  }

  /**
   * "Goal 1: No Poverty" in the active language
   * @param {Number} goal 1 - 17
   * @returns {String}
   */
  goalLabel(goal) {
    const t = this.t || {};
    const name = t[`goal${goal}`] || unSDGGoalData[goal - 1].name;
    return fill(t.goalLabel || "Goal {goal}: {name}", { goal, name });
  }

  render() {
    // ensure we are between the 17 goals we support
    if (this.goal >= 1 && this.goal <= 17) {
      if (this.colorOnly) {
        return html`<meta
            property="oer:name"
            content="${unSDGGoalData[this.goal - 1].name}"
          />
          <div
            role="img"
            aria-label="${this.alt}"
            style="background-color: ${unSDGGoalData[this.goal - 1].color};"
          ></div>`;
      } else {
        return html`
          <meta
            property="oer:name"
            content="${unSDGGoalData[this.goal - 1].name}"
          />
          <img
            property="oer:image"
            src="${unSDGGoalData[this.goal - 1].image}"
            alt="${this.alt}"
            loading="${this.loading}"
            fetchpriority="${this.fetchpriority}"
          />
        `;
      }
    }
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

// un goals as a data object
export const unSDGGoalData = [
  {
    name: "No Poverty",
    color: "#e5243b",
    image: new URL("./lib/svgs/goal-1.svg", import.meta.url).href,
  },
  {
    name: "Zero Hunger",
    color: "#dda63a",
    image: new URL("./lib/svgs/goal-2.svg", import.meta.url).href,
  },
  {
    name: "Good Health and Well-being",
    color: "#4c9f38",
    image: new URL("./lib/svgs/goal-3.svg", import.meta.url).href,
  },
  {
    name: "Quality Education",
    color: "#c5192d",
    image: new URL("./lib/svgs/goal-4.svg", import.meta.url).href,
  },
  {
    name: "Gender Equality",
    color: "#ff3a21",
    image: new URL("./lib/svgs/goal-5.svg", import.meta.url).href,
  },
  {
    name: "Clean Water and Sanitation",
    color: "#26bde2",
    image: new URL("./lib/svgs/goal-6.svg", import.meta.url).href,
  },
  {
    name: "Affordable and Clean Energy",
    color: "#fcc30b",
    image: new URL("./lib/svgs/goal-7.svg", import.meta.url).href,
  },
  {
    name: "Decent Work and Economic Growth",
    color: "#a21942",
    image: new URL("./lib/svgs/goal-8.svg", import.meta.url).href,
  },
  {
    name: "Industry, Innovation and Infrastructure",
    color: "#fd6925",
    image: new URL("./lib/svgs/goal-9.svg", import.meta.url).href,
  },
  {
    name: "Reduced Inequalities",
    color: "#dd1367",
    image: new URL("./lib/svgs/goal-10.svg", import.meta.url).href,
  },
  {
    name: "Sustainable Cities and Communities",
    color: "#fd9d24",
    image: new URL("./lib/svgs/goal-11.svg", import.meta.url).href,
  },
  {
    name: "Responsible Consumption and Production",
    color: "#bf8b2e",
    image: new URL("./lib/svgs/goal-12.svg", import.meta.url).href,
  },
  {
    name: "Climate Action",
    color: "#3f7e44",
    image: new URL("./lib/svgs/goal-13.svg", import.meta.url).href,
  },
  {
    name: "Life Below Water",
    color: "#0a97d9",
    image: new URL("./lib/svgs/goal-14.svg", import.meta.url).href,
  },
  {
    name: "Life on Land",
    color: "#56c02b",
    image: new URL("./lib/svgs/goal-15.svg", import.meta.url).href,
  },
  {
    name: "Peace, Justice and Strong Institutions",
    color: "#00689d",
    image: new URL("./lib/svgs/goal-16.svg", import.meta.url).href,
  },
  {
    name: "Partnerships for the Goals",
    color: "#19486a",
    image: new URL("./lib/svgs/goal-17.svg", import.meta.url).href,
  },
];

globalThis.customElements.define(UnSdg.tag, UnSdg);
