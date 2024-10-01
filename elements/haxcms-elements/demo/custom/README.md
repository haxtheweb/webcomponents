# HAXcms Custom development

This tooling / section of your site allows you make customizations without having to redo 
the entire build process that HAXcms puts in place. Use it to make a custom theme for a single site 
or to add new elements into scope of HAXcms to use in pages.

## Usage

1. After creating a new site, go into `_sites/MYSITE/custom` and run `yarn install`.
2. Now run `npm start` to begin watching the src directory for changes
3. Edit the `src/custom.js` as you would any web component / ESM compliant code.
4. Open a web browser to `http://HAXCMS/_sites/MYSITE` and see changes as you work on them

You'll need to refresh the browser to see the changes reflected but you should be able to
work on your HAXcms theme / customizations in a way similar to other web component development
best practices. A watch is happening that will automatically build it for ES6 / Chrome based testing.

## Building to ship

To build to ship to all browsers that HAXcms supports, run `yarn run build`. Now you're good to go!