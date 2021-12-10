import { SimpleIconsetStore } from "./simple-iconset.js";
import { SimpleIconIconsetsManifest } from "./simple-iconset-manifest.js";
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
  SimpleIconsetStore.registerIconset(
    i,
    `${new URL("./", import.meta.url).href}svgs/${i}/`
  );
});
// flags too but they come from elsewhere
// ISO 3166-1-alpha-2 Flags
// via https://flagicons.lipis.dev/
SimpleIconsetStore.registerIconset(
  "flags",
  `${new URL("../../../flag-icon-css/flags/4x3", import.meta.url).href}/`
);
// square flag less common but needed ratio
SimpleIconsetStore.registerIconset(
  "flags1x1",
  `${new URL("../../../flag-icon-css/flags/1x1", import.meta.url).href}/`
);
