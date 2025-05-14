import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";

import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class SiteActiveMediaBanner extends DDDSuper(LitElement) {
  static get tag() {
    return "site-active-media-banner";
  }

  constructor() {
    super();
    this.mediaSource = "";
    this.fileExt = "";
    this.mediaType = "";
    this.playing = true;
    this.canPlay = false;
    this.icon = "av:pause-circle-outline";
    this.description = "";
    this.addEventListener("click", this.__videoHandler);

    this.__disposer = this.__disposer ? this.__disposer : [];

    autorun((reaction) => {
      let activeItem = toJS(store.activeItem);
      if (activeItem && activeItem.metadata && activeItem.metadata.image) {
        this.mediaSource = activeItem.metadata.image;
      } else {
        this.mediaSource = "";
      }
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      let activeItem = toJS(store.activeItem);
      if (activeItem && activeItem.description) {
        this.description = activeItem.description;
      }
      this.__disposer.push(reaction);
    });
  }

  static get properties() {
    return {
      mediaSource: { type: String, reflect: true, attribute: "media-source" },
      fileExt: { type: String, attribute: "file-ext" },
      mediaType: { type: String, reflect: true, attribute: "media-type" },
      playing: { type: Boolean, reflect: true },
      canPlay: { type: Boolean, attribute: "can-play" },
      icon: { type: String },
      description: { type: String },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin-left: 32px;
        }
        .media-banner {
          position: relative;
          height: 100%;
          height: var(--media-banner-height, 540px);
          width: 100%;
          z-index: 1;
        }
        .media-banner::before {
          position: absolute;
          content: "";
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(
            --media-banner-background-color,
            rgba(30, 64, 124, 0.7)
          );
          z-index: 1;
        }
        img,
        video {
          position: absolute;
          object-fit: cover;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .content {
          position: relative;
          padding: var(--media-banner-padding, 0 46px);
          margin: var(--media-banner-margin, 0 auto);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          color: var(--media-banner-font-color, white);
          overflow: hidden;
          max-width: var(--media-banner-max-width, 1080px);
          height: 100%;
          z-index: 1;
        }
        .page-title {
          width: 80%;
          margin-bottom: 60px;
        }
        simple-icon-button {
          --simple-icon-color: var(--media-banner-font-color, white);
          --simple-icon-button-focus-color: var(
            --media-banner-font-color,
            white
          );
          --simple-icon-width: var(--inline-audio-width, 48px);
          --simple-icon-height: var(--inline-audio-height, 48px);
          margin-bottom: 60px;
        }

        site-active-title h1 {
          font-size: var(--ddd-font-size-l);
          padding: 0;
          margin: 0 0 var(--ddd-spacing-5) 0;
          text-align: start;
          line-height: normal;
        }

        @media only screen and (max-width: 1023px) {
          site-active-title h1 {
            font-size: var(--ddd-font-size-xs);
            margin: 0 0 var(--ddd-spacing-2) 0;
          }
        }
      `,
    ];
  }

  setMediaType() {
    this.fileExt = this.mediaSource.split(".").pop();
    if (["mp4", "webm", "ogg"].includes(this.fileExt)) {
      this.mediaType = "video";
    } else if (["png", "jpg", "jpeg", "gif"].includes(this.fileExt)) {
      this.mediaType = "image";
    } else {
      this.mediaType = "";
      this.mediaSource = "";
    }
  }

  __videoHandler() {
    if (this.mediaType == "video") {
      var video = this.shadowRoot.querySelector("video");
      if (this.playing) {
        video.pause();
        this.icon = "av:play-circle-outline";
        this.playing = false;
      } else {
        video.play();
        this.icon = "av:pause-circle-outline";
        this.playing = true;
      }
    }
  }

  render() {
    return html`
      ${
        this.mediaType === "image"
          ? html` <div class="media-banner">
              <img crossorigin="anonymous" src=${this.mediaSource} />
              ${this.fileExt === "gif"
                ? html` <div class="content">
                    <div class="page-title">
                      <site-active-title part="page-title"></site-active-title>
                      ${this.description}
                    </div>
                  </div>`
                : html``}
            </div>`
          : this.mediaType === "video"
            ? html`
                <div class="media-banner">
                  <video
                    crossorigin="anonymous"
                    loop
                    autoplay
                    muted
                    playsinline
                  >
                    <source
                      src=${this.mediaSource}
                      type="video/${this.fileExt}"
                    />
                  </video>
                  <div class="content">
                    <div class="page-title">
                      <site-active-title part="page-title"></site-active-title>
                      ${this.description}
                    </div>
                    <simple-icon-button
                      class="icon"
                      title="${this.title}"
                      aria-label="${this.aria}"
                      icon="${this.icon}"
                    ></simple-icon-button>
                  </div>
                </div>
              `
            : html``
      }
    </div>`;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "mediaSource") {
        this.setMediaType();
      }
    });
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}

customElements.define(SiteActiveMediaBanner.tag, SiteActiveMediaBanner);
