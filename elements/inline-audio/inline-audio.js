import { html, css } from "lit";
import "@haxtheweb/simple-colors/simple-colors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";

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
class InlineAudio extends I18NMixin(DDD) {
  /**
   * convention
   */
  static get tag() {
    return "inline-audio";
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
      super.styles,
      DDDAccentStyles,
      css`
        /* DDD pill: soft tint surface and a hairline border (the accent when
           accent-color is set), a navy play circle (white in dark), and
           heading-colour text so it reads on light and dark pages */
        :host {
          display: inline-flex;
          vertical-align: middle;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-white, #ffffff)
          );
          font-weight: var(--ddd-font-weight-bold, 700);
          --inline-audio-padding: 0 var(--ddd-spacing-3, 12px) 0
            var(--ddd-spacing-1, 4px);
          --inline-audio-margin: 0;
          --inline-audio-icon-padding: 0;
        }

        .container {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--inline-audio-padding);
          margin: var(--inline-audio-margin);
          min-height: var(--ddd-spacing-7, 28px);
          min-width: 48px;
          box-sizing: border-box;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight, #f5f5f5),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          border: var(--ddd-border-size-xs, 1px) solid
            var(
              --ddd-accent-color,
              light-dark(
                var(--ddd-theme-default-limestoneLight, #e4e5e7),
                var(--ddd-theme-default-slateGray, #314d64)
              )
            );
          border-radius: var(--ddd-radius-rounded, 100px);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        :host([shiny]) .container {
          background-color: var(
            --ddd-accent-color-tint,
            light-dark(
              var(--ddd-theme-default-accent, #96bee6),
              var(--ddd-theme-default-coalyGray, #262626)
            )
          );
        }

        .progress-bar,
        .progress {
          height: 100%;
          background-color: color-mix(
            in srgb,
            var(--ddd-accent-color, var(--ddd-theme-default-skyBlue, #009cde))
              30%,
            transparent
          );
          position: absolute;
          border-radius: var(--ddd-radius-rounded, 100px);
          top: 0;
          left: 0;
          z-index: -1;
        }

        .progress-bar {
          transition: width 0.1s;
        }

        .progress {
          animation: progress-bar 1s linear forwards;
        }

        .container:focus-within {
          outline: var(--ddd-focus-ring, 2px solid #005fa9);
          outline-offset: var(--ddd-focus-offset, 2px);
        }

        .icon {
          flex: none;
          margin: var(--inline-audio-icon-padding);
          --simple-icon-button-border-radius: 50%;
          --simple-icon-button-background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-white, #ffffff)
          );
          --simple-icon-color: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-nittanyNavy, #001e44)
          );
          --simple-icon-button-focus-color: var(--simple-icon-color);
          --simple-icon-button-focus-background-color: var(
            --simple-icon-button-background-color
          );
          --simple-icon-button-focus-opacity: var(
            --inline-audio-button-focus-opacity,
            0.8
          );
          --simple-icon-button-padding: var(--ddd-spacing-1, 4px);
          --simple-icon-width: var(--inline-audio-width, 22px);
          --simple-icon-height: var(--inline-audio-height, 22px);
        }

        .icon::part(button):focus {
          outline: none;
        }
      `,
    ];
  }

  constructor() {
    super();
    this._haxstate = false;
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
    this.addEventListener("click", this.__clickEvent);
  }

  handleProgress() {
    if (this.__audio.ended) {
      this.audioController(false);
    }
    // an unknown duration (0, NaN or Infinity for live streams) has no
    // meaningful progress, so skip the width write entirely
    const duration = this.__audio.duration;
    if (Number.isFinite(duration) && duration > 0) {
      const progress = (this.__audio.currentTime / duration) * 100;
      this.shadowRoot.querySelector(".progress").style.width = `${progress}%`;
    }
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
    } else {
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

  __clickEvent(e) {
    if (this._haxstate) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    } else {
      try {
        if (!this.shadowRoot.getSelection().toString()) {
          if (!this.__audio.hasAttribute("src")) {
            this.icon = "hax:loading";
            this.load(this.source);
          } else if (this.canPlay) {
            if (this.__audio.paused) {
              this.audioController(true);
            } else {
              this.audioController(false);
            }
          }
        }
      } catch {
        // do nothing if selection fails some how
      }
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
        this.dispatchEvent(
          new CustomEvent("playing-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
        if (this[propName]) {
          this.icon = "av:pause";
          this.title = this.t.pause;
          this.aria = this.t.selectToPauseRelatedAudioClip;
        } else {
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
    this.__audio = this.shadowRoot.querySelector(".player");
  }
  /**
   * LitElement lifecycle
   */
  render() {
    return html` <div class="container">
      <simple-icon-button
        part="icon"
        class="icon"
        title="${this.title}"
        label="${this.aria}"
        icon="${this.icon}"
      ></simple-icon-button>
      <span class="sr-only" aria-live="polite" aria-atomic="true"
        >${this.playing ? this.t.pause : this.t.play}</span
      >
      <slot></slot>
      <audio
        class="player"
        hidden
        type="audio/mpeg"
        @canplaythrough="${this.handlePlaythrough}"
        @timeupdate="${this.handleProgress}"
      ></audio>
      <div part="progress-bar" class="progress-bar"></div>
      <div part="progress" class="progress"></div>
    </div>`;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  haxactiveElementChanged(element, value) {
    if (value) {
      this._haxstate = value;
    }
  }
  haxeditModeChanged(value) {
    this._haxstate = value;
  }
}

globalThis.customElements.define(InlineAudio.tag, InlineAudio);
export { InlineAudio };
