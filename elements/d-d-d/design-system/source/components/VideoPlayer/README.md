# VideoPlayer

Accessible video playback across multiple sources.

- Package `@haxtheweb/video-player` 26.8.0
- HAX block "Video" (Media, youtube, watch, vimeo, twitch)
- HAX design-system controls offered: card

## Usage

```html
<video-player source="https://www.youtube.com/watch?v=LrS7dqokTLE" data-width="75" data-margin="center"></video-player>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `source` | Source | URL for this media. | haxupload |
| `media-title` | Title | Title shown below the video. | textfield |
| `thumbnail-src` | Poster image | Poster image URL. | haxupload |
| `tracks` | Text tracks | Closed captions, subtitles, descriptions, and other text tracks for the video. | array (advanced) |
| `start-time` | Start time | Start video at a specific time (seconds). | number (advanced) |
| `end-time` | End time | End video at a specific time (seconds), requires a start time. | number (advanced) |
| `learning-mode` | Enable learning mode | Disables fast forward and rewind. | boolean (advanced) |
| `hide-youtube-link` | Remove open on YouTube button | Removes the button for opening the video on YouTube. | boolean (advanced) |
| `linkable` | Include a share link? | Provides a link to share the video. | boolean (advanced) |
| `hide-timestamps` | Hide timestamps | Hide the time stamps on the transcript. | boolean (advanced) |
| `hide-transcript` | Hide Transcript | Hide transcript by default. | boolean (advanced) |
| `audio-description-source` | Audio Description Track | URL to an audio description track (MP3 file) that provides narration of visual elements. | haxupload (advanced) |

## DDD usage

Its source references 24 distinct design-system variables. By family: spacing (11), simple-colors (9), theme (6), font (3), icon (2), boxShadow (1). Most used: `--ddd-spacing-4`, `--ddd-font-primary`, `--ddd-spacing-2`, `--ddd-icon-xs`, `--ddd-spacing-1`, `--ddd-theme-primary`.

## Preview notes

Its demo source is a YouTube video, which the preview frame cannot load; the player chrome still renders.
