/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-card/paper-card.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "time-elements/dist/time-elements.js";
/**
 * `simple-blog-card`
 * `a card commonly found on a blogging website`
 * @lit-element
 * @demo demo/index.html
 * @customElement simple-blog-card
 */
class SimpleBlogCard extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
