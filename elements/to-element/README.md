# &lt;to-element&gt;

Element
> Replicate any DOM node passed in and turn it into a web component

## Bookmarklet usage
Copy the following into a bookmark

```js
javascript:(function(){window.__haxClickEvent=(e)=>{if(e.target.tagName!=='TO-ELEMENT'){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(!window.__first){alert('You\'ll now be asked to name this element. Make sure the element name has a hypthen in it like "cool-new-things".');window.__first=true;}let name=prompt('Name for this element:','cool-new-thing');if(name){e.target.classList.remove('hax-injected-highlighter');document.getElementById('haxallthethings').downloadNewComponent(e.target,name);}else{document.body.removeEventListener('click',window.__haxClickEvent);document.body.removeEventListener('mouseover',function(e){e.target.classList.add('hax-injected-highlighter');});document.body.removeEventListener('mouseout',function(e){e.target.classList.remove('hax-injected-highlighter');});}}};let link=document.createElement('script');link.type="module";link.src="https://cdn.waxam.io/build/es6/node_modules/@lrnwebcomponents/to-element/to-element.js";document.body.appendChild(link);let toE=document.createElement('to-element');toE.setAttribute('id','haxallthethings');document.body.appendChild(toE);let style=document.createElement('style');style.innerHTML=`.hax-injected-highlighter{outline:4px dotted #34e79a!important;outline-offset:4px!important;}`;document.body.appendChild(style);alert('Welcome to HAX Element creator. To get started, click on the thing you want to make a new element.');document.body.addEventListener('click',window.__haxClickEvent);document.body.addEventListener('mouseover',function(e){e.target.classList.add('hax-injected-highlighter');});document.body.addEventListener('mouseout',function(e){e.target.classList.remove('hax-injected-highlighter');});})();
```

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@lrnwebcomponents/to-element/to-element.js';
/* At top of an application with build routine */
<script type="module" src="@lrnwebcomponents/to-element/to-element.js"></script>
/* Alternatives for top of application */
<script type="module">
  import '@lrnwebcomponents/to-element/to-element.js';
  // imperative form
  import {ToElement} from '@lrnwebcomponents/to-element';
  // if you don't have a build routine and need to reference directly
  import './node_modules/@lrnwebcomponents/to-element/to-element.js';
</script>
// via unpkg CDN (good for testing)
<script type="module" src="https://unpkg.com/@lrnwebcomponents/to-element/to-element.js"></script>
```

## Develop / Demo
Run `yarn start` will start a local development server, open your default browser to display it, open your finder to the correct window and start watching the `/src` directory for changes and automatically rebuilding the element and documentation site for the demo.
```bash
$ yarn start
```

## Test

```bash
$ yarn run test
```

## Build
Builds ensure that wcfactory can correctly compile your web component project to
work on the maximum number of browsers possible.
```bash
$ yarn run build
```

## Contributing

1. Fork it! `git clone https://github.com/elmsln/lrnwebcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Code style

Element (and all lrnwebcomponents) use [Prettier][prettier] to auto-format JS and JSON.  The style rules get applied when you commit a change.  If you choose to, you can [integrate your editor][prettier-ed] with Prettier to have the style rules applied on every save.

[prettier]: https://github.com/prettier/prettier/
[prettier-ed]: https://github.com/prettier/prettier/#editor-integration
[polyserve]: https://github.com/Polymer/polyserve
[web-component-tester]: https://github.com/Polymer/web-component-tester

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)