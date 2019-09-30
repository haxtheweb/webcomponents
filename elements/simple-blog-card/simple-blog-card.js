/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-card/paper-card.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";

/**
 * `simple-blog-card`
 * `a card commonly found on a blogging website`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-element
 * @demo demo/index.html
 */
class SimpleBlogCard extends LitElement {
  // render function
  render() {
    return html`
<style>
:host {
  display:block;
}

simple-popover {
  position:absolute;
  display: flex;
}

paper-card {
  height: auto !important;
}</style>
<paper-card
  .alt="${this.alt}"
  image="${this.image}"
  .elevation="${this.shadow}"
  animated-shadow
  preload-image
  .placeholder-image="${this.placeholder}"
  class="card-${this.size}">
  <div class="card-content">
    <a href="${this.link}">
      <h3>${this.title}</h3>
      <div class="teaser">
        <slot></slot>
      </div>
    </a>
  </div>
  <div class="card-actions">
    <div id="author" class="author-block"
    >
      <paper-avatar
        .label="${this.author}"
        .src="${this.authorimage}">
      </paper-avatar>
      <div class="author-info">
        <a .href="${this.authorlink}">${this.author}</a>
        <div class="post-details">
          <simple-datetime format="M jS" .timestamp="${this.timestamp}" unix>
          </simple-datetime>
          <span class="dot">&#183</span>
          <span class="reading-time" .title="${this.readtime} min read"></span>
        </div>
      </div>
    </div>
  </div>
</paper-card>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    let props = {
      title: {
        name: "title",
        type: String
      },
      author: {
        name: "author",
        type: String
      },
      authorimage: {
        name: "authorimage",
        type: String
      },
      authorlink: {
        name: "authorlink",
        type: String
      },
      readtime: {
        name: "readtime",
        type: Number
      },
      timestamp: {
        name: "timestamp",
        type: Number
      },
      image: {
        name: "image",
        type: String
      },
      link: {
        name: "link",
        type: String
      },
      shadow: {
        name: "shadow",
        type: Number
      },
      size: {
        name: "size",
        type: String
      },
      placeholder: {
        name: "placeholder",
        type: String
      },
      alt: {
        name: "alt",
        type: String
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-blog-card";
  }
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          --simple-blog-card-author-link: #03a87c;
        }

        :host([hidden]) {
          display: none;
        }
        .card-micro {
          width: 100px;
        }
        .card-small {
          width: 200px;
        }
        .card-medium {
          width: 300px;
        }
        .card-large {
          width: 400px;
        }
        .card-xlarge {
          width: 600px;
        }
        a {
          text-decoration: none;
        }
        .teaser {
          margin-top: 7px;
        }
        .teaser,
        .teaser ::slotted(*) {
          color: var(--simple-blog-card-text, rgba(0, 0, 0, 0.54));
          line-height: 1.2;
          font-size: 20px;
          word-break: all;
        }
        paper-card:not(:defined) {
          display: none;
        }
        paper-card {
          --iron-image-height: 250px;
        }
        .card-content {
          height: 125px;
          overflow: hidden;
        }
        .card-micro {
          --iron-image-height: 50px;
        }
        .card-small {
          --iron-image-height: 100px;
        }
        .card-medium {
          --iron-image-height: 150px;
        }
        .card-large {
          --iron-image-height: 200px;
          height: 100px;
        }
        .card-micro .card-content {
          height: 25px;
        }
        .card-small .card-content {
          height: 50px;
        }
        .card-medium .card-content {
          height: 75px;
        }
        .card-large .card-content {
          height: 100px;
        }
        paper-card h3 {
          font-size: 26px;
          line-height: 1.1;
          letter-spacing: 0;
          font-weight: 600;
          color: var(--simple-blog-card-header, black);
          text-decoration: none;
          padding-bottom: 2px;
          padding-top: 5px;
          margin: 0;
          font-family: "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans",
            Geneva, Arial, sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
          word-wrap: break-word;
          text-overflow: ellipsis;
        }
        paper-avatar {
          -webkit-box-flex: 0;
          -webkit-flex: 0 0 auto;
          -ms-flex: 0 0 auto;
          flex: 0 0 auto;
          display: inline-block;
        }
        .reading-time:after {
          content: attr(title);
        }
        .author-block {
          line-height: 1.4;
          font-size: 15px;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
        }
        .author-info {
          font-size: 16px;
          line-height: 1.4;
          padding-left: 10px;
          text-rendering: auto;
        }
        .author-info a {
          color: var(--simple-blog-card-author-link);
        }
        .post-details {
          font-size: 15px;
          color: var(--simple-blog-card-text, rgba(0, 0, 0, 0.54));
        }
        .post-details .dot {
          padding-right: 0.3em;
          padding-left: 0.3em;
        }
        .box {
          outline: 1px solid black;
        }
        simple-popover:not([for]) {
          display: none;
        }
      `
    ];
  }
  // life cycle
  constructor() {
    super();
    this.placeholder =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAqADAAQAAAABAAAAAgAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAgACAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAHBwcHBwcMBwcMEQwMDBEXERERERcdFxcXFxcdIx0dHR0dHSMjIyMjIyMjKioqKioqMTExMTE3Nzc3Nzc3Nzc3P/bAEMBIiQkODQ4YDQ0YOacgJzm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5v/dAAQAAf/aAAwDAQACEQMRAD8AiooooA//2Q==";
    this.size = "medium";
    this.shadow = 0;
    import("@lrnwebcomponents/paper-avatar/paper-avatar.js");
    import("time-elements/dist/time-elements.js");
  }
  update(changedProperties) {
    super.update();
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "image") {
        // fallback to placeholder if set to empty
        if (!this.image) {
          this.image = this.placeholder;
        }
      }
    });
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.image) {
      this.image = this.placeholder;
    }
    this.addEventListener("mouseover", this.hoverState.bind(this));
    this.addEventListener("mouseout", this.hoverStateOff.bind(this));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("mouseover", this.hoverState.bind(this));
    this.removeEventListener("mouseout", this.hoverStateOff.bind(this));
  }
  ready() {
    super.ready();
  }
  showDetails(e) {
    this.shadowRoot
      .querySelector("simple-popover")
      .setAttribute("for", "author");
    this.shadowRoot.querySelector("simple-popover").setPosition();
  }
  hideDetails(e) {
    this.shadowRoot.querySelector("simple-popover").removeAttribute("for");
    this.shadowRoot.querySelector("simple-popover").unsetPosition();
  }
  hoverState(e) {
    this.shadow = 1;
  }
  hoverStateOff(e) {
    this.shadow = 0;
  }
}
customElements.define(SimpleBlogCard.tag, SimpleBlogCard);
export { SimpleBlogCard };
