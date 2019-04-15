# &lt;dynamic-importer&gt;

Dynamic importer
> Class mixin to make dynamic imports dropdead simple

## What
This is a class mixin that makes it easier to do timing on non-critical elements. This class mix-in can reduce your time to first paint by ensuring that elements that you utilize in shadow dom don't
require the references be entirely globbed together via the ES Module tree spider.

## Why
ES Modules require tracing the entire path in javascript before any of it is executed. This means that the entire modular package needs to be known before any of it runs. This is great for modularity but can be poor for larger apps, especially with things like web components that bundle visual with function.

## How
This class mix-in takes an object and then delays execution until after the screen has been rendered. By shoving these imports till after all connectedCallbacks have finished, it allows you to load parts of the web component references in in pieces. This gives a much more modular, jpeg-esk brick by brick aproach to loading.

## When
If the item isn't ultra critical (like say a paper-button that the user will be able to tap / ripple) or an off-canvas menu no one can see, don't let it render block the page! This helper class is something you can easily write yourself into any element but we use this pattern a lot and will continue to do so more rapidly because of this.

## Usage
Download / install via yarn/npm
```bash
$ yarn add @lrnwebcomponents/dynamic-importer
# or
$ npm install @lrnwebcomponents/dynamic-importer
```
Inside your web component will look like this. Here's a before and after to illustrate how this works
```js
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { DynamicImporter } from "@lrnwebcomponents/dynamic-importer/dynamic-importer.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js";
class SimpleBlogHeader extends PolymerElement {
...
```
Now the same thing but with dynamic-importer
```js
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { DynamicImporter } from "@lrnwebcomponents/dynamic-importer/dynamic-importer.js";
class SimpleBlogHeader extends DynamicImporter(PolymerElement) {
  /**
   * Dynamically import these late so we can load faster
   */
  dynamicImports() {
    return {
      "site-title":
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js",
      "site-rss-button":
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js"
    };
  }
...
```

## Contributing

1. Fork it! `git clone git@github.com/elmsln/lrnwebcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Code style

Select (and all lrnwebcomponents) use [Prettier][prettier] to auto-format JS and JSON.  The style rules get applied when you commit a change.  If you choose to, you can [integrate your editor][prettier-ed] with Prettier to have the style rules applied on every save.

[prettier]: https://github.com/prettier/prettier/
[prettier-ed]: https://github.com/prettier/prettier/#editor-integration
[polyserve]: https://github.com/Polymer/polyserve
[web-component-tester]: https://github.com/Polymer/web-component-tester

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)