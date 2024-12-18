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
            var(--simple-colors-default-theme-grey-2, #eeeeee)
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
    return html` ${this.elementVisible
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
                @pause="${this.pauseEvent}"
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
        primary: true,
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
          "Audio / Video",
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
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color for the player.",
            inputMethod: "colorpicker",
          },
          {
            property: "track",
            title: "Closed captions",
            description: "The URL for the captions file.",
            inputMethod: "haxupload",
            noCamera: true,
            noVoiceRecord: true,
            validationType: "url",
          },
        ],
        advanced: [
          {
            property: "thumbnailSrc",
            title: "Thumbnail image",
            description: "Optional. The URL for a thumbnail/poster image.",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            validationType: "url",
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
            property: "lang",
            title: "Language",
            description: "Language of the media.",
            inputMethod: "textfield",
            validationType: "text",
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
    this.stickyCorner = "none";
    this.tracks = [];
    this.source = "";
    this.observer.observe(this, {
      childList: true,
      subtree: false,
    });
    this.t = this.t || {};
    this.t = {
      ...this.t,
      embeddedMedia: "embedded media",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/video-player.es.json", import.meta.url).href +
        "/../",
      locales: ["es"],
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
        label: this.lang === "en" ? "English" : this.lang,
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
        label: "Copy current timecode",
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
        typeof oldValue !== typeof undefined
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
    this.seek(0);
    this.play();
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
}
customElements.define(VideoPlayer.tag, VideoPlayer);
export { VideoPlayer };
