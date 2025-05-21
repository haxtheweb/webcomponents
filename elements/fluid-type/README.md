# &lt;fluid-type&gt;

Type
> A simple fluid-type sizing wrapper element to apply to anything
> A web component implementation of this article https://andy-bell.design/wrote/custom-property-controlled-fluid-type-sizing/

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

### JS module
```js
/* In an existing JS module / web component */
import '@haxtheweb/fluid-type/fluid-type.js';
/* At top of an application with build routine */

<script type="module">
  import '@haxtheweb/fluid-type/fluid-type.js';
  
  
</script>

<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/fluid-type/fluid-type.js"></script>
```
### HTML / CSS
```html
<style>
  fluid-type {
    --fluid-type-min-size: 2;
    --fluid-type-max-size: 5;
  }  
</style>
<fluid-type><h1>This is fluid-type</h1></fluid-type>
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

Type

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)