import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{A11yMediaPlayerBehaviors}from"./lib/a11y-media-player-behaviors.js";import"./node_modules/@polymer/paper-slider/paper-slider.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icons/av-icons.js";import"./lib/screenfull-lib.js";import"./lib/a11y-media-controls.js";import"./lib/a11y-media-html5.js";import"./lib/a11y-media-play-button.js";import"./lib/a11y-media-transcript.js";import"./lib/a11y-media-transcript-controls.js";import"./lib/a11y-media-state-manager.js";import"./lib/a11y-media-youtube.js";export{A11yMediaPlayer};class A11yMediaPlayer extends A11yMediaPlayerBehaviors{static get template(){return html`
<style>
:host {
  display: block;
  width: calc(100% - 2px);
  border: 1px solid var(--simple-colors-default-theme-grey-3);
  --a11y-media-color: var(--simple-colors-default-theme-grey-11);
  --a11y-media-bg-color: var(--simple-colors-default-theme-grey-2);
  --a11y-media-hover-color: var(--simple-colors-default-theme-grey-12);
  --a11y-media-hover-bg-color: var(--simple-colors-default-theme-grey-2);
  --a11y-media-accent-color: var(--simple-colors-default-theme-accent-9);
  --a11y-media-faded-accent-color: var(--simple-colors-default-theme-accent-8);

  
  --a11y-media-settings-menu-color: var(--a11y-media-color);
  --a11y-media-settings-menu-bg-color: var(--a11y-media-bg-color);
  --a11y-media-settings-menu-hover-color: var(--a11y-media-hover-color);
  --a11y-media-settings-menu-hover-bg-color: var(--a11y-media-hover-bg-color);

  
  --a11y-media-button-color: var(--a11y-media-color);
  --a11y-media-button-bg-color: var(--a11y-media-bg-color);
  --a11y-media-button-hover-color: var(--a11y-media-accent-color);
  --a11y-media-button-hover-bg-color: var(--a11y-media-hover-bg-color);
  --a11y-media-button-toggle-color: var(--a11y-media-faded-accent-color);

  
  --paper-toggle-button-unchecked-bar-color: var(--a11y-media-color);
  --paper-toggle-button-unchecked-button-color: var(--a11y-media-color);
  --paper-toggle-button-checked-bar-color: var(--a11y-media-accent-color);
  --paper-toggle-button-checked-button-color: var(--a11y-media-accent-color);

  
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
  
  
  --a11y-media-transcript-color: var(--simple-colors-default-theme-grey-7);
  --a11y-media-transcript-bg-color: var(--simple-colors-default-theme-grey-1);
  --a11y-media-transcript-accent-color: var(--simple-colors-default-theme-accent-8);
  --a11y-media-transcript-faded-accent-color: var(--simple-colors-default-theme-accent-10);
  --a11y-media-transcript-cue-color: var(--simple-colors-light-theme-grey-12);
  --a11y-media-transcript-cue-bg-color: var(--simple-colors-light-theme-grey-1);
  --a11y-media-transcript-active-cue-color: var(--simple-colors-light-theme-grey-12);
  --a11y-media-transcript-active-cue-bg-color: var(--simple-colors-light-theme-accent-1);
  --a11y-media-transcript-focused-cue-color: var(--simple-colors-light-theme-grey-12);
  --a11y-media-transcript-focused-cue-bg-color: var(--simple-colors-light-theme-grey-2);
  --a11y-media-transcript-match-color: var(--simple-colors-light-theme-grey-1);
  --a11y-media-transcript-match-bg-color: var(--simple-colors-light-theme-accent-10);
  --a11y-media-transcript-match-border-color: var(--simple-colors-light-theme-accent-12);
}
:host([dark]) {
  border: 1px solid var(--simple-colors-default-theme-grey-1);
}
:host([dark-transcript]) {
  --a11y-media-transcript-bg-color: var(--simple-colors-dark-theme-grey-1);
  --a11y-media-transcript-cue-color: var(--simple-colors-dark-theme-grey-12);
  --a11y-media-transcript-cue-bg-color: var(--simple-colors-dark-theme-grey-1);
  --a11y-media-transcript-active-cue-color: var(--simple-colors-dark-theme-accent-10);
  --a11y-media-transcript-active-cue-bg-color: var(--simple-colors-dark-theme-grey-1);
  --a11y-media-transcript-match-color: var(--simple-colors-dark-theme-grey-1);
  --a11y-media-transcript-match-bg-color: var(--simple-colors-dark-theme-accent-10);
  --a11y-media-transcript-match-border-color: var(--simple-colors-dark-theme-accent-12);
  --a11y-media-transcript-focused-cue-color: var(--simple-colors-dark-theme-grey-12);
  --a11y-media-transcript-focused-cue-bg-color: var(--simple-colors-dark-theme-grey-2);
}
:host,
:host #outerplayer {
  color: var(--simple-colors-default-theme-grey-12);
  background-color: var(--simple-colors-default-theme-grey-2);
}
:host > * {
  transition: all 0.5s;
}
:host,
:host #outerplayer,
:host #player,
:host #outertranscript,
:host #innertranscript {
  display: flex;
  flex-flow: column;
  align-items: stretch;
  align-content: stretch;
} 
:host #innerplayer {
  display: flex;
}
:host([hidden]),
:host *[hidden] {
  display: none !important;
}
:host #innerplayer,
:host #player, 
:host #player > *,
:host #customcc,
:host #customcctxt,
:host #slider,
:host #controls,
:host #outertranscript,
:host #innertranscript,
:host #innertranscript > * {
  width: 100%;
}
:host > *,
:host #innerplayer,
:host #player,
:host #player > *,
:host #customcctxt {
  flex: 1 1 auto;
}
:host #controls,
:host #tcontrols {
  flex: 0 0 44px;
}
:host #innerplayer {
  margin: 0 auto;
}
:host #player {
  position: relative;
}
:host #player > * {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  max-height: calc(100vh - 100px);
}
:host #playbutton,
:host #slider,
:host #controls {
  z-index: 2;
}
:host([audio-only]) #playbutton {
  opacity: 0;
}
:host #slider {
  flex: 0 0 32px;
  height: 32px;
}
:host([thumbnail-src]) #youtube {
  opacity: 0;
}
:host #youtube[elapsed] {
  opacity: 1;
  transition: opacity 0.5s;
}
:host #customcc:not([hidden]) {
  font-size: 20px;
  transition: font-size 0.25s;
  display: flex;
}
:host #customcctxt:not(:empty) {
  align-self: flex-end;
  font-family: sans-serif;
  color: white;
  margin: 4px 10px;
  padding: 0.15em 4px;
  background-color: black;
  background-color: rgba(0, 0, 0, 0.8);
  transition: all 0.5s;
}
:host([audio-only]:not([thumbnail-src])) #customcctxt {
  align-self: center;
  color: var(--a11y-media-color);
  background-color: transparent;
}
:host #printthumb {
  width: 100%;
  margin: 0;
  display: block;
  border-top: 1px solid #aaaaaa;
}
:host .media-caption:not(:empty) {
  width: calc(100% - 30px);
  padding: 5px 15px;
}
:host .media-type {
  font-style: italic;
}
:host #outertranscript {
  padding: 0 1px 0 0;
}
:host #innertranscript {
  flex: 1 0 194px;
}
:host #transcript {
  flex: 1 0 150px;
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
  :host([flex-layout]:not([responsive-size*="s"])) {
    flex-flow: row;
    padding: 0;
  }
  :host([flex-layout]:not([responsive-size*="s"])) #outerplayer {
    flex: 1 0 auto;
  }
  :host #printthumb,
  :host([height]) #outertranscript,
  :host([stand-alone]) #outertranscript,
  :host([hide-transcript]) #outertranscript {
    display: none;
  }
  :host([sticky]:not([sticky-corner="none"])) #outerplayer {
    position: fixed;
    top: 5px;
    right: 5px;
    width: 200px;
    max-width: 200px;
    z-index: 999999;
    border: 1px solid var(--a11y-media-bg-color);
    box-shadow: 1px 1px 20px 1px rgba(125, 125, 125);
    border-radius: 3.2px;
  }
  :host([dark][sticky]:not([sticky-corner="none"])) #outerplayer {
    border: 1px solid var(--a11y-media-bg-color);
  }
  :host([sticky][sticky-corner="top-left"]) #outerplayer {
    right: unset;
    left: 5px;
  }
  :host([flex-layout]:not([responsive-size*="s"])) > div {
    width: 50%;
    flex: 1 1 auto;
  }
  :host #innertranscript {
    position: relative;
  }
  :host([hide-transcript]) #outerplayer {
    min-width: 50%;
    max-width: 100%;
  }
  :host([hide-transcript]) #outertranscript {
    display: none;
  }
  :host(:not([no-height]):not([stacked-layout]):not([responsive-size*="s"]))
    #transcript {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
  }
  :host(:not([no-height]):not([stacked-layout]):not([responsive-size*="s"]))
    #innerplayer.totop {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px !important;
    z-index: 9999;
  }
  :host([sticky][sticky-corner="bottom-left"]) #innerplayer {
    top: unset;
    right: unset;
    bottom: 5px;
  }
  :host([sticky][sticky-corner="bottom-right"]) #innerplayer {
    top: unset;
    bottom: 5px;
  }
  :host([sticky]:not([sticky-corner="none"]):not([no-height]):not([stacked-layout]):not([responsive-size*="s"]))
    #controls {
    display: none;
  }
  :host([responsive-size="lg"]) #customcc {
    font-size: 16px;
  }
  :host([responsive-size="md"]) #customcc,
  :host([flex-layout][responsive-size="xl"]) #customcc {
    font-size: 14px;
  }
  :host([responsive-size="sm"]) #customcc,
  :host([flex-layout][responsive-size="lg"]) #customcc {
    font-size: 12px;
  }
  :host([responsive-size="xs"]) #customcc,
  :host([flex-layout][responsive-size="md"]) #customcc,
  :host([flex-layout][responsive-size="sm"]) #customcc {
    font-size: 10px;
  }
  :host([sticky]:not([sticky-corner="none"])) #customcc {
    display: none;
  }
  :host .media-caption {
    color: var(--a11y-media-bg-color);
    background-color: var(--a11y-media-accent-color);
  }
  :host #audio-only {
    text-align: center;
    font-style: italic;
    width: 100%;
    line-height: 160%;
  }
  :host .print-only {
    display: none;
  }
}

@media print {
  :host,
  :host([dark]) {
    outline: 1px solid #aaaaaa;
    background-color: #ffffff;
  }
  :host .screen-only,
  :host #printthumb:not([src]),
  :host(:not([thumbnail-src])) #player {
    display: none;
  }
  :host #searchbar {
    display: none;
  }
  :host .media-caption {
    background-color: #cccccc;
    color: #000000;
    font-size: 120%;
  }
}</style>
<style is="custom-style" include="simple-colors"></style>

    <div class="sr-only">[[mediaCaption]]</div>
  <div id="outerplayer">
    <div id="innerplayer">
      <div id="player"
        style$="[[_getThumbnailCSS(thumbnailSrc,isYoutube,audioOnly)]]">
        <a11y-media-play-button
          id="playbutton"
          action$="[[playPause.action]]"
          audio-only$="[[audioOnly]]"
          disabled="true"
          elapsed$="[[_hidePlayButton(thumbnailSrc, isYoutube, __elapsed)]]"
          hidden$="[[audioNoThumb]]"
          disabled$="[[audioNoThumb]]"
          on-controls-change="_onControlsChanged"
          localization$="[[localization]]">
        </a11y-media-play-button>
        <a11y-media-html5
          id="html5"
          audio-only$="[[audioOnly]]"
          autoplay$="[[autoplay]]"
          cc$="[[cc]]"
          crossorigin$="[[crossorigin]]"
          hidden$="[[isYoutube]]"
          media-lang$="[[mediaLang]]"
          loop$="[[loop]]"
          muted$="[[muted]]"
          manifest$="[[manifest]]"
          on-media-loaded="_handleMediaLoaded"
          playing$="[[__playing]]"
          playback-rate$="[[playbackRate]]"
          thumbnail-src$="[[thumbnailSrc]]"
          preload$="[[preload]]"
          volume$="[[volume]]"
        >
          <slot></slot>
        </a11y-media-html5>
        <div id="youtube" 
          elapsed$="[[__elapsed]]" 
          lang$="[[mediaLang]]"
          video-id$="[[videoId]]">
        </div>
        <div id="customcc" 
          class="screen-only" 
          hidden$="[[!showCustomCaptions]]">
          <div id="customcctxt"></div>
        </div>
      </div>
    </div>
    <paper-slider id="slider"
      class="screen-only"
      max$="[[__duration]]"
      on-dragging-changed="_handleSliderDragging"
      on-focused-changed="_handleSliderKeyboard"
      secondary-progress$="[[__buffered]]"
      value$="[[__elapsed]]"
    >
    </paper-slider>
    <a11y-media-controls id="controls"
      cc$="[[cc]]"
      fixed-height$="[[height]]"
      has-captions$="[[hasCaptions]]"
      has-transcript$="[[hasTranscript]]"
      hide-transcript$="[[hideTranscript]]"
      localization$="[[localization]]"
      muted$="[[muted]]"
      on-controls-change="_onControlsChanged"
      on-print-transcript="_handlePrinting"
      playing$="[[__playing]]"
      search-transcript$="[[searchTranscript]]"
      stand-alone$="[[standAlone]]"
      volume="[[__volume]]">
    </a11y-media-controls>
    <div
      aria-hidden="true"
      class="screen-only media-caption"
      hidden$="[[!_hasAttribute(mediaCaption)]]">
      [[mediaCaption]]
    </div>
    <div class="print-only media-caption">[[printCaption]]</div>
  </div>
  <img id="printthumb" aria-hidden="true" src$="[[thumbnailSrc]]" />
  <div id="outertranscript" hidden$="[[standAlone]]">
    <div id="innertranscript" hidden$="[[hideTranscript]]">
      <a11y-media-transcript-controls id="tcontrols"
        accent-color$="[[accentColor]]"
        localization$="[[localization]]"
        dark$="[[darkTranscript]]"
        disable-print-button$="[[disablePrintButton]]"
        disable-scroll$="[[disableScroll]]"
        disable-search$="[[disableSearch]]"
        on-searchbar-added="_handleSearchAdded"
        on-toggle-scroll="_handleTranscriptScrollToggle"
        on-print-transcript="_handlePrinting"
        stand-alone$="[[standAlone]]">
      </a11y-media-transcript-controls>
      <a11y-media-transcript id="transcript"
        accent-color$="[[accentColor]]"
        dark$="[[darkTranscript]]"
        disable-scroll$="[[disableScroll]]"
        disable-search$="[[disableSearch]]"
        disable-interactive$="[[disableInteractive]]"
        hide-timestamps$="[[hideTimestamps]]"
        on-cue-seek="_handleCueSeek"
        localization$="[[localization]]"
        search="[[search]]"
        selected-transcript$="[[__selectedTrack]]">
      </a11y-media-transcript>
    </div>
  </div>`}static get properties(){return{mediaCaption:{type:"String",computed:"_getMediaCaption(audioOnly,localization,mediaTitle)"},printCaption:{type:"String",computed:"_getPrintCaption(audioOnly,audioLabel,videoLabel,mediaTitle)"},showCustomCaptions:{type:"Boolean",computed:"_showCustomCaptions(isYoutube,audioOnly,hasCaptions,cc)"},sources:{type:"Array",value:[]},sticky:{type:"Boolean",value:!1,reflectToAttribute:!0},stickyCorner:{type:"String",value:"top-right",reflectToAttribute:!0},tracks:{type:"Array",value:[]},__playing:{type:"Boolean",value:!1,notify:!0,reflectToAttribute:!0}}}static get tag(){return"a11y-media-player"}static get behaviors(){return[A11yMediaPlayerBehaviors]}connectedCallback(){super.connectedCallback();let root=this;root.__playerAttached=!0;window.A11yMediaStateManager.requestAvailability();root._addResponsiveUtility();window.dispatchEvent(new CustomEvent("a11y-player",{detail:root}));if(root.isYoutube){root._youTubeRequest()}}ready(){super.ready();let root=this,aspect=16/9,tracks=[],tdata=[],selected=0;root.__playerReady=!0;root.__interactive=!root.disableInteractive;root.target=root.shadowRoot.querySelector("#transcript");root.__status=root.loadingLabel;root.__slider=root.$.slider;root.__volume=root.muted?0:Math.max(this.volume,10);root.__resumePlaying=!1;root.__showFullscreen=!this.disableFullscreen&&screenfull.enabled;root.__duration=0;root.$.controls.setStatus(root.__status);root.width=null!==root.width?root.width:"100%";root.style.maxWidth=null!==root.width?root.width:"100%";root._setPlayerHeight(aspect);if(root.isYoutube){root._youTubeRequest()}else{root.media=root.$.html5;root._addSourcesAndTracks()}root.$.transcript.setMedia(root.$.innerplayer);if(root.__showFullscreen){screenfull.on("change",()=>{this.fullscreen=screenfull.isFullscreen})}}play(e){let root=this;root.__playing=!0;if(e===void 0||e.detail===root.$.playbutton){root.__playProgress=setInterval(()=>{root.__elapsed=0<root.media.getCurrentTime()?root.media.getCurrentTime():0;root.__duration=0<root.media.duration?root.media.duration:0;root._updateCustomTracks();root.__status=root._getHHMMSS(root.media.getCurrentTime(),root.__duration)+"/"+root._getHHMMSS(root.__duration);root.$.controls.setStatus(root.__status);if(root.__elapsed===root.__duration&&!root.loop){root.__playing=!1;clearInterval(root.__playProgress)}root.__buffered=root.media.getBufferedTime},1);window.dispatchEvent(new CustomEvent("a11y-player-playing",{detail:root}));root.media.play()}}pause(){let root=this;root.__playing=!1;root.media.pause();clearInterval(root.__playProgress)}stop(){this.pause();this.seek(0)}restart(){this.seek(0);this.play()}rewind(amt){amt=amt!==void 0?amt:1;this.seek(Math.max(this.media.getCurrentTime()-amt,0))}forward(amt){amt=amt!==void 0?amt:1;this.seek(Math.min(this.media.getCurrentTime()+amt,this.__duration))}seek(time){let seekable=this.media!==void 0&&null!==this.media?this.media.seekable:[];if(0<seekable.length&&time>=seekable.start(0)&&time<=seekable.end(0)){this.media.seek(time);this.__elapsed=time;this.__status=this._getHHMMSS(this.media.getCurrentTime(),this.__duration)+"/"+this._getHHMMSS(this.__duration);this.$.controls.setStatus(this.__status);this._updateCustomTracks();if(this.__resumePlaying)this.play()}}selectTrack(index){this.__selectedTrack=index;this.$.html5.selectTrack(index)}setVolume(value){this.volume=null!==value?value:70;this.media.setVolume(this.volume);this.muted=0===this.volume}setPlaybackRate(value){value=null!==value?value:1;this.media.setPlaybackRate(value)}toggleCC(mode){this.cc=mode===void 0?!this.cc:mode;this.$.html5.setCC(this.cc)}toggleLoop(mode){if(this.isYoutube){}else{this.loop=mode===void 0?!this.loop:mode;this.media.setLoop(this.loop)}}toggleMute(mode){this.muted=mode===void 0?!this.muted:mode;this.__volume=this.muted?0:Math.max(this.volume,10);this.media.setMute(this.muted)}toggleSticky(mode){mode=mode===void 0?!this.sticky:mode;this.sticky=mode;this.dispatchEvent(new CustomEvent("player-sticky",{detail:this}))}toggleTranscript(mode){mode=mode===void 0?this.hideTranscript:mode;this.hideTranscript=!mode;if(this.$.transcript!==void 0&&null!==this.$.transcript){this.dispatchEvent(new CustomEvent("transcript-toggle",{detail:this}))}}_appendToPlayer(data,type){let root=this,arr=typeof data===Array?data:JSON.parse(data);if(arr!==void 0&&null!==arr){for(let i=0,el;i<arr.length;i++){el=document.createElement(type);for(let key in arr[i]){el.setAttribute(key,arr[i][key])}root.$.html5.media.appendChild(el)}}}_setPlayerHeight(aspect){let root=this;if(root.audioOnly&&null===root.thumbnailSrc&&null===root.height){root.$.player.style.height="60px"}else if(null===root.height){root.$.player.style.paddingTop=100/aspect+"%";root.$.innerplayer.style.maxWidth="calc("+100*aspect+"vh - "+80*aspect+"px)"}else{root.$.outerplayer.style.height=root.height}}_getMediaCaption(audioOnly,localization,mediaTitle){let audioLabel=this._getLocal(localization,"audio","label"),hasMediaTitle=mediaTitle!==void 0&&null!==mediaTitle&&""!==mediaTitle;if(audioOnly&&hasMediaTitle){return mediaTitle+" ("+audioLabel+")"}else if(audioOnly){return audioLabel}else if(hasMediaTitle){return mediaTitle}else{return null}}_getPrintCaption(audioOnly,localization,mediaTitle){let audioLabel=this._getLocal(localization,"audio","label"),videoLabel=this._getLocal(localization,"video","label"),hasMediaTitle=mediaTitle!==void 0&&null!==mediaTitle&&""!==mediaTitle;if(audioOnly&&hasMediaTitle){return mediaTitle+" ("+audioLabel+")"}else if(audioOnly){return audioLabel}else if(hasMediaTitle){return mediaTitle+" ("+videoLabel+")"}else{return videoLabel}}_getThumbnailCSS(thumbnailSrc,isYoutube,audioOnly){return null!=thumbnailSrc&&(isYoutube||audioOnly)?"background-image: url("+thumbnailSrc+"); background-size: cover;":null}_addSourcesAndTracks(){let root=this,counter=0;root.querySelectorAll("source,track").forEach(function(node){root.$.html5.media.appendChild(node)});root._appendToPlayer(root.tracks,"track");root._appendToPlayer(root.sources,"source");root.$.html5.media.textTracks.onaddtrack=function(e){root.hasCaptions=!0;root.hasTranscript=!root.standAlone;root._getTrackData(e.track,counter++)}}_getTrackData(track,id){let root=this,selected=!0===track.default||root.__selectedTrack===void 0,loadCueData;if(selected)root.selectTrack(id);track.mode=selected&&!0===this.cc?"showing":"hidden";loadCueData=setInterval(()=>{if(track.cues!==void 0&&null!==track.cues&&0<track.cues.length){clearInterval(loadCueData);let cues=Object.keys(track.cues).map(function(key){return{order:""!==track.cues[key].id?track.cues[key].id:key,seek:track.cues[key].startTime,seekEnd:track.cues[key].endTime,start:root._getHHMMSS(track.cues[key].startTime,root.media.duration),end:root._getHHMMSS(track.cues[key].endTime,root.media.duration),text:track.cues[key].text}});if(root.__tracks===void 0)root.__tracks=[];root.push("__tracks",{value:id,language:track.language,text:track.label!==void 0?track.label:track.language!==void 0?track.language:"Track "+id,cues:cues});root.$.controls.setTracks(root.__tracks);root.$.transcript.setTracks(root.__tracks);root.push("__tracks");track.oncuechange=function(e){root.$.transcript.setActiveCues(Object.keys(e.currentTarget.activeCues).map(function(key){return e.currentTarget.activeCues[key].id}))}}},1)}_handleCueSeek(e){let root=this;if(!root.standAlone&&root.$.transcript!==void 0&&null!==root.$.transcript){root.__resumePlaying=root.__playing;root.seek(e.detail)}}_handleMediaLoaded(e){let root=this,aspect=root.media.aspectRatio;root._setPlayerHeight(aspect);root.$.playbutton.removeAttribute("disabled");root.__duration=0<root.media.duration?root.media.duration:0;root.__status=root._getHHMMSS(0,root.media.duration)+"/"+root._getHHMMSS(root.media.duration);root.$.controls.setStatus(root.__status);root._getTrackData(root.$.html5.media)}_handlePrinting(e){let root=this;root.dispatchEvent(new CustomEvent("printing-transcript",{detail:root}));root.$.transcript.print(root.mediaTitle)}_handleSearchAdded(e){this.search=e.detail}_handleSliderDragging(e){let root=this;root._toggleSliderSeek(root.$.slider.dragging,root.$.slider.immediateValue)}_handleSliderKeyboard(e){let root=this;root._toggleSliderSeek(root.$.slider.focused,root.$.slider.value)}_handleTranscriptScrollToggle(e){this.disableScroll=!this.disableScroll}_onControlsChanged(e){let root=this,action=e.detail.action!==void 0?e.detail.action:e.detail.id;if("backward"===action){root.rewind(root.__duration/20)}else if("captions"===action){root.toggleCC()}else if("transcript"===action||"transcript-toggle"===action){root.toggleTranscript()}else if("tracks"===e.detail.id){if(""===e.detail.value){root.toggleCC(!1)}else{root.toggleCC(!0);root.selectTrack(e.detail.value)}}else if("forward"===action){root.forward(root.__duration/20)}else if("fullscreen"===action){this.toggleTranscript(this.fullscreen);screenfull.toggle(root.$.outerplayer)}else if("loop"===action){root.toggleLoop()}else if("mute"===action||"unmute"===action){root.toggleMute()}else if("pause"===action){root.pause()}else if("play"===action){root.play()}else if("restart"===action){root.seek(0);root.play()}else if("speed"===action){root.setPlaybackRate(e.detail.value)}else if("volume"===action){root.setVolume(e.detail.value)}}_hidePlayButton(thumbnailSrc,isYoutube,__elapsed){return isYoutube&&null===thumbnailSrc||!(__elapsed===void 0||0===__elapsed)}_showCustomCaptions(isYoutube,audioOnly,hasCaptions,cc){return(isYoutube||audioOnly)&&hasCaptions&&cc}_toggleSliderSeek(seeking,value){if(seeking){if(this.__playing)this.__resumePlaying=!0;this.pause()}else{this.seek(value);this.__resumePlaying=!1}}_useYoutubeIframe(thumbnailSrc,isYoutube,__elapsed){return isYoutube&&(null===thumbnailSrc||__elapsed===void 0||0===__elapsed)}_youTubeRequest(){window.A11yMediaYoutube.requestAvailability();let root=this,ytUtil=window.A11yMediaYoutube.instance;root.disableInteractive=!0;if(root.__playerAttached&&root.__playerReady){let ytInit=function(){root.media=ytUtil.initYoutubePlayer({width:"100%",height:"100%",videoId:root.youtubeId});root.$.youtube.appendChild(root.media.a);root.__ytAppended=!0;root._updateCustomTracks();let int=setInterval(()=>{if(root.media.getDuration!==void 0){clearInterval(int);root.__duration=root.media.duration=root.media.getDuration();root.__status=root._getHHMMSS(0,root.media.duration)+"/"+root._getHHMMSS(root.media.duration);root.$.controls.setStatus(root.__status);root.disableInteractive=!root.__interactive;root._addSourcesAndTracks()}},100)},checkApi=function(e){if(ytUtil.apiReady){document.removeEventListener("youtube-api-ready",checkApi);if(!root.__ytAppended){ytInit()}}};if(ytUtil.apiReady){if(!root.__ytAppended){ytInit()}}else{document.addEventListener("youtube-api-ready",checkApi)}}}_updateCustomTracks(){if(this._hasCustomCaptions(this.isYoutube,this.audioOnly,this.tracks)){let root=this,track=root.tracks[this.$.transcript.selectedTranscript],active=[],caption="";if(track!==void 0&&null!==track&&track.cues!==void 0&&null!==track.cues){for(let i=0;i<track.cues.length;i++){if(track.cues[i].seek<root.__elapsed&&track.cues[i].seekEnd>root.__elapsed){active.push(track.cues[i].order);caption=""===caption?track.cues[i].text:caption}}root.$.customcctxt.innerText=caption;root.$.transcript.setActiveCues(active)}}}}window.customElements.define(A11yMediaPlayer.tag,A11yMediaPlayer);