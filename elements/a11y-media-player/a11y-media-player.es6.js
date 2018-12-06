import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{A11yMediaPlayerProperties}from"./lib/a11y-media-player-properties.js";import"./node_modules/@polymer/paper-slider/paper-slider.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icons/av-icons.js";import"./lib/screenfull-lib.js";import"./lib/a11y-media-controls.js";import"./lib/a11y-media-loader.js";import"./lib/a11y-media-play-button.js";import"./lib/a11y-media-transcript.js";import"./lib/a11y-media-transcript-controls.js";import"./lib/a11y-media-utility.js";import"./lib/a11y-media-youtube-utility.js";export{A11yMediaPlayer};class A11yMediaPlayer extends A11yMediaPlayerProperties{static get tag(){return"a11y-media-player"}static get properties(){return{mediaCaption:{type:String,computed:"_getMediaCaption(audioOnly,audioLabel,mediaTitle)"},printCaption:{type:String,computed:"_getPrintCaption(audioOnly,audioLabel,videoLabel,mediaTitle)"},sticky:{type:Boolean,value:!1,reflectToAttribute:!0},stickyCorner:{type:String,value:"top-right",reflectToAttribute:!0}}}static get behaviors(){return[A11yMediaPlayerProperties]}static get template(){return html`
      <style is="custom-style" include="simple-colors">
        :host {
          width: 100%;
          display: block;
          color: var(--simple-colors-default-theme-grey-12);
          background-color: var(--simple-colors-default-theme-grey-2);
          outline: 1px solid var(--simple-colors-default-theme-grey-3);
        }
        :host([dark]) {
          outline: 1px solid var(--simple-colors-default-theme-grey-1);
        }
        :host #outerplayer,
        :host #outerplayer * {
          --a11y-media-color: var(--simple-colors-default-theme-grey-11);
          --a11y-media-bg-color: var(--simple-colors-default-theme-grey-2);
          --a11y-media-hover-color: var(--simple-colors-default-theme-grey-12);
          --a11y-media-hover-bg-color: var(
            --simple-colors-default-theme-grey-2
          );
          --a11y-media-accent-color: var(
            --simple-colors-default-theme-accent-9
          );
          --a11y-media-faded-accent-color: var(
            --simple-colors-default-theme-accent-8
          );

          /* settings */
          --a11y-media-settings-menu-color: var(--a11y-media-color);
          --a11y-media-settings-menu-bg-color: var(--a11y-media-bg-color);
          --a11y-media-settings-menu-hover-color: var(--a11y-media-hover-color);
          --a11y-media-settings-menu-hover-bg-color: var(
            --a11y-media-hover-bg-color
          );

          /* buttons */
          --a11y-media-button-color: var(--a11y-media-color);
          --a11y-media-button-bg-color: var(--a11y-media-bg-color);
          --a11y-media-button-hover-color: var(--a11y-media-accent-color);
          --a11y-media-button-hover-bg-color: var(--a11y-media-hover-bg-color);
          --a11y-media-button-toggle-color: var(
            --a11y-media-faded-accent-color
          );

          /* toggle button */
          --paper-toggle-button-unchecked-bar-color: var(--a11y-media-color);
          --paper-toggle-button-unchecked-button-color: var(--a11y-media-color);
          --paper-toggle-button-checked-bar-color: var(
            --a11y-media-accent-color
          );
          --paper-toggle-button-checked-button-color: var(
            --a11y-media-accent-color
          );

          /* slider */
          --paper-slider-active-color: var(--a11y-media-accent-color);
          --paper-slider-secondary-color: var(--a11y-media-faded-accent-color);
          --paper-slider-pin-color: var(--a11y-media-faded-bg-color);
          --paper-slider-pin-start-color: var(--a11y-media-faded-bg-color);
          --paper-slider-pin-end-color: var(--a11y-media-faded-bg-color);
          --paper-slider-knob-color: var(--a11y-media-accent-color);
          --paper-slider-knob-start-color: var(--a11y-media-bg-color);
          --paper-slider-knob-end-color: var(--a11y-media-bg-color);
          --paper-slider-knob-border-color: var(--a11y-media-accent-color);
          --paper-slider-knob-start-border-color: var(--a11y-media-bg-color);
          --paper-slider-knob-end-border-color: var(--a11y-media-bg-color);
        }
        :host #outertranscript,
        :host #outertranscript *,
        :host #transcript {
          --a11y-media-transcript-color: var(
            --simple-colors-default-theme-grey-12
          );
          --a11y-media-transcript-bg-color: var(
            --simple-colors-default-theme-grey-1
          );
          --a11y-media-transcript-accent-color: var(
            --simple-colors-default-theme-accent-8
          );
          --a11y-media-transcript-faded-accent-color: var(
            --simple-colors-default-theme-accent-10
          );
          --a11y-media-transcript-active-cue-color: var(
            --simple-colors-default-theme-grey-12
          );
          --a11y-media-transcript-active-cue-bg-color: var(
            --simple-colors-default-theme-accent-1
          );
          --a11y-media-transcript-focused-cue-color: var(
            --simple-colors-default-theme-grey-12
          );
          --a11y-media-transcript-focused-cue-bg-color: var(
            --simple-colors-default-theme-grey-2
          );
          --a11y-media-transcript-match-color: var(
            --simple-colors-default-theme-grey-1
          );
          --a11y-media-transcript-match-bg-color: var(
            --simple-colors-default-theme-accent-10
          );
          --a11y-media-transcript-match-border-color: var(
            --simple-colors-default-theme-accent-12
          );
          --a11y-media-hover-color: var(--simple-colors-default-theme-grey-12);
          --a11y-media-hover-bg-color: var(
            --simple-colors-default-theme-grey-2
          );
        }
        :host([dark-transcript]) #outertranscript,
        :host([dark-transcript]) #outertranscript *,
        :host([dark-transcript]) #transcript {
          --a11y-media-transcript-active-cue-color: var(
            --simple-colors-default-theme-accent-10
          );
          --a11y-media-transcript-active-cue-bg-color: var(
            --simple-colors-default-theme-grey-1
          );
        }
        :host #player {
          display: block;
          max-width: 100%;
          transition: position 0.5s ease, max-width 1s ease;
          background-color: var(--simple-colors-default-theme-grey-2);
        }
        :host #innerplayer {
          z-index: 1;
        }
        :host #outeraudiocc:not([hidden]) {
          display: flex;
          align-items: center;
          padding: 5px 16px;
          min-height: 4em;
          transition: all 0.5s;
        }
        :host #sources {
          display: flex;
          align-items: stretch;
          position: relative;
        }
        :host([no-height]) #sources {
          display: none;
        }
        :host #controls,
        :host #slider,
        :host #sources,
        :host #sources > * {
          width: 100%;
        }
        :host #loader,
        :host #youtube,
        :host #customcc,
        :host #customcctxt {
          position: absolute;
          top: 0;
          left: 0;
        }
        :host #youtube {
          height: 100%;
        }
        :host #customcc {
          font-size: 20px;
          width: 100%;
          height: 100%;
          transition: font-size 0.25s;
        }
        :host([responsive-size*="lg"]) #customcc {
          font-size: 14px;
        }
        :host([responsive-size*="md"]) #customcc {
          font-size: 14px;
        }
        :host([responsive-size*="sm"]) #customcc {
          font-size: 12px;
        }
        :host([responsive-size*="xs"]) #customcc {
          font-size: 10px;
        }
        :host([sticky]:not([sticky-corner="none"])) #customcc {
          display: none;
        }
        :host #customcctxt:not(:empty) {
          top: unset;
          bottom: 8px;
          display: inline-block;
          margin: 0 10px;
          color: white;
          background-color: black;
          background-color: rgba(0, 0, 0, 0.8);
          padding: 0.15em 4px;
        }
        :host #innerplayer,
        :host #sources > * {
          max-height: 80vh;
        }
        :host #controls,
        :host #slider {
          z-index: 2 !important;
        }
        :host #audio-only {
          text-align: center;
          font-style: italic;
          width: 100%;
          line-height: 160%;
        }
        :host .media-caption:not(:empty) {
          padding: 5px 15px;
        }
        :host #printthumb {
          width: 100%;
          margin: 0;
          display: block;
          border-top: 1px solid #aaaaaa;
        }
        :host .sr-only {
          position: absolute;
          left: -9999px;
          font-size: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        @media screen {
          :host #printthumb {
            display: none;
          }
          :host([flex-layout]:not([responsive-size*="s"])) {
            display: inline-flex;
            align-items: stretch;
            outline: 1px solid;
            color: var(--simple-colors-default-theme-grey-12);
            background-color: var(--simple-colors-default-theme-grey-2);
            outline-color: var(--simple-colors-default-theme-grey-3);
            padding: 0;
          }
          :host([dark][flex-layout]:not([responsive-size*="s"])) {
            outline-color: var(--simple-colors-default-theme-grey-1);
          }
          :host > div {
            transition: all 0.5s;
          }
          :host([sticky]:not([sticky-corner="none"])) #player {
            position: fixed;
            top: 5px;
            right: 5px;
            width: 200px;
            max-width: 200px;
            z-index: 999999;
            border: 1px solid;
            box-shadow: 1px 1px 20px 1px rgba(125, 125, 125);
            border-radius: 3.2px;
            border-color: var(--a11y-media-bg-color);
          }
          :host([dark][sticky]:not([sticky-corner="none"])) #player {
            border-color: var(--a11y-media-bg-color);
          }
          :host([sticky][sticky-corner="top-left"]) #player {
            right: unset;
            left: 5px;
          }
          :host([flex-layout]:not([responsive-size*="s"])) > div {
            width: 50%;
            flex-grow: 1;
            flex-shrink: 1;
          }
          :host #innertranscript {
            position: relative;
            height: 100%;
          }
          :host([hide-transcript]) #outerplayer {
            min-width: 50%;
            max-width: 100%;
          }
          :host([hide-transcript]) #outertranscript {
            display: none;
          }
          :host #transcript {
            padding-top: 48px;
          }
          :host(:not([no-height]):not([stacked-layout]):not([responsive-size*="s"]))
            #transcript {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: scroll;
          }
          :host(:not([no-height]):not([stacked-layout]):not([responsive-size*="s"]))
            #player.totop {
            position: absolute;
            top: 0;
            left: 0;
            width: 200px !important;
            z-index: 9999;
          }
          :host #tcontrols {
            z-index: 1000;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            display: flex;
          }
          :host([sticky][sticky-corner="bottom-left"]) #player {
            top: unset;
            right: unset;
            bottom: 5px;
          }
          :host([sticky][sticky-corner="bottom-right"]) #player {
            top: unset;
            bottom: 5px;
          }
          :host([sticky]:not([sticky-corner="none"]):not([no-height]):not([stacked-layout]):not([responsive-size*="s"]))
            #controls {
            display: none;
          }
          :host .print-only {
            display: none;
          }
          :host .media-caption {
            color: var(--simple-colors-default-theme-grey-1);
            background-color: var(--simple-colors-default-theme-accent-10);
          }
        }

        @media print {
          :host,
          :host([dark]) {
            outline: 1px solid #aaaaaa;
            background-color: #ffffff;
          }
          :host([sticky]:not([sticky-corner="none"])) #outerplayer {
            height: unset !important;
          }
          :host .screen-only,
          :host #player,
          :host #outeraudiocc,
          :host #printthumb:not([src]) {
            display: none;
          }
          :host(:not([thumbnail-src])) #sources,
          :host #slider,
          :host #loader,
          :host #youtube,
          :host #controls {
            display: none;
          }
          :host .media-type {
            font-style: italic;
          }
          :host #searchbar {
            display: none;
          }
          :host .media-caption {
            background-color: #cccccc;
            color: #000000;
            font-size: 120%;
            padding: 5px 15px;
          }
        }
      </style>
      <div class="sr-only">[[mediaCaption]]</div>
      <div id="outerplayer" lang$="[[uiLanguage]]">
        <div id="outeraudiocc" hidden$="[[!showCustomCaptions]]">
          <div id="audiocc" hidden$="[[!noHeight]]"></div>
        </div>
        <div id="player">
          <div id="innerplayer">
            <div id="sources" hidden$="[[noHeight]]">
              <a11y-media-play-button
                id="playbutton"
                audio-only$="[[audioOnly]]"
                disabled="true"
                hidden$="[[noPlayButton]]"
                disabled$="[[noPlayButton]]"
                on-controls-change="_onControlsChanged"
                pause-label$="[[pauseLabel]]"
                playing$="[[__playing]]"
                play-label$="[[playLabel]]"
              >
              </a11y-media-play-button>
              <a11y-media-loader
                id="loader"
                audio-only$="[[audioOnly]]"
                autoplay$="[[autoplay]]"
                cc$="[[cc]]"
                crossorigin$="[[crossorigin]]"
                hidden$="[[isYoutube]]"
                lang$="[[lang]]"
                loop$="[[loop]]"
                muted$="[[muted]]"
                manifest$="[[manifest]]"
                on-media-loaded="_handleMediaLoaded"
                playback-rate$="[[playbackRate]]"
                style$="[[_getThumbnailCSS(thumbnailSrc)]]"
                preload$="[[preload]]"
                volume$="[[volume]]"
              >
                <slot></slot>
              </a11y-media-loader>
              <div
                id="youtube"
                hidden$="[[!isYoutube]]"
                video-id$="[[videoId]]"
              ></div>
              <div id="customcc" hidden$="[[!showCustomCaptions]]">
                <span id="customcctxt" hidden$="[[noHeight]]"></span>
              </div>
            </div>
          </div>
          <paper-slider
            id="slider"
            max$="[[__duration]]"
            on-dragging-changed="_handleSliderDragging"
            on-focused-changed="_handleSliderKeyboard"
            pin=""
            secondary-progress$="[[__buffered]]"
            value$="[[__elapsed]]"
          >
          </paper-slider>
        </div>
        <a11y-media-controls
          id="controls"
          audio-only$="[[audioOnly]]"
          audio-label$="[[audioLabel]]"
          captions-icon$="[[captionsIcon]]"
          captions-label$="[[captionsLabel]]"
          captions-menu-label$="[[captionsMenuLabel]]"
          captions-menu-off$="[[captionsMenuOff]]"
          cc$="[[cc]]"
          forward-icon$="[[forwardIcon]]"
          forward-label$="[[forwardLabel]]"
          fullscreen-icon$="[[fullscreenIcon]]"
          fullscreen-label$="[[fullscreenLabel]]"
          has-captions$="[[hasCaptions]]"
          has-transcript$="[[hasTranscript]]"
          lang$="[[uiLanguage]]"
          loop-icon$="[[loopIcon]]"
          loop-label$="[[loopLabel]]"
          mute-icon$="[[muteIcon]]"
          mute-label$="[[muteLabel]]"
          muted$="[[muted]]"
          on-controls-change="_onControlsChanged"
          pause-icon$="[[pauseIcon]]"
          pause-label$="[[pauseLabel]]"
          play-icon$="[[playIcon]]"
          play-label$="[[playLabel]]"
          playing$="[[__playing]]"
          restart-icon$="[[restartIcon]]"
          restart-label$="[[restartLabel]]"
          rewind-icon$="[[rewindIcon]]"
          rewind-label$="[[rewindLabel]]"
          search-transcript$="[[searchTranscript]]"
          settings-icon$="[[settingsIcon]]"
          settings-label$="[[settingsLabel]]"
          speed-label$="[[speedLabel]]"
          stand-alone$="[[standAlone]]"
          transcript-icon$="[[transcriptIcon]]"
          transcript-label$="[[transcriptLabel]]"
          transcript-menu-label$="[[transcriptMenuLabel]]"
          unmute-icon$="[[unmuteIcon]]"
          unmute-label$="[[unmuteLabel]]"
          video-label$="[[videoLabel]]"
          volume="[[__volume]]"
          volume-icon$="[[volumeIcon]]"
          volume-label$="[[volumeLabel]]"
        >
        </a11y-media-controls>
        <div
          class="screen-only media-caption"
          aria-hidden="true"
          hidden$="[[!_hasAttribute(mediaCaption)]]"
        >
          [[mediaCaption]]
        </div>
        <div class="print-only media-caption">[[printCaption]]</div>
      </div>
      <img id="printthumb" aria-hidden="true" src$="[[thumbnailSrc]]" />
      <div id="outertranscript" hidden$="[[standAlone]]" lang$="[[uiLanguage]]">
        <div id="innertranscript">
          <a11y-media-transcript-controls
            id="tcontrols"
            accent-color$="[[accentColor]]"
            auto-scroll-icon$="[[autoScrollIcon]]"
            auto-scroll-label$="[[autoScrollLabel]]"
            dark$="[[darkTranscript]]"
            disable-print-button$="[[disablePrintButton]]"
            disable-scroll$="[[disableScroll]]"
            disable-search$="[[disableSearch]]"
            lang$="[[uiLanguage]]"
            on-searchbar-added="_handleSearchAdded"
            on-toggle-scroll="_handleTranscriptScrollToggle"
            on-print-transcript="_handlePrinting"
            print-icon$="[[printIcon]]"
            print-label$="[[printLabel]]"
            stand-alone$="[[standAlone]]"
            search-label$="[[searchLabel]]"
            search-prev-label$="[[searchPrevLabel]]"
            search-prev-icon$="[[searchPrevIcon]]"
            search-next-label$="[[searchNextLabel]]"
            search-next-icon$="[[searchNextIcon]]"
            skip-transcript-link$="[[skipTranscriptLink]]"
          >
          </a11y-media-transcript-controls>
          <a11y-media-transcript
            id="transcript"
            accent-color$="[[accentColor]]"
            dark$="[[darkTranscript]]"
            disable-scroll$="[[disableScroll]]"
            disable-search$="[[disableSearch]]"
            disable-interactive$="[[disableInteractive]]"
            hide-timestamps$="[[hideTimestamps]]"
            on-cue-seek="_handleCueSeek"
            search="[[search]]"
          >
          </a11y-media-transcript>
        </div>
      </div>
    `}connectedCallback(){super.connectedCallback();let root=this;root.__playerAttached=!0;window.A11yMediaUtility.requestAvailability();root._addResponsiveUtility();window.dispatchEvent(new CustomEvent("a11y-player",{detail:root}));if(root.isYoutube){window.A11yMediaYoutubeUtility.requestAvailability();root._youTubeRequest()}}ready(){super.ready();let root=this,aspect=16/9,tracks=[];root.__playerReady=!0;root.__interactive=!root.disableInteractive;root.target=root.shadowRoot.querySelector("#transcript");root.__status=root.loadingLabel;root.__slider=root.$.slider;root.__volume=root.muted?0:Math.max(this.volume,10);root.__resumePlaying=!1;root.__showFullscreen=!this.disableFullscreen&&screenfull.enabled;root.__duration=0;root.$.controls.setStatus(root.__status);root.width=null!==root.width?root.width:"100%";root.style.maxWidth=null!==root.width?root.width:"100%";root.$.sources.style.paddingTop=100/aspect+"%";root.querySelectorAll("source,track").forEach(function(node){root.$.loader.media.appendChild(node)});if(this.isYoutube){root.disableInteractive=!0;this._youTubeRequest()}else{root.media=root.$.loader}root.$.transcript.setMedia(root.$.player);if(root.__showFullscreen){screenfull.on("change",()=>{this.fullscreen=screenfull.isFullscreen})}}play(e){let root=this;root.__playing=!0;if(e===void 0||e.detail===root.$.playbutton){root.__playProgress=setInterval(()=>{root.__elapsed=0<root.media.getCurrentTime()?root.media.getCurrentTime():0;root.__duration=0<root.media.duration?root.media.duration:0;root._updateCustomTracks();root.__status=root._getHHMMSS(root.media.getCurrentTime(),root.__duration)+"/"+root._getHHMMSS(root.__duration);root.$.controls.setStatus(root.__status);if(root.__elapsed===root.__duration&&!root.loop){root.__playing=!1;clearInterval(root.__playProgress)}root.__buffered=root.media.getBufferedTime},1);window.dispatchEvent(new CustomEvent("a11y-player-playing",{detail:root}));root.media.play()}}pause(){let root=this;root.__playing=!1;root.media.pause();clearInterval(root.__playProgress)}stop(){this.pause();this.seek(0)}restart(){this.seek(0);this.play()}rewind(amt){amt=amt!==void 0?amt:1;this.seek(Math.max(this.media.getCurrentTime()-amt,0))}forward(amt){amt=amt!==void 0?amt:1;this.seek(Math.min(this.media.getCurrentTime()+amt,this.__duration))}seek(time){let seekable=this.media!==void 0&&null!==this.media?this.media.seekable:[];if(0<seekable.length&&time>=seekable.start(0)&&time<=seekable.end(0)){this.media.seek(time);this.__elapsed=time;this.__status=this._getHHMMSS(this.media.getCurrentTime(),this.__duration)+"/"+this._getHHMMSS(this.__duration);this.$.controls.setStatus(this.__status);this._updateCustomTracks();if(this.__resumePlaying)this.play()}}selectTrack(index){this.$.loader.selectTrack(index);this.$.transcript.setActiveTranscript(index)}setVolume(value){this.volume=null!==value?value:70;this.media.setVolume(this.volume);this.muted=0===this.volume}setPlaybackRate(value){value=null!==value?value:1;this.media.setPlaybackRate(value)}toggleCC(mode){this.cc=mode===void 0?!this.cc:mode;this.$.loader.setCC(this.cc)}toggleLoop(mode){if(this.isYoutube){}else{this.loop=mode===void 0?!this.loop:mode;this.media.setLoop(this.loop)}}toggleMute(mode){this.muted=mode===void 0?!this.muted:mode;this.__volume=this.muted?0:Math.max(this.volume,10);this.media.setMute(this.muted)}toggleSticky(mode){mode=mode===void 0?!this.sticky:mode;this.sticky=mode;this.dispatchEvent(new CustomEvent("player-sticky",{detail:this}))}toggleTranscript(mode){mode=mode===void 0?this.hideTranscript:mode;this.hideTranscript=!mode;if(this.$.transcript!==void 0&&null!==this.$.transcript){this.dispatchEvent(new CustomEvent("transcript-toggle",{detail:this}));this.$.transcript.toggleHidden(this.hideTranscript)}}_getMediaCaption(audioOnly,audioLabel,mediaTitle){let hasMediaTitle=mediaTitle!==void 0&&null!==mediaTitle&&""!==mediaTitle;if(audioOnly&&hasMediaTitle){return mediaTitle+" ("+audioLabel+")"}else if(audioOnly){return audioLabel}else if(hasMediaTitle){return mediaTitle}else{return null}}_getPrintCaption(audioOnly,audioLabel,videoLabel,mediaTitle){let hasMediaTitle=mediaTitle!==void 0&&null!==mediaTitle&&""!==mediaTitle;if(audioOnly&&hasMediaTitle){return mediaTitle+" ("+audioLabel+")"}else if(audioOnly){return audioLabel}else if(hasMediaTitle){return mediaTitle+" ("+videoLabel+")"}else{return videoLabel}}_getThumbnailCSS(thumbnailSrc){return null!=thumbnailSrc?"background-image: url("+thumbnailSrc+"); background-size: cover;":null}_getTrackData(){let root=this,media=root.$.loader.media,tdata=[],selected=0;root.hasTranscript=!root.standAlone;for(let i=0;i<media.textTracks.length;i++){if(null!==media.textTracks[i]){let track=media.textTracks[i],tidata={},loaded=track.cues!==void 0,complete=0,label=track.label,lang=track.language,text=label!==void 0?label:lang!==void 0?lang:"Track "+i,cues,loadCueData=setInterval(()=>{track.mode="showing";if(track.cues!==void 0&&0<track.cues.length){track.mode="hidden";getCueData();clearInterval(loadCueData)}},1),getCueData=function(){track.mode="hidden";let cues=Object.keys(track.cues).map(function(key){return{order:""!==track.cues[key].id?track.cues[key].id:key,seek:track.cues[key].startTime,seekEnd:track.cues[key].endTime,start:root._getHHMMSS(track.cues[key].startTime,root.media.duration),end:root._getHHMMSS(track.cues[key].endTime,root.media.duration),text:track.cues[key].text}});tidata={text:text,language:lang,value:i,cues:cues};tdata.push(tidata);root.set("tracks",tdata);root.$.controls.setTracks(tdata);root.$.transcript.setTracks(tdata);root.selectTrack(track.default?i:0);track.oncuechange=function(e){root.$.transcript.setActiveCues(Object.keys(e.currentTarget.activeCues).map(function(key){return e.currentTarget.activeCues[key].id}))}}}}if(0<media.textTracks.length){root.hasCaptions=!0}else{root.standAlone=!0}}_handleCueSeek(e){let root=this;if(!root.standAlone&&root.$.transcript!==void 0&&null!==root.$.transcript){root.__resumePlaying=root.__playing;root.seek(e.detail)}}_handleMediaLoaded(e){let root=this,aspect=root.media.aspectRatio;root.$.sources.style.paddingTop=100/aspect+"%";root.$.playbutton.removeAttribute("disabled");root.__duration=0<root.media.duration?root.media.duration:0;root.__status=root._getHHMMSS(0,root.media.duration)+"/"+root._getHHMMSS(root.media.duration);root.$.controls.setStatus(root.__status);root._getTrackData(root.$.loader.media)}_handlePrinting(e){let root=this;root.dispatchEvent(new CustomEvent("printing-transcript",{detail:root}));root.$.transcript.print(root.mediaTitle)}_handleSearchAdded(e){this.search=e.detail}_handleSliderDragging(e){let root=this;root._toggleSliderSeek(root.$.slider.dragging,root.$.slider.immediateValue)}_handleSliderKeyboard(e){let root=this;root._toggleSliderSeek(root.$.slider.focused,root.$.slider.value)}_handleTranscriptScrollToggle(e){this.disableScroll=!this.disableScroll}_onControlsChanged(e){let root=this,action=e.detail.label!==void 0?e.detail.label:e.detail.id;if("backward"===action||action===root.rewindLabel){root.rewind(root.__duration/20)}else if("closed captions"===action||"captions"===action||action===root.captionsLabel||action===root.captionsMenuLabel){root.toggleCC()}else if("transcript"===action||"transcript-toggle"===action||action===root.transcriptLabel||action===root.transcriptMenuLabel){root.toggleTranscript()}else if("tracks"===e.detail.id){if(""===e.detail.value){root.toggleCC(!1)}else{root.toggleCC(!0);root.selectTrack(e.detail.value)}}else if("forward"===action||action===root.forwardLabel){root.forward(root.__duration/20)}else if("full screen"===action||action===root.fullscreenLabel){this.toggleTranscript(this.fullscreen);screenfull.toggle(root.$.outerplayer)}else if("loop"===action||action===root.loopLabel){root.toggleLoop()}else if("mute"===action||"unmute"===action||action===root.muteLabel||action===root.unmuteLabel){root.toggleMute()}else if("pause"===action||action===root.pauseLabel){root.pause()}else if("play"===action||action===root.playLabel){root.play()}else if("restart"===action||action===root.restartLabel){root.seek(0);root.play()}else if("speed"===action||action===root.speedLabel){root.setPlaybackRate(e.detail.value)}else if("volume"===action||action===root.volumeLabel){root.setVolume(e.detail.value)}}_toggleSliderSeek(seeking,value){if(seeking){if(this.__playing)this.__resumePlaying=!0;this.pause()}else{this.seek(value);this.__resumePlaying=!1}}_youTubeRequest(){let root=this,ytUtil=window.A11yMediaYoutubeUtility.instance;if(root.__playerAttached&&root.__playerReady){let ytInit=function(){root.media=ytUtil.initYoutubePlayer({width:"100%",height:"100%",videoId:root.youtubeId});root.$.youtube.appendChild(root.media.a);root._getTrackData(root.$.loader.media);root._updateCustomTracks();let int=setInterval(()=>{if(root.media.getDuration!==void 0){clearInterval(int);root.__duration=root.media.duration=root.media.getDuration();root.__status=root._getHHMMSS(0,root.media.duration)+"/"+root._getHHMMSS(root.media.duration);root.$.controls.setStatus(root.__status);root.disableInteractive=!root.__interactive}},100)},checkApi=function(e){if(ytUtil.apiReady){document.removeEventListener("youtube-api-ready",checkApi);ytInit()}};if(ytUtil.apiReady){ytInit()}else{document.addEventListener("youtube-api-ready",checkApi)}}}_updateCustomTracks(){if(this._hasCustomCaptions(this.isYoutube,this.audioOnly,this.tracks)){let root=this,track=root.tracks[this.$.transcript.selectedTranscript],active=[],caption="";if(track!==void 0&&null!==track&&track.cues!==void 0&&null!==track.cues){for(let i=0;i<track.cues.length;i++){if(track.cues[i].seek<root.__elapsed&&track.cues[i].seekEnd>root.__elapsed){active.push(track.cues[i].order);caption=""===caption?track.cues[i].text:caption}}root.$.customcctxt.innerText=caption;root.$.audiocc.innerText=caption;root.$.transcript.setActiveCues(active)}}}}window.customElements.define(A11yMediaPlayer.tag,A11yMediaPlayer);