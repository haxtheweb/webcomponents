# &lt;sorting-question&gt;

Question
> sorting questions to be in the right order when they are randomized.

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/sorting-question/sorting-question.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/sorting-question/sorting-question.js"></script>
```

## Layout

Answers are a vertical list by default. Add `layout="cards"` to present them as a row of image cards that wraps to fewer columns on narrow screens. Every card shows its position, the image and label, and a move earlier and a move later button; dragging with a mouse also works, and each move is announced. Scoring, saved content and the xAPI statement are the same in both layouts.

```html
<sorting-question question="How a plant grows" layout="cards">
  <input value="Seed" data-image="seed.svg" data-image-alt="Seed in soil" />
  <input value="Sprout" data-image="sprout.svg" data-image-alt="Sprout with two leaves" />
  <input value="Flower" data-image="flower.svg" data-image-alt="Flowering plant" />
</sorting-question>
```

## Develop / Demo
Running `npm start` will start a local development server and open your default browser to display it. It will start watching *.js and lib/*.js files for changes automatically for your demo.
```bash
$ npm start
```


## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Question

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)