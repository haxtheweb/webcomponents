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
        howTo: "https://haxtheweb.org/welcome",
        purpose: "https://haxtheweb.org/welcome",
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

// HAX BUILD ROUTINE FOR CLEANING UP ASSETS AFTER BUILD

import * as tmp4 from "gulp-terser";
const terser = tmp4.default;
import * as tmp5 from "glob";
const glob = tmp5.default;
import * as tmp6 from "path";
const path = tmp6.default;

import packageVm from "./node_modules/@haxtheweb/haxcms-elements/package.json" with { type: "json" };
// mirror version numbers
gulp.task(
  "version-match", async () => {
    fs.writeFileSync('./VERSION.txt', packageVm.version , {encoding:'utf8',flag:'w'});
    console.log(`${packageVm.version} written to VERSION.txt`);
  }
);
gulp.task(
  "terser", () => {
    // now work on all the other files
    return gulp.src([
      './build/es6/**/*.js'
    ]).pipe(terser({
        ecma: 2018,
        keep_fnames: true,
        mangle: true,
        module: true,
      }))
      .pipe(gulp.dest('./build/es6/'));
  }
);
// https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name
const reservedNames = new Set([
	'annotation-xml',
	'color-profile',
	'font-face',
	'font-face-src',
	'font-face-uri',
	'font-face-format',
	'font-face-name',
	'missing-glyph'
]);

function hasError(name) {
	if (!name) {
		return 'Missing element name.';
	}

	if (/[A-Z]/.test(name)) {
		return 'Custom element names must not contain uppercase ASCII characters.';
	}

	if (!name.includes('-')) {
		return 'Custom element names must contain a hyphen. Example: unicorn-cake';
	}

	if (/^\d/i.test(name)) {
		return 'Custom element names must not start with a digit.';
	}

	if (/^-/i.test(name)) {
		return 'Custom element names must not start with a hyphen.';
	}

	if (reservedNames.has(name)) {
		return 'The supplied element name is reserved and can\'t be used.\nSee: https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name';
	}
}

function validateElementName(name) {
	const errorMessage = hasError(name);
	return !errorMessage;
}
gulp.task("wc-autoloader", async () => {
  glob(path.join("./build/es6/node_modules/**/*.js"), (er, files) => {
    let elements = {};
    // async loop over files
    files.forEach((file) => {
      // grab the name of the file
      if (fs.existsSync(file)) {
        let fLocation = file.replace("build/es6/node_modules/", "");
        const contents = fs.readFileSync(file, "utf8");
        // This Regex is looking for tags that are defined by string values
        // this will work for customElements.define("local-time",s))
        // This will NOT work for customElements.define(LocalTime.tagName,s))
        const defineStatements = /customElements\.define\(["'`](.*?)["'`]/gm.exec(
          contents
        );
        // basic
        if (defineStatements && validateElementName(defineStatements[1])) {
          elements[defineStatements[1]] = fLocation;
        }
        // .tag calls
        else {
          const hasDefine = /customElements\.define\((.*?),(.*?)\)/gm.exec(
            contents
          );
          // check for a define still
          if (hasDefine && hasDefine[1] && hasDefine[1].includes('.tag')) {
            const tagStatements = /static get tag\(\){return"(.*?)"}/gm.exec(
              contents
            );
            if (tagStatements && validateElementName(tagStatements[1])) {
              elements[tagStatements[1]] = fLocation;
            }
          }
          else if (hasDefine && hasDefine[1] && hasDefine[1].includes('.is')) {
            const tagStatements = /static get is\(\){return"(.*?)"}/gm.exec(
              contents
            );
            if (tagStatements && validateElementName(tagStatements[1])) {
              elements[tagStatements[1]] = fLocation;
            }
          }
          else {
            if (!hasDefine) {
              // support for polymer legacy class housing
              const PolymerLegacy = /is\:\"(.*?)\"/gm.exec(
                contents
              );
              if (PolymerLegacy && PolymerLegacy[1] && validateElementName(PolymerLegacy[1])) {
                elements[PolymerLegacy[1]] = fLocation;
              }
              else {
                // if we got here, it wasn't a file w/ a custom element definition
                // so it's not an entry point
              }
            }
          }
        }
      }
    });

    // write entries to file
    fs.writeFileSync(
      "./wc-registry.json",
      JSON.stringify(elements),
      {encoding:'utf8',flag:'w'}
    );
    // write entries to demo for local work
    fs.writeFileSync(
      "./dist/wc-registry.json",
      JSON.stringify(elements),
      {encoding:'utf8',flag:'w'}
    );
    // write entries to demo for local work
    fs.writeFileSync(
      "./elements/haxcms-elements/demo/wc-registry.json",
      JSON.stringify(elements),
      {encoding:'utf8',flag:'w'}
    );
  });
});

import { execSync } from 'child_process';

gulp.task("theme-discovery", async () => {
  try {
    execSync('node scripts/theme-discovery.js', { stdio: 'inherit' });
    console.log('✅ Theme discovery completed successfully');
  } catch (error) {
    console.error('❌ Theme discovery failed:', error.message);
  }
});

gulp.task("hax-elements-discovery", async () => {
  try {
    execSync('node scripts/hax-elements-discovery.js', { stdio: 'inherit' });
    console.log('✅ HAX elements discovery completed successfully');
  } catch (error) {
    console.error('❌ HAX elements discovery failed:', error.message);
  }
});
