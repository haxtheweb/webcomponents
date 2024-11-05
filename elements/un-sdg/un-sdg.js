import { LitElement, html, css } from 'lit';
export class UnSdg extends LitElement {
  static get tag() {
    return 'un-sdg';
  }
  constructor() {
    super();
    this.goal = 1;
    this.alt = '';
    this.colorOnly = false;
    this.loading = 'lazy';
    this.fetchpriority = 'low';
  }
  static get properties() {
    return {
      loading: { type: String },
      fetchpriority: { type: String },
      goal: { type: Number, reflect: true },
      colorOnly: { type: Boolean, attribute: 'color-only'},
      alt: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 152px;
        height: 152px;
      }
      div,
      img {
        width: 100%;
        height: 100%;
      }
      img {
        object-fit: contain;
      }
    `;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has('goal')) {
      // if an invalid goal is supplied, force it to be 1
      if (this.goal >= 1 && this.goal <= 17) {
        this.alt = `Goal ${this.goal}: ${unSDGGoalData[this.goal - 1].name}`; 
      }
      else {
        this.goal = 1;
      }
    }
  }

  render() {
    // ensure we are between the 17 goals we support
    if (this.goal >= 1 && this.goal <= 17) {
      if (this.colorOnly) {
        return html`<div style="background-color: ${unSDGGoalData[this.goal - 1].color};"></div>`;
      }
      else {
        return html`
        <img
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
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

// un goals as a data object
export const unSDGGoalData = [
  { name: 'No Poverty', color: '#e5243b', image: new URL('./lib/svgs/goal-1.svg', import.meta.url).href },
  { name: 'Zero Hunger', color: '#dda63a', image: new URL('./lib/svgs/goal-2.svg', import.meta.url).href },
  { name: 'Good Health and Well-being', color: '#4c9f38', image: new URL('./lib/svgs/goal-3.svg', import.meta.url).href },
  { name: 'Quality Education', color: '#c5192d', image: new URL('./lib/svgs/goal-4.svg', import.meta.url).href },
  { name: 'Gender Equality', color: '#ff3a21', image: new URL('./lib/svgs/goal-5.svg', import.meta.url).href },
  { name: 'Clean Water and Sanitation', color: '#26bde2', image: new URL('./lib/svgs/goal-6.svg', import.meta.url).href },
  { name: 'Affordable and Clean Energy', color: '#fcc30b', image: new URL('./lib/svgs/goal-7.svg', import.meta.url).href },
  { name: 'Decent Work and Economic Growth', color: '#a21942', image: new URL('./lib/svgs/goal-8.svg', import.meta.url).href },
  { name: 'Industry, Innovation and Infrastructure', color: '#fd6925', image: new URL('./lib/svgs/goal-9.svg', import.meta.url).href },
  { name: 'Reduced Inequalities', color: '#dd1367', image: new URL('./lib/svgs/goal-10.svg', import.meta.url).href },
  { name: 'Sustainable Cities and Communities', color: '#fd9d24', image: new URL('./lib/svgs/goal-11.svg', import.meta.url).href },
  { name: 'Responsible Consumption and Production', color: '#bf8b2e', image: new URL('./lib/svgs/goal-12.svg', import.meta.url).href },
  { name: 'Climate Action', color: '#3f7e44', image: new URL('./lib/svgs/goal-13.svg', import.meta.url).href },
  { name: 'Life Below Water', color: '#0a97d9', image: new URL('./lib/svgs/goal-14.svg', import.meta.url).href },
  { name: 'Life on Land', color: '#56c02b', image: new URL('./lib/svgs/goal-15.svg', import.meta.url).href },
  { name: 'Peace, Justice and Strong Institutions', color: '#00689d', image: new URL('./lib/svgs/goal-16.svg', import.meta.url).href },
  { name: 'Partnerships for the Goals', color: '#19486a', image: new URL('./lib/svgs/goal-17.svg', import.meta.url).href },
];

globalThis.customElements.define(UnSdg.tag, UnSdg);
