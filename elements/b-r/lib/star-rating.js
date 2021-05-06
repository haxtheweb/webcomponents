import { html, css, LitElement } from "lit-element";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js"; //import simpleicon

export class StarRating extends LitElement {
  // #star-rating I'd make something like .wrapper
  // the ID is confusing bc it's the name of the element itself
  // #rating and #stars and #star I'd make classes like .rating and .stars (stylistic / convention, and also a11y)
  // while #star works as an id and probably renders how you were looking for, this is an a11y issue because every renderRoot can only have 1 id value the same
  // avoiding this pitfall (accidentally using same id twice) is often why I use classes so that I never run into that
  // and then only if I absolutely am doing it for a reason do I use an id
  // padding-left: 20px I'd make a css variable so it can be overidden
  // h2 { margin:0} I'd also make a vss variable
  // also keep in mind headings can be impacted by global font-size, font-weight and line-height
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--star-rating-text-color, #000);
      }
      #star-rating {
        display: inline-flex;
      }
      .star {
        background-color: black;
      }
      #rating {
        padding-left: 20px; //responsive sizes weren't working well
      }
      h2 {
        margin: 0; //keeps them both on the same line
      }
      :host(:not([interactive])) simple-icon-button::part(button) {
        cursor: unset;
      }
    `;
  }

  // wasnt sure how to allow for changes in number
  // maybe make it a form to allow input?
  // rename this as the capital is a more React-ism convention
  // think of these as attributes living in the page far as how we implement them
  // so <star-rating number="4"> for example
  // I might think of it as a kind of score and possible value
  // then the number of stars is a rounded number that's computed from there
  static get properties() {
    return {
      score: { type: Number }, // so like <star-rating score="50" possible="100">
      possible: { type: Number },
      interactive: { type: Boolean, reflect: true },
      numStars: { type: Number, attribute: "num-stars" },
      _calPercent: { type: Number }, // this value we'll calculate based on changes to score and possible
    };
  }
  // these defaults in constructor assume that it's an empty star rating by default
  constructor() {
    super();
    this._calPercent = 0;
    this.numStars = 5;
    this.score = 0;
    this.possible = 100;
    this.interactive = false;
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

  // also style="background-color:black;" is something I'd do via .star { background-color: var(--good-variable-name, black);}
  // dark and contrast we'll use in class as a discussion point around SimpleColors baseClass and data binding.
  render() {
    return html`
      <div class="star-rating">
        <div id="stars">
          ${this.renderStar(this.numStars, this.interactive)}
        </div>
        <div id="rating">
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
      if (count + 1 < amount * this._calPercent) {
        content.push(
          html`<simple-icon-button
            icon="star"
            dark
            contrast="1"
            class="star"
            ?disabled="${!interactive}"
          ></simple-icon-button>`
        );
      } else if (
        amount * this._calPercent - (count + 1) < -0.01 &&
        amount * this._calPercent - (count + 1) >= -0.5
      ) {
        content.push(
          html`<simple-icon-button
            icon="star-half"
            dark
            contrast="1"
            class="star"
            ?disabled="${!interactive}"
          ></simple-icon-button>`
        );
      } else {
        content.push(
          html`<simple-icon-button
            icon="star-border"
            dark
            contrast="1"
            class="star"
            ?disabled="${!interactive}"
          ></simple-icon-button>`
        );
      }
      count++;
    }
    return content;
  }
  /**
   * LitElement Life-cycle - https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-completing
   */
  updated(changedProperties) {
    // run through properties that have changed in this change record. Probably just 1 but at initial setup
    // it could be all of them at the same time
    changedProperties.forEach((oldValue, propName) => {
      // check for score and possible being changed
      // also sanity check that it's NOT 0 so we don't bust our Math via division by 0
      // https://stackoverflow.com/questions/6137986/javascript-roundoff-number-to-nearest-0-5
      if (["score", "possible"].includes(propName) && this.possible !== 0) {
        // this way when score or possible update, numStars will update automatically
        this._calPercent = Math.round((this.score / this.possible) * 100) / 100;
      }
    });
  }
}

customElements.define("star-rating", StarRating);
