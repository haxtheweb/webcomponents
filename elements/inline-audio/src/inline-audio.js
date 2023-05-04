import { html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
/**
 * `inline-audio`
 * `A simple inline audio player to augment text`
 *
### Styling

::part()
The following parts are available for styling:
icon - the icon
progress - the progress bar
progress-bar - the progress bar container

Custom property | Description | Default
----------------|-------------|----------
`--inline-audio-padding | padding on the container of the player | 0px 4px
`--inline-audio-margin | margin on the container | 0
`--inline-audio-icon-padding | icon padding | 0px 4px 0px 0px
`--inline-audio-width | width of the icon | 36px
`--inline-audio-height | height of the icon | 36px
`--inline-audio-button-focus-opacity | opacity of the button on focus | 0.8
 *
 * @demo demo/index.html
 * @element inline-audio
 * 
 */
class InlineAudio extends I18NMixin(SimpleColors) {
  /**
   * convention
   */
  static get tag() {
    return 'inline-audio';
  }
  /**
   * LitElement lifecycle
   */
  static get properties() {
    return {
      ...super.properties,
      source: { type: String },
      icon: { type: String },
      aria: { type: String },
      title: { type: String },
      playing: { type: Boolean, reflect: true },
      shiny: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      ...super.styles,
    css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      color: var(--simple-colors-default-theme-grey-12);
      --inline-audio-padding: 0px 4px;
      --inline-audio-margin: 0;
      --inline-audio-icon-padding: 0px 4px 0px 0px;
    }

    .container {
      display: inline-flex;
      align-items: center;
      padding: var(--inline-audio-padding);
      margin: var(--inline-audio-margin);
      background-color: var(--simple-colors-default-theme-grey-2);
      min-width: 48px;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      z-index: 1;
    }

    :host([shiny]) .container {
      background-color: var(--simple-colors-default-theme-accent-2);
    }

    .progress-bar {
      height: 100%;
      background-color: var(--simple-colors-default-theme-accent-5);
      transition: width 0.1s;
      position: absolute;
      border-radius: 4px;
      top: 0;
      left: 0;
      z-index: -1;
    }

    .progress {
      height: 100%;
      background-color: var(--simple-colors-default-theme-accent-5);
      position: absolute;
      border-radius: 4px;
      top: 0;
      left: 0;
      z-index: -1;
      animation: progress-bar 1s linear forwards;
    }

    .container:focus-within {
      outline: 2px solid var(--simple-colors-default-theme-accent-6);
    }

    .icon {
      padding: var(--inline-audio-icon-padding);
      --simple-icon-color: var(--simple-colors-default-theme-grey-12);
      --simple-icon-button-border-radius: none;
      --simple-icon-button-focus-color: var(--simple-colors-default-theme-grey-12);
      --simple-icon-button-focus-opacity: var(--inline-audio-button-focus-opacity, .8);
      --simple-icon-width: var(--inline-audio-width, 36px);
      --simple-icon-height: var(--inline-audio-height, 36px);
    }

    .icon::part(button):focus {
      outline: none;
    }
  `];
  }

  constructor() {
    super();
    this.playing = false;
    this.shiny = false;
    this.canPlay = false;
    this.t = this.t || {};
    this.t.play = "Play";
    this.t.pause = "Pause";
    this.t.selectToPlayRelatedAudioClip = "Select to play related audio clip";
    this.t.selectToPauseRelatedAudioClip = "Select to pause related audio clip";
    this.source = "";
    this.icon = "av:play-arrow";
    this.aria = this.t.selectToPlayRelatedAudioClip;
    this.title = this.t.play;
    this.addEventListener('click', this.__clickEvent);
  }

  handleProgress() {
    if (this.__audio.ended) {
      this.audioController(false);
    }
    const progress = (this.__audio.currentTime / this.__audio.duration) * 100;
    this.shadowRoot.querySelector(".progress").style.width = `${progress}%`;
    if (!this.__audio.paused) {
      requestAnimationFrame(() => this.handleProgress());
    }
  }

  handlePlaythrough() {
    setTimeout(() => {
      this.canPlay = true;
      this.audioController(true);
    }, 500);
  }

  audioController(playState) {
    if (playState) {
      this.__audio.play();
      this.playing = true;
    }
    else{
      this.__audio.pause();
      this.playing = false;
    }
  }
  load(source) {
    this.__audio.src = source;
    this.__audio.load();
  }
  // shortcuts for audio control
  play() {
    this.audioController(true);
  }
  pause() {
    this.audioController(false);
  }

  __clickEvent() {
    try {
      if (!this.shadowRoot.getSelection().toString()) {
        if (!this.__audio.hasAttribute("src")) {
          this.icon = "hax:loading";
          this.load(this.source);
        } 
        else if (this.canPlay) {
          if (this.__audio.paused) {
            this.audioController(true);
          }
          else {
            this.audioController(false);
          }
        }
      }
    }
    catch(e) {
      // do nothing if selection fails some how
    }
  }
  /**
   * LitElement lifecycle
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "playing" && oldValue !== undefined) {
        this.dispatchEvent(new CustomEvent('playing-changed', {
          detail: {
            value: this[propName],
          }
        }));
        if (this[propName]) {
          this.icon = "av:pause";
          this.title = this.t.pause;
          this.aria = this.t.selectToPauseRelatedAudioClip;
        }
        else {
          this.icon = "av:play-arrow";
          this.title = this.t.play;
          this.aria = this.t.selectToPlayRelatedAudioClip;
        }
      }
    });
  }
  /**
   * LitElement lifecycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__audio = this.shadowRoot.querySelector('.player');
  }
  /**
   * LitElement lifecycle
   */
  render() {
    return html`
    <div class="container">
      <simple-icon-button part="icon" class="icon" title="${this.title}" aria-label="${this.aria}" icon="${this.icon}"></simple-icon-button>
      <slot></slot>
      <audio class="player" hidden type="audio/mpeg" @canplaythrough="${this.handlePlaythrough}" @timeupdate="${this.handleProgress}"></audio>
      <div part="progress-bar" class="progress-bar"></div>
      <div part="progress" class="progress"></div>
    </div>`;
  }
}

customElements.define(InlineAudio.tag, InlineAudio);
export { InlineAudio };