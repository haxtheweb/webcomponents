import { html, css, LitElement } from 'lit-element';
import '@lrnwebcomponents/simple-icon/lib/simple-icon-button.js'; //import simpleicon
import { SimpleColors } from '@lrnwebcomponents/simple-colors/simple-colors.js';

export class StarRating extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--star-rating-text-color, #000);
        --padding-left: 20px;
        --margin: 0;
      }
      .wrapper {
        display: inline-flex;
      }
      .star {
        background-color:black;
      }
      .rating {
        padding-left: var(--padding-left); //responsive sizes weren't working well
      }
      h2{
        margin: var(--margin); //keeps them both on the same line
      }
      :host(:not([interactive])) simple-icon-button::part(button) {
        cursor: unset;
      }
    `;
  }

  static get properties() {
    return {
      score: { type: Number }, // so like <star-rating score="50" possible="100">
      possible: { type: Number },
      interactive: { type: Boolean, reflect: true, },
      numStars: { type: Number, attribute: "num-stars"},
      _calPercent: { type: Number }, // this value we'll calculate based on changes to score and possible
      starColor: { type: String }
    };
  }

  // these defaults in constructor assume that it's an empty star rating by default
  constructor() {
    super();
    this._calPercent = 0;
    this.numStars = 5;
    this.score = 10;
    this.possible = 100;
    this.interactive = false;
    this.starColor = "yellow";
    // add support for this.ineractive
  }

  // there are 3 possible icons for these stars: https://webcomponents.psu.edu/styleguide/?path=/story/media-icons--simple-iconset-story
  // star-border is an empty star
  // star-half is a 1/2 filled in
  // star is filled in
  // there's a few differnet ways we could achieve this below which can make for a good discussion topic tomorrow.
  // if you can think of how to use this code to successfully fill in the stars w/ the appropriate icon name
  // based on the value of this._numStars then give it a shot!
  // Conditional rendering is probably how I'd approach this
  render() {
    return html`
      <div class="wrapper">
        <div class='stars'>
          ${this.renderStar(this.numStars, this.interactive)}
        </div>
        <div class='rating'>
          <h2>${this._calPercent} (${this.score}/${this.possible})</h2>
        </div>
      </div>
    `;
  }

  renderStar(amount, interactive) {
    if (amount === 0) {
      return html``;
    }
    let count = 0;
    const content = [];
    while (count < amount) {
      if ((count+1) <= (amount * this._calPercent)) {
        content.push(html`<simple-icon-button icon="star" accent-color="${this.starColor}" dark contrast="10" class='star' ></simple-icon-button>`);
      }
      else if (((amount * this._calPercent) - (count+1)) < -0.01 && ((amount * this._calPercent) - (count+1)) >= -0.5) {
        content.push(html`<simple-icon-button icon="star-half" accent-color="${this.starColor}" dark contrast="1" class='star' ></simple-icon-button>`);
      }
      else {
        content.push(html`<simple-icon-button icon="star-border" accent-color="${this.starColor}" dark contrast="1" class='star' ></simple-icon-button>`);
      }
      count++;
    }
    return content;
  }

  updated(changedProperties) {
    // run through properties that have changed in this change record. Probably just 1 but at initial setup
    // it could be all of them at the same time
    changedProperties.forEach((oldValue, propName) => {

      // also sanity check that it's NOT 0 so we don't bust our Math via division by 0
      if(this.possible === 0){
        this.possible = 1;
      }

      // https://stackoverflow.com/questions/6137986/javascript-roundoff-number-to-nearest-0-5
      if (["score","possible"].includes(propName) && this.possible !== 0) {
        // this way when score or possible update, numStars will update automatically
        this._calPercent = Math.round((this.score / this.possible)*100)/100;
      }
    });
  }
}