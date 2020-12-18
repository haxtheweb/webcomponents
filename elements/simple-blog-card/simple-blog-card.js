/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "time-elements/dist/time-elements.js";
/**
 * `simple-blog-card`
 * `a card commonly found on a blogging website`
 * @lit-element
 * @demo demo/index.html
 * @element simple-blog-card
 */
class SimpleBlogCard extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          --simple-blog-card-author-link: #03a87c;
        }

        :host([hidden]) {
          display: none;
        }

        :host *[hidden] {
          display: none;
        }

        simple-popover {
          position: absolute;
          display: flex;
        }

        div.card {
          height: auto !important;
          overflow: hidden;
        }

        img {
          max-height: 200px;
        }

        .card-content a {
          display: block;
        }

        .card-micro {
          width: 100px;
          --simple-blog-card-heading-font-size: 16px;
          --simple-blog-card-content-font-size: 14px;
        }

        .card-small {
          width: 200px;
          --simple-blog-card-heading-font-size: 16px;
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
          overflow: hidden;
        }

        .teaser,
        .teaser ::slotted(*) {
          font-size: var(--simple-blog-card-content-font-size, 18px);
          word-break: all;
          line-height: 1.2;
          text-overflow: ellipsis;
        }

        .card-content {
          height: 120px;
          padding: 0;
          overflow: hidden;
        }

        .card-micro {
          height: 50px;
        }

        .card-small {
          height: 100px;
        }

        .card-medium {
          height: 150px;
        }

        .card-large {
          height: 200px;
        }

        .card-micro .card-content {
          height: 50px;
        }

        .card-small .card-content {
          height: 50px;
        }

        .card-medium .card-content {
          height: 125px;
        }

        .card-large .card-content {
          height: 150px;
        }

        div.card h3 {
          font-size: var(--simple-blog-card-heading-font-size, 22px);
          color: var(--simple-blog-card-header, black);
          text-decoration: none;
          padding: 0;
          margin: 8px 0;
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
          display: flex;
          align-items: center;
        }

        .author-info {
          font-size: 14px;
          padding-left: 10px;
          text-rendering: auto;
        }

        .author-info a {
          color: var(--simple-blog-card-author-link);
        }

        .post-details {
          font-size: 14px;
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
      `,
    ];
  }

  // render function
  render() {
    return html`

<div class="card-${this.size} card">
  <img .alt="${this.alt}" .src="${this.image}" loading="lazy"/>
  <div class="card-content">
    <a href="${this.link}">
      <h3>${this.title}</h3>
      <div class="teaser">
        <slot></slot>
      </div>
    </a>
  </div>
  <div class="card-actions">
    <div id="author" class="author-block">
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
</div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      title: {
        name: "title",
        type: String,
      },
      author: {
        name: "author",
        type: String,
      },
      authorimage: {
        name: "authorimage",
        type: String,
      },
      authorlink: {
        name: "authorlink",
        type: String,
      },
      readtime: {
        name: "readtime",
        type: Number,
      },
      timestamp: {
        name: "timestamp",
        type: Number,
      },
      image: {
        name: "image",
        type: String,
      },
      link: {
        name: "link",
        type: String,
      },
      shadow: {
        name: "shadow",
        type: Number,
      },
      size: {
        name: "size",
        type: String,
      },
      placeholder: {
        name: "placeholder",
        type: String,
      },
      alt: {
        name: "alt",
        type: String,
      },
    };
  }

  static get tag() {
    return "simple-blog-card";
  }
  constructor() {
    super();
    this.placeholder =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAqADAAQAAAABAAAAAgAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAgACAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAHBwcHBwcMBwcMEQwMDBEXERERERcdFxcXFxcdIx0dHR0dHSMjIyMjIyMjKioqKioqMTExMTE3Nzc3Nzc3Nzc3P/bAEMBIiQkODQ4YDQ0YOacgJzm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5v/dAAQAAf/aAAwDAQACEQMRAD8AiooooA//2Q==";
    this.size = "medium";
    this.shadow = 0;
    setTimeout(() => {
      this.addEventListener("mouseover", this.hoverState.bind(this));
      this.addEventListener("mouseout", this.hoverStateOff.bind(this));
    }, 0);
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
