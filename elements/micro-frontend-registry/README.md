# &lt;micro-frontend-registry&gt;

Frontend
> A singleton for registration and managing access to leverage microservices for web components

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js';
/* At top of an application with build routine */
<script type="module" src="@haxtheweb/micro-frontend-registry/micro-frontend-registry.js"></script>
/* Alternatives for top of application */
<script type="module">
  import '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js';
  // imperative form
  import {MicroFrontendRegistry} from '@haxtheweb/micro-frontend-registry';
  // if you don't have a build routine and need to reference directly
  import './node_modules/@haxtheweb/micro-frontend-registry/micro-frontend-registry.js';
</script>
// via unpkg CDN (good for testing)
<script type="module" src="https://unpkg.com/@haxtheweb/micro-frontend-registry/micro-frontend-registry.js"></script>
```

## Develop / Demo
Run `yarn start` will start a local development server, open your default browser to display it, open your finder to the correct window and start watching the `/src` directory for changes and automatically rebuilding the element and documentation site for the demo.
```bash
yarn start
```

## Test

```bash
yarn run test
```

## Build
Builds ensure that wcfactory can correctly compile your web component project to
work on the maximum number of browsers possible.
```bash
yarn run build
```

## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Code style

Frontend  use [Prettier][prettier] to auto-format JS and JSON.  The style rules get applied when you commit a change.  If you choose to, you can [integrate your editor][prettier-ed] with Prettier to have the style rules applied on every save.

[prettier]: https://github.com/prettier/prettier/
[prettier-ed]: https://github.com/prettier/prettier/#editor-integration
[polyserve]: https://github.com/Polymer/polyserve
[web-component-tester]: https://github.com/Polymer/web-component-tester

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)