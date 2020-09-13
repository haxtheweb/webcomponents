import { LitElement, html, css } from "lit-element/lit-element.js";
/**
`random-image`
Element to show random image from a given group.

* @demo demo/index.html
*/
class RandomImage extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .is-circle {
          border: 1px solid grey;
          border-radius: 50%;
          box-shadow: 0px 5px 10px #ccc;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.mode = "";
    this.imagesList = [];
    import("@polymer/iron-image/iron-image.js");
  }
  render() {
    return html`
      <iron-image
        style="width:200px; height:200px;"
        class="${this.mode}"
        sizing="contain"
        src="${this._imgSrc}"
        title="${this._imgTitle}"
      ></iron-image>
    `;
  }

  static get tag() {
    return "random-image";
  }

  static get properties() {
    return {
      mode: {
        type: String,
      },
      _imgSrc: {
        type: String,
      },
      _imgTitle: {
        type: String,
      },
      imagesList: {
        type: Array,
        attribute: "images-list",
      },
    };
  }

  _pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj) if (Math.random() < 1 / ++count) result = prop;
    return result;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "imagesList") {
        let randomPos = this._pickRandomProperty(this.imagesList);
        this._imgSrc = this.imagesList[randomPos].path;
        this._imgTitle = this.imagesList[randomPos].title;
      }
      let notifiedProps = ["imagesList", "mode"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            },
          })
        );
      }
    });
  }
}
window.customElements.define(RandomImage.tag, RandomImage);
export { RandomImage };
