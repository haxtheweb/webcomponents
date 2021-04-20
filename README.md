# lrnwebcomponents
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![LitElement](https://img.shields.io/badge/%3C%2F%3E-LitElement-%230074c1.svg)](https://lit-element.polymer-project.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-f8bc45.svg)](https://github.com/prettier/prettier)

[![Published on npm](https://img.shields.io/npm/v/@lrnwebcomponents/h-a-x?style=flat)](https://www.npmjs.com/search?q=%40lrnwebcomponents)
[![build](https://github.com/elmsln/lrnwebcomponents/workflows/build/badge.svg?branch=master)](https://github.com/elmsln/lrnwebcomponents/actions?query=branch%3Amaster)
[![Dependency Status](https://img.shields.io/david/elmsln/lrnwebcomponents.svg?style=flat)](https://david-dm.org/elmsln/lrnwebcomponents)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/author/elmsln)
[![Slack](https://img.shields.io/badge/chat%20on-slack-7289da.svg)](https://bit.ly/haxslack)
[![Twitter](https://img.shields.io/twitter/follow/haxtheweb.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=haxtheweb)

# Welcome to the lrnwebcomponents project!
ELMS:LN produced web components for any project
## Quick-start

*Notice: You will need to use [Node](https://nodejs.org/en/) version 6.0 or higher. Verify that you have yarn enabled — if not [install yarn globally](https://yarnpkg.com/lang/en/docs/install/). These web components are written in [ES6](http://es6-features.org/) and build routines compile to es5 to encompass legacy browsers.*

### Install

```bash
$ git clone https://github.com/elmsln/lrnwebcomponents.git
$ cd lrnwebcomponents
$ yarn global add @wcfactory/cli
$ yarn global add polymer-cli
$ yarn global add lerna
$ yarn global add web-component-analyzer
$ yarn install
```

## Windows

[Cygwin command line](https://www.cygwin.com/) is lightly tested, but slower than true Bash environment.

### Windows Install

To properly configure git endlines for Windows, run this configuration
```bash
$ git config --global core.autocrlf true
```

```bash
$ git clone https://github.com/elmsln/lrnwebcomponents.git
$ cd lrnwebcomponents
$ yarn global add symlink-dir
$ yarn global add @wcfactory/cli
$ yarn global add polymer-cli
$ yarn global add lerna
$ yarn global add web-component-analyzer
$ yarn install
```


## To work on any element in our repo
```bash
$ cd elements/ELEMENTNAME
$ yarn start
```
Edit files in `lib/`, `src/`, `locales/` and `demo/` in order to modify the element to contribute back to us via PR.
## Scripts

- `$ wcf element`
    -  Create a new component.
    -  Needs to be within the WCFactory (https://github.com/elmsln/WCFactory) to use.
- `$ yarn run rebuild-wcfcache`
    - Rebuild caches as to what web component libraries can be used
- `$ yarn test`
    -  Run tests on ALL lrnwebcomponents.
- `$ yarn run build`
    -  Run build on ALL lrnwebcomponents.
- `$ yarn run storybook`
    - Run storybook
- `$ yarn run build-storybook`
    - Build storybook for deployment
- `$ lerna publish`
    - Publish ALL lrnwebcomponents' elements to npmjs.com

- `$ lerna run build --no-bail`
    - Run `build` command in all projects in the repo, don't bail if there's an issue

## Web Component development

Because this is a monorepo, each web component will need to be independently built in order to actively work on and preview the changes. Every web component has its own Gulp file and Yarn/NPM script.

While still running `yarn start` in one terminal window (which runs the local server), you will need to open another terminal window, drill into the directory of the web component you'd like to work on, and execute the `yarn run dev` command. This command will use gulp tasks to watch the files within that web component directory and will automatically re-run the build command and refresh the browser when you make changes to the web component.

### Working on elements (new-element)
Run `wcf element` to make a new element. Go to the new element following the directions generated at the end of the element's creation. To work on the new-element run `yarn start` from it's directory. If you are pulling in another element to use, run `yarn add projectname --save`.

### Example development on a web component

```bash
$ cd /Sites/lrnwebcomponents
$ yarn start

# SHIFT + CTRL + T to open a new tab in Terminal

$ cd elements your-card  # or any other web component
$ yarn run dev
```

Make a change to the web component and save. The gulpfile will handle transpiling the element down to ES5 and will bring in the HTML and Sass into the template in the web component.

## Test

To test all lrnwebcomponents, run `yarn test` from the root of the repo. If you only want to test the web component you're working on:

```bash
$ cd elements/your-card
$ yarn test
```

Also, if your tests are failing and you want access to a live browser to investigate why, the following flag will keep the browser open.

```bash
$ yarn test -- -p
```

Then open the URL that will be printed in the terminal. It looks something like this: `http://localhost:8081/components/@@lrnwebcomponents/lrnwebcomponents/generated-index.html?cli_browser_id=0`.

## Storybook

We've added [Storybook](https://storybook.js.org/) to lrnwebcomponents as a way to preview our web components as they are being developed. We'll also use Storybook to export a static site that will be the demo site for lrnwebcomponents.

To run storybook

```bash
$ yarn run storybook
```

This will start a web server on port 9001. Navigate in your browser to `http://localhost:9001` to see Storybook in action. Storybook will watch for file changes and reload the browser automatically for you. This is a little slow at the moment, but we'll look into speeding this up.

To export the storybook static site

```bash
$ yarn run build-storybook
```

This places a build of the storybook site in the .storybook_out directory.

### Known Issues with Storybook

For any web component that has a third-party dependency you will need to update the `/.storybook/webpack.config.js` file. You will need to create an alias for your depedency.

For example:

```js
"../../whatwg-fetch/fetch.js": path.join( // this is the third-party dependency in the lrnwebcomponents
  __dirname,
  "../node_modules/whatwg-fetch/fetch.js" // this is where it lives in node_modules
)
```
