import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `lrndesign-gallerycard`
 * @demo demo/index.html
 */
class LrndesignGallerycard extends LitElement {
  constructor() {
    super();
    this.author = {
      name: "author",
      display_name: "Author",
    };
    this.title = "Project";
    this.elevation = 1;
    this.comments = 0;
    setTimeout(() => {
      import("@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js");
      this.addEventListener("mouseenter", this._mouseEnter.bind(this));
      this.addEventListener("mouseleave", this._mouseLeave.bind(this));
    }, 0);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        [
          "size",
          "image",
          "icon",
          "title",
          "author",
          "elevation",
          "comments",
        ].includes(propName)
      ) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            value: this[propName],
          })
        );
      }
      if (propName == "icon" && this[propName] != "") {
        import("@lrnwebcomponents/simple-icon/simple-icon.js");
        import("@lrnwebcomponents/simple-icon/lib/simple-icons.js");
      }
    });
  }
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
        }
        :host([size="micro"]) {
          transform: scale(0.5);
        }
        :host([size="small"]) {
          transform: scale(0.8);
        }

        div.card {
          border-radius: 4px;
          margin: 0;
          width: 100%;
          box-shadow: 0 5px 5px rgba(0, 0, 0, 0.7);
        }

        .card-actions {
          background-color: #f5f5f5;
          border-radius: 0 0 4px 4px;
          padding: 0 8px;
        }
        .card-actions .card-action-details {
          display: inline-block;
          vertical-align: middle;
          vertical-align: -webkit-baseline-middle;
          width: 80%;
        }
        #avatar {
          display: inline-block;
          vertical-align: text-top;
          transform: scale(0.8);
        }

        .card-control-height {
          height: 240px;
        }

        :host([elevation="0"]) {
          border: solid 1px #eeeeee;
        }

        :host([elevation="1"]) {
          box-shadow: 0 5px 5px rgba(0, 0, 0, 0.7);
        }
        :host([elevation="2"]) {
          box-shadow: 0 10px 10px rgba(0, 0, 0, 0.7);
        }

        .text-right {
          text-align: right;
        }

        .text-left {
          text-align: left;
        }
        .author {
          text-align: left;
          font-size: 12px;
          line-height: 12px;
          color: black;
          display: block;
          padding: 8px;
        }

        .title {
          color: #222;
          font-size: 12.8px;
          font-weight: 600;
          line-height: 20px;
          padding: 0 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 8px;
        }

        .comments {
          font-size: 12px;
          float: right;
          color: black;
          line-height: 12px;
        }

        .divider {
          height: 1px;
          width: 100%;
          background: #efefef;
        }

        .project-icon {
          --simple-icon-height: 100%;
          --simple-icon-width: 100%;
          overflow: hidden;
          color: grey;
        }
        .project-icon:hover,
        .project-icon:focus {
          color: black;
        }

        .center {
          margin: auto;
          width: 80%;
          padding: 16px;
        }

        .link {
          font-size: 16px;
          line-height: 16px;
        }

        .submission-info {
          width: 100%;
        }
        .submission-preview {
          height: 160px;
        }

        .card-content {
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        .inline {
          display: inline;
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="card">
        <div class="card-content card-control-height card-control-center">
          <div class="submission-preview">
            ${this.icon
              ? html`
                  <simple-icon
                    class="project-icon"
                    icon="${this.icon}"
                  ></simple-icon>
                `
              : ``}
            ${this.image
              ? html`
                  <img
                    style="width:100%; height:100%; background-color: lightgray;"
                    loading="lazy"
                    src="${this.image}"
                  />
                `
              : ``}
          </div>
          <div class="submission-info">
            <div class="divider"></div>
            <div class="title">${this.title}</div>
          </div>
        </div>
        <div class="card-actions">
          <lrndesign-avatar
            id="avatar"
            label="${this.author.name}"
            src="${this.author.avatar}"
          ></lrndesign-avatar>
          <div class="card-action-details">
            <div class="author">${this.author.display_name}</div>
            <span class="comments text-right">Comments: ${this.comments}</span>
          </div>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "lrndesign-gallerycard";
  }
  static get properties() {
    return {
      size: {
        type: String,
        reflect: true,
      },
      /**
       * Cover image src.
       */
      image: {
        type: String,
        reflect: true,
      },
      /**
       * Icon to use if image isn't there.
       */
      icon: {
        type: String,
        reflect: true,
      },
      /**
       * Title of the gallery item
       */
      title: {
        type: String,
      },
      /**
       * Gallery creator
       */
      author: {
        type: Object,
      },
      /**
       * Visual elevation of the item off the UI via paper element height
       */
      elevation: {
        type: Number,
        reflect: true,
      },
      /**
       * Number of comments this has
       */
      comments: {
        type: Number,
        reflect: true,
      },
    };
  }

  _mouseEnter(e) {
    this.elevation += 2;
  }

  _mouseLeave(e) {
    this.elevation -= 2;
  }
}
window.customElements.define(LrndesignGallerycard.tag, LrndesignGallerycard);
export { LrndesignGallerycard };
