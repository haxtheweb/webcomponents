import { html, css } from 'lit';
import { SimpleColors } from '@lrnwebcomponents/simple-colors';
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

class InlineAudio extends SimpleColors {
  static get tag() {
    return 'inline-audio';
  }
  static get properties(){
    return{
      ...super.properties,
      source: { type: String},
      icon: { type: String},
      aria: { type: String},
      title: { type: String},
      playing: { type: Boolean, reflect: true},
      shiny: { type: Boolean, reflect: true},
    }
  }

  static get styles(){ 
    return [...super.styles, css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      color: var(--simple-colors-default-theme-grey-12);
      --inline-audio-padding: 0.5px 10px 0.5px 0px;;
      --inline-audio-margin: 0;
      --inline-audio-border: 1px;
      --inline-audio-icon-padding: 0px 4px 0px 0px;
    }
    .container {
      display: inline-flex;
      align-items: center;
      padding: var(--inline-audio-padding);
      margin: var(--inline-audio-margin);
      border: var(--inline-audio-border);
      background-color: var(--simple-colors-default-theme-grey-2);
      min-width: 48px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
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
    .icon::part(button):focus {
      outline: none;
    }
    .icon {
      padding: var(--inline-audio-icon-padding);
      --simple-icon-color: var(--simple-colors-default-theme-grey-12);
      --simple-icon-button-border-radius: none;
      --simple-icon-button-focus-color: var(--simple-colors-default-theme-grey-12);
      --simple-icon-button-focus-opacity: 80%;
      --simple-icon-width: 24px;
      --simple-icon-height: 24px;
    }
  `];
  }

  constructor() {
    super();
    this.source = '';
    this.shiny = false;
    this.icon = "av:play-arrow";
    this.aria = "Select to play a related audio clip";
    this.title = "Play";
    this.playing = false;
    this.canPlay = false;
    this.addEventListener('click', this.__clickEvent);
  }

  handleProgress() {
    if(this.__audio.ended){
      this.audioController(false);
    }
    const progressBar = this.shadowRoot.querySelector(".progress");
    if (progressBar) {
      const progress = (this.__audio.currentTime / this.__audio.duration) * 100;
      progressBar.style.width = `${progress}%`;
      if (!this.__audio.paused) {
        requestAnimationFrame(() => this.handleProgress());
      }
    }
  }

  loadAudio(source) {
    this.__audio.src = source;
    this.__audio.load();
  }

  handlePlaythrough() {
    setTimeout(() => {
      this.canPlay = true;
      this.audioController(true);
    }, 500); 
  }

  audioController(playState) {
    if(playState){
      this.__audio.play();
      this.playing = true;
      this.icon = "av:pause";
      this.aria = "Select to pause audio clip";
      this.title = "Pause";
    }
    else{
      this.__audio.pause();
      this.playing = false;
      this.icon = "av:play-arrow";
      this.aria = "Select to play audio clip";
      this.title = "Play"
    }
  }

  __clickEvent() {
    try {
      if(!this.shadowRoot.getSelection().toString()){
        if(!this.__audio.hasAttribute("src")){
          this.icon = "hax:loading";
          this.loadAudio(this.source);
        } 
        else if(this.canPlay) {
          if(this.__audio.paused){
            this.audioController(true);
          }
          else{
            this.audioController(false);
          }
        }
      }
    }
    catch(e) {

    }
  }

  updated(changedProperties){
    changedProperties.forEach((oldValue, propName) => {
      if(propName === "playing" && oldValue !== undefined) {
        this.dispatchEvent(new CustomEvent('playing-changed', {
          detail: {
            value: this[propName]
          }
        }));
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__audio = this.shadowRoot.querySelector('.player');
  }

  render() {
    return html`
    <div class="container">
      <simple-icon-button class="icon" title="${this.title}" aria-label="${this.aria}" icon="${this.icon}"></simple-icon-button>
      <slot></slot>
      <audio class="player" type="audio/mpeg" @canplaythrough="${this.handlePlaythrough}" @timeupdate="${this.handleProgress}"></audio>
      <div class="progress-bar"></div>
      <div class="progress"></div>
    </div>`;
  }
}

customElements.define(InlineAudio.tag, InlineAudio);
export { InlineAudio };