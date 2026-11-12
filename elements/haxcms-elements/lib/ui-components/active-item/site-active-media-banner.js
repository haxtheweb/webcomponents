/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
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
    // background motion starts paused when the visitor asks for less motion
    this.playing = !SiteActiveMediaBanner.prefersReducedMotion();
    this.canPlay = false;
    this.icon = this.playing
      ? "av:pause-circle-outline"
      : "av:play-circle-outline";
    this.description = "";
    this.t = {
      pauseVideo: "Pause background video",
      playVideo: "Play background video",
    };

    this.__disposer = this.__disposer ? this.__disposer : [];

    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.activeItem);
        Promise.resolve().then(() => {
          let activeItem = _mobx_val_0;
          if (activeItem && activeItem.metadata && activeItem.metadata.image) {
            this.mediaSource = activeItem.metadata.image;
          } else {
            this.mediaSource = "";
          }
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.activeItem);
        Promise.resolve().then(() => {
          let activeItem = _mobx_val_0;
          if (activeItem && activeItem.description) {
            this.description = activeItem.description;
          }
        });
      }),
    );
  }

  static prefersReducedMotion() {
    return !!(
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
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
        .media-control {
          position: absolute;
          inset-block-end: var(--ddd-media-control-inset, 16px);
          inset-inline-end: var(--ddd-media-control-inset, 16px);
          z-index: 2;
          inline-size: var(--ddd-media-control-size, 48px);
          block-size: var(--ddd-media-control-size, 48px);
          color: var(--ddd-media-control-color, white);
          --simple-icon-width: var(--ddd-icon-xxs, 24px);
          --simple-icon-height: var(--ddd-icon-xxs, 24px);
          --simple-icon-button-border-radius: var(
            --ddd-media-control-radius,
            100%
          );
          --simple-icon-button-border: var(
            --ddd-media-control-border,
            2px solid rgba(255, 255, 255, 0.65)
          );
          --simple-icon-button-background-color: var(
            --ddd-media-control-bg,
            rgba(0, 30, 68, 0.8)
          );
          --simple-icon-button-focus-background-color: var(
            --ddd-media-control-bg-hover,
            #001e44
          );
          --simple-icon-button-focus-border: var(
            --ddd-media-control-border,
            2px solid rgba(255, 255, 255, 0.65)
          );
          --simple-icon-button-focus-opacity: 1;
          --simple-icon-button-focus-color: var(
            --ddd-media-control-color,
            white
          );
        }
        .media-control:focus-within {
          outline: var(--ddd-media-control-focus-ring, 3px solid #ffd100);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
        .media-banner[data-has-control] .content {
          padding-inline-end: calc(
            var(--ddd-media-control-size, 48px) + 2 *
              var(--ddd-media-control-inset, 16px)
          );
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
      let video = this.shadowRoot.querySelector("video");
      if (this.playing) {
        if (video) {
          video.pause();
        }
        this.icon = "av:play-circle-outline";
        this.playing = false;
      } else {
        if (video) {
          const p = video.play();
          // a blocked play() rejects; ignore it and leave the button as is
          if (p && p.catch) {
            p.catch(() => {});
          }
        }
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
              <img
                crossorigin="anonymous"
                src="${this.mediaSource}"
                alt=""
                fetchpriority="high"
              />
              ${
                this.fileExt === "gif"
                  ? html`<div class="content">
                      <div class="page-title">
                        <site-active-title
                          part="page-title"
                        ></site-active-title>
                        ${this.description}
                      </div>
                    </div>`
                  : html``
              }
            </div>`
          : this.mediaType === "video"
            ? html`
                <div class="media-banner" data-has-control>
                  <video
                    crossorigin="anonymous"
                    loop
                    ?autoplay="${this.playing}"
                    muted
                    playsinline
                    aria-hidden="true"
                    tabindex="-1"
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
                  </div>
                  <simple-icon-button-lite
                    class="media-control"
                    part="media-control"
                    icon="${this.icon}"
                    label="${this.playing ? this.t.pauseVideo : this.t.playVideo}"
                    @click="${this.__videoHandler}"
                  ></simple-icon-button-lite>
                </div>
              `
            : html``
      }
    `;
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
    for (let i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    super.disconnectedCallback();
  }
}

globalThis.customElements.define(
  SiteActiveMediaBanner.tag,
  SiteActiveMediaBanner,
);
