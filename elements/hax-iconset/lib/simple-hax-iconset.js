import { pathResolver } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
const basePath = pathResolver(import.meta.url);
var iconSet = {};
const iconNames = [
  "code-json",
  "remix",
  "arrow-expand-left"
];
iconNames.forEach(name => {
  iconSet[name] = `${basePath}svgs/${name}.svg`;
});
window.SimpleIconset.requestAvailability().registerIconset("hax", iconSet);