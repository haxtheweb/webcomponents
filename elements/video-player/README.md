# &lt;video-player&gt;

> A simple responsive video player with ridiculously powerful backing.

`<video-player>` is an accessible, responsive video player that normalizes
playback across YouTube, Vimeo, Twitch, Sketchfab, and local HTML5 sources
(MP4, WebM, Ogg, and audio). It extends the DDD design system and mixes in
intersection observation, media behaviors, schema behaviors (OER / schema.org
microdata), and i18n. It is HAX-capable and ships with transcript support,
audio description, learning mode, and sticky-corner picture-in-picture.

This package also includes two supporting elements: `<lecture-anchor>` and
`<lecture-player>` (documented below).

## Usage

To use this web component in your project you can utilize one of the following
styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/video-player/video-player.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/video-player/video-player.js"></script>
```

Minimal example (YouTube):

```html
<video-player
  source="https://www.youtube.com/watch?v=LrS7dqokTLE"
  media-title="Accessible video playback"
></video-player>
```

Local file with captions:

```html
<video-player
  accent-color="blue"
  source="https://example.com/video.mp4"
  track="https://example.com/captions.vtt"
  lang="en"
></video-player>
```

## `<video-player>`

### Properties

Configurable:

| Property | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `source` | `source` | String | `""` | Single video source URL. |
| `sources` | `sources` | Array | `[]` | Array of multiple video sources. |
| `sourceType` | `sourceType` | String | `""` | Source type. |
| `sourceData` | `sourceData` | Object | `null` | Source properties and slotted sources. _(read-only)_ |
| `track` | `track` | String | `null` | URL for a single subtitle track. |
| `tracks` | `tracks` | Array | `[]` | Array of text tracks, e.g. `[{ "src": "...", "label": "English", "srclang": "en", "kind": "subtitles" }]`. |
| `mediaTitle` | `media-title` | String | `null` | Simple caption / title shown below the video. |
| `thumbnailSrc` | `thumbnail-src` | String | `null` | Source of optional poster / thumbnail image. |
| `lang` | `lang` | String | `"en"` | Language of the media. |
| `crossorigin` | `crossorigin` | String | `"anonymous"` | Cross-origin flag for transcripts to load. |
| `dark` | `dark` | Boolean | `false` | Enables darker player. |
| `darkTranscript` | `darkTranscript` | Boolean | `false` | Use dark theme on the transcript (defaults false even when player is dark). |
| `accentColor` | `accent-color` | String | `null` | Optional accent color for controls (deprecated). |
| `height` | `height` | String | `null` | Height of the media player. |
| `width` | `width` | String | `null` | Width of the media player for non-a11y-media. |
| `id` | `id` | String | `null` | Unique id. |
| `playing` | `playing` | Boolean | `false` | Data reactivity for play status from `a11y-media-player`. |
| `allowBackgroundPlay` | `allow-background-play` | Boolean | `false` | Allow playing while the tab is not active. |
| `learningMode` | `learning-mode` | Boolean | `false` | Learning mode (disables fast forward / rewind). |
| `linkable` | `linkable` | Boolean | `false` | Include a share link. |
| `hideTimestamps` | `hide-timestamps` | Boolean | `false` | Hide cue start/end times on the transcript. |
| `hideTranscript` | `hide-transcript` | Boolean | `false` | Hide transcript by default. |
| `hideYoutubeLink` | `hide-youtube-link` | Boolean | `false` | Hide the "Open on YouTube" button. |
| `disableInteractive` | `disableInteractive` | Boolean | `false` | Disable interactive (clickable) transcript mode. |
| `stickyCorner` | `sticky-corner` | String | `"none"` | When playing but scrolled off screen, corner to "stick": `top-left`, `top-right`, `bottom-left`, `bottom-right`, or `none`. |
| `startTime` | `start-time` | Null | `null` | Start time for the video (seconds). |
| `endTime` | `end-time` | Null | `null` | End time for the video (seconds; requires a start time). |
| `audioDescriptionSource` | `audio-description-source` | String | `""` | URL to an audio description track (MP3 file). |
| `audioDescriptionEnabled` | `audio-description-enabled` | Boolean | `false` | Whether audio description is currently enabled. |

Read-only computed:

| Property | Type | Description |
| --- | --- | --- |
| `html5` | — | Gets the HTML5 `audio` or `video` children. _(read-only)_ |
| `iframed` | — | Computes whether the source uses an iframe. _(read-only)_ |
| `isA11yMedia` | — | Determines if the source is compatible with `a11y-media-player`. _(read-only)_ |
| `observer` | — | Mutation observer for tabs. _(read-only)_ |
| `sandboxed` | — | Computes sandboxed status. _(read-only)_ |
| `sourceProperties` | — | Gets the cleaned source list from `source` and `sources`. _(read-only)_ |
| `trackProperties` | — | Gets the cleaned track list from `track` and `tracks`. _(read-only)_ |
| `trackData` | — | Gets the cleaned track list. _(read-only)_ |
| `audioOnly` | — | Whether the source is audio-only. _(read-only)_ |
| `standAlone` | — | Stand-alone status. _(read-only)_ |
| `youtubeId` | — | Gets the YouTube ID from the source string. _(read-only)_ |
| `playerId` | — | Gets an id for `a11y-media-player`. _(read-only)_ |
| `currentTime` | — | Current playback time, mapped from the shadow player. _(read-only)_ |
| `t` | Object | i18n translation strings. |
| `windowControllers` | — | `AbortController` for window event listeners. |

### Attributes

| Attribute | Type | Description |
| --- | --- | --- |
| `source` | String | Single video source URL. |
| `sources` | Array | Array of multiple video sources. |
| `sourceType` | String | Source type. |
| `sourceData` | Object | Source properties and slotted sources. |
| `track` | String | URL for a single subtitle track. |
| `tracks` | Array | Array of text tracks. |
| `media-title` | String | Title shown below the video. |
| `thumbnail-src` | String | Poster / thumbnail image URL. |
| `lang` | String | Language of the media. |
| `crossorigin` | String | Cross-origin flag for transcripts. |
| `dark` | Boolean | Enables darker player. |
| `darkTranscript` | Boolean | Dark theme for the transcript. |
| `disableInteractive` | Boolean | Disable interactive transcript mode. |
| `accent-color` | String | Optional accent color (deprecated). |
| `height` | String | Height of the media player. |
| `width` | String | Width of the media player. |
| `id` | String | Unique id. |
| `playing` | Boolean | Play status reactivity. |
| `allow-background-play` | Boolean | Allow background playback. |
| `learning-mode` | Boolean | Learning mode. |
| `linkable` | Boolean | Include a share link. |
| `hide-timestamps` | Boolean | Hide transcript timestamps. |
| `hide-transcript` | Boolean | Hide transcript by default. |
| `hide-youtube-link` | Boolean | Hide the "Open on YouTube" button. |
| `sticky-corner` | String | Sticky picture-in-picture corner. |
| `start-time` | Null | Start time (seconds). |
| `end-time` | Null | End time (seconds). |
| `audio-description-source` | String | Audio description track URL (MP3). |
| `audio-description-enabled` | Boolean | Whether audio description is enabled. |

### Methods

Public controls:

| Method | Parameters | Description |
| --- | --- | --- |
| `play` | none | Play the media. |
| `pause` | none | Pause the media. |
| `seek` | `time` | Seek to `time` (seconds). |
| `restart` | none | Restart the media from the beginning. |
| `toggleAudioDescription` | none | Toggle audio description on/off. |

HAX lifecycle hooks (invoked by the HAX editor, not consumers):

| Method | Parameters | Description |
| --- | --- | --- |
| `haxHooks` | none | Registers this element's HAX lifecycle hooks. |
| `haxinlineContextMenu` | `ceMenu` | Adds buttons when the element is in-context in HAX. |
| `haxClickTimeCode` | `e` | Handles the "copy current timecode" context action. |
| `haxpostProcessNodeToContent` | `content` | Cleans up empty array data on save. |
| `setSourceData` | none | Triggers an update of `sourceData` when the slot changes. |
| `playEvent` | `e` | Internal play event handler. |
| `pauseEvent` | `e` | Internal pause event handler. |
| `restartEvent` | none | Internal restart event handler. |
| `endTimeTest` | none | Tests/handles end-time boundary. |
| `querySelectorAll` | `query` | Queries slotted light-DOM children. |

No named slots, custom events, or shadow-DOM CSS parts are declared in the
manifest. `<video-player>` accepts slotted `<video>`, `<audio>`, and `<iframe>`
children for progressive enhancement (see the demo).

## `<lecture-anchor>`

### Properties

| Property | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `icon` | `icon` | String | `"icons:flag"` | Icon for the anchor. |
| `target` | `target` | String | `"video-player"` | Target player tag. |
| `associatedID` | `associatedID` | String | `""` | Associated element id. |

### Attributes

| Attribute | Type | Description |
| --- | --- | --- |
| `icon` | String | Icon for the anchor. |
| `value` | Number | Anchor value. |
| `target` | String | Target player tag. |
| `associatedID` | String | Associated element id. |

### Methods

| Method | Parameters | Description |
| --- | --- | --- |
| `clickHandler` | `e` | Handles anchor click. |

## `<lecture-player>`

### Properties

| Property | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `source` | `source` | String | `null` | Video source URL. |
| `open` | `open` | Boolean | `null` | Whether the lecture player is open. |
| `activeIndex` | `activeIndex` | Null | `null` | Active playlist index. |
| `associatedNodes` | `associatedNodes` | Object | `new Object()` | Associated anchor nodes. |
| `videoPlayer` | — | — | `null` | Reference to the inner video player. |
| `videoInterval` | — | Null | `null` | Playback interval handle. |
| `t` | — | Object | `{…}` | i18n translation strings. |

### Attributes

| Attribute | Type | Description |
| --- | --- | --- |
| `source` | String | Video source URL. |
| `open` | Boolean | Whether the player is open. |
| `activeIndex` | Null | Active playlist index. |
| `associatedNodes` | Object | Associated anchor nodes. |

### Methods

| Method | Parameters | Description |
| --- | --- | --- |
| `setJumbotronAttributes` | none | Sets jumbotron attributes. |
| `getNextSiblingHTML` | `element` | Gets the next sibling's HTML. |
| `addPrevNextListeners` | none | Adds previous/next listeners. |
| `updateJumbotron` | none | Updates the jumbotron. |
| `updatePlaylist` | none | Updates the playlist. |
| `seek` | `timestamp` | Seeks to a timestamp. |
| `play` | none | Plays the media. |
| `checkDisabledButtons` | none | Checks whether prev/next buttons should be disabled. |
| `endVideo` | none | Handles end of video. |
| `showModal` | none | Shows the lecture player modal. |

## Use in the HAX editor

`<video-player>` is HAX-capable. In the editor it appears as the **Video** gizmo
(`av:play-circle-filled` icon, tagged `Media` / `youtube` / `vimeo` / `twitch` /
`mp4` / `a11y` / `media-player`, etc.) and supports scaling (50%–100% in 25%
steps) and source editing.

The HAX configuration panel exposes:

| Property | Field | Notes |
| --- | --- | --- |
| `source` | Source (`haxupload`) | URL for the media. |
| `mediaTitle` | Title | Title shown below the video. |
| `thumbnailSrc` | Poster image (`haxupload`) | Poster image URL. |

Advanced settings: `tracks` (array of track files with `src`, `label`,
`srclang`, `kind`), `startTime`, `endTime`, `learningMode`, `hideYoutubeLink`,
`linkable`, `hideTimestamps`, `hideTranscript`, and `audioDescriptionSource`.

## Demo

Run the local demo:

```bash
npm start
```

This starts a development server and opens `demo/index.html`, watching `*.js`
and `lib/*.js` for changes. The demo covers YouTube (with timestamp clipping),
Vimeo, Twitch, local MP4 with multiple track types, audio-only with transcript,
`accent-color`, `dark`, `learning-mode`, `sticky-corner`, and slotted
`<iframe>` / `<video>` progressive enhancement. A separate
`demo/lecture-player.html` demo is available for `<lecture-player>`.

## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)
