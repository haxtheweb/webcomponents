import { SimpleIconsetStore } from "./simple-iconset.js";
import "./simple-iconset-manifest.js";
const here = new URL("./simple-icons.js", import.meta.url).href + "/../";
[
  "av",
  "communication",
  "device",
  "editor",
  "elmsln-custom",
  "hardware",
  "icons",
  "image",
  "maps",
  "notification",
  "places",
  "social",
  "loading",
].forEach((i) => {
  SimpleIconsetStore.registerIconset(i, `${here}svgs/${i}/`);
});
// flags too but they come from elsewhere
// ISO 3166-1-alpha-2 Flags
// via https://flagicons.lipis.dev/
SimpleIconsetStore.registerIconset(
  "flags",
  `${here}../../../flag-icon-css/flags/4x3/`
);
// square flag less common but needed ratio
SimpleIconsetStore.registerIconset(
  "flags1x1",
  `${here}../../../flag-icon-css/flags/1x1/`
);
