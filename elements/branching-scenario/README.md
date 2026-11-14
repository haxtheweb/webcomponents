# branching-scenario

A story where each choice leads to a different scene and ending. Learners read a scene, choose what they would do, and can step back or start over to try other paths. The activity is not graded; it is scored by the ending reached.

```html
<branching-scenario title="The missing blade guard">
  <branching-scene scene-id="start" id="start" heading="The blade guard is off">
    <p>The table saw's blade guard is off.</p>
    <ul>
      <li><a href="#cut">Make the cut carefully</a></li>
      <li><a href="#tagged">Tag the saw out of service</a></li>
    </ul>
  </branching-scene>
  <branching-scene scene-id="cut" id="cut" heading="Injury" ending="poor" score="0">
    <p>The board kicks back.</p>
  </branching-scene>
  <branching-scene scene-id="tagged" id="tagged" heading="Safe call" ending="good" score="3">
    <p>The saw is tagged out and logged.</p>
  </branching-scene>
</branching-scenario>
```

## How it works

- Scenes are `<branching-scene>` children. A scene holds any content.
- A choice is an ordinary link inside a scene whose `href` is `#` plus the `scene-id` of another scene in the same scenario. Any other link stays a normal link. A link to an unknown scene, or to the scene it is in, is ignored.
- Without JavaScript (and when server rendered) every scene is on the page and the links are page anchors, so give each scene an `id` equal to its `scene-id`. HAX adds it on save when it is missing.
- Once the element runs, only the current scene is shown and the same links move the learner along the path. The light DOM is never changed: the choices get their button look from a small style sheet adopted by the document while the scenario is on the page.
- A choice that leads to a scene already on the path goes back to it, so a path never holds a scene twice.

## `<branching-scenario>`

| Attribute | What it does |
|---|---|
| `title` | Title shown in the header |
| `start` | `scene-id` of the first scene. The first scene when empty |
| `accent-color` | Optional accent (a SimpleColors name such as `blue`) for the chip, buttons and choice edge |

Slot: default, the `<branching-scene>` elements.

Methods: `choose(scene)`, `back()`, `restart()`. Getters: `scenes`, `currentScene`, `path`.

Event: `user-engagement` (bubbles, composed) with `detail.statement`, an xAPI statement.

## `<branching-scene>`

| Attribute | What it does |
|---|---|
| `scene-id` | What choices link to |
| `heading` | Heading of the scene |
| `ending` | `good`, `mixed` or `poor` when the scene ends a path |
| `score` | Score for reaching this ending |

Slot: default, the scene content and its choice links.

## xAPI

| When | Verb | Result |
|---|---|---|
| A choice is made | `progressed` | `completion: false`, `response` = the path so far |
| An ending is reached (once per ending per visit) | `completed` | `completion: true`, `success` true only for a `good` ending, `score.raw` = the ending's score, `score.max` = the highest ending score in the scenario, `response` = the path |

The object is a `sequencing` interaction whose `choices` are the scenes. Scene ids in `result.response` are component ids made from each `scene-id` (`c-` plus 8 hex), joined with `[,]`, so rewording a scene keeps its id. Nothing is sent while HAX is editing. The scenario counts toward page completion and is done when any ending is reached.

## Editing in HAX

The scenario is a grid element: add scenes from its context menu ("Add scene") and write each scene in place. Link choices with the normal link tool, using `#scene-id` as the address. While editing, every scene is shown with its scene id, the start scene is marked, and scenes that no choice links to and links that point to a missing scene are flagged. Where a learner was on the path is never saved.

## Keyboard and accessibility

- Choices are links: Tab to one, Enter to take it.
- Arriving at a scene moves focus to its heading and announces it in a live region ("Scene 2: Kickback").
- "Back one step" and, at an ending, "Try another path" are buttons in the footer. "Start over" and the directions toggle are in the header.
- The path is listed as text ("Path 1, 2, 3 · end") with the count of scenes seen.
- Endings are told apart by an icon, a word and a border style as well as color: good (check, solid), mixed (dash, double), poor (cross, dotted).
- Works at 360px wide and in dark mode; the only motion is the completion burst on the header chip, which does not play with reduced motion.

## Commands

- `yarn test` - run the tests
- `yarn run build` - format, analyze and refresh the docs data
