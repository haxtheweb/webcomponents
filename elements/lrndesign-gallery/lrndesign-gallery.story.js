import { LrndesignGallery } from "./lrndesign-gallery.js";
import { LrndesignGalleryBehaviors } from "./lib/lrndesign-gallery-behaviors.js";
import { LrndesignGalleryCarousel } from "./lib/lrndesign-gallery-carousel.js";
import { LrndesignGalleryGrid } from "./lib/lrndesign-gallery-grid.js";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import apple from "./demo/images/apple.jpg";
import atari from "./demo/images/atari.jpg";
import banana from "./demo/images/banana.jpg";
import bird from "./demo/images/bird.jpg";
import carrot from "./demo/images/carrot.jpeg";
import cat from "./demo/images/cat.jpeg";
import dice from "./demo/images/dice.jpg";
import dog from "./demo/images/dog.jpg";
import fish from "./demo/images/fish.jpg";
import nintendo from "./demo/images/nintendo.png";
import ps4 from "./demo/images/ps4.jpg";
import sega from "./demo/images/sega.jpg";
import xbox from "./demo/images/xbox.png";
import appleThumb from "./demo/images/thumbnails/apple.jpg";
import atariThumb from "./demo/images/thumbnails/atari.jpg";
import bananaThumb from "./demo/images/thumbnails/banana.jpg";
import birdThumb from "./demo/images/thumbnails/bird.jpg";
import carrotThumb from "./demo/images/thumbnails/carrot.jpeg";
import catThumb from "./demo/images/thumbnails/cat.jpeg";
import diceThumb from "./demo/images/thumbnails/dice.jpg";
import dogThumb from "./demo/images/thumbnails/dog.jpg";
import fishThumb from "./demo/images/thumbnails/fish.jpg";
import nintendoThumb from "./demo/images/thumbnails/nintendo.png";
import ps4Thumb from "./demo/images/thumbnails/ps4.jpg";
import segaThumb from "./demo/images/thumbnails/sega.jpg";
import xboxThumb from "./demo/images/thumbnails/xbox.png";
import birdLarge from "./demo/images/thumbnails/large/bird.jpg";
import catLarge from "./demo/images/thumbnails/large/cat.jpeg";
import dogLarge from "./demo/images/thumbnails/large/dog.jpg";
import fishLarge from "./demo/images/thumbnails/large/fish.jpg";

window.StorybookUtilities.requestAvailability();
/**
 * add to the pattern library
 */
const replacements = [
  {"find": "\.\/images\/apple.jpg", "replace": apple },
  {"find": "\.\/images\/atari.jpg", "replace": atari },
  {"find": "\.\/images\/bird.jpg", "replace": bird },
  {"find": "\.\/images\/banana.jpg", "replace": banana },
  {"find": "\.\/images\/carrot.jpeg", "replace": carrot },
  {"find": "\.\/images\/cat.jpeg", "replace": cat },
  {"find": "\.\/images\/dice.jpg", "replace": dice },
  {"find": "\.\/images\/dog.jpg", "replace": dog },
  {"find": "\.\/images\/fish.jpg", "replace": fish },
  {"find": "\.\/images\/nintendo.png", "replace": nintendo },
  {"find": "\.\/images\/sega.jpg", "replace": sega },
  {"find": "\.\/images\/xbox.png", "replace": xbox },
  {"find": "\.\/images\/thumbnails\/apple.jpg", "replace": appleThumb },
  {"find": "\.\/images\/thumbnails\/atari.jpg", "replace": atariThumb },
  {"find": "\.\/images\/thumbnails\/banana.jpg", "replace": bananaThumb },
  {"find": "\.\/images\/thumbnails\/bird.jpg", "replace": birdThumb },
  {"find": "\.\/images\/thumbnails\/carrot.jpeg", "replace": carrotThumb },
  {"find": "\.\/images\/thumbnails\/cat.jpeg", "replace": catThumb },
  {"find": "\.\/images\/thumbnails\/dice.jpg", "replace": diceThumb },
  {"find": "\.\/images\/thumbnails\/dog.jpg", "replace": dogThumb },
  {"find": "\.\/images\/thumbnails\/fish.jpg", "replace": fishThumb },
  {"find": "\.\/images\/thumbnails\/nintendo.png", "replace": nintendoThumb },
  {"find": "\.\/images\/thumbnails\/sega.jpg", "replace": segaThumb },
  {"find": "\.\/images\/thumbnails\/xbox.png", "replace": xboxThumb },
  {"find": "\.\/images\/thumbnails\/large\/bird.jpg", "replace": birdLarge },
  {"find": "\.\/images\/thumbnails\/large\/cat.jpeg", "replace": catLarge },
  {"find": "\.\/images\/thumbnails\/large\/dog.jpg", "replace": dogLarge },
  {"find": "\.\/images\/thumbnails\/large\/fish.jpg", "replace": fishLarge }
];
const LrndesignGalleryPattern = {
  "of": "Pattern Library/Molecules/Layout", 
  "name": 'Carousel',
  "file": require("raw-loader!./demo/index.html"),
  "replacements": replacements
}
window.StorybookUtilities.instance.addPattern(LrndesignGalleryPattern);
/**
 * add to the pattern library
 */
const LrndesignGalleryGridPattern = {
  "of": "Pattern Library/Molecules/Layout", 
  "name": 'Thumbnail Grid',
  "file": require("raw-loader!./demo/grid.html"),
  "replacements": replacements
}
window.StorybookUtilities.instance.addPattern(LrndesignGalleryGridPattern);

/**
 * add the live demo
 */
let props = Object.assign(
  window.StorybookUtilities.instance.getSimpleColors("light-blue"), 
  LrndesignGalleryBehaviors.properties,
  LrndesignGalleryCarousel.properties,
  LrndesignGalleryGrid.properties
);
props.title.value = `My New Gallery`;
props.sizing.type = "select";
props.sizing.options = ["cover","contain"];
props.sizing.value = "cover";

delete props.responsiveSize;
delete props.selected;
props.sources.type= "Object";
props.sources.value = [
  { 
    "alt": `A picture of a cat`, 
    "details": `This is a <em>cat</em> picture that is in <strong>landscape</strong>.`, 
    "id": `cat`, 
    "src": cat, 
    "large": catLarge, 
    "thumbnail": catThumb, 
    "title": `Cat`
  }, { 
    "alt": `A picture of a dog`, 
    "details": `This is a <em>dog</em> picture that is in <strong>portrait</strong>.`, 
    "id": `dog`, 
    "sizing": `contain`, 
    "src": dog, 
    "large": dogLarge, 
    "thumbnail": dogThumb, 
    "title": `Dog` 
  }, { 
    "alt": `A picture of a bird`, 
    "details": `This is a <em>bird</em> picture that is almost a <strong>square</strong>.`, 
    "id": `bird`, 
    "src": bird,
    "large": birdLarge,  
    "thumbnail": birdThumb, 
    "title": `Bird`
  }, { 
    "alt": `A picture of fish`, 
    "details": `This is a <em>fish</em> picture in <strong>landscape</strong> orientation.`, 
    "id": `fish`, 
    "src": fish, 
    "large": fishLarge, 
    "thumbnail": fishThumb, 
    "title": `Fish`
  }
];
const LrndesignGalleryStory = {
  "of": "lrndesign-gallery",
  "name": "lrndesign-gallery",
  "props": props,
  "slots": {
    "description": { 
      "name": "description", 
      "type": "String", 
      "value": `<p>Take a look at some of these animals.</p>`
    }
  }, 
  "attr": ``,
  "slotted": ``
};
window.StorybookUtilities.instance.addLiveDemo(LrndesignGalleryStory);