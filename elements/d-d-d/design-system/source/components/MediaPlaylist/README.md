# MediaPlaylist

A playlist that presents video and audio players in a player + sidebar layout.

- Package `@haxtheweb/media-playlist` 26.8.0
- HAX block "Media Playlist" (Media, video, audio, playlist, player)
- HAX design-system controls offered: accent, primary, card, text

## Usage

```html
<media-playlist><video-player source="https://www.youtube.com/watch?v=LrS7dqokTLE" media-title="01 The Problem" thumbnail-src="media/card-1.jpg"></video-player><video-player source="https://www.youtube.com/watch?v=LrS7dqokTLE" media-title="02 Drupal ELMS" thumbnail-src="media/card-2.jpg"></video-player><audio-player source="https://archive.org/download/tvtunes_4710/Jonny%20Quest.mp3" media-title="03 Podcast Episode" thumbnail-src=""></audio-player></media-playlist>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `active-index` | Active index | Index of the active item to start on. | number |
| `for-course` | Course | The Course this playlist is meant for (course identifier or URL). | textfield |

## DDD usage

Its source references 20 distinct design-system variables. By family: theme (20), spacing (13), font (7), radius (3), border (1). Most used: `--ddd-spacing-2`, `--ddd-theme-default-coalyGray`, `--ddd-theme-default-white`, `--ddd-theme-default-limestoneLight`, `--ddd-theme-default-black`, `--ddd-spacing-0`.

## Preview notes

Items point at YouTube videos, which the preview frame cannot play.
