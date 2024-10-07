# &lt;hax-body-behaviors&gt;

Body
> Wire any element up to HAX

## Usage
[Video showing how we integrate HAX with elements](https://www.youtube.com/watch?v=P-ZA4CQASpY&index=1&list=PLJQupiji7J5eTqv8JFiW8SZpSeKouZACH)

HAX body behaviors provide a consistent way to rapidly wire Polymer elements up to HAX. While anything can talk to HAX via consistent property and event usage, these body behaviors reduce the time and increase accuracy when trying to wire to HAX (drastically).

The major is in HAX Schema defintion which can be translated to JSON Schema with a single function. This allows for rapidly building out headless "forms" in HAX while the elements themselves just define the JSON blob as to how it should function and what should be wired where. It's more complicated then it sounds.

## Examples
For full documentation just open the `lib/HAXWiring.js` file as it's got a lot of documentation but here's the relevent parts from [example-hax-element](https://github.com/haxtheweb/webcomponents/tree/master/elements/example-hax-element/example-hax-element.js).
```js

import { HAXWiring } from "@haxtheweb/hax-body-behaviors/lib/HAXWiring.js";

class ExampleHaxElement extends HTMLElement {
...
  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Example hax-element",
        description:
          "Provide an example to pick apart of a working HAX element",
        icon: "icons:android",
        color: "green",
        groups: ["Hax"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "You",
          owner: "Your Company"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          },
          {
            property: "available",
            description: "",
            inputMethod: "boolean",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      title: {
        name: "title",
        type: "String",
        value: "My Example"
      },
      available: {
        name: "available",
        type: "Boolean",
        value: ""
      }
    };
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(
      ExampleHaxElement.haxProperties,
      ExampleHaxElement.tag,
      this
    );
  }
...

```

Here's a much more complex example from a Polymer Legacy style element who calls attached when it is fixed to the DOM (`video-player/video-player.js`):
```
  /**
   * Attached.
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Video player",
        description:
          "This can present video in a highly accessible manner regardless of source.",
        icon: "av:play-circle-filled",
        color: "red",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "video",
            source: "source",
            title: "caption",
            caption: "caption",
            description: "caption",
            color: "primaryColor"
          }
        ],
        meta: {
          author: "HAXTheWeb"
        }
      },
      settings: {
        quick: [
          /*{
            'property': 'responsive',
            'title': 'Responsive',
            'description': 'The video automatically fills the available area.',
            'inputMethod': 'boolean',
            'icon': 'image:photo-size-select-small',
          },*/
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color for the player.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark theme",
            description: "Enable dark theme for the player.",
            inputMethod: "boolean",
            icon: "invert-colors"
          }
        ],
        configure: [
          {
            property: "source",
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            property: "track",
            title: "Closed captions",
            description: "The URL for the captions file.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            property: "thumbnailSrc",
            title: "Thumbnail image",
            description: "Optional. The URL for a thumbnail/poster image.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            property: "mediaTitle",
            title: "Title",
            description: "Simple title for under video",
            inputMethod: "textfield",
            icon: "av:video-label",
            required: false,
            validationType: "text"
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color for the player.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark theme",
            description: "Enable dark theme for the player.",
            inputMethod: "boolean",
            icon: "invert-colors"
          }
        ],
        advanced: [
          {
            property: "darkTranscript",
            title: "Dark theme for transcript",
            description: "Enable dark theme for the transcript.",
            inputMethod: "boolean"
          },
          {
            property: "hideTimestamps",
            title: "Hide timestamps",
            description: "Hide the time stamps on the transcript.",
            inputMethod: "boolean"
          },
          {
            property: "preload",
            title: "Preload source(s).",
            description:
              "How the sources should be preloaded, i.e. auto, metadata (default), or none.",
            inputMethod: "select",
            options: {
              preload: "Preload all media",
              metadata: "Preload media metadata only",
              none: "Don't preload anything"
            }
          },
          {
            property: "stickyCorner",
            title: "Sticky Corner",
            description:
              "Set the corner where a video plays when scrolled out of range, or choose none to disable sticky video.",
            inputMethod: "select",
            options: {
              none: "none",
              "top-left": "top-left",
              "top-right": "top-right",
              "bottom-left": "bottom-left",
              "bottom-right": "bottom-right"
            }
          },
          {
            property: "sources",
            title: "Other sources",
            description: "List of other sources",
            inputMethod: "array",
            properties: [
              {
                property: "src",
                title: "Source",
                description: "The URL for this video.",
                inputMethod: "textfield"
              },
              {
                property: "type",
                title: "Type",
                description: "Media type data",
                inputMethod: "select",
                options: {
                  "audio/aac": "acc audio",
                  "audio/flac": "flac audio",
                  "audio/mp3": "mp3 audio",
                  "video/mp4": "mp4 video",
                  "video/mov": "mov video",
                  "audio/ogg": "ogg audio",
                  "video/ogg": "ogg video",
                  "audio/wav": "wav audio",
                  "audio/webm": "webm audio",
                  "video/webm": "webm video"
                }
              }
            ]
          },
          {
            property: "tracks",
            title: "Track list",
            description: "Tracks of different languages of closed captions",
            inputMethod: "array",
            properties: [
              {
                property: "kind",
                title: "Kind",
                description: "Kind of track",
                inputMethod: "select",
                options: {
                  subtitles:
                    "subtitles" /*,
                  Future Features
                  'description': 'description',
                  'thumbnails': 'thumbnails',
                  'interactive': 'interactive',
                  'annotation': 'annotation'*/
                }
              },
              {
                property: "label",
                title: "Label",
                description:
                  'The human-readable name for this track, eg. "English Subtitles"',
                inputMethod: "textfield"
              },
              {
                property: "src",
                title: "Source",
                description: "Source of the track",
                inputMethod: "textfield"
              },
              {
                property: "srclang",
                title:
                  'Two letter, language code, eg. "en" for English, "de" for German, "es" for Spanish, etc.',
                description: "Label",
                inputMethod: "textfield"
              }
            ]
          }
        ]
      }
    };
    this.setHaxProperties(props);
  },
```

## Demo

Run `npm start` will start a local development server, open your default browser to display it, open your finder to the correct window and start watching the `/src` directory for changes and automatically rebuilding the element and documentation site for the demo.

## Contributing

1. Fork it! `git clone git@github.com:haxtheweb/webcomponents.git`
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