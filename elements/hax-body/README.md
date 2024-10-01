# &lt;hax-body&gt;

# HAX
Headless Authoring eXperience or HAX for short, is a new way of authoring content that works across platforms. Written in webcomponents, HAX allows users to effectively write HTML by touching the interface directly. Think WYSIWYG if it was built with modern and future proof tools and libraries instead of based on the work of the early 2000s.

HAX can be integrated into any solution as it's depending on a headless backend in order to integrate. It also has the ability to allow end users to use and insert complex custom elements, presenting an input form based on JSONSchema that's emmitted from the custom element upon registration. HAX is for stitching together your universe of content and media solutions into a remote control for your authors.

There's lots of documentation in this file and examples of integrations and you can see lots of video based tutorials in this playlist: https://www.youtube.com/watch?v=kLrKMhz8-JY&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH

## Notable video examples / tutorials for building
- Integrating HAX with NASA media search - https://www.youtube.com/watch?v=Sza6mmt-D0U&index=2&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH
- Integrating HAX with Kaltura search - https://www.youtube.com/watch?v=kLrKMhz8-JY&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH
- Wiring an `audio-player` webcomponent up to HAX - https://www.youtube.com/watch?v=ZQ7JGvlevQM&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH&index=3
- Wiring HAX into an existing element (much more detailed) - https://www.youtube.com/watch?v=d2CFA-pKzaY&index=4&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH

### Deeper developer dive into how HAX works
- initial deep dive - https://www.youtube.com/watch?v=eGV1XWzUko8&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH&index=10
- State management and pluggability - https://www.youtube.com/watch?v=Pehb3s5JBTw&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH&index=1
- HAX Element Schema - https://github.com/haxtheweb/webcomponents/blob/master/elements/hax-body-behaviors/lib/HAXWiring.js
- HAX App Schema - https://github.com/haxtheweb/webcomponents/blob/master/elements/hax-body/lib/hax-app.js#L14

An application that uses HAX is made up of several custom elements working together. Some of the primary elements to make this happen are:
```
<hax-body>
<hax-panel>
<hax-manager>
<hax-source>
<hax-autoloader>
<hax-store>
```

These elements all live at the "app level" that you will create in order to utilize these tags. They are separate so that you can swap them out or fork individual ones as you desire.

## Systems that integrate with HAX
- ELMS:LN - https://github.com/elmsln/elmsln
- Drupal (6, 7, 8) - https://www.drupal.org/project/hax
  + Drupal 7 via Champion distro - https://www.youtube.com/watch?v=ifIg7FiXYCc&index=8&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH
  + Drupal 6 - https://www.youtube.com/watch?v=ojlF3YxqXTo&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH&index=6
- Backdrop - https://backdropcms.org/project/hax
  + Video of install / integration - https://www.youtube.com/watch?v=yCOOnA7VWPo&index=7&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH
- GravCMS - https://github.com/elmsln/grav-plugin-hax
  + Integration and showcase - https://www.youtube.com/watch?v=Z2chE4DuJf8&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH&index=5
- Your system! (see next step)

## Can I build my own elements for HAX?
YES! HAX's "gizmo" and "app store" systems are 100% pluggable. The app store concept has it's own API for creation which can best be modeled by looking at the example appstore.json from the demo (all the CMSs that integrate with HAX also can serve up this store data). [See example here](https://github.com/haxtheweb/webcomponents/blob/master/elements/hax-body/demo/appstore.json#L61-L124).

### What about Gizmo's tho...
Gizmo's are just a silly word for Custom Elements (so we don't use that word over and over again). To make a Gizmo you just make a custom element. The HAX playlist has tons of examples of doing this across the many elements we demonstrate in the demo. To build your own it's probably best to see the integration in one of those videos or you can read the integration specification from [hax-body-behaviors](https://github.com/haxtheweb/webcomponents/blob/master/elements/hax-body-behaviors/lib/HAXWiring.js). HAX can talk to anything and your implementation of HAX can specify exactly the custom tags you want it to understand.

For all full "hello-world" style hAX element, see the [example-hax-element](https://github.com/haxtheweb/webcomponents/blob/master/elements/example-hax-element/example-hax-element.js) (the source of this is in its src directory).

### What do I need to integrate with hax?
HAX is designed to integrate with any system by being about authoring HTML that any end user could have hit "view source" and done themselves. It manipulates the DOM in a targetted area and then bubbles up what the change was without all the HAX cruft attached. If you want to get more integrations listed above, here's what the system needs:
- HTML blob storage - It has to store data as a block of HTML. If it has a CKEditor or TinyMCE input method currently then it probably does this already.
- ability to render webcomponents - hax is built on webcomponents so your system has to be able to load them with somelike like the following:
```js
/* In an existing module / web component */
import '@haxtheweb/hax-body/hax-body.js';



```
- end point / API location to save the data (if building your own HAX integration not the cms or wysiwyg option)
- optional: place to save uploaded files (though you'll probably want this)
- Some end point (or a static file) that supplies the appstore spec shown above
If you think you can use HAX, try one of the methods below of integration. HAX is a pretty deep dive into Polymer / Webcomponents so these areas might be good starting points and then working down from there if you find it useful.

#### Drop in integrations
- Working on a desktop or mobile app? Use the `app-editor-hax` tag - https://github.com/haxtheweb/app-editor-hax
- Faster HAX integration into a CMS setting. Use the `cms-hax` tag - https://github.com/haxtheweb/cms-hax
- Want CKEditor style replacement (integration wise). Use `wysiwyg-hax` tag - https://github.com/haxtheweb/wysiwyg-hax

### Why the difference in integration methodologies?
`hax-body` is a collection of tags for building your own HAX editor. You don't like our `hax-panel` tag? Well, if you implement the registration function for your own `much-better-hax-panel` tag then it'll act like it's part of HAX. This isn't for everyone though so we have some simplified integrations that are much less flexible (they define and implement the standard tags of hax). ELMS:LN for example implements `hax-body` and associated tags directly but the other integrations listed utilize `cms-hax`. For a complex example integrating with the tags directly into an existing application, check out
[LRNApp Book](https://github.com/haxtheweb/webcomponents/blob/master/elements/lrnapp-book/lrnapp-book.js).

## Definitions
- *HAX* - Headless Authoring eXperience or HAX, will always and must always be system agnostic. It needs to be able to interface with HTML primatives as well as custom-element tags which provide a haxProperties object to the specification of a haxElement.
- *HAX Element* - a sanitized simple object representation of a DOM node. HAX Elements can be translated into full DOM nodes easily because they express tag, properties and content. The element also allows for easy manipulation of an item prior to it ever existing in the DOM. Here's an example of a HAX Element to illustrate (using video-player as an example).
```
{
    "tag": "video-player",
    "properties": {
        "source": "https://www.youtube.com/watch?v=bzH4seWf8rQ"
        "responsive": false
    },
    "content": ""
}
```
- [JSON schema](http://json-schema.org/) - is a way of expressing the validation and input of properties in a JSON object, using a JSON object to express it (yeah.. I know..). What this affords us is a way of automatically generating form fields to modify the custom element fields that have been defined in the haxProperties object. This relationship can be seen in the hax-preview element which will map haxProperties to JSON Schema in order to generate an input form for the element. `simple-fields` is providing all form capabilities to interface with the schema.
- *haxProperties* - an object that lives on a HAX capable element, expressing the way to build forms in HAX to modify it's options. This object expresses a default HAX Element, some minor booleans for UI areas, and the `settings` object which defines the field / property mapping for the `quick`, `configure` and `advanced` forms.
  - quick settings - these appear on the bar in place when an element has focus in hax-body
  - configure settings - these appear on the hax-preview form by default. Think of these as your primary means of modifying this "content type" so to speak, if the custom element were a unique piece of content to the system
  - advanced settings - things outside the norm as well as the "source view" if that boolean has been set
- *Gizmo* - A gizmo is a custom element placed in the page that provides advanced functionality. This could be a calendar widget, or a video-player, or really anything beyond a primative. This is effectively our silly name we use to communicate to end users adding something cool.
- *Block* - A layout / grid piece that has multiple components inside of it, positioned based on the structure of the container is known as a Block (written as -blox in the code). Blox are different configurations of the `grid-plate` tag with HTML primatives and other custom elements inside. They are moved around as one full piece.
- *Stack* - A stack (-stax) is a series of hax-blox, HTML primatives, and custom elements. Think of it like a "template" in other systems. It's just stamping down a series of things which can then be modified on their own. It's meant to be forked and not maintained after stamping. An example could be a standard page layout with an image justified to the right and broken out into three paragraphs.

## element scope / definitions
- `<hax-body-behaviors>` - any element that wants to be wired to HAX (in the polymer universe) should use hax-body-behaviors in order to provide consistency of property names, functions and utility functions.
- `<hax-body>` - the body area that all of the magic happens within. This is the thing providing the content for manipulation and injection of things.
  - `<hax-blox>` - a layout element that can help group the elements with in it
  - `<hax-ce-context>` - figures out the options for a custom element by reading off of the haxProperties object on the custom element.
    - `<hax-input-mixer>` - handles the data binding / form element type for an in-place change. This helps the "quick" options actually have an authoring UI
  - `<hax-iframe-context>` - quick context menu for the iframe primative
  - `<hax-image-context>` - quick context menu for the img primative
  - `<hax-text-context>` - quick context menu for anything that is valid yet doesn't have a dedicated menu. This would be things like p, blockquote, code, h[1-6].
  - `<hax-plate-context>` - a grid-plate editor which allow for cloning the item, moving it up or down in the hax-body DOM or deleting the element from the body
  - `<hax-context-item>` - an icon button for any hax-*-context menus which emmits normalized events and provides display consistency
  - `<hax-context-item-textop>` - same as hax-context-item but this is specific to text-based operations. If the event needs to maintain focus on the element's contenteditable area in order to work (like injecting a bulleted list) then this button helps ensure that happens. It works in all the same ways otherwise.
  - `<hax-context-item-menu>` - providing a consistent drop-down menu in place
- `<hax-panel>` - side panel of options to pick from as a form of quick inserting and selection of HAX Elements that get inserted into hax-body.
  - `<hax-panel-item>` - an item that lives in hax-panel and helps provide visual consistency as well as normalized event bubbling
- `<hax-manager>` - modal that's doing the bulk of the work of finding and configuring an element before it is placed on the page
  - `<hax-source-browser>` - a listing of all hax-sources in a "app store" type display
    - `<hax-source-browser-item>` - an item in this listing, generated based on reading off the information provided by hax-source
  - `<hax-gizmo-browser>` - a listing of all gizmos in a "app store" type display for presenting and managing searching for gizmos the end user can add to the body of content.
    - `<hax-gizmo-browser-item>` - an item in this listing, generated based on reading off the information provided by custom elements implementing haxProperties.
  - `<hax-preview>` - the "configure" screen of hax-manager which shows an interactive preview of what your working on and tweaking
- `<hax-source>` - an end point that has a listing of items (like videos) which also expresses
- `<hax-store>` - a state management object store as well as brain for what elements and sources are available to this HAX application. For example, if you place a `<video-player>` tag inside the `<hax-store>` element on the page, it will realize that video-player is a valid element, import it's definition at run-time (lazy load) as well as start to build up HAX defintion of what elements are available in the `<slot>`. It also provides global transformation methods for things like HaxPropertiesToJSONSchema and HAXElementToNode. This is the brain helping everyone else have to do less.

## Interaction flow
User clicks an edit button of some kind to enable HAX by placing hax-body into edit-mode (property). The user then can either click on elements currently in hax-body or to add new elements, click in hax-panel. As hax-body is pretty self contained, we won't express what's going on there but you can see how the different context menus place themselves correctly on active element and maintain wiring between the element and form properties.

### hax-body to hax-manager flow
The only meaningful interaction between hax-body and app level elements is that if `<hax-ce-context>` is being displayed for a custom element and the user clicks the settings button, it will open the `<hax-manager>` tag to the `<hax-preview>` element and open to the configure page. If the user hits update it'll update the selected item in the DOM with their modifications.

### Adding new things via hax-panel
User clicks on an item in `<hax-panel>` to add something to the interface, event bubbles up for `hax-item-selected` event which the app notices. The app can then tell `<hax-body>` to insert a simple HAX Element if it's an HTML primative (p, h2, blockquote, hr sorta thing) OR, if it's a call for a Gizmo and then it invokes `<hax-manager>` to open after resetting it to it's default state.

The user then selects if they want to Add material or Browse sources of gizmos. Browsing pulls up the `<hax-source-browser>` which provides a searchable list of sources in an "App store" style format. "Search Gizmos".

If an gizmo source is selected (we'll say Youtube). It opens a collased area which has search / filter capabilities for that source. The user searches for something, and then clicks on the thing they want to make. Now, the interaction transitions to hax-preview but let's detour quickly and talk about what happened there.

`<hax-source>` said "I have a HAX element" and bubbles up a hax-source-selected event to the app. The app saw the event and handled it (so it can do custom stuff if needed) and then told `<hax-manager>` "hey, here's your active thing" which then shifts it forward to the configure step of the operation. As part of this, it will then pass in an element in HAX Element format which `<hax-preview>` will unpack into the real thing.

### hax-preview
This is our form / modification area. hax-preview takes a HAX Element, reads off it's haxProperties object, and then converts it into JSON Schema to generate a form for editing via `<simple-fields>`. Preview then converts the HAX Element into a DOM node to render a preview and data binds it to the form. Now as the user edits fields in the form, it'll update the preview.

Once the user likes what they see, they hit embed and it'll convert the preview DOM node into a HAX Element and bubble up an event to insert it into `<hax-body>` via the app. At this point, `<hax-manager>` is triggered to close and we've effectively gone end to end.

## Saving
There's a function on `<hax-body>` called `haxToContent` which will strip all the hax specific tags and meta-data off of the DOM nodes in `<hax-body>`'s `<slot>` area and then returns the raw HTML.

And we've done it! Now we can ship this off to a back-end to do whatever we need to in order to save this.


## Develop / Demo
Run `npm start` will start a local development server, open your default browser to display it, open your finder to the correct window and start watching the `/src` directory for changes and automatically rebuilding the element and documentation site for the demo.
```bash
$ npm start
```


## Contributing

1. Fork it! `git clone git@github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Code style

Body  use [Prettier][prettier] to auto-format JS and JSON.  The style rules get applied when you commit a change.  If you choose to, you can [integrate your editor][prettier-ed] with Prettier to have the style rules applied on every save.

[prettier]: https://github.com/prettier/prettier/
[prettier-ed]: https://github.com/prettier/prettier/#editor-integration
[polyserve]: https://github.com/Polymer/polyserve
[web-component-tester]: https://github.com/Polymer/web-component-tester

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)