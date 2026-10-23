# micro-game-base

The shared shell for short browser games that live inside a page. It is a class, not a tag: a game extends it, draws its own stage, and implements `gameUpdate(dt)`. The shell does the rest.

```js
import { MicroGameBase } from "@haxtheweb/micro-game-base/micro-game-base.js";

class MyGame extends MicroGameBase {
  static get tag() { return "my-game"; }
  static get localesPath() { return new URL("./locales/", import.meta.url).href; }
  gameUpdate(dt) { /* move things, then this.gameComplete({ ms }) when done */ }
  render() {
    return html`<div data-game-stage tabindex="0">
      ${this.renderPlayer({ width: 48, height: 60 })}
      ${this.renderOverlay()} ${this.renderDpad()}
    </div>
    ${this.done ? this.renderFinishPanel({ stats: this.timeText() }) : ""}`;
  }
}
```

`demo/index.html` has a complete game in about 40 lines, and the three included examples.

## What the shell does

- Frame loop, arrow and WASD input, tap to move, N for the next goal, Escape to pause, an on screen pad for touch, and a text selection lock for press and hold.
- Pauses when scrolled out of view, when the tab is hidden, on blur, and while the HAX editor is in edit mode.
- Start, paused and editing overlay; reduced motion.
- `game-start` and `game-complete` events, and `user-engagement` progress events (see below).
- OER Schema through `SchemaBehaviors`: `typeof` plus `renderSchema(description, objectives)`.
- The player character (`renderPlayer`), including the signed in user's own.
- The finish panel (`renderFinishPanel`), confetti, and a copyable prompt.
- Translations.

## Properties

| Property | Attribute | Notes |
| --- | --- | --- |
| `seed` | `seed` | `rpg-character` seed. The same seed makes the same character. |
| `seedFromUser` | `seed-from-user` | Use the signed in person's character when there is one, otherwise `seed`. |
| `hat` | `hat` | `rpg-character` hat. |
| `finishTitle`, `finishText` | `finish-title`, `finish-text` | Heading and message on the finish panel. |
| `finishLead`, `prompt` | `finish-lead`, `prompt` | The copyable prompt and the line above it. Empty `prompt` hides the box and the Copy button. |
| `gameTitle`, `gameId` | `game-title`, `game-id` | Names this game in progress events and markup. |

## Slots on the finish panel

| Slot | What it does |
| --- | --- |
| `finish` | Replaces the default prompt box and Copy button. Use it for a next step, a link, or anything specific to the page. |
| `finish-actions` | Extra buttons or links beside Play again. |

The panel also has `part="finish"` for styling from outside.

## The signed in user's character

HAX draws a person's avatar from their user name everywhere else (`rpg-character seed="${userName}"`). With `seed-from-user`, the game reads that same name from the HAXcms store (`globalThis.HAXCMS.instance.store.userData.userName`) when it connects, when play starts, and shortly after a `jwt-logged-in` event. Nobody signed in, or no HAXcms on the page, falls back to `seed`. A site with another source for the name overrides `resolveUserSeed()`, or just sets `seed` itself.

## Progress events

`emitProgress(verb, extra)` dispatches `user-engagement` (bubbles, composed), the same event the HAX quiz and checklist elements use. `activityDisplay` is the verb: `attempted`, `experienced`, `answered`, `progressed` or `completed`. Also sent: `objectName`, `objectId`, `game` (the tag), `schemaType`, `timestamp`, and whatever the game adds (`resultSuccess`, `resultScore`, `resultDuration`, `attempt`, ...). `gameComplete({ ms, event, progress, confetti })` sends `game-complete` and the `completed` event together.

## Translations

The shell strings are in `this.t` (start, paused, copy, play again, ...). A game adds its own strings to `this.t` in its constructor and returns its locales folder from `static get localesPath()`. The base registers it with the i18n manager the first time the element connects. The manager allows one registration per element, so locale files stay one set per tag, and each game's files translate the shell strings too.

## Included examples

The package ships three small games built on the base, as `lib/` elements. They show what the base can do and are a starting point for a real game. Each could move into its own package later.

| Tag | Import | What it is |
| --- | --- | --- |
| `concept-map-game` | `@haxtheweb/micro-game-base/lib/concept-map-game.js` | A character walks to each concept on a map and it explains itself. Touch them all for confetti. |
| `concept-runner-game` | `@haxtheweb/micro-game-base/lib/concept-runner-game.js` | A 20 second side scroller. The character runs on fire. Jump to grab the good concepts and over the bad ones, then see a recap. |
| `concept-quest-game` | `@haxtheweb/micro-game-base/lib/concept-quest-game.js` | An overworld. Concepts find you and ask a question. Answer right to unlock their house. Extends `concept-map-game`. |

**They have no content of their own.** A blank `<concept-map-game>` shows "Nothing to play yet". The content in the demo and the content HAX inserts is each game's `demoSchema` in `lib/<tag>.haxProperties.json`. Games return `true` from `isEmpty` when there is nothing to play.

Content properties: `nodes` (map and quest: `label`, `link`, `text`, `glyph`, `url`, and for the quest `question`, `choices` with the right answer first, `hint`), `items` (runner: `label`, `kind` of `good` or `bad`, `text`), `hubLabel`, `quest`, `questTitle`. Settings: `hearts` (quest, default 3), `duration` (runner, seconds, default 20), `passScore` (runner), `slow` (runner).

Events beyond the base: `concept-visited`, `concept-encounter`, `concept-answered`, `item-resolved`. The `completed` progress event carries `resultScore`, and the quest adds `tries` and `review`.

## Hooks a game can override

`gameUpdate(dt)`, `gameNext()`, `gameAction()`, `gameTap(point)`, `resolveUserSeed()`, `_reset()`, `labels`, and the render helpers above.

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
