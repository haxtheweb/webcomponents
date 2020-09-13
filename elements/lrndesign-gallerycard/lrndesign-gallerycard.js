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
      import("@polymer/paper-card/paper-card.js");
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
      if (propName == "image" && this[propName] != "") {
        import("@polymer/iron-image/iron-image.js");
      }
      if (propName == "icon" && this[propName] != "") {
        import("@polymer/iron-icon/iron-icon.js");
        import("@polymer/iron-icons/iron-icons.js");
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

        paper-card {
          border-radius: 4px;
          margin: 0;
          width: 100%;
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

        [elevation="0"] {
          border: solid 1px #eeeeee;
        }

        .text-right {
          text-align: right;
        }

        .text-left {
          text-align: left;
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
        }

        .divider {
          height: 1px;
          width: 100%;
          background: #efefef;
        }

        .project-icon {
          --iron-icon-height: 100%;
          --iron-icon-width: 100%;
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
      <paper-card elevation="${this.elevation}">
        <div class="card-content card-control-height card-control-center">
          <div class="submission-preview">
            ${this.icon
              ? html`
                  <iron-icon
                    class="project-icon"
                    icon="${this.icon}"
                  ></iron-icon>
                `
              : ``}
            ${this.image
              ? html`
                  <iron-image
                    style="width:100%; height:100%; background-color: lightgray;"
                    sizing="cover"
                    preload=""
                    fade=""
                    src="${this.image}"
                  ></iron-image>
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
            <span class="text-left author">${this.author.display_name}</span>
            <span class="comments text-right">Comments: ${this.comments}</span>
          </div>
        </div>
      </paper-card>
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
