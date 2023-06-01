import { LitElement, html, css } from "lit";

class DateTitle extends LitElement {
  static get tag() {
    return "date-title";
  }

  static get properties() {
    return {
      date: { type: String },
      title: { type: String },
    };
  }

  static get styles() {
    return css`
      .container {
        color: white;
        width: 300px;
        height: 300px;
        margin: 0 auto;
      }
      div.circTxt1,
      div.circTxt2 {
        color: white;
        border-radius: 50%;
        display: inline-block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 50%;
        transform-origin: 50% 50%;
      }
      div.circTxt1 p {
        color: white;
        font-size: 2em;
        margin: 0;
        color: white;
      }
      div.circTxt2 p {
        font-size: 0.8em;
        margin: 0;
        color: white;
      }
      @keyframes moveAround {
        0% {
          transform: rotate(-2deg);
        }
        25% {
          transform: rotate(2deg);
        }
        50% {
          transform: rotate(-2deg);
        }
        75% {
          transform: rotate(2deg);
        }
        100% {
          transform: rotate(-2deg);
        }
      }
    `;
  }

  constructor() {
    super();
    this.title = "";
    this.date = "";
  }

  render() {
    return html`<div class="container"></div>`;
  }

  updated() {
    this.generateCircularText(
      "circTxt1",
      this.title,
      90,
      -170,
      -100,
      "font-size: 20px; color: black;",
      "transform: scaleY(-1) scaleX(-1); position:absolute"
    );
    this.generateCircularText(
      "circTxt2",
      this.date,
      90,
      90,
      -40,
      "font-size: 20px; color: black;",
      ""
    );
  }

  generateCircularText(
    className,
    text,
    radius,
    range,
    startPos,
    css,
    bottomCss
  ) {
    const textArr = text.split("");
    const container = this.shadowRoot.querySelector(".container");
    const containerHeight = container.clientHeight;
    const newElement = document.createElement("div");
    newElement.setAttribute("class", className);

    const deg = range / textArr.length;
    textArr.forEach((ch) => {
      ch = `<p style="height:${radius}px;${css};transform:rotate(${startPos}deg);left:50%;top:${
        containerHeight / 2 - radius
      }px;position:absolute;transform-origin:0 100%">
             <span style="${bottomCss}">${ch}</span>
           </p>`;
      newElement.innerHTML += ch;
      startPos += deg;
    });
    container.appendChild(newElement);
  }
}

customElements.define(DateTitle.tag, DateTitle);
export { DateTitle };
