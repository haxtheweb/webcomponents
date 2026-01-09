/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css, html } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/a11y-media-player/a11y-media-player.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { MediaBehaviorsVideo } from "@haxtheweb/media-behaviors/media-behaviors.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { copyToClipboard } from "@haxtheweb/utils/utils.js";
/**
 * `video-player`
 * `A simple responsive video player with ridiculously powerful backing`
 *
 * @microcopy - language worth noting:
 * - `video source` - url / link to video file
 *
 * @demo demo/index.html
 * @element video-player
 */
class VideoPlayer extends IntersectionObserverMixin(
  MediaBehaviorsVideo(SchemaBehaviors(I18NMixin(DDD))),
) {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-4) 0;
        }

        .video-caption {
          font-style: italic;
          margin: 0;
          padding: 8px;
        }
        a11y-media-player {
          box-shadow: var(--ddd-boxShadow-lg);
          --a11y-media-color: var(
            --video-player-color,
            var(--simple-colors-default-theme-accent-11, #111111)
          );

          --a11y-media-caption-color: var(
            --video-player-caption-color,
            var(--simple-colors-default-theme-grey-1, #111111)
          );
          --a11y-media-bg-color: var(
            --video-player-bg-color,
            var(--simple-colors-default-theme-grey-2, #eeeeee)
          );

          --a11y-media-border-color: var(
            --video-player-border-color,
            var(--simple-colors-default-theme-accent-3, #dddddd)
          );

          --a11y-media-hover-color: var(
            --video-player-hover-color,
            var(--simple-colors-default-theme-accent-12, #000000)
          );

          --a11y-media-hover-bg-color: var(
            --video-player-hover-bg-color,
            var(--simple-colors-default-theme-accent-2, #eeeeee)
          );

          --a11y-media-accent-color: var(
            --video-player-accent-color,
            var(--simple-colors-default-theme-accent-9, #333333)
          );

          --a11y-media-faded-accent-color: var(
            --video-player-faded-accent-color,
            var(--simple-colors-default-theme-accent-8, #444444)
          );

          --a11y-media-disabled-color: var(
            --video-player-disabled-color,
            var(--simple-colors-default-theme-accent-5, #bbbbbb)
          );
        }
      `,
    ];
  }

  // render function
  render() {
    return html`
      ${this.audioDescriptionSource && this.audioDescriptionEnabled
        ? html`
            <audio
              id="audio-description"
              .src="${this.audioDescriptionSource}"
              crossorigin="${this.crossorigin || "anonymous"}"
              style="display: none;"
            ></audio>
          `
        : ``}
      ${this.elementVisible
      ? html`${!this.isA11yMedia
          ? html` <div
                class="responsive-video-container"
                .lang="${this.lang || "en"}"
              >
                ${this.sandboxed
                  ? html``
                  : html` <webview
                      resource="${this.schemaResourceID}-video"
                      .src="${(this.sourceData &&
                        this.sourceData[0] &&
                        this.sourceData[0].src) ||
                      undefined}"
                      .width="${this.width || undefined}"
                      .height="${this.height || undefined}"
                      frameborder="0"
                    >
                    </webview>`}
                ${!(!this.sandboxed && this.iframed)
                  ? html``
                  : html`
                      <iframe
                        loading="lazy"
                        resource="${this.schemaResourceID}-video"
                        .src="${(this.sourceData &&
                          this.sourceData[0] &&
                          this.sourceData[0].src) ||
                        undefined}"
                        width="${this.width}"
                        height="${this.height}"
                        frameborder="0"
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                      ></iframe>
                    `}
              </div>
              <div id="videocaption" class="video-caption">
                <p>
                  ${this.mediaTitle}
                  <span class="media-type print-only"
                    >(${this.t.embeddedMedia})</span
                  >
                </p>
                <slot name="caption"></slot>
              </div>
              <slot hidden></slot>`
          : html` <a11y-media-player
                accent-color="${this.accentColor}"
                ?audio-only="${this.audioOnly}"
                ?dark="${this.dark}"
                ?dark-transcript="${this.darkTranscript}"
                ?disable-interactive="${this.disableInteractive}"
                ?hide-timestamps="${this.hideTimestamps}"
                ?hide-transcript="${this.hideTranscript}"
                ?hide-youtube-link="${this.hideYoutubeLink}"
                id="${this.playerId}"
                @play="${this.playEvent}"
                @restart="${this.restartEvent}"
                @pause="${this.pauseEvent}"
                @audio-description-toggle="${this._handleAudioDescriptionToggle}"
                lang="${this.lang || "en"}"
                ?learning-mode="${this.learningMode}"
                ?linkable="${this.linkable}"
                preload="metadata"
                media-title="${this.mediaTitle || ""}"
                .sources="${this.sourceProperties}"
                ?stand-alone="${this.standAlone}"
                sticky-corner="${this.stickyCorner || "none"}"
                thumbnail-src="${this.thumbnailSrc}"
                .tracks="${this.trackProperties}"
                .crossorigin="${this.crossorigin || "anonymous"}"
                .width="${this.width}"
                .height="${this.height}"
                youtube-id="${this.youtubeId}"
                audio-description-source="${this.audioDescriptionSource}"
                ?audio-description-enabled="${this.audioDescriptionEnabled}"
              >
              </a11y-media-player
              ><slot hidden></slot>`}`
      : ``}`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: {
        min: 50,
        step: 25,
      },
      designSystem: {
        card: true,
      },
      canEditSource: true,
      gizmo: {
        title: "Video",
        description:
          "This can present video in a highly accessible manner regardless of source.",
        icon: "av:play-circle-filled",
        color: "red",
        tags: [
          "Media",
          "Media",
          "youtube",
          "watch",
          "vimeo",
          "twitch",
          "mp4",
          "webm",
          "ogg",
          "video-player",
          "a11y",
          "media-player",
        ],
        handles: [
          {
            type: "video",
            type_exclusive: true,
            source: "source",
            title: "caption",
            caption: "caption",
            description: "caption",
            color: "primaryColor",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
          outlineDesigner: true,
          anchorLabel: "mediaTitle",
        },
      },
      settings: {
        configure: [
          {
            property: "source",
            title: "Source",
            description: "The URL for this media.",
            inputMethod: "haxupload",
            noCamera: true,
            noVoiceRecord: true,
            noScreenRecord: false,
            validationType: "url",
          },
          {
            property: "mediaTitle",
            title: "Title",
            description: "Simple title for under video",
            inputMethod: "textfield",
            validationType: "text",
          },
          {
            property: "thumbnailSrc",
            title: "Poster image",
            description: "The image URL for the poster image.",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            validationType: "url",
          },
        ],
        advanced: [
          {
            property: "tracks",
            title: "Text tracks",
            description:
              "Closed captions, subtitles, descriptions, and other text tracks for the video.",
            inputMethod: "array",
            itemLabel: "label",
            properties: [
              {
                property: "src",
                title: "Track file",
                description: "The URL for the track file (WebVTT format).",
                inputMethod: "haxupload",
                noCamera: true,
                noVoiceRecord: true,
                validationType: "url",
              },
              {
                property: "label",
                title: "Label",
                description:
                  "Label for the track (e.g., 'English', 'Spanish', 'Audio Description').",
                inputMethod: "textfield",
                validationType: "text",
              },
              {
                property: "srclang",
                title: "Language code",
                description:
                  "Two-letter language code (e.g., 'en', 'es', 'fr').",
                inputMethod: "textfield",
                validationType: "text",
              },
              {
                property: "kind",
                title: "Track type",
                description: "The type of text track.",
                inputMethod: "select",
                options: {
                  subtitles: "Subtitles",
                  captions: "Captions",
                  descriptions: "Descriptions",
                  chapters: "Chapters",
                  metadata: "Metadata",
                },
              },
            ],
          },
          {
            property: "startTime",
            title: "Start time",
            description: "Start video at a specific time (seconds)",
            inputMethod: "number",
          },
          {
            property: "endTime",
            title: "End time",
            description:
              "End video at a specific time (seconds), requires a start time.",
            inputMethod: "number",
          },
          {
            property: "learningMode",
            title: "Enable learning mode",
            description: "Disables fast forward and rewind.",
            inputMethod: "boolean",
          },
          {
            property: "hideYoutubeLink",
            title: "Remove open on YouTube button",
            description: "Removes the button for opening the video on YouTube.",
            inputMethod: "boolean",
          },
          {
            property: "linkable",
            title: "Include a share link?",
            description: "Provides a link to share the video.",
            inputMethod: "boolean",
          },
          {
            property: "hideTimestamps",
            title: "Hide timestamps",
            description: "Hide the time stamps on the transcript.",
            inputMethod: "boolean",
          },
          {
            property: "hideTranscript",
            title: "Hide Transcript",
            description: "Hide transcript by default.",
            inputMethod: "boolean",
          },
          {
            property: "audioDescriptionSource",
            title: "Audio Description Track",
            description:
              "URL to an audio description track (MP3 file) that provides narration of visual elements.",
            inputMethod: "haxupload",
            noCamera: true,
            noVoiceRecord: true,
            noScreenRecord: true,
            validationType: "url",
          },
        ],
        developer: [
          {
            property: "crossorigin",
            title: "Crossorigin",
            description: "Indicates whether to use CORS.",
            inputMethod: "select",
            options: {
              "": "",
              anonymous: "anonymous",
              "use-credentials": "use-credentials",
            },
          },
          {
            property: "allowBackgroundPlay",
            title: "Allow background playback",
            description:
              "Videos pause / play automatically when tab loses focus; this enables video to play without tab having focus",
            inputMethod: "boolean",
          },
          {
            property: "darkTranscript",
            title: "Dark theme for transcript",
            description: "Enable dark theme for the transcript.",
            inputMethod: "boolean",
          },
          {
            property: "disableInteractive",
            title: "Disable Interactive",
            description:
              "Disable interactive mode that makes transcript clickable.",
            inputMethod: "boolean",
          },
          {
            property: "lang",
            title: "Language",
            description: "Language of the media.",
            inputMethod: "textfield",
            validationType: "text",
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "(deprecated) Select the accent color for the player.",
            inputMethod: "colorpicker",
          },
        ],
      },
      saveOptions: {
        unsetAttributes: [
          "__utils",
          "__stand-alone",
          "colors",
          "playing",
          "__forcePaused",
          "t",
        ],
      },
      demoSchema: [
        {
          tag: "video-player",
          properties: {
            source: "https://www.youtube.com/watch?v=LrS7dqokTLE",
            "data-width": "75",
            "data-margin": "center",
          },
          content: "",
        },
      ],
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      sourceType: { type: String },
      /**
       * Optional accent color for controls,
       * using these colors:
       * `red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`,
       * `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`,
       * `yellow`, `amber`, orange, deep-orange, and brown.
       * Default is null.
       */
      accentColor: {
        type: String,
        attribute: "accent-color",
        reflect: true,
      },
      /**
       * Cross origin flag for transcripts to load
       */
      crossorigin: {
        type: String,
        attribute: "crossorigin",
        reflect: true,
      },
      /**
       * Enables darker player.
       */
      dark: {
        type: Boolean,
        attribute: "dark",
        reflect: true,
      },
      /**
       * Use dark theme on transcript? Default is false, even when player is dark.
       */
      darkTranscript: {
        type: Boolean,
      },
      /**
       * disable interactive mode that makes transcript clickable
       */
      disableInteractive: {
        type: Boolean,
      },
      /**
       * Height of media player.
       */
      height: {
        type: String,
      },
      /**
       * show cue's start and end time
       */
      hideTimestamps: {
        type: Boolean,
        attribute: "hide-timestamps",
      },
      /**
       * Hide transcript by default
       */
      hideTranscript: {
        type: Boolean,
        reflect: true,
        attribute: "hide-transcript",
      },
      /**
       * Unique id
       */
      id: {
        type: String,
        attribute: "id",
        reflect: true,
      },
      /**
       * Learning mode
       */
      learningMode: {
        type: Boolean,
        attribute: "learning-mode",
      },
      /**
       * Language of media
       */
      lang: {
        type: String,
      },
      /**
       * Include a share link?
       */
      linkable: {
        type: Boolean,
      },
      /**
       * Simple caption for video
       */
      mediaTitle: {
        type: String,
        attribute: "media-title",
        reflect: true,
      },
      /**
       * Open on YouTube button
       */
      hideYoutubeLink: {
        type: Boolean,
        attribute: "hide-youtube-link",
      },
      /**
       * Single sources of video
       */
      source: {
        type: String,
        reflect: true,
      },
      /**
       * Array of multiple video sources
       */
      sources: {
        type: Array,
      },
      sourceData: {
        type: Object,
      },
      /**
       * When playing but scrolled off screen, to which corner does it "stick":
       * `top-left`, `top-right`, `bottom-left`, `bottom-right`, or `none`?
       * Default is `top-right`. `None` disables stickiness.
       */
      stickyCorner: {
        type: String,
        attribute: "sticky-corner",
        reflect: true,
      },
      /**
       * Url for a single subtitle track
       */
      track: {
        type: String,
      },
      /**
       * Array of text tracks, eg. `[{ "src": "path/to/track.vtt", "label": "English", "srclang": "en", "kind": "subtitles", }]`
       */
      tracks: {
        type: Array,
        reflect: true,
        hasChanged(newVal, oldVal) {
          return JSON.stringify(newVal) !== JSON.stringify(oldVal);
        },
      },
      /**
       * Source of optional thumbnail image
       */
      thumbnailSrc: {
        type: String,
        attribute: "thumbnail-src",
        reflect: true,
      },
      /**
       * Width of media player for non-a11y-media.
       */
      width: {
        type: String,
      },
      /**
       * Data reactivity for play status from a11y-media-player
       */
      playing: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Option to allow playing while not active tab
       */
      allowBackgroundPlay: {
        type: Boolean,
        reflect: true,
        attribute: "allow-background-play",
      },
      /**
       * Start time for video
       */
      startTime: {
        type: Number,
        attribute: "start-time",
      },
      /**
       * End time for video
       */
      endTime: {
        type: Number,
        attribute: "end-time",
      },
      /**
       * URL to audio description track (MP3 file)
       */
      audioDescriptionSource: {
        type: String,
        attribute: "audio-description-source",
        reflect: true,
      },
      /**
       * Whether audio description is currently enabled
       */
      audioDescriptionEnabled: {
        type: Boolean,
        attribute: "audio-description-enabled",
        reflect: true,
      },
    };
  }
  /**
   * Store tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "video-player";
  }
  // weird looking but allows for SSR support
  querySelectorAll(query) {
    if (super.query) {
      super.querySelectorAll(query);
    }
    return [];
  }
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.sourceType = "";
    this.crossorigin = "anonymous";
    this.dark = false;
    this.darkTranscript = false;
    this.disableInteractive = false;
    this.hideTimestamps = false;
    this.hideTranscript = false;
    this.hideYoutubeLink = false;
    this.lang = "en";
    this.playing = false;
    this.__setVisChange = false;
    this.allowBackgroundPlay = false;
    this.learningMode = false;
    this.linkable = false;
    this.sources = [];
    this.startTime = null;
    this.endTime = null;
    this.stickyCorner = "none";
    this.tracks = [];
    this.source = "";
    this.audioDescriptionSource = "";
    this.audioDescriptionEnabled = false;
    this.observer.observe(this, {
      childList: true,
      subtree: false,
    });
    this.t = this.t || {};
    this.t = {
      ...this.t,
      embeddedMedia: "embedded media",
      gizmoTitle: "Video",
      gizmoDescription:
        "This can present video in a highly accessible manner regardless of source.",
      tagAudioVideo: "Media",
      tagMedia: "Media",
      sourceTitle: "Source",
      sourceDescription: "The URL for this media.",
      titleTitle: "Title",
      titleDescription: "Simple title for under video",
      thumbnailTitle: "Thumbnail image",
      thumbnailDescription: "The URL for a thumbnail/poster image.",
      textTracksTitle: "Text tracks",
      textTracksDescription:
        "Closed captions, subtitles, descriptions, and other text tracks for the video.",
      trackFileTitle: "Track file",
      trackFileDescription: "The URL for the track file (WebVTT format).",
      trackLabelTitle: "Label",
      trackLabelDescription:
        "Label for the track (e.g., 'English', 'Spanish', 'Audio Description').",
      trackLanguageCodeTitle: "Language code",
      trackLanguageCodeDescription:
        "Two-letter language code (e.g., 'en', 'es', 'fr').",
      trackTypeTitle: "Track type",
      trackTypeDescription: "The type of text track.",
      trackTypeSubtitles: "Subtitles",
      trackTypeCaptions: "Captions",
      trackTypeDescriptions: "Descriptions",
      trackTypeChapters: "Chapters",
      trackTypeMetadata: "Metadata",
      startTimeTitle: "Start time",
      startTimeDescription: "Start video at a specific time (seconds)",
      endTimeTitle: "End time",
      endTimeDescription:
        "End video at a specific time (seconds), requires a start time.",
      learningModeTitle: "Enable learning mode",
      learningModeDescription: "Disables fast forward and rewind.",
      hideYoutubeLinkTitle: "Remove open on YouTube button",
      hideYoutubeLinkDescription:
        "Removes the button for opening the video on YouTube.",
      linkableTitle: "Include a share link?",
      linkableDescription: "Provides a link to share the video.",
      hideTimestampsTitle: "Hide timestamps",
      hideTimestampsDescription: "Hide the time stamps on the transcript.",
      hideTranscriptTitle: "Hide Transcript",
      hideTranscriptDescription: "Hide transcript by default.",
      crossoriginTitle: "Crossorigin",
      crossoriginDescription: "Indicates whether to use CORS.",
      allowBackgroundPlayTitle: "Allow background playback",
      allowBackgroundPlayDescription:
        "Videos pause / play automatically when tab loses focus; this enables video to play without tab having focus",
      darkTranscriptTitle: "Dark theme for transcript",
      darkTranscriptDescription: "Enable dark theme for the transcript.",
      disableInteractiveTitle: "Disable Interactive",
      disableInteractiveDescription:
        "Disable interactive mode that makes transcript clickable.",
      languageTitle: "Language",
      languageDescription: "Language of the media.",
      accentColorTitle: "Accent color",
      accentColorDescription:
        "(deprecated) Select the accent color for the player.",
      copyTimecodeLabel: "Copy current timecode",
      englishLabel: "English",
      audioDescriptionLabel: "Audio Description",
      audioDescriptionTitle: "Audio Description Track",
      audioDescriptionDescription:
        "URL to an audio description track (MP3 file) that provides narration of visual elements.",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/video-player.es.json", import.meta.url).href +
        "/../",
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (this.__setVisChange) {
      this.__setVisChange = false;
      this.windowControllers.abort();
    }
    if (this.__adVolumeHandler) {
      globalThis.removeEventListener("volume-changed", this.__adVolumeHandler);
      this.__adVolumeHandler = null;
    }
    if (this.__adRateHandler) {
      globalThis.removeEventListener("playback-rate-changed", this.__adRateHandler);
      this.__adRateHandler = null;
    }
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    super.disconnectedCallback();
  }
  /**
   * gets the HTML5 `audio` or `video` children
   * @readonly
   * @returns {object} HTML template
   */
  get html5() {
    return html`
      ${this.sourceData
        .filter((item) => item.type !== "youtube")
        .map((sd) => {
          html`
            <source
              .src="${sd.src || undefined}"
              .type="${sd.type || undefined}"
            />
          `;
        })}
      ${this.trackData.map((track) => {
        `<track
           .src="${track.src || undefined}"
           .kind="${track.kind || undefined}"
           .label="${track.label || undefined}"
           .srclang="${track.lang || undefined}"
         />`;
      })}
    `;
  }

  /**
   * Computes whether uses iframe
   * @readonly
   * @returns {Boolean}
   */
  get iframed() {
    // make sure we take into account sandboxing as well
    // so that we can manage state effectively
    if (
      this.sourceData &&
      this.sourceData.length > 0 &&
      this.sourceData[0] !== undefined &&
      globalThis.MediaBehaviors.Video._sourceIsIframe(this.sourceData[0].src) &&
      !this.sandboxed
    ) {
      return true;
    }
    return false;
  }

  /**
   * Determines if compatible with `a11y-media-player`
   * @readonly
   * @returns {Boolean}
   */
  get isA11yMedia() {
    if (
      !this.sandboxed &&
      (this.sourceType == "youtube" ||
        this.sourceType == "local" ||
        this.sourceData.length < 1)
    ) {
      return true;
    }
    return false;
  }
  /**
   * mutation observer for tabs
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this.setSourceData();
    return new MutationObserver(callback);
  }

  /**
   * Compute sandboxed status
   * @readonly
   * @returns {Boolean}
   */
  get sandboxed() {
    // we have something that would require an iframe
    // see if we have a local system that would want to sandbox instead
    if (
      this.sourceData &&
      this.sourceData.length > 0 &&
      typeof this.sourceData[0] !== undefined &&
      globalThis.MediaBehaviors.Video._sourceIsIframe(this.sourceData[0].src)
    ) {
      // fake creation of a webview element to see if it's valid
      // or not.
      let test = globalThis.document.createElement("webview");
      // if this function exists it means that our deploy target
      // is in a sandboxed environment and is not able to run iframe
      // content with any real stability. This is beyond edge case but
      // as this is an incredibly useful tag we want to make sure it
      // can mutate to work in chromium and android environments
      // which support such sandboxing
      if (typeof test.reload === "function") {
        return true;
      }
    }
    return false;
  }
  /**
   * Gets cleaned source list from source and sources properties
   * @readonly
   * @returns {Array} Eg. `[{ "src": "path/to/media.mp3", "type": "audio/mp3"}]`
   */
  get sourceProperties() {
    let temp =
      typeof this.sources === "string"
        ? JSON.parse(this.sources)
        : (this.sources || []).slice();
    if (this.source) temp.unshift({ src: this.source });
    if (temp && temp.length > 0)
      temp.forEach((item) => {
        item.type = item.type || this._computeMediaType(item.src);
        item.src = this._computeSRC(item.src, item.type);
      });
    return temp;
  }

  /**
   * Gets cleaned track list from track and tracks properties
   * @readonly
   * @returns {Array} Eg. `[{ "src": "path/to/track.vtt", "label": "English", "srclang": "en", "kind": "subtitles"}]`
   */
  get trackProperties() {
    let temp =
      typeof this.tracks === "string"
        ? JSON.parse(this.tracks)
        : (this.tracks || []).slice();
    if (this.track) temp.unshift({ src: this.track });
    if (temp && temp.length > 0)
      temp.forEach((item) => {
        item.srclang = item.srclang || this.lang;
        item.kind = item.kind || "subtitles";
        item.label = item.label || item.kind || item.lang;
      });
    return temp;
  }

  /**
   * Source properties and slotted sources
   * @readonly
   * @returns {Array} List of source objects
   */
  get sourceData() {
    let temp = (this.sourceProperties || []).slice(),
      slotted = this.querySelectorAll("video source, audio source, iframe");
    slotted.forEach((slot) => {
      if (this.sources.filter((source) => source.src === slot.src).length < 1)
        this.sources.unshift({
          src: slot.src,
          type: slot.type || this._computeMediaType(slot.src),
        });
    });
    return temp;
  }

  get audioOnly() {
    let videos = this.sourceData.filter(
      (item) => item.type.indexOf("audio") > -1,
    );
    return videos.length > 1;
  }

  get standAlone() {
    return (
      this.trackData === undefined ||
      this.trackData === null ||
      this.trackData.length < 1
    );
  }

  /**
   * Gets cleaned track list
   * @readonly
   * @returns {Array} Eg. `[{ "src": "path/to/track.vtt", "label": "English", "srclang": "en", "kind": "subtitles",}]`
   */
  get trackData() {
    let temp =
        typeof this.tracks === "string"
          ? (JSON.parse(this.tracks) || []).slice()
          : (this.tracks || []).slice(),
      slotted = this.querySelectorAll("video track, audio track");
    slotted.forEach((slot) => {
      if (this.tracks.filter((track) => track.src === slot.src).length < 1) {
        let track = { src: slot.src };
        if (slot.lang) track.lang = slot.lang;
        if (slot.srclang) track.srclang = slot.srclang;
        if (slot.label) track.label = slot.label;
        if (slot.kind) track.kind = slot.kind;
        this.tracks.unshift(track);
      }
      slot.remove();
    });
    if (this.track !== undefined && this.track !== null && this.track !== "")
      temp.push({
        src: this.track,
        srclang: this.lang,
        label: this.lang === "en" ? this.t.englishLabel : this.lang,
        kind: "subtitles",
      });
    return temp;
  }

  /**
   * Gets Youtube ID from source string
   * @readonly
   * @returns {String}
   */
  get youtubeId() {
    if (
      this.sourceData &&
      this.sourceData[0] &&
      this.sourceType === "youtube"
    ) {
      return this._computeSRC(this.sourceData[0].src).replace(
        /.*\/embed\//,
        "",
      );
    }
    return;
  }

  /**
   * gets an id for a11y-media-player
   * @readonly
   * @returns {string} an id for player
   */
  get playerId() {
    return `${this.id || this.schemaResourceID}-media`;
  }

  /**
   * Compute media type based on source, i.e. 'audio/wav' for '.wav'
   */
  _computeMediaType(source) {
    let audio = ["aac", "flac", "mp3", "oga", "wav"],
      video = ["mov", "mp4", "ogv", "webm"],
      type = "",
      findType = (text, data) => {
        data.forEach((item) => {
          if (
            type === "" &&
            typeof source !== undefined &&
            source !== null &&
            source.toLowerCase().indexOf("." + item) > -1
          ) {
            type = text + "/" + item;
          }
        });
      };
    findType("audio", audio);
    findType("video", video);
    return type;
  }

  /**
   * Compute src from type / source combo.
   * Type is set by source so this ensures a waterfall
   * of valid values.
   */
  _computeSRC(source, type) {
    if (source !== null && typeof source !== undefined) {
      // ensure that this is a valid url / cleaned up a bit
      type = type || globalThis.MediaBehaviors.Video.getVideoType(source);
      source = globalThis.MediaBehaviors.Video.cleanVideoSource(source, type);
      if (type == "vimeo") {
        if (this.vimeoTitle) {
          source += "?title=1";
        } else {
          source += "?title=0";
        }
        if (this.vimeoByline) {
          source += "&byline=1";
        } else {
          source += "&byline=0";
        }
        if (this.vimeoPortrait) {
          source += "&portrait=1";
        } else {
          source += "&portrait=0";
        }
      } else if (type == "twitch") {
        // required for origin matching when doing iframe embed
        if (source.indexOf("?") > -1) {
          source += "&parent=" + globalThis.location.hostname;
        } else {
          source += "?parent=" + globalThis.location.hostname;
        }
      } else if (type == "youtube" && !this.startTime) {
        let timestamp = this.source.split("t=");
        if (timestamp.length > 1) {
          this.startTime = timestamp[1];
        }
      }
    }
    return source;
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      postProcessNodeToContent: "haxpostProcessNodeToContent",
      inlineContextMenu: "haxinlineContextMenu",
    };
  }

  /**
   * add buttons when it is in context
   */
  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "hax:anchor",
        callback: "haxClickTimeCode",
        label: this.t.copyTimecodeLabel,
      },
    ];
  }
  haxClickTimeCode(e) {
    this.pause();
    copyToClipboard(parseInt(this.currentTime));
    return true;
  }
  /**
   * postProcesshaxNodeToContent - clean up so we don't have empty array data
   */
  haxpostProcessNodeToContent(content) {
    content = content.replace(' sources="[]",', "");
    content = content.replace(' tracks="[]",', "");
    return content;
  }
  /**
   * triggers an update of sourceData property when slot changes
   *
   * @memberof VideoPlayer
   */
  setSourceData() {
    let temp = this.source;
    this.source = "";
    this.source = temp;
    // set source type based on available data
    if (
      this.sourceData &&
      this.sourceData.length > 0 &&
      this.sourceData[0] !== undefined &&
      typeof this.sourceData[0].src !== typeof undefined
    ) {
      this.sourceType = globalThis.MediaBehaviors.Video.getVideoType(
        this.sourceData[0].src,
      );
    }
  }
  playEvent(e) {
    this.playing = e.detail.__playing;
    // time stamp found
    if (this.playing && this.startTime) {
      if (!this.__hasPlayed) {
        this.seek(this.startTime);
        this.endTimeTest();
        this.__hasPlayed = true;
      }
    }
  }
  pauseEvent(e) {
    this.playing = e.detail.__playing;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      // hack to account for poor state management prior to and then source type switches on the fly
      if (
        propName === "source" &&
        this.sourceType &&
        typeof oldValue !== typeof undefined &&
        this.sourceData &&
        this.sourceData[0]
      ) {
        let type = globalThis.MediaBehaviors.Video.getVideoType(
          this.sourceData[0].src,
        );
        if (type != this.sourceType) {
          this.sourceType = type;
          if (this.elementVisible) {
            this.elementVisible = false;
            setTimeout(() => {
              this.elementVisible = true;
            }, 0);
          }
        }
      }
      
      // Setup audio description sync when enabled changes
      if (propName === "audioDescriptionEnabled" && this.audioDescriptionSource) {
        if (this.audioDescriptionEnabled) {
          // Wait for next render cycle to ensure audio element exists
          setTimeout(() => {
            this._setupAudioDescriptionSync();
            // If video is currently playing, start audio too
            const audioElement = this.shadowRoot
              ? this.shadowRoot.querySelector("#audio-description")
              : null;
            if (audioElement && this.playing) {
              audioElement.currentTime = this.currentTime;
              audioElement.play();
            }
          }, 0);
        } else {
          // Stop audio and cleanup
          const audioElement = this.shadowRoot
            ? this.shadowRoot.querySelector("#audio-description")
            : null;
          if (audioElement) {
            audioElement.pause();
          }
          
          // Restore video audio
          const mediaPlayer = this.shadowRoot
            ? this.shadowRoot.querySelector("a11y-media-player")
            : null;
          if (mediaPlayer && mediaPlayer.media) {
            mediaPlayer.media.muted = false;
            if (mediaPlayer.volume !== undefined) {
              mediaPlayer.media.volume = mediaPlayer.volume / 100;
            }
          }
          
          // Clean up volume listener
          if (this.__adVolumeHandler) {
            globalThis.removeEventListener("volume-changed", this.__adVolumeHandler);
            this.__adVolumeHandler = null;
          }

          // Clean up playback-rate listener
          if (this.__adRateHandler) {
            globalThis.removeEventListener("playback-rate-changed", this.__adRateHandler);
            this.__adRateHandler = null;
          }
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
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName === "allowBackgroundPlay" &&
        this[propName] &&
        this.__setVisChange
      ) {
        this.__setVisChange = false;
        this.windowControllers.abort();
      } else if (
        propName === "allowBackgroundPlay" &&
        !this[propName] &&
        !this.__setVisChange
      ) {
        this.__setVisChange = true;
        this.windowControllers = new AbortController();
        globalThis.document.addEventListener(
          "visibilitychange",
          this._visChange.bind(this),
          { signal: this.windowControllers.signal },
        );
      }
    });

    // set source type based on available data
    if (
      this.sourceData &&
      this.sourceData.length > 0 &&
      this.sourceData[0] !== undefined &&
      typeof this.sourceData[0].src !== typeof undefined
    ) {
      this.sourceType = globalThis.MediaBehaviors.Video.getVideoType(
        this.sourceData[0].src,
      );
    }

    // setup audio description if source is present
    if (this.audioDescriptionSource) {
      this._loadAudioDescriptionPreference();
    }
  }
  /**
   * mapping down into the shadowRoot element bc these are common things to want to know
   */
  get currentTime() {
    if (this.shadowRoot) {
      return this.shadowRoot.querySelector("a11y-media-player").currentTime;
    }
    return 0;
  }
  restart() {
    this.pause();
    if (this.startTime) {
      this.seek(this.startTime);
      this.endTimeTest();
    } else {
      this.seek(0);
    }
    this.play();
  }
  restartEvent() {
    if (this.startTime) {
      this.seek(this.startTime);
      this.endTimeTest();
    }
  }
  pause() {
    if (
      this.shadowRoot &&
      this.shadowRoot.querySelector("a11y-media-player").__playing
    ) {
      this.shadowRoot.querySelector("a11y-media-player").pause();
    }
  }
  play() {
    if (
      this.shadowRoot &&
      !this.shadowRoot.querySelector("a11y-media-player").__playing
    ) {
      this.shadowRoot.querySelector("a11y-media-player").play();
    }
  }
  seek(time) {
    if (this.shadowRoot) {
      if (!this.shadowRoot.querySelector("a11y-media-player").__playing) {
        this.play();
      }
      setTimeout(() => {
        this.shadowRoot.querySelector("a11y-media-player").seek(parseInt(time));
      }, 0);
    }
  }
  // end timer needs to be handled in a special way so we don't flood listeners
  // or run forever
  endTimeTest() {
    if (this.endTime && !this.__endTimerTest) {
      // we are playing and have an endtime so we need to listen
      // to see when we should pause the video
      // this helps ensure we are not even listener flooding
      // or getting stuck in really bad loops that kill performance
      // for this one feature
      this.__endTimerTest = true;
      setTimeout(() => {
        this.__endTimeInterval = setInterval(() => {
          if (parseInt(this.currentTime) >= parseInt(this.endTime)) {
            this.pause();
            this.__endTimerTest = false;
            clearInterval(this.__endTimeInterval);
          }
          // if we stop playing we need to clear regardless
          if (!this.playing) {
            this.__endTimerTest = false;
            clearInterval(this.__endTimeInterval);
          }
        }, 1000);
      }, 1000);
    }
  }
  _visChange(e) {
    setTimeout(() => {
      if (
        globalThis.document.visibilityState === "visible" &&
        !this.playing &&
        this.__forcePaused
      ) {
        this.__forcePaused = false;
        // resume the video bc it has focus and we stopped it playing previously
        this.shadowRoot.querySelector("a11y-media-player").togglePlay();
      } else if (document.visibilityState === "hidden" && this.playing) {
        // force pause the video; we're in learning mode and they swtiched tabs
        this.__forcePaused = true;
        this.shadowRoot.querySelector("a11y-media-player").togglePlay();
      } else {
        this.__forcePaused = false;
      }
    }, 500);
  }

  /**
   * Load audio description preference from localStorage
   */
  _loadAudioDescriptionPreference() {
    if (this.source && this.audioDescriptionSource) {
      const key = `video-player-ad-${this.source}`;
      const stored = globalThis.localStorage.getItem(key);
      if (stored !== null) {
        this.audioDescriptionEnabled = stored === "true";
      }
    }
  }

  /**
   * Save audio description preference to localStorage
   */
  _saveAudioDescriptionPreference() {
    if (this.source && this.audioDescriptionSource) {
      const key = `video-player-ad-${this.source}`;
      // Coerce to a boolean so we never call toString on null/undefined
      const enabled = !!this.audioDescriptionEnabled;
      globalThis.localStorage.setItem(key, enabled.toString());
    }
  }

  /**
   * Setup audio description sync with video playback
   */
  _setupAudioDescriptionSync() {
    if (!this.shadowRoot) return;

    const mediaPlayer = this.shadowRoot.querySelector("a11y-media-player");
    const audioElement = this.shadowRoot.querySelector("#audio-description");

    if (!mediaPlayer || !audioElement) return;

    // Remove any existing handlers so we don't double-bind when toggling
    if (this.__adPlayHandler) {
      mediaPlayer.removeEventListener("play", this.__adPlayHandler);
    }
    if (this.__adPauseHandler) {
      mediaPlayer.removeEventListener("pause", this.__adPauseHandler);
    }
    if (this.__adRestartHandler) {
      mediaPlayer.removeEventListener("restart", this.__adRestartHandler);
    }
    if (this.__adSeekHandler) {
      mediaPlayer.removeEventListener("seek", this.__adSeekHandler);
    }

    // Set default volume for audio description (match current player volume)
    if (mediaPlayer.volume !== undefined) {
      audioElement.volume = mediaPlayer.volume / 100;
    } else {
      audioElement.volume = 1.0;
    }

    // Set initial playback rate for audio description to match media
    if (mediaPlayer.media && mediaPlayer.media.playbackRate) {
      audioElement.playbackRate = mediaPlayer.media.playbackRate;
    } else {
      audioElement.playbackRate = 1.0;
    }

    // Mute the video audio when audio description is active. We only
    // toggle the muted flag so that the underlying volume state stays
    // consistent with the player's volume slider. The audio description
    // track gets its own volume based on the player's volume.
    if (mediaPlayer.media) {
      mediaPlayer.media.muted = true;
    }

    // Store event handler references for cleanup
    this.__adPlayHandler = () => {
      if (this.audioDescriptionEnabled && audioElement) {
        // Re‑assert mute on the primary media in case something else
        // changed it while audio description is active.
        if (mediaPlayer.media) {
          mediaPlayer.media.muted = true;
        }
        audioElement.currentTime = this.currentTime;
        audioElement.play().catch(() => {});
      }
    };

    this.__adPauseHandler = () => {
      if (audioElement) {
        audioElement.pause();
      }
    };

    this.__adRestartHandler = () => {
      if (audioElement) {
        audioElement.currentTime = 0;
        if (this.playing) {
          audioElement.play().catch(() => {});
        }
      }
    };

    // Keep audio description in sync when the user seeks
    this.__adSeekHandler = () => {
      if (this.audioDescriptionEnabled && audioElement) {
        // Ensure the primary media stays muted after seek operations so
        // we don't leak the original audio under the description track.
        if (mediaPlayer.media) {
          mediaPlayer.media.muted = true;
        }
        audioElement.currentTime = this.currentTime;
        if (this.playing) {
          audioElement.play().catch(() => {});
        }
      }
    };

    // Listen for play, pause, restart, and seek events
    mediaPlayer.addEventListener("play", this.__adPlayHandler);
    mediaPlayer.addEventListener("pause", this.__adPauseHandler);
    mediaPlayer.addEventListener("restart", this.__adRestartHandler);
    mediaPlayer.addEventListener("seek", this.__adSeekHandler);

    // Listen for volume changes and sync to audio description
    this.__adVolumeHandler = (e) => {
      if (
        this.audioDescriptionEnabled &&
        audioElement &&
        e.detail &&
        e.detail.volume !== undefined
      ) {
        // When audio description is active, sync volume to audio track
        audioElement.volume = e.detail.volume / 100;
      }
    };
    globalThis.addEventListener("volume-changed", this.__adVolumeHandler);

    // Listen for playback-rate changes and sync speed to audio description
    this.__adRateHandler = (e) => {
      // e.detail is the a11y-media-player instance
      const player = e && e.detail ? e.detail : null;
      const rate = player && player.media && player.media.playbackRate
        ? player.media.playbackRate
        : 1;
      if (this.audioDescriptionEnabled && audioElement) {
        audioElement.playbackRate = rate;
      }
    };
    globalThis.addEventListener("playback-rate-changed", this.__adRateHandler);
  }

  /**
   * Toggle audio description on/off
   */
  toggleAudioDescription() {
    this.audioDescriptionEnabled = !this.audioDescriptionEnabled;
    this._saveAudioDescriptionPreference();

    const audioElement = this.shadowRoot
      ? this.shadowRoot.querySelector("#audio-description")
      : null;

    if (audioElement) {
      if (this.audioDescriptionEnabled) {
        // Sync to current time and play if video is playing
        audioElement.currentTime = this.currentTime;
        if (this.playing) {
          audioElement.play();
        }
      } else {
        audioElement.pause();
      }
    }
  }

  /**
   * Handle audio description toggle from settings checkbox
   */
  _handleAudioDescriptionToggle(e) {
    this.audioDescriptionEnabled = e.detail.audioDescriptionEnabled;
    this._saveAudioDescriptionPreference();
  }
}
globalThis.customElements.define(VideoPlayer.tag, VideoPlayer);
export { VideoPlayer };
