# &lt;rpg-character&gt;

Character
> Little RPG character that&#39;s remixable

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/rpg-character/rpg-character.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/rpg-character/rpg-character.js"></script>
```

## Named characters

There are 65 named character types (`preset`): jobs, sports, holidays, monsters and pop-culture archetypes. [`CHARACTERS.md`](./CHARACTERS.md) has the image of all of them and the full list with each one's default pieces and code. `demo/characters.html` shows them live. Regenerate both with `node scripts/roster.mjs` (dev server running) after adding a preset.

## How many characters are there?

Every visual choice is independent, so the count is a product. Each factor is the number of different ways that part of the character can be drawn. The factors are:

```
looks = head × skin × face × faceItem × accessories × outfit
      × (2·hats − 1) × masks × pets × expressions × 2 (circle) × feet
      × (items·offhands + offhands + 1)
```

What each factor means:

- **head** = 1 + hatColors + hatColors × hairs. A shaved head is one bald look. Otherwise the seed's hat color shows, and hair only shows on base 1.
- **face** = faces + makeups. Makeup replaces the seed's face.
- **outfit** = shirts × pants + presets. A preset replaces both the shirt and the pants.
- **2·hats − 1**: hats are counted with and without fire, except that fire with no hat draws the coffee hat, which is already counted.
- **items·offhands + offhands + 1**: standing still holds both hands' items, a wave drops the right-hand item, and a cheer drops both.

With today's options that is 111 × 10 × 21 × 10 × 10 × 165 × 121 × 12 × 11 × 7 × 2 × 4 × 177 = **60,890,117,571,360,000**, about 61 quadrillion different-looking characters. A seed alone gives 66 million of them. Character codes can spell 239,738,895,728,640,000,000 combinations (about 2.4 × 10²⁰), because a code also records choices that end up hidden, such as hair on base 0.

`scripts/roster.mjs` recomputes these numbers from the registry into `CHARACTERS.md`, so they grow as options are added.

What the count leaves out:

- **Pieces that overlap:** they count as different, even when one partly covers another, such as a mask over glasses.
- **Flag text:** it is free text, so it would make the count unbounded.
- **Other things:** `hat="random"`, seasonal mode (it only picks existing looks), the walking animation, and size or accent color.

## Character codes

Every character can be saved as a short **code** and recreated exactly:

```js
const code = document.querySelector("rpg-character").toCode(); // "1-0103...~PSU"
```

```html
<rpg-character code="1-0103000000000000000a0000000000000a~PSU"></rpg-character>
```

- A code records the seed-derived look (skin, hair, face...) plus every choice: `preset`, `hat`, `mask`, `makeup`, `item`, `offhand`, `feet`, `pet`, `shaved`, `fire`, `circle`, `expression`, `pose`, `seasonal` and `flag-text`.
- A code wins over `seed`; any attribute you set explicitly still wins over the code, so editing one setting never fights a saved code. Clearing `code` falls back to the seed.
- `encodeCharacter()`, `decodeCharacter()` and `codeSlots` are exported for tools that build characters without rendering one.
- The slot registry in `lib/rpg-character-code.js` is **append-only**: add new options at the end of their slot, new slots at the end of the list, and never reorder or remove, or saved codes change meaning. Tests fail if a new option is missing from the registry or the order changes.

## Expressions and poses

- `expression`: `happy`, `sad`, `surprised`, `angry`, `sleepy`, `wink`, drawn over the face.
- `pose`: `wave` (right arm up) or `cheer` (both arms up). Raised arms take the character's skin tone, and a raised hand puts down whatever it was holding (`item` for the right hand, `offhand` for the left).

These are drawn as cells in the element rather than image files, so they can match any skin. The data lives in `lib/rpg-character-overlays.js`.

## Seasonal mode

Add `seasonal` and the character dresses up on its own, unless a character type (`preset`) or hat is chosen:

| When | Costume |
|---|---|
| Oct 15 to 31 | a Halloween preset (witch, vampire, mummy, skeleton, ghost, pumpkin, zombie) |
| Dec 1 to 25 | a Christmas preset (santa, elf, reindeer, snowman) |
| Easter week (computed each year) | easter-bunny |
| Jul 1 to 4 | colonial |
| Dec 31 and Jan 1 | party hat |

The costume is picked from the seed, so a person keeps the same one all season. A character code records the `seasonal` opt-in but never the costume itself. `seasonal-date="YYYY-MM-DD"` previews a day.

## Character builder

`<rpg-character-builder>` is a form with a live preview for picking every part of a character. Its `code` property is the result. It fires `value-changed` (with `detail.value`) on every change, and setting `code` loads a character into it.

```js
import "@haxtheweb/rpg-character/lib/rpg-character-builder.js";
```

```html
<rpg-character-builder seed="btopro"></rpg-character-builder>
```

Option labels come from rpg-character's own HAX settings and their translations; the builder's own words live in `locales/rpg-character-builder.*.json`. See `demo/builder.html`.

## Saved avatars

`lib/rpg-character-avatar.js` stores a person's avatar as a character code: `loadAvatarCode(userName, userData)` prefers a backend-supplied `userData.avatarCode`, otherwise the copy saved in this browser; `saveAvatarCode(userName, code)` saves it and fires `rpg-character-avatar-changed` on `globalThis` (`detail: { userName, code }`) so every avatar on the page updates and a backend integration can persist it. HAX's user menu ("Customize character") uses this.

## Adding art

Every layer is a 113x142 SVG on a 22 x 28 grid of 5px cells with a 1-cell black outline. Two scripts help keep new pieces in that style:

- `scripts/pixel-art.py` draws pieces as character grids, adds the outline and writes the SVG. `--read` prints existing layers as ASCII so you can line a new piece up with its neighbors.
- `scripts/preview.mjs` renders a contact sheet of characters with the real element (run `yarn start` first), and fails if any art file 404s.

A preset (`presets` in `rpg-character.js`) names an outfit (`lib/shirt/<preset>.svg` + `lib/pants/<preset>.svg`) and may default any gear slot. It can also set `shaved: true` when its hat is a hairstyle that leaves the top of the head showing.

New options are always appended to the end of their list in `lib/rpg-character-code.js`, never inserted or removed, so saved character codes keep their meaning. Each new option also needs its label in `lib/rpg-character.haxProperties.json` and every `locales/rpg-character.haxProperties.*.json`, plus a test.

## Develop / Demo
Running `npm start` will start a local development server and open your default browser to display it. It will start watching *.js and lib/*.js files for changes automatically for your demo.
```bash
npm start
```


## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Character

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)