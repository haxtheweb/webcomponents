import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

class LectureAnchor extends DDD {
  static get properties() {
    return {
      icon: { type: String, reflect: true },
      value: { type: Number, reflect: true },
      target: { type: String, reflect: true },
      associatedID: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.icon = "icons:flag";
    this.value = 0;
    this.jumbotronHeading = "";
    this.jumbotronContent = "";
    this.target = "video-player";
    this.associatedID = "";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          cursor: pointer;
        }

        simple-icon-lite {
          padding-bottom: var(--ddd-spacing-1);
          --simple-icon-color: var(--ddd-theme-primary, black);
        }

        mark {
          background-color: var(
            --ddd-theme-accent,
            var(--ddd-theme-default-keystoneYellow)
          );
          color: var(--ddd-theme-primary, black);
          padding: var(--ddd-spacing-1);
        }
      `,
    ];
  }

  clickHandler(e) {
    console.log(e.type);
    // @TODO: make sure that we can highlight concepts that are NOT connected to anything in the current page.
    // this could be a good way of reinforcing concepts or having a button that allows jumping to that concept (or loading the content of that concept short form in a tooltip like a definition)
    if (this._haxState && e.type === "click") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    // verify node exists and change targetting system if we are in edit mode of HAX
    let node;
    if (this._haxState) {
      node = globalThis.document.querySelector(
        ".haxcms-theme-element " + this.target,
      );
    } else {
      //node = HAXStore.activeHaxBody.querySelector(this.target);
      node = globalThis.document.querySelector(this.target);
    }
    // ensure node exists in selection; may get deleted after being set
    if (node) {
      node.scrollIntoView();
      setTimeout(() => {
        switch (node.tagName.toLowerCase()) {
          case "lecture-player":
          case "video-player":
          case "audio-player":
            if (this.value) {
              node.seek(parseInt(this.value));
            } else {
              node.play();
            }
            break;
          case "play-list":
            // move to the slide in question in the play-list
            node.slide = parseInt(this.value);
            break;
          case "time-line":
          default:
            // @todo nothing for now but may need future functionality based on usecases
            break;
        }
      }, 100);
    } else {
      // unset the node because we didn't find it
      this.target = null;
    }
  }

  render() {
    return html`
      <mark @click="${this.clickHandler}">
        <simple-icon-lite icon="${this.icon}" dir="ltr"></simple-icon-lite>
        <slot></slot>
      </mark>
    `;
  }

  static get tag() {
    return "video-player-flag";
  }

  static get value() {
    return this.value;
  }

  static get jumbotronHeading() {
    return this.jumbotronHeading;
  }

  static get jumbotronContent() {
    return this.jumbotronContent;
  }
}

globalThis.customElements.define("lecture-anchor", LectureAnchor);
