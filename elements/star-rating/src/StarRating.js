import { html, css, LitElement } from 'lit-element';
import '@lrnwebcomponents/simple-icon/lib/simple-icon-button.js'; //import simpleicon

export class StarRating extends LitElement {
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

      #rating {
        padding-left: 20px; //responsive sizes weren't working well
      }

      h2{
        margin: 0; //keeps them both on the same line
      }
    `;
  }

  //wasnt sure how to allow for changes in number 
    //maybe make it a form to allow input?

  static get properties() {
    return {
      Number: { type: String },
    };
  }

  constructor() {
    super();
    this.Number = '5.0';
  }

  render() {
    return html`
      <div id="star-rating">
        <div id='stars'>
          <simple-icon-button icon="star" dark contrast="1" style="background-color:black;" id='star'></simple-icon-button>
          <simple-icon-button icon="star" dark contrast="1" style="background-color:black;" id='star'></simple-icon-button>
          <simple-icon-button icon="star" dark contrast="1" style="background-color:black;" id='star'></simple-icon-button>
          <simple-icon-button icon="star" dark contrast="1" style="background-color:black;" id='star'></simple-icon-button>
          <simple-icon-button icon="star" dark contrast="1" style="background-color:black;" id='star'></simple-icon-button>
        </div>
        <div id='rating'>
          <h2>${this.Number}</h2>
        </div>
      </div>
    `;
  }
}