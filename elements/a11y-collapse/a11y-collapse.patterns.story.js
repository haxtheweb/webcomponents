import { storiesOf } from "@storybook/polymer";
import * as storybookBridge from "@storybook/addon-knobs/polymer";

/**
 * Cleans the template html
 * @param {string} the demo html for the story
 * @param {array} array of regular expressions and replacements
 * @returns {string} the cleaned demo html for the story
 */
let cleanHTML = (template, replacements = []) => {
  // need to account for polymer goofiness when webpack rolls this up
  let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
  //let demo = storiesOf("Pattern Library/Molecules/Media", module);
  var array_matches = pattern.exec(template);
  // now template is just the body contents
  template = array_matches[1];
  replacements.forEach((find, replace) => {
    template = template.replace(new RegExp(find, "g"), replace);
  });

  template = template.replace(/=\\"\\"/g, "").replace(/\\"/g, '"');
  return template;
},
/**
 * Creates a pattern library version based on demos
 * @param {object} story object with the following: ```
 {
  "of": "Pattern Library/Molecules/Media",          //the path in the pattern library
  "page": 'GIF',                                    //the UI pattern name
  "file": require("raw-loader!./demo/index.html")   //the file to use as a template
}
 ```
 * @returns {object} the pattern library version
 */
addPattern = story => {
  let patternLib = storiesOf(story.of, module), template = cleanHTML(story.file);
  patternLib.add(story.pattern, () => { return `${template}`; });
  return patternLib;
};

//add the patterns
addPattern({
  "of": "Pattern Library/Molecules/Layout", 
  "pattern": 'Accordion',
  "file": require("raw-loader!./demo/accordion.html")
});

addPattern({
  "of": "Pattern Library/Molecules/Layout", 
  "pattern": 'Collapse',
  "file": require("raw-loader!./demo/index.html")
});