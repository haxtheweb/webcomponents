# memory-match

A memory game: cards are dealt face down and the learner turns over two at a time to find the pairs.

A pair is usually a **term and its meaning**, so a match shows the learner knows which meaning goes with which term, not only where a picture was. Two matching texts or images also work.

```html
<memory-match title="Match the term to its job">
  <dl>
    <dt>alt</dt>
    <dd>Text alternative for an image</dd>
    <dt>aria-live</dt>
    <dd>Announces changes to screen readers</dd>
    <dt><img src="nav.svg" alt="A row of links" /></dt>
    <dd>Landmark for the main links</dd>
  </dl>
</memory-match>
```

It is ungraded: there is no wrong answer to record, only pairs found. The number of moves is shown to the learner and is not sent anywhere.

## How it plays

- Cards are buttons. Choose one, then another.
- If they belong together they stay face up and are marked **Matched** (the correct status: green solid edge, a check icon and the word).
- If they do not, **they stay face up until the learner chooses any card**. Nothing flips back on a timer, so slow readers and screen reader users have as long as they need. Choosing a card turns the two back and turns the chosen one.
- Each pair of turns is one move. The count is text in the header.
- Start over deals the cards again in a new order.

Cards are shuffled on every visit with `crypto.getRandomValues` (never `Math.random`), in a lifecycle method, so `render()` stays deterministic.

## Attributes and properties

| Attribute | Property | Type | Default | What it does |
| --- | --- | --- | --- | --- |
| `title` | `title` | String | `""` | Visible title or prompt in the block header. |
| | `pairs` | Array of `{ a, aImage, aAlt, b, bImage, bAlt }` | from light DOM | The pairs. Read from the `<dt>` / `<dd>` elements; setting it (the HAX form does) rewrites that list. Never saved as an attribute. |
| `accent-color` | `accentColor` | String | `""` | Optional accent for the header chip, the card backs and the button. The names `DDDAccent` maps (`blue`, `teal`, `purple`, ...). |
| `id` / `resource` | | String | | Either one keys the learner record. Without them the key is a hash of the title and the pairs. |

## Content (light DOM)

A `<dl>`: each `<dt>` is one card and the `<dd>` right after it is its partner. A side is text, an `<img>` with `alt`, or both. It is not slotted and play never changes it, so what is saved is exactly what was authored. Without JavaScript the page shows the plain list of terms and meanings.

- A pair with an empty side is left out (and counted in a note while editing).
- Image addresses must be `http:`, `https:` or relative; anything else is not loaded.
- Keep images small. They are shown at most 64px tall on a light plate, so dark line art also shows in dark mode.
- Give every image an `alt`. A card with only an image is announced by its `alt`.

## Methods

- `turnCard(index)`: what choosing a card does (index is its position on the board, from 0).
- `startOver()`: deal again and clear the matches and the move count.
- `restoreLearnerResponse(response)` / `forgetLearnerResponse()`: show the pairs of a saved response as matched, or forget them.

## Events

| Event | When | Detail |
| --- | --- | --- |
| `user-engagement` | A pair is found (`progressed`); every pair is found (`completed`, once per visit). Bubbles, composed. Never while HAX is editing. | `{ activityDisplay, objectName, resultCompletion, statement }` |
| `learner-progress-request` | On `window`, when the visitor view loads and when a `learner-progress-ready` event is heard. | `{ activityId, tag, record }`; a listener sets `record` and the ids in `record.response` are shown as matched. |

It also listens for `learner-progress-cleared` on `window` and clears itself.

## xAPI

| | |
| --- | --- |
| Verbs | `progressed`, `completed` |
| Activity type | `http://adlnet.gov/expapi/activities/simulation` |
| `result.response` | Ids of the pairs matched so far, joined by `[,]`. An id is `c-` plus 8 hex of the pair's content; never the text. |
| `result.completion` | `true` when every pair is matched. |
| `result.extensions` | `https://haxtheweb.org/xapi/extensions/progress` = pairs matched / pairs. |
| Counts toward completion | Yes. Done = every pair matched. |

Moves are not in the statement: there is no existing extension for them and this element does not create one.

## HAX

- Configure: the title and the pairs (first card text, image and image description; second card text, image and image description).
- While editing, every pair is shown face up, side by side and in authored order, and play is paused. Learner state is never shown or saved while editing.

## Styling

Colours come from DDD tokens and follow dark mode. The header chip, the card backs and the Start over button take the palette roles (`--ddd-palette-chip`, `--ddd-palette-accent`), then `accent-color` on the element. Matched cards use the status tokens (`--ddd-status-correct-*`), never the accent.

## Keyboard and screen readers

- Every card is a native button: Tab moves between cards, Enter or Space turns one. Focus stays on the card that was chosen.
- A face down card reads "Card 3, face down". A face up card reads "Card 3," and its text or image description, and "Matched" when it is.
- Every turn is spoken through a status region that is also visible in the footer: "Card 3: alt.", "Match: alt and Text alternative for an image.", "No match: alt and Sets the page's language. Choose any card to turn them back."
- Positions are part of the game, so cards are numbered in reading order and keep their number until Start over.

## Phone width

Four columns, two when the block is 480px wide or less. Cards are at least 88px tall and text wraps inside the card.

## Motion

Cards do not flip or fade. The only motion is the shared completion burst on the header chip the first time the game is finished, and nothing moves with reduced motion.
