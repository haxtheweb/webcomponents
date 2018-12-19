import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";import"./node_modules/@lrnwebcomponents/media-behaviors/media-behaviors.js";import"./node_modules/@lrnwebcomponents/a11y-media-player/a11y-media-player.js";class VideoPlayer extends PolymerElement{static get template(){return html`
<style>
:host {
  display: block;
  margin: 0 0 15px;
}
.video-caption {
  font-style: italic;
  margin: 0;
  padding: 8px;
  @apply --video-player-caption-theme;
}</style>
<div style$="[[playerStyle]]">
<template is="dom-if" if="[[isA11yMedia]]" restamp>
  <a11y-media-player
    accent-color$="[[accentColor]]"
    dark$="[[dark]]"
    dark-transcript$="[[darkTranscript]]"
    disable-interactive$="[[disableInteractive]]"
    hide-timestamps$="[[hideTimestamps]]"
    lang$="[[lang]]"
    media-type$="[[sourceType]]"
    preload$="[[preload]]"
    media-title$="[[mediaTitle]]"
    sources$="[[sourceData]]"
    stand-alone$="[[__standAlone]]"
    sticky-corner$="[[stickyCorner]]"
    thumbnail-src$="[[thumbnailSrc]]"
    tracks$="[[trackData]]"
    crossorigin$="[[crossorigin]]"
    youtube-id$="[[youtubeId]]"
  >
    <template id="sources" is="dom-repeat" items="[[sourceData]]" as="sd" restamp>
      <source src$="[[sd.src]]" type$="[[sd.type]]" />
    </template>
    <template id="tracks" is="dom-repeat" items="[[trackData]]" as="track" restamp>
      <track
        src$="[[track.src]]"
        kind$="[[track.kind]]"
        label$="[[track.label]]"
        srclang$="[[track.lang]]"
      />
    </template>
    <slot name="caption"></slot>
  </a11y-media-player>
</template>
<template is="dom-if" if="[[!isA11yMedia]]">
  <template is="dom-if" if="[[sandboxed]]">
    <div class="responsive-video-container" lang$="[[lang]]">
      <webview
        resource$="[[schemaResourceID]]-video"
        src$="[[sourceData.0.src]]"
        width$="[[width]]"
        height$="[[height]]"
        frameborder="0"
      ></webview>
    </div>
  </template>
  <template is="dom-if" if="[[!sandboxed]]">
    <template is="dom-if" if="[[iframed]]">
      <div class="responsive-video-container" lang$="[[lang]]">
        <iframe
          resource$="[[schemaResourceID]]-video"
          src$="[[sourceData.0.src]]"
          width$="[[width]]"
          height$="[[height]]"
          frameborder="0"
          webkitallowfullscreen=""
          mozallowfullscreen=""
          allowfullscreen=""
        ></iframe>
      </div>
    </template>
  </template>
  <div id="videocaption" class$="video-caption">
    <p>
      [[mediaTitle]]
      <span class="media-type print-only">(embedded media)</span>
    </p>
    <slot name="caption"></slot>
  </div>
</template>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Video player",description:"This can present video in a highly accessible manner regardless of source.",icon:"av:play-circle-filled",color:"red",groups:["Video","Media"],handles:[{type:"video",source:"source",title:"caption",caption:"caption",description:"caption",color:"primaryColor"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"accentColor",title:"Accent color",description:"Select the accent color for the player.",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark theme",description:"Enable dark theme for the player.",inputMethod:"boolean",icon:"invert-colors"}],configure:[{property:"source",title:"Source",description:"The URL for this video.",inputMethod:"textfield",icon:"link",required:!0,validationType:"url"},{property:"track",title:"Closed captions",description:"The URL for the captions file.",inputMethod:"textfield",icon:"link",required:!0,validationType:"url"},{property:"thumbnailSrc",title:"Thumbnail image",description:"Optional. The URL for a thumbnail/poster image.",inputMethod:"textfield",icon:"link",required:!0,validationType:"url"},{property:"mediaTitle",title:"Title",description:"Simple title for under video",inputMethod:"textfield",icon:"av:video-label",required:!1,validationType:"text"},{property:"accentColor",title:"Accent color",description:"Select the accent color for the player.",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark theme",description:"Enable dark theme for the player.",inputMethod:"boolean",icon:"invert-colors"}],advanced:[{property:"darkTranscript",title:"Dark theme for transcript",description:"Enable dark theme for the transcript.",inputMethod:"boolean"},{property:"hideTimestamps",title:"Hide timestamps",description:"Hide the time stamps on the transcript.",inputMethod:"boolean"},{property:"preload",title:"Preload source(s).",description:"How the sources should be preloaded, i.e. auto, metadata (default), or none.",inputMethod:"select",options:{preload:"Preload all media",metadata:"Preload media metadata only",none:"Don't preload anything"}},{property:"stickyCorner",title:"Sticky Corner",description:"Set the corner where a video plays when scrolled out of range, or choose none to disable sticky video.",inputMethod:"select",options:{none:"none","top-left":"top-left","top-right":"top-right","bottom-left":"bottom-left","bottom-right":"bottom-right"}},{property:"sources",title:"Other sources",description:"List of other sources",inputMethod:"array",properties:[{property:"src",title:"Source",description:"The URL for this video.",inputMethod:"textfield"},{property:"type",title:"Type",description:"Media type data",inputMethod:"select",options:{"audio/aac":"acc audio","audio/flac":"flac audio","audio/mp3":"mp3 audio","video/mp4":"mp4 video","video/mov":"mov video","audio/ogg":"ogg audio","video/ogg":"ogg video","audio/wav":"wav audio","audio/webm":"webm audio","video/webm":"webm video"}}]},{property:"tracks",title:"Track list",description:"Tracks of different languages of closed captions",inputMethod:"array",properties:[{property:"kind",title:"Kind",description:"Kind of track",inputMethod:"select",options:{subtitles:"subtitles"}},{property:"label",title:"Label",description:"The human-readable name for this track, eg. \"English Subtitles\"",inputMethod:"textfield"},{property:"src",title:"Source",description:"Source of the track",inputMethod:"textfield"},{property:"srclang",title:"Two letter, language code, eg. 'en' for English, \"de\" for German, \"es\" for Spanish, etc.",description:"Label",inputMethod:"textfield"}]}]}}}static get properties(){return{accentColor:{type:"String",value:null,reflectToAttribute:!0},crossorigin:{type:"Boolean",value:!1},dark:{type:"Boolean",value:!1,reflectToAttribute:!0},darkTranscript:{type:"Boolean",value:!1},disableInteractive:{type:"Boolean",value:!1},height:{type:"String",value:null},hideTimestamps:{type:"Boolean",value:!1},iframed:{type:"Boolean",computed:"_computeIframed(sourceData, sandboxed)"},isA11yMedia:{type:"Boolean",computed:"_computeA11yMedia(sourceType, sandboxed)"},isYoutube:{type:"Boolean",computed:"_computeYoutube(sourceType)"},lang:{type:"String",value:"en"},mediaTitle:{type:"String"},preload:{type:"String",value:"metadata"},sandboxed:{type:"Boolean",computed:"_computeSandboxed(sourceData)"},source:{type:"String",value:null},sources:{type:"Array",value:[]},sourceData:{type:"Array",computed:"_getSourceData(source,sources,trackData)",reflectToAttribute:!0},sourceType:{type:"String",computed:"_computeSourceType(sourceData)"},stickyCorner:{type:"String",value:"top-right",reflectToAttribute:!0},tracks:{type:"Array",value:[]},trackData:{type:"Array",computed:"_getTrackData(tracks)",reflectToAttribute:!0},thumbnailSrc:{type:"String",value:null,reflectToAttribute:!0},width:{type:"String",value:null},youtubeId:{type:"String",computed:"_computeYoutubeId(source,sourceType)"}}}static get tag(){return"video-player"}static get behaviors(){return[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema,A11yBehaviors.A11y,MediaBehaviors.Video]}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setHaxProperties(VideoPlayer.haxProperties,VideoPlayer.tag,this)}_computeYoutubeId(source,sourceType){if(source!==void 0&&"youtube"===sourceType){return this._computeSRC(source).replace(/(https?:\/\/)?(www.)?youtube(-nocookie)?.com\/embed\//,"")}return!1}_computeYoutube(sourceType){return"youtube"===sourceType}_computeA11yMedia(sourceType,sandboxed){if(!sandboxed&&("youtube"==sourceType||"local"==sourceType)){return!0}return!1}_computeIframed(sourceData,sandboxed){if(0<sourceData.length&&sourceData[0]!==void 0&&window.MediaBehaviors.Video._sourceIsIframe(sourceData[0].src)&&!sandboxed){return!0}return!1}_getTrackData(tracks){return"string"===typeof tracks?JSON.parse(tracks):tracks}_getSourceData(source,sources,tracks){if("string"===typeof sources)sources=JSON.parse(sources);let root=this,temp=sources.slice();for(let i=0;i<temp.length;i++){temp[i].type=temp[i].type!==void 0&&null!==temp[i].type?temp[i].type:this._computeMediaType(temp[i].src);temp[i].src=this._computeSRC(temp[i].src)}if(null!==source){let src=this._computeSRC(source);this.sourceType=this._computeSourceType(src);if("youtube"!==this.sourceType)temp.unshift({src:src,type:this._computeMediaType(src)})}this.__standAlone=tracks===void 0||null===tracks||tracks.length;return temp}_computeMediaType(source){let audio=["aac","flac","mp3","oga","wav"],video=["mov","mp4","ogv","webm"],type="",findType=function(text,data){for(let i=0;i<data.length;i++){if(""===type&&source!==void 0&&null!==source&&-1<source.toLowerCase().indexOf("."+data[i]))type=text+"/"+data[i]}};findType("audio",audio);findType("video",video);return type}_computeSandboxed(sourceData){if(0<sourceData.length&&sourceData[0]!==void 0&&window.MediaBehaviors.Video._sourceIsIframe(sourceData[0].src)){let test=document.createElement("webview");if("function"===typeof test.reload){return!0}}return!1}_computeSourceType(sourceData){let root=this;if(0<sourceData.length&&sourceData[0]!==void 0&&typeof sourceData[0].src!==typeof void 0){return window.MediaBehaviors.Video.getVideoType(sourceData[0].src)}else{return null}}_computeSRC(source){if(null!==source&&typeof source!==void 0){let type=this.sourceType!==void 0?this.sourceType:window.MediaBehaviors.Video.getVideoType(source);source=window.MediaBehaviors.Video.cleanVideoSource(source,type);if("vimeo"==type){if(this.vimeoTitle){source+="?title=1"}else{source+="?title=0"}if(this.vimeoByline){source+="&byline=1"}else{source+="&byline=0"}if(this.vimeoPortrait){source+="&portrait=1"}else{source+="&portrait=0"}if(typeof this.videoColor!==typeof void 0){source+="&color="+this.videoColor}}else if("dailymotion"==type){source+="&ui-start-screen-info=false";source+="&ui-logo=false";source+="&sharing-enable=false";source+="&endscreen-enable=false";if(typeof this.videoColor!==typeof void 0){source+="&ui-highlight="+this.videoColor}}}return source}}window.customElements.define(VideoPlayer.tag,VideoPlayer);export{VideoPlayer};