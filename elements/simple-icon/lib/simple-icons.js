import { pathResolver, SimpleIconsetStore } from "./simple-iconset.js";
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
    `${pathResolver(import.meta.url)}svgs/${i}/`
  );
});
