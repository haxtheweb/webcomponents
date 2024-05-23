// kittens cry but really really really crude HTML DOM polyfill for nodejs
import "@haxtheweb/utils/lib/nodejs-fake-dom-polyfill.cjs";
// load our wiring class
import * as tmp from 'gulp';
const gulp = tmp.default;
import * as tmp2 from 'gulp-concat-util';
const concat = tmp2.default;
import * as tmp3 from "fs";
const fs = tmp3.default;
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// fake class

class HAXWiring {
  /**
 * Return a haxProperties prototype / example structure
 */
  prototypeHaxProperties = () => {
    // example properties valid for HAX context menu.
    let props = {
      api: "1",
      type: "element",
      editingElement: "core",
      hideDefaultSettings: false,
      canScale: true,

      canEditSource: true,
      contentEditable: false,
      gizmo: {
        title: "Tag name",
        description: "",
        icon: "icons:android",
        color: "purple",
        tags: ["Other"],
        handles: [
          {
            type: "data",
            type_exclusive: false,
            url: "src",
          },
        ],
        meta: {
          author: "auto",
        },
        requiresChildren: false,
        requiresParent: false,
      },
      settings: {
        configure: [
          {
            slot: "",
            title: "Inner content",
            description: "The slotted content that lives inside the tag",
            inputMethod: "textfield",
            icon: "android",
            required: true,
            validationType: "text",
          },
          {
            slot: "button",
            title: "Button content",
            description: "The content that can override the button",
            inputMethod: "textfield",
            icon: "android",
            required: true,
            validationType: "text",
          },
          {
            property: "title",
            title: "Title",
            description: "",
            inputMethod: "textfield",
            icon: "android",
            required: true,
            validationType: "text",
          },
          {
            property: "primaryColor",
            title: "Title",
            description: "",
            inputMethod: "textfield",
            icon: "android",
            required: false,
            validation: ".*",
            validationType: "text",
          },
        ],
        advanced: [
          {
            property: "secondaryColor",
            title: "Secondary color",
            description:
              "An optional secondary color used in certain edge cases.",
            inputMethod: "colorpicker",
            icon: "color",
          },
          {
            property: "endPoint",
            title: "API endpoint",
            description:
              "An optional endpoint to hit and load in more data dymaically.",
            inputMethod: "textfield",
            icon: "android",
            validation: "[a-z0-9]",
            validationType: "url",
          },
        ],
        developer: [],
      },
      saveOptions: {
        wipeSlot: false,
        unsetAttributes: ["end-point", "secondary-color"],
      },
      documentation: {
        howTo: "https://oer.hax.psu.edu/bto108/sites/haxcellence/welcome",
        purpose: "https://oer.hax.psu.edu/bto108/sites/haxcellence/welcome",
      },
      demoSchema: [
        {
          tag: "my-tag",
          content: "<p>inner html</p>",
          properties: {
            endPoint: "https://cdn2.thecatapi.com/images/9j5.jpg",
            primaryColor: "yellow",
            title: "A cat",
          },
        },
      ],
    };
    return props;
  };
}

// merge the web component factory libraries the user has installed 
gulp.task("default", () => {
  return gulp
    .src("../../templates/libraries/**/package.json")
    .pipe(
      concat(".wcflibcache.json", {
        process: function (src, filePath) {
          return src + ",";
        },
      })
    )
    .pipe(concat.header("["))
    .pipe(concat.footer("{}]"))
    .pipe(gulp.dest("./"));
});

// merge the web component factory libraries the user has installed 
gulp.task("haxschema", async () => {
  const hax = new HAXWiring();
  const args = yargs(hideBin(process.argv))
  .command('curl <url>', 'fetch the contents of the URL', () => {}, (argv) => {
    console.info(argv)
  })
  .demandCommand(1)
  .parse();
  const tagName = args.element;
  const ceFileData = fs.readFileSync(`./elements/${tagName}/custom-elements.json`,'utf8', (error, data) => {
    if(error){
       console.warn(error);
       return;
    }
    return data;
  });
  if (ceFileData) {
    let ce = JSON.parse(ceFileData);
    await ce.tags.forEach(async (tag) => {
      if (tag.name === tagName) {
        let props = hax.prototypeHaxProperties();
        props.gizmo.title = tagName.replace('-', ' ');
        props.gizmo.tags = ["Other"];
        props.gizmo.handles = [];
        props.gizmo.meta.author = "HAXTheWeb core team";
        delete props.gizmo.shortcutKey;
        delete props.gizmo.requiresChildren;
        delete props.gizmo.requiresParent;
        props.settings.configure = [];
        props.settings.advanced = [];
        props.documentation = {
          howTo: null,
          purpose: null
        };
        props.saveOptions = {
          unsetAttributes: []
        };
        props.demoSchema = [
          {
            tag: tagName,
            content: "",
            properties: {
            }
          }
        ];
        let propData = [];
        if (tag.properties) {
          propData = tag.properties;
        }
        else if (tag.attributes) {
          propData = tag.attributes;
        }
        // didn't have one, so guess
        if (!tag.path) {
          tag.path = `./elements/${tagName}/${tagName}.js`;
        }
        // loop through and if props are things we can map then do it
        await propData.forEach(async (prop) => {
          if (["t","colors",'_haxState',"elementVisible", "element-visible"].includes(prop.name)) {
            props.saveOptions.unsetAttributes.push(prop.name);
          }
          else {
            let type = "textfield";
            if (prop.type) {
              type = getInputMethodFromType(prop.type);
            }
            else if (prop.description && prop.description.includes("boolean")) {
              type = "boolean";
            }
            else if (prop.description && prop.description.includes("number")) {
              type = "number";
            }
            if (type) {
              let propSchema = {
                property: prop.name,
                title: prop.name,
                description: prop.description || "",
                inputMethod: type,
              };
              if (prop.default !== undefined) {
                props.demoSchema[0].properties[prop.name] = prop.default;
              }
              props.settings.configure.push(propSchema);
            }
          }
        });
        if (!args.write) {
        console.log(`\n\n--------------------------\n${tagName} HAX schema\n--------------------------\n`);
        console.log(JSON.stringify(props, null, 2));
        }
        else if (args.write) {
          fs.writeFileSync(`./elements/${tagName}/lib/${tagName}.haxProperties.json`, JSON.stringify(props, null, 2));
          console.log(`schema written to: ./elements/${tagName}/lib/${tagName}.haxProperties.json`)
        }
        console.log(`\n--------------------------\n Psuedo code to add: ${tag.path}\n--------------------------`);
        console.log(`
  /**
   * Convention we use
   */
  static get tag() {
    return "${tagName}";
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(\`./lib/\${this.tag}.haxProperties.json\`, import.meta.url).href;
  }
  
`);
      }
    });
  } 
  return true;
});

function getInputMethodFromType(type) {
  switch (type) {
    case "string":
      return "textfield";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
  }
  return false;
}