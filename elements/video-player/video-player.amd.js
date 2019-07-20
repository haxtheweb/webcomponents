define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js","./node_modules/@polymer/polymer/lib/elements/dom-repeat.js","./node_modules/@polymer/polymer/lib/elements/dom-if.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js","./node_modules/@lrnwebcomponents/media-behaviors/media-behaviors.js"],function(_exports,_require,_polymerElement,_simpleColors,_renderStatus,_HAXWiring,_a11yBehaviors,_domRepeat,_domIf,_schemaBehaviors,_mediaBehaviors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.VideoPlayer=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_029be740ab1711e9b92b47c66a4487f9(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>\n:host {\n  display: block;\n  margin: 0 0 15px;\n}\n.video-caption {\n  font-style: italic;\n  margin: 0;\n  padding: 8px;\n  @apply --video-player-caption-theme;\n}</style>\n<div style$=\"[[playerStyle]]\">\n<template is=\"dom-if\" if=\"[[isA11yMedia]]\" restamp>\n  <a11y-media-player\n    accent-color$=\"[[accentColor]]\"\n    audio-only$=\"[[audioOnly]]\"\n    dark$=\"[[dark]]\"\n    dark-transcript$=\"[[darkTranscript]]\"\n    disable-interactive$=\"[[disableInteractive]]\"\n    hide-timestamps$=\"[[hideTimestamps]]\"\n    hide-transcript$=\"[[hideTiranscript]]\"\n    lang$=\"[[lang]]\"\n    media-type$=\"[[sourceType]]\"\n    preload$=\"[[preload]]\"\n    media-title$=\"[[mediaTitle]]\"\n    sources$=\"[[sourceData]]\"\n    stand-alone$=\"[[__standAlone]]\"\n    sticky-corner$=\"[[stickyCorner]]\"\n    thumbnail-src$=\"[[thumbnailSrc]]\"\n    tracks$=\"[[trackData]]\"\n    crossorigin$=\"[[crossorigin]]\"\n    youtube-id$=\"[[youtubeId]]\"\n  >\n    <template id=\"sources\" is=\"dom-repeat\" items=\"[[sourceData]]\" as=\"sd\" restamp>\n      <source src$=\"[[sd.src]]\" type$=\"[[sd.type]]\" />\n    </template>\n    <template id=\"tracks\" is=\"dom-repeat\" items=\"[[trackData]]\" as=\"track\" restamp>\n      <track\n        src$=\"[[track.src]]\"\n        kind$=\"[[track.kind]]\"\n        label$=\"[[track.label]]\"\n        srclang$=\"[[track.lang]]\"\n      />\n    </template>\n    <slot name=\"caption\"></slot>\n  </a11y-media-player>\n</template>\n<template is=\"dom-if\" if=\"[[!isA11yMedia]]\">\n  <template is=\"dom-if\" if=\"[[sandboxed]]\">\n    <div class=\"responsive-video-container\" lang$=\"[[lang]]\">\n      <webview\n        resource$=\"[[schemaResourceID]]-video\"\n        src$=\"[[sourceData.0.src]]\"\n        width$=\"[[width]]\"\n        height$=\"[[height]]\"\n        frameborder=\"0\"\n      ></webview>\n    </div>\n  </template>\n  <template is=\"dom-if\" if=\"[[!sandboxed]]\">\n    <template is=\"dom-if\" if=\"[[iframed]]\">\n      <div class=\"responsive-video-container\" lang$=\"[[lang]]\">\n        <iframe\n          resource$=\"[[schemaResourceID]]-video\"\n          src$=\"[[sourceData.0.src]]\"\n          width$=\"[[width]]\"\n          height$=\"[[height]]\"\n          frameborder=\"0\"\n          webkitallowfullscreen=\"\"\n          mozallowfullscreen=\"\"\n          allowfullscreen=\"\"\n        ></iframe>\n      </div>\n    </template>\n  </template>\n  <div id=\"videocaption\" class$=\"video-caption\">\n    <p>\n      [[mediaTitle]]\n      <span class=\"media-type print-only\">(embedded media)</span>\n    </p>\n    <slot name=\"caption\"></slot>\n  </div>\n</template>"]);_templateObject_029be740ab1711e9b92b47c66a4487f9=function _templateObject_029be740ab1711e9b92b47c66a4487f9(){return data};return data}/**
 * `video-player`
 * `A simple responsive video player with ridiculously powerful backing`
 *
 * @microcopy - language worth noting:
 * - `video source` - url / link to the video file
 * ```
<video-player 
  accent-color$="[[accentColor]]"                 // Optional accent color for controls, 
                                                  // using the following materialize colors: 
                                                  // red, pink, purple, deep-purple, indigo, blue, 
                                                  // light blue, cyan, teal, green, light green, lime, 
                                                  // yellow, amber, orange, deep-orange, and brown. 
                                                  // Default is null. 
  dark$="[[dark]]"                                // Is the color scheme dark? Default is light. 
  dark-transcript$="[[darkTranscript]]"           // Use dark theme on transcript? Default is false, even when player is dark.   
  disable-interactive$="[[disableInteractive]]"   // Disable interactive cues?
  height$="[[height]]"                            // The height of player
  hide-timestamps$="[[hideTimestamps]]"           // Hide cue timestamps?
  lang$="[[lang]]"                                // The language of the media
  media-title$="[[mediaTitle]]"                   // The title of the media
  source$="[[source]]"                            // The source URL of the media
  sticky-corner$="[[stickyCorner]]"               // When user scrolls a playing video off-screen, 
                                                      which corner will it stick to? Values are: 
                                                      top-right (default), top-left, bottom-left, bottom-right, 
                                                      and none (to turn sticky off)
  thumbnail-src$="[[thumbnailSrc]]"               // Optional thumbanil/cover image url
  width$="[[width]]">                              // The width of the media             
  <div slot="caption">Optional caption info.</div>
</video-player>```
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var VideoPlayer=/*#__PURE__*/function(_MediaBehaviorsVideo){babelHelpers.inherits(VideoPlayer,_MediaBehaviorsVideo);babelHelpers.createClass(VideoPlayer,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_029be740ab1711e9b92b47c66a4487f9())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Video player",description:"This can present video in a highly accessible manner regardless of source.",icon:"av:play-circle-filled",color:"red",groups:["Video","Media"],handles:[{type:"video",source:"source",title:"caption",caption:"caption",description:"caption",color:"primaryColor"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"accentColor",title:"Accent color",description:"Select the accent color for the player.",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{attribute:"dark",title:"Dark theme",description:"Enable dark theme for the player.",inputMethod:"boolean",icon:"invert-colors"}],configure:[{property:"source",title:"Source",description:"The URL for this video.",inputMethod:"haxupload",icon:"link",required:!0,validationType:"url"},{property:"track",title:"Closed captions",description:"The URL for the captions file.",inputMethod:"textfield",icon:"link",required:!0,validationType:"url"},{property:"thumbnailSrc",title:"Thumbnail image",description:"Optional. The URL for a thumbnail/poster image.",inputMethod:"textfield",icon:"link",required:!0,validationType:"url"},{property:"mediaTitle",title:"Title",description:"Simple title for under video",inputMethod:"textfield",icon:"av:video-label",required:!1,validationType:"text"},{property:"accentColor",title:"Accent color",description:"Select the accent color for the player.",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{attribute:"dark",title:"Dark theme",description:"Enable dark theme for the player.",inputMethod:"boolean",icon:"invert-colors"}],advanced:[{property:"darkTranscript",title:"Dark theme for transcript",description:"Enable dark theme for the transcript.",inputMethod:"boolean"},{property:"hideTimestamps",title:"Hide timestamps",description:"Hide the time stamps on the transcript.",inputMethod:"boolean"},{property:"preload",title:"Preload source(s).",description:"How the sources should be preloaded, i.e. auto, metadata (default), or none.",inputMethod:"select",options:{preload:"Preload all media",metadata:"Preload media metadata only",none:"Don't preload anything"}},{property:"stickyCorner",title:"Sticky Corner",description:"Set the corner where a video plays when scrolled out of range, or choose none to disable sticky video.",inputMethod:"select",options:{none:"none","top-left":"top-left","top-right":"top-right","bottom-left":"bottom-left","bottom-right":"bottom-right"}},{property:"sources",title:"Other sources",description:"List of other sources",inputMethod:"array",properties:[{property:"src",title:"Source",description:"The URL for this video.",inputMethod:"textfield"},{property:"type",title:"Type",description:"Media type data",inputMethod:"select",options:{"audio/aac":"acc audio","audio/flac":"flac audio","audio/mp3":"mp3 audio","video/mp4":"mp4 video","video/mov":"mov video","audio/ogg":"ogg audio","video/ogg":"ogg video","audio/wav":"wav audio","audio/webm":"webm audio","video/webm":"webm video"}}]},{property:"tracks",title:"Track list",description:"Tracks of different languages of closed captions",inputMethod:"array",properties:[{property:"kind",title:"Kind",description:"Kind of track",inputMethod:"select",options:{subtitles:"subtitles"/*,
              Future Features
              'description': 'description',
              'thumbnails': 'thumbnails',
              'interactive': 'interactive',
              'annotation': 'annotation'*/}},{property:"label",title:"Label",description:"The human-readable name for this track, eg. \"English Subtitles\"",inputMethod:"textfield"},{property:"src",title:"Source",description:"Source of the track",inputMethod:"textfield"},{property:"srclang",title:"Two letter, language code, eg. 'en' for English, \"de\" for German, \"es\" for Spanish, etc.",description:"Label",inputMethod:"textfield"}]}]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={/**
   * Is the media an audio file only?
   */audioOnly:{type:Boolean,value:!1},/**
   * Optional accent color for controls,
   * using the following materialize "colors":
   * red, pink, purple, deep-purple, indigo, blue,
   * light blue, cyan, teal, green, light green, lime,
   * yellow, amber, orange, deep-orange, and brown.
   * Default is null.
   */accentColor:{type:String,value:null,reflectToAttribute:!0},/**
   * Cross origin flag for transcripts to load
   */crossorigin:{type:Boolean,value:!1,reflectToAttribute:!0},/**
   * Enables darker player.
   */dark:{type:Boolean,value:!1,reflectToAttribute:!0},/**
   * Use dark theme on transcript? Default is false, even when player is dark.
   */darkTranscript:{type:Boolean,value:!1},/**
   * disable interactive mode that makes the transcript clickable
   */disableInteractive:{type:Boolean,value:!1},/**
   * The height of the media player for non-a11y-media.
   */height:{type:String,value:null},/**
   * show cue's start and end time
   */hideTimestamps:{type:Boolean,value:!1},/**
   * hide the transcript by default
   */hideTranscript:{type:Boolean,value:!1},/**
   * Computed if this should be in an iframe or not.
   */iframed:{type:Boolean,computed:"_computeIframed(sourceData, sandboxed)"},/**
   * Computed if this should be in a11y-media-player.
   */isA11yMedia:{type:Boolean,computed:"_computeA11yMedia(sourceType, sandboxed)"},/**
   * The type of source, i.e. "local", "vimeo", "youtube", etc.
   */isYoutube:{type:Boolean,computed:"_computeYoutube(sourceType)"},/**
   * The language of the media
   */lang:{type:String,value:"en"},/**
   * Simple caption for the video
   */mediaTitle:{type:String},/**
   * What to preload for a11y-media-player: auto, metadata (default), or none.
   */preload:{type:String,value:"metadata"},/* *
     * Responsive video, calculated from not-responsive.
     * /
    "responsive": {
      "type": Boolean,
      "reflectToAttribute": true,
      "value": true,
    },*/ /**
   * Compute if this is a sandboxed system or not
   */sandboxed:{type:Boolean,computed:"_computeSandboxed(sourceData)"},/**
   * Source of the video
   */source:{type:String,value:null,reflectToAttribute:!0},/**
   * Source of the video
   */sources:{type:Array,value:[]},/**
   * List of source objects
   */sourceData:{type:Array,computed:"_getSourceData(source,sources,trackData)"},/**
   * The type of source, i.e. "local", "vimeo", "youtube", etc.
   */sourceType:{type:String,computed:"_computeSourceType(sourceData)"},/**
   * When playing but scrolled off screen, to which corner does it "stick":
   * top-left, top-right, bottom-left, bottom-right, or none?
   * Default is "top-right". "None" disables stickiness.
   */stickyCorner:{type:String,value:"top-right",reflectToAttribute:!0},/**
   * The url for a single subtitle track
   */track:{type:String,value:null},/**
   * Array of text tracks
   * [{
   *  "src": "path/to/track.vtt",
   *  "label": "English",
   *  "srclang": "en",
   *  "kind": "subtitles",
   * }]
   */tracks:{type:Array,value:[]},/**
   * Cleaned array of text tracks
   * [{
   *  "src": "path/to/track.vtt",
   *  "label": "English",
   *  "srclang": "en",
   *  "kind": "subtitles",
   * }]
   */trackData:{type:Array,computed:"_getTrackData(track,tracks)"},/**
   * Source of optional thumbnail image
   */thumbnailSrc:{type:String,value:null,reflectToAttribute:!0},/* *
     * Calculate vimeo color based on accent color.
     * /
    "vimeoColor": {
      "type": String,
      "computed": getVimeoColor(dark,accentColor),
    }, 
    */ /**
   * The width of the media player for non-a11y-media.
   */width:{type:String,value:null},/**
   * The type of source, i.e. "local", "vimeo", "youtube", etc.
   */youtubeId:{type:String,computed:"_computeYoutubeId(source,sourceType)"}};if(babelHelpers.get(babelHelpers.getPrototypeOf(VideoPlayer),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(VideoPlayer),"properties",this))}return props}}]);function VideoPlayer(){var _this;babelHelpers.classCallCheck(this,VideoPlayer);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(VideoPlayer).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/a11y-media-player/a11y-media-player.js"],res,rej)});(0,_renderStatus.afterNextRender)(babelHelpers.assertThisInitialized(_this),function(){this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(VideoPlayer.haxProperties,VideoPlayer.tag,this)});return _this}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */babelHelpers.createClass(VideoPlayer,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(VideoPlayer.prototype),"connectedCallback",this).call(this)}/**
   * Get Youtube ID
   */},{key:"_computeYoutubeId",value:function _computeYoutubeId(source,sourceType){if(source!==void 0&&"youtube"===sourceType){return this._computeSRC(source).replace(/(https?:\/\/)?(www.)?youtube(-nocookie)?.com\/embed\//,"")}return!1}/**
   * Determine if it is youtube
   */},{key:"_computeYoutube",value:function _computeYoutube(sourceType){return"youtube"===sourceType}/**
   * Determine if it is compatible with a11y-media-player
   */},{key:"_computeA11yMedia",value:function _computeA11yMedia(sourceType,sandboxed){if(!sandboxed&&("youtube"==sourceType||"local"==sourceType)){return!0}return!1}/**
   * Compute iframed status
   */},{key:"_computeIframed",value:function _computeIframed(sourceData,sandboxed){// make sure we take into account sandboxing as well
// so that we can manage the state effectively
if(0<sourceData.length&&sourceData[0]!==void 0&&window.MediaBehaviors.Video._sourceIsIframe(sourceData[0].src)&&!sandboxed){return!0}return!1}/**
   * Gets cleaned track list
   */},{key:"_getTrackData",value:function _getTrackData(track,tracks){var temp="string"===typeof tracks?JSON.parse(tracks).slice():tracks.slice();if(track!==void 0&&null!==track)temp.push({src:track,srclang:this.lang,label:"en"===this.lang?"English":this.lang,kind:"subtitles"});return temp}/**
   * Gets source and added to sources list
   */},{key:"_getSourceData",value:function _getSourceData(source,sources,trackData){if("string"===typeof sources)sources=JSON.parse(sources);for(var root=this,temp=sources.slice(),i=0;i<temp.length;i++){temp[i].type=temp[i].type!==void 0&&null!==temp[i].type?temp[i].type:this._computeMediaType(temp[i].src);temp[i].src=this._computeSRC(temp[i].src)}if(null!==source){var src=this._computeSRC(source);this.sourceType=this._computeSourceType(src);if("youtube"!==this.sourceType){temp.unshift({src:src,type:this._computeMediaType(src)})}}this.__standAlone=trackData===void 0||null===trackData||1>trackData.length;return temp}/**
   * Compute media type based on source, i.e. 'audio/wav' for '.wav'
   */},{key:"_computeMediaType",value:function _computeMediaType(source){var root=this,audio=["aac","flac","mp3","oga","wav"],video=["mov","mp4","ogv","webm"],type="",findType=function findType(text,data){for(var i=0;i<data.length;i++){if(""===type&&source!==void 0&&null!==source&&-1<source.toLowerCase().indexOf("."+data[i])){if("audio"===text)root.audioOnly=!0;type=text+"/"+data[i]}}};findType("audio",audio);findType("video",video);return type}/**
   * Compute sandboxed status
   */},{key:"_computeSandboxed",value:function _computeSandboxed(sourceData){// we have something that would require an iframe
// see if we have a local system that would want to sandbox instead
if(0<sourceData.length&&sourceData[0]!==void 0&&window.MediaBehaviors.Video._sourceIsIframe(sourceData[0].src)){// fake the creation of a webview element to see if it's valid
// or not.
var test=document.createElement("webview");// if this function exists it means that our deploy target
// is in a sandboxed environment and is not able to run iframe
// content with any real stability. This is beyond edge case but
// as this is an incredibly useful tag we want to make sure it
// can mutate to work in chromium and android environments
// which support such sandboxing
if("function"===typeof test.reload){return!0}}return!1}/**
   * Compute video type based on source
   */},{key:"_computeSourceType",value:function _computeSourceType(sourceData){var root=this;if(0<sourceData.length&&sourceData[0]!==void 0&&babelHelpers.typeof(sourceData[0].src)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){return window.MediaBehaviors.Video.getVideoType(sourceData[0].src)}else{return null}}/**
   * Compute src from type / source combo.
   * Type is set by source so this ensures a waterfall
   * of valid values.
   */},{key:"_computeSRC",value:function _computeSRC(source){if(null!==source&&babelHelpers.typeof(source)!==void 0){var type=this.sourceType!==void 0?this.sourceType:window.MediaBehaviors.Video.getVideoType(source);// ensure that this is a valid url / cleaned up a bit
source=window.MediaBehaviors.Video.cleanVideoSource(source,type);if("vimeo"==type){if(this.vimeoTitle){source+="?title=1"}else{source+="?title=0"}if(this.vimeoByline){source+="&byline=1"}else{source+="&byline=0"}if(this.vimeoPortrait){source+="&portrait=1"}else{source+="&portrait=0"}if(babelHelpers.typeof(this.videoColor)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){source+="&color="+this.videoColor}}else if("dailymotion"==type){source+="&ui-start-screen-info=false";source+="&ui-logo=false";source+="&sharing-enable=false";source+="&endscreen-enable=false";if(babelHelpers.typeof(this.videoColor)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){source+="&ui-highlight="+this.videoColor}}}return source}/**
   * postProcesshaxNodeToContent - clean up so we don't have empty array data
   */},{key:"postProcesshaxNodeToContent",value:function postProcesshaxNodeToContent(content){content=content.replace(" sources=\"[]\",","");content=content.replace(" tracks=\"[]\",","");return content}}],[{key:"tag",get:function get(){return"video-player"}}]);return VideoPlayer}((0,_mediaBehaviors.MediaBehaviorsVideo)((0,_a11yBehaviors.A11yBehaviors)((0,_schemaBehaviors.SchemaBehaviors)(_simpleColors.SimpleColors))));_exports.VideoPlayer=VideoPlayer;window.customElements.define(VideoPlayer.tag,VideoPlayer)});