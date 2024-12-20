import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

export class PolarisMediaBanner extends LitElement {
  static get tag() {
    return "polaris-media-banner";
  }

  constructor() {
    super();
    this.source = "";
    this.fileExt = "";
    this.mediaType = "";
    this.playing = true;
    this.canPlay = false;
    this.icon = "av:pause-circle-outline"
    this.addEventListener("click", this.__videoHandler);
  }

  static get properties() {
    return {
      source: { type: String },
      fileExt: { type: String },
      mediaType: { type: String, relfect: true },
      playing: { type: Boolean, reflect: true },
      canPlay: { type: Boolean },
      icon: { type: String },
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
          height:100%;
          height: var(--polaris-banner-height, 540px);
          width: 100%;
          z-index: 1;
        }
        .media-banner::before{
          position: absolute;
          content:"";
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--polaris-banner-background-color, rgba(30, 64, 124, 0.7));
          z-index: 1;
        }
        img, video {
          position: absolute;
          object-fit: cover;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .content {
          position: relative;
          padding: var(--polaris-banner-padding, 0 46px);
          margin: var(--polaris-banner-margin, 0 auto);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          color: var(--polaris-banner-font-color, white);
          overflow: hidden;
          max-width: var(--polaris-banner-max-width, 1080px);
          height: 100%;
          z-index: 1;
        }
        .page-title {
          width: 80%;
          margin-bottom: 60px;
        }
        simple-icon-button {
          --simple-icon-color: var(--polaris-banner-font-color, white);
          --simple-icon-button-focus-color: var(--polaris-banner-font-color, white);
          --simple-icon-width: var(--inline-audio-width, 48px);
          --simple-icon-height: var(--inline-audio-height, 48px);
          margin-bottom: 60px;
        }
      `,
    ];
  }

  setMediaType(){
    this.fileExt = this.source.split('.').pop()
    if(['mp4', 'webm', 'ogg'].includes(this.fileExt)){
      this.mediaType = "video"
    } else if (['png', 'jpg', 'jpeg', 'gif'].includes(this.fileExt)) {
      this.mediaType = "image"
    } else {
      this.mediaType = "";
      this.source = "";
    }
  }

  __videoHandler(){
    if(this.mediaType=="video"){
      var video = this.shadowRoot.querySelector('video');
      if(this.playing){
        video.pause();
        this.icon = "av:play-circle-outline"
        this.playing = false;
      } else{
        video.play();
        this.icon = "av:pause-circle-outline"
        this.playing = true;
      }
    }
  }

  updated(changedProperties){
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "source") {
        this.setMediaType();
      }
    });
  }

  render() {
    return html`
      ${this.mediaType === 'image' 
        ? html `
        <div class="media-banner">
          <img crossorigin='anonymous' src=${this.source}>
          ${this.fileExt === 'gif' ? html `             
            <div class="content">
              <div class="page-title">
                <slot class="title">text text text text</slot>
              </div>
            </div>` : html ``}
      </div>` :
        this.mediaType === 'video' 
        ? html `
        <div class="media-banner">
          <video crossorigin='anonymous' loop autoplay muted playsinline>
            <source src=${this.source} type="video/${this.fileExt}">
          </video>
          <div class="content">
             <div class="page-title">
                <slot class="title">text text text text</slot>
             </div>
            <simple-icon-button class="icon" title="${this.title}" aria-label="${this.aria}" icon="${this.icon}"></simple-icon-button>
          </div>
          </div>
          ` :
        html ``
      }
    </div>`;
  }
}

customElements.define(PolarisMediaBanner.tag, PolarisMediaBanner);
