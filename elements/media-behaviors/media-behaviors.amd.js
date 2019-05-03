define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MediaBehaviorsVideo=void 0;// ensure MediaBehaviors exists
window.MediaBehaviors=window.MediaBehaviors||{};/**
 * `MediaBehaviors.Video` provides some helper functions for working with video
 * from multiple sources. It helps resolve a video by type and currently supports
 * youtube, vimeo, and a few other sources and helps to determine if we need
 * an iframe to display the media or a local `<video>` tag.
 *
 * This also provides a powerful little utility to clean up embedded
 * URLs that reference popular media sources in order to make sure
 * that their embed URLs are structured correctly. This is especially
 * useful for allowing users to copy and paste links from youtube's URL
 * bar yet actually transform that address into a cookie free embed that
 * strips off the related videos and other options.
 *
 * @polymerBehavior MediaBehaviors.Video
 **/window.MediaBehaviors.Video={/**
   * Compute iframe or video tag for implementation.
   */_sourceIsIframe:function _sourceIsIframe(source){var type=this.getVideoType(source);if("local"==type){return!1}else{return!0}},/**
   * Check source of the video, potentially correcting bad links.
   */cleanVideoSource:function cleanVideoSource(input,type){if("local"!=type){// strip off the ? modifier for youtube/vimeo so we can build ourselves
var tmp=input.split("?"),v="";input=tmp[0];if(2==tmp.length){var tmp2=tmp[1].split("&"),args=tmp2[0].split("="),qry=Array.isArray(tmp2.shift())?tmp2.shift().join(""):tmp2.shift();if("v"==args[0]){var q=qry!==void 0&&""!==qry?"?"+qry:"";v=args[1]+q}}// link to the vimeo video instead of the embed player address
if(-1==input.indexOf("player.vimeo.com")&&-1!=input.indexOf("vimeo.com")){// normalize what the API will return since it is API based
// and needs cleaned up for front-end
if(-1!=input.indexOf("/videos/")){input=input.replace("/videos/","/")}return input.replace("vimeo.com/","player.vimeo.com/video/")}// copy and paste from the URL
else if(-1!=input.indexOf("youtube.com/watch")){return input.replace("youtube.com/watch","youtube.com/embed/")+v}// copy and paste from the URL
else if(-1!=input.indexOf("youtube-no-cookie.com/embed")){return input.replace("youtube-no-cookie.com/embed","youtube.com/embed/")+v}// weird share-ly style version
else if(-1!=input.indexOf("youtu.be")){return input.replace("youtu.be/","www.youtube.com/embed/")+v}// copy and paste from the URL for sketchfab
else if(-1!=input.indexOf("sketchfab.com")&&-1==input.indexOf("/embed")){return input+"/embed"}// copy and paste from the URL for sketchfab
else if(-1!=input.indexOf("dailymotion.com")&&-1==input.indexOf("/embed")){return input.replace("/video/","/embed/video/")}}return input},/**
   * Figure out the type of video based on source.
   */getVideoType:function getVideoType(source){var localFormats=["aac","flac","mov","mp3","mp4","oga","ogg","ogv","wav","webm"],isLocal=!1;// some common ones
if(-1!=source.indexOf("vimeo")){return"vimeo"}else if(-1!=source.indexOf("youtube")||-1!=source.indexOf("youtu.be")){return"youtube"}else if(-1!=source.indexOf("sketchfab.com")){return"sketchfab"}else if(-1!=source.indexOf("dailymotion.com")){return"dailymotion"}for(var i=0;i<localFormats.length;i++){if(!isLocal&&-1<source.toLowerCase().indexOf("."+localFormats[i]))isLocal=!0}// see if it's a direct file reference, otherwise we'll assume it's external
if(isLocal){return"local"}else{// not sure but iframe it for funzies
return"external"}}};var MediaBehaviorsVideo=function MediaBehaviorsVideo(SuperClass){return(/*#__PURE__*/function(_SuperClass){babelHelpers.inherits(_class,_SuperClass);function _class(){babelHelpers.classCallCheck(this,_class);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(_class).apply(this,arguments))}babelHelpers.createClass(_class,[{key:"_sourceIsIframe",value:function _sourceIsIframe(source){var type=this.getVideoType(source);if("local"==type){return!1}else{return!0}}/**
     * Check source of the video, potentially correcting bad links.
     */},{key:"cleanVideoSource",value:function cleanVideoSource(input,type){if("local"!=type){// strip off the ? modifier for youtube/vimeo so we can build ourselves
var tmp=input.split("?"),v="";input=tmp[0];if(2==tmp.length){var tmp2=tmp[1].split("&"),args=tmp2[0].split("="),qry=Array.isArray(tmp2.shift())?tmp2.shift().join(""):tmp2.shift();if("v"==args[0]){var q=qry!==void 0&&""!==qry?"?"+qry:"";v=args[1]+q}}// link to the vimeo video instead of the embed player address
if(-1==input.indexOf("player.vimeo.com")&&-1!=input.indexOf("vimeo.com")){// normalize what the API will return since it is API based
// and needs cleaned up for front-end
if(-1!=input.indexOf("/videos/")){input=input.replace("/videos/","/")}return input.replace("vimeo.com/","player.vimeo.com/video/")}// copy and paste from the URL
else if(-1!=input.indexOf("youtube.com/watch")){return input.replace("youtube.com/watch","youtube.com/embed/")+v}// copy and paste from the URL
else if(-1!=input.indexOf("youtube-no-cookie.com/embed")){return input.replace("youtube-no-cookie.com/embed","youtube.com/embed/")+v}// weird share-ly style version
else if(-1!=input.indexOf("youtu.be")){return input.replace("youtu.be/","www.youtube.com/embed/")+v}// copy and paste from the URL for sketchfab
else if(-1!=input.indexOf("sketchfab.com")&&-1==input.indexOf("/embed")){return input+"/embed"}// copy and paste from the URL for sketchfab
else if(-1!=input.indexOf("dailymotion.com")&&-1==input.indexOf("/embed")){return input.replace("/video/","/embed/video/")}}return input}/**
     * Figure out the type of video based on source.
     */},{key:"getVideoType",value:function getVideoType(source){var localFormats=["aac","flac","mov","mp3","mp4","oga","ogg","ogv","wav","webm"],isLocal=!1;// some common ones
if(-1!=source.indexOf("vimeo")){return"vimeo"}else if(-1!=source.indexOf("youtube")||-1!=source.indexOf("youtu.be")){return"youtube"}else if(-1!=source.indexOf("sketchfab.com")){return"sketchfab"}else if(-1!=source.indexOf("dailymotion.com")){return"dailymotion"}for(var i=0;i<localFormats.length;i++){if(!isLocal&&-1<source.toLowerCase().indexOf("."+localFormats[i]))isLocal=!0}// see if it's a direct file reference, otherwise we'll assume it's external
if(isLocal){return"local"}else{// not sure but iframe it for funzies
return"external"}}}]);return _class}(SuperClass))};_exports.MediaBehaviorsVideo=MediaBehaviorsVideo});