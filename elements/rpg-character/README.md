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

## Character codes

Every character can be saved as a short **code** and recreated exactly:

```js
const code = document.querySelector("rpg-character").toCode(); // "1-0103...~PSU"
```

```html
<rpg-character code="1-0103000000000000000a0000000000000a~PSU"></rpg-character>
```

- A code records the seed-derived look (skin, hair, face...) plus every choice: `preset`, `hat`, `mask`, `makeup`, `item`, `offhand`, `feet`, `pet`, `shaved`, `fire`, `circle`, `expression`, `pose` and `flag-text`.
- A code wins over `seed`; any attribute you set explicitly still wins over the code, so editing one setting never fights a saved code. Clearing `code` falls back to the seed.
- `encodeCharacter()`, `decodeCharacter()` and `codeSlots` are exported for tools that build characters without rendering one.
- The slot registry in `lib/rpg-character-code.js` is **append-only**: add new options at the end of their slot, new slots at the end of the list, and never reorder or remove, or saved codes change meaning. Tests fail if a new option is missing from the registry or the order changes.

## Expressions and poses

- `expression`: `happy`, `sad`, `surprised`, `angry`, `sleepy`, `wink`, drawn over the face.
- `pose`: `wave` (right arm up) or `cheer` (both arms up). Raised arms take the character's skin tone, and a raised hand puts down whatever it was holding (`item` for the right hand, `offhand` for the left).

These are drawn as cells in the element rather than image files, so they can match any skin. The data lives in `lib/rpg-character-overlays.js`.

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