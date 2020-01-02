import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-scroll-threshold/iron-scroll-threshold.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import { materialCssStyles } from "@lrnwebcomponents/materializecss-styles/lib/colors.js";

class LrnappGalleryGrid extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      materialCssStyles,
      css`
        :host {
          display: block;
        }
        paper-button {
          padding: 0;
          margin: 0;
          min-width: 1rem;
        }
        #details {
          opacity: 0.5;
          position: absolute;
          bottom: 0;
          right: 0;
          margin: 0 1rem 0 0;
          background-color: white;
          padding: 0.5em;
        }
        #details:hover {
          opacity: 1;
        }
        #details span {
          font-size: 0.6em;
          font-weight: normal;
        }
        #details .comment-on-work {
          font-size: 0.8em;
          background-color: white;
        }
      `
    ];
  }
  constructor() {
    super();
    setTimeout(() => {
      this.addEventListener("click", this._triggerDialog.bind(this));
    }, 0);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = [
        "sourcePath",
        "submissions",
        "activeImage",
        "activeTitle",
        "activeUrl",
        "activeComments",
        "activeAuthor"
      ];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  render() {
    return html`
      <iron-ajax
        id="ajax"
        url="${this.sourcePath}"
        params=""
        handle-as="json"
        @last-response-changed="${this.submissionsChangedEvent}"
      ></iron-ajax>
      <iron-scroll-threshold
        @lower-threshold="${this._loadMoreData}"
        id="threshold"
      >
        <iron-list
          grid
          .items="${this._toArray(this.submissions.data)}"
          as="item"
        >
          ${this._toArray(item.images).map(
            image => html`
              <paper-button>
                <iron-image
                  preload
                  open-url="${item.url}"
                  title="${item.title}"
                  alt="${item.title}"
                  src="${image.src}"
                  author="${item.author}"
                  comments="${item.comments}"
                  height="${image.height}"
                  width="${image.width}"
                ></iron-image>
              </paper-button>
            `
          )}
        </iron-list>
      </iron-scroll-threshold>
      <paper-dialog id="dialog">
        <paper-dialog-scrollable id="dialogResponse">
          <iron-image src="${this.activeImage}"></iron-image>
          <div id="details">
            <div class="title">
              <span>Title:</span> <span>${this.activeTitle}</span>
            </div>
            <div class="author">
              <span>Author:</span> <span>${this.activeAuthor}</span>
            </div>
            <div class="comments">
              <span>Comments:</span> <span>${this.activeComments}</span>
            </div>
            <div class="comment-on-work">
              <a href="${this.activeUrl}">
                <paper-button raised>Comment on this work</paper-button>
              </a>
            </div>
          </div>
        </paper-dialog-scrollable>
      </paper-dialog>
    `;
  }
  submissionsChangedEvent(e) {
    this.submissions = [...e.detail.value];
  }
  static get tag() {
    return "lrnapp-gallery-grid";
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String,
        attribute: "elmsln-course"
      },
      elmslnSection: {
        type: String,
        attribute: "elmsln-section"
      },
      basePath: {
        type: String,
        attribute: "base-path"
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token"
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      sourcePath: {
        type: String,
        attribute: "source-path"
      },
      submissions: {
        type: Array
      },
      activeImage: {
        type: String,
        reflect: true,
        attribute: "active-image"
      },
      activeTitle: {
        type: String,
        reflect: true,
        attribute: "active-title"
      },
      activeAuthor: {
        type: String,
        reflect: true,
        attribute: "active-author"
      },
      activeComments: {
        type: String,
        reflect: true,
        attribute: "active-comments"
      },
      activeUrl: {
        type: String,
        reflect: true,
        attribute: "active-url"
      }
    };
  }
  /**
   * When someone clicks if there is a url, then we need to
   * remote load whatever is in that url.
   */
  _triggerDialog(e) {
    // make sure we found an image as we're going through here
    if (e.target.nextElementSibling.nodeName == "IMG") {
      this.activeImage = e.target.nextElementSibling.src;
      this.activeTitle = e.target.parentElement.title;
      this.activeAuthor = e.target.parentElement.author;
      this.activeComments = e.target.parentElement.comments;
      this.activeUrl = e.target.parentElement.openUrl;
      this.shadowRoot.querySelector("#dialog").toggle();
    }
  }
  _loadMoreData(e) {
    this.shadowRoot.querySelector("#ajax").generateRequest();
    this.shadowRoot.querySelector("#threshold").clearTriggers();
  }
  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
window.customElements.define(LrnappGalleryGrid.tag, LrnappGalleryGrid);
export { LrnappGalleryGrid };
