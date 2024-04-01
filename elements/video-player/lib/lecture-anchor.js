import { html, css } from 'lit';
import { DDD } from '@lrnwebcomponents/d-d-d/d-d-d.js';
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

class LectureAnchor extends (DDD) {
  static get properties() {
    return {
      icon: { type: String, reflect: true},
      header: {type: Boolean, reflect: true},
      color: { type: String, reflect: true},
      timestamp: { type: Number, reflect: true},
      text: { type: String, reflect: true},
      headingText: { type: String, reflect: true},
    };
  }
  
  constructor() {
    super();
    this.icon = "icons:flag";
    this.color = "var(--ddd-theme-default-original87Pink);";
    this.timestamp = 0;
    this.text = "Lecture Anchor";
    this.jumbotronHeading = "";
    this.jumbotronContent = "";
  }

  static styles = css`
    :host{
      cursor: pointer;
    }

    simple-icon-lite{
      padding-bottom: var(--ddd-spacing-1);
      --simple-icon-color: var(--ddd-theme-primary, black);
    }

    mark{
      background-color: var(--ddd-theme-accent, var(--ddd-theme-default-keystoneYellow));
      color: var(--ddd-theme-primary, black);
      padding: var(--ddd-spacing-1);
    }
  `;

  render() {
    return html`
    <mark>
      <simple-icon-lite icon="${this.icon}" dir="ltr"></simple-icon-lite>
      <span>${this.text}</span>
    </mark>
    `;
  }

  static get tag() {
    return 'video-player-flag';
  }

  static get timestamp() {
    return this.timestamp;
  }

  static get jumbotronHeading() {
    return this.jumbotronHeading;
  }

  static get jumbotronContent() {
    return this.jumbotronContent;
  }
}

window.customElements.define('lecture-anchor', LectureAnchor);